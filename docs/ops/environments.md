# Environments

Never store passwords or private keys here.

| Item | Live | V2 |
|---|---|---|
| Git branch | `main` | `redesign/v2` |
| Domain | everesthps.com | Noindex preview, not set up yet |
| Supabase project | `vbemwnwmssuzmzxyozmp` | `gnnqwuwaojttcwfzdrko` |
| Supabase region | Sydney | Mumbai |
| Access rule | Read only | Work here |

## Local run

From `web/`: copy `.env.example` to `.env.local`, then `npm run build` and `npx serve out -l 4173`. Copy films into `web/public/films/`; that folder is not in git.

## Local folder

Branch from `origin/main`, because local `main` was 9 commits behind on 2026-11-01.

## Salesforce

Lightning Out app `c:WebsiteInquiryApp` with component `c:websiteInquiryForm`. Endpoint details are in `web/src/lib/lightning.ts`.

The form loads from Salesforce, and Salesforce only serves it to addresses it trusts. So it may work on the real domain and fail on `localhost` or a preview address. The owner saw this on the old site. It cannot be proven from this computer.

- The form is on `/contact` only, and loads when the visitor scrolls near it.
- If it does not load within 15 seconds, the page shows WhatsApp, phone and a **Try the form again** button, so a lead is never lost.
- Before launch, test on the real address. If the form does not appear, add that address in Salesforce under CORS allowed origins and the Lightning Out trusted sites, then reload.
- Test the Cloudflare preview address the same way, as soon as it exists.

## Other public listings

- IndiaMART site: everesthps.in
- Google Business: EVEREST Air Compressor & Material Handling Equipment

## Known temporary items

- `http` extension on Everest V2: remove before launch.
- Everest V2 images now load from the Everest V2 bucket in Mumbai (done in Phase 2).
- Everest V2 can pause after 1 week idle. It can be restored.

## Branches and hosting

- `redesign/v2` is the working branch. Work goes through feature branches and pull requests into it.
- `main` is not touched until the owner's customer gives the final go-ahead.
- Cloudflare is not connected. The owner connects `redesign/v2` after that confirmation.
