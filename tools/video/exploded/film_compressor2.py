"""Compressor film built from the owner exploded image; the photo only gives the assembled look."""
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


# ---------- Exploded image (owner's ChatGPT image): final look of every part ----------
Bx = load_rgb(trial + "/compressor-last.png")
bgx = background(Bx)
yy, xx = np.mgrid[0:H, 0:W]
tank_poly = poly_mask([(632, 1012), (632, 692), (640, 660), (650, 637), (662, 618), (674, 606), (688, 597), (703, 590),
                       (860, 586), (1330, 586), (1330, 1012)])
fix_region = tank_poly | box_mask(860, 548, 1160, 592) | box_mask(1235, 560, 1305, 602)
f_a = cut_dark(Bx, bgx, fix_region, low=6, high=18, keep_all=True, hole=3000)
fixed = Part("fixed", *layer(Bx, f_a))

hB = cut_dark(Bx, bgx, box_mask(480, 335, 640, 650) | box_mask(640, 575, 672, 650), low=6, high=18)
sB = cut_dark(Bx, bgx, box_mask(640, 415, 852, 575) & ~(box_mask(640, 575, 672, 650)), low=6, high=18)
mB = cut_dark(Bx, bgx, box_mask(836, 380, 1176, 556), low=6, high=18)
cLB = cut_dark(Bx, bgx, box_mask(850, 5, 968, 100), low=6, high=18)
cRB = cut_dark(Bx, bgx, box_mask(1046, 5, 1170, 100), low=6, high=18)
kLB = cut_dark(Bx, bgx, box_mask(852, 110, 968, 205), low=6, high=18)
kRB = cut_dark(Bx, bgx, box_mask(1046, 110, 1165, 205), low=6, high=18)
pLB = cut_dark(Bx, bgx, box_mask(865, 215, 960, 372), low=7, high=22, keep_all=True)
pRB = cut_dark(Bx, bgx, box_mask(1055, 215, 1150, 372), low=7, high=22, keep_all=True)


def look(rgb_, al, box):
    v = al * (0.35 + rgb_.mean(axis=2) / 255 * 2.2)
    return cv2.GaussianBlur((v * box).astype(np.float32), (0, 0), 1.6)


def fit(alpha_a, alpha_b, init, box_a, box_b, affine=True):
    """Move that carries the photo version of a part to its place in the exploded image."""
    T0 = aff(tx=init[0], ty=init[1]).astype(np.float32)
    ga, gb = look(rgb, alpha_a, box_a), look(Bx, alpha_b, box_b)
    try:
        crit = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-7)
        cc, T1 = cv2.findTransformECC(ga, gb, T0.copy(), cv2.MOTION_AFFINE if affine else cv2.MOTION_TRANSLATION, crit, None, 5)
        sc = np.sqrt(abs(np.linalg.det(T1[:, :2])))
        if cc < 0.55 or not 0.85 < sc < 1.15 or np.abs(T1[:, 2] - T0[:, 2]).max() > 40:
            raise cv2.error("poor")
        return T1.astype(np.float64), round(float(cc), 3)
    except cv2.error:
        return T0.astype(np.float64), None


bl_a = alpha * (box_mask(855, 349, 1000, 397) | box_mask(1000, 349, 1160, 397)) * (box_mask(855, 349, 965, 397) | box_mask(1045, 349, 1160, 397))
c_a = alpha * soft(c_mask, 0.6)
LEFT, RIGHT = box_mask(0, 0, 1000, H), box_mask(1000, 0, W, H)
jobs = {
    "handle": (h_a, hB, (-95, 18), True), "switch": (s_a, sB, (-74, -52), True), "motor": (m_a, mB, (0, -30), True),
    "capL": (c_a * LEFT, cLB, (0, -258), False), "capR": (c_a * RIGHT, cRB, (0, -258), False),
    "headL": (bl_a * LEFT, kLB, (0, -226), False), "headR": (bl_a * RIGHT, kRB, (0, -226), False),
}
fits = {}
for k, (aa, bb, init, af) in jobs.items():
    fits[k] = fit(aa, bb, init, box_mask(0, 0, W, H), box_mask(0, 0, W, H), af)
    print(k, "fit", fits[k][1], fits[k][0][:, 2].round(1))

TIME = {"handle": (0.8, 2.9), "switch": (1.3, 3.2), "motor": (3.3, 5.0), "capL": (2.0, 4.5), "capR": (2.0, 4.5),
        "headL": (2.5, 4.8), "headR": (2.5, 4.8)}
A_RGB = {"handle": rgb, "switch": rgb, "motor": rgb, "capL": c_rgb, "capR": c_rgb, "headL": b_rgb, "headR": b_rgb}
Bm = {"handle": hB, "switch": sB, "motor": mB, "capL": cLB, "capR": cRB, "headL": kLB, "headR": kRB}
parts = [fixed]
for k, (aa, bb, init, af) in jobs.items():
    t0, t1 = TIME[k]
    pa, pb = pair(k, *layer(A_RGB[k], aa), *layer(Bx, Bm[k]), fits[k][0], t0, t1, a_out=(0.03, 0.12), b_in=(0.01, 0.06))
    parts += [pb, pa]
# Pistons: only in the exploded image, rising out of the motor housing.
piston = Part("pistons", *layer(Bx, np.maximum(pLB, pRB)), 3.6, 6.0, aff(ty=200), aff(ty=-24))
parts.insert(1, piston)
bg = bgx


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
