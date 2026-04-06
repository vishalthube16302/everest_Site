import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ssgOptions is consumed by the vite-react-ssg CLI during `vite-react-ssg build`.
// It is not part of Vite core types, so @ts-expect-error suppresses that one
// extra-property error without widening the rest of the config.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  ssr: {
    noExternal: ['react-helmet-async'],
  },
  // @ts-expect-error – vite-react-ssg reads this key; Vite core ignores it
  ssgOptions: {
    // Emit script tags as async so they don't block HTML parsing.
    script: 'async',

    // Whitespace-minify the pre-rendered HTML.
    formatting: 'minify',

    // Disable critters (inline-CSS optimiser) – not installed, so must be false.
    crittersOptions: false,

    /**
     * Enumerate the routes vite-react-ssg must pre-render.
     *
     * Static routes are listed explicitly here.
     * Dynamic product-detail routes (/products/:slug) will be added when
     * generate-sitemap.ts is created (US-001 scope).  Once that file exists,
     * its output can be parsed here to extend the list with every slug.
     *
     * Admin routes are intentionally excluded: they require authentication,
     * pre-rendering them would expose empty shells and waste crawl budget.
     */
    includedRoutes(_paths: string[]) {
      return [
        '/',
        '/about',
        '/products',
        '/services',
        '/gallery',
        '/contact',
        '/privacy',
        '/terms',
      ];
    },
  },
});