# Phase 3: Build the site

**Goal:** A complete site on a private preview link.

## Tasks

- [ ] Commit the Everest V2 baseline migrations (written, not committed)
- [x] Add the price tables and settings from `../architecture/data-model.md`
- [x] Replace old security rules (owner ran part 2, checked 2026-11-02)
- [x] Add new categories and products to Everest V2 (done in Phase 2: 74 products, 13 ranges)
- [x] Create the Next.js app in `web/` (on `feature/phase-3`, not merged to `redesign/v2`)
- [x] Build all public pages in `../architecture/routes.md`
- [x] Build the admin pages (2026-11-03, `../ops/admin-panel.md`)
- [ ] Reuse the Salesforce enquiry form (code done; Salesforce blocks localhost, so not proven)
- [x] Rebuild the admin panel, including the price control (tested signed in as admin and as non-admin)
- [x] Create the new admin login (2026-11-03, same email as the old site; owner changes the starting password)
- [ ] Connect admin saves to an automatic site rebuild (Publish button and `publish-site` function done; needs the Cloudflare build hook)
- [x] Owner reviewed the site locally (2026-11-02): not premium enough, hero text too big, needs motion and running numbers
- [ ] Premium design pass on all public pages, from the owner's review (home, products and product pages done 2026-11-03; scroll films on home; other pages next)
- [ ] Set up a noindex Cloudflare preview, only after the owner connects `redesign/v2`
- [ ] Add the preview domain in Salesforce if needed
- [x] Add WhatsApp links with the product name filled in

## Needs from the owner

- Cloudflare access
- Salesforce access, or help adding the preview domain

## Finished when

The owner can test the whole site and admin panel on the preview link.
