"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  saveReview,
  setApplicationStatus,
  type ApplicationStatus,
} from "../../_lib/application";
import { clearAdminCookie, requireAdmin } from "../../_lib/admin";
import type { ActionResult } from "../../_lib/schemas";

export async function signOut(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/signin");
}

const STATUSES: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "finalist",
  "winner",
  "waitlisted",
  "not_selected",
];

export async function changeStatus(
  id: string,
  to: ApplicationStatus,
): Promise<ActionResult> {
  const by = await requireAdmin();
  if (!STATUSES.includes(to)) {
    return { ok: false, message: "That is not a status an organiser can set." };
  }

  try {
    const ok = await setApplicationStatus(id, to, by);
    if (!ok) return { ok: false, message: "That application no longer exists." };
  } catch (error) {
    console.error("[admin] changeStatus", error);
    return { ok: false, message: "Could not save that. Try again." };
  }

  revalidatePath(`/admin/a/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function saveNotes(
  id: string,
  { score, notes }: { score?: number; notes?: string },
): Promise<ActionResult> {
  const by = await requireAdmin();

  if (score !== undefined && (score < 1 || score > 10)) {
    return { ok: false, message: "Score must be between 1 and 10." };
  }

  try {
    const ok = await saveReview(id, by, { score, notes });
    if (!ok) return { ok: false, message: "That application no longer exists." };
  } catch (error) {
    console.error("[admin] saveNotes", error);
    return { ok: false, message: "Could not save that. Try again." };
  }

  revalidatePath(`/admin/a/${id}`);
  return { ok: true };
}
