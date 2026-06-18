/**
 * Standard Webhooks signature validation for Supabase Auth Hooks.
 *
 * The Supabase dashboard generates secrets in the format:
 *   v1,whsec_<base64_encoded_secret>
 *
 * The standardwebhooks library expects the base64 part only.
 * This module strips the prefix if present and validates the result.
 *
 * SECURITY:
 * - Never log rawSecret, hookSecret, or any header values.
 * - Never include secret values in error messages.
 * - Validation errors are surfaced as thrown exceptions only.
 */

/**
 * Extracts and normalizes the SEND_EMAIL_HOOK_SECRET.
 * Throws (with a safe internal message) on missing or malformed secret.
 * The caller must catch and return a 500 without exposing the message.
 */
export function validateSecret(raw: string | undefined): string {
  if (!raw) {
    throw new Error("SEND_EMAIL_HOOK_SECRET is not configured");
  }
  if (raw.length === 0) {
    throw new Error("SEND_EMAIL_HOOK_SECRET is empty");
  }

  // Strip Supabase dashboard prefix if present
  const secret = raw.startsWith("v1,whsec_")
    ? raw.slice("v1,whsec_".length)
    : raw;

  if (!secret || secret.length === 0) {
    throw new Error(
      "SEND_EMAIL_HOOK_SECRET has unexpected format after prefix removal",
    );
  }

  return secret;
}
