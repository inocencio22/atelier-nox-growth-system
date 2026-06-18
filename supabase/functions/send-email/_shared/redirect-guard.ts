/**
 * Validates AUTH_APP_ORIGIN.
 *
 * AUTH_APP_ORIGIN must be:
 * - A valid URL
 * - An origin only (no path beyond /, no query, no fragment)
 * - https:// in production (http:// allowed only for localhost/127.0.0.1)
 *
 * This value is used as the base for all confirmation links sent in emails.
 * Never use redirect_to from the hook payload as the origin without this validation.
 */
export function validateAppOrigin(raw: string | undefined): string {
  if (!raw) {
    throw new Error("AUTH_APP_ORIGIN is not configured");
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("AUTH_APP_ORIGIN is not a valid URL");
  }

  // Must be an origin only — no path beyond /, no query, no fragment
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error(
      "AUTH_APP_ORIGIN must be an origin only (no path, query string, or fragment)",
    );
  }

  const isLocalhost = parsed.hostname === "localhost" ||
    parsed.hostname === "127.0.0.1";

  if (parsed.protocol === "http:" && !isLocalhost) {
    throw new Error(
      "AUTH_APP_ORIGIN: http:// is only permitted for localhost in development",
    );
  }

  // Return normalized origin (strips trailing slash if any)
  return parsed.origin;
}
