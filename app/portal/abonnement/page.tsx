import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, CreditCard, MessageSquare, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getWorkspaceAccess } from "@/lib/auth-model";

const planDetails: Record<
  string,
  {
    name: string;
    price: string;
    rhythm: string;
    included: string[];
    nextDeliverables: string[];
  }
> = {
  demo: {
    name: "Demo",
    price: "CHF 0",
    rhythm: "phase test",
    included: ["Apercu du portail", "Exemples d'actions", "Exemples de contenus", "Diagnostic initial"],
    nextDeliverables: ["Valider l'offre adaptee", "Choisir le plan mensuel", "Creer le compte client reel"]
  },
  essentiel: {
    name: "Local Clarity",
    price: "CHF 190",
    rhythm: "/ mois",
    included: ["Diagnostic mensuel", "Plan d'actions priorisees", "5 messages prets", "Rapport mensuel simple"],
    nextDeliverables: ["Rapport mensuel", "Recommandations Google/Instagram", "Scripts de relance"]
  },
  growth: {
    name: "Managed Growth",
    price: "CHF 390",
    rhythm: "/ mois",
    included: ["Plan hebdomadaire", "Relances preparees", "Contenus a valider", "Suivi des resultats"],
    nextDeliverables: ["Plan d'actions semaine", "Contenus a approuver", "Synthese des opportunites"]
  },
  pro_local: {
    name: "Done For You Local",
    price: "CHF 690",
    rhythm: "/ mois",
    included: ["Tout Managed Growth", "Google Business", "Micro-campagnes", "Revue strategique mensuelle"],
    nextDeliverables: ["Optimisation locale", "Production assets", "Revue mensuelle"]
  },
  partner: {
    name: "Partner",
    price: "Sur mesure",
    rhythm: "mensuel",
    included: ["Service personnalise", "Priorites commerciales", "Reporting adapte", "Support direct"],
    nextDeliverables: ["Definition du plan", "Cadence de production", "Objectifs mensuels"]
  }
};

export default async function PortalAbonnementPage() {
  const workspace = await getWorkspaceAccess();
  const business = workspace.business;
  const plan = planDetails[business.plan] ?? planDetails.demo;

  return (
    <>
      <PageHeader
        eyebrow="Mon abonnement"
        title={plan.name}
        description={`Vue client du plan actif pour ${business.name}: prix, statut, livrables inclus et prochaines etapes du service.`}
      />

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="Plan" value={plan.name} detail={business.niche} />
        <Metric label="Prix" value={plan.price} detail={plan.rhythm} />
        <Metric label="Status" value={business.status} detail="Compte client" />
        <Metric label="Acces" value={workspace.mode === "supabase_auth" ? "Client" : "Demo"} detail={workspace.profile?.email ?? "Session temporaire"} />
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border-2 border-ink bg-acid p-5 shadow-soft">
          <CreditCard className="h-8 w-8 text-ink" />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-blue">Abonnement actuel</p>
          <h2 className="mt-2 text-5xl font-black uppercase leading-none text-ink">{plan.price}</h2>
          <p className="mt-2 text-lg font-black uppercase text-ink">{plan.rhythm}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusBadge status={business.status} />
            <span className="inline-flex w-fit border border-ink bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.04em] text-ink ring-1 ring-ink">
              {business.city}
            </span>
          </div>
          <p className="mt-5 text-sm font-semibold leading-6 text-ink">
            Le portail ne sert pas a vous donner du travail. Il sert a rendre visible le service: ce qui est prepare,
            ce qui demande validation et ce qui produit des opportunites.
          </p>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <ShieldCheck className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Inclus dans le service</h2>
          <div className="mt-5 grid gap-3">
            {plan.included.map((item) => (
              <InfoRow key={item} icon={<CheckCircle2 className="h-4 w-4 text-green" />} text={item} />
            ))}
          </div>
        </article>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-2">
        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <CalendarClock className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Prochains livrables</h2>
          <div className="mt-5 grid gap-3">
            {plan.nextDeliverables.map((item) => (
              <InfoRow key={item} icon={<ArrowRight className="h-4 w-4 text-blue" />} text={item} />
            ))}
          </div>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <MessageSquare className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Besoin d&apos;ajuster?</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">
            Si vous voulez changer de rythme, ajouter de la production photo/video ou demander une action prioritaire,
            contactez Atelier Nox. Les changements de plan seront confirmes humainement.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase text-ink"
            >
              Retour portail
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/rapports"
              className="inline-flex items-center gap-2 border-2 border-ink bg-white px-4 py-3 text-sm font-black uppercase text-ink hover:bg-paper"
            >
              Voir rapports
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}</p>
      <strong className="mt-2 block break-words text-3xl font-black text-ink">{value}</strong>
      <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
    </article>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 border-2 border-line bg-paper p-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="text-sm font-black uppercase leading-5 text-ink">{text}</span>
    </div>
  );
}
