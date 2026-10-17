import "server-only";

/**
 * The canonical public origin, used for canonical URLs, Open Graph, the
 * sitemap, and the links we put inside emails.
 *
 * Never derived from a request header: the value ends up in emails we send,
 * so a spoofed Host would become a phishing link from our own domain. It is
 * also not a NEXT_PUBLIC_ var, so changing the domain does not need a
 * rebuild.
 */
export function siteOrigin(): string {
  const configured = process.env.SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // Static pages bake this in at build time, so a missing value silently
  // ships canonical and og:image URLs pointing at localhost. On Vercel
  // VERCEL_PROJECT_PRODUCTION_URL covers it; anywhere else, say so loudly.
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[site] SITE_URL is not set. Falling back to http://localhost:3000 — " +
        "canonical URLs, the sitemap and social card images will be wrong.",
    );
  }

  return "http://localhost:3000";
}

export const siteUrl = (path = "/") => new URL(path, siteOrigin()).toString();
