import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot, FileSearch, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { createOnboardingSubmission } from "@/lib/onboarding-actions";

type DiagnosticLandingProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

const signals = ["Réseaux sociaux", "Avis Google", "Messages", "Contacts", "Réservation"];

const deliverables = [
  ["01", "Score visibilité", "Une lecture claire de votre présence locale."],
  ["02", "Opportunités", "Ce qui peut générer des conversations ou rendez-vous."],
  ["03", "Actions", "Les premières actions qu'Atelier Nox peut préparer."],
  ["04", "Plan conseillé", "La formule adaptée: Monitor, Managed ou Done For You."]
];

const proofPoints = [
  "Pas seulement des posts ou des likes.",
  "Un service géré, pas une plateforme à apprendre.",
  "Une première preuve avant tout abonnement."
];

export default async function DiagnosticGratuitPage({ searchParams }: DiagnosticLandingProps) {
  const params = await searchParams;
  const status = params?.status;

  return (
    <div className="space-y-10">
      <section className="border-t-4 border-ink pt-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="bg-white px-5 py-6 shadow-soft ring-1 ring-line md:px-8 md:py-9">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <BrandMark />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue">Diagnostic gratuit</p>
                  <p className="mt-2 max-w-sm text-sm font-black uppercase leading-5 text-stone-500">
                    Croissance locale gérée pour PME de Suisse romande.
                  </p>
                </div>
              </div>
              <span className="border border-line bg-paper px-3 py-2 text-xs font-black uppercase text-ink">
                Des CHF 190/mois
              </span>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue">
                  Audit local express
                </p>
                <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.94] text-ink md:text-7xl">
                  Vos signaux digitaux attirent-ils vraiment des clients?
                </h1>
                <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
                  Recevez une première analyse de votre visibilité locale: réseaux sociaux, avis Google, messages,
                  contacts et opportunités de rendez-vous.
                </p>
              </div>

              <div className="grid content-start gap-2">
                {signals.map((signal) => (
                  <div key={signal} className="flex items-center gap-2 border border-line bg-paper px-3 py-2">
                    <CircleDot className="h-3.5 w-3.5 text-blue" />
                    <span className="text-xs font-black uppercase text-ink">{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {proofPoints.map((point) => (
                <div key={point} className="flex items-start gap-2 border border-line bg-paper p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                  <span className="text-sm font-black leading-5 text-ink">{point}</span>
                </div>
              ))}
            </div>
          </article>

          <form action={createOnboardingSubmission} className="bg-white p-5 shadow-soft ring-1 ring-line md:p-6">
            <input name="returnPath" type="hidden" value="/diagnostic-gratuit" />
            <input name="desiredPlan" type="hidden" value="pas_encore" />

            <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue">Recevoir l&apos;analyse</p>
                <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">Votre diagnostic</h2>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center bg-acid ring-1 ring-ink">
                <FileSearch className="h-5 w-5" />
              </span>
            </div>

            {status === "ok" ? (
              <div className="mt-5 border border-green bg-paper p-3 text-sm font-black uppercase text-ink">
                Demande reçue. Atelier Nox peut préparer votre première lecture.
              </div>
            ) : null}

            {status === "missing" ? (
              <div className="mt-5 border border-ink bg-coral p-3 text-sm font-black uppercase text-ink">
                Merci de compléter le nom du business et l&apos;email.
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              <Field label="Nom du business" name="businessName" placeholder="Salon Belle Rive" required />
              <Field label="Email" name="ownerEmail" placeholder="contact@business.ch" type="email" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Ville" name="city" placeholder="Lausanne" defaultValue="Lausanne" />
                <Field label="Instagram" name="instagramHandle" placeholder="@monbusiness" />
              </div>
              <Field label="Site web" name="website" placeholder="https://..." />

              <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                Objectif prioritaire
                <select
                  className="border border-line bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:border-ink focus:bg-white"
                  name="mainObjective"
                  defaultValue="rendez_vous"
                >
                  <option value="rendez_vous">Plus de rendez-vous</option>
                  <option value="instagram">Réseaux sociaux qui convertissent</option>
                  <option value="relancer_contacts">Relancer anciens clients</option>
                  <option value="avis_google">Plus d&apos;avis Google</option>
                  <option value="plus_clients">Plus de clients</option>
                </select>
              </label>

              <button className="mt-2 flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 text-sm font-black uppercase text-white hover:bg-blue">
                Demander le diagnostic
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-xs font-bold leading-5 text-stone-500">
              Aucun engagement. Le diagnostic gratuit montre une première lecture avant toute proposition.
            </p>
          </form>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {deliverables.map(([number, title, detail]) => (
          <article key={title} className="bg-white p-4 shadow-soft ring-1 ring-line">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue">{number}</p>
            <h3 className="mt-4 text-xl font-black uppercase leading-none text-ink">{title}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="bg-white p-6 shadow-soft ring-1 ring-line">
          <TrendingUp className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">
            Une stratégie au-delà des réseaux sociaux.
          </h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">
            Atelier Nox relie contenus, relances, avis Google et actions commerciales. Le but n&apos;est pas de publier
            plus, mais de générer des opportunités mesurables.
          </p>
        </article>

        <article className="grid gap-3 md:grid-cols-2">
          <Value
            icon={<Sparkles className="h-5 w-5" />}
            title="Service géré"
            detail="Atelier Nox prépare le travail; le client suit les résultats dans son portail."
          />
          <Value
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Cadre sérieux"
            detail="Validation humaine, pas d'envoi automatique risqué, qualité pensée pour la Suisse romande."
          />
        </article>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 bg-ink px-5 py-5 text-white">
        <p className="max-w-2xl text-xl font-black uppercase leading-tight">
          Pas besoin d&apos;une plateforme de plus. Vous avez besoin d&apos;un système qui travaille pour votre croissance.
        </p>
        <Link
          href="/abonnement"
          className="inline-flex items-center gap-2 bg-acid px-4 py-3 text-sm font-black uppercase text-ink"
        >
          Voir les abonnements
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
  type = "text"
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <input
        className="border border-line bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:border-ink focus:bg-white"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function Value({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="bg-white p-5 shadow-soft ring-1 ring-line">
      <span className="grid h-10 w-10 place-items-center bg-paper text-blue ring-1 ring-line">{icon}</span>
      <h3 className="mt-4 text-sm font-black uppercase leading-5 text-ink">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{detail}</p>
    </div>
  );
}
