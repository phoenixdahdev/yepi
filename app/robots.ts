import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteUrl } from "./_lib/site";

/**
 * Deliberately evaluated per request. Prerendered at build time this would
 * bake in whatever SITE_URL happened to be set then — and a Sitemap
 * directive pointing at localhost is worse than no directive at all.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personal, per-applicant surfaces. Nothing here is useful to a crawler
      // and none of it should appear in a search result.
      disallow: ["/apply/", "/status", "/status/", "/api/"],
    },
    sitemap: siteUrl("/sitemap.xml"),
  };
}
