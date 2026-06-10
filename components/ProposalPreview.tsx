import { FileText } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

type ProposalPreviewProps = {
  proposal: {
    title: string;
    lead: string;
    price: string;
    status: string;
    summary: string;
  };
};

export function ProposalPreview({ proposal }: ProposalPreviewProps) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink bg-blue text-white">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-black text-ink">{proposal.title}</h3>
            <p className="mt-1 text-sm text-stone-500">{proposal.lead}</p>
          </div>
        </div>
        <StatusBadge status={proposal.status} />
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-600">{proposal.summary}</p>
      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
        <span className="text-sm text-stone-500">Valeur proposée</span>
        <strong className="text-lg text-ink">{proposal.price}</strong>
      </div>
    </article>
  );
}
