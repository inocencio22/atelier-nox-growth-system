import { proposals as mockProposals } from "@/lib/data";
import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase.types";

type ProposalRow = Database["public"]["Tables"]["proposals"]["Row"];
type ProposalQueryClient = {
  select: (columns: string) => {
    order: (column: string, options: { ascending: boolean }) => Promise<{ data: ProposalRow[] | null; error: unknown }>;
  };
};

const statusLabels: Record<ProposalRow["status"], string> = {
  draft: "Brouillon",
  sent: "Envoyée",
  accepted: "Gagné",
  declined: "Perdu"
};

export async function getProposals(): Promise<{
  proposals: typeof mockProposals;
  source: "mock" | "supabase";
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { proposals: mockProposals, source: "mock" };
  }

  const { data, error } = await (supabase.from("proposals") as unknown as ProposalQueryClient)
    .select("id,onboarding_submission_id,diagnostic_id,title,lead,price,status,summary,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error || !data || !data.length) {
    return { proposals: mockProposals, source: "mock" };
  }

  return {
    proposals: data.map((proposal) => ({
      title: proposal.title,
      lead: proposal.lead,
      price: proposal.price,
      status: statusLabels[proposal.status],
      summary: proposal.summary
    })),
    source: "supabase"
  };
}
