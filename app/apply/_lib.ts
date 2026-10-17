import "server-only";
import { redirect } from "next/navigation";
import type { ApplicationDoc } from "../_lib/application";
import { findById } from "../_lib/application";
import { currentDraftId } from "../_lib/draft-session";

/**
 * Loads the draft for prefill. Never throws: a database outage should not
 * stop someone seeing the form, it should just mean nothing is prefilled.
 */
export async function loadDraft(): Promise<ApplicationDoc | null> {
  // The cookie read stays outside the try: Next signals a prerender bailout
  // by throwing from cookies(), and catching that breaks the mechanism.
  const id = await currentDraftId();
  if (!id) return null;

  try {
    return await findById(id);
  } catch (error) {
    console.error("[apply] loadDraft", error);
    return null;
  }
}

/** For steps 2-5, which are meaningless without a draft to attach to. */
export async function requireDraft(): Promise<ApplicationDoc> {
  const draft = await loadDraft();
  if (!draft) redirect("/apply");
  if (draft.status !== "draft") redirect("/status");
  return draft;
}
