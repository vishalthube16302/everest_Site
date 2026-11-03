# Admin panel

Address: `/admin` on the site (locally `http://localhost:3000/admin`). Noindex. Code in `web/src/app/admin/` and `web/src/components/admin/`.

## What it manages

| Page | Manages | Table |
|---|---|---|
| Products | Name, web address, category, show or hide, order, specs (with paste from Excel), main photo, more photos, price, copy, remove | `products`, `product_images`, `product_prices` |
| Categories | The 7 category tiles: name, web address, photo, order, show or hide | `categories` |
| Prices | Master switch, and every product's price and switch | `site_settings.show_prices`, `product_prices` |
| Reviews | Genuine IndiaMART and Google reviews | `testimonials` |
| Services | Services page titles | `services` |
| Films | Film links per category or per model | `product_media` |
| Gallery | Extra gallery photos and the page each opens | `gallery_images` |
| Company and menu | Phone, WhatsApp, email, address, GSTIN, hours, ratings; header and footer links | `site_settings`, `pages` |
| Admin logins | Add or remove admins, set passwords, change own password | `admins` via `manage-admins` |
| Activity | Every save and publish | `change_log`, `site_publishes` |

Photos are converted in the browser to WebP and uploaded to the `Product Images` bucket. Product photos are placed on a white 1200x900 canvas.

## Security

- Sign-in is Supabase email and password. A login works only if its user id is in `admins`.
- Writes are allowed by `is_admin()` rules on every table. A non-admin login was tested: adds are refused (403) and edits change no rows.
- Admin logins and Publish run as Supabase functions (`supabase/functions/`). They check `admins` first.
- No secret key reaches the browser.

## Publishing

Saves are stored at once. Local dev shows them on refresh. The live site shows them after **Publish website**, which calls the `publish-site` function. It posts to the host's build hook, kept in the function secret `DEPLOY_HOOK_URL`. Until Cloudflare is connected, Publish says the host is not connected.

To connect: create a Cloudflare Pages deploy hook for `redesign/v2`, then add it as the `DEPLOY_HOOK_URL` secret on the Everest V2 functions.

## First admin login

1. Supabase dashboard, Everest V2, Authentication, Users, **Add user**: the owner's email and a strong password, auto confirm on.
2. SQL editor: `insert into public.admins (id, email, role) select id, email, 'admin' from auth.users where email = 'OWNER EMAIL';`
3. Sign in at `/admin`. Add other admins from **Admin logins**.

For password reset emails, set the Auth Site URL to the preview or live address.
