import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { getWorkspaceAccess } from "@/lib/auth-model";
import { getNavModeForWorkspace, isPublicPath, type NavMode } from "@/lib/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://atelier-nox-growth-system.vercel.app"),
  title: {
    default: "Atelier Nox - Croissance locale g\u00e9r\u00e9e \u00e0 Lausanne",
    template: "%s | Atelier Nox"
  },
  description:
    "Service humain, clair et mesurable pour aider les PME de Suisse romande \u00e0 piloter leur croissance locale.",
  keywords: [
    "Atelier Nox",
    "marketing local Suisse romande",
    "croissance locale Lausanne",
    "coiffure Lausanne",
    "Google Business",
    "r\u00e9seaux sociaux PME"
  ],
  applicationName: "Atelier Nox Growth System",
  authors: [{ name: "Atelier Nox" }],
  creator: "Atelier Nox",
  publisher: "Atelier Nox",
  icons: {
    icon: "/brand/favicon.svg",
    apple: "/brand/apple-touch-icon.png"
  },
  openGraph: {
    title: "Atelier Nox - Croissance locale g\u00e9r\u00e9e \u00e0 Lausanne",
    description: "Nous pilotons votre croissance locale, avec vous.",
    url: "/",
    siteName: "Atelier Nox",
    locale: "fr_CH",
    type: "website",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Atelier Nox - Nous pilotons votre croissance locale, avec vous."
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelier Nox - Croissance locale g\u00e9r\u00e9e \u00e0 Lausanne",
    description: "Nous pilotons votre croissance locale, avec vous.",
    images: ["/brand/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
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
    <html lang="fr" className={inter.variable}>
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
