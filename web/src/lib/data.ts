import { filmUrl, nav, ratings, site } from "./site";

// Build-time reads from Everest V2. A failed read stops the build, so an empty site is never published.
// Product description fields are left out on purpose: they hold claims not in docs/content/verified-facts.md.

export type SpecRow = { label: string; value: string };

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  image_url: string | null;
  specifications: unknown;
  sort_order: number;
  updated_at: string;
  // Optional, set in the admin panel (Google and AI search). Empty means automatic.
  seo_title: string | null;
  seo_description: string | null;
  faq: { q: string; a: string }[] | null;
};

export type ProductImage = { product_id: string; image_url: string; alt_text: string | null; sort_order: number };

export type Film = {
  category_id: string | null;
  product_id: string | null;
  video_url: string;
  video_url_small: string | null;
  poster_url: string | null;
  alt_text: string | null;
};

export type Review = {
  id: string;
  author_name: string;
  author_company: string | null;
  content: string;
  source: string;
  source_url: string | null;
  product_mentioned: string | null;
};

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase settings are missing. See web/.env.example.");
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Supabase read failed for ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

// One read per build. In local dev every page view reads again, so admin saves show on refresh.
function once<T>(load: () => Promise<T>) {
  let value: Promise<T> | undefined;
  return () => (process.env.NODE_ENV === "production" ? (value ??= load()) : load());
}

export const getCategories = once(() =>
  rest<Category[]>(
    "categories?select=id,name,slug,image_url,sort_order,updated_at&is_active=eq.true&order=sort_order",
  ),
);

export const getProducts = once(async () => {
  const rows = await rest<Product[]>(
    "products?select=id,name,slug,category_id,image_url,specifications,sort_order,updated_at,seo_title,seo_description,faq&is_active=eq.true&order=sort_order",
  );
  return rows.map((p) => ({ ...p, name: tidy(p.name) }));
});

export const getProductImages = once(() =>
  rest<ProductImage[]>("product_images?select=product_id,image_url,alt_text,sort_order&order=sort_order"),
);

export const getFilms = once(async () => {
  const rows = await rest<Film[]>("product_media?select=category_id,product_id,video_url,video_url_small,poster_url,alt_text");
  return rows.map((f) => ({
    ...f,
    video_url: filmUrl(f.video_url),
    video_url_small: f.video_url_small && filmUrl(f.video_url_small),
    poster_url: f.poster_url && filmUrl(f.poster_url),
  }));
});


// Rows without a source are the 4 old testimonials, which must stay unused.
export const getReviews = once(() =>
  rest<Review[]>(
    "testimonials?select=id,author_name,author_company,content,source,source_url,product_mentioned&is_active=eq.true&source=not.is.null&order=sort_order",
  ),
);

// Returns only prices allowed by both switches.
const getPriceRows = once(() =>
  rest<{ product_id: string; price_display: string }[]>("rpc/public_prices", { method: "POST", body: "{}" }),
);

export async function getPrice(productId: string) {
  const rows = await getPriceRows();
  return rows.find((r) => r.product_id === productId)?.price_display ?? null;
}

// Every category that has at least one product, with its products.
export async function getCategoriesWithProducts() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return categories
    .map((category) => ({ ...category, products: products.filter((p) => p.category_id === category.id) }))
    .filter((category) => category.products.length > 0);
}

// The category tiles on home and /products. Categories are set in the admin panel.
export type CategoryTile = { name: string; href: string; image: string | null; count: number };

export async function getCategoryTiles(): Promise<CategoryTile[]> {
  const categories = await getCategoriesWithProducts();
  return categories.map((c) => ({
    name: c.name,
    href: `/categories/${c.slug}`,
    image: c.image_url ?? c.products[0]?.image_url ?? null,
    count: c.products.length,
  }));
}

// Company details and menu, edited in the admin panel. Code values are the fallback.
type SettingsRow = {
  company_name: string | null;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp: string | null;
  working_hours: string | null;
  gst_number: string | null;
  established_year: number | null;
  google_rating: string | null;
  google_reviews: string | null;
  indiamart_rating: string | null;
  indiamart_reviews: string | null;
};

export type SiteInfo = typeof site & {
  ratings: { google: { score: string; count: string }; indiamart: { score: string; count: string } };
  nav: { href: string; label: string }[];
};

export const getSite = once(async (): Promise<SiteInfo> => {
  const [rows, pages] = await Promise.all([
    rest<SettingsRow[]>(
      "site_settings?select=company_name,tagline,phone,email,address,whatsapp,working_hours,gst_number,established_year,google_rating,google_reviews,indiamart_rating,indiamart_reviews&limit=1",
    ),
    rest<{ label: string; path: string }[]>("pages?select=label,path&is_enabled=eq.true&path=neq./&order=sort_order"),
  ]);
  const s = rows[0] ?? ({} as Partial<SettingsRow>);
  const phone = s.phone?.trim() || site.phoneDisplay;
  const digits = (text: string) => text.replace(/\D/g, "");
  return {
    ...site,
    name: s.company_name?.trim() || site.name,
    tagline: s.tagline?.trim() || site.tagline,
    phoneDisplay: phone,
    phoneHref: `tel:+${digits(phone)}`,
    whatsappNumber: digits(s.whatsapp ?? "") || site.whatsappNumber,
    email: s.email?.trim() || site.email,
    address: s.address?.trim() || site.address,
    gstin: s.gst_number?.trim() || site.gstin,
    hours: s.working_hours?.trim() || site.hours,
    established: s.established_year || site.established,
    ratings: {
      google: { score: s.google_rating || ratings.google.score, count: s.google_reviews || ratings.google.count },
      indiamart: { score: s.indiamart_rating || ratings.indiamart.score, count: s.indiamart_reviews || ratings.indiamart.count },
    },
    nav: pages.length ? pages.map((p) => ({ href: p.path, label: p.label })) : nav,
  };
});

// Extra photos added in the admin panel (Gallery page).
export const getGalleryImages = once(() =>
  rest<{ id: string; title: string | null; image_url: string; link_url: string | null }[]>(
    "gallery_images?select=id,title,image_url,link_url&image_url=not.is.null&order=sort_order",
  ),
);

// Public URL of a photo in the Product Images bucket.
export function storageUrl(file: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Product%20Images/${file}`;
}

export function tidy(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function specRows(product: Product): SpecRow[] {
  if (!Array.isArray(product.specifications)) return [];
  return product.specifications
    .filter((row): row is [unknown, unknown] => Array.isArray(row) && row.length >= 2)
    .map(([label, value]) => ({ label: tidy(String(label).replace(/"/g, "")), value: tidy(String(value)) }))
    .filter((row) => row.label && row.value);
}

const keyOrder = [/capacity|tank/i, /air ?flow|lpm|fad|displacement/i, /pressure/i, /noise/i, /power|hp|motor/i, /lift|fork/i];

export function keySpecs(product: Product, count = 4) {
  const rows = specRows(product);
  const picked: SpecRow[] = [];
  for (const pattern of keyOrder) {
    const row = rows.find((r) => pattern.test(r.label) && !picked.includes(r));
    if (row) picked.push(row);
  }
  for (const row of rows) if (!picked.includes(row)) picked.push(row);
  return picked.slice(0, count);
}
