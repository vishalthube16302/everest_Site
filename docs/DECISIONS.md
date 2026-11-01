# Decisions

Newest first. One line each, with the reason.

## 2026-11-01

- ui-ux-pro-max is not installed, so Direction A was checked by hand (contrast, states, type scale). Reason: avoids a blocked step.
- Screw film shows the principle with two meshing rotors and the range 3 to 30 HP at 8 bar, no CFM. Reason: no checked screw specs.
- Weight on the scale film is a sample load, captioned as such.
- Prices stay hidden, with an admin show or hide control. Reason: owner's choice, and enquiries bring leads.
- Add the extra ranges shown online to the catalogue. Reason: Google and IndiaMART already show them.
- Scale truck photo is the owner's own, so the retouched version stays.
- Home hero shows the portable silent compressor and yellow hand pallet truck. Reason: owner prefers them, and yellow suits animation.
- Screw compressors stay off the front. They remain a range on the site.
- Direction A Showroom chosen after comparing A, B and C.
- Make one film per main range, not 37 films. Reason: owner's request.
- Show only genuine reviews, from IndiaMART and Google. The 4 database testimonials stay unused.
- Show no other brand on the site. Reason: owner's rule.
- Pimpri-Chinchwad is the correct address. Chakan wording must go.
- Everest sells to dealers, so the dealer path stays.
- Films use a Chrome and ffmpeg renderer. Reason: free and easy to automate.
- Remotion is not used. Reason: Everest is above its free company size.
- Website animation uses Motion, which has an MIT licence.
- ui-ux-pro-max may be used as a design reference in Phase 2, after its scripts are read.
- Blender 3D is left out for now. Reason: cutaways show more for less work.
- Rebuild in Next.js with static pages. Reason: bots and customers get full pages at once.
- Everest V2 is a separate free Supabase project in Mumbai. Reason: keeps the live site safe, and tests showed faster queries from Pune.
- SEO and AI SEO come last, in Phase 4.
- The site goes live only after the whole site is finished and the owner approves.
- No backup of the live project is needed for this work, because it is not changed.
- Film and image tools live in the repo under `tools/`. Rendered films stay outside it. Reason: MP4 files are large and the repo is public.
- Films show the real product photo in plain steps, not 2D engineering diagrams. The pallet truck film shows the same truck three times: forks down, pumping, lifted. Reason: owner's feedback, the audience is ordinary buyers. `scene-hydraulic.html` is kept but unused.
- Product sticker is the owner's artwork, tagline "Engineering Power. Delivering Trust." Films use `tools/images/processed/everest-sticker.png`. `pallet-front.webp` has a garbled tagline and must not be published until fixed.
- Pallet truck film moves to a Blender 3D model. Reason: owner wants it realistic and premium, which a flat photo cannot give. This replaces the earlier decision to leave Blender out.
- Portable compressor film uses the first-round sample `everest-compressor.mp4` (12 s, photo based), not the 3D version. Reason: owner's choice. The 3D compressor render and `tools/blender/compressor.py` are kept unused.
- 3D film style approved and pallet truck model confirmed correct by the owner (2026-11-01). The compressor film stays as the first-round sample for now; owner wants a later version that shows more of the parts.
- Noise on the 2 HP compressor is ≤70 dB. ≤60 dB is only for the 0.75 HP and 1 HP models. Source: database.
- New range specs use the owner's spec posters where they differ from the everesthps.in listings. Reason: posters give real model numbers and full tables, and listings conflict with each other.
- Uploads and deletes on Everest V2 use a secret key kept outside the repo in the owner's user folder. Reason: the Supabase connector declines delete statements and has no upload tool, and this key cannot reach the live project.
- Owner approved the 61-image set. The red and black 0.9 HP motor is the owner's product, and the AI background photos stay. Reason: owner's review, 2026-11-01.
- Everest logo goes in the image corner on motor photos, not on the motor itself. Reason: owner wants the brand on every image, and a painted mark would show something the product does not carry.
- Spec-table posters and feature diagrams are left out of the image set. Reason: specs come from the database, and some posters conflict with it (for example noise figures), so they cannot be published.
- CE marks are removed from photos. Reason: no certification is confirmed.
- Phase 1 is complete. Phase 2 starts next.
- Owner ignores the remaining open questions. Delivery and installation are published as offered, not as free. Screw compressors are named by HP because no model numbers exist. Google review text is collected in Phase 3.
