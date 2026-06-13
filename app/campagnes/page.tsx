import { CampaignCard } from "@/components/CampaignCard";
import { PageHeader } from "@/components/PageHeader";
import { SegmentCard } from "@/components/SegmentCard";
import { campaigns, contactSegments, messageTemplates } from "@/lib/data";

export default function CampagnesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Relance guidée"
        title="Campagnes"
        description="Transformer les contacts en actions commerciales: choisir un segment, préparer une campagne et envoyer manuellement avec contrôle humain."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {contactSegments.map((segment) => (
          <SegmentCard key={segment.name} segment={segment} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase text-ink">Campagnes prêtes</h2>
            <span className="border border-[#dedad2] bg-[#fffbeb] px-2 py-1 text-xs font-black uppercase">
              Sans envoi auto
            </span>
          </div>
          <div className="grid gap-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.title} campaign={campaign} />
            ))}
          </div>
        </div>

        <form className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Campaign builder</p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">Créer une relance</h2>
          <div className="mt-5 grid gap-3">
            <Select label="Segment" options={contactSegments.map((segment) => segment.name)} />
            <Select label="Objectif" options={["Rendez-vous", "Avis Google", "Réponse Instagram", "Retour client"]} />
            <Select label="Template" options={messageTemplates.map((template) => template.title)} />
            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
              Message proposé
              <textarea
                className="min-h-40 border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
                defaultValue={messageTemplates[0].body}
              />
            </label>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button className="border border-[#dedad2] bg-[#f0faf5] px-4 py-3 text-sm font-black uppercase" type="button">
              Préparer campagne
            </button>
            <button className="border border-[#dedad2] bg-white px-4 py-3 text-sm font-black uppercase" type="button">
              Copier message
            </button>
          </div>
          <p className="mt-4 text-xs font-bold leading-5 text-stone-500">
            MVP: la campagne prépare le message et les étapes. L&apos;envoi reste manuel pour respecter consentement,
            qualité et règles des plateformes.
          </p>
        </form>
      </section>
    </>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <select className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
