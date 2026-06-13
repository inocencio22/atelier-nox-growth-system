import type { Metric } from "@/lib/data";

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-400">{metric.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-4xl font-black text-[#0d1a14]">{metric.value}</strong>
        <span className="text-right text-xs font-bold text-[#E85D2A]">{metric.trend}</span>
      </div>
      <p className="mt-1.5 text-sm text-stone-500">{metric.detail}</p>
    </article>
  );
}
