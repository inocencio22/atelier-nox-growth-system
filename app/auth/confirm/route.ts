import { type NextRequest, NextResponse } from "next/server";

/**
 * /auth/confirm - backward compatibility route.
 *
 * CHANGED (Fase B2): This route NO LONGER calls verifyOtp() on GET.
 * It redirects to /auth/confirm-action, which handles token verification
 * securely via client-side fragment and an explicit user action.
 *
 * WHY: verifyOtp() on GET is vulnerable to prefetch bots and email scanners
 * consuming the token before the user clicks. The new flow uses URL fragments
 * (#token_hash=...) which browsers never send to the server.
 *
 * THIS ROUTE EXISTS FOR:
 * - Links generated before the Send Email Hook was activated (old-format links)
 * - External references that may still use the old URL pattern
 *
 * NEW LINKS from the Edge Function go directly to /auth/confirm-action#...
 * and do not pass through this route at all.
 *
 * SECURITY CHANGES vs the old implementation:
 * - verifyOtp() removed from GET handler
 * - type validated against runtime allowlist (not just TypeScript cast)
 * - next parameter removed: destination is determined by /auth/confirm-action
 *   based on type (server-controlled DESTINATION_MAP), not by URL input
 * - open redirect fixed: new URL(next, origin) was vulnerable to absolute URLs;
 *   the new approach ignores next entirely
 *
 * NOTE: token_hash still travels in the query string for OLD links (unavoidable -
 * those emails were already sent). The redirect to /auth/confirm-action converts
 * it to a fragment, but the initial GET request to this route will have the hash
 * in the query string (which Vercel may log). This is acceptable for backward
 * compat only - all new links use the direct fragment approach.
 *
 * SECURITY HEADERS applied to all responses from this route:
 * - Cache-Control: no-store  (prevents token_hash caching by CDN or browser)
 * - Referrer-Policy: no-referrer  (prevents fragment leakage via Referer header
 *   even though fragments are normally stripped; defense in depth)
 * - X-Robots-Tag: noindex, nofollow, noarchive  (prevents crawler indexing of
 *   this auth route and its query parameters)
 */

// Runtime allowlist - extended to include email_change (was missing from original)
const ALLOWED_TYPES = new Set(["invite", "recovery", "signup", "magiclink", "email", "email_change"]);

// Security headers applied to every response from this route.
// Cache-Control: no-store prevents CDN/browser caching of token_hash in query params.
// Referrer-Policy: no-referrer prevents leaking this URL (with token in QS) to other sites.
// X-Robots-Tag: noindex prevents search engines from indexing this auth endpoint.
const SECURITY_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive"
};

function addSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  // next is intentionally NOT forwarded - destination is determined by type
  // in the Server Action's DESTINATION_MAP, never by URL input

  if (!token_hash) {
    return addSecurityHeaders(NextResponse.redirect(new URL("/login?error=invalid_link", requestUrl.origin)));
  }

  // Runtime type validation - rejects unknown types without TypeScript cast
  if (!type || !ALLOWED_TYPES.has(type)) {
    return addSecurityHeaders(NextResponse.redirect(new URL("/login?error=invalid_link", requestUrl.origin)));
  }

  // Convert to fragment-based URL for /auth/confirm-action.
  // The token_hash is moved from the query string to the fragment (#),
  // so it will not be sent to the server when /auth/confirm-action is loaded.
  const params = new URLSearchParams({ token_hash, type });
  const confirmActionUrl = new URL(`/auth/confirm-action#${params.toString()}`, requestUrl.origin);

  return addSecurityHeaders(NextResponse.redirect(confirmActionUrl));
}
