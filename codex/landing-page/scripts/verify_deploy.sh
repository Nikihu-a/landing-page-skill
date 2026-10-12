#!/usr/bin/env bash
# Compare live GitHub Pages files with the local copies by sha256.
# Usage: verify_deploy.sh https://user.github.io/repo/ index.html js/app.js css/style.css
# Run from the site root. Retries each fetch because the network can be flaky.
base="${1%/}/"; shift
fail=0
for f in "$@"; do
  live=""
  for i in 1 2 3 4; do
    live=$(curl -sf --max-time 20 "${base}${f}?nocache=$RANDOM" | shasum -a 256 | cut -d' ' -f1) && [ -n "$live" ] && break
    sleep 3
  done
  here=$(shasum -a 256 "$f" | cut -d' ' -f1)
  if [ "$live" = "$here" ]; then echo "ok    $f"; else echo "DIFF  $f"; fail=1; fi
done
exit $fail
