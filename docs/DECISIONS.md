# Decisions

Newest first. One line each, with the reason.

## 2026-11-03

- The old Vite site, its notes, an empty `backup.sql` and Python cache files were deleted from the repo (`chore/remove-old-code`). The old `llms.txt`, `robots.txt`, `sitemap.xml`, Googlebot script and SEO guide moved to `docs/archive/old-site-seo/` for Phase 4. Reason: owner wants no old or dead code before merging to `main`. The old code stays in tag `live-before-v2`. Because the live Cloudflare project still builds the repo root, merging this to `main` makes that build fail until the Cloudflare settings are switched to `web`; the live site keeps serving its last good deployment meanwhile.

- Design pass on every inner page, desktop and phone: shared page header (label, big title, intro, buttons, picture), numbered services, about with facts and a visit card, review score cards, dealer steps, contact with quick actions and map link, captioned gallery, category pages with a cover photo. Only approved facts were used. Reason: owner asked for a premium look on web and mobile.
- Phone tap targets are at least about 36 to 44 px: footer, breadcrumbs, menu and contact links were enlarged. Reason: small links are hard to tap.
- Scroll films on phones load every second frame (about 4 MB instead of 8 MB) and draw larger, with part names above the bottom bar. Reason: phone data and space. A true portrait cut is still not made.
- The enquiry form shows a Try again button as well as WhatsApp and phone when it does not load. Reason: Salesforce may only serve the form to trusted addresses, so it can fail on localhost and previews.

- Ranges are removed. The 7 categories are the only category level and every product sits directly under one. The 13 database ranges were merged into 7 `categories` rows; 6 were deleted. Old range addresses such as `/categories/hydraulic-hand-pallet-trucks` now return 404, which is safe because they were never live. Reason: owner asked for categories only. Unused: `category_groups`, `categories.group_id`, `categories.short_name`.
- The pallet film moved from the old hand-truck range to the 6 hand pallet trucks, so it no longer plays on the semi-electric trucks. Reason: it shows a hand pump; the category now also holds semi-electric and weighing-scale trucks.

- Admin panel built at `/admin` (`ops/admin-panel.md`). It manages products, photos, specs, prices, categories, reviews, services, films, gallery, company details, menu and admin logins. Reason: owner wants to manage as much as possible.
- Main categories, chip names, company details, ratings and the menu now come from the database, not code. Code values stay as fallbacks. Reason: so the admin can change them.
- Saves reach the live site through one **Publish website** button, not a rebuild per save. Reason: one rebuild for a batch of edits keeps within free build limits, and half-finished edits never go live.
- Every save is logged by a trigger; removals are logged by `log_removal()` from the panel. Reason: the connector declines delete triggers, and the owner needs to see unpublished changes.
- Public pages moved into `web/src/app/(site)/` so the admin has its own frame. URLs did not change.
- Local dev reads the database on every page view. Reason: admin saves show on refresh without a restart.

- On wide screens a spec list over 8 rows shows as two Parameter / Value pairs side by side, and the page spacing is tighter. Reason: the whole product must fit one screen at 100% zoom; tested down to 1280x620.
- The Salesforce enquiry form shows only on the contact page. Product and dealer pages link to it. Reason: owner's request, the form is slow to load.
- Product page main photo is not a link; arrows and thumbnails switch it. Reason: owner's request.
- Product page follows the old site's layout: photo gallery (arrows, clickable thumbnails) on the left; range, name, price, the full bordered spec table and quote buttons on the right, all on one screen for screenshots. Reason: owner's request.
- Every product photo is a link: home hero, dental and stacker photos go to their product or range, and gallery photos go to their product. Reason: owner's request.

- Home and products pages show 7 main categories, each grouping database ranges (`getMainCategories`). The 13 ranges stay as category pages, linked from chips. Reason: owner has 6 to 7 main categories. Grouping waits for approval (open question 12).
- Home hero is compact: no eyebrow line, smaller title, both machines staged together, and the numbers all on one screen. Reason: owner's feedback.
- Hero order is pallet truck left, compressor right. On load the truck rolls in from the left and the compressor from the right, each with a small settle, and the text rises in. Animation is off when the visitor asks for reduced motion. Reason: owner's request.
- Electric stacker block replaces the "Move 3,000 kg by hand" pallet block. Reason: owner asked for screw or stacker; the pallet truck already shows in the hero and the film. Numbers are from EES-15-30 in the database.

## 2026-11-02

- Home page shows both trial films as scroll-scrubbed sections after the hero (`web/src/components/ScrollFilm.tsx`). Frames are 120 JPGs at 1280x720 in `web/public/films/scroll/` (git-ignored, 8 MB). Local review only; phone needs a portrait cut. Reason: owner asked to see it on the home page.
- Trial exploded films are built in-house from cut-out parts (`tools/video/exploded`), not by an AI video tool. Reason: owner's request, and solid parts cannot melt and the logo cannot change.
- Compressor film uses the owner's ChatGPT exploded image for the tank and every moving part, and the new real photo only for the assembled look at the start. Reason: owner asked for that image, and the photo cut-out left white edges. Pistons and head shapes still need the owner's check.
- New site lives in `web/` on `feature/phase-3`. Reason: the old site's files stay untouched in the repo root.
- Static export (`output: export`), with redirects and headers in Cloudflare files. Reason: full static pages, as planned.
- `prebuild` clears `.next/cache/fetch-cache`. Reason: builds reused old data, so admin saves could fail to appear.
- Link prefetch is off. Reason: prefetch files failed on the static server, and phones save data.
- Site shows no product description text. Reason: it holds unapproved claims, such as 40-65 dB against a ≤70 dB spec, and "best".
- Services page shows titles only, and About shows approved facts only. Reason: database text says "best prices" and "trained engineers".
- "1 year warranty" is off the home page; it stays in specs where the database lists it. Reason: not on the approved list and not on all products.
- "Across India" is removed from the hero. Reason: only nearby delivery is confirmed.
- Compressor, dental and scale films link to one model, and the range page names that model. Reason: their on-screen numbers fit only that model.
- Pallet, motor and screw films stay on the whole range. Reason: their text fits every model in the range.
- Phase 3 database change split in two. Reason: the connector declines `drop policy` lines, so the owner runs part 2.
- Public `inquiries` insert is removed in part 2. Reason: leads go to Salesforce.

- Semi electric stackers show battery 12 V / 120 Ah, from the owner's listing. ESES-15-16 also gets loading centre, fork arm distance, ground clearance and lifting speed from the owner's poster. Reason: owner supplied the figures.
- The owner adds the battery pallet truck and air dryer from the admin panel after Phase 3.

- Work goes in feature branches, with a pull request into `redesign/v2`. `main` stays untouched until the owner's customer gives the final go-ahead. Reason: owner's rule.
- Cloudflare is connected only after that go-ahead, by the owner.
- Scale truck film ships as an 11 s cut from frames already rendered. The full render waits for the owner. Reason: owner asked to stop rendering and use what exists.
- The site is run locally for the owner to review before any hosting.

## 2026-11-01

- ui-ux-pro-max is not installed, so Direction A was checked by hand (contrast, states, type scale). Reason: avoids a blocked step.
- Screw film shows the principle with two meshing rotors and the range 3 to 30 HP at 8 bar, no CFM. Reason: no checked screw specs.
- Weight on the scale film is a sample load, captioned as such.
- Prices stay hidden, with an admin show or hide control. Reason: owner's choice, and enquiries bring leads.
- Add the extra ranges shown online to the catalogue. Reason: Google and IndiaMART already show them.
- Scale truck photo is the owner's own, so the retouched version stays.
- Home hero shows the portable silent compressor and yellow hand pallet truck. Reason: owner prefers them, and yellow suits animation.
- Screw compressors stay off the front. They remain a range on the site.
- Direction A Showroom chosen after comparing A, B and C.
- Make one film per main range, not 37 films. Reason: owner's request.
- Show only genuine reviews, from IndiaMART and Google. The 4 database testimonials stay unused.
- Show no other brand on the site. Reason: owner's rule.
- Pimpri-Chinchwad is the correct address. Chakan wording must go.
- Everest sells to dealers, so the dealer path stays.
- Films use a Chrome and ffmpeg renderer. Reason: free and easy to automate.
- Remotion is not used. Reason: Everest is above its free company size.
- Website animation uses Motion, which has an MIT licence.
- ui-ux-pro-max may be used as a design reference in Phase 2, after its scripts are read.
- Blender 3D is left out for now. Reason: cutaways show more for less work.
- Rebuild in Next.js with static pages. Reason: bots and customers get full pages at once.
- Everest V2 is a separate free Supabase project in Mumbai. Reason: keeps the live site safe, and tests showed faster queries from Pune.
- SEO and AI SEO come last, in Phase 4.
- The site goes live only after the whole site is finished and the owner approves.
- No backup of the live project is needed for this work, because it is not changed.
- Film and image tools live in the repo under `tools/`. Rendered films stay outside it. Reason: MP4 files are large and the repo is public.
- Films show the real product photo in plain steps, not 2D engineering diagrams. The pallet truck film shows the same truck three times: forks down, pumping, lifted. Reason: owner's feedback, the audience is ordinary buyers. `scene-hydraulic.html` is kept but unused.
- Product sticker is the owner's artwork, tagline "Engineering Power. Delivering Trust." Films use `tools/images/processed/everest-sticker.png`. `pallet-front.webp` has a garbled tagline and must not be published until fixed.
- Pallet truck film moves to a Blender 3D model. Reason: owner wants it realistic and premium, which a flat photo cannot give. This replaces the earlier decision to leave Blender out.
- Portable compressor film uses the first-round sample `everest-compressor.mp4` (12 s, photo based), not the 3D version. Reason: owner's choice. The 3D compressor render and `tools/blender/compressor.py` are kept unused.
- 3D film style approved and pallet truck model confirmed correct by the owner (2026-11-01). The compressor film stays as the first-round sample for now; owner wants a later version that shows more of the parts.
- Noise on the 2 HP compressor is ≤70 dB. ≤60 dB is only for the 0.75 HP and 1 HP models. Source: database.
- New range specs use the owner's spec posters where they differ from the everesthps.in listings. Reason: posters give real model numbers and full tables, and listings conflict with each other.
- Uploads and deletes on Everest V2 use a secret key kept outside the repo in the owner's user folder. Reason: the Supabase connector declines delete statements and has no upload tool, and this key cannot reach the live project.
- Owner approved the 61-image set. The red and black 0.9 HP motor is the owner's product, and the AI background photos stay. Reason: owner's review, 2026-11-01.
- Everest logo goes in the image corner on motor photos, not on the motor itself. Reason: owner wants the brand on every image, and a painted mark would show something the product does not carry.
- Spec-table posters and feature diagrams are left out of the image set. Reason: specs come from the database, and some posters conflict with it (for example noise figures), so they cannot be published.
- CE marks are removed from photos. Reason: no certification is confirmed.
- Phase 1 is complete. Phase 2 starts next.
- Owner ignores the remaining open questions. Delivery and installation are published as offered, not as free. Screw compressors are named by HP because no model numbers exist. Google review text is collected in Phase 3.
- Phase 4 SEO is built in code and stays blocked until `SITE_INDEXABLE=true`: robots.txt disallows everything and the sitemap is empty until then. Reason: owner rule, nothing indexed before launch.
- Structured data has no prices, no `offers` and no star ratings. Reason: prices stay hidden, and Google does not accept self-published ratings for a business. Product descriptions are built from the product's own specs.
- Old product addresses redirect to the nearest model by HP, tank size or model code, else to the category. Reason: keeps search value. The EP550 and EP750 matches are guesses for the owner to check.
- One reviewer's name "KULDIP Enterprises Chakan" is shown as "KULDIP Enterprises". Reason: owner rule, no Chakan wording anywhere. The review text is unchanged.
- The 4 old testimonials are switched off in Everest V2 (`is_active=false`), not deleted. Reason: reversible, and the site already hid them.
- Films, posters and scroll frames are read from `NEXT_PUBLIC_FILMS_BASE_URL` when set. Reason: lets the files sit outside git and on cheap storage.
- Site scans are scripts in `web/scripts/` (`check-site.mjs`, `check-access.mjs`) so they can run again before launch.
- One address per page: https, no www, no trailing slash, no query string. Reason: Search Console showed the old site twice (www and non-www, slash and no slash, query categories) and only 13 of 158 pages were indexed. Source: Developer Brief, 2026-11-03. Details in `ops/url-hygiene.md`.
- Redirects are written in `web/redirects.txt` and the build generates `public/_redirects` with slash twins. Reason: one place to edit, and the builder blocks chains and loops.
- `*.pages.dev` and preview addresses are noindex by header. Reason: they are full copies of the site.
- Brief items not used here: Chakan address, free installation and prices in schema conflict with `content/verified-facts.md`, so they stay out. Other brief items (new pages, blog, tracking) are outside this task.
- Google Search Console and Google Analytics live under the Everest company Google account, never a personal one. Check the signed-in account before setting up any Google tool. Date: 2026-11-03.
- Analytics: GA4 only, page views plus three click events (`click_call`, `click_whatsapp`, `click_quote`). Loads after the page is idle, on public pages only (not `/admin`). Google signals and ad personalisation are off. No name, phone or enquiry text is sent. Privacy page section 4 says so. No consent banner added; owner to confirm if one is needed. Date: 2026-11-03.
- Phase 6 (search growth) added: `phases/phase-6.md`. Based on the 2026-11-13 audit of Search Console, Cloudflare and the Google Business Profile. Date: 2026-11-13.
- 29 more real reviews (26 Google, 3 IndiaMART) added word for word, owner approved. Left out: owner-surname reviews, duplicate text under two names, a review of another brand's product. Details in `content/reviews.md`. Date: 2026-11-13.
- Opening hours are Mon to Sat, 9:00 AM to 7:30 PM (owner, 2026-11-13). Database, fallback and contact text updated.
- Product schema stays without price or rating. Google's product warning is accepted while prices are hidden. Ratings from Google or IndiaMART are not marked up, because Google does not accept ratings copied from other sites. Date: 2026-11-13.
- Service pages (repair, rent, second-hand, spare parts) are allowed: owner confirmed all are offered. One areas-served page, not one page per city, to avoid thin doorway pages. Date: 2026-11-13.
- Cloudflare Preview builds failed (no Supabase key). Added `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_FILMS_BASE_URL` to Preview. `SITE_INDEXABLE` stays unset there, so previews are not indexed. Date: 2026-11-13.
- No AMC for now (owner). Removed from the Business Profile and the plan. Rental covers large air compressors, hand pallet trucks and stackers. Date: 2026-11-13.
- Services rows in Everest V2 rewritten to the approved list: AMC and "Custom Solutions" were showing on the live Services page. Date: 2026-11-13.
- Content-Signal in `robots.txt` set to search, ai-input and ai-train all "yes": the goal is to be found and quoted by AI chat. `robots.ts` replaced by a route so the line can be written. Date: 2026-11-13.
- IndexNow runs after each live build and sends only pages whose visible text changed, using `indexnow-state.json` published with the site. The key is public by design. Date: 2026-11-13.
- Sitemap `lastmod` postponed: owner declined adding `updated_at` columns. Build dates would be wrong signals, so none are sent. Date: 2026-11-13.
- Justdial rating not shown on the site (owner: not important). Date: 2026-11-13.
- Service pages are written in code (`web/src/lib/service-pages.ts`), not the admin `services` table, so wording can be checked against the approved facts. The Services page no longer reads the table; admin edits there do not show. Date: 2026-11-13.
- Service pages make no claim on price, response time, warranty or AMC. FAQ answers use only approved facts plus general compressor know-how. Date: 2026-11-13.
- Maps links on Contact and About open the Google Business Profile (place id), not an address search, so visitors land on our reviews. Date: 2026-11-13.
- No PR until the owner asks; one PR for the day's changes (owner, 2026-11-13).
- Category guides, guides and the glossary are written in code (`category-guides.ts`, `guides.ts`), from general know-how plus approved facts. Product text is built from database specs only. Date: 2026-11-13.
- `check-site` now runs after every build (`postbuild`), before IndexNow. A failed check fails the Cloudflare build, so a broken or thin page never replaces the live site. Thin means under 300 words on product, category, service and guide pages. Date: 2026-11-13.
- Hindi and Marathi pages are drafts by Claude: noindex, not in the sitemap, no hreflang, until a native speaker checks them. One switch per language (`live`) in `lang-pages.ts`. Date: 2026-11-13.
- No PR until the owner asks. Today's work stays on `feature/phase-6-day-2026-11-13`. Date: 2026-11-13.
- Hindi and Marathi pages are for search only (owner): indexed, in the sitemap, footer links, not in the menu, no native check. Date: 2026-11-13.
- SEO review used the claude-seo skill checklists (MIT) read from a downloaded copy; their scripts and hooks were not run, and installing them was blocked by the safety check. Findings in `ops/seo-review-2026-11-13.md`. Date: 2026-11-13.
- FAQ answers are always visible, not in accordions. HSTS (1 year, no preload), X-Frame-Options and Permissions-Policy added. No Content-Security-Policy yet: it could break the Salesforce form and Analytics. Date: 2026-11-13.
- Cloudflare Markdown for Agents needs the Pro plan; not bought. Date: 2026-11-13.
