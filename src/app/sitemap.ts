import type { MetadataRoute } from "next";
import { company } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: company.siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${company.siteUrl}/personuvernd`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
