import type { EmailContent } from "../_shared/types.ts";
import { escapeHtml, escapeHtmlAttr } from "../_shared/escape-html.ts";

/**
 * Email sent to the USER'S CURRENT email address during a double-confirmation
 * email change (double_confirm_changes = true).
 *
 * The confirmUrl is built using token_hash_new from the hook payload
 * (counterintuitive naming -- this hash belongs to the current address).
 */
interface EmailChangeCurrentData {
  confirmUrl: string;
  /** The new email address being requested (shown for context) */
  newEmail: string;
}

export function buildEmailChangeCurrentEmail(
  data: EmailChangeCurrentData,
): EmailContent {
  const { confirmUrl, newEmail } = data;
  const safeHref = escapeHtmlAttr(confirmUrl);
  const safeUrl = escapeHtml(confirmUrl);
  const safeNewEmail = escapeHtml(newEmail);

  return {
    subject: "Confirmer le changement d'adresse e-mail — Atelier Nox",
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
                Changement d'adresse e-mail
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;background:#fffaf0;">
              <p style="margin:0 0 20px;color:#101820;font-size:15px;line-height:1.65;">
                Bonjour,
              </p>
              <p style="margin:0 0 20px;color:#101820;font-size:15px;line-height:1.65;">
                Une demande de changement d'adresse e-mail a été effectuée sur votre compte Atelier Nox. La nouvelle adresse demandée est : <strong>${safeNewEmail}</strong>.
              </p>
              <p style="margin:0 0 20px;color:#101820;font-size:15px;line-height:1.65;">
                Cliquez sur le bouton ci-dessous pour confirmer ce changement depuis votre adresse actuelle. Une seconde confirmation sera envoyée à la nouvelle adresse.
              </p>
              <p style="margin:0 0 32px;color:#6b6660;font-size:13px;line-height:1.6;">
                Ce lien est valide pendant <strong>1 heure</strong>. Si vous n'avez pas demandé ce changement, contactez Atelier Nox immédiatement.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:#12382F;">
                    <a href="${safeHref}"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:12px;font-weight:900;text-transform:uppercase;text-decoration:none;letter-spacing:0.12em;">
                      Confirmer le changement →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f0ebe3;border-top:1px solid #dedad4;">
              <p style="margin:0;color:#9c9690;font-size:11px;line-height:1.6;">
                Atelier Nox · Service de croissance locale · Lausanne, Suisse<br />
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
                <span style="color:#12382F;word-break:break-all;">${safeUrl}</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    text:
      `Une demande de changement d'adresse e-mail a été effectuée sur votre compte Atelier Nox.
Nouvelle adresse demandée : ${newEmail}

Cliquez sur le lien ci-dessous pour confirmer ce changement depuis votre adresse actuelle :

${confirmUrl}

Ce lien est valide pendant 1 heure.
Si vous n'avez pas demandé ce changement, contactez Atelier Nox immédiatement.

Atelier Nox · Lausanne, Suisse`,
  };
}
