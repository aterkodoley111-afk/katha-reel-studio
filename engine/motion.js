// Character motion layer (v3.1): idle life, pose tweening, blinking helpers. Used by chars*.js.
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (k) => k * k * (3 - 2 * k);
const lerp = (a, b, k) => a + (b - a) * k;

// Arm-target lookup with smooth tweening between poses.
//   o.from = previous pose name, o.k = 0..1 progress (use tween(lt, at, dur) in scenes).
//   An overshoot of ~6 % gives the move a little snap/settle.
function poseOf(table, pose, o, def) {
  const a = table[pose] || def;
  if (!o || !o.from || o.k == null || o.k >= 1) return a;
  const b = table[o.from] || def; if (!b) return a;
  const k = clamp(o.k), e = ease(k) + Math.sin(k * Math.PI) * 0.06 * k;
  return a.map((p, i) => [lerp(b[i][0], p[0], e), lerp(b[i][1], p[1], e)]);
}
// progress helper for scenes: tween(lt, at, dur=0.35) -> 0..1
const tween = (lt, at, dur = 0.35) => clamp((lt - at) / dur);

// Auto-blink: returns true when the eyes should be drawn closed at time t.
// Every ~3.2–4.4 s (phase from position so characters don't blink together), 0.13 s long.
function blinking(t, seed = 0) {
  if (t == null) return false;
  const per = 3.2 + ((Math.abs(seed) * 0.37) % 1.2);
  return ((t + Math.abs(seed) * 0.013) % per) < 0.13;
}

// Idle life wrapper for (ctx,x,y,s,o) characters: breathing (scale from the feet) + slow sway.
// Off with o.still = true or when no o.t is given.
function alive(fn) {
  return function (ctx, x, y, s, o = {}) {
    const t = o.t;
    if (t == null || o.still) return fn(ctx, x, y, s, o);
    const ph = x * 0.007;
    const br = 1 + (o.breath ?? 0.011) * Math.sin(t * 2.3 + ph);
    const sw = o.walk ? 0 : (o.sway ?? 0.006) * Math.sin(t * 0.9 + ph);
    ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.scale(1, br); ctx.translate(-x, -y);
    const r = fn(ctx, x, y, s, o);
    ctx.restore(); return r;
  };
}
function wrapAll(mod, names) { for (const n of names) if (typeof mod[n] === 'function') mod[n] = alive(mod[n]); return mod; }

// Walk cycle for a 2-leg body (hip x = ±hx at hipY, feet at 0). Returns {legs:[[hip,knee,foot]x2], bob, swing}
function walkCycle(t, o = {}, hx = 46, hipY = -470) {
  const sp = o.run ? 9 : (o.walkSpeed || 5), ph = t * sp;
  const stride = o.run ? 75 : 50, lift = o.run ? 70 : 38;
  // front view: feet stay under the hips (no scissoring); the stepping foot lifts with a bent knee pushed out
  const legs = [0, 1].map((i) => {
    const f = ph + i * Math.PI, sx = i ? 1 : -1, up = Math.max(0, Math.sin(f));
    const hip = [sx * hx, hipY];
    const fx = sx * (hx * 1.15 + up * 10) + Math.sin(f) * (stride * 0.15), fy = -up * lift;
    const kx = sx * (hx * 1.2 + up * 26), ky = (hipY + fy - 70) / 2 - up * 30;
    return [hip, [kx, ky], [fx, fy - 70]];
  });
  return { legs, bob: -Math.abs(Math.sin(ph)) * (o.run ? 18 : 10), swing: Math.sin(ph) };
}
module.exports = { poseOf, tween, blinking, alive, wrapAll, walkCycle, clamp, ease, lerp };
