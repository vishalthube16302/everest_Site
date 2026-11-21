# SEO audit: everesthps.com

Date: 2026-11-16. Live site, 110 pages crawled (all pages in the sitemap). Lighthouse mobile run locally once (lab data). Google PageSpeed API quota was used up, so no field (CrUX) data.

## Score: 74 / 100

| Area | Score | Weight |
|---|---|---|
| Technical SEO | 82 | 22% |
| Content quality | 62 | 23% |
| On-page SEO | 80 | 20% |
| Schema | 72 | 10% |
| Speed (Core Web Vitals) | 60 | 10% |
| AI search readiness | 85 | 10% |
| Images | 78 | 5% |

Business type: local industrial supplier and service business (Pimpri-Chinchwad, Pune). Sells and repairs compressors, pallet trucks and stackers.

## What already works

- All 110 sitemap pages answer 200. No broken internal links.
- `www`, `http` and trailing-slash addresses all 301 to one clean address. Made-up pages answer a real 404.
- Every page has its own title, description and canonical. No duplicates. One H1 on every page.
- HTTPS with HSTS, nosniff, frame and referrer headers. `*.pages.dev` is noindex.
- robots.txt allows search and AI bots, blocks `/admin/`, lists the sitemap.
- `llms.txt` and `/ai-discover` give AI tools a clean summary.
- Schema on every page: Organization, LocalBusiness (address, geo, hours, areas), Product (74), BreadcrumbList, Article, Service.
- Lighthouse: accessibility 100, SEO 92, CLS 0.

## Findings

### High

1. **Hindi and Marathi pages say they are English.** `/hi`, `/mr` and their 4 sub-pages have `<html lang="en">` and no `hreflang` links. Google may treat them as odd English pages and not show them to Hindi or Marathi searchers. Fix: set `lang="hi"` / `lang="mr"` on those pages and add `hreflang` links (en, hi, mr, x-default) between the matching pages.
2. **Home page is slow on phones.** Lab LCP 4.2 s (good is under 2.5 s), TBT 430 ms, page weight 2.2 MB. Performance score 74. Biggest JavaScript: Google tag (73 KB unused) and two site chunks (~54 KB unused). A Cloudflare bot script (`/cdn-cgi/challenge-platform/`) also runs on every page. Fix: preload the hero image, load the Google tag after the page is usable, check whether Cloudflare Bot Fight Mode / JS detection is needed.
3. **Product schema cannot win product rich results.** Product data has no `offers`, `review` or `aggregateRating`. Google Search Console will list these 74 items as invalid for product snippets. This follows from the no-public-prices decision. Fix options: (a) add real, on-site product reviews with `review` / `aggregateRating`, or (b) accept it and note it in `docs/DECISIONS.md` so Search Console warnings are expected.

### Medium

4. **Thin pages.** Words in the main area: `/products` 57, `/contact` 78, `/dealers` 117, `/services` 157, `/hi` and `/mr` pages 150 to 220. The 5 guides are 244 to 296 words each, short for "how to" searches. Fix: add 150 to 300 useful words on `/products`, `/services`, `/dealers`; grow each guide to 700+ words with a table or steps.
5. **Home H1 has no keywords.** It reads "Quiet power. Clean air." The title is good, but the H1 is the strongest on-page signal. Fix: keep the line as a design, and make the real H1 say what you sell and where, e.g. "Air compressors and pallet trucks in Pune".
6. **Guides are hard to reach.** Each guide has only 1 internal link to it. `/ai-discover` has none (sitemap only). Fix: link each guide from the matching category and product pages ("Which size do I need?" to the sizing guide). Link `/ai-discover` from the footer.
7. **Second site competes for the brand.** `www.everesthps.in` is a separate live site ("Service Provider of Oil Free Air Compressor by Everest...") with its own canonical. It is listed in `sameAs`. It can take brand searches away from the main site. Fix: if the owner controls it, point its links to everesthps.com or redirect it. If not, keep it out of `sameAs`.
8. **Product images live on the Supabase address.** All product photos load from `gnnqwuwaojttcwfzdrko.supabase.co`. Image search credit goes to that address, and free plan traffic limits apply. Fix later: serve them through the site domain (Cloudflare) at build time.

### Low

9. 16 titles are over 60 characters (longest 69, the rent service page). `/products` description is 168 characters. Search results will cut them.
10. Product FAQ schema is on 97 pages and mostly repeats specs ("What is the tank capacity of..."). Google no longer shows FAQ rich results for business sites. Harmless, but keep the real questions and drop the spec repeats.
11. Cloudflare email hiding adds a link to `/cdn-cgi/l/email-protection` that answers 404. Turn off Email Obfuscation in Cloudflare (the email is public anyway).
12. Lighthouse flags `Content-Signal` in robots.txt as unknown. Google ignores it. No action, just expected.
13. 26 sitemap entries have no `lastmod`. 32 images have no width/height (CLS is still 0).
14. 245 images use empty alt text. Fine for decoration; check product card images have real alt text.

## Outside this audit

Live data (see `docs/ops/sales-plan.md`) shows 89 site visitors in 28 days. The site is technically sound. The bigger gap is authority: reviews, Google Business Profile activity and links from other sites. That work is in `ops/remaining-checklist.md`.
