/**
 * Resend HTTP client for Supabase Edge Functions (Deno runtime).
 *
 * Uses native fetch — no Node.js SDK dependency.
 * Timeout: 4 seconds (Auth Hooks must complete within 5s — no Supabase retry).
 *
 * Sender address is read from RESEND_FROM env var, not from the caller.
 *
 * SECURITY:
 * - RESEND_API_KEY and RESEND_FROM read from Deno.env only, never from payload.
 * - Response body is not logged — may contain delivery metadata.
 * - Recipient email address is not logged on failure.
 * - Idempotency-Key must be provided by the caller — never generated here.
 * - AbortController timeout is always cleared in finally.
 * - data.id must be a non-empty string to consider the delivery accepted.
 */

const RESEND_API_URL = "https://api.resend.com/emails";

export interface SendEmailParams {
  /** Recipient email address. Never logged on error. */
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Must be between 1 and 256 characters. */
  idempotencyKey: string;
  tags?: Array<{ name: string; value: string }>;
  /** Optional shared AbortSignal (e.g. for parallel email_change sends). */
  signal?: AbortSignal;
}

export interface SendEmailResult {
  id: string;
}

export class ResendError extends Error {
  /** HTTP status to propagate in the hook response. */
  readonly hookStatus: number;

  constructor(message: string, hookStatus: number) {
    super(message);
    this.name = "ResendError";
    this.hookStatus = hookStatus;
  }
}

/**
 * Validates and returns the RESEND_FROM sender address from env.
 * Throws ResendError (500) if missing or obviously invalid.
 * Must contain @ to indicate a valid email address.
 */
function validateFrom(): string {
  const from = Deno.env.get("RESEND_FROM");
  if (!from || from.length === 0) {
    throw new ResendError("RESEND_FROM is not configured", 500);
  }
  if (from.length > 998) {
    throw new ResendError("RESEND_FROM exceeds maximum allowed length", 500);
  }
  if (!from.includes("@")) {
    throw new ResendError(
      "RESEND_FROM does not appear to contain a valid email address",
      500,
    );
  }
  return from;
}

export async function sendEmail(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    throw new ResendError("RESEND_API_KEY is not configured", 500);
  }

  const from = validateFrom();

  // Use caller-provided signal or create a local 4s timeout.
  // The timeout is always cleared in finally regardless of outcome.
  let ownController: AbortController | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const signal = params.signal ?? (() => {
    ownController = new AbortController();
    timeoutId = setTimeout(() => ownController!.abort(), 4000);
    return ownController.signal;
  })();

  const body: Record<string, unknown> = {
    from,
    to: [params.to],
    subject: params.subject,
    html: params.html,
    text: params.text,
  };
  if (params.tags && params.tags.length > 0) {
    body.tags = params.tags;
  }

  let res: Response;
  try {
    res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": params.idempotencyKey,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e) {
    const err = e as Error;
    if (err.name === "AbortError") {
      throw new ResendError("Resend API timeout after 4s", 504);
    }
    throw new ResendError("Resend API network error", 500);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const status = res.status;
    if (status === 401 || status === 403) {
      throw new ResendError("Resend API authentication error", 500);
    }
    if (status === 429) {
      throw new ResendError("Resend API rate limit exceeded", 500);
    }
    if (status >= 500) {
      throw new ResendError(`Resend API server error (${status})`, 502);
    }
    throw new ResendError(`Resend API client error (${status})`, 500);
  }

  // Parse response safely — an unexpected body shape is treated as provider failure.
  let data: { id?: string };
  try {
    data = (await res.json()) as { id?: string };
  } catch {
    throw new ResendError("Resend API returned unparseable response", 502);
  }

  if (!data.id || typeof data.id !== "string" || data.id.length === 0) {
    // Resend returned 2xx but without a delivery id — treat as provider failure.
    throw new ResendError(
      "Resend API accepted the request but returned no delivery id",
      502,
    );
  }

  return { id: data.id };
}
