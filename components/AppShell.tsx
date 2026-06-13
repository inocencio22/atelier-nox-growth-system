"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Instagram } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Footer } from "@/components/Footer";
import { logoutAccess } from "@/lib/access-actions";
import { adminNavItems, clientNavItems, publicNavItems, type NavMode } from "@/lib/navigation";

type AppShellProps = {
  children: React.ReactNode;
  navMode: NavMode;
  shellLabel: string;
  shellTitle: string;
  showLogout: boolean;
};

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function AppShell({ children, navMode, shellLabel, shellTitle, showLogout }: AppShellProps) {
  const pathname = usePathname();
  const navItems = navMode === "client" ? clientNavItems : navMode === "admin" ? adminNavItems : publicNavItems;

  if (navMode === "public") {
    return (
      <div className="nox-public-surface min-h-screen overflow-x-hidden">
        <header className="sticky top-0 z-30 border-b border-[#12382F]/10 bg-white/98 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[#E85D2A]" aria-hidden="true" />
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <BrandMark variant="horizontal" />
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "text-sm font-black text-[#12382F] transition hover:text-[#E85D2A]",
                      active && "text-[#E85D2A]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 sm:flex">
              {/* Redes sociais */}
              <a
                href="https://www.instagram.com/atelier.nox.ch/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Atelier Nox"
                className="flex h-8 w-8 items-center justify-center border border-[#12382F]/20 text-[#12382F] transition hover:border-[#E85D2A] hover:text-[#E85D2A]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/atelier.nox.ch/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Atelier Nox"
                className="flex h-8 w-8 items-center justify-center border border-[#12382F]/20 text-[#12382F] transition hover:border-[#E85D2A] hover:text-[#E85D2A]"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>

              <div className="mx-1 h-5 w-px bg-[#12382F]/15" aria-hidden="true" />

              <Link
                href="/login"
                className="border border-[#12382F]/30 px-4 py-3 text-xs font-black uppercase text-[#12382F] transition hover:border-[#12382F] hover:bg-white"
              >
                Espace client
              </Link>
              <Link
                href="/diagnostic-gratuit"
                className="border border-[#12382F] bg-[#E85D2A] px-4 py-3 text-xs font-black uppercase text-white shadow-[4px_4px_0_#12382F] transition hover:-translate-y-0.5"
              >
                Diagnostic offert
              </Link>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-[#12382F]/10 px-4 py-2 lg:hidden">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "shrink-0 border border-[#12382F]/20 px-3 py-2 text-[11px] font-black uppercase text-[#12382F]",
                    active && "border-[#12382F] bg-[#12382F] text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="shrink-0 border border-[#12382F]/20 px-3 py-2 text-[11px] font-black uppercase text-[#12382F]"
            >
              Espace client
            </Link>
            <Link
              href="/diagnostic-gratuit"
              className="shrink-0 border border-[#12382F] bg-[#E85D2A] px-3 py-2 text-[11px] font-black uppercase text-white"
            >
              Diagnostic offert
            </Link>
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="nox-grid min-h-screen">
      <aside className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink bg-white/95 px-2 py-2 backdrop-blur md:inset-y-0 md:left-0 md:right-auto md:w-64 md:border-r-2 md:border-t-0 md:px-4 md:py-5">
        <div className="hidden md:block">
          <div className="flex items-start gap-3">
            <BrandMark compact />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue">{shellLabel}</p>
              <h2 className="mt-1 max-w-36 text-2xl font-black uppercase leading-[0.9] text-ink">{shellTitle}</h2>
            </div>
          </div>
        </div>

        <nav className="grid grid-cols-4 gap-1 md:mt-8 md:flex md:flex-col md:gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-h-12 flex-col items-center justify-center gap-1 border border-transparent px-2 py-2 text-[10px] font-black uppercase tracking-[0.03em] transition md:min-h-0 md:flex-row md:justify-start md:gap-3 md:px-3 md:text-xs",
                  active
                    ? "border-ink bg-ink text-white"
                    : "text-stone-600 hover:border-ink hover:bg-acid hover:text-ink"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {showLogout ? (
          <form action={logoutAccess} className="mt-4 hidden md:block">
            <button
              className="w-full border border-line bg-paper px-3 py-2 text-left text-[11px] font-black uppercase text-stone-500 hover:border-ink hover:bg-white hover:text-ink"
              type="submit"
            >
              Verrouiller l&apos;accès
            </button>
          </form>
        ) : null}
      </aside>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8">{children}</main>
    </div>
  );
}
