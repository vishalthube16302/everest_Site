# Components

## Home page order

1. Header: logo, nav, Get a quote
2. Hero: headline, portable compressor, yellow pallet truck, spec row
3. Buyer paths: business, home or workshop, dealership
4. Range grid: all ranges as tiles
5. Silent feature: ≤70 dB panel for the 2 HP model, or ≤60 dB for the 0.75 HP and 1 HP models
6. Pallet feature: warehouse photo
7. Proof row
8. Reviews: IndiaMART and Google ratings, three quotes
9. Contact panel: WhatsApp and phone
10. Footer: full address, GST number, email

Screw compressors appear as a tile in the range grid, never in the hero.

## Product page order

1. Breadcrumb
2. Photo and key specs
3. Price or "Price on request"
4. Get a quote and WhatsApp buttons
5. Film, if the range has one
6. Full specs
7. Salesforce form
8. Related products

## Shared parts

| Part | Notes |
|---|---|
| `Header` | Becomes a menu on phones |
| `Button` | Primary red, secondary outline |
| `RangeTile` | Name, count, range, cut-out image |
| `StatBlock` | Large number and small label |
| `ReviewCard` | Quote, name, city, source |
| `SpecTable` | Reads `specifications` JSON |
| `PriceBlock` | Reads both price switches |
| `FilmPlayer` | Poster first; loads only on tap |
| `EnquiryForm` | Salesforce form, loaded only where used |
| `StickyBar` | WhatsApp and quote on phones |

## Admin screens

Products, categories, images, gallery, services, pages, settings, reviews and prices. Inquiries stays only if it is still needed.
