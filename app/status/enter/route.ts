import { redirect } from "next/navigation";
import { setStatusCookie } from "../../_lib/draft-session";
import { verifyToken } from "../../_lib/session";

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? undefined;
  const payload = verifyToken(token, "status");

  if (!payload) redirect("/status?link=expired");

  await setStatusCookie(payload.id);
  redirect("/status");
}
