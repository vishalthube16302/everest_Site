# One page, one address

Why: Search Console showed the old site twice. Source: Developer Brief, 3 Nov 2026 (sections 1 and 2). Only 13 of 158 known pages were indexed, and 74% of impressions went to `http://www.everesthps.com/`.

## What caused the double listing (old site, measured 2026-11-03)

| Cause | What the old site does |
|---|---|
| `https://www.` is a full copy | Answers 200 instead of redirecting |
| `http://www.` takes two steps | Goes to `https://www.`, never to the bare domain |
| Trailing slash | `/products` redirects 308 to `/products/`, and both were indexed |
| Query-string categories | `/products/?category=...` was indexed (103 impressions) |
| Made-up addresses | Answer 200, not 404 |
| Files counted as pages | `/logo.png`, `/favicon.svvg`, `/og-image` |

## The rule for the new site

One address per page: `https://everesthps.com/<path>`. https, no www, no trailing slash, no query string, lowercase.

## Done in code (every build)

- `trailingSlash: false`. Every internal link, canonical, sitemap line and structured-data link uses the same string (`abs()` in `src/lib/seo.ts`).
- `redirects.txt` is the only place to edit redirects. `scripts/build-redirects.mjs` writes `public/_redirects`, adds the slash twin of every rule, ends with `/*/ -> /:splat`, and stops the build on a chain, a loop or a repeated rule.
- Query strings: the canonical ignores them, so `/products?category=x` points to `/products`.
- `public/_headers` sets `noindex` on `*.pages.dev` and preview addresses, so they never become copies.
- `scripts/check-site.mjs` fails the build check on: canonical not https or with www, a slash, a query or not pointing at its own page; two pages with one canonical; sitemap and canonicals not the same list; an internal link with a slash, query, capitals or a missing target; a redirect that starts from a live page.
- A real `404.html`, so made-up addresses are not 200.

## Done on Cloudflare, once connected (cannot be in code)

1. Custom domain `everesthps.com` on the new Pages project. Add `www.everesthps.com` and set one **Redirect Rule**: host equals `www.everesthps.com`, 301 to `https://everesthps.com` plus the same path. This also covers `http://www`.
2. SSL/TLS: turn on **Always Use HTTPS** and **HSTS**. The rule above and this give `http://www.x` a single hop.
3. One **Redirect Rule** for the old query URLs: path is `/products` and query contains `category=`, 301 to `/products`. (`_redirects` cannot read query strings.) Map the old category names one by one if wanted.
4. Search Console: keep the Domain property, submit `https://everesthps.com/sitemap.xml`, and remove the old `http://` and `www` URL-prefix property sitemaps.

## Test (launch day, and again after one week)

`node web/scripts/check-hosts.mjs https://everesthps.com` sends 17 GET requests and checks that every variant (http, www, slash, old, cut-off, made-up) gives one 301 to the clean address and the target answers 200 at once. Run it first on the preview address with a temporary custom domain if possible. Then watch Search Console Pages for "Duplicate" and "Alternate page with proper canonical" reasons for 4 weeks.

## Not tested yet

`_redirects` slash rules, `/*/` and the `*.pages.dev` header have not run on Cloudflare. If `/products` and `/products/` loop on the host, remove the `/*/` line from the builder and test again.
