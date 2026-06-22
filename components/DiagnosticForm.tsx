"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowRight,
  FileSearch,
  Loader2,
  Search,
} from "lucide-react";
import { createOnboardingSubmission } from "@/lib/onboarding-actions";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Suggestion {
  description: string;
  placeId: string;
}

interface PlaceDetails {
  name: string;
  rating: number;
  reviewCount: number;
  website: string | null;
  photoCount: number;
  hasHours: boolean;
  address: string;
}

interface Competitor {
  name: string;
  rating: number;
  reviewCount: number;
}

// ── BusinessConfirmation ───────────────────────────────────────────────────────

function BusinessConfirmation({
  name,
  address,
  onClear,
  visible,
}: {
  name: string;
  address: string;
  onClear: () => void;
  visible: boolean;
}) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-out ${
        visible ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="mt-3 flex items-start justify-between gap-3 border border-emerald-500/30 bg-emerald-950/40 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <svg
              className="h-2.5 w-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Commerce identifié
            </p>
            <p className="mt-0.5 text-xs font-black leading-tight text-white">{name}</p>
            {address && (
              <p className="mt-0.5 truncate text-[10px] font-semibold text-white/40">
                {address}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-[10px] font-black uppercase tracking-wider text-white/25 transition hover:text-white/60"
        >
          Changer
        </button>
      </div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
      {label}
      <input
        className="border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/25 focus:border-[#E85D2A] focus:bg-white/15"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

// ── DiagnosticForm ─────────────────────────────────────────────────────────────

export default function DiagnosticForm({ status }: { status?: string }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmAddress, setConfirmAddress] = useState("");
  const [auditLoading, setAuditLoading] = useState(false);

  // Silently captured Places data — passed as hidden fields for João's admin
  const [placeRating, setPlaceRating] = useState("");
  const [placeReviews, setPlaceReviews] = useState("");
  const [placePhotos, setPlacePhotos] = useState("");
  const [placeWebsite, setPlaceWebsite] = useState("");
  const [placeAddress, setPlaceAddress] = useState("");
  const [placePageSpeed, setPlacePageSpeed] = useState("");
  const [placeTopCompetitor, setPlaceTopCompetitor] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/places/suggestions?q=${encodeURIComponent(q)}&city=Lausanne`
      );
      const data = (await res.json()) as Suggestion[];
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedPlaceId("");
    setConfirmed(false);
    setConfirmAddress("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void fetchSuggestions(val), 300);
  };

  // Silently fetch Places data after selection
  const fetchAuditSilently = useCallback(async (placeId: string) => {
    setAuditLoading(true);
    try {
      const [detailsRes, competitorsRes] = await Promise.all([
        fetch(`/api/places/details?placeId=${placeId}`),
        fetch(`/api/places/nearby?placeId=${placeId}`),
      ]);
      const details = (await detailsRes.json()) as PlaceDetails | null;
      const competitors = (await competitorsRes.json()) as Competitor[];

      if (details) {
        setConfirmAddress(details.address);
        setPlaceRating(String(details.rating));
        setPlaceReviews(String(details.reviewCount));
        setPlacePhotos(String(details.photoCount));
        setPlaceWebsite(details.website ?? "");
        setPlaceAddress(details.address);

        const top = competitors[0];
        if (top) {
          setPlaceTopCompetitor(
            `${top.name} — ${top.rating.toFixed(1)}★ · ${top.reviewCount} avis`
          );
        }

        // PageSpeed in background (silent)
        if (details.website) {
          try {
            const psRes = await fetch(
              `/api/pagespeed?url=${encodeURIComponent(details.website)}`
            );
            const psData = (await psRes.json()) as { score: number } | null;
            if (psData?.score != null) setPlacePageSpeed(String(psData.score));
          } catch {
            // silent
          }
        }
      }
    } catch {
      // silent
    } finally {
      setAuditLoading(false);
    }
  }, []);

  const handleSelectSuggestion = (s: Suggestion) => {
    setQuery(s.description);
    setSelectedName(s.description);
    setSelectedPlaceId(s.placeId);
    setSuggestions([]);
    setShowSuggestions(false);
    setConfirmed(true);
    void fetchAuditSilently(s.placeId);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedPlaceId("");
    setSelectedName("");
    setConfirmed(false);
    setConfirmAddress("");
    setPlaceRating("");
    setPlaceReviews("");
    setPlacePhotos("");
    setPlaceWebsite("");
    setPlaceAddress("");
    setPlacePageSpeed("");
    setPlaceTopCompetitor("");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cleanup debounce
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  return (
    <form
      action={createOnboardingSubmission}
      className="flex flex-col bg-[#12382F] p-8 lg:p-12"
    >
      {/* Hidden fields */}
      <input name="returnPath" type="hidden" value="/diagnostic-gratuit" />
      <input name="desiredPlan" type="hidden" value="pas_encore" />
      {selectedPlaceId && (
        <input name="placeId" type="hidden" value={selectedPlaceId} />
      )}
      {placeRating && <input name="placeRating" type="hidden" value={placeRating} />}
      {placeReviews && <input name="placeReviews" type="hidden" value={placeReviews} />}
      {placePhotos && <input name="placePhotos" type="hidden" value={placePhotos} />}
      {placeWebsite && <input name="placeWebsite" type="hidden" value={placeWebsite} />}
      {placeAddress && <input name="placeAddress" type="hidden" value={placeAddress} />}
      {placePageSpeed && <input name="placePageSpeed" type="hidden" value={placePageSpeed} />}
      {placeTopCompetitor && (
        <input name="placeTopCompetitor" type="hidden" value={placeTopCompetitor} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E85D2A]">
            Recevoir l&apos;analyse
          </p>
          <h2 className="mt-1.5 text-2xl font-black text-white">Votre demande</h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5">
          <FileSearch className="h-5 w-5 text-white/50" />
        </div>
      </div>

      {/* Status messages */}
      {status === "ok" && (
        <div className="mt-5 border border-white/20 bg-white/10 p-4 text-sm font-bold text-white">
          ✓ Votre demande a bien été envoyée. Votre analyse complète vous sera envoyée sous 24–48h.
        </div>
      )}
      {(status === "error" || status === "missing") && (
        <div className="mt-5 border border-[#E85D2A]/50 bg-[#E85D2A]/15 p-4 text-sm font-bold text-white">
          {status === "missing"
            ? "Merci de compléter le nom du business et l'email."
            : "Nous n'avons pas pu enregistrer votre demande. Veuillez réessayer."}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">

        {/* Business name + autocomplete */}
        <div ref={wrapperRef} className="relative">
          <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
            Nom de votre activité
            <div className="relative">
              <input
                autoComplete="off"
                className="w-full border border-white/15 bg-white/10 px-4 py-3 pr-10 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/25 focus:border-[#E85D2A] focus:bg-white/15"
                name="businessName"
                placeholder="Tapez le nom — nous cherchons sur Google"
                required
                value={query}
                onChange={handleQueryChange}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {auditLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white/30" />
                ) : (
                  <Search className="h-4 w-4 text-white/25" />
                )}
              </div>
            </div>
          </label>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-50 border border-white/15 bg-[#0d1a14] shadow-2xl">
              {suggestions.map((s) => (
                <button
                  key={s.placeId}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="flex w-full items-center gap-3 border-b border-white/8 px-4 py-3 text-left text-xs font-semibold text-white/70 transition last:border-0 hover:bg-white/8 hover:text-white"
                >
                  <Search className="h-3 w-3 shrink-0 text-[#E85D2A]" />
                  {s.description}
                </button>
              ))}
            </div>
          )}

          {/* Business confirmation — replaces audit panel */}
          <BusinessConfirmation
            name={selectedName}
            address={confirmAddress}
            onClear={handleClear}
            visible={confirmed}
          />
        </div>

        {/* Google Business question */}
        <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
          Fiche Google Business
          <select
            className="border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#E85D2A]"
            name="googleBusiness"
            defaultValue="unknown"
          >
            <option value="active" className="bg-[#12382F]">
              Oui, je la gère activement
            </option>
            <option value="exists_unmanaged" className="bg-[#12382F]">
              Oui, mais je ne sais pas comment la gérer
            </option>
            <option value="unknown" className="bg-[#12382F]">
              Je ne sais pas si j&apos;en ai une
            </option>
            <option value="none" className="bg-[#12382F]">
              Non, je n&apos;en ai pas
            </option>
          </select>
        </label>

        <Field
          label="Email"
          name="ownerEmail"
          placeholder="contact@business.ch"
          type="email"
          required
        />
        <Field
          label="WhatsApp / Téléphone"
          name="ownerPhone"
          placeholder="+41 79 000 00 00"
          type="tel"
        />

        <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
          Votre secteur
          <select
            className="border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#E85D2A]"
            name="niche"
            defaultValue="salon_coiffure"
          >
            <option value="salon_coiffure" className="bg-[#12382F]">Salon de coiffure / coiffeur</option>
            <option value="tatoueur" className="bg-[#12382F]">Tatoueur / studio de tatouage</option>
            <option value="restaurant_bar" className="bg-[#12382F]">Restaurant / bar / café</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ville" name="city" placeholder="Lausanne" defaultValue="Lausanne" />
          <Field label="Instagram" name="instagramHandle" placeholder="@monbusiness" />
        </div>
        <Field label="Site web" name="website" placeholder="https://..." />

        <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
          Objectif prioritaire
          <select
            className="border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#E85D2A]"
            name="mainObjective"
            defaultValue="rendez_vous"
          >
            <option value="rendez_vous" className="bg-[#12382F]">Plus de rendez-vous</option>
            <option value="instagram" className="bg-[#12382F]">
              Réseaux sociaux qui inspirent confiance
            </option>
            <option value="relancer_contacts" className="bg-[#12382F]">
              Réactiver d&apos;anciens clients
            </option>
            <option value="avis_google" className="bg-[#12382F]">Plus d&apos;avis Google</option>
            <option value="plus_clients" className="bg-[#12382F]">Plus de clients</option>
          </select>
        </label>

        <button className="mt-1 flex w-full items-center justify-center gap-2 bg-[#E85D2A] px-4 py-4 text-sm font-black uppercase text-white transition hover:bg-[#d44e22]">
          Demander mon diagnostic gratuit
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-5 text-xs font-semibold leading-5 text-white/30">
        Aucun engagement. Le diagnostic gratuit sert à comprendre votre situation avant
        toute proposition.
      </p>
      <div className="mt-5 border-t border-white/10 pt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
          Ou directement sur
        </p>
        <a
          href="https://wa.me/41792844918"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 border border-white/15 bg-white/5 px-4 py-3 text-sm font-black uppercase text-white transition hover:bg-white/10"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L0 24l6.336-1.508A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.213-3.727.887.924-3.618-.234-.372A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
          </svg>
          WhatsApp — +41 79 284 49 18
        </a>
      </div>
    </form>
  );
}
