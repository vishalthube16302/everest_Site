# Image pipeline

Original images: 179 files, 120 MB, average 685 KB, with most in JPG or PNG. Everest V2 now uses its own 61 images, in the root of the `Product Images` bucket. Old links are saved in the `backup` schema in Everest V2.

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

## V2 set

Run `tools/images/build_v2.py <originals> <output>`. Output goes to `everest_redesign_samples/images-v2/` with `manifest.csv` (each original to its new file or the reason it was left out) and `review.html`.

- 1200x900 WebP. White background for product shots, colour corrected for photos.
- Copies merged. Posters with spec tables and claim diagrams left out.
- Removed: Staxx on the scale display, a maker's name on two tank plates, a motor badge, phone and Gemini watermarks, CE marks.
- Garbled taglines replaced with the owner's artwork.
- Everest logo added in the corner of motor photos only, because those products carry no mark.

### Link swaps made at upload

| Where | Now points to | Use |
|---|---|---|
| 2 Ton 550 Pallet Truck main | Poster | `pallet-107` |
| 2.5 Ton 550 Pallet Trolly main | Missing file | `pallet-112` |
| 1HP-8L Compressor main | Poster | `silent-068` |
| 3HP-70L Compressor main | Poster | `silent-093` |
| 1.5 HP 3-Phase Motor main | Diagram | `motor-044` |
| Silent Compressor category | Collage | `silent-093` |

## Files

- `build_v2.py`: full V2 image set
- `build_ranges.py`: new range images, same look
- `final.py`: main cut-outs and logos
- `fix2hp.py`: 2 HP compressor fixes
- `retouch.py`: scale truck branding
- `scale_cut.py`: scale truck cut-out
