"use client";

import { PageHead } from "@/components/admin/kit";
import { RowsEditor } from "@/components/admin/RowsEditor";

export default function AdminGallery() {
  return (
    <>
      <PageHead
        title="Gallery"
        intro="Extra photos for the Gallery page, such as installations or the workshop. They show first, before one photo of each product. Each photo opens the link you set."
      />
      <RowsEditor
        table="gallery_images"
        addLabel="Add photo"
        title={(r) => String(r.title ?? "Photo")}
        subtitle={(r) => (r.link_url ? `Opens ${r.link_url}` : "Opens /products")}
        thumb={(r) => r.image_url as string}
        fields={[
          { key: "image_url", label: "Photo", type: "photo", required: true },
          { key: "title", label: "Short description (for screen readers)", required: true },
          { key: "link_url", label: "Opens this page", placeholder: "/products/your-product or /categories/your-category", help: "Leave empty to open /products." },
        ]}
        validate={(r) => (r.link_url && !String(r.link_url).startsWith("/") ? "Link must start with / (a page on this site)." : null)}
      />
    </>
  );
}
