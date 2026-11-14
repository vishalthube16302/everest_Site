# What is left (updated 2026-11-13, second pass)

Items the owner skipped are left out on purpose: business name change, Apple Business Connect, YouTube,
LinkedIn, Wikidata, Justdial rating on the site, Hindi/Marathi native check, Cloudflare Markdown for Agents.

## Done today, for the record

- PR #19, #20, #21 merged and live: 110 pages, service pages, guides, Hindi and Marathi, sitemap dates
- Bing Webmaster Tools: site added, sitemap submitted, 100 URLs submitted, home page indexed
- Bing Places: listing imported from Google, verified, weekly sync on. Publishing takes 7 to 12 days
- Google Search Console: new sitemap read (110 pages); indexing requested for the repair page
- Yandex IndexNow accepted all 110 URLs

## Owner

- [ ] IndiaMART: rename the two pallet truck listings that show another brand
- [ ] IndiaMART, Justdial, everesthps.in: add the link `https://everesthps.com`, same hours and phone
- [ ] Justdial: change the old Chakan address to the Thermax Chauk address
- [ ] Google reviews: ask happy customers every few weeks, reply to every review
- [ ] Google Business Profile: add products with photos; post one update a week
- [x] Salesforce: Opportunity create access given to the site user (owner, 2026-11-13). Not yet tested on the live
      form: submit one real test enquiry and check it appears in Salesforce
- [ ] Admin panel: change the starting password (new rule: 10+ characters, upper case, lower case, a number)
- [ ] Optional: fill "Google and AI search" fields on your top products in the admin panel

## Claude: done 2026-11-13 (second pass)

- [x] Google indexing requested: repair, rent, second-hand, spare parts, installation, areas served, guides,
      `/hi`, `/mr`. The other pages are in the sitemap Google read (110 pages)
- [x] Google Business Profile edits approved: Maps shows `everesthps.com` and "Closes 7:30 pm"
- [x] Bing Places: "Pending publish" (Bing says 7 to 12 days), weekly Google sync on
- [x] GA4: `click_call`, `click_whatsapp`, `click_quote` marked as key events
- [x] Supabase admin passwords: minimum 10 characters with lower case, upper case and digits. The leaked-password
      check itself needs the Pro plan, so this is the free-plan alternative
- [x] Home page speed: hero photos served from the site (with phone sizes) instead of the database server.
      Lighthouse mobile: live 89 / LCP 1.4 s (the 2.0 s budget is met); new build 99 / LCP 0.8 s
- [x] IndexNow: new key. Bing had stored a failed check from before the first key went live. Builds now skip
      the ping while the key file is not live yet

## Claude, after the merge (PR #22)

- [x] IndexNow with the new key: Bing 202 and Yandex 202 for all 110 pages (2026-11-13)
- [x] Live Lighthouse mobile, two runs: 86 (LCP 1.5 s) and 77 (LCP 3.6 s). The hero photo loads in about
      0.7 s; the high run counts it at the end of its fade-in. Cloudflare's bot check script (`jsd/main.js`)
      adds about 0.4 s of script work. Google ranks on real-visitor data, which this site does not have enough
      traffic for yet
- [ ] In 7 to 12 days: check Bing Places shows "Published"

## Claude, share and polish (branch `feature/share-and-prod-ready`, 2026-11-13)

- [x] Share button on every product page (WhatsApp, Email, Send with photo on phones, Copy link); one 1200x630
      white-background image per product, made at build time (`web/scripts/build-share-images.mjs`, `sharp`)
- [x] Home scroll animations shorter (180vh phone, 200vh desktop); "Repair, rent and spare parts" strip on home;
      "Form not working? Use WhatsApp or call" line on contact; category pages: hidden "Models" heading
- [x] Checks: `tsc` clean, both builds pass, 110 sitemap URLs, share images step runs (74 products)
- [ ] After merge: Cloudflare build installs `sharp` and makes the share images
- [ ] After merge: test Share on the live site (WhatsApp preview shows one image); run live Lighthouse again

## Every month (first week)

- [ ] Run `seo-monthly.md`: Search Console, Bing, GA4, Cloudflare AI Crawl Control, the 20 AI questions.
      First run: early December 2026

