import Link from "next/link";
import { CalendarDays, CheckCircle2, Clapperboard, ImagePlus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { formatClientPlan, getClientBusinessById, getClientBusinesses } from "@/lib/clients";
import { createContentItem, updateContentStatus } from "@/lib/content-item-actions";
import {
  formatContentStatus,
  formatContentType,
  getContentItems,
  type ContentItem,
  type ContentStatus
} from "@/lib/content-items";

const statusButtons: Array<{ value: ContentStatus; label: string }> = [
  { value: "draft", label: "Brouillon" },
  { value: "waiting_approval", label: "À approuver" },
  { value: "approved", label: "Approuvé" },
  { value: "published", label: "Publié" }
];

type ContenusPageProps = {
  searchParams?: Promise<{
    businessId?: string;
  }>;
};

export default async function ContenusPage({ searchParams }: ContenusPageProps) {
  const params = await searchParams;
  const selectedBusinessId = params?.businessId;
  const selectedClient = selectedBusinessId ? (await getClientBusinessById(selectedBusinessId)).client : null;
  const { clients } = await getClientBusinesses();
  const { contentItems, source } = await getContentItems(selectedClient?.id);
  const isDemo = source === "mock";
  const canCreate = Boolean(selectedClient) && !isDemo;
  const waitingCount = contentItems.filter((item) => item.status === "waiting_approval").length;
  const publishedCount = contentItems.filter((item) => item.status === "published").length;
  const draftCount = contentItems.filter((item) => item.status === "draft" || item.status === "idea").length;
  const videoCount = contentItems.filter((item) => ["reel", "video", "story"].includes(item.contentType)).length;

  return (
    <>
      <PageHeader
        eyebrow="Content & local growth"
        title="Contenus"
        description="Piloter les posts, reels, photos, vidéos et contenus Google Business comme des actions commerciales, pas comme de simples publications."
      />

      {isDemo ? (
        <section className="mb-6 border border-[#dedad2] bg-[#fffbeb] p-4">
          <p className="text-sm font-black uppercase text-ink">Mode démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Les contenus affichés sont des exemples. Activez Supabase et appliquez la migration 006 pour créer et suivre
            les contenus réels de chaque client.
          </p>
        </section>
      ) : null}

      {selectedClient ? (
        <section className="mb-6 border border-[#dedad2] bg-white p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Client selectionne</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black uppercase leading-none text-ink">{selectedClient.name}</h2>
              <p className="mt-2 text-sm font-bold text-stone-600">
                {formatClientPlan(selectedClient.plan)} / {selectedClient.ownerEmail ?? "owner a inviter"}
              </p>
            </div>
            <a
              href={`/clients/${selectedClient.id}`}
              className="border border-[#dedad2] bg-[#f0faf5] px-3 py-2 text-xs font-black uppercase text-ink"
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
          currentPath="/contenus"
          title="Sélectionnez un client avant de créer un contenu."
        />
      )}

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="En préparation" value={draftCount.toString()} detail="Idées + brouillons" />
        <Metric label="À approuver" value={waitingCount.toString()} detail="Validation client" />
        <Metric label="Vidéos / stories" value={videoCount.toString()} detail="Formats courts" />
        <Metric label="Publiés" value={publishedCount.toString()} detail="Preuve du service" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-6">
          <article className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
            <Clapperboard className="h-8 w-8 text-ink" />
            <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Principe</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-ink">
              Le contenu doit servir une action: obtenir un message, renforcer la confiance, demander un avis, remplir
              l&apos;agenda ou améliorer la visibilité locale.
            </p>
          </article>

          <form action={createContentItem} className="border border-[#dedad2] bg-white p-5 shadow-sm">
            <input type="hidden" name="businessId" value={selectedClient?.id ?? ""} />
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#dedad2] bg-[#12382F] text-white">
                <ImagePlus className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-black uppercase leading-none text-ink">Créer un contenu</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
                  Chaque contenu doit avoir un canal, un objectif et un statut clair.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <Field label="Titre" name="title" placeholder="Reel avant/après couleur naturelle" required />
              <Field label="Objectif" name="objective" placeholder="Créer des demandes de rendez-vous" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select
                  label="Type"
                  name="contentType"
                  options={["post", "reel", "story", "photo", "video", "google_post"]}
                />
                <Select
                  label="Canal"
                  name="channel"
                  options={["Instagram", "TikTok", "Google Business", "Facebook", "LinkedIn", "Assets"]}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Select
                  label="Status"
                  name="status"
                  options={["idea", "draft", "waiting_approval", "approved", "published"]}
                />
                <Field label="Date prévue" name="plannedDate" placeholder="2026-06-15" type="date" />
              </div>
              <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                Légende / message
                <textarea
                  className="min-h-28 border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case leading-6 tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
                  name="caption"
                  placeholder="Texte proposé pour la publication."
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                Brief asset
                <textarea
                  className="min-h-24 border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case leading-6 tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
                  name="assetBrief"
                  placeholder="Photos, vidéos ou scènes à produire."
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-ink">
                <input className="h-4 w-4 accent-[#c6ff00]" name="visibleToClient" type="checkbox" defaultChecked />
                Visible dans le portail client
              </label>
            </div>
            <button
              className="mt-5 w-full border border-[#dedad2] bg-[#f0faf5] px-4 py-3 text-sm font-black uppercase text-ink disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canCreate}
              title={
                isDemo
                  ? "Activez Supabase pour créer des contenus réels"
                  : !selectedClient
                    ? "Sélectionnez d'abord un client"
                    : undefined
              }
              type="submit"
            >
              Enregistrer le contenu
            </button>
          </form>
        </div>

        <section className="grid gap-3">
          {contentItems.map((item) => (
            <ContentCard key={item.id} item={item} isDemo={isDemo} />
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
    <section className="mb-6 border border-[#dedad2] bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Contexte obligatoire</p>
      <h2 className="mt-2 text-2xl font-black uppercase leading-none text-ink">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-stone-600">
        Les contenus sont liés à un business précis pour que le client voie uniquement ses publications, validations et
        preuves de travail.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`${currentPath}?businessId=${client.id}`}
            className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-2 text-xs font-black uppercase text-ink hover:bg-[#e8f5ee]"
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
    <article className="border border-[#dedad2] bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}</p>
      <strong className="mt-2 block text-4xl font-black text-ink">{value}</strong>
      <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
    </article>
  );
}

function ContentCard({ item, isDemo }: { item: ContentItem; isDemo: boolean }) {
  return (
    <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black uppercase leading-none text-ink">{item.title}</h2>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-2 text-sm font-black uppercase text-[#E85D2A]">
            {item.channel} · {formatContentType(item.contentType)}
          </p>
        </div>
        <span className="grid h-12 w-12 place-items-center border border-[#dedad2] bg-[#f0faf5]">
          {item.status === "published" ? <CheckCircle2 className="h-6 w-6" /> : <CalendarDays className="h-6 w-6" />}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Info label="Objectif" value={item.objective} />
        <Info label="Date" value={item.plannedDate ?? "À planifier"} />
        <Info label="Status" value={formatContentStatus(item.status)} />
      </div>

      {item.caption ? (
        <div className="mt-4 border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">Légende</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-stone-700">{item.caption}</p>
        </div>
      ) : null}

      {item.assetBrief ? (
        <div className="mt-4 border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">Brief asset</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-stone-700">{item.assetBrief}</p>
        </div>
      ) : null}

      {item.result ? (
        <div className="mt-4 border border-[#dedad2] bg-[#f8f7f2] p-3 text-sm font-black leading-5 text-ink">{item.result}</div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {statusButtons.map((button) => (
          <form key={button.value} action={updateContentStatus}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="status" value={button.value} />
            <button
              className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-black uppercase text-ink hover:bg-[#e8f5ee] disabled:cursor-not-allowed disabled:border-[#e8e5dd] disabled:text-stone-400"
              disabled={isDemo || item.status === button.value}
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
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
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
        className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
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
        className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
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
