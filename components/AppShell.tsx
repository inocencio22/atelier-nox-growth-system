"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Instagram, LayoutDashboard, Users, Inbox, ListChecks, Clapperboard, Megaphone, Mail, FileText, ShieldCheck, LogOut } from "lucide-react";
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

const adminGroups = [
  {
    label: null,
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Clients",
    items: [
      { href: "/clients", label: "Clients", icon: Users },
      { href: "/demandes", label: "Demandes", icon: Inbox },
      { href: "/contacts", label: "Contacts", icon: Users },
    ],
  },
  {
    label: "Travail",
    items: [
      { href: "/actions", label: "Actions", icon: ListChecks },
      { href: "/contenus", label: "Contenus", icon: Clapperboard },
      { href: "/campagnes", label: "Campagnes", icon: Megaphone },
      { href: "/messages", label: "Messages", icon: Mail },
    ],
  },
  {
    label: "Analyse",
    items: [
      { href: "/rapports", label: "Rapports", icon: FileText },
      { href: "/infra", label: "Infra", icon: ShieldCheck },
    ],
  },
];

const adminMobileItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/actions", label: "Actions", icon: ListChecks },
  { href: "/contenus", label: "Contenus", icon: Clapperboard },
  { href: "/rapports", label: "Rapports", icon: FileText },
];

export function AppShell({ children, navMode, showLogout }: AppShellProps) {
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

  /* ── CLIENT SHELL ── */
  if (navMode === "client") {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-[#12382F]/10 bg-white md:flex">
          <div className="border-b border-[#12382F]/10 px-5 py-5">
            <BrandMark compact />
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#12382F]/40">Espace client</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            {clientNavItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-[#12382F] text-white"
                      : "text-[#12382F]/60 hover:bg-[#12382F]/6 hover:text-[#12382F]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {showLogout && (
            <div className="border-t border-[#12382F]/10 px-3 py-4">
              <form action={logoutAccess}>
                <button
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#12382F]/40 transition hover:text-[#12382F]"
                  type="submit"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Se déconnecter</span>
                </button>
              </form>
            </div>
          )}
        </aside>

        {/* Mobile bottom bar — client */}
        <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[#12382F]/10 bg-white md:hidden">
          {clientNavItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-[9px] font-black uppercase transition",
                  active ? "text-[#12382F]" : "text-[#12382F]/35 hover:text-[#12382F]"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <main className="px-4 pb-28 pt-6 sm:px-6 md:ml-60 md:px-8 md:pb-10 md:pt-8">{children}</main>
      </div>
    );
  }

  /* ── ADMIN SHELL ── */
  return (
    <div className="min-h-screen bg-[#f5f4f0]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-[#0d1a14] md:flex">
        {/* Brand */}
        <div className="border-b border-white/8 px-5 py-5">
          <BrandMark compact />
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E85D2A]"></span>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/35">Panneau admin</p>
          </div>
        </div>

        {/* Navigation groups */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4 gap-5">
          {adminGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="mb-1.5 px-3 text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all",
                        active
                          ? "bg-white/10 text-white border-l-2 border-[#E85D2A]"
                          : "border-l-2 border-transparent text-white/45 hover:bg-white/6 hover:text-white"
                      )}
                    >
                      <Icon className={clsx("h-4 w-4 shrink-0 transition", active ? "text-[#E85D2A]" : "group-hover:text-white/70")} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        {showLogout && (
          <div className="border-t border-white/8 px-3 py-4">
            <form action={logoutAccess}>
              <button
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white/25 transition hover:text-white/60"
                type="submit"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Verrouiller l&apos;accès</span>
              </button>
            </form>
          </div>
        )}
      </aside>

      {/* Mobile top bar — admin */}
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-[#0d1a14] px-4 py-3 md:hidden">
        <BrandMark compact />
        <span className="text-[9px] font-black uppercase tracking-widest text-white/35">Admin</span>
      </header>

      {/* Mobile bottom nav — admin (5 key items) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-white/10 bg-[#0d1a14] md:hidden">
        {adminMobileItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[9px] font-black uppercase transition",
                active ? "text-[#E85D2A]" : "text-white/30 hover:text-white/60"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <main className="px-4 pb-28 pt-20 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8">{children}</main>
    </div>
  );
}
