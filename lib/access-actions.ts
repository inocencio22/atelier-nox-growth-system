"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDefaultRedirectForRole, type ProfileRole } from "@/lib/auth-model";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";

const ACCESS_COOKIE = "nox_access";
const ACCESS_VALUE = "granted";
const ADMIN_REDIRECT_PREFIXES = [
  "/actions",
  "/business",
  "/campagnes",
  "/clients",
  "/contacts",
  "/contenus",
  "/dashboard",
  "/demandes",
  "/infra",
  "/instagram",
  "/messages",
  "/propositions",
  "/rapports"
];

type ProfileRoleRow = {
  role: ProfileRole;
};

type ProfileRoleQueryClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      single: () => Promise<{ data: ProfileRoleRow | null; error: unknown }>;
    };
  };
};

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

function sanitizeInternalPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? path : null;
}

function isAdminRedirectPath(path: string) {
  return ADMIN_REDIRECT_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export async function loginWithAccessCode(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/portal");
  const safeNextPath = sanitizeInternalPath(nextPath) ?? "/portal";

  const accessPassword = getAccessPassword();

  if (!accessPassword || password !== accessPassword) {
    redirect(`/login?error=1&next=${encodeURIComponent(safeNextPath)}`);
  }

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE, ACCESS_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  redirect(safeNextPath);
}

export async function loginWithSupabase(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "").trim();
  const safeNextPath = sanitizeInternalPath(nextPath);
  const nextQuery = safeNextPath ? `&next=${encodeURIComponent(safeNextPath)}` : "";

  if (!email || !password || !isSupabaseConfigured) {
    redirect(`/login?auth_error=1${nextQuery}`);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(`/login?auth_error=1${nextQuery}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?auth_error=1${nextQuery}`);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let defaultRedirect = "/portal";

  if (user?.id) {
    const { data: profile } = await (supabase.from("profiles") as unknown as ProfileRoleQueryClient)
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "client";
    defaultRedirect = getDefaultRedirectForRole(role);

    if (safeNextPath && (role === "admin" || !isAdminRedirectPath(safeNextPath))) {
      redirect(safeNextPath);
    }
  }

  redirect(defaultRedirect);
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
