"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/admin-client";
import { sendEmail } from "@/lib/resend";

export async function inviteClient(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const businessId = String(formData.get("businessId") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();

  if (!email || !businessId) {
    redirect(`/clients/${businessId}?invite_error=missing_fields`);
  }

  const admin = createAdminClient();

  if (!admin) {
    redirect(`/clients/${businessId}?invite_error=no_service_key`);
  }

  // Invite via Supabase Auth — sends magic link, client sets own password
  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://atelier-nox-growth-system.vercel.app"}/auth/invite-handler`,
    data: {
      business_id: businessId,
      role: "client"
    }
  });

  if (inviteError) {
    if (inviteError.message?.includes("already been registered")) {
      revalidatePath(`/clients/${businessId}`);
      redirect(`/clients/${businessId}?invited=resent`);
    }
    redirect(`/clients/${businessId}?invite_error=auth_error`);
  }

  // Link the Supabase user to the business
  if (inviteData.user?.id) {
    await admin
      .from("businesses")
      .update({ owner_id: inviteData.user.id, owner_email: email })
      .eq("id", businessId);

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
  redirect(`/clients/${businessId}?invited=1`);
}

function buildClientInviteEmail({
  businessName,
  email
}: {
  businessName: string;
  email: string;
}) {
  return [
    '<div style="font-family:system-ui,sans-serif;max-width:540px;margin:0 auto;background:#fff;">',
    '  <div style="background:#12382F;padding:20px 24px;">',
    '    <p style="color:#E85D2A;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin:0;">Atelier Nox</p>',
    '    <h1 style="color:#fff;font-size:20px;font-weight:900;text-transform:uppercase;margin:8px 0 0;">Votre espace client est pr\u00eat</h1>',
    '  </div>',
    '  <div style="padding:24px;">',
    '    <p style="font-size:14px;color:#333;line-height:1.6;">Bonjour,</p>',
    '    <p style="font-size:14px;color:#333;line-height:1.6;">Votre accompagnement Atelier Nox pour <strong>' + businessName + '</strong> d\u00e9marre. Voici votre portail priv\u00e9 pour suivre les actions, valider les contenus et consulter les r\u00e9sultats du service.</p>',
    '    <p style="font-size:14px;color:#333;line-height:1.6;">Vous avez re\u00e7u un email s\u00e9par\u00e9 de Supabase avec un lien pour d\u00e9finir votre mot de passe. Ce lien est valable 24h.</p>',
    '    <p style="font-size:14px;color:#333;line-height:1.6;">Une fois connect\u00e9, acc\u00e9dez \u00e0 votre espace :<br/><a href="https://atelier-nox-growth-system.vercel.app/portal" style="color:#12382F;font-weight:700;">atelier-nox-growth-system.vercel.app/portal</a></p>',
    '    <p style="font-size:14px;color:#555;line-height:1.6;margin-top:20px;">\u00c0 bient\u00f4t,<br/><strong>Jo\u00e3o \u2013 Atelier Nox</strong></p>',
    '  </div>',
    '  <div style="padding:12px 24px;border-top:1px solid #eee;">',
    '    <p style="color:#aaa;font-size:11px;margin:0;">Atelier Nox Growth System \u00b7 Lausanne \u00b7 ' + email + '</p>',
    '  </div>',
    '</div>'
  ].join("");
}
