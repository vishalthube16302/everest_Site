# Action plan: everesthps.com

From the audit of 2026-11-16. Details in `FULL-AUDIT-REPORT.md`.

## Week 1 (high)

- [ ] Set `lang="hi"` / `lang="mr"` and add `hreflang` links on the 6 Hindi and Marathi pages. (Code)
- [ ] Speed up the home page: preload the hero image, delay the Google tag, trim unused JS. Target LCP under 2.5 s. (Code)
- [ ] Check Cloudflare Bot Fight Mode / JS detection; turn it off if not needed. (Owner, Cloudflare)
- [ ] Decide on product rich results: on-site reviews, or accept the Search Console warning. Record in `docs/DECISIONS.md`. (Owner)

## Weeks 2 to 3 (medium)

- [ ] Change the home H1 to say what and where; keep "Quiet power. Clean air." as a design line. (Code)
- [ ] Link each guide from its category and product pages. Add `/ai-discover` to the footer. (Code)
- [ ] Add 150 to 300 words to `/products`, `/services`, `/dealers`. Only claims from `docs/content/verified-facts.md`. (Content)
- [ ] Decide what to do with `www.everesthps.in`. (Owner)

## Month 2 (content and authority)

- [ ] Grow each guide to 700+ words with steps or a table.
- [ ] Add 2 to 3 new guides from real customer questions.
- [ ] Serve product images from the site domain.
- [ ] Keep up reviews and Google Business Profile posts (`ops/remaining-checklist.md`).

## Backlog (low)

- [ ] Shorten 16 long titles and the `/products` description.
- [ ] Remove spec-repeat questions from product FAQ schema.
- [ ] Turn off Cloudflare Email Obfuscation.
- [ ] Add `lastmod` to all sitemap entries; add width/height to 32 images.
