import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Handshake, NotebookTabs } from "lucide-react";
import { InstagramFeed } from "@/components/InstagramFeed";
import { subscriptionPlans } from "@/lib/data";

const badges = ["100% local", "Basé à Lausanne", "Service géré", "Rapports clairs"];

const managedBlocks = [
  {
    title: "Acquisition locale",
    detail:
      "Nous clarifions vos points d\u2019entrée : Google, site, réseaux sociaux, recommandations et demandes entrantes."
  },
  {
    title: "Suivi & conversion",
    detail:
      "Nous préparons les relances, les réponses et les priorités pour transformer l\u2019intérêt en conversations utiles."
  },
  {
    title: "Contenu & visibilité",
    detail:
      "Nous organisons les sujets à publier, les angles photo/vidéo et les messages qui restent proches du terrain."
  },
  {
    title: "Réputation & avis",
    detail: "Nous aidons à structurer les demandes d\u2019avis Google et les réponses, avec un ton humain et professionnel."
  },
  {
    title: "Analyse & pilotage",
    detail: "Nous suivons les actions réalisées, les validations et les prochains efforts dans un rapport simple."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero full-bleed — style ZIP.ch */}
      <section className="relative left-1/2 isolate -mt-6 min-h-[88vh] w-screen -translate-x-1/2 overflow-hidden bg-[#0d1a14]">
        <Image
          src="/images/alpine-growth-hero.webp"
          alt="Montagne suisse enneigée avec drapeau suisse"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_top]"
        />
        {/* Gradient: sombre à gauche pour lisibilité, montagne visible à droite */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(13,26,20,0.88) 0%, rgba(13,26,20,0.75) 35%, rgba(13,26,20,0.30) 58%, rgba(13,26,20,0.00) 80%)"
          }}
          aria-hidden="true"
        />
        {/* Fondu bas: transition douce vers le fond blanc de la page */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 100%)" }}
          aria-hidden="true"
        />

        <article className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div>
            <h1 className="max-w-[41rem] border-l-[3px] border-[#E85D2A] pl-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-[3.65rem]">
              Nous pilotons votre croissance locale, avec vous.
            </h1>
            <p className="mt-4 max-w-[39rem] text-base font-semibold leading-7 text-white/80 sm:text-lg">
              Atelier Nox accompagne les PME de Suisse romande avec un service humain, clair et mesurable :
              visibilité locale, contenus, relances, avis Google et suivi régulier.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-0 gap-y-2">
              {badges.map((badge, i) => (
                <span
                  key={badge}
                  className="flex items-center text-[11px] font-black uppercase tracking-[0.16em] text-white/65"
                >
                  {i > 0 && <span className="mx-3 h-3 w-px bg-white/30" aria-hidden="true" />}
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/diagnostic-gratuit"
                className="inline-flex items-center gap-2 border border-[#E85D2A] bg-[#E85D2A] px-5 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_rgba(232,93,42,0.45)] transition hover:-translate-y-0.5"
              >
                Diagnostic offert
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-white/40 bg-white/10 px-5 py-4 text-sm font-black uppercase text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Voir nos services
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section id="services" className="border-t border-[#12382F] pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Service géré</p>
            <h2 className="mt-2 text-4xl font-black leading-none text-[#101820]">Ce que nous gérons chaque semaine.</h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-[#12382F]">
            L&apos;objectif n&apos;est pas d&apos;ajouter une plateforme de plus. L&apos;objectif est de rendre le
            travail visible, organisé et utile pour votre commerce.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {managedBlocks.map((block, index) => (
            <article
              key={block.title}
              className="border border-[#12382F] bg-[#fffaf0] p-5 shadow-[5px_5px_0_rgba(18,56,47,0.12)]"
            >
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#E85D2A]">0{index + 1}</span>
              <h3 className="mt-5 text-2xl font-black leading-none text-[#101820]">{block.title}</h3>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#12382F]">{block.detail}</p>
            </article>
          ))}
        </div>
      </section>


      <section id="tarifs" className="border-t border-[#12382F]/20 pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Tarifs</p>
            <h2 className="mt-2 text-4xl font-black leading-none text-[#101820]">
              Des plans simples, un service réel.
            </h2>
          </div>
          <Link href="/abonnement" className="text-sm font-black uppercase text-[#E85D2A] underline underline-offset-4 hover:text-[#c94e22]">
            Voir tous les détails →
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.highlighted
                  ? "border border-[#12382F] bg-[#12382F] p-7 shadow-[6px_6px_0_#E85D2A]"
                  : "border border-[#12382F]/30 bg-[#fffaf0] p-7"
              }
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">
                {plan.name}
              </p>
              <div className="mt-4 flex items-end gap-1">
                <span className={`text-5xl font-black leading-none ${plan.highlighted ? "text-white" : "text-[#101820]"}`}>
                  {plan.price}
                </span>
                <span className={`mb-1 text-sm font-black ${plan.highlighted ? "text-white/60" : "text-[#12382F]/50"}`}>
                  /mois
                </span>
              </div>
              <p className={`mt-4 text-sm font-semibold leading-6 ${plan.highlighted ? "text-white/80" : "text-[#12382F]"}`}>
                {plan.description}
              </p>
              {plan.highlighted && (
                <Link
                  href="/diagnostic-gratuit"
                  className="mt-6 flex w-full items-center justify-center border border-[#E85D2A] bg-[#E85D2A] px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-[#d44e22]"
                >
                  Commencer par un diagnostic
                </Link>
              )}
            </article>
          ))}
        </div>

        <p className="mt-5 text-center text-xs font-semibold text-[#12382F]/45">
          Les détails de chaque plan, les extras et les budgets publicitaires sont présentés lors du diagnostic offert.
        </p>
      </section>

      <InstagramFeed />

      <section className="border border-[#12382F] bg-[#12382F] p-6 text-white shadow-[8px_8px_0_rgba(18,56,47,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Premier échange</p>
            <h2 className="mt-2 max-w-3xl text-4xl font-black leading-none">
              Parlons de votre commerce pendant 30 minutes.
            </h2>
          </div>
          <Link
            href="/diagnostic-gratuit"
            className="inline-flex items-center gap-2 border border-[#F5F1E8] bg-[#E85D2A] px-5 py-4 text-sm font-black uppercase text-white"
          >
            Demander un diagnostic
            <Handshake className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="apropos" className="flex items-center gap-3 pb-4 text-sm font-semibold text-[#12382F]">
        <NotebookTabs className="h-5 w-5 text-[#E85D2A]" />
        <p>L&apos;IA nous aide à préparer et organiser. La relation, la validation et le suivi restent humains.</p>
      </section>
    </div>
  );
}
