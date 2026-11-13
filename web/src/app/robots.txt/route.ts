import { abs, indexable } from "@/lib/seo";

export const dynamic = "force-static";

// Blocks everything until SITE_INDEXABLE=true is set at launch.
// Content-Signal (contentsignals.org) tells AI crawlers what they may do with our pages. We want to be found
// and quoted by search and AI chat, so all three are "yes".
export async function GET() {
  const text = indexable
    ? [
        "User-Agent: *",
        "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
        "Allow: /",
        "Disallow: /admin/",
        "",
        `Sitemap: ${abs("/sitemap.xml")}`,
        "",
      ].join("\n")
    : "User-Agent: *\nDisallow: /\n";
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
