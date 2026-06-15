"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/admin-client";
import { sendEmail } from "@/lib/resend";
import { inviteClient } from "@/lib/client-invite-actions";


type InvoiceTable = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
type InvoiceClient = {
  select: (cols: string, opts?: object) => Promise<{ count: number | null }>;
  insert: (row: object) => Promise<{ error: unknown }>;
  update: (row: object) => { eq: (col: string, val: string) => Promise<{ error: unknown }> };
};

const IBAN = process.env.ATELIER_NOX_IBAN ?? "CH5700767000L56947920";

const PLAN_PRICES: Record<string, number> = {
  local_clarity: 190,
  managed_growth: 390,
  done_for_you: 690,
};

const PLAN_LABELS: Record<string, string> = {
  local_clarity: "Local Clarity",
  managed_growth: "Managed Growth",
  done_for_you: "Done For You Local",
};

async function getNextInvoiceNumber(admin: ReturnType<typeof createAdminClient>): Promise<string> {
  if (!admin) return "NOX-2026-001";
  const year = new Date().getFullYear();
  const { count } = await (admin as unknown as { from: (t: string) => InvoiceClient })
    .from("invoices")
    .select("*", { count: "exact", head: true });
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  return `NOX-${year}-${seq}`;
}

export async function generateAndSendInvoice(formData: FormData): Promise<void> {
  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const plan = String(formData.get("plan") ?? "managed_growth").trim();
  const demandeId = String(formData.get("demandeId") ?? "").trim();
  const businessId = String(formData.get("businessId") ?? "").trim();

  const amount = PLAN_PRICES[plan] ?? 390;
  const planLabel = PLAN_LABELS[plan] ?? plan;

  const admin = createAdminClient();
  if (!admin) {
    redirect(`/clients/${businessId}?invoice_error=no_service_key`);
  }

  const invoiceNumber = await getNextInvoiceNumber(admin);
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 15);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("fr-CH", { day: "2-digit", month: "2-digit", year: "numeric" });

  // Guardar factura na base de dados
  const { error: insertError } = await (admin as unknown as { from: (t: string) => InvoiceClient }).from("invoices").insert({
    invoice_number: invoiceNumber,
    demande_id: demandeId || null,
    client_name: clientName,
    client_email: clientEmail,
    plan: planLabel,
    amount_chf: amount,
    status: "sent",
  });

  if (insertError) {
    redirect(`/clients/${businessId}?invoice_error=db`);
  }

  // Enviar email com factura HTML
  await sendEmail({
    to: clientEmail,
    subject: `Facture Atelier Nox — ${invoiceNumber}`,
    html: buildInvoiceEmail({
      invoiceNumber,
      clientName,
      clientEmail,
      planLabel,
      amount,
      dateEmission: formatDate(today),
      dateEcheance: formatDate(dueDate),
    }),
  });

  revalidatePath(`/clients/${businessId}`);
  redirect(`/clients/${businessId}?invoice_sent=1`);
}

export async function markInvoicePaid(formData: FormData): Promise<void> {
  const invoiceNumber = String(formData.get("invoiceNumber") ?? "").trim();
  const businessId = String(formData.get("businessId") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();

  const admin = createAdminClient();
  if (!admin) {
    redirect(`/clients/${businessId}?invoice_error=no_service_key`);
  }

  await (admin as unknown as { from: (t: string) => InvoiceClient })
    .from("invoices")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("invoice_number", invoiceNumber);

  // Disparar convite automaticamente após pagamento
  const fd = new FormData();
  fd.set("businessId", businessId);
  fd.set("businessName", businessName);
  fd.set("email", clientEmail);
  await inviteClient(fd);
}

function buildInvoiceEmail(p: {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  planLabel: string;
  amount: number;
  dateEmission: string;
  dateEcheance: string;
}) {
  return [
    '<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;">',
    '<div style="background:#12382F;padding:24px 32px;">',
    '<p style="color:#E85D2A;font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;margin:0 0 6px;">Atelier Nox</p>',
    '<h1 style="color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;margin:0;">FACTURE' + ' ' + p.invoiceNumber + '</h1>',
    '</div>',
    '<div style="padding:32px;">',
    '<table style="width:100%;margin-bottom:24px;">',
    '<tr>',
    '<td style="vertical-align:top;width:50%;">',
    '<p style="font-size:11px;font-weight:900;text-transform:uppercase;color:#888;margin:0 0 4px;">Émetteur</p>',
    '<p style="font-size:14px;font-weight:700;color:#111;margin:0;">Atelier Nox</p>',
    '<p style="font-size:13px;color:#555;margin:2px 0;">Lausanne, Suisse</p>',
    '<p style="font-size:13px;color:#555;margin:2px 0;">joaopedro.suisse@gmail.com</p>',
    '</td>',
    '<td style="vertical-align:top;width:50%;text-align:right;">',
    '<p style="font-size:11px;font-weight:900;text-transform:uppercase;color:#888;margin:0 0 4px;">Client</p>',
    '<p style="font-size:14px;font-weight:700;color:#111;margin:0;">' + p.clientName + '</p>',
    '<p style="font-size:13px;color:#555;margin:2px 0;">' + p.clientEmail + '</p>',
    '</td>',
    '</tr>',
    '</table>',
    '<table style="width:100%;border-collapse:collapse;margin-bottom:24px;">',
    '<thead>',
    '<tr style="background:#f8f7f2;">',
    '<th style="text-align:left;padding:10px 12px;font-size:11px;font-weight:900;text-transform:uppercase;color:#888;border:1px solid #e8e5dd;">Description</th>',
    '<th style="text-align:right;padding:10px 12px;font-size:11px;font-weight:900;text-transform:uppercase;color:#888;border:1px solid #e8e5dd;">Montant</th>',
    '</tr>',
    '</thead>',
    '<tbody>',
    '<tr>',
    '<td style="padding:12px;border:1px solid #e8e5dd;font-size:14px;color:#111;">Service mensuel — ' + p.planLabel + '</td>',
    '<td style="padding:12px;border:1px solid #e8e5dd;font-size:14px;font-weight:700;color:#111;text-align:right;">CHF ' + p.amount.toFixed(2) + '</td>',
    '</tr>',
    '<tr style="background:#f8f7f2;">',
    '<td style="padding:12px;border:1px solid #e8e5dd;font-size:13px;font-weight:900;color:#111;">TOTAL (HT — pas de TVA)</td>',
    '<td style="padding:12px;border:1px solid #e8e5dd;font-size:16px;font-weight:900;color:#12382F;text-align:right;">CHF ' + p.amount.toFixed(2) + '</td>',
    '</tr>',
    '</tbody>',
    '</table>',
    '<div style="background:#f0faf5;border:1px solid #12382F/20;padding:16px 20px;margin-bottom:24px;">',
    '<p style="font-size:11px;font-weight:900;text-transform:uppercase;color:#12382F;margin:0 0 8px;">Paiement par virement bancaire</p>',
    '<p style="font-size:13px;color:#333;margin:2px 0;"><strong>Bénéficiaire :</strong> Joao Pedro Inocencio — Atelier Nox Growth System</p>',
    '<p style="font-size:13px;color:#333;margin:2px 0;"><strong>IBAN :</strong> ' + IBAN + '</p>',
    '<p style="font-size:13px;color:#333;margin:2px 0;"><strong>Référence :</strong> ' + p.invoiceNumber + '</p>',
    '<p style="font-size:13px;color:#333;margin:2px 0;"><strong>\u00c9ch\u00e9ance :</strong> ' + p.dateEcheance + '</p>',
    '</div>',
    '<p style="font-size:12px;color:#aaa;margin:0;">Date d\'émission : ' + p.dateEmission + ' &nbsp;·&nbsp; Atelier Nox &nbsp;·&nbsp; Lausanne</p>',
    '</div>',
    '</div>'
  ].join("");
}
