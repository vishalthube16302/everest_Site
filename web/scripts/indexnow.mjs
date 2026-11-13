// After a live build, tell Bing (and other IndexNow engines) which pages changed. Runs as "postbuild".
// The key is public by design: IndexNow checks it at /<key>.txt on our own site.
// Only runs for the live build (SITE_INDEXABLE=true on the main branch). It never fails the build.
//
// How "changed" is found: each page's visible text is hashed and saved in out/indexnow-state.json,
// which is published with the site. The next build reads the live copy and sends only pages whose hash moved.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const KEY = "87969c7d42048a0d075e86f97693d1a1";
const OUT = "out";
const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://everesthps.com").replace(/\/+$/, "");
const branch = process.env.CF_PAGES_BRANCH;

function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fileFor(url) {
  const path = url.slice(site.length) || "/";
  return path === "/" ? join(OUT, "index.html") : join(OUT, `${path.slice(1)}.html`);
}

async function main() {
  if (process.env.SITE_INDEXABLE !== "true" || (branch && branch !== "main")) {
    console.log("IndexNow: skipped (not the live build).");
    return;
  }
  const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const state = {};
  for (const url of urls) {
    const file = fileFor(url);
    if (existsSync(file)) state[url] = createHash("sha1").update(pageText(readFileSync(file, "utf8"))).digest("hex").slice(0, 16);
  }
  writeFileSync(join(OUT, "indexnow-state.json"), JSON.stringify(state));

  let before = {};
  try {
    const res = await fetch(`${site}/indexnow-state.json`);
    if (res.ok) before = await res.json();
  } catch {
    // first run: every page counts as new
  }
  const changed = Object.keys(state).filter((url) => before[url] !== state[url]);

  // The engines check the key file on the live site. This build is not live yet, so if the key file is not
  // already live (a new key), sending now fails and Bing remembers the failure. Skip, and publish the old state
  // so the next build sends these pages again.
  const live = await fetch(`${site}/${KEY}.txt`).then((r) => (r.ok ? r.text() : "")).catch(() => "");
  if (live.trim() !== KEY) {
    writeFileSync(join(OUT, "indexnow-state.json"), JSON.stringify(before));
    console.log("IndexNow: key file not live yet, skipped. The next publish sends these pages.");
    return;
  }
  if (!changed.length) {
    console.log("IndexNow: no page changed.");
    return;
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: changed.slice(0, 10000) }),
  });
  console.log(`IndexNow: sent ${changed.length} changed page(s), answer ${res.status}.`);
}

main().catch((err) => console.log(`IndexNow: not sent (${err.message}). The build carries on.`));
