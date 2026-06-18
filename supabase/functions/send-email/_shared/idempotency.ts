/**
 * Deterministic Idempotency-Key generator for Resend API calls.
 *
 * Strategy: use the Standard Webhooks `webhook-id` as the base.
 *   - Each new Auth operation receives a unique webhook-id from Supabase.
 *   - A Supabase retry of the same operation reuses the same webhook-id.
 *   - Resend deduplicates requests with the same key within 24 hours.
 *
 * For email_change with double confirmation (two emails per operation):
 *   suffix "-current" → link sent to the current email address
 *   suffix "-new"     → link sent to the new email address
 *
 * SECURITY: The key must never include token_hash, token, or any secret value.
 * Max length: 256 characters (Resend requirement).
 */
export function buildIdempotencyKey(
  webhookId: string,
  suffix?: string,
): string {
  const MAX_LENGTH = 256;
  const base = suffix ? `${webhookId}-${suffix}` : webhookId;

  if (base.length <= MAX_LENGTH) {
    return base;
  }

  // Truncate the webhookId part to fit, keeping the suffix intact
  const suffixPart = suffix ? `-${suffix}` : "";
  const allowedBase = MAX_LENGTH - suffixPart.length;
  return `${webhookId.slice(0, allowedBase)}${suffixPart}`;
}
