import type { ContactStatus, CustomerContact } from "@/lib/data";
import { contacts as mockContacts } from "@/lib/data";
import { DEMO_BUSINESS_ID } from "@/lib/business";
import { getSupabaseClient } from "@/lib/supabase";

type ContactRow = {
  id: string;
  name: string;
  channel: CustomerContact["channel"];
  last_interaction: string;
  next_action: string;
  value: string;
  status: ContactStatus;
  consent: boolean;
};

function mapContact(row: ContactRow): CustomerContact {
  const phoneMatch = row.next_action?.match(/^📱\s*([^\n]+)\n/);
  const phone = phoneMatch ? phoneMatch[1].trim() : null;
  const nextAction = row.next_action?.replace(/^📱[^\n]+\n/, "") ?? row.next_action;
  return {
    id: row.id,
    name: row.name,
    phone,
    channel: row.channel,
    lastInteraction: row.last_interaction,
    nextAction,
    value: row.value,
    status: row.status,
    consent: row.consent
  };
}

export async function getContacts(
  businessId = DEMO_BUSINESS_ID,
  options: { status?: string; search?: string } = {}
): Promise<{ contacts: CustomerContact[]; source: "mock" | "supabase" }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    let filtered = mockContacts;
    if (options.status) filtered = filtered.filter((c) => c.status === options.status);
    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
    }
    return { contacts: filtered, source: "mock" };
  }

  let query = supabase
    .from("contacts")
    .select("id,name,channel,last_interaction,next_action,value,status,consent")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (options.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return { contacts: mockContacts, source: "mock" };
  }

  let contacts = data.map((row) => mapContact(row as ContactRow));

  if (options.search) {
    const q = options.search.toLowerCase();
    contacts = contacts.filter((c) => c.name.toLowerCase().includes(q));
  }

  return { contacts, source: "supabase" };
}
