# Status

Updated: 2026-11-01

**Current phase:** Phase 2 (design system and media) started 2026-11-01

**Next step:** Owner reviews the six films in `everest_redesign_samples/web-ready/`. Then Phase 3, the Next.js build. No render runs until the owner asks. Everest V2 now holds 74 products in 13 ranges with 125 images, and no links on live storage. Battery pallet truck and air dryer wait for the owner's photos and specs. Web-ready films and posters are in `everest_redesign_samples/web-ready/`.

**Blocked by:** Nothing for the samples. See `content/open-questions.md` for items that can follow.

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

## Where work lives outside the repo

Folder: `D:\Shared Folder\Work Data\Website\everest_redesign_samples\`

- Sample films and the retouched scale truck photo
- `tools/video`: film renderer
- `tools/images`: image scripts and processed images

The tools now live in the repo under `tools/video` and `tools/images`. Rendered films stay outside the repo.

Design canvas: https://claude.ai/artifact/EmitbY6bTkJgvNsfUNW4Yi (private to the owner)
