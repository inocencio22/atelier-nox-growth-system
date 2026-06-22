import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, ShieldCheck, Wrench } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { faqItems, paidExtras, separateFeesIntro, separateFeesNotice, subscriptionPlans } from "@/lib/data";

const serviceBlocks = [
  {
    title: "Nous installons",
    icon: Wrench,
    items: ["Parcours de demandes", "CRM et formulaires", "Points d'entrée", "Alertes", "Hébergement et maintenance"]
  },
  {
    title: "Vous voyez",
    icon: Eye,
    items: ["Demandes centralisées", "Opportunités identifiées", "Rapport mensuel", "Recommandations claires", "Prochaines étapes"]
  },
  {
    title: "Cadre fiable",
    icon: ShieldCheck,
    items: ["Proposition personnalisée", "Prix transparent", "Sans engagement initial", "Périmètre défini", "Frais externes séparés"]
  }
];

export default function AbonnementPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Trois niveaux d'accompagnement, une proposition personnalisée."
        description="Chaque entreprise possède une organisation, des outils et un parcours client différents. Nous commençons par un diagnostic gratuit afin de comprendre votre fonctionnement actuel, les demandes que vous recevez et les points où des opportunités peuvent être perdues. Vous recevez ensuite une proposition personnalisée avec un périmètre clair, un prix transparent et les éventuels frais externes séparés. Sans engagement."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <article
            key={plan.name}
            className={
              plan.highlighted
                ? "border border-[#12382F] bg-[#12382F] p-6 shadow-[6px_6px_0_#E85D2A]"
                : "border border-[#12382F]/30 bg-[#fffaf0] p-6 shadow-[4px_4px_0_rgba(18,56,47,0.10)]"
            }
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">{plan.name}</p>
            <p className={`mt-3 min-h-12 text-sm font-semibold leading-6 ${plan.highlighted ? "text-white/85" : "text-[#12382F]"}`}>
              {plan.description}
            </p>

            <div className={`mt-4 border px-3 py-2 text-xs font-black uppercase leading-5 ${plan.highlighted ? "border-white/20 bg-white/10 text-white" : "border-[#D9D3C7] bg-[#F5F1E8] text-[#12382F]"}`}>
              Pour qui : {plan.pourQui}
            </div>

            <ul className="mt-5 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className={`flex items-start gap-2 text-sm font-bold ${plan.highlighted ? "text-white" : "text-[#101820]"}`}
                >
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-[#E85D2A]" : "text-[#12382F]"}`}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            {plan.note && (
              <p className={`mt-4 text-xs font-bold leading-5 ${plan.highlighted ? "text-white/55" : "text-stone-500"}`}>
                {plan.note}
              </p>
            )}

            <Link
              href="/diagnostic-gratuit"
              className={`mt-6 flex w-full items-center justify-center gap-2 border px-4 py-3 text-xs font-black uppercase transition ${
                plan.highlighted
                  ? "border-[#E85D2A] bg-[#E85D2A] text-white hover:bg-[#d44e22]"
                  : "border-[#12382F] bg-[#fffaf0] text-[#12382F] hover:bg-[#F5F1E8]"
              }`}
            >
              Demander mon diagnostic gratuit
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-8 border border-[#12382F] bg-[#fffaf0] p-6 shadow-[6px_6px_0_rgba(18,56,47,0.12)]">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Frais externes</p>
        <h2 className="mt-2 text-3xl font-black leading-none text-[#101820]">
          Des forfaits lisibles, sans frais cachés.
        </h2>
        <p className="mt-4 max-w-4xl text-sm font-semibold leading-6 text-[#12382F]">{separateFeesIntro}</p>
        <p className="mt-3 max-w-5xl border border-[#D9D3C7] bg-[#F5F1E8] p-4 text-sm font-bold leading-6 text-[#12382F]">
          {separateFeesNotice}
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {paidExtras.map((extra) => (
            <div key={extra.name} className="border border-[#D9D3C7] bg-white p-3">
              <p className="text-sm font-black text-[#101820]">{extra.name}</p>
            </div>
          ))}
        </div>
      </section>

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

      <section className="mt-8 border border-[#12382F] bg-[#fffaf0] p-6">
        <h2 className="text-3xl font-black leading-none text-[#101820]">Pourquoi ce modèle ?</h2>
        <p className="mt-5 max-w-4xl text-sm font-semibold leading-6 text-[#12382F]">
          Les entrepreneurs locaux ne veulent pas seulement des publications. Ils veulent un parcours clair pour recevoir les demandes, une vision de ce qui se passe et une personne responsable du suivi.
        </p>
      </section>

      <section className="mt-8 border border-[#12382F] bg-[#F5F1E8] p-6">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Questions fréquentes</p>
        <h2 className="mt-2 text-3xl font-black leading-none text-[#101820]">Un cadre clair avant de commencer.</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {faqItems.map((item) => (
            <article key={item.question} className="border border-[#D9D3C7] bg-[#fffaf0] p-4">
              <h3 className="text-base font-black text-[#101820]">{item.question}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#12382F]">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/diagnostic-gratuit"
          className="inline-flex items-center gap-2 border border-[#12382F] bg-[#E85D2A] px-5 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0_#12382F]"
        >
          Demander mon diagnostic gratuit
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 border border-[#12382F] bg-[#fffaf0] px-5 py-3 text-sm font-black uppercase text-[#12382F]"
        >
          Voir les services
        </Link>
      </div>
    </>
  );
}
