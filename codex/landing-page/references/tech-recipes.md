# Tech recipes

The reference implementation is https://github.com/Nikihu-a/louvre-after-dark (live: https://nikihu-a.github.io/louvre-after-dark/). Read its source for working code.

| Concern | File |
|---|---|
| App shell, routing, loader, input, audio wiring | `js/app.js` |
| Curved gallery, reflections, opening | `js/gallery.js` |
| Full-screen depth ray-march, lamp, loupe, living motion | `js/immersive.js` |
| Content data (texts, hotspots, palette, motion, era) | `js/data.js` |
| UI strings | `js/strings.js` |
| Web Audio: swell, room tone, era loops | `js/audio.js` |
| Offline asset tools | `tools/*.py` |

## Project layout

```
index.html            one page; CSS/JS linked with ?v=N
css/style.css         tokens on :root; mobile rules at <= 760px
js/app.js             entry (type="module")
js/data.js            all content in one array
assets/img|depth|plate/<id>.webp
assets/fonts/*.woff2 + OFL.txt
assets/music/*.mp3 + CREDITS.md
assets/og-cover.jpg   1200x630
vendor/three.module.min.js + three.LICENSE
tools/                python scripts that rebuild assets
promo/                videos (gitignored)
```

## Routing in one page

- `location.hash` drives the mode: `#/` is the main view and `#/<id>` is the detail view. Listen to `hashchange`, and use `history.replaceState` for in-mode navigation so Back goes to the gallery.
- Escape key and a "Gallery" button return to the main view.
- `?static` gives a lightweight page without WebGL; auto-select it when WebGL 2 is missing.

## Content data shape (example)

```js
{ id: "horatii", year: "1784", title: "The Oath of the Horatii", artist: "Jacques-Louis David",
  era: "neoclassical", music: "neoclassical",
  palette: ["#292622", "#6f4726", "#575148", "#a06640", "#928368"],
  hotspots: [{ x: 0.47, y: 0.33, zoom: 2.2, title: "...", text: "..." }],
  motion: { particles: { mode: "dust", count: 44, size: 0.0046, opacity: 0.85, box: [...] } } }
```

## 2.5D depth parallax (from a flat image)

1. **Depth map**: Depth Anything V2 small (ONNX) via onnxruntime. Normalize, then slightly dilate near edges so silhouettes stay clean (`tools/make_depth.py`).
2. **Background plate**: find the near side of strong depth edges (threshold ~0.14, band ~41 px) and inpaint behind them with LaMa ONNX (`tools/make_plate.py`). When the camera moves, revealed gaps sample the plate instead of stretched edges.
3. **Shader**: full-screen quad doing a parallax-occlusion ray march through the depth map (about 32–64 steps; fewer under adaptive quality). Lamp lighting uses normals from depth gradients.
4. **Framing**: `fitHeight` with a small margin (1.08) and a max crop (1.35), so portrait images are not over-cropped. Mask the canvas edges.
5. **Living motion**: displace the lookup UV inside the depth function `at(p, h)` with a depth mask, which keeps occlusion correct:
   - rock: rotate around a pivot for a depth band;
   - waves: a y-band with a small sine;
   - smoke: noise drift for far depths only.

   Particles (petals or dust) are drawn in screen space in the same fragment shader. They are lit by the ambient light and the lamp spot, blended with `mix` (petals) or added on top (dust).
6. **Transitions**: dissolve between items in depth order (near pixels go first). In the hand-off, the gallery card flies to the exact first-frame rect of the detail view, so the switch is invisible.

## Gallery tricks (three.js r169)

- Cards bent onto a cylinder in the vertex shader. The radius tightens with scroll speed, and velocity drives a clamped chroma split (`clamp(v, -2, 2) * 0.0028`).
- Floor reflection: mirror each card below the floor (`side = THREE.DoubleSide`, or it is culled and invisible), blur and fade it, and place the floor at `-CARD_H/2 - 0.14`.
- Additive grid floor, sparse dust points.
- Opening: camera distance 2.4 → 1, bend 4.5 → 0, and the spotlight power steps on per card with a short flicker.

## Loader and performance

- The loader waits for the fonts and the first 4 textures. The rest stream in through `setTextures`.
- Monitor frame time. If it is slow for N frames, lower `devicePixelRatio` scaling and ray-march steps; raise them again when there is headroom.
- On `webglcontextlost`, call `preventDefault`, then rebuild on restore.
- Guard input handlers: `if (!(e.target instanceof Node)) return;` before calling `closest`/`contains`.

## Audio (Web Audio)

- Create the `AudioContext` only on the user's click of "Sound on".
- Master gain → music bus (0.4, ducked to 0.22 in detail view) plus room tone.
- Era loops: `fetch` → `decodeAudioData` → buffer sources looped with a 4 s crossfade. Prefetch the next era.
- Mute: `gain.setTargetAtTime(0, t, 0.02)`, then `ctx.suspend()` after 60 ms. On `visibilitychange` hidden, call `suspend()`.
- The swell is noise through a band-pass filter with a slow attack and release. No per-event clicks.

## Colour palettes

`tools/make_palettes.py`: k-means in Lab on downsampled pixels. Take 3 base tones by cluster weight plus 2 vivid accents (high chroma, enough pixel share), dedupe by distance, and sort dark → light. In the UI, show them as 14 px circles with a 7 px gap, each with a `title` of the hex value.

## Music loops

`tools/make_music.py <ffmpeg> <dir>`: cut a section, loudness-normalize, fade out over 4 s, and encode MP3. ffmpeg comes from the `imageio-ffmpeg` pip package (`imageio_ffmpeg.get_ffmpeg_exe()`) when no system ffmpeg exists.

## OG image

`tools/make_og.py` uses PIL with the site's own woff2 font (convert it or load it with `ImageFont.truetype`). Output is 1200×630 JPEG. Reference it with absolute URLs in `og:image` and `twitter:card`.
