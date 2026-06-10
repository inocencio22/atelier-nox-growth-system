import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, Gauge, Handshake, MapPinned, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { PlanCard } from "@/components/PlanCard";
import { subscriptionPlans } from "@/lib/data";

const trustSignals = ["qualite", "clarte", "suivi", "precision", "fiable", "local", "sans bruit", "mesurable"];

const promiseBlocks = [
  {
    title: "Pour PME locales",
    detail: "Une approche pensee pour les salons, commerces et independants de Suisse romande."
  },
  {
    title: "Service gere",
    detail: "Vous n'apprenez pas un outil. Atelier Nox prepare les actions et le suivi."
  },
  {
    title: "Suivi clair",
    detail: "Un portail montre le travail fait, les validations et les prochaines priorites."
  },
  {
    title: "Sans charge en plus",
    detail: "Le client valide seulement les points importants, sans gerer une plateforme complexe."
  }
];

const methodSteps = [
  ["Observer", "Signaux reseaux, Google, site et contacts."],
  ["Prioriser", "Actions simples avec impact commercial."],
  ["Preparer", "Messages, contenus, relances et briefs."],
  ["Mesurer", "Resultats visibles dans le portail client."]
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="border-t-4 border-ink pt-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="border-2 border-ink bg-white p-6 shadow-soft md:p-10">
            <div className="flex items-start gap-4">
              <BrandMark />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue">Atelier Nox</p>
                <p className="mt-2 max-w-xl text-sm font-black uppercase leading-5 text-stone-500">
                  Croissance locale geree pour PME de Suisse romande.
                </p>
              </div>
            </div>

            <h1 className="mt-10 max-w-5xl text-5xl font-black uppercase leading-[0.9] text-ink md:text-7xl">
              Plus de clarte. Plus d&apos;actions. Plus de rendez-vous.
            </h1>
            <p className="mt-6 max-w-3xl text-xl font-black leading-tight text-ink">
              Nous transformons vos signaux digitaux en actions commerciales, contenus utiles et suivi mesurable.
            </p>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-stone-600">
              Un service gere, precis et local: reseaux sociaux, Google Business, relances clients, diagnostic IA et
              portail de suivi. Sans bruit. Sans charge de travail supplementaire.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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
              <Link
                href="/abonnement"
                className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-5 py-3 text-sm font-black uppercase text-white"
              >
                Recevoir une offre
              </Link>
            </div>
          </article>

          <article className="border-2 border-ink bg-paper p-5 shadow-soft">
            <div className="border-2 border-ink bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue">Resultat attendu</p>
              <h2 className="mt-2 text-4xl font-black uppercase leading-none text-ink">
                Savoir quoi publier, qui relancer et quelle action peut generer un rendez-vous.
              </h2>
            </div>
            <div className="mt-4 grid gap-3">
              {methodSteps.map(([title, detail], index) => (
                <div key={title} className="grid grid-cols-[3rem_1fr] gap-2">
                  <span className="grid place-items-center border-2 border-ink bg-white text-sm font-black">{index + 1}</span>
                  <div className="border-2 border-ink bg-white p-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue">{title}</p>
                    <p className="mt-1 text-lg font-black uppercase leading-none text-ink">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniMetric label="Actions preparees" value="14" />
              <MiniMetric label="A approuver" value="3" />
              <MiniMetric label="RDV estimes" value="11" />
              <MiniMetric label="Rapport" value="Mensuel" />
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {promiseBlocks.map((block) => (
          <article key={block.title} className="border-2 border-ink bg-white p-5 shadow-soft">
            <CheckCircle2 className="h-5 w-5 text-green" />
            <h2 className="mt-4 text-xl font-black uppercase leading-none text-ink">{block.title}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">{block.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <article className="border-2 border-ink bg-acid p-6 shadow-soft">
          <ShieldCheck className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Une presence fiable, locale et mesurable.</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {trustSignals.map((signal) => (
              <span key={signal} className="border-2 border-ink bg-white px-3 py-2 text-xs font-black uppercase text-ink">
                {signal}
              </span>
            ))}
          </div>
        </article>
        <div className="grid gap-4 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <TrustCard icon={<MapPinned className="h-6 w-6" />} title="Local" text="Priorite aux recherches, avis et opportunites proches du client." />
        <TrustCard icon={<ClipboardCheck className="h-6 w-6" />} title="Structure" text="Chaque semaine produit une action, une validation ou une preuve." />
        <TrustCard icon={<Gauge className="h-6 w-6" />} title="Mesure" text="Le portail montre le travail realise et les prochaines priorites." />
      </section>

      <section className="border-2 border-ink bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Collaboration</p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">Parlons de votre visibilite locale.</h2>
          </div>
          <Link
            href="/diagnostic-gratuit"
            className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-5 py-3 text-sm font-black uppercase text-ink"
          >
            Recevoir une offre
            <Handshake className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-line bg-white p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.1em] text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function TrustCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="border-2 border-ink bg-white p-5 shadow-soft">
      <span className="grid h-12 w-12 place-items-center border-2 border-ink bg-blue text-white">{icon}</span>
      <h2 className="mt-4 text-2xl font-black uppercase leading-none text-ink">{title}</h2>
      <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">{text}</p>
    </article>
  );
}
