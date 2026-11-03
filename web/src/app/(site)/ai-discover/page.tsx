import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { getCategoriesWithProducts, getSite, specRows } from "@/lib/data";

export const metadata: Metadata = { title: "Full catalogue" };

export default async function AiDiscoverPage() {
  const [categories, site] = await Promise.all([getCategoriesWithProducts(), getSite()]);
  return (
    <section className="page">
      <PageTitle title="Full catalogue" intro={`${site.name}. ${site.phoneDisplay}. ${site.email}.`} />
      {categories.map((category) => (
        <div key={category.id} className="mt-10">
          <h2 className="display card-title">
            <Link prefetch={false} href={`/categories/${category.slug}`} className="hover:text-brand">{category.name}</Link>
          </h2>
          <ul className="mt-3 space-y-3">
            {category.products.map((product) => (
              <li key={product.id}>
                <Link prefetch={false} href={`/products/${product.slug}`} className="font-semibold hover:text-brand">{product.name}</Link>
                <p className="text-[15px] text-muted">
                  {specRows(product).map((s) => `${s.label}: ${s.value}`).join("; ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
