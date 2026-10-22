import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_TTL, signToken, verifyToken } from "./session";

/**
 * A single fixed organiser login. There is no user table and no password
 * reset: the credentials live in the environment, not in the repository,
 * because this project is public and a committed password is a published
 * password.
 */

function configured(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

/** Compares digests rather than strings, so the time taken reveals neither
 *  the password nor its length. */
function sameSecret(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(email: string, password: string): boolean {
  const expected = configured();
  if (!expected) {
    console.error("[admin] ADMIN_EMAIL / ADMIN_PASSWORD are not set.");
    return false;
  }
  // Both are compared even when the email is wrong, so a wrong address and a
  // wrong password take the same time.
  const emailOk = sameSecret(email.trim().toLowerCase(), expected.email);
  const passwordOk = sameSecret(password, expected.password);
  return emailOk && passwordOk;
}

const base = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

export async function setAdminCookie(email: string): Promise<void> {
  (await cookies()).set(
    ADMIN_COOKIE,
    signToken({ id: email.trim().toLowerCase(), scope: "admin" }, ADMIN_TTL),
    { ...base, maxAge: ADMIN_TTL / 1000 },
  );
}

export async function clearAdminCookie(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
}

/**
 * Re-checked on every request against the configured address, so changing
 * ADMIN_EMAIL invalidates an outstanding session immediately rather than
 * whenever the cookie happens to expire.
 */
export async function currentAdmin(): Promise<string | null> {
  await connection();
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const email = verifyToken(token, "admin")?.id;
  if (!email || email !== configured()?.email) return null;
  return email;
}

export async function requireAdmin(): Promise<string> {
  const email = await currentAdmin();
  if (!email) redirect("/admin/signin");
  return email;
}
