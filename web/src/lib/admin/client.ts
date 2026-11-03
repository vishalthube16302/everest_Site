"use client";

// Browser client for the admin panel. Uses the publishable key; the database security rules
// (is_admin) decide what a signed-in user may change. No secret key is ever sent to the browser.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function db(): SupabaseClient {
  return (client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    { auth: { persistSession: true, autoRefreshToken: true, storageKey: "everest-admin" } },
  ));
}

export const BUCKET = "Product Images";

export function publicUrl(path: string) {
  return db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Calls an admin function (publish-site, manage-admins) and returns its JSON reply.
export async function callFunction<T>(name: string, body: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await db().functions.invoke(name, { body });
  if (error) {
    let message = error.message;
    try {
      const reply = await (error as { context?: Response }).context?.json();
      if (reply?.error) message = reply.error;
    } catch {
      // keep the generic message
    }
    throw new Error(message);
  }
  return data as T;
}

// Removals are written to the change log here (the log trigger covers adds and edits).
export async function logRemoval(table: string, id: unknown, summary?: string | null) {
  await db().rpc("log_removal", { p_table: table, p_row_id: String(id ?? ""), p_summary: summary ?? "" });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function errorText(error: unknown) {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  const e = error as { message?: string; details?: string; code?: string };
  if (e.code === "23505") return "That value is already used by another item. Use a different one.";
  if (e.code === "23503") return "Other items still use this. Move or remove them first.";
  return e.message ?? "Something went wrong.";
}
