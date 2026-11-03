# Routes

## Current routes

`/`, `/about`, `/products`, `/products/:slug`, `/services`, `/gallery`, `/contact`, `/privacy`, `/terms`, `/ai-discover`, `/admin/login`, `/admin/dashboard`

## V2 routes

| Route | Note |
|---|---|
| `/` | Direction A home |
| `/products` | All categories |
| `/products/:slug` | Keep all 37 current slugs |
| `/categories/:slug` | Category pages with clean slugs (7) |
| `/services` | Keep |
| `/about` | Keep |
| `/gallery` | Keep |
| `/reviews` | New, optional |
| `/dealers` | New |
| `/contact` | Salesforce form |
| `/ai-discover` | Full catalogue for AI crawlers |
| `/privacy`, `/terms` | Keep |
| `/admin/*` | Noindex |

Every route is built as a full static page, except admin.

## Redirects

Edit `web/redirects.txt` only. The build writes `web/public/_redirects` (Cloudflare Pages reads it) and adds the slash twin of each rule. See `../ops/url-hygiene.md`. Built 2026-11-03 from the old sitemap in `archive/old-site-seo/`: 33 of its 35 product addresses no longer exist and now redirect with 301.

- Model matches use HP, tank size or model code. EP550 is taken as the 0.75 HP class and EP750 as the 1 HP class. **Owner should check these guesses.**
- Where no model matches, the address goes to the nearest category, or `/products`.
- `/admin/login` and `/admin/dashboard` go to `/admin`.
- New site: no trailing slash. The old site forced a slash, so every old slash address is redirected in one hop. Not yet tested on Cloudflare.
- Fake URLs return a real 404.
