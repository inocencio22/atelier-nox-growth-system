import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot, FileSearch, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { createOnboardingSubmission } from "@/lib/onboarding-actions";

type DiagnosticLandingProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

const signals = ["Réseaux sociaux", "Avis Google", "Messages", "Contacts", "Réservation"];

const deliverables = [
  ["01", "Lecture locale", "Une première lecture claire de votre présence locale."],
  ["02", "Opportunités", "Les points qui peuvent aider à générer plus de conversations utiles."],
  ["03", "Actions simples", "Les premières actions qu'Atelier Nox peut préparer avec vous."],
  ["04", "Plan conseillé", "La formule adaptée : Local Clarity, Managed Growth ou Done For You Local."]
];

const proofPoints = [
  "Pas seulement des posts ou des likes.",
  "Un service géré, pas une plateforme à apprendre.",
  "Une première lecture avant tout abonnement."
];

export default async function DiagnosticGratuitPage({ searchParams }: DiagnosticLandingProps) {
  const params = await searchParams;
  const status = params?.status;

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <article className="border border-[#12382F] bg-[#fffaf0] px-5 py-6 shadow-[8px_8px_0_rgba(18,56,47,0.16)] md:px-8 md:py-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <BrandMark />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E85D2A]">Diagnostic gratuit</p>
                <p className="mt-2 max-w-sm text-sm font-black uppercase leading-5 text-[#12382F]">
                  Une conversation claire pour comprendre votre situation locale.
                </p>
              </div>
            </div>
            <span className="border border-[#12382F] bg-[#F5F1E8] px-3 py-2 text-xs font-black uppercase text-[#12382F]">
              Dès CHF 190/mois
            </span>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E85D2A]">Premier échange</p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.94] text-[#101820] md:text-7xl">
                Parlons de votre commerce pendant 30 minutes.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#12382F]">
                Nous regardons votre visibilité locale, vos contenus, vos avis Google, vos relances possibles et les
                actions simples à préparer en priorité.
              </p>
            </div>

            <div className="grid content-start gap-2">
              {signals.map((signal) => (
                <div key={signal} className="flex items-center gap-2 border border-[#D9D3C7] bg-[#F5F1E8] px-3 py-2">
                  <CircleDot className="h-3.5 w-3.5 text-[#E85D2A]" />
                  <span className="text-xs font-black uppercase text-[#12382F]">{signal}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point} className="flex items-start gap-2 border border-[#D9D3C7] bg-[#F5F1E8] p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E85D2A]" />
                <span className="text-sm font-black leading-5 text-[#12382F]">{point}</span>
              </div>
            ))}
          </div>
        </article>

        <form
          action={createOnboardingSubmission}
          className="border border-[#12382F] bg-[#12382F] p-5 text-white shadow-[8px_8px_0_#E85D2A] md:p-6"
        >
          <input name="returnPath" type="hidden" value="/diagnostic-gratuit" />
          <input name="desiredPlan" type="hidden" value="pas_encore" />

          <div className="flex items-start justify-between gap-4 border-b border-[#F5F1E8]/30 pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E85D2A]">Recevoir l&apos;analyse</p>
              <h2 className="mt-2 text-3xl font-black leading-none">Votre demande</h2>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center border border-[#F5F1E8]/40 bg-[#F5F1E8] text-[#12382F]">
              <FileSearch className="h-5 w-5" />
            </span>
          </div>

          {status === "ok" ? (
            <div className="mt-5 border border-[#F5F1E8] bg-[#F5F1E8] p-3 text-sm font-black uppercase text-[#12382F]">
              Demande reçue. Atelier Nox peut préparer votre première lecture.
            </div>
          ) : null}

          {status === "missing" ? (
            <div className="mt-5 border border-[#F5F1E8] bg-[#E85D2A] p-3 text-sm font-black uppercase text-white">
              Merci de compléter le nom du business et l&apos;email.
            </div>
          ) : null}

          <div className="mt-5 grid gap-3">
            <Field label="Nom du business" name="businessName" placeholder="Votre commerce" required />
            <Field label="Email" name="ownerEmail" placeholder="contact@business.ch" type="email" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Ville" name="city" placeholder="Lausanne" defaultValue="Lausanne" />
              <Field label="Instagram" name="instagramHandle" placeholder="@monbusiness" />
            </div>
            <Field label="Site web" name="website" placeholder="https://..." />

            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-[#F5F1E8]">
              Objectif prioritaire
              <select
                className="border border-[#F5F1E8]/40 bg-[#F5F1E8] px-3 py-3 text-sm font-bold normal-case tracking-normal text-[#101820] outline-none focus:border-[#E85D2A]"
                name="mainObjective"
                defaultValue="rendez_vous"
              >
                <option value="rendez_vous">Plus de rendez-vous</option>
                <option value="instagram">Réseaux sociaux qui inspirent confiance</option>
                <option value="relancer_contacts">Relancer anciens clients</option>
                <option value="avis_google">Plus d&apos;avis Google</option>
                <option value="plus_clients">Plus de clients</option>
              </select>
            </label>

            <button className="mt-2 flex w-full items-center justify-center gap-2 border border-[#F5F1E8] bg-[#E85D2A] px-4 py-3 text-sm font-black uppercase text-white hover:bg-[#d94f21]">
              Demander le diagnostic
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-4 text-xs font-bold leading-5 text-[#D9D3C7]">
            Aucun engagement. Le diagnostic gratuit sert à comprendre votre situation avant toute proposition.
          </p>
        </form>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {deliverables.map(([number, title, detail]) => (
          <article
            key={title}
            className="border border-[#12382F] bg-[#fffaf0] p-4 shadow-[4px_4px_0_rgba(18,56,47,0.12)]"
          >
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E85D2A]">{number}</p>
            <h3 className="mt-4 text-xl font-black leading-none text-[#101820]">{title}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#12382F]">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border border-[#12382F] bg-[#fffaf0] p-6">
          <ShieldCheck className="h-8 w-8 text-[#E85D2A]" />
          <h2 className="mt-4 text-4xl font-black leading-none text-[#101820]">
            Une stratégie au-delà des réseaux sociaux.
          </h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#12382F]">
            Atelier Nox relie contenus, relances, avis Google et actions commerciales. Le but n&apos;est pas de publier
            plus, mais de créer un suivi régulier et compréhensible.
          </p>
        </article>

        <article className="border border-[#12382F] bg-[#12382F] p-6 text-white">
          <h2 className="text-3xl font-black leading-none">Nous avançons avec vous.</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#F5F1E8]">
            L&apos;IA reste un soutien discret pour préparer et organiser. La relation avec vos clients, la validation
            des messages et les décisions importantes restent humaines.
          </p>
        </article>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 border border-[#12382F] bg-[#12382F] px-5 py-5 text-white">
        <p className="max-w-2xl text-xl font-black leading-tight">
          Un premier échange pour voir ce qui peut être clarifié, préparé et suivi.
        </p>
        <Link
          href="/abonnement"
          className="inline-flex items-center gap-2 border border-[#F5F1E8] bg-[#E85D2A] px-4 py-3 text-sm font-black uppercase text-white"
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
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-[#F5F1E8]">
      {label}
      <input
        className="border border-[#F5F1E8]/40 bg-[#F5F1E8] px-3 py-3 text-sm font-bold normal-case tracking-normal text-[#101820] outline-none focus:border-[#E85D2A]"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}
