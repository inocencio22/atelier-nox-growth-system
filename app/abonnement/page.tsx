import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, ShieldCheck, Wrench } from "lucide-react";
import { PlanCard } from "@/components/PlanCard";
import { PageHeader } from "@/components/PageHeader";
import {
  faqItems,
  paidExtras,
  planPositioning,
  recommendedAdBudgets,
  separateFeesIntro,
  separateFeesNotice,
  subscriptionPlans
} from "@/lib/data";

const deliveryPoints = [
  "Service géré pour PME locales.",
  "Suivi clair dans un portail client.",
  "Actions préparées avec validation humaine."
];

const serviceBlocks = [
  {
    title: "Nous faisons",
    icon: Wrench,
    items: ["Diagnostic", "Relances", "Messages", "Google / réseaux", "Suivi des actions"]
  },
  {
    title: "Vous voyez",
    icon: Eye,
    items: ["Actions réalisées", "À approuver", "Résultats", "Prochaines étapes", "Rapport mensuel"]
  },
  {
    title: "Cadre fiable",
    icon: ShieldCheck,
    items: ["Qualité", "Précision", "Consentement", "Sans bruit", "Mesurable"]
  }
];

export default function AbonnementPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tarifs"
        title="Des forfaits mensuels clairs, avec les frais externes séparés."
        description="Atelier Nox prépare, organise et suit votre croissance locale. Les budgets publicitaires, outils et créations spécifiques restent séparés pour garder un cadre transparent."
      />

      <section className="mb-8 border border-[#12382F] bg-[#12382F] p-6 text-white shadow-[8px_8px_0_#E85D2A]">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Promesse</p>
        <h2 className="mt-2 max-w-5xl text-4xl font-black leading-none">
          Qualité, clarté, suivi et précision pour votre visibilité locale.
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {deliveryPoints.map((point) => (
            <div key={point} className="flex items-start gap-2 border border-[#F5F1E8]/40 bg-[#F5F1E8] p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E85D2A]" />
              <span className="text-sm font-black leading-5 text-[#12382F]">{point}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {planPositioning.map((item) => (
          <article key={item.plan} className="border border-[#12382F] bg-[#fffaf0] p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">{item.plan}</p>
            <h2 className="mt-3 text-2xl font-black leading-none text-[#101820]">{item.summary}</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-[#12382F]">{item.boundary}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/diagnostic-gratuit"
          className="inline-flex items-center gap-2 border border-[#12382F] bg-[#E85D2A] px-5 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0_#12382F]"
        >
          1er RDV offert
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 border border-[#12382F] bg-[#fffaf0] px-5 py-3 text-sm font-black uppercase text-[#12382F]"
        >
          Voir les services
        </Link>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {serviceBlocks.map((block) => {
          const Icon = block.icon;

          return (
            <article
              key={block.title}
              className="border border-[#12382F] bg-[#fffaf0] p-5 shadow-[5px_5px_0_rgba(18,56,47,0.12)]"
            >
              <span className="grid h-11 w-11 place-items-center border border-[#12382F] bg-[#12382F] text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-2xl font-black leading-none text-[#101820]">{block.title}</h2>
              <ul className="mt-4 space-y-2">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="border border-[#D9D3C7] bg-[#F5F1E8] px-3 py-2 text-sm font-black text-[#12382F]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="mt-8 border border-[#12382F] bg-[#fffaf0] p-6 shadow-[6px_6px_0_rgba(18,56,47,0.12)]">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Frais séparés</p>
        <h2 className="mt-2 text-3xl font-black leading-none text-[#101820]">
          Des forfaits lisibles, sans frais cachés.
        </h2>
        <p className="mt-4 max-w-4xl text-sm font-semibold leading-6 text-[#12382F]">{separateFeesIntro}</p>
        <p className="mt-3 max-w-5xl border border-[#D9D3C7] bg-[#F5F1E8] p-4 text-sm font-bold leading-6 text-[#12382F]">
          {separateFeesNotice}
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="border border-[#12382F] bg-[#fffaf0] p-6">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Extras disponibles</p>
          <h2 className="mt-2 text-3xl font-black leading-none text-[#101820]">À activer seulement si nécessaire.</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {paidExtras.map((extra) => (
              <div key={extra.name} className="border border-[#D9D3C7] bg-[#F5F1E8] p-3">
                <p className="text-sm font-black text-[#101820]">{extra.name}</p>
                <p className="mt-1 text-sm font-black text-[#E85D2A]">{extra.price}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-[#12382F] bg-[#12382F] p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Budgets publicitaires</p>
          <h2 className="mt-2 text-3xl font-black leading-none">Le budget média reste votre budget.</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#F5F1E8]">
            Nous pouvons préparer et suivre les campagnes, mais l&apos;argent investi chez Meta ou Google est séparé du
            forfait Atelier Nox.
          </p>
          <div className="mt-5 grid gap-2">
            {recommendedAdBudgets.map((item) => (
              <div key={item.name} className="border border-[#F5F1E8]/30 bg-[#F5F1E8] p-3 text-[#12382F]">
                <p className="text-sm font-black">{item.name}</p>
                <p className="mt-1 text-sm font-black text-[#E85D2A]">{item.budget}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 border border-[#12382F] bg-[#fffaf0] p-6">
        <h2 className="text-3xl font-black leading-none text-[#101820]">Pourquoi ce modèle ?</h2>
        <p className="mt-5 max-w-4xl text-sm font-semibold leading-6 text-[#12382F]">
          Les entrepreneurs locaux ne veulent pas seulement des publications. Ils veulent une présence fiable, des
          relances organisées, des actions mesurables et une personne responsable du suivi.
        </p>
      </section>

      <section className="mt-8 border border-[#12382F] bg-[#F5F1E8] p-6">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Questions fréquentes</p>
        <h2 className="mt-2 text-3xl font-black leading-none text-[#101820]">Un cadre clair avant de commencer.</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {faqItems.map((item) => (
            <article key={item.question} className="border border-[#D9D3C7] bg-[#fffaf0] p-4">
              <h3 className="text-base font-black text-[#101820]">{item.question}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#12382F]">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
