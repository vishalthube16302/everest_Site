# Renders test frames of the truck model to check the look and the render time.
# Usage: blender -b -P look_test.py -- <output folder> [samples]
import importlib
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
import truck
importlib.reload(truck)

args = sys.argv[sys.argv.index('--') + 1:]
out, samples = args[0], int(args[1]) if len(args) > 1 else 48

truck.clear()
truck.build_showroom()
root, frame, grip, links = truck.build_truck()
load = truck.build_load()
load.location = (0.30, 40, 0)   # out of frame while judging the truck
truck.setup_render(960, 540, samples)

shots = {
    'hero': ((3.3, -2.9, 1.1), (0.30, 0, 0.62), 42),
    'side': ((0.45, -4.6, 0.8), (0.42, 0, 0.66), 45),
}
for name, (loc, target, lens) in shots.items():
    truck.camera(loc, target, lens)
    bpy.context.scene.render.filepath = os.path.join(out, f'look-{name}.jpg')
    bpy.context.scene.render.image_settings.file_format = 'JPEG'
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    print('RENDER', name, round(time.time() - t0, 1), 's')
