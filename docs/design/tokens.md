# Design tokens

Direction A: Showroom. Bright gallery, large product images, little text.

Source: `Main.dc.html`, `A-Product.dc.html` and `A-Phone.dc.html` on the design canvas.

## Colour

| Token | Value | Use |
|---|---|---|
| `ground` | `#F3F4F5` | Page background |
| `surface` | `#FFFFFF` | Cards |
| `ink` | `#111316` | Text, dark panels |
| `muted` | `#4B5159` | Secondary text |
| `muted-on-dark` | `#C9CDD2` | Secondary text on ink |
| `line` | `#D4D7DB` | Dividers |
| `line-strong` | `#8A9099` | Form field borders |
| `brand` | `#C20D12` | Main action, brand red |
| `brand-on-ink` | `#FF6B6E` | Red text on ink, same red the films use |

Yellow comes from the pallet truck photos. Do not use it as an interface colour.

### Contrast, checked

| Pair | Ratio |
|---|---|
| `ink` on `ground` / `surface` | 16.9 / 18.6 |
| `muted` on `ground` / `surface` | 7.3 / 8.0 |
| `muted-on-dark` on `ink` | 11.6 |
| White on `brand` | 6.3 |
| `brand` on `ground` / `surface` | 5.7 / 6.3 |
| `brand-on-ink` on `ink` | 6.7 |
| `line-strong` on `surface` | 3.2 (borders need 3.0) |

`brand` on `ink` is only 3.0, so never use it for text on dark panels. `line` is decorative only (1.4).

## Type

| Role | Font | Weight |
|---|---|---|
| Display | Archivo, width 112 | 700 to 800 |
| Body | Instrument Sans | 400 to 600 |

Self-host both fonts. Hero heading scales from 50 to 124 px with tight line height.

| Step | Phone | Desktop | Line height |
|---|---|---|---|
| Hero | 50 | 124 | 0.95 |
| Section title | 34 | 56 | 1.05 |
| Card title | 22 | 26 | 1.2 |
| Body | 16 | 17 | 1.5 |
| Small | 14 | 14 | 1.4 |

Nothing below 14 px. Spec numbers use tabular figures.

## Shape and space

- Cards: 20 px radius; large panels: 28 px
- Buttons: fully rounded, at least 44 px tall
- Page width: 1320 px with 24 px side padding, 16 px on phones
- Section gap: 72 px on desktop, 48 px on phones
- Spacing steps: 4, 8, 12, 16, 24, 32, 48, 72
- Breakpoints: 640, 900 and 1200 px

## States

- Hover: primary button darkens to `#A30A0F`, which keeps white text at 8.2:1; cards lift 2 px
- Focus: 2 px `ink` outline with 2 px offset, `brand-on-ink` on dark panels
- Disabled: 50% opacity, never the only sign
- Errors: `brand` text plus a message, never colour alone

## Motion

- Interface transitions: 400 ms or less
- Hero products slide in once on load
- Honour `prefers-reduced-motion`: no slides, films stay on the poster until tapped

## Copy

Short headlines of 12 words or fewer. Body text of 25 words or fewer.
