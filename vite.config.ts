import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

/**
 * vite.config.ts — Vite + vite-react-ssg configuration
 *
 * Key responsibilities:
 *   1. React plugin for JSX/TSX transformation
 *   2. ssgOptions.includedRoutes — async function that builds the complete
 *      list of paths to pre-render, including all product detail pages
 *      fetched live from Supabase at build time.
 *
 * Why ssgOptions lives here AND getStaticPaths lives in App.tsx:
 *   • includedRoutes  → tells vite-react-ssg WHICH paths to crawl for the build
 *   • getStaticPaths  → tells the route definition HOW to resolve /products/:slug
 *   Both are needed: includedRoutes for the crawl list, getStaticPaths for hydration.
 *
 * The @ts-expect-error below suppresses the one extra-property error caused by
 * ssgOptions not being in Vite's core UserConfig type. vite-react-ssg augments
 * the Vite module in its own types (see its dist/shared/*.d.ts), but Vite's
 * built-in type guard flags it. This is the standard documented approach.
 */

// ─── Build-time Supabase slug fetch ──────────────────────────────────────────────────
//
// Creates a fresh Supabase client using env vars available in the build environment.
// This runs only during `vite-react-ssg build` — never in the browser bundle.
//
// Required env vars (in .env or CI/CD secrets):
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGc...
//
// The anon key is already public-facing (used in the browser bundle) so using it
// here in the build script is safe — it carries the same RLS permissions.
async function fetchProductSlugsForSSG(): Promise<string[]> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      '[SSG] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. ' +
      'Product detail pages will NOT be pre-rendered. ' +
      'Set these in your .env file or CI environment.',
    );
    return [];
  }

  try {
    const client = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await client
      .from('products')
      .select('slug')
      .not('slug', 'is', null);

    if (error) {
      console.warn('[SSG] Supabase slug fetch failed:', error.message);
      return [];
    }

    const slugs = (data ?? [])
      .map((row: { slug: string }) => row.slug)
      .filter(Boolean);

    console.log(`[SSG] Pre-rendering ${slugs.length} product pages.`);
    return slugs;
  } catch (err) {
    console.warn('[SSG] fetchProductSlugsForSSG error:', err);
    return [];
  }
}

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  ssr: {
    // react-helmet-async must be bundled for SSR (not treated as external)
    noExternal: ['react-helmet-async'],
  },

  // vite-react-ssg reads `ssgOptions` from the Vite config.
  // The module augmentation in vite-react-ssg's types makes this valid TS,
  // but the @ts-expect-error guard catches any version mismatch edge case.
  // @ts-expect-error — ssgOptions is injected by vite-react-ssg module augmentation
  ssgOptions: {
    /**
     * Script loading mode — async prevents render-blocking.
     */
    script: 'async' as const,

    /**
     * Do NOT set formatting: 'minify' — it causes hydration failures because
     * the SSG-rendered HTML gets whitespace-compressed in ways that differ from
     * what React's hydration algorithm expects when it re-renders on the client.
     * Leave as default ('none') for safe hydration.
     */
    formatting: 'none' as const,

    /**
     * Beasties / critters (CSS inlining) — disabled: not installed.
     */
    crittersOptions: false as const,

    /**
     * Output style: 'nested' puts each route in its own folder with index.html.
     * /products/screw-compressor → dist/products/screw-compressor/index.html
     * This is required for hosting on Vercel/Netlify without custom rewrite rules.
     */
    dirStyle: 'nested' as const,

    /**
     * includedRoutes — the complete list of paths vite-react-ssg will pre-render.
     *
     * This is an async function so we can fetch product slugs from Supabase at
     * build time. The function receives the auto-discovered static paths and the
     * full routes array, and must return the final list of paths to render.
     *
     * We ignore the auto-discovered `paths` param and build the list manually
     * to have full control. Dynamic /products/:slug paths are appended here
     * AND handled via getStaticPaths in App.tsx (belt-and-suspenders approach).
     */
    async includedRoutes(_paths: string[]) {
      const staticRoutes = [
        '/',
        '/about',
        '/products',
        '/services',
        '/gallery',
        '/contact',
        '/privacy',
        '/terms',
      ];

      // Fetch all product slugs from Supabase and build /products/:slug paths
      const slugs = await fetchProductSlugsForSSG();
      const productRoutes = slugs.map((slug) => `/products/${slug}`);

      const allRoutes = [...staticRoutes, ...productRoutes];
      console.log(
        `[SSG] Total routes to pre-render: ${allRoutes.length} ` +
        `(${staticRoutes.length} static + ${productRoutes.length} products)`,
      );

      return allRoutes;
    },
  },
});