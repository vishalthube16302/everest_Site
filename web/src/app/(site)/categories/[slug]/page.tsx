import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { FilmPlayer } from "@/components/FilmPlayer";
import { GuideSections, matchingReviews } from "@/components/Guide";
import { ContactPanel, PageHero, Photo, ProductCard } from "@/components/ui";
import { categoryGuides } from "@/lib/category-guides";
import { getCategoriesWithProducts, getFilms, getReviews } from "@/lib/data";
import { breadcrumbJsonLd, faqJsonLd, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCategoriesWithProducts()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategoriesWithProducts()).find((c) => c.slug === slug);
  if (!category) return {};
  const n = category.products.length;
  return pageMeta({
    title: `${category.name} in Pune, Pimpri-Chinchwad`,
    description: `${category.name} from Everest, Pimpri-Chinchwad, Pune: ${n} ${n === 1 ? "model" : "models"} with full specifications, a buying guide and answers. Get a quote.`,
    path: `/categories/${category.slug}`,
    image: category.image_url ?? category.products[0]?.image_url,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [categories, films, allReviews] = await Promise.all([getCategoriesWithProducts(), getFilms(), getReviews()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const categoryFilm = films.find((f) => f.category_id === category.id);
  // Otherwise the film of the first model that has one. It shows that model's numbers, so the page names the model.
  const filmModel = categoryFilm ? undefined : category.products.find((p) => films.some((f) => f.product_id === p.id));
  const film = categoryFilm ?? films.find((f) => f.product_id === filmModel?.id);
  const count = category.products.length;
  const cover = category.image_url ?? category.products[0]?.image_url;
  const first = category.products[0];
  const guide = categoryGuides[category.slug];
  const reviews = matchingReviews(allReviews, guide);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: category.name, path: `/categories/${category.slug}` },
        ])}
      />
      {guide && <JsonLd data={faqJsonLd(guide.faq)} />}
      <section className="page">
        <p className="pt-3 text-[15px] text-muted">
          <Link prefetch={false} href="/products" className="inline-block py-2 hover:text-brand">Products</Link> / {category.name}
        </p>
        <PageHero
          kicker="Category"
          title={category.name}
          intro={`${guide ? `${guide.who} ` : ""}${count} ${count === 1 ? "model" : "models"}. Price on request.`}
          actions={
            <>
              <Link prefetch={false} href="/contact" className="btn btn-primary">Get a quote</Link>
              {film && <a href="#film" className="btn btn-outline">Watch the film</a>}
            </>
          }
          aside={
            cover && first ? (
              <Link
                prefetch={false}
                href={`/products/${first.slug}`}
                className="block rounded-panel bg-surface p-5 md:p-8"
                aria-label={`Open ${first.name}`}
              >
                <Photo priority src={cover} alt={`Everest ${category.name.toLowerCase()}`} className="on-ground mx-auto h-auto max-h-[340px] w-full object-contain" />
              </Link>
            ) : undefined
          }
        />
        <h2 className="sr-only">Models</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {film && (
        <section id="film" className="page section scroll-mt-4">
          <h2 className="display section-title mb-5">See it work.</h2>
          <FilmPlayer film={film} />
          {filmModel && <p className="mt-3 text-[15px] text-muted">Film shows the {filmModel.name}. Other models differ.</p>}
        </section>
      )}
      {guide && <GuideSections guide={guide} name={category.name} faq={guide.faq} reviews={reviews} />}
      <ContactPanel />
    </>
  );
}
