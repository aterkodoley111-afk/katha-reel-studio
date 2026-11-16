#!/usr/bin/env bash
# Full render -> ONE final MP4 (subtitles burned in, music + SFX mixed under the VO, -16 LUFS).
# usage: tools/build.sh <storyDir> <voiceover.mp3> [outName]
set -e; cd "$(dirname "$0")/.."
S=$1; VO=$2; NAME=${3:-$(basename $S)}; B=build/$NAME; mkdir -p $B
TOTAL=$(node -e "console.log(require('./$S/scenes.js').TOTAL)"); FR=$(python3 -c "print(round($TOTAL*30))")
P=$(nproc); [ $P -gt 4 ] && P=4; CH=$(( (FR + P - 1) / P )); rm -f $B/part*.mp4 $B/list.txt
echo "rendering $FR frames on $P workers"
for i in $(seq 0 $((P-1))); do a=$((i*CH)); b=$(( (i+1)*CH < FR ? (i+1)*CH : FR ))
  ( node engine/render.js $S video $a $b 2>$B/err$i.log | ffmpeg -v error -y -f rawvideo -pix_fmt bgra -s 1080x1920 -r 30 -i - -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p $B/part$i.mp4 ) &
  echo "file '$PWD/$B/part$i.mp4'" >> $B/list.txt; done; wait
ffmpeg -v error -y -f concat -safe 0 -i $B/list.txt -c copy $B/video.mp4
python3 tools/subs.py $S/hinglish.json $B/subs.ass
python3 tools/audio.py --vo "$VO" --cues $S/cues.json --dur $TOTAL --out $B/mix.wav
J=$(ffmpeg -hide_banner -i $B/mix.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
LN=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i $B/mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:$LN:linear=true" -ar 48000 -c:a aac -b:a 192k $B/mix.m4a
ffmpeg -v error -y -i $B/video.mp4 -i $B/mix.m4a -vf "subtitles=$B/subs.ass:fontsdir=$HOME/.fonts" -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a copy -shortest -movflags +faststart $B/${NAME}_final.mp4
ffmpeg -hide_banner -i $B/${NAME}_final.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
echo "DONE -> $B/${NAME}_final.mp4"
