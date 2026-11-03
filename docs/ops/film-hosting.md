# Film hosting

**Live (2026-11-03):** the films sit in a separate Cloudflare Pages project, `everest-films` (https://everest-films.pages.dev), uploaded as a zip with a `_headers` file (open access, 1-year cache). The main project `everest-site` reads them through the variable `NEXT_PUBLIC_FILMS_BASE_URL`. To replace a film: use a new file name, upload a new zip to `everest-films`, rebuild `everest-site`. Source files stay in `web/public/films` on the owner's computer (not in git).

Films are not stored in Supabase or the repo. They go on Cloudflare once the owner connects it.

## Files per film

`everest-<name>-1080.mp4`, `everest-<name>-720.mp4`, `everest-<name>-poster.jpg`. Names: pallet, compressor, scale, dental, motor, screw. Total about 12 MB.

## Plan

1. Owner connects the `redesign/v2` branch to a Cloudflare Pages project (after the customer confirms). Nothing is connected yet.
2. Put the 18 files in the site's `public/films/` folder at build time, or in a Cloudflare R2 bucket if the size grows. R2 has a free tier.
3. `FilmPlayer` shows the poster first and loads the 720p file on phones, 1080p on desktop, only after a tap.
4. Add `Cache-Control: public, max-age=31536000, immutable` for `/films/*`. Change a film's file name when it is replaced.

## Film address setting

Set `NEXT_PUBLIC_FILMS_BASE_URL` (for example an R2 address) and the site reads every film, poster and scroll frame from there, using the same `/films/...` paths. Leave it empty to use the site's own `public/films`. Change it, rebuild, and the files can sit outside git. The owner still has to upload the files to that address.

## Rules

- No sound, so no autoplay problems. Respect `prefers-reduced-motion`.
- Do not touch the live Cloudflare project or the live domain.
