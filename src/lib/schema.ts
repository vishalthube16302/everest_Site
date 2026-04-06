/**
 * schema.ts — JSON-LD Schema builders
 * ──────────────────────────────────────────────────────────────
 * Pure functions (no React dependency) that build schema.org
 * JSON-LD objects from data. This keeps components clean and
 * makes the schemas trivially testable.
 *
 * US-005 — LocalBusiness schema with real data from site_settings
 * ──────────────────────────────────────────────────────────────
 */

import type { SiteSettings } from '../types';

const BASE_URL = 'https://everesthps.com';

/**
 * Build LocalBusiness schema from site_settings data.
 * Includes: geo coords, openingHours, sameAs, taxID.
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
      'Manufacturer & supplier of industrial air compressors and material handling equipment based in Chakan, Pune, Maharashtra. Serving manufacturing, automotive, dental, construction, and packaging industries across India since 2020.',
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
 * US-004 — Product schema (with AggregateOffer from price_range)
 * ────────────────────────────────────────────────────────────── */

interface ProductSchemaInput {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  price_range: string;
  categoryName?: string;
}

/**
 * Parse a price_range string like "₹45,000 - ₹1,20,000" or "₹12,500"
 * into { low, high } numbers. Returns null if unparsable (e.g. "Price on Request").
 */
function parsePriceRange(raw: string): { low: number; high: number } | null {
  if (!raw) return null;
  // Strip currency symbols & commas, extract all numbers
  const nums = raw.replace(/[₹,]/g, '').match(/[\d]+/g);
  if (!nums || nums.length === 0) return null;
  const parsed = nums.map(Number).filter((n) => !isNaN(n) && n > 0);
  if (parsed.length === 0) return null;
  return {
    low: Math.min(...parsed),
    high: Math.max(...parsed),
  };
}

export function buildProductSchema(p: ProductSchemaInput): Record<string, unknown> {
  const url = `${BASE_URL}/products/${p.slug}`;
  const prices = parsePriceRange(p.price_range);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description || `${p.name} — industrial equipment by Everest HPS, Pune.`,
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

  // Only add offers if we successfully parsed numeric prices
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
