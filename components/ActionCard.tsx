import clsx from "clsx";

const accentStyles: Record<string, string> = {
  acid: "border-t-acid",
  blue: "border-t-blue",
  coral: "border-t-coral",
  yellow: "border-t-yellow"
};

export function ActionCard({
  action
}: {
  action: { title: string; impact: string; detail: string; accent: string };
}) {
  return (
    <article className={clsx("border-2 border-t-[18px] border-ink bg-white p-4 shadow-soft", accentStyles[action.accent])}>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-blue">{action.impact}</p>
      <h3 className="mt-3 text-xl font-black leading-none text-ink">{action.title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">{action.detail}</p>
    </article>
  );
}
