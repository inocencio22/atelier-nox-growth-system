import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseProxyClient } from "@/lib/supabase-proxy";
import type { Database } from "@/lib/supabase.types";

const protectedPrefixes = [
  "/actions",
  "/business",
  "/campagnes",
  "/clients",
  "/contacts",
  "/contenus",
  "/dashboard",
  "/demandes",
  "/infra",
  "/instagram",
  "/messages",
  "/portal",
  "/portal/abonnement",
  "/propositions",
  "/rapports"
];

const adminPrefixes = protectedPrefixes.filter((prefix) => prefix !== "/portal");
type ProfileRole = Database["public"]["Tables"]["profiles"]["Row"]["role"];
type ProfileRoleQueryClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      single: () => Promise<{ data: { role: ProfileRole } | null; error: unknown }>;
    };
  };
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-pathname", pathname);

  if (!isProtected) {
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }

  const { response, supabase } = createSupabaseProxyClient(request, requestHeaders);

  if (supabase) {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await (supabase.from("profiles") as unknown as ProfileRoleQueryClient)
        .select("role")
        .eq("id", user.id)
        .single();
      const role = profile?.role ?? "client";
      const isAdminRoute = adminPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

      if (role !== "admin" && isAdminRoute) {
        const portalUrl = request.nextUrl.clone();
        portalUrl.pathname = "/portal";
        portalUrl.search = "";
        return NextResponse.redirect(portalUrl);
      }

      return response;
    }
  }

  const hasAccess = request.cookies.get("nox_access")?.value === "granted";

  if (hasAccess) {
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"
  ]
};
