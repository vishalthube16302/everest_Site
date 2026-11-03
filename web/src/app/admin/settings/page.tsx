"use client";

import { useEffect, useState } from "react";
import { db, errorText } from "@/lib/admin/client";
import { Field, Loading, PageHead, useAdmin } from "@/components/admin/kit";
import { RowsEditor } from "@/components/admin/RowsEditor";

type Settings = Record<string, string | number | null> & { id: string };

const fields: { key: string; label: string; help?: string; wide?: boolean; type?: string }[] = [
  { key: "company_name", label: "Company name", wide: true },
  { key: "tagline", label: "Tagline", wide: true },
  { key: "phone", label: "Phone", help: "As it should appear, for example +91 88558 20105. The call link is made from it." },
  { key: "whatsapp", label: "WhatsApp number", help: "Country code and number, digits only, for example 918855820105." },
  { key: "email", label: "Email" },
  { key: "working_hours", label: "Working hours" },
  { key: "address", label: "Address", wide: true },
  { key: "gst_number", label: "GSTIN" },
  { key: "established_year", label: "Year established", type: "number" },
  { key: "google_rating", label: "Google rating", help: "For example 5.0" },
  { key: "google_reviews", label: "Number of Google reviews" },
  { key: "indiamart_rating", label: "IndiaMART rating" },
  { key: "indiamart_reviews", label: "Number of IndiaMART reviews", help: "For example: about 40" },
];

export default function AdminSettings() {
  const { notify, changed } = useAdmin();
  const [row, setRow] = useState<Settings | null>(null);
  const [draft, setDraft] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await db().from("site_settings").select("*").limit(1).maybeSingle();
    if (error) return notify(errorText(error), "error");
    setRow(data as Settings);
    setDraft(data as Settings);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!row || !draft) return <Loading />;
  const dirty = fields.some((f) => String(draft[f.key] ?? "") !== String(row[f.key] ?? ""));

  async function save() {
    if (!draft || !row) return;
    const digits = String(draft.whatsapp ?? "").replace(/\D/g, "");
    if (digits && digits.length < 11) return notify("WhatsApp number needs the country code, for example 918855820105.", "error");
    const patch: Record<string, unknown> = {};
    for (const f of fields) {
      const v = String(draft[f.key] ?? "").trim();
      patch[f.key] = f.type === "number" ? (v ? Number(v) : null) : v || null;
    }
    patch.whatsapp = digits || null;
    patch.updated_at = new Date().toISOString();
    setBusy(true);
    const { error } = await db().from("site_settings").update(patch).eq("id", row.id);
    setBusy(false);
    if (error) return notify(errorText(error), "error");
    notify("Saved.");
    load();
    changed();
  }

  return (
    <>
      <PageHead
        title="Company and menu"
        intro="Contact details shown in the header, footer, contact, about and WhatsApp buttons. Only publish facts you can stand behind."
      />
      <div className="acard">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <Field key={f.key} label={f.label} help={f.help} wide={f.wide}>
              <input
                className="ainput"
                type={f.type === "number" ? "number" : "text"}
                value={String(draft[f.key] ?? "")}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            </Field>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" className="abtn abtn-primary" disabled={!dirty || busy} onClick={save}>Save</button>
          {dirty && <button type="button" className="abtn" onClick={() => setDraft(row)}>Undo changes</button>}
        </div>
      </div>

      <h2 className="mb-2 mt-10 text-xl font-bold">Menu</h2>
      <p className="mb-3 text-[14px] text-muted">
        Links in the header and footer, in this order. Switching one off hides the link; the page itself stays online.
      </p>
      <RowsEditor
        table="pages"
        hiddenKey="is_enabled"
        addLabel="Add menu link"
        defaults={{ is_enabled: true }}
        filter={(r) => r.path !== "/"}
        title={(r) => String(r.label ?? "")}
        subtitle={(r) => String(r.path ?? "")}
        fields={[
          { key: "label", label: "Link text", required: true },
          { key: "path", label: "Page", required: true, placeholder: "/products", help: "A page on this site, starting with /." },
          { key: "is_enabled", label: "Show in menu", type: "bool" },
        ]}
        validate={(r) => (String(r.path ?? "").startsWith("/") ? null : "Page must start with /.")}
      />
    </>
  );
}
