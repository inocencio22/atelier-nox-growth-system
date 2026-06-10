import { ExternalLink, MapPin, Sparkles } from "lucide-react";
import type { Lead } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-ink">{lead.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {lead.quartier}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>
      <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
        <span className="font-semibold text-ink">Score</span>
        <span className="text-stone-600">{lead.score}/100</span>
        <span className="font-semibold text-ink">Web</span>
        <span className="flex min-w-0 items-center gap-1 text-stone-600">
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{lead.website}</span>
        </span>
        <span className="font-semibold text-ink">IG</span>
        <span className="text-stone-600">{lead.instagram}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-600">{lead.notes}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {lead.opportunities.slice(0, 2).map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 border border-line bg-mist px-2.5 py-1 text-xs font-bold text-ink"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
