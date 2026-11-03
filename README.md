# Everest Hydro Pneumatic Solutions: website

Source for everesthps.com: the Next.js site, its admin panel, the database set-up and the media tools.

| Folder | What is in it |
|---|---|
| `web/` | The website and the admin panel (`/admin`). Next.js, static export. |
| `supabase/` | Database migrations and the two admin functions. Project: Everest V2. |
| `tools/` | Image and film tools used to prepare product media. |
| `docs/` | Project documents. Start with `docs/STATUS.md`. |

## Run it on your computer

```
cd web
npm install
copy .env.example .env.local     (then fill in the two Supabase values)
npm run dev
```

Open http://localhost:3000. The admin panel is at http://localhost:3000/admin.

## Publish settings (Cloudflare Pages)

Root directory `web`, build command `npm run build`, build output `out`, `NODE_VERSION` 22.
Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SITE_INDEXABLE`.
Details: `docs/ops/admin-panel.md` and `docs/ops/launch-checklist.md`.

## Rules

Read `CLAUDE.md`. The repo is public: no passwords, keys, customer data or product prices in any file.

## The old site

The previous Vite site was removed from this branch. It is kept in the tag `live-before-v2` and the branch `backup/main-before-v2`.
