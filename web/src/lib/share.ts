import type { Product, SiteInfo } from "./data";
import { keySpecs } from "./data";

// The share message for one product. One template, used by the Share button for WhatsApp, email and the
// phone's own share sheet. Wording stays inside docs/content/verified-facts.md: specs come from the database,
// and there is never a price.
export type ShareContent = {
  title: string;
  url: string;
  image: string | null; // the one picture sent with the message
  whatsapp: string; // WhatsApp text; *stars* make bold there
  emailSubject: string;
  emailBody: string;
};

export function shareContent(product: Product, url: string, image: string | null, site: SiteInfo): ShareContent {
  const specs = keySpecs(product, 4).map((r) => `${r.label}: ${r.value}`);

  const whatsapp = [
    `*${product.name}*`,
    site.name,
    "",
    ...specs.map((s) => `• ${s}`),
    ...(specs.length ? [""] : []),
    "Price on request.",
    "Photos and full specifications:",
    url,
    "",
    `Call or WhatsApp: ${site.phoneDisplay}`,
  ].join("\n");

  const emailBody = [
    "Hello,",
    "",
    `Here is a product from ${site.name}:`,
    "",
    product.name,
    ...specs.map((s) => `- ${s}`),
    "",
    "Price on request.",
    `Product page: ${url}`,
    ...(image ? [`Photo: ${image}`] : []),
    "",
    site.name,
    site.address,
    `Phone and WhatsApp: ${site.phoneDisplay}`,
    `Email: ${site.email}`,
    site.hours,
  ].join("\n");

  return { title: product.name, url, image, whatsapp, emailSubject: `${product.name} | Everest`, emailBody };
}
