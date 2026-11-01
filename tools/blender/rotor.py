# Builds the twin rotors of a screw air compressor: a 4 lobe male rotor and a 6 flute female
# rotor. The female profile is worked out from the male one, so the two mesh as they turn.
# This shows the principle only. It is not a drawing of a particular airend.
import math

import bpy
import numpy as np
import truck

RATIO = 4 / 6         # the female rotor turns at 4/6 of the male speed
CENTRE = 0.30         # distance between the rotor axes
LENGTH = 1.05
WRAP = math.radians(300)   # how far the male lobes twist over the rotor length


def male_profile(count=480):
    th = np.linspace(0, 2 * np.pi, count, endpoint=False)
    root, tip = 0.33 * CENTRE, 0.52 * CENTRE
    shape = ((1 + np.cos(4 * th)) / 2) ** 0.85
    return th, root + (tip - root) * shape


def female_profile(count=720):
    """Largest female section the turning male rotor never cuts into."""
    th, r = male_profile()
    px, py = r * np.cos(th), r * np.sin(th)
    best = np.full(count, 0.66 * CENTRE)
    for a in np.linspace(0, 3 * np.pi, 2400, endpoint=False):
        wx = px * np.cos(a) - py * np.sin(a) - CENTRE
        wy = px * np.sin(a) + py * np.cos(a)
        b = a * RATIO
        qx = wx * np.cos(b) - wy * np.sin(b)
        qy = wx * np.sin(b) + wy * np.cos(b)
        phi = np.mod(np.arctan2(qy, qx), 2 * np.pi)
        bins = (phi / (2 * np.pi) * count).astype(int) % count
        np.minimum.at(best, bins, np.hypot(qx, qy))
    best -= 0.006 * CENTRE          # running clearance
    kernel = np.ones(5) / 5
    best = np.convolve(np.r_[best[-4:], best, best[:4]], kernel, 'same')[4:-4]
    return np.linspace(0, 2 * np.pi, count, endpoint=False), best


def twisted(name, th, r, twist, parent, mat, rings=150):
    """Sweeps a section along local z, turning it by twist radians over the length."""
    n = len(th)
    verts, faces = [], []
    for k in range(rings + 1):
        z = LENGTH * (k / rings - .5)
        a = th + twist * k / rings
        verts += list(zip((r * np.cos(a)).tolist(), (r * np.sin(a)).tolist(), [z] * n))
    for k in range(rings):
        for i in range(n):
            j = (i + 1) % n
            faces.append((k * n + i, k * n + j, (k + 1) * n + j, (k + 1) * n + i))
    faces.append(tuple(range(n - 1, -1, -1)))
    faces.append(tuple(rings * n + i for i in range(n)))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.materials.append(mat)
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    me.shade_smooth()
    me.set_sharp_from_angle(angle=math.radians(70))
    ob.parent = parent
    return ob


def shaft(rotor, steel):
    for z, depth, r in ((LENGTH * .5 + .12, .24, .070), (-LENGTH * .5 - .12, .24, .070)):
        truck.finish(truck.cyl('shaft', r * CENTRE / .30 * .5, depth, (0, 0, z)), steel, rotor, bevel=0.004)


def build_rotors():
    """Returns (rig, male, female). The axes lie along world x, 0.9 m above the floor."""
    steel = truck.material('rotor', 'C9CDD3', rough=0.27, metal=1)
    dark = truck.material('rotor2', 'A4A9B0', rough=0.3, metal=1)
    shafts = truck.material('rotorshaft', 'E8EAED', rough=0.1, metal=1)

    rig = bpy.data.objects.new('rig', None)
    bpy.context.collection.objects.link(rig)
    rig.location = (0, 0, 0.9)
    rig.rotation_euler = (0, math.pi / 2, 0)

    male = bpy.data.objects.new('male', None)
    bpy.context.collection.objects.link(male)
    male.parent = rig
    th, r = male_profile()
    twisted('male_body', th, r, WRAP, male, steel)
    shaft(male, shafts)

    female = bpy.data.objects.new('female', None)
    bpy.context.collection.objects.link(female)
    female.parent = rig
    female.location = (CENTRE, 0, 0)
    th, r = female_profile()
    twisted('female_body', th, r, -WRAP * RATIO, female, dark)
    shaft(female, shafts)
    return rig, male, female


def turn(male, female, angle):
    male.rotation_euler.z = angle
    female.rotation_euler.z = -angle * RATIO


def studio():
    """Long soft strips, so the polished rotors have something to reflect."""
    def strip(name, loc, target, sx, sy, power, color=(1, 1, 1)):
        from mathutils import Vector
        li = bpy.data.lights.new(name, 'AREA')
        li.shape = 'RECTANGLE'
        li.size, li.size_y = sx, sy
        li.energy, li.color = power, color
        ob = bpy.data.objects.new(name, li)
        bpy.context.collection.objects.link(ob)
        ob.location = loc
        ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()

    strip('s_top', (0, -0.3, 2.3), (0, 0, 0.75), 3.4, 0.7, 230)
    strip('s_low', (0, -1.7, 0.4), (0, 0, 0.75), 3.4, 0.3, 70, (0.85, 0.92, 1))
    strip('s_red', (-1.6, 1.3, 1.4), (0, 0, 0.75), 1.6, 0.8, 200, (1, 0.25, 0.2))
    bpy.context.scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.022, 0.024, 0.03, 1)
