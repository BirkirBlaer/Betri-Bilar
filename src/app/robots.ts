import type { MetadataRoute } from "next";
import { company, demoMode } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Keep the sales demo out of search engines until it is approved and published.
  if (demoMode) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${company.siteUrl}/sitemap.xml` };
}
