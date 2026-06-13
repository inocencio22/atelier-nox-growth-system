import Link from "next/link";
import { ArrowRight, CalendarClock, Mail, MapPin, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { updateOnboardingStatus } from "@/lib/onboarding-actions";
import {
  formatDesiredPlan,
  formatObjective,
  getOnboardingSubmissions,
  type OnboardingStatus,
  type OnboardingSubmission
} from "@/lib/onboarding";

const nextActions: Record<OnboardingStatus, string> = {
  new: "Préparer le diagnostic gratuit et vérifier Instagram / site web.",
  diagnostic_ready: "Contacter le propriétaire avec l'échantillon et proposer un appel court.",
  contacted: "Relancer avec une proposition claire: problème, action, prix mensuel.",
  won: "Créer le business client, importer les contacts et préparer le premier plan hebdomadaire.",
  lost: "Garder en suivi léger et proposer une nouvelle analyse dans 30 jours."
};

const statusButtons: Array<{ value: OnboardingStatus; label: string }> = [
  { value: "diagnostic_ready", label: "Diagnostic prêt" },
  { value: "contacted", label: "Contacté" },
  { value: "won", label: "Gagné" },
  { value: "lost", label: "Perdu" }
];

const conversionSteps = [
  {
    title: "Qualifier",
    detail: "Vérifier ville, activité, site, Instagram et objectif prioritaire."
  },
  {
    title: "Préparer",
    detail: "Créer le diagnostic court avec score, risques, actions 7 jours et plan recommandé."
  },
  {
    title: "Contacter",
    detail: "Envoyer un message manuel clair puis proposer un appel de 30 minutes."
  },
  {
    title: "Convertir",
    detail: "Transformer la demande gagnée en business client avec plan et premières actions."
  }
];

export default async function DemandesPage() {
  const { submissions, source } = await getOnboardingSubmissions();
  const isDemo = source === "mock";
  const newCount = submissions.filter((submission) => submission.status === "new").length;
  const readyCount = submissions.filter((submission) => submission.status === "diagnostic_ready").length;
  const wonCount = submissions.filter((submission) => submission.status === "won").length;

  return (
    <>
      <PageHeader
        eyebrow="Pipeline"
        title="Demandes d'échantillon"
        description="Espace interne pour suivre les entrepreneurs qui ont demandé une amostra gratuita, préparer le diagnostic et transformer la demande en abonnement."
      />

      {isDemo ? (
        <section className="mb-6 border border-[#dedad2] bg-[#fffbeb] p-4">
          <p className="text-sm font-black uppercase text-ink">Mode démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Supabase n&apos;est pas encore configuré ou la table n&apos;est pas disponible. Les demandes affichées sont
            des exemples pour visualiser le pipeline.
          </p>
        </section>
      ) : null}

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="Demandes" value={submissions.length.toString()} detail="Entrées onboarding" />
        <Metric label="À préparer" value={newCount.toString()} detail="Diagnostic à créer" />
        <Metric label="Prêtes" value={readyCount.toString()} detail="À contacter" />
        <Metric label="Gagnées" value={wonCount.toString()} detail="Abonnement ou setup" />
      </section>

      <section className="mb-6 border border-[#dedad2] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Méthode de vente</p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">
              Transformer une demande en client.
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-stone-600">
            Cette page sert à passer d&apos;une curiosité gratuite à une conversation commerciale structurée.
          </p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {conversionSteps.map((step, index) => (
            <article key={step.title} className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-4">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#dc2626]">Étape {index + 1}</span>
              <h3 className="mt-3 text-xl font-black uppercase leading-none text-ink">{step.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-stone-700">{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
          <Sparkles className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Règle du service</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">
            Chaque demande doit produire une preuve utile: un diagnostic court, une recommandation concrète et une
            proposition adaptée au budget. C&apos;est ce qui rend l&apos;offre sérieuse, claire et mesurable.
          </p>
          <Link
            href="/onboarding"
            className="mt-5 inline-flex items-center gap-2 border border-[#dedad2] bg-white px-4 py-3 text-sm font-black uppercase text-ink"
          >
            Voir le formulaire client
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>

        <div className="grid gap-4">
          {submissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} isDemo={isDemo} />
          ))}
        </div>
      </section>
    </>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="border border-[#dedad2] bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}</p>
      <strong className="mt-2 block text-4xl font-black text-ink">{value}</strong>
      <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
    </article>
  );
}

function SubmissionCard({ submission, isDemo }: { submission: OnboardingSubmission; isDemo: boolean }) {
  return (
    <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black uppercase leading-none text-ink">{submission.businessName}</h2>
            <StatusBadge status={submission.status} />
          </div>
          <p className="mt-2 text-sm font-black text-stone-600">{submission.niche}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center border border-[#dedad2] bg-[#12382F] text-white">
          <Mail className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Info icon={<Mail className="h-4 w-4" />} label="Email" value={submission.ownerEmail} />
        <Info icon={<MapPin className="h-4 w-4" />} label="Localisation" value={submission.city} />
        <Info label="Objectif" value={formatObjective(submission.mainObjective)} />
        <Info label="Plan envisagé" value={formatDesiredPlan(submission.desiredPlan)} />
        <Info label="Site" value={submission.website ?? "À compléter"} />
        <Info label="Instagram" value={submission.instagramHandle ?? "À vérifier"} />
      </div>

      {submission.notes ? (
        <p className="mt-4 border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3 text-sm font-semibold leading-6 text-stone-700">
          {submission.notes}
        </p>
      ) : null}

      <div className="mt-4 flex items-start gap-3 border border-[#dedad2] bg-[#f8f7f2] p-3">
        <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-[#E85D2A]" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">Prochaine action</p>
          <p className="mt-1 text-sm font-black leading-5 text-ink">{nextActions[submission.status]}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/demandes/${submission.id}`}
          className="inline-flex items-center gap-2 border border-[#dedad2] bg-[#f0faf5] px-3 py-2 text-xs font-black uppercase text-ink"
        >
          Créer diagnostic
          <ArrowRight className="h-4 w-4" />
        </Link>
        {statusButtons.map((button) => (
          <form key={button.value} action={updateOnboardingStatus}>
            <input type="hidden" name="id" value={submission.id} />
            <input type="hidden" name="status" value={button.value} />
            <button
              className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-black uppercase text-ink hover:bg-[#e8f5ee] disabled:cursor-not-allowed disabled:border-[#e8e5dd] disabled:text-stone-400"
              disabled={isDemo || submission.status === button.value}
              title={isDemo ? "Activez Supabase pour modifier les statuts" : undefined}
              type="submit"
            >
              {button.label}
            </button>
          </form>
        ))}
      </div>
    </article>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
      <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-ink">{value}</p>
    </div>
  );
}
