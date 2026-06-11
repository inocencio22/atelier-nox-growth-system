import {
  CheckCircle2,
  CircleAlert,
  Cloud,
  Database,
  ExternalLink,
  FileCode2,
  GitBranch,
  KeyRound,
  ShieldCheck,
  TerminalSquare
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getDeployStatus, getInfraCompletion, getInfraStatus } from "@/lib/infra-status";

const migrationFiles = [
  "001_create_contacts.sql",
  "002_create_businesses.sql",
  "003_create_onboarding_submissions.sql",
  "004_create_diagnostics_and_proposals.sql",
  "005_create_commercial_actions.sql",
  "006_create_content_items.sql",
  "007_prepare_auth_profiles_roles.sql"
];

const productionSteps = [
  {
    title: "Creer projet Supabase",
    detail: "Choisir region europeenne, activer Auth email/password et copier Project URL + anon key."
  },
  {
    title: "Executer production.sql",
    detail: "Coller supabase/production.sql dans Supabase SQL Editor pour creer tables, RLS, profiles et roles."
  },
  {
    title: "Creer utilisateur admin",
    detail: "Creer le compte de Joao dans Authentication puis executer supabase/admin-bootstrap.sql."
  },
  {
    title: "Configurer Vercel",
    detail: "Ajouter NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans Production, Preview et Development."
  },
  {
    title: "Connecter domaine",
    detail: "Pointer ateliernox.ch ou joaopedro.chat vers Vercel et configurer l'URL dans Supabase Auth."
  },
  {
    title: "Test final",
    detail: "Tester /diagnostic-gratuit, /login, /clients, /portal, creation action et creation contenu."
  }
];

const quickLinks = [
  {
    label: "GitHub",
    href: "https://github.com/inocencio22/atelier-nox-growth-system",
    detail: "Code source, branches main/develop et historique."
  },
  {
    label: "Vercel",
    href: "https://vercel.com/atelier-nox-ch/atelier-nox-growth-system",
    detail: "Deploys, domaines, variables et previews."
  },
  {
    label: "Supabase",
    href: "https://supabase.com/dashboard/projects",
    detail: "Projet, Auth, SQL Editor et API keys."
  },
  {
    label: "Webapp",
    href: "https://atelier-nox-growth-system.vercel.app",
    detail: "Production publique."
  }
];

const setupCommands = [
  "npm run supabase:bundle",
  "git checkout develop",
  "git push origin develop",
  "npx vercel --prod"
];

export default function InfraPage() {
  const status = getInfraStatus();
  const completion = getInfraCompletion();
  const deployStatus = getDeployStatus();

  return (
    <>
      <PageHeader
        eyebrow="Production"
        title="Infrastructure"
        description="Checklist interne pour passer Atelier Nox du mode local/demo vers Supabase, Vercel, domaine et comptes reels."
      />

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="Preparation" value={`${completion.percent}%`} detail={`${completion.ready}/${completion.total} variables`} />
        <Metric label="Supabase" value={status[0].configured && status[1].configured ? "Pret" : "A config"} detail="Auth + data" />
        <Metric label="Vercel" value={process.env.VERCEL ? "Detecte" : "Local"} detail="Hosting Next.js" />
        <Metric label="Production" value={completion.isProductionReady ? "OK" : "En cours"} detail="Avant vente client" />
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[1fr_1.15fr]">
        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <GitBranch className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Depot & deploy</h2>
          <div className="mt-5 grid gap-3">
            {deployStatus.map((item) => (
              <DeployRow key={item.label} item={item} />
            ))}
          </div>
        </article>

        <article className="border-2 border-ink bg-paper p-5 shadow-soft">
          <TerminalSquare className="h-8 w-8 text-green" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Raccourcis operationnels</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                className="group border-2 border-ink bg-white p-4 transition hover:bg-acid"
                href={link.href}
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex items-center justify-between gap-3 text-sm font-black uppercase text-ink">
                  {link.label}
                  <ExternalLink className="h-4 w-4 text-blue transition group-hover:text-ink" />
                </span>
                <span className="mt-2 block text-sm font-semibold leading-5 text-stone-600">{link.detail}</span>
              </a>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="border-2 border-ink bg-acid p-5 shadow-soft">
          <Cloud className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Objectif</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">
            La partie 1 est complete quand le webapp est deploye, connecte a Supabase, protege par comptes admin/client
            et accessible sur un domaine professionnel.
          </p>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <Database className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Variables d&apos;environnement</h2>
          <div className="mt-5 grid gap-3">
            {status.map((item) => (
              <StatusRow key={item.label} item={item} />
            ))}
          </div>
        </article>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-2">
        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <KeyRound className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Supabase SQL</h2>
          <div className="mt-5 border-2 border-ink bg-acid p-4">
            <div className="flex items-start gap-3">
              <FileCode2 className="mt-1 h-5 w-5 shrink-0 text-ink" />
              <div>
                <p className="text-sm font-black uppercase leading-5 text-ink">Fichier recommande</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-ink">
                  Utiliser `supabase/production.sql` pour la premiere installation. Les migrations restent listees pour
                  audit et maintenance.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {migrationFiles.map((file, index) => (
              <div key={file} className="flex items-center justify-between gap-3 border-2 border-line bg-paper p-3">
                <span className="text-sm font-black text-ink">{file}</span>
                <span className="text-xs font-black uppercase text-blue">Etape {index + 1}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <ShieldCheck className="h-8 w-8 text-green" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Sequence production</h2>
          <div className="mt-5 grid gap-3">
            {productionSteps.map((step, index) => (
              <div key={step.title} className="border-2 border-line bg-paper p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-blue">Etape {index + 1}</p>
                <h3 className="mt-1 text-sm font-black uppercase leading-5 text-ink">{step.title}</h3>
                <p className="mt-1 text-sm font-semibold leading-5 text-stone-600">{step.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-6 border-2 border-ink bg-white p-5 shadow-soft">
        <TerminalSquare className="h-8 w-8 text-blue" />
        <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Commandes utiles</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {setupCommands.map((command) => (
            <code key={command} className="block border-2 border-line bg-ink p-3 text-sm font-bold text-white">
              {command}
            </code>
          ))}
        </div>
      </section>

      <section className="border-2 border-ink bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Deploy cible</p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">Vercel + Supabase + domaine</h2>
          </div>
          <a
            className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase text-ink"
            href="https://vercel.com"
            rel="noreferrer"
            target="_blank"
          >
            Ouvrir Vercel
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}

function DeployRow({ item }: { item: ReturnType<typeof getDeployStatus>[number] }) {
  return (
    <div className="flex items-start gap-3 border-2 border-line bg-paper p-3">
      {item.configured ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green" />
      ) : (
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
      )}
      <div>
        <p className="text-xs font-black uppercase tracking-[0.12em] text-blue">{item.label}</p>
        <p className="mt-1 break-words text-sm font-black uppercase leading-5 text-ink">{item.value}</p>
        <p className="mt-1 text-sm font-semibold leading-5 text-stone-600">{item.detail}</p>
      </div>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}</p>
      <strong className="mt-2 block text-4xl font-black text-ink">{value}</strong>
      <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
    </article>
  );
}

function StatusRow({ item }: { item: ReturnType<typeof getInfraStatus>[number] }) {
  return (
    <div className="flex items-start gap-3 border-2 border-line bg-paper p-3">
      {item.configured ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green" />
      ) : (
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
      )}
      <div>
        <p className="text-sm font-black uppercase leading-5 text-ink">{item.label}</p>
        <p className="mt-1 text-sm font-semibold leading-5 text-stone-600">{item.detail}</p>
        <p className="mt-2 text-xs font-black uppercase leading-5 text-blue">{item.nextStep}</p>
      </div>
    </div>
  );
}
