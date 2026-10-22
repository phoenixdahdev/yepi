import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Blocks unauthenticated organiser requests before a route renders, so no
 * page can begin querying applicant data on the way to being redirected.
 *
 * This is the outer of two gates: every admin page and route authorises
 * again for itself. Proxy runs separately from render code, so the token
 * check is inlined here rather than imported from the app's session module.
 */

const COOKIE = "yepi_admin";

function validAdminToken(token: string | undefined): boolean {
  const secret = process.env.APP_SECRET;
  if (!token || !secret) return false;

  const [body, mac] = token.split(".");
  if (!body || !mac) return false;

  const expected = Buffer.from(
    createHmac("sha256", secret).update(body).digest(),
  ).toString("base64url");

  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    return payload.scope === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  if (validAdminToken(request.cookies.get(COOKIE)?.value)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/admin/signin", request.url));
}

export const config = {
  // Sign-in itself must stay reachable, or this redirects to itself.
  matcher: ["/admin", "/admin/a/:path*", "/admin/export"],
};
