import Link from "next/link";
import { Search } from "lucide-react";
import { ContactCard } from "@/components/ContactCard";
import { ContactImportPanel } from "@/components/ContactImportPanel";
import { PageHeader } from "@/components/PageHeader";
import { createContact } from "@/lib/contact-actions";
import { getContacts } from "@/lib/contacts";

const statusFilters = [
  { value: "", label: "Tous" },
  { value: "a_relancer", label: "À relancer" },
  { value: "nouveau", label: "Nouveaux" },
  { value: "avis_demande", label: "Avis" },
  { value: "client_fidele", label: "Fidèles" }
];

const statusLabels: Record<string, string> = {
  a_relancer: "À relancer",
  nouveau: "Nouveau",
  demande_prix: "Demande prix",
  avis_demande: "Avis Google",
  client_fidele: "Client fidèle"
};

type ContactsPageProps = {
  searchParams?: Promise<{ status?: string; q?: string }>;
};

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const params = await searchParams;
  const activeStatus = params?.status ?? "";
  const searchQuery = params?.q ?? "";

  const { contacts, source } = await getContacts(undefined, {
    status: activeStatus || undefined,
    search: searchQuery || undefined
  });

  const isDemo = source === "mock";
  const totalContacts = (await getContacts()).contacts;
  const toRelance = totalContacts.filter((c) => c.status === "a_relancer").length;
  const consentOk = totalContacts.filter((c) => c.consent).length;

  return (
    <>
      <PageHeader
        eyebrow="CRM local"
        title="Contacts clients"
        description="Base simple pour savoir qui relancer, par quel canal, avec quel potentiel et quel consentement."
      />

      {isDemo ? (
        <section className="mb-6 border border-[#dedad2] bg-[#fffbeb] p-4">
          <p className="text-sm font-black uppercase text-ink">Mode démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Supabase non configuré. La liste utilise des contacts d&apos;exemple.
          </p>
        </section>
      ) : null}

      {/* Metrics */}
      <section className="mb-6 grid gap-3 md:grid-cols-3">
        {[
          ["Contacts", totalContacts.length.toString(), "Base totale"],
          ["À relancer", toRelance.toString(), "Priorité cette semaine"],
          ["Consentement OK", consentOk.toString(), "Marketing autorisé"]
        ].map(([label, value, detail]) => (
          <article key={label} className="border border-[#dedad2] bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
            <strong className="mt-1 block text-4xl font-black text-ink">{value}</strong>
            <p className="mt-1 text-xs font-semibold text-stone-400">{detail}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">

        {/* Left: form + import */}
        <div className="flex flex-col gap-6">
          <form action={createContact} className="border border-[#dedad2] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black uppercase leading-none text-ink">Ajouter un contact</h2>
            <div className="mt-4 grid gap-3">
              <Field label="Nom" name="name" placeholder="Sophie Martin" required />
              <Field label="WhatsApp / Téléphone" name="phone" placeholder="+41 79 000 00 00" type="tel" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select
                  label="Canal principal"
                  name="channel"
                  options={[
                    { value: "Instagram", label: "Instagram" },
                    { value: "WhatsApp", label: "WhatsApp" },
                    { value: "Email", label: "Email" },
                    { value: "Téléphone", label: "Téléphone" }
                  ]}
                />
                <Select
                  label="Statut"
                  name="status"
                  options={[
                    { value: "a_relancer", label: "À relancer" },
                    { value: "nouveau", label: "Nouveau" },
                    { value: "demande_prix", label: "Demande prix" },
                    { value: "avis_demande", label: "Avis Google" },
                    { value: "client_fidele", label: "Client fidèle" }
                  ]}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Dernier contact" name="lastInteraction" placeholder="Il y a 30 jours" />
                <Field label="Valeur estimée" name="value" placeholder="CHF 145" />
              </div>
              <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                Prochaine action
                <textarea
                  className="min-h-20 border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
                  name="nextAction"
                  placeholder="Envoyer une relance douce cette semaine."
                  required
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-ink">
                <input className="h-4 w-4 accent-[#c6ff00]" name="consent" type="checkbox" />
                Consentement marketing vérifié
              </label>
            </div>
            <button
              className="mt-4 w-full border border-[#dedad2] bg-[#f0faf5] px-4 py-3 text-sm font-black uppercase text-ink transition hover:bg-[#fffbeb]"
              type="submit"
            >
              Enregistrer
            </button>
          </form>

          <ContactImportPanel isDemo={isDemo} />
        </div>

        {/* Right: search + filters + list */}
        <div>
          {/* Search */}
          <form method="GET" className="mb-4">
            {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Rechercher un contact..."
                  className="w-full border border-[#dedad2] bg-white py-3 pl-9 pr-4 text-sm font-semibold text-ink outline-none focus:bg-[#e8f5ee]"
                />
              </div>
              <button
                type="submit"
                className="border border-[#dedad2] bg-white px-4 text-xs font-black uppercase text-ink hover:bg-[#e8f5ee]"
              >
                Chercher
              </button>
              {(searchQuery || activeStatus) ? (
                <Link
                  href="/contacts"
                  className="border border-[#dedad2] bg-[#f8f7f2] px-4 py-3 text-xs font-black uppercase text-stone-500 hover:bg-white"
                >
                  Effacer
                </Link>
              ) : null}
            </div>
          </form>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
              const href = filter.value
                ? `/contacts?status=${filter.value}${searchQuery ? `&q=${searchQuery}` : ""}`
                : `/contacts${searchQuery ? `?q=${searchQuery}` : ""}`;
              const isActive = activeStatus === filter.value;
              return (
                <Link
                  key={filter.value}
                  href={href}
                  className={`border border-[#dedad2] px-4 py-2 text-xs font-black uppercase transition ${
                    isActive ? "bg-ink text-white" : "bg-white text-ink hover:bg-[#e8f5ee]"
                  }`}
                >
                  {filter.label}
                  {filter.value === "a_relancer" && toRelance > 0 && !isActive ? (
                    <span className="ml-2 inline-block bg-[#E85D2A] px-1.5 text-[9px] text-white">{toRelance}</span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          {/* Results count */}
          <p className="mb-3 text-xs font-black uppercase tracking-[0.1em] text-stone-400">
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
            {activeStatus ? ` · ${statusLabels[activeStatus] ?? activeStatus}` : ""}
            {searchQuery ? ` · "${searchQuery}"` : ""}
          </p>

          {/* Contact list */}
          {contacts.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          ) : (
            <div className="border-2 border-[#e8e5dd] bg-white p-8 text-center">
              <p className="text-sm font-black uppercase text-stone-400">Aucun contact trouvé.</p>
              {(activeStatus || searchQuery) ? (
                <Link href="/contacts" className="mt-3 inline-block text-xs font-black uppercase text-[#E85D2A] underline">
                  Voir tous les contacts
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  label, name, placeholder, required, type = "text"
}: {
  label: string; name: string; placeholder: string; required?: boolean; type?: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <input
        className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-2.5 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function Select({ label, name, options }: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <select
        className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-2.5 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
        name={name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
