"""Share image (og:image) for pages without their own photo. 1200x630, used by Facebook, WhatsApp, LinkedIn, X.

Run from the repo root: python tools/images/og_image.py
Writes web/public/img/og-default.jpg. Wording stays inside docs/content/verified-facts.md.
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
GROUND, INK, MUTED, BRAND = "#f3f4f5", "#111316", "#4b5159", "#c20d12"
SRC = "tools/images/processed/"
FONTS = "C:/Windows/Fonts/"

img = Image.new("RGB", (W, H), GROUND)
draw = ImageDraw.Draw(img)

# Right side: compressor behind, pallet truck in front.
def paste(name, height, x, y):
    im = Image.open(SRC + name).convert("RGBA")
    im = im.resize((round(im.width * height / im.height), height), Image.LANCZOS)
    img.paste(im, (x, y), im)

paste("compressor-2hp.webp", 400, 760, 60)
paste("pallet-side.webp", 220, 680, 390)

# Left side: logo, headline, place.
logo = Image.open("web/public/img/logo-red.png").convert("RGBA")
logo = logo.resize((360, round(logo.height * 360 / logo.width)), Image.LANCZOS)
img.paste(logo, (64, 64), logo)

head = ImageFont.truetype(FONTS + "ARIALNB.TTF", 62)
body = ImageFont.truetype(FONTS + "arial.ttf", 28)
y = 200
for line in ["Air compressors,", "pallet trucks", "and stackers"]:
    draw.text((64, y), line, font=head, fill=INK)
    y += 70
draw.rectangle((64, y + 22, 136, y + 28), fill=BRAND)
draw.text((64, y + 50), "Sales, repair, rent and spare parts", font=body, fill=MUTED)
draw.text((64, y + 90), "Pimpri-Chinchwad, Pune  ·  everesthps.com", font=body, fill=MUTED)

img.save("web/public/img/og-default.jpg", quality=86, optimize=True, progressive=True)
print("saved web/public/img/og-default.jpg")
