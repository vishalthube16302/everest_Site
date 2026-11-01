// Puts overlay.html over the Blender frames and encodes the finished film.
// The last Blender frame is held under the end card.
// Usage: node compose.mjs <frame folder> <fps> <output.mp4> [overlay file]
import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import ffmpeg from 'ffmpeg-static';

const [frames, fpsArg, out, overlay = 'overlay.html'] = process.argv.slice(2);
const fps = Number(fpsArg);
const dir = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(pathToFileURL(path.join(dir, overlay)).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => window.ready);
const seconds = await page.evaluate(() => window.DURATION);

// Hold the last Blender frame under the end card by extending the numbered sequence
const last = readdirSync(frames).filter(n => /^\d{5}\.jpg$/.test(n)).length - 1;
for (let f = last + 1; f < fps * seconds; f++) {
  const name = path.join(frames, `${String(f).padStart(5, '0')}.jpg`);
  if (!existsSync(name)) copyFileSync(path.join(frames, `${String(last).padStart(5, '0')}.jpg`), name);
}

const enc = spawn(ffmpeg, ['-y',
  '-framerate', String(fps), '-i', path.join(frames, '%05d.jpg'),
  '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
  '-filter_complex', `[0]scale=1920:1080:flags=lanczos[b];[b][1]overlay`,
  '-t', String(seconds), '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out],
  { stdio: ['pipe', 'ignore', 'inherit'] });
const done = new Promise((ok, no) => enc.on('close', c => (c === 0 ? ok() : no(new Error(`ffmpeg exited ${c}`)))));
for (let f = 0; f < fps * seconds; f++) {
  await page.evaluate(x => window.seek(x), f / fps);
  const shot = await page.screenshot({ type: 'png', omitBackground: true });
  if (!enc.stdin.write(shot)) await new Promise(r => enc.stdin.once('drain', r));
}
enc.stdin.end();
await done;
await browser.close();
console.log('wrote', out);
