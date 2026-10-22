#!/usr/bin/env bash
# Visual QA helper: build a throwaway copy of the site with lazy-loading
# stripped, so headless screenshots capture every image.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:-/tmp/opencode/qa-site}"
PORT="${2:-8100}"

rm -rf "$DEST"
mkdir -p "$DEST"
cp -r "$SRC"/. "$DEST"/
rm -f "$DEST/_debug.html"

# Remove lazy-loading so the headless browser fetches every image.
# The attribute appears in both the static HTML and the JS templates.
find "$DEST" \( -name '*.html' -o -name '*.js' \) -exec sed -i 's/ loading="lazy"//g' {} +

# Disable transitions and force reveal elements visible, so a screenshot
# taken at the load event is not caught mid-animation.
python3 - "$DEST" <<'PY'
import os, sys, glob
dest = sys.argv[1]
style = ("<style id=\"qa-style\">"
         "*,*::before,*::after{transition:none !important;animation:none !important}"
         "[data-reveal]{opacity:1 !important;transform:none !important}"
         ".js-ready [data-reveal]{opacity:1 !important;transform:none !important}"
         "</style>")
for path in glob.glob(os.path.join(dest, "*.html")):
    s = open(path, encoding="utf-8").read()
    if 'id="qa-style"' in s:
        continue
    s = s.replace("</head>", style + "\n</head>", 1)
    open(path, "w", encoding="utf-8").write(s)
print("qa styles injected")
PY

echo "QA site ready at $DEST"
echo "serve with:  python3 -m http.server $PORT --directory $DEST"
