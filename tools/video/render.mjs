// Renders a product film frame by frame in Chrome and encodes it with ffmpeg.
// Usage: node render.mjs <compressor|pallet|hydraulic|stages> [--stills 1,3,6,8,11]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import ffmpeg from 'ffmpeg-static';

const FPS = 30;
const id = process.argv[2];
const stillsArg = process.argv.indexOf('--stills');
const stills = stillsArg > 0 ? process.argv[stillsArg + 1].split(',').map(Number) : null;
const dir = path.dirname(fileURLToPath(import.meta.url));
import { existsSync } from 'node:fs';
const scene = existsSync(path.join(dir, `scene-${id}.html`)) ? `scene-${id}.html` : 'scene.html';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(`${pathToFileURL(path.join(dir, scene))}?p=${id}`, { waitUntil: 'networkidle0' });
await page.evaluate(() => window.ready);
const SECONDS = await page.evaluate(() => window.DURATION || 12);

if (stills) {
  for (const t of stills) {
    await page.evaluate(x => window.seek(x), t);
    writeFileSync(path.join(dir, `still-${id}-${t}.jpg`), await page.screenshot({ type: 'jpeg', quality: 80 }));
  }
} else {
  const out = path.join(dir, `everest-${id}.mp4`);
  const enc = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out],
    { stdio: ['pipe', 'ignore', 'ignore'] });
  const done = new Promise((ok, no) => enc.on('close', c => (c === 0 ? ok() : no(new Error(`ffmpeg exited ${c}`)))));
  for (let f = 0; f < FPS * SECONDS; f++) {
    await page.evaluate(x => window.seek(x), f / FPS);
    const shot = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!enc.stdin.write(shot)) await new Promise(r => enc.stdin.once('drain', r));
  }
  enc.stdin.end();
  await done;
  console.log('wrote', out);
}
await browser.close();
