import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import {
  DRAFT_COOKIE,
  DRAFT_TTL,
  STATUS_COOKIE,
  STATUS_TTL,
  signToken,
  verifyToken,
} from "./session";

const base = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

/**
 * `connection()` stops the prerender before verifyToken reads Date.now() to
 * check the token's expiry. Without it, Cache Components treats that clock
 * read as an unstable value during the prefetch pass and the navigation into
 * the next step fails at runtime — which the build does not catch.
 */
export async function currentDraftId(): Promise<string | null> {
  await connection();
  const token = (await cookies()).get(DRAFT_COOKIE)?.value;
  return verifyToken(token, "draft")?.id ?? null;
}

export async function setDraftCookie(id: string): Promise<void> {
  (await cookies()).set(DRAFT_COOKIE, signToken({ id, scope: "draft" }, DRAFT_TTL), {
    ...base,
    maxAge: DRAFT_TTL / 1000,
  });
}

export async function clearDraftCookie(): Promise<void> {
  (await cookies()).delete(DRAFT_COOKIE);
}

export async function currentStatusId(): Promise<string | null> {
  await connection();
  const token = (await cookies()).get(STATUS_COOKIE)?.value;
  return verifyToken(token, "status")?.id ?? null;
}

export async function setStatusCookie(id: string): Promise<void> {
  (await cookies()).set(
    STATUS_COOKIE,
    signToken({ id, scope: "status" }, STATUS_TTL),
    { ...base, maxAge: STATUS_TTL / 1000 },
  );
}
