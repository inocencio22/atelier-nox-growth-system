import Link from "next/link";
import { ArrowRight, CalendarClock, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { updateOnboardingStatus } from "@/lib/onboarding-actions";
import {
  formatDesiredPlan,
  getOnboardingSubmissions,
  type OnboardingStatus,
  type OnboardingSubmission
} from "@/lib/onboarding";

const STATUS_ORDER: OnboardingStatus[] = ["new", "diagnostic_ready", "contacted", "won", "lost"];

const STATUS_LABELS: Record<string, string> = {
  all: "Toutes",
  new: "À préparer",
  diagnostic_ready: "Prêtes",
  contacted: "Contactées",
  won: "Gagnées",
  lost: "Perdues"
};

const nextActions: Record<OnboardingStatus, string> = {
  new: "Préparer le diagnostic gratuit et vérifier Instagram / site web.",
  diagnostic_ready: "Contacter le propriétaire avec l'échantillon et proposer un appel court.",
  contacted: "Relancer avec une proposition claire: problème, action, prix mensuel.",
  won: "Créer le business client, importer les contacts et préparer le premier plan hebdomadaire.",
  lost: "Garder en suivi léger et proposer une nouvelle analyse dans 30 jours."
};

const quickStatusButtons: Array<{ value: OnboardingStatus; label: string }> = [
  { value: "diagnostic_ready", label: "Prêt" },
  { value: "contacted", label: "Contacté" },
  { value: "won", label: "Gagné" },
  { value: "lost", label: "Perdu" }
];

export default async function DemandesPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const { submissions, source } = await getOnboardingSubmissions();
  const isDemo = source === "mock";

  const activeStatus = STATUS_ORDER.includes(rawStatus as OnboardingStatus) ? rawStatus! : "all";

  const sorted = [...submissions].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
  );

  const filtered =
    activeStatus === "all" ? sorted : sorted.filter((s) => s.status === activeStatus);

  const counts: Record<string, number> = { all: submissions.length };
  for (const s of STATUS_ORDER) {
    counts[s] = submissions.filter((sub) => sub.status === s).length;
  }

  return (
    <>
      <PageHeader
        eyebrow="Pipeline"
        title="Demandes d'échantillon"
        description="Suivre les demandes entrantes, préparer les diagnostics et convertir en abonnement."
      />

      {isDemo && (
        <div className="mb-6 border border-[#dedad2] bg-[#fffbeb] p-4">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">Mode démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">
            Supabase non configuré — données exemples. Activez Supabase pour voir vos vraies demandes.
          </p>
        </div>
      )}

      <section className="mb-6 grid gap-3 grid-cols-2 md:grid-cols-5">
        <Metric label="Total" value={counts.all.toString()} />
        <Metric label="À préparer" value={counts.new.toString()} accent />
        <Metric label="Prêtes" value={counts.diagnostic_ready.toString()} />
        <Metric label="Contactées" value={counts.contacted.toString()} />
        <Metric label="Gagnées" value={counts.won.toString()} success />
      </section>

      <nav className="mb-4 flex flex-wrap gap-1 border-b border-[#dedad2]" aria-label="Filtrer par statut">
        {(["all", ...STATUS_ORDER] as const).map((s) => {
          const isActive = s === activeStatus;
          return (
            <Link
              key={s}
              href={s === "all" ? "/demandes" : `/demandes?status=${s}`}
              className={[
                "relative -mb-px px-4 py-2.5 text-xs font-black uppercase tracking-[0.1em] transition",
                isActive
                  ? "border-b-2 border-[#E85D2A] text-[#E85D2A]"
                  : "text-stone-500 hover:text-ink"
              ].join(" ")}
            >
              {STATUS_LABELS[s]}
              {counts[s] > 0 && (
                <span
                  className={[
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-black",
                    isActive ? "bg-[#E85D2A] text-white" : "bg-[#e8e5dd] text-stone-600"
                  ].join(" ")}
                >
                  {counts[s]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <div className="border border-[#dedad2] bg-[#f8f7f2] p-8 text-center">
          <p className="text-sm font-black uppercase text-stone-500">Aucune demande dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((submission) => (
            <SubmissionRow key={submission.id} submission={submission} isDemo={isDemo} />
          ))}
        </div>
      )}
    </>
  );
}

function SubmissionRow({ submission, isDemo }: { submission: OnboardingSubmission; isDemo: boolean }) {
  const formattedDate = new Date(submission.createdAt).toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "2-digit"
  });

  return (
    <article className="border border-[#dedad2] bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-black uppercase leading-none text-ink">
              {submission.businessName}
            </span>
            <StatusBadge status={submission.status} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {submission.city}
            </span>
            <span>{submission.niche}</span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {submission.ownerEmail}
            </span>
            <span className="text-stone-400">{formattedDate}</span>
          </p>
        </div>

        <div className="hidden shrink-0 text-right md:block">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-stone-400">Plan</p>
          <p className="text-xs font-black text-ink">
            {formatDesiredPlan(submission.desiredPlan).split(" - ")[0]}
          </p>
        </div>

        <Link
          href={`/demandes/${submission.id}`}
          className="shrink-0 inline-flex items-center gap-1.5 border border-[#dedad2] bg-[#f0faf5] px-3 py-1.5 text-xs font-black uppercase text-ink transition hover:-translate-y-0.5"
        >
          Ouvrir
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#e8e5dd] bg-[#f8f7f2] px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E85D2A]" />
          <p className="text-xs font-semibold leading-4 text-stone-600">{nextActions[submission.status]}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {quickStatusButtons.map((btn) => (
            <form key={btn.value} action={updateOnboardingStatus}>
              <input type="hidden" name="id" value={submission.id} />
              <input type="hidden" name="status" value={btn.value} />
              <button
                className={[
                  "px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] transition",
                  submission.status === btn.value
                    ? "border border-[#12382F] bg-[#12382F] text-white cursor-default"
                    : "border border-[#dedad2] bg-white text-stone-600 hover:border-[#12382F] hover:text-[#12382F]",
                  isDemo ? "cursor-not-allowed opacity-40" : ""
                ].join(" ")}
                disabled={isDemo || submission.status === btn.value}
                title={isDemo ? "Activez Supabase pour modifier les statuts" : undefined}
                type="submit"
              >
                {btn.label}
              </button>
            </form>
          ))}
        </div>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  accent,
  success
}: {
  label: string;
  value: string;
  accent?: boolean;
  success?: boolean;
}) {
  return (
    <article
      className={[
        "border p-3 shadow-sm",
        accent
          ? "border-[#E85D2A]/40 bg-[#fff7f4]"
          : success
            ? "border-[#dedad2] bg-[#f0faf5]"
            : "border-[#dedad2] bg-white"
      ].join(" ")}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <strong
        className={[
          "mt-1 block text-3xl font-black",
          accent ? "text-[#E85D2A]" : success ? "text-[#12382F]" : "text-ink"
        ].join(" ")}
      >
        {value}
      </strong>
    </article>
  );
}
