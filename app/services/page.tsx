import Link from "next/link";
import { ArrowRight, Camera, Handshake, Users, Video } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { centralServicePromise, digitalServices, humanPillars, terrainServices } from "@/lib/data";

const terrainIcons = [Video, Camera, Users, Handshake];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Un service géré de croissance locale pour PME suisses romandes."
        description={centralServicePromise}
      />

      {/* ─── Manifeste ────────────────────────────────────────── */}
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#0d1a14] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">
            Dans 5 ans
          </p>
          <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[0.92] text-white sm:text-6xl lg:text-7xl">
            L&apos;IA peut écrire.{" "}
            <span className="text-[#E85D2A]">Elle ne peut pas être là.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-white/65">
            Les outils changeront. La présence physique, la connaissance du terrain et la relation de confiance
            resteront irremplaçables. C&apos;est sur ça qu&apos;Atelier Nox est construit.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {humanPillars.map((pillar) => (
              <article key={pillar.number} className="border border-white/10 bg-white/5 p-5">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">
                  {pillar.number}
                </span>
                <h3 className="mt-3 text-xl font-black uppercase leading-none text-white">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/60">{pillar.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Terrain ────────────────────────────────────────────── */}
      <section className="mt-12">
        <div className="mb-6 flex items-end gap-5">
          <div>
            <span className="inline-block border border-[#E85D2A] bg-[#E85D2A] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
              Sur le terrain
            </span>
            <h2 className="mt-3 text-4xl font-black leading-none text-[#101820]">
              Nous venons chez vous.
            </h2>
          </div>
          <p className="mb-1 hidden max-w-sm text-sm font-semibold leading-6 text-[#12382F]/70 lg:block">
            Des services qui demandent une présence réelle — et que personne ne peut automatiser.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {terrainServices.map((service, index) => {
            const Icon = terrainIcons[index % terrainIcons.length];
            return (
              <article
                key={service.title}
                className="group relative border border-[#12382F] bg-[#12382F] p-5 text-white shadow-[5px_5px_0_#E85D2A] transition hover:-translate-y-0.5"
              >
                <span className="inline-block border border-[#E85D2A]/50 bg-[#E85D2A]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#E85D2A]">
                  {service.badge}
                </span>
                <Icon className="mt-4 h-7 w-7 text-[#E85D2A]" />
                <h3 className="mt-4 text-xl font-black leading-tight text-white">{service.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/70">{service.detail}</p>
                <p className="mt-4 border-t border-white/10 pt-3 text-xs font-black uppercase leading-5 text-white/40">
                  {service.scope}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─── Digital ────────────────────────────────────────────── */}
      <section className="mt-12">
        <div className="mb-6 flex items-end gap-5">
          <div>
            <span className="inline-block border border-[#12382F] bg-[#F5F1E8] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#12382F]">
              À distance
            </span>
            <h2 className="mt-3 text-4xl font-black leading-none text-[#101820]">
              Ce que nous préparons chaque semaine.
            </h2>
          </div>
          <p className="mb-1 hidden max-w-sm text-sm font-semibold leading-6 text-[#12382F]/70 lg:block">
            Le travail de fond : contenus, relances, Google, campagnes, suivi — organisé et livré avec clarté.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {digitalServices.map((service) => (
            <article
              key={service.title}
              className="border border-[#12382F] bg-[#fffaf0] p-5 shadow-[4px_4px_0_rgba(18,56,47,0.10)] transition hover:-translate-y-0.5"
            >
              <h3 className="text-base font-black leading-tight text-[#101820]">{service.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#12382F]">{service.detail}</p>
              <p className="mt-4 border-t border-[#D9D3C7] pt-3 text-[11px] font-black uppercase leading-5 text-[#12382F]/50">
                {service.scope}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Pour qui + CTA ─────────────────────────────────────── */}
      <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="border border-[#12382F] bg-[#fffaf0] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Pour qui</p>
          <h2 className="mt-3 text-3xl font-black leading-none text-[#101820]">
            Les commerces qui veulent avancer sans tout gérer eux-mêmes.
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Commerce local avec peu de temps disponible",
              "Besoin de contenus plus humains et réguliers",
              "Contacts à relancer et avis à mieux gérer",
              "Visibilité Google et locale à clarifier",
              "Événement ou lancement à venir",
              "Équipe à former sur les bases digitales"
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 border border-[#D9D3C7] bg-[#F5F1E8] p-3">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E85D2A]" />
                <span className="text-sm font-semibold text-[#12382F]">{item}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-[#12382F] bg-[#12382F] p-6 text-white shadow-[8px_8px_0_#E85D2A]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Premier échange</p>
          <h2 className="mt-3 text-3xl font-black leading-none">
            30 minutes pour comprendre votre situation.
          </h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-white/70">
            Nous regardons votre visibilité locale, vos contenus, vos avis Google et les premières actions simples
            à préparer. Sans engagement.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/diagnostic-gratuit"
              className="inline-flex items-center justify-center gap-2 border border-[#E85D2A] bg-[#E85D2A] px-5 py-4 text-sm font-black uppercase text-white shadow-[4px_4px_0_rgba(232,93,42,0.35)] transition hover:-translate-y-0.5"
            >
              Diagnostic offert
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/abonnement"
              className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/10 px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-white/20"
            >
              Voir les tarifs
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
