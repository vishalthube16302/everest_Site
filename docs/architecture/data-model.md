# Data model

Project: Everest V2. Migrations must be committed to the repo in Phase 3.

## Existing tables

| Table | State |
|---|---|
| `categories` | 6 rows |
| `products` | 37 rows; `specifications` is JSON pairs of label and value |
| `product_images` | 116 rows |
| `services` | 5 rows |
| `pages` | 6 rows; holds nav label, path and on/off |
| `testimonials` | 4 rows, unused because they are not confirmed real |
| `site_settings` | 1 row |
| `inquiries` | Empty, because leads go to Salesforce |
| `gallery_images` | Copied schema |
| `admins` | Empty; login must be created |

`products.category_id` is text, while `categories.id` is a UUID. Compare with `c.id::text = p.category_id`, and consider fixing this in V2.

## Planned changes

### Prices

Prices must not sit in a table that anyone can read, or hidden prices can still be fetched.

- New table `product_prices`: `product_id`, `price_display`, `show_price`. Admins only.
- New `site_settings.show_prices`, default false.
- A price appears only when both the master and product switches are on.
- The build reads only prices allowed to show.
- The existing `products.price_range` stays empty.
- Changing a switch triggers a rebuild.

### Catalogue

- Add new categories and products from `../content/catalogue.md`.
- Add `is_active` so products can be hidden without deleting them.

### Reviews

Add to `testimonials`: `source`, `source_url`, `product_mentioned`, `review_date`. Delete or disable the 4 existing rows after the owner confirms.

### Films

New table `product_media`: `category_id` or `product_id`, `video_url`, `poster_url`, `alt_text`.

## Security

- Public can read active catalogue data only.
- Only admins can write.
- `is_admin()` is limited to signed-in users.
- Public must never read `admins`, `inquiries` or `product_prices`.
- Remove the temporary `http` extension before launch.
