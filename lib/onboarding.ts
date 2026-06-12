import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Database } from "@/lib/supabase.types";

export type OnboardingStatus = Database["public"]["Tables"]["onboarding_submissions"]["Row"]["status"];

export type OnboardingSubmission = {
  id: string;
  ownerEmail: string;
  ownerName: string | null;
  businessName: string;
  city: string;
  niche: string;
  website: string | null;
  instagramHandle: string | null;
  mainObjective: string;
  desiredPlan: string;
  notes: string | null;
  status: OnboardingStatus;
  createdAt: string;
};

type OnboardingRow = Database["public"]["Tables"]["onboarding_submissions"]["Row"];
type OnboardingQueryClient = {
  select: (columns: string) => {
    order: (
      column: string,
      options: { ascending: boolean }
    ) => Promise<{ data: OnboardingRow[] | null; error: unknown }>;
  };
};

const demoSubmissions: OnboardingSubmission[] = [
  {
    id: "demo-onboarding-001",
    ownerEmail: "contact@bellerive-coiffure.ch",
    ownerName: "Claire Dubois",
    businessName: "Salon Belle Rive",
    city: "Lausanne - Ouchy",
    niche: "Coiffure",
    website: "https://bellerive-coiffure.ch",
    instagramHandle: "@bellerivehair",
    mainObjective: "rendez_vous",
    desiredPlan: "growth",
    notes: "Instagram reçoit des demandes de prix, mais peu deviennent des rendez-vous.",
    status: "new",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo-onboarding-002",
    ownerEmail: "hello@maisoncoloriste.ch",
    ownerName: "Amélie Rochat",
    businessName: "Maison Coloriste",
    city: "Pully",
    niche: "Coloration premium",
    website: "https://maisoncoloriste.ch",
    instagramHandle: "@maisoncoloriste",
    mainObjective: "relancer_contacts",
    desiredPlan: "pro_local",
    notes: "Besoin de réactiver une base de clientes existantes sans promotions agressives.",
    status: "diagnostic_ready",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export async function getOnboardingSubmissions(): Promise<{
  submissions: OnboardingSubmission[];
  source: "mock" | "supabase";
}> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { submissions: demoSubmissions, source: "mock" };
  }

  const { data, error } = await (supabase.from("onboarding_submissions") as unknown as OnboardingQueryClient)
    .select(
      "id,owner_email,owner_name,business_name,city,niche,website,instagram_handle,main_objective,desired_plan,notes,status,created_at,updated_at"
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { submissions: demoSubmissions, source: "mock" };
  }

  return {
    submissions: data.map((row) => ({
      id: row.id,
      ownerEmail: row.owner_email,
      ownerName: row.owner_name,
      businessName: row.business_name,
      city: row.city,
      niche: row.niche,
      website: row.website,
      instagramHandle: row.instagram_handle,
      mainObjective: row.main_objective,
      desiredPlan: row.desired_plan,
      notes: row.notes,
      status: row.status,
      createdAt: row.created_at
    })),
    source: "supabase"
  };
}

export async function getOnboardingSubmissionById(id: string): Promise<{
  submission: OnboardingSubmission | null;
  source: "mock" | "supabase";
}> {
  const { submissions, source } = await getOnboardingSubmissions();

  return {
    submission: submissions.find((item) => item.id === id) ?? null,
    source
  };
}

export function generateSubmissionDiagnostic(submission: OnboardingSubmission) {
  const objective = formatObjective(submission.mainObjective).toLowerCase();
  const plan = formatDesiredPlan(submission.desiredPlan);
  const hasInstagram = Boolean(submission.instagramHandle);
  const hasWebsite = Boolean(submission.website);
  const score = 62 + (hasInstagram ? 9 : 0) + (hasWebsite ? 8 : 0) + (submission.notes ? 6 : 0);

  return {
    title: `Diagnostic gratuit - ${submission.businessName}`,
    score: Math.min(score, 91),
    summary: `${submission.businessName} a une opportunité claire: ${objective}. La priorité est de transformer la visibilité existante en actions simples, mesurables et répétables.`,
    strengths: [
      `${submission.city} donne un contexte local précis pour cibler la clientèle proche.`,
      hasInstagram
        ? "Instagram peut devenir un canal de conversation commerciale."
        : "Le diagnostic peut définir une présence Instagram minimale et crédible.",
      hasWebsite
        ? "Le site web peut soutenir la prise de rendez-vous."
        : "Une page simple peut clarifier l'offre et rassurer avant le contact."
    ],
    risks: [
      "Les demandes peuvent rester dispersées entre Instagram, téléphone et messages.",
      "Sans suivi, les clients dormants et demandes de prix ne deviennent pas des rendez-vous.",
      "Une communication trop générique réduit la confiance et la conversion."
    ],
    actions: [
      "Structurer les contacts en trois segments: nouveaux, dormants, demandes de prix.",
      "Préparer 3 messages personnalisés validés manuellement.",
      "Créer une action Instagram orientée rendez-vous pour les 7 prochains jours.",
      "Mesurer réponses, rendez-vous estimés et valeur potentielle chaque semaine."
    ],
    suggestedProposal: {
      title: `Plan recommandé - ${submission.businessName}`,
      lead: submission.businessName,
      price: plan.includes("Managed Growth")
        ? "CHF 390/mois"
        : plan.includes("Done For You Local")
          ? "CHF 690/mois"
          : "CHF 190/mois",
      status: "Brouillon",
      summary:
        "Diagnostic mensuel, organisation des contacts, messages de relance, actions Instagram/Google et rapport simple orienté rendez-vous."
    },
    outreachScript: `Bonjour ${submission.ownerName ?? ""}, j'ai préparé une première lecture pour ${submission.businessName}. L'idée est simple: identifier les actions qui peuvent transformer votre visibilité actuelle en rendez-vous, sans outil compliqué ni messages automatiques.`
  };
}

export function formatObjective(value: string) {
  const labels: Record<string, string> = {
    plus_clients: "Gagner plus de clients",
    rendez_vous: "Créer plus de rendez-vous",
    relancer_contacts: "Relancer les contacts dormants",
    instagram: "Mieux convertir Instagram",
    avis_google: "Améliorer les avis Google"
  };

  return labels[value] ?? value;
}

export function formatDesiredPlan(value: string) {
  const labels: Record<string, string> = {
    essentiel: "Local Clarity - CHF 190/mois",
    growth: "Managed Growth - CHF 390/mois",
    pro_local: "Done For You Local - CHF 690/mois",
    pas_encore: "Échantillon gratuit d'abord"
  };

  return labels[value] ?? value;
}
