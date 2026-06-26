import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Database, Mail, MessageCircle, Phone, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { PageHeader } from "@/components/PageHeader";
import { ProposalPreview } from "@/components/ProposalPreview";
import { StatusBadge } from "@/components/StatusBadge";
import { convertToClient, saveGeneratedDiagnostic } from "@/lib/onboarding-actions";
import {
  formatDesiredPlan,
  formatObjective,
  generateSubmissionDiagnostic,
  getOnboardingSubmissionById
} from "@/lib/onboarding";

type DemandeDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ client?: string; saved?: string; business_id?: string }>;
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

  // Server-side idempotency guard: if already converted, disable the form
  const alreadyConverted = Boolean(
    submission &&
    (submission.status === "converted" ||
      (submission as { convertedAt?: string | null }).convertedAt !== null ||
      (submission as { convertedBusinessId?: string | null }).convertedBusinessId !== null)
  );

  const phonePrefix = submission.notes?.match(/^📱\s*([^\n]+)/);
  const ownerPhoneClean = phonePrefix ? phonePrefix[1].trim() : null;
  const notesWithoutPhone = submission.notes?.replace(/^📱[^\n]+\n\n?/, "") || null;
  const waLink = ownerPhoneClean
    ? `https://wa.me/${ownerPhoneClean.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(diagnostic.outreachScript)}`
    : null;

  return (
    <>
      <Link
        href="/demandes"
        className="mb-5 inline-flex items-center gap-2 border border-[#dedad2] bg-white px-3 py-2 text-xs font-black uppercase text-ink hover:bg-[#e8f5ee]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour demandes
      </Link>

      <PageHeader
        eyebrow={isDemo ? "Diagnostic demo" : "Diagnostic client"}
        title={diagnostic.title}
        description="Page de travail interne: transformer les donnees du formulaire en diagnostic commercial, proposition et message de contact."
      />

      {/* Saved messages */}
      {query?.saved === "ok" && (
        <div className="mb-6 border border-[#dedad2] bg-[#f0faf5] p-4 text-sm font-black uppercase text-ink">
          Diagnostic et proposition sauvegardes. La demande est maintenant prete a contacter.
        </div>
      )}
      {query?.saved === "demo" && (
        <div className="mb-6 border border-[#dedad2] bg-[#fffbeb] p-4 text-sm font-black uppercase text-ink">
          Mode demo: activez Supabase et appliquez la migration 004 pour sauvegarder ce diagnostic.
        </div>
      )}

      {/* Client creation messages */}
      {query?.client === "demo" && (
        <div className="mb-6 border-2 border-amber-400 bg-amber-50 p-4">
          <p className="text-sm font-black uppercase text-amber-900">Mode demo - donnees non reelles</p>
          <p className="mt-1 text-sm font-semibold text-amber-800">
            Cette demande vient des donnees exemple. Activez Supabase pour creer un vrai client.
          </p>
        </div>
      )}
      {query?.client === "nokey" && (
        <div className="mb-6 border-2 border-red-400 bg-red-50 p-4">
          <p className="text-sm font-black uppercase text-red-900">Cle manquante: SUPABASE_SERVICE_ROLE_KEY</p>
          <p className="mt-1 text-sm font-semibold text-red-800">
            Allez dans Vercel / Settings / Environment Variables et ajoutez la variable SUPABASE_SERVICE_ROLE_KEY avec
            la cle de service de votre projet Supabase. Puis redeploy.
          </p>
        </div>
      )}
      {query?.client === "error" && (
        <div className="mb-6 border-2 border-red-400 bg-red-50 p-4">
          <p className="text-sm font-black uppercase text-red-900">Erreur lors de la creation du client</p>
          <p className="mt-1 text-sm font-semibold text-red-800">
            Verifiez les logs Vercel, les RLS admin et la table businesses dans Supabase.
          </p>
        </div>
      )}
      {query?.client === "unauthorized" && (
        <div className="mb-6 border-2 border-red-400 bg-red-50 p-4">
          <p className="text-sm font-black uppercase text-red-900">Acces refuse</p>
          <p className="mt-1 text-sm font-semibold text-red-800">
            Seul un administrateur peut convertir une demande en client.
          </p>
        </div>
      )}
      {query?.client === "already_converted" && (
        <div className="mb-6 border-2 border-blue-400 bg-blue-50 p-4">
          <p className="text-sm font-black uppercase text-blue-900">Deja converti</p>
          <p className="mt-1 text-sm font-semibold text-blue-800">
            Cette demande a deja ete convertie en client.{" "}
            {query.business_id && (
              <Link href={`/clients/${query.business_id}`} className="underline hover:text-blue-900">
                Voir le client existant
              </Link>
            )}
          </p>
        </div>
      )}
      {query?.client === "ok" && (
        <div className="mb-6 border-2 border-green-400 bg-green-50 p-4">
          <p className="text-sm font-black uppercase text-green-900">Client cree avec succes</p>
          <p className="mt-1 text-sm font-semibold text-green-800">
            Le business client a ete cree et la demande marquee comme convertie.
          </p>
        </div>
      )}

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Demande recue</p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">{submission.businessName}</h2>
              <p className="mt-3 text-sm font-black text-stone-600">
                {submission.city} · {submission.niche}
              </p>
            </div>
            <StatusBadge status={submission.status} />
          </div>

          <div className="mt-5 grid gap-3">
            <Info label="Email" value={submission.ownerEmail} />
            {ownerPhoneClean && <Info label="WhatsApp / Tel." value={ownerPhoneClean} />}
            <Info label="Objectif" value={formatObjective(submission.mainObjective)} />
            <Info label="Plan envisage" value={formatDesiredPlan(submission.desiredPlan)} />
            <Info label="Site" value={submission.website ?? "A completer"} />
            <Info label="Instagram" value={submission.instagramHandle ?? "A verifier"} />
          </div>

          {notesWithoutPhone && (
            <div className="mt-4 border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">Notes client</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-stone-700">{notesWithoutPhone}</p>
            </div>
          )}

          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 border-2 border-[#12382F] bg-[#12382F] px-4 py-3 text-sm font-black uppercase text-white transition hover:bg-[#0d1a14]"
            >
              <MessageCircle className="h-4 w-4" />
              Contacter sur WhatsApp
            </a>
          ) : (
            <div className="mt-4 flex items-center gap-2 border-2 border-[#e8e5dd] bg-[#f8f7f2] px-4 py-3 text-sm font-semibold text-stone-500">
              <Phone className="h-4 w-4 shrink-0" />
              Pas de numero - contactez par email ou Instagram
            </div>
          )}
        </article>

        <article className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
          <Sparkles className="h-8 w-8 text-ink" />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Score visibilite</p>
          <div className="mt-2 flex items-end gap-3">
            <strong className="text-7xl font-black leading-none text-ink">{diagnostic.score}</strong>
            <span className="pb-2 text-2xl font-black text-ink">/100</span>
          </div>
          <p className="mt-5 text-base font-bold leading-7 text-ink">{diagnostic.summary}</p>
          <form action={saveGeneratedDiagnostic} className="mt-5">
            <input type="hidden" name="id" value={submission.id} />
            <button className="inline-flex w-full items-center justify-center gap-2 border border-[#dedad2] bg-white px-4 py-3 text-sm font-black uppercase text-ink hover:bg-[#0d1a14] hover:text-white">
              <Database className="h-4 w-4" />
              Sauvegarder diagnostic + proposition
            </button>
          </form>
        </article>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <DiagnosticList title="Forces" items={diagnostic.strengths} accent="bg-[#f0faf5]" />
        <DiagnosticList title="Risques" items={diagnostic.risks} accent="bg-[#fee2e2]" />
        <DiagnosticList title="Actions 7 jours" items={diagnostic.actions} accent="bg-[#12382F] text-white" />
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <ProposalPreview proposal={diagnostic.suggestedProposal} />

        <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#dedad2] bg-[#12382F] text-white">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-black uppercase leading-none text-ink">Message de contact</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
                Script manuel pour envoyer par email, Instagram ou WhatsApp apres validation humaine.
              </p>
            </div>
          </div>
          <div className="mt-5 border-2 border-[#e8e5dd] bg-[#f8f7f2] p-4 text-sm font-bold leading-6 text-ink">
            {diagnostic.outreachScript}
          </div>
          <CopyButton text={diagnostic.outreachScript} label="Copier le script" />
        </article>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
          <Database className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Convertir en client</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">
            Quand la demande est gagnee, creez le business client. La conversion est atomique: le business, le statut et
            le log d&apos;audit sont ecrits dans une seule transaction.
          </p>
          {isDemo && (
            <p className="mt-3 border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">
              Mode demo actif - le bouton est desactive. Connectez-vous avec un vrai compte Supabase.
            </p>
          )}
          {alreadyConverted && !isDemo && (
            <p className="mt-3 border border-blue-200 bg-blue-50 p-3 text-xs font-bold text-blue-800">
              Cette demande a deja ete convertie en client.
            </p>
          )}
        </article>

        <form action={convertToClient} className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={submission.id} />
          <h2 className="text-2xl font-black uppercase leading-none text-ink">Creation business</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Info label="Business" value={submission.businessName} />
            <Info label="Owner email" value={submission.ownerEmail} />
            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600 md:col-span-2">
              Plan confirme
              <select
                className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee] disabled:cursor-not-allowed disabled:opacity-50"
                name="plan"
                defaultValue={submission.desiredPlan === "pas_encore" ? "essentiel" : submission.desiredPlan}
                disabled={isDemo || alreadyConverted}
              >
                <option value="essentiel">Local Clarity - CHF 190/mois</option>
                <option value="growth">Managed Growth - CHF 390/mois</option>
                <option value="pro_local">Done For You Local - CHF 690/mois</option>
                <option value="partner">Partner - sur mesure</option>
              </select>
            </label>
          </div>
          <button
            className="mt-5 w-full border border-[#dedad2] bg-ink px-4 py-3 text-sm font-black uppercase text-white hover:bg-[#0d1a14] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isDemo || alreadyConverted}
            title={
              isDemo
                ? "Activez Supabase pour creer un client reel"
                : alreadyConverted
                  ? "Cette demande a deja ete convertie"
                  : undefined
            }
            type="submit"
          >
            {alreadyConverted ? "Deja converti" : "Creer client / business"}
          </button>
        </form>
      </section>

      <section className="border border-[#dedad2] bg-white p-5 shadow-sm">
        <h2 className="text-3xl font-black uppercase leading-none text-ink">Checklist avant proposition</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {["Verifier Instagram", "Verifier site / reservation", "Choisir le plan", "Preparer appel de vente"].map(
            (item) => (
              <div key={item} className="flex items-start gap-2 border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                <span className="text-sm font-black uppercase leading-5 text-ink">{item}</span>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}

function DiagnosticList({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <div className="border border-[#dedad2] bg-white shadow-sm">
      <h3 className={`px-3 py-2 text-sm font-black uppercase tracking-[0.12em] text-ink ${accent}`}>{title}</h3>
      <ul className="space-y-2 p-3">
        {items.map((item) => (
          <li
            key={item}
            className="border border-[#e8e5dd] bg-[#f8f7f2] px-3 py-2 text-sm font-bold leading-5 text-ink"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-ink">{value}</p>
    </div>
  );
}
