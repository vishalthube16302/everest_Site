# Builds the Everest hand pallet truck, a loaded pallet and a showroom in Blender.
# Sizes are in metres. Forks point along +X, the floor is z = 0.
# Spec values (model EHPT-30-685): 685 mm fork spread, 85 to 200 mm fork height.
import math
import os

import bmesh
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
STICKER = os.path.join(HERE, '..', 'images', 'processed', 'everest-sticker.png')

FORK_TOP = 0.085      # lowered fork height
RISE = 0.115          # 200 mm - 85 mm
SPREAD = 0.685
FORK_W = 0.16
FORK_LEN = 1.15


def srgb(hex_code):
    out = []
    for i in (0, 2, 4):
        c = int(hex_code[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1)


def material(name, color, rough=0.4, metal=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = srgb(color)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Coat Roughness'].default_value = 0.12
    return m


def finish(obj, mat, parent=None, bevel=0.0, segments=3, angle=35):
    """Applies a bevel, smooth shading with sharp edges, material and parent."""
    obj.data.materials.clear()      # a boolean cut leaves an empty slot behind
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = 'ANGLE'
        mod.angle_limit = math.radians(30)
        mod.miter_outer = 'MITER_ARC'
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
    obj.data.polygons.foreach_set('material_index', [0] * len(obj.data.polygons))
    obj.data.shade_smooth()
    obj.data.set_sharp_from_angle(angle=math.radians(angle))
    obj.parent = parent
    return obj


def new_mesh(name, build):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    build(bm)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    return ob


def box(name, x0, x1, y0, y1, z0, z1):
    def build(bm):
        v = [bm.verts.new((x, y, z)) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)]
        bmesh.ops.convex_hull(bm, input=v)
    return new_mesh(name, build)


def hull(name, points):
    def build(bm):
        bmesh.ops.convex_hull(bm, input=[bm.verts.new(p) for p in points])
    return new_mesh(name, build)


def cyl(name, r, depth, loc, axis='Z', seg=64):
    def build(bm):
        bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r, depth=depth)
    ob = new_mesh(name, build)
    ob.location = loc
    if axis == 'Y':
        ob.rotation_euler = (math.pi / 2, 0, 0)
    if axis == 'X':
        ob.rotation_euler = (0, math.pi / 2, 0)
    return ob


def prism(name, plan, z0, z1):
    def build(bm):
        low = [bm.verts.new((x, y, z0)) for x, y in plan]
        high = [bm.verts.new((x, y, z1)) for x, y in plan]
        bm.faces.new(low[::-1])
        bm.faces.new(high)
        n = len(plan)
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((low[i], low[j], high[j], high[i]))
    return new_mesh(name, build)


def cut(target, tool):
    mod = target.modifiers.new('cut', 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.solver = 'EXACT'
    mod.object = tool
    bpy.context.view_layer.objects.active = target
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(tool)


def fork_plan(y):
    half, nose = FORK_W / 2, 0.10
    centre = FORK_LEN - nose
    plan = [(-0.06, y - half)]
    for i in range(25):      # rounded nose
        a = -math.pi / 2 + math.pi * i / 24
        plan.append((centre + nose * math.cos(a), y + half * math.sin(a)))
    plan.append((-0.06, y + half))
    return plan


def fork(name, y, paint, parent):
    ob = prism(name, fork_plan(y), FORK_TOP - 0.052, FORK_TOP)
    window = box(name + '_win', 0.90, 1.03, y - 0.05, y + 0.05, 0, 0.2)
    cut(ob, window)
    under = box(name + '_hollow', 0.25, FORK_LEN + 0.1, y - 0.066, y + 0.066, 0, FORK_TOP - 0.008)
    cut(ob, under)
    return finish(ob, paint, parent, bevel=0.005)


def sticker(parent):
    img = bpy.data.images.load(STICKER)
    m = bpy.data.materials.new('sticker')
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = img
    tex.interpolation = 'Cubic'
    nt.links.new(tex.outputs['Color'], b.inputs['Base Color'])
    nt.links.new(tex.outputs['Alpha'], b.inputs['Alpha'])
    b.inputs['Roughness'].default_value = 0.3
    b.inputs['Coat Weight'].default_value = 0.4

    base = Vector((0.14, 0, FORK_TOP))
    slope = (Vector((-0.04, 0, 0.50)) - base).normalized()
    normal = Vector((slope.z, 0, -slope.x)).normalized()
    centre = base + slope * 0.135 + normal * 0.0012
    w, h = 0.47 / 2, 0.47 * 352 / 1536 / 2
    across = Vector((0, 1, 0))

    def build(bm):
        v = [bm.verts.new(centre + across * sx * w + slope * sy * h)
             for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
        f = bm.faces.new(v)
        uv = bm.loops.layers.uv.new('UVMap')
        for loop, co in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
            loop[uv].uv = co
    ob = new_mesh('sticker', build)
    ob.data.materials.append(m)
    ob.parent = parent
    return ob


def handle(pivot, black, rubber):
    grip = bpy.data.objects.new('handle', None)
    bpy.context.collection.objects.link(grip)
    grip.location = pivot
    grip.parent = None
    shaft = box('shaft', -0.019, 0.019, -0.027, 0.027, 0, 0.72)
    finish(shaft, black, grip, bevel=0.004)

    # Heart shaped loop, drawn in the YZ plane above the shaft
    pts = [(0, 0.70), (0.06, 0.75), (0.15, 0.86), (0.165, 0.95), (0.11, 1.015),
           (0.0, 1.02), (-0.11, 1.015), (-0.165, 0.95), (-0.15, 0.86), (-0.06, 0.75)]
    cu = bpy.data.curves.new('loop', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.0135
    cu.bevel_resolution = 6
    cu.resolution_u = 24
    sp = cu.splines.new('NURBS')
    sp.points.add(len(pts) - 1)
    for p, (y, z) in zip(sp.points, pts):
        p.co = (0, y, z, 1)
    sp.use_cyclic_u = True
    sp.order_u = 4
    loop = bpy.data.objects.new('loop', cu)
    bpy.context.collection.objects.link(loop)
    cu.materials.append(rubber)
    loop.parent = grip

    # Centre bar through the loop and the release lever
    bar = box('bar', -0.016, 0.016, -0.022, 0.022, 0.72, 1.01)
    finish(bar, black, grip, bevel=0.003)
    lever = hull('lever', [(0, -0.008, 0.90), (0, 0.008, 0.90), (0.02, -0.008, 0.90),
                           (-0.06, -0.008, 0.83), (-0.06, 0.008, 0.83), (-0.05, 0, 0.82)])
    finish(lever, black, grip, bevel=0.002)
    return grip


def build_truck(paint=None):
    """Returns (root, lifted frame, handle pivot, steer wheels)."""
    paint = paint or material('paint', 'F6B90F', rough=0.34, coat=0.35)
    black = material('black', '111214', rough=0.38, coat=0.3)
    rubber = material('rubber', '0C0C0D', rough=0.55)
    chrome = material('chrome', 'E8EAED', rough=0.08, metal=1)
    steel = material('steel', '8C9096', rough=0.35, metal=1)
    nylon = material('nylon', 'E9E2CF', rough=0.3)

    root = bpy.data.objects.new('truck', None)
    bpy.context.collection.objects.link(root)
    frame = bpy.data.objects.new('frame', None)
    bpy.context.collection.objects.link(frame)
    frame.parent = root

    y = SPREAD / 2 - FORK_W / 2
    for name, side in (('fork_l', -y), ('fork_r', y)):
        fork(name, side, paint, frame)

    head = hull('head', [(0.14, s * SPREAD / 2, FORK_TOP) for s in (-1, 1)]
                + [(0.14, s * SPREAD / 2, 0.033) for s in (-1, 1)]
                + [(-0.16, s * SPREAD / 2, 0.033) for s in (-1, 1)]
                + [(-0.16, s * 0.12, 0.50) for s in (-1, 1)]
                + [(-0.04, s * 0.09, 0.50) for s in (-1, 1)])
    finish(head, paint, frame, bevel=0.006)
    cap = box('cap', -0.31, -0.02, -0.125, 0.125, 0.50, 0.522)
    finish(cap, paint, frame, bevel=0.007)
    sticker(frame)
    for s in (-1, 1):
        pin = cyl('pin', 0.016, 0.03, (0.02, s * (SPREAD / 2 + 0.012), 0.066), 'Y')
        finish(pin, chrome, frame, bevel=0.002)

    # Lift ram: chrome rod that rises with the frame, out of the fixed pump body
    ram = cyl('ram', 0.021, 0.30, (-0.25, 0, 0.385))
    finish(ram, chrome, frame)

    fixed = bpy.data.objects.new('fixed', None)
    bpy.context.collection.objects.link(fixed)
    fixed.parent = root

    pump = cyl('pump', 0.058, 0.30, (-0.25, 0, 0.30))
    finish(pump, black, fixed, bevel=0.005)
    collar = cyl('collar', 0.066, 0.03, (-0.25, 0, 0.44))
    finish(collar, black, fixed, bevel=0.004)
    block = box('block', -0.31, -0.19, -0.055, 0.055, 0.155, 0.24)
    finish(block, black, fixed, bevel=0.006)

    pivot = (-0.335, 0, 0.30)
    grip = handle(pivot, black, rubber)
    grip.parent = fixed
    boss = cyl('boss', 0.042, 0.125, pivot, 'Y')
    finish(boss, black, fixed, bevel=0.004)

    # Steering wheels stay on the floor while the frame rises
    wheels = []
    for s in (-1, 1):
        tyre = cyl('steer', 0.09, 0.052, (-0.25, s * 0.042, 0.09), 'Y')
        finish(tyre, nylon, fixed, bevel=0.009)
        wheels.append(tyre)
        hub = cyl('hub', 0.03, 0.058, (-0.25, s * 0.042, 0.09), 'Y')
        finish(hub, steel, fixed, bevel=0.002)
    for s in (-1, 1):
        cheek = box('cheek', -0.31, -0.19, s * 0.078 - 0.005, s * 0.078 + 0.005, 0.07, 0.17)
        finish(cheek, black, fixed, bevel=0.002)

    links = []
    # Load rollers sit inside the fork tips and stay on the floor
    for s in (-y, y):
        for dx in (-0.05, 0.05):
            r = cyl('roller', 0.04, 0.07, (0.965 + dx, s, 0.04), 'Y')
            finish(r, nylon, fixed, bevel=0.004)
        axle = box('axle', 0.90, 1.03, s - 0.044, s + 0.044, 0.03, 0.05)
        finish(axle, steel, fixed, bevel=0.002)
        # Stretches with the lift so the rollers stay joined to the fork
        link = box('link', -0.03, 0.03, -0.04, 0.04, 0, FORK_TOP - 0.05)
        link.location = (0.965, s, 0.05)
        finish(link, steel, fixed)
        links.append(link)
    return root, frame, grip, links


def build_load():
    """Wooden pallet with cartons. Its near edge is at x = 0, deck top 145 mm."""
    wood = material('wood', 'B98E58', rough=0.62)
    card = material('card', 'C79E69', rough=0.72)
    nt = card.node_tree
    bsdf = nt.nodes['Principled BSDF']
    info = nt.nodes.new('ShaderNodeObjectInfo')
    tint = nt.nodes.new('ShaderNodeHueSaturation')
    span = nt.nodes.new('ShaderNodeMapRange')
    span.inputs['To Min'].default_value = 0.82
    span.inputs['To Max'].default_value = 1.08
    tint.inputs['Color'].default_value = bsdf.inputs['Base Color'].default_value
    nt.links.new(info.outputs['Random'], span.inputs['Value'])
    nt.links.new(span.outputs['Result'], tint.inputs['Value'])
    nt.links.new(tint.outputs['Color'], bsdf.inputs['Base Color'])
    grain = nt.nodes.new('ShaderNodeTexNoise')
    grain.inputs['Scale'].default_value = 90
    grain.inputs['Detail'].default_value = 6
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.12
    nt.links.new(grain.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    tape = material('tape', 'D9BE93', rough=0.28)
    root = bpy.data.objects.new('load', None)
    bpy.context.collection.objects.link(root)

    L, W = 1.20, 1.0
    for i in range(7):
        x = 0.01 + i * (L - 0.1) / 6
        finish(box('deck', x, x + 0.09, -W / 2, W / 2, 0.122, 0.145), wood, root, bevel=0.002)
    for x in (0.0, L - 0.1):
        finish(box('rail', x, x + 0.1, -W / 2, W / 2, 0.10, 0.122), wood, root, bevel=0.002)
    for y in (-W / 2 + 0.05, 0, W / 2 - 0.05):
        for x in (0.0, (L - 0.1) / 2, L - 0.1):
            finish(box('block', x, x + 0.1, y - 0.05, y + 0.05, 0, 0.10), wood, root, bevel=0.003)

    cw, cd, ch = 0.385, 0.325, 0.30
    for layer in range(2):
        for ix in range(3):
            for iy in range(3):
                if layer and ix == 2 and iy == 0:
                    continue
                x, y = 0.02 + ix * (cw + 0.008), -W / 2 + 0.01 + iy * (cd + 0.006)
                z = 0.145 + layer * (ch + 0.003)
                finish(box('carton', x, x + cw, y, y + cd, z, z + ch), card, root, bevel=0.004)
                finish(box('tape', x + cw / 2 - 0.024, x + cw / 2 + 0.024, y - 0.0006, y + cd + 0.0006,
                           z + ch - 0.0, z + ch + 0.0007), tape, root)
    return root


def build_showroom():
    floor = bpy.data.materials.new('floor')
    floor.use_nodes = True
    nt = floor.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = srgb('24262A')
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 7
    noise.inputs['Detail'].default_value = 9
    ramp = nt.nodes.new('ShaderNodeMapRange')
    ramp.inputs['From Min'].default_value = 0.3
    ramp.inputs['From Max'].default_value = 0.7
    ramp.inputs['To Min'].default_value = 0.14
    ramp.inputs['To Max'].default_value = 0.34
    nt.links.new(noise.outputs['Fac'], ramp.inputs['Value'])
    nt.links.new(ramp.outputs['Result'], b.inputs['Roughness'])

    plane = new_mesh('floor', lambda bm: bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=30))
    plane.data.materials.append(floor)

    wall = material('wall', '15171A', rough=0.6)
    back = new_mesh('wall', lambda bm: bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=30))
    back.rotation_euler = (math.pi / 2, 0, 0)
    back.location = (0, 6.5, 0)
    back.data.materials.append(wall)

    world = bpy.data.worlds.new('world')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.01, 0.011, 0.013, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 1
    bpy.context.scene.world = world

    def light(name, loc, target, size, power, color=(1, 1, 1), size_y=None):
        li = bpy.data.lights.new(name, 'AREA')
        li.shape = 'RECTANGLE'
        li.size, li.size_y = size, size_y or size
        li.energy, li.color = power, color
        ob = bpy.data.objects.new(name, li)
        bpy.context.collection.objects.link(ob)
        ob.location = loc
        ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
        return ob

    key = light('key', (-1.5, -2.5, 3.6), (0.3, 0, 0.3), 3.5, 300, (1, 0.97, 0.92), 2.2)
    top = light('top', (1.2, 0, 3.4), (1.2, 0, 0), 5, 160, (1, 1, 1), 1.4)
    rim = light('rim', (-3.2, 2.6, 2.4), (0.0, 0, 0.5), 2.4, 200, (1, 0.32, 0.24), 1)
    light('strip', (3.6, -1.8, 1.1), (0.4, 0, 0.4), 0.5, 90, (0.82, 0.9, 1), 3)
    light('wall_glow', (0.4, 5.2, 0.15), (0.4, 6.5, 1.3), 5, 220, (0.95, 0.97, 1), 1)
    light('handle_strip', (-3.0, -0.6, 1.2), (-0.3, 0, 0.9), 0.35, 160, (1, 1, 1), 2.6)
    # These light the scene but must not show up as glare on the paint or floor
    for ob in (key, top, rim):
        ob.visible_glossy = False


def setup_render(width, height, samples, fps=30):
    s = bpy.context.scene
    if os.environ.get('FILM_ENGINE') == 'EEVEE':
        s.render.engine = 'BLENDER_EEVEE'
        s.eevee.taa_render_samples = samples
        s.render.resolution_x, s.render.resolution_y = width, height
        s.render.fps = fps
        s.view_settings.view_transform = 'Standard'
        s.view_settings.exposure = -0.9
        return
    s.render.engine = 'CYCLES'
    s.cycles.device = 'CPU'
    s.cycles.samples = samples
    s.cycles.use_denoising = True
    s.cycles.denoiser = 'OPENIMAGEDENOISE'
    s.cycles.use_adaptive_sampling = True
    s.cycles.adaptive_threshold = 0.04
    s.cycles.max_bounces = 6
    s.cycles.caustics_reflective = False
    s.cycles.caustics_refractive = False
    s.render.resolution_x, s.render.resolution_y = width, height
    s.render.fps = fps
    s.render.film_transparent = False
    s.view_settings.view_transform = 'Standard'   # keeps the brand yellow and red true
    s.view_settings.look = 'None'
    s.view_settings.exposure = -0.9


def camera(loc, target, lens=50, fstop=0, focus=None):
    cam = bpy.data.cameras.new('cam')
    cam.lens = lens
    ob = bpy.data.objects.new('cam', cam)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    if fstop:
        cam.dof.use_dof = True
        cam.dof.aperture_fstop = fstop
        cam.dof.focus_distance = focus or (Vector(target) - Vector(loc)).length
    bpy.context.scene.camera = ob
    return ob


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)
