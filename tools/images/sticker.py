# Turns the owner's sticker artwork (red on white) into a transparent PNG.
# Usage: python sticker.py <source image> <output.png>
import sys
import numpy as np
from PIL import Image

src = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float)
green = src[..., 1]
red_g = np.percentile(green, 1)
alpha = np.clip((255 - green) / (255 - red_g), 0, 1)
ink = src[green < red_g + 30].mean(axis=0)
out = np.zeros(src.shape[:2] + (4,), dtype=np.uint8)
out[..., :3] = ink.astype(np.uint8)
out[..., 3] = (alpha * 255).astype(np.uint8)
Image.fromarray(out).save(sys.argv[2])
print(src.shape, ink)
