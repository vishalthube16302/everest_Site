# Procedural model of the 2 HP / 50 L portable oil-free compressor, with the Everest sticker on the tank.
# Tank axis runs along X, handle on the left, wheels on the right, front faces the -Y camera side.
import math

import bmesh
import bpy
from mathutils import Vector

import truck
from truck import material, finish, cyl, box, new_mesh

TANK_R = 0.17


def tube(name, a, b, r, mat, parent):
    a, b = Vector(a), Vector(b)
    d = b - a
    ob = cyl(name, r, d.length, (a + b) / 2, seg=24)
    ob.rotation_euler = Vector((0, 0, 1)).rotation_difference(d).to_euler()
    return finish(ob, mat, parent)


def ellipsoid(name, centre, scale):
    def build(bm):
        bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=1)
    ob = new_mesh(name, build)
    ob.location = centre
    ob.scale = scale
    return ob


def sticker_plane(parent, x, z, width):
    img = bpy.data.images.load(truck.STICKER)
    m = bpy.data.materials.new('sticker')
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = img
    tex.interpolation = 'Cubic'
    nt.links.new(tex.outputs['Color'], b.inputs['Base Color'])
    nt.links.new(tex.outputs['Alpha'], b.inputs['Alpha'])
    b.inputs['Roughness'].default_value = 0.35
    w, h = width / 2, width * 352 / 1536 / 2
    y = -(TANK_R + 0.0012)

    def build(bm):
        v = [bm.verts.new((x + sx * w, y, z + sy * h)) for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
        f = bm.faces.new(v)
        uv = bm.loops.layers.uv.new('UVMap')
        for loop, co in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
            loop[uv].uv = co
    ob = new_mesh('sticker', build)
    ob.data.materials.append(m)
    ob.parent = parent
    return ob


def build_compressor():
    silver = material('tank', 'A9AEB3', rough=0.38, metal=0.7, coat=0.3)
    seam = material('seam', '8D9298', rough=0.4, metal=0.8)
    grey = material('head', 'C8CBCD', rough=0.45, metal=0.1, coat=0.2)
    black = material('black', '141518', rough=0.5)
    rubber = material('tyre', '0D0D0F', rough=0.85)
    hub = material('hub', 'E9E7E1', rough=0.5)
    red = material('red', 'D8201E', rough=0.35, coat=0.4)
    brass = material('brass', 'B5883A', rough=0.3, metal=1.0)
    alu = material('handle', 'B9BDC1', rough=0.3, metal=0.9)

    root = bpy.data.objects.new('compressor', None)
    bpy.context.collection.objects.link(root)
    zc = 0.31      # tank axis height

    # Tank: cylinder with dished ends and weld seams
    finish(cyl('tank', TANK_R, 0.52, (0, 0, zc), 'X', 96), silver, root)
    for s in (-1, 1):
        finish(ellipsoid(f'end{s}', (s * 0.26, 0, zc), (0.085, TANK_R, TANK_R)), silver, root)
        finish(cyl(f'seam{s}', TANK_R + 0.003, 0.008, (s * 0.26, 0, zc), 'X', 96), seam, root)
    sticker_plane(root, -0.02, zc - 0.03, 0.36)

    # Feet at the handle end, wheels at the other
    for y in (-0.12, 0.12):
        finish(box(f'foot{y}', -0.27, -0.19, y - 0.03, y + 0.03, 0.0, 0.16), grey, root, 0.008)
        finish(box(f'pad{y}', -0.285, -0.175, y - 0.035, y + 0.035, 0.0, 0.025), black, root, 0.006)
    wheels = []
    for y in (-0.2, 0.2):
        hubob = bpy.data.objects.new(f'wheel{y}', None)
        bpy.context.collection.objects.link(hubob)
        hubob.location = (0.27, y, 0.125)
        hubob.parent = root
        finish(cyl('tyre', 0.125, 0.05, (0, 0, 0), 'Y', 64), rubber, hubob, 0.012)
        finish(cyl('hub', 0.088, 0.054, (0, 0, 0), 'Y', 48), hub, hubob, 0.004)
        for k in range(5):
            a = k * 2 * math.pi / 5
            slot = cyl('slot', 0.016, 0.058, (math.cos(a) * 0.055, 0, math.sin(a) * 0.055), 'Y', 24)
            finish(slot, rubber, hubob)
        finish(cyl('cap', 0.017, 0.062, (0, 0, 0), 'Y', 24), alu, hubob)
        wheels.append(hubob)

    # Head on top, along the tank axis: grey housing at each end, black motor between, black caps
    head = bpy.data.objects.new('head', None)
    bpy.context.collection.objects.link(head)
    head.parent = root
    for x in (-0.135, 0.135):
        finish(box(f'house{x}', x - 0.065, x + 0.065, -0.10, 0.10, 0.50, 0.80), grey, head, 0.02, 4)
        finish(cyl(f'cap{x}', 0.045, 0.05, (x, 0, 0.825), 'Z', 32), black, head, 0.006)
        finish(box(f'vent{x}', x - 0.04, x + 0.04, -0.103, -0.095, 0.60, 0.68), black, head, 0.003)
        finish(box(f'mount{x}', x - 0.06, x + 0.06, -0.08, 0.08, 0.46, 0.50), grey, head, 0.006)
    finish(cyl('motor', 0.095, 0.2, (0, 0, 0.62), 'X', 64), black, head, 0.006)
    finish(cyl('band', 0.1, 0.07, (0, 0, 0.62), 'X', 64), black, head, 0.004)
    tube('bar', (-0.135, 0, 0.865), (0.135, 0, 0.865), 0.011, alu, head)
    for x in (-0.135, 0.135):
        tube(f'post{x}', (x, 0, 0.80), (x, 0, 0.865), 0.01, alu, head)

    # Pressure switch with red knob and brass fittings
    finish(box('switch', -0.255, -0.185, -0.045, 0.045, 0.485, 0.565), black, root, 0.008)
    finish(box('knob', -0.235, -0.205, -0.03, 0.03, 0.565, 0.60), red, root, 0.006)
    finish(cyl('fit1', 0.014, 0.07, (-0.22, 0.0, 0.47), 'Z', 24), brass, root)
    finish(cyl('fit2', 0.012, 0.06, (-0.15, -0.02, 0.485), 'Z', 24), brass, root)

    # Handle: two arms up from the tank and a grip across the top
    for y in (-0.13, 0.13):
        tube(f'arm{y}', (-0.30, y, 0.30), (-0.36, y, 0.40), 0.011, alu, root)
        tube(f'up{y}', (-0.36, y, 0.40), (-0.44, y, 0.82), 0.011, alu, root)
    tube('grip', (-0.44, -0.13, 0.82), (-0.44, 0.13, 0.82), 0.014, black, root)
    return root, head, wheels
