// Admin logins: list, add, remove and reset passwords. Only an existing admin can call it.
import { cors, json, requireAdmin, serviceClient } from "../_shared/admin.ts";

type Body = { action?: string; email?: string; password?: string; id?: string };

const MIN_PASSWORD = 10;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);

  const db = serviceClient();
  const me = await requireAdmin(req, db);
  if (me instanceof Response) return me;

  const body = (await req.json().catch(() => ({}))) as Body;
  const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
  const users = list?.users ?? [];

  if (body.action === "list") {
    const { data: admins } = await db.from("admins").select("id,email,role,created_at").order("created_at");
    return json({
      admins: (admins ?? []).map((a) => {
        const u = users.find((x) => x.id === a.id);
        return { ...a, last_sign_in_at: u?.last_sign_in_at ?? null, is_me: a.id === me.id };
      }),
    });
  }

  if (body.action === "add") {
    const email = (body.email ?? "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Enter a valid email." }, 400);
    let user = users.find((u) => u.email?.toLowerCase() === email);
    if (!user) {
      if ((body.password ?? "").length < MIN_PASSWORD) {
        return json({ error: `Password must be at least ${MIN_PASSWORD} characters.` }, 400);
      }
      const { data, error } = await db.auth.admin.createUser({ email, password: body.password, email_confirm: true });
      if (error || !data.user) return json({ error: error?.message ?? "Could not create the login." }, 400);
      user = data.user;
    }
    const { error } = await db.from("admins").upsert({ id: user.id, email, role: "admin" });
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true, message: `${email} can now sign in to the admin panel.` });
  }

  if (body.action === "remove") {
    if (!body.id) return json({ error: "Missing admin." }, 400);
    if (body.id === me.id) return json({ error: "You cannot remove your own login." }, 400);
    const { count } = await db.from("admins").select("id", { count: "exact", head: true });
    if ((count ?? 0) <= 1) return json({ error: "Keep at least one admin." }, 400);
    const { error } = await db.from("admins").delete().eq("id", body.id);
    if (error) return json({ error: error.message }, 400);
    await db.auth.admin.deleteUser(body.id);
    return json({ ok: true, message: "Admin removed." });
  }

  if (body.action === "set_password") {
    if (!body.id) return json({ error: "Missing admin." }, 400);
    if ((body.password ?? "").length < MIN_PASSWORD) {
      return json({ error: `Password must be at least ${MIN_PASSWORD} characters.` }, 400);
    }
    const { error } = await db.auth.admin.updateUserById(body.id, { password: body.password });
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true, message: "Password changed." });
  }

  return json({ error: "Unknown action." }, 400);
});
