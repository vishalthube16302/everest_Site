import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FilmPlayer } from "@/components/FilmPlayer";
import { Gallery } from "@/components/Gallery";
import { PriceBlock, ProductCard, SpecTable } from "@/components/ui";
import { getCategoriesWithProducts, getFilms, getPrice, getProductImages, getProducts, getSite, specRows } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProducts()).find((p) => p.slug === slug);
  return { title: product?.name };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [products, categories, images, films, site] = await Promise.all([
    getProducts(),
    getCategoriesWithProducts(),
    getProductImages(),
    getFilms(),
    getSite(),
  ]);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const price = await getPrice(product.id);
  const category = categories.find((c) => c.id === product.category_id);
  // A film linked to one model carries that model's numbers, so it never plays on another model.
  const film = films.find((f) => f.product_id === product.id) ?? films.find((f) => f.category_id === product.category_id);
  const related = (category?.products ?? []).filter((p) => p.id !== product.id).slice(0, 3);
  const photos = [
    ...(product.image_url ? [{ src: product.image_url, alt: product.name }] : []),
    ...images
      .filter((i) => i.product_id === product.id && i.image_url !== product.image_url)
      .map((i, n) => ({ src: i.image_url, alt: i.alt_text ?? `${product.name}, photo ${n + 2}` })),
  ];

  return (
    <>
      {/* One screen at 100% zoom: photos left; name, price, every spec and the buttons right. */}
      <section className="page pt-1 md:pt-2">
        <p className="pb-3 text-[14px] text-muted">
          <Link prefetch={false} href="/products" className="hover:text-brand">Products</Link>
          {category && (
            <>
              {" / "}
              <Link prefetch={false} href={`/categories/${category.slug}`} className="hover:text-brand">{category.name}</Link>
            </>
          )}
        </p>
        <div className="grid items-stretch gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-8">
          <Gallery images={photos} />
          <div>
            <h1 className="display text-[clamp(24px,2.2vw,32px)] font-extrabold leading-[1.1] text-balance">
              {product.name.split(" ").map((word, n) => (
                <span key={n} className="whitespace-nowrap">{n > 0 ? " " : ""}{word}</span>
              ))}
            </h1>
            <div className="mt-2"><PriceBlock price={price} /></div>
            <h2 className="sr-only">Technical specifications</h2>
            <div className="mt-3"><SpecTable rows={specRows(product)} /></div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link prefetch={false} href="/contact" className="btn btn-primary">Get a quote</Link>
              <a href={whatsappLink(site.whatsappNumber, product.name)} className="btn btn-outline">WhatsApp us</a>
            </div>
          </div>
        </div>
      </section>

      {film && (
        <section className="page section">
          <FilmPlayer film={film} />
        </section>
      )}


      {related.length > 0 && (
        <section className="page section">
          <h2 className="display mb-5 text-[32px] font-bold">You may also need</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </>
  );
}
