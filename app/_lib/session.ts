import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Signed, expiring tokens for the two places this app identifies someone
 * without a password: the draft cookie an applicant carries through the
 * form, and the links emailed to resume a draft or open a status page.
 *
 * Tokens are signed, not encrypted — they carry an opaque id and an expiry,
 * never anything secret.
 */

function secret(): string {
  const value = process.env.APP_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "APP_SECRET must be set to a random string of at least 32 characters.",
    );
  }
  return value;
}

const b64 = (input: Buffer | string) =>
  Buffer.from(input).toString("base64url");

export type TokenPayload = {
  /** Application document id. */
  id: string;
  /** What the token is allowed to do, so a status link cannot edit a draft
   *  and an applicant's link can never reach the organisers' dashboard. */
  scope: "draft" | "status" | "admin";
  /** Expiry, epoch ms. */
  exp: number;
};

export function signToken(
  payload: Omit<TokenPayload, "exp">,
  ttlMs: number,
): string {
  const body = b64(JSON.stringify({ ...payload, exp: Date.now() + ttlMs }));
  const mac = b64(createHmac("sha256", secret()).update(body).digest());
  return `${body}.${mac}`;
}

export function verifyToken(
  token: string | undefined,
  scope: TokenPayload["scope"],
): TokenPayload | null {
  if (!token) return null;

  const [body, mac] = token.split(".");
  if (!body || !mac) return null;

  const expected = b64(createHmac("sha256", secret()).update(body).digest());
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString());
  } catch {
    return null;
  }

  if (payload.scope !== scope) return null;
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}

export const DRAFT_COOKIE = "yepi_draft";
export const STATUS_COOKIE = "yepi_status";
export const ADMIN_COOKIE = "yepi_admin";

/** A draft should outlive a long, interrupted sitting. */
export const DRAFT_TTL = 1000 * 60 * 60 * 24 * 30;
/** A status sign-in link is short-lived; the cookie it sets is not. */
export const MAGIC_LINK_TTL = 1000 * 60 * 30;
export const STATUS_TTL = 1000 * 60 * 60 * 24 * 30;
/** Organisers re-authenticate weekly; this cookie reaches every applicant's
 *  personal information, so it is deliberately shorter-lived than theirs. */
export const ADMIN_TTL = 1000 * 60 * 60 * 24 * 7;

export const newId = () => randomBytes(16).toString("hex");
