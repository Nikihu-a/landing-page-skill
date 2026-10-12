# Deploy to GitHub Pages

## One-time setup

- `gh` may not be on PATH: check `~/.local/bin/gh`. Log in with the device flow (`gh auth login`), then run `gh auth setup-git`.
- Set the commit identity **per repo**, with the noreply email: `git config user.email <id>+<user>@users.noreply.github.com`.
- On some networks GitHub is flaky (~50% TLS timeouts), and the Bash sandbox blocks GitHub. Run network commands with the sandbox disabled and wrap them in retries.

## Create and publish

```bash
gh repo create <user>/<repo> --public --source . --push --description "..."
gh api -X POST repos/<user>/<repo>/pages -f "source[branch]=main" -f "source[path]=/"
```

Pages URL: `https://<user>.github.io/<repo>/`. Use **relative paths** everywhere (`assets/...`, not `/assets/...`), because the site lives under `/<repo>/`.

## Every release

1. Bump `?v=N` on the CSS/JS links in `index.html` (and on any module imports that are versioned).
2. Commit with a clear message and the attribution line. Push with retries:
   ```bash
   for i in 1 2 3 4 5; do git push && break; sleep 5; done
   ```
3. Poll the build:
   ```bash
   gh api repos/<user>/<repo>/pages/builds/latest --jq '.status + " " + .commit'
   ```
   Wait for `built` with the new commit SHA.
4. Verify that the live files match local (`scripts/verify_deploy.sh <base-url> index.html js/app.js css/style.css ...`). Only report "已上线" when the hashes match.
5. Give the user the live URL and a one-line summary of what changed.

## Experiments

- Do sample work on a branch (`sample/<topic>`). Merge into `main` only after the user approves.
- Never put a prototype folder in the deployed root on `main`.
- If the user says the live site broke ("原网站打不开了"), first check the live URL and recent commits, revert to the last good commit, then explain.
