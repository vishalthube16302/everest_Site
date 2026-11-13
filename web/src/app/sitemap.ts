import type { MetadataRoute } from "next";
import { getCategoriesWithProducts, getProducts } from "@/lib/data";
import { abs, indexable } from "@/lib/seo";
import { guides } from "@/lib/guides";
import { langPath, langs } from "@/lib/lang-pages";
import { servicePages } from "@/lib/service-pages";

export const dynamic = "force-static";

// Built from the same data as the pages, so it always matches them. Empty until SITE_INDEXABLE=true.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexable) return [];
  const [categories, products] = await Promise.all([getCategoriesWithProducts(), getProducts()]);
  const fixed = ["/", "/products", "/services", "/dealers", "/reviews", "/about", "/gallery", "/contact", "/ai-discover", "/privacy", "/terms"];
  return [
    ...fixed.map((path) => ({ url: abs(path), priority: path === "/" ? 1 : path === "/products" ? 0.9 : 0.6 })),
    ...[...servicePages.map((s) => `/services/${s.slug}`), "/services/areas-served", "/guides", ...guides.map((g) => `/guides/${g.slug}`)].map((path) => ({ url: abs(path), priority: 0.8 })),
    // Hindi and Marathi only once checked and set live.
    ...langs.filter((l) => l.live).flatMap((l) => l.pages.map((p) => ({ url: abs(langPath(l.code, p.slug)), priority: 0.7 }))),
    ...categories.map((c) => ({ url: abs(`/categories/${c.slug}`), priority: 0.8 })),
    ...products.map((p) => ({ url: abs(`/products/${p.slug}`), priority: 0.7 })),
  ];
}
