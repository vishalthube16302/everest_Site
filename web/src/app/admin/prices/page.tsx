"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { db, errorText } from "@/lib/admin/client";
import { Badge, Loading, PageHead, Toggle, useAdmin } from "@/components/admin/kit";
import { useCatalogue } from "@/lib/admin/lists";

type Price = { price_display: string; show_price: boolean };

export default function AdminPrices() {
  const { notify, changed } = useAdmin();
  const { categories, products, ready } = useCatalogue();
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [master, setMaster] = useState<boolean | null>(null);
  const [saved, setSaved] = useState<Record<string, Price>>({});
  const [draft, setDraft] = useState<Record<string, Price>>({});
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState("");

  async function load() {
    const [s, p] = await Promise.all([
      db().from("site_settings").select("id,show_prices").limit(1).maybeSingle(),
      db().from("product_prices").select("product_id,price_display,show_price"),
    ]);
    if (s.error || p.error) return notify(errorText(s.error ?? p.error), "error");
    setSettingsId(s.data?.id ?? null);
    setMaster(Boolean(s.data?.show_prices));
    const map = Object.fromEntries(
      (p.data ?? []).map((r) => [r.product_id, { price_display: r.price_display ?? "", show_price: Boolean(r.show_price) }]),
    );
    setSaved(map);
    setDraft(map);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const get = (id: string, from = draft): Price => from[id] ?? { price_display: "", show_price: false };
  const dirtyIds = useMemo(
    () => products.map((p) => p.id).filter((id) => JSON.stringify(get(id)) !== JSON.stringify(get(id, saved))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draft, saved, products],
  );

  if (!ready || master === null) return <Loading />;

  async function setMasterSwitch(value: boolean) {
    if (!settingsId) return;
    const { error } = await db().from("site_settings").update({ show_prices: value }).eq("id", settingsId);
    if (error) return notify(errorText(error), "error");
    setMaster(value);
    notify(value ? "Prices switched on. Products with their own switch on will show a price." : "All prices hidden.");
    changed();
  }

  async function saveAll() {
    setBusy(true);
    const rows = dirtyIds.map((id) => ({
      product_id: id,
      price_display: get(id).price_display.trim() || null,
      show_price: get(id).show_price,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await db().from("product_prices").upsert(rows);
    setBusy(false);
    if (error) return notify(errorText(error), "error");
    notify(`${rows.length} ${rows.length === 1 ? "price" : "prices"} saved.`);
    changed();
    load();
  }

  const showing = products.filter((p) => master && get(p.id, saved).show_price && get(p.id, saved).price_display.trim()).length;
  const list = categories.filter((c) => !category || c.id === category);

  return (
    <>
      <PageHead
        title="Prices"
        intro="A price shows on a product page only when the master switch and that product's switch are both on, and a price is filled in. Everywhere else the site says “Price on request”."
        actions={
          <button type="button" className="abtn abtn-primary" disabled={busy || dirtyIds.length === 0} onClick={saveAll}>
            {busy ? "Saving..." : dirtyIds.length ? `Save ${dirtyIds.length} ${dirtyIds.length === 1 ? "change" : "changes"}` : "Save"}
          </button>
        }
      />
      <div className="acard mb-5 flex flex-wrap items-center gap-4">
        <Toggle checked={master} onChange={setMasterSwitch} label="Master switch: show prices on the website" />
        <span className="text-[14px] text-muted">{showing} products show a price now.</span>
      </div>
      <select className="ainput mb-4 max-w-[320px]" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
        <option value="">All categories</option>
        {categories.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <div className="space-y-6">
        {list.map((r) => {
          const items = products.filter((p) => p.category_id === r.id);
          if (!items.length) return null;
          return (
            <section key={r.id}>
              <h2 className="mb-2 font-bold">{r.name}</h2>
              <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                {items.map((p) => {
                  const v = get(p.id);
                  return (
                    <li key={p.id} className="grid items-center gap-3 px-4 py-2.5 md:grid-cols-[1fr_240px_auto]">
                      <Link href={`/admin/products/edit?id=${p.id}`} className="font-medium hover:underline">
                        {p.name} {!p.is_active && <Badge tone="red">Hidden</Badge>}
                      </Link>
                      <input
                        className="ainput"
                        aria-label={`Price for ${p.name}`}
                        placeholder="Price on request"
                        value={v.price_display}
                        onChange={(e) => setDraft({ ...draft, [p.id]: { ...v, price_display: e.target.value } })}
                      />
                      <Toggle checked={v.show_price} onChange={(val) => setDraft({ ...draft, [p.id]: { ...v, show_price: val } })} label="Show" />
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
