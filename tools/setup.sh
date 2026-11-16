#!/usr/bin/env bash
# One-time setup in a fresh workspace: node deps, python deps, fonts.
set -e
cd "$(dirname "$0")/.."
npm install --silent
pip install --break-system-packages -q numpy scipy fonttools brotli >/dev/null 2>&1 || true
mkdir -p fonts ~/.fonts
python3 - <<'PY'
from fontTools.ttLib import TTFont
srcs={'rozha':'node_modules/@fontsource/rozha-one/files/rozha-one-devanagari-400-normal.woff2',
'notodev800':'node_modules/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-800-normal.woff2',
'poppins800':'node_modules/@fontsource/poppins/files/poppins-latin-800-normal.woff2',
'poppins900':'node_modules/@fontsource/poppins/files/poppins-latin-900-normal.woff2'}
for k,v in srcs.items():
    f=TTFont(v); f.flavor=None; f.save(f'fonts/{k}.ttf')
PY
cp fonts/*.ttf ~/.fonts/ && fc-cache -f >/dev/null
echo "setup ok"
