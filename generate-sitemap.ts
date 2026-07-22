/**
 * generate-sitemap.ts
 * ────────────────────────────────────────────────────────────
 * Build-time script: generates /public/sitemap.xml
 * Queries Supabase for product slugs and combines with static routes.
 *
 * Uses VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY from .env.
 * These are public (anon) keys — safe for build environments.
 *
 * US-001 — Acceptance Criteria AC-05 through AC-08
 * ────────────────────────────────────────────────────────────
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Load .env manually (no Vite at build time) ──────────────
import { config } from 'dotenv';
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = 'https://everesthps.com';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[sitemap] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

// ── Static routes ───────────────────────────────────────────
const staticRoutes: { path: string; changefreq: string; priority: string }[] = [
  { path: '/',         changefreq: 'weekly',  priority: '1.0' },
  { path: '/about',    changefreq: 'monthly', priority: '0.7' },
  { path: '/products', changefreq: 'weekly',  priority: '0.9' },
  { path: '/services', changefreq: 'monthly', priority: '0.7' },
  { path: '/gallery',  changefreq: 'monthly', priority: '0.5' },
  { path: '/contact',  changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy',  changefreq: 'yearly',  priority: '0.3' },
  { path: '/terms',    changefreq: 'yearly',  priority: '0.3' },
  { path: '/ai-discover', changefreq: 'weekly', priority: '0.6' },
];

// ── Fetch product slugs from Supabase REST API ─────────────
async function fetchProductSlugs(): Promise<string[]> {
  const url = `${SUPABASE_URL}/rest/v1/products?select=slug&order=sort_order`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    console.error(`[sitemap] Supabase query failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const rows: { slug: string }[] = await res.json();
  return rows.map((r) => r.slug).filter(Boolean);
}

// ── Build XML ──────────────────────────────────────────────
function buildSitemap(productSlugs: string[]): string {
  const today = new Date().toISOString().split('T')[0]; // 2026-04-06

  const entries: string[] = [];

  for (const route of staticRoutes) {
    entries.push(`  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
  }

  for (const slug of productSlugs) {
    entries.push(`  <url>
    <loc>${SITE_URL}/products/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  console.log('[sitemap] Fetching product slugs from Supabase…');
  const slugs = await fetchProductSlugs();
  console.log(`[sitemap] Found ${slugs.length} product slugs`);

  const xml = buildSitemap(slugs);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outPath = path.resolve(__dirname, 'public', 'sitemap.xml');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf-8');

  console.log(`[sitemap] Written to ${outPath} (${staticRoutes.length} static + ${slugs.length} products = ${staticRoutes.length + slugs.length} URLs)`);
}

main().catch((err) => {
  console.error('[sitemap] Fatal error:', err);
  process.exit(1);
});
