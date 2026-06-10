"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { importContacts } from "@/lib/contact-actions";
import type { ContactStatus, CustomerContact } from "@/lib/data";

type ImportContact = Pick<
  CustomerContact,
  "name" | "channel" | "lastInteraction" | "nextAction" | "value" | "status" | "consent"
>;

const allowedChannels: CustomerContact["channel"][] = ["Instagram", "WhatsApp", "Email", "Téléphone"];
const allowedStatuses: ContactStatus[] = ["a_relancer", "client_fidele", "nouveau", "demande_prix", "avis_demande"];

export function ContactImportPanel({ isDemo }: { isDemo: boolean }) {
  const [contacts, setContacts] = useState<ImportContact[]>([]);
  const [fileName, setFileName] = useState<string>("Aucun fichier");

  const serializedContacts = useMemo(() => JSON.stringify(contacts), [contacts]);

  async function handleFile(file: File | null) {
    if (!file) {
      return;
    }

    setFileName(file.name);
    const content = await file.text();
    setContacts(parseContactsCsv(content));
  }

  return (
    <section className="border-2 border-ink bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Import CSV</p>
          <h2 className="mt-2 text-2xl font-black uppercase leading-none text-ink">Importer des contacts</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
            Colonnes acceptées: name, channel, lastInteraction, nextAction, value, status, consent.
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center border-2 border-ink bg-acid">
          <Upload className="h-5 w-5" />
        </span>
      </div>

      <label className="mt-4 block border-2 border-dashed border-ink bg-paper p-4 text-sm font-black uppercase text-ink">
        <input
          accept=".csv,text/csv"
          className="sr-only"
          type="file"
          onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
        />
        Choisir un fichier CSV
        <span className="mt-1 block text-xs font-bold normal-case text-stone-600">{fileName}</span>
      </label>

      {contacts.length ? (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">
              Preview · {contacts.length} contacts
            </p>
            {isDemo ? (
              <span className="border border-ink bg-yellow px-2 py-1 text-[10px] font-black uppercase">
                Mode demo
              </span>
            ) : null}
          </div>
          <div className="max-h-52 overflow-auto border-2 border-ink">
            <table className="w-full border-collapse bg-white text-left text-xs">
              <thead className="bg-ink text-white">
                <tr>
                  {["Nom", "Canal", "Status", "Action"].map((header) => (
                    <th key={header} className="border border-ink px-2 py-2 font-black uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.slice(0, 6).map((contact) => (
                  <tr key={`${contact.name}-${contact.nextAction}`}>
                    <td className="border border-line px-2 py-2 font-bold">{contact.name}</td>
                    <td className="border border-line px-2 py-2">{contact.channel}</td>
                    <td className="border border-line px-2 py-2">{contact.status}</td>
                    <td className="border border-line px-2 py-2">{contact.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form action={importContacts} className="mt-3">
            <input name="contacts" type="hidden" value={serializedContacts} />
            <button
              className="w-full border-2 border-ink bg-blue px-4 py-3 text-sm font-black uppercase text-white disabled:bg-stone-200 disabled:text-stone-500"
              disabled={isDemo}
              type="submit"
            >
              Importer dans Supabase
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}

function parseContactsCsv(csv: string): ImportContact[] {
  const rows = parseCsvRows(csv).filter((row) => row.some((cell) => cell.trim()));
  const [headers = [], ...body] = rows;
  const normalizedHeaders = headers.map(normalizeHeader);

  return body
    .map((row) => {
      const record = Object.fromEntries(normalizedHeaders.map((header, index) => [header, row[index] ?? ""]));
      const channel = normalizeChannel(record.channel);
      const status = normalizeStatus(record.status);

      return {
        name: record.name?.trim() || record.nom?.trim() || "",
        channel,
        lastInteraction: record.lastinteraction?.trim() || record.derniercontact?.trim() || "Import CSV",
        nextAction:
          record.nextaction?.trim() ||
          record.prochaineaction?.trim() ||
          "Qualifier et préparer une relance.",
        value: record.value?.trim() || record.valeur?.trim() || "CHF 100",
        status,
        consent: ["true", "1", "oui", "yes", "ok"].includes(String(record.consent ?? "").trim().toLowerCase())
      };
    })
    .filter((contact) => contact.name);
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function normalizeChannel(channel = ""): CustomerContact["channel"] {
  const normalized = channel.trim().toLowerCase();
  return allowedChannels.find((item) => item.toLowerCase() === normalized) ?? "Instagram";
}

function normalizeStatus(status = ""): ContactStatus {
  const normalized = status.trim().toLowerCase();
  return allowedStatuses.find((item) => item.toLowerCase() === normalized) ?? "a_relancer";
}
