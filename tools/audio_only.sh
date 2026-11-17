#!/usr/bin/env bash
# Rebuild ONLY the audio (after cues.json gain changes) and remux with the already-rendered video + subtitles.
# usage: tools/audio_only.sh <storyDir> <voiceover.mp3> [outName]
set -e; cd "$(dirname "$0")/.."
S=$1; VO=$2; NAME=${3:-$(basename $S)}; B=build/$NAME
TOTAL=$(node -e "console.log(require('./$S/scenes.js').TOTAL)")
python3 tools/audio.py --vo "$VO" --cues $S/cues.json --dur $TOTAL --out $B/mix.wav
J=$(ffmpeg -hide_banner -i $B/mix.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
LN=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i $B/mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:$LN:linear=true" -ar 48000 -c:a aac -b:a 192k $B/mix.m4a
ffmpeg -v error -y -i $B/video.mp4 -i $B/mix.m4a -vf "subtitles=$B/subs.ass:fontsdir=$HOME/.fonts" -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a copy -shortest -movflags +faststart $B/${NAME}_final.mp4
ffmpeg -hide_banner -i $B/${NAME}_final.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
echo "DONE -> $B/${NAME}_final.mp4"
