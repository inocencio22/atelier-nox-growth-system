import { leads } from "@/lib/data";

export function getSimulatedDiagnostic(leadId: string) {
  const lead = leads.find((item) => item.id === leadId) ?? leads[0];

  return {
    lead,
    title: `Diagnostic gratuit - ${lead.name}`,
    score: lead.score,
    summary:
      "Le salon possède déjà des signaux commerciaux utiles. La priorité est de convertir plus de visibilité locale en rendez-vous mesurables.",
    strengths: [
      "Présence locale identifiable à Lausanne.",
      "Base visuelle exploitable sur Instagram.",
      "Potentiel de relance auprès des clientes existantes."
    ],
    risks: [
      "Réservation et appel à l'action trop peu visibles.",
      "Avis et preuves sociales insuffisamment activés.",
      "Contacts clients non structurés pour le follow-up."
    ],
    actions: [
      "Importer les contacts existants.",
      "Créer 5 relances personnalisées.",
      "Optimiser le profil Instagram et Google.",
      ...lead.opportunities.slice(0, 2)
    ]
  };
}
