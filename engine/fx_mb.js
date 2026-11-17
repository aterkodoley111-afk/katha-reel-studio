// Reusable scenery/props for Mahabharata stories (river, palace, hut, crowds, arrows, gold thread, Om).
const F = require('./fx');
const ch = require('./chars');
const m = require('./chars_mb');
const { W, H, rng, clamp, ease, lerp, ramp, glow, shape, limb, handGlow } = F;

function river(ctx, y, t, c1 = '#1B2A5C', c2 = '#0B1230', hl = 'rgba(190,210,255,0.35)', reflect = null) {
  const g = ctx.createLinearGradient(0, y, 0, H + 200); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, H + 600 - y);
  if (reflect) { const [rx, rc] = reflect; for (let i = 0; i < 14; i++) { const yy = y + 20 + i * 26, w = 140 - i * 6 + Math.sin(t * 2 + i) * 20; ctx.fillStyle = rc; ctx.globalAlpha = 0.5 - i * 0.03; ctx.fillRect(rx - w / 2 + Math.sin(t * 1.5 + i) * 10, yy, w, 6); } ctx.globalAlpha = 1; }
  const r = rng(17); ctx.strokeStyle = hl; ctx.lineCap = 'round';
  for (let i = 0; i < 40; i++) {
    const yy = y + 15 + Math.pow(r(), 1.4) * (H - y + 100), len = 40 + (yy - y) * 0.18, sp = 25 + (yy - y) * 0.06;
    const x = ((r() * (W + 600) + t * sp) % (W + 600)) - 300;
    ctx.lineWidth = 3 + (yy - y) * 0.008; ctx.beginPath(); ctx.moveTo(x, yy); ctx.quadraticCurveTo(x + len / 2, yy - 6, x + len, yy); ctx.stroke();
  }
}
function lotusPad(ctx, x, y, s, flower) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * 0.45);
  shape(ctx, '#2E7D4F', () => { ctx.arc(0, 0, 70, 0.25, Math.PI * 2 - 0.25); ctx.lineTo(0, 0); ctx.closePath(); }, 5);
  ctx.restore();
  if (flower) m.lotus(ctx, x + 10 * s, y - 6 * s, 0.55 * s);
}
function reeds(ctx, x, y, s, t, col = '#1E3524') {
  ctx.strokeStyle = col; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const dx = (i - 4) * 14 * s, h = (160 + (i * 37) % 90) * s, sw = Math.sin(t * 1.3 + i) * 10 * s; ctx.lineWidth = 7 * s; ctx.beginPath(); ctx.moveTo(x + dx, y); ctx.quadraticCurveTo(x + dx + sw * 0.5, y - h * 0.6, x + dx + sw, y - h); ctx.stroke(); }
}
function palace(ctx, t, wall = '#B5763A', arch = '#6B2F1A', floor = '#7A4A26') {
  ctx.fillStyle = wall; ctx.fillRect(-400, -400, W + 800, H + 800);
  // big scalloped arches
  for (const ax of [-160, 540, 1240]) {
    shape(ctx, arch, () => { ctx.moveTo(ax - 260, 1700); ctx.lineTo(ax - 260, 900); ctx.quadraticCurveTo(ax - 260, 600, ax, 560); ctx.quadraticCurveTo(ax + 260, 600, ax + 260, 900); ctx.lineTo(ax + 260, 1700); ctx.closePath(); }, 7);
  }
  for (const px of [190, 890]) { shape(ctx, '#9E2A22', () => ctx.rect(px - 45, 560, 90, 1200), 6); shape(ctx, '#E8B21E', () => ctx.rect(px - 60, 540, 120, 40), 5); shape(ctx, '#E8B21E', () => ctx.rect(px - 60, 1700, 120, 40), 5); }
  ctx.fillStyle = floor; ctx.fillRect(-400, 1700, W + 800, 900);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 4; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 60, 1700); ctx.lineTo(540 + i * 260, 2000); ctx.stroke(); }
  shape(ctx, '#9E2A22', () => { ctx.moveTo(-400, 500); ctx.lineTo(W + 400, 500); ctx.lineTo(W + 400, 550); ctx.lineTo(-400, 550); ctx.closePath(); }, 6);
}
function hut(ctx, t) {
  ctx.fillStyle = '#5A3418'; ctx.fillRect(-400, -400, W + 800, H + 800);
  // mud wall with window
  shape(ctx, '#B98250', () => ctx.rect(-400, 640, W + 800, 1110), 0);
  ctx.strokeStyle = 'rgba(90,50,20,0.35)'; ctx.lineWidth = 5; const r = rng(3); for (let i = 0; i < 30; i++) { const x = r() * W, y = 720 + r() * 950; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40 + r() * 40, y + (r() - 0.5) * 10); ctx.stroke(); }
  // thatch beams
  for (let i = 0; i < 8; i++) limb(ctx, [[-200 + i * 200, 540], [-120 + i * 200, 720]], 20, '#7A5230');
  shape(ctx, '#C9A34A', () => { ctx.moveTo(-400, 480); ctx.lineTo(W + 400, 480); ctx.lineTo(W + 400, 660); ctx.quadraticCurveTo(540, 610, -400, 660); ctx.closePath(); }, 6);
  ctx.fillStyle = '#6B4226'; ctx.fillRect(-400, 1720, W + 800, 900);
  // rangoli dots on floor edge
  for (let i = 0; i < 12; i++) shape(ctx, ['#FFFFFF', '#E53950', '#FFC107'][i % 3], () => ctx.arc(60 + i * 88, 1760, 10, 0, 7), 3);
}
// silhouette crowd of people around a centre; side -1 left, 1 right
function crowd(ctx, t, n, y, s, side, opts = {}) {
  const r = rng(opts.seed || 5); ch.setSil(opts.col || '#0b0710');
  for (let i = 0; i < n; i++) {
    const x = side < 0 ? 40 + i * 150 * s + r() * 30 : W - 40 - i * 150 * s - r() * 30;
    const yy = y + (i % 2) * 40 + Math.sin(t * 1.5 + i) * 4, ss = s * (0.9 + r() * 0.2);
    const pose = opts.whisper ? 'whisper' : (i % 2 === 0 ? 'point' : 'rest');
    if (r() > 0.5 || opts.allMen) m.adhiratha(ctx, x, yy, ss, { t, pose, flip: side > 0, eyes: 'glow' });
    else m.radha(ctx, x, yy, ss * 0.95, { t, pose: opts.whisper ? 'heart' : 'rest', flip: side > 0, eyes: 'glow' });
  }
  ch.setSil(null);
}
function arrow(ctx, x, y, ang, len = 220, col = '#D7C49E') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.strokeStyle = '#140c0c'; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-len, 0); ctx.lineTo(0, 0); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
  shape(ctx, '#C9CED6', () => { ctx.moveTo(30, 0); ctx.lineTo(-12, -14); ctx.lineTo(-12, 14); ctx.closePath(); }, 4);
  shape(ctx, '#D84315', () => { ctx.moveTo(-len, 0); ctx.lineTo(-len + 40, -18); ctx.lineTo(-len + 50, 0); ctx.lineTo(-len + 40, 18); ctx.closePath(); }, 3);
  ctx.restore();
}
function sparks(ctx, x, y, k, seed = 1, col = '255,210,90') {
  if (k <= 0 || k >= 1) return; const r = rng(seed);
  for (let i = 0; i < 22; i++) { const a = r() * Math.PI * 2, d = (60 + r() * 220) * ease(k); ctx.fillStyle = `rgba(${col},${1 - k})`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d + k * k * 120, 5 + r() * 6, 0, 7); ctx.fill(); }
  glow(ctx, x, y, 200 * (1 - k * 0.5), col, 0.8 * (1 - k));
}
function goldThread(ctx, a, b, t, k = 1, w = 10) {
  if (k <= 0) return;
  const mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - 160 + Math.sin(t * 2) * 20;
  const pts = []; for (let i = 0; i <= 40 * k; i++) { const u = i / 40; pts.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * my + u * u * b[1] + Math.sin(u * 12 + t * 4) * 8]); }
  if (pts.length < 2) return;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [lw, c] of [[w * 3.5, 'rgba(255,200,60,0.25)'], [w, 'rgba(255,214,90,0.95)'], [w * 0.35, 'rgba(255,255,230,1)']]) { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
  const e = pts[pts.length - 1]; glow(ctx, e[0], e[1], 80, '255,220,120', 0.8);
}
function om(ctx, x, y, size, a, t = 0) {
  if (a <= 0) return;
  glow(ctx, x, y, size * 1.6, '255,200,80', 0.6 * a);
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.font = `${size}px "Rozha One"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = size * 0.08; ctx.strokeStyle = '#7A3A00'; ctx.strokeText('ॐ', x, y); ctx.fillStyle = '#FFD54F'; ctx.fillText('ॐ', x, y); ctx.restore();
}
function haloRing(ctx, cx, cy, R, t, a) {
  if (a <= 0) return;
  for (let i = 0; i < 7; i++) { const ang = Math.PI + (i / 6) * Math.PI; const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R * 0.55; ctx.save(); ctx.globalAlpha = a * (0.6 + 0.4 * Math.sin(t * 2 + i)); ch.halo(ctx, x, y, 48, t + i, 1); ctx.restore(); }
}
function dust(ctx, t, y, col = '200,140,90', n = 10, seed = 3) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = ((r() * (W + 600) + t * (30 + r() * 40)) % (W + 600)) - 300, yy = y + r() * 300, rr = 120 + r() * 200; glow(ctx, x, yy, rr, col, 0.35); }
}
function flag(ctx, x, y, h, t, col = '#C62828') {
  limb(ctx, [[x, y], [x, y - h]], 10, '#5A3A1A');
  shape(ctx, col, () => { ctx.moveTo(x, y - h); for (let i = 0; i <= 6; i++) ctx.lineTo(x + i * 22, y - h + 20 + Math.sin(t * 6 + i) * 8 * i / 6 - i * 2); ctx.lineTo(x + 132, y - h + 60); for (let i = 6; i >= 0; i--) ctx.lineTo(x + i * 22, y - h + 70 + Math.sin(t * 6 + i) * 8 * i / 6 - i * 2); ctx.closePath(); }, 4);
}
function sunDisk(ctx, x, y, r, col1 = '#FFD54F', col2 = '255,170,60') {
  glow(ctx, x, y, r * 3, col2, 0.55); ctx.fillStyle = col1; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
function windowArch(ctx, x, y, w, h, inner) {
  shape(ctx, '#3A1E10', () => { ctx.moveTo(x - w / 2 - 30, y + h); ctx.lineTo(x - w / 2 - 30, y); ctx.quadraticCurveTo(x, y - w * 0.8, x + w / 2 + 30, y); ctx.lineTo(x + w / 2 + 30, y + h); ctx.closePath(); }, 7);
  ctx.save(); ctx.beginPath(); ctx.moveTo(x - w / 2, y + h - 20); ctx.lineTo(x - w / 2, y); ctx.quadraticCurveTo(x, y - w * 0.7, x + w / 2, y); ctx.lineTo(x + w / 2, y + h - 20); ctx.closePath(); ctx.clip(); inner(); ctx.restore();
}

module.exports = { river, lotusPad, reeds, palace, hut, crowd, arrow, sparks, goldThread, om, haloRing, dust, flag, sunDisk, windowArch };

// ---------- v3 (Ashwatthama) additions ----------
const { glow: _glow, flame: _flame, rng: _rng } = require('./fx');
// divine weapon streak: tail -> head, glowing head. col = 'r,g,b'
function astra(ctx, x0, y0, x1, y1, t, col = '255,80,40', core = '#FFF3E0', w = 26) {
  const ang = Math.atan2(y1 - y0, x1 - x0);
  _glow(ctx, x1, y1, 230, col, 0.8);
  ctx.lineCap = 'round';
  for (const [lw, c] of [[w * 2.6, `rgba(${col},0.25)`], [w * 1.4, `rgba(${col},0.75)`], [w * 0.55, core]]) { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  ctx.save(); ctx.translate(x1, y1); ctx.rotate(ang);
  ctx.fillStyle = core; ctx.beginPath(); ctx.moveTo(70, 0); ctx.lineTo(-10, -26); ctx.lineTo(4, 0); ctx.lineTo(-10, 26); ctx.closePath(); ctx.fill();
  ctx.restore();
  // crackle
  ctx.strokeStyle = `rgba(${col},0.9)`; ctx.lineWidth = 4; const r = _rng(Math.floor(t * 20));
  for (let i = 0; i < 4; i++) { ctx.beginPath(); let px = x1, py = y1; ctx.moveTo(px, py); for (let k = 0; k < 4; k++) { px += (r() - 0.5) * 120 - Math.cos(ang) * 40; py += (r() - 0.5) * 120 - Math.sin(ang) * 40; ctx.lineTo(px, py); } ctx.stroke(); }
}
// point on a quadratic bezier
function qpt(a, c, b, u) { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; }
function lightning(ctx, x, y, len, seed, a = 1, col = '255,90,60') {
  if (a <= 0) return; const r = _rng(seed); ctx.lineCap = 'round';
  for (const [lw, c] of [[16, `rgba(${col},${0.35 * a})`], [5, `rgba(255,240,230,${a})`]]) {
    const r2 = _rng(seed); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); let px = x, py = y; ctx.moveTo(px, py);
    for (let k = 0; k < 9; k++) { px += (r2() - 0.5) * 160; py += len / 9; ctx.lineTo(px, py); } ctx.stroke();
  }
}
function smoke(ctx, t, y, n = 8, seed = 4, col = '60,40,50', a = 0.35) {
  const r = _rng(seed);
  for (let i = 0; i < n; i++) { const x0 = r() * 1400 - 160, sp = 15 + r() * 30, rr = 160 + r() * 220; const x = ((x0 + t * sp) % 1500) - 200; ctx.fillStyle = `rgba(${col},${a * (0.6 + 0.4 * Math.sin(t + i))})`; ctx.beginPath(); ctx.arc(x, y - r() * 300, rr, 0, 7); ctx.fill(); }
}
function fog(ctx, t, y, a = 0.5, col = '170,175,200') {
  for (let i = 0; i < 7; i++) { const x = ((i * 260 + t * (20 + i * 6)) % 1700) - 300; const g = ctx.createRadialGradient(x, y + (i % 3) * 60, 20, x, y + (i % 3) * 60, 420); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - 420, y - 400, 840, 900); }
}
// arrow stuck in the ground
function stuckArrow(ctx, x, y, ang = -0.3, len = 160) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.strokeStyle = '#140c0c'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len); ctx.stroke();
  ctx.strokeStyle = '#B9A47C'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#7A1F2B'; ctx.beginPath(); ctx.moveTo(0, -len); ctx.lineTo(-14, -len + 8); ctx.lineTo(-14, -len + 40); ctx.lineTo(0, -len + 30); ctx.lineTo(14, -len + 40); ctx.lineTo(14, -len + 8); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// ring of fire (ellipse) around a centre; a = intensity
function fireRing(ctx, cx, cy, rx, ry, t, a = 1, n = 14, part = 'all') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, a);
  if (part !== 'front') _glow(ctx, cx, cy - 200, rx * 1.6, '255,90,20', 0.45 * a);
  const pts = []; for (let i = 0; i < n; i++) { const ang = i / n * Math.PI * 2; pts.push([cx + Math.cos(ang) * rx, cy + Math.sin(ang) * ry, Math.sin(ang)]); }
  pts.sort((p, q) => p[2] - q[2]);
  for (const [i, p] of pts.entries()) if (part === 'all' || (part === 'back') === (p[2] < 0)) _flame(ctx, p[0], p[1], 0.55 + 0.25 * (p[2] + 1) / 2, t, 10 + i);
  ctx.restore();
}
// tent interior
function tent(ctx, t, light = 1) {
  ctx.fillStyle = '#1A1630'; ctx.fillRect(-400, -400, W + 800, H + 800);
  const wall = () => { ctx.moveTo(-400, 1650); ctx.lineTo(-400, 700); ctx.lineTo(540, 420); ctx.lineTo(1480, 700); ctx.lineTo(1480, 1650); ctx.closePath(); };
  ctx.beginPath(); wall(); ctx.fillStyle = '#3B2F45'; ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 6; for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(540, 420); ctx.lineTo(540 + i * 260, 1650); ctx.stroke(); }
  ctx.strokeStyle = '#140c0c'; ctx.lineWidth = 28; ctx.beginPath(); ctx.moveTo(540, 420); ctx.lineTo(540, 1650); ctx.stroke(); ctx.strokeStyle = '#5B3A1E'; ctx.lineWidth = 16; ctx.stroke();
  ctx.fillStyle = '#2A1E1A'; ctx.fillRect(-400, 1650, W + 800, 900);
  if (light < 1) { ctx.fillStyle = `rgba(4,3,10,${0.82 * (1 - light)})`; ctx.fillRect(-400, -400, W + 800, H + 800); }
}
// sleeping shape under a blanket (no face): x,y = bottom centre
function sleeper(ctx, x, y, s, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const sh = (fill, b) => { ctx.beginPath(); b(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = '#140c0c'; ctx.lineWidth = 6; ctx.stroke(); };
  sh('#E8E0CC', () => ctx.ellipse(-150, -30, 60, 30, 0, 0, 7));
  sh('#15100E', () => ctx.ellipse(-140, -62, 46, 40, 0, 0, 7));
  sh(col, () => { ctx.moveTo(-110, 0); ctx.quadraticCurveTo(-100, -110, 0, -100); ctx.quadraticCurveTo(140, -95, 170, 0); ctx.closePath(); });
  ctx.restore();
}
module.exports.astra = astra; module.exports.qpt = qpt; module.exports.lightning = lightning; module.exports.smoke = smoke; module.exports.fog = fog;
module.exports.stuckArrow = stuckArrow; module.exports.fireRing = fireRing; module.exports.tent = tent; module.exports.sleeper = sleeper;
