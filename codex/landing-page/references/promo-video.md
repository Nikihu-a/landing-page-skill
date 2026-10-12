# Promo videos and approval samples

## Deterministic browser capture

Screen recording a WebGL page is unreliable: a hidden pane throttles `requestAnimationFrame` and timing jitters. Instead:

1. Run `scripts/recorder.py <port> <site-root> <out-dir>` in the background. It:
   - serves the site without cache;
   - injects `scripts/capture.js` into `/?capture` pages;
   - saves frames that are POSTed to `/__frame?i=N` as `NNNNN.jpg`.
2. `capture.js` replaces `performance.now` and `requestAnimationFrame` with a manual clock. `__cap.step(steps, every)` advances 1/60 s per step and uploads the `#gl` canvas every `every` steps.
3. Set the browser viewport (e.g. 960×540; the canvas renders at DPR, about 1680×945). Navigate to `http://localhost:<port>/?capture#/<id>` and reload.
4. Let the intro finish without capturing: `await __cap.step(240, 0)`.
5. Run this in the page (via browser automation, e.g. Playwright `page.evaluate`) and let it continue in the background, since long evaluate calls can time out:
   ```js
   __cap.step(360, 2).then(r => { window.__done = r; }); "started"
   ```
   That gives 180 frames, or 6 s at 30 fps.
6. Poll the frame count on disk from Bash. Move the frames to a folder per clip.

## Encode

```bash
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")   # from a venv that has imageio-ffmpeg
"$FF" -y -framerate 30 -i frames/%05d.jpg -c:v libx264 -crf 18 -pix_fmt yuv420p \
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" promo/sample-<name>.mp4
```

Keep `promo/` gitignored. Give the user the file paths (or attach the clips), and say for each clip what to look at and what can be tuned (strength, count, colour).

## Trailer (landscape, for YouTube)

- An offline renderer in Python (numpy + cv2) can reproduce the depth ray-march for cinematic camera moves. Define shots as keyframes (camera position, zoom, a `free` anchor, per-shot spread).
- Set titles with PIL using the site fonts (Cormorant + Noto Serif SC for bilingual EN/中文).
- Use the site's licensed music. Credit it in the description.
- **No film grain in the video.** It made the file 208 MB instead of 31 MB.
- Write a YouTube description file with: title, a bilingual description, the live link (deep link to the item), painting/music/font credits, the owner credit, and tags.

## Series idea that worked

"Secrets of a Painting / 一幅画的秘密": one short per item. A ring overlay and camera moves reveal one hidden detail, with a bilingual caption, and the video ends on the deep link.
