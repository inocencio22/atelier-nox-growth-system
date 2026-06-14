"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

type BusinessUpdateClient = {
  update: (value: Record<string, unknown>) => {
    eq: (column: string, value: string) => Promise<{ error: unknown }>;
  };
};

export async function toggleAutoApprove(formData: FormData) {
  const businessId = String(formData.get("businessId") ?? "").trim();
  const autoApprove = formData.get("autoApprove") === "true";

  if (!businessId) return;

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) return;

  await (supabase.from("businesses") as unknown as BusinessUpdateClient)
    .update({ auto_approve: autoApprove, updated_at: new Date().toISOString() })
    .eq("id", businessId);

  revalidatePath(`/clients/${businessId}`);
  revalidatePath("/portal");
}

export async function saveMonthlyResults(formData: FormData) {
  const businessId = String(formData.get("businessId") ?? "").trim();
  const monthlyResults = String(formData.get("monthlyResults") ?? "").trim();

  if (!businessId) return;

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) return;

  await (supabase.from("businesses") as unknown as BusinessUpdateClient)
    .update({ monthly_results: monthlyResults || null, updated_at: new Date().toISOString() })
    .eq("id", businessId);

  revalidatePath(`/clients/${businessId}`);
  revalidatePath("/portal");
}

export async function markContractSigned(formData: FormData) {
  const businessId = String(formData.get("businessId") ?? "").trim();
  if (!businessId) return;

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) return;

  await (supabase.from("businesses") as unknown as BusinessUpdateClient)
    .update({
      contract_signed: true,
      contract_signed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", businessId);

  revalidatePath(`/clients/${businessId}`);
}
