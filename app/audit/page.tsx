import { Star, Globe, Phone, MapPin, Image, Clock, TrendingUp, ExternalLink, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { searchBusinessAudit, type PlaceAuditResult } from "@/lib/audit-actions";

type AuditPageProps = {
  searchParams?: Promise<{ q?: string; city?: string }>;
};

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const sp = await searchParams;
  const q = sp?.q?.trim() ?? "";
  const city = sp?.city?.trim() ?? "";

  let result: PlaceAuditResult | null = null;
  if (q && city) {
    const fd = new FormData();
    fd.set("businessName", q);
    fd.set("city", city);
    result = await searchBusinessAudit(fd);
  }

  return (
    <>
      <PageHeader
        eyebrow="Outil prospection"
        title="Audit Google Business"
        description="Analysez la présence Google d'un prospect en quelques secondes avant votre rendez-vous."
      />

      {/* Search form */}
      <form method="GET" className="mb-8 border border-[#dedad2] bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="grid gap-1.5 text-xs font-black uppercase tracking-[0.1em] text-stone-500">
            Nom du business
            <input
              name="q"
              defaultValue={q}
              placeholder="Ex: Salon Lumière"
              className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold text-ink outline-none placeholder:font-normal placeholder:text-stone-400 focus:border-[#12382F] focus:bg-[#e8f5ee]"
              autoComplete="off"
              required
            />
          </label>
          <label className="grid gap-1.5 text-xs font-black uppercase tracking-[0.1em] text-stone-500">
            Ville
            <input
              name="city"
              defaultValue={city}
              placeholder="Ex: Lausanne"
              className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold text-ink outline-none placeholder:font-normal placeholder:text-stone-400 focus:border-[#12382F] focus:bg-[#e8f5ee]"
              autoComplete="off"
              required
            />
          </label>
          <button
            type="submit"
            className="flex items-center gap-2 self-end border border-[#12382F] bg-[#12382F] px-6 py-3 text-sm font-black uppercase text-white transition hover:bg-[#0d1a14]"
          >
            <Search className="h-4 w-4" />
            Analyser
          </button>
        </div>
      </form>

      {result && !result.found && (
        <div className="border border-[#fca5a5] bg-[#fee2e2] p-5 text-sm font-black uppercase text-red-800">
          {result.error}
        </div>
      )}

      {result && result.found && <AuditCard result={result} query={q} city={city} />}

      {!result && (
        <div className="border border-[#dedad2] bg-white p-10 text-center">
          <Search className="mx-auto h-10 w-10 text-stone-300" />
          <p className="mt-3 text-sm font-black uppercase text-stone-400">
            Saisissez un nom de business et une ville pour lancer l&apos;analyse.
          </p>
        </div>
      )}
    </>
  );
}

function AuditCard({ result, query, city }: { result: PlaceAuditResult & { found: true }; query: string; city: string }) {
  const encodedSearch = encodeURIComponent(`${query} ${city}`);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Main card */}
      <div className="space-y-5">
        {/* Header */}
        <div className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Fiche Google Business</p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">{result.name}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-stone-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {result.address}
              </p>
            </div>
            <a
              href={result.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#dedad2] bg-[#f8f7f2] px-4 py-2 text-xs font-black uppercase text-ink transition hover:border-[#12382F] hover:bg-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Voir sur Google
            </a>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            icon={<Star className="h-5 w-5" />}
            label="Note Google"
            value={result.rating !== null ? `${result.rating.toFixed(1)} / 5` : "—"}
            sub={result.rating !== null
              ? result.rating >= 4.3 ? "Bonne note" : result.rating >= 3.5 ? "Note moyenne" : "Note faible — opportunité"
              : "Pas de note — compte vide"
            }
            accent={result.rating !== null && result.rating < 4.0 ? "border-orange-200 bg-orange-50" : undefined}
          />
          <KpiCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avis clients"
            value={String(result.reviewCount)}
            sub={result.reviewCount < 10 ? "Très peu — forte opportunité" : result.reviewCount < 30 ? "Quelques avis" : result.reviewCount < 80 ? "Bon volume" : "Volume élevé"}
            accent={result.reviewCount < 10 ? "border-orange-200 bg-orange-50" : undefined}
          />
          <KpiCard
            icon={<Image className="h-5 w-5" />}
            label="Photos"
            value={result.photoCount > 0 ? `${result.photoCount}+` : "Aucune"}
            sub={result.photoCount < 5 ? "Peu de visuels — à améliorer" : "Photos présentes"}
            accent={result.photoCount < 5 ? "border-orange-200 bg-orange-50" : undefined}
          />
          <KpiCard
            icon={<Globe className="h-5 w-5" />}
            label="Site web"
            value={result.hasWebsite ? "Oui" : "Non"}
            sub={result.hasWebsite ? result.website ?? "Lien présent" : "Pas de site — opportunité"}
            accent={!result.hasWebsite ? "border-orange-200 bg-orange-50" : undefined}
            href={result.website ?? undefined}
          />
          <KpiCard
            icon={<Clock className="h-5 w-5" />}
            label="Horaires"
            value={result.hasHours ? "Complets" : "Absents"}
            sub={result.hasHours ? "Horaires renseignés" : "Horaires manquants — à compléter"}
            accent={!result.hasHours ? "border-orange-200 bg-orange-50" : undefined}
          />
          <KpiCard
            icon={<Phone className="h-5 w-5" />}
            label="Téléphone"
            value={result.phone ?? "Absent"}
            sub={result.phone ? "Numéro présent" : "Pas de téléphone"}
            accent={!result.phone ? "border-orange-200 bg-orange-50" : undefined}
          />
        </div>

        {/* Social links to check manually */}
        <div className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">Vérifier manuellement</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <a
              href={`https://www.instagram.com/${query.toLowerCase().replace(/\s+/g, "")}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#dedad2] py-3 text-sm font-black uppercase text-ink transition hover:border-pink-400 hover:bg-pink-50 hover:text-pink-700"
            >
              Instagram →
            </a>
            <a
              href={`https://www.facebook.com/search/pages/?q=${encodedSearch}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#dedad2] py-3 text-sm font-black uppercase text-ink transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
            >
              Facebook →
            </a>
            <a
              href={`https://www.tiktok.com/search?q=${encodedSearch}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#dedad2] py-3 text-sm font-black uppercase text-ink transition hover:border-gray-400 hover:bg-gray-50"
            >
              TikTok →
            </a>
          </div>
        </div>
      </div>

      {/* Score sidebar */}
      <div className="space-y-5">
        <div className="border border-[#dedad2] bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">Score d&apos;opportunité</p>
          <div className="mt-3 flex items-end gap-2">
            <strong className="text-7xl font-black leading-none" style={{ color: result.opportunityColor }}>
              {result.opportunityScore}
            </strong>
            <span className="pb-2 text-2xl font-black text-stone-300">/100</span>
          </div>
          <p className="mt-3 text-base font-black uppercase" style={{ color: result.opportunityColor }}>
            Opportunité {result.opportunityLabel}
          </p>
          <div className="mt-4 h-2 w-full bg-[#e8e5dd]">
            <div
              className="h-full transition-all"
              style={{ width: `${result.opportunityScore}%`, backgroundColor: result.opportunityColor }}
            />
          </div>
          <p className="mt-4 text-xs font-semibold leading-5 text-stone-500">
            Score calculé sur : avis Google, note, présence web, photos et horaires.
            Plus le score est élevé, plus le potentiel de progression est fort.
          </p>
        </div>

        <div className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-[0.14em] text-ink">Actions recommandées</h3>
          <ul className="mt-3 space-y-2">
            {result.reviewCount < 15 && (
              <li className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-bold text-ink">
                → Campagne avis Google (objectif : 30+ avis)
              </li>
            )}
            {!result.hasWebsite && (
              <li className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-bold text-ink">
                → Landing page locale incluse dans le forfait
              </li>
            )}
            {!result.hasHours && (
              <li className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-bold text-ink">
                → Compléter la fiche Google (horaires, photos)
              </li>
            )}
            {result.photoCount < 5 && (
              <li className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-bold text-ink">
                → Ajouter photos professionnelles à la fiche
              </li>
            )}
            {result.rating !== null && result.rating < 4.0 && (
              <li className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-bold text-ink">
                → Plan de gestion réputation + relances clients
              </li>
            )}
            {result.reviewCount >= 15 && result.hasWebsite && result.hasHours && result.photoCount >= 5 && (
              <li className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-bold text-ink">
                → Fiche bien complète. Focus sur contenus locaux et campagnes.
              </li>
            )}
          </ul>
        </div>

        <a
          href={`/demandes?prefill=${encodeURIComponent(result.name)}`}
          className="flex w-full items-center justify-center gap-2 border border-[#12382F] bg-ink px-4 py-3 text-sm font-black uppercase text-white transition hover:bg-[#0d1a14]"
        >
          Créer une demande →
        </a>
      </div>
    </div>
  );
}

function KpiCard({
  icon, label, value, sub, accent, href
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent?: string;
  href?: string;
}) {
  const cls = `border ${accent ?? "border-[#dedad2] bg-white"} p-4 shadow-sm`;
  const inner = (
    <>
      <div className="flex items-center gap-2 text-stone-400">{icon}</div>
      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.1em] text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-black uppercase leading-tight text-ink">{value}</p>
      <p className="mt-1 text-xs font-semibold text-stone-500">{sub}</p>
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} block hover:border-[#12382F]`}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
