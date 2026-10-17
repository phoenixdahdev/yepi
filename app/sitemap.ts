import type { MetadataRoute } from "next";
import { POLICY_VERSION } from "./_content/organisation";
import { siteUrl } from "./_lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const policyDate = new Date(POLICY_VERSION);

  return [
    {
      url: siteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: siteUrl("/privacy"),
      lastModified: policyDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: siteUrl("/terms"),
      lastModified: policyDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
