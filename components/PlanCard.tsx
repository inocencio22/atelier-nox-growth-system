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
        "border border-[#12382F] bg-[#fffaf0] p-5 shadow-[6px_6px_0_rgba(18,56,47,0.18)]",
        plan.highlighted && "bg-[#12382F] text-white shadow-[6px_6px_0_#E85D2A]"
      )}
    >
      <p
        className={clsx(
          "text-xs font-black uppercase tracking-[0.14em]",
          plan.highlighted ? "text-[#F5F1E8]" : "text-[#E85D2A]"
        )}
      >
        {plan.name}
      </p>
      <div className="mt-4 flex items-end gap-2">
        <strong className={clsx("text-4xl font-black", plan.highlighted ? "text-white" : "text-[#101820]")}>
          {plan.price}
        </strong>
        <span className={clsx("pb-1 text-sm font-black", plan.highlighted ? "text-[#D9D3C7]" : "text-[#12382F]")}>
          {plan.rhythm}
        </span>
      </div>
      <p
        className={clsx(
          "mt-3 min-h-12 text-sm font-semibold leading-6",
          plan.highlighted ? "text-[#F5F1E8]" : "text-[#12382F]"
        )}
      >
        {plan.description}
      </p>
      <ul className="mt-5 space-y-2">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={clsx(
              "flex items-start gap-2 text-sm font-bold",
              plan.highlighted ? "text-white" : "text-[#101820]"
            )}
          >
            <Check
              className={clsx("mt-0.5 h-4 w-4 shrink-0", plan.highlighted ? "text-[#E85D2A]" : "text-[#12382F]")}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
