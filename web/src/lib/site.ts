// Fallback company facts. The site reads the live values from site_settings (admin panel),
// see getSite() in data.ts. Source of truth for wording: docs/content/verified-facts.md.
export const site = {
  name: "Everest Hydro Pneumatic Solutions",
  tagline: "Engineering Power. Delivering Trust.",
  phoneDisplay: "+91 88558 20105",
  phoneHref: "tel:+918855820105",
  whatsappNumber: "918855820105",
  email: "everesthps@gmail.com",
  address:
    "PAP G-64, Ajantha Nagar, Kasturi Market, Chikhali Akurdi Rd, Thermax Chauk, Pimpri-Chinchwad, Maharashtra 411019",
  gstin: "27ATEPT3692E1ZD",
  hours: "Mon to Sat, 9:00 AM to 7:30 PM",
  established: 2020,
};

// Ratings change. Refresh before launch, see docs/content/reviews.md.
export const ratings = {
  google: { score: "5.0", count: "39" },
  indiamart: { score: "4.9", count: "41" },
};

export const nav = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/dealers", label: "Dealers" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function whatsappLink(number: string, productName?: string) {
  const text = productName
    ? `Hello Everest, I would like a quote for ${productName}.`
    : "Hello Everest, I would like a quote.";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// Films and scroll frames are read from one web address. Set NEXT_PUBLIC_FILMS_BASE_URL to move them
// outside the repo (for example a Cloudflare R2 address). Empty means this site's own /films folder.
export function filmUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_FILMS_BASE_URL ?? "").trim().replace(/\/+$/, "");
  return base && path.startsWith("/") ? `${base}${path}` : path;
}
