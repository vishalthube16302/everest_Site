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
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

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

      {/* Primary SEO */}
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index,follow,max-image-preview:large"
      />

      <meta
        name="author"
        content="Everest Hydro Pneumatic Solutions"
      />

      <meta
        name="theme-color"
        content="#D32F2F"
      />

      <link
        rel="canonical"
        href={fullCanonical}
      />

      {/* Open Graph */}

      <meta
        property="og:type"
        content={ogType}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={fullCanonical}
      />

      <meta
        property="og:image"
        content={resolvedOgImage}
      />

      <meta
        property="og:image:width"
        content="1200"
      />

      <meta
        property="og:image:height"
        content="630"
      />

      <meta
        property="og:image:alt"
        content="Everest Hydro Pneumatic Solutions"
      />

      <meta
        property="og:site_name"
        content="Everest Hydro Pneumatic Solutions"
      />

      <meta
        property="og:locale"
        content="en_IN"
      />

      {/* Twitter */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={resolvedOgImage}
      />

      {/* Structured Data */}

      {schemas?.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </script>
      ))}

    </Helmet>
  );
}