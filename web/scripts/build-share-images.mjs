// Makes one share picture per product: public/img/share/<slug>.jpg, 1200x630, white background.
// WhatsApp, Facebook and email previews read JPG most reliably, and the Share button sends this same file.
// Runs before every build ("prebuild"). It never stops the build: a product without a picture here
// falls back to its normal photo (see products/[slug]/page.tsx).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join("public", "img", "share");
const MEMO = join("node_modules", ".cache", "share-images.json");

function env(name) {
  if (process.env[name]) return process.env[name];
  if (!existsSync(".env.local")) return undefined;
  const line = readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => l.startsWith(`${name}=`));
  return line?.slice(name.length + 1).trim();
}

async function main() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const key = env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) return console.log("Share images: skipped (no Supabase settings).");

  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    return console.log("Share images: skipped (image tool not installed).");
  }

  const res = await fetch(`${url}/rest/v1/products?select=slug,image_url&is_active=eq.true`, { headers: { apikey: key } });
  if (!res.ok) return console.log(`Share images: skipped (product list answered ${res.status}).`);
  const products = (await res.json()).filter((p) => p.slug && p.image_url);

  mkdirSync(OUT, { recursive: true });
  let memo = {};
  try {
    memo = JSON.parse(readFileSync(MEMO, "utf8"));
  } catch {}

  let made = 0;
  let kept = 0;
  let failed = 0;
  const queue = [...products];
  async function worker() {
    for (let p = queue.shift(); p; p = queue.shift()) {
      const file = join(OUT, `${p.slug}.jpg`);
      if (memo[p.slug] === p.image_url && existsSync(file)) {
        kept++;
        continue;
      }
      try {
        const img = await fetch(p.image_url);
        if (!img.ok) throw new Error(String(img.status));
        const jpg = await sharp(Buffer.from(await img.arrayBuffer()))
          .flatten({ background: "#ffffff" })
          .resize(1200, 630, { fit: "contain", background: "#ffffff" })
          .jpeg({ quality: 84, mozjpeg: true })
          .toBuffer();
        writeFileSync(file, jpg);
        memo[p.slug] = p.image_url;
        made++;
      } catch {
        failed++;
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));

  try {
    mkdirSync(join("node_modules", ".cache"), { recursive: true });
    writeFileSync(MEMO, JSON.stringify(memo));
  } catch {}
  console.log(`Share images: ${made} made, ${kept} kept, ${failed} failed, of ${products.length} products.`);
}

main().catch((err) => console.log(`Share images: skipped (${err.message}).`));
