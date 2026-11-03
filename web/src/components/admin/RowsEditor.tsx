"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { db, errorText, logRemoval } from "@/lib/admin/client";
import { Badge, ConfirmButton, Field, ImageField, Loading, Toggle, useAdmin } from "./kit";

export type Row = Record<string, unknown> & { id: string | number };

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "bool" | "image" | "photo" | "select" | "date" | "url";
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  wide?: boolean;
};

type Props = {
  table: string;
  fields: FieldDef[];
  select?: string;
  // Rows are shown in this order and the arrows change it. Leave empty for tables without one.
  orderKey?: string | null;
  title: (row: Row) => string;
  subtitle?: (row: Row) => string | null | undefined;
  thumb?: (row: Row) => string | null | undefined;
  hiddenKey?: string;
  defaults?: Record<string, unknown>;
  addLabel?: string;
  emptyText?: string;
  filter?: (row: Row) => boolean;
  // Return a message to stop a removal, or null to allow it.
  canRemove?: (row: Row) => Promise<string | null> | string | null;
  beforeRemove?: (row: Row) => Promise<void>;
  validate?: (row: Row) => string | null;
  onSaved?: () => void;
  extra?: (row: Row, reload: () => void) => React.ReactNode;
};

const NEW = "__new";

function clean(def: FieldDef, value: unknown) {
  if (def.type === "bool") return Boolean(value);
  if (def.type === "number") return value === "" || value === null || value === undefined ? null : Number(value);
  if (typeof value === "string") {
    const v = value.trim();
    return v === "" ? null : v;
  }
  return value ?? null;
}

export function RowsEditor(props: Props) {
  const { notify, changed } = useAdmin();
  const { table, fields, orderKey = "sort_order", hiddenKey } = props;
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<string | number | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Row>>({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    let q = db().from(table).select(props.select ?? "*");
    if (orderKey) q = q.order(orderKey, { ascending: true, nullsFirst: false });
    q = q.order("created_at", { ascending: true });
    const { data, error } = await q;
    if (error) return notify(errorText(error), "error");
    setRows((data ?? []) as unknown as Row[]);
  }, [table, props.select, orderKey, notify]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const shown = useMemo(() => (rows ?? []).filter((r) => (props.filter ? props.filter(r) : true)), [rows, props]);

  const draftFor = (row: Row): Row => drafts[String(row.id)] ?? row;
  const setField = (row: Row, key: string, value: unknown) =>
    setDrafts((d) => ({ ...d, [String(row.id)]: { ...draftFor(row), [key]: value } }));
  const dirty = (row: Row) => {
    const d = drafts[String(row.id)];
    if (!d) return false;
    return fields.some((f) => JSON.stringify(clean(f, d[f.key])) !== JSON.stringify(clean(f, row[f.key])));
  };

  function startNew() {
    const nextOrder = orderKey ? Math.max(0, ...(rows ?? []).map((r) => Number(r[orderKey]) || 0)) + 10 : undefined;
    const row: Row = { id: NEW, ...(props.defaults ?? {}), ...(orderKey ? { [orderKey]: nextOrder } : {}) };
    setDrafts((d) => ({ ...d, [NEW]: row }));
    setOpen(NEW);
  }

  async function save(row: Row) {
    const d = draftFor(row);
    for (const f of fields) {
      if (f.required && clean(f, d[f.key]) === null) return notify(`${f.label} is needed.`, "error");
    }
    const problem = props.validate?.(d);
    if (problem) return notify(problem, "error");
    const patch: Record<string, unknown> = {};
    for (const f of fields) patch[f.key] = clean(f, d[f.key]);
    if (orderKey && row.id === NEW) patch[orderKey] = d[orderKey] ?? patch[orderKey];
    if (row.id === NEW) for (const [k, v] of Object.entries(props.defaults ?? {})) if (!(k in patch)) patch[k] = v;
    setBusy(true);
    const res =
      row.id === NEW
        ? await db().from(table).insert(patch).select("id").single()
        : await db().from(table).update(patch).eq("id", row.id).select("id").single();
    setBusy(false);
    if (res.error) return notify(errorText(res.error), "error");
    setDrafts((ds) => {
      const next = { ...ds };
      delete next[String(row.id)];
      return next;
    });
    if (row.id === NEW) setOpen((res.data as { id: string }).id);
    notify("Saved.");
    await load();
    changed();
    props.onSaved?.();
  }

  async function remove(row: Row) {
    if (row.id === NEW) {
      setDrafts((d) => {
        const next = { ...d };
        delete next[NEW];
        return next;
      });
      setOpen(null);
      return;
    }
    const stop = await props.canRemove?.(row);
    if (stop) return notify(stop, "error");
    setBusy(true);
    try {
      await props.beforeRemove?.(row);
      const { error } = await db().from(table).delete().eq("id", row.id);
      if (error) throw error;
      await logRemoval(table, row.id, props.title(row));
      notify("Removed.");
      setOpen(null);
      await load();
      changed();
      props.onSaved?.();
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setBusy(false);
    }
  }

  async function move(row: Row, step: -1 | 1) {
    if (!orderKey) return;
    const list = shown;
    const i = list.findIndex((r) => r.id === row.id);
    const other = list[i + step];
    if (!other) return;
    // Renumber the visible list so every row has its own place.
    const order = list.map((r) => r.id);
    [order[i], order[i + step]] = [order[i + step], order[i]];
    setBusy(true);
    const results = await Promise.all(
      order.map((id, n) => {
        const target = (n + 1) * 10;
        const current = list.find((r) => r.id === id)?.[orderKey];
        return Number(current) === target ? null : db().from(table).update({ [orderKey]: target }).eq("id", id);
      }),
    );
    setBusy(false);
    const failed = results.find((r) => r && r.error);
    if (failed?.error) notify(errorText(failed.error), "error");
    await load();
    changed();
    props.onSaved?.();
  }

  async function quickToggle(row: Row, value: boolean) {
    if (!hiddenKey) return;
    const { error } = await db().from(table).update({ [hiddenKey]: value }).eq("id", row.id);
    if (error) return notify(errorText(error), "error");
    notify(value ? "Now showing on the website." : "Hidden from the website.");
    await load();
    changed();
    props.onSaved?.();
  }

  if (!rows) return <Loading />;

  const newDraft = drafts[NEW];
  const list: Row[] = newDraft && open === NEW ? [newDraft, ...shown] : shown;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[14px] text-muted">{shown.length} {shown.length === 1 ? "item" : "items"}</p>
        <button type="button" className="abtn abtn-primary" onClick={startNew} disabled={open === NEW}>
          {props.addLabel ?? "Add"}
        </button>
      </div>
      {list.length === 0 && <p className="acard text-muted">{props.emptyText ?? "Nothing here yet."}</p>}
      <ul className="space-y-2">
        {list.map((row, i) => {
          const d = draftFor(row);
          const isOpen = open === row.id;
          const isNew = row.id === NEW;
          const thumb = props.thumb?.(d);
          const hidden = hiddenKey ? !row[hiddenKey] : false;
          return (
            <li key={String(row.id)} className={`rounded-2xl border bg-white ${isOpen ? "border-ink" : "border-line"}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                {props.thumb && (
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ground">
                    {thumb ? <img src={thumb} alt="" className="h-full w-full object-contain" /> : null}
                  </div>
                )}
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setOpen(isOpen ? null : row.id)} aria-expanded={isOpen}>
                  <span className="block truncate font-semibold">{isNew ? "New item" : props.title(d) || "(no name)"}</span>
                  {props.subtitle?.(d) && <span className="block truncate text-[13px] text-muted">{props.subtitle(d)}</span>}
                </button>
                {hidden && <Badge tone="red">Hidden</Badge>}
                {dirty(row) && <Badge tone="dark">Not saved</Badge>}
                {!isNew && hiddenKey && (
                  <Toggle checked={!hidden} onChange={(v) => quickToggle(row, v)} label="On site" disabled={busy} />
                )}
                {!isNew && orderKey && (
                  <span className="flex gap-1">
                    <button type="button" className="abtn abtn-sm px-2.5" aria-label="Move up" disabled={busy || i === 0} onClick={() => move(row, -1)}>↑</button>
                    <button type="button" className="abtn abtn-sm px-2.5" aria-label="Move down" disabled={busy || i === list.length - 1} onClick={() => move(row, 1)}>↓</button>
                  </span>
                )}
                <button type="button" className="abtn abtn-sm" onClick={() => setOpen(isOpen ? null : row.id)}>
                  {isOpen ? "Close" : "Edit"}
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-line px-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {fields.map((f) => (
                      <FieldInput key={f.key} def={f} value={d[f.key]} onChange={(v) => setField(row, f.key, v)} />
                    ))}
                  </div>
                  {!isNew && props.extra?.(row, load)}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button type="button" className="abtn abtn-primary" disabled={busy || (!isNew && !dirty(row))} onClick={() => save(row)}>
                      {isNew ? "Add" : "Save"}
                    </button>
                    {!isNew && dirty(row) && (
                      <button
                        type="button"
                        className="abtn"
                        onClick={() =>
                          setDrafts((ds) => {
                            const next = { ...ds };
                            delete next[String(row.id)];
                            return next;
                          })
                        }
                      >
                        Undo changes
                      </button>
                    )}
                    <span className="flex-1" />
                    {isNew ? (
                      <button type="button" className="abtn" onClick={() => remove(row)}>Cancel</button>
                    ) : (
                      <ConfirmButton onConfirm={() => remove(row)} disabled={busy} />
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FieldInput({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const text = value === null || value === undefined ? "" : String(value);
  const wide = def.wide ?? (def.type === "textarea" || def.type === "image" || def.type === "photo");
  if (def.type === "bool") {
    return (
      <div className={wide ? "sm:col-span-2" : ""}>
        <Toggle checked={Boolean(value)} onChange={onChange} label={def.label} />
        {def.help && <p className="mt-1 text-[12px] text-muted">{def.help}</p>}
      </div>
    );
  }
  if (def.type === "image" || def.type === "photo") {
    return (
      <div className={wide ? "sm:col-span-2" : ""}>
        <span className="mb-1 block text-[13px] font-semibold">{def.label}</span>
        <ImageField value={(value as string) || null} onChange={onChange} fit={def.type === "image"} />
        {def.help && <p className="mt-1 text-[12px] text-muted">{def.help}</p>}
      </div>
    );
  }
  return (
    <Field label={def.label + (def.required ? " *" : "")} help={def.help} wide={wide}>
      {def.type === "textarea" ? (
        <textarea className="ainput min-h-[110px]" value={text} placeholder={def.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : def.type === "select" ? (
        <select className="ainput" value={text} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose...</option>
          {def.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          className="ainput"
          type={def.type === "number" ? "number" : def.type === "date" ? "date" : def.type === "url" ? "url" : "text"}
          value={text}
          placeholder={def.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}
