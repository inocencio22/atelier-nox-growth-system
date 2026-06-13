import { CalendarCheck, Clapperboard, Inbox, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getRapportMetrics } from "@/lib/rapports";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  check: CalendarCheck,
  clapperboard: Clapperboard,
  users: Users,
  inbox: Inbox
};

export default async function RapportsPage() {
  const { metrics, source } = await getRapportMetrics();

  return (
    <>
      <PageHeader
        eyebrow="Mesure"
        title="Rapports ROI simple"
        description="Chaque client doit comprendre vite si son abonnement se transforme en actions, réponses et rendez-vous."
      />

      {source === "mock" && (
        <div className="mb-6 border border-[#dedad2] bg-[#fffbeb] p-4">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">Mode démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">
            Ces chiffres sont des exemples. Avec Supabase actif, ils refléteront vos vraies données.
          </p>
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = iconMap[metric.icon] ?? CalendarCheck;
          return (
            <article key={metric.label} className="border border-[#dedad2] bg-white p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center border border-[#dedad2] bg-[#12382F] text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.1em] text-stone-500">{metric.label}</p>
              <strong className="mt-1 block text-4xl font-black text-[#0d1a14]">{metric.value}</strong>
              <p className="mt-1 text-sm font-semibold text-stone-500">{metric.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <h2 className="text-3xl font-black uppercase leading-none text-[#0d1a14]">Lecture commerciale</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">
            Le rapport ne cherche pas à impressionner avec trop de données. Il montre si les contacts sont activés,
            si les messages reçoivent des réponses et si les actions créent des rendez-vous.
          </p>
          <div className="mt-5 grid gap-3">
            <ReadingRule
              label="Actions terminées"
              detail="Chaque action terminée est une preuve de travail livré. Objectif : au moins 4 par mois par client."
            />
            <ReadingRule
              label="Contenus publiés"
              detail="Un contenu publié = une occasion d'être vu localement. Objectif : 2 à 4 par mois selon le plan."
            />
            <ReadingRule
              label="Clients actifs"
              detail="Un client actif est un client servi. Chaque renouvellement confirme la valeur perçue du service."
            />
          </div>
        </article>

        <article className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
          <h2 className="text-3xl font-black uppercase leading-none text-[#0d1a14]">Preuve du service</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">
            Ces métriques alimentent les rapports mensuels envoyés aux clients via le portail. Le client voit ce
            qui a été fait — pas ce qu&apos;on a promis.
          </p>
          <div className="mt-5 grid gap-3">
            <ProofItem label="Rapport mensuel" value="Via portail client" />
            <ProofItem label="Fréquence" value="1× par mois" />
            <ProofItem label="Format" value="Clair, court, chiffré" />
            <ProofItem label="Livraison" value="Automatique à date fixe" />
          </div>
        </article>
      </section>
    </>
  );
}

function ReadingRule({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="border border-[#dedad2] bg-[#f8f7f2] p-4">
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#E85D2A]">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">{detail}</p>
    </div>
  );
}

function ProofItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border border-[#dedad2] bg-white p-3">
      <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">{label}</p>
      <p className="text-sm font-black text-[#0d1a14]">{value}</p>
    </div>
  );
}
