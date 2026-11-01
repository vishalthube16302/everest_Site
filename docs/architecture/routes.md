# Routes

## Current routes

`/`, `/about`, `/products`, `/products/:slug`, `/services`, `/gallery`, `/contact`, `/privacy`, `/terms`, `/ai-discover`, `/admin/login`, `/admin/dashboard`

## V2 routes

| Route | Note |
|---|---|
| `/` | Direction A home |
| `/products` | All ranges |
| `/products/:slug` | Keep all 37 current slugs |
| `/categories/:slug` | New range pages with clean slugs |
| `/services` | Keep |
| `/about` | Keep |
| `/gallery` | Keep |
| `/reviews` | New, optional |
| `/dealers` | New |
| `/contact` | Salesforce form |
| `/ai-discover` | Full catalogue for AI crawlers |
| `/privacy`, `/terms` | Keep |
| `/admin/*` | Noindex |

Every route is built as a full static page, except admin.

## Redirects

- The old sitemap lists product URLs that no longer exist. Crawl it in Phase 4.
- Send each dead product URL to its nearest current product or range.
- Keep the existing trailing-slash behaviour until it is tested on the new host.
- Fake URLs must return a real 404.

Known old URLs to map include:

- `/products/3hp-screw-air-compressor`
- `/products/10-hp-screw-air-compressor`
- `/products/screw-air-compressor`
- `/products/oil-free-reciprocating-air-compressor`
- `/products/single-stage-reciprocating-compressor`
- `/products/ehp-gmms-10-16-manual-fork-stacker`
