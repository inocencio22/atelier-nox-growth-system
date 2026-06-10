"use server";

import { revalidatePath } from "next/cache";
import type { ContactStatus, CustomerContact } from "@/lib/data";
import { DEMO_BUSINESS_ID } from "@/lib/business";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/supabase.types";

type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
type ContactInsertClient = {
  insert: (value: ContactInsert | ContactInsert[]) => Promise<unknown>;
};

export async function createContact(formData: FormData) {
  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  const name = String(formData.get("name") ?? "").trim();
  const nextAction = String(formData.get("nextAction") ?? "").trim();

  if (!name || !nextAction) {
    return;
  }

  const newContact: ContactInsert = {
    business_id: DEMO_BUSINESS_ID,
    name,
    channel: String(formData.get("channel") ?? "Instagram") as CustomerContact["channel"],
    last_interaction: String(formData.get("lastInteraction") ?? "Aujourd'hui"),
    next_action: nextAction,
    value: String(formData.get("value") ?? "CHF 100"),
    status: String(formData.get("status") ?? "a_relancer") as ContactStatus,
    consent: formData.get("consent") === "on"
  };

  await (supabase.from("contacts") as unknown as ContactInsertClient).insert(newContact);

  revalidatePath("/contacts");
  revalidatePath("/dashboard");
}

export async function importContacts(formData: FormData) {
  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  const rawContacts = String(formData.get("contacts") ?? "");

  if (!rawContacts) {
    return;
  }

  let parsedContacts: Array<Partial<CustomerContact>>;

  try {
    parsedContacts = JSON.parse(rawContacts) as Array<Partial<CustomerContact>>;
  } catch {
    return;
  }

  const contactsToInsert: ContactInsert[] = parsedContacts
    .map((contact) => ({
      business_id: DEMO_BUSINESS_ID,
      name: String(contact.name ?? "").trim(),
      channel: (contact.channel ?? "Instagram") as CustomerContact["channel"],
      last_interaction: String(contact.lastInteraction ?? "Import CSV"),
      next_action: String(contact.nextAction ?? "Qualifier et préparer une relance."),
      value: String(contact.value ?? "CHF 100"),
      status: (contact.status ?? "a_relancer") as ContactStatus,
      consent: Boolean(contact.consent)
    }))
    .filter((contact) => contact.name && contact.next_action);

  if (!contactsToInsert.length) {
    return;
  }

  await (supabase.from("contacts") as unknown as ContactInsertClient).insert(contactsToInsert);

  revalidatePath("/contacts");
  revalidatePath("/dashboard");
}
