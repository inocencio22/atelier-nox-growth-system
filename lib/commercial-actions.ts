import { DEMO_BUSINESS_ID } from "@/lib/business";
import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase.types";

export type CommercialActionStatus = Database["public"]["Tables"]["commercial_actions"]["Row"]["status"];
export type CommercialActionPriority = Database["public"]["Tables"]["commercial_actions"]["Row"]["priority"];

export type CommercialAction = {
  id: string;
  businessId: string;
  title: string;
  description: string;
  channel: string;
  status: CommercialActionStatus;
  priority: CommercialActionPriority;
  dueDate: string | null;
  estimatedValue: string;
  result: string | null;
  visibleToClient: boolean;
  createdAt: string;
};

type CommercialActionRow = Database["public"]["Tables"]["commercial_actions"]["Row"];
type CommercialActionQueryClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      order: (column: string, options: { ascending: boolean }) => Promise<{ data: CommercialActionRow[] | null; error: unknown }>;
    };
  };
};

const today = new Date();
const tomorrow = new Date(Date.now() + 86400000);
const nextWeek = new Date(Date.now() + 6 * 86400000);

const demoActions: CommercialAction[] = [
  {
    id: "action-demo-001",
    businessId: DEMO_BUSINESS_ID,
    title: "Relancer 8 clientes dormantes",
    description: "Préparer les messages retour couleur et proposer deux créneaux cette semaine.",
    channel: "WhatsApp",
    status: "todo",
    priority: "high",
    dueDate: today.toISOString().slice(0, 10),
    estimatedValue: "CHF 900",
    result: null,
    visibleToClient: true,
    createdAt: today.toISOString()
  },
  {
    id: "action-demo-002",
    businessId: DEMO_BUSINESS_ID,
    title: "Demander 6 avis Google",
    description: "Sélectionner clientes satisfaites et préparer un message court avec lien avis.",
    channel: "Google Business",
    status: "in_progress",
    priority: "medium",
    dueDate: tomorrow.toISOString().slice(0, 10),
    estimatedValue: "Réputation",
    result: "2 messages prêts à envoyer",
    visibleToClient: true,
    createdAt: today.toISOString()
  },
  {
    id: "action-demo-003",
    businessId: DEMO_BUSINESS_ID,
    title: "Transformer demandes de prix Instagram",
    description: "Répondre aux DM avec demande de photo, objectif souhaité et proposition de diagnostic.",
    channel: "Instagram",
    status: "waiting_approval",
    priority: "high",
    dueDate: tomorrow.toISOString().slice(0, 10),
    estimatedValue: "CHF 600",
    result: "Message à valider par le client",
    visibleToClient: true,
    createdAt: today.toISOString()
  },
  {
    id: "action-demo-004",
    businessId: DEMO_BUSINESS_ID,
    title: "Optimiser offre soin couleur",
    description: "Clarifier l'offre, bénéfice et appel à rendez-vous pour le prochain post.",
    channel: "Instagram",
    status: "done",
    priority: "low",
    dueDate: nextWeek.toISOString().slice(0, 10),
    estimatedValue: "Visibilité",
    result: "Angle validé: diagnostic couleur offert avec soin complet",
    visibleToClient: true,
    createdAt: today.toISOString()
  }
];

export async function getCommercialActions(businessId?: string): Promise<{
  actions: CommercialAction[];
  source: "mock" | "supabase";
}> {
  const targetBusinessId = businessId ?? DEMO_BUSINESS_ID;
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { actions: demoActions, source: "mock" };
  }

  const { data, error } = await (supabase.from("commercial_actions") as unknown as CommercialActionQueryClient)
    .select(
      "id,business_id,contact_id,onboarding_submission_id,title,description,channel,status,priority,due_date,estimated_value,result,visible_to_client,created_at,updated_at"
    )
    .eq("business_id", targetBusinessId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { actions: demoActions, source: "mock" };
  }

  return {
    actions: data.map((action) => ({
      id: action.id,
      businessId: action.business_id,
      title: action.title,
      description: action.description,
      channel: action.channel,
      status: action.status,
      priority: action.priority,
      dueDate: action.due_date,
      estimatedValue: action.estimated_value,
      result: action.result,
      visibleToClient: action.visible_to_client,
      createdAt: action.created_at
    })),
    source: "supabase"
  };
}

export function formatCommercialActionStatus(status: CommercialActionStatus) {
  const labels: Record<CommercialActionStatus, string> = {
    todo: "À faire",
    in_progress: "En cours",
    waiting_approval: "À approuver",
    done: "Terminé",
    blocked: "Bloqué"
  };

  return labels[status];
}

export function formatCommercialActionPriority(priority: CommercialActionPriority) {
  const labels: Record<CommercialActionPriority, string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Haute"
  };

  return labels[priority];
}
