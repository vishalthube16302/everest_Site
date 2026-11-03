# Launch checklist

Only start after the owner says go live.

## Before

- [ ] Phase 4 is complete
- [ ] Owner has approved the full site
- [ ] Compare live and V2 data; copy any new changes
- [ ] Refresh review ratings
- [ ] Remove the `http` extension
- [ ] Part 2 security rules are applied
- [ ] Delete or disable the 4 old testimonials
- [ ] Salesforce accepts the production domain: open `/contact` on the real address and send one test enquiry. See `environments.md`
- [ ] Production settings point to Everest V2
- [ ] Noindex removed from the production build (`SITE_INDEXABLE=true`)
- [ ] Redirects tested
- [ ] Rollback steps ready
- [ ] Choose a quiet time

## During

- [ ] Move the custom domain to the new Cloudflare project
- [ ] Check home, products, contact and admin
- [ ] Send a real test enquiry
- [ ] Test WhatsApp and phone links
- [ ] Check a few old URLs

## After

- [ ] Submit the new sitemap in Search Console
- [ ] Watch 404s and coverage daily for 4 weeks
- [ ] Watch leads in Salesforce
- [ ] Start keep-alive and backups
- [ ] Merge `redesign/v2` into `main` once stable
