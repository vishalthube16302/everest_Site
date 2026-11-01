// Makes the web files for a finished film: 1080p and 720p MP4 plus a poster image.
// Usage: node web.mjs <film.mp4> <output folder> <name> [poster second]
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';

const [film, out, name, poster = '8'] = process.argv.slice(2);
const run = args => {
  const r = spawnSync(ffmpeg, ['-y', '-v', 'error', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg failed for ${name}`);
};
const encode = (height, crf, suffix) => run(['-i', film, '-vf', `scale=-2:${height}:flags=lanczos`,
  '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
  path.join(out, `everest-${name}-${suffix}.mp4`)]);

encode(1080, 26, '1080');
encode(720, 28, '720');
run(['-ss', poster, '-i', film, '-frames:v', '1', '-q:v', '3', path.join(out, `everest-${name}-poster.jpg`)]);
console.log('wrote web files for', name);
