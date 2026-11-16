#!/usr/bin/env python3
"""Synthesised Indian devotional score + SFX, mixed under the voiceover.

Everything is generated in code (no samples, no downloads), so it is royalty-free.
Usage:
  python3 tools/audio.py --vo vo.mp3 --cues stories/<name>/cues.json --dur 125.4 --out build/mix.wav
cues.json:
  {"sa": 138.59,
   "sections": [{"s":0,"e":4.89,"mood":"hook"}, ...],      # moods: hook tense warm divine magic dance suspense climax calm flight end
   "sfx": [{"t":0.0,"type":"boom","gain":1.0}, ...]}       # types: see SFX dict below
"""
import argparse, json, subprocess, numpy as np
from scipy.signal import lfilter, butter, sosfilt, fftconvolve

SR = 48000
rng = np.random.default_rng(7)


def T(d): return np.arange(int(d * SR)) / SR
def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(d, 1e-4))
def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, order=2): return sosfilt(butter(order, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x)


class Bus:
    def __init__(self, dur): self.L = np.zeros(int(dur * SR) + SR * 4); self.R = np.zeros_like(self.L)
    def add(self, t, x, g=1.0, pan=0.0):
        i = int(t * SR)
        if i < 0: x = x[-i:]; i = 0
        n = min(len(x), len(self.L) - i)
        if n <= 0: return
        self.L[i:i + n] += x[:n] * g * np.sqrt(0.5 * (1 - pan)); self.R[i:i + n] += x[:n] * g * np.sqrt(0.5 * (1 + pan))


def reverb(L, R, wet=0.25, dec=1.2):
    n = int(SR * dec * 2.5); t = np.arange(n) / SR
    ir1 = rng.standard_normal(n) * np.exp(-t / (dec / 3)); ir2 = rng.standard_normal(n) * np.exp(-t / (dec / 3))
    ir1 = lp(ir1, 6000); ir2 = lp(ir2, 6000); ir1 /= np.sqrt((ir1 ** 2).sum()); ir2 /= np.sqrt((ir2 ** 2).sum())
    return L + wet * fftconvolve(L, ir1)[:len(L)], R + wet * fftconvolve(R, ir2)[:len(R)]


# ---------------- instruments ----------------
def ks_pluck(f, dur, g=0.996, bright=0.6):
    """Karplus-Strong string (tanpura-like with jawari buzz)."""
    N = max(2, int(SR / f)); n = int(dur * SR)
    x = np.zeros(n); x[:N] = lp(rng.uniform(-1, 1, N), 2000 + 6000 * bright)
    a = np.zeros(N + 2); a[0] = 1; a[N] = -g / 2; a[N + 1] = -g / 2
    y = lfilter([1], a, x)
    buzz = np.tanh(3 * y) * 0.3  # jawari-ish brightness
    return (y + buzz) * env_ad(n, 0.002, dur * 0.45)


def bansuri(notes, sa):
    """notes: list of (start, dur, semitone) relative to start. returns signal."""
    end = max(s + d for s, d, _ in notes) + 1.0; out = np.zeros(int(end * SR))
    for s, d, st in notes:
        f = sa * 2 * 2 ** (st / 12); t = T(d + 0.4); vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.4)
        ph = 2 * np.pi * np.cumsum(f * vib) / SR
        tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
        breath = bp(rng.standard_normal(len(t)), f * 0.9, min(f * 4, 20000)) * 0.12
        e = np.minimum(1, t / 0.12) * np.clip((d + 0.4 - t) / 0.4, 0, 1)
        i = int(s * SR); seg = (tone + breath) * e; out[i:i + len(seg)] += seg[:len(out) - i]
    return out * 0.5


def pad(dur, freqs, bright=0.5):
    t = T(dur); out = np.zeros(len(t))
    for f in freqs:
        for det in (-0.25, 0.0, 0.3):
            ff = f * 2 ** (det / 100 * 6); ph = 2 * np.pi * ff * t + rng.uniform(0, 6)
            saw = sum(np.sin(k * ph) / k for k in range(1, 9))
            out += saw
    out = lp(out, 600 + 2400 * bright)
    fade = np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 1.5)
    return out / (len(freqs) * 3) * fade


def drum(f0=80, f1=42, dec=0.55, noise=0.3):
    t = T(dec * 4); f = f1 + (f0 - f1) * np.exp(-t / 0.05)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / dec)
    s += noise * lp(rng.standard_normal(len(t)), 1500) * np.exp(-t / 0.03)
    return s


def tabla_dha(sa):  # bayan + dayan
    t = T(0.8); b = np.sin(2 * np.pi * np.cumsum(70 + 40 * np.exp(-t / 0.08)) / SR) * np.exp(-t / 0.35)
    d = sum(np.sin(2 * np.pi * sa * 2 * k * t) / k for k in (1, 2, 3, 4.1)) * np.exp(-t / 0.18)
    return 0.8 * b + 0.45 * d + 0.2 * hp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.01)
def tabla_na(sa):
    t = T(0.5); d = sum(np.sin(2 * np.pi * sa * 2 * k * t) / k for k in (1, 2, 3, 4.1)) * np.exp(-t / 0.12)
    return 0.5 * d + 0.25 * hp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.008)
def tabla_ge(sa):
    t = T(0.6); return np.sin(2 * np.pi * np.cumsum(65 + 30 * np.exp(-t / 0.1)) / SR) * np.exp(-t / 0.3) * 0.8


def ghungroo(g=1.0):
    t = T(0.35); s = np.zeros(len(t))
    for _ in range(6):
        f = rng.uniform(4200, 7800); dt = int(rng.uniform(0, 0.03) * SR)
        x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.06); s[dt:] += x[:len(s) - dt]
    return (s / 6 + 0.3 * hp(rng.standard_normal(len(t)), 5000) * np.exp(-t / 0.02)) * g


def bell(f=520, dec=3.0):
    t = T(dec * 1.6); s = np.zeros(len(t))
    for r, a, dd in [(1, 1, 1), (2.0, 0.6, 0.7), (2.76, 0.5, 0.6), (5.4, 0.3, 0.35), (8.9, 0.15, 0.2), (0.5, 0.35, 1.2)]:
        s += a * np.sin(2 * np.pi * f * r * t + rng.uniform(0, 6)) * np.exp(-t / (dec * dd)) * (1 + 0.1 * np.sin(2 * np.pi * 3.5 * t))
    return s * np.minimum(1, t / 0.003) / 2.5


# ---------------- SFX ----------------
def sfx_whoosh(d=1.2, up=True):
    t = T(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t)); seg = 2400
    for i in range(0, len(t), seg):
        u = i / len(t); fc = (300 + 3500 * u) if up else (3800 - 3400 * u)
        out[i:i + seg] = bp(n[i:i + seg], fc * 0.6, fc * 1.6, 1)
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return lp(out, 7000) * e * 1.4
def sfx_boom(): return drum(70, 28, 1.4, 0.5) * 1.2
def sfx_impact():
    d = drum(110, 35, 0.6, 0.9); w = sfx_whoosh(0.4, False); d[:len(w)] += 0.4 * w; return d
def sfx_shimmer(d=2.5):
    t = T(d); s = np.zeros(len(t))
    for _ in range(40):
        f = rng.uniform(2000, 7000); st = rng.uniform(0, d * 0.6)
        s += np.sin(2 * np.pi * f * t) * np.exp(-np.maximum(0, t - st) / 0.5) * (t > st) * 0.5 * (1 + np.sin(2 * np.pi * rng.uniform(3, 9) * t))
    return s / 25 * np.minimum(1, t / 0.6)
def sfx_chimes(d=2.0):
    s = np.zeros(int((d + 2) * SR)); scale = [0, 2, 4, 7, 9, 12, 14, 16, 19]
    for i in range(14):
        f = 1046 * 2 ** (scale[rng.integers(len(scale))] / 12); b = bell(f, 0.8) * 0.5; j = int(i / 14 * d * SR); s[j:j + len(b)] += b[:len(s) - j]
    return s
def sfx_fire(d=3.0, burst=False):
    t = T(d); rum = lp(rng.standard_normal(len(t)), 400) * 0.6
    cr = np.zeros(len(t)); idx = rng.integers(0, len(t), int(d * 90)); cr[idx] = rng.uniform(-1, 1, len(idx)); cr = bp(cr, 1500, 8000) * 4
    s = (rum + cr) * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.6)
    if burst: s[:int(1.2 * SR)] += sfx_whoosh(1.2, True)[:int(1.2 * SR)] * 1.2; s += np.pad(sfx_boom(), (0, max(0, len(s) - len(sfx_boom()))))[:len(s)] * 0.9
    return s
def sfx_riser(d=3.0):
    t = T(d); f = 200 * 2 ** (3 * t / d); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + sfx_whoosh(d, True) * 0.6
    return s * (t / d) ** 2
def sfx_crumble(d=2.0):
    t = T(d); s = np.zeros(len(t)); idx = rng.integers(0, len(t), int(d * 400)); s[idx] = rng.uniform(-1, 1, len(idx))
    return bp(s, 800, 6000) * 3 * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.5) + lp(rng.standard_normal(len(t)), 300) * 0.2
def sfx_heartbeat():
    return np.concatenate([drum(60, 40, 0.15, 0.1), np.zeros(int(0.08 * SR)), drum(55, 38, 0.18, 0.1) * 0.7])


SFX = {
    'boom': lambda e: sfx_boom(), 'impact': lambda e: sfx_impact(), 'whoosh': lambda e: sfx_whoosh(e.get('d', 1.0), e.get('up', True)),
    'shimmer': lambda e: sfx_shimmer(e.get('d', 2.5)), 'chimes': lambda e: sfx_chimes(e.get('d', 2.0)), 'bell': lambda e: bell(e.get('f', 520), e.get('dec', 3.0)),
    'fire': lambda e: sfx_fire(e.get('d', 3.0)), 'fireburst': lambda e: sfx_fire(e.get('d', 3.5), True), 'riser': lambda e: sfx_riser(e.get('d', 3.0)),
    'crumble': lambda e: sfx_crumble(e.get('d', 2.0)), 'heartbeat': lambda e: sfx_heartbeat(), 'ghungroo': lambda e: ghungroo(),
}

# raga phrases (semitones from Sa) for bansuri — Yaman-ish (warm/divine) and Bhairav-ish (calm/sad)
PHR_WARM = [(0, 0.8, 7), (0.8, 0.6, 9), (1.4, 0.6, 11), (2.0, 1.6, 12), (3.8, 0.6, 11), (4.4, 0.6, 9), (5.0, 1.8, 7)]
PHR_CALM = [(0, 1.0, 0), (1.0, 0.6, 1), (1.6, 0.6, 4), (2.2, 1.4, 5), (3.8, 0.7, 4), (4.5, 0.7, 1), (5.2, 2.0, 0)]
PHR_MAGIC = [(0, 0.4, 12), (0.4, 0.4, 14), (0.8, 0.4, 16), (1.2, 1.2, 19), (2.6, 0.4, 16), (3.0, 1.6, 14)]


def music(cues, dur):
    sa = cues.get('sa', 138.59); mus = Bus(dur); perc = Bus(dur)
    # continuous tanpura (Pa Sa' Sa' Sa) through every section except silence moments
    cyc = [(sa * 1.5 / 2, 0), (sa, 0.6), (sa, 1.2), (sa / 2, 1.8)]
    for sec in cues['sections']:
        s, e, m = sec['s'], sec['e'], sec['mood']; d = e - s
        if m in ('climax',): continue
        tg = {'tense': 0.5, 'suspense': 0.45, 'hook': 0.4, 'flight': 0.45}.get(m, 0.7)
        k = s
        while k < e - 0.3:
            for f, off in cyc:
                if k + off < e: mus.add(k + off, ks_pluck(f, 2.6), 0.22 * tg, pan=-0.3 if off < 1 else 0.3)
            k += 2.4
        if m in ('tense', 'suspense', 'hook', 'flight'):
            mus.add(s, pad(d + 1.2, [sa / 2, sa / 2 * 2 ** (1 / 12), sa * 0.75], 0.25), 0.35)
            beat = 0.75 if m != 'flight' else 0.375
            if m == 'suspense':
                t = s; b = 0.9
                while t < e: perc.add(t, sfx_heartbeat(), 1.3); t += b; b = max(0.42, b * 0.94)
            else:
                t = s + 0.0
                while t < e - 0.1: perc.add(t, drum(85, 45, 0.35, 0.25), 0.45 if m != 'flight' else 0.35); t += beat
        elif m in ('warm', 'calm', 'end'):
            mus.add(s, pad(d + 1.2, [sa, sa * 2 ** (4 / 12) if m == 'warm' else sa * 2 ** (3 / 12), sa * 1.5], 0.35), 0.4)
            phr = PHR_WARM if m == 'warm' else PHR_CALM
            if d > 4:
                k2 = s + 0.6
                while k2 < e - 3: mus.add(k2, bansuri(phr, sa), 0.45, pan=0.15); k2 += 8.5
        elif m in ('divine', 'magic'):
            mus.add(s, pad(d + 1.2, [sa, sa * 2 ** (4 / 12), sa * 1.5, sa * 2], 0.7), 0.3)
            if d > 4: mus.add(s + 1.0, bansuri(PHR_MAGIC if m == 'magic' else PHR_WARM, sa), 0.3, pan=-0.1)
        elif m == 'dance':
            # keherwa: dha ge na ti | na ka dhi na  at eighth = 0.1875 s (80 bpm quarter = 0.75)
            pat = ['dha', 'ge', 'na', 'na', 'na', 'ge', 'dha', 'na']; e8 = 0.375 / 2; t = s; i = 0
            while t < e - 0.05:
                p = pat[i % 8]; x = tabla_dha(sa) if p == 'dha' else tabla_ge(sa) if p == 'ge' else tabla_na(sa)
                perc.add(t, x, 1.1, pan=0.1)
                if i % 4 == 0: perc.add(t, ghungroo(), 0.9, pan=-0.4)
                t += e8; i += 1
            mus.add(s, pad(d + 1, [sa, sa * 2 ** (4 / 12), sa * 1.5], 0.5), 0.2)
            mus.add(s + 0.4, bansuri(PHR_WARM + [(s0 + 7.0, d0, n) for s0, d0, n in PHR_WARM[:3]], sa), 0.28)
    L, R = reverb(mus.L + perc.L * 0.6, mus.R + perc.R * 0.6, 0.35, 1.6)
    return L + perc.L * 0.4, R + perc.R * 0.4


def sfx_bus(cues, dur):
    b = Bus(dur)
    for e in cues['sfx']:
        b.add(e['t'], SFX[e['type']](e), e.get('gain', 1.0), e.get('pan', 0.0))
    return reverb(b.L, b.R, 0.3, 1.4)


def load_vo(path, dur):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).astype(np.float64); out = np.zeros(int(dur * SR) + SR * 4); out[:len(v)] = v; return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--vo'); ap.add_argument('--cues'); ap.add_argument('--dur', type=float); ap.add_argument('--out')
    ap.add_argument('--music_db', type=float, default=-17.0); ap.add_argument('--sfx_db', type=float, default=-11.0)
    a = ap.parse_args(); cues = json.load(open(a.cues))
    vo = load_vo(a.vo, a.dur)
    mL, mR = music(cues, a.dur); sL, sR = sfx_bus(cues, a.dur)
    # duck music under the voice
    env = np.sqrt(lfilter([1], [1, -0.9995], vo ** 2) * 0.0005); env = env / (env.max() + 1e-9)
    duck = 1 - 0.45 * np.clip(env * 3, 0, 1)
    def norm(x, y): r = np.sqrt(np.mean(np.concatenate([x, y]) ** 2)) + 1e-9; return x / r, y / r
    vr = np.sqrt(np.mean(vo[vo != 0] ** 2))
    mL, mR = norm(mL, mR); sL, sR = norm(sL, sR)
    gm = vr * 10 ** (a.music_db / 20); gs = vr * 10 ** (a.sfx_db / 20)
    L = vo + mL * gm * duck + sL * gs; R = vo + mR * gm * duck + sR * gs
    n = int(a.dur * SR); L, R = L[:n], R[:n]
    fade = np.ones(n); fl = int(0.4 * SR); fade[-fl:] = np.linspace(1, 0, fl); L *= fade; R *= fade
    pk = max(np.abs(L).max(), np.abs(R).max()); L /= pk / 0.9; R /= pk / 0.9
    st = np.stack([L, R], 1).astype(np.float32)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', a.out], input=st.tobytes(), check=True)
    print('wrote', a.out)
