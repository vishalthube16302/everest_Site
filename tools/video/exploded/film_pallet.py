"""Pallet truck exploded film. The real truck frame stays still; separated parts come from the approved split image."""
import sys
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage
from film_common import *
from film_engine import *

trial, scratch, mode = sys.argv[1:4]
A = load_rgb(trial + "/pallet-first.png")
B = load_rgb(trial + "/pallet-last.png")
bg = background(B)
bgA = bg  # both frames sit on the same stage

# ---------- Real truck frame ----------
yel = (A[..., 0] > 150) & (A[..., 1] > 92) & (A[..., 2] < 135) & (A[..., 0] - A[..., 2] > 60)
yel = ndimage.binary_opening(yel, iterations=1)
lab, n = ndimage.label(yel)
frame = lab == (1 + int(np.argmax(ndimage.sum(yel, lab, range(1, n + 1)))))
frame = ndimage.binary_fill_holes(ndimage.binary_closing(frame, iterations=3))
# Straight rear edge and clean fork undersides: wheel glow and links under the forks are not frame.
frame &= ~poly_mask([(600, 562), (755, 562), (737, 802), (600, 802)])
frame &= ~box_mask(1290, 674, 1505, 702) & ~box_mask(1310, 802, 1505, 832)
f_a = soft(frame, 0.7)

# ---------- Assembled look of the moving parts ----------
d = np.abs(A - bg).max(axis=2)
moving = (d > 9) & box_mask(535, 92, 762, 765) & ~ndimage.binary_erosion(frame, iterations=1)
moving = ndimage.binary_closing(moving, iterations=2) & box_mask(535, 92, 762, 765)
m_alpha = np.clip((d - 5) / 12, 0, 1)
m_alpha = np.maximum(m_alpha, soft(ndimage.binary_erosion(moving, iterations=1), 0.6)) * ndimage.binary_dilation(moving, iterations=1)
m_alpha = m_alpha * (1 - f_a)
hand_zone = box_mask(535, 92, 760, 523)
pale = (A.min(axis=2) > 118) & (A[..., 2] > 95) & box_mask(684, 668, 752, 756) & ~frame
pale = ndimage.binary_closing(ndimage.binary_opening(pale, iterations=1), iterations=2)
bolt = box_mask(700, 676, 726, 700)
pale &= ~bolt
yy, xx = np.mgrid[0:H, 0:W]
# The whole wheel leaves as one piece, rim included, and nothing yellow travels with the pump.
plate = poly_mask([(698, 664), (752, 664), (752, 698), (726, 701), (708, 701), (698, 690)])
ring = (((xx - 731) / 47.0) ** 2 + ((yy - 708) / 46.0) ** 2 < 1) & ~plate
wheel = ring | ndimage.binary_dilation(pale, iterations=2)
yellowish = ndimage.binary_dilation((A[..., 0] - A[..., 2] > 62) & (A[..., 1] > 70), iterations=2)
wA = soft(wheel, 0.8) * m_alpha * ~ndimage.binary_dilation((A[..., 0] - A[..., 2] > 80) & (A[..., 1] > 80), iterations=1)
hA = m_alpha * hand_zone
pA = m_alpha * ~hand_zone * (1 - soft(wheel, 0.8)) * ~yellowish

under_far = box_mask(1296, 660, 1442, 700)
under_near = box_mask(1316, 786, 1492, 830)


def under(box):
    u = (d > 9) & box & ~ndimage.binary_dilation(frame, iterations=1)
    return soft(ndimage.binary_closing(u, iterations=2), 0.7) * (1 - f_a)


uf, un = under(under_far), under(under_near)
# The orange link and its bolt are fixed to the fork, so they stay. Only the roller carriage leaves.
stay = uf * box_mask(0, 0, 1349, H) + un * box_mask(0, 0, 1386, H)
uf = uf * ~box_mask(0, 0, 1349, H)
un = un * ~box_mask(0, 0, 1386, H)
f_a = np.maximum(f_a, stay)

# ---------- Separated parts ----------
hB = cut_dark(B, bg, box_mask(375, 80, 590, 536), low=6, high=18)
rodB = cut_dark(B, bg, box_mask(608, 505, 654, 631), low=7, high=22)
pumpB = cut_dark(B, bg, box_mask(498, 566, 676, 776) & ~box_mask(608, 505, 654, 629), low=7, high=20, hole=900)
w1B = cut_dark(B, bg, box_mask(380, 822, 496, 968), low=8, high=24)
w2B = cut_dark(B, bg, box_mask(496, 822, 600, 968), low=8, high=24)
rfB = cut_dark(B, bg, box_mask(1600, 702, 1680, 775), low=8, high=24)
rnB = cut_dark(B, bg, box_mask(1234, 892, 1356, 962), low=8, high=24)

# ---------- How each assembled part maps on to its separated picture ----------
src = np.float32([[543, 175], [630, 103], [689, 497]])   # handle: left of loop, top of loop, sticker
dst = np.float32([[386, 152], [487, 92], [539, 455]])
T_hand = cv2.getAffineTransform(src, dst).astype(np.float32)
# Refine on the two silhouettes, so the loop lines up exactly during the hand-over.
def look(rgb_, al, box):
    # Outline plus brightness, so the small sticker lines up as well as the loop.
    v = al * (0.35 + rgb_.mean(axis=2) / 255 * 2.2)
    return cv2.GaussianBlur((v * box).astype(np.float32), (0, 0), 1.6)


ga = look(A, hA, box_mask(535, 92, 760, 516))
gb = look(B, hB, box_mask(375, 80, 590, 476))
crit = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-7)
cc, T1 = cv2.findTransformECC(ga, gb, T_hand.copy(), cv2.MOTION_AFFINE, crit, None, 5)
print("handle match", round(float(cc), 4))
T_hand = T1.astype(np.float64)


def start(cx, cy, s, sx, sy):
    """Transform that places a separated part at its hidden start: centre (cx,cy) at scale s, from final centre (sx,sy)."""
    return aff(s, 0, cx - s * sx, 0, s, cy - s * sy)


fx = Part("frame", *layer(A, f_a))

h_a, h_b = pair("handle", *layer(A, hA), *layer(B, hB), T_hand, 2.3, 4.7, a_out=(0.04, 0.13), b_in=(0.01, 0.07))

M_pump = start(752, 634, 0.8, 585, 672)
T_pump = np.linalg.inv(h3(M_pump))[:2]
p_a, p_b = pair("pump", *layer(A, pA), *layer(B, pumpB), T_pump, 3.1, 5.6, a_out=(0.03, 0.12), b_in=(0.01, 0.06))

# The rod rises out of the pump after the pump has reached its place.
rod_low = aff(ty=120)
tex, org = layer(B, rodB)


class Rod(Part):
    def state(self, t):
        q = ramp(t, 3.1, 5.6)
        p = ease(q)
        pump = M_pump + (aff() - M_pump) * p
        lift = ease(ramp(t, 5.0, 6.5))
        m = (h3(pump) @ h3(aff(ty=120 * (1 - lift))))[:2]
        return m, 1.0

    def moves(self, t, dt):
        return 3.1 - dt <= t <= 6.5 + dt


rod = Rod("rod", tex, org)

wstart1 = start(729, 708, 0.62, 440, 895)
wstart2 = start(729, 708, 0.62, 547, 895)
wa = Part("wheel-a", *layer(A, wA), 1.5, 3.6, aff(), np.linalg.inv(h3(wstart2))[:2], lambda p: 1 - ramp(p, 0.1, 0.3), bend=(1.25, 0.8))
w1 = Part("wheel-1", *layer(B, w1B), 1.5, 3.8, wstart1, aff(), lambda p: ramp(p, 0, 0.12), bend=(1.25, 0.8))
w2 = Part("wheel-2", *layer(B, w2B), 1.5, 3.5, wstart2, aff(), lambda p: ramp(p, 0, 0.12), bend=(1.25, 0.8))

rf_s = start(1386, 668, 0.82, 1639, 739)
rn_s = start(1421, 795, 0.92, 1294, 928)
rf = Part("rollers-far", *layer(B, rfB), 1.0, 3.1, rf_s, aff(), lambda p: ramp(p, 0, 0.1))
rn = Part("rollers-near", *layer(B, rnB), 0.8, 2.9, rn_s, aff(), lambda p: ramp(p, 0, 0.1))
uf_p = Part("under-far", *layer(A, uf), 1.0, 3.1, aff(), np.linalg.inv(h3(rf_s))[:2], lambda p: 1 - ramp(p, 0.06, 0.26))
un_p = Part("under-near", *layer(A, un), 0.8, 2.9, aff(), np.linalg.inv(h3(rn_s))[:2], lambda p: 1 - ramp(p, 0.06, 0.26))

parts = [rf, uf_p, rn, un_p, w1, w2, wa, rod, p_b, p_a, fx, h_b, h_a]


def cam(t):
    s = 1.0 + 0.06 * (1 - win(t, 0.3, 7.2))
    return about(1000, 470, s)


if mode == "sheet":
    ts = [float(v) for v in sys.argv[4].split(",")]
    g = dither()
    sheet = Image.new("RGB", (960 * 3, 540 * ((len(ts) + 2) // 3)))
    for i, t in enumerate(ts):
        f = to8(render_frame(t, bg, parts, cam), g)
        Image.fromarray(f).save(f"{scratch}/p-{t:.2f}.png")
        sheet.paste(Image.fromarray(f).resize((960, 540), Image.LANCZOS), ((i % 3) * 960, (i // 3) * 540))
    sheet.save(scratch + "/pallet-sheet.jpg", quality=90)
else:
    film(sys.argv[4], 8.0, bg, parts, cam, sys.argv[5])
