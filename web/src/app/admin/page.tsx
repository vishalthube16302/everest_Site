"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/admin/client";
import { Loading, PageHead } from "@/components/admin/kit";
import { actionName, tableNames, when } from "@/lib/admin/labels";

type Counts = Record<string, number>;
type LogRow = { id: number; table_name: string; action: string; summary: string | null; actor_email: string | null; created_at: string };
type PublishRow = { status: string; message: string | null; created_at: string; requested_by: string | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const count = async (table: string, filter?: (q: any) => any) => {
  let q = db().from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  return (await q).count ?? 0;
};

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [log, setLog] = useState<LogRow[]>([]);
  const [publish, setPublish] = useState<PublishRow | null>(null);

  useEffect(() => {
    (async () => {
      const [on, off, categories, reviews, prices, settings, films, recent, lastPublish] = await Promise.all([
        count("products", (q) => q.eq("is_active", true)),
        count("products", (q) => q.eq("is_active", false)),
        count("categories", (q) => q.eq("is_active", true)),
        count("testimonials", (q) => q.eq("is_active", true).not("source", "is", null)),
        count("product_prices", (q) => q.eq("show_price", true).not("price_display", "is", null)),
        db().from("site_settings").select("show_prices").limit(1).maybeSingle(),
        count("product_media"),
        db().from("change_log").select("*").order("created_at", { ascending: false }).limit(8),
        db().from("site_publishes").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      setCounts({ on, off, categories, reviews, prices: settings.data?.show_prices ? prices : 0, films, master: settings.data?.show_prices ? 1 : 0 });
      setLog((recent.data ?? []) as LogRow[]);
      setPublish(lastPublish.data as PublishRow | null);
    })();
  }, []);

  if (!counts) return <Loading />;

  const tiles = [
    { label: "Products on website", value: counts.on, href: "/admin/products" },
    { label: "Hidden products", value: counts.off, href: "/admin/products" },
    { label: "Categories", value: counts.categories, href: "/admin/categories" },
    { label: "Reviews showing", value: counts.reviews, href: "/admin/reviews" },
    { label: counts.master ? "Prices showing" : "Prices: master switch off", value: counts.prices, href: "/admin/prices" },
    { label: "Films", value: counts.films, href: "/admin/films" },
  ];

  return (
    <>
      <PageHead title="Dashboard" intro="Everything on the website is managed here. Save your changes, then press Publish website at the top." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="acard block hover:border-ink">
            <p className="display tabular text-[32px] font-bold leading-none">{t.value}</p>
            <p className="mt-2 text-[14px] text-muted">{t.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="acard">
          <h2 className="mb-3 text-lg font-bold">How changes reach the website</h2>
          <ol className="list-decimal space-y-1.5 pl-5 text-[15px]">
            <li>Change something and press Save. It is stored at once.</li>
            <li>Press <strong>Publish website</strong> at the top. The site rebuilds in about 3 to 5 minutes.</li>
            <li>On this computer (localhost) saved changes show straight away when you refresh the page.</li>
          </ol>
          <p className="mt-3 text-[14px] text-muted">
            Last publish:{" "}
            {publish ? `${when(publish.created_at)}, ${publish.message ?? publish.status}` : "never"}
          </p>
        </section>
        <section className="acard">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent changes</h2>
            <Link href="/admin/activity" className="text-[14px] underline">All activity</Link>
          </div>
          {log.length === 0 && <p className="text-muted">No changes yet.</p>}
          <ul className="space-y-1.5 text-[14px]">
            {log.map((l) => (
              <li key={l.id} className="flex gap-2">
                <span className="w-[110px] shrink-0 text-muted">{when(l.created_at)}</span>
                <span className="min-w-0 truncate">
                  {tableNames[l.table_name] ?? l.table_name} {actionName(l.action)}
                  {l.summary ? `: ${l.summary}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="acard mt-5">
        <h2 className="mb-3 text-lg font-bold">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/edit?new=1" className="abtn">Add a product</Link>
          <Link href="/admin/prices" className="abtn">Show or hide prices</Link>
          <Link href="/admin/reviews" className="abtn">Add a review</Link>
          <Link href="/admin/categories" className="abtn">Edit categories</Link>
          <Link href="/admin/settings" className="abtn">Phone, email and address</Link>
        </div>
      </section>
    </>
  );
}
