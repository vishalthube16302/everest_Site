# Rollback

Use this if the new site breaks after launch.

## When to roll back

- Pages do not load
- Enquiries stop reaching Salesforce
- Product pages show wrong data
- A serious security problem appears

## Steps

1. Move the custom domain back to the old Cloudflare project.
2. Confirm the old site loads at everesthps.com.
3. Send a test enquiry.
4. Record what happened in `../DECISIONS.md`.
5. Fix the problem on `redesign/v2`.

## Keep ready until the new site is stable

- Old hosting project
- `main` branch unchanged
- Live Supabase project active

Exact steps need confirming once Cloudflare access is available.
