"use client";

import Link from "next/link";
import { db } from "@/lib/admin/client";
import { Loading, PageHead } from "@/components/admin/kit";
import { RowsEditor } from "@/components/admin/RowsEditor";
import { useCatalogue } from "@/lib/admin/lists";

export default function AdminCategories() {
  const { categories, products, ready, reload } = useCatalogue();
  if (!ready) return <Loading />;
  const countIn = (categoryId: unknown) => products.filter((p) => p.category_id === categoryId).length;

  return (
    <>
      <PageHead
        title="Categories"
        intro="The tiles on the home and Products pages, in this order. Each tile opens a page with its products. Every product belongs to one category."
      />
      <p className="mb-3 text-[14px] text-muted">
        Changing a category&apos;s web address breaks old links to it. Hide a category instead of removing it when you can.
        A category with no visible products is left out of the website.
      </p>
      <RowsEditor
        table="categories"
        hiddenKey="is_active"
        addLabel="Add category"
        defaults={{ is_active: true }}
        title={(r) => String(r.name ?? "")}
        subtitle={(r) => `${countIn(r.id)} products · /categories/${r.slug ?? ""}`}
        thumb={(r) => r.image_url as string}
        fields={[
          { key: "name", label: "Name", required: true },
          {
            key: "slug",
            label: "Web address",
            required: true,
            help: "Small letters, numbers and dashes, for example pallet-trucks.",
          },
          { key: "image_url", label: "Tile photo", type: "image", help: "Leave empty to use the first product's photo." },
          { key: "description", label: "Description (kept for later, not shown yet)", type: "textarea" },
          { key: "is_active", label: "Show on website", type: "bool" },
        ]}
        validate={(r) => (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(r.slug ?? "")) ? null : "Web address: small letters, numbers and dashes only.")}
        canRemove={(r) => {
          const n = countIn(r.id);
          return n ? `This category still has ${n} products. Move them to another category first, or hide the category.` : null;
        }}
        beforeRemove={async (r) => {
          const { error } = await db().from("product_media").delete().eq("category_id", r.id);
          if (error) throw error;
        }}
        extra={(r) => (
          <p className="mt-4 text-[14px]">
            <Link className="underline" href={`/admin/products?category=${r.id}`}>See the products in this category</Link>
          </p>
        )}
        onSaved={reload}
      />
    </>
  );
}
