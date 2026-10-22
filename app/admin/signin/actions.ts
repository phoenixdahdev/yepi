"use server";

import { z } from "zod";
import { checkCredentials, setAdminCookie } from "../../_lib/admin";
import type { ActionResult } from "../../_lib/schemas";

const schema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function signIn(values: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  if (!checkCredentials(parsed.data.email, parsed.data.password)) {
    // Slows a brute-force attempt without pretending to be rate limiting:
    // real throttling needs a shared store, since instances do not share
    // memory. One deliberate second is still cheap for a legitimate typo.
    await new Promise((r) => setTimeout(r, 1000));
    return { ok: false, message: "That email and password do not match." };
  }

  await setAdminCookie(parsed.data.email);
  return { ok: true, next: "/admin" };
}
