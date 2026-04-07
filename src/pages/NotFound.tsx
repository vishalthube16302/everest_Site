import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home } from 'lucide-react';
import { SEO } from '../components/SEO';

/**
 * NotFound — 404 page
 *
 * SEO fixes applied (Sprint 2):
 *
 * 1. canonical="/404" removed.
 *    A canonical tag declares "this is the preferred URL for this content."
 *    404 pages have NO content, so a canonical is meaningless and confusing.
 *    Google would attempt to index /404 as a real page with real content.
 *
 * 2. noindex added via a direct <Helmet> call.
 *    This explicitly instructs all crawlers not to index this page.
 *    Using a direct Helmet (rather than the SEO component) keeps the SEO
 *    component's interface clean while correctly handling this edge case.
 *
 * 3. The SEO component retains title + description for in-browser display
 *    (browser tab title, history, etc.) but without canonical or OG tags.
 */
export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">

      {/* Explicit noindex — must NOT be indexed or cached by search engines */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Title + description for browser display only — no canonical, no OG */}
      <SEO
        title="404 - Page Not Found | Everest HPS"
        description="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
      />

      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-[#0f3460]">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#e53238] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}