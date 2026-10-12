# Pitfalls hit on Louvre After Dark, and the fixes

## Process
- **Built on a preference** ("我觉得 b 好"), broke the live site, and upset the user. Fix: ask "要现在开始做吗？" and keep experiments on a branch.
- **Auto-playing sound** confused the user ("咋一直在放音乐"). Fix: off by default, and entering never enables it.
- **Clutter text**: the user removed taglines and bylines one at a time. Start minimal instead.

## Environment and network
- The agent sandbox blocks network access to GitHub, and the network times out about half the time. Fix: request network permission for those commands and retry them.
- Google Fonts is unreachable. Fix: self-host the woff2 files (from `@fontsource` on jsdelivr) and add the OFL licence.
- There was no system ffmpeg. Fix: use the `imageio-ffmpeg` pip package inside a venv.
- Browser automation can be blocked on external sites. Ask the user to allow access or to share screenshots. Say so honestly when you cannot see a reference.

## Caching
- The preview served an old directory. Fix: pass the root explicitly to the server.
- The browser cached old JS/CSS. Fix: run `nocache_server.py` locally and bump `?v=N` before each deploy.

## WebGL / three.js
- **Invisible reflections**: mirrored meshes were back-face culled. Fix: `side: THREE.DoubleSide`, and raise the floor to just under the cards.
- **Portrait images over-cropped** in full-screen view. Fix: `fitHeight` framing with a margin and a max crop, plus an edge mask.
- **Doubled faces** in the offline renderer from a fixed-point depth lookup. Fix: use a real ray march, as the shader does.
- **Velocity effects exploding** on fast flicks. Fix: clamp the velocity before using it.
- **Context lost after sleep**. Fix: handle `webglcontextlost`/`restored`.

## DOM / CSS
- A wheel handler threw when `e.target` was not a Node. Fix: add an `instanceof Node` guard.
- A hotspot drifted when highlighted because CSS `scale` combined with the JS `translate`. Fix: highlight with a glow or box-shadow instead of a scale transform.

## Assets
- Palettes missed small vivid accents, then repeated near-identical base tones. Fix: pick 2 accents by chroma and dedupe by Lab distance.
- Music: some Commons uploads are synthesized or have unclear licences. Use only verified CC0/CC BY/CC BY-SA/PD recordings and credit each one.

## Capture and video
- A hidden pane throttles rAF, so animation stalls or jumps. Fix: inject a fake clock (`capture.js`).
- Long-running page scripts time out in browser automation calls. Fix: start the capture as a background promise and poll the frame files from the shell.
- Film grain made the exported video huge (208 MB). Fix: leave grain out of video renders.
