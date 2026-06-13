import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Notre histoire | Atelier Nox",
  description:
    "Avant de conseiller les PME, j'en ai dirigé une. Atelier Nox est né d'une expérience réelle de gestion d'un établissement commercial en Suisse romande."
};

const lessons = [
  {
    number: "01",
    title: "La visibilité, ça se construit",
    detail:
      "Être présent ne suffit pas. J'ai appris à construire une présence locale active : fiche Google, réseaux sociaux, événements, bouche-à-oreille — semaine après semaine."
  },
  {
    number: "02",
    title: "Le temps est la ressource la plus rare",
    detail:
      "Quand on gère l'équipe, les fournisseurs, les clients et les imprévus, la communication passe toujours au second plan. Pas par manque de volonté — par manque de temps."
  },
  {
    number: "03",
    title: "Les conseils ne suffisent pas",
    detail:
      "Ce dont un commerçant a besoin, ce n'est pas d'une liste de choses à faire. C'est d'une personne qui sait comment les adapter à sa réalité — et qui avance avec lui."
  },
  {
    number: "04",
    title: "La confiance locale se mérite",
    detail:
      "Dans une ville comme Payerne ou Lausanne, les clients choisissent des gens qu'ils connaissent ou qu'on leur recommande. La réputation se gère, elle ne s'improvise pas."
  }
];

export default function AProposPage() {
  return (
    <div className="space-y-0">

      {/* ── En-tête ──────────────────────────────────────── */}
      <section className="border-b border-[#12382F]/15 pb-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Notre histoire</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.92] text-[#101820] sm:text-6xl">
          Une expérience de terrain.{" "}
          <span className="text-[#12382F]">Un service concret.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#12382F]/70">
          Avant de conseiller les PME, j&apos;en ai dirigé une.
        </p>
      </section>

      {/* ── Photo ────────────────────────────────────────── */}
      <section className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-[#0d1a14]">
          <Image
            src="/images/bar.png"
            alt="The New Bridge, Payerne"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(13,26,20,0.75) 0%, rgba(13,26,20,0.15) 60%, rgba(13,26,20,0.0) 100%)"
            }}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="mx-auto max-w-7xl">
              <p className="max-w-md text-sm font-black uppercase tracking-[0.14em] text-white/60">
                The New Bridge, Payerne
              </p>
              <p className="mt-2 max-w-xl text-2xl font-black leading-tight text-white sm:text-3xl">
                Derrière chaque établissement, il y a une réalité que{" "}
                <span className="text-[#E85D2A]">les chiffres seuls ne racontent pas.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Récit ────────────────────────────────────────── */}
      <section className="grid gap-8 pt-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">L&apos;expérience</p>
          <h2 className="mt-3 text-4xl font-black leading-none text-[#101820]">
            Deux ans à diriger un établissement commercial.
          </h2>
          <div className="mt-6 space-y-5 text-sm font-semibold leading-7 text-[#12382F]">
            <p>
              Pendant deux ans, j&apos;ai assuré la direction opérationnelle d&apos;un établissement commercial
              à Payerne, en Suisse romande. J&apos;ai géré l&apos;intégralité du fonctionnement : accueil,
              communication, réseaux sociaux, événements, relations fournisseurs, gestion des stocks et
              maîtrise des charges courantes.
            </p>
            <p>
              Cette expérience m&apos;a permis de comprendre, de l&apos;intérieur, ce que vivent concrètement
              les petits commerçants : le manque de temps, la pression du chiffre d&apos;affaires, la
              difficulté à rester visible, et l&apos;importance d&apos;une communication cohérente et régulière.
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">La conviction</p>
          <h2 className="mt-3 text-4xl font-black leading-none text-[#101820]">
            Ce qui manque, c&apos;est rarement la volonté.
          </h2>
          <div className="mt-6 space-y-5 text-sm font-semibold leading-7 text-[#12382F]">
            <p>
              Lorsque cette étape professionnelle s&apos;est terminée, j&apos;en ai tiré une conviction
              simple : les outils de marketing et d&apos;intelligence artificielle sont accessibles.
              Ce qui manque souvent, c&apos;est une personne qui sait les adapter à la réalité du
              terrain — et qui comprend ce que cette réalité représente vraiment.
            </p>
            <p>
              C&apos;est de cette expérience qu&apos;Atelier Nox est né. Pas pour dispenser des
              conseils théoriques, mais pour apporter des stratégies concrètes de marketing et de
              communication — adaptées aux contraintes réelles des PME de Suisse romande.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4 leçons ─────────────────────────────────────── */}
      <section className="relative left-1/2 mt-12 w-screen -translate-x-1/2 bg-[#0d1a14] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Ce que j&apos;en retiens</p>
              <h2 className="mt-3 text-4xl font-black leading-none text-white sm:text-5xl">
                4 réalités apprises<br />sur le terrain.
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-px bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
            {lessons.map((lesson) => (
              <article
                key={lesson.number}
                className="group bg-[#0d1a14] p-7 transition hover:bg-[#12382F]"
              >
                <span className="block text-5xl font-black leading-none text-[#E85D2A]/25 transition group-hover:text-[#E85D2A]/40">
                  {lesson.number}
                </span>
                <h3 className="mt-5 text-lg font-black leading-snug text-white">{lesson.title}</h3>
                <div className="mt-3 h-px w-8 bg-[#E85D2A]" />
                <p className="mt-4 text-sm font-semibold leading-6 text-white/50">{lesson.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative left-1/2 mt-12 w-screen -translate-x-1/2 bg-[#12382F] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">
                L&apos;engagement Atelier Nox
              </p>
              <blockquote className="mt-5 text-4xl font-black leading-[1.05] text-white sm:text-5xl">
                &ldquo;Nous ne vous donnons pas seulement des conseils. Nous avançons avec vous,
                semaine après semaine.&rdquo;
              </blockquote>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                href="/diagnostic-gratuit"
                className="inline-flex items-center gap-2 border border-[#E85D2A] bg-[#E85D2A] px-6 py-4 text-sm font-black uppercase text-white shadow-[4px_4px_0_rgba(232,93,42,0.35)] transition hover:-translate-y-0.5"
              >
                Diagnostic offert
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-6 py-4 text-sm font-black uppercase text-white transition hover:bg-white/20"
              >
                Voir les services
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
