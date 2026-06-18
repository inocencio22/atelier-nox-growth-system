/**
 * Confirmation URL builder using URL fragments (#) for token protection.
 *
 * WHY FRAGMENTS:
 * Browsers never send the URL fragment to the server. When a prefetch bot
 * or email scanner follows the link, it GETs /auth/confirm-action with no
 * fragment — the server receives no token_hash. Only the user's browser
 * (client-side JavaScript) can read window.location.hash.
 *
 * FORMAT:
 *   {appOrigin}/auth/confirm-action#token_hash={tokenHash}&type={type}
 *
 * SECURITY:
 * - Always use URLSearchParams for encoding — never string concatenation.
 * - appOrigin must be pre-validated by validateAppOrigin().
 * - Never include next, redirect_to, or other client-controllable params.
 */
export function buildConfirmUrl(
  appOrigin: string,
  tokenHash: string,
  type: string,
): string {
  const params = new URLSearchParams({ token_hash: tokenHash, type });
  return `${appOrigin}/auth/confirm-action#${params.toString()}`;
}
