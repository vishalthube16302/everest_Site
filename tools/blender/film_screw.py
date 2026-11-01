# Renders the twin rotor scene of the screw compressor film. overlay-screw.html covers the first
# and last seconds with the product photo. Finished frames are skipped, so a stopped render can be
# restarted with the same command.
# Usage: blender -b -P film_screw.py -- <frame folder> <width> <height> <samples> <fps> [seconds,to,test]
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Vector
import rotor
import truck

args = sys.argv[sys.argv.index('--') + 1:]
out, width, height, samples, fps = args[0], *map(int, args[1:5])
only = [float(x) for x in args[5].split(',')] if len(args) > 5 else None
DURATION = 14.0
SPEED = math.pi * 0.6         # male rotor speed, radians per second

clamp = lambda x, a=0.0, b=1.0: min(b, max(a, x))
prog = lambda t, a, b: clamp((t - a) / (b - a))
io = lambda x: 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
mix = lambda a, b, x: tuple(p + (q - p) * x for p, q in zip(a, b))

# Each shot: start, end, camera from, camera to, target from, target to, lens, f-stop.
SHOTS = [
    (0.0, 8.6, (-1.25, -1.9, 1.17), (-0.8, -2.0, 1.13), (-0.02, 0, 0.75), (0.02, 0, 0.75), 42, 0),
    (8.6, 14.0, (0.52, -1.42, 0.92), (0.14, -1.34, 0.88), (0.30, 0, 0.75), (0.02, 0, 0.75), 50, 0),
]


truck.clear()
truck.build_showroom()
rotor.studio()
for name in ('floor', 'wall'):      # rotors alone on black
    bpy.data.objects[name].hide_render = True
rig, male, female = rotor.build_rotors()
truck.setup_render(width, height, samples, fps)
cam = truck.camera((0, -4, 1), (0, 0, 0.9))
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
    rotor.turn(male, female, -t * SPEED)      # the grooves travel left to right on screen
    for t0, t1, c0, c1, g0, g1, lens, fstop in SHOTS:
        if t0 <= t < t1:
            k = io(prog(t, t0, t1)) * .35 + prog(t, t0, t1) * .65
            aim(mix(c0, c1, k), mix(g0, g1, k), lens, fstop)
            return


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
