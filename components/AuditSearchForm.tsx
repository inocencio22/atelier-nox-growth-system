"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type Suggestion = { description: string; placeId: string };

export function AuditSearchForm({
  defaultQ,
  defaultCity,
}: {
  defaultQ?: string;
  defaultCity?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ ?? "");
  const [city, setCity] = useState(defaultCity ?? "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (value: string, cityValue: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setFetching(true);
    try {
      const res = await fetch(
        `/api/places/suggestions?q=${encodeURIComponent(value)}&city=${encodeURIComponent(cityValue)}`
      );
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setFetching(false);
    }
  }, []);

  const handleQChange = (value: string) => {
    setQ(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void fetchSuggestions(value, city), 350);
  };

  const selectSuggestion = (s: Suggestion) => {
    const parts = s.description.split(",");
    const name = parts[0]?.trim() ?? s.description;
    const loc  = parts[1]?.trim() ?? city;
    setQ(name);
    setCity(loc);
    setSuggestions([]);
    setOpen(false);
    router.push(`/audit?q=${encodeURIComponent(name)}&city=${encodeURIComponent(loc)}`);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    router.push(`/audit?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 border border-[#dedad2] bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">

        <div ref={wrapperRef} className="relative grid gap-1.5">
          <label className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">
            Nom du business
          </label>
          <input
            value={q}
            onChange={(e) => handleQChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Ex: Salon Lumière"
            className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold text-ink outline-none placeholder:font-normal placeholder:text-stone-400 focus:border-[#12382F] focus:bg-[#e8f5ee]"
            autoComplete="off"
            required
          />
          {fetching && (
            <span className="absolute right-3 top-10 text-[10px] text-stone-400">…</span>
          )}
          {open && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-50 border border-[#dedad2] bg-white shadow-lg">
              {suggestions.map((s) => (
                <li key={s.placeId}>
                  <button
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className="w-full px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-[#f0faf5]"
                  >
                    {s.description}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="grid gap-1.5 text-xs font-black uppercase tracking-[0.1em] text-stone-500">
          Ville
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex: Lausanne"
            className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold text-ink outline-none placeholder:font-normal placeholder:text-stone-400 focus:border-[#12382F] focus:bg-[#e8f5ee]"
            autoComplete="off"
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
  );
}
