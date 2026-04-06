import { Helmet, HelmetProvider } from 'react-helmet-async';
import { buildLocalBusinessSchema } from './lib/schema';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
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
import { lazy, Suspense } from 'react';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then((module) => ({ default: module.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
import { WhatsAppFAB } from './components/WhatsAppFAB';

/**
 * US-007 fix – GlobalSchemas must be synchronous.
 *
 * PREVIOUS APPROACH (broken for SSG):
 *   The component used useState + useEffect to fetch site_settings from
 *   Supabase, then passed the result to buildLocalBusinessSchema().
 *   During SSG pre-rendering, vite-react-ssg takes an HTML snapshot of
 *   the initial render.  Because the Supabase fetch is async, the snapshot
 *   captured settings = null and the schema injected into the HTML was
 *   identical to buildLocalBusinessSchema(null) anyway — but crucially
 *   it was injected *after* the snapshot, so the pre-rendered HTML
 *   contained no LocalBusiness JSON-LD at all.
 *
 * NEW APPROACH (correct for SSG):
 *   Build the schema once at module initialisation time (synchronously).
 *   buildLocalBusinessSchema(null) already uses all real hardcoded fallback
 *   values (phone +91-8855820105, email everesthps@gmail.com, address
 *   Chakan Pune 410501, geo-coords, GST, opening hours).  The output is
 *   therefore identical to what the async Supabase path produced.
 *   Removing useState / useEffect / supabase imports also reduces the JS
 *   bundle size for this component.
 */
const STATIC_LOCAL_BUSINESS_SCHEMA = buildLocalBusinessSchema(null);

/**
 * Injects the LocalBusiness JSON-LD schema into <head> on every page.
 * Because STATIC_LOCAL_BUSINESS_SCHEMA is a module-level constant, the
 * schema string is available immediately during the SSG render pass.
 */
function GlobalSchemas() {
  return (
    <Helmet>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json">
        {JSON.stringify(STATIC_LOCAL_BUSINESS_SCHEMA)}
      </script>
    </Helmet>
  );
}

import { Outlet } from 'react-router-dom';
import { RouteRecord } from 'vite-react-ssg';

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <WhatsAppFAB />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <GlobalSchemas />
      <Outlet />
    </HelmetProvider>
  );
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'admin/login',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading admin panel...</div>}>
            <AdminLogin />
          </Suspense>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading admin panel...</div>}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'about', element: <About /> },
          { path: 'products', element: <Products /> },
          { path: 'products/:slug', element: <ProductDetail /> },
          { path: 'services', element: <Services /> },
          { path: 'gallery', element: <Gallery /> },
          { path: 'contact', element: <Contact /> },
          { path: 'privacy', element: <Privacy /> },
          { path: 'terms', element: <Terms /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
];