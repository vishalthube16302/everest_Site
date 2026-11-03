"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { db, errorText } from "@/lib/admin/client";
import { Badge, Loading, PageHead, Toggle, useAdmin } from "@/components/admin/kit";
import { useCatalogue } from "@/lib/admin/lists";

type Item = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  specifications: unknown;
};

export default function AdminProducts() {
  const { notify, changed } = useAdmin();
  const { categories, ready } = useCatalogue();
  const [items, setItems] = useState<Item[] | null>(null);
  const [prices, setPrices] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"all" | "on" | "off">("all");

  async function load() {
    const [p, pr] = await Promise.all([
      db().from("products").select("id,name,slug,category_id,image_url,is_active,is_featured,sort_order,specifications").order("sort_order").order("name"),
      db().from("product_prices").select("product_id,price_display,show_price"),
    ]);
    if (p.error) return notify(errorText(p.error), "error");
    setItems(p.data as Item[]);
    setPrices(Object.fromEntries((pr.data ?? []).map((r) => [r.product_id, Boolean(r.price_display && r.show_price)])));
  }

  useEffect(() => {
    setCategory(new URLSearchParams(window.location.search).get("category") ?? "");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = useMemo(
    () =>
      (items ?? []).filter(
        (p) =>
          (!category || p.category_id === category) &&
          (status === "all" || (status === "on" ? p.is_active : !p.is_active)) &&
          (!query || `${p.name} ${p.slug}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [items, category, status, query],
  );

  async function toggle(item: Item, value: boolean) {
    const { error } = await db().from("products").update({ is_active: value }).eq("id", item.id);
    if (error) return notify(errorText(error), "error");
    notify(value ? `${item.name} now shows on the website.` : `${item.name} is hidden.`);
    setItems((list) => list?.map((p) => (p.id === item.id ? { ...p, is_active: value } : p)) ?? null);
    changed();
  }

  if (!items || !ready) return <Loading />;
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "No category";

  return (
    <>
      <PageHead
        title="Products"
        intro="Edit names, photos, specifications and prices. Hide a product to take it off the website without losing it."
        actions={<Link href="/admin/products/edit?new=1" className="abtn abtn-primary">Add product</Link>}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="ainput max-w-[280px]" placeholder="Search name or web address" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="ainput max-w-[280px]" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <select className="ainput max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value as "all" | "on" | "off")} aria-label="Status">
          <option value="all">All</option>
          <option value="on">On website</option>
          <option value="off">Hidden</option>
        </select>
      </div>
      <p className="mb-2 text-[14px] text-muted">{shown.length} of {items.length} products</p>
      <ul className="space-y-2">
        {shown.map((p) => {
          const specCount = Array.isArray(p.specifications) ? p.specifications.length : 0;
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
              <div className="flex h-14 w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ground">
                {p.image_url && <img src={p.image_url} alt="" loading="lazy" className="h-full w-full object-contain" />}
              </div>
              <Link href={`/admin/products/edit?id=${p.id}`} className="min-w-[200px] flex-1">
                <span className="block font-semibold hover:underline">{p.name}</span>
                <span className="block text-[13px] text-muted">{categoryName(p.category_id)} · {specCount} specs</span>
              </Link>
              {!p.is_active && <Badge tone="red">Hidden</Badge>}
              {prices[p.id] && <Badge tone="green">Price set to show</Badge>}
              {!p.image_url && <Badge tone="red">No photo</Badge>}
              <Toggle checked={p.is_active} onChange={(v) => toggle(p, v)} label="On site" />
              <Link href={`/admin/products/edit?id=${p.id}`} className="abtn abtn-sm">Edit</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
