import { getSupabaseClient } from "@/lib/supabase";
import { createAdminClient } from "@/lib/admin-client";

export const DEMO_BUSINESS_ID = "00000000-0000-0000-0000-000000000001";

export type Business = {
  id: string;
  name: string;
  city: string;
  niche: string;
  website: string | null;
  instagramHandle: string | null;
  plan: string;
  status: string;
  source: "mock" | "supabase";
};

export const demoBusiness: Business = {
  id: DEMO_BUSINESS_ID,
  name: "Atelier Coupe Lausanne",
  city: "Lausanne",
  niche: "coiffure",
  website: "atelier-coupe.ch",
  instagramHandle: "@ateliercoupe_lsn",
  plan: "demo",
  status: "trial",
  source: "mock"
};

type BusinessRow = {
  id: string;
  name: string;
  city: string;
  niche: string;
  website: string | null;
  instagram_handle: string | null;
  plan: string;
  status: string;
};

type BusinessQueryClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      single: () => Promise<{ data: BusinessRow | null; error: unknown }>;
      limit: (count: number) => Promise<{ data: BusinessRow[] | null; error: unknown }>;
    };
  };
};

function mapBusiness(row: BusinessRow): Business {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    niche: row.niche,
    website: row.website,
    instagramHandle: row.instagram_handle,
    plan: row.plan,
    status: row.status,
    source: "supabase"
  };
}

export async function getCurrentBusiness(): Promise<Business> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return demoBusiness;
  }

  const { data, error } = await (supabase.from("businesses") as unknown as BusinessQueryClient)
    .select("id,name,city,niche,website,instagram_handle,plan,status")
    .eq("id", DEMO_BUSINESS_ID)
    .single();

  if (error || !data) {
    return demoBusiness;
  }

  return mapBusiness(data);
}

/**
 * Find a business by owner_email.
 * Used during activation before owner_id is linked.
 * Uses admin client to bypass RLS (owner_id is still null at this stage).
 * Returns null if not found or admin client unavailable.
 */
export async function getBusinessByOwnerEmail(email: string): Promise<Business | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await (admin.from("businesses") as unknown as BusinessQueryClient)
    .select("id,name,city,niche,website,instagram_handle,plan,status")
    .eq("owner_email", email)
    .limit(1);

  if (error || !data?.[0]) return null;
  return mapBusiness(data[0]);
}

export async function getBusinessForOwner(ownerId: string): Promise<Business> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return demoBusiness;
  }

  const { data, error } = await (supabase.from("businesses") as unknown as BusinessQueryClient)
    .select("id,name,city,niche,website,instagram_handle,plan,status")
    .eq("owner_id", ownerId)
    .limit(1);

  if (error || !data?.[0]) {
    return demoBusiness;
  }

  return mapBusiness(data[0]);
}
