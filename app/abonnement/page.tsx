import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, ShieldCheck, Wrench } from "lucide-react";
import { PlanCard } from "@/components/PlanCard";
import { PageHeader } from "@/components/PageHeader";
import { subscriptionPlans } from "@/lib/data";

const deliveryPoints = [
  "Service gere pour PME locales.",
  "Suivi clair dans un portail client.",
  "Actions preparees avec validation humaine."
];

const serviceBlocks = [
  {
    title: "Nous faisons",
    icon: Wrench,
    items: ["Diagnostic", "Relances", "Messages", "Google / Instagram", "Suivi actions"]
  },
  {
    title: "Vous voyez",
    icon: Eye,
    items: ["Actions realisees", "A approuver", "Resultats", "Prochaines etapes", "Rapport mensuel"]
  },
  {
    title: "Cadre fiable",
    icon: ShieldCheck,
    items: ["Qualite suisse", "Precision", "Consentement", "Sans bruit", "Mesurable"]
  }
];

export default function AbonnementPage() {
  return (
    <>
      <PageHeader
        eyebrow="Offres"
        title="Un service mensuel de croissance locale."
        description="Atelier Nox prepare les actions, les contenus et le suivi. Vous gardez la clarte, sans gerer une plateforme de plus."
      />

      <section className="mb-6 border-2 border-ink bg-acid p-6 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Promesse</p>
        <h2 className="mt-2 max-w-5xl text-4xl font-black uppercase leading-none text-ink">
          Qualite, clarte, suivi et precision pour votre visibilite locale.
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {deliveryPoints.map((point) => (
            <div key={point} className="flex items-start gap-2 border-2 border-ink bg-white p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" />
              <span className="text-sm font-black leading-5 text-ink">{point}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/diagnostic-gratuit"
          className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-5 py-3 text-sm font-black uppercase text-ink"
        >
          1er RDV offert
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 border-2 border-ink bg-white px-5 py-3 text-sm font-black uppercase text-ink hover:bg-paper"
        >
          Voir les services
        </Link>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {serviceBlocks.map((block) => {
          const Icon = block.icon;

          return (
            <article key={block.title} className="border-2 border-ink bg-white p-5 shadow-soft">
              <span className="grid h-11 w-11 place-items-center border-2 border-ink bg-blue text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-2xl font-black uppercase leading-none text-ink">{block.title}</h2>
              <ul className="mt-4 space-y-2">
                {block.items.map((item) => (
                  <li key={item} className="border-2 border-line bg-paper px-3 py-2 text-sm font-black text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="mt-8 border-2 border-ink bg-white p-6 shadow-soft">
        <h2 className="text-3xl font-black uppercase leading-none text-ink">Pourquoi ce modele</h2>
        <p className="mt-5 max-w-4xl text-sm font-semibold leading-6 text-stone-600">
          Les entrepreneurs locaux ne veulent pas seulement des posts. Ils veulent une presence fiable, des relances
          organisees, des actions mesurables et une personne responsable du suivi.
        </p>
      </section>
    </>
  );
}
