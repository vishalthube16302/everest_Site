# Video status

One film per main range, not one per product.

| Order | Range | Template | Status |
|---|---|---|---|
| 1 | Hand pallet truck | Hydraulic | 3D film done (`everest-pallet-3d-FINAL.mp4`); awaiting owner check against the real truck |
| 2 | Portable silent compressor | Compressor | Owner chose the first-round sample `everest-compressor.mp4`; web files next |
| 3 | Pallet truck with weighing scale | Scale | 11 s cut made from the frames rendered so far (slide in, pump begins, end card). Weight reading and move-away shots are not rendered. Full 20 s film waits for the owner to ask (`film_scale.py`, `overlay-scale.html`) |
| 4 | Dental and lab compressor | Compressor | Done, web files made (`everest-dental-*`) |
| 5 | Compressor motor | Motor | Done, web files made (`everest-motor-*`) |
| 6 | Screw compressor | New rotor scene | Done, web files made (`film_screw.py`, `overlay-screw.html`); shows range 3 to 30 HP, 8 bar |

Stackers and lifting tables can get films after launch if wanted.

## Trial exploded films

Made with `tools/video/exploded` for the scroll trial. Files are in `everest_redesign_samples/flow-trial/final/`. 1920x1080, 8 s, 30 fps.

| Film | Status |
|---|---|
| Pallet truck | Done, awaiting owner review. Pump, wheels, rollers and handle come from the ChatGPT split image |
| Portable compressor | Done, awaiting owner review. Pistons come from the ChatGPT split image; all other parts are the real photo |

Scroll versions are 19 MB each, too large for the site. They need a smaller web cut after approval. A portrait phone version is also needed.

The weight on the scale film is a sample load and is captioned so. Web files: `node tools/video/web.mjs`.
