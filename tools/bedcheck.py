#!/usr/bin/env python3
"""Music bed vs VO per section (dB). Target: bed 11-16 dB under the voice.
usage: python3 tools/bedcheck.py <vo.mp3> <cues.json> <dur> [--fix]   (--fix rewrites each section's g so it lands at -13.5)"""
import sys, json, numpy as np
sys.path.insert(0, __file__.rsplit('/', 1)[0]); import audio as A
from scipy.signal import lfilter
vo_p, cues_p, dur = sys.argv[1], sys.argv[2], float(sys.argv[3]); fix = '--fix' in sys.argv
cues = json.load(open(cues_p)); vo = A.load_vo(vo_p, dur)
mL, mR = A.music(cues, dur)
env = np.sqrt(lfilter([1], [1, -0.9995], vo ** 2) * 0.0005); env = env / (env.max() + 1e-9); duck = 1 - 0.45 * np.clip(env * 3, 0, 1)
r = np.sqrt(np.mean(np.concatenate([mL, mR]) ** 2)) + 1e-9; m = (mL + mR) / 2 / r
vr = np.sqrt(np.mean(vo[vo != 0] ** 2)); m = m * A.section_gain(cues, len(m)) * vr * 10 ** (-17 / 20) * duck[:len(m)]
db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
for sec in cues['sections']:
    a, b = int(sec['s'] * A.SR), int(sec['e'] * A.SR); v = vo[a:b]; v = v[np.abs(v) > 1e-3]
    if len(v) == 0: continue
    d = db(m[a:b]) - db(v); flag = '' if -16 <= d <= -11 else '  <-- fix'
    print(f"{sec['s']:6.2f}-{sec['e']:6.2f} {sec['mood']:9s} g={sec.get('g',0):5.1f}  bed {d:6.1f} dB{flag}")
    if fix and flag: sec['g'] = round(sec.get('g', 0) + (-13.5 - d), 1)
if fix: json.dump(cues, open(cues_p, 'w'), indent=1); print('updated', cues_p)
