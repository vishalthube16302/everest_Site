# Phase 6: Search growth (SEO and AI search)

**Goal:** More enquiries from Google, Bing and AI chat (ChatGPT, Gemini, Perplexity, Claude).
Started 2026-11-13 after an audit of the live site, Search Console, Cloudflare and the Google Business Profile.

## Where we start (2026-11-13)

- 79 clicks in 3 months, almost all for our own name. 4.9K views, average position 6.5.
- 61 pages indexed. Some product pages crawled and not indexed: thin text (150 to 290 words).
- "Compressor" and "air compressor" show at position 6 to 9 with 0 clicks.
- "Near me" searches for repair, service, rent, spare parts and dealers show at 1 to 3, but we have no page for them.
- Hindi and Marathi searches exist (कंप्रेसर मशीन, एअर कॉम्प्रेसर).
- AI bots (GPTBot, Perplexity, Claude, Apple, Amazon) read the site. None blocked. Cloudflare AI score 3 of 5.
- Product schema has no price, review or rating, so no rich results. Prices stay hidden.

## Step 1: Quick fixes (week 1)

Google Business Profile (done by Claude in the owner's browser 2026-11-13, pending Google review):
- [x] Website: `https://everesthps.com` (was `http://www.`)
- [x] Hours: Mon to Sat, 9:00 AM to 7:30 PM
- [x] Description rewritten: products, services (on-site repair, rent, second-hand, spare parts), areas. AMC removed 2026-11-13
- [x] Categories added: Equipment rental agency, Industrial equipment supplier, Hydraulic equipment supplier
- [x] 13 services added (compressor rent, pallet truck and stacker rent, second-hand, spare parts, installation and on-site servicing, product lines, lifting tables, scale pallet trucks)
- [ ] Owner: add products with photos, post one update a week, reply to every review
- [ ] Owner: business name stays as is for now (owner, 2026-11-13)

Owner, elsewhere:
- [ ] everesthps.in, IndiaMART, Justdial: link to `https://everesthps.com`, same hours and phone
- [ ] Rename the two IndiaMART pallet truck listings that show another brand
- [ ] Decide the one business name to use everywhere (see open question)

Claude, in code:
- [x] Rebuilt the live site (Cloudflare retry deployment, 2026-11-13): 29 new reviews and hours live
- [x] 7:30 PM text in code (PR #19)
- [x] Services list in Everest V2 fixed: AMC and "Custom Solutions" removed; now sales, installation, on-site repair and servicing, spare parts, on rent, second-hand (2026-11-13)
- [x] Services and reviews descriptions, `llms.txt` services line match the approved facts
- [x] Content Signals line in `robots.txt` (search, AI answers and training all allowed)
- Cloudflare Markdown for Agents: needs the Pro plan, skipped (checked 2026-11-13)
- [x] IndexNow: key file and `scripts/indexnow.mjs` after each live build; sends only pages whose text changed
- [x] Share image `img/og-default.jpg` (from `tools/images/og_image.py`) on every page without its own photo, plus large Twitter/X card
- [x] Organization and LocalBusiness `sameAs`: Google Maps, IndiaMART, Justdial, Facebook, Instagram, everesthps.in. Map pin and `hasMap`. Footer "Find us on" links. Maps buttons open the Google profile
- [x] `lastmod` in the sitemap from real `updated_at` dates (owner applied the database change 2026-11-13; migration `20261113120000_phase6_updated_at_seo_fields.sql`). `priority` removed: Google ignores it
- Justdial rating on the reviews page: skipped (owner, 2026-11-13)

## Step 2: Pages people already search for (weeks 2 to 3)

New pages, each with a short direct answer at the top, an FAQ and a quote button:
- [x] Air compressor repair and on-site servicing, Pune and Pimpri-Chinchwad
- [x] On rent: large air compressors, hand pallet trucks and stackers
- [x] Second-hand air compressors
- [x] Compressor spare parts
- [x] Installation (no AMC page: owner not offering AMC for now)
- [x] Areas served page from the Business Profile list (11 places). One page, not a page per city.
- [x] Services page cards link to these pages; sitemap and `llms.txt` list them. Service, FAQPage and Breadcrumb schema on each
- Content lives in `web/src/lib/service-pages.ts` (code, not admin). Built 2026-11-13, not yet merged

## Step 3: Better product and category pages (weeks 3 to 5)

- [x] Product pages to 400+ words (now 482 to 805): about the model from its specs, who it is for, where used, how to choose, reviews, FAQ with FAQPage schema. Guide text in `web/src/lib/category-guides.ts`
- [x] Category pages: buying guide, matching reviews, FAQ with FAQPage schema
- [x] Comparison: guides "Oil-free vs oil-lubricated" and "What size air compressor do I need"
- [x] Reviews that name a product type shown on its category and product pages (word for word)
- [x] Admin panel, product editor, "Google and AI search": search title, search description, questions and answers (shown first on the product page, FAQ schema)
- [x] Every build runs `check-site` (titles, descriptions, canonicals, JSON-LD, thin pages under 300 words). A failed check stops the publish, so the live site keeps the last good version

## Step 4: AI search (GEO) (weeks 4 to 6)

- [x] 5 guides at `/guides` (sizing, oil-free vs oil, maintenance checklist, will not start, choosing a pallet truck) with Article and FAQPage schema
- [x] Glossary of 15 terms at `/guides#glossary` with DefinedTermSet schema
- [x] Quick facts block on About
- [x] `sameAs` links to Google, IndiaMART, Justdial, Facebook, Instagram, everesthps.in
- [x] `llms.txt` lists services, areas, guides, glossary and profiles (built automatically)
- [ ] Wikidata entry for the company (owner's go-ahead needed)
- [ ] YouTube: upload the product films with descriptions and chapters (owner's channel needed)

## Step 5: Hindi and Marathi (weeks 6 to 8)

- [x] Hindi and Marathi pages: `/hi`, `/hi/air-compressor-repair`, `/hi/rent` and the same under `/mr`. Text in `web/src/lib/lang-pages.ts`. For search only (owner): indexed, in the sitemap, linked from the footer, not in the menu
- [x] `hreflang` links (en, hi, mr, x-default) on the home, repair and rent pages
- Native check skipped by the owner: pages are for search, not visitors (2026-11-13)

## Step 6: Measure every month

- [x] Monthly routine written: `../ops/seo-monthly.md` (Search Console, Bing, GA4, Cloudflare, 20 AI questions, log table)
- [ ] First monthly check: early December 2026
- [x] Bing Webmaster Tools: imported from Search Console, sitemap submitted, home page indexed (2026-11-13)
- [ ] Bing Places: owner (needs a Microsoft or Facebook login)
- [ ] GA4 monthly: enquiries, calls and WhatsApp by source, including AI chat (steps in the routine)
- [ ] Cloudflare AI Crawl Control monthly: which bots read which pages
- [ ] Monthly: ask the same 20 questions (list in the routine) in ChatGPT, Gemini and Perplexity. Note if Everest is named.

## Review 2026-11-13

- [x] AI crawler access verified for 18 bots; review with the claude-seo checklists: `../ops/seo-review-2026-11-13.md`. Fixes: visible FAQ answers, guide dates, city in category titles, areaServed, WebSite schema, HSTS, shorter home title, alt text on category and film images, title length check

## Rules

Only facts in `../content/verified-facts.md`. No other brand. No prices in schema. Reviews word for word.

## Finished when

Non-brand clicks grow each month, the new service pages rank in the top 3 locally, and AI chat names Everest for Pune compressor questions.
