"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/admin-client";
import { sendEmail } from "@/lib/resend";

export type InviteResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function inviteClient(formData: FormData): Promise<InviteResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const businessId = String(formData.get("businessId") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();

  if (!email || !businessId) {
    return { success: false, error: "Email et business requis." };
  }

  const admin = createAdminClient();

  if (!admin) {
    return {
      success: false,
      error: "SUPABASE_SERVICE_ROLE_KEY non configuré. Ajoutez cette variable dans Vercel."
    };
  }

  // Invite via Supabase Auth — sends magic link, client sets own password
  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://atelier-nox-growth-system.vercel.app"}/reset-password`,
    data: {
      business_id: businessId,
      role: "client"
    }
  });

  if (inviteError) {
    // If user already exists, just resend the invite link
    if (inviteError.message?.includes("already been registered")) {
      await admin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://atelier-nox-growth-system.vercel.app"}/portal`
        }
      });
      return { success: true, message: "Utilisateur existant — lien de connexion renvoyé." };
    }

    return { success: false, error: inviteError.message };
  }

  // Link the Supabase user to the business
  if (inviteData.user?.id) {
    await admin
      .from("businesses")
      .update({ owner_id: inviteData.user.id, owner_email: email })
      .eq("id", businessId);

    // Upsert profile with role = client
    await admin.from("profiles").upsert({
      id: inviteData.user.id,
      email,
      role: "client"
    });
  }

  // Send a warm notification email
  await sendEmail({
    to: email,
    subject: `Bienvenue chez Atelier Nox — ${businessName}`,
    html: buildClientInviteEmail({ businessName, email })
  });

  revalidatePath(`/clients/${businessId}`);

  return { success: true, message: `Invitation envoyée à ${email}. Le client reçoit un email pour définir son mot de passe.` };
}

function buildClientInviteEmail({
  businessName,
  email
}: {
  businessName: string;
  email: string;
}) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:540px;margin:0 auto;background:#fff;">
      <div style="background:#12382F;padding:20px 24px;">
        <p style="color:#E85D2A;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin:0;">Atelier Nox</p>
        <h1 style="color:#fff;font-size:20px;font-weight:900;text-transform:uppercase;margin:8px 0 0;">Votre espace client est prêt</h1>
      </div>
      <div style="padding:24px;">
        <p style="font-size:14px;color:#333;line-height:1.6;">Bonjour,</p>
        <p style="font-size:14px;color:#333;line-height:1.6;">
          Votre accompagnement Atelier Nox pour <strong>${businessName}</strong> démarre.
          Voici votre portail privé pour suivre les actions, valider les contenus et consulter les résultats du service.
        </p>
        <p style="font-size:14px;color:#333;line-height:1.6;">
          Vous avez reçu un email séparé de Supabase (notre système d'accès sécurisé) avec un lien pour définir votre mot de passe.
          Ce lien est valable 24h.
        </p>
        <p style="font-size:14px;color:#333;line-height:1.6;">
          Une fois connecté, vous accéderez directement à votre espace client sur :<br/>
          <a href="https://atelier-nox-growth-system.vercel.app/portal" style="color:#12382F;font-weight:700;">atelier-nox-growth-system.vercel.app/portal</a>
        </p>
        <p style="font-size:14px;color:#555;line-height:1.6;margin-top:20px;">
          À bientôt,<br/>
          <strong>João – Atelier Nox</strong>
        </p>
      </div>
      <div style="padding:12px 24px;border-top:1px solid #eee;">
        <p style="color:#aaa;font-size:11px;margin:0;">Atelier Nox Growth System · Lausanne · ${email}</p>
      </div>
    </div>
  `;
}
