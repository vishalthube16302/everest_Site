# Stack

## Old live site (removed from the repo)

Vite, React 18, TypeScript, Tailwind, `vite-react-ssg` and Supabase. Data loaded in the browser, so bots saw little content. Hosted on Cloudflare Pages (project `everest-site`). Its code is in the tag `live-before-v2`.

## V2

| Area | Choice |
|---|---|
| Framework | Next.js with static pages |
| Styling | Tailwind with tokens from `../design/tokens.md` |
| Animation | Motion for interface effects, CSS where enough |
| Data and login | Supabase, Everest V2 project |
| Hosting | Cloudflare, separate project on `redesign/v2` |
| Leads | Existing Salesforce Lightning Out form |
| Films | Chrome and ffmpeg renderer, hosted on Cloudflare |

## How content updates work

Pages are built ahead of time. When the admin saves a change, a Cloudflare deploy hook rebuilds the site. Changes appear after the rebuild finishes.

## Budgets for mobile

Measured at the 75th percentile:

- LCP 2.0 s or less
- INP 150 ms or less
- CLS 0.05 or less
- Initial JavaScript 170 KB gzipped or less
- First view 1.2 MB or less, without films

Films and third-party scripts load only when needed. All motion respects `prefers-reduced-motion`.

## Free plan limits

- 2 active projects per owner across organizations
- 500 MB database, 1 GB storage, 5 GB egress
- Pauses after 1 week without activity, restorable for 1 year
- No automatic backups
