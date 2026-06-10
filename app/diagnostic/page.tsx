import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { leads } from "@/lib/data";
import { getSimulatedDiagnostic } from "@/lib/diagnostic";

export default function DiagnosticPage() {
  const diagnostic = getSimulatedDiagnostic(leads[0].id);

  return (
    <>
      <PageHeader
        eyebrow="Diagnostic gratuit"
        title="Analyser ma visibilité"
        description="Entrée gratuite du produit: le client reçoit une lecture claire de sa visibilité, puis découvre pourquoi l'abonnement Atelier Nox peut l'aider."
      />
      <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-2 border-ink bg-white p-5 shadow-soft">
          <h2 className="text-2xl font-black uppercase leading-none text-ink">Formulaire client</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["Nom du business", "Atelier Coupe Lausanne"],
              ["Ville / quartier", "Lausanne - Flon"],
              ["Instagram", "@ateliercoupe_lsn"],
              ["Site web", "atelier-coupe.ch"]
            ].map(([label, value]) => (
              <label key={label} className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                {label}
                <input
                  className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
                  defaultValue={value}
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-2 border-ink bg-acid p-4">
            <span className="text-sm font-black uppercase text-ink">Score visibilité</span>
            <strong className="text-4xl font-black text-ink">{diagnostic.score}</strong>
          </div>
          <Link
            href="/onboarding"
            className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-4 py-3 text-sm font-black uppercase text-white"
          >
            Demander mon échantillon gratuit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black uppercase leading-none text-ink">{diagnostic.title}</h2>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-stone-600">{diagnostic.summary}</p>
            </div>
            <StatusBadge status={diagnostic.lead.status} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <DiagnosticList title="Forces" items={diagnostic.strengths} accent="bg-acid" />
            <DiagnosticList title="Risques" items={diagnostic.risks} accent="bg-coral" />
            <DiagnosticList title="Actions" items={diagnostic.actions} accent="bg-blue text-white" />
          </div>
          <div className="mt-6 border-2 border-ink bg-paper p-4">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-1 h-5 w-5 text-blue" />
              <div>
                <h3 className="text-lg font-black uppercase text-ink">Débloqué avec abonnement</h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">
                  Contacts à relancer, messages personnalisés, analyse Instagram, plan hebdomadaire et rapport ROI simple.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

function DiagnosticList({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <div className="border-2 border-ink bg-white">
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
