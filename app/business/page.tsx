import { Building2, Database, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getWorkspaceAccess } from "@/lib/auth-model";

export default async function BusinessPage() {
  const workspace = await getWorkspaceAccess();
  const business = workspace.business;
  const isDemo = business.source === "mock";

  return (
    <>
      <PageHeader
        eyebrow="Paramètres"
        title="Business"
        description="Base de l'espace client: chaque contact, campagne, diagnostic et abonnement devra appartenir à un business précis."
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">
                {isDemo ? "Mode demo" : "Supabase"}
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">{business.name}</h2>
              <p className="mt-3 text-sm font-semibold text-stone-600">
                {business.niche} · {business.city}
              </p>
            </div>
            <span className="grid h-12 w-12 place-items-center border-2 border-ink bg-acid">
              <Building2 className="h-6 w-6" />
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            <InfoRow label="Business ID" value={business.id} />
            <InfoRow label="Site web" value={business.website ?? "À compléter"} />
            <InfoRow label="Instagram" value={business.instagramHandle ?? "À connecter"} />
            <InfoRow label="Plan" value={business.plan} />
            <InfoRow label="Status" value={business.status} />
            <InfoRow label="Mode d'accès" value={workspace.mode === "supabase_auth" ? "Supabase Auth" : "Access gate MVP"} />
            <InfoRow label="Utilisateur" value={workspace.profile?.email ?? "Session temporaire"} />
            <InfoRow label="Rôle" value={workspace.profile?.role ?? "demo"} />
          </div>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <Database className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Pourquoi cette étape compte</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">
            Sans business réel, tous les contacts et campagnes restent mélangés. Cette base prépare Supabase Auth:
            chaque entrepreneur aura son espace, ses contacts, ses campagnes, son plan et ses rapports.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              "Contacts liés au business",
              "Campagnes liées au business",
              "Diagnostic sauvegardé",
              "Abonnement par client"
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 border-2 border-ink bg-paper p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                <span className="text-sm font-black uppercase leading-5 text-ink">{item}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-2 border-line bg-paper p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="break-words text-sm font-black text-ink">{value}</p>
    </div>
  );
}
