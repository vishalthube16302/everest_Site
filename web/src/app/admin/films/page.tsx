"use client";

import { Loading, PageHead } from "@/components/admin/kit";
import { RowsEditor } from "@/components/admin/RowsEditor";
import { useCatalogue } from "@/lib/admin/lists";

export default function AdminFilms() {
  const { categories, products, ready } = useCatalogue();
  if (!ready) return <Loading />;
  const categoryName = (id: unknown) => categories.find((c) => c.id === id)?.name;
  const productName = (id: unknown) => products.find((p) => p.id === id)?.name;
  return (
    <>
      <PageHead
        title="Films"
        intro={
          <>
            A film linked to a category plays on that category page and on every product in it. A film linked to one model plays only on
            that model, because it shows that model&apos;s numbers. Films are large, so host the MP4 files outside the
            database and paste the links here.
          </>
        }
      />
      <RowsEditor
        table="product_media"
        orderKey={null}
        addLabel="Add film"
        title={(r) => (r.product_id ? `Model: ${productName(r.product_id) ?? "?"}` : `Category: ${categoryName(r.category_id) ?? "?"}`)}
        subtitle={(r) => String(r.video_url ?? "")}
        thumb={(r) => r.poster_url as string}
        fields={[
          {
            key: "category_id",
            label: "Category",
            type: "select",
            options: categories.map((r) => ({ value: r.id, label: r.name })),
            help: "Choose a category, or one model below. Not both.",
          },
          {
            key: "product_id",
            label: "One model only",
            type: "select",
            options: products.map((p) => ({ value: p.id, label: p.name })),
          },
          { key: "video_url", label: "Film link (MP4, large screens)", type: "url", required: true, wide: true },
          { key: "video_url_small", label: "Film link (MP4, phones)", type: "url", wide: true },
          { key: "poster_url", label: "Still image shown before play", type: "photo" },
          { key: "alt_text", label: "What the film shows (for screen readers)", wide: true },
        ]}
        validate={(r) => {
          if (!r.category_id && !r.product_id) return "Choose a category or a model.";
          if (r.category_id && r.product_id) return "Choose a category or a model, not both.";
          return null;
        }}
      />
    </>
  );
}
