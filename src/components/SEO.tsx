/**
 * SEO.tsx — Global SEO head-tag manager
 * ──────────────────────────────────────────────────────────────
 * Renders <title>, <meta description>, <link canonical>,
 * Open Graph, and Twitter Card tags via react-helmet-async.
 *
 * US-002 (dynamic meta per page)
 * US-003 (canonical per page)
 * US-009 (OG defaults for every page)
 * ──────────────────────────────────────────────────────────────
 */
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  /** Page title — renders in <title> and og:title */
  title: string;
  /** Meta description — 150-160 chars recommended */
  description: string;
  /** Path portion for canonical, e.g. "/products" or "/products/slug" */
  canonical?: string;
  /** Full URL to primary OG image */
  ogImage?: string;
  /** og:type — defaults to "website" */
  ogType?: string;
  /** Additional JSON-LD schema objects to inject as <script type="application/ld+json"> */
  schemas?: Record<string, unknown>[];
}

const BASE_URL = 'https://everesthps.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/favicon.svg`;

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  schemas,
}: SEOProps) {
  const fullCanonical = canonical
    ? `${BASE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : BASE_URL;

  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:site_name" content="Everest Hydro Pneumatic Solutions" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {/* JSON-LD Schemas */}
      {schemas?.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
