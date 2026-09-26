#!/usr/bin/env bash
# Builds the two itch.io uploads:
#   dist/trenchbore-full.zip  the full game
#   dist/trenchbore-demo.zip  the demo (zones 1-2, ends at the Anglerfish)
# Upload each zip as "HTML, played in the browser" with a 1600x900 viewport and the fullscreen button on.
set -euo pipefail
cd "$(dirname "$0")/.."
out=dist
rm -rf "$out" && mkdir -p "$out"

build() {
  local name=$1 demo=$2 dir="$out/$1"
  mkdir -p "$dir"
  cp -r js "$dir/"
  { echo '<!doctype html>'; echo '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    echo '<style>html,body{margin:0;height:100%;background:#03080f;overflow:hidden}</style></head><body>'
    cat index.html; echo '</body></html>'; } > "$dir/index.html"
  sed -i "s/TB.DEMO = false/TB.DEMO = $demo/" "$dir/js/config.js"
  (cd "$dir" && zip -qr "../$name.zip" .)
  echo "built $out/$name.zip"
}

build trenchbore-full false
build trenchbore-demo true
