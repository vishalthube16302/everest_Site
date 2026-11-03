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

Lightning Out app `c:WebsiteInquiryApp` with component `c:websiteInquiryForm`. Endpoint details are in `src/lib/lightning.ts`.

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
