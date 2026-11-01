# Renders the pallet truck film frame by frame. Finished frames are skipped, so a stopped
# render can be restarted with the same command.
# Usage: blender -b -P film.py -- <frame folder> <width> <height> <samples> <fps> [seconds,to,test]
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Vector
import truck

args = sys.argv[sys.argv.index('--') + 1:]
out, width, height, samples, fps = args[0], *map(int, args[1:5])
only = [float(x) for x in args[5].split(',')] if len(args) > 5 else None
DURATION = 20.0

START_X, END_X = -1.4, -2.4     # truck position before the pallet and after the move
LOAD_X = 0.18                   # pallet edge, clear of the head when the forks are under it
GAP = 0.015                     # forks travel this far before they touch the pallet
PUMP0, PUMP1, STROKES = 8.7, 12.9, 3

clamp = lambda x, a=0.0, b=1.0: min(b, max(a, x))
prog = lambda t, a, b: clamp((t - a) / (b - a))
io = lambda x: 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
mix = lambda a, b, x: tuple(p + (q - p) * x for p, q in zip(a, b))


def lift(t):
    if t < PUMP0:
        return 0.0
    if t >= PUMP1:
        return 1.0
    k = (t - PUMP0) / (PUMP1 - PUMP0) * STROKES
    n = math.floor(k)
    return (n + io(clamp((k - n) / .6))) / STROKES


def swing(t):
    if t < PUMP0 or t > PUMP1:
        return 0.0
    k = (t - PUMP0) / (PUMP1 - PUMP0) * STROKES
    return math.sin(clamp((k - math.floor(k)) / .6) * math.pi)


def truck_x(t):
    x = START_X + (0 - START_X) * io(prog(t, 4.3, 7.8))
    return x + (END_X - 0) * io(prog(t, 13.8, 17.0))


# Each shot: start, end, camera from, camera to, target from, target to, lens, f-stop.
# Targets and cameras marked follow=True move with the truck.
SHOTS = [
    (0.0, 3.6, (1.05, -0.75, 0.42), (1.2, -0.3, 0.34), (0.08, 0, 0.27), (0.05, 0, 0.27), 62, 2.8, True),
    (3.6, 8.2, (-2.9, -3.7, 1.25), (-1.3, -3.5, 1.05), (-0.5, 0, 0.5), (0.45, 0, 0.5), 38, 0, False),
    (8.2, 13.6, (0.2, -3.6, 0.5), (0.34, -3.3, 0.46), (0.2, 0, 0.72), (0.28, 0, 0.72), 36, 0, False),
    (13.6, 17.4, (-0.5, -3.9, 0.9), (-2.2, -3.6, 0.9), (0.1, 0, 0.6), (-1.9, 0, 0.6), 40, 0, False),
]


def shot_at(t):
    for s in SHOTS:
        if s[0] <= t < s[1]:
            return s
    return None


truck.clear()
truck.build_showroom()
root, frame, grip, links = truck.build_truck()
load = truck.build_load()
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
    shot = shot_at(t)
    hero = shot is None
    x = 0.0 if hero else truck_x(t)
    L = 0.0 if hero else lift(t)
    root.location.x = x
    frame.location.z = L * truck.RISE
    grip.rotation_euler.y = -0.1 - swing(t) * 0.55
    for part in load.children:
        part.hide_render = hero
    for link in links:
        link.scale.z = 1 + L * truck.RISE / (truck.FORK_TOP - 0.05)
    load.location.z = max(0.0, L * truck.RISE - GAP)
    load.location.x = LOAD_X + min(0.0, x if t > 13 else 0.0)
    if hero:                     # the truck alone, camera circling slowly
        a = math.radians(-58 + 16 * prog(t, 17.4, DURATION))
        aim((0.3 + 3.9 * math.cos(a), 3.9 * math.sin(a), 1.0), (0.32, 0, 0.62), 42, 0)
        return
    t0, t1, c0, c1, g0, g1, lens, fstop, follow = shot
    k = io(prog(t, t0, t1)) * .35 + prog(t, t0, t1) * .65
    c, g = Vector(mix(c0, c1, k)), Vector(mix(g0, g1, k))
    if follow:
        c.x += x
        g.x += x
    aim(c, g, lens, fstop)


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
print('FILM DONE')
