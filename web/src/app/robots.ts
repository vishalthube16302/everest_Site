import type { MetadataRoute } from "next";
import { abs, indexable } from "@/lib/seo";

export const dynamic = "force-static";

// Blocks everything until SITE_INDEXABLE=true is set at launch.
export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/admin/" }, sitemap: abs("/sitemap.xml") };
}
