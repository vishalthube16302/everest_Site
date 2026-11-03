"use client";

import { PageHead } from "@/components/admin/kit";
import { RowsEditor } from "@/components/admin/RowsEditor";

export default function AdminServices() {
  return (
    <>
      <PageHead title="Services" intro="Shown on the Services page, in this order. The site shows the titles only." />
      <RowsEditor
        table="services"
        addLabel="Add service"
        title={(r) => String(r.title ?? "")}
        fields={[
          { key: "title", label: "Title", required: true, wide: true },
          { key: "description", label: "Description (kept for later, not shown yet)", type: "textarea" },
        ]}
      />
    </>
  );
}
