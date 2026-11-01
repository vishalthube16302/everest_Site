# Turns the Everest pallet truck model into the weighing scale truck: indicator head with a
# working seven segment readout, polyurethane steering wheels and a silver pump.
# Spec values (model EHPTS-30-685): 3,000 kg, 88 to 203 mm, 685 mm fork spread.
import math

import bpy
import truck

SEGMENTS = {          # segment names: a top, b top right, c low right, d bottom, e low left, f top left, g middle
    ' ': '', '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg',
    '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg',
}
DIGITS = 6            # the last digit sits after the decimal point, as on the real indicator


def glow(name, color, power):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0, 0, 0, 1)
    b.inputs['Emission Color'].default_value = truck.srgb(color)
    b.inputs['Emission Strength'].default_value = power
    return m


def segment_boxes(cx, cy, h, w, t):
    """Each segment as (name, x0, x1, y0, y1). Local +x is up the screen, -y is to the right."""
    hx, hy, g = h / 2, w / 2, t * 0.12
    return (
        ('a', cx + hx - t, cx + hx, cy - hy + g, cy + hy - g),
        ('g', cx - t / 2, cx + t / 2, cy - hy + g, cy + hy - g),
        ('d', cx - hx, cx - hx + t, cy - hy + g, cy + hy - g),
        ('f', cx + g, cx + hx - g, cy + hy - t, cy + hy),
        ('b', cx + g, cx + hx - g, cy - hy, cy - hy + t),
        ('e', cx - hx + g, cx - g, cy + hy - t, cy + hy),
        ('c', cx - hx + g, cx - g, cy - hy, cy - hy + t),
    )


def label(text, parent, x, y, z, size, mat):
    cu = bpy.data.curves.new('label', 'FONT')
    cu.body = text
    cu.size = size
    cu.align_x, cu.align_y = 'CENTER', 'CENTER'
    cu.materials.append(mat)
    ob = bpy.data.objects.new('label', cu)
    bpy.context.collection.objects.link(ob)
    ob.parent = parent
    ob.location = (x, y, z)
    ob.rotation_euler = (0, 0, -math.pi / 2)   # reads left to right for someone at the handle
    return ob


def build_indicator(frame, paint):
    housing = truck.material('housing', '2B2E33', rough=0.45)
    face = truck.material('face', '1F5FB4', rough=0.32, coat=0.5)
    glass = truck.material('glass', '050506', rough=0.12, coat=1)
    ghost = glow('ghost', '3A0606', 1.0)
    lit = glow('lit', 'FF1E1E', 7.0)
    white = glow('white', 'F2F4F7', 1.2)
    ink = truck.material('ink', '0B2A3A', rough=0.5)

    post = truck.box('post', -0.075, 0.035, -0.095, 0.095, 0.50, 0.615)
    truck.finish(post, paint, frame, bevel=0.012)
    yoke = truck.box('yoke', -0.105, 0.035, -0.115, 0.115, 0.600, 0.655)
    truck.finish(yoke, paint, frame, bevel=0.012)

    head = bpy.data.objects.new('indicator', None)
    bpy.context.collection.objects.link(head)
    head.parent = frame
    head.location = (-0.04, 0, 0.70)
    head.rotation_euler = (0, -math.radians(34), 0)

    truck.finish(truck.box('shell', -0.095, 0.095, -0.150, 0.150, -0.024, 0.012), housing, head, bevel=0.014)
    truck.finish(truck.box('panel', -0.082, 0.082, -0.136, 0.136, 0.0, 0.0135), face, head, bevel=0.002)
    truck.finish(truck.box('screen', 0.002, 0.070, -0.122, 0.122, 0.0, 0.0150), glass, head)

    # Seven segment digits: each one starts dark, render time switches on what it needs
    segs = []
    pitch, h, w, t = 0.0375, 0.052, 0.024, 0.0052
    for i in range(DIGITS):
        cy = 0.094 - i * pitch
        parts = {}
        for name, x0, x1, y0, y1 in segment_boxes(0.036, cy, h, w, t):
            truck.finish(truck.box('off', x0, x1, y0, y1, 0.0150, 0.0153), ghost, head)
            on = truck.box('on', x0, x1, y0, y1, 0.0150, 0.0156)
            truck.finish(on, lit, head)
            parts[name] = on
        segs.append(parts)
    dot = truck.box('point', 0.009, 0.0145, 0.094 - 4.5 * pitch - 0.003, 0.094 - 4.5 * pitch + 0.003, 0.0150, 0.0156)
    truck.finish(dot, lit, head)

    # Keys, in the order on the real indicator
    colours = ('1B3C8C', 'D21F2B', '5CC6A0', '5CC6A0', '5CC6A0', '5CC6A0', '1B3C8C')
    names = ('Hold', 'Total', 'lb/kg', 'Gross', 'Tare', 'Zero', 'Print')
    for i, (colour, name) in enumerate(zip(colours, names)):
        y = 0.1125 - i * 0.0375
        key = truck.cyl('key', 0.0145, 0.003, (-0.040, y, 0.0150))
        truck.finish(key, truck.material('key' + name, colour, rough=0.3, coat=0.6), head, bevel=0.001)
        label(name, head, -0.040, y, 0.0172, 0.0072, ink if colour == '5CC6A0' else white)
    label('EVEREST', head, 0.0755, -0.100, 0.0140, 0.0072, white)
    return segs, dot


def show(segs, value):
    """Shows a weight in kg with one decimal place, right aligned, no leading zeros."""
    text = f'{value:.1f}'.replace('.', '').rjust(DIGITS)
    for parts, ch in zip(segs, text):
        wanted = SEGMENTS[ch]
        for name, ob in parts.items():
            ob.hide_render = name not in wanted


def dress(paint=None):
    """Swaps the truck's wheels and pump for the ones on the weighing truck."""
    red = truck.material('pu', '7D1426', rough=0.42)
    dark = truck.material('wheelhub', '101113', rough=0.4)
    silver = truck.material('silver', 'B8BCC2', rough=0.32, metal=1)
    swaps = {'steer': red, 'hub': dark, 'pump': silver, 'collar': silver, 'block': silver}
    for ob in bpy.data.objects:
        mat = swaps.get(ob.name.split('.')[0])
        if mat:
            ob.data.materials[0] = mat
