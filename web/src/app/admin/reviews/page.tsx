"use client";

import { PageHead } from "@/components/admin/kit";
import { RowsEditor } from "@/components/admin/RowsEditor";

export default function AdminReviews() {
  return (
    <>
      <PageHead
        title="Reviews"
        intro="Only genuine reviews from IndiaMART or Google. A review shows on the site when it is switched on and has a source. Never name another brand."
      />
      <RowsEditor
        table="testimonials"
        hiddenKey="is_active"
        addLabel="Add review"
        defaults={{ is_active: true, rating: 5 }}
        title={(r) => String(r.author_name ?? "")}
        subtitle={(r) => [r.source || "No source: not shown", r.author_company, r.review_date].filter(Boolean).join(" · ")}
        fields={[
          { key: "author_name", label: "Customer name", required: true },
          { key: "author_company", label: "Company or city" },
          { key: "content", label: "Review text", type: "textarea", required: true },
          {
            key: "source",
            label: "Source",
            type: "select",
            options: [
              { value: "IndiaMART", label: "IndiaMART" },
              { value: "Google", label: "Google" },
            ],
            help: "Reviews without a source never show.",
          },
          { key: "source_url", label: "Link to the review", type: "url", placeholder: "https://" },
          { key: "product_mentioned", label: "Product mentioned" },
          { key: "review_date", label: "Review date", type: "date" },
          { key: "rating", label: "Stars (1 to 5)", type: "number" },
          { key: "is_active", label: "Show on website", type: "bool" },
        ]}
        validate={(r) => {
          const n = Number(r.rating);
          return r.rating !== null && r.rating !== "" && r.rating !== undefined && (n < 1 || n > 5) ? "Stars must be 1 to 5." : null;
        }}
      />
    </>
  );
}
