import Link from "next/link";
import { ArrowRight, Building2, CircleDollarSign, Mail, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatClientPlan,
  formatClientStatus,
  getClientBusinesses,
  getClientNextStep,
  type ClientBusiness
} from "@/lib/clients";

export default async function ClientsPage() {
  const { clients, source } = await getClientBusinesses();
  const isDemo = source === "mock";
  const activeCount = clients.filter((client) => client.status === "active").length;
  const trialCount = clients.filter((client) => client.status === "trial").length;
  const recurringPlans = clients.filter((client) => client.plan !== "demo").length;
  const pausedCount = clients.filter((client) => client.status === "paused").length;

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Clients & businesses"
        description="Vue interne pour piloter les clients Atelier Nox: plan, statut, proprietaire, niveau de service et prochaine action."
      />

      {isDemo ? (
        <section className="mb-6 border border-[#dedad2] bg-[#fffbeb] p-4">
          <p className="text-sm font-black uppercase text-ink">Mode demo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Cette vue montre la structure operationnelle. Avec Supabase Auth actif, elle liste les businesses reels
            visibles par le compte admin.
          </p>
        </section>
      ) : null}

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="Clients" value={clients.length.toString()} detail="Businesses suivis" />
        <Metric label="Actifs" value={activeCount.toString()} detail="Service en cours" />
        <Metric label="Essais" value={trialCount.toString()} detail="A convertir" />
        <Metric label="Plans payants" value={recurringPlans.toString()} detail={`${pausedCount} en pause`} />
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <article className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
          <UsersRound className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Regle admin</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">
            Un client n&apos;est pas seulement un compte. C&apos;est un business avec un resultat attendu, un niveau de
            service, des actions a livrer et une preuve mensuelle a montrer.
          </p>
          <div className="mt-5 grid gap-3">
            <AdminRule text="Chaque client doit avoir un owner email." />
            <AdminRule text="Chaque business doit avoir un plan et un statut." />
            <AdminRule text="Chaque semaine doit produire au moins une action visible." />
          </div>
        </article>

        <section className="grid gap-3">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </section>
      </section>
    </>
  );
}

function ClientCard({ client }: { client: ClientBusiness }) {
  return (
    <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black uppercase leading-none text-ink">{client.name}</h2>
            <StatusBadge status={client.status} />
          </div>
          <p className="mt-2 text-sm font-black uppercase text-[#E85D2A]">{formatClientPlan(client.plan)}</p>
        </div>
        <span className="grid h-12 w-12 place-items-center border border-[#dedad2] bg-[#f0faf5]">
          <Building2 className="h-6 w-6" />
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Info icon={<Mail className="h-4 w-4" />} label="Owner" value={client.ownerEmail ?? "A inviter"} />
        <Info icon={<MapPin className="h-4 w-4" />} label="Localisation" value={client.city} />
        <Info icon={<CircleDollarSign className="h-4 w-4" />} label="Plan" value={formatClientPlan(client.plan)} />
        <Info label="Statut" value={formatClientStatus(client.status)} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Info label="Site" value={client.website ?? "A completer"} />
        <Info label="Reseau social" value={client.instagramHandle ?? "A connecter"} />
      </div>

      <div className="mt-4 flex items-start gap-3 border border-[#dedad2] bg-[#f8f7f2] p-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E85D2A]" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">Prochaine action</p>
          <p className="mt-1 text-sm font-black leading-5 text-ink">{getClientNextStep(client)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/clients/${client.id}`}
          className="inline-flex items-center gap-2 border border-[#dedad2] bg-white px-3 py-2 text-xs font-black uppercase text-ink hover:bg-[#e8f5ee]"
        >
          Voir fiche client
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/actions?businessId=${client.id}`}
          className="inline-flex items-center gap-2 border border-[#dedad2] bg-[#f0faf5] px-3 py-2 text-xs font-black uppercase text-ink"
        >
          Plan d&apos;actions
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="border border-[#dedad2] bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}</p>
      <strong className="mt-2 block text-4xl font-black text-ink">{value}</strong>
      <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
    </article>
  );
}

function AdminRule({ text }: { text: string }) {
  return (
    <div className="border border-[#dedad2] bg-white p-3 text-sm font-black uppercase leading-5 text-ink">{text}</div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
      <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-ink">{value}</p>
    </div>
  );
}
