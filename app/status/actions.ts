"use server";

import { z } from "zod";
import { findLatestByEmail } from "../_lib/application";
import { statusRequestSchema, type ActionResult } from "../_lib/schemas";
import { sendMail, statusLinkEmail } from "../_lib/mail";
import { MAGIC_LINK_TTL, signToken } from "../_lib/session";

function siteOrigin(): string {
  // Read at runtime, not inlined at build: a NEXT_PUBLIC_ var is baked
  // into the bundle, so changing the domain would need a rebuild.
  const configured = process.env.SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export async function requestStatusLink(values: {
  email: string;
}): Promise<ActionResult> {
  const parsed = statusRequestSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const email = parsed.data.email.toLowerCase().trim();

  try {
    const application = await findLatestByEmail(email);

    // Only send when there is something to open, but always answer the same
    // way — otherwise this form becomes a way to test who applied.
    if (application && application.status !== "draft") {
      const link = `${siteOrigin()}/status/enter?token=${encodeURIComponent(
        signToken({ id: application.id, scope: "status" }, MAGIC_LINK_TTL),
      )}`;
      await sendMail({ to: email, ...statusLinkEmail(link) });
    }
  } catch (error) {
    console.error("[status] requestStatusLink", error);
    return {
      ok: false,
      message: "We could not send that just now. Please try again in a moment.",
    };
  }

  return { ok: true };
}
