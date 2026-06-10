import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Copy, Database, Mail, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProposalPreview } from "@/components/ProposalPreview";
import { StatusBadge } from "@/components/StatusBadge";
import { createClientBusinessFromSubmission, saveGeneratedDiagnostic } from "@/lib/onboarding-actions";
import {
  formatDesiredPlan,
  formatObjective,
  generateSubmissionDiagnostic,
  getOnboardingSubmissionById
} from "@/lib/onboarding";

type DemandeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    client?: string;
    saved?: string;
  }>;
};

export default async function DemandeDetailPage({ params, searchParams }: DemandeDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const { submission, source } = await getOnboardingSubmissionById(id);

  if (!submission) {
    notFound();
  }

  const diagnostic = generateSubmissionDiagnostic(submission);
  const isDemo = source === "mock";

  return (
    <>
      <Link
        href="/demandes"
        className="mb-5 inline-flex items-center gap-2 border-2 border-ink bg-white px-3 py-2 text-xs font-black uppercase text-ink hover:bg-acid"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour demandes
      </Link>

      <PageHeader
        eyebrow={isDemo ? "Diagnostic démo" : "Diagnostic client"}
        title={diagnostic.title}
        description="Page de travail interne: transformer les données du formulaire en diagnostic commercial, proposition et message de contact."
      />

      {query?.saved === "ok" ? (
        <div className="mb-6 border-2 border-ink bg-acid p-4 text-sm font-black uppercase text-ink">
          Diagnostic et proposition sauvegardés. La demande est maintenant prête à contacter.
        </div>
      ) : null}

      {query?.saved === "demo" ? (
        <div className="mb-6 border-2 border-ink bg-yellow p-4 text-sm font-black uppercase text-ink">
          Mode démo: activez Supabase et appliquez la migration 004 pour sauvegarder ce diagnostic.
        </div>
      ) : null}

      {query?.client === "demo" ? (
        <div className="mb-6 border-2 border-ink bg-yellow p-4 text-sm font-black uppercase text-ink">
          Mode demo: activez Supabase et connectez-vous en admin pour creer le business client.
        </div>
      ) : null}

      {query?.client === "error" ? (
        <div className="mb-6 border-2 border-ink bg-coral p-4 text-sm font-black uppercase text-ink">
          Impossible de creer le client. Verifiez Supabase Auth, RLS admin et la table businesses.
        </div>
      ) : null}

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Demande reçue</p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">{submission.businessName}</h2>
              <p className="mt-3 text-sm font-black text-stone-600">{submission.city} · {submission.niche}</p>
            </div>
            <StatusBadge status={submission.status} />
          </div>

          <div className="mt-5 grid gap-3">
            <Info label="Email" value={submission.ownerEmail} />
            <Info label="Objectif" value={formatObjective(submission.mainObjective)} />
            <Info label="Plan envisagé" value={formatDesiredPlan(submission.desiredPlan)} />
            <Info label="Site" value={submission.website ?? "À compléter"} />
            <Info label="Instagram" value={submission.instagramHandle ?? "À vérifier"} />
          </div>

          {submission.notes ? (
            <div className="mt-4 border-2 border-line bg-paper p-3">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">Notes client</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-stone-700">{submission.notes}</p>
            </div>
          ) : null}
        </article>

        <article className="border-2 border-ink bg-acid p-5 shadow-soft">
          <Sparkles className="h-8 w-8 text-ink" />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-blue">Score visibilité</p>
          <div className="mt-2 flex items-end gap-3">
            <strong className="text-7xl font-black leading-none text-ink">{diagnostic.score}</strong>
            <span className="pb-2 text-2xl font-black text-ink">/100</span>
          </div>
          <p className="mt-5 text-base font-bold leading-7 text-ink">{diagnostic.summary}</p>
          <form action={saveGeneratedDiagnostic} className="mt-5">
            <input type="hidden" name="id" value={submission.id} />
            <button className="inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-white px-4 py-3 text-sm font-black uppercase text-ink hover:bg-blue hover:text-white">
              <Database className="h-4 w-4" />
              Sauvegarder diagnostic + proposition
            </button>
          </form>
        </article>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <DiagnosticList title="Forces" items={diagnostic.strengths} accent="bg-acid" />
        <DiagnosticList title="Risques" items={diagnostic.risks} accent="bg-coral" />
        <DiagnosticList title="Actions 7 jours" items={diagnostic.actions} accent="bg-blue text-white" />
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <ProposalPreview proposal={diagnostic.suggestedProposal} />

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink bg-blue text-white">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-black uppercase leading-none text-ink">Message de contact</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
                Script manuel pour envoyer par email, Instagram ou WhatsApp après validation humaine.
              </p>
            </div>
          </div>
          <div className="mt-5 border-2 border-line bg-paper p-4 text-sm font-bold leading-6 text-ink">
            {diagnostic.outreachScript}
          </div>
          <button
            className="mt-4 inline-flex items-center gap-2 border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase text-ink"
            type="button"
          >
            <Copy className="h-4 w-4" />
            Copier manuellement
          </button>
        </article>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border-2 border-ink bg-acid p-5 shadow-soft">
          <Database className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Convertir en client</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">
            Quand la demande est gagnee, creez le business client. Il apparaitra dans Clients avec son plan, son statut
            et sa fiche operationnelle.
          </p>
        </article>

        <form action={createClientBusinessFromSubmission} className="border-2 border-ink bg-white p-5 shadow-soft">
          <input type="hidden" name="id" value={submission.id} />
          <h2 className="text-2xl font-black uppercase leading-none text-ink">Creation business</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Info label="Business" value={submission.businessName} />
            <Info label="Owner email" value={submission.ownerEmail} />
            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600 md:col-span-2">
              Plan confirme
              <select
                className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
                name="plan"
                defaultValue={submission.desiredPlan === "pas_encore" ? "essentiel" : submission.desiredPlan}
              >
                <option value="essentiel">Local Clarity - CHF 190/mois</option>
                <option value="growth">Managed Growth - CHF 390/mois</option>
                <option value="pro_local">Done For You Local - CHF 690/mois</option>
                <option value="partner">Partner - sur mesure</option>
              </select>
            </label>
          </div>
          <button
            className="mt-5 w-full border-2 border-ink bg-ink px-4 py-3 text-sm font-black uppercase text-white hover:bg-blue disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isDemo}
            title={isDemo ? "Activez Supabase pour creer un client reel" : undefined}
            type="submit"
          >
            Creer client / business
          </button>
        </form>
      </section>

      <section className="border-2 border-ink bg-white p-5 shadow-soft">
        <h2 className="text-3xl font-black uppercase leading-none text-ink">Checklist avant proposition</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            "Vérifier Instagram",
            "Vérifier site / réservation",
            "Choisir le plan",
            "Préparer appel de vente"
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 border-2 border-line bg-paper p-3">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green" />
              <span className="text-sm font-black uppercase leading-5 text-ink">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function DiagnosticList({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <div className="border-2 border-ink bg-white shadow-soft">
      <h3 className={`px-3 py-2 text-sm font-black uppercase tracking-[0.12em] text-ink ${accent}`}>{title}</h3>
      <ul className="space-y-2 p-3">
        {items.map((item) => (
          <li key={item} className="border border-line bg-paper px-3 py-2 text-sm font-bold leading-5 text-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-line bg-paper p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-ink">{value}</p>
    </div>
  );
}
