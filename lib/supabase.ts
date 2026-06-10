import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
