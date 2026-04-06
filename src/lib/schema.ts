/**
 * schema.ts — JSON-LD Schema builders
 * ──────────────────────────────────────────────────────────────
 * Pure functions (no React dependency) that build schema.org
 * JSON-LD objects from data. This keeps components clean and
 * makes the schemas trivially testable.
 *
 * US-005 — LocalBusiness schema with real data from site_settings
 * US-004 — Product schema: added sku + additionalProperty (Sprint 2 fix)
 * ORG   — Organisation schema for /about page (Sprint 2 addition)
 * ──────────────────────────────────────────────────────────────
 */

import type { SiteSettings } from '../types';

const BASE_URL = 'https://everesthps.com';

/**
 * Build LocalBusiness schema from site_settings data.
 * Includes: geo coords, openingHours, sameAs, taxID.
 *
 * All real business values are provided as fallbacks so that
 * buildLocalBusinessSchema(null) returns a fully-populated,
 * correct schema without requiring a Supabase fetch.
 * This is intentional: the schema is baked into the pre-rendered
 * HTML at build time (see App.tsx GlobalSchemas).
 */
export function buildLocalBusinessSchema(s: SiteSettings | null): Record<string, unknown> {
  const phone = s?.phone || '+91-8855820105';
  const email = s?.email || 'everesthps@gmail.com';
  const gst = s?.gst_number || '27ATEPT3692E1ZD';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'Everest Hydro Pneumatic Solutions',
    description:
      'Manufacturer & supplier of industrial air compressors and material handling equipment ' +
      'based in Chakan, Pune, Maharashtra. Serving manufacturing, automotive, dental, ' +
      'construction, and packaging industries across India since 2020.',
    url: BASE_URL,
    telephone: phone.replace(/\s/g, ''),
    email: email,
    image: `${BASE_URL}/favicon.svg`,
    priceRange: 'INR',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Bank Transfer, UPI',
    taxID: gst,
    foundingDate: '2020',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 11,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kalp Residency, 109 B Wing, Chakan Shikrapur Road',
      addressLocality: 'Chakan, Pune',
      addressRegion: 'Maharashtra',
      postalCode: '410501',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.7606,
      longitude: 73.8610,
    },
    areaServed: [
      { '@type': 'City', name: 'Pune' },
      { '@type': 'State', name: 'Maharashtra' },
      { '@type': 'Country', name: 'India' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '09:00',
      closes: '18:30',
    },
    sameAs: [
      'https://www.indiamart.com/everesthydro-pneumatic-solution',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone.replace(/\s/g, ''),
      contactType: 'sales',
      availableLanguage: ['English', 'Hindi', 'Marathi'],
    },
  };
}

/* ──────────────────────────────────────────────────────────────
 * Organisation schema — used on /about
 * Sprint 2 addition: gives Google the signals it needs to build
 * a knowledge panel for "Everest Hydro Pneumatic Solutions".
 * ────────────────────────────────────────────────────────────── */

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Everest Hydro Pneumatic Solutions',
    alternateName: 'Everest HPS',
    description:
      'Manufacturer and supplier of industrial air compressors, screw compressors, ' +
      'oil-free compressors and material handling equipment. ' +
      'Established 2020 in Chakan, Pune, Maharashtra, India. ' +
      'Serving manufacturing, automotive, dental, construction and packaging industries pan-India.',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/favicon.svg`,
    },
    foundingDate: '2020',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 11,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kalp Residency, 109 B Wing, Chakan Shikrapur Road',
      addressLocality: 'Chakan, Pune',
      addressRegion: 'Maharashtra',
      postalCode: '410501',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8855820105',
      email: 'everesthps@gmail.com',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Marathi'],
    },
    sameAs: [
      'https://www.indiamart.com/everesthydro-pneumatic-solution',
    ],
    areaServed: [
      { '@type': 'City', name: 'Pune' },
      { '@type': 'State', name: 'Maharashtra' },
      { '@type': 'Country', name: 'India' },
    ],
  };
}

/* ──────────────────────────────────────────────────────────────
 * US-004 — Product schema
 *
 * Sprint 2 additions:
 *   • sku      – unique product identifier (uses product slug)
 *   • additionalProperty – technical specifications mapped to
 *     schema.org/PropertyValue objects so Google can extract
 *     individual spec data for product knowledge panels.
 * ────────────────────────────────────────────────────────────── */

interface ProductSchemaInput {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  price_range: string;
  categoryName?: string;
  /** Accepts both the ordered-array format [[key,value],...] and the
   *  legacy object format {key: value, ...} stored in Supabase. */
  specifications?: [string, string][] | Record<string, unknown> | null;
}

/**
 * Parse a price_range string like "₹45,000 - ₹1,20,000" or "₹12,500"
 * into { low, high } numbers. Returns null if unparsable.
 */
function parsePriceRange(raw: string): { low: number; high: number } | null {
  if (!raw) return null;
  const nums = raw.replace(/[₹,]/g, '').match(/\d+/g);
  if (!nums || nums.length === 0) return null;
  const parsed = nums.map(Number).filter((n) => !isNaN(n) && n > 0);
  if (parsed.length === 0) return null;
  return { low: Math.min(...parsed), high: Math.max(...parsed) };
}

export function buildProductSchema(p: ProductSchemaInput): Record<string, unknown> {
  const url = `${BASE_URL}/products/${p.slug}`;
  const prices = parsePriceRange(p.price_range);

  /* ── Normalise specifications to [{name, value}] ── */
  let specEntries: [string, string][] = [];

  if (Array.isArray(p.specifications)) {
    // Ordered-array format: [["Motor Power", "3 HP"], ...]
    specEntries = (p.specifications as [string, string][]).filter(
      ([, v]) => String(v).trim() !== '' && String(v).trim() !== '0',
    );
  } else if (p.specifications && typeof p.specifications === 'object') {
    // Legacy object format: { motor_power: "3 HP", ... }
    specEntries = Object.entries(p.specifications as Record<string, string>)
      .filter(([, v]) => String(v).trim() !== '' && String(v).trim() !== '0')
      .map(([k, v]) => [
        k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        String(v).trim(),
      ] as [string, string]);
  }

  const additionalProperty = specEntries.map(([name, value]) => ({
    '@type': 'PropertyValue',
    name,
    value,
  }));

  /* ── Build schema object ── */
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.name,

    // sku: unique, stable identifier for this product — uses the URL slug.
    // Required for Google Merchant Centre eligibility and product rich results.
    sku: p.slug,

    description:
      p.description || `${p.name} — industrial equipment by Everest HPS, Pune.`,
    image: p.image_url || `${BASE_URL}/favicon.svg`,
    url,
    brand: {
      '@type': 'Brand',
      name: 'Everest Hydro Pneumatic Solutions',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Everest Hydro Pneumatic Solutions',
      url: BASE_URL,
    },
  };

  if (p.categoryName) {
    schema.category = p.categoryName;
  }

  // additionalProperty: maps each technical spec to a PropertyValue.
  // Google extracts these for product knowledge panels and comparison tables.
  if (additionalProperty.length > 0) {
    schema.additionalProperty = additionalProperty;
  }

  if (prices) {
    schema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: prices.low,
      highPrice: prices.high,
      offerCount: 1,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Everest Hydro Pneumatic Solutions',
      },
    };
  }

  return schema;
}

/* ──────────────────────────────────────────────────────────────
 * US-008 — BreadcrumbList schema
 * ────────────────────────────────────────────────────────────── */

interface BreadcrumbItem {
  name: string;
  /** Path portion, e.g. "/products" */
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

/* ──────────────────────────────────────────────────────────────
 * US-012 — FAQPage schema
 * ────────────────────────────────────────────────────────────── */

interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQSchema(faqs: FAQItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}