"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/admin-client";

type ProfileUpdateClient = {
  update: (value: Record<string, string | null>) => {
    eq: (column: string, value: string) => Promise<{ error: unknown }>;
  };
};

type BusinessUpdateClient = {
  update: (value: Record<string, string | null>) => {
    eq: (column: string, value: string) => Promise<{ error: unknown }>;
  };
};

export async function activateAccount(formData: FormData) {
  const prenom    = String(formData.get("prenom") ?? "").trim();
  const nom       = String(formData.get("nom") ?? "").trim();
  const phone     = String(formData.get("phone") ?? "").trim();
  const password  = String(formData.get("password") ?? "");
  const confirm   = String(formData.get("confirm") ?? "");
  const conditions = formData.get("conditions");

  // Basic validation
  if (!prenom || !nom || !phone) {
    redirect("/activation?error=missing");
  }
  if (!password || password.length < 8) {
    redirect("/activation?error=password_short");
  }
  if (password !== confirm) {
    redirect("/activation?error=password_mismatch");
  }
  if (!conditions) {
    redirect("/activation?error=conditions");
  }

  // Get current session to identify the user
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?error=session");
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/login?error=session");
  }

  const admin = createAdminClient();
  if (!admin) {
    redirect("/activation?error=server");
  }

  const fullName = `${prenom} ${nom}`;

  // 1. Set password via admin (avoids needing a recovery token)
  const { error: pwError } = await admin.auth.admin.updateUserById(user.id, {
    password
  });
  if (pwError) {
    console.error("[activation] updateUserById password failed:", pwError);
    redirect("/activation?error=password_update");
  }

  // 2. Update profile: full_name + phone
  const { error: profileError } = await (admin.from("profiles") as unknown as ProfileUpdateClient)
    .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (profileError) {
    console.error("[activation] profile update failed:", profileError);
    // Non-blocking: continue to link business
  }

  // 3. Link business.owner_id → profile.id (query by owner_email)
  if (user.email) {
    const { error: bizError } = await (admin.from("businesses") as unknown as BusinessUpdateClient)
      .update({ owner_id: user.id })
      .eq("owner_email", user.email);
    if (bizError) {
      console.error("[activation] business link failed:", bizError);
      // Non-blocking: proceed to portal
    }
  }

  redirect("/portal?activated=1");
}
