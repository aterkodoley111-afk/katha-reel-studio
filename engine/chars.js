// Locked character designs — every scene calls these same functions.
const OUT = '#140c0c', LW = 7;
let SIL = null; // silhouette colour when set
const C = (col) => (SIL ? SIL : col);
const D2R = Math.PI / 180;

function shape(ctx, fill, build, lw = LW) {
  ctx.beginPath(); build();
  ctx.fillStyle = C(fill); ctx.fill();
  if (!lw) return;
  ctx.lineWidth = lw; ctx.strokeStyle = OUT; ctx.lineJoin = 'round'; ctx.stroke();
}
function ell(ctx, x, y, rx, ry, fill, lw = LW, rot = 0) {
  shape(ctx, fill, () => ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2), lw);
}
function limb(ctx, pts, w, col, cap = 'round') {
  ctx.lineCap = cap; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
  ctx.strokeStyle = OUT; ctx.lineWidth = w + LW * 2; ctx.stroke();
  ctx.strokeStyle = C(col); ctx.lineWidth = w; ctx.stroke();
}
function lerp2(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function ik(s, h, l1, l2, pref) {
  let dx = h[0] - s[0], dy = h[1] - s[1];
  let d = Math.hypot(dx, dy); const maxd = l1 + l2 - 1;
  if (d > maxd) { h = [s[0] + dx / d * maxd, s[1] + dy / d * maxd]; d = maxd; }
  if (d < 1) d = 1;
  const ux = dx / Math.hypot(dx, dy || 1e-6), uy = dy / Math.hypot(dx, dy || 1e-6);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const hh = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const bx = s[0] + ux * a, by = s[1] + uy * a;
  const e1 = [bx - uy * hh, by + ux * hh], e2 = [bx + uy * hh, by - ux * hh];
  let e;
  if (pref === 'down') e = e1[1] > e2[1] ? e1 : e2;
  else if (pref === 'up') e = e1[1] < e2[1] ? e1 : e2;
  else if (pref === 'in') e = Math.abs(e1[0]) < Math.abs(e2[0]) ? e1 : e2;
  else e = Math.abs(e1[0]) > Math.abs(e2[0]) ? e1 : e2;
  return [s, e, h];
}
function arm(ctx, sh, target, cfg, pref, opt = {}) {
  const pts = ik(sh, target, cfg.l1, cfg.l2, pref || 'out');
  limb(ctx, pts, cfg.w, cfg.skin);
  // armband + bangles
  limb(ctx, [lerp2(pts[0], pts[1], 0.40), lerp2(pts[0], pts[1], 0.52)], cfg.w + 2, '#E8B21E', 'butt');
  limb(ctx, [lerp2(pts[1], pts[2], 0.74), lerp2(pts[1], pts[2], 0.84)], cfg.w + 1, '#E8B21E', 'butt');
  if (cfg.bangles) limb(ctx, [lerp2(pts[1], pts[2], 0.62), lerp2(pts[1], pts[2], 0.7)], cfg.w + 1, '#C2185B', 'butt');
  if (!opt.noHand) {
    const ang = Math.atan2(pts[2][1] - pts[1][1], pts[2][0] - pts[1][0]);
    ell(ctx, pts[2][0], pts[2][1], cfg.w * 0.62, cfg.w * 0.52, cfg.skin, LW, ang);
  }
  return pts;
}
function handGlow(ctx, x, y, r, a, col = '255,90,30') {
  if (a <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,240,200,${a})`);
  g.addColorStop(0.3, `rgba(${col},${a * 0.8})`);
  g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function halo(ctx, x, y, r, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 1.6);
  g.addColorStop(0, 'rgba(255,215,100,0.55)'); g.addColorStop(1, 'rgba(255,200,80,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,214,90,0.9)'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#B8860B'; ctx.lineWidth = 6; ctx.stroke();
  // petal ring
  ctx.fillStyle = '#FFE9A8';
  for (let i = 0; i < 24; i++) {
    const a2 = i / 24 * Math.PI * 2 + t * 0.2;
    ctx.beginPath(); ctx.ellipse(x + Math.cos(a2) * r * 0.86, y + Math.sin(a2) * r * 0.86, 10, 5, a2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ---------- faces ----------
function eyes(ctx, cx, cy, sep, rx, ry, o, iris = '#1a1010') {
  const look = (o.look || 0) * rx * 0.35, lookY = (o.lookY || 0) * ry * 0.3;
  for (const sx of [-1, 1]) {
    const x = cx + sx * sep;
    if (o.eyes === 'closed') {
      ctx.beginPath(); ctx.arc(x, cy - ry * 0.4, rx * 0.95, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); continue;
    }
    if (o.eyes === 'glow' || SIL) {
      const g = ctx.createRadialGradient(x, cy, 0, x, cy, rx * 3);
      g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, cy, rx * 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, cy, rx, ry * (o.eyes === 'glow' ? 0.8 : 0.6), 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF'; ctx.fill(); continue;
    }
    const h = o.eyes === 'narrow' ? ry * 0.6 : o.eyes === 'wide' ? ry * 1.3 : ry;
    ctx.beginPath();
    ctx.moveTo(x - rx, cy); ctx.quadraticCurveTo(x, cy - h * 2, x + rx, cy);
    ctx.quadraticCurveTo(x, cy + h * 1.6, x - rx, cy); ctx.closePath();
    ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = o.kajal ? 7 : 5; ctx.stroke();
    ctx.save(); ctx.clip();
    ctx.beginPath(); ctx.arc(x + look, cy - h * 0.15 + lookY, Math.min(rx * 0.48, h * 1.1), 0, Math.PI * 2);
    ctx.fillStyle = iris; ctx.fill();
    ctx.beginPath(); ctx.arc(x + look + 3, cy - h * 0.35 + lookY, 3.5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
    if (o.kajal) { ctx.beginPath(); ctx.moveTo(x + sx * rx, cy); ctx.lineTo(x + sx * (rx + 12), cy - 8); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); }
  }
}
function brows(ctx, cx, cy, sep, w, angle, thick, col = OUT) {
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(cx + sx * sep, cy); ctx.rotate(sx * angle * D2R);
    ctx.beginPath(); ctx.ellipse(0, 0, w, thick, 0, Math.PI, 0); ctx.fillStyle = C(col); ctx.fill(); ctx.restore();
  }
}

// ---------- common lower bodies ----------
function crossedLegs(ctx, skin, cloth, pattern, y0) {
  // y0 = waist y (seated). feet at 0
  shape(ctx, skin, () => { ctx.ellipse(-110, -25, 70, 28, 0.15, 0, Math.PI * 2); });
  shape(ctx, skin, () => { ctx.ellipse(110, -25, 70, 28, -0.15, 0, Math.PI * 2); });
  shape(ctx, cloth, () => {
    ctx.moveTo(-80, y0); ctx.lineTo(80, y0);
    ctx.quadraticCurveTo(200, -90, 190, -30); ctx.quadraticCurveTo(0, 10, -190, -30);
    ctx.quadraticCurveTo(-200, -90, -80, y0); ctx.closePath();
  });
  if (pattern) pattern(-190, y0, 380, -y0);
  // feet on top
  ell(ctx, -60, -55, 42, 20, skin, LW, -0.3); ell(ctx, 60, -55, 42, 20, skin, LW, 0.3);
}
function tigerStripes(ctx, x, y, w, h, clipBuild) {
  if (SIL) return;
  ctx.save(); ctx.beginPath(); clipBuild(); ctx.clip();
  ctx.strokeStyle = '#1b0f08'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) {
    const px = x + (i + (j % 2) * 0.5) * w / 8, py = y + j * h / 4.5;
    ctx.beginPath(); ctx.moveTo(px - 18, py); ctx.quadraticCurveTo(px, py + 14, px + 16, py - 4); ctx.stroke();
  }
  ctx.restore();
}

// ================= SHIVA =================
const SHIVA = { skin: '#8DB6DE', l1: 150, l2: 140, w: 46 };
function shiva(ctx, x, y, s, o = {}) {
  const t = o.t || 0; const seated = o.seated; const dy = seated ? 300 : 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (o.rot) ctx.rotate(o.rot * D2R);
  const hy = -830 + dy;
  if (o.halo) halo(ctx, 0, hy - 40, 175, t, o.halo);
  // hair locks behind
  for (const sx of [-1, 1]) shape(ctx, '#231B33', () => {
    ctx.moveTo(sx * 55, hy - 40); ctx.quadraticCurveTo(sx * 140, hy + 80, sx * 125, hy + 230 + Math.sin(t * 2 + sx) * 6);
    ctx.lineTo(sx * 85, hy + 210); ctx.quadraticCurveTo(sx * 95, hy + 80, sx * 45, hy + 10); ctx.closePath();
  });
  const pose = o.pose || 'rest';
  const SL = [-112, -690 + dy], SR = [112, -690 + dy];
  // lower body
  if (seated) {
    crossedLegs(ctx, SHIVA.skin, '#E6A23A', null, -175);
    tigerStripes(ctx, -200, -170, 400, 170, () => { ctx.moveTo(-80, -175); ctx.lineTo(80, -175); ctx.quadraticCurveTo(200, -90, 190, -30); ctx.quadraticCurveTo(0, 10, -190, -30); ctx.quadraticCurveTo(-200, -90, -80, -175); });
    ell(ctx, -60, -55, 42, 20, SHIVA.skin, LW, -0.3); ell(ctx, 60, -55, 42, 20, SHIVA.skin, LW, 0.3);
  } else {
    limb(ctx, [[-42, -470], [-48, -70]], 56, SHIVA.skin); limb(ctx, [[42, -470], [48, -70]], 56, SHIVA.skin);
    limb(ctx, [[-48, -95], [-48, -80]], 62, '#E8B21E'); limb(ctx, [[48, -95], [48, -80]], 62, '#E8B21E');
    ell(ctx, -62, -35, 46, 22, SHIVA.skin); ell(ctx, 62, -35, 46, 22, SHIVA.skin);
    const dh = () => { ctx.moveTo(-95, -505); ctx.lineTo(95, -505); ctx.lineTo(118, -270); for (let i = 0; i <= 8; i++) ctx.lineTo(118 - i * 29.5, -270 + (i % 2 ? 22 : 0)); ctx.closePath(); };
    shape(ctx, '#E6A23A', dh); tigerStripes(ctx, -120, -500, 240, 230, dh); ctx.beginPath(); dh(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke();
  }
  // torso
  shape(ctx, SHIVA.skin, () => {
    ctx.moveTo(-118, -700 + dy); ctx.quadraticCurveTo(0, -730 + dy, 118, -700 + dy);
    ctx.quadraticCurveTo(110, -600 + dy, 85, -500 + dy); ctx.lineTo(-85, -500 + dy);
    ctx.quadraticCurveTo(-110, -600 + dy, -118, -700 + dy); ctx.closePath();
  });
  shape(ctx, '#E8B21E', () => ctx.rect(-92, -515 + dy, 184, 24), 5);
  // rudraksha mala
  ctx.fillStyle = C('#6B3A1E');
  for (let i = 0; i <= 18; i++) { const a = i / 18; const px = -72 + a * 144, py = -700 + dy + Math.sin(a * Math.PI) * 135; ctx.beginPath(); ctx.arc(px, py, 8, 0, 7); ctx.fill(); }
  // tiger skin over shoulder (strap)
  // snake around neck
  limb(ctx, [[-70, -712 + dy], [-30, -690 + dy], [30, -690 + dy], [80, -712 + dy], [100, -760 + dy]], 20, '#3E9B55');
  shape(ctx, '#3E9B55', () => ctx.ellipse(104, -785 + dy + Math.sin(t * 3) * 4, 22, 30, 0.2, 0, 7));
  if (!SIL) { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(98, -790 + dy + Math.sin(t * 3) * 4, 4, 0, 7); ctx.arc(112, -788 + dy + Math.sin(t * 3) * 4, 4, 0, 7); ctx.fill(); }
  // neck
  shape(ctx, SHIVA.skin, () => ctx.rect(-26, hy + 50, 52, 50), 0);
  // arms
  let hands = {};
  const P = {
    rest: [[-150, -430], [150, -430]],
    bless: [[-150, -430], [175, -800]],
    raise: [[-150, -430], [215, -900]],
    alarm: [[-215, -820], [215, -820]],
    meditate: [[-150, -380], [150, -380]],
    fly: [[-260, -800], [235, -560]],
  }[pose] || [[-150, -430], [150, -430]];
  const pref = { bless: ['out', 'down'], raise: ['out', 'out'], alarm: ['down', 'down'], fly: ['down', 'out'] }[pose] || ['out', 'out'];
  if (o.trishul) {
    const tx = -165, ty = -430 + dy;
    limb(ctx, [[tx, ty + 380], [tx, ty - 600]], 12, '#8A6A3A');
    shape(ctx, '#C9CED6', () => { ctx.moveTo(tx - 60, ty - 600); ctx.quadraticCurveTo(tx - 62, ty - 680, tx - 50, ty - 720); ctx.lineTo(tx - 42, ty - 650); ctx.lineTo(tx - 8, ty - 640); ctx.lineTo(tx, ty - 760); ctx.lineTo(tx + 8, ty - 640); ctx.lineTo(tx + 42, ty - 650); ctx.lineTo(tx + 50, ty - 720); ctx.quadraticCurveTo(tx + 62, ty - 680, tx + 60, ty - 600); ctx.closePath(); }, 5);
    // damru
    shape(ctx, '#B5743A', () => { ctx.moveTo(tx - 28, ty - 560); ctx.lineTo(tx + 28, ty - 560); ctx.lineTo(tx - 28, ty - 500); ctx.lineTo(tx + 28, ty - 500); ctx.closePath(); }, 5);
  }
  hands.L = arm(ctx, SL, [P[0][0], P[0][1] + dy], SHIVA, pref[0])[2];
  hands.R = arm(ctx, SR, [P[1][0], P[1][1] + dy], SHIVA, pref[1])[2];
  // head
  for (const sx of [-1, 1]) { ell(ctx, sx * 64, hy + 5, 14, 22, SHIVA.skin, 5); ctx.beginPath(); ctx.arc(sx * 66, hy + 38, 13, 0, 7); ctx.strokeStyle = C('#E8B21E'); ctx.lineWidth = 6; ctx.stroke(); }
  ell(ctx, 0, hy, 64, 76, SHIVA.skin);
  // jata
  shape(ctx, '#231B33', () => { ctx.moveTo(-66, hy - 5); ctx.quadraticCurveTo(-75, hy - 95, 0, hy - 96); ctx.quadraticCurveTo(75, hy - 95, 66, hy - 5); ctx.quadraticCurveTo(40, hy - 62, 0, hy - 58); ctx.quadraticCurveTo(-40, hy - 62, -66, hy - 5); ctx.closePath(); });
  shape(ctx, '#231B33', () => ctx.ellipse(0, hy - 145, 56, 70, 0, 0, 7));
  shape(ctx, '#231B33', () => ctx.ellipse(0, hy - 220, 32, 30, 0, 0, 7));
  // crescent moon
  shape(ctx, '#F6EDBF', () => { ctx.arc(46, hy - 165, 40, -1.9, 1.3); ctx.arc(62, hy - 175, 32, 1.3, -1.9, true); ctx.closePath(); }, 4);
  // ganga
  if (!SIL) { ctx.strokeStyle = '#BFE8FF'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, hy - 245); ctx.bezierCurveTo(-30 + Math.sin(t * 3) * 6, hy - 290, 30, hy - 300, 8, hy - 330 + Math.sin(t * 4) * 5); ctx.stroke(); }
  if (!SIL) {
    // tripundra
    ctx.strokeStyle = '#F7F7F7'; ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-34, hy - 46 + i * 9); ctx.lineTo(34, hy - 46 + i * 9); ctx.stroke(); }
    if (o.thirdEye) handGlow(ctx, 0, hy - 37, 70 * o.thirdEye, o.thirdEye, '255,120,40');
    shape(ctx, '#D9302C', () => ctx.ellipse(0, hy - 37, 6, 13, 0, 0, 7), 3);
  }
  eyes(ctx, 0, hy + 2, 26, 20, 11, o, '#1b1630');
  brows(ctx, 0, hy - 20, 26, 22, o.eyes === 'wide' ? -8 : 0, 4);
  if (!SIL) {
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, hy + 10); ctx.quadraticCurveTo(-6, hy + 30, 4, hy + 34); ctx.stroke();
    ctx.beginPath(); if (o.mouth === 'o') ctx.ellipse(0, hy + 52, 9, 12, 0, 0, 7); else ctx.arc(0, hy + 40, 16, 0.2 * Math.PI, 0.8 * Math.PI); ctx.lineWidth = 5; ctx.stroke();
  }
  ctx.restore();
  return { L: [x + hands.L[0] * s, y + hands.L[1] * s], R: [x + hands.R[0] * s, y + hands.R[1] * s], head: [x, y + hy * s] };
}

// ================= BHASMASUR =================
const BHAS = { skin: '#7E3B2C', l1: 155, l2: 145, w: 58 };
const DANCE = [
  [[-250, -930], [230, -560]],
  [[-235, -560], [250, -930]],
  [[-110, -1000], [110, -1000]],
  [[-260, -720], [260, -720]],
];
function bhasmasur(ctx, x, y, s, o = {}) {
  const t = o.t || 0; const seated = o.seated; const dy = seated ? 300 : 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s); if (o.rot) ctx.rotate(o.rot * D2R);
  const hy = -835 + dy;
  if (seated) {
    crossedLegs(ctx, BHAS.skin, '#B3202C', null, -175);
    ell(ctx, -60, -55, 42, 20, BHAS.skin, LW, -0.3); ell(ctx, 60, -55, 42, 20, BHAS.skin, LW, 0.3);
    shape(ctx, '#E8B21E', () => { ctx.moveTo(-190, -32); ctx.quadraticCurveTo(0, 8, 190, -32); ctx.lineTo(190, -18); ctx.quadraticCurveTo(0, 22, -190, -18); ctx.closePath(); }, 4);
  } else {
    const st = o.stance || 0; // leg spread for dance/lunge
    limb(ctx, [[-50, -470], [-58 - st, -70]], 64, BHAS.skin); limb(ctx, [[50, -470], [58 + st, -70]], 64, BHAS.skin);
    limb(ctx, [[-58 - st, -100], [-58 - st, -85]], 70, '#E8B21E'); limb(ctx, [[58 + st, -100], [58 + st, -85]], 70, '#E8B21E');
    ell(ctx, -72 - st, -35, 50, 24, BHAS.skin); ell(ctx, 72 + st, -35, 50, 24, BHAS.skin);
    shape(ctx, '#B3202C', () => { ctx.moveTo(-108, -510); ctx.lineTo(108, -510); ctx.lineTo(130 + st * 0.5, -290); ctx.quadraticCurveTo(0, -250, -130 - st * 0.5, -290); ctx.closePath(); });
    shape(ctx, '#E8B21E', () => { ctx.moveTo(-130 - st * 0.5, -290); ctx.quadraticCurveTo(0, -250, 130 + st * 0.5, -290); ctx.lineTo(128 + st * 0.5, -310); ctx.quadraticCurveTo(0, -272, -128 - st * 0.5, -310); ctx.closePath(); }, 4);
  }
  // torso
  shape(ctx, BHAS.skin, () => {
    ctx.moveTo(-138, -705 + dy); ctx.quadraticCurveTo(0, -745 + dy, 138, -705 + dy);
    ctx.quadraticCurveTo(135, -600 + dy, 100, -505 + dy); ctx.lineTo(-100, -505 + dy);
    ctx.quadraticCurveTo(-135, -600 + dy, -138, -705 + dy); ctx.closePath();
  });
  if (!SIL) { ctx.strokeStyle = '#4E2018'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-60, -620 + dy); ctx.quadraticCurveTo(-25, -600 + dy, -5, -625 + dy); ctx.moveTo(60, -620 + dy); ctx.quadraticCurveTo(25, -600 + dy, 5, -625 + dy); ctx.stroke(); }
  shape(ctx, '#E8B21E', () => ctx.rect(-106, -522 + dy, 212, 26), 5);
  // gold collar
  shape(ctx, '#E8B21E', () => { ctx.moveTo(-80, -718 + dy); ctx.quadraticCurveTo(0, -630 + dy, 80, -718 + dy); ctx.quadraticCurveTo(0, -670 + dy, -80, -718 + dy); ctx.closePath(); }, 5);
  if (!SIL) { ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(0, -668 + dy, 9, 0, 7); ctx.fill(); }
  shape(ctx, BHAS.skin, () => ctx.rect(-30, hy + 55, 60, 40), 0);
  // arms
  const pose = o.pose || 'rest';
  let P, pref = ['out', 'out'];
  if (pose === 'dance') { const k = DANCE[o.dstep % DANCE.length]; P = k; }
  else P = {
    rest: [[-160, -430], [160, -430]],
    namaste: [[-6, -620], [6, -620]],
    raise: [[-160, -430], [240, -1010]],
    raiseL: [[-240, -1010], [160, -430]],
    reachL: [[-380, -800], [175, -450]],
    head: [[-160, -430], [70, -955]],
    fist: [[-200, -760], [200, -760]],
    seatnam: [[-6, -620], [6, -620]],
  }[pose];
  if (pose === 'head') pref = ['out', 'out'];
  if (pose === 'namaste' || pose === 'seatnam') pref = ['down', 'down'];
  if (pose === 'fist') pref = ['down', 'down'];
  if (o.handR) P = [P[0], o.handR]; if (o.handPrefR) pref[1] = o.handPrefR;
  const SL = [-132, -690 + dy], SR = [132, -690 + dy];
  const hl = arm(ctx, SL, [P[0][0], P[0][1] + dy], BHAS, pref[0], { noHand: pose === 'namaste' || pose === 'seatnam' })[2];
  // head (drawn before right arm so head-touch hand sits on top)
  const drawHead = () => {
    // hair spikes
    shape(ctx, '#121010', () => {
      const n = 15;
      for (let i = 0; i <= n; i++) { const a = Math.PI * (1.0 + i / n) - 0.25 + 0.5 * i / n; const r = i % 2 ? 140 : 95; const px = Math.cos(a) * r, py = hy - 15 + Math.sin(a) * r * 0.95; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.lineTo(60, hy + 10); ctx.lineTo(-60, hy + 10); ctx.closePath();
    });
    for (const sx of [-1, 1]) shape(ctx, BHAS.skin, () => { ctx.moveTo(sx * 66, hy - 15); ctx.lineTo(sx * 100, hy - 35); ctx.lineTo(sx * 70, hy + 25); ctx.closePath(); }, 5);
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 74, hy + 40, 16, 0, 7); ctx.strokeStyle = C('#E8B21E'); ctx.lineWidth = 7; ctx.stroke(); }
    ell(ctx, 0, hy, 72, 82, BHAS.skin);
    // horns
    for (const sx of [-1, 1]) shape(ctx, '#EADFC2', () => { ctx.moveTo(sx * 30, hy - 72); ctx.quadraticCurveTo(sx * 55, hy - 135, sx * 92, hy - 150); ctx.quadraticCurveTo(sx * 70, hy - 110, sx * 58, hy - 62); ctx.closePath(); }, 5);
    // fringe
    shape(ctx, '#121010', () => { ctx.moveTo(-72, hy - 10); ctx.quadraticCurveTo(-70, hy - 85, 0, hy - 84); ctx.quadraticCurveTo(70, hy - 85, 72, hy - 10); ctx.lineTo(50, hy - 50); ctx.lineTo(30, hy - 40); ctx.lineTo(10, hy - 58); ctx.lineTo(-12, hy - 42); ctx.lineTo(-32, hy - 56); ctx.lineTo(-52, hy - 40); ctx.closePath(); });
    eyes(ctx, 0, hy - 2, 29, 22, 13, o, '#B01010');
    const ang = o.mouth === 'awe' ? -6 : 18;
    brows(ctx, 0, hy - 30, 30, 28, ang, 10, '#121010');
    if (!SIL) {
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.quadraticCurveTo(0, hy + 30, 10, hy + 22); ctx.stroke();
      const my = hy + 52; const m = o.mouth || 'grin';
      if (m === 'grin') {
        shape(ctx, '#3a0d0d', () => { ctx.moveTo(-36, my - 6); ctx.quadraticCurveTo(0, my + 30, 36, my - 6); ctx.quadraticCurveTo(0, my + 6, -36, my - 6); ctx.closePath(); }, 4);
        ctx.fillStyle = '#fff'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 22, my - 1); ctx.lineTo(sx * 14, my + 1); ctx.lineTo(sx * 18, my + 14); ctx.fill(); }
      } else if (m === 'awe' || m === 'scream') {
        const r = m === 'awe' ? 12 : 22;
        shape(ctx, '#3a0d0d', () => ctx.ellipse(0, my + 4, r, r * 1.2, 0, 0, 7), 4);
      } else {
        ctx.beginPath(); ctx.moveTo(-26, my); ctx.lineTo(26, my); ctx.lineWidth = 5; ctx.stroke();
        ctx.fillStyle = '#fff'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 18, my - 2); ctx.lineTo(sx * 10, my - 2); ctx.lineTo(sx * 14, my + 10); ctx.fill(); }
      }
    }
    // moustache
    shape(ctx, '#121010', () => { ctx.moveTo(0, hy + 30); ctx.quadraticCurveTo(-40, hy + 26, -58, hy + 50); ctx.quadraticCurveTo(-62, hy + 30, -76, hy + 22); ctx.quadraticCurveTo(-40, hy + 48, 0, hy + 40); ctx.quadraticCurveTo(40, hy + 48, 76, hy + 22); ctx.quadraticCurveTo(62, hy + 30, 58, hy + 50); ctx.quadraticCurveTo(40, hy + 26, 0, hy + 30); ctx.closePath(); }, 3);
  };
  drawHead();
  const hr = arm(ctx, SR, [P[1][0], P[1][1] + dy], BHAS, pref[1], { noHand: pose === 'namaste' || pose === 'seatnam' })[2];
  if (pose === 'namaste' || pose === 'seatnam') shape(ctx, BHAS.skin, () => { ctx.moveTo(0, -700 + dy); ctx.quadraticCurveTo(30, -640 + dy, 18, -590 + dy); ctx.lineTo(-18, -590 + dy); ctx.quadraticCurveTo(-30, -640 + dy, 0, -700 + dy); ctx.closePath(); });
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  const out = { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s] };
  if (o.glow) { const h = out[o.glowHand || 'R']; handGlow(ctx, h[0], h[1], 160 * s * (0.8 + 0.2 * Math.sin(t * 9)), o.glow, o.glowCol || '255,80,20'); }
  return out;
}

// ================= VISHNU =================
const VISH = { skin: '#3C5FAE', l1: 145, l2: 135, w: 42 };
function vishnu(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const hy = -830;
  if (o.halo) halo(ctx, 0, hy - 60, 200, t, o.halo);
  for (const sx of [-1, 1]) shape(ctx, '#15121F', () => { ctx.moveTo(sx * 50, hy - 20); ctx.quadraticCurveTo(sx * 120, hy + 60, sx * 105, hy + 170); ctx.lineTo(sx * 70, hy + 150); ctx.quadraticCurveTo(sx * 80, hy + 60, sx * 40, hy + 10); ctx.closePath(); });
  // back arms (4 arms) with chakra & shankh
  const BL = arm(ctx, [-100, -680], [-250, -900], VISH, 'down')[2];
  const BR = arm(ctx, [100, -680], [250, -900], VISH, 'down')[2];
  // legs
  limb(ctx, [[-40, -470], [-46, -70]], 52, VISH.skin); limb(ctx, [[40, -470], [46, -70]], 52, VISH.skin);
  ell(ctx, -58, -35, 44, 21, VISH.skin); ell(ctx, 58, -35, 44, 21, VISH.skin);
  const ph = () => { ctx.moveTo(-95, -515); ctx.lineTo(95, -515); ctx.quadraticCurveTo(130, -300, 110, -120); ctx.lineTo(-110, -120); ctx.quadraticCurveTo(-130, -300, -95, -515); ctx.closePath(); };
  shape(ctx, '#F4C431', ph);
  shape(ctx, '#C62828', () => ctx.rect(-112, -150, 224, 30), 5);
  shape(ctx, '#C62828', () => { ctx.moveTo(-20, -510); ctx.lineTo(20, -510); ctx.lineTo(30, -150); ctx.lineTo(-30, -150); ctx.closePath(); }, 5);
  shape(ctx, VISH.skin, () => { ctx.moveTo(-112, -700); ctx.quadraticCurveTo(0, -728, 112, -700); ctx.quadraticCurveTo(108, -600, 84, -505); ctx.lineTo(-84, -505); ctx.quadraticCurveTo(-108, -600, -112, -700); ctx.closePath(); });
  shape(ctx, '#E8B21E', () => ctx.rect(-96, -522, 192, 26), 5);
  // vaijayanti mala
  const fc = ['#FFFFFF', '#E53950', '#F4C431', '#4CAF50'];
  for (let i = 0; i <= 22; i++) { const a = i / 22; const px = -80 + a * 160, py = -705 + Math.sin(a * Math.PI) * 250; shape(ctx, fc[i % 4], () => ctx.arc(px, py, 11, 0, 7), 3); }
  shape(ctx, '#E8B21E', () => { ctx.moveTo(-70, -712); ctx.quadraticCurveTo(0, -640, 70, -712); ctx.quadraticCurveTo(0, -680, -70, -712); ctx.closePath(); }, 5);
  shape(ctx, VISH.skin, () => ctx.rect(-24, hy + 52, 48, 50), 0);
  const FL = arm(ctx, [-108, -690], [-140, -440], VISH, 'out')[2];
  const FR = arm(ctx, [108, -690], [175, -790], VISH, 'down')[2];
  // chakra
  ctx.save(); ctx.translate(BR[0], BR[1] - 70); ctx.rotate(t * 4);
  handGlow(ctx, 0, 0, 120, 0.6, '255,200,60');
  shape(ctx, '#F2C230', () => ctx.arc(0, 0, 58, 0, 7), 5);
  if (!SIL) { ctx.strokeStyle = '#9C6B00'; ctx.lineWidth = 5; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i * Math.PI / 6) * 50, Math.sin(i * Math.PI / 6) * 50); ctx.stroke(); } ctx.fillStyle = '#9C6B00'; for (let i = 0; i < 16; i++) { ctx.beginPath(); const a = i * Math.PI / 8; ctx.moveTo(Math.cos(a) * 56, Math.sin(a) * 56); ctx.lineTo(Math.cos(a + 0.12) * 74, Math.sin(a + 0.12) * 74); ctx.lineTo(Math.cos(a + 0.3) * 56, Math.sin(a + 0.3) * 56); ctx.fill(); } }
  ctx.restore();
  // shankh
  shape(ctx, '#F8F4EA', () => { ctx.moveTo(BL[0] - 10, BL[1] - 20); ctx.quadraticCurveTo(BL[0] - 60, BL[1] - 70, BL[0] - 20, BL[1] - 120); ctx.quadraticCurveTo(BL[0] + 30, BL[1] - 80, BL[0] + 14, BL[1] - 20); ctx.closePath(); }, 5);
  // head
  for (const sx of [-1, 1]) { ell(ctx, sx * 62, hy + 5, 13, 20, VISH.skin, 5); shape(ctx, '#E8B21E', () => { ctx.moveTo(sx * 62, hy + 25); ctx.lineTo(sx * 80, hy + 70); ctx.lineTo(sx * 44, hy + 70); ctx.closePath(); }, 4); }
  ell(ctx, 0, hy, 62, 74, VISH.skin);
  shape(ctx, '#15121F', () => { ctx.moveTo(-64, hy); ctx.quadraticCurveTo(-60, hy - 80, 0, hy - 80); ctx.quadraticCurveTo(60, hy - 80, 64, hy); ctx.quadraticCurveTo(40, hy - 50, 0, hy - 55); ctx.quadraticCurveTo(-40, hy - 50, -64, hy); ctx.closePath(); });
  // kirita crown
  shape(ctx, '#F2C230', () => { ctx.moveTo(-72, hy - 55); ctx.lineTo(72, hy - 55); ctx.lineTo(54, hy - 120); ctx.lineTo(34, hy - 240); ctx.lineTo(0, hy - 290); ctx.lineTo(-34, hy - 240); ctx.lineTo(-54, hy - 120); ctx.closePath(); });
  shape(ctx, '#F2C230', () => ctx.rect(-78, hy - 82, 156, 30), 5);
  if (!SIL) {
    ctx.strokeStyle = '#9C6B00'; ctx.lineWidth = 4; for (const yy of [hy - 140, hy - 200]) { ctx.beginPath(); ctx.moveTo(-48, yy); ctx.lineTo(48, yy); ctx.stroke(); }
    for (const [jx, jy, c] of [[0, hy - 67, '#C62828'], [-45, hy - 67, '#2E7D32'], [45, hy - 67, '#2E7D32'], [0, hy - 170, '#C62828'], [0, hy - 230, '#1565C0']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(jx, jy, 10, 0, 7); ctx.fill(); }
    // tilak
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-14, hy - 50); ctx.quadraticCurveTo(0, hy - 10, 14, hy - 50); ctx.stroke();
    ctx.strokeStyle = '#D32F2F'; ctx.beginPath(); ctx.moveTo(0, hy - 48); ctx.lineTo(0, hy - 22); ctx.stroke();
  }
  eyes(ctx, 0, hy + 4, 25, 20, 11, o, '#1b1630');
  brows(ctx, 0, hy - 18, 25, 21, 0, 4);
  if (!SIL) { ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, hy + 12); ctx.quadraticCurveTo(-6, hy + 30, 4, hy + 33); ctx.stroke(); ctx.beginPath(); ctx.arc(0, hy + 38, 16, 0.2 * Math.PI, 0.8 * Math.PI); ctx.lineWidth = 5; ctx.stroke(); }
  ctx.restore();
}

// ================= MOHINI =================
const MOH = { skin: '#E8B48C', l1: 135, l2: 125, w: 30, bangles: true };
function mohini(ctx, x, y, s, o = {}) {
  const t = o.t || 0; const sway = o.sway || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s); if (o.rot) ctx.rotate(o.rot * D2R);
  const hy = -840;
  // braid behind
  for (let i = 0; i < 9; i++) ell(ctx, -58 - i * 3 + Math.sin(t * 2 + i * 0.5) * i * 1.2, hy + 40 + i * 42, 24, 28, '#161214', 5);
  if (!SIL) { ctx.fillStyle = '#F5F5F5'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-50 + Math.cos(i) * 20, hy - 40 + Math.sin(i) * 20, 7, 0, 7); ctx.fill(); } }
  // feet
  ell(ctx, -40, -22, 34, 16, MOH.skin); ell(ctx, 40, -22, 34, 16, MOH.skin);
  // lehenga skirt
  const sk = () => { ctx.moveTo(-78, -520); ctx.lineTo(78, -520); ctx.quadraticCurveTo(170 + sway * 0.4, -300, 235 + sway, -45); ctx.quadraticCurveTo(0, -15, -235 + sway, -45); ctx.quadraticCurveTo(-170 + sway * 0.4, -300, -78, -520); ctx.closePath(); };
  shape(ctx, '#D8366A', sk);
  if (!SIL) {
    ctx.save(); ctx.beginPath(); sk(); ctx.clip();
    ctx.strokeStyle = '#E8B21E'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-250 + sway, -60); ctx.quadraticCurveTo(0, -30, 250 + sway, -60); ctx.stroke();
    ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-250 + sway, -110); ctx.quadraticCurveTo(0, -80, 250 + sway, -110); ctx.stroke();
    ctx.fillStyle = '#F6CF4A'; for (let i = 0; i < 40; i++) { const u = (i * 0.618) % 1, v = (i * 0.37) % 1; const yy = -480 + v * 340; const wd = 70 + (yy + 520) * 0.5; ctx.beginPath(); ctx.arc(-wd + u * 2 * wd + sway * (yy + 520) / 480, yy, 5, 0, 7); ctx.fill(); }
    ctx.restore(); ctx.beginPath(); sk(); ctx.strokeStyle = OUT; ctx.lineWidth = LW; ctx.stroke();
  }
  // midriff + choli
  shape(ctx, MOH.skin, () => { ctx.moveTo(-80, -620); ctx.lineTo(80, -620); ctx.lineTo(72, -515); ctx.lineTo(-72, -515); ctx.closePath(); });
  shape(ctx, '#8E1B4D', () => { ctx.moveTo(-90, -712); ctx.quadraticCurveTo(0, -735, 90, -712); ctx.lineTo(84, -612); ctx.quadraticCurveTo(0, -592, -84, -612); ctx.closePath(); });
  shape(ctx, '#E8B21E', () => { ctx.moveTo(-84, -615); ctx.quadraticCurveTo(0, -595, 84, -615); ctx.lineTo(84, -603); ctx.quadraticCurveTo(0, -583, -84, -603); ctx.closePath(); }, 3);
  shape(ctx, '#E8B21E', () => ctx.rect(-80, -530, 160, 16), 4);
  // dupatta
  shape(ctx, '#F39A2B', () => { ctx.moveTo(-85, -712); ctx.lineTo(-50, -712); ctx.lineTo(85, -525); ctx.quadraticCurveTo(140 + Math.sin(t * 2) * 15, -400, 120 + Math.sin(t * 2) * 25, -300); ctx.lineTo(90, -310); ctx.quadraticCurveTo(100, -420, 55, -515); ctx.closePath(); }, 5);
  shape(ctx, MOH.skin, () => ctx.rect(-20, hy + 55, 40, 45), 0);
  shape(ctx, '#E8B21E', () => { ctx.moveTo(-50, -730); ctx.quadraticCurveTo(0, -660, 50, -730); ctx.quadraticCurveTo(0, -690, -50, -730); ctx.closePath(); }, 4);
  // arms
  const pose = o.pose || 'rest';
  let P = { rest: [[-120, -460], [120, -460]], grace: [[-200, -760], [125, -470]], head: [[-120, -460], [50, -960]] }[pose];
  let pref = ['out', 'out'];
  if (pose === 'dance') P = DANCE[o.dstep % DANCE.length].map(p => [p[0] * 0.85, -700 + (p[1] + 690) * 0.85]);
  if (pose === 'head') pref = ['out', 'out'];
  if (o.handR) { P = [P[0], o.handR]; pref[1] = o.handPrefR || 'up'; }
  const hl = arm(ctx, [-86, -695], P[0], MOH, pref[0])[2];
  // head
  for (const sx of [-1, 1]) { ell(ctx, sx * 55, hy + 8, 11, 18, MOH.skin, 4); shape(ctx, '#E8B21E', () => { ctx.moveTo(sx * 56, hy + 22); ctx.quadraticCurveTo(sx * 75, hy + 60, sx * 56, hy + 68); ctx.quadraticCurveTo(sx * 37, hy + 60, sx * 56, hy + 22); ctx.closePath(); }, 4); }
  ell(ctx, 0, hy, 56, 68, MOH.skin);
  shape(ctx, '#161214', () => { ctx.moveTo(-60, hy + 15); ctx.quadraticCurveTo(-70, hy - 85, 0, hy - 82); ctx.quadraticCurveTo(70, hy - 85, 60, hy + 15); ctx.quadraticCurveTo(52, hy - 40, 8, hy - 52); ctx.lineTo(0, hy - 45); ctx.lineTo(-8, hy - 52); ctx.quadraticCurveTo(-52, hy - 40, -60, hy + 15); ctx.closePath(); });
  if (!SIL) {
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, hy - 80); ctx.lineTo(0, hy - 48); ctx.stroke(); // sindoor parting
    ctx.strokeStyle = '#E8B21E'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, hy - 82); ctx.lineTo(0, hy - 46); ctx.stroke();
    shape(ctx, '#E8B21E', () => ctx.arc(0, hy - 40, 9, 0, 7), 3);
    ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(0, hy - 20, 6, 0, 7); ctx.fill();
  }
  eyes(ctx, 0, hy + 4, 23, 19, 11, Object.assign({ kajal: true }, o), '#2a1a12');
  brows(ctx, 0, hy - 18, 23, 19, -4, 3.5);
  if (!SIL) {
    ctx.strokeStyle = OUT; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(0, hy + 12); ctx.quadraticCurveTo(-5, hy + 26, 3, hy + 28); ctx.stroke();
    ctx.strokeStyle = '#E8B21E'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(10, hy + 30, 7, -0.5, 3.5); ctx.stroke();
    shape(ctx, '#C2185B', () => { ctx.moveTo(-14, hy + 40); ctx.quadraticCurveTo(0, hy + 34, 14, hy + 40); ctx.quadraticCurveTo(0, hy + 52, -14, hy + 40); ctx.closePath(); }, 3);
  }
  const hr = arm(ctx, [86, -695], P[1], MOH, pref[1])[2];
  ctx.restore();
  const fx = o.flip ? -1 : 1;
  return { L: [x + hl[0] * s * fx, y + hl[1] * s], R: [x + hr[0] * s * fx, y + hr[1] * s], head: [x, y + hy * s] };
}

module.exports = { shiva, bhasmasur, vishnu, mohini, shape, ell, limb, handGlow, halo, setSil: (c) => { SIL = c; }, OUT, LW, DANCE };
