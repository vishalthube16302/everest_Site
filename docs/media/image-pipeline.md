# Image pipeline

Current images: 179 files, 120 MB, average 685 KB, with most in JPG or PNG. Everest V2 image links still point to the live Sydney storage.

The owner confirmed the product photos are real. AI was used only to clean them up.

## Steps

1. Download originals to a temporary folder.
2. Remove other brands by retouching.
3. Cut out products when a clean background is needed.
4. Export WebP or AVIF at up to 1200 px.
5. Add alt text.
6. Upload to the `Product Images` bucket in Everest V2.
7. Rewrite image links in Everest V2.
8. Check each product on a light and dark panel.

## Cut-out rules

- Products have no transparency, so cut-outs start from the white background.
- Remove pale neutral areas connected to the image edge.
- White gaps enclosed by handles need separate clearing.
- Pallet trucks have no white parts, so all pale areas can go.
- White tanks must keep their highlights. Do not use the pallet truck method on them.

## Poster images

Some product images are posters with text and spec tables. Crop or replace these so product pages show the machine cleanly.

## Files

`everest_redesign_samples/tools/images/` holds the scripts and processed images until they move into the repo.

- `final.py`: main cut-outs and logos
- `fix2hp.py`: 2 HP compressor fixes
- `retouch.py`: scale truck branding
- `scale_cut.py`: scale truck cut-out
