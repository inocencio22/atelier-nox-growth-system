import type { EmailContent } from "../_shared/types.ts";
import { escapeHtml } from "../_shared/escape-html.ts";

/**
 * Email template for reauthentication OTP.
 *
 * IMPORTANT -- B3 VALIDATION REQUIRED:
 * The payload structure for reauthentication must be confirmed with a real
 * Inbucket capture during B3 testing before this template is used in production.
 * Specifically, verify:
 *   - email_action_type value (expected: "reauthentication")
 *   - token field: the OTP code the user must type (not click)
 *   - token_hash: presence or absence (expected: absent -- user types, not clicks)
 *   - Actual token length (config has otp_length = 8 locally; may differ in production)
 *
 * This template displays the token as a typed code -- no confirmation link is created.
 * The user reads the code from the email and types it in the application UI.
 */
interface ReauthenticationTemplateData {
  /** The OTP code from email_data.token. Displayed exactly as received. */
  token: string;
}

export function buildReauthenticationEmail(
  data: ReauthenticationTemplateData,
): EmailContent {
  const { token } = data;
  const safeToken = escapeHtml(token);

  return {
    subject: "Votre code de vérification — Atelier Nox",
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f0eb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" role="presentation" style="max-width:540px;width:100%;background:#ffffff;border:1px solid #dedad4;">

          <!-- Header -->
          <tr>
            <td style="background:#12382F;padding:32px 40px;">
              <p style="margin:0 0 10px;color:#E85D2A;font-size:10px;font-weight:900;letter-spacing:0.22em;text-transform:uppercase;">Atelier Nox</p>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:900;text-transform:uppercase;line-height:1.25;letter-spacing:0.04em;">
                Code de vérification
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;background:#fffaf0;">
              <p style="margin:0 0 20px;color:#101820;font-size:15px;line-height:1.65;">
                Bonjour,
              </p>
              <p style="margin:0 0 24px;color:#101820;font-size:15px;line-height:1.65;">
                Votre code de vérification Atelier Nox est :
              </p>

              <!-- Code block -->
              <div style="margin:0 0 32px;padding:24px;background:#12382F;text-align:center;">
                <span style="color:#ffffff;font-size:36px;font-weight:900;letter-spacing:0.3em;font-family:'Courier New',Courier,monospace;">
                  ${safeToken}
                </span>
              </div>

              <p style="margin:0;color:#6b6660;font-size:13px;line-height:1.6;">
                Saisissez ce code dans l'application pour continuer. Ce code est personnel et temporaire. Ne le partagez jamais.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f0ebe3;border-top:1px solid #dedad4;">
              <p style="margin:0;color:#9c9690;font-size:11px;line-height:1.6;">
                Atelier Nox · Service de croissance locale · Lausanne, Suisse<br />
                Si vous n'avez pas effectué cette demande, ignorez ce message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    text: `Votre code de vérification Atelier Nox est :

  ${token}

Saisissez ce code dans l'application pour continuer.
Ce code est personnel et temporaire. Ne le partagez jamais.

Atelier Nox · Lausanne, Suisse`,
  };
}
