"""Shared helpers for the part-based exploded films."""
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage

W, H = 1920, 1080


def load_rgb(p):
    return np.asarray(Image.open(p).convert("RGB")).astype(np.float32)


def background(a):
    """Estimate the empty stage behind the parts."""
    v, s = a.max(axis=2), a.max(axis=2) - a.min(axis=2)
    m = (v > 62) | (s > 34)
    m = ndimage.binary_closing(m, iterations=6)
    m = ndimage.binary_fill_holes(m)
    m = ndimage.binary_dilation(m, iterations=30)
    keep = (~m).astype(np.float32)
    w = ndimage.gaussian_filter(keep, 55) + 1e-3
    return np.stack([ndimage.gaussian_filter(a[..., i] * keep, 55) / w for i in range(3)], axis=2)


def poly_mask(pts, shape=(H, W)):
    m = np.zeros(shape, np.uint8)
    cv2.fillPoly(m, [np.array(pts, np.int32)], 1)
    return m.astype(bool)


def box_mask(x0, y0, x1, y1, shape=(H, W)):
    m = np.zeros(shape, bool)
    m[y0:y1, x0:x1] = True
    return m


def soft(m, sigma=0.7):
    return np.clip(ndimage.gaussian_filter(m.astype(np.float32), sigma), 0, 1)


def fill_small(m, limit=500):
    """Fill small holes only, so the open loop of a handle stays open."""
    lab, n = ndimage.label(~m)
    if n == 0:
        return m
    sizes = ndimage.sum(~m, lab, range(1, n + 1))
    out = m.copy()
    for i, s in enumerate(sizes, 1):
        if s < limit:
            out[lab == i] = True
    return out


def cut_dark(a, bg, region, low=6, high=20, close=2, keep_all=False, hole=500):
    """Alpha for a part on the dark stage: difference from the empty stage inside a region."""
    d = np.abs(a - bg).max(axis=2)
    hard = (d > (low + high) / 2) & region
    if close:
        hard = ndimage.binary_closing(hard, iterations=close) & region
    if not keep_all:
        lab, n = ndimage.label(hard, structure=np.ones((3, 3)))
        if n > 1:
            s = ndimage.sum(hard, lab, range(1, n + 1))
            big = 1 + np.flatnonzero(s > max(60, s.max() * 0.02))
            hard = np.isin(lab, big)
    hard = fill_small(hard, hole)
    alpha = np.clip((d - low) / (high - low), 0, 1)
    alpha = np.maximum(alpha, ndimage.binary_erosion(hard, iterations=1).astype(np.float32))
    return alpha * ndimage.binary_dilation(hard, iterations=1)


def layer(rgb, alpha):
    """Premultiplied RGBA crop with its offset, so warps stay fast and clean."""
    ys, xs = np.where(alpha > 0.004)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    pad = 6
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(alpha.shape[1], x1 + pad), min(alpha.shape[0], y1 + pad)
    a = alpha[y0:y1, x0:x1, None].astype(np.float32)
    return np.dstack([rgb[y0:y1, x0:x1] * a, a]), (int(x0), int(y0))


def ease(t):
    """Soft start, soft landing."""
    t = np.clip(t, 0, 1)
    return float(t * t * t * (t * (6 * t - 15) + 10))


def win(t, a, b):
    return ease((t - a) / (b - a))


def ramp(p, a, b):
    return float(np.clip((p - a) / (b - a), 0, 1))
