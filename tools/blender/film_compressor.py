# Renders the portable compressor film frame by frame. Finished frames are skipped, so a stopped
# render can be restarted with the same command.
# Usage: blender -b -P film_compressor.py -- <frame folder> <width> <height> <samples> <fps> [seconds,to,test]
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Vector
import truck
import compressor

args = sys.argv[sys.argv.index('--') + 1:]
out, width, height, samples, fps = args[0], *map(int, args[1:5])
only = [float(x) for x in args[5].split(',')] if len(args) > 5 else None
DURATION = 12.0
WHEEL_R = 0.125
ROLL0, ROLL1, ROLL_FROM = 2.6, 5.2, 1.9      # the compressor rolls in during step 1
SHAKE0 = 5.9                                   # the head starts to run during step 2

clamp = lambda x, a=0.0, b=1.0: min(b, max(a, x))
prog = lambda t, a, b: clamp((t - a) / (b - a))
io = lambda x: 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
mix = lambda a, b, x: tuple(p + (q - p) * x for p, q in zip(a, b))

# Each shot: start, end, camera from, camera to, target from, target to, lens, f-stop.
SHOTS = [
    (0.0, 2.4, (0.15, -0.95, 0.34), (0.02, -0.8, 0.32), (0.0, -0.17, 0.3), (-0.04, -0.17, 0.3), 60, 4.0),
    (2.4, 5.4, (0.3, -3.4, 0.8), (0.0, -3.0, 0.72), (0.1, 0, 0.38), (0.0, 0, 0.38), 35, 0),
    (5.4, 8.4, (0.7, -1.6, 0.85), (0.4, -1.25, 0.8), (0.0, 0, 0.6), (0.0, 0, 0.6), 45, 0),
]


def shot_at(t):
    for s in SHOTS:
        if s[0] <= t < s[1]:
            return s
    return None


truck.clear()
truck.build_showroom()
root, head, wheels = compressor.build_compressor()
truck.setup_render(width, height, samples, fps)
cam = truck.camera((0, -4, 1), (0, 0, 0.5))
scene = bpy.context.scene


def aim(loc, target, lens, fstop):
    cam.location = loc
    cam.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = lens
    cam.data.dof.use_dof = fstop > 0
    if fstop:
        cam.data.dof.aperture_fstop = fstop
        cam.data.dof.focus_distance = (Vector(target) - Vector(loc)).length


def apply(t):
    x = ROLL_FROM * (1 - io(prog(t, ROLL0, ROLL1))) if t >= 2.4 else 0.0
    root.location.x = x
    for w in wheels:
        w.rotation_euler.y = x / WHEEL_R
    run = prog(t, SHAKE0, SHAKE0 + .4)
    head.location = (math.sin(t * 171.3) * 0.0006 * run, 0, math.sin(t * 233.1) * 0.0008 * run)
    shot = shot_at(t)
    if shot is None:             # the whole machine, camera circling slowly
        a = math.radians(-72 + 30 * prog(t, 8.4, DURATION))
        aim((2.7 * math.cos(a), 2.7 * math.sin(a), 0.95), (0.0, 0, 0.42), 40, 0)
        return
    t0, t1, c0, c1, g0, g1, lens, fstop = shot
    k = io(prog(t, t0, t1)) * .35 + prog(t, t0, t1) * .65
    aim(Vector(mix(c0, c1, k)), Vector(mix(g0, g1, k)), lens, fstop)


os.makedirs(out, exist_ok=True)
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 95
times = only if only else [f / fps for f in range(int(DURATION * fps))]
for t in times:
    name = f't{t:05.2f}.jpg' if only else f'{round(t * fps):05d}.jpg'
    path = os.path.join(out, name)
    if os.path.exists(path):
        continue
    apply(t)
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
