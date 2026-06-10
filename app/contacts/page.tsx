import { ContactCard } from "@/components/ContactCard";
import { ContactImportPanel } from "@/components/ContactImportPanel";
import { PageHeader } from "@/components/PageHeader";
import { createContact } from "@/lib/contact-actions";
import { getContacts } from "@/lib/contacts";

const filters = ["Tous", "À relancer", "Nouveaux", "Avis"];

export default async function ContactsPage() {
  const { contacts, source } = await getContacts();
  const isDemo = source === "mock";
  const contactsToRelance = contacts.filter((contact) => contact.status === "a_relancer").length;
  const consentOk = contacts.filter((contact) => contact.consent).length;

  return (
    <>
      <PageHeader
        eyebrow="CRM local"
        title="Contacts clients"
        description="Base simple pour savoir qui relancer, par quel canal, avec quel potentiel et quel consentement."
      />

      {isDemo ? (
        <section className="mb-6 border-2 border-ink bg-yellow p-4">
          <p className="text-sm font-black uppercase text-ink">Mode démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Supabase n&apos;est pas encore configuré. La liste utilise les contacts mockés. Ajoutez les clés dans
            <code className="mx-1 bg-white px-1">.env.local</code>
            et appliquez la migration SQL pour activer les contacts réels.
          </p>
        </section>
      ) : null}

      <section className="mb-6 grid gap-3 md:grid-cols-3">
        {[
          ["Contacts", contacts.length.toString()],
          ["À relancer", contactsToRelance.toString()],
          ["Consentement OK", consentOk.toString()]
        ].map(([label, value]) => (
          <article key={label} className="border-2 border-ink bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}</p>
            <strong className="mt-2 block text-4xl font-black text-ink">{value}</strong>
          </article>
        ))}
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[0.75fr_0.95fr_1.3fr]">
        <form action={createContact} className="border-2 border-ink bg-white p-5 shadow-soft">
          <h2 className="text-2xl font-black uppercase leading-none text-ink">Ajouter un contact</h2>
          <div className="mt-5 grid gap-3">
            <Field label="Nom" name="name" placeholder="Sophie Martin" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Canal" name="channel" options={["Instagram", "WhatsApp", "Email", "Téléphone"]} />
              <Select
                label="Status"
                name="status"
                options={["a_relancer", "nouveau", "demande_prix", "avis_demande", "client_fidele"]}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Dernier contact" name="lastInteraction" placeholder="Il y a 30 jours" />
              <Field label="Valeur" name="value" placeholder="CHF 145" />
            </div>
            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
              Prochaine action
              <textarea
                className="min-h-24 border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
                name="nextAction"
                placeholder="Envoyer une relance douce pour proposer deux créneaux."
                required
              />
            </label>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-ink">
              <input className="h-4 w-4 accent-[#c6ff00]" name="consent" type="checkbox" />
              Consentement marketing vérifié
            </label>
          </div>
          <button
            className="mt-5 w-full border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase text-ink"
            type="submit"
          >
            Enregistrer le contact
          </button>
        </form>

        <ContactImportPanel isDemo={isDemo} />

        <div>
          <section className="mb-4 grid gap-3 md:grid-cols-4">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`border-2 border-ink px-4 py-3 text-left text-xs font-black uppercase ${
                  index === 0 ? "bg-ink text-white" : "bg-white text-ink hover:bg-acid"
                }`}
                type="button"
              >
                {filter}
              </button>
            ))}
          </section>
          <section className="grid gap-3 md:grid-cols-2">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </section>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  placeholder,
  required
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <input
        className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <select
        className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
