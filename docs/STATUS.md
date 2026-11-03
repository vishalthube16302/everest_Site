# Status

Updated: 2026-11-03

**Current phase:** Phase 3 in progress. Public site built in `web/` and running locally. Committed on `feature/phase-3` on 2026-11-03, waiting for the owner to merge into `redesign/v2`.

**Next step:** Owner approves the 7 categories (open question 12), tests the admin panel locally and changes the starting password. Then the design pass on the other pages. Phases 4 and 5 stay paused.

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

## Where work lives outside the repo

Folder: `D:\Shared Folder\Work Data\Website\everest_redesign_samples\`

- Sample films and the retouched scale truck photo
- `tools/video`: film renderer
- `tools/images`: image scripts and processed images

The tools now live in the repo under `tools/video` and `tools/images`. Rendered films stay outside the repo.

Design canvas: https://claude.ai/artifact/EmitbY6bTkJgvNsfUNW4Yi (private to the owner)
