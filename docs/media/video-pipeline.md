# Video pipeline

Each film is an HTML scene rendered frame by frame in Chrome, then encoded to MP4 with ffmpeg. There is no licence fee.

## Tools

`everest_redesign_samples/tools/video/`

- `scene.html`: layout and timing
- `products.js`: product data and callouts
- `render.mjs`: rendering

Install `puppeteer-core` and `ffmpeg-static`, then run:

```
node render.mjs pallet
node render.mjs compressor --stills 2.8,6,8.8
```

Use `--stills` to check frames before a full render.

## Output

- MP4 H.264, 1920 × 1080, 30 fps, no sound
- Main film: 20 to 25 seconds
- Short loop: about 8 seconds
- Poster image for each film

## Templates

| Template | Shows |
|---|---|
| Hydraulic | Handle pumps, oil moves, forks rise, turning radius |
| Scale | Load lifts, display counts weight |
| Compressor | Air intake, oil-free head, tank fill, gauge, noise meter |
| Motor | Parts separate to show the kit |

## Rules

- Cutaways are diagrams, not footage.
- The owner approves each diagram against the real machine.
- Use only specs from the database.
- Do not animate a number from a value the product never reaches.
- Keep labels clear of the product.
- Do not store films in Supabase.
