"use client";

import { useCallback, useEffect, useState } from "react";
import { callFunction, db, errorText } from "@/lib/admin/client";
import { Badge, ConfirmButton, Field, Loading, PageHead, useAdmin } from "@/components/admin/kit";
import { when } from "@/lib/admin/labels";

type Admin = { id: string; email: string; role: string | null; created_at: string; last_sign_in_at: string | null; is_me: boolean };

export default function AdminLogins() {
  const { notify } = useAdmin();
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mine, setMine] = useState("");
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const reply = await callFunction<{ admins: Admin[] }>("manage-admins", { action: "list" });
      setAdmins(reply.admins);
    } catch (e) {
      notify(errorText(e), "error");
      setAdmins([]);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(body: Record<string, unknown>, after?: () => void) {
    setBusy(true);
    try {
      const reply = await callFunction<{ message: string }>("manage-admins", body);
      notify(reply.message);
      after?.();
      load();
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setBusy(false);
    }
  }

  if (!admins) return <Loading />;

  return (
    <>
      <PageHead title="Admin logins" intro="People who can sign in here. Every admin can change everything, so add only people you trust." />
      <section className="acard">
        <ul className="divide-y divide-line">
          {admins.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-[220px] flex-1">
                <p className="font-semibold">
                  {a.email} {a.is_me && <Badge tone="dark">You</Badge>}
                </p>
                <p className="text-[13px] text-muted">
                  Added {when(a.created_at)} · Last sign in {a.last_sign_in_at ? when(a.last_sign_in_at) : "never"}
                </p>
              </div>
              {!a.is_me && (
                <>
                  <button type="button" className="abtn abtn-sm" onClick={() => setResetFor(resetFor === a.id ? null : a.id)}>
                    Set password
                  </button>
                  <ConfirmButton disabled={busy} onConfirm={() => run({ action: "remove", id: a.id })}>Remove</ConfirmButton>
                </>
              )}
              {resetFor === a.id && (
                <form
                  className="flex w-full flex-wrap gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    run({ action: "set_password", id: a.id, password: resetPassword }, () => {
                      setResetFor(null);
                      setResetPassword("");
                    });
                  }}
                >
                  <input
                    className="ainput max-w-[280px]"
                    type="password"
                    autoComplete="new-password"
                    placeholder="New password, 10 characters or more"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                  />
                  <button className="abtn abtn-dark" disabled={busy}>Save password</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <form
          className="acard space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            run({ action: "add", email, password }, () => {
              setEmail("");
              setPassword("");
            });
          }}
        >
          <h2 className="text-lg font-bold">Add an admin</h2>
          <Field label="Email">
            <input className="ainput" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Starting password" help="10 characters or more. Share it privately; they can change it after signing in.">
            <input className="ainput" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <button className="abtn abtn-primary" disabled={busy}>Add admin</button>
        </form>

        <form
          className="acard space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (mine.length < 10) return notify("Use at least 10 characters.", "error");
            setBusy(true);
            const { error } = await db().auth.updateUser({ password: mine });
            setBusy(false);
            if (error) return notify(error.message, "error");
            setMine("");
            notify("Your password is changed.");
          }}
        >
          <h2 className="text-lg font-bold">Change my password</h2>
          <Field label="New password">
            <input className="ainput" type="password" autoComplete="new-password" value={mine} onChange={(e) => setMine(e.target.value)} />
          </Field>
          <button className="abtn abtn-dark" disabled={busy}>Change password</button>
        </form>
      </div>
    </>
  );
}
