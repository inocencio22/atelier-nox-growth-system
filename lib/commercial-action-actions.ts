"use server";

import { revalidatePath } from "next/cache";
import { commercialActionSchema, formValue } from "@/lib/form-schemas";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { CommercialActionPriority, CommercialActionStatus } from "@/lib/commercial-actions";
import type { Database } from "@/lib/supabase.types";

type CommercialActionInsert = Database["public"]["Tables"]["commercial_actions"]["Insert"];
type CommercialActionUpdate = Database["public"]["Tables"]["commercial_actions"]["Update"];
type CommercialActionInsertClient = {
  insert: (value: CommercialActionInsert) => Promise<unknown>;
};
type CommercialActionUpdateClient = {
  update: (value: CommercialActionUpdate) => {
    eq: (column: string, value: string) => Promise<unknown>;
  };
};

export async function createCommercialAction(formData: FormData) {
  const parsed = commercialActionSchema.safeParse({
    businessId: formValue(formData, "businessId"),
    title: formValue(formData, "title"),
    description: formValue(formData, "description"),
    channel: formValue(formData, "channel", "WhatsApp"),
    status: formValue(formData, "status", "todo"),
    priority: formValue(formData, "priority", "medium"),
    dueDate: formValue(formData, "dueDate"),
    estimatedValue: formValue(formData, "estimatedValue", "CHF 0"),
    result: formValue(formData, "result"),
    visibleToClient: formData.get("visibleToClient") !== "off"
  });

  if (!parsed.success) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  const action: CommercialActionInsert = {
    business_id: parsed.data.businessId,
    title: parsed.data.title,
    description: parsed.data.description,
    channel: parsed.data.channel,
    status: parsed.data.status as CommercialActionStatus,
    priority: parsed.data.priority as CommercialActionPriority,
    due_date: parsed.data.dueDate,
    estimated_value: parsed.data.estimatedValue,
    result: parsed.data.result,
    visible_to_client: parsed.data.visibleToClient
  };

  await (supabase.from("commercial_actions") as unknown as CommercialActionInsertClient).insert(action);

  revalidatePath("/actions");
  revalidatePath("/dashboard");
  revalidatePath(`/clients/${parsed.data.businessId}`);
}

export async function updateCommercialActionStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as CommercialActionStatus;
  const allowedStatuses: CommercialActionStatus[] = ["todo", "in_progress", "waiting_approval", "done", "blocked"];

  if (!id || !allowedStatuses.includes(status)) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  await (supabase.from("commercial_actions") as unknown as CommercialActionUpdateClient)
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/actions");
  revalidatePath("/dashboard");
  revalidatePath("/clients");
}
