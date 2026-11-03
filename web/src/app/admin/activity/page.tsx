"use client";

import { useEffect, useState } from "react";
import { db, errorText } from "@/lib/admin/client";
import { Badge, Loading, PageHead, useAdmin } from "@/components/admin/kit";
import { actionName, tableNames, when } from "@/lib/admin/labels";

type LogRow = { id: number; table_name: string; action: string; summary: string | null; actor_email: string | null; created_at: string };
type PublishRow = { id: number; status: string; message: string | null; created_at: string; requested_by: string | null };

export default function AdminActivity() {
  const { notify } = useAdmin();
  const [log, setLog] = useState<LogRow[] | null>(null);
  const [publishes, setPublishes] = useState<PublishRow[]>([]);
  const [table, setTable] = useState("");

  useEffect(() => {
    (async () => {
      let q = db().from("change_log").select("*").order("created_at", { ascending: false }).limit(300);
      if (table) q = q.eq("table_name", table);
      const [l, p] = await Promise.all([q, db().from("site_publishes").select("*").order("created_at", { ascending: false }).limit(20)]);
      if (l.error) return notify(errorText(l.error), "error");
      setLog(l.data as LogRow[]);
      setPublishes((p.data ?? []) as PublishRow[]);
    })();
  }, [table, notify]);

  if (!log) return <Loading />;

  return (
    <>
      <PageHead title="Activity" intro="Every save, with who made it. Use it to check what changed before you publish." />
      <div className="grid items-start gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="acard">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Changes</h2>
            <select className="ainput max-w-[220px]" value={table} onChange={(e) => setTable(e.target.value)} aria-label="Type">
              <option value="">Everything</option>
              {Object.entries(tableNames).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          {log.length === 0 && <p className="text-muted">Nothing yet.</p>}
          <ul className="divide-y divide-line text-[14px]">
            {log.map((l) => (
              <li key={l.id} className="grid gap-1 py-2 sm:grid-cols-[120px_1fr_auto]">
                <span className="text-muted">{when(l.created_at)}</span>
                <span className="min-w-0">
                  <strong>{tableNames[l.table_name] ?? l.table_name}</strong> {actionName(l.action)}
                  {l.summary ? `: ${l.summary}` : ""}
                </span>
                <span className="truncate text-muted">{l.actor_email ?? "set-up"}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="acard">
          <h2 className="mb-3 text-lg font-bold">Publishes</h2>
          {publishes.length === 0 && <p className="text-muted">No publishes yet.</p>}
          <ul className="divide-y divide-line text-[14px]">
            {publishes.map((p) => (
              <li key={p.id} className="py-2">
                <span className="flex items-center gap-2">
                  <span className="text-muted">{when(p.created_at)}</span>
                  <Badge tone={p.status === "started" ? "green" : p.status === "failed" ? "red" : "grey"}>
                    {p.status === "started" ? "Started" : p.status === "failed" ? "Failed" : "Host not connected"}
                  </Badge>
                </span>
                <span className="block text-muted">{p.requested_by}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
