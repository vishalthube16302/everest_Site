# Status

Updated: 2026-11-02

**Current phase:** Phase 2 work complete (2026-11-02). Waiting for the owner to approve the images and films. Phase 3 (build the site) is next.

**Next step:** Owner reviews the six films in `everest_redesign_samples/web-ready/`. Then Phase 3, the Next.js build, run locally. No new render runs until the owner asks.

**Blocked by:** Nothing for Phase 3 start. Items waiting on the owner are in `content/open-questions.md`.

**Branches:** `redesign/v2` holds Phases 1 and 2 (PR #13 merged into it). `main` and the live site are untouched. Merge to `main` only after the owner's customer gives the final go-ahead. Cloudflare is not connected.

## Done

- Branch `redesign/v2` created from `origin/main`.
- Everest V2 Supabase project created in Mumbai with 7 tables of data copied and checked.
- Design Direction A chosen.
- Two first-round sample films made.
- Scale truck photo retouched.
- Owner's content answers recorded.
- This document set written. It is not committed yet.
- Film and image tools copied into `tools/` (not committed yet).
- Pallet truck film rebuilt in Blender 3D with the owner sticker. Motion preview made (`tools/blender`, `tools/video/compose.mjs`). Full-HD render not yet run.
- Image set built with `tools/images/build_v2.py`: 158 files reduced to 61 retouched images, 1200x900, 4.1 MB. Owner approved, uploaded and linked in Everest V2.
- 37 new products added to Everest V2: now 74 products in 13 ranges, 125 images, no links to live storage, no other brand names.
- Design tokens finished: contrast checked, type scale, states, spacing (`design/tokens.md`).
- Six films made with web files: pallet truck, compressor, dental, motor, screw, scale truck. The scale film is an 11 s cut from frames already rendered.
- Film hosting plan written (`ops/film-hosting.md`). Nothing connected.
- PR #13 (`feature/phase-1-2` into `redesign/v2`) merged on 2026-11-02.

## Where work lives outside the repo

Folder: `D:\Shared Folder\Work Data\Website\everest_redesign_samples\`

- Sample films and the retouched scale truck photo
- `tools/video`: film renderer
- `tools/images`: image scripts and processed images

The tools now live in the repo under `tools/video` and `tools/images`. Rendered films stay outside the repo.

Design canvas: https://claude.ai/artifact/EmitbY6bTkJgvNsfUNW4Yi (private to the owner)
