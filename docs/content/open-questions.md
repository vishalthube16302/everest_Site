# Open questions

Delete an item once it is answered and record the answer in the right file.

## For the owner

| # | What | Needed by |
|---|---|---|
| 1 | Review the six films in `everest_redesign_samples/web-ready/` | Close of Phase 2 |
| 2 | Battery operated pallet truck and refrigerated air dryer: owner adds them from the admin panel once the site is built | After Phase 3 |
| 3 | Google review text (owner will supply later) | Phase 3 |
| 4 | Cloudflare: owner connects the `redesign/v2` branch after the customer's go-ahead | After go-ahead |
| 6 | Supply or approve product description text. All 74 long descriptions stay hidden; 37 use words like "best" or "100%" | Before launch |
| 7 | Approve services and About wording (AMC, repair, spare parts and custom solutions are not on the approved list, though their titles show) | Before launch |
| 8 | Admin login: which email to use. Owner sets the password | Admin build |
| 9 | Add the preview address in Salesforce (or `http://localhost:4173` for a local test), under CORS allowed origins | Before form test |
| 10 | Films are not in the repo, so a Cloudflare build will not have them. Choose R2 or another upload step | Before preview |
| 11 | Turn off public sign-ups in Supabase Auth for Everest V2 | Before admin testing |
| 12 | Approve the 7 categories (set in the admin panel, Categories): silent compressors, pallet trucks, stackers and lifting tables, dental and lab, screw, reciprocating (with air receivers), compressor motors. Products sit directly under them; there are no ranges. | Owner | Open |

Answered: semi electric stacker battery is 12 V / 120 Ah (owner's listing and poster, 2026-11-02). The old `service_role` key stays as it is, by the owner's choice. Full scale film render skipped for now.

Answered earlier: installation and nearby delivery are offered (see `verified-facts.md`). Screw specs use HP names and no CFM. Lift table EMLT-1000-17 minimum height is 500 mm.

## To check during work

- Confirm hosting in the Cloudflare dashboard.
- Confirm branch protection and deploy settings on GitHub.
- Check whether the Salesforce form accepts the preview domain.
- Check the full wording of Blender's licence if 3D is requested later.

## Search visibility note

Google's AI Overview mixed in details from everestpump.co.in, which appears to be a different company. Clear company data in Phase 4 should help, but no result is guaranteed.

## Phase 6 (2026-11-13)

| # | Question | Needed for |
|---|---|---|
| 13 | (Skipped by owner 2026-11-13, keep "Everest" in the name.) One business name everywhere? Google says "EVEREST Air Compressor & Material Handling Equipment", the site, IndiaMART and Justdial say "Everest Hydro Pneumatic Solutions". Google prefers the registered name. | Business Profile, schema |
| 14 | (Answered 2026-11-13: no check needed, the pages are for search only.) | Phase 6 step 5 |
| 15 | Bing Webmaster done by Claude 2026-11-13. Bing Places: owner, needs a Microsoft or Facebook login | Phase 6 |
| 16 | Apply `ops/pending-db-seo-fields.sql` in Supabase (sitemap dates, admin SEO fields)? | Phase 6 step 3 |
