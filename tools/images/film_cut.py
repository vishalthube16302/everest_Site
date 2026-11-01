# Cut-outs for the photo films, made from the finished V2 images so the brand fixes carry over.
# Only near-white reached from the image edge goes, so white tanks and bright metal stay solid.
# Usage: python film_cut.py <images-v2 folder>
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ni

SRC = sys.argv[1]
OUT = 'processed/'
# file, output, gaps inside the product that show the background, logo corner to drop
JOBS = (
    ('dental-003', 'film-dental', ((640, 150, 700, 300),), None),
    ('screw-157', 'film-screw', (), None),
    ('motor-021', 'film-motor-kit', ((480, 190, 640, 300),), (0, 0, 330, 130)),
)


def cut(name, out, gaps, drop):
    im = Image.open(f'{SRC}/{name}.webp').convert('RGB')
    a = np.asarray(im).astype(int)
    pale = (a.min(2) >= 246) & (a.max(2) - a.min(2) < 10)
    if drop:
        x0, y0, x1, y1 = drop
        pale[y0:y1, x0:x1] = True
    lab, _ = ni.label(pale)
    keep = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
    for x0, y0, x1, y1 in gaps:
        keep |= set(np.unique(lab[y0:y1, x0:x1])) - {0}
    fg = ~np.isin(lab, list(keep))
    l2, n = ni.label(fg)
    sizes = ni.sum(fg, l2, range(1, n + 1))
    fg = np.isin(l2, [i + 1 for i, v in enumerate(sizes) if v > 600])
    alpha = Image.fromarray((fg * 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.7))
    o = im.convert('RGBA')
    o.putalpha(alpha)
    o = o.crop(o.getbbox())
    o.save(f'{OUT}{out}.webp', quality=88, method=6)
    print(out, o.size)
    return o


for job in JOBS:
    cut(*job)
