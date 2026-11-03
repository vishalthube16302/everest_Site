import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle, Photo } from "@/components/ui";
import { getGalleryImages, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery" };

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
      <PageTitle title="Gallery" />
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((p) => (
          <Link prefetch={false} key={p.key} href={p.href} className="tile block rounded-card bg-surface p-3">
            <Photo src={p.src} alt={p.alt} className="h-auto w-full" />
          </Link>
        ))}
      </div>
    </section>
  );
}
