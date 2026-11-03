import type { Metadata } from "next";
import { ContactPanel, CategoryTile, PageTitle } from "@/components/ui";
import { getCategoryTiles, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getCategoryTiles(), getProducts()]);
  return (
    <>
      <section className="page">
        <PageTitle title="All products" intro={`${products.length} models in ${categories.length} categories.`} />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryTile key={category.name} category={category} wide={i === 0} />
          ))}
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
