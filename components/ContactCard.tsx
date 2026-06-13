import { Mail, MessageCircle, Phone, ShieldCheck, ShieldX } from "lucide-react";
import type { CustomerContact } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

const statusLabels: Record<string, string> = {
  a_relancer: "À relancer",
  nouveau: "Nouveau",
  demande_prix: "Demande prix",
  avis_demande: "Avis Google",
  client_fidele: "Client fidèle"
};

const channelIcon: Record<string, React.ReactNode> = {
  WhatsApp: <MessageCircle className="h-3.5 w-3.5" />,
  Email: <Mail className="h-3.5 w-3.5" />,
  Téléphone: <Phone className="h-3.5 w-3.5" />,
  Instagram: <span className="text-[11px] font-black">IG</span>
};

export function ContactCard({ contact }: { contact: CustomerContact }) {
  const waLink = contact.phone
    ? `https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`
    : null;

  const emailLink = contact.channel === "Email" && contact.name
    ? `mailto:?subject=Atelier Nox — ${encodeURIComponent(contact.name)}`
    : null;

  const hasAction = waLink || emailLink || contact.phone;

  return (
    <article className="flex flex-col border-2 border-ink bg-white p-4 shadow-soft">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-ink">{contact.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-stone-500">
            <span className="flex items-center gap-1">
              {channelIcon[contact.channel]}
              {contact.channel}
            </span>
            <span className="text-stone-300">·</span>
            <span>{contact.lastInteraction}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge status={contact.status} />
          <span className="text-[10px] font-black uppercase text-stone-400">
            {statusLabels[contact.status] ?? contact.status}
          </span>
        </div>
      </div>

      {/* Phone if available */}
      {contact.phone ? (
        <p className="mt-2 text-xs font-bold text-stone-500">
          <Phone className="mr-1 inline h-3 w-3" />
          {contact.phone}
        </p>
      ) : null}

      {/* Next action */}
      <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-stone-700">{contact.nextAction}</p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <span className="text-sm font-black text-ink">{contact.value}</span>
        <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-stone-500">
          {contact.consent
            ? <ShieldCheck className="h-4 w-4 text-green" />
            : <ShieldX className="h-4 w-4 text-coral" />}
          {contact.consent ? "Consent. OK" : "À vérifier"}
        </span>
      </div>

      {/* Quick actions */}
      {hasAction ? (
        <div className="mt-3 flex gap-2">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 border border-[#12382F] bg-[#12382F] px-3 py-2 text-[10px] font-black uppercase text-white transition hover:bg-[#0d1a14]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          ) : null}
          {emailLink ? (
            <a
              href={emailLink}
              className="flex flex-1 items-center justify-center gap-1.5 border border-ink bg-paper px-3 py-2 text-[10px] font-black uppercase text-ink transition hover:bg-acid"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
          ) : null}
          {contact.phone && !waLink ? (
            <a
              href={`tel:${contact.phone}`}
              className="flex flex-1 items-center justify-center gap-1.5 border border-ink bg-paper px-3 py-2 text-[10px] font-black uppercase text-ink transition hover:bg-acid"
            >
              <Phone className="h-3.5 w-3.5" />
              Appeler
            </a>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-[10px] font-black uppercase text-stone-300">
          Pas de contact direct — ajouter un numéro ou email
        </p>
      )}
    </article>
  );
}
