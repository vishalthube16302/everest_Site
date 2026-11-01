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
| `brand` | `#C20D12` | Main action, brand red |

Yellow comes from the pallet truck photos. Do not use it as an interface colour.

## Type

| Role | Font | Weight |
|---|---|---|
| Display | Archivo, width 112 | 700 to 800 |
| Body | Instrument Sans | 400 to 600 |

Self-host both fonts. Hero heading scales from 50 to 124 px with tight line height.

## Shape and space

- Cards: 20 px radius; large panels: 28 px
- Buttons: fully rounded, at least 44 px tall
- Page width: 1320 px with 24 px side padding
- Section gap: 72 px on desktop

## Motion

- Interface transitions: 400 ms or less
- Hero products slide in once on load
- Honour `prefers-reduced-motion`

## Copy

Short headlines of 12 words or fewer. Body text of 25 words or fewer.
