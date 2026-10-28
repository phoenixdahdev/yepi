"use server";

import { z } from "zod";
import {
  consentSchema,
  createDraft,
  findById,
  findDraftByEmail,
  founderSchema,
  materialsSchema,
  patchDraft,
  saveMaterialsSection,
  submitDraft,
  tractionSchema,
  ventureSchema,
  type ActionResult,
  type ConsentInput,
  type FounderInput,
  type MaterialsInput,
  type TractionInput,
  type VentureInput,
} from "../_lib/application";
import {
  clearDraftCookie,
  currentDraftId,
  setDraftCookie,
  setStatusCookie,
} from "../_lib/draft-session";
import { resumeEmail, sendMail, submittedEmail } from "../_lib/mail";
import { siteOrigin } from "../_lib/site";
import { CLOSED_MESSAGE, applicationsClosedNow } from "../_lib/applications";
import { MAGIC_LINK_TTL, signToken } from "../_lib/session";

const invalid = (error: z.ZodError): ActionResult => ({
  ok: false,
  errors: z.flattenError(error).fieldErrors,
});

const SAVE_FAILED = "We could not save that just now. Please try again in a moment.";
const NO_DRAFT = "Your application session has expired. Please start again.";

/* ---------------- Step 1 — founder ---------------- */

export async function saveFounder(values: FounderInput): Promise<ActionResult> {
  if (applicationsClosedNow()) return { ok: false, message: CLOSED_MESSAGE };

  const parsed = founderSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  const email = parsed.data.email.toLowerCase().trim();

  try {
    // Re-entering the same email resumes the existing draft rather than
    // stranding the applicant with a second, half-finished one.
    const existing = await findDraftByEmail(email);

    if (existing) {
      await patchDraft(existing.id, { founder: { ...parsed.data, email } });
      await setDraftCookie(existing.id);
    } else {
      const id = await createDraft({ ...parsed.data, email });
      await setDraftCookie(id);

      const link = `${siteOrigin()}/apply/resume?token=${encodeURIComponent(
        signToken({ id, scope: "draft" }, MAGIC_LINK_TTL * 48),
      )}`;
      await sendMail({ to: email, ...resumeEmail(link) });
    }
  } catch (error) {
    console.error("[apply] saveFounder", error);
    return { ok: false, message: SAVE_FAILED };
  }

  return { ok: true, next: "/apply/venture" };
}

/* ---------------- Steps 2-4 ---------------- */

async function patchStep(
  patch: Record<string, unknown>,
  next: string,
): Promise<ActionResult> {
  if (applicationsClosedNow()) return { ok: false, message: CLOSED_MESSAGE };

  const id = await currentDraftId();
  if (!id) return { ok: false, message: NO_DRAFT };

  try {
    const ok = await patchDraft(id, patch);
    if (!ok) {
      return {
        ok: false,
        message:
          "This application has already been submitted, so it can no longer be edited.",
      };
    }
  } catch (error) {
    console.error("[apply] patchStep", error);
    return { ok: false, message: SAVE_FAILED };
  }

  return { ok: true, next };
}

export async function saveVenture(values: VentureInput): Promise<ActionResult> {
  const parsed = ventureSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);
  return patchStep({ venture: parsed.data }, "/apply/traction");
}

export async function saveTraction(values: TractionInput): Promise<ActionResult> {
  const parsed = tractionSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);
  return patchStep({ traction: parsed.data }, "/apply/materials");
}

export async function saveMaterials(values: MaterialsInput): Promise<ActionResult> {
  if (applicationsClosedNow()) return { ok: false, message: CLOSED_MESSAGE };

  const parsed = materialsSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  const id = await currentDraftId();
  if (!id) return { ok: false, message: NO_DRAFT };

  try {
    const ok = await saveMaterialsSection(id, parsed.data);
    if (!ok) {
      return { ok: false, message: "This application has already been submitted." };
    }
  } catch (error) {
    console.error("[apply] saveMaterials", error);
    return { ok: false, message: SAVE_FAILED };
  }

  return { ok: true, next: "/apply/review" };
}

/* ---------------- Step 5 — submit ---------------- */

export async function submitApplication(
  values: ConsentInput,
): Promise<ActionResult> {
  if (applicationsClosedNow()) return { ok: false, message: CLOSED_MESSAGE };

  const parsed = consentSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  const id = await currentDraftId();
  if (!id) return { ok: false, message: NO_DRAFT };

  try {
    const draft = await findById(id);
    if (!draft) return { ok: false, message: NO_DRAFT };

    // Guard against a direct call that skipped earlier steps.
    const missing = (["founder", "venture", "traction", "materials"] as const).filter(
      (section) => !draft[section],
    );
    if (missing.length > 0) {
      return {
        ok: false,
        message: `Some earlier steps are incomplete: ${missing.join(", ")}. Please go back and finish them.`,
      };
    }

    const ok = await submitDraft(id);
    if (!ok) {
      return { ok: false, message: "This application has already been submitted." };
    }

    await clearDraftCookie();
    await setStatusCookie(id);

    if (draft.founder) {
      await sendMail({
        to: draft.founder.email,
        ...submittedEmail(id.slice(0, 8).toUpperCase()),
      });
    }
  } catch (error) {
    console.error("[apply] submitApplication", error);
    return { ok: false, message: SAVE_FAILED };
  }

  return { ok: true, next: "/apply/submitted" };
}
