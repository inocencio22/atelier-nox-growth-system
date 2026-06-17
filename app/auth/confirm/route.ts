import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase.types";

/**
 * /auth/confirm — server-side OTP verification for invite and recovery flows.
 *
 * The Supabase "Invite user" email template should point here:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/activation
 *
 * This route:
 *  1. Reads token_hash + type from query params
 *  2. Calls verifyOtp() — establishes a server-side session via cookies
 *  3. Redirects to `next` on success, or to /activation?error=link_expired on failure
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as
    | "invite"
    | "recovery"
    | "signup"
    | "magiclink"
    | "email"
    | null;
  const next = requestUrl.searchParams.get("next") ?? "/portal";

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL("/activation?error=invalid_link", requestUrl.origin)
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        }
      }
    }
  );

  const { error } = await supabase.auth.verifyOtp({ token_hash, type });

  if (error) {
    return NextResponse.redirect(
      new URL("/activation?error=link_expired", requestUrl.origin)
    );
  }

  // Session established — redirect to next (e.g. /activation)
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
