import { Outlet } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import type { RouteRecord } from 'vite-react-ssg';
import { buildLocalBusinessSchema } from './lib/schema';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppFAB } from './components/WhatsAppFAB';
import { ScrollToTop } from './components/ScrollToTop';
import { SiteThemeVars } from './components/SiteThemeVars';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { NotFound } from './pages/NotFound';
import { supabase } from './lib/supabase';

// ─── Static LocalBusiness JSON-LD (synchronous — baked into every pre-rendered page) ───
//
// Built once at module init so it is available during vite-react-ssg's initial
// render snapshot. buildLocalBusinessSchema(null) uses real hardcoded fallbacks
// (phone, email, address, geo, GST, hours) so no Supabase fetch is required here.
const STATIC_LOCAL_BUSINESS_SCHEMA = buildLocalBusinessSchema(null);

// ─── Root layout — wraps every public page ───────────────────────────────────────────
//
// HelmetProvider MUST live here (inside the RouteRecord element tree) rather than
// outside ViteReactSSG(), because vite-react-ssg creates the React tree internally
// from the routes array. Placing HelmetProvider outside ViteReactSSG() would mean
// it wraps nothing during SSG render.
function RootLayout() {
  return (
    <HelmetProvider>
      {/* Global LocalBusiness JSON-LD — present in every pre-rendered HTML page */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(STATIC_LOCAL_BUSINESS_SCHEMA)}
        </script>
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <SiteThemeVars />
        <Header />
        <main className="flex-1">
          {/* Outlet renders the matched child route */}
          <Outlet />
        </main>
        <WhatsAppFAB />
        <Footer />
      </div>
    </HelmetProvider>
  );
}

// ─── Admin layout — no Header/Footer, no HelmetProvider needed ───────────────────────
function AdminLayout() {
  return <Outlet />;
}

// ─── Route definitions ────────────────────────────────────────────────────────────────
//
// RouteRecord = React Router v6 NonIndexRouteObject | IndexRouteObject, extended with:
//   • entry?: string          — for prehydration style tracking
//   • getStaticPaths?: ()     — for dynamic segments (/products/:slug)
//
// vite-react-ssg reads this array to:
//   1. Create the browser router at runtime (dev + hydration)
//   2. Know which paths to crawl for SSG (via includedRoutes + getStaticPaths)
//
// Admin routes are children of AdminLayout but intentionally NOT in includedRoutes:
// they require authentication, so pre-rendering them would waste crawl budget.
export const routes: RouteRecord[] = [
  // ── Admin routes (no SSG, no public layout) ─────────────────────────────────
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'login',
        lazy: async () => {
          const { AdminLogin } = await import('./pages/admin/AdminLogin');
          return { Component: AdminLogin };
        },
      },
      {
        path: 'dashboard',
        lazy: async () => {
          const { AdminDashboard } = await import('./pages/admin/AdminDashboard');
          return { Component: AdminDashboard };
        },
      },
    ],
  },

  // ── Public routes (SSG via RootLayout) ──────────────────────────────────────
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Static routes — all listed in ssgOptions.includedRoutes
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'products', element: <Products /> },
      { path: 'services', element: <Services /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },

      // Dynamic product detail — getStaticPaths fetches all slugs from Supabase
      // at BUILD TIME so vite-react-ssg pre-renders a static HTML file for every
      // product (e.g. /products/3hp-screw-compressor → dist/products/3hp-screw-compressor.html)
      {
        path: 'products/:slug',
        element: <ProductDetail />,
        // getStaticPaths runs only during `vite-react-ssg build`, never in the browser.
        // Returns paths WITHOUT the leading slash — vite-react-ssg prepends the route prefix.
        getStaticPaths: async () => {
          try {
            const { data, error } = await supabase
              .from('products')
              .select('slug')
              .not('slug', 'is', null);

            if (error || !data) {
              console.warn('[SSG] Could not fetch product slugs:', error?.message);
              return [];
            }

            // Return as full paths e.g. "products/3hp-screw-compressor"
            // vite-react-ssg resolves these relative to the parent route segment.
            return data
              .map((row: { slug: string }) => row.slug)
              .filter(Boolean)
              .map((slug: string) => `products/${slug}`);
          } catch (err) {
            console.warn('[SSG] getStaticPaths error:', err);
            return [];
          }
        },
      },

      // Catch-all 404 — not pre-rendered (noindex by design)
      { path: '*', element: <NotFound /> },
    ],
  },
];