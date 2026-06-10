import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase.types";
import { isSupabaseConfigured } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createSupabaseProxyClient(request: NextRequest, requestHeaders?: Headers) {
  const requestInit = requestHeaders
    ? {
        request: {
          headers: requestHeaders
        }
      }
    : { request };

  if (!supabaseUrl || !supabaseAnonKey || !isSupabaseConfigured) {
    return {
      response: NextResponse.next(requestInit),
      supabase: null
    };
  }

  let response = NextResponse.next(requestInit);

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next(requestInit);
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  return { response, supabase };
}
