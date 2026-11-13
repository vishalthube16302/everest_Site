import type { Metadata } from "next";
import type { Product, SiteInfo } from "./data";
import { keySpecs, specRows } from "./data";

// Address of the public site. Canonical links, the sitemap and structured data use it.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://everesthps.com").replace(/\/+$/, "");

// False until launch: every page is noindex and robots.txt blocks all crawlers.
export const indexable = process.env.SITE_INDEXABLE === "true";

// Full address of a page. No trailing slash anywhere, home included: Next prints the home canonical as "https://host",
// so the sitemap, structured data and llms.txt print it the same way. One page, one string.
export const abs = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;

// Share picture for pages without their own photo. Made by tools/images/og_image.py.
const shareImage = { url: abs("/img/og-default.jpg"), width: 1200, height: 630, alt: "Everest air compressors, pallet trucks and stackers" };

// Title, description and canonical for one page. Wording must stay inside docs/content/verified-facts.md.
export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string | null }): Metadata {
  const images = image ? [{ url: image }] : [shareImage];
  return {
    title,
    description,
    alternates: { canonical: abs(path) },
    openGraph: {
      title,
      description,
      url: abs(path),
      siteName: "Everest Hydro Pneumatic Solutions",
      type: "website",
      locale: "en_IN",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}

// Google Business Profile (place id from Google Maps, owner's account, 2026-11-13) and its map pin.
export const mapsUrl = "https://maps.google.com/?cid=14653580160157998466";
const geo = { "@type": "GeoCoordinates", latitude: 18.6641151, longitude: 73.7935742 };

// The company's own profiles elsewhere (owner, 2026-11-13). Shown in the footer and sent as schema sameAs.
export const profiles = [
  { label: "Google", url: mapsUrl },
  { label: "IndiaMART", url: "https://www.indiamart.com/everesthydro-pneumatic-solution/" },
  { label: "Justdial", url: "https://www.justdial.com/Pune/Everest-Hydro-Pneumatic-Solutions-Thermax-Chauk-Chinchwad-East/020PXX20-XX20-200926192007-Z4N3_BZDET" },
  { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61593183570687" },
  { label: "Instagram", url: "https://www.instagram.com/everestaircompressor/" },
];
export const sameAs = [...profiles.map((p) => p.url), "https://www.everesthps.in/"];

const trim = (text: string, max = 158) => (text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`);

// Product description built from the product's own specs. It never mentions price.
export function productDescription(product: Product) {
  const specs = keySpecs(product, 3).map((r) => `${r.label}: ${r.value}`).join("; ");
  return trim(`${product.name} from Everest, Pimpri-Chinchwad.${specs ? ` ${specs}.` : ""} Get a quote.`);
}

// ---- Structured data (schema.org) ----

export type JsonLdNode = Record<string, unknown>;

function addressNode(address: string): JsonLdNode {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1] ?? "";
  const m = last.match(/^(.*?)\s*(\d{6})$/);
  if (parts.length < 3 || !m) return { "@type": "PostalAddress", streetAddress: address, addressCountry: "IN" };
  return {
    "@type": "PostalAddress",
    streetAddress: parts.slice(0, -2).join(", "),
    addressLocality: parts[parts.length - 2],
    addressRegion: m[1],
    postalCode: m[2],
    addressCountry: "IN",
  };
}

// "Mon to Sat, 9:00 AM to 7:30 PM" becomes one opening-hours rule. Anything else is left out.
function hoursNode(hours: string): JsonLdNode[] {
  const t = hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*to\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!t || !/mon\w*\s*to\s*sat/i.test(hours)) return [];
  const clock = (h: string, m: string, ap: string) => {
    const hh = (Number(h) % 12) + (ap.toUpperCase() === "PM" ? 12 : 0);
    return `${String(hh).padStart(2, "0")}:${m}`;
  };
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: clock(t[1], t[2], t[3]),
      closes: clock(t[4], t[5], t[6]),
    },
  ];
}

// Company, plus local business. No ratings, prices or claims beyond the approved list.
export function companyJsonLd(site: SiteInfo): JsonLdNode[] {
  const phone = site.phoneHref.replace("tel:", "");
  const logo = abs("/img/logo-red.png");
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: site.name,
      url: siteUrl,
      logo,
      email: site.email,
      telephone: phone,
      foundingDate: String(site.established),
      taxID: site.gstin,
      sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: site.name,
      url: siteUrl,
      image: logo,
      telephone: phone,
      email: site.email,
      address: addressNode(site.address),
      geo,
      hasMap: mapsUrl,
      sameAs,
      openingHoursSpecification: hoursNode(site.hours),
      parentOrganization: { "@id": `${siteUrl}/#organization` },
    },
  ];
}

// One service we offer, given by our local business, in the areas on our Google profile.
// The business is written out in full: the home page node is not on this page.
export function serviceJsonLd(s: { name: string; serviceType: string; description: string; path: string }, areas: string[], site: SiteInfo): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.serviceType,
    description: s.description,
    url: abs(s.path),
    provider: {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: site.name,
      url: siteUrl,
      telephone: site.phoneHref.replace("tel:", ""),
      address: addressNode(site.address),
      hasMap: mapsUrl,
    },
    areaServed: areas.map((name) => ({ "@type": "City", name })),
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.path) })),
  };
}

// No "offers": prices stay hidden.
export function productJsonLd(product: Product, categoryName: string | undefined, images: string[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: abs(`/products/${product.slug}`),
    description: productDescription(product),
    ...(images.length ? { image: images } : {}),
    ...(categoryName ? { category: categoryName } : {}),
    brand: { "@type": "Brand", name: "Everest" },
    manufacturer: { "@id": `${siteUrl}/#organization` },
    additionalProperty: specRows(product).map((r) => ({ "@type": "PropertyValue", name: r.label, value: r.value })),
  };
}
