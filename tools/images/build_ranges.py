# New ranges for Phase 2. Same look as build_v2.py.
# Usage: python build_ranges.py <photos folder> <uniq.json> <output folder>
# uniq.json lists the unique photos in review order, so the indexes below are stable.
import json, os, sys
import numpy as np
from PIL import Image
from build_v2 import add_logo, erase, fit_scene, fit_studio, fix_tagline, on_white, patch, tone_scene, tone_studio

STUDIO = {2,10,11,12,13,14,16,19,22,24,26,27,31,32,34,35,37,38,40,43,50,51,52,53,59,60,69,75,77,78,80,82,84,85,88,89,91,93,97}
SCENE = {0,1,5,15,17,18,20,23,28,30,36,44,54,55,61,62,63,70,74,79,86,92,95,96,101}
# Photo shows no Everest mark
NEEDS_LOGO = {0,1,2,22,23,24,26,27,28,30,35,36,37,40,43,44,50,51,53,54,55,59,60,61,62,63,88,89,91,92,93,95,96,97,101}
SHORT = {'air-receiver': 'receiver', 'belt-driven-reciprocating-air-compressor': 'belt', 'electric-stacker': 'estacker',
         'hydraulic-material-lifting-table': 'lift', 'manual-fork-stacker': 'mstacker', 'screw-air-compressor': 'screw',
         'semi-electric-pallet-truck': 'sepallet', 'semi-electric-stacker': 'sestacker'}
SPARKLE = {70}                       # Gemini mark
# Third-party marks on the product, in source pixels
ERASE = {60: [('ellipse', 620, 485, 34, 20)], 62: [('ellipse', 310, 242, 17, 10)]}
# Marks on a narrow post: copy clean post from above so its edges stay straight. Rect, then source corner.
PATCH = {61: ((668, 220, 730, 280), (668, 150)), 92: ((552, 388, 590, 460), (552, 310))}
# Garbled tagline on the lift table, in output pixels
POST_TAGLINE = {31: ((442, 653, 635, 670), 186, 0, (150, 40, 20)), 38: ((552, 653, 746, 670), 187, 0, (150, 40, 20))}
CORNER_MARK = {42: (0, .9, .36, 1), 99: (0, .9, .36, 1)}   # phone camera mark, as fractions of the photo

if __name__ == '__main__':
    src, uniq, out = sys.argv[1], json.load(open(sys.argv[2])), sys.argv[3]
    os.makedirs(out, exist_ok=True)
    made = {}
    for i in sorted(STUDIO | SCENE):
        f = uniq[i]
        im = on_white(os.path.join(src, f))
        a = np.asarray(im).copy()
        if i in ERASE:
            a = erase(a, ERASE[i])
        if i in SPARKLE:
            a = erase(a, [('ellipse', im.width - 58, im.height - 58, 36, 36)])
        if i in PATCH:
            a = patch(a, *PATCH[i])
        im = Image.fromarray(a)
        studio = i in STUDIO
        logo = i in NEEDS_LOGO
        o = fit_studio(tone_studio(im), 104 if logo else 48) if studio else fit_scene(tone_scene(im), i)
        if i in POST_TAGLINE:
            o = fix_tagline(o, POST_TAGLINE[i])
        if logo:
            o = add_logo(o, studio)
        rng = next(k for k in SHORT if f.startswith(k + '-'))
        name = f'{SHORT[rng]}-{i:03d}.webp'
        o.save(os.path.join(out, name), 'WEBP', quality=82, method=6)
        made[f] = name
    json.dump(made, open(os.path.join(out, 'made.json'), 'w'), indent=0)
    print(len(made), 'images', round(sum(os.path.getsize(os.path.join(out, n)) for n in made.values()) / 1e6, 1), 'MB')
