import { getSupabaseClient } from "@/lib/supabase";

export type RapportMetric = {
  label: string;
  value: string;
  detail: string;
  icon: string;
};

const mockMetrics: RapportMetric[] = [
  { label: "Actions terminées", value: "14", detail: "Ce mois-ci", icon: "check" },
  { label: "Contenus publiés", value: "6", detail: "Posts & reels", icon: "clapperboard" },
  { label: "Clients actifs", value: "2", detail: "Service en cours", icon: "users" },
  { label: "Demandes converties", value: "3", detail: "Depuis le début", icon: "inbox" }
];

export async function getRapportMetrics(): Promise<{
  metrics: RapportMetric[];
  source: "mock" | "supabase";
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { metrics: mockMetrics, source: "mock" };
  }

  const [actionsRes, contentsRes, businessesRes, demandesRes] = await Promise.all([
    supabase.from("commercial_actions").select("id", { count: "exact", head: true }).eq("status", "done"),
    supabase.from("content_items").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("onboarding_submissions").select("id", { count: "exact", head: true }).eq("status", "won")
  ]);

  return {
    metrics: [
      { label: "Actions terminées", value: String(actionsRes.count ?? 0), detail: "Total cumulé", icon: "check" },
      { label: "Contenus publiés", value: String(contentsRes.count ?? 0), detail: "Posts & reels", icon: "clapperboard" },
      { label: "Clients actifs", value: String(businessesRes.count ?? 0), detail: "Service en cours", icon: "users" },
      { label: "Demandes converties", value: String(demandesRes.count ?? 0), detail: "Depuis le début", icon: "inbox" }
    ],
    source: "supabase"
  };
}
