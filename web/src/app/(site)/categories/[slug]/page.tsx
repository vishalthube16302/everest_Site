import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FilmPlayer } from "@/components/FilmPlayer";
import { ContactPanel, PageTitle, ProductCard } from "@/components/ui";
import { getCategoriesWithProducts, getFilms } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCategoriesWithProducts()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategoriesWithProducts()).find((c) => c.slug === slug);
  return { title: category?.name };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [categories, films] = await Promise.all([getCategoriesWithProducts(), getFilms()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const categoryFilm = films.find((f) => f.category_id === category.id);
  // Otherwise the film of the first model that has one. It shows that model's numbers, so the page names the model.
  const filmModel = categoryFilm ? undefined : category.products.find((p) => films.some((f) => f.product_id === p.id));
  const film = categoryFilm ?? films.find((f) => f.product_id === filmModel?.id);
  const count = category.products.length;

  return (
    <>
      <section className="page">
        <p className="pt-3 text-[15px] text-muted">
          <Link prefetch={false} href="/products" className="hover:text-brand">Products</Link> / {category.name}
        </p>
        <PageTitle title={category.name} intro={`${count} ${count === 1 ? "model" : "models"}. Price on request.`} />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {film && (
        <section className="page section">
          <FilmPlayer film={film} />
          {filmModel && <p className="mt-3 text-[15px] text-muted">Film shows the {filmModel.name}. Other models differ.</p>}
        </section>
      )}
      <ContactPanel />
    </>
  );
}
