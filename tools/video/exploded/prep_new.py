"""Cut the new compressor photo from white and warp it on to the old canvas geometry."""
import sys
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage

src, old_path, out = sys.argv[1:4]
a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
h, w = a.shape[:2]
mn = a.min(axis=2)
white = mn > 244
lab, n = ndimage.label(white)
edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bgm = np.isin(lab, list(edge))
# Enclosed white gaps (between the handle rails, under the motor) are background too. Keep the wheel hub.
sizes = ndimage.sum(white, lab, range(1, n + 1))
hub = np.zeros_like(white); hub[660:860, 780:1000] = True
for i in range(1, n + 1):
    reg = lab == i
    if i in edge or sizes[i - 1] < 40:
        continue
    if (reg & hub).sum() > 0.5 * reg.sum():
        continue
    bgm |= reg
# Soft edge: distance of the pixel from white, only near the background.
near = ndimage.binary_dilation(bgm, iterations=5)
alpha = np.where(bgm, 0.0, 1.0)
soft = np.clip((255 - mn) / 14.0, 0, 1)
alpha = np.where(near & ~bgm, np.maximum(soft, 0.0) * 0 + np.clip((251 - mn) / 10.0, 0, 1), alpha)
alpha = np.where(near & ~bgm, np.maximum(alpha, ndimage.binary_erosion(~near, iterations=0) * 1.0), alpha)
alpha = np.where(bgm, 0, np.where(near, alpha, 1.0))
core = ndimage.binary_erosion(alpha > 0.5, iterations=3)
alpha = np.clip(ndimage.gaussian_filter(core.astype(np.float32), 0.8) * 1.15, 0, 1) * (~bgm)
# Un-matte the edge colour so no white halo shows on the dark stage.
rgb = a.copy()
edgeband = near & ~bgm
inner = ndimage.binary_erosion(~near, iterations=1)
for c in range(3):
    ch = rgb[..., c]
    fill = ndimage.distance_transform_edt(~inner, return_distances=False, return_indices=True)
    ch[edgeband] = a[..., c][fill[0][edgeband], fill[1][edgeband]]
rim = core & ~ndimage.binary_erosion(core, iterations=4)
rgb[rim] = rgb[rim] * 0.72
print("transparent share", round(float((alpha < 0.5).mean()), 3))

old = np.asarray(Image.open(old_path)).astype(np.float32)
oa = old[..., 3] / 255
ys, xs = np.where(alpha > 0.5)
nb = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
ob = Image.fromarray((oa * 255).astype(np.uint8)).point(lambda v: 255 if v > 40 else 0).getbbox()
s0 = ((ob[2] - ob[0]) / (nb[2] - nb[0]) + (ob[3] - ob[1]) / (nb[3] - nb[1])) / 2
# Start: scale about the bounding boxes, then refine on the tank + logo shading with ECC.
M0 = np.array([[s0, 0, ob[0] - s0 * nb[0]], [0, s0, ob[1] - s0 * nb[1]]], np.float32)
H, W = old.shape[:2]


def warp(img, M, interp=cv2.INTER_CUBIC):
    return cv2.warpAffine(img, M, (W, H), flags=interp, borderMode=cv2.BORDER_CONSTANT, borderValue=0)


na = warp(alpha.astype(np.float32), M0)
g_new = cv2.GaussianBlur(cv2.cvtColor(warp(rgb, M0).clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2GRAY), (0, 0), 2).astype(np.float32)
g_old = cv2.GaussianBlur(cv2.cvtColor(old[..., :3].clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2GRAY), (0, 0), 2).astype(np.float32)
mask = (cv2.erode((oa > 0.9).astype(np.uint8), np.ones((9, 9))) * cv2.erode((na > 0.9).astype(np.uint8), np.ones((9, 9)))).astype(np.uint8)
# ECC refines a residual affine: warp(new) -> old.
crit = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 400, 1e-8)
R = np.eye(2, 3, dtype=np.float32)
cc, R = cv2.findTransformECC(g_old, g_new, R, cv2.MOTION_AFFINE, crit, mask, 7)
print("ecc", round(float(cc), 4), R.round(4).tolist())
M = (np.vstack([R, [0, 0, 1]]) @ np.vstack([M0, [0, 0, 1]]))[:2]
# findTransformECC maps template -> input; use the inverse warp flag.
Mf = cv2.invertAffineTransform(R)
M = (np.vstack([Mf, [0, 0, 1]]) @ np.vstack([M0, [0, 0, 1]]))[:2]
fa = warp(alpha.astype(np.float32), M)
fr = warp(rgb, M)
chk = warp(rgb, M).mean(axis=2)
diff = np.abs(chk - old[..., :3].mean(axis=2))[(fa > 0.9) & (oa > 0.9)]
print("mean abs difference to old", round(float(diff.mean()), 2))
res = np.dstack([fr.clip(0, 255), fa * 255]).astype(np.uint8)
Image.fromarray(res, "RGBA").save(out + "/compressor-rgba-new.png")
g = Image.new("RGBA", (1920, 1080), (40, 120, 60, 255))
g.alpha_composite(Image.open(out + "/compressor-rgba-new.png"))
g.convert("RGB").save(out + "/compressor-new-on-green.png")
blend = (0.5 * fr + 0.5 * old[..., :3]).clip(0, 255).astype(np.uint8)
Image.fromarray(blend).crop((560, 280, 1320, 1020)).save(out + "/new-vs-old.png")
