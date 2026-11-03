# Phase 4: SEO, AI SEO and testing

**Goal:** The site is found, understood, fast and safe.

## SEO and AI SEO

- [x] Unique title, description and canonical on every page (`web/src/lib/seo.ts`)
- [x] Sitemap and robots.txt built automatically; blocked until `SITE_INDEXABLE=true`
- [x] Real 404 pages
- [x] Old-to-new URL redirects from `web/redirects.txt` (owner to review the guesses, see `../architecture/routes.md`)
- [x] One address per page: no slash, no query, canonical checks, `*.pages.dev` noindex (`../ops/url-hygiene.md`)
- [ ] Cloudflare host rules (www, https, HSTS) and `check-hosts.mjs` on the real host, after Cloudflare is connected
- [x] Organization, LocalBusiness, Product and BreadcrumbList data, no prices
- [x] `llms.txt` built from the database at each build; catalogue page has its own title and description
- [x] Chakan wording removed from the site (`node web/scripts/check-site.mjs`)
- [x] Banned claims and brands scan passes on all built pages

## Testing

- [~] Lighthouse mobile on slow 4G run on 4 pages. Real phones not tested
- [ ] LCP over budget in the lab (3.3 to 4.1 s against 2.0 s). CLS 0 and JS 141 KB pass. INP not measured
- [~] Automated checks pass (`web/scripts/check-access.mjs`, Lighthouse accessibility 98 to 100). A real keyboard and screen reader pass is still to do
- [x] Anonymous users cannot read leads, admin data or hidden prices (checked 2026-11-03). No price rows exist yet, so a visible price is still untested
- [ ] Enquiry reaches Salesforce from every form
- [x] WhatsApp and phone links are correct on all pages (format only; a tap on a phone is still to do)
- [ ] Admin edits reach the site after a rebuild

- [x] Film hosting, code part: films read from `NEXT_PUBLIC_FILMS_BASE_URL` (`../ops/film-hosting.md`)
- [x] The 4 old testimonials are disabled in Everest V2

## Finished when

All checks pass and the owner approves the final site.
