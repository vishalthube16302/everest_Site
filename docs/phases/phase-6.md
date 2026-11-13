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
- [x] Description rewritten: products, services (repair, rent, second-hand, spare parts, AMC), areas
- [x] Categories added: Equipment rental agency, Industrial equipment supplier, Hydraulic equipment supplier
- [x] 11 services added (rent, second-hand, spare parts, installation and AMC, product lines, lifting tables, scale pallet trucks)
- [ ] Owner: add products with photos, post one update a week, reply to every review
- [ ] Owner: business name stays as is for now (owner, 2026-11-13)

Owner, elsewhere:
- [ ] everesthps.in, IndiaMART, Justdial: link to `https://everesthps.com`, same hours and phone
- [ ] Rename the two IndiaMART pallet truck listings that show another brand
- [ ] Decide the one business name to use everywhere (see open question)

Claude, in code:
- [x] Rebuilt the live site (Cloudflare retry deployment, 2026-11-13): 29 new reviews and hours live
- [ ] Commit the 7:30 PM text in code (contact page description still says 6:30 until then)
- [ ] Cloudflare: turn on Content Signals and Markdown for Agents (free)
- [ ] IndexNow key file and a ping on every publish (Bing, Yandex, no login)
- [ ] Share image (og:image) on home and every main page
- [ ] `lastmod` dates in the sitemap
- [ ] Justdial rating on the reviews page

## Step 2: Pages people already search for (weeks 2 to 3)

New pages, each with a short direct answer at the top, an FAQ and a quote button:
- [ ] Air compressor repair and servicing, Pune and Pimpri-Chinchwad
- [ ] Air compressor on rent
- [ ] Second-hand air compressors
- [ ] Compressor spare parts (filters, valves, motors, oil)
- [ ] Installation and AMC
- [ ] Areas served page from the Business Profile list (Pune, Mumbai, Nashik, Satara and others). One page, not a page per city, until we have real work in each city.

## Step 3: Better product and category pages (weeks 3 to 5)

- [ ] Product pages to 400+ words: who it is for, where it is used, how to choose, FAQ. Specs from the database only.
- [ ] Category pages: buying guide and FAQ with FAQPage schema
- [ ] Comparison inside our range (oil-free vs reciprocating, which HP for which use)
- [ ] Reviews that name a product shown on that product page
- [ ] Admin fields for meta title, description and FAQ per product
- [ ] Publish check stops on missing title, thin text or broken schema

## Step 4: AI search (GEO) (weeks 4 to 6)

- [ ] Guides that answer real questions: what size compressor, oil-free vs oil, how to maintain, why a compressor will not start, pallet truck capacity
- [ ] Glossary: CFM, LPM, bar, dB, duty cycle, oil-free
- [ ] Clear facts block on About: founded 2020, location, what we make, sell and service
- [ ] Organization schema with `sameAs` links to Google, IndiaMART, Justdial, Instagram, Facebook
- [ ] Keep `llms.txt` and `/ai-discover` up to date with the new pages
- [ ] Wikidata entry for the company
- [ ] YouTube: upload the product films with descriptions and chapters

## Step 5: Hindi and Marathi (weeks 6 to 8)

- [ ] Hindi and Marathi versions of home, services, repair, rent and top categories
- [ ] `hreflang` links between languages
- [ ] Owner or a native speaker checks every page

## Step 6: Measure every month

- [ ] Search Console: clicks, new queries, pages not indexed
- [ ] Bing Webmaster: owner signs up later, imports from Search Console
- [ ] GA4: enquiries, calls and WhatsApp by source, including AI chat
- [ ] Cloudflare AI Crawl Control: which bots read which pages
- [ ] Ask the same 20 questions in ChatGPT, Gemini and Perplexity. Note if Everest is named.

## Rules

Only facts in `../content/verified-facts.md`. No other brand. No prices in schema. Reviews word for word.

## Finished when

Non-brand clicks grow each month, the new service pages rank in the top 3 locally, and AI chat names Everest for Pune compressor questions.
