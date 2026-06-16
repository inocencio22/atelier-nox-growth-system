import { createAdminClient } from "@/lib/admin-client";
import type { Database } from "@/lib/supabase.types";

export type ClientBusinessPlan = Database["public"]["Tables"]["businesses"]["Row"]["plan"];
export type ClientBusinessStatus = Database["public"]["Tables"]["businesses"]["Row"]["status"];

export type ClientBusiness = {
  id: string;
  ownerEmail: string | null;
  name: string;
  city: string;
  niche: string;
  website: string | null;
  instagramHandle: string | null;
  plan: ClientBusinessPlan;
  status: ClientBusinessStatus;
  createdAt: string;
  updatedAt: string;
};

type ClientBusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
type ClientBusinessQueryClient = {
  select: (columns: string) => {
    order: (column: string, options: { ascending: boolean }) => Promise<{ data: ClientBusinessRow[] | null; error: unknown }>;
    eq: (column: string, value: string) => {
      single: () => Promise<{ data: ClientBusinessRow | null; error: unknown }>;
    };
  };
};

const now = new Date().toISOString();
const sixteenDaysAgo = new Date(Date.now() - 16 * 86400000).toISOString();

const demoClientBusinesses: ClientBusiness[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    ownerEmail: "demo@ateliernox.ch",
    name: "Atelier Coupe Lausanne",
    city: "Lausanne",
    niche: "coiffure",
    website: "atelier-coupe.ch",
    instagramHandle: "@ateliercoupe_lsn",
    plan: "demo",
    status: "trial",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "demo-business-002",
    ownerEmail: "contact@bellerive.ch",
    name: "Salon Belle Rive",
    city: "Ouchy",
    niche: "coiffure premium",
    website: "bellerive-coiffure.ch",
    instagramHandle: "@bellerivehair",
    plan: "growth",
    status: "active",
    createdAt: sixteenDaysAgo,
    updatedAt: sixteenDaysAgo
  },
  {
    id: "demo-business-003",
    ownerEmail: "hello@studiolocal.ch",
    name: "Studio Local Care",
    city: "Lausanne",
    niche: "bien-etre",
    website: null,
    instagramHandle: "@studiolocalcare",
    plan: "essentiel",
    status: "paused",
    createdAt: now,
    updatedAt: now
  }
];

function mapClientBusiness(row: ClientBusinessRow): ClientBusiness {
  return {
    id: row.id,
    ownerEmail: row.owner_email,
    name: row.name,
    city: row.city,
    niche: row.niche,
    website: row.website,
    instagramHandle: row.instagram_handle,
    plan: row.plan,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getClientBusinesses(): Promise<{
  clients: ClientBusiness[];
  source: "mock" | "supabase";
}> {
  const admin = createAdminClient();

  if (!admin) {
    return { clients: demoClientBusinesses, source: "mock" };
  }

  const { data, error } = await (admin.from("businesses") as unknown as ClientBusinessQueryClient)
    .select("id,owner_id,owner_email,name,city,niche,website,instagram_handle,plan,status,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return { clients: demoClientBusinesses, source: "mock" };
  }

  return { clients: data.map(mapClientBusiness), source: "supabase" };
}

export async function getClientBusinessById(id: string): Promise<{
  client: ClientBusiness | null;
  source: "mock" | "supabase";
}> {
  const admin = createAdminClient();

  if (!admin) {
    return {
      client: demoClientBusinesses.find((client) => client.id === id) ?? null,
      source: "mock"
    };
  }

  const { data, error } = await (admin.from("businesses") as unknown as ClientBusinessQueryClient)
    .select("id,owner_id,owner_email,name,city,niche,website,instagram_handle,plan,status,created_at,updated_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return {
      client: demoClientBusinesses.find((client) => client.id === id) ?? null,
      source: "mock"
    };
  }

  return { client: mapClientBusiness(data), source: "supabase" };
}

export function formatClientPlan(plan: ClientBusinessPlan) {
  const labels: Record<ClientBusinessPlan, string> = {
    demo: "Demo",
    essentiel: "Local Clarity",
    growth: "Managed Growth",
    pro_local: "Done For You Local",
    partner: "Partner"
  };

  return labels[plan];
}

export function formatClientStatus(status: ClientBusinessStatus) {
  const labels: Record<ClientBusinessStatus, string> = {
    active: "Actif",
    trial: "Essai",
    paused: "Pause",
    cancelled: "Annule"
  };

  return labels[status];
}

export function getClientNextStep(client: ClientBusiness) {
  if (client.status === "trial") {
    return "Transformer l\u2019essai en plan mensuel avec une preuve claire.";
  }

  if (client.status === "paused") {
    return "Comprendre le blocage et proposer une action simple a CHF 190.";
  }

  if (!client.website || !client.instagramHandle) {
    return "Completer les actifs de base avant le prochain plan d\u2019action.";
  }

  if (client.plan === "essentiel") {
    return "Livrer le rapport mensuel et proposer une montee vers Managed Growth.";
  }

  return "Maintenir le rythme: actions, contenus, validations et rapport mensuel.";
}
