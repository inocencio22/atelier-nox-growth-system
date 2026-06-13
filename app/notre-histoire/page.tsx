import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Notre histoire | Atelier Nox",
  description:
    "Atelier Nox est né d’une expérience réelle. Pas d’une théorie, pas d’une formation en ligne. D’un bar repris après 4 ans de fermeture — et rempli."
};

const lessons = [
  {
    number: "01",
    title: "La visibilité, ça se construit",
    detail:
      "Un commerce fermé depuis 4 ans n’existe plus dans la mémoire locale. J’ai dû reconstruire la présence de zéro : Google, réseaux, bouche-à-oreille, événements."
  },
  {
    number: "02",
    title: "Le temps est la ressource la plus rare",
    detail:
      "Quand on gère l’équipe, les fournisseurs, les clients et les imprévus, la communication passe toujours au second plan. Pas par manque de volonté — par manque de temps."
  },
  {
    number: "03",
    title: "Les conseils ne suffisent pas",
    detail:
      "Ce dont un commerçant a besoin, ce n’est pas d’une liste de choses à faire. C’est d’une personne qui les fait avec lui, de façon régulière et mesurable."
  },
  {
    number: "04",
    title: "La confiance locale se mérite",
    detail:
      "Dans une ville comme Payerne ou Lausanne, les clients choisissent des gens qu’ils connaissent ou recommandent. La réputation se gère, elle ne s’improvise pas."
  }
];

export default function AProposPage() {
  return (
    <div className="space-y-0">

      {/* ── Hero déclaration ─────────────────────────────── */}
      <section className="border-b border-[#12382F]/15 pb-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Notre histoire</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.92] text-[#101820] sm:text-6xl">
          Pas né d’une théorie.{" "}
          <span className="text-[#12382F]">Né du terrain.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#12382F]/70">
          Atelier Nox est né d’une expérience réelle : reprendre un bar fermé depuis 4 ans à Payerne,
          le faire fonctionner, le remplir — et comprendre ce que vivent vraiment les commerçants locaux.
        </p>
      </section>

      {/* ── Photo bar ────────────────────────────────────── */}
      <section className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-[#0d1a14]">
          <Image
            src="/images/bar.png"
            alt="Le bar de Payerne — file d’attente devant l’entrée"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(13,26,20,0.75) 0%, rgba(13,26,20,0.15) 60%, rgba(13,26,20,0.0) 100%)"
            }}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="mx-auto max-w-7xl">
              <p className="max-w-md text-sm font-black uppercase tracking-[0.14em] text-white/60">
                Payerne, Suisse romande
              </p>
              <p className="mt-2 max-w-xl text-2xl font-black leading-tight text-white sm:text-3xl">
                Un bar fermé depuis 4 ans.{" "}
                <span className="text-[#E85D2A]">Des gens qui font la queue pour entrer.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Récit ────────────────────────────────────────── */}
      <section className="grid gap-8 pt-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Le point de départ</p>
          <h2 className="mt-3 text-4xl font-black leading-none text-[#101820]">
            4 ans de fermeture. 2 ans pour tout reconstruire.
          </h2>
          <div className="mt-6 space-y-5 text-sm font-semibold leading-7 text-[#12382F]">
            <p>
              Pendant près de deux ans, j’ai dirigé un établissement local à Payerne. Un bar qui était
              fermé depuis 4 ans — sans clientèle, sans réputation, sans présence. J’ai dû tout
              reconstruire : la visibilité, la confiance, la communication, les événements.
            </p>
            <p>
              J’ai géré l’ensemble du fonctionnement : l’accueil des clients, l’équipe,
              les fournisseurs, les commandes, les stocks, les événements, les charges, les imprévus et les
              exigences administratives suisses. Simultanément.
            </p>
            <p>
              J’ai connu les soirées pleines — et les semaines vides. La pression du chiffre d’affaires,
              les dépenses qui tombent même quand les clients ne viennent pas, les décisions rapides à prendre
              sans avoir le temps de réfléchir.
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Ce que j’ai compris</p>
          <h2 className="mt-3 text-4xl font-black leading-none text-[#101820]">
            Un commerçant ne manque pas d’idées. Il manque de temps.
          </h2>
          <div className="mt-6 space-y-5 text-sm font-semibold leading-7 text-[#12382F]">
            <p>
              Il est facile de conseiller à un entrepreneur de publier davantage, de répondre aux avis,
              d’améliorer sa fiche Google, de relancer ses anciens clients ou de lancer des campagnes.
              Mais quand cette personne gère déjà tout le reste — ces actions passent naturellement au second plan.
            </p>
            <p>
              Ce n’est pas un manque de discipline. C’est une question de réalité quotidienne.
            </p>
            <p>
              C’est précisément de cette réalité qu’est né Atelier Nox. Pas pour donner des conseils
              supplémentaires. Pour avancer concrètement, semaine après semaine, aux côtés des commerces locaux.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ce que j'ai appris ───────────────────────────── */}
      <section className="mt-12 border-t border-[#12382F]/15 pt-12">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">4 leçons du terrain</p>
        <h2 className="mt-3 text-4xl font-black leading-none text-[#101820]">
          Ce que 2 ans derrière un comptoir m’ont appris.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lessons.map((lesson) => (
            <article
              key={lesson.number}
              className="border border-[#12382F] bg-[#fffaf0] p-5 shadow-[4px_4px_0_rgba(18,56,47,0.10)]"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">
                {lesson.number}
              </span>
              <h3 className="mt-3 text-xl font-black leading-tight text-[#101820]">{lesson.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#12382F]">{lesson.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Engagement ───────────────────────────────────── */}
      <section className="relative left-1/2 mt-12 w-screen -translate-x-1/2 bg-[#12382F] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">
                L’engagement Atelier Nox
              </p>
              <blockquote className="mt-5 text-4xl font-black leading-[1.05] text-white sm:text-5xl">
                &ldquo;Nous ne regardons pas les PME locales de l’extérieur. Nous connaissons la pression
                du terrain.&rdquo;
              </blockquote>
              <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-white/65">
                L’intelligence artificielle nous aide à travailler efficacement. Mais le cœur
                d’Atelier Nox reste humain : comprendre le commerce, ses contraintes, ses clients et sa
                réalité quotidienne.
              </p>
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
