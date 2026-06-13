import type { LeadStatus } from "@/lib/data";
import clsx from "clsx";

const labels: Record<LeadStatus | string, string> = {
  prioritaire: "Prioritaire",
  a_contacter: "À contacter",
  diagnostic: "Diagnostic",
  proposition: "Proposition",
  gagne: "Gagné",
  a_relancer: "À relancer",
  client_fidele: "Fidèle",
  nouveau: "Nouveau",
  demande_prix: "Demande prix",
  avis_demande: "Avis Google",
  new: "Nouveau",
  diagnostic_ready: "Prêt",
  contacted: "Contacté",
  won: "Gagné",
  lost: "Perdu",
  Brouillon: "Brouillon",
  Envoyee: "Envoyée",
  "A valider": "À valider",
  Gagne: "Gagné",
  Perdu: "Perdu",
  todo: "À faire",
  in_progress: "En cours",
  waiting_approval: "À approuver",
  done: "Terminé",
  blocked: "Bloqué",
  idea: "Idée",
  draft: "Brouillon",
  approved: "Approuvé",
  published: "Publié",
  active: "Actif",
  trial: "Essai",
  paused: "En pause",
  cancelled: "Annulé"
};

const styles: Record<string, string> = {
  // Pipeline statuses
  new:              "bg-[#f0faf5] text-[#12382F] border border-[#c6e8d5]",
  diagnostic_ready: "bg-[#12382F] text-white border border-[#12382F]",
  contacted:        "bg-[#fffbeb] text-[#92400e] border border-[#fde68a]",
  won:              "bg-[#dcfce7] text-[#166534] border border-[#86efac]",
  lost:             "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]",
  // Contact statuses
  a_relancer:       "bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa]",
  client_fidele:    "bg-[#dcfce7] text-[#166534] border border-[#86efac]",
  nouveau:          "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]",
  demande_prix:     "bg-[#fffbeb] text-[#92400e] border border-[#fde68a]",
  avis_demande:     "bg-[#f5f3ff] text-[#6d28d9] border border-[#ddd6fe]",
  // Action statuses
  todo:             "bg-[#f8f7f2] text-stone-500 border border-[#e8e5dd]",
  in_progress:      "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]",
  waiting_approval: "bg-[#E85D2A] text-white border border-[#E85D2A]",
  done:             "bg-[#dcfce7] text-[#166534] border border-[#86efac]",
  blocked:          "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]",
  // Content statuses
  idea:             "bg-[#f8f7f2] text-stone-400 border border-[#e8e5dd]",
  draft:            "bg-[#fffbeb] text-[#92400e] border border-[#fde68a]",
  approved:         "bg-[#dcfce7] text-[#166534] border border-[#86efac]",
  published:        "bg-[#12382F] text-white border border-[#12382F]",
  // Client statuses
  active:           "bg-[#dcfce7] text-[#166534] border border-[#86efac]",
  trial:            "bg-[#fffbeb] text-[#92400e] border border-[#fde68a]",
  paused:           "bg-[#f8f7f2] text-stone-400 border border-[#e8e5dd]",
  cancelled:        "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]",
  // Lead statuses
  prioritaire:      "bg-[#E85D2A] text-white border border-[#E85D2A]",
  a_contacter:      "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]",
  diagnostic:       "bg-[#fffbeb] text-[#92400e] border border-[#fde68a]",
  proposition:      "bg-[#f5f3ff] text-[#6d28d9] border border-[#ddd6fe]",
  gagne:            "bg-[#dcfce7] text-[#166534] border border-[#86efac]",
  Brouillon:        "bg-[#f8f7f2] text-stone-500 border border-[#e8e5dd]",
  Envoyee:          "bg-[#dcfce7] text-[#166534] border border-[#86efac]",
  "A valider":      "bg-[#fffbeb] text-[#92400e] border border-[#fde68a]",
  Gagne:            "bg-[#dcfce7] text-[#166534] border border-[#86efac]",
  Perdu:            "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]"
};

export function StatusBadge({ status }: { status: LeadStatus | string }) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]",
        styles[status] ?? "bg-[#f8f7f2] text-stone-400 border border-[#e8e5dd]"
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
