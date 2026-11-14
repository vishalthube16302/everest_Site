# Monthly search check (Phase 6 step 6)

Do this in the first week of each month. Write the numbers in the table at the end. Baseline is 2026-11-13.

## 1. Google Search Console (Everest account, `/u/2/`)

- Performance, last 28 days: clicks, impressions, average position. Filter queries that do not contain "everest" for non-brand clicks.
- New queries: services pages (repair, rent, second-hand, spare parts) and guides.
- Query filters (Add filter, Query, Custom (regex)):
  - Non-brand ("Doesn't match regex"): `everest|evrest|hps|hydro ?pneumatic`
  - Buying words: `price|\brate\b|\brent|hire|second ?hand|\bused\b|repair|servic|near me|dealer|manufactur|pune|pimpri|chinchwad|bhosari|chakan`
  - Model sizes: `\d+(\.\d+)? ?(hp|l|ltr|ton|kg|mm|cfm|lpm)\b`
  - Questions, every 3 months: `(?i)^(who|what|when|where|why|how|which|is|are|can|does|do|should|will|kya|kaise|kaun|kitna|kab|kahan)\b|\?`
- Pages, "Crawled, currently not indexed": product pages should drop now that they have 480+ words.
- Enhancements: Product snippets, FAQ, Breadcrumbs. No new errors.

## 2. Bing Webmaster (after the owner signs up)

- Import the site from Search Console. Check the IndexNow tab shows our pings after each publish.

## 3. Google Analytics (G-2LYEDVVDGQ)

- Enquiries, call clicks and WhatsApp clicks by source.
- AI chat visits: Reports, Acquisition, Traffic acquisition, filter source containing `chatgpt`, `perplexity`, `gemini`, `copilot`, `claude`.

## 4. Cloudflare AI Crawl Control

- Which AI bots read the site and which pages. Nothing should be blocked.

## 4b. Sales numbers (see `sales-plan.md`)

- Google profile Performance: calls, chats, directions, website clicks.
- IndiaMART response rate.
- Enquiries and orders by source, from "Where did you find us?".

## 5. AI answers test

Ask each question in ChatGPT, Gemini and Perplexity (signed out or private window). Note Yes if Everest is named or linked.

1. Air compressor repair in Pimpri-Chinchwad
2. Air compressor service near Thermax Chowk Pune
3. Air compressor on rent in Pune
4. Pallet truck on rent in Pune
5. Stacker on rent in Pune
6. Second-hand air compressor in Pune
7. Air compressor spare parts in Pimpri-Chinchwad
8. Oil-free silent air compressor supplier in Pune
9. Dental compressor supplier in Pune
10. Screw air compressor dealer in Pune
11. Hand pallet truck supplier in Pimpri-Chinchwad
12. Weighing scale pallet truck in Pune
13. Hydraulic lifting table supplier in Pune
14. Compressor motor oil-free supplier Maharashtra
15. What size air compressor do I need for a workshop?
16. Oil-free vs oil-lubricated compressor for a dental clinic
17. Why will my air compressor not start?
18. Who is Everest Hydro Pneumatic Solutions?
19. Air compressor dealer in Nashik
20. Air compressor dealer in Mumbai

## Log

| Month | Clicks | Non-brand clicks | Impressions | Avg position | Indexed pages | AI answers naming Everest (of 60) |
|---|---|---|---|---|---|---|
| 2026-11 (baseline) | 79 in 3 months | few | 4.92K in 3 months | 6.5 | 61 | not yet tested |
