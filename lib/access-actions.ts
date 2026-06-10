"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";

const ACCESS_COOKIE = "nox_access";
const ACCESS_VALUE = "granted";

function getAccessPassword() {
  const configuredPassword = process.env.ACCESS_GATE_PASSWORD?.trim();

  if (configuredPassword) {
    return configuredPassword;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return "atelier-nox";
}

export async function loginWithAccessCode(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/portal");

  const accessPassword = getAccessPassword();

  if (!accessPassword || password !== accessPassword) {
    redirect(`/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE, ACCESS_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  redirect(nextPath.startsWith("/") ? nextPath : "/portal");
}

export async function loginWithSupabase(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/portal");
  const safeNextPath = nextPath.startsWith("/") ? nextPath : "/portal";

  if (!email || !password || !isSupabaseConfigured) {
    redirect(`/login?auth_error=1&next=${encodeURIComponent(safeNextPath)}`);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(`/login?auth_error=1&next=${encodeURIComponent(safeNextPath)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?auth_error=1&next=${encodeURIComponent(safeNextPath)}`);
  }

  redirect(safeNextPath);
}

export async function logoutAccess() {
  const cookieStore = await cookies();
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  cookieStore.delete(ACCESS_COOKIE);
  redirect("/login");
}
