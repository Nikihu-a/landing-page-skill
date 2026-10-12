# Landing Page Skill

An agent skill for designing, building and shipping a **single-page showcase site** (portfolio, gallery, product or exhibition page) as a static site on GitHub Pages. It covers the work from brainstorm to a verified live deploy, plus a share image and promo videos.

It was distilled from building [**Louvre After Dark**](https://nikihu-a.github.io/louvre-after-dark/) ([source](https://github.com/Nikihu-a/louvre-after-dark)), a 3D single-page gallery of ten Louvre paintings.

一个专门做**单页落地页**的 AI 助手技能（skill），从头脑风暴、做小样、开发，一直到上线 GitHub Pages 并核对线上文件，也包括分享图和宣传视频。它是从 Louvre After Dark 这个项目里总结出来的。

## What's inside

| | |
|---|---|
| `SKILL.md` | The workflow: agree on a direction first, prototype one piece, then build, verify and deploy |
| `references/design-playbook.md` | Design defaults and why: a minimal frame, serif typography, sound off by default, subtle living details |
| `references/tech-recipes.md` | A static stack with no build step, three.js 2.5D depth parallax, Web Audio, colour palettes, loader and performance |
| `references/deploy-github-pages.md` | Publishing with `gh`, polling the Pages build, verifying live files by hash |
| `references/promo-video.md` | Frame-accurate browser capture, ffmpeg, trailer and shorts |
| `references/pitfalls.md` | Every bug the project hit, with its fix |
| `scripts/` | A no-cache dev server, a frame recorder (`recorder.py` + `capture.js`), and `verify_deploy.sh` |

There are two copies with the same content:

- `claude/landing-page/` for **Claude Code**. It names Claude Code's preview and file tools.
- `codex/landing-page/` for **OpenAI Codex**. It uses generic wording and adds `agents/openai.yaml`.

## Install

Claude Code:

```bash
git clone https://github.com/Nikihu-a/landing-page-skill.git
cp -R landing-page-skill/claude/landing-page ~/.claude/skills/
```

OpenAI Codex:

```bash
git clone https://github.com/Nikihu-a/landing-page-skill.git
cp -R landing-page-skill/codex/landing-page ~/.codex/skills/
```

Restart the app or CLI. Then ask for a landing page ("make me a one-page portfolio site", "做一个落地页"). You can also call it by name: `/landing-page` in Claude Code, `$landing-page` in Codex.

## License

MIT © Niki
