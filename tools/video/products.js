// Spec values come from the products table (models 1500-50L and EHPT-30-685).
const PRODUCTS = {
  compressor: {
    img: 'compressor-2hp.webp', ratio: 1006 / 988, floor: .995,
    name: '2 HP 50 L Portable Silent Compressor', model: 'MODEL 1500-50L',
    head: ['OIL-FREE', 'AIR.', 'ON WHEELS.'], tag: 'EVEREST 2 HP / 50 L',
    shots: {
      intro: { x: 900, y: 70, w: 900 },
      focus: { x: 560, y: 40, w: 1000 },
      stats: { x: 960, y: 110, w: 840 },
    },
    callouts: [
      { ax: .62, ay: .17, side: 'r', len: 170, text: ['OIL-FREE HEAD', '1.5 kW / 2 HP'] },
      { ax: .12, ay: .66, side: 'l', len: 170, text: ['50 L TANK', '8 BAR'] },
    ],
    stats: [
      { to: 240, suf: ' LPM', label: 'AIR FLOW' },
      { to: 8, suf: ' BAR', label: '116 PSI PRESSURE' },
      { from: 70, to: 70, pre: '≤', suf: ' dB', label: 'NOISE LEVEL' },
    ],
  },
  pallet: {
    img: 'pallet-side.webp', ratio: 847 / 1200, floor: .985,
    name: '3 Ton Heavy Duty Pallet Truck', model: 'MODEL EHPT-30-685',
    head: ['MOVE', '3,000 KG.', 'BY HAND.'], tag: 'EVEREST HYDRAULIC HAND PALLET TRUCK',
    shots: {
      intro: { x: 780, y: 240, w: 1080 },
      focus: { x: 320, y: 120, w: 1280 },
      stats: { x: 800, y: 280, w: 1040 },
    },
    callouts: [
      { ax: .17, ay: .62, side: 'l', len: 90, text: ['HYDRAULIC LIFT', '200 mm MAX'] },
      { ax: .975, ay: .79, side: 'r', len: 30, text: ['685 mm', 'FORK SPREAD'] },
    ],
    stats: [
      { to: 3000, suf: ' KG', label: 'LOADING CAPACITY' },
      { from: 85, to: 200, suf: ' mm', label: 'LIFT HEIGHT, FROM 85 mm' },
      { to: 1319, suf: ' mm', label: 'TURNING RADIUS' },
    ],
  },
  scale: {
    name: '3 Ton 685 Hydraulic Pallet Truck with Weight Scale', model: 'MODEL EHPTS-30-685',
    stats: [
      { to: 3000, suf: ' KG', label: 'LOADING CAPACITY' },
      { from: 88, to: 203, suf: ' mm', label: 'LIFT HEIGHT, FROM 88 mm' },
      { to: 1319, suf: ' mm', label: 'TURNING RADIUS' },
    ],
  },
  dental: {
    img: 'film-dental.webp', ratio: 806 / 509, floor: .995, pace: 1.3, back: 'film-dental-lab.webp',
    name: '0.75 HP 30 L Dental Oil Free Air Compressor', model: 'MODEL 550-30L-D. RANGE 0.75 TO 2 HP, 25 TO 50 L',
    head: ['OIL-FREE AIR.', 'QUIET ROOM.'], tag: 'EVEREST DENTAL AND LAB COMPRESSOR',
    shots: {
      intro: { x: 1100, y: 80, w: 556 },
      focus: { x: 682, y: 56, w: 600 },
      stats: { x: 1180, y: 80, w: 556 },
    },
    callouts: [
      { ax: .84, ay: .13, side: 'r', len: 150, text: ['OIL-FREE HEAD', '0.55 kW / 0.75 HP'] },
      { ax: .41, ay: .255, side: 'l', len: 300, text: ['8 BAR', '116 PSI'] },
      { ax: .97, ay: .62, side: 'r', len: 110, text: ['30 L TANK'] },
    ],
    stats: [
      { to: 110, suf: ' LPM', label: 'AIR FLOW' },
      { from: 8, to: 8, suf: ' BAR', label: '116 PSI PRESSURE' },
      { from: 60, to: 60, pre: '≤', suf: ' dB', label: 'NOISE LEVEL' },
    ],
  },
  motor: {
    img: 'film-motor-kit.webp', ratio: 750 / 757,
    name: '1 HP Oil Free Silent Air Compressor Motor', model: 'MODEL 750. RANGE 0.75 TO 2 HP',
    head: ['THE MOTOR.', 'THE FULL KIT.'], tag: 'EVEREST OIL-FREE SILENT MOTOR',
    specs: [
      { ax: .46, ay: .42, side: 'l', len: 420, text: ['COPPER WINDING'] },
      { ax: .92, ay: .24, side: 'r', len: 90, text: ['THERMAL', 'PROTECTION'] },
      { ax: .90, ay: .45, side: 'r', len: 100, text: ['AIR COOLED'] },
    ],
    stats: [
      { to: 135, suf: ' LPM', label: 'AIR FLOW' },
      { from: 8, to: 8, suf: ' BAR', label: '116 PSI PRESSURE' },
      { from: 60, to: 60, pre: '≤', suf: ' dB', label: 'NOISE LEVEL' },
    ],
  },
  screw: {
    img: 'film-screw.webp', ratio: 795 / 1106,
    name: 'Rotary Screw Air Compressors', model: '3 TO 30 HP',
    head: ['STEADY AIR.', 'FOR INDUSTRY.'], tag: 'EVEREST ROTARY SCREW COMPRESSOR',
    stats: [
      { from: 3, to: 30, suf: ' HP', label: 'RANGE, FROM 3 HP' },
      { from: 8, to: 8, suf: ' BAR', label: 'WORKING PRESSURE' },
      { text: 'AIR', label: 'COOLED' },
    ],
  },
};
