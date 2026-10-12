---
name: landing-page
description: Design, build and ship a single-page showcase / landing site (portfolio, gallery, product or exhibition page) as a static site on GitHub Pages — from brainstorm to a verified live deploy, plus share image and promo video. Use when the user asks for a 落地页 / landing page / 单页网站 / 作品展示页 / one-page site, wants to redesign or polish one, or wants to deploy one to GitHub Pages.
---

# Landing page

Distilled from building *Louvre After Dark* (a 3D single-page gallery of ten paintings, live on GitHub Pages) with Niki. It covers the working rhythm that worked, the design defaults the user settled on, a no-build tech stack, and the deploy/verify routine.

Reply in the user's language (Niki writes Chinese); page copy follows what the user decides (Louvre ended up English-only).

## 1. Working rhythm — agree first, then build

These rules cost the most when broken, so they come first.

1. **Brainstorm before code.** Ask what the page is for, who it is for, and what one feeling it should leave. Ask for 1–3 reference sites or screenshots. Then propose **2–3 directions** (name, one-line idea, what makes it memorable, effort), with a recommendation.
2. **Analyse references, don't copy them.** When the user shares a site, open it, describe what actually makes it work (transition, type, pacing), and say how it could apply. Say clearly what you could *not* see (blocked pages, video-only effects).
3. **"先不要改" / "just look" means analyse only.** Do not touch the project.
4. **A preference is not a go-ahead.** "我觉得 b 好" picks a direction in the discussion. Ask "要现在开始做吗？" and wait for an explicit yes ("开始做吧", "都做", "可以，继续"). Building a prototype on "b 好" once broke the live site and had to be rolled back.
5. **Prototype one piece first** (one section, one card, one painting), show it, get "满意", then do the rest.
6. **Anything with motion → record a short video sample** (see `references/promo-video.md`) and ask about strength/colour before publishing. Work on a branch (`sample/<name>`); merge and deploy only after approval.
7. **Never break the live site with an experiment.** Keep prototypes on a branch or in an untracked folder outside the deployed root.
8. **Big rewrites need permission.** When the user says "不用改大框架", only add details inside the existing structure.
9. When the user removes something (a line of text, a sound), remove it everywhere it shows in that place, and record the rule so it doesn't creep back.

## 2. Build order

1. **Content first**: list items (titles, years, credits, licenses) and confirm the scope (e.g. "only the Louvre, as a timeline").
2. **Skeleton**: one `index.html`, `css/style.css`, `js/*.js` ES modules, `assets/`, `vendor/`, `tools/` for offline asset scripts, README, MIT LICENSE.
3. **Hero + one item** prototype → approval → all items.
4. **Polish round**: loading state, opening animation, keyboard/touch, mobile, reduced motion, fallback for no WebGL, share image (OG 1200×630), favicon (inline SVG data URI).
5. **Deploy** (see `references/deploy-github-pages.md`) and verify the live files.
6. **Suggest the next round**: offer 3–5 numbered ideas; build only what the user picks.

## 3. Design defaults the user approved

Details and reasons in `references/design-playbook.md`. In short:

- **One page, no sub-pages.** Deep views are in-page modes with hash links (`#/<id>`), with Esc/back to return.
- **Minimal frame.** The top bar keeps a logo and functional toggles only. Avoid taglines, bylines, footers and helper text on immersive views; the user removed every one of them.
- **Owner signature**: the user's name goes once in a meaningful place (the collection wall or about block), plus copyright and `<meta name="author">`. Don't put it in the top bar.
- **Type**: a refined serif in light weights (Cormorant Garamond 300) with gold italics as accents. The user rejected the 500 weight ("too hard") and sans headlines.
- **Sound is off by default.** Entering never turns it on. The button names its action ("Sound on"/"Sound off"), mute is instant, and audio suspends on hidden tabs. No clicky UI sound effects; one soft swell at most.
- **Detail over chrome.** Once the frame is set, add delight *inside* each item (subtle living motion, colour palette, hotspots with stories). Show researched facts to the user before adding them.

## 4. Tech stack (no build step)

Full recipes in `references/tech-recipes.md`.

- Plain HTML/CSS/ES modules, so any static server works and GitHub Pages serves it directly.
- **Vendor every dependency** (`vendor/three.module.min.js`, licence file next to it) and **self-host fonts** (woff2 + OFL). Don't rely on CDNs at runtime; Google Fonts was unreachable on this machine anyway.
- Cache busting: `css/style.css?v=N`, `js/app.js?v=N`. Bump N on every CSS/JS change.
- Images as WebP. Load the first few items before hiding the loader, and stream the rest.
- Adaptive quality: step the resolution down when frames run long. Restore a lost WebGL context. Provide a `?static` fallback and honour `prefers-reduced-motion`.
- Offline asset tools in `tools/*.py` (depth maps, inpainted plates, palettes, OG image, music loops), committed so the assets can be rebuilt.

## 5. Local preview and verification

- Use `scripts/nocache_server.py <port> <root>` through `.claude/launch.json` and `preview_start`, not `python -m http.server`, which lets the browser cache stale JS.
- After each change: reload, check console errors, `read_page`, screenshot, then check 375px mobile and dark/light if relevant.
- A hidden preview pane throttles `requestAnimationFrame`. For deterministic screenshots or videos, use the recorder (`scripts/recorder.py` + `scripts/capture.js`).

## 6. Deploy

See `references/deploy-github-pages.md`: repo creation with `gh`, Pages from `main` root, push with retries, poll the Pages build, and compare sha256 of live files against local before saying "live".

## 7. Promo (optional, offer it)

- OG share image, generated by a script.
- Landscape trailer for YouTube (bilingual titles if the user wants), a "secrets of an item" short series, and sample clips for approval. See `references/promo-video.md`.

## 8. Known pitfalls

Read `references/pitfalls.md` before starting. It lists every bug this project hit, with its fix (sandbox/network, caching, WebGL reflections, cropping portrait images, CSS transform conflicts, rAF throttling, huge videos from grain, and more).

## Files in this skill

- `references/design-playbook.md`: design decisions and why.
- `references/tech-recipes.md`: code patterns (3D depth parallax, audio, palettes, loader, hand-off).
- `references/deploy-github-pages.md`: deploy and verify commands.
- `references/promo-video.md`: deterministic capture and the ffmpeg pipeline.
- `references/pitfalls.md`: bugs and fixes.
- `scripts/nocache_server.py`: no-cache static server.
- `scripts/recorder.py` + `scripts/capture.js`: frame-accurate page capture.
- `scripts/verify_deploy.sh`: compare live files against local by hash.
