/**
 * Supabase Auth Send Email Hook — Edge Function
 *
 * Intercepts all outgoing Auth emails and sends them via Resend API.
 * Deployed with: supabase functions deploy send-email --no-verify-jwt
 *
 * Supported email_action_type values:
 *   invite | recovery | signup | magiclink | email_change | reauthentication
 *
 * Returns 422 for any unrecognized type — Auth operation is blocked until
 * a template is implemented.
 *
 * SECURITY CONTRACT:
 * - Method must be POST.
 * - Content-Type must be application/json.
 * - Body is rejected if empty or larger than 64 KB.
 * - Signature validated via Standard Webhooks before any payload processing.
 * - token_hash, token, secrets, and API keys never appear in logs or responses.
 * - AUTH_APP_ORIGIN controls all confirmation link origins — redirect_to from
 *   the hook payload is never used as the link base without validation.
 * - HTTP status always matches error.http_code in the response body.
 * - 200 returned only when ALL required emails are accepted by Resend.
 * - Sender address is read from RESEND_FROM env var (never hardcoded here).
 *
 * standardwebhooks version: 1.0.0 (npm registry, 2024-03-04)
 * TIMEOUT: AbortController fires at 4s (hook limit: 5s, no Supabase retry).
 */

// Version pinned to 1.0.0 — the only 1.x release as of 2024-03-04.
// Declared in supabase/functions/deno.json imports map.
import { Webhook } from "standardwebhooks";
import { validateSecret } from "./_shared/signature.ts";
import { ResendError, sendEmail } from "./_shared/resend.ts";
import { errorResponse } from "./_shared/error-response.ts";
import { validateAppOrigin } from "./_shared/redirect-guard.ts";
import { buildConfirmUrl } from "./_shared/url-builder.ts";
import { buildIdempotencyKey } from "./_shared/idempotency.ts";
import type { AuthHookPayload, EmailContent } from "./_shared/types.ts";
import { buildInviteEmail } from "./_templates/invite.ts";
import { buildRecoveryEmail } from "./_templates/recovery.ts";
import { buildSignupEmail } from "./_templates/signup.ts";
import { buildMagicLinkEmail } from "./_templates/magic-link.ts";
import { buildEmailChangeCurrentEmail } from "./_templates/email-change-current.ts";
import { buildEmailChangeNewEmail } from "./_templates/email-change-new.ts";
import { buildReauthenticationEmail } from "./_templates/reauthentication.ts";

const MAX_BODY_BYTES = 64 * 1024; // 64 KB

// Types that produce a clickable confirmation link
const LINK_TYPES = new Set([
  "invite",
  "recovery",
  "signup",
  "magiclink",
  "email_change",
]);

// Types that produce an OTP code (no link)
const OTP_TYPES = new Set(["reauthentication"]);

// Input length limits — defense in depth against oversized or malformed payloads.
const MAX_EMAIL_LEN = 320; // RFC 5321
const MAX_TYPE_LEN = 64;
const MAX_TOKEN_LEN = 64; // OTP codes are short
const MAX_TOKEN_HASH_LEN = 1024; // PKCE hashes; adjust if production differs

Deno.serve(async (req: Request): Promise<Response> => {
  // ── 1. Method guard ─────────────────────────────────────────────────────────
  if (req.method !== "POST") {
    return errorResponse(405, "Method not allowed");
  }

  // ── 2. Content-Type guard ───────────────────────────────────────────────────
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return errorResponse(415, "Content-Type must be application/json");
  }

  // ── 3. Body size pre-check via Content-Length (fast path) ───────────────────
  const contentLengthStr = req.headers.get("content-length");
  if (contentLengthStr !== null) {
    const contentLength = parseInt(contentLengthStr, 10);
    if (!isNaN(contentLength) && contentLength > MAX_BODY_BYTES) {
      return errorResponse(413, "Request body too large");
    }
  }

  // ── 4. Read raw body BEFORE any parsing ─────────────────────────────────────
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return errorResponse(422, "Failed to read request body");
  }

  if (rawBody.length === 0) {
    return errorResponse(422, "Empty request body");
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return errorResponse(413, "Request body too large");
  }

  // ── 5. Validate Standard Webhooks signature ──────────────────────────────────
  let hookSecret: string;
  try {
    hookSecret = validateSecret(Deno.env.get("SEND_EMAIL_HOOK_SECRET"));
  } catch (e) {
    // Log safe internal message only — never log the secret value
    console.error(
      "[send-email] Secret configuration error:",
      (e as Error).message,
    );
    return errorResponse(500, "Internal configuration error");
  }

  try {
    const wh = new Webhook(hookSecret);
    wh.verify(rawBody, {
      "webhook-id": req.headers.get("webhook-id") ?? "",
      "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": req.headers.get("webhook-signature") ?? "",
    });
  } catch {
    // Do not log header values or secret
    return errorResponse(401, "Invalid signature");
  }

  // Keep webhook-id for idempotency keys — public identifier, not a secret
  const webhookId = req.headers.get("webhook-id") ?? `fallback-${Date.now()}`;

  // ── 6. Parse JSON payload ────────────────────────────────────────────────────
  let payload: AuthHookPayload;
  try {
    payload = JSON.parse(rawBody) as AuthHookPayload;
  } catch {
    return errorResponse(422, "Invalid JSON payload");
  }

  // ── 7. Validate required fields ─────────────────────────────────────────────
  const { user, email_data } = payload;
  if (!user?.email || !email_data?.email_action_type) {
    return errorResponse(
      422,
      "Missing required payload fields: user.email or email_data.email_action_type",
    );
  }

  const { email_action_type } = email_data;

  // ── 8. Input length limits ───────────────────────────────────────────────────
  if (email_action_type.length > MAX_TYPE_LEN) {
    return errorResponse(422, "email_action_type exceeds maximum length");
  }
  if (user.email.length > MAX_EMAIL_LEN) {
    return errorResponse(422, "user.email exceeds maximum length");
  }
  if (user.new_email && user.new_email.length > MAX_EMAIL_LEN) {
    return errorResponse(422, "user.new_email exceeds maximum length");
  }
  if (email_data.token && email_data.token.length > MAX_TOKEN_LEN) {
    return errorResponse(422, "token exceeds maximum length");
  }
  if (
    email_data.token_hash &&
    email_data.token_hash.length > MAX_TOKEN_HASH_LEN
  ) {
    return errorResponse(422, "token_hash exceeds maximum length");
  }
  if (
    email_data.token_hash_new &&
    email_data.token_hash_new.length > MAX_TOKEN_HASH_LEN
  ) {
    return errorResponse(422, "token_hash_new exceeds maximum length");
  }

  // ── 9. Reject unsupported types ─────────────────────────────────────────────
  if (!LINK_TYPES.has(email_action_type) && !OTP_TYPES.has(email_action_type)) {
    console.warn(
      "[send-email] Unsupported email_action_type:",
      email_action_type,
    );
    return errorResponse(
      422,
      `email_action_type not supported: ${email_action_type}`,
    );
  }

  // ── 10. Validate AUTH_APP_ORIGIN ────────────────────────────────────────────
  let appOrigin: string;
  try {
    appOrigin = validateAppOrigin(Deno.env.get("AUTH_APP_ORIGIN"));
  } catch (e) {
    console.error("[send-email] AUTH_APP_ORIGIN error:", (e as Error).message);
    return errorResponse(500, "Internal configuration error");
  }

  // ── 11. Route to handler ────────────────────────────────────────────────────
  try {
    if (email_action_type === "email_change") {
      return await handleEmailChange(payload, appOrigin, webhookId);
    }
    if (email_action_type === "reauthentication") {
      return await handleReauthentication(payload, webhookId);
    }
    return await handleLinkEmail(
      payload,
      appOrigin,
      webhookId,
      email_action_type,
    );
  } catch (e) {
    // Catch any unhandled error — do not expose internals
    console.error("[send-email] Unhandled error:", (e as Error).name);
    return errorResponse(500, "Internal error");
  }
});

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * Handles: invite, recovery, signup, magiclink
 * Builds a fragment-based confirmation URL and sends one email.
 */
async function handleLinkEmail(
  payload: AuthHookPayload,
  appOrigin: string,
  webhookId: string,
  type: string,
): Promise<Response> {
  const { user, email_data } = payload;
  const { token_hash } = email_data;

  if (!token_hash) {
    return errorResponse(422, "Missing token_hash for link-based email type");
  }

  const confirmUrl = buildConfirmUrl(appOrigin, token_hash, type);
  let content: EmailContent;

  switch (type) {
    case "invite":
      content = buildInviteEmail({ confirmUrl });
      break;
    case "recovery":
      content = buildRecoveryEmail({ confirmUrl });
      break;
    case "signup":
      content = buildSignupEmail({ confirmUrl });
      break;
    case "magiclink":
      content = buildMagicLinkEmail({ confirmUrl });
      break;
    default:
      // Should not reach here — guarded by LINK_TYPES check in main handler
      return errorResponse(422, "Unhandled link email type");
  }

  try {
    await sendEmail({
      to: user.email,
      ...content,
      idempotencyKey: buildIdempotencyKey(webhookId),
    });
  } catch (e) {
    if (e instanceof ResendError) {
      return errorResponse(e.hookStatus, "Email delivery failed");
    }
    return errorResponse(500, "Email delivery failed");
  }

  return new Response(null, { status: 200 });
}

/**
 * Handles: email_change
 *
 * With double_confirm_changes = true (double confirmation — current config):
 *   Sends TWO emails in parallel using Promise.allSettled.
 *   - Email 1: current address (token_hash_new)
 *   - Email 2: new address    (token_hash)
 *   Returns 200 only when BOTH are accepted by Resend.
 *   Partial failure -> 500 (Auth blocked, user retries the operation).
 *
 * With double_confirm_changes = false (single confirmation):
 *   Sends ONE email to user.new_email using token_hash.
 *
 * SECURITY: On partial failure, logs only position index (0 or 1),
 * never the email address, token, or token_hash.
 */
async function handleEmailChange(
  payload: AuthHookPayload,
  appOrigin: string,
  webhookId: string,
): Promise<Response> {
  const { user, email_data } = payload;
  const { token_hash, token_hash_new } = email_data;

  const isDoubleConfirm = typeof token_hash_new === "string" &&
    token_hash_new.length > 0;

  if (isDoubleConfirm) {
    if (!token_hash) {
      return errorResponse(
        422,
        "Missing token_hash for email_change double confirmation",
      );
    }
    if (!user.new_email) {
      return errorResponse(422, "Missing user.new_email for email_change");
    }

    // Shared AbortController — both calls are aborted together at 4s.
    // clearTimeout is called in the finally block of each sendEmail call.
    const sharedController = new AbortController();
    const sharedTimeout = setTimeout(() => sharedController.abort(), 4000);

    const currentConfirmUrl = buildConfirmUrl(
      appOrigin,
      token_hash_new,
      "email_change",
    );
    const newConfirmUrl = buildConfirmUrl(
      appOrigin,
      token_hash,
      "email_change",
    );

    const currentContent = buildEmailChangeCurrentEmail({
      confirmUrl: currentConfirmUrl,
      newEmail: user.new_email,
    });
    const newContent = buildEmailChangeNewEmail({ confirmUrl: newConfirmUrl });

    let results: PromiseSettledResult<unknown>[];
    try {
      results = await Promise.allSettled([
        sendEmail({
          to: user.email,
          ...currentContent,
          idempotencyKey: buildIdempotencyKey(webhookId, "current"),
          signal: sharedController.signal,
        }),
        sendEmail({
          to: user.new_email,
          ...newContent,
          idempotencyKey: buildIdempotencyKey(webhookId, "new"),
          signal: sharedController.signal,
        }),
      ]);
    } finally {
      clearTimeout(sharedTimeout);
    }

    const [currentResult, newResult] = results;

    // Log position only — never email addresses, tokens, or hashes
    if (currentResult.status === "rejected") {
      console.error(
        "[send-email] email_change: delivery failed at position 0 (current address)",
      );
    }
    if (newResult.status === "rejected") {
      console.error(
        "[send-email] email_change: delivery failed at position 1 (new address)",
      );
    }

    if (
      currentResult.status === "rejected" ||
      newResult.status === "rejected"
    ) {
      return errorResponse(
        500,
        "Failed to deliver one or more required emails for email_change",
      );
    }

    return new Response(null, { status: 200 });
  }

  // Single confirmation — send only to new address
  if (!token_hash) {
    return errorResponse(422, "Missing token_hash for email_change");
  }
  if (!user.new_email) {
    return errorResponse(422, "Missing user.new_email for email_change");
  }

  const newConfirmUrl = buildConfirmUrl(appOrigin, token_hash, "email_change");
  const newContent = buildEmailChangeNewEmail({ confirmUrl: newConfirmUrl });

  try {
    await sendEmail({
      to: user.new_email,
      ...newContent,
      idempotencyKey: buildIdempotencyKey(webhookId, "new"),
    });
  } catch (e) {
    if (e instanceof ResendError) {
      return errorResponse(e.hookStatus, "Email delivery failed");
    }
    return errorResponse(500, "Email delivery failed");
  }

  return new Response(null, { status: 200 });
}

/**
 * Handles: reauthentication
 *
 * The token field from the payload contains the OTP code the user must type.
 * NO confirmation link is created.
 *
 * B3 VALIDATION REQUIRED: Confirm payload structure with a real Inbucket capture
 * before activating the hook in production. Specifically verify:
 *   - email_action_type === "reauthentication"
 *   - token is present and is the OTP code
 *   - token_hash is absent (user types the code, not clicks a link)
 *   - Actual token length in production
 */
async function handleReauthentication(
  payload: AuthHookPayload,
  webhookId: string,
): Promise<Response> {
  const { user, email_data } = payload;
  const { token } = email_data;

  if (!token) {
    return errorResponse(422, "Missing token for reauthentication");
  }

  const content = buildReauthenticationEmail({ token });

  try {
    await sendEmail({
      to: user.email,
      ...content,
      idempotencyKey: buildIdempotencyKey(webhookId),
    });
  } catch (e) {
    if (e instanceof ResendError) {
      return errorResponse(e.hookStatus, "Email delivery failed");
    }
    return errorResponse(500, "Email delivery failed");
  }

  return new Response(null, { status: 200 });
}
