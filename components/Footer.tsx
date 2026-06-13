import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0d1a14] text-white">

      {/* ── Corps principal ───────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">

          {/* Identité */}
          <div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Atelier Nox</p>
              <p className="mt-0.5 text-sm font-black uppercase tracking-[0.14em] text-white/50">Growth System</p>
            </div>
            <p className="mt-5 max-w-xs text-sm font-semibold leading-6 text-white/55">
              Service humain et géré de croissance locale pour les PME de Suisse romande.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/atelier.nox.ch/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Atelier Nox"
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/50 transition hover:border-[#E85D2A] hover:text-[#E85D2A]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/atelier.nox.ch/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Atelier Nox"
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/50 transition hover:border-[#E85D2A] hover:text-[#E85D2A]"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Navigation</p>
            <ul className="mt-5 space-y-3">
              {[
                { href: "/", label: "Notre approche" },
                { href: "/services", label: "Services" },
                { href: "/abonnement", label: "Tarifs" },
                { href: "/a-propos", label: "Notre histoire" },
                { href: "/diagnostic-gratuit", label: "Diagnostic offert" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-white/55 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Contact</p>
            <address className="mt-5 not-italic space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E85D2A]" />
                <p className="text-sm font-semibold leading-5 text-white/55">
                  Payerne<br />Suisse romande
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#E85D2A]" />
                <a
                  href="mailto:joaopedro.suisse@gmail.com"
                  className="text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  joaopedro.suisse@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0 text-[#E85D2A]" />
                <a
                  href="https://wa.me/41792844918"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  WhatsApp
                </a>
              </div>
            </address>
          </div>

          {/* CTA */}
          <div className="border border-white/10 bg-white/5 p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E85D2A]">Commencer</p>
            <p className="mt-3 text-base font-black leading-tight text-white">
              Analysons votre situation locale en 30 minutes.
            </p>
            <p className="mt-2 text-sm font-semibold leading-5 text-white/50">
              Gratuit, sans engagement.
            </p>
            <Link
              href="/diagnostic-gratuit"
              className="mt-5 inline-flex w-full items-center justify-center border border-[#E85D2A] bg-[#E85D2A] px-4 py-3 text-xs font-black uppercase text-white shadow-[3px_3px_0_rgba(255,255,255,0.15)] transition hover:bg-[#d44e22]"
            >
              Diagnostic offert
            </Link>
          </div>

        </div>
      </div>

      {/* ── Barre inférieure ──────────────────────────── */}
      <div className="border-t border-white/8 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold text-white/30">
            © {new Date().getFullYear()} Atelier Nox — Indépendant, Suisse romande.
          </p>
          <div className="flex gap-5">
            <Link
              href="/mentions-legales"
              className="text-[11px] font-semibold text-white/30 transition hover:text-white/60"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="text-[11px] font-semibold text-white/30 transition hover:text-white/60"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
