"""Pull exact frames from a finished film and lay out crops, to inspect the hand-over moments."""
import subprocess
import sys
import tempfile
import os
from PIL import Image

ff, film, out, cx0, cy0, cx1, cy1, cols = sys.argv[1:9]
times = [float(v) for v in sys.argv[9:]]
box = tuple(int(v) for v in (cx0, cy0, cx1, cy1))
cols = int(cols)
w, h = box[2] - box[0], box[3] - box[1]
rows = (len(times) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h))
with tempfile.TemporaryDirectory() as d:
    for i, t in enumerate(times):
        p = os.path.join(d, f"{i}.png")
        subprocess.run([ff, "-y", "-ss", f"{t:.3f}", "-i", film, "-frames:v", "1", p],
                       stderr=subprocess.DEVNULL, check=True)
        im = Image.open(p).convert("RGB")
        if i == 0:
            print(im.size)
        sheet.paste(im.crop(box), ((i % cols) * w, (i // cols) * h))
sheet.save(out, quality=92)
print(sheet.size)
