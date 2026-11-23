import type { Product, SiteInfo } from "./data";
import { specRows } from "./data";

// The share message for one product. Used by the Share button for WhatsApp, email, and the phone's native share sheet.
export type ShareContent = {
  title: string;
  url: string;
  image: string | null; // the one picture sent with the message
  whatsapp: string; // WhatsApp text
  emailSubject: string;
  emailBody: string;
};

export function shareContent(
  product: Product,
  url: string,
  image: string | null,
  site: SiteInfo,
  price?: string | null,
): ShareContent {
  const allSpecs = specRows(product);

  // Extract model number if present in specifications
  const modelRow = allSpecs.find((s) => /^models?(\s*no\.?)?$/i.test(s.label));
  const modelNo = modelRow?.value;

  // Extract warranty if present in specifications
  const warrantyRow = allSpecs.find((s) => /warranty/i.test(s.label));
  const warrantyText = warrantyRow
    ? (warrantyRow.value.toLowerCase().includes("electrical")
        ? `Eligible for ${warrantyRow.value} warranty against manufacturing defects based on end user purchase date`
        : "Eligible for one year warranty against manufacturing defects based on end user purchase date")
    : "Eligible for one year warranty against manufacturing defects based on end user purchase date";

  // Remaining specs excluding model and warranty so they don't repeat
  const specs = allSpecs.filter((s) => s !== modelRow && s !== warrantyRow);

  const priceLine = price
    ? `Price:- ${price}+18% GST Extra+ Transport Extra At Actual at Customer scope`
    : "Price:- Price on request + 18% GST Extra+ Transport Extra At Actual at Customer scope";
  const deliveryTerm = "Delivery Term :- Ex-works -Chakan Pune";
  const paymentTerm = "Payment Term:- 100% Before Dispatch.(Advance 50% for order confirmation)";
  const warrantyLine = `Products Warranty: ${warrantyText}`;

  const specLines = specs.map((s) => {
    const label = s.label.replace(/[:\-]+$/, "").trim();
    return `${label}: ${s.value}`;
  });

  // WhatsApp message: *stars* make bold there. Labels are bold so the message is easy to scan.
  const waSpecLines = specs.map((s) => `• *${s.label.replace(/[:\-]+$/, "").trim()}:* ${s.value}`);
  const waPrice = price
    ? `${price} + 18% GST extra, transport extra at actual (customer scope)`
    : "On request + 18% GST extra, transport extra at actual (customer scope)";

  const whatsapp = [
    ...(modelNo ? [`*Model No:* ${modelNo}`] : []),
    `*${product.name}*`,
    "",
    ...(waSpecLines.length ? ["*Specifications*", ...waSpecLines, ""] : []),
    "*Commercial Terms*",
    `• *Price:* ${waPrice}`,
    "• *Delivery:* Ex-works Chakan, Pune",
    "• *Payment:* 100% before dispatch (50% advance for order confirmation)",
    `• *Warranty:* ${warrantyText.replace(/^Eligible for /, "").replace(/^./, (c) => c.toUpperCase())}`,
    "",
    "*Check it out:*",
    url,
  ].join("\n");

  const emailSubject = modelNo
    ? `${modelNo} - ${product.name} | Everest`
    : `${product.name} | Everest`;

  const emailBody = [
    "Hello,",
    "",
    `Here is the quotation and specifications from ${site.name}:`,
    "",
    ...(modelNo ? [`Model No:- ${modelNo}`] : []),
    `Product Name:- ${product.name}`,
    "",
    ...specLines,
    ...(specLines.length ? [""] : []),
    priceLine,
    deliveryTerm,
    paymentTerm,
    warrantyLine,
    "",
    `Product page: ${url}`,
    ...(image ? [`Photo: ${image}`] : []),
    "",
    site.name,
    site.address,
    `Phone and WhatsApp: ${site.phoneDisplay}`,
    `Email: ${site.email}`,
    site.hours,
  ].join("\n");

  return { title: product.name, url, image, whatsapp, emailSubject, emailBody };
}
