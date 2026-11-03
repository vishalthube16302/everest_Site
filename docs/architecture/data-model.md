# Data model

Project: Everest V2. Migrations live in `supabase/migrations/`. Prices, catalogue, reviews and films below are applied. The security rules replacement is part 2, which the owner runs.

## Existing tables

| Table | State |
|---|---|
| `categories` | 7 rows: the only category level. Every product belongs to one |
| `products` | 74 rows; `specifications` is JSON pairs of label and value |
| `product_images` | 185 rows |
| `services` | 5 rows |
| `pages` | 6 rows; holds nav label, path and on/off |
| `testimonials` | 6 sourced IndiaMART rows, plus 4 old rows the site never shows |
| `site_settings` | 1 row |
| `inquiries` | Empty, because leads go to Salesforce |
| `gallery_images` | Copied schema |
| `admins` | Empty; login must be created |
| `category_groups` | Unused since 2026-11-03 (ranges removed). Drop later; the connector declines drops. `categories.group_id` and `short_name` are unused too |
| `change_log`, `site_publishes` | Admin save and publish history, admins only |

Both `products.category_id` and `categories.id` are text in V2.

## Planned changes

### Prices

Prices must not sit in a table that anyone can read, or hidden prices can still be fetched.

- New table `product_prices`: `product_id`, `price_display`, `show_price`. Admins only.
- New `site_settings.show_prices`, default false.
- A price appears only when both the master and product switches are on.
- The build reads only prices allowed to show, through `public_prices()`.
- The existing `products.price_range` stays empty.
- Changing a switch triggers a rebuild.

### Catalogue

- Add new categories and products from `../content/catalogue.md`.
- Add `is_active` so products can be hidden without deleting them.

### Reviews

Add to `testimonials`: `source`, `source_url`, `product_mentioned`, `review_date`. Delete or disable the 4 existing rows after the owner confirms.

### Films

New table `product_media`: `category_id` or `product_id`, `video_url`, `video_url_small`, `poster_url`, `alt_text`. A film linked to `product_id` plays only on that model.

## Security

- Public can read active catalogue data only.
- Only admins can write.
- `is_admin()` is limited to signed-in users.
- Public must never read `admins`, `inquiries` or `product_prices`.
- Remove the temporary `http` extension before launch.
