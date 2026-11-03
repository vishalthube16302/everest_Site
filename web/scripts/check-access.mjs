// Quick access checks on the built site (web/out). Run after `npm run build`:  node scripts/check-access.mjs
// Automated part only. A real screen reader and keyboard pass is still a manual step.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out/", import.meta.url));
const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
})(out);

const problems = [];
const tel = new Set(), wa = new Set();
let pages = 0, imgNoAlt = 0, skipLinks = 0;
for (const f of files.filter((f) => f.endsWith(".html"))) {
  const rel = f.slice(out.length).split(sep).join("/");
  if (rel.startsWith("admin") || /404|_not-found/.test(rel)) continue;
  const html = readFileSync(f, "utf8");
  pages++;
  const h1 = (html.match(/<h1[ >]/g) || []).length;
  if (h1 !== 1) problems.push(`${rel}: ${h1} h1 headings`);
  if (!html.includes('lang="en"')) problems.push(`${rel}: no lang`);
  for (const m of html.matchAll(/href="(tel:[^"]*)"/g)) tel.add(m[1]);
  for (const m of html.matchAll(/href="(https:\/\/wa\.me\/[^"?]*)/g)) wa.add(m[1]);
  imgNoAlt += (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (/href="#main"|href="#content"/.test(html)) skipLinks++;
}
const css = files.filter((f) => f.endsWith(".css")).map((f) => readFileSync(f, "utf8")).join("");
console.log(`${pages} pages`);
console.log("tel links:", [...tel].join(", "));
console.log("wa.me links:", [...wa].join(", "));
console.log("img without alt attribute:", imgNoAlt, "| pages with skip link:", skipLinks);
console.log("focus-visible rules:", css.split("focus-visible").length - 1, "| reduced-motion rules:", css.split("prefers-reduced-motion").length - 1);
if (imgNoAlt) problems.push(`${imgNoAlt} images have no alt attribute`);
if (!skipLinks) problems.push("no skip link found");
if (problems.length) { console.log("PROBLEMS:\n" + problems.join("\n")); process.exit(1); }
console.log("Access checks passed.");
