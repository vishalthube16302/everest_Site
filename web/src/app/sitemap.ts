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
  // lastmod: real "last changed" dates from Everest V2 (set by database triggers on every save).
  const newest = (dates: string[]) => dates.reduce((a, b) => (b > a ? b : a), "");
  const at = (d: string) => (d ? { lastModified: new Date(d) } : {});
  const catalogue = newest([...products.map((p) => p.updated_at), ...categories.map((c) => c.updated_at)]);
  const fixed = ["/", "/products", "/services", "/dealers", "/reviews", "/about", "/gallery", "/contact", "/ai-discover", "/privacy", "/terms"];
  return [
    ...fixed.map((path) => ({ url: abs(path), ...(path === "/" || path === "/products" || path === "/ai-discover" ? at(catalogue) : {}) })),
    ...[...servicePages.map((s) => `/services/${s.slug}`), "/services/areas-served", "/guides", ...guides.map((g) => `/guides/${g.slug}`)].map((path) => ({ url: abs(path) })),
    // Hindi and Marathi only once checked and set live.
    ...langs.filter((l) => l.live).flatMap((l) => l.pages.map((p) => ({ url: abs(langPath(l.code, p.slug)) }))),
    ...categories.map((c) => ({ url: abs(`/categories/${c.slug}`), ...at(newest([c.updated_at, ...c.products.map((p) => p.updated_at)])) })),
    ...products.map((p) => ({ url: abs(`/products/${p.slug}`), ...at(p.updated_at) })),
  ];
}
