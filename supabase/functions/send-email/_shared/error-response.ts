/**
 * Standardized Auth Hook error response.
 *
 * Contract required by Supabase Auth Hooks:
 *   { "error": { "http_code": N, "message": "..." } }
 *
 * The HTTP status of the Response MUST match error.http_code.
 * The Auth operation is blocked when http_code >= 400.
 *
 * SECURITY: Never include tokens, hashes, secrets, API keys,
 * stack traces, email addresses, or sensitive data in the message.
 */
export function errorResponse(httpCode: number, message: string): Response {
  return new Response(
    JSON.stringify({
      error: {
        http_code: httpCode,
        message,
      },
    }),
    {
      status: httpCode,
      headers: { "Content-Type": "application/json" },
    },
  );
}
