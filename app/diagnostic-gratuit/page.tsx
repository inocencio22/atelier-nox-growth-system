import Link from "next/link";
import { ArrowRight, FileSearch, ShieldCheck } from "lucide-react";
import { createOnboardingSubmission } from "@/lib/onboarding-actions";

type DiagnosticLandingProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

const signals = ["Réseaux sociaux", "Avis Google", "Messages", "Contacts", "Réservations"];

const deliverables = [
  ["01", "Lecture locale", "Une première lecture claire de votre présence locale."],
  ["02", "Opportunités", "Les points qui peuvent aider à générer plus de conversations utiles."],
  ["03", "Actions simples", "Les premières actions qu'Atelier Nox peut préparer avec vous."],
  ["04", "Plan conseillé", "La formule adaptée : Local Clarity, Managed Growth ou Done For You Local."]
];

export default async function DiagnosticGratuitPage({ searchParams }: DiagnosticLandingProps) {
  const params = await searchParams;
  const status = params?.status;

  return (
    <div className="space-y-0">

      {/* ── Hero + Formulaire ─────────────────────────────── */}
      <section className="grid gap-0 border border-[#12382F] shadow-[8px_8px_0_rgba(18,56,47,0.10)] lg:grid-cols-[1fr_1fr]">

        {/* Gauche */}
        <div className="flex flex-col justify-between bg-[#fffaf0] p-8 lg:p-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Diagnostic gratuit</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.92] text-[#101820] lg:text-6xl">
              Parlons de votre commerce pendant 30 minutes.
            </h1>
            <p className="mt-5 max-w-md text-base font-semibold leading-7 text-[#12382F]/70">
              Nous regardons votre visibilité locale, vos contenus, vos avis Google et les actions simples à préparer en priorité.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#12382F]/40">Ce que nous analysons</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {signals.map((signal) => (
                  <span
                    key={signal}
                    className="border border-[#12382F]/20 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#12382F]"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-[#12382F]/10 pt-5">
              {[
                "Pas seulement des posts ou des likes.",
                "Un service géré, pas une plateforme à apprendre.",
                "Une première lecture avant tout abonnement."
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E85D2A]" />
                  <p className="text-sm font-semibold text-[#12382F]/60">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Droite — Formulaire */}
        <form
          action={createOnboardingSubmission}
          className="flex flex-col bg-[#12382F] p-8 lg:p-12"
        >
          <input name="returnPath" type="hidden" value="/diagnostic-gratuit" />
          <input name="desiredPlan" type="hidden" value="pas_encore" />

          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E85D2A]">Recevoir l&apos;analyse</p>
              <h2 className="mt-1.5 text-2xl font-black text-white">Votre demande</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5">
              <FileSearch className="h-5 w-5 text-white/50" />
            </div>
          </div>

          {status === "ok" ? (
            <div className="mt-5 border border-white/20 bg-white/10 p-4 text-sm font-bold text-white">
              ✓ Votre demande a bien été envoyée. Nous vous répondrons sous 24–48h ouvrables.
            </div>
          ) : null}

          {status === "error" || status === "missing" ? (
            <div className="mt-5 border border-[#E85D2A]/50 bg-[#E85D2A]/15 p-4 text-sm font-bold text-white">
              {status === "missing"
                ? "Merci de compléter le nom du business et l'email."
                : "Nous n'avons pas pu enregistrer votre demande. Veuillez réessayer."}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-4">
            <Field label="Nom de votre activité" name="businessName" placeholder="Votre commerce" required />
            <Field label="Email" name="ownerEmail" placeholder="contact@business.ch" type="email" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ville" name="city" placeholder="Lausanne" defaultValue="Lausanne" />
              <Field label="Instagram" name="instagramHandle" placeholder="@monbusiness" />
            </div>
            <Field label="Site web" name="website" placeholder="https://..." />

            <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
              Objectif prioritaire
              <select
                className="border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#E85D2A]"
                name="mainObjective"
                defaultValue="rendez_vous"
              >
                <option value="rendez_vous" className="bg-[#12382F]">Plus de rendez-vous</option>
                <option value="instagram" className="bg-[#12382F]">Réseaux sociaux qui inspirent confiance</option>
                <option value="relancer_contacts" className="bg-[#12382F]">Réactiver d&apos;anciens clients</option>
                <option value="avis_google" className="bg-[#12382F]">Plus d&apos;avis Google</option>
                <option value="plus_clients" className="bg-[#12382F]">Plus de clients</option>
              </select>
            </label>

            <button className="mt-1 flex w-full items-center justify-center gap-2 bg-[#E85D2A] px-4 py-4 text-sm font-black uppercase text-white transition hover:bg-[#d44e22]">
              Demander le diagnostic
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-5 text-xs font-semibold leading-5 text-white/30">
            Aucun engagement. Le diagnostic gratuit sert à comprendre votre situation avant toute proposition.
          </p>
          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Ou directement sur</p>
            <a
              href="https://wa.me/41792844918"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 border border-white/15 bg-white/8 px-4 py-3 text-sm font-black uppercase text-white transition hover:bg-white/15"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L0 24l6.336-1.508A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.213-3.727.887.924-3.618-.234-.372A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
              </svg>
              WhatsApp — +41 79 284 49 18
            </a>
          </div>
        </form>
      </section>

      {/* ── Ce que vous recevez ───────────────────────────── */}
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#0d1a14] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E85D2A]">Ce que vous recevez</p>
          <h2 className="mt-3 text-3xl font-black text-white">En 30 minutes, vous repartez avec :</h2>
          <div className="mt-8 grid gap-px bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map(([number, title, detail]) => (
              <article
                key={title}
                className="group bg-[#0d1a14] p-7 transition hover:bg-[#12382F]"
              >
                <span className="block text-4xl font-black leading-none text-[#E85D2A]/20 transition group-hover:text-[#E85D2A]/35">
                  {number}
                </span>
                <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
                <div className="mt-3 h-px w-6 bg-[#E85D2A]" />
                <p className="mt-4 text-sm font-semibold leading-6 text-white/45">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promesse ──────────────────────────────────────── */}
      <section className="grid gap-4 pt-8 lg:grid-cols-2">
        <article className="border border-[#12382F]/20 bg-[#fffaf0] p-8">
          <ShieldCheck className="h-7 w-7 text-[#E85D2A]" />
          <h2 className="mt-5 text-3xl font-black leading-tight text-[#101820]">
            Une stratégie au-delà des réseaux sociaux.
          </h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#12382F]/65">
            Atelier Nox relie contenus, relances, avis Google et actions commerciales. Le but n&apos;est pas de publier
            plus, mais de créer un suivi régulier et compréhensible.
          </p>
        </article>

        <article className="border border-[#12382F] bg-[#12382F] p-8">
          <h2 className="text-3xl font-black leading-tight text-white">Nous avançons avec vous.</h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-white/60">
            L&apos;IA reste un soutien discret pour préparer et organiser. La relation avec vos clients, la validation
            des messages et les décisions importantes restent humaines.
          </p>
          <Link
            href="/abonnement"
            className="mt-6 inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-xs font-black uppercase text-white transition hover:border-white/40"
          >
            Voir les abonnements
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </article>
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
    <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
      {label}
      <input
        className="border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/25 focus:border-[#E85D2A] focus:bg-white/15"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}
