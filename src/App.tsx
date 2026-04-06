import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { supabase } from './lib/supabase';
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
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { WhatsAppFAB } from './components/WhatsAppFAB';
import type { SiteSettings } from './types';

/**
 * GlobalSchemas — loads site_settings once and injects
 * the LocalBusiness JSON-LD (US-005) into every page's <head>.
 * This renders during SSG/prerender because it uses Helmet.
 */
function GlobalSchemas() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  const localBusinessSchema = buildLocalBusinessSchema(settings);

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
}

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <WhatsAppFAB />
      <Footer />
    </div>
  );
}

export default function App() {
  // US-011: Lightning init removed from here — lazy-loaded only in Contact.tsx
  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* US-005: Global LocalBusiness JSON-LD injected on all pages */}
        <GlobalSchemas />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
