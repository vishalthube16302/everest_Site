// Shared by the admin functions: CORS, JSON replies and the admin check.
import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

// Service client. It never leaves the function.
export function serviceClient(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Returns the signed-in admin, or a reply to send back.
export async function requireAdmin(req: Request, db: SupabaseClient): Promise<User | Response> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Please sign in again." }, 401);
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) return json({ error: "Please sign in again." }, 401);
  const { data: row } = await db.from("admins").select("id").eq("id", data.user.id).maybeSingle();
  if (!row) return json({ error: "This account is not an admin." }, 403);
  return data.user;
}
