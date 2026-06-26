"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { createAdminClient } from "@/lib/admin-client";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Database } from "@/lib/supabase.types";
import { formValue, onboardingSubmissionSchema } from "@/lib/form-schemas";
import { generateSubmissionDiagnostic, getOnboardingSubmissionById, type OnboardingStatus } from "@/lib/onboarding";
import { buildNewDemandeEmail, sendEmail } from "@/lib/resend";

type OnboardingInsert = Database["public"]["Tables"]["onboarding_submissions"]["Insert"];
type OnboardingUpdate = Database["public"]["Tables"]["onboarding_submissions"]["Update"];
type DiagnosticInsert = Database["public"]["Tables"]["diagnostics"]["Insert"];
type ProposalInsert = Database["public"]["Tables"]["proposals"]["Insert"];
type SupabaseWriteError = { code?: string; message?: string };

type OnboardingInsertClient = {
  insert: (value: OnboardingInsert) => Promise<{ error: SupabaseWriteError | null }>;
};
type OnboardingUpdateClient = {
  update: (value: OnboardingUpdate) => {
    eq: (column: string, value: string) => Promise<unknown>;
  };
};
type DiagnosticInsertClient = {
  insert: (value: DiagnosticInsert) => {
    select: (columns: string) => {
      single: () => Promise<{ data: { id: string } | null; error: unknown }>;
    };
  };
};
type ProposalInsertClient = {
  insert: (value: ProposalInsert) => Promise<unknown>;
};

// ─────────────────────────────────────────────────────────────────
// Create submission (public form)
// ─────────────────────────────────────────────────────────────────
export async function createOnboardingSubmission(formData: FormData) {
  const parsed = onboardingSubmissionSchema.safeParse({
    businessName: formValue(formData, "businessName"),
    ownerEmail: formValue(formData, "ownerEmail"),
    ownerName: formValue(formData, "ownerName"),
    city: formValue(formData, "city", "Lausanne"),
    niche: formValue(formData, "niche", "Coiffure"),
    website: formValue(formData, "website"),
    instagramHandle: formValue(formData, "instagramHandle"),
    mainObjective: formValue(formData, "mainObjective", "plus_clients"),
    desiredPlan: formValue(formData, "desiredPlan", "essentiel"),
    notes: formValue(formData, "notes"),
    ownerPhone: formValue(formData, "ownerPhone"),
    returnPath: formValue(formData, "returnPath", "/onboarding")
  });
  const safeReturnPath = parsed.success ? parsed.data.returnPath : "/onboarding";

  if (!parsed.success) {
    redirect(`${safeReturnPath}?status=missing`);
  }

  const phonePrefix = parsed.data.ownerPhone ? `📱 ${parsed.data.ownerPhone}\n\n` : "";
  const submission: OnboardingInsert = {
    business_name: parsed.data.businessName,
    owner_email: parsed.data.ownerEmail,
    owner_name: parsed.data.ownerName,
    city: parsed.data.city,
    niche: parsed.data.niche,
    website: parsed.data.website,
    instagram_handle: parsed.data.instagramHandle,
    main_objective: parsed.data.mainObjective,
    desired_plan: parsed.data.desiredPlan,
    notes: parsed.data.notes ? `${phonePrefix}${parsed.data.notes}` : phonePrefix || null,
    status: "new"
  };

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    console.error("[onboarding] Supabase not configured.");
    redirect(`${safeReturnPath}?status=error`);
  }

  let insertError: SupabaseWriteError | null = null;
  try {
    const result = await (supabase.from("onboarding_submissions") as unknown as OnboardingInsertClient).insert(
      submission
    );
    insertError = result.error;
  } catch (error) {
    console.error("[onboarding] Unexpected submission failure.", {
      name: error instanceof Error ? error.name : "unknown"
    });
    redirect(`${safeReturnPath}?status=error`);
  }

  if (insertError) {
    console.error("[onboarding] Insert failed.", { code: insertError.code, message: insertError.message });
    redirect(`${safeReturnPath}?status=error`);
  }

  const str = (key: string) => String(formData.get(key) ?? "").trim() || undefined;

  void sendEmail(
    buildNewDemandeEmail({
      businessName: parsed.data.businessName,
      ownerEmail: parsed.data.ownerEmail,
      ownerPhone: parsed.data.ownerPhone ?? null,
      city: parsed.data.city,
      niche: parsed.data.niche,
      mainObjective: parsed.data.mainObjective,
      desiredPlan: parsed.data.desiredPlan,
      googleBusiness: str("googleBusiness"),
      placeRating: str("placeRating"),
      placeReviews: str("placeReviews"),
      placePhotos: str("placePhotos"),
      placeWebsite: str("placeWebsite"),
      placeAddress: str("placeAddress"),
      placePageSpeed: str("placePageSpeed"),
      placeTopCompetitor: str("placeTopCompetitor")
    })
  );

  redirect(`${safeReturnPath}?status=ok`);
}

// ─────────────────────────────────────────────────────────────────
// Update status
// ─────────────────────────────────────────────────────────────────
export async function updateOnboardingStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as OnboardingStatus;
  const allowed: OnboardingStatus[] = ["new", "diagnostic_ready", "contacted", "won", "lost"];

  if (!id || !allowed.includes(status)) return;

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    await (supabase.from("onboarding_submissions") as unknown as OnboardingUpdateClient)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  revalidatePath("/demandes");
}

// ─────────────────────────────────────────────────────────────────
// Save diagnostic
// ─────────────────────────────────────────────────────────────────
export async function saveGeneratedDiagnostic(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { submission } = await getOnboardingSubmissionById(id);
  if (!submission) return;

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    redirect(`/demandes/${id}?saved=demo`);
  }

  const generated = generateSubmissionDiagnostic(submission);

  const diagnosticInsert: DiagnosticInsert = {
    onboarding_submission_id: id,
    title: generated.title,
    score: generated.score,
    summary: generated.summary,
    strengths: generated.strengths,
    risks: generated.risks,
    actions: generated.actions,
    outreach_script: generated.outreachScript
  };

  const { data } = await (supabase.from("diagnostics") as unknown as DiagnosticInsertClient)
    .insert(diagnosticInsert)
    .select("id")
    .single();

  const proposalInsert: ProposalInsert = {
    onboarding_submission_id: id,
    diagnostic_id: data?.id ?? null,
    title: generated.suggestedProposal.title,
    lead: generated.suggestedProposal.lead,
    price: generated.suggestedProposal.price,
    status: "draft",
    summary: generated.suggestedProposal.summary
  };

  await (supabase.from("proposals") as unknown as ProposalInsertClient).insert(proposalInsert);
  await (supabase.from("onboarding_submissions") as unknown as OnboardingUpdateClient)
    .update({ status: "diagnostic_ready", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/demandes");
  revalidatePath(`/demandes/${id}`);
  redirect(`/demandes/${id}?saved=ok`);
}

// ─────────────────────────────────────────────────────────────────
// Convert demande → business (atomic RPC, no invite/email)
//
// Gate B1.1 only: creates business + updates 3 submission fields +
// writes audit log — all inside ONE PostgreSQL transaction.
// Invite and welcome email belong to Gate B1.2 (next gate).
// ─────────────────────────────────────────────────────────────────
export async function convertToClient(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const plan = String(formData.get("plan") ?? "essentiel").trim();

  if (!id) return;

  // ── 1. Verify demo data guard ────────────────────────────────────
  const { submission, source } = await getOnboardingSubmissionById(id);
  if (!submission || source === "mock") {
    redirect(`/demandes/${id}?client=demo`);
  }

  // ── 2. Verify admin session (server-side, uses user JWT) ─────────
  //    The RPC itself re-checks is_admin() — this is a belt-and-suspenders
  //    guard to catch auth issues before hitting the database.
  const admin = createAdminClient();
  if (!admin) {
    redirect(`/demandes/${id}?client=nokey`);
  }

  const serverClient = await createSupabaseServerClient();
  if (!serverClient) {
    redirect(`/demandes/${id}?client=nokey`);
  }

  const {
    data: { user },
    error: sessionError
  } = await serverClient.auth.getUser();
  if (sessionError || !user) {
    redirect(`/login`);
  }

  // ── 3. Validate plan ─────────────────────────────────────────────
  const allowedPlans = ["essentiel", "growth", "pro_local", "partner"] as const;
  type AllowedPlan = (typeof allowedPlans)[number];
  const safePlan: AllowedPlan = (allowedPlans as readonly string[]).includes(plan)
    ? (plan as AllowedPlan)
    : "essentiel";

  // ── 4. Call atomic RPC ────────────────────────────────────────────
  //    Uses the server client (user JWT) so auth.uid() works inside
  //    the SECURITY DEFINER function for the is_admin() check and
  //    audit log actor_id.
  type RpcArgs = { p_submission_id: string; p_plan: string };
  type RpcResult = { ok: boolean; code: string; business_id?: string };

  const { data: rpcResult, error: rpcError } = await (
    serverClient.rpc as unknown as (
      fn: string,
      args: RpcArgs
    ) => Promise<{ data: RpcResult | null; error: { message: string } | null }>
  )("convert_onboarding_submission_to_business", {
    p_submission_id: id,
    p_plan: safePlan
  });

  if (rpcError) {
    console.error("[convertToClient] RPC error:", rpcError.message);
    redirect(`/demandes/${id}?client=error`);
  }

  const result = rpcResult ?? { ok: false, code: "error" };

  // ── 5. Interpret result codes ─────────────────────────────────────
  switch (result.code) {
    case "converted": {
      const businessId = result.business_id ?? "";
      revalidatePath("/clients");
      revalidatePath("/demandes");
      revalidatePath(`/demandes/${id}`);
      redirect(`/clients/${businessId}`);
    }
    case "already_converted": {
      const existingBusinessId = result.business_id ?? "";
      redirect(`/demandes/${id}?client=already_converted&business_id=${existingBusinessId}`);
    }
    case "unauthorized":
      redirect(`/demandes/${id}?client=unauthorized`);
    case "not_found":
      redirect(`/demandes/${id}?client=error`);
    case "invalid_plan":
      redirect(`/demandes/${id}?client=error`);
    default:
      console.error("[convertToClient] Unexpected RPC code:", result.code);
      redirect(`/demandes/${id}?client=error`);
  }
}
