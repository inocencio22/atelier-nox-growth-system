"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !isSupabaseConfigured) {
    redirect("/login?reset_sent=1");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?reset_sent=1");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://atelier-nox-growth-system.vercel.app";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/callback?type=recovery`
  });

  // Always redirect to success page, even if email not found (security)
  redirect("/login?reset_sent=1");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!password || password.length < 8 || password !== confirm) {
    redirect("/reset-password?error=1");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/reset-password?error=1");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/reset-password?error=1");
  }

  redirect("/portal?password_updated=1");
}
