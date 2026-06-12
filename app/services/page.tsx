import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  MapPinned,
  MessageSquareText,
  Search,
  ShieldCheck
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { centralServicePromise, officialServices } from "@/lib/data";

const method = [
  "Observer les signaux locaux",
  "Choisir les priorités simples",
  "Préparer les contenus et relances",
  "Valider les points sensibles",
  "Suivre les résultats chaque mois"
];

const values = ["qualité", "clarté", "suivi", "précision", "fiable", "local", "sans bruit", "mesurable"];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Un service géré de croissance locale pour PME suisses romandes."
        description={centralServicePromise}
      />

      <section className="mb-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <article className="border border-[#12382F] bg-[#12382F] p-6 text-white shadow-[8px_8px_0_#E85D2A]">
          <ShieldCheck className="h-8 w-8 text-[#E85D2A]" />
          <h2 className="mt-4 text-4xl font-black leading-none">
            Pas une plateforme à apprendre. Un service qui avance avec vous.
          </h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#F5F1E8]">
            Atelier Nox n&apos;est pas une agence de posts. Nous organisons les actions commerciales visibles, les
            contenus, les relances et le suivi avec un cadre clair.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {values.map((value) => (
              <span
                key={value}
                className="border border-[#F5F1E8]/40 bg-[#F5F1E8] px-3 py-2 text-xs font-black uppercase text-[#12382F]"
              >
                {value}
              </span>
            ))}
          </div>
        </article>

        <div className="grid gap-3 md:grid-cols-2">
          {officialServices.map((service) => (
            <article
              key={service.title}
              className="border border-[#12382F] bg-[#fffaf0] p-5 shadow-[5px_5px_0_rgba(18,56,47,0.12)]"
            >
              <h2 className="text-2xl font-black leading-none text-[#101820]">{service.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#12382F]">{service.detail}</p>
              <p className="mt-4 border-t border-[#D9D3C7] pt-3 text-xs font-black uppercase leading-5 text-[#12382F]">
                {service.scope}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="border border-[#12382F] bg-[#fffaf0] p-6 shadow-[6px_6px_0_rgba(18,56,47,0.12)]">
          <ClipboardList className="h-8 w-8 text-[#E85D2A]" />
          <h2 className="mt-4 text-3xl font-black leading-none text-[#101820]">Méthode Atelier Nox</h2>
          <div className="mt-5 grid gap-3">
            {method.map((step, index) => (
              <div key={step} className="grid grid-cols-[3rem_1fr] gap-2">
                <span className="grid place-items-center border border-[#12382F] bg-[#F5F1E8] text-sm font-black">
                  {index + 1}
                </span>
                <div className="border border-[#D9D3C7] bg-[#F5F1E8] p-3 text-sm font-black uppercase text-[#12382F]">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-[#12382F] bg-[#F5F1E8] p-6">
          <CheckCircle2 className="h-8 w-8 text-[#E85D2A]" />
          <h2 className="mt-4 text-3xl font-black leading-none text-[#101820]">Pour qui ?</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#12382F]">
            Pour les commerces, indépendants et PME qui veulent une présence plus professionnelle, des relances mieux
            organisées et un suivi clair, sans engager une équipe marketing complète ni gérer une plateforme de plus.
          </p>
          <div className="mt-5 grid gap-3">
            <ServiceLine icon={<MapPinned className="h-4 w-4" />} text="Commerce local avec peu de temps disponible" />
            <ServiceLine icon={<Camera className="h-4 w-4" />} text="Besoin de contenus plus humains et réguliers" />
            <ServiceLine
              icon={<MessageSquareText className="h-4 w-4" />}
              text="Contacts à relancer et avis à mieux gérer"
            />
            <ServiceLine icon={<Search className="h-4 w-4" />} text="Visibilité Google et locale à clarifier" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/diagnostic-gratuit"
              className="inline-flex items-center gap-2 border border-[#12382F] bg-[#E85D2A] px-4 py-3 text-sm font-black uppercase text-white"
            >
              Diagnostic offert
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/abonnement"
              className="inline-flex items-center gap-2 border border-[#12382F] bg-[#fffaf0] px-4 py-3 text-sm font-black uppercase text-[#12382F]"
            >
              Voir les tarifs
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}

function ServiceLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 border border-[#D9D3C7] bg-[#fffaf0] p-3">
      <span className="grid h-8 w-8 place-items-center bg-[#12382F] text-white">{icon}</span>
      <span className="text-sm font-black text-[#12382F]">{text}</span>
    </div>
  );
}
