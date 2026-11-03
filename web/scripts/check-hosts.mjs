// Tests that every address variant of the site reaches ONE address in ONE step.
// Usage:  node scripts/check-hosts.mjs https://everesthps.com
// Run it on the real host after connecting Cloudflare and again on launch day. It only sends GET requests.
// Expected: http, www, trailing-slash, query-string and old addresses all give one 301 to the clean address.
const base = new URL(process.argv[2] ?? "https://everesthps.com");
const apex = base.hostname.replace(/^www\./, "");
const clean = (path) => `https://${apex}${path}`;

// [what is tested, address requested, expected final address or null for "must be 200 itself"]
const cases = [
  ["http, no www", `http://${apex}/`, clean("/")],
  ["http, www", `http://www.${apex}/`, clean("/")],
  ["https, www", `https://www.${apex}/`, clean("/")],
  ["https, www, inner page", `https://www.${apex}/products`, clean("/products")],
  ["http, inner page", `http://${apex}/products`, clean("/products")],
  ["clean home", clean("/"), null],
  ["clean inner page", clean("/products"), null],
  ["trailing slash", clean("/products/"), clean("/products")],
  ["trailing slash, contact", clean("/contact/"), clean("/contact")],
  ["trailing slash, category", clean("/categories/pallet-trucks/"), clean("/categories/pallet-trucks")],
  ["old product address", clean("/products/3hp-screw-air-compressor"), clean("/products/3-hp-screw-air-compressor")],
  ["old product address, slash", clean("/products/3hp-screw-air-compressor/"), clean("/products/3-hp-screw-air-compressor")],
  ["cut-off product address", clean("/products/1-hp-25l-30l-portable-oil-free-noise-less-air-compres"), clean("/products/1-hp-25l-30l-portable-oil-free-noise-less-air-compressor")],
  ["odd old address", clean("/Hand_Pallet_Truck_With_Weighing_Scale"), clean("/categories/pallet-trucks")],
  ["old admin address", clean("/admin.login"), clean("/admin")],
  ["misspelt favicon", clean("/favicon.svvg"), clean("/icon.png")],
  ["made-up address", clean("/this-page-does-not-exist"), "404"],
];

let failed = 0;
for (const [label, url, want] of cases) {
  try {
    const first = await fetch(url, { redirect: "manual" });
    const to = first.headers.get("location") ? new URL(first.headers.get("location"), url).href : null;
    let verdict;
    if (want === null) verdict = first.status === 200 ? "ok" : `expected 200, got ${first.status}`;
    else if (want === "404") verdict = first.status === 404 ? "ok" : `expected a real 404, got ${first.status}`;
    else if (!to) verdict = `expected a redirect, got ${first.status}`;
    else if (first.status !== 301) verdict = `redirect is ${first.status}, should be 301`;
    else if (to !== want) verdict = `goes to ${to}, should go to ${want}`;
    else {
      // The target must answer 200 at once: a second redirect would be a chain.
      const second = await fetch(to, { redirect: "manual" });
      verdict = second.status === 200 ? "ok" : `target answers ${second.status} (chain)`;
    }
    if (verdict !== "ok") failed++;
    console.log(`${verdict === "ok" ? "PASS" : "FAIL"}  ${label.padEnd(30)} ${url}${verdict === "ok" ? "" : "\n      " + verdict}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${label.padEnd(30)} ${url}\n      ${e.cause?.code ?? e.message}`);
  }
}
console.log(failed ? `\n${failed} of ${cases.length} checks failed.` : `\nAll ${cases.length} checks passed.`);
process.exit(failed ? 1 : 0);
