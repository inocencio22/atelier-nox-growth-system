/**
 * Resend email helper
 * Requires RESEND_API_KEY in environment variables.
 * Free tier: 3 000 emails/month.
 * https://resend.com/docs/api-reference/emails/send-email
 */

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[resend] RESEND_API_KEY not configured - email not sent.");
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Atelier Nox <notifications@atelier-nox.ch>",
        to: [payload.to],
        subject: payload.subject,
        html: payload.html
      })
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[resend] Failed to send email:", res.status, body);
      return { success: false, error: body };
    }

    return { success: true };
  } catch (err) {
    console.error("[resend] Unexpected error:", err);
    return { success: false, error: String(err) };
  }
}

export function buildNewDemandeEmail(data: {
  businessName: string;
  ownerEmail: string;
  ownerPhone: string | null;
  city: string;
  niche: string;
  mainObjective: string;
  desiredPlan: string;
}): EmailPayload {
  const phoneRow = data.ownerPhone
    ? `<tr><td style="padding:4px 0;color:#555;font-size:13px;">Telephone</td><td style="padding:4px 0;font-size:13px;font-weight:700;">${data.ownerPhone}</td></tr>`
    : "";

  const planLabels: Record<string, string> = {
    pas_encore: "Pas encore decide",
    essentiel: "Local Clarity - CHF 190/mois",
    growth: "Managed Growth - CHF 390/mois",
    pro_local: "Done For You Local - CHF 690/mois",
    partner: "Partner - sur mesure"
  };

  const objectiveLabels: Record<string, string> = {
    rendez_vous: "Plus de rendez-vous",
    instagram: "Visibilite Instagram",
    relancer_contacts: "Relancer contacts existants",
    avis_google: "Avis Google",
    plus_clients: "Plus de clients"
  };

  return {
    to: "joaopedro.suisse@gmail.com",
    subject: `Nouvelle demande - ${data.businessName} (${data.city})`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#fff;">
        <div style="background:#0d1a14;padding:20px 24px;">
          <p style="color:#E85D2A;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin:0;">Atelier Nox - Notification</p>
          <h1 style="color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;margin:8px 0 0;">Nouvelle demande recue</h1>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:4px 0;color:#555;font-size:13px;">Business</td><td style="padding:4px 0;font-size:13px;font-weight:700;">${data.businessName}</td></tr>
            <tr><td style="padding:4px 0;color:#555;font-size:13px;">Email</td><td style="padding:4px 0;font-size:13px;font-weight:700;">${data.ownerEmail}</td></tr>
            ${phoneRow}
            <tr><td style="padding:4px 0;color:#555;font-size:13px;">Ville</td><td style="padding:4px 0;font-size:13px;">${data.city}</td></tr>
            <tr><td style="padding:4px 0;color:#555;font-size:13px;">Niche</td><td style="padding:4px 0;font-size:13px;">${data.niche}</td></tr>
            <tr><td style="padding:4px 0;color:#555;font-size:13px;">Objectif</td><td style="padding:4px 0;font-size:13px;">${objectiveLabels[data.mainObjective] ?? data.mainObjective}</td></tr>
            <tr><td style="padding:4px 0;color:#555;font-size:13px;">Plan</td><td style="padding:4px 0;font-size:13px;font-weight:700;">${planLabels[data.desiredPlan] ?? data.desiredPlan}</td></tr>
          </table>
          <div style="margin-top:20px;">
            <a href="https://atelier-nox-growth-system.vercel.app/demandes" style="display:inline-block;background:#12382F;color:#fff;padding:12px 20px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;text-decoration:none;">
              Ouvrir dans le panneau admin
            </a>
          </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #eee;">
          <p style="color:#aaa;font-size:11px;margin:0;">Atelier Nox Growth System - Lausanne</p>
        </div>
      </div>
    `
  };
}

export function buildClientWelcomeEmail(data: {
  businessName: string;
  ownerEmail: string;
  plan: string;
  portalUrl: string;
}): EmailPayload {
  const planLabels: Record<string, string> = {
    essentiel: "Local Clarity - CHF 190/mois",
    growth: "Managed Growth - CHF 390/mois",
    pro_local: "Done For You Local - CHF 690/mois",
    partner: "Partner - sur mesure"
  };

  return {
    to: data.ownerEmail,
    subject: `Bienvenue chez Atelier Nox - votre acces est pret`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#fff;">
        <div style="background:#0d1a14;padding:20px 24px;">
          <p style="color:#E85D2A;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin:0;">Atelier Nox Growth System</p>
          <h1 style="color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;margin:8px 0 0;">Bienvenue, ${data.businessName}</h1>
        </div>
        <div style="padding:24px;">
          <p style="font-size:15px;line-height:1.6;color:#333;">
            Votre espace client Atelier Nox est maintenant actif. Vous pouvez acceder a votre portail pour suivre vos contenus, approuver les publications et voir vos rapports de suivi.
          </p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:6px 0;color:#555;font-size:13px;">Business</td><td style="padding:6px 0;font-size:13px;font-weight:700;">${data.businessName}</td></tr>
            <tr><td style="padding:6px 0;color:#555;font-size:13px;">Email</td><td style="padding:6px 0;font-size:13px;">${data.ownerEmail}</td></tr>
            <tr><td style="padding:6px 0;color:#555;font-size:13px;">Forfait</td><td style="padding:6px 0;font-size:13px;font-weight:700;">${planLabels[data.plan] ?? data.plan}</td></tr>
          </table>
          <p style="font-size:13px;color:#555;line-height:1.6;">
            Vous allez recevoir un email separe de notre systeme pour creer votre mot de passe et acceder au portail.
            Si vous ne le recevez pas dans les 5 minutes, verifiez votre dossier spam ou contactez-nous par WhatsApp.
          </p>
          <div style="margin-top:24px;">
            <a href="${data.portalUrl}" style="display:inline-block;background:#12382F;color:#fff;padding:14px 24px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;text-decoration:none;">
              Acceder a mon portail
            </a>
          </div>
          <p style="margin-top:24px;font-size:13px;color:#555;line-height:1.6;">
            Des questions ? Repondez a cet email ou contactez-nous directement.
            Notre equipe est disponible du lundi au vendredi.
          </p>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #eee;">
          <p style="color:#aaa;font-size:11px;margin:0;">Atelier Nox Growth System - Lausanne, Suisse</p>
        </div>
      </div>
    `
  };
}
