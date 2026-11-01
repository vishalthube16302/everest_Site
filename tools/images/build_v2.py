# Phase 2 image set: retouch, colour, 1200x900 canvas, Everest logo where the product has none.
# Usage: python build_v2.py <originals folder> <output folder>
# Originals are sorted by name, so the indexes below are stable. See docs/media/image-pipeline.md.
import csv, os, sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SCALE = 'D:/Shared Folder/Work Data/Website/everest_redesign_samples/everest-scale-truck-retouched.png'
W, H = 1200, 900

# First index of each duplicate group, then its copies
DUPES = {0:[2], 4:[152], 13:[28,31], 14:[29], 19:[33], 21:[34], 22:[35,155], 23:[36], 24:[40], 26:[43],
         44:[50,54,60], 45:[51,55,61], 46:[64], 47:[65], 48:[59,67], 52:[56,62], 53:[57], 58:[66], 68:[73],
         69:[74], 70:[75], 76:[78,80], 77:[79], 83:[85], 84:[86], 93:[97], 94:[100], 95:[99],
         107:[121,130], 108:[125], 109:[115,119,123,127,132], 110:[133], 111:[120,124,128,134], 112:[154],
         114:[118,122,126,131], 116:[129,135], 136:[141,143,149], 137:[144,150], 138:[140,146,148,153],
         139:[147], 142:[145,151], 17:[25,32,42]}

DROP = {}
for i in (1, 18, 71, 72, 77, 81, 87, 92, 98, 106, 113):
    DROP[i] = 'poster with spec table; specs come from the database and some differ'
for i in (15, 17, 23, 26, 49, 90, 111, 116, 117):
    DROP[i] = 'diagram with claims not in verified-facts'
for i in (137, 139, 142):
    DROP[i] = 'third-party product photo, no Everest branding'
DROP[110] = 'low resolution with a foreign safety label and no Everest branding'
DROP[156] = 'collage of four models'

STUDIO = {0,3,4,11,13,14,20,21,22,30,44,45,52,53,68,70,76,82,83,88,91,93,94,95,101,102,107,108,109,136,138,157}
# Horizontal focus for scenes cropped to 4:3
FOCUS = {5:.5, 6:.57, 7:.27}
# No Everest mark in the photo
NEEDS_LOGO = {13,14,16,19,20,21,22,24,27,30,37,38,39,41,44,45,46,47,48,52,53,58,63}
SPARKLE = {5, 6, 69, 104}          # Gemini mark, 58 px in from the bottom right corner
ERASE = {20: [('ellipse', 144, 200, 22, 16)],     # third-party badge on the motor
         3: [('rect', 510, 500, 562, 514)],       # maker's name on the tank plate
         4: [('rect', 592, 468, 632, 481)]}
PATCH = {104: ((30, 800, 340, 868), (350, 800))}  # phone camera watermark: rect, clean floor to clone from
# Garbled AI taglines. Rect or tilted 4-point area, tagline width, angle, ink colour
TAGLINE = {108: ((300, 834, 458, 820, 458, 836, 300, 850), 156, -4.4, (196, 28, 22)), 114: ((398, 782, 568, 801), 163, 0, (140, 26, 16))}
# Same fix after fitting, because these sources are too small to carry the text. Output pixels.
POST_TAGLINE = {5: ((488, 659, 640, 674), 143, 0, (150, 35, 30)), 6: ((513, 663, 668, 679), 147, 0, (150, 35, 30)),
                7: ((369, 664, 524, 679), 147, 0, (150, 35, 30)), 8: ((538, 705, 720, 721), 174, 0, (150, 35, 30))}
POST_ERASE = {70: [('rect', 618, 272, 668, 332)]}   # CE mark: no certification is confirmed


def erase(a, shapes):
    m = np.zeros(a.shape[:2], 'uint8')
    for s in shapes:
        if s[0] == 'rect':
            cv2.rectangle(m, s[1:3], s[3:5], 255, -1)
        elif s[0] == 'poly':
            cv2.fillPoly(m, [np.array(s[1:], np.int32).reshape(-1, 2)], 255)
        else:
            cv2.ellipse(m, s[1:3], s[3:5], 0, 0, 360, 255, -1)
    return cv2.inpaint(a, m, 7, cv2.INPAINT_TELEA)


def patch(a, rect, src):
    # Clone clean texture over a mark when the area is too wide to inpaint
    x0, y0, x1, y1 = rect
    w, h = x1 - x0, y1 - y0
    p = a[src[1]:src[1] + h, src[0]:src[0] + w].copy()
    return cv2.seamlessClone(p, a, np.full((h, w), 255, 'uint8'), ((x0 + x1) // 2, (y0 + y1) // 2), cv2.NORMAL_CLONE)


def fix_tagline(im, box):
    # Replace the garbled AI tagline with the owner's artwork
    rect, width, angle, ink = box
    tilted = len(rect) == 8
    a = erase(np.asarray(im.convert('RGB')).copy(), [('poly' if tilted else 'rect', *rect)])
    out = Image.fromarray(a).convert('RGBA')
    s = Image.open(os.path.join(HERE, 'processed/everest-sticker.png')).convert('RGBA').crop((515, 272, 1470, 335))
    s = s.resize((width, max(1, int(s.height * width / s.width))), Image.LANCZOS)
    s = Image.merge('RGBA', (*Image.new('RGB', s.size, ink).split(), s.getchannel('A')))
    s = s.rotate(-angle, expand=True, resample=Image.BICUBIC).filter(ImageFilter.GaussianBlur(.35))
    cx, cy = (sum(rect[0::2]) // 4, sum(rect[1::2]) // 4) if tilted else ((rect[0] + rect[2]) // 2, (rect[1] + rect[3]) // 2)
    out.alpha_composite(s, (cx - s.width // 2, cy - s.height // 2))
    return out.convert('RGB')


def on_white(p):
    im = Image.open(p).convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    return bg.convert('RGB')


def tone_studio(im):
    a = np.asarray(im).astype(np.float32)
    # White point from the background, then lift near-white to pure white for the site's cards
    e = np.r_[a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)]
    a = np.clip(a * (255 / np.maximum(np.percentile(e, 60, axis=0), 200)), 0, 255)
    a = np.clip((a - 244) / 6, 0, 1) * (255 - a) + a
    return Image.fromarray(a.astype('uint8'))


def tone_scene(im):
    a = np.asarray(im).astype(np.float32)
    # Light grey world removes phone colour cast without turning tanks blue or shifting brand red
    m = a.reshape(-1, 3).mean(0)
    a = np.clip(a * (1 + .3 * (m.mean() / m - 1)), 0, 255).astype('uint8')
    lab = cv2.cvtColor(a, cv2.COLOR_RGB2LAB)
    lab[..., 0] = cv2.createCLAHE(1.4, (8, 8)).apply(lab[..., 0])
    return ImageEnhance.Color(Image.fromarray(cv2.cvtColor(lab, cv2.COLOR_LAB2RGB))).enhance(1.05)


def fit_studio(im, top):
    a = np.asarray(im.convert('L'))
    ys, xs = np.where(a < 240)
    c = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    box_w, box_h = W - 96, H - top - 48
    r = min(box_w / c.width, box_h / c.height, 2.0)
    c = c.resize((int(c.width * r), int(c.height * r)), Image.LANCZOS)
    if r > 1:
        c = c.filter(ImageFilter.UnsharpMask(1.2, 60, 2))
    o = Image.new('RGB', (W, H), (255, 255, 255))
    o.paste(c, ((W - c.width) // 2, top + (box_h - c.height) // 2))
    return o


def fit_scene(im, idx):
    ratio = im.width / im.height
    if idx in FOCUS or 1.1 <= ratio <= 1.9:
        if ratio > W / H:
            cw = int(im.height * W / H)
            x = int(np.clip(FOCUS.get(idx, .5) * im.width - cw / 2, 0, im.width - cw))
            im = im.crop((x, 0, x + cw, im.height))
        else:
            ch = int(im.width * H / W)
            y = (im.height - ch) // 2
            im = im.crop((0, y, im.width, y + ch))
        return im.resize((W, H), Image.LANCZOS)
    # Tall photos sit on a soft copy of themselves so nothing is cut off
    bg = im.resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(40))
    bg = ImageEnhance.Brightness(bg).enhance(.82)
    r = min(W / im.width, H / im.height)
    c = im.resize((int(im.width * r), int(im.height * r)), Image.LANCZOS)
    bg.paste(c, ((W - c.width) // 2, (H - c.height) // 2))
    return bg


def add_logo(o, studio):
    s = Image.open(os.path.join(HERE, 'processed/everest-sticker.png')).convert('RGBA')
    lw = 250
    s = s.resize((lw, int(s.height * lw / s.width)), Image.LANCZOS)
    o = o.convert('RGBA')
    if studio:
        o.alpha_composite(s, (32, 28))
    else:
        pad = 14
        chip = Image.new('RGBA', (lw + 2 * pad, s.height + 2 * pad), (0, 0, 0, 0))
        ImageDraw.Draw(chip).rounded_rectangle((0, 0, chip.width - 1, chip.height - 1), 14, fill=(255, 255, 255, 240))
        chip.alpha_composite(s, (pad, pad))
        o.alpha_composite(chip, (24, 24))
    return o.convert('RGB')


def prefix(i):
    if i == 157: return 'screw'
    if i <= 12: return 'dental'
    if i <= 67: return 'motor'
    if i <= 105: return 'silent'
    if i <= 135: return 'pallet'
    return 'scale'


def build(i, path):
    if i == 138:
        im = on_white(SCALE)
        im = Image.fromarray(erase(np.asarray(im).copy(), [('rect', 1845, 742, 1912, 790)]))   # unconfirmed CE mark
    else:
        im = on_white(path)
    if i == 30:
        im = im.crop((0, 4, im.width - 12, im.height))    # black scan line on the right edge
    shapes = list(ERASE.get(i, []))
    if i in SPARKLE:
        shapes.append(('ellipse', im.width - 58, im.height - 58, 36, 36))
    if shapes:
        im = Image.fromarray(erase(np.asarray(im).copy(), shapes))
    if i in PATCH:
        im = Image.fromarray(patch(np.asarray(im).copy(), *PATCH[i]))
    if i in TAGLINE:
        im = fix_tagline(im, TAGLINE[i])
    studio = i in STUDIO
    im = tone_studio(im) if studio else tone_scene(im)
    logo = i in NEEDS_LOGO
    o = fit_studio(im, 104 if logo else 48) if studio else fit_scene(im, i)
    if i in POST_ERASE:
        o = Image.fromarray(erase(np.asarray(o).copy(), POST_ERASE[i]))
    if i in POST_TAGLINE:
        o = fix_tagline(o, POST_TAGLINE[i])
    return add_logo(o, studio) if logo else o


if __name__ == '__main__':
    SRC, OUT = sys.argv[1], sys.argv[2]
    os.makedirs(OUT, exist_ok=True)
    files = sorted(os.listdir(SRC))
    owner = {c: k for k, v in DUPES.items() for c in v}
    rows, made = [], {}
    for i, f in enumerate(files):
        rep = owner.get(i, i)
        if rep in DROP:
            rows.append((i, f, '', DROP[rep]))
        else:
            if rep not in made:
                name = f'{prefix(rep)}-{rep:03d}.webp'
                build(rep, os.path.join(SRC, files[rep])).save(os.path.join(OUT, name), 'WEBP', quality=82, method=6)
                made[rep] = name
            rows.append((i, f, made[rep], ''))
    with open(os.path.join(OUT, 'manifest.csv'), 'w', newline='', encoding='utf-8') as fh:
        csv.writer(fh).writerows([('index', 'original', 'output', 'dropped_because')] + rows)
    size = sum(os.path.getsize(os.path.join(OUT, n)) for n in made.values())
    print(len(made), 'images,', round(size / 1e6, 1), 'MB;', sum(1 for r in rows if not r[2]), 'originals dropped')
