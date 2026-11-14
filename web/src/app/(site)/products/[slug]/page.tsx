import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { FilmPlayer } from "@/components/FilmPlayer";
import { Gallery } from "@/components/Gallery";
import { GuideSections, matchingReviews } from "@/components/Guide";
import { ShareButton } from "@/components/ShareButton";
import { ContactPanel, PriceBlock, ProductCard, SpecTable, TrustLine } from "@/components/ui";
import { categoryGuides } from "@/lib/category-guides";
import { getCategoriesWithProducts, getFilms, getPrice, getProductImages, getProducts, getReviews, getSite, keySpecs, specRows } from "@/lib/data";
import { abs, breadcrumbJsonLd, faqJsonLd, pageMeta, productDescription, productJsonLd } from "@/lib/seo";
import { shareContent } from "@/lib/share";
import { whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

// The JPG made by scripts/build-share-images.mjs. Without it, the product's own photo is used.
function sharePicture(product: { slug: string; image_url: string | null }) {
  return existsSync(join(process.cwd(), "public", "img", "share", `${product.slug}.jpg`)) ? abs(`/img/share/${product.slug}.jpg`) : product.image_url;
}

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProducts()).find((p) => p.slug === slug);
  if (!product) return {};
  return pageMeta({
    title: product.seo_title?.trim() || product.name,
    description: product.seo_description?.trim() || productDescription(product),
    path: `/products/${product.slug}`,
    image: sharePicture(product),
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [products, categories, images, films, site, allReviews] = await Promise.all([
    getProducts(),
    getCategoriesWithProducts(),
    getProductImages(),
    getFilms(),
    getSite(),
    getReviews(),
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

  // Words for search and AI answers, built only from this model's database specs and the category guide.
  const guide = category ? categoryGuides[category.slug] : undefined;
  const key = keySpecs(product, 4);
  const specFaq = key.slice(0, 3).map((r) => ({ q: `What is the ${r.label.toLowerCase()} of the ${product.name}?`, a: `${r.value}. See the full table above, or ask us.` }));
  const ownFaq = (product.faq ?? []).filter((f) => f?.q && f?.a);
  const faq = [...ownFaq, ...specFaq, ...(guide?.faq ?? []), { q: `How do I get a price for the ${product.name}?`, a: `Call or WhatsApp ${site.phoneDisplay}, or send an enquiry. We reply within 24 hours.` }];
  const reviews = matchingReviews(allReviews, guide);

  const pageUrl = abs(`/products/${product.slug}`);
  const share = shareContent(product, pageUrl, sharePicture(product), site);
  // One WhatsApp message for every button on this page: the model name and the page address.
  const wa = whatsappLink(site.whatsappNumber, product.name, pageUrl);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={[productJsonLd(product, category?.name, photos.map((p) => p.src)), breadcrumbJsonLd(trail), faqJsonLd(faq)]} />
      {/* One screen at 100% zoom: photos left; name, price, every spec and the buttons right. */}
      <section className="page pt-1 md:pt-2" data-page-product={product.name}>
        <p className="pb-3 text-[14px] text-muted">
          <Link prefetch={false} href="/products" className="inline-block py-2 hover:text-brand md:py-0">Products</Link>
          {category && (
            <>
              {" / "}
              <Link prefetch={false} href={`/categories/${category.slug}`} className="inline-block py-2 hover:text-brand md:py-0">{category.name}</Link>
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
            <div className="mt-2"><PriceBlock price={price} whatsappHref={wa} product={product.name} /></div>
            <h2 className="sr-only">Technical specifications</h2>
            <div className="mt-3"><SpecTable rows={specRows(product)} /></div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={wa} data-cta="product" data-product={product.name} className="btn btn-primary">
                {price ? "WhatsApp us" : "Get price on WhatsApp"}
              </a>
              <a href={site.phoneHref} data-cta="product" className="btn btn-outline">Call us</a>
              <Link prefetch={false} href="/contact" data-cta="product" className="btn btn-outline">Get a quote</Link>
              <ShareButton share={share} />
            </div>
            <TrustLine ratings={site.ratings} />
          </div>
        </div>
      </section>

      {film && (
        <section className="page section">
          <FilmPlayer film={film} />
        </section>
      )}


      <section className="page section">
        <h2 className="display section-title">About the {product.name}</h2>
        <p className="mt-4 max-w-[70ch] text-lg">
          The {product.name} is {category ? `one of ${category.products.length} models in our ${category.name.toLowerCase()} range` : "an Everest product"}, supplied from Pimpri-Chinchwad, Pune.
          {key.length > 0 && ` Key figures: ${key.map((r) => `${r.label.toLowerCase()} ${r.value}`).join("; ")}.`}
          {guide && ` ${guide.who}`}
        </p>
        <p className="mt-3 max-w-[70ch] text-muted">Price on request. Nearby delivery is offered. We reply within 24 hours.</p>
      </section>

      {guide && category && <GuideSections guide={guide} name={category.name} faq={faq} reviews={reviews} />}

      {related.length > 0 && (
        <section className="page section">
          <h2 className="display mb-5 text-[32px] font-bold">You may also need</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}

      <ContactPanel productName={product.name} pageUrl={pageUrl} />
    </>
  );
}
