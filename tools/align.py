#!/usr/bin/env python3
"""Step 1 — time the voiceover.
Detects silence gaps, then aligns script phrases (split at , । ! ? ...) to speech chunks
with a DP on text length. Prints chunks + phrase timings and suggested scene cut points
(mid-silence). Output JSON: {"duration", "chunks", "phrases", "cuts"}.
usage: python3 tools/align.py vo.mp3 script.txt out.json
Note: Whisper models can't be downloaded in the sandbox, so word timing inside a chunk
is proportional to text length. Chunk boundaries are exact (real pauses).
"""
import re, sys, json, subprocess, functools
vo, scriptf, outf = sys.argv[1:4]
script = open(scriptf).read().strip()
ph = [p.strip() for p in re.findall(r'[^,।!?]+?(?:\.\.\.|…|[,।!?]|$)', script) if p.strip().strip('.')]
err = subprocess.run(['ffmpeg', '-hide_banner', '-i', vo, '-af', 'silencedetect=noise=-35dB:d=0.35', '-f', 'null', '-'], capture_output=True, text=True).stderr
D = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vo], capture_output=True, text=True).stdout)
ss = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]; se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
chunks = []; prev = 0.0
for a, b in zip(ss, se):
    if a - prev > 0.05: chunks.append((prev, a))
    prev = b
if D - prev > 0.1: chunks.append((prev, D))
L = [len(p.replace(' ', '')) for p in ph]; speech = sum(b - a for a, b in chunks); rate = speech / sum(L)
N, M = len(ph), len(chunks)
import sys as _s; _s.setrecursionlimit(10000)
@functools.lru_cache(None)
def f(i, j):
    if i == N and j == M: return (0, ())
    if i == N or j == M: return (1e18, ())
    best = (1e18, ())
    for di in range(1, 4):
        for dj in range(1, 5):
            if i + di > N or j + dj > M or (di > 1 and dj > 1): continue
            exp = sum(L[i:i + di]) * rate; act = sum(b - a for a, b in chunks[j:j + dj])
            c = (exp - act) ** 2 + 0.5 * (di - 1) + 0.3 * (dj - 1); r = f(i + di, j + dj)
            if c + r[0] < best[0]: best = (c + r[0], ((i, di, j, dj),) + r[1])
    return best
_, path = f(0, 0); res = []
for i, di, j, dj in path:
    if di == 1:
        res.append({'s': round(chunks[j][0], 2), 'e': round(chunks[j + dj - 1][1], 2), 'text': ph[i], 'chunks': [[round(a, 2), round(b, 2)] for a, b in chunks[j:j + dj]]})
    else:
        t0, t1 = chunks[j]; tot = sum(L[i:i + di]); t = t0
        for k in range(di):
            d = (t1 - t0) * L[i + k] / tot; res.append({'s': round(t, 2), 'e': round(t + d, 2), 'text': ph[i + k], 'chunks': [[round(t, 2), round(t + d, 2)]]}); t += d
cuts = [0.0] + [round((a + b) / 2, 2) for (_, a), (b, _) in zip(chunks[:-1], chunks[1:])]
json.dump({'duration': round(D, 2), 'chunks': [[round(a, 2), round(b, 2)] for a, b in chunks], 'phrases': res, 'cuts': cuts}, open(outf, 'w'), ensure_ascii=False, indent=1)
print(f'duration {D:.2f}s, {len(chunks)} speech chunks, {len(ph)} phrases')
for r in res: print(f"{r['s']:7.2f}-{r['e']:7.2f}  {r['text']}   chunks={r['chunks']}")
