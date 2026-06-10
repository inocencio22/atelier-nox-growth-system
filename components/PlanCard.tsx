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
    features: string[];
    highlighted?: boolean;
  };
}) {
  return (
    <article
      className={clsx(
        "border-2 border-ink bg-white p-5 shadow-soft",
        plan.highlighted && "bg-acid"
      )}
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">{plan.name}</p>
      <div className="mt-4 flex items-end gap-2">
        <strong className="text-4xl font-black text-ink">{plan.price}</strong>
        <span className="pb-1 text-sm font-black text-stone-600">{plan.rhythm}</span>
      </div>
      <p className="mt-3 min-h-12 text-sm font-semibold leading-6 text-stone-700">{plan.description}</p>
      <ul className="mt-5 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm font-bold text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
