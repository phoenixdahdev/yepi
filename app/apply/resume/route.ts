import { redirect } from "next/navigation";
import { findById } from "../../_lib/application";
import { setDraftCookie } from "../../_lib/draft-session";
import { verifyToken } from "../../_lib/session";

/** Where an interrupted applicant should land: the first unfinished step. */
function nextStep(draft: Awaited<ReturnType<typeof findById>>): string {
  if (!draft?.venture) return "/apply/venture";
  if (!draft.traction) return "/apply/traction";
  if (!draft.materials) return "/apply/materials";
  return "/apply/review";
}

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? undefined;
  const payload = verifyToken(token, "draft");

  if (!payload) redirect("/apply?resume=expired");

  let draft;
  try {
    draft = await findById(payload.id);
  } catch (error) {
    console.error("[apply] resume", error);
    redirect("/apply?resume=error");
  }

  if (!draft) redirect("/apply?resume=expired");
  if (draft.status !== "draft") redirect("/status");

  await setDraftCookie(draft.id);
  redirect(nextStep(draft));
}
