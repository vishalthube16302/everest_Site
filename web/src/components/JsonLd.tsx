import type { JsonLdNode } from "@/lib/seo";

// Structured data for search engines. "<" is escaped so page text can never close the script tag.
export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
