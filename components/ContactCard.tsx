import { ShieldCheck, ShieldX } from "lucide-react";
import type { CustomerContact } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

export function ContactCard({ contact }: { contact: CustomerContact }) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-ink">{contact.name}</h3>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            {contact.channel} · {contact.lastInteraction}
          </p>
        </div>
        <StatusBadge status={contact.status} />
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-stone-700">{contact.nextAction}</p>
      <div className="mt-4 flex items-center justify-between border-t-2 border-line pt-3">
        <span className="text-sm font-black text-ink">{contact.value}</span>
        <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-stone-600">
          {contact.consent ? <ShieldCheck className="h-4 w-4 text-green" /> : <ShieldX className="h-4 w-4 text-coral" />}
          {contact.consent ? "Consentement OK" : "À vérifier"}
        </span>
      </div>
    </article>
  );
}
