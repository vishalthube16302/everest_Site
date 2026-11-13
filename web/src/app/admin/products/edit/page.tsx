"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { db, errorText, logRemoval, slugify } from "@/lib/admin/client";
import { uploadImage } from "@/lib/admin/image";
import { Badge, ConfirmButton, Field, ImageField, ImageLibrary, Loading, PageHead, Toggle, useAdmin } from "@/components/admin/kit";
import { useCatalogue } from "@/lib/admin/lists";

type Product = {
  id?: string;
  name: string;
  slug: string;
  category_id: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  description: string | null;
  long_description: string | null;
  specifications: unknown;
  seo_title: string | null;
  seo_description: string | null;
  faq: { q: string; a: string }[] | null;
};

type Spec = { key: number; label: string; value: string };
type Photo = { id: string; image_url: string; alt_text: string | null; sort_order: number };
type Price = { price_display: string; show_price: boolean };

let specKey = 1;
const toSpecs = (raw: unknown): Spec[] =>
  Array.isArray(raw)
    ? raw
        .filter((r) => Array.isArray(r) && r.length >= 2)
        .map((r) => ({ key: specKey++, label: String(r[0]), value: String(r[1]) }))
    : [];

const blank: Product = {
  name: "",
  slug: "",
  category_id: null,
  image_url: null,
  is_active: false,
  is_featured: false,
  sort_order: 0,
  description: null,
  long_description: null,
  specifications: [],
  seo_title: null,
  seo_description: null,
  faq: [],
};

export default function ProductEditor() {
  const router = useRouter();
  const { notify, changed } = useAdmin();
  const { categories, ready } = useCatalogue();
  const [id, setId] = useState<string | null | undefined>(undefined);
  const [saved, setSaved] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Product | null>(null);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [savedSpecs, setSavedSpecs] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [price, setPrice] = useState<Price>({ price_display: "", show_price: false });
  const [savedPrice, setSavedPrice] = useState<Price>({ price_display: "", show_price: false });
  const [masterPrices, setMasterPrices] = useState(false);
  const [films, setFilms] = useState(0);
  const [busy, setBusy] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [paste, setPaste] = useState<string | null>(null);

  async function load(productId: string) {
    const [p, imgs, pr, media, settings] = await Promise.all([
      db().from("products").select("*").eq("id", productId).maybeSingle(),
      db().from("product_images").select("id,image_url,alt_text,sort_order").eq("product_id", productId).order("sort_order"),
      db().from("product_prices").select("price_display,show_price").eq("product_id", productId).maybeSingle(),
      db().from("product_media").select("id", { count: "exact", head: true }).eq("product_id", productId),
      db().from("site_settings").select("show_prices").limit(1).maybeSingle(),
    ]);
    if (p.error || !p.data) return notify(p.error ? errorText(p.error) : "Product not found.", "error");
    const product = p.data as Product;
    setSaved(product);
    setDraft(product);
    const s = toSpecs(product.specifications);
    setSpecs(s);
    setSavedSpecs(JSON.stringify(s.map((x) => [x.label, x.value])));
    setPhotos((imgs.data ?? []) as Photo[]);
    const priceRow = { price_display: pr.data?.price_display ?? "", show_price: Boolean(pr.data?.show_price) };
    setPrice(priceRow);
    setSavedPrice(priceRow);
    setFilms(media.count ?? 0);
    setMasterPrices(Boolean(settings.data?.show_prices));
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    setId(productId);
    if (productId) load(productId);
    else {
      setDraft(blank);
      setSaved(blank);
      setSpecs([]);
      setSavedSpecs("[]");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (id === undefined || !draft || !saved || !ready) return <Loading />;

  const isNew = !id;
  const cleanSpecs = specs.filter((s) => s.label.trim() && s.value.trim()).map((s) => [s.label.trim(), s.value.trim()]);
  const productDirty =
    JSON.stringify({ ...draft, specifications: null }) !== JSON.stringify({ ...saved, specifications: null }) ||
    JSON.stringify(specs.map((x) => [x.label, x.value])) !== savedSpecs;
  const priceDirty = price.price_display !== savedPrice.price_display || price.show_price !== savedPrice.show_price;
  const dirty = productDirty || priceDirty;
  const set = <K extends keyof Product>(key: K, value: Product[K]) => setDraft({ ...draft, [key]: value });

  async function save() {
    if (!draft) return;
    const name = draft.name.trim().replace(/\s+/g, " ");
    const slug = draft.slug.trim();
    if (!name) return notify("Name is needed.", "error");
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return notify("Web address: small letters, numbers and dashes only.", "error");
    if (!draft.category_id) return notify("Choose a category.", "error");
    const clash = await db().from("products").select("id").eq("slug", slug).neq("id", id ?? "00000000-0000-0000-0000-000000000000").maybeSingle();
    if (clash.data) return notify("Another product already uses this web address.", "error");

    setBusy(true);
    const row = {
      name,
      slug,
      category_id: draft.category_id,
      image_url: draft.image_url,
      is_active: draft.is_active,
      is_featured: draft.is_featured,
      sort_order: Number(draft.sort_order) || 0,
      description: draft.description?.trim() || null,
      long_description: draft.long_description?.trim() || null,
      specifications: cleanSpecs,
      seo_title: draft.seo_title?.trim() || null,
      seo_description: draft.seo_description?.trim() || null,
      faq: (draft.faq ?? []).map((f) => ({ q: f.q.trim(), a: f.a.trim() })).filter((f) => f.q && f.a),
    };
    let productId = id;
    if (isNew) {
      const res = await db().from("products").insert(row).select("id").single();
      if (res.error) {
        setBusy(false);
        return notify(errorText(res.error), "error");
      }
      productId = res.data.id as string;
    } else if (productDirty) {
      const res = await db().from("products").update(row).eq("id", id);
      if (res.error) {
        setBusy(false);
        return notify(errorText(res.error), "error");
      }
    }
    if (priceDirty || isNew) {
      const res = await db()
        .from("product_prices")
        .upsert({
          product_id: productId,
          price_display: price.price_display.trim() || null,
          show_price: price.show_price,
          updated_at: new Date().toISOString(),
        });
      if (res.error) notify(`Product saved, but the price was not: ${errorText(res.error)}`, "error");
    }
    setBusy(false);
    changed();
    notify("Saved.");
    if (isNew && productId) {
      router.replace(`/admin/products/edit?id=${productId}`);
      setId(productId);
    }
    if (productId) load(productId);
  }

  async function duplicate() {
    if (!saved || !id) return;
    setBusy(true);
    let slug = `${saved.slug}-copy`;
    for (let n = 2; (await db().from("products").select("id").eq("slug", slug).maybeSingle()).data; n++) slug = `${saved.slug}-copy-${n}`;
    const { id: _drop, ...rest } = saved as Product & { id: string; created_at?: string };
    void _drop;
    delete (rest as { created_at?: string }).created_at;
    const res = await db()
      .from("products")
      .insert({ ...rest, name: `${saved.name} (copy)`, slug, is_active: false })
      .select("id")
      .single();
    if (res.error) {
      setBusy(false);
      return notify(errorText(res.error), "error");
    }
    if (photos.length) {
      await db()
        .from("product_images")
        .insert(photos.map((p) => ({ product_id: res.data.id, image_url: p.image_url, alt_text: p.alt_text, sort_order: p.sort_order })));
    }
    setBusy(false);
    changed();
    notify("Copy made. It is hidden until you switch it on.");
    window.location.href = `/admin/products/edit?id=${res.data.id}`;
  }

  async function remove() {
    if (!id || !saved) return;
    setBusy(true);
    const { error } = await db().from("products").delete().eq("id", id);
    setBusy(false);
    if (error) return notify(errorText(error), "error");
    await logRemoval("products", id, saved.name);
    changed();
    notify(`${saved.name} removed.`);
    router.push("/admin/products");
  }

  // ---- extra photos: saved straight away ----
  async function addPhotos(files: FileList | File[]) {
    if (!id) return;
    setBusy(true);
    let order = Math.max(0, ...photos.map((p) => p.sort_order)) + 10;
    for (const file of Array.from(files)) {
      try {
        const url = await uploadImage(file, { name: draft?.slug || draft?.name });
        const { error } = await db().from("product_images").insert({ product_id: id, image_url: url, alt_text: draft?.name, sort_order: order });
        if (error) throw error;
        order += 10;
      } catch (e) {
        notify(errorText(e), "error");
      }
    }
    setBusy(false);
    changed();
    load(id);
  }

  async function addExisting(url: string) {
    if (!id) return;
    const order = Math.max(0, ...photos.map((p) => p.sort_order)) + 10;
    const { error } = await db().from("product_images").insert({ product_id: id, image_url: url, alt_text: draft?.name, sort_order: order });
    if (error) return notify(errorText(error), "error");
    changed();
    load(id);
  }

  async function movePhoto(i: number, step: -1 | 1) {
    if (!id) return;
    const list = [...photos];
    const j = i + step;
    if (!list[j]) return;
    [list[i], list[j]] = [list[j], list[i]];
    setPhotos(list);
    await Promise.all(list.map((p, n) => db().from("product_images").update({ sort_order: (n + 1) * 10 }).eq("id", p.id)));
    changed();
  }

  async function removePhoto(photo: Photo) {
    if (!id) return;
    const { error } = await db().from("product_images").delete().eq("id", photo.id);
    if (error) return notify(errorText(error), "error");
    await logRemoval("product_images", photo.id, draft?.name);
    changed();
    load(id);
  }

  async function saveAlt(photo: Photo, alt: string) {
    if ((photo.alt_text ?? "") === alt) return;
    const { error } = await db().from("product_images").update({ alt_text: alt || null }).eq("id", photo.id);
    if (error) return notify(errorText(error), "error");
    changed();
  }

  // ---- specifications ----
  const setSpec = (key: number, field: "label" | "value", value: string) =>
    setSpecs(specs.map((s) => (s.key === key ? { ...s, [field]: value } : s)));
  const moveSpec = (i: number, step: -1 | 1) => {
    const list = [...specs];
    const j = i + step;
    if (!list[j]) return;
    [list[i], list[j]] = [list[j], list[i]];
    setSpecs(list);
  };
  function applyPaste() {
    const rows = (paste ?? "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.includes("\t") ? line.split("\t") : line.split(/\s*[:|]\s*/);
        return { key: specKey++, label: (parts[0] ?? "").trim(), value: parts.slice(1).join(" ").trim() };
      })
      .filter((r) => r.label && r.value);
    if (!rows.length) return notify("No rows found. Use one row per line: Label, then a tab or colon, then the value.", "error");
    setSpecs([...specs, ...rows]);
    setPaste(null);
    notify(`${rows.length} rows added. Remember to save.`);
  }

  const category = categories.find((c) => c.id === draft.category_id);
  const priceShows = masterPrices && price.show_price && price.price_display.trim();

  return (
    <>
      <p className="mb-2 text-[14px]">
        <Link href="/admin/products" className="text-muted underline">All products</Link>
      </p>
      <PageHead
        title={isNew ? "New product" : saved.name}
        intro={
          isNew ? "Fill in the name and category, then save. Photos can be added after the first save." : (
            <span className="flex flex-wrap items-center gap-2">
              {saved.is_active ? <Badge tone="green">On website</Badge> : <Badge tone="red">Hidden</Badge>}
              <span>/products/{saved.slug}</span>
              {saved.is_active && (
                <a href={`/products/${saved.slug}`} target="_blank" rel="noreferrer" className="underline">View on website</a>
              )}
            </span>
          )
        }
        actions={
          <>
            {!isNew && <button type="button" className="abtn" disabled={busy} onClick={duplicate}>Make a copy</button>}
            <button type="button" className="abtn abtn-primary" disabled={busy || (!dirty && !isNew)} onClick={save}>
              {busy ? "Saving..." : isNew ? "Create product" : "Save"}
            </button>
          </>
        }
      />
      {dirty && !isNew && <p className="mb-4 rounded-xl bg-ink px-4 py-2 text-[14px] font-semibold text-white">You have changes that are not saved.</p>}

      <div className="grid items-start gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <section className="acard">
            <h2 className="mb-4 text-lg font-bold">Basics</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name *" wide>
                <input
                  className="ainput"
                  value={draft.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setDraft({ ...draft, name, slug: isNew && !slugTouched ? slugify(name) : draft.slug });
                  }}
                />
              </Field>
              <Field
                label="Web address *"
                help={isNew ? "Made from the name. Small letters, numbers and dashes." : "Changing it breaks old links and Google results for this product."}
              >
                <input
                  className="ainput"
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                />
              </Field>
              <Field label="Category *">
                <select className="ainput" value={draft.category_id ?? ""} onChange={(e) => set("category_id", e.target.value || null)}>
                  <option value="">Choose...</option>
                  {categories.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}{r.is_active ? "" : " (hidden)"}</option>
                  ))}
                </select>
              </Field>
              <Field label="Order in its category" help="Lower numbers show first.">
                <input className="ainput" type="number" value={draft.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} />
              </Field>
              <div className="flex flex-col justify-center gap-3">
                <Toggle checked={draft.is_active} onChange={(v) => set("is_active", v)} label="Show on website" />
                <Toggle checked={draft.is_featured} onChange={(v) => set("is_featured", v)} label="Featured" />
              </div>
            </div>
          </section>

          <section className="acard">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Specifications</h2>
              <div className="flex gap-2">
                <button type="button" className="abtn abtn-sm" onClick={() => setPaste(paste === null ? "" : null)}>Paste a table</button>
                <button type="button" className="abtn abtn-sm" onClick={() => setSpecs([...specs, { key: specKey++, label: "", value: "" }])}>Add row</button>
              </div>
            </div>
            <p className="mb-3 text-[13px] text-muted">Shown as the table on the product page, in this order. Empty rows are skipped.</p>
            {paste !== null && (
              <div className="mb-4 rounded-xl bg-ground p-3">
                <textarea
                  className="ainput min-h-[140px] font-mono text-[13px]"
                  placeholder={"Tank capacity\t50 L\nWorking pressure: 8 bar"}
                  value={paste}
                  onChange={(e) => setPaste(e.target.value)}
                />
                <p className="mt-1 text-[12px] text-muted">One row per line. Copy two columns from Excel, or write Label: Value.</p>
                <button type="button" className="abtn abtn-sm abtn-dark mt-2" onClick={applyPaste}>Add these rows</button>
              </div>
            )}
            {specs.length === 0 && <p className="text-muted">No specifications yet.</p>}
            <ol className="space-y-2">
              {specs.map((s, i) => (
                <li key={s.key} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                  <input className="ainput" aria-label={`Row ${i + 1} label`} placeholder="Parameter" value={s.label} onChange={(e) => setSpec(s.key, "label", e.target.value)} />
                  <input className="ainput" aria-label={`Row ${i + 1} value`} placeholder="Value" value={s.value} onChange={(e) => setSpec(s.key, "value", e.target.value)} />
                  <span className="flex gap-1">
                    <button type="button" className="abtn abtn-sm px-2.5" aria-label="Move up" disabled={i === 0} onClick={() => moveSpec(i, -1)}>↑</button>
                    <button type="button" className="abtn abtn-sm px-2.5" aria-label="Move down" disabled={i === specs.length - 1} onClick={() => moveSpec(i, 1)}>↓</button>
                    <button type="button" className="abtn abtn-sm abtn-danger px-2.5" aria-label="Remove row" onClick={() => setSpecs(specs.filter((x) => x.key !== s.key))}>✕</button>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="acard">
            <h2 className="mb-1 text-lg font-bold">Google and AI search</h2>
            <p className="mb-3 text-[13px] text-muted">Optional. Leave empty to use the automatic title and description. Use only facts you can stand behind: no prices, no other brand names.</p>
            <div className="grid gap-4">
              <Field label={`Search title (${(draft.seo_title ?? "").length}/60)`}>
                <input className="ainput" maxLength={70} value={draft.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} placeholder={draft.name} />
              </Field>
              <Field label={`Search description (${(draft.seo_description ?? "").length}/160)`}>
                <textarea className="ainput min-h-[70px]" maxLength={170} value={draft.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} />
              </Field>
              <div>
                <p className="mb-2 text-[14px] font-semibold">Questions and answers (shown first on the product page)</p>
                <ol className="space-y-3">
                  {(draft.faq ?? []).map((f, n) => (
                    <li key={n} className="grid gap-2 rounded-lg border border-line p-3">
                      <input className="ainput" placeholder="Question" value={f.q} onChange={(e) => set("faq", (draft.faq ?? []).map((x, i) => (i === n ? { ...x, q: e.target.value } : x)))} />
                      <textarea className="ainput min-h-[60px]" placeholder="Answer" value={f.a} onChange={(e) => set("faq", (draft.faq ?? []).map((x, i) => (i === n ? { ...x, a: e.target.value } : x)))} />
                      <button type="button" className="abtn abtn-sm abtn-danger justify-self-start" onClick={() => set("faq", (draft.faq ?? []).filter((_, i) => i !== n))}>Remove question</button>
                    </li>
                  ))}
                </ol>
                <button type="button" className="abtn abtn-sm mt-3" onClick={() => set("faq", [...(draft.faq ?? []), { q: "", a: "" }])}>+ Add question</button>
              </div>
            </div>
          </section>

          <section className="acard">
            <h2 className="mb-1 text-lg font-bold">Descriptions</h2>
            <p className="mb-3 text-[13px] text-muted">Kept for later. The website does not show them yet, because old texts held claims that were not checked.</p>
            <div className="grid gap-4">
              <Field label="Short description">
                <textarea className="ainput min-h-[80px]" value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} />
              </Field>
              <Field label="Long description">
                <textarea className="ainput min-h-[120px]" value={draft.long_description ?? ""} onChange={(e) => set("long_description", e.target.value)} />
              </Field>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="acard">
            <h2 className="mb-3 text-lg font-bold">Main photo</h2>
            <ImageField value={draft.image_url} onChange={(url) => set("image_url", url)} name={draft.slug || draft.name} />
            <p className="mt-2 text-[12px] text-muted">Used on cards and as the first photo on the product page.</p>
          </section>

          <section className="acard">
            <h2 className="mb-1 text-lg font-bold">More photos</h2>
            <p className="mb-3 text-[13px] text-muted">Shown after the main photo, in this order. Changes here save straight away.</p>
            {isNew ? (
              <p className="text-muted">Save the product first.</p>
            ) : (
              <MorePhotos
                photos={photos}
                busy={busy}
                mainUrl={draft.image_url}
                onAdd={addPhotos}
                onPick={addExisting}
                onMove={movePhoto}
                onRemove={removePhoto}
                onAlt={saveAlt}
                onMakeMain={(url) => {
                  set("image_url", url);
                  notify("Set as main photo. Remember to save.");
                }}
              />
            )}
          </section>

          <section className="acard">
            <h2 className="mb-1 text-lg font-bold">Price</h2>
            <p className="mb-3 text-[13px] text-muted">
              A price shows only when this switch and the master switch on the Prices page are both on. Otherwise the page says
              &ldquo;Price on request&rdquo;.
            </p>
            <div className="grid gap-3">
              <Field label="Price as shown" help="For example: ₹ 18,500 + GST">
                <input className="ainput" value={price.price_display} onChange={(e) => setPrice({ ...price, price_display: e.target.value })} />
              </Field>
              <Toggle checked={price.show_price} onChange={(v) => setPrice({ ...price, show_price: v })} label="Show this price" />
              <p className="text-[13px]">
                {priceShows ? <Badge tone="green">Price will show</Badge> : <Badge>Price on request</Badge>}{" "}
                <span className="text-muted">Master switch is {masterPrices ? "on" : "off"}. </span>
                <Link href="/admin/prices" className="underline">Prices page</Link>
              </p>
            </div>
          </section>

          {!isNew && (
            <section className="acard">
              <h2 className="mb-1 text-lg font-bold">Film</h2>
              <p className="text-[14px] text-muted">
                {films ? `${films} film linked to this model.` : category ? `Uses the ${category.name} category film if there is one.` : "No film."}{" "}
                <Link href="/admin/films" className="underline">Films page</Link>
              </p>
            </section>
          )}

          {!isNew && (
            <section className="acard">
              <h2 className="mb-1 text-lg font-bold">Remove product</h2>
              <p className="mb-3 text-[13px] text-muted">
                Removes it, its photos list and its price for good. Old links will show &ldquo;Page not found&rdquo;. Hiding is
                usually better.
              </p>
              <ConfirmButton onConfirm={remove} disabled={busy}>Remove product</ConfirmButton>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function MorePhotos({
  photos,
  busy,
  mainUrl,
  onAdd,
  onPick,
  onMove,
  onRemove,
  onAlt,
  onMakeMain,
}: {
  photos: Photo[];
  busy: boolean;
  mainUrl: string | null;
  onAdd: (files: FileList) => void;
  onPick: (url: string) => void;
  onMove: (i: number, step: -1 | 1) => void;
  onRemove: (p: Photo) => void;
  onAlt: (p: Photo, alt: string) => void;
  onMakeMain: (url: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [library, setLibrary] = useState(false);
  return (
    <div>
      <ul className="space-y-2">
        {photos.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl border border-line p-2">
            <img src={p.image_url} alt="" className="h-14 w-[72px] shrink-0 rounded-lg bg-ground object-contain" />
            <div className="min-w-0 flex-1">
              <input
                className="ainput min-h-[32px] py-1 text-[13px]"
                aria-label="Photo description"
                defaultValue={p.alt_text ?? ""}
                placeholder="Photo description"
                onBlur={(e) => onAlt(p, e.target.value.trim())}
              />
              <div className="mt-1 flex flex-wrap gap-1">
                {p.image_url === mainUrl ? (
                  <Badge tone="dark">Main photo</Badge>
                ) : (
                  <button type="button" className="text-[12px] underline" onClick={() => onMakeMain(p.image_url)}>Make main photo</button>
                )}
              </div>
            </div>
            <span className="flex gap-1">
              <button type="button" className="abtn abtn-sm px-2.5" aria-label="Move up" disabled={i === 0} onClick={() => onMove(i, -1)}>↑</button>
              <button type="button" className="abtn abtn-sm px-2.5" aria-label="Move down" disabled={i === photos.length - 1} onClick={() => onMove(i, 1)}>↓</button>
              <ConfirmButton onConfirm={() => onRemove(p)} className="abtn abtn-sm abtn-danger px-2.5" confirmText="Sure?">✕</ConfirmButton>
            </span>
          </li>
        ))}
      </ul>
      {photos.length === 0 && <p className="text-muted">No extra photos.</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="abtn abtn-sm" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? "Uploading..." : "Upload photos"}
        </button>
        <button type="button" className="abtn abtn-sm" onClick={() => setLibrary(true)}>Choose uploaded</button>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onAdd(e.target.files);
          e.target.value = "";
        }}
      />
      {library && (
        <ImageLibrary
          onClose={() => setLibrary(false)}
          onPick={(url) => {
            onPick(url);
            setLibrary(false);
          }}
        />
      )}
    </div>
  );
}
