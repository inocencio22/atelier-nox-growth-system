import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { getWorkspaceAccess } from "@/lib/auth-model";
import { getNavModeForWorkspace, isPublicPath, type NavMode } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Atelier Nox Growth System",
  description: "Plateforme IA + marketing local pour transformer visibilite et contacts en clients."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}

async function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-next-pathname") ?? "";
  const isPublic = pathname ? isPublicPath(pathname) : false;
  const workspace = isPublic ? null : await getWorkspaceAccess();
  const navMode: NavMode = workspace ? getNavModeForWorkspace(workspace) : "public";
  const isClient = workspace?.mode === "supabase_auth" && workspace.profile?.role === "client";
  const isAdmin = workspace ? workspace.mode !== "supabase_auth" || workspace.profile?.role === "admin" : false;

  return (
    <html lang="fr">
      <body>
        <AppShell
          navMode={navMode}
          shellLabel={isClient ? "Espace client" : isAdmin ? "Atelier Nox" : "Site public"}
          shellTitle={isClient ? "Portail" : isAdmin ? "Studio Admin" : "Growth System"}
          showLogout={Boolean(workspace)}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
