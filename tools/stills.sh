#!/usr/bin/env bash
# Preview stills WITH subtitles.  usage: tools/stills.sh <storyDir> "2,10,20,35"
set -e; cd "$(dirname "$0")/.."; S=$1; TIMES=$2; OUT=build/stills; mkdir -p $OUT
python3 tools/subs.py $S/hinglish.json build/subs.ass >/dev/null
node engine/render.js $S stills "$TIMES" $OUT
ARGS=(); N=0
for t in ${TIMES//,/ }; do f=$OUT/still_${t/./_}.png
  ffmpeg -v error -y -loop 1 -framerate 30 -i $f -vf "setpts=PTS+$t/TB,subtitles=build/subs.ass:fontsdir=$HOME/.fonts" -frames:v 1 -update 1 $OUT/prev_${t/./_}.png
  ARGS+=(-i $OUT/prev_${t/./_}.png); N=$((N+1)); done
ffmpeg -v error -y "${ARGS[@]}" -filter_complex "hstack=$N,scale=2160:-1" $OUT/preview_sheet.png
echo "stills in $OUT"
