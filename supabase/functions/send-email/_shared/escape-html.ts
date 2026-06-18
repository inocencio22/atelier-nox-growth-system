/**
 * HTML escape helpers for email templates.
 *
 * escapeHtml   — for text nodes in HTML body (encodes &, <, >, ", ')
 * escapeHtmlAttr — for URL values in HTML attributes such as href
 *                  (encodes & and " to produce valid HTML attributes)
 *
 * IMPORTANT: Do NOT call escapeHtmlAttr on URLs that contain
 * percent-encoded sequences — URLSearchParams already encodes
 * parameter values correctly. escapeHtmlAttr only handles the
 * HTML-level encoding of & between URL parameters.
 */

/** Escapes characters that are unsafe in HTML text content. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes characters that are unsafe in double-quoted HTML attribute values.
 * Use for URL values in href="..." attributes.
 *
 * URLs built with URLSearchParams are safe for < > ' but may contain
 * literal & between parameters — this must be &amp; in HTML attributes.
 */
export function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
