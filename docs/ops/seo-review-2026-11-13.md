# SEO and AI search review (2026-11-13)

Checklists used: the `seo-technical`, `seo-geo`, `seo-local`, `seo-schema` and `seo-hreflang` skills from
github.com/AgriciDaniel/claude-seo (MIT, v2.6.0), read from a downloaded copy. Not installed: the auto-mode
safety check blocked copying them into `~/.claude/skills`. Their scripts, hooks and installers were not run.

## AI crawler access (live site, checked by user agent)

All return 200 on home, a product page and `llms.txt`: OAI-SearchBot (ChatGPT Search), ChatGPT-User, GPTBot
(OpenAI training), Claude-SearchBot, Claude-User, ClaudeBot, PerplexityBot, Perplexity-User, Googlebot,
Google-Extended, bingbot, Applebot, Amazonbot, meta-externalagent, CCBot, Bytespider, DuckAssistBot,
MistralAI-User. `robots.txt` allows all and carries `Content-Signal: search=yes, ai-input=yes, ai-train=yes`.
Pages are static HTML, so bots that do not run JavaScript see all text.

## What search engines know today

- A web search for "Everest Hydro Pneumatic Solutions Pimpri-Chinchwad" and for "everesthps.com" did not
  return our site. AI chats that use those indexes cannot cite us yet.
- **Bing Webmaster Tools set up by Claude (2026-11-13)** with the Everest Google account, imported from Search
  Console, sitemap submitted. URL Inspection: home page "Indexed successfully, can appear on Bing". Bing's two
  flags (home title too long, 7 images without alt text) are fixed in code. IndexNow pings Bing on every publish.
- Search Console "Search generative AI" control: Include (checked). robots.txt valid.
- Bing Places needs a Microsoft or Facebook login, so the owner does it.

## Fixed in code from this review

- FAQ answers always visible (accordion text counts for less)
- Guides show "Updated" date and carry `datePublished` / `dateModified`
- City in category titles ("... in Pune, Pimpri-Chinchwad")
- LocalBusiness `areaServed` (11 places + Maharashtra) and `knowsAbout`; WebSite schema on home
- HSTS, X-Frame-Options and Permissions-Policy headers (`web/public/_headers`)
- Hindi and Marathi pages indexed, in the sitemap, with full hreflang (en, hi, mr, x-default)

## Checked and fine

HTTPS and www redirect to `https://everesthps.com` in one hop. Canonicals self-reference. One H1. Sitemap
matches canonicals. Service page per core service (top local factor). `tel:` links. Geo pin with 7 decimals.
`sameAs` to Google, IndiaMART, Justdial, Facebook, Instagram.

## Notes, no action

- FAQPage no longer gives Google rich results (retired 2026-05-07). Kept: harmless and readable by AI tools.
- `llms.txt` is not used by Google; kept for other AI tools.
- Cloudflare Markdown for Agents needs the Pro plan. Skipped.

## Waiting on the owner's OK

- Done: database change applied by the owner; sitemap dates and admin SEO fields wired
- Done: 10 claude-seo skill folders (markdown only) installed in `~/.claude/skills` on the owner's request
- Second pass with the installed skills: `priority` removed from the sitemap, Organization `contactPoint` added, service pages expanded to 480 to 690 words (how it works, know-how, more FAQ)

## Owner actions, by impact

1. Done by Claude: Bing Webmaster Tools
2. Bing Places for Business: claim the listing (feeds ChatGPT, Copilot, Alexa)
3. Apple Business Connect: claim the listing (Apple Maps, Siri)
4. One business name everywhere (Google says "EVEREST Air Compressor & Material Handling Equipment")
5. Justdial: some pages still show the old Chakan address
6. Skipped by owner: Apple Business Connect, YouTube, LinkedIn. Wikidata not planned
7. Done: Search Console "Search generative AI" is on Include
8. Ask happy customers for Google reviews every few weeks; reply to each
