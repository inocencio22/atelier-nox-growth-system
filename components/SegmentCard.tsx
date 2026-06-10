import { ArrowRight } from "lucide-react";

export function SegmentCard({
  segment
}: {
  segment: {
    name: string;
    count: number;
    value: string;
    goal: string;
    recommendedAction: string;
    status: string;
  };
}) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-blue">{segment.status}</p>
          <h3 className="mt-2 text-2xl font-black uppercase leading-none text-ink">{segment.name}</h3>
        </div>
        <strong className="border-2 border-ink bg-acid px-3 py-2 text-xl font-black">{segment.count}</strong>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">{segment.goal}</p>
      <div className="mt-4 border-t-2 border-line pt-4">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-stone-500">Valeur / impact</p>
        <p className="mt-1 text-lg font-black text-ink">{segment.value}</p>
      </div>
      <div className="mt-4 flex items-start gap-2 bg-paper p-3">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
        <p className="text-sm font-bold leading-5 text-ink">{segment.recommendedAction}</p>
      </div>
    </article>
  );
}
