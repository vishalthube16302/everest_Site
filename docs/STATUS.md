# Status

Updated: 2026-11-13

**Phase 6 (2026-11-13): search growth, SEO and AI search.** PR #19, #20, #21 merged and live (110 pages). Bing Webmaster and Bing Places set up, sitemaps submitted to Google and Bing. What is left: `ops/remaining-checklist.md`.

**Share and polish (2026-11-13, branch `feature/share-and-prod-ready`, pushed, no PR yet):** product Share button, build-time share images, shorter scroll, services strip. Salesforce Opportunity access given by the owner; live form test still to do. Owner left: Google reviews, Google Business Profile posts and products (`ops/remaining-checklist.md`).

**LIVE since 2026-11-03.** `main` holds the new site and everesthps.com serves it from Cloudflare project `everest-site` (root `web`, output `out`, Everest V2 data). Old deployment kept for rollback. Search Console Domain property and Google Analytics both belong to the Everest Google account (everesthps@gmail.com), not a personal one. Domain verified by DNS TXT, sitemap submitted. GA4 stream `G-2LYEDVVDGQ`, loaded by `web/src/components/Analytics.tsx` when `NEXT_PUBLIC_GA_ID` is set (Cloudflare Production). check-hosts passes 17/17. Films hosted on Cloudflare project `everest-films` (see ops/film-hosting.md) and verified on the live home and product pages. **Enquiry form failed on the live site (checked 2026-11-03; owner gave Opportunity access 2026-11-13, retest needed):** submit returns "Access to entity 'Opportunity' denied" from Salesforce, so no lead is created. Fix is on the Salesforce side (guest or site user needs create access to Opportunity, or the Lightning Out app needs the new domain allowed). Not a site-code issue. Open: HTTPS/HSTS and Supabase leaked-password setting, admin password, Salesforce form test, mark call/WhatsApp events as key events in GA4, LCP over budget.

**Earlier phase note:** Phase 3 in progress. Public site built in `web/` and running locally. Committed on `feature/phase-3` on 2026-11-03, waiting for the owner to merge into `redesign/v2`.

**Next step:** Owner reviews the Phase 4 work (redirect guesses, speed) and approves the 7 categories (open question 12). LCP is over budget in the lab and needs a decision. Phase 5 (launch) waits for the owner's go-live word.

**Blocked by:** Owner's review of the trial. The enquiry form cannot be tested until Salesforce accepts a site address. See `content/open-questions.md`.

**Branches:** Phase 3 work is on `feature/phase-3`, cut from `docs/status-2026-11-02`. `redesign/v2` holds Phases 1 and 2 (PR #13 merged into it). `main` and the live site are untouched. Merge to `main` only after the owner's customer gives the final go-ahead. Cloudflare is not connected.

## Done

- Branch `redesign/v2` created from `origin/main`.
- Everest V2 Supabase project created in Mumbai with 7 tables of data copied and checked.
- Design Direction A chosen.
- Two first-round sample films made.
- Scale truck photo retouched.
- Owner's content answers recorded.
- This document set written.
- Film and image tools copied into `tools/`.
- Pallet truck film rebuilt in Blender 3D with the owner sticker. Motion preview made (`tools/blender`, `tools/video/compose.mjs`). Full-HD render not yet run.
- Image set built with `tools/images/build_v2.py`: 158 files reduced to 61 retouched images, 1200x900, 4.1 MB. Owner approved, uploaded and linked in Everest V2.
- 37 new products added to Everest V2: now 74 products in 13 ranges, 125 images, no links to live storage, no other brand names.
- Design tokens finished: contrast checked, type scale, states, spacing (`design/tokens.md`).
- Six films made with web files: pallet truck, compressor, dental, motor, screw, scale truck. The scale film is an 11 s cut from frames already rendered.
- Film hosting plan written (`ops/film-hosting.md`). Nothing connected.
- PR #13 (`feature/phase-1-2` into `redesign/v2`) merged on 2026-11-02.
- Baseline migration rebuilt from V2 and saved in `supabase/migrations/`. Not tested on a fresh database.
- V2 updated: `product_prices`, `show_prices`, `public_prices()`, `is_active`, `product_media`, review columns, 6 IndiaMART reviews, clean range slugs.
- Public site built in `web/`: 13 ranges, 74 products, all public routes in `architecture/routes.md`. All 37 live product URLs kept.
- Part 2 security rules applied by the owner and checked on 2026-11-02.
- Owner reviewed the local site: design is not premium enough yet.
- Checked: scan for banned claims and brands, page width at 390 and 320 px, film playback, site navigation, a real 404, and a hidden price staying hidden.
- Not checked: a price showing with both switches on, and the Salesforce form. Home JavaScript is 174 KB, over the 170 KB budget.
- Admin panel built at `/admin` (2026-11-03): products, photos, specs, prices, categories, reviews, services, films, gallery, company details, menu, admin logins, activity, and a Publish button. Database changes in `supabase/migrations/20261103090000_phase3_admin_panel.sql`; functions `publish-site` and `manage-admins` deployed. Build passes. A non-admin test login cannot change anything. Owner admin login created (same email as the old site) and tested: all 11 pages open, adds, edits, logging, removal log, admin list and Publish work. Publish reports "host not connected" until Cloudflare is connected. Owner should change the starting password.
- Trial exploded films made for the pallet truck and portable compressor, with a local scroll test. Files are in `everest_redesign_samples/flow-trial/final/`. See `media/video-status.md`. Owner has not reviewed them yet.

- Phase 4 code built (2026-11-03, not committed): titles, descriptions and canonicals on every page; sitemap, robots.txt and `llms.txt` built automatically and blocked until `SITE_INDEXABLE=true`; 33 redirects in `web/public/_redirects`; Organization, LocalBusiness, Product and BreadcrumbList data without prices; film address setting `NEXT_PUBLIC_FILMS_BASE_URL`; the 4 old testimonials disabled in Everest V2; Chakan removed from one reviewer name.
- Phase 4 checks run: claims and brands scan passes on 93 pages; anonymous visitors cannot read leads, admins, change log or prices, and cannot write; WhatsApp and phone links correct. Lighthouse mobile (slow 4G, lab): performance 86 to 93, accessibility 98 to 100, CLS 0, JS 141 KB. **LCP 3.3 to 4.1 s is over the 2.0 s budget.** Home page weighs 2.1 MB against 1.2 MB. Not done: real phones, a real screen reader pass, INP, a visible price test (no price rows exist), the Salesforce form, redirects on the real host.

- Duplicate-address fix built (2026-11-03, not committed), from the Developer Brief: one address per page, redirects generated from `web/redirects.txt` with slash twins, 10 extra old addresses mapped, `*.pages.dev` noindex, stricter scans, `web/scripts/check-hosts.mjs`. The old site fails 15 of 17 of those checks (www answers 200, slash forced, made-up pages answer 200). New build scans pass. Cloudflare host rules and the live host test wait for Cloudflare. See `ops/url-hygiene.md`.

## Where work lives outside the repo

Folder: `D:\Shared Folder\Work Data\Website\everest_redesign_samples\`

- Sample films and the retouched scale truck photo
- `tools/video`: film renderer
- `tools/images`: image scripts and processed images

The tools now live in the repo under `tools/video` and `tools/images`. Rendered films stay outside the repo.

Design canvas: https://claude.ai/artifact/EmitbY6bTkJgvNsfUNW4Yi (private to the owner)
