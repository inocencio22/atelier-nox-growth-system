import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import DiagnosticForm from "@/components/DiagnosticForm";

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

        {/* Droite — Formulaire interactif */}
        <DiagnosticForm status={status} />
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
