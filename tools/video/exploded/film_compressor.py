"""Compressor exploded film. Every part is the real photo, except the pistons the photo cannot show."""
import sys
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage
from film_common import *
from film_engine import *

trial, scratch, mode = sys.argv[1:4]
A = np.asarray(Image.open(scratch + "/compressor-rgba.png")).astype(np.float32)
rgb, alpha = A[..., :3].copy(), A[..., 3] / 255
B = load_rgb(trial + "/compressor-last.png")
bg = background(B)

yy, xx = np.mgrid[0:H, 0:W]

# ---------- Handle: rebuild the inner rail where the switch hides it ----------
h_rgb, h_a = rgb.copy(), np.zeros((H, W), np.float32)
upper = poly_mask([(575, 320), (672, 320), (722, 452), (722, 490), (686, 490), (686, 545), (703, 590), (676, 590), (575, 400)])
h_a[upper] = alpha[upper]
over_tank = poly_mask([(697, 575), (703, 590), (712, 612), (722, 628), (735, 641), (750, 645), (803, 645), (807, 641), (816, 641),
                       (819, 648), (819, 660), (815, 664), (806, 664), (750, 663), (730, 657), (716, 645), (702, 625), (692, 605), (679, 575)])
h_a[poly_mask([(697, 570), (720, 570), (720, 612), (712, 612)])] = 0
h_a[box_mask(688, 556, 706, 594) & (rgb.mean(axis=2) < 125)] = 0
# Centre line of the inner rail, measured on rows where it is in clear view.
rows, centres, widths = [], [], []
for y in range(400, 470):
    xs = np.flatnonzero(alpha[y, 640:722] > 0.5) + 640
    if len(xs) < 6:
        continue
    run = np.split(xs, np.flatnonzero(np.diff(xs) > 1) + 1)[-1]
    rows.append(y), centres.append((run[0] + run[-1]) / 2), widths.append(run[-1] - run[0] + 1)
a_, b_ = np.polyfit(rows, centres, 1)
half = max(7, int(np.median(widths) / 2 + 3))
print("inner rail slope", round(a_, 3), "half width", half)
for y in range(474, 596):
    src = 402 + (y - 474) % 62
    c = a_ * src + b_
    dx = a_ * (y - src)
    for x in range(int(c - half), int(c + half) + 1):
        tx = int(round(x + dx))
        if 0 <= tx < W and alpha[src, x] > h_a[y, tx]:
            h_a[y, tx] = alpha[src, x]
            h_rgb[y, tx] = rgb[src, x]
# Round off the free end of the inner rail.
cut = np.zeros((H, W), bool)
yy, xx = np.mgrid[0:H, 0:W]
cy, cx = 592, a_ * 592 + b_
cut = ((yy > cy) & (xx > 720) & (xx < 800)) | (((xx - cx) / 11) ** 2 + ((yy - cy + 2) / 7) ** 2 > 1) & (yy > cy - 2) & (xx > 720) & (xx < 800)
h_a[cut & (yy < 604)] = 0
end = ((xx - cx) / 10) ** 2 + ((yy - cy + 3) / 4.5) ** 2 < 1
h_rgb[end] = h_rgb[end] * 0.35
h_a[(yy >= 604) & (xx > 720) & (xx < 800) & ~over_tank] = 0
h_a = np.maximum(h_a, soft(over_tank, 0.8))

# ---------- Switch with its pipes and hose ----------
sw_poly = poly_mask([(688, 494), (722, 494), (722, 438), (800, 438), (826, 455), (832, 530), (852, 546), (864, 546),
                     (864, 570), (806, 590), (748, 590), (745, 548), (700, 542), (688, 542)])
sliver = poly_mask([(761, 548), (778, 592), (763, 592), (760, 575)])
s_a = alpha * sw_poly * ~sliver

# ---------- Motor, head blocks, covers ----------
mo_poly = poly_mask([(836, 397), (1172, 397), (1172, 552), (1100, 552), (1100, 548), (906, 548), (906, 552), (868, 552), (868, 541), (836, 541)])
m_a = alpha * mo_poly
lum = rgb.mean(axis=2)
c_mask = box_mask(850, 295, 954, 349) | box_mask(1050, 295, 1165, 349) | box_mask(954, 295, 1050, 344)
arc = (lum < 105) & (box_mask(868, 346, 945, 364) | box_mask(1062, 346, 1140, 364))
arc = ndimage.binary_closing(arc, iterations=2)
cap = ((((xx - 901) ** 2 + (yy - 321) ** 2) < 31.5 ** 2) | (((xx - 1100) ** 2 + (yy - 321) ** 2) < 31.5 ** 2)) & (yy >= 346)
c_rgb = rgb.copy()
c_rgb[cap & (lum > 100)] = np.array([38, 44, 48], np.float32)
c_mask |= cap
bl_mask = (box_mask(855, 349, 965, 397) | box_mask(1045, 349, 1160, 397))
b_rgb = rgb.copy()
fix_top = ndimage.binary_dilation(arc | cap, iterations=3) & (box_mask(855, 345, 965, 397) | box_mask(1045, 345, 1160, 397)) & (yy >= 349)
# The block is ribbed top to bottom, so carry each column up to its clean top edge.
for x in np.flatnonzero(fix_top.any(axis=0)):
    ys = np.flatnonzero(fix_top[:, x])
    ref = ys.max() + 2
    b_rgb[349:ref, x] = rgb[ref, x]

# ---------- Fixed: tank, brackets, foot, wheel, rear lift tab ----------
fix = box_mask(0, 590, W, H) | box_mask(866, 556, 918, 590) | box_mask(1090, 556, 1150, 590) \
    | box_mask(935, 556, 1072, 590) | box_mask(1235, 560, 1300, 600)
corner = poly_mask([(679, 590), (694, 590), (684, 595)])
f_a = alpha * fix * ~corner
# Remove the rail from the tank, then paint the tank back in below it.
hole = (ndimage.binary_dilation(over_tank, iterations=13) & box_mask(698, 589, 860, 700)) | box_mask(724, 655, 840, 682) | box_mask(796, 636, 842, 682)
hole |= box_mask(744, 584, 766, 592) | box_mask(782, 584, 806, 592)
logo = (rgb[..., 0] - rgb[..., 1] > 22) & (yy > 640)
hole &= ~ndimage.binary_dilation(logo, iterations=6)
inside = poly_mask([(636, 680), (648, 640), (660, 617), (672, 605), (685, 595), (703, 589), (830, 589), (830, 692), (636, 692)])
f_rgb = rgb.copy()
P = np.median(rgb[:, 860:1150], axis=1)[:, None, :]  # a horizontal cylinder: shading follows the row
ratio = rgb / (P + 1)
fill = np.tile(P, (1, W, 1))
for x in range(640, 830):
    ys = np.flatnonzero(hole[:, x] & (np.arange(H) >= 589))
    if len(ys) == 0:
        continue
    for run in np.split(ys, np.flatnonzero(np.diff(ys) > 1) + 1):
        a0, b0 = max(run[0] - 5, 592), min(run[-1] + 5, 690)
        ra = np.median(ratio[max(a0 - 6, 590):a0, x], axis=0)
        rb = np.median(ratio[b0:b0 + 6, x], axis=0)
        k = ((run - run[0]) / max(1, len(run) - 1))[:, None]
        fill[run, x] = P[run, 0] * (ra * (1 - k) + rb * k)
hmask = hole & (yy >= 589)
sm = ndimage.gaussian_filter(fill * hmask[..., None], (3, 8, 0)) / (ndimage.gaussian_filter(hmask.astype(np.float32), (3, 8))[..., None] + 1e-3)
fill = np.where(hmask[..., None], sm, rgb)
# Pull the fill to the surrounding tank so no edge shows.
cy0, cy1, cx0, cx1 = 575, 700, 640, 870
crop, cm = fill[cy0:cy1, cx0:cx1].copy(), hmask[cy0:cy1, cx0:cx1, None]
ref = rgb[cy0:cy1, cx0:cx1]
for _ in range(4000):
    nb = (np.roll(crop, 1, 0) + np.roll(crop, -1, 0) + np.roll(crop, 1, 1) + np.roll(crop, -1, 1)) / 4
    crop = np.where(cm, nb, ref)
fill = rgb.copy()
fill[cy0:cy1, cx0:cx1] = crop
w = soft(hmask, 1.0)[..., None]
f_rgb = f_rgb * (1 - w) + fill * w
f_a = np.maximum(f_a, soft(inside & hole, 1.0))
f_a[hole & ~inside & (yy < 590)] = 0
edge = box_mask(668, 584, 722, 604)
f_a[edge] = soft(inside | box_mask(703, 589, 722, 604), 0.9)[edge]

# ---------- Pistons from the split image ----------
region = box_mask(865, 215, 960, 372) | box_mask(1055, 215, 1150, 372)
p_a = cut_dark(B, bg, region, low=7, high=22, keep_all=True)

# ---------- Timing and final positions ----------
HAND = (-238, -24)
SW = (-74, -52)
MOTOR = -30
COVER = -258
BLOCK = -226
P_TOP = -24
P_LOW = 200

fixed = Part("fixed", *layer(f_rgb, f_a))
hand = Part("handle", *layer(h_rgb, h_a), 0.8, 2.9, aff(), aff(tx=HAND[0], ty=HAND[1]))
switch = Part("switch", *layer(rgb, s_a), 1.3, 3.2, aff(), aff(tx=SW[0], ty=SW[1]))
motor = Part("motor", *layer(rgb, m_a), 3.3, 5.0, aff(), aff(ty=MOTOR))
block = Part("blocks", *layer(b_rgb, alpha * bl_mask), 2.5, 4.8, aff(), aff(ty=BLOCK))
cover = Part("covers", *layer(c_rgb, alpha * soft(c_mask, 0.6)), 2.0, 4.5, aff(), aff(ty=COVER))
piston = Part("pistons", *layer(B, p_a), 3.6, 6.0, aff(ty=P_LOW), aff(ty=P_TOP))

parts = [fixed, piston, motor, switch, hand, block, cover]


def cam(t):
    s = 1.0 + 0.065 * (1 - win(t, 0.3, 7.2))
    return about(960, 690, s)


if mode == "sheet":
    ts = [float(v) for v in sys.argv[4].split(",")]
    g = dither()
    sheet = Image.new("RGB", (960 * 3, 540 * ((len(ts) + 2) // 3)))
    for i, t in enumerate(ts):
        f = to8(render_frame(t, bg, parts, cam), g)
        Image.fromarray(f).save(f"{scratch}/c-{t:.2f}.png")
        sheet.paste(Image.fromarray(f).resize((960, 540), Image.LANCZOS), ((i % 3) * 960, (i // 3) * 540))
    sheet.save(scratch + "/compressor-sheet.jpg", quality=90)
else:
    film(sys.argv[4], 8.0, bg, parts, cam, sys.argv[5])
