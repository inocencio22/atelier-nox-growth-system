import {
  BarChart3,
  Clapperboard,
  ContactRound,
  CreditCard,
  FileText,
  Home,
  Inbox,
  Layers3,
  LogIn,
  ListChecks,
  Mail,
  Megaphone,
  MonitorCheck,
  Rocket,
  ShieldCheck,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import type { WorkspaceAccess } from "@/lib/auth-model";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type NavMode = "public" | "client" | "admin";

export const publicNavItems: NavItem[] = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/services", label: "Services", icon: Layers3 },
  { href: "/diagnostic-gratuit", label: "Diagnostic", icon: Rocket },
  { href: "/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/login", label: "Connexion", icon: LogIn }
];

export const clientNavItems: NavItem[] = [
  { href: "/portal", label: "Portail", icon: MonitorCheck },
  { href: "/contenus", label: "Contenus", icon: Clapperboard },
  { href: "/actions", label: "Actions", icon: ListChecks },
  { href: "/rapports", label: "Rapports", icon: FileText },
  { href: "/portal/abonnement", label: "Abonnement", icon: CreditCard }
];

export const adminNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/clients", label: "Clients", icon: UsersRound },
  { href: "/demandes", label: "Demandes", icon: Inbox },
  { href: "/actions", label: "Actions", icon: ListChecks },
  { href: "/contenus", label: "Contenus", icon: Clapperboard },
  { href: "/contacts", label: "Contacts", icon: ContactRound },
  { href: "/campagnes", label: "Campagnes", icon: Megaphone },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/rapports", label: "Rapports", icon: FileText },
  { href: "/infra", label: "Infra", icon: ShieldCheck }
];

const publicPrefixes = ["/", "/services", "/diagnostic-gratuit", "/abonnement", "/onboarding", "/diagnostic", "/login"];

export function isPublicPath(pathname: string) {
  return publicPrefixes.some((prefix) => pathname === prefix || (prefix !== "/" && pathname.startsWith(`${prefix}/`)));
}

export function getNavModeForWorkspace(workspace: WorkspaceAccess): NavMode {
  if (workspace.mode === "supabase_auth" && workspace.profile?.role === "client") {
    return "client";
  }

  if (workspace.mode === "supabase_auth" && workspace.profile?.role === "admin") {
    return "admin";
  }

  return "admin";
}
