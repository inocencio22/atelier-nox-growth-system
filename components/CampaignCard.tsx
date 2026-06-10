import { CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export function CampaignCard({
  campaign
}: {
  campaign: {
    title: string;
    segment: string;
    objective: string;
    channel: string;
    status: string;
    steps: string[];
  };
}) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-blue">{campaign.channel}</p>
          <h3 className="mt-2 text-xl font-black uppercase leading-none text-ink">{campaign.title}</h3>
          <p className="mt-2 text-sm font-semibold text-stone-500">{campaign.segment}</p>
        </div>
        <StatusBadge status={campaign.status} />
      </div>
      <p className="mt-4 border-2 border-ink bg-acid p-3 text-sm font-black leading-5 text-ink">
        {campaign.objective}
      </p>
      <ul className="mt-4 space-y-2">
        {campaign.steps.map((step) => (
          <li key={step} className="flex items-start gap-2 text-sm font-bold text-stone-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
            {step}
          </li>
        ))}
      </ul>
    </article>
  );
}
