# Design playbook

These decisions came from real back-and-forth on *Louvre After Dark*. Treat them as defaults for this user, and ask before reversing one.

## Concept

- Start from **one strong metaphor** and let every element serve it. Louvre: "walk the Louvre after hours with a lamp", which gave the dark gallery, spotlights switching on, the lamp toggle and the era soundtrack.
- Give the content a **spine**. Ten paintings became a timeline (1483 → 1830) on a curved wall, not a grid. Scroll moves along the spine, and opening an item becomes a mode.
- References the user liked: Jesper Landberg's portfolio (curved cards over a grid floor, scroll-velocity distortion), 2.5D depth-parallax shots of paintings, and Getty's Persepolis site (transitions that feel like walking through a building). They liked the *feel*, not a literal copy. A literal walk-through gallery was tried and rejected.

## Structure

- Single page with an intro/hero, the main experience, and an in-page detail mode (`#/<id>`, shareable). No sub-pages.
- Detail mode: full-screen item, a few **hotspots** (gold markers) that dolly the camera to details with short captions, next/previous, and a magnifier on press-and-hold.
- Also provide a guide or "about" text for the content (the user asked for an explanation of every painting and the music). This can live in the README or a document; it doesn't have to go on the page.

## Text and frame

- Keep the frame **as quiet as possible**. Over the project the user removed:
  - the site title from the top bar,
  - "by Niki" from the top bar,
  - the meta line under titles,
  - the bottom instruction bar in the detail view,
  - the language toggle (the site became English-only).
- Keep: a small logo (`LOUVRE·NUIT`), Sound and Lamp toggles with icons, and museum-style wall labels (year / title / artist).
- The intro hint is one short line ("Click or scroll to enter").
- Owner credit: shown once on the content wall ("Curated by Niki"), in the copyright line, in the meta author, and in the README.

## Typography

- Cormorant Garamond, self-hosted woff2: 300 for display, 400 italic for gold accents (`<em>`). Letter-spaced small caps for labels.
- The user rejected 500 weight ("太硬") and a sans headline. If type feels off, refine the serif (size, tracking, weight, italic accents) instead of switching family.
- For Chinese copy in videos: Noto Serif SC paired with Cormorant.

## Colour and light

- Near-black warm background (`#07060a`), gold accent (`#d9b26f`), warm highlights (`#ffe2aa`).
- Light is the storytelling device: spotlights switch on in sequence during the opening, a lamp follows the cursor, and full lights are a toggle (`L`).
- Subtle film grain overlay is fine on the page (CSS). Keep it out of exported video, because it bloats the file size.

## Sound

- **Off by default. Entering never enables it.** The user was confused when music played on its own.
- The button label names the action: shows "Sound on" when muted and "Sound off" when playing. Muting must be instant (60 ms ramp, then `ctx.suspend()`).
- No clicky per-event sound effects. The user found the "哒哒哒" clacks jarring, so the opening uses one soft synthesized swell.
- Music: one loop per era/section, crossfading (4 s overlap), and ducked when a detail view opens. Use only recordings with verified CC0/CC BY/PD licences, credited in `assets/music/CREDITS.md`. Load files only after the user turns sound on.
- Suspend audio when the tab is hidden.

## Motion

- The opening: camera pulls in while the lights come on one by one, with tiny power flicker. Keep it to a few seconds and make it skippable.
- Scroll velocity bends and slightly chroma-splits the cards (clamped).
- "Living" details inside an item must be **subtle and specific to that item**: the raft rocking on waves, smoke drifting, petals falling, dust in a light beam. Displace inside the depth ray-march so occlusion stays correct. Always send a video sample first.
- Respect `prefers-reduced-motion`: no opening flight, no living motion.

## Details that add value without changing the frame

Ideas the user approved:
1. Living motion per item.
2. Signatures and hidden details, and figure identities. These are researched and shown to the user as a list before anything is added.
3. A colour palette per item: 5 swatches (3 base tones + 2 vivid accents) under the label, with the hex as the title.
