import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, ShieldCheck, Wrench } from "lucide-react";
import { PlanCard } from "@/components/PlanCard";
import { PageHeader } from "@/components/PageHeader";
import { subscriptionPlans } from "@/lib/data";

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
        title="Des plans mensuels pour avancer avec clarté."
        description="Atelier Nox prépare les actions, les contenus et le suivi. Vous gardez la visibilité sur le travail, sans gérer une plateforme de plus."
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

      <section className="mt-8 border border-[#12382F] bg-[#fffaf0] p-6">
        <h2 className="text-3xl font-black leading-none text-[#101820]">Pourquoi ce modèle ?</h2>
        <p className="mt-5 max-w-4xl text-sm font-semibold leading-6 text-[#12382F]">
          Les entrepreneurs locaux ne veulent pas seulement des publications. Ils veulent une présence fiable, des
          relances organisées, des actions mesurables et une personne responsable du suivi.
        </p>
      </section>
    </>
  );
}
