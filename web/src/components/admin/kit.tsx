"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { listImages, uploadImage } from "@/lib/admin/image";

// ---- Shared admin state: messages and the "unpublished changes" count ----

type Toast = { id: number; text: string; kind: "ok" | "error" };

export type AdminContextValue = {
  email: string;
  notify: (text: string, kind?: "ok" | "error") => void;
  changed: () => void;
};

export const AdminContext = createContext<AdminContextValue>({ email: "", notify: () => {}, changed: () => {} });

export function useAdmin() {
  return useContext(AdminContext);
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((text: string, kind: "ok" | "error" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 8000 : 3500);
  }, []);
  const view = (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex max-w-[380px] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className={`rounded-xl px-4 py-3 text-[14px] font-semibold shadow-lg ${
            t.kind === "error" ? "bg-brand text-white" : "bg-ink text-white"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
  return { notify, view };
}

// ---- Layout pieces ----

export function PageHead({ title, intro, actions }: { title: string; intro?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display text-[30px] font-bold leading-tight md:text-[36px]">{title}</h1>
        {intro && <div className="mt-1 max-w-[70ch] text-[15px] text-muted">{intro}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Loading({ text = "Loading..." }: { text?: string }) {
  return <p className="py-10 text-center text-muted">{text}</p>;
}

export function Badge({ children, tone = "grey" }: { children: React.ReactNode; tone?: "grey" | "red" | "green" | "dark" }) {
  const tones = {
    grey: "bg-ground text-muted",
    red: "bg-[#fde8e8] text-brand",
    green: "bg-[#e3f4e8] text-[#17623a]",
    dark: "bg-ink text-white",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${tones[tone]}`}>{children}</span>;
}

// ---- Form pieces ----

export function Field({
  label,
  help,
  wide,
  children,
}: {
  label: string;
  help?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-[13px] font-semibold">{label}</span>
      {children}
      {help && <span className="mt-1 block text-[12px] leading-snug text-muted">{help}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-[14px] font-semibold disabled:opacity-50"
    >
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-[#17623a]" : "bg-line-strong"}`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
      {label}
    </button>
  );
}

// Asks once more before a removal. Second click within 4 seconds confirms.
export function ConfirmButton({
  onConfirm,
  children = "Remove",
  confirmText = "Click again to remove",
  className = "abtn abtn-sm abtn-danger",
  disabled,
}: {
  onConfirm: () => void | Promise<void>;
  children?: React.ReactNode;
  confirmText?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${className} ${armed ? "!bg-brand !text-white" : ""}`}
      onClick={async () => {
        if (!armed) {
          setArmed(true);
          timer.current = window.setTimeout(() => setArmed(false), 4000);
          return;
        }
        window.clearTimeout(timer.current);
        setArmed(false);
        await onConfirm();
      }}
    >
      {armed ? confirmText : children}
    </button>
  );
}

// ---- Images ----

export function ImageField({
  value,
  onChange,
  fit = true,
  name,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  fit?: boolean;
  name?: string;
}) {
  const { notify } = useAdmin();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [library, setLibrary] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      onChange(await uploadImage(file, { fit, name }));
      notify("Photo uploaded. Remember to save.");
    } catch (e) {
      notify((e as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="flex h-[96px] w-[128px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-ground">
        {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : <span className="text-[12px] text-muted">No photo</span>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="abtn abtn-sm" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? "Uploading..." : "Upload photo"}
          </button>
          <button type="button" className="abtn abtn-sm" onClick={() => setLibrary(true)}>Choose uploaded</button>
          {value && (
            <button type="button" className="abtn abtn-sm" onClick={() => onChange(null)}>Clear</button>
          )}
        </div>
        <p className="text-[12px] text-muted">
          {fit ? "Placed on a white 1200 x 900 background, saved as WebP." : "Saved as WebP, up to 1600 px."}
        </p>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) upload(file);
        }}
      />
      {library && (
        <ImageLibrary
          onClose={() => setLibrary(false)}
          onPick={(url) => {
            onChange(url);
            setLibrary(false);
          }}
        />
      )}
    </div>
  );
}

export function ImageLibrary({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<{ name: string; url: string }[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => {
    listImages().then(setItems).catch((e) => setError((e as Error).message));
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const shown = (items ?? []).filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div role="dialog" aria-modal="true" aria-label="Uploaded photos" className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-[960px] flex-col rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-lg font-bold">Uploaded photos</h2>
          <input className="ainput max-w-[260px]" placeholder="Search by file name" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
          <button type="button" className="abtn abtn-sm ml-auto" onClick={onClose}>Close</button>
        </div>
        {error && <p className="text-brand">{error}</p>}
        {!items && !error && <Loading />}
        <div className="grid grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5 md:grid-cols-6">
          {shown.map((i) => (
            <button
              key={i.name}
              type="button"
              title={i.name}
              onClick={() => onPick(i.url)}
              className="overflow-hidden rounded-lg border border-line bg-ground hover:border-ink"
            >
              <img src={i.url} alt={i.name} loading="lazy" className="aspect-[4/3] w-full object-contain" />
              <span className="block truncate px-1 py-0.5 text-[11px] text-muted">{i.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
