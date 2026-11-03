"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { callFunction, db, errorText } from "@/lib/admin/client";
import { AdminContext, Loading, useToasts } from "./kit";

const menu = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/prices", label: "Prices" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/films", label: "Films" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Company and menu" },
  { href: "/admin/admins", label: "Admin logins" },
  { href: "/admin/activity", label: "Activity" },
];

type State = "loading" | "signed-out" | "not-admin" | "ready" | "recovery";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState("");
  const { notify, view } = useToasts();

  useEffect(() => {
    const check = async (session: Session | null) => {
      if (!session) return setState("signed-out");
      setEmail(session.user.email ?? "");
      const { data } = await db().rpc("is_admin");
      setState(data ? "ready" : "not-admin");
    };
    db().auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = db().auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setState("recovery");
      else if (event === "SIGNED_IN" || event === "SIGNED_OUT") check(session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (state === "loading") return <Frame><Loading /></Frame>;
  if (state === "signed-out") return <Frame>{view}<SignIn notify={notify} /></Frame>;
  if (state === "recovery") return <Frame>{view}<NewPassword notify={notify} onDone={() => setState("ready")} /></Frame>;
  if (state === "not-admin")
    return (
      <Frame>
        <div className="acard mx-auto mt-16 max-w-[420px] text-center">
          <p className="font-semibold">{email} is not an admin.</p>
          <p className="mt-1 text-muted">Ask an existing admin to add you under Admin logins.</p>
          <button type="button" className="abtn mt-4" onClick={() => db().auth.signOut()}>Sign out</button>
        </div>
      </Frame>
    );

  return <Panel email={email} notify={notify} toasts={view}>{children}</Panel>;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-ground px-4 py-10">
      <img src="/img/logo-red.png" alt="Everest" width={1474} height={325} className="mx-auto h-10 w-auto" />
      {children}
    </div>
  );
}

function SignIn({ notify }: { notify: (t: string, k?: "ok" | "error") => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "reset">("sign-in");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "sign-in") {
      const { error } = await db().auth.signInWithPassword({ email: email.trim(), password });
      if (error) notify(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message, "error");
    } else {
      const { error } = await db().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) notify(error.message, "error");
      else notify("If this email is an admin, a reset link is on its way.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="acard mx-auto mt-10 max-w-[400px] space-y-4">
      <h1 className="display text-[26px] font-bold">{mode === "sign-in" ? "Admin sign in" : "Reset password"}</h1>
      <label className="block">
        <span className="mb-1 block text-[13px] font-semibold">Email</span>
        <input className="ainput" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {mode === "sign-in" && (
        <label className="block">
          <span className="mb-1 block text-[13px] font-semibold">Password</span>
          <input
            className="ainput"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      )}
      <button className="abtn abtn-primary w-full" disabled={busy}>
        {busy ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Send reset link"}
      </button>
      <button type="button" className="text-[14px] text-muted underline" onClick={() => setMode(mode === "sign-in" ? "reset" : "sign-in")}>
        {mode === "sign-in" ? "Forgot password?" : "Back to sign in"}
      </button>
    </form>
  );
}

function NewPassword({ notify, onDone }: { notify: (t: string, k?: "ok" | "error") => void; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="acard mx-auto mt-10 max-w-[400px] space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (password.length < 10) return notify("Use at least 10 characters.", "error");
        setBusy(true);
        const { error } = await db().auth.updateUser({ password });
        setBusy(false);
        if (error) return notify(error.message, "error");
        notify("Password changed.");
        onDone();
      }}
    >
      <h1 className="display text-[26px] font-bold">Choose a new password</h1>
      <input className="ainput" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="abtn abtn-primary w-full" disabled={busy}>Save password</button>
    </form>
  );
}

type Publish = { status: string; message: string | null; created_at: string; requested_by: string | null };

function Panel({
  email,
  notify,
  toasts,
  children,
}: {
  email: string;
  notify: (t: string, k?: "ok" | "error") => void;
  toasts: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname().replace(/\/$/, "") || "/admin";
  const [pending, setPending] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const refresh = useCallback(async () => {
    const { data: last } = await db()
      .from("site_publishes")
      .select("created_at")
      .eq("status", "started")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<Publish>();
    let q = db().from("change_log").select("id", { count: "exact", head: true });
    if (last) q = q.gt("created_at", last.created_at);
    const { count } = await q;
    setPending(count ?? 0);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  async function publish() {
    setPublishing(true);
    try {
      const reply = await callFunction<{ ok: boolean; status: string; message: string }>("publish-site");
      notify(reply.message, reply.ok || reply.status === "not_connected" ? "ok" : "error");
      refresh();
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setPublishing(false);
    }
  }

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <AdminContext.Provider value={{ email, notify, changed: refresh }}>
      <div className="min-h-svh bg-ground md:grid md:grid-cols-[230px_1fr]">
        <aside className="border-b border-line bg-surface md:sticky md:top-0 md:h-svh md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 py-4">
            <Link href="/admin" aria-label="Admin home">
              <img src="/img/logo-red.png" alt="Everest" width={1474} height={325} className="h-8 w-auto" />
            </Link>
            <button type="button" className="abtn abtn-sm md:hidden" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              Menu
            </button>
          </div>
          <nav aria-label="Admin" className={`${menuOpen ? "block" : "hidden"} px-3 pb-4 md:block`}>
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active(item.href) ? "page" : undefined}
                className="block rounded-lg px-3 py-2 text-[15px] font-medium hover:bg-ground aria-[current=page]:bg-ink aria-[current=page]:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-line px-3 pt-4 text-[13px] text-muted">
              <p className="truncate" title={email}>{email}</p>
              <a href="/" target="_blank" rel="noreferrer" className="mt-2 block underline">Open website</a>
              <button type="button" className="mt-2 underline" onClick={() => db().auth.signOut()}>Sign out</button>
            </div>
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-30 flex flex-wrap items-center justify-end gap-3 border-b border-line bg-ground/95 px-4 py-3 backdrop-blur md:px-8">
            <p className="text-[14px] text-muted">
              {pending === null
                ? ""
                : pending === 0
                  ? "Website is up to date."
                  : `${pending} saved ${pending === 1 ? "change" : "changes"} not yet on the live website.`}
            </p>
            <button type="button" className="abtn abtn-dark" disabled={publishing} onClick={publish}>
              {publishing ? "Publishing..." : "Publish website"}
            </button>
          </div>
          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>
      {toasts}
    </AdminContext.Provider>
  );
}
