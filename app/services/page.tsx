import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  ClipboardList,
  Globe2,
  MapPinned,
  MessageSquareText,
  Search,
  ShieldCheck
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const services = [
  {
    title: "Diagnostic local IA",
    icon: Search,
    detail: "Analyse claire de votre visibilite: site, Google, reseaux sociaux, avis, offre et parcours client."
  },
  {
    title: "Google Business",
    icon: MapPinned,
    detail: "Optimisation locale, posts, services, photos, FAQ et avis pour inspirer confiance."
  },
  {
    title: "Reseaux sociaux",
    icon: Globe2,
    detail: "Contenus utiles orientes rendez-vous, pas seulement des publications decoratives."
  },
  {
    title: "Relances clients",
    icon: MessageSquareText,
    detail: "Messages prets pour recontacter les clients dormants, demandes de prix et avis Google."
  },
  {
    title: "Photo & video locale",
    icon: Camera,
    detail: "Briefs et production legere pour donner une presence plus premium et plus humaine."
  },
  {
    title: "Automatisation & IA",
    icon: Bot,
    detail: "IA utilisee avec precision pour preparer, organiser et mesurer, avec validation humaine."
  }
];

const method = [
  "Observer les signaux",
  "Prioriser les actions",
  "Preparer les contenus",
  "Valider les points sensibles",
  "Mesurer les resultats"
];

const values = ["qualite", "clarte", "suivi", "precision", "fiable", "local", "sans bruit", "mesurable"];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Un systeme de croissance locale gere pour PME."
        description="Atelier Nox combine marketing local, IA, reseaux sociaux, Google Business et suivi client pour transformer la visibilite en actions concretes."
      />

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <article className="border-2 border-ink bg-acid p-6 shadow-soft">
          <ShieldCheck className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">
            Pas une agence classique. Un service gere, clair et mesurable.
          </h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">
            Le client ne doit pas tout apprendre. Nous structurons les priorites, preparons les actions et montrons le
            travail dans un portail simple.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {values.map((value) => (
              <span key={value} className="border-2 border-ink bg-white px-3 py-2 text-xs font-black uppercase text-ink">
                {value}
              </span>
            ))}
          </div>
        </article>

        <div className="grid gap-3 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article key={service.title} className="border-2 border-ink bg-white p-5 shadow-soft">
                <span className="grid h-11 w-11 place-items-center border-2 border-ink bg-blue text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-2xl font-black uppercase leading-none text-ink">{service.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">{service.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="border-2 border-ink bg-white p-6 shadow-soft">
          <ClipboardList className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Methode Atelier Nox</h2>
          <div className="mt-5 grid gap-3">
            {method.map((step, index) => (
              <div key={step} className="grid grid-cols-[3rem_1fr] gap-2">
                <span className="grid place-items-center border-2 border-ink bg-paper text-sm font-black">{index + 1}</span>
                <div className="border-2 border-line bg-paper p-3 text-sm font-black uppercase text-ink">{step}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="border-2 border-ink bg-white p-6 shadow-soft">
          <CheckCircle2 className="h-8 w-8 text-green" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Pour qui?</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">
            PME locales qui veulent une presence plus professionnelle, des relances mieux organisees et un suivi clair,
            sans engager une equipe marketing complete.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/diagnostic-gratuit"
              className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase text-ink"
            >
              1er RDV offert
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/abonnement"
              className="inline-flex items-center gap-2 border-2 border-ink bg-white px-4 py-3 text-sm font-black uppercase text-ink hover:bg-paper"
            >
              Recevoir une offre
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
