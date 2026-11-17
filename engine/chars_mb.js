// Mahabharata cast — locked designs (Karna story, v2). Same flat style as chars.js:
const MO = require('./motion');
// feet at y=0, head centre hy≈-840, shoulders ≈ -695, black outlines LW=7, gold jewellery, big eyes.
const ch = require('./chars');
const { shape, ell, limb, handGlow, halo, arm, eyes, brows, crossedLegs, lerp2, OUT, LW } = ch;
const SIL = () => ch.getSil();
const C = (col) => SIL() || col;
const GOLD = '#E8B21E', GOLD2 = '#F2C230';

// ---------- shared bits ----------
function kundal(ctx, x, y, r, t, glowA = 0.6) {
  if (!SIL() && glowA > 0) handGlow(ctx, x, y, r * 3.2, glowA * (0.75 + 0.25 * Math.sin(t * 4 + x)), '255,200,60');
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.strokeStyle = OUT; ctx.lineWidth = r * 0.55 + 6; ctx.stroke();
  ctx.strokeStyle = C(GOLD2); ctx.lineWidth = r * 0.55; ctx.stroke();
  if (!SIL()) { ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(x, y + r, r * 0.32, 0, 7); ctx.fill(); }
}
// gold armour plate on a torso path, with scale pattern + sun disk
function kavach(ctx, build, cx, cy, t, glowA = 0) {
  shape(ctx, GOLD, build);
  if (SIL()) return;
  ctx.save(); ctx.beginPath(); build(); ctx.clip();
  ctx.strokeStyle = '#B07D0A'; ctx.lineWidth = 4;
  for (let row = 0; row < 9; row++) for (let i = -6; i <= 6; i++) {
    const px = cx + i * 34 + (row % 2) * 17, py = cy - 120 + row * 30;
    ctx.beginPath(); ctx.arc(px, py, 17, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  }
  ctx.restore();
  ctx.beginPath(); build(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke();
  // sun disk
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.6);
  ctx.fillStyle = '#F57C00';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.cos(a - 0.18) * 30, Math.sin(a - 0.18) * 30); ctx.lineTo(Math.cos(a) * 52, Math.sin(a) * 52); ctx.lineTo(Math.cos(a + 0.18) * 30, Math.sin(a + 0.18) * 30); ctx.fill(); }
  ctx.restore();
  shape(ctx, '#FF9800', () => ctx.arc(cx, cy, 32, 0, 7), 5);
  shape(ctx, '#FFD54F', () => ctx.arc(cx, cy, 16, 0, 7), 3);
  if (glowA > 0) handGlow(ctx, cx, cy, 260, glowA, '255,200,60');
}
function sunHalo(ctx, x, y, r, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  const g = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 2.2);
  g.addColorStop(0, 'rgba(255,220,110,0.75)'); g.addColorStop(1, 'rgba(255,150,40,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, 7); ctx.fill();
  ctx.rotate(t * 0.15);
  for (let k = 0; k < 2; k++) {
    const n = 24, rr = k ? r * 1.25 : r * 1.5; ctx.fillStyle = k ? '#FFC107' : '#FF8F00';
    ctx.beginPath();
    for (let i = 0; i <= n * 2; i++) { const ang = i / (n * 2) * Math.PI * 2 + k * 0.13; const rad = i % 2 ? r * 0.9 : rr + Math.sin(t * 3 + i) * 8; ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad); }
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
  }
  ctx.fillStyle = '#FFE082'; ctx.beginPath(); ctx.arc(0, 0, r * 0.92, 0, 7); ctx.fill(); ctx.strokeStyle = '#B8860B'; ctx.lineWidth = 6; ctx.stroke();
  ctx.restore();
}
function tear(ctx, x, y, t, a = 1) {
  if (SIL() || a <= 0) return;
  const k = (t * 0.45) % 1; ctx.save(); ctx.globalAlpha = a * (1 - k * 0.6);
  ctx.fillStyle = '#BFE8FF'; ctx.strokeStyle = OUT; ctx.lineWidth = 3;
  ctx.beginPath(); const yy = y + k * 70; ctx.moveTo(x, yy - 16); ctx.quadraticCurveTo(x + 10, yy, x, yy + 6); ctx.quadraticCurveTo(x - 10, yy, x, yy - 16); ctx.fill(); ctx.stroke(); ctx.restore();
}
function mouthLine(ctx, x, y, kind, w = 16) {
  if (SIL()) return;
  ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath();
  if (kind === 'o') { shape(ctx, '#5a1a1a', () => ctx.ellipse(x, y + 6, 10, 13, 0, 0, 7), 4); return; }
  if (kind === 'sad') ctx.arc(x, y + 22, w, 1.2 * Math.PI, 1.8 * Math.PI);
  else if (kind === 'firm') { ctx.moveTo(x - w, y + 4); ctx.lineTo(x + w, y + 4); }
  else if (kind === 'smile') ctx.arc(x, y - 4, w + 2, 0.15 * Math.PI, 0.85 * Math.PI);
  else ctx.arc(x, y - 2, w, 0.25 * Math.PI, 0.75 * Math.PI);
  ctx.stroke();
}
function nose(ctx, x, y) { if (SIL()) return; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 6, y + 20, x + 4, y + 24); ctx.stroke(); }

// ---------- bow ----------
function bow(ctx, hx, hy, s, drawn, rightHand, released) {
  if (released) { drawn = false; }
  // vertical bow held at (hx,hy); bulges to -x. drawn: string pulled to rightHand
  const top = [hx + 30, hy - 330 * s], bot = [hx + 30, hy + 330 * s];
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.quadraticCurveTo(hx - 150 * s, hy - 200 * s, hx, hy); ctx.quadraticCurveTo(hx - 150 * s, hy + 200 * s, bot[0], bot[1]);
  ctx.strokeStyle = OUT; ctx.lineWidth = 30 * s; ctx.stroke(); ctx.strokeStyle = C('#7A4A22'); ctx.lineWidth = 17 * s; ctx.stroke();
  if (!SIL()) { ctx.strokeStyle = GOLD; ctx.lineWidth = 19 * s; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(hx - 10, hy - 34 * s); ctx.lineTo(hx - 10, hy + 34 * s); ctx.stroke(); }
  const mid = drawn && rightHand ? rightHand : [top[0], hy];
  ctx.strokeStyle = SIL() || '#F3ECD2'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(mid[0], mid[1]); ctx.lineTo(bot[0], bot[1]); ctx.stroke();
  if (drawn && rightHand) {
    const ax = hx - 210 * s; ctx.lineCap = 'round';
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(rightHand[0] + 30, rightHand[1]); ctx.lineTo(ax, hy); ctx.stroke();
    ctx.strokeStyle = C('#D7C49E'); ctx.lineWidth = 6; ctx.stroke();
    shape(ctx, '#C9CED6', () => { ctx.moveTo(ax - 50, hy); ctx.lineTo(ax + 4, hy - 16); ctx.lineTo(ax + 4, hy + 16); ctx.closePath(); }, 4);
    shape(ctx, '#D84315', () => { ctx.moveTo(rightHand[0] + 30, rightHand[1]); ctx.lineTo(rightHand[0] + 80, rightHand[1] - 22); ctx.lineTo(rightHand[0] + 95, rightHand[1]); ctx.lineTo(rightHand[0] + 80, rightHand[1] + 22); ctx.closePath(); }, 4);
  }
}

// ================= KARNA =================
const KAR = { skin: '#C68650', l1: 150, l2: 140, w: 50 };
function karna(ctx, x, y, s, o = {}) {
  const t = o.t || 0, pose = o.pose || 'rest';
  const kneel = !!o.kneel, dy = kneel ? 200 : 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const hy = -850 + dy + (o.bowHead ? 14 : 0);
  if (o.halo) halo(ctx, 0, hy - 30, 175, t, o.halo);
  // long hair behind
  shape(ctx, '#15100E', () => { ctx.moveTo(-70, hy - 20); ctx.quadraticCurveTo(-120, hy + 120, -105, hy + 230 + Math.sin(t * 2) * 5); ctx.lineTo(105, hy + 230 + Math.sin(t * 2 + 1) * 5); ctx.quadraticCurveTo(120, hy + 120, 70, hy - 20); ctx.closePath(); });
  // legs
  if (kneel) {
    limb(ctx, [[-42, -270], [-70, -40], [-230, -30]], 58, KAR.skin);
    limb(ctx, [[42, -270], [170, -250], [175, -60]], 58, KAR.skin);
    ell(ctx, 195, -30, 48, 22, KAR.skin);
    shape(ctx, '#C8401E', () => { ctx.moveTo(-105, -505 + dy); ctx.lineTo(105, -505 + dy); ctx.lineTo(150, -330 + dy); ctx.quadraticCurveTo(0, -300 + dy, -140, -330 + dy); ctx.closePath(); });
  } else {
    const st = o.stance || 0;
    limb(ctx, [[-46, -470], [-52 - st, -70]], 58, KAR.skin); limb(ctx, [[46, -470], [52 + st, -70]], 58, KAR.skin);
    limb(ctx, [[-52 - st, -98], [-52 - st, -84]], 64, GOLD, 'butt'); limb(ctx, [[52 + st, -98], [52 + st, -84]], 64, GOLD, 'butt');
    ell(ctx, -66 - st, -35, 48, 22, KAR.skin); ell(ctx, 66 + st, -35, 48, 22, KAR.skin);
    const dh = () => { ctx.moveTo(-105, -510); ctx.lineTo(105, -510); ctx.lineTo(128 + st * 0.5, -250); ctx.quadraticCurveTo(0, -215, -128 - st * 0.5, -250); ctx.closePath(); };
    shape(ctx, '#C8401E', dh);
    if (!SIL()) { ctx.strokeStyle = GOLD; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-126 - st * 0.5, -262); ctx.quadraticCurveTo(0, -228, 126 + st * 0.5, -262); ctx.stroke(); ctx.beginPath(); dh(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke(); }
  }
  // torso = kavach
  const tor = () => { ctx.moveTo(-128, -705 + dy); ctx.quadraticCurveTo(0, -740 + dy, 128, -705 + dy); ctx.quadraticCurveTo(122, -600 + dy, 95, -505 + dy); ctx.lineTo(-95, -505 + dy); ctx.quadraticCurveTo(-122, -600 + dy, -128, -705 + dy); ctx.closePath(); };
  kavach(ctx, tor, 0, -610 + dy, t, o.glow || 0);
  // angavastra sash (saffron) shoulder to hip
  shape(ctx, '#F39A2B', () => { ctx.moveTo(-128, -705 + dy); ctx.lineTo(-80, -718 + dy); ctx.lineTo(100, -530 + dy); ctx.lineTo(95, -500 + dy); ctx.lineTo(60, -505 + dy); ctx.closePath(); }, 5);
  shape(ctx, GOLD, () => ctx.rect(-100, -522 + dy, 200, 24), 5);
  shape(ctx, KAR.skin, () => ctx.rect(-26, hy + 56, 52, 50), 0);
  // arms
  const P = MO.poseOf({
    rest: [[-160, -430], [160, -430]],
    bowDown: [[-175, -440], [160, -430]],
    bow: [[-400, -770], [-30, -760]],
    raise: [[-160, -430], [200, -1010]],
    fists: [[-200, -760], [200, -760]],
    reachUp: [[-160, -430], [230, -930]],
  }, pose, o, [[-160, -430], [160, -430]]);
  const pref = { bow: ['down', 'down'], fists: ['down', 'down'], raise: ['out', 'out'], reachUp: ['out', 'down'] }[pose] || ['out', 'out'];
  const SL = [-120, -695 + dy], SR = [120, -695 + dy];
  const hl = arm(ctx, SL, [P[0][0], P[0][1] + dy], KAR, pref[0])[2];
  let hr;
  if (pose === 'bow') {
    // bow drawn in front of face: draw head first then right arm & bow on top
  }
  // head
  for (const sx of [-1, 1]) ell(ctx, sx * 64, hy + 5, 14, 22, KAR.skin, 5);
  ell(ctx, 0, hy, 66, 78, KAR.skin);
  // hair top
  shape(ctx, '#15100E', () => { ctx.moveTo(-68, hy + 5); ctx.quadraticCurveTo(-75, hy - 92, 0, hy - 94); ctx.quadraticCurveTo(75, hy - 92, 68, hy + 5); ctx.quadraticCurveTo(48, hy - 55, 0, hy - 60); ctx.quadraticCurveTo(-48, hy - 55, -68, hy + 5); ctx.closePath(); });
  // crown band + small mukut
  shape(ctx, GOLD2, () => { ctx.moveTo(-66, hy - 60); ctx.lineTo(-44, hy - 138); ctx.lineTo(-20, hy - 100); ctx.lineTo(0, hy - 160); ctx.lineTo(20, hy - 100); ctx.lineTo(44, hy - 138); ctx.lineTo(66, hy - 60); ctx.closePath(); }, 6);
  shape(ctx, GOLD2, () => ctx.rect(-70, hy - 82, 140, 26), 5);
  if (!SIL()) {
    for (const [jx, jy, c] of [[0, hy - 69, '#C62828'], [-38, hy - 69, '#2E7D32'], [38, hy - 69, '#2E7D32'], [0, hy - 118, '#1565C0']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(jx, jy, 8, 0, 7); ctx.fill(); }
    ctx.strokeStyle = '#D32F2F'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, hy - 50); ctx.lineTo(0, hy - 24); ctx.stroke();
  }
  eyes(ctx, 0, hy + 4, 27, 20, 11, o, '#1a1010');
  brows(ctx, 0, hy - 19, 27, 22, o.brow ?? (o.mouth === 'sad' ? -10 : 6), 5);
  nose(ctx, 0, hy + 10);
  // thin moustache
  shape(ctx, '#15100E', () => { ctx.moveTo(0, hy + 36); ctx.quadraticCurveTo(-26, hy + 30, -40, hy + 44); ctx.quadraticCurveTo(-24, hy + 40, 0, hy + 42); ctx.quadraticCurveTo(24, hy + 40, 40, hy + 44); ctx.quadraticCurveTo(26, hy + 30, 0, hy + 36); ctx.closePath(); }, 2);
  mouthLine(ctx, 0, hy + 54, o.mouth || 'firm', 14);
  if (o.tear) tear(ctx, 30, hy + 20, t, o.tear);
  for (const sx of [-1, 1]) kundal(ctx, sx * 66, hy + 44, 17, t, o.kundalGlow ?? 0.5);
  hr = arm(ctx, SR, [P[1][0], P[1][1] + dy], KAR, pref[1])[2];
  if (pose === 'bow') bow(ctx, hl[0], hl[1], 1, true, hr, o.released);
  else if (pose === 'bowDown') bow(ctx, hl[0], hl[1], 0.85, false);
  else if (pose === 'raise') bow(ctx, hr[0], hr[1], 0.8, false);
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  return { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s], chest: [x, y + (-610 + dy) * s] };
}

// ================= BABY KARNA (wrapped bundle) =================
function baby(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (o.rot) ctx.rotate(o.rot);
  if (!SIL() && (o.glow ?? 0.6) > 0) handGlow(ctx, 0, 0, 260, (o.glow ?? 0.6) * (0.8 + 0.2 * Math.sin(t * 3)), '255,200,60');
  shape(ctx, '#F6F1E4', () => { ctx.ellipse(10, 10, 150, 72, -0.08, 0, 7); });
  if (!SIL()) { ctx.strokeStyle = '#D8CFBA'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-40 + i * 50, -45); ctx.quadraticCurveTo(-10 + i * 50, 10, -50 + i * 50, 62); ctx.stroke(); } }
  // tiny kavach on chest (Karna only; o.kavach === false for other babies)
  if (o.kavach !== false) shape(ctx, GOLD, () => { ctx.ellipse(-5, -6, 46, 30, 0, 0, 7); }, 5);
  if (o.kavach !== false && !SIL()) { ctx.strokeStyle = '#B07D0A'; ctx.lineWidth = 3; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(-5 + i * 16, -6, 8, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); } shape(ctx, '#FF9800', () => ctx.arc(-5, -6, 10, 0, 7), 3); }
  // head
  const hx = -140, hy2 = -18;
  ell(ctx, hx, hy2, 56, 54, '#D9A06A');
  shape(ctx, '#15100E', () => { ctx.moveTo(hx - 54, hy2 - 8); ctx.quadraticCurveTo(hx - 50, hy2 - 62, hx, hy2 - 58); ctx.quadraticCurveTo(hx + 40, hy2 - 58, hx + 50, hy2 - 22); ctx.quadraticCurveTo(hx + 10, hy2 - 40, hx - 54, hy2 - 8); ctx.closePath(); }, 4);
  eyes(ctx, hx, hy2 + 4, 18, 11, 7, { eyes: o.eyes || 'closed' });
  if (!SIL()) { ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hx, hy2 + 22, 8, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); ctx.fillStyle = 'rgba(230,110,110,0.45)'; ctx.beginPath(); ctx.arc(hx - 30, hy2 + 16, 9, 0, 7); ctx.arc(hx + 30, hy2 + 16, 9, 0, 7); ctx.fill(); }
  if (o.kavach !== false) kundal(ctx, hx + 6, hy2 + 46, 10, t, o.kundalGlow ?? 0.7);
  ctx.restore();
}

// ================= LADY (Kunti / Radha share a body) =================
const KUN = { skin: '#DDA77E', l1: 132, l2: 122, w: 30, bangles: true, sari: '#2B4C9B', blouse: '#C62828', border: GOLD, tiara: true };
const RAD = { skin: '#A8704A', l1: 130, l2: 120, w: 30, bangles: true, sari: '#2E8B57', blouse: '#E8B21E', border: GOLD, tiara: false };
function lady(ctx, x, y, s, o, P) {
  const t = o.t || 0, pose = o.pose || 'rest';
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const hy = -840 + (o.bowHead ? 12 : 0);
  // hair behind (braid for Kunti, bun for Radha)
  if (P.tiara) for (let i = 0; i < 9; i++) ell(ctx, 56 + i * 2 + Math.sin(t * 2 + i * 0.5) * i, hy + 40 + i * 42, 23, 27, '#161214', 5);
  else shape(ctx, '#161214', () => ctx.ellipse(0, hy - 30, 70, 64, 0, 0, 7));
  ell(ctx, -40, -22, 34, 16, P.skin); ell(ctx, 40, -22, 34, 16, P.skin);
  // sari skirt
  const sk = () => { ctx.moveTo(-82, -525); ctx.lineTo(82, -525); ctx.quadraticCurveTo(140, -300, 165, -40); ctx.quadraticCurveTo(0, -20, -165, -40); ctx.quadraticCurveTo(-140, -300, -82, -525); ctx.closePath(); };
  shape(ctx, P.sari, sk);
  if (!SIL()) {
    ctx.save(); ctx.beginPath(); sk(); ctx.clip();
    ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 5; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 14, -480); ctx.lineTo(i * 34, -40); ctx.stroke(); }
    ctx.strokeStyle = P.border; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-180, -52); ctx.quadraticCurveTo(0, -30, 180, -52); ctx.stroke();
    ctx.fillStyle = '#F6CF4A'; for (let i = 0; i < 26; i++) { const u = (i * 0.618) % 1, v = (i * 0.37) % 1; const yy = -470 + v * 360; const wd = 85 + (yy + 525) * 0.16; ctx.beginPath(); ctx.arc(-wd + u * 2 * wd, yy, 4.5, 0, 7); ctx.fill(); }
    ctx.restore(); ctx.beginPath(); sk(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke();
  }
  // blouse + midriff
  shape(ctx, P.skin, () => { ctx.moveTo(-78, -620); ctx.lineTo(78, -620); ctx.lineTo(76, -520); ctx.lineTo(-76, -520); ctx.closePath(); });
  shape(ctx, P.blouse, () => { ctx.moveTo(-92, -712); ctx.quadraticCurveTo(0, -735, 92, -712); ctx.lineTo(86, -612); ctx.quadraticCurveTo(0, -594, -86, -612); ctx.closePath(); });
  // pallu: left shoulder across chest to right hip
  const pl = () => { ctx.moveTo(-92, -712); ctx.lineTo(-40, -722); ctx.lineTo(90, -540); ctx.lineTo(84, -505); ctx.lineTo(30, -515); ctx.lineTo(-86, -640); ctx.closePath(); };
  shape(ctx, P.sari, pl);
  if (!SIL()) { ctx.strokeStyle = P.border; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-40, -722); ctx.lineTo(90, -540); ctx.stroke(); ctx.beginPath(); pl(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke(); }
  if (o.belly) { shape(ctx, P.sari, () => ctx.ellipse(0, -490, 100, 88, 0, 0, 7)); if (!SIL() && o.wombGlow) handGlow(ctx, 0, -490, 230, o.wombGlow * (0.8 + 0.2 * Math.sin(t * 3)), '255,200,60'); }
  shape(ctx, P.skin, () => ctx.rect(-20, hy + 55, 40, 45), 0);
  shape(ctx, GOLD, () => { ctx.moveTo(-48, -728); ctx.quadraticCurveTo(0, -668, 48, -728); ctx.quadraticCurveTo(0, -692, -48, -728); ctx.closePath(); }, 4);
  // arms
  let A = MO.poseOf({
    rest: [[-118, -460], [118, -460]],
    namaste: [[-8, -660], [8, -660]],
    hold: [[-40, -590], [70, -560]],
    reach: [[-118, -460], [300, -560]],
    reachDown: [[-118, -460], [290, -380]],
    heart: [[-118, -460], [-10, -650]],
    plead: [[-170, -790], [170, -790]],
    palms: [[-150, -600], [150, -600]],
    face: [[-60, -840], [60, -840]],
    lift: [[-80, -560], [80, -560]],
    belly: [[-30, -470], [50, -500]],
  }, pose, o, [[-118, -460], [118, -460]]);
  const pref = { namaste: ['down', 'down'], hold: ['down', 'down'], plead: ['down', 'down'], palms: ['down', 'down'], heart: ['out', 'down'], face: ['down', 'down'], lift: ['down', 'down'], belly: ['out', 'out'] }[pose] || ['out', 'out'];
  if (o.baby) baby(ctx, 15, -615, 0.62, t, Object.assign({ glow: 0.5 }, o.babyOpt || {}));
  const hl = pose === 'face' ? null : arm(ctx, [-84, -698], A[0], P, pref[0], { noHand: pose === 'namaste' })[2];
  // head
  for (const sx of [-1, 1]) { ell(ctx, sx * 55, hy + 8, 11, 18, P.skin, 4); shape(ctx, GOLD, () => { ctx.moveTo(sx * 56, hy + 22); ctx.quadraticCurveTo(sx * 75, hy + 60, sx * 56, hy + 68); ctx.quadraticCurveTo(sx * 37, hy + 60, sx * 56, hy + 22); ctx.closePath(); }, 4); }
  ell(ctx, 0, hy, 56, 68, P.skin);
  shape(ctx, '#161214', () => { ctx.moveTo(-60, hy + 15); ctx.quadraticCurveTo(-70, hy - 85, 0, hy - 82); ctx.quadraticCurveTo(70, hy - 85, 60, hy + 15); ctx.quadraticCurveTo(52, hy - 40, 8, hy - 52); ctx.lineTo(0, hy - 45); ctx.lineTo(-8, hy - 52); ctx.quadraticCurveTo(-52, hy - 40, -60, hy + 15); ctx.closePath(); });
  if (P.tiara) {
    shape(ctx, GOLD2, () => { ctx.moveTo(-58, hy - 62); ctx.quadraticCurveTo(0, hy - 96, 58, hy - 62); ctx.lineTo(40, hy - 108); ctx.lineTo(20, hy - 92); ctx.lineTo(0, hy - 128); ctx.lineTo(-20, hy - 92); ctx.lineTo(-40, hy - 108); ctx.closePath(); }, 5);
    if (!SIL()) { ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(0, hy - 98, 8, 0, 7); ctx.fill(); }
  }
  if (!SIL()) {
    ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, hy - 82); ctx.lineTo(0, hy - 46); ctx.stroke();
    shape(ctx, GOLD, () => ctx.arc(0, hy - 40, 8, 0, 7), 3);
    ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(0, hy - 20, 6, 0, 7); ctx.fill();
  }
  eyes(ctx, 0, hy + 4, 23, 19, 11, Object.assign({ kajal: true }, o), '#2a1a12');
  brows(ctx, 0, hy - 18, 23, 19, o.brow ?? (o.mouth === 'sad' ? -12 : -4), 3.5);
  nose(ctx, 0, hy + 10);
  if (!SIL()) {
    if (P.tiara) { ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(10, hy + 30, 7, -0.5, 3.5); ctx.stroke(); }
    const m = o.mouth || 'calm';
    if (m === 'o') shape(ctx, '#7a1a2a', () => ctx.ellipse(0, hy + 44, 9, 12, 0, 0, 7), 3);
    else if (m === 'sad') { ctx.strokeStyle = '#8E1B3A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, hy + 58, 12, 1.25 * Math.PI, 1.75 * Math.PI); ctx.stroke(); }
    else shape(ctx, '#B0284A', () => { ctx.moveTo(-14, hy + 40); ctx.quadraticCurveTo(0, hy + 34, 14, hy + 40); ctx.quadraticCurveTo(0, hy + 52, -14, hy + 40); ctx.closePath(); }, 3);
  }
  if (o.tear) { tear(ctx, -26, hy + 18, t, o.tear); tear(ctx, 26, hy + 18, t + 1.1, o.tear); }
  let hr;
  if (pose === 'face') { arm(ctx, [-84, -698], A[0], P, 'down'); hr = arm(ctx, [84, -698], A[1], P, 'down')[2]; }
  else hr = arm(ctx, [84, -698], A[1], P, pref[1], { noHand: pose === 'namaste' })[2];
  if (pose === 'namaste') shape(ctx, P.skin, () => { ctx.moveTo(0, -730); ctx.quadraticCurveTo(26, -690, 15, -640); ctx.lineTo(-15, -640); ctx.quadraticCurveTo(-26, -690, 0, -730); ctx.closePath(); });
  ctx.restore();
  const fx = o.flip ? -1 : 1, H = hl || [0, -700];
  return { L: [x + H[0] * s * fx, y + H[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s] };
}
const kunti = (ctx, x, y, s, o = {}) => lady(ctx, x, y, s, o, KUN);
const radha = (ctx, x, y, s, o = {}) => lady(ctx, x, y, s, o, RAD);

// ================= RISHI DURVASA =================
const DUR = { skin: '#9C6A3E', l1: 140, l2: 130, w: 40 };
function durvasa(ctx, x, y, s, o = {}) {
  const t = o.t || 0, pose = o.pose || 'bless';
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const hy = -830;
  if (o.halo) halo(ctx, 0, hy - 40, 165, t, o.halo);
  // staff (left)
  limb(ctx, [[-175, -20], [-175, -1080]], 16, '#7A5230');
  ell(ctx, -60, -25, 44, 20, DUR.skin); ell(ctx, 60, -25, 44, 20, DUR.skin);
  // robe (saffron) long
  const rb = () => { ctx.moveTo(-110, -700); ctx.quadraticCurveTo(0, -725, 110, -700); ctx.lineTo(100, -520); ctx.quadraticCurveTo(150, -260, 150, -50); ctx.quadraticCurveTo(0, -30, -150, -50); ctx.quadraticCurveTo(-150, -260, -100, -520); ctx.closePath(); };
  shape(ctx, '#E07B1A', rb);
  // bare right shoulder/chest
  shape(ctx, DUR.skin, () => { ctx.moveTo(30, -718); ctx.quadraticCurveTo(80, -722, 110, -700); ctx.lineTo(102, -560); ctx.lineTo(60, -560); ctx.closePath(); });
  if (!SIL()) { ctx.strokeStyle = '#B85A0A'; ctx.lineWidth = 5; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 30, -480); ctx.lineTo(i * 44, -60); ctx.stroke(); } }
  shape(ctx, '#B85A0A', () => ctx.rect(-104, -520, 208, 22), 5);
  // rudraksha
  if (!SIL()) { ctx.fillStyle = '#5B2E12'; for (let i = 0; i <= 18; i++) { const a = i / 18; ctx.beginPath(); ctx.arc(-64 + a * 128, -705 + Math.sin(a * Math.PI) * 170, 8, 0, 7); ctx.fill(); } }
  shape(ctx, DUR.skin, () => ctx.rect(-22, hy + 52, 44, 48), 0);
  const P = MO.poseOf({ bless: [[-170, -520], [180, -840]], rest: [[-170, -520], [140, -440]], angry: [[-170, -520], [250, -760]] }, pose, o, null);
  const hl = arm(ctx, [-100, -690], P[0], DUR, 'down', {})[2];
  // head + white hair/beard
  shape(ctx, '#F2EFE6', () => ctx.ellipse(0, hy - 120, 52, 58, 0, 0, 7));
  for (const sx of [-1, 1]) ell(ctx, sx * 60, hy + 4, 12, 20, DUR.skin, 5);
  ell(ctx, 0, hy, 62, 74, DUR.skin);
  shape(ctx, '#F2EFE6', () => { ctx.moveTo(-64, hy - 6); ctx.quadraticCurveTo(-66, hy - 86, 0, hy - 88); ctx.quadraticCurveTo(66, hy - 86, 64, hy - 6); ctx.quadraticCurveTo(44, hy - 56, 0, hy - 60); ctx.quadraticCurveTo(-44, hy - 56, -64, hy - 6); ctx.closePath(); });
  // beard
  shape(ctx, '#F2EFE6', () => { ctx.moveTo(-60, hy + 10); ctx.quadraticCurveTo(-70, hy + 140, 0, hy + 230 + Math.sin(t * 2) * 4); ctx.quadraticCurveTo(70, hy + 140, 60, hy + 10); ctx.quadraticCurveTo(40, hy + 60, 0, hy + 62); ctx.quadraticCurveTo(-40, hy + 60, -60, hy + 10); ctx.closePath(); });
  if (!SIL()) {
    ctx.strokeStyle = '#F7F7F7'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-32, hy - 46 + i * 9); ctx.lineTo(32, hy - 46 + i * 9); ctx.stroke(); }
    ctx.fillStyle = '#D9302C'; ctx.beginPath(); ctx.arc(0, hy - 36, 6, 0, 7); ctx.fill();
  }
  eyes(ctx, 0, hy + 2, 25, 18, 10, Object.assign({ eyes: 'narrow' }, o), '#1a1010');
  brows(ctx, 0, hy - 18, 26, 26, 20, 9, '#F2EFE6');
  nose(ctx, 0, hy + 8);
  // moustache white
  shape(ctx, '#F2EFE6', () => { ctx.moveTo(0, hy + 32); ctx.quadraticCurveTo(-40, hy + 26, -54, hy + 58); ctx.quadraticCurveTo(-30, hy + 44, 0, hy + 44); ctx.quadraticCurveTo(30, hy + 44, 54, hy + 58); ctx.quadraticCurveTo(40, hy + 26, 0, hy + 32); ctx.closePath(); }, 3);
  const hr = arm(ctx, [100, -690], P[1], DUR, pose === 'rest' ? 'out' : 'down')[2];
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  return { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s] };
}

// ================= SURYA DEV =================
const SUR = { skin: '#F2A93B', l1: 148, l2: 138, w: 46 };
function lotus(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const [a, c] of [[-0.9, '#F48FB1'], [0.9, '#F48FB1'], [-0.45, '#F06292'], [0.45, '#F06292'], [0, '#EC407A']]) shape(ctx, c, () => { ctx.save(); ctx.rotate(a); ctx.ellipse(0, -40, 20, 44, 0, 0, 7); ctx.restore(); }, 4);
  ctx.restore();
}
function surya(ctx, x, y, s, o = {}) {
  const t = o.t || 0, pose = o.pose || 'bless';
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const hy = -860;
  if (o.rays !== 0) sunHalo(ctx, 0, hy - 40, 230, t, o.rays ?? 1);
  limb(ctx, [[-44, -470], [-50, -70]], 56, SUR.skin); limb(ctx, [[44, -470], [50, -70]], 56, SUR.skin);
  limb(ctx, [[-50, -98], [-50, -84]], 62, GOLD, 'butt'); limb(ctx, [[50, -98], [50, -84]], 62, GOLD, 'butt');
  ell(ctx, -64, -35, 46, 22, SUR.skin); ell(ctx, 64, -35, 46, 22, SUR.skin);
  const dh = () => { ctx.moveTo(-100, -510); ctx.lineTo(100, -510); ctx.quadraticCurveTo(135, -300, 120, -130); ctx.lineTo(-120, -130); ctx.quadraticCurveTo(-135, -300, -100, -510); ctx.closePath(); };
  shape(ctx, '#C62828', dh);
  if (!SIL()) { ctx.strokeStyle = GOLD; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-120, -145); ctx.lineTo(120, -145); ctx.stroke(); ctx.beginPath(); dh(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke(); }
  const tor = () => { ctx.moveTo(-122, -705); ctx.quadraticCurveTo(0, -738, 122, -705); ctx.quadraticCurveTo(116, -600, 90, -505); ctx.lineTo(-90, -505); ctx.quadraticCurveTo(-116, -600, -122, -705); ctx.closePath(); };
  kavach(ctx, tor, 0, -610, t, 0);
  shape(ctx, GOLD, () => ctx.rect(-96, -522, 192, 24), 5);
  shape(ctx, SUR.skin, () => ctx.rect(-25, hy + 55, 50, 50), 0);
  const P = MO.poseOf({ bless: [[-210, -760], [180, -800]], rest: [[-150, -440], [150, -440]], give: [[-150, -440], [260, -640]] }, pose, o, null);
  const hl = arm(ctx, [-114, -695], P[0], SUR, 'down')[2];
  // head
  for (const sx of [-1, 1]) ell(ctx, sx * 64, hy + 5, 14, 22, SUR.skin, 5);
  ell(ctx, 0, hy, 64, 76, SUR.skin);
  shape(ctx, '#3A1A0E', () => { ctx.moveTo(-66, hy + 5); ctx.quadraticCurveTo(-72, hy - 85, 0, hy - 86); ctx.quadraticCurveTo(72, hy - 85, 66, hy + 5); ctx.quadraticCurveTo(44, hy - 50, 0, hy - 55); ctx.quadraticCurveTo(-44, hy - 50, -66, hy + 5); ctx.closePath(); });
  // tall crown
  shape(ctx, GOLD2, () => { ctx.moveTo(-74, hy - 55); ctx.lineTo(74, hy - 55); ctx.lineTo(56, hy - 130); ctx.lineTo(36, hy - 250); ctx.lineTo(0, hy - 300); ctx.lineTo(-36, hy - 250); ctx.lineTo(-56, hy - 130); ctx.closePath(); });
  shape(ctx, GOLD2, () => ctx.rect(-80, hy - 84, 160, 32), 5);
  if (!SIL()) {
    ctx.strokeStyle = '#9C6B00'; ctx.lineWidth = 4; for (const yy of [hy - 150, hy - 210]) { ctx.beginPath(); ctx.moveTo(-46, yy); ctx.lineTo(46, yy); ctx.stroke(); }
    shape(ctx, '#FF6F00', () => ctx.arc(0, hy - 180, 20, 0, 7), 4);
    for (const [jx, jy, c] of [[0, hy - 68, '#C62828'], [-46, hy - 68, '#2E7D32'], [46, hy - 68, '#2E7D32']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(jx, jy, 10, 0, 7); ctx.fill(); }
    ctx.strokeStyle = '#D32F2F'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, hy - 48); ctx.lineTo(0, hy - 22); ctx.stroke();
  }
  eyes(ctx, 0, hy + 4, 26, 20, 11, o, '#5a2a0a');
  brows(ctx, 0, hy - 18, 26, 22, 0, 4.5);
  nose(ctx, 0, hy + 10);
  shape(ctx, '#3A1A0E', () => { ctx.moveTo(0, hy + 34); ctx.quadraticCurveTo(-30, hy + 28, -44, hy + 44); ctx.quadraticCurveTo(-24, hy + 40, 0, hy + 42); ctx.quadraticCurveTo(24, hy + 40, 44, hy + 44); ctx.quadraticCurveTo(30, hy + 28, 0, hy + 34); ctx.closePath(); }, 2);
  mouthLine(ctx, 0, hy + 54, 'smile', 14);
  for (const sx of [-1, 1]) kundal(ctx, sx * 66, hy + 44, 17, t, 0.5);
  const hr = arm(ctx, [114, -695], P[1], SUR, pose === 'give' ? 'down' : 'down')[2];
  if (pose === 'bless') lotus(ctx, hl[0], hl[1] - 30, 0.9);
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  return { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s] };
}

// ================= ADHIRATHA (charioteer) — also used in silhouette for crowds =================
const ADH = { skin: '#94603C', l1: 140, l2: 130, w: 44 };
function adhiratha(ctx, x, y, s, o = {}) {
  const t = o.t || 0, pose = o.pose || 'rest';
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const hy = -830 + (o.bowHead ? 10 : 0);
  limb(ctx, [[-44, -470], [-50, -70]], 54, ADH.skin); limb(ctx, [[44, -470], [50, -70]], 54, ADH.skin);
  ell(ctx, -64, -35, 46, 22, ADH.skin); ell(ctx, 64, -35, 46, 22, ADH.skin);
  shape(ctx, '#F5F1E6', () => { ctx.moveTo(-100, -540); ctx.lineTo(100, -540); ctx.lineTo(118, -200); ctx.quadraticCurveTo(0, -170, -118, -200); ctx.closePath(); });
  // kurta
  shape(ctx, '#ECE4D0', () => { ctx.moveTo(-120, -705); ctx.quadraticCurveTo(0, -735, 120, -705); ctx.quadraticCurveTo(120, -560, 112, -440); ctx.lineTo(-112, -440); ctx.quadraticCurveTo(-120, -560, -120, -705); ctx.closePath(); });
  shape(ctx, '#C62828', () => ctx.rect(-112, -520, 224, 30), 5);
  if (!SIL()) { ctx.strokeStyle = '#B8AE96'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -720); ctx.lineTo(0, -600); ctx.stroke(); }
  shape(ctx, ADH.skin, () => ctx.rect(-24, hy + 52, 48, 50), 0);
  const P = MO.poseOf({ rest: [[-150, -440], [150, -440]], lift: [[-175, -500], [175, -500]], hold: [[-40, -590], [70, -560]], point: [[-150, -440], [330, -820]], whisper: [[-150, -440], [70, -820]] }, pose, o, null);
  const pref = { lift: ['out', 'out'], hold: ['down', 'down'], whisper: ['out', 'down'] }[pose] || ['out', 'out'];
  const cfg = Object.assign({}, ADH, { skin: ADH.skin });
  if (o.baby) baby(ctx, 15, -615, 0.62, t, Object.assign({ glow: 0.5 }, o.babyOpt || {}));
  const hl = arm(ctx, [-108, -692], P[0], cfg, pref[0])[2];
  for (const sx of [-1, 1]) ell(ctx, sx * 60, hy + 5, 13, 20, ADH.skin, 5);
  ell(ctx, 0, hy, 62, 74, ADH.skin);
  // turban
  shape(ctx, '#F5F1E6', () => { ctx.moveTo(-70, hy - 20); ctx.quadraticCurveTo(-82, hy - 120, 0, hy - 128); ctx.quadraticCurveTo(82, hy - 120, 70, hy - 20); ctx.quadraticCurveTo(0, hy - 60, -70, hy - 20); ctx.closePath(); });
  shape(ctx, '#F5F1E6', () => { ctx.moveTo(60, hy - 60); ctx.quadraticCurveTo(120, hy - 20, 100 + Math.sin(t * 2) * 6, hy + 90); ctx.lineTo(80, hy + 84); ctx.quadraticCurveTo(90, hy - 10, 50, hy - 40); ctx.closePath(); }, 5);
  if (!SIL()) { ctx.strokeStyle = '#C9C0A8'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-64, hy - 40 - i * 26); ctx.quadraticCurveTo(0, hy - 76 - i * 22, 64, hy - 40 - i * 26); ctx.stroke(); } ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(0, hy - 32, 6, 0, 7); ctx.fill(); }
  eyes(ctx, 0, hy + 4, 25, 19, 11, o, '#1a1010');
  brows(ctx, 0, hy - 18, 25, 22, 4, 6);
  nose(ctx, 0, hy + 10);
  shape(ctx, '#1A1210', () => { ctx.moveTo(0, hy + 30); ctx.quadraticCurveTo(-40, hy + 24, -60, hy + 46); ctx.quadraticCurveTo(-34, hy + 44, 0, hy + 42); ctx.quadraticCurveTo(34, hy + 44, 60, hy + 46); ctx.quadraticCurveTo(40, hy + 24, 0, hy + 30); ctx.closePath(); }, 3);
  mouthLine(ctx, 0, hy + 56, o.mouth || 'smile', 13);
  const hr = arm(ctx, [108, -692], P[1], cfg, pref[1])[2];
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  return { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s] };
}

// ---------- props ----------
function basket(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 1.6) * 0.04);
  if (o.glow && !SIL()) handGlow(ctx, 0, -40, 300, o.glow * (0.8 + 0.2 * Math.sin(t * 3)), '255,200,60');
  // back rim
  shape(ctx, '#7A4E22', () => ctx.ellipse(0, -40, 190, 50, 0, 0, 7));
  if (o.baby !== false) baby(ctx, 30, -55, 0.7, t, { glow: 0, kundalGlow: 0.6 });
  // front weave
  const fr = () => { ctx.moveTo(-190, -40); ctx.quadraticCurveTo(-170, 60, 0, 70); ctx.quadraticCurveTo(170, 60, 190, -40); ctx.quadraticCurveTo(0, 10, -190, -40); ctx.closePath(); };
  shape(ctx, '#B07A3A', fr);
  if (!SIL()) { ctx.save(); ctx.beginPath(); fr(); ctx.clip(); ctx.strokeStyle = '#7A4E22'; ctx.lineWidth = 5; for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(i * 20, -40); ctx.lineTo(i * 20 + 30, 80); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i * 20, -40); ctx.lineTo(i * 20 - 30, 80); ctx.stroke(); } ctx.restore(); ctx.beginPath(); fr(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke(); }
  limb(ctx, [[-190, -40], [-150, -20], [0, -12], [150, -20], [190, -40]], 14, '#8A5A2A');
  ctx.restore();
}
function horse(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  const col = '#E9E2D4', st = Math.sin(t * 2) * 6;
  for (const lx of [-150, -110, 110, 150]) limb(ctx, [[lx, -220], [lx + (lx > 0 ? 6 : -6), -10]], 30, col);
  shape(ctx, col, () => ctx.ellipse(0, -300, 210, 100, 0, 0, 7));
  shape(ctx, col, () => { ctx.moveTo(150, -330); ctx.quadraticCurveTo(200, -470, 260, -520 + st); ctx.lineTo(330, -470 + st); ctx.lineTo(300, -430 + st); ctx.quadraticCurveTo(250, -420, 220, -300); ctx.closePath(); });
  shape(ctx, '#3A2416', () => { ctx.moveTo(160, -360); ctx.quadraticCurveTo(195, -480, 250, -530 + st); ctx.lineTo(240, -500 + st); ctx.quadraticCurveTo(200, -440, 190, -350); ctx.closePath(); }, 4);
  shape(ctx, '#3A2416', () => { ctx.moveTo(-205, -320); ctx.quadraticCurveTo(-280, -260 + st, -270, -140); ctx.quadraticCurveTo(-240, -240, -200, -280); ctx.closePath(); }, 4);
  if (!SIL()) { ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(282, -486 + st, 6, 0, 7); ctx.fill(); ctx.strokeStyle = '#C62828'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(240, -500 + st); ctx.lineTo(300, -450 + st); ctx.stroke(); }
  ctx.restore();
}
function chariotWheel(ctx, x, y, r, t, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.strokeStyle = OUT; ctx.lineWidth = r * 0.16 + 10; ctx.stroke(); ctx.strokeStyle = C('#8A5A2A'); ctx.lineWidth = r * 0.16; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; limb(ctx, [[0, 0], [Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9]], r * 0.05, '#A0703A'); }
  shape(ctx, GOLD, () => ctx.arc(0, 0, r * 0.16, 0, 7), 5);
  ctx.restore();
}

module.exports = { lady, mouthLine, nose, GOLD, GOLD2, karna: MO.alive(karna), baby, kunti: MO.alive(kunti), radha: MO.alive(radha), durvasa: MO.alive(durvasa), surya: MO.alive(surya), adhiratha: MO.alive(adhiratha), basket, horse, chariotWheel, bow, sunHalo, kundal, lotus, tear };
