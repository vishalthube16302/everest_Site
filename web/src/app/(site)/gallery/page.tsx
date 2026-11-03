import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero, Photo } from "@/components/ui";
import { getGalleryImages, getProducts } from "@/lib/data";

export const metadata: Metadata = pageMeta({ title: "Product gallery", description: "Photos of Everest oil-free compressors, screw compressors, pallet trucks, stackers and lifting tables. Tap a photo to open the product.", path: "/gallery" });

// Photos added in the admin panel come first, then one photo per product.
export default async function GalleryPage() {
  const [products, extra] = await Promise.all([getProducts(), getGalleryImages()]);
  const seen = new Set<string>();
  const photos = [
    ...extra.map((g) => ({ key: g.id, src: g.image_url, alt: g.title ?? "Everest", href: g.link_url || "/products" })),
    ...products
      .filter((p) => p.image_url)
      .map((p) => ({ key: p.id, src: p.image_url as string, alt: p.name, href: `/products/${p.slug}` })),
  ].filter((p) => {
    if (seen.has(p.src)) return false;
    seen.add(p.src);
    return true;
  });
  return (
    <section className="page">
      <PageHero kicker="Gallery" title="Our products" intro="Tap a photo to open the product." />
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {photos.map((p) => (
          <Link prefetch={false} key={p.key} href={p.href} className="tile group block overflow-hidden rounded-card bg-surface p-3">
            <Photo src={p.src} alt={p.alt} className="aspect-[4/3] h-auto w-full rounded-xl object-contain" />
            <span className="mt-2 block line-clamp-2 px-1 text-[14px] font-medium leading-snug group-hover:text-brand">{p.alt}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
