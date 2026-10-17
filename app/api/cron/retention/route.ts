import { NextResponse } from "next/server";
import { runRetention } from "../../../_lib/retention";

/**
 * Scheduled by vercel.ts. Vercel Cron sends `Authorization: Bearer
 * $CRON_SECRET`, and this refuses to run without a match — the endpoint
 * deletes applications, so it must never be publicly callable.
 *
 * Add `?dryRun=1` to see what a run would remove without removing it.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[retention] CRON_SECRET is not set; refusing to run.");
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";

  try {
    const report = await runRetention({ dryRun });
    console.log("[retention]", JSON.stringify(report));
    return NextResponse.json(report);
  } catch (error) {
    console.error("[retention] run failed", error);
    return NextResponse.json({ error: "Retention run failed." }, { status: 500 });
  }
}
