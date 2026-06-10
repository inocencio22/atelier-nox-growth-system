import type { LeadStatus } from "@/lib/data";
import clsx from "clsx";

const labels: Record<LeadStatus | string, string> = {
  prioritaire: "Prioritaire",
  a_contacter: "A contacter",
  diagnostic: "Diagnostic",
  proposition: "Proposition",
  gagne: "Gagne",
  a_relancer: "A relancer",
  client_fidele: "Client fidele",
  nouveau: "Nouveau",
  demande_prix: "Demande prix",
  avis_demande: "Avis demande",
  new: "Nouveau",
  diagnostic_ready: "Diagnostic pret",
  contacted: "Contacte",
  won: "Gagne",
  lost: "Perdu",
  Brouillon: "Brouillon",
  Envoyee: "Envoyee",
  "A valider": "A valider",
  Gagne: "Gagne",
  Perdu: "Perdu",
  todo: "A faire",
  in_progress: "En cours",
  waiting_approval: "A approuver",
  done: "Termine",
  blocked: "Bloque",
  idea: "Idee",
  draft: "Brouillon",
  approved: "Approuve",
  published: "Publie",
  active: "Actif",
  trial: "Essai",
  paused: "Pause",
  cancelled: "Annule"
};

const styles: Record<string, string> = {
  prioritaire: "bg-acid text-ink ring-ink",
  a_contacter: "bg-cyan text-ink ring-ink",
  diagnostic: "bg-yellow text-ink ring-ink",
  proposition: "bg-violet text-white ring-ink",
  gagne: "bg-green text-ink ring-ink",
  a_relancer: "bg-coral text-ink ring-ink",
  client_fidele: "bg-green text-ink ring-ink",
  nouveau: "bg-cyan text-ink ring-ink",
  demande_prix: "bg-yellow text-ink ring-ink",
  avis_demande: "bg-blue text-white ring-ink",
  new: "bg-acid text-ink ring-ink",
  diagnostic_ready: "bg-blue text-white ring-ink",
  contacted: "bg-yellow text-ink ring-ink",
  won: "bg-green text-ink ring-ink",
  lost: "bg-coral text-ink ring-ink",
  Brouillon: "bg-white text-ink ring-ink",
  Envoyee: "bg-green text-ink ring-ink",
  "A valider": "bg-yellow text-ink ring-ink",
  Gagne: "bg-green text-ink ring-ink",
  Perdu: "bg-coral text-ink ring-ink",
  todo: "bg-white text-ink ring-ink",
  in_progress: "bg-yellow text-ink ring-ink",
  waiting_approval: "bg-blue text-white ring-ink",
  done: "bg-green text-ink ring-ink",
  blocked: "bg-coral text-ink ring-ink",
  idea: "bg-white text-ink ring-ink",
  draft: "bg-yellow text-ink ring-ink",
  approved: "bg-green text-ink ring-ink",
  published: "bg-blue text-white ring-ink",
  active: "bg-green text-ink ring-ink",
  trial: "bg-yellow text-ink ring-ink",
  paused: "bg-white text-ink ring-ink",
  cancelled: "bg-coral text-ink ring-ink"
};

export function StatusBadge({ status }: { status: LeadStatus | string }) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center border border-ink px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.04em] ring-1",
        styles[status] ?? "bg-mist text-ink ring-stone-200"
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
