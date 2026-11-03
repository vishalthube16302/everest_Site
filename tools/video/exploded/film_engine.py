"""Render a film from rigid part layers: no part can bend, melt or change shape."""
import subprocess
import numpy as np
import cv2
from film_common import W, H, ease, ramp

FPS = 30
SHUTTER = 0.5  # share of a frame the shutter is open
SUB = 5


def aff(a=1.0, b=0.0, tx=0.0, c=0.0, d=1.0, ty=0.0):
    return np.array([[a, b, tx], [c, d, ty]], np.float64)


def about(cx, cy, s, dx=0.0, dy=0.0):
    """Scale about a point, then move."""
    return aff(s, 0, cx - s * cx + dx, 0, s, cy - s * cy + dy)


def h3(m):
    return np.vstack([m, [0, 0, 1]])


def inv(m):
    return np.linalg.inv(h3(m))[:2]


class Part:
    def __init__(self, name, tex, org, t0=0.0, t1=1.0, m0=None, m1=None, alpha=None, bend=None):
        self.name, self.tex, self.org = name, tex, org
        self.t0, self.t1 = t0, t1
        self.m0 = aff() if m0 is None else m0
        self.m1 = aff() if m1 is None else m1
        self.alpha = alpha
        self.bend = bend  # (x_power, y_power): curve the path

    def state(self, t):
        q = ramp(t, self.t0, self.t1)
        p = ease(q)
        px = ease(q ** self.bend[0]) if self.bend else p
        py = ease(q ** self.bend[1]) if self.bend else p
        m = self.m0 + (self.m1 - self.m0) * p
        m[0, 2] = self.m0[0, 2] + (self.m1[0, 2] - self.m0[0, 2]) * px
        m[1, 2] = self.m0[1, 2] + (self.m1[1, 2] - self.m0[1, 2]) * py
        a = 1.0 if self.alpha is None else self.alpha(p)
        return m, a

    def moves(self, t, dt):
        return self.t0 - dt <= t <= self.t1 + dt


def pair(name, ta, oa, tb, ob, T, t0, t1, a_out=(0.12, 0.38), b_in=(0.0, 0.2), **kw):
    """Two pictures of one part, moved as one solid thing: A is the assembled look, B the split look."""
    pa = Part(name + "-a", ta, oa, t0, t1, aff(), T, lambda p: 1 - ramp(p, *a_out), **kw)
    pb = Part(name + "-b", tb, ob, t0, t1, inv(T), aff(), lambda p: ramp(p, *b_in), **kw)
    return pa, pb


def over(out, tex, org, m, a):
    """Composite one premultiplied layer in float, inside the bounding box it lands in."""
    h, w = tex.shape[:2]
    x, y = org
    # Map texture pixels to the canvas: M * translate(org).
    M = h3(m) @ np.array([[1, 0, x], [0, 1, y], [0, 0, 1]], np.float64)
    c = M @ np.array([[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]], np.float64)
    x0, y0 = int(np.floor(c[0].min())) - 2, int(np.floor(c[1].min())) - 2
    x1, y1 = int(np.ceil(c[0].max())) + 3, int(np.ceil(c[1].max())) + 3
    x0, y0, x1, y1 = max(0, x0), max(0, y0), min(W, x1), min(H, y1)
    if x1 <= x0 or y1 <= y0:
        return
    M2 = (np.array([[1, 0, -x0], [0, 1, -y0], [0, 0, 1]], np.float64) @ M)[:2]
    s = float(np.sqrt(abs(np.linalg.det(M[:2, :2]))))
    res = cv2.INTER_AREA if s < 0.75 else cv2.INTER_CUBIC
    if res == cv2.INTER_AREA:
        res = cv2.INTER_LINEAR
    px = cv2.warpAffine(tex, M2, (x1 - x0, y1 - y0), flags=res, borderMode=cv2.BORDER_CONSTANT)
    px = np.clip(px, 0, None) * a
    px[..., 3] = np.clip(px[..., 3], 0, 1)
    out[y0:y1, x0:x1, :3] = px[..., :3] + out[y0:y1, x0:x1, :3] * (1 - px[..., 3:4])


def render_frame(t, bg, parts, cam):
    dt = SHUTTER / FPS
    C = cam(t)
    out = cv2.warpAffine(bg, C, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    for part in parts:
        if not part.moves(t, dt):
            m, a = part.state(t)
            if a > 0.002:
                over(out, part.tex, part.org, (h3(C) @ h3(m))[:2], a)
            continue
        # Moving part: average several instants in premultiplied form, for true motion blur.
        ms = [part.state(t + dt * (i / (SUB - 1) - 0.5)) for i in range(SUB)]
        if max(a for _, a in ms) <= 0.002:
            continue
        acc = np.zeros((H, W, 4), np.float32)
        for m, a in ms:
            if a <= 0.002:
                continue
            tmp = np.zeros((H, W, 4), np.float32)
            add_layer(tmp, part, (h3(C) @ h3(m))[:2], a)
            acc += tmp
        acc /= SUB
        out[..., :3] = acc[..., :3] + out[..., :3] * (1 - np.clip(acc[..., 3:4], 0, 1))
    return out


def add_layer(tmp, part, m, a):
    h, w = part.tex.shape[:2]
    x, y = part.org
    M = h3(m) @ np.array([[1, 0, x], [0, 1, y], [0, 0, 1]], np.float64)
    c = M @ np.array([[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]], np.float64)
    x0, y0 = max(0, int(np.floor(c[0].min())) - 2), max(0, int(np.floor(c[1].min())) - 2)
    x1, y1 = min(W, int(np.ceil(c[0].max())) + 3), min(H, int(np.ceil(c[1].max())) + 3)
    if x1 <= x0 or y1 <= y0:
        return
    M2 = (np.array([[1, 0, -x0], [0, 1, -y0], [0, 0, 1]], np.float64) @ M)[:2]
    px = cv2.warpAffine(part.tex, M2, (x1 - x0, y1 - y0), flags=cv2.INTER_CUBIC)
    tmp[y0:y1, x0:x1] = np.clip(px, 0, None) * a


def dither():
    """One fixed fine grain, so the dark glow does not band and the film stays small."""
    rng = np.random.default_rng(7)
    n = rng.normal(0, 1.0, (H, W, 1)).astype(np.float32)
    return cv2.GaussianBlur(n, (0, 0), 0.6)[..., None] * 1.6


def to8(f, grain):
    return np.clip(f + grain, 0, 255).astype(np.uint8)


def film(out, total, bg, parts, cam, ffmpeg):
    n = round(total * FPS)
    grain = dither()
    p = subprocess.Popen(
        [ffmpeg, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
        stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    for i in range(n):
        p.stdin.write(to8(render_frame(i / FPS, bg, parts, cam), grain).tobytes())
        if i % 30 == 0:
            print("frame", i, "of", n, flush=True)
    p.stdin.close()
    p.wait()
    print("done", out, flush=True)
