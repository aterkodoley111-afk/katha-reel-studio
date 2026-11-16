#!/usr/bin/env python3
"""Word-by-word Hinglish karaoke subtitles (ASS) — 2-3 words on screen, spoken word in gold.
usage: python3 tools/subs.py stories/<name>/hinglish.json build/subs.ass
hinglish.json = [[start, end, "romanised text"], ...]  one entry per speech chunk (exact pause timings).
"""
import json, sys
segs = json.load(open(sys.argv[1])); out = sys.argv[2]
FONT_SIZE, Y = 100, 1390   # high enough that Instagram's caption bar never covers it
def ts(t): return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"
head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Poppins Black,{FONT_SIZE},&H00FFFFFF,&H00FFFFFF,&H00100406,&H96000000,0,0,0,0,100,100,1,0,1,7,3,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
GOLD = r"{\c&H42C5F5&}"; WHITE = r"{\c&HFFFFFF&}"; ev = []
for a, b, txt in segs:
    words = txt.split(); w = [max(2, len(x.strip(',.!?'))) + 1.5 for x in words]; tot = sum(w); times = []; t = a
    for x in w: d = (b - a) * x / tot; times.append((t, t + d)); t += d
    groups = []; cur = []
    for i, x in enumerate(words):
        if cur and (len(cur) == 3 or len(' '.join(words[j] for j in cur + [i])) > 17): groups.append(cur); cur = []
        cur.append(i)
    if cur: groups.append(cur)
    for gi, g in enumerate(groups):
        for k, i in enumerate(g):
            s = times[i][0]; e = times[i][1] if k < len(g) - 1 else (times[groups[gi + 1][0]][0] if gi + 1 < len(groups) else b + 0.15)
            parts = [(GOLD if j == i else WHITE) + words[j] for j in g]
            pop = r"{\fscx108\fscy108\t(0,90,\fscx100\fscy100)}" if k == 0 else ""
            ev.append(f"Dialogue: 0,{ts(s)},{ts(e)},Sub,,0,0,0,,{{\\pos(540,{Y})}}{pop}" + " ".join(parts))
open(out, 'w').write(head + "\n".join(ev) + "\n"); print(len(ev), 'subtitle events ->', out)
