// Builds public/_redirects from redirects.txt. Runs before every build (see "prebuild" in package.json).
// Stops the build on: a missing slash rule, chains (a target that is itself redirected), loops, repeats.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const src = readFileSync(fileURLToPath(new URL("../redirects.txt", import.meta.url)), "utf8");
const rules = [];
for (const raw of src.split("\n")) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const [from, to, ...rest] = line.split(/\s+/);
  if (!from?.startsWith("/") || !to?.startsWith("/") || rest.length) throw new Error(`Bad redirect line: ${line}`);
  if ((from.length > 1 && from.endsWith("/")) || (to.length > 1 && to.endsWith("/"))) throw new Error(`No trailing slash allowed: ${line}`);
  rules.push({ from, to });
}

const sources = new Set();
for (const { from, to } of rules) {
  if (from === to) throw new Error(`Redirect loop: ${from}`);
  if (sources.has(from)) throw new Error(`Repeated source: ${from}`);
  sources.add(from);
}
for (const { from, to } of rules) {
  if (sources.has(to)) throw new Error(`Chain: ${from} goes to ${to}, which is also redirected`);
}

const lines = [
  "# Generated from redirects.txt by scripts/build-redirects.mjs. Do not edit by hand.",
  "# Every rule has a with-slash twin, so the old slash form reaches the new address in one hop.",
];
for (const { from, to } of rules) {
  lines.push(`${from} ${to} 301`);
  lines.push(`${from}/ ${to} 301`);
}
// Any other address ending in a slash goes to the same address without it. Keep this last.
lines.push("/*/ /:splat 301");
writeFileSync(fileURLToPath(new URL("../public/_redirects", import.meta.url)), lines.join("\n") + "\n");
console.log(`_redirects: ${rules.length} rules (+ slash twins).`);
