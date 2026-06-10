import type { Metric } from "@/lib/data";

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-stone-600">{metric.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-4xl font-black text-ink">{metric.value}</strong>
        <span className="text-right text-xs font-black text-blue">{metric.trend}</span>
      </div>
      <p className="mt-2 text-sm text-stone-500">{metric.detail}</p>
    </article>
  );
}
