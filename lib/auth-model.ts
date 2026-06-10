import { demoBusiness, getBusinessForOwner, type Business } from "@/lib/business";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Database } from "@/lib/supabase.types";

export type ProfileRole = Database["public"]["Tables"]["profiles"]["Row"]["role"];

export type CurrentProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: ProfileRole;
};

export type WorkspaceAccess = {
  profile: CurrentProfile | null;
  business: Business;
  mode: "access_gate" | "supabase_auth";
};

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileQueryClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      single: () => Promise<{ data: ProfileRow | null; error: unknown }>;
    };
  };
};

// This helper is intentionally conservative until Supabase SSR auth is wired.
// The current MVP uses the access gate; Supabase Auth will replace this mode.
export async function getWorkspaceAccess(): Promise<WorkspaceAccess> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      profile: null,
      business: demoBusiness,
      mode: "access_gate"
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      business: demoBusiness,
      mode: "access_gate"
    };
  }

  const { data } = await (supabase.from("profiles") as unknown as ProfileQueryClient)
    .select("id,email,full_name,role,created_at,updated_at")
    .eq("id", user.id)
    .single();

  const profile = data
    ? {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        role: data.role
      }
    : null;

  return {
    profile,
    business: profile ? await getBusinessForOwner(profile.id) : demoBusiness,
    mode: "supabase_auth"
  };
}

export function getDefaultRedirectForRole(role: ProfileRole) {
  return role === "admin" ? "/demandes" : "/portal";
}

export function canAccessAdminArea(role: ProfileRole | null | undefined) {
  return role === "admin";
}
