// Publish button in the admin panel: asks the host to rebuild the site from the database.
// The build hook URL is a function secret (DEPLOY_HOOK_URL), never in the repo.
import { cors, json, requireAdmin, serviceClient } from "../_shared/admin.ts";

const WAIT_SECONDS = 90;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);

  const db = serviceClient();
  const user = await requireAdmin(req, db);
  if (user instanceof Response) return user;

  const { data: last } = await db
    .from("site_publishes")
    .select("created_at")
    .eq("status", "started")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last && Date.now() - new Date(last.created_at).getTime() < WAIT_SECONDS * 1000) {
    return json({ ok: false, status: "busy", message: "A publish has just started. Wait a minute and try again." });
  }

  const hook = Deno.env.get("DEPLOY_HOOK_URL");
  if (!hook) {
    const message = "Saved. The site host is not connected yet, so nothing was rebuilt.";
    await db.from("site_publishes").insert({ requested_by: user.email, status: "not_connected", message });
    return json({ ok: false, status: "not_connected", message });
  }

  let status = "failed";
  let message = "The host did not accept the rebuild. Try again in a few minutes.";
  try {
    const res = await fetch(hook, { method: "POST" });
    if (res.ok) {
      status = "started";
      message = "Publishing started. The site updates in about 3 to 5 minutes.";
    }
  } catch {
    // keep the failed message
  }
  await db.from("site_publishes").insert({ requested_by: user.email, status, message });
  return json({ ok: status === "started", status, message });
});
