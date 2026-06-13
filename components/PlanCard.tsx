import Link from "next/link";
import { Check } from "lucide-react";
import clsx from "clsx";

export function PlanCard({
  plan
}: {
  plan: {
    name: string;
    price: string;
    rhythm: string;
    description: string;
    positioning?: string;
    features: string[];
    note?: string;
    highlighted?: boolean;
  };
}) {
  const hl = plan.highlighted;

  return (
    <article
      className={clsx(
        "border border-[#12382F] p-5",
        hl
          ? "bg-[#12382F] text-white shadow-[6px_6px_0_#E85D2A]"
          : "bg-[#fffaf0] shadow-[6px_6px_0_rgba(18,56,47,0.18)]"
      )}
    >
      <p className={clsx("text-xs font-black uppercase tracking-[0.14em]", hl ? "text-[#E85D2A]" : "text-[#E85D2A]")}>
        {plan.name}
      </p>
      <div className="mt-4 flex items-end gap-2">
        <strong className={clsx("text-4xl font-black", hl ? "text-white" : "text-[#101820]")}>{plan.price}</strong>
        <span className={clsx("pb-1 text-sm font-black", hl ? "text-white/70" : "text-[#12382F]")}>{plan.rhythm}</span>
      </div>
      <p className={clsx("mt-3 min-h-12 text-sm font-semibold leading-6", hl ? "text-white/85" : "text-[#12382F]")}>
        {plan.description}
      </p>
      {plan.positioning ? (
        <p
          className={clsx(
            "mt-3 border px-3 py-2 text-xs font-black uppercase leading-5",
            hl ? "border-white/20 bg-white/10 text-white" : "border-[#D9D3C7] bg-[#F5F1E8] text-[#12382F]"
          )}
        >
          {plan.positioning}
        </p>
      ) : null}
      <ul className="mt-5 space-y-2">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={clsx("flex items-start gap-2 text-sm font-bold", hl ? "text-white" : "text-[#101820]")}
          >
            <Check
              className={clsx("mt-0.5 h-4 w-4 shrink-0", hl ? "text-[#E85D2A]" : "text-[#12382F]")}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>
      {plan.note ? (
        <p className={clsx("mt-5 text-xs font-bold leading-5", hl ? "text-white/60" : "text-stone-600")}>{plan.note}</p>
      ) : null}

      {hl && (
        <Link
          href="/diagnostic-gratuit"
          className="mt-6 flex w-full items-center justify-center border border-white/30 bg-[#E85D2A] px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-[#d44e22]"
        >
          Commencer avec ce plan
        </Link>
      )}
    </article>
  );
}
