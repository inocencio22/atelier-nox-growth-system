import Link from "next/link";
import { CalendarClock, CheckCircle2, CircleAlert, Eye, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { createCommercialAction, updateCommercialActionStatus } from "@/lib/commercial-action-actions";
import { formatClientPlan, getClientBusinessById, getClientBusinesses } from "@/lib/clients";
import {
  formatCommercialActionPriority,
  formatCommercialActionStatus,
  getCommercialActions,
  type CommercialAction,
  type CommercialActionStatus
} from "@/lib/commercial-actions";

const statusButtons: Array<{ value: CommercialActionStatus; label: string }> = [
  { value: "in_progress", label: "En cours" },
  { value: "waiting_approval", label: "À approuver" },
  { value: "done", label: "Terminé" },
  { value: "blocked", label: "Bloqué" }
];

type ActionsPageProps = {
  searchParams?: Promise<{
    businessId?: string;
  }>;
};

export default async function ActionsPage({ searchParams }: ActionsPageProps) {
  const params = await searchParams;
  const selectedBusinessId = params?.businessId;
  const selectedClient = selectedBusinessId ? (await getClientBusinessById(selectedBusinessId)).client : null;
  const { clients } = await getClientBusinesses();
  const { actions, source } = await getCommercialActions(selectedClient?.id);
  const isDemo = source === "mock";
  const canCreate = Boolean(selectedClient) && !isDemo;
  const todoCount = actions.filter((action) => action.status === "todo").length;
  const waitingCount = actions.filter((action) => action.status === "waiting_approval").length;
  const doneCount = actions.filter((action) => action.status === "done").length;
  const highPriorityCount = actions.filter((action) => action.priority === "high").length;

  return (
    <>
      <PageHeader
        eyebrow="Service delivery"
        title="Actions commerciales"
        description="La file de travail Atelier Nox: chaque action montre quoi faire, pourquoi, par quel canal, avec quel potentiel et quel résultat."
      />

      {isDemo ? (
        <section className="mb-6 border-2 border-ink bg-yellow p-4">
          <p className="text-sm font-black uppercase text-ink">Mode démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Les actions affichées sont des exemples. Activez Supabase et appliquez la migration 005 pour créer et suivre
            des actions réelles.
          </p>
        </section>
      ) : null}

      {selectedClient ? (
        <section className="mb-6 border-2 border-ink bg-white p-4 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Client selectionne</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black uppercase leading-none text-ink">{selectedClient.name}</h2>
              <p className="mt-2 text-sm font-bold text-stone-600">
                {formatClientPlan(selectedClient.plan)} / {selectedClient.ownerEmail ?? "owner a inviter"}
              </p>
            </div>
            <a
              href={`/clients/${selectedClient.id}`}
              className="border-2 border-ink bg-acid px-3 py-2 text-xs font-black uppercase text-ink"
            >
              Retour fiche client
            </a>
          </div>
        </section>
      ) : (
        <ClientPicker
          clients={clients.map((client) => ({
            id: client.id,
            name: client.name,
            detail: `${formatClientPlan(client.plan)} / ${client.city}`
          }))}
          currentPath="/actions"
          title="Sélectionnez un client avant de créer une action."
        />
      )}

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="À faire" value={todoCount.toString()} detail="Actions ouvertes" />
        <Metric label="À approuver" value={waitingCount.toString()} detail="Validation client" />
        <Metric label="Terminées" value={doneCount.toString()} detail="Preuve du service" />
        <Metric label="Priorité haute" value={highPriorityCount.toString()} detail="Impact rapide" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-6">
          <article className="border-2 border-ink bg-acid p-5 shadow-soft">
            <Sparkles className="h-8 w-8 text-ink" />
            <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Principe</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-ink">
              Le client ne doit pas gérer le marketing. Atelier Nox prépare et exécute les actions; le client voit le
              travail, valide si nécessaire et comprend le résultat.
            </p>
          </article>

          <form action={createCommercialAction} className="border-2 border-ink bg-white p-5 shadow-soft">
            <input type="hidden" name="businessId" value={selectedClient?.id ?? ""} />
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink bg-blue text-white">
                <Plus className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-black uppercase leading-none text-ink">Créer une action</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
                  Utilisé par Atelier Nox pour transformer une opportunité en tâche mesurable.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <Field label="Action" name="title" placeholder="Relancer 8 clientes dormantes" required />
              <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                Description
                <textarea
                  className="min-h-28 border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case leading-6 tracking-normal text-ink outline-none focus:bg-acid"
                  name="description"
                  placeholder="Préparer un message doux et proposer deux créneaux cette semaine."
                  required
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Select
                  label="Canal"
                  name="channel"
                  options={["WhatsApp", "Instagram", "Email", "Google Business", "Téléphone"]}
                />
                <Select label="Priorité" name="priority" options={["high", "medium", "low"]} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Échéance" name="dueDate" placeholder="2026-06-15" type="date" />
                <Field label="Valeur estimée" name="estimatedValue" placeholder="CHF 900" />
              </div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-ink">
                <input className="h-4 w-4 accent-[#c6ff00]" name="visibleToClient" type="checkbox" defaultChecked />
                Visible dans le portail client
              </label>
            </div>
            <button
              className="mt-5 w-full border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase text-ink disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canCreate}
              title={
                isDemo
                  ? "Activez Supabase pour créer des actions réelles"
                  : !selectedClient
                    ? "Sélectionnez d'abord un client"
                    : undefined
              }
              type="submit"
            >
              Enregistrer l&apos;action
            </button>
          </form>
        </div>

        <section className="grid gap-3">
          {actions.map((action) => (
            <CommercialActionCard key={action.id} action={action} isDemo={isDemo} />
          ))}
        </section>
      </section>
    </>
  );
}

function ClientPicker({
  clients,
  currentPath,
  title
}: {
  clients: Array<{ id: string; name: string; detail: string }>;
  currentPath: string;
  title: string;
}) {
  return (
    <section className="mb-6 border-2 border-ink bg-white p-4 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Contexte obligatoire</p>
      <h2 className="mt-2 text-2xl font-black uppercase leading-none text-ink">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-stone-600">
        Les actions sont liées à un business précis pour apparaître correctement dans le portail client et dans la fiche
        opérationnelle.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`${currentPath}?businessId=${client.id}`}
            className="border-2 border-ink bg-paper px-3 py-2 text-xs font-black uppercase text-ink hover:bg-acid"
          >
            {client.name}
            <span className="ml-2 text-stone-500">{client.detail}</span>
          </Link>
        ))}
      </div>
    </section>
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

function CommercialActionCard({ action, isDemo }: { action: CommercialAction; isDemo: boolean }) {
  return (
    <article className="border-2 border-ink bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black uppercase leading-none text-ink">{action.title}</h2>
            <StatusBadge status={action.status} />
          </div>
          <p className="mt-2 text-sm font-black uppercase text-blue">{action.channel}</p>
        </div>
        <span className="grid h-12 w-12 place-items-center border-2 border-ink bg-acid">
          {action.status === "done" ? <CheckCircle2 className="h-6 w-6" /> : <CalendarClock className="h-6 w-6" />}
        </span>
      </div>

      <p className="mt-4 border-2 border-line bg-paper p-3 text-sm font-semibold leading-6 text-stone-700">
        {action.description}
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Info label="Status" value={formatCommercialActionStatus(action.status)} />
        <Info label="Priorité" value={formatCommercialActionPriority(action.priority)} />
        <Info label="Échéance" value={action.dueDate ?? "À planifier"} />
        <Info label="Potentiel" value={action.estimatedValue} />
      </div>

      {action.result ? (
        <div className="mt-4 flex items-start gap-3 border-2 border-ink bg-paper p-3">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">Résultat / note</p>
            <p className="mt-1 text-sm font-black leading-5 text-ink">{action.result}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {action.visibleToClient ? (
          <span className="inline-flex items-center gap-1 border-2 border-line bg-paper px-2 py-1 text-[11px] font-black uppercase text-ink">
            <Eye className="h-3 w-3" />
            Portail client
          </span>
        ) : null}
        {statusButtons.map((button) => (
          <form key={button.value} action={updateCommercialActionStatus}>
            <input type="hidden" name="id" value={action.id} />
            <input type="hidden" name="status" value={button.value} />
            <button
              className="border-2 border-ink bg-white px-3 py-2 text-xs font-black uppercase text-ink hover:bg-acid disabled:cursor-not-allowed disabled:border-line disabled:text-stone-400"
              disabled={isDemo || action.status === button.value}
              title={isDemo ? "Activez Supabase pour modifier les statuts" : undefined}
              type="submit"
            >
              {button.label}
            </button>
          </form>
        ))}
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-line bg-paper p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-ink">{value}</p>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text"
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <input
        className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <select
        className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
