// Mahabharata cast part 2 — locked designs (Ashwatthama story, v3). Same flat style as chars.js / chars_mb.js:
const MO = require('./motion');
// feet at y=0, head centre hy≈-850, shoulders ≈ -695, black outlines LW=7, gold jewellery, big eyes.
const ch = require('./chars');
const { shape, ell, limb, handGlow, halo, arm, eyes, brows, OUT, LW } = ch;
const MB = require('./chars_mb');
const { lady, baby, bow, mouthLine, nose, GOLD, GOLD2 } = MB;
const SIL = () => ch.getSil();
const C = (col) => SIL() || col;

// ---------- props ----------
// Divine mani: cyan-white gem in a gold setting. a = glow strength
function mani(ctx, x, y, r, t, a = 0.8) {
  if (!SIL() && a > 0) handGlow(ctx, x, y, r * 3.2, a * 0.75 * (0.8 + 0.2 * Math.sin(t * 5)), '120,230,255');
  shape(ctx, GOLD2, () => ctx.ellipse(x, y, r * 1.35, r * 1.6, 0, 0, 7), 4);
  shape(ctx, '#7FE7FF', () => { ctx.moveTo(x, y - r * 1.25); ctx.lineTo(x + r * 0.85, y); ctx.lineTo(x, y + r * 1.25); ctx.lineTo(x - r * 0.85, y); ctx.closePath(); }, 3);
  if (!SIL()) { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(x - r * 0.2, y - r * 0.8); ctx.lineTo(x + r * 0.15, y - r * 0.2); ctx.lineTo(x - r * 0.35, y - r * 0.1); ctx.closePath(); ctx.fill(); }
}
function sword(ctx, hx, hy, ang, s = 1) {
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); ctx.scale(s, s);
  shape(ctx, '#D9DEE6', () => { ctx.moveTo(-8, -40); ctx.lineTo(16, -40); ctx.lineTo(18, -380); ctx.lineTo(4, -430); ctx.lineTo(-10, -380); ctx.closePath(); }, 5);
  if (!SIL()) { ctx.strokeStyle = '#9AA3AF'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(4, -50); ctx.lineTo(4, -390); ctx.stroke(); }
  shape(ctx, GOLD, () => ctx.rect(-40, -48, 88, 18), 5);
  shape(ctx, '#5B2E12', () => ctx.rect(-6, -30, 20, 60), 4);
  shape(ctx, GOLD, () => ctx.arc(4, 36, 10, 0, 7), 4);
  ctx.restore();
}
// fire aura behind a figure (rage)
function fireAura(ctx, x, y, s, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, a);
  const g = ctx.createRadialGradient(x, y - 600 * s, 50, x, y - 600 * s, 750 * s);
  g.addColorStop(0, 'rgba(255,120,30,0.55)'); g.addColorStop(1, 'rgba(255,40,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 600 * s, 750 * s, 0, 7); ctx.fill();
  for (const [col, k] of [['#B71C1C', 1], ['#F4511E', 0.8], ['#FFB300', 0.55]]) {
    ctx.fillStyle = col; ctx.beginPath();
    const n = 15;
    for (let i = 0; i <= n; i++) {
      const u = i / n, ang = Math.PI * (1.05 + u * 0.9);
      const R = (420 + 90 * Math.sin(t * 7 + i * 1.9) + (i % 2 ? 160 : 0)) * s * k;
      ctx.lineTo(x + Math.cos(ang) * R * 0.75, y - 560 * s + Math.sin(ang) * R * 1.25);
    }
    ctx.lineTo(x + 300 * s * k, y); ctx.lineTo(x - 300 * s * k, y); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ---------- generic warrior body (Ashwatthama, Arjuna) ----------
const ASH = { skin: '#A2683F', l1: 150, l2: 140, w: 50, dhoti: '#7A1F2B', armour: '#5E6670', iris: '#1a1010' };
const ARJ = { skin: '#C98E5E', l1: 150, l2: 140, w: 50, dhoti: '#1F7A6A', armour: '#E8B21E', iris: '#1a1010' };
const POSES = {
  rest: [[-160, -430], [160, -430]],
  fists: [[-200, -760], [200, -760]],
  sword: [[-170, -470], [150, -1060]],
  swordDown: [[-160, -430], [190, -460]],
  throw: [[-180, -520], [300, -980]],
  point: [[-160, -430], [330, -800]],
  bow: [[-400, -770], [-30, -760]],
  bowDown: [[-175, -440], [160, -430]],
  head: [[-60, -960], [60, -960]],
  forehead: [[-160, -430], [20, -900]],
  kneelLow: [[-150, -330], [150, -330]],
  hunch: [[-130, -400], [140, -380]],
};
const PREF = { fists: ['down', 'down'], sword: ['out', 'out'], throw: ['down', 'out'], bow: ['down', 'down'], head: ['out', 'out'], forehead: ['out', 'down'], hunch: ['out', 'out'] };
function warrior(ctx, x, y, s, o, P) {
  const t = o.t || 0, pose = o.pose || 'rest';
  const kneel = !!o.kneel, dy = kneel ? 200 : 0, cursed = !!o.cursed;
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const WK = (o.walk || o.run) && !o.kneel ? MO.walkCycle(o.t || 0, o) : null;
  if (WK) ctx.translate(0, WK.bob);
  if (o.lean || o.run) ctx.rotate((o.lean || 0) + (o.run ? 0.07 : 0));
  const hy = -850 + dy + (o.bowHead ? 18 : 0);
  if (o.halo) halo(ctx, 0, hy - 30, 175, t, o.halo);
  // hair behind
  if (P.knot) {
    const len = cursed ? 300 : 150;
    shape(ctx, '#120D0C', () => { ctx.moveTo(-66, hy - 30); ctx.quadraticCurveTo(-110, hy + len * 0.5, -95 + Math.sin(t * 2) * 6, hy + len); ctx.lineTo(95 + Math.sin(t * 2 + 1) * 6, hy + len); ctx.quadraticCurveTo(110, hy + len * 0.5, 66, hy - 30); ctx.closePath(); });
  } else shape(ctx, '#15100E', () => { ctx.moveTo(-70, hy - 20); ctx.quadraticCurveTo(-120, hy + 120, -105, hy + 230 + Math.sin(t * 2) * 5); ctx.lineTo(105, hy + 230 + Math.sin(t * 2 + 1) * 5); ctx.quadraticCurveTo(120, hy + 120, 70, hy - 20); ctx.closePath(); });
  const dhCol = cursed ? '#6E665E' : P.dhoti;
  // legs
  if (kneel) {
    limb(ctx, [[-42, -270], [-70, -40], [-230, -30]], 58, P.skin);
    limb(ctx, [[42, -270], [170, -250], [175, -60]], 58, P.skin);
    ell(ctx, 195, -30, 48, 22, P.skin);
    shape(ctx, dhCol, () => { ctx.moveTo(-105, -505 + dy); ctx.lineTo(105, -505 + dy); ctx.lineTo(150, -330 + dy); ctx.quadraticCurveTo(0, -300 + dy, -140, -330 + dy); ctx.closePath(); });
  } else {
    const st = o.stance || 0;
    if (WK) {
      WK.legs.forEach(([h, k, f], i) => {
        limb(ctx, [h, k, f], 58, P.skin);
        if (!cursed) limb(ctx, [[f[0], f[1] - 28], [f[0], f[1] - 14]], 64, GOLD, 'butt');
        ell(ctx, f[0] + (i ? 14 : -14), f[1] + 35, 48, 22, P.skin);
      });
    } else {
      limb(ctx, [[-46, -470], [-52 - st, -70]], 58, P.skin); limb(ctx, [[46, -470], [52 + st, -70]], 58, P.skin);
      if (!cursed) { limb(ctx, [[-52 - st, -98], [-52 - st, -84]], 64, GOLD, 'butt'); limb(ctx, [[52 + st, -98], [52 + st, -84]], 64, GOLD, 'butt'); }
      ell(ctx, -66 - st, -35, 48, 22, P.skin); ell(ctx, 66 + st, -35, 48, 22, P.skin);
    }
    const dh = cursed
      ? () => { ctx.moveTo(-105, -510); ctx.lineTo(105, -510); ctx.lineTo(125, -300); ctx.lineTo(90, -330); ctx.lineTo(70, -270); ctx.lineTo(30, -310); ctx.lineTo(-10, -250); ctx.lineTo(-50, -300); ctx.lineTo(-90, -260); ctx.lineTo(-125, -300); ctx.closePath(); }
      : () => { ctx.moveTo(-105, -510); ctx.lineTo(105, -510); ctx.lineTo(128 + st * 0.5, -250); ctx.quadraticCurveTo(0, -215, -128 - st * 0.5, -250); ctx.closePath(); };
    shape(ctx, dhCol, dh);
    if (!SIL() && !cursed) { ctx.save(); ctx.beginPath(); dh(); ctx.clip(); ctx.strokeStyle = GOLD; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-140, -262); ctx.quadraticCurveTo(0, -228, 140, -262); ctx.stroke(); ctx.restore(); ctx.beginPath(); dh(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke(); }
  }
  // torso
  const tor = () => { ctx.moveTo(-128, -705 + dy); ctx.quadraticCurveTo(0, -740 + dy, 128, -705 + dy); ctx.quadraticCurveTo(122, -600 + dy, 95, -505 + dy); ctx.lineTo(-95, -505 + dy); ctx.quadraticCurveTo(-122, -600 + dy, -128, -705 + dy); ctx.closePath(); };
  if (cursed) {
    shape(ctx, P.skin, tor);
    // torn grey cloth across the chest
    shape(ctx, '#77736E', () => { ctx.moveTo(-128, -705 + dy); ctx.lineTo(-70, -718 + dy); ctx.lineTo(95, -560 + dy); ctx.lineTo(60, -540 + dy); ctx.lineTo(70, -505 + dy); ctx.lineTo(20, -520 + dy); ctx.lineTo(-40, -505 + dy); ctx.lineTo(-80, -560 + dy); ctx.closePath(); }, 5);
    shape(ctx, '#55504A', () => ctx.rect(-100, -522 + dy, 200, 20), 5);
  } else {
    shape(ctx, P.armour, tor);
    if (!SIL()) {
      ctx.save(); ctx.beginPath(); tor(); ctx.clip();
      if (P === ASH) { ctx.strokeStyle = '#454C55'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-130, -650 + dy + i * 38); ctx.quadraticCurveTo(0, -620 + dy + i * 38, 130, -650 + dy + i * 38); ctx.stroke(); } }
      else { ctx.strokeStyle = '#B07D0A'; ctx.lineWidth = 5; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-130, -650 + dy + i * 38); ctx.quadraticCurveTo(0, -620 + dy + i * 38, 130, -650 + dy + i * 38); ctx.stroke(); } }
      ctx.restore();
      ctx.beginPath(); tor(); ctx.strokeStyle = GOLD; ctx.lineWidth = 12; ctx.stroke(); ctx.beginPath(); tor(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
      // chest medallion
      shape(ctx, P === ASH ? GOLD : '#C62828', () => ctx.arc(0, -640 + dy, 22, 0, 7), 5);
    }
    // sash
    shape(ctx, P === ASH ? '#F3ECD2' : '#F7F3EA', () => { ctx.moveTo(-128, -705 + dy); ctx.lineTo(-96, -716 + dy); ctx.lineTo(100, -530 + dy); ctx.lineTo(95, -505 + dy); ctx.lineTo(76, -505 + dy); ctx.closePath(); }, 4);
    shape(ctx, GOLD, () => ctx.rect(-100, -522 + dy, 200, 24), 5);
  }
  shape(ctx, P.skin, () => ctx.rect(-26, hy + 56, 52, 50), 0);
  // arms
  const A = MO.poseOf(POSES, pose, o, POSES.rest), pref = PREF[pose] || ['out', 'out'];
  const SL = [-120, -695 + dy], SR = [120, -695 + dy];
  let aL = A[0], aR = (o.handR) || A[1];
  if (WK && ['rest', 'hunch', 'swordDown', 'bowDown'].includes(pose)) {
    const sw = WK.swing * (o.run ? 70 : 40);
    aL = [aL[0] + sw * 0.4, aL[1] - Math.max(0, sw)]; aR = [aR[0] - sw * 0.4, aR[1] - Math.max(0, -sw)];
  }
  const hl = arm(ctx, SL, [aL[0], aL[1] + dy], P, pref[0])[2];
  // head (tilts about the neck: o.tilt + small idle nod)
  const tilt = (o.tilt || 0) + (o.t != null && !o.still ? 0.025 * Math.sin(o.t * 1.3 + x * 0.01) : 0) + (WK ? 0.02 * WK.swing : 0);
  ctx.save(); ctx.translate(0, hy + 90); ctx.rotate(tilt); ctx.translate(0, -(hy + 90));
  for (const sx of [-1, 1]) ell(ctx, sx * 64, hy + 5, 14, 22, P.skin, 5);
  ell(ctx, 0, hy, 66, 78, P.skin);
  if (P.knot) {
    // top-knot
    const kx = cursed ? 18 : 0, ky = cursed ? 10 : 0;
    shape(ctx, '#120D0C', () => ctx.ellipse(kx, hy - 108 + ky, 40, 34, cursed ? 0.4 : 0, 0, 7));
    if (!cursed) shape(ctx, GOLD, () => ctx.rect(-30, hy - 84, 60, 14), 4);
    shape(ctx, '#120D0C', () => { ctx.moveTo(-68, hy + 5); ctx.quadraticCurveTo(-75, hy - 92, 0, hy - 94); ctx.quadraticCurveTo(75, hy - 92, 68, hy + 5); ctx.quadraticCurveTo(52, hy - 58, 0, hy - 66); ctx.quadraticCurveTo(-52, hy - 58, -68, hy + 5); ctx.closePath(); });
    if (cursed) { // loose strands over the face sides
      ctx.strokeStyle = C('#120D0C'); ctx.lineWidth = 9; ctx.lineCap = 'round';
      for (const [a, b, c2] of [[-50, -40, -78], [-30, -55, -60], [46, -45, 80]]) { ctx.beginPath(); ctx.moveTo(a, hy + b); ctx.quadraticCurveTo(c2, hy + 20, c2 * 0.95, hy + 90 + Math.sin(t * 2 + a) * 6); ctx.stroke(); }
    }
  } else {
    // Arjuna: hair cap + tall crown
    shape(ctx, '#15100E', () => { ctx.moveTo(-68, hy + 5); ctx.quadraticCurveTo(-75, hy - 92, 0, hy - 94); ctx.quadraticCurveTo(75, hy - 92, 68, hy + 5); ctx.quadraticCurveTo(48, hy - 55, 0, hy - 60); ctx.quadraticCurveTo(-48, hy - 55, -68, hy + 5); ctx.closePath(); });
    shape(ctx, GOLD2, () => { ctx.moveTo(-70, hy - 60); ctx.lineTo(70, hy - 60); ctx.lineTo(52, hy - 130); ctx.lineTo(30, hy - 215); ctx.lineTo(0, hy - 250); ctx.lineTo(-30, hy - 215); ctx.lineTo(-52, hy - 130); ctx.closePath(); });
    shape(ctx, GOLD2, () => ctx.rect(-76, hy - 86, 152, 30), 5);
    if (!SIL()) {
      ctx.strokeStyle = '#9C6B00'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-42, hy - 150); ctx.lineTo(42, hy - 150); ctx.stroke();
      for (const [jx, jy, c] of [[0, hy - 71, '#1565C0'], [-44, hy - 71, '#C62828'], [44, hy - 71, '#C62828'], [0, hy - 185, '#2E7D32']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(jx, jy, 9, 0, 7); ctx.fill(); }
      ctx.strokeStyle = '#D32F2F'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, hy - 52); ctx.lineTo(0, hy - 26); ctx.stroke();
    }
  }
  // forehead: mani or wound (Ashwatthama)
  if (P === ASH) {
    if (o.mani === 0 || cursed) {
      if (!SIL()) { shape(ctx, '#4A1A14', () => ctx.ellipse(0, hy - 40, 15, 19, 0, 0, 7), 3); ctx.strokeStyle = '#220806'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-6, hy - 52); ctx.lineTo(3, hy - 40); ctx.lineTo(-4, hy - 28); ctx.stroke(); }
    } else mani(ctx, 0, hy - 40, 13, t, o.maniGlow ?? 0.7);
  } else if (o.mani === 'held') { /* none */ }
  eyes(ctx, 0, hy + 6, 27, 20, 11, o, P.iris);
  brows(ctx, 0, hy - 16, 27, 23, o.brow ?? (o.eyes === 'glow' || o.angry ? 22 : o.mouth === 'sad' ? -12 : 8), 7);
  nose(ctx, 0, hy + 12);
  shape(ctx, '#120D0C', () => { ctx.moveTo(0, hy + 36); ctx.quadraticCurveTo(-30, hy + 28, -46, hy + 46); ctx.quadraticCurveTo(-26, hy + 40, 0, hy + 42); ctx.quadraticCurveTo(26, hy + 40, 46, hy + 46); ctx.quadraticCurveTo(30, hy + 28, 0, hy + 36); ctx.closePath(); }, 2);
  if (P === ASH && cursed && !SIL()) { // stubble beard
    ctx.fillStyle = 'rgba(20,12,10,0.55)'; ctx.beginPath(); ctx.ellipse(0, hy + 58, 52, 30, 0, 0, Math.PI); ctx.fill();
  }
  mouthLine(ctx, 0, hy + 56, o.mouth || 'firm', 14);
  if (o.mouth === 'grit' && !SIL()) { shape(ctx, '#F4F1E8', () => ctx.rect(-18, hy + 50, 36, 12), 3); }
  for (const sx of [-1, 1]) { if (!SIL()) shape(ctx, GOLD, () => ctx.arc(sx * 66, hy + 36, 9, 0, 7), 3); }
  ctx.restore();
  const hr = arm(ctx, SR, [aR[0], aR[1] + dy], P, pref[1])[2];
  const SA = { sword: 0.15, swordDown: 2.7 };
  if (o.sword) sword(ctx, hr[0], hr[1], o.from && o.k != null && o.k < 1 ? MO.lerp(SA[o.from] ?? 0.3, SA[pose] ?? 0.3, MO.ease(MO.clamp(o.k))) : (SA[pose] ?? 0.3), 1);
  if (pose === 'bow') bow(ctx, hl[0], hl[1], 1, !o.released, hr, o.released);
  else if (pose === 'bowDown') bow(ctx, hl[0], hl[1], 0.85, false);
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  return { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s], forehead: [x, y + (hy - 40) * s], chest: [x, y + (-610 + dy) * s] };
}
ASH.knot = true;
const ashwatthama = (ctx, x, y, s, o = {}) => warrior(ctx, x, y, s, o, ASH);
const arjuna = (ctx, x, y, s, o = {}) => warrior(ctx, x, y, s, o, ARJ);

// ================= GURU DRONACHARYA =================
const DRO = { skin: '#B27A4C', l1: 140, l2: 130, w: 42 };
function drona(ctx, x, y, s, o = {}) {
  const t = o.t || 0, pose = o.pose || 'rest';
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const hy = -840;
  if (o.halo) halo(ctx, 0, hy - 40, 165, t, o.halo);
  ell(ctx, -60, -25, 44, 20, DRO.skin); ell(ctx, 60, -25, 44, 20, DRO.skin);
  // white dhoti long + saffron uttariya
  const rb = () => { ctx.moveTo(-100, -520); ctx.lineTo(100, -520); ctx.quadraticCurveTo(140, -260, 140, -50); ctx.quadraticCurveTo(0, -30, -140, -50); ctx.quadraticCurveTo(-140, -260, -100, -520); ctx.closePath(); };
  shape(ctx, '#F4EEDF', rb);
  if (!SIL()) { ctx.save(); ctx.beginPath(); rb(); ctx.clip(); ctx.strokeStyle = '#E8A24A'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(-150, -70); ctx.quadraticCurveTo(0, -45, 150, -70); ctx.stroke(); ctx.strokeStyle = '#D8CFBA'; ctx.lineWidth = 4; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 28, -480); ctx.lineTo(i * 42, -80); ctx.stroke(); } ctx.restore(); ctx.beginPath(); rb(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke(); }
  shape(ctx, DRO.skin, () => { ctx.moveTo(-112, -700); ctx.quadraticCurveTo(0, -728, 112, -700); ctx.quadraticCurveTo(108, -600, 90, -505); ctx.lineTo(-90, -505); ctx.quadraticCurveTo(-108, -600, -112, -700); ctx.closePath(); });
  shape(ctx, '#E8A24A', () => { ctx.moveTo(-112, -700); ctx.lineTo(-70, -716); ctx.lineTo(96, -540); ctx.lineTo(90, -505); ctx.lineTo(50, -508); ctx.closePath(); }, 5);
  shape(ctx, '#C9771E', () => ctx.rect(-98, -528, 196, 22), 5);
  if (!SIL()) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-100, -690); ctx.lineTo(80, -520); ctx.stroke(); ctx.fillStyle = '#5B2E12'; for (let i = 0; i <= 18; i++) { const a = i / 18; ctx.beginPath(); ctx.arc(-62 + a * 124, -705 + Math.sin(a * Math.PI) * 160, 8, 0, 7); ctx.fill(); } }
  shape(ctx, DRO.skin, () => ctx.rect(-22, hy + 52, 44, 48), 0);
  const P = MO.poseOf({ rest: [[-170, -470], [150, -440]], bless: [[-170, -470], [o.handTo ? o.handTo[0] : 260, o.handTo ? o.handTo[1] : -700]], bow: [[-175, -460], [150, -440]], fall: [[-200, -900], [220, -900]] }, pose, o, [[-170, -470], [150, -440]]);
  const hl = arm(ctx, [-100, -690], P[0], DRO, pose === 'fall' ? 'out' : 'out')[2];
  // head + grey hair, top-knot, beard
  for (const sx of [-1, 1]) ell(ctx, sx * 60, hy + 4, 12, 20, DRO.skin, 5);
  shape(ctx, '#BDB8AE', () => ctx.ellipse(0, hy - 104, 38, 32, 0, 0, 7));
  ell(ctx, 0, hy, 62, 74, DRO.skin);
  shape(ctx, '#BDB8AE', () => { ctx.moveTo(-64, hy - 6); ctx.quadraticCurveTo(-66, hy - 86, 0, hy - 88); ctx.quadraticCurveTo(66, hy - 86, 64, hy - 6); ctx.quadraticCurveTo(44, hy - 56, 0, hy - 62); ctx.quadraticCurveTo(-44, hy - 56, -64, hy - 6); ctx.closePath(); });
  shape(ctx, '#BDB8AE', () => { ctx.moveTo(-60, hy + 10); ctx.quadraticCurveTo(-66, hy + 110, 0, hy + 170 + Math.sin(t * 2) * 4); ctx.quadraticCurveTo(66, hy + 110, 60, hy + 10); ctx.quadraticCurveTo(40, hy + 60, 0, hy + 62); ctx.quadraticCurveTo(-40, hy + 60, -60, hy + 10); ctx.closePath(); });
  if (!SIL()) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-30, hy - 46 + i * 9); ctx.lineTo(30, hy - 46 + i * 9); ctx.stroke(); } ctx.fillStyle = '#D9302C'; ctx.beginPath(); ctx.arc(0, hy - 36, 6, 0, 7); ctx.fill(); }
  eyes(ctx, 0, hy + 2, 25, 18, 10, o, '#1a1010');
  brows(ctx, 0, hy - 18, 26, 24, o.brow ?? 6, 8, '#BDB8AE');
  nose(ctx, 0, hy + 8);
  shape(ctx, '#BDB8AE', () => { ctx.moveTo(0, hy + 32); ctx.quadraticCurveTo(-40, hy + 26, -54, hy + 58); ctx.quadraticCurveTo(-30, hy + 44, 0, hy + 44); ctx.quadraticCurveTo(30, hy + 44, 54, hy + 58); ctx.quadraticCurveTo(40, hy + 26, 0, hy + 32); ctx.closePath(); }, 3);
  const hr = arm(ctx, [100, -690], P[1], DRO, 'down')[2];
  if (pose === 'rest' || pose === 'bow' || pose === 'bless') bow(ctx, hl[0], hl[1], 0.85, false);
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  return { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s] };
}

// ================= BHAGWAN KRISHNA =================
const KRI = { skin: '#2F5DA8', l1: 145, l2: 135, w: 44 };
function chakra(ctx, x, y, r, t, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 6); ctx.globalAlpha = a;
  handGlow(ctx, 0, 0, r * 2.2, 0.7, '255,200,60');
  shape(ctx, '#F2C230', () => ctx.arc(0, 0, r, 0, 7), 5);
  if (!SIL()) { ctx.strokeStyle = '#9C6B00'; ctx.lineWidth = 4; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i * Math.PI / 6) * r * 0.86, Math.sin(i * Math.PI / 6) * r * 0.86); ctx.stroke(); } ctx.fillStyle = '#F2C230'; ctx.strokeStyle = OUT; ctx.lineWidth = 3; for (let i = 0; i < 16; i++) { ctx.beginPath(); const a2 = i * Math.PI / 8; ctx.moveTo(Math.cos(a2) * r * 0.96, Math.sin(a2) * r * 0.96); ctx.lineTo(Math.cos(a2 + 0.12) * r * 1.3, Math.sin(a2 + 0.12) * r * 1.3); ctx.lineTo(Math.cos(a2 + 0.3) * r * 0.96, Math.sin(a2 + 0.3) * r * 0.96); ctx.fill(); ctx.stroke(); } shape(ctx, '#C62828', () => ctx.arc(0, 0, r * 0.18, 0, 7), 3); }
  ctx.restore();
}
function peacockFeather(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(0.25 + Math.sin(t * 1.5) * 0.04); ctx.scale(s, s);
  limb(ctx, [[0, 0], [0, -150]], 6, '#2E7D32');
  shape(ctx, '#2E9E5B', () => ctx.ellipse(0, -170, 42, 70, 0, 0, 7), 4);
  shape(ctx, '#1E88E5', () => ctx.ellipse(0, -165, 26, 40, 0, 0, 7), 3);
  shape(ctx, '#F2C230', () => ctx.ellipse(0, -160, 15, 22, 0, 0, 7), 2);
  shape(ctx, '#0D2A6B', () => ctx.ellipse(0, -158, 8, 12, 0, 0, 7), 0);
  ctx.restore();
}
function krishna(ctx, x, y, s, o = {}) {
  const t = o.t || 0, pose = o.pose || 'chakra';
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const hy = -850;
  if (o.halo) halo(ctx, 0, hy - 40, 200, t, o.halo);
  // hair behind
  shape(ctx, '#15121F', () => { ctx.moveTo(-60, hy - 10); ctx.quadraticCurveTo(-120, hy + 90, -100, hy + 200 + Math.sin(t * 2) * 5); ctx.lineTo(100, hy + 200 + Math.sin(t * 2 + 1) * 5); ctx.quadraticCurveTo(120, hy + 90, 60, hy - 10); ctx.closePath(); });
  limb(ctx, [[-42, -470], [-48, -70]], 52, KRI.skin); limb(ctx, [[42, -470], [48, -70]], 52, KRI.skin);
  limb(ctx, [[-48, -98], [-48, -84]], 58, GOLD, 'butt'); limb(ctx, [[48, -98], [48, -84]], 58, GOLD, 'butt');
  ell(ctx, -60, -35, 44, 21, KRI.skin); ell(ctx, 60, -35, 44, 21, KRI.skin);
  const ph = () => { ctx.moveTo(-98, -515); ctx.lineTo(98, -515); ctx.quadraticCurveTo(132, -320, 118, -140); ctx.quadraticCurveTo(0, -120, -118, -140); ctx.quadraticCurveTo(-132, -320, -98, -515); ctx.closePath(); };
  shape(ctx, '#F4C431', ph);
  if (!SIL()) { ctx.save(); ctx.beginPath(); ph(); ctx.clip(); ctx.strokeStyle = '#C62828'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-130, -152); ctx.quadraticCurveTo(0, -130, 130, -152); ctx.stroke(); ctx.strokeStyle = 'rgba(160,100,0,0.35)'; ctx.lineWidth = 5; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 18, -500); ctx.lineTo(i * 34, -150); ctx.stroke(); } ctx.restore(); ctx.beginPath(); ph(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke(); }
  shape(ctx, KRI.skin, () => { ctx.moveTo(-112, -700); ctx.quadraticCurveTo(0, -728, 112, -700); ctx.quadraticCurveTo(108, -600, 86, -505); ctx.lineTo(-86, -505); ctx.quadraticCurveTo(-108, -600, -112, -700); ctx.closePath(); });
  // yellow angavastra over shoulders
  shape(ctx, '#F4C431', () => { ctx.moveTo(-118, -706); ctx.quadraticCurveTo(-150, -600, -135, -470); ctx.lineTo(-105, -470); ctx.quadraticCurveTo(-110, -600, -90, -690); ctx.closePath(); }, 5);
  shape(ctx, GOLD, () => ctx.rect(-98, -525, 196, 26), 5);
  const fc = ['#FFFFFF', '#E53950', '#F4C431', '#4CAF50'];
  if (!SIL()) for (let i = 0; i <= 22; i++) { const a = i / 22; shape(ctx, fc[i % 4], () => ctx.arc(-78 + a * 156, -705 + Math.sin(a * Math.PI) * 240, 10, 0, 7), 3); }
  shape(ctx, GOLD, () => { ctx.moveTo(-68, -712); ctx.quadraticCurveTo(0, -640, 68, -712); ctx.quadraticCurveTo(0, -680, -68, -712); ctx.closePath(); }, 5);
  shape(ctx, KRI.skin, () => ctx.rect(-24, hy + 52, 48, 50), 0);
  const P = MO.poseOf({ chakra: [[-150, -450], [190, -1010]], point: [[-150, -450], [340, -790]], bless: [[-150, -450], [175, -790]], shield: [[-260, -760], [260, -760]] }, pose, o, [[-150, -450], [190, -1010]]);
  const pref = { chakra: ['out', 'out'], point: ['out', 'out'], bless: ['out', 'down'], shield: ['down', 'down'] }[pose] || ['out', 'out'];
  const hl = arm(ctx, [-106, -690], P[0], KRI, pref[0])[2];
  // head
  for (const sx of [-1, 1]) { ell(ctx, sx * 62, hy + 5, 13, 20, KRI.skin, 5); shape(ctx, GOLD, () => { ctx.moveTo(sx * 62, hy + 24); ctx.quadraticCurveTo(sx * 84, hy + 62, sx * 62, hy + 72); ctx.quadraticCurveTo(sx * 40, hy + 62, sx * 62, hy + 24); ctx.closePath(); }, 4); }
  ell(ctx, 0, hy, 62, 74, KRI.skin);
  shape(ctx, '#15121F', () => { ctx.moveTo(-64, hy + 4); ctx.quadraticCurveTo(-62, hy - 80, 0, hy - 80); ctx.quadraticCurveTo(62, hy - 80, 64, hy + 4); ctx.quadraticCurveTo(50, hy - 40, 20, hy - 52); ctx.quadraticCurveTo(0, hy - 40, -20, hy - 52); ctx.quadraticCurveTo(-50, hy - 40, -64, hy + 4); ctx.closePath(); });
  // mukut (shorter than Vishnu's kirita) + peacock feather
  peacockFeather(ctx, 36, hy - 120, 1, t);
  shape(ctx, GOLD2, () => { ctx.moveTo(-70, hy - 56); ctx.lineTo(70, hy - 56); ctx.lineTo(56, hy - 120); ctx.lineTo(30, hy - 100); ctx.lineTo(0, hy - 160); ctx.lineTo(-30, hy - 100); ctx.lineTo(-56, hy - 120); ctx.closePath(); });
  shape(ctx, GOLD2, () => ctx.rect(-76, hy - 82, 152, 28), 5);
  if (!SIL()) {
    for (const [jx, jy, c] of [[0, hy - 68, '#C62828'], [-44, hy - 68, '#2E7D32'], [44, hy - 68, '#2E7D32'], [0, hy - 118, '#1E88E5']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(jx, jy, 9, 0, 7); ctx.fill(); }
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-13, hy - 50); ctx.quadraticCurveTo(0, hy - 12, 13, hy - 50); ctx.stroke();
    ctx.strokeStyle = '#D32F2F'; ctx.beginPath(); ctx.moveTo(0, hy - 46); ctx.lineTo(0, hy - 22); ctx.stroke();
  }
  eyes(ctx, 0, hy + 4, 25, 20, 11, o, '#1b1630');
  brows(ctx, 0, hy - 18, 25, 21, o.brow ?? (o.stern ? 14 : 0), 4.5);
  nose(ctx, 0, hy + 10);
  mouthLine(ctx, 0, hy + 46, o.stern ? 'firm' : 'smile', 14);
  const hr = arm(ctx, [106, -690], P[1], KRI, pref[1])[2];
  if (pose === 'chakra') chakra(ctx, hr[0] + 6, hr[1] - 90, 52, t);
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  return { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s], chakra: [x + (hr[0] + 6) * s * fx, y + (hr[1] - 90) * s] };
}

// ================= UTTARA =================
const UTT = { skin: '#E2AE84', l1: 132, l2: 122, w: 30, bangles: true, sari: '#8E3B8E', blouse: '#E8B21E', border: GOLD, tiara: true };
const uttara = (ctx, x, y, s, o = {}) => lady(ctx, x, y, s, Object.assign({ pose: 'belly', belly: true }, o), UTT);
// baby Parikshit = wrapped baby, no kavach/kundal
const parikshit = (ctx, x, y, s, t, o = {}) => baby(ctx, x, y, s, t, Object.assign({ kavach: false }, o));

module.exports = { ashwatthama: MO.alive(ashwatthama), arjuna: MO.alive(arjuna), drona: MO.alive(drona), krishna: MO.alive(krishna), uttara: MO.alive(uttara), parikshit, mani, sword, chakra, fireAura, peacockFeather };
