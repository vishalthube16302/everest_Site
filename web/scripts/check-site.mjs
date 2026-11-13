// Final scan of the built site (web/out). Run after `npm run build`:  node scripts/check-site.mjs
// Checks: banned words and brands, price signs, unique titles and descriptions, canonicals,
// robots/noindex state, redirect targets, and old URLs. Exit code 1 if anything fails.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out/", import.meta.url));
const banned = [
  /chakan/i, /godrej/i, /nilkamal/i, /\belgi\b/i, /ingersoll/i, /compair/i, /staxx/i,
  /free (pan[- ]india )?(delivery|installation)/i, /pan[- ]india/i, /\b50\+ products/i, /\biso ?\d{4}/i,
  /₹|\brs\.? ?\d|\binr ?\d|\bprice range\b/i,
];
const problems = [];
const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) { if (!p.endsWith("admin") && n !== "scroll") walk(p); }
    else files.push(p);
  }
})(out);

const pages = files.filter((f) => f.endsWith(".html") && !/404|_not-found/.test(f));
const titles = new Map(), descs = new Map(), canons = new Map();
for (const f of files.filter((f) => /\.(html|txt|xml|json)$/.test(f))) {
  const text = readFileSync(f, "utf8");
  const rel = relative(out, f).split("\\").join("/");
  for (const re of banned) if (re.test(text) && !/^_next\//.test(rel)) problems.push(`${rel}: matches ${re}`);
}
// In a host build, EXPECT_INDEXABLE is not set, so the build's own SITE_INDEXABLE decides.
const expectIndexable = (process.env.EXPECT_INDEXABLE ?? process.env.SITE_INDEXABLE) === "true";
const pageExists = (path) => path === "/" || existsSync(join(out, path + ".html"));
for (const f of pages) {
  const html = readFileSync(f, "utf8");
  const rel = relative(out, f).split("\\").join("/");
  if (rel.startsWith("admin")) continue;
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  // Hindi and Marathi drafts stay noindex and out of the sitemap until checked (web/src/lib/lang-pages.ts).
  if (/^(hi|mr)(\/|\.html$)/.test(rel) && noindex) continue;
  if (title && [...title].length > 70) problems.push(`${rel}: title is ${[...title].length} characters (Bing flags over 70)`);
  if (!title) problems.push(`${rel}: no title`); else titles.set(title, [...(titles.get(title) ?? []), rel]);
  if (!desc) problems.push(`${rel}: no description`); else descs.set(desc, [...(descs.get(desc) ?? []), rel]);
  if (!canon) problems.push(`${rel}: no canonical`);
  else {
    // One page, one address: https, no www, no slash, no query, and it points at the page itself.
    const own = "/" + rel.replace(/\.html$/, "").replace(/^index$/, "");
    const u = new URL(canon);
    if (u.protocol !== "https:" || u.hostname.startsWith("www.")) problems.push(`${rel}: canonical host is ${u.origin}`);
    if (u.search || u.hash) problems.push(`${rel}: canonical has a query or hash`);
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) problems.push(`${rel}: canonical ends with a slash`);
    if (u.pathname !== own) problems.push(`${rel}: canonical points to ${u.pathname}, not itself`);
    canons.set(canon, [...(canons.get(canon) ?? []), rel]);
  }
  // Internal links: no slash at the end, no query string, no capitals, and the page must exist.
  for (const m of html.matchAll(/<a [^>]*href="(\/[^"#]*)"/g)) {
    const href = m[1];
    if (/^\/(_next|img|films)\//.test(href) || href === "/llms.txt") continue;
    if (href.length > 1 && href.endsWith("/")) problems.push(`${rel}: link with trailing slash ${href}`);
    if (href.includes("?")) problems.push(`${rel}: link with query string ${href}`);
    if (/[A-Z]/.test(href)) problems.push(`${rel}: link with capitals ${href}`);
    if (!/^\/admin/.test(href) && !pageExists(href.split("?")[0])) problems.push(`${rel}: link to missing page ${href}`);
  }
  // Thin pages do not get indexed (Phase 6). Products, categories, services and guides need real text.
  if (/^(products|categories|services|guides)\//.test(rel)) {
    const words = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    if (words < 300) problems.push(`${rel}: thin page, ${words} words`);
  }
  if (desc && desc.length < 70) problems.push(`${rel}: description is only ${desc.length} characters`);
  if (desc && desc.length > 170) problems.push(`${rel}: description is ${desc.length} characters`);
  if (expectIndexable && noindex) problems.push(`${rel}: noindex while indexable`);
  if (!expectIndexable && !noindex) problems.push(`${rel}: missing noindex while blocked`);
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(block[1].replace(/\u003c/g, "<")); } catch { problems.push(`${rel}: bad JSON-LD`); }
    if (/"offers"|"price"/.test(block[1])) problems.push(`${rel}: price in JSON-LD`);
  }
}
for (const [k, v] of canons) if (v.length > 1) problems.push(`same canonical on ${v.join(", ")}: ${k}`);
for (const [k, v] of titles) if (v.length > 1) problems.push(`same title on ${v.join(", ")}: ${k}`);
for (const [k, v] of descs) if (v.length > 1) problems.push(`same description on ${v.slice(0, 4).join(", ")}${v.length > 4 ? ` (+${v.length - 4})` : ""}`);

const robots = readFileSync(join(out, "robots.txt"), "utf8");
if (!expectIndexable && !/Disallow: \/\s/.test(robots + "\n")) problems.push("robots.txt does not block everything");
if (expectIndexable && /Disallow: \/\s/.test(robots + "\n") && !/Disallow: \/admin/.test(robots)) problems.push("robots.txt still blocks everything");
const sitemapList = [...readFileSync(join(out, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
const sitemapUrls = sitemapList.length;
// The sitemap and the canonicals must be the same list: no page missing, no extra or duplicate address.
if (new Set(sitemapList).size !== sitemapList.length) problems.push("sitemap repeats an address");
if (expectIndexable) {
  for (const c of canons.keys()) if (!sitemapList.includes(c)) problems.push(`not in sitemap: ${c}`);
  for (const c of sitemapList) if (!canons.has(c)) problems.push(`sitemap address has no page: ${c}`);
}
if (expectIndexable !== sitemapUrls > 0) problems.push(`sitemap has ${sitemapUrls} urls, unexpected`);

// Redirect targets must exist as built pages.
const exists = (path) => pageExists(path) || existsSync(join(out, path));
for (const line of readFileSync(join(out, "_redirects"), "utf8").split("\n")) {
  const m = line.trim().match(/^(\/\S+)\s+(\/\S+)\s+301$/);
  if (m && m[2] !== "/:splat" && !exists(m[2]) && !(m[2] === "/admin" && existsSync(join(out, "admin.html")))) problems.push(`redirect target missing: ${m[2]}`);
}
// A redirect must never start from a page that exists, and pages.dev copies must be noindex.
for (const line of readFileSync(join(out, "_redirects"), "utf8").split(/\r?\n/)) {
  const m = line.trim().match(/^(\/\S*)\s+\/\S*\s+301$/);
  if (m && m[1] !== "/" && pageExists(m[1].replace(/\/$/, ""))) problems.push(`redirect starts from a live page: ${m[1]}`);
}
if (!/pages\.dev\/\*\s+X-Robots-Tag: noindex/.test(readFileSync(join(out, "_headers"), "utf8"))) problems.push("_headers: pages.dev is not set to noindex");
console.log(`${pages.length} pages scanned, ${sitemapUrls} sitemap urls.`);
if (problems.length) { console.log("PROBLEMS:\n" + problems.join("\n")); process.exit(1); }
console.log("All checks passed.");
