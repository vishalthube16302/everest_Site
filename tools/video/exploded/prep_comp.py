"""Rebuild the real compressor on a transparent 1920x1080 canvas, same placement as the first frame."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

trial, comp_src, out = sys.argv[1:4]
K = 1080 / 1024
OFF = (1920 - round(1536 * K)) // 2
c = Image.open(comp_src).convert("RGBA")
ca = np.asarray(c).copy()
gap = np.zeros(ca.shape[:2], bool)
gap[340:425, 420:720] = True
pale = (ca[..., :3].min(axis=2) > 205) & gap
pale = ndimage.binary_dilation(pale, iterations=2) & gap
ca[..., 3] = np.where(pale, 0, ca[..., 3])
c = Image.fromarray(ca)
bb = Image.fromarray(ca[..., 3]).point(lambda v: 255 if v > 40 else 0).getbbox()
cut = c.crop(bb)
sx, sy, tx, ty = 1.155, 1.125, -135.0, -72.0
w, h = round(583 * sx * K), round(594 * sy * K)
cut = cut.resize((w, h), Image.LANCZOS)
base = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
base.paste(cut, (round((476 * sx + tx) * K) + OFF, round((315 * sy + ty) * K)))
base.save(out + "/compressor-rgba.png")
# Bright flat grey behind it, so every edge of the cut can be read.
g = Image.new("RGBA", (1920, 1080), (40, 120, 60, 255))
g.alpha_composite(base)
g.convert("RGB").save(out + "/compressor-on-green.png")
print(base.getbbox())
