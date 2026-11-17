#!/usr/bin/env bash
# One frame per scene (at a fraction through each scene) -> build/grid/grid.png  usage: tools/grid.sh <storyDir> [frac=0.6]
set -e; cd "$(dirname "$0")/.."; S=$1; FR=${2:-0.6}; OUT=build/grid; rm -rf $OUT; mkdir -p $OUT
T=$(node -e "const {S}=require('./$S/scenes.js');console.log(S.map(s=>(s.s+(s.e-s.s)*$FR).toFixed(2)).join(','))")
node engine/render.js $S stills "$T" $OUT
python3 - "$OUT" <<'PY'
import sys,glob,os
from PIL import Image
d=sys.argv[1]; fs=sorted(glob.glob(d+'/still_*.png'),key=lambda f:float(os.path.basename(f)[6:-4].replace('_','.')))
w,h=270,480; cols=7; rows=(len(fs)+cols-1)//cols
g=Image.new('RGB',(cols*w,rows*h))
for i,f in enumerate(fs): g.paste(Image.open(f).convert('RGB').resize((w,h)),((i%cols)*w,(i//cols)*h))
g.save(d+'/grid.png'); print(len(fs),'frames')
PY
