import Link from "next/link";
import { ArrowRight, CheckCircle2, Handshake, MapPinned, Mountain, NotebookTabs } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { PlanCard } from "@/components/PlanCard";
import { subscriptionPlans } from "@/lib/data";

const badges = ["100% local", "Basé à Lausanne", "Service géré", "Rapports clairs"];

const managedBlocks = [
  {
    title: "Acquisition locale",
    detail: "Nous clarifions vos points d'entrée: Google, site, réseaux sociaux, recommandations et demandes entrantes."
  },
  {
    title: "Suivi & conversion",
    detail:
      "Nous préparons les relances, les réponses et les priorités pour transformer l'intérêt en conversations utiles."
  },
  {
    title: "Contenu & visibilité",
    detail:
      "Nous organisons les sujets à publier, les angles photo/vidéo et les messages qui restent proches du terrain."
  },
  {
    title: "Réputation & avis",
    detail:
      "Nous aidons à structurer les demandes d&apos;avis Google et les réponses, avec un ton humain et professionnel."
  },
  {
    title: "Analyse & pilotage",
    detail: "Nous suivons les actions réalisées, les validations et les prochains efforts dans un rapport simple."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid min-h-[calc(100vh-8rem)] gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <article className="pt-6">
          <div className="flex items-center gap-4">
            <BrandMark />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Atelier Nox</p>
              <p className="mt-2 max-w-md text-sm font-black uppercase leading-5 text-[#12382F]">
                Service géré de croissance locale pour PME de Suisse romande.
              </p>
            </div>
          </div>

          <h1 className="mt-10 max-w-5xl text-5xl font-black leading-[0.92] text-[#101820] sm:text-6xl lg:text-7xl">
            Nous pilotons votre croissance locale, avec vous.
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#12382F] sm:text-xl">
            Atelier Nox accompagne les PME de Suisse romande avec un service humain, clair et mesurable : visibilité
            locale, contenus, relances, avis Google et suivi régulier.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="border border-[#12382F] bg-[#fffaf0] px-4 py-2 text-xs font-black uppercase text-[#12382F]"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/diagnostic-gratuit"
              className="inline-flex items-center gap-2 border border-[#12382F] bg-[#E85D2A] px-5 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_#12382F] transition hover:-translate-y-0.5"
            >
              Parlons 30 minutes
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-[#12382F] bg-[#F5F1E8] px-5 py-4 text-sm font-black uppercase text-[#12382F] transition hover:bg-[#fffaf0]"
            >
              Voir le service
            </Link>
          </div>
        </article>

        <article className="relative min-h-[28rem] overflow-hidden border border-[#12382F] bg-[#12382F] p-5 text-white shadow-[10px_10px_0_rgba(18,56,47,0.18)]">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-[#D9D3C7]" />
          <div className="lausanne-ridge absolute inset-x-0 bottom-0 h-72 bg-[#F5F1E8]" />
          <div className="lausanne-ridge absolute inset-x-0 bottom-0 h-52 translate-y-6 bg-[#E85D2A]" />
          <div className="relative z-10 flex h-full min-h-[26rem] flex-col justify-between">
            <div className="flex justify-between gap-4">
              <span className="border border-white/40 px-3 py-2 text-xs font-black uppercase tracking-[0.16em]">
                Lausanne
              </span>
              <Mountain className="h-8 w-8 text-[#E85D2A]" />
            </div>

            <div className="max-w-md border border-white/40 bg-[#12382F]/88 p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Présence locale</p>
              <h2 className="mt-3 text-4xl font-black leading-none">
                Plus de clarté. Moins de bruit. Un suivi régulier.
              </h2>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#F5F1E8]">
                Une méthode simple pour savoir quoi publier, qui relancer et quelles actions préparer chaque semaine.
              </p>
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

      <section id="experience" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <article className="border border-[#12382F] bg-[#12382F] p-6 text-white shadow-[8px_8px_0_#E85D2A]">
          <MapPinned className="h-9 w-9 text-[#E85D2A]" />
          <h2 className="mt-6 text-4xl font-black leading-none">Nous connaissons la réalité du terrain.</h2>
        </article>
        <article className="border border-[#12382F] bg-[#fffaf0] p-6">
          <p className="text-lg font-semibold leading-8 text-[#12382F]">
            Avant de créer Atelier Nox, nous avons vécu la réalité d&apos;un commerce local : les clients à fidéliser,
            les avis à gérer, les périodes calmes, la pression du chiffre d&apos;affaires et le manque de temps.
            C&apos;est pour cela que notre approche est simple : nous ne vous donnons pas seulement des conseils. Nous
            avançons avec vous, semaine après semaine.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Clarté", "Suivi", "Précision"].map((item) => (
              <div key={item} className="flex items-center gap-2 border border-[#D9D3C7] bg-[#F5F1E8] p-3">
                <CheckCircle2 className="h-4 w-4 text-[#E85D2A]" />
                <span className="text-sm font-black uppercase text-[#12382F]">{item}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section id="tarifs" className="border-t border-[#12382F] pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Tarifs</p>
            <h2 className="mt-2 text-4xl font-black leading-none text-[#101820]">
              Des plans simples, un service réel.
            </h2>
          </div>
          <Link href="/abonnement" className="text-sm font-black uppercase text-[#E85D2A] underline underline-offset-4">
            Voir les détails
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

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
