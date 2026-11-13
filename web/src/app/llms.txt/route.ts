import { getCategoriesWithProducts, getSite } from "@/lib/data";
import { abs, sameAs } from "@/lib/seo";
import { serviceAreas, servicePages } from "@/lib/service-pages";

export const dynamic = "force-static";

// Plain-text guide for AI crawlers. Built from the database at each build.
// Wording stays inside docs/content/verified-facts.md: no price, no free-delivery or free-installation claim.
export async function GET() {
  const [site, categories] = await Promise.all([getSite(), getCategoriesWithProducts()]);
  const total = categories.reduce((n, c) => n + c.products.length, 0);
  const lines = [
    `# ${site.name}`,
    "",
    `> Manufacturer, dealer and supplier of oil-free air compressors, screw compressors, reciprocating compressors, pallet trucks, stackers and lifting tables. Based in Pimpri-Chinchwad, Maharashtra, India. Established ${site.established}. We sell to dealers and end users. Prices are given on request.`,
    "",
    "## Contact",
    "",
    `- Address: ${site.address}`,
    `- Phone and WhatsApp: ${site.phoneDisplay}`,
    `- Email: ${site.email}`,
    `- Hours: ${site.hours}`,
    "- We reply to enquiries within 24 hours. Installation and nearby delivery are offered.",
    "",
    "## Key pages",
    "",
    `- [Full catalogue](${abs("/ai-discover")}): all ${total} products with specifications on one page`,
    `- [Products](${abs("/products")}): browse by category`,
    `- [Services](${abs("/services")}): sales, installation, on-site repair and servicing, spare parts, second-hand compressors, and large air compressors, hand pallet trucks and stackers on rent`,
    ...servicePages.map((s) => `- [${s.title}](${abs(`/services/${s.slug}`)}): ${s.answer.split(". ")[0]}.`),
    `- [Areas served](${abs("/services/areas-served")}): ${serviceAreas.join(", ")}, Maharashtra`,
    `- [Dealers](${abs("/dealers")}): trade supply`,
    `- [Reviews](${abs("/reviews")}): customer reviews from Google and IndiaMART`,
    `- [About](${abs("/about")}): the company`,
    `- [Contact](${abs("/contact")}): enquiry form, phone and WhatsApp`,
    "",
    "## Categories",
    "",
    ...categories.map((c) => `- [${c.name}](${abs(`/categories/${c.slug}`)}): ${c.products.length} ${c.products.length === 1 ? "model" : "models"}`),
    "",
    "## Other resources",
    "",
    `- [Sitemap](${abs("/sitemap.xml")})`,
    ...sameAs.map((url) => `- ${url}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
