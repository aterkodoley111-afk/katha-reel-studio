const ch = require('./chars');
const { shiva, bhasmasur, vishnu, mohini, shape, ell, limb, handGlow } = ch;
const W = 1080, H = 1920;

// ---------- utils ----------
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (v) => { v = clamp(v); return v * v * (3 - 2 * v); };
const lerp = (a, b, t) => a + (b - a) * t;
const ramp = (t, a, b) => clamp((t - a) / (b - a));

// ---------- backgrounds & fx ----------
function sky(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, -300, 0, H + 300); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, H + 800);
}
function radialBg(ctx, inner, outer, cx = W / 2, cy = H * 0.45) {
  const g = ctx.createRadialGradient(cx, cy, 50, cx, cy, 1300); g.addColorStop(0, inner); g.addColorStop(1, outer);
  ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, H + 800);
}
function stars(ctx, t, n = 90, seed = 7, ymax = 1200) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r() * (W + 400) - 200, y = r() * ymax - 200, s = 1.5 + r() * 3, ph = r() * 6;
    ctx.fillStyle = `rgba(255,250,230,${0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2.2 + ph))})`;
    ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
  }
}
function moon(ctx, x, y, r, col = '#F3ECD2') {
  const g = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 2.6);
  g.addColorStop(0, 'rgba(243,236,210,0.35)'); g.addColorStop(1, 'rgba(243,236,210,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, 7); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(200,190,160,0.35)';
  for (const [dx, dy, rr] of [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.12], [-0.05, 0.35, 0.1]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, rr * r, 0, 7); ctx.fill(); }
}
function tree(ctx, x, y, s, col = '#07060c', seed = 3) {
  const r = rng(seed);
  ctx.strokeStyle = col; ctx.lineCap = 'round';
  const br = (x0, y0, a, len, w, d) => {
    const x1 = x0 + Math.sin(a) * len, y1 = y0 - Math.cos(a) * len;
    ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    if (d > 0) { const n = 2 + (r() > 0.6 ? 1 : 0); for (let i = 0; i < n; i++) br(x1, y1, a + (r() - 0.5) * 1.3, len * (0.62 + r() * 0.15), w * 0.65, d - 1); }
  };
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); br(0, 0, -0.05, 260, 46, 6); ctx.restore();
}
function hills(ctx, y, col, amp, seed, freq = 1) {
  const r = rng(seed); const ph = [r() * 6, r() * 6, r() * 6];
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-400, H + 400);
  for (let x = -400; x <= W + 400; x += 20) ctx.lineTo(x, y - amp * (0.6 * Math.sin(x / 260 * freq + ph[0]) + 0.3 * Math.sin(x / 110 * freq + ph[1]) + 0.2 * Math.sin(x / 47 + ph[2])));
  ctx.lineTo(W + 400, H + 400); ctx.closePath(); ctx.fill();
}
function earth(ctx, y, col = '#4A2C1C', crack = '#1e0f08', seed = 11) {
  ctx.fillStyle = col; ctx.fillRect(-400, y, W + 800, H + 400 - y);
  const r = rng(seed); ctx.strokeStyle = crack; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    let x = r() * (W + 400) - 200, yy = y + 20 + r() * (H - y + 100); ctx.beginPath(); ctx.moveTo(x, yy);
    for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 120; yy += (r() - 0.3) * 40; ctx.lineTo(x, yy); } ctx.stroke();
  }
}
function crow(ctx, x, y, s, flap) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#060508';
  const f = Math.sin(flap) * 18;
  ctx.beginPath(); ctx.moveTo(-40, -f); ctx.quadraticCurveTo(-18, -10, 0, 4); ctx.quadraticCurveTo(18, -10, 40, -f);
  ctx.quadraticCurveTo(18, 2, 0, 14); ctx.quadraticCurveTo(-18, 2, -40, -f); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 8, 9, 7, 0, 0, 7); ctx.fill(); ctx.restore();
}
function crows(ctx, t, n, y0, speed = 160, seed = 5, s = 1) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const off = r() * 900, yy = y0 + r() * 260; const x = ((t * speed + off) % (W + 500)) - 250; crow(ctx, x, yy + Math.sin(t * 2 + i) * 10, s * (0.7 + r() * 0.6), t * 9 + i); }
}
function clouds(ctx, t, y, col, n = 4, seed = 9, speed = 18, sc = 1) {
  const r = rng(seed); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const w = (200 + r() * 220) * sc, x = ((r() * (W + 800) + t * speed * (0.6 + r())) % (W + 800)) - 400, yy = y + r() * 300;
    ctx.beginPath(); ctx.ellipse(x, yy, w, w * 0.22, 0, 0, 7); ctx.ellipse(x - w * 0.35, yy - w * 0.12, w * 0.4, w * 0.2, 0, 0, 7); ctx.ellipse(x + w * 0.25, yy - w * 0.16, w * 0.45, w * 0.24, 0, 0, 7); ctx.fill();
  }
}
function embers(ctx, t, n = 50, seed = 21, col = '255,150,50', x0 = 0, x1 = W, ybot = H + 50, speed = 120) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0), sp = speed * (0.5 + r()), ph = r() * 3000, sz = 2 + r() * 5;
    const y = ybot - ((t * sp + ph) % 1700); const wob = Math.sin(t * 2 + i) * 20;
    ctx.fillStyle = `rgba(${col},${0.4 + 0.6 * Math.abs(Math.sin(t * 5 + i))})`; ctx.beginPath(); ctx.arc(x + wob, y, sz, 0, 7); ctx.fill();
  }
}
function petals(ctx, t, n = 30, seed = 31, cols = ['#F48FB1', '#FFB74D', '#FFF59D']) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r() * (W + 200) - 100, sp = 90 + r() * 120, ph = r() * 2400;
    const y = ((t * sp + ph) % 2300) - 250, rot = t * 2 + i;
    ctx.save(); ctx.translate(x + Math.sin(t * 1.5 + i) * 50, y); ctx.rotate(rot);
    ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.ellipse(0, 0, 14, 7, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(20,12,12,0.6)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }
}
function godRays(ctx, x, y, t, a = 0.5, col = '255,230,150', n = 14, len = 2200) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.08);
  for (let i = 0; i < n; i++) {
    const ang = i / n * Math.PI * 2; ctx.fillStyle = `rgba(${col},${a * (0.5 + 0.5 * Math.sin(t * 1.5 + i * 1.7))})`;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang - 0.07) * len, Math.sin(ang - 0.07) * len); ctx.lineTo(Math.cos(ang + 0.07) * len, Math.sin(ang + 0.07) * len); ctx.fill();
  }
  ctx.restore();
}
function glow(ctx, x, y, r, col, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
function diya(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const fl = Math.sin(t * 13) * 0.08 + Math.sin(t * 7.3) * 0.06;
  glow(ctx, 0, -70, 320, '255,170,60', 0.45 + fl);
  shape(ctx, '#B4532A', () => { ctx.moveTo(-90, -30); ctx.quadraticCurveTo(0, 60, 90, -30); ctx.quadraticCurveTo(110, -40, 120, -55); ctx.lineTo(70, -40); ctx.quadraticCurveTo(0, -20, -90, -30); ctx.closePath(); }, 6);
  shape(ctx, '#E8B21E', () => { ctx.moveTo(-80, -26); ctx.quadraticCurveTo(0, 10, 80, -26); ctx.lineTo(80, -18); ctx.quadraticCurveTo(0, 18, -80, -18); ctx.closePath(); }, 3);
  ctx.save(); ctx.translate(0, -40); ctx.scale(1 + fl, 1 - fl * 0.5); ctx.rotate(Math.sin(t * 5) * 0.06);
  ctx.fillStyle = '#FF7A1A'; ctx.beginPath(); ctx.moveTo(0, -110); ctx.quadraticCurveTo(38, -30, 0, 0); ctx.quadraticCurveTo(-38, -30, 0, -110); ctx.fill();
  ctx.fillStyle = '#FFD54F'; ctx.beginPath(); ctx.moveTo(0, -80); ctx.quadraticCurveTo(22, -22, 0, 0); ctx.quadraticCurveTo(-22, -22, 0, -80); ctx.fill();
  ctx.fillStyle = '#FFFBE6'; ctx.beginPath(); ctx.ellipse(0, -16, 7, 14, 0, 0, 7); ctx.fill();
  ctx.restore(); ctx.restore();
}
function flame(ctx, x, y, s, t, seed = 1) {
  const r = rng(seed);
  for (const [col, k] of [['#C62828', 1], ['#FF6F00', 0.75], ['#FFC107', 0.5], ['#FFF8E1', 0.25]]) {
    ctx.fillStyle = col;
    for (let i = 0; i < 5; i++) {
      const ox = (r() - 0.5) * 160 * s * k, h = (220 + r() * 160) * s * k * (1 + 0.2 * Math.sin(t * 11 + i * 2)), w = 70 * s * k;
      ctx.beginPath(); ctx.moveTo(x + ox - w, y); ctx.quadraticCurveTo(x + ox - w * 0.8, y - h * 0.5, x + ox + Math.sin(t * 8 + i) * 25 * s, y - h);
      ctx.quadraticCurveTo(x + ox + w * 0.8, y - h * 0.5, x + ox + w, y); ctx.closePath(); ctx.fill();
    }
  }
}
function ashPile(ctx, x, y, s, t, smoke = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, '#6E6A70', () => { ctx.moveTo(-230, 0); ctx.quadraticCurveTo(-150, -90, -40, -110); ctx.quadraticCurveTo(60, -130, 130, -70); ctx.quadraticCurveTo(200, -30, 240, 0); ctx.closePath(); }, 6);
  shape(ctx, '#8E8A90', () => { ctx.moveTo(-120, -40); ctx.quadraticCurveTo(-40, -110, 60, -80); ctx.quadraticCurveTo(10, -50, -120, -40); ctx.closePath(); }, 0);
  glow(ctx, 0, -40, 140, '255,90,20', 0.35 + 0.1 * Math.sin(t * 6));
  ctx.fillStyle = '#FF6F00'; const r = rng(4); for (let i = 0; i < 9; i++) { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 7 + i); ctx.beginPath(); ctx.arc((r() - 0.5) * 300, -10 - r() * 80, 5, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
  if (smoke) for (let i = 0; i < 6; i++) { const ph = (t * 0.35 + i / 6) % 1; ctx.fillStyle = `rgba(150,145,155,${0.35 * (1 - ph) * smoke})`; ctx.beginPath(); ctx.arc(Math.sin(i * 2 + t) * 40 + ph * 60, -120 - ph * 600, 50 + ph * 120, 0, 7); ctx.fill(); }
  ctx.restore();
}
function kailash(ctx, y, s = 1) {
  ctx.fillStyle = '#2B3566'; ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(120, y - 520 * s); ctx.lineTo(300, y - 380 * s); ctx.lineTo(540, y - 760 * s); ctx.lineTo(820, y - 420 * s); ctx.lineTo(1000, y - 560 * s); ctx.lineTo(1500, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#DDE6F5'; ctx.beginPath(); ctx.moveTo(540, y - 760 * s); ctx.lineTo(650, y - 625 * s); ctx.lineTo(590, y - 640 * s); ctx.lineTo(540, y - 590 * s); ctx.lineTo(490, y - 650 * s); ctx.lineTo(440, y - 625 * s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(120, y - 520 * s); ctx.lineTo(200, y - 440 * s); ctx.lineTo(120, y - 455 * s); ctx.lineTo(60, y - 440 * s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(1000, y - 560 * s); ctx.lineTo(1070, y - 480 * s); ctx.lineTo(1000, y - 495 * s); ctx.lineTo(940, y - 470 * s); ctx.closePath(); ctx.fill();
}
function shivling(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, '#2C2A35', () => { ctx.moveTo(-170, 0); ctx.lineTo(170, 0); ctx.lineTo(150, -60); ctx.lineTo(260, -80); ctx.lineTo(250, -110); ctx.lineTo(-160, -110); ctx.quadraticCurveTo(-200, -60, -170, 0); ctx.closePath(); });
  shape(ctx, '#2C2A35', () => { ctx.moveTo(-80, -110); ctx.lineTo(-80, -260); ctx.quadraticCurveTo(-80, -360, 0, -360); ctx.quadraticCurveTo(80, -360, 80, -260); ctx.lineTo(80, -110); ctx.closePath(); });
  ctx.strokeStyle = '#F2F2F2'; ctx.lineWidth = 7; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-60, -290 + i * 20); ctx.lineTo(60, -290 + i * 20); ctx.stroke(); }
  ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(0, -270, 10, 0, 7); ctx.fill();
  const fc = ['#FFFFFF', '#FF9800', '#E53950']; for (let i = 0; i < 7; i++) shape(ctx, fc[i % 3], () => ctx.arc(-120 + i * 40, -112, 15, 0, 7), 3);
  ctx.restore();
}
function pillar(ctx, x, w = 110) {
  shape(ctx, '#9E2A22', () => ctx.rect(x - w / 2, 300, w, 1500), 6);
  shape(ctx, '#E8B21E', () => ctx.rect(x - w / 2 - 15, 280, w + 30, 40), 5);
  shape(ctx, '#E8B21E', () => ctx.rect(x - w / 2 - 15, 1780, w + 30, 40), 5);
}
function speedLines(ctx, t, a = 0.5, dir = 1) {
  const r = rng(77); ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineCap = 'round';
  for (let i = 0; i < 26; i++) { const y = r() * H, len = 150 + r() * 300, x = ((-dir * t * 1800 + r() * 3000) % (W + 800) + W + 800) % (W + 800) - 400; ctx.lineWidth = 3 + r() * 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dir * len, y); ctx.stroke(); }
}
function vignette(ctx, a = 0.6) {
  const g = ctx.createRadialGradient(W / 2, H / 2, 500, W / 2, H / 2, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function flash(ctx, a, col = '255,255,255') { if (a > 0) { ctx.fillStyle = `rgba(${col},${clamp(a)})`; ctx.fillRect(-400, -400, W + 800, H + 800); } }
function bigHand(ctx, x, y, s, t, fire) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const sk = '#7E3B2C';
  shape(ctx, sk, () => ctx.rect(-120, 120, 240, 900));
  for (const [yy, c] of [[180, '#E8B21E'], [230, '#C62828'], [280, '#E8B21E']]) shape(ctx, c, () => ctx.rect(-135, yy, 270, 36), 6);
  limb(ctx, [[-150, 40], [-235, -90]], 78, sk);
  const fx = [[-105, -150, -110, -300], [-35, -170, -38, -360], [35, -170, 38, -370], [100, -150, 108, -310]];
  for (const [a, b, c, d] of fx) limb(ctx, [[a, b], [c, d]], 66, sk);
  shape(ctx, sk, () => { ctx.moveTo(-150, -160); ctx.quadraticCurveTo(0, -200, 150, -160); ctx.quadraticCurveTo(165, 40, 120, 140); ctx.lineTo(-120, 140); ctx.quadraticCurveTo(-170, 40, -150, -160); ctx.closePath(); });
  ctx.strokeStyle = '#4E2018'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-110, -60); ctx.quadraticCurveTo(0, -20, 120, -90); ctx.moveTo(-100, 20); ctx.quadraticCurveTo(0, 30, 90, -10); ctx.moveTo(-60, 110); ctx.quadraticCurveTo(-20, 0, 40, -150); ctx.stroke();
  if (fire > 0) { glow(ctx, 0, -120, 420 * fire, '255,90,20', 0.7 * fire); ctx.save(); ctx.globalAlpha = clamp(fire * 1.5); flame(ctx, 0, -60, 1.3 * fire, t, 3); ctx.restore(); }
  ctx.restore();
}
function crown(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, '#F2C230', () => { ctx.moveTo(-200, 0); ctx.lineTo(200, 0); ctx.lineTo(230, -200); ctx.lineTo(120, -110); ctx.lineTo(0, -260); ctx.lineTo(-120, -110); ctx.lineTo(-230, -200); ctx.closePath(); }, 8);
  shape(ctx, '#E0A800', () => ctx.rect(-205, -40, 410, 40), 6);
  for (const [jx, jy, c] of [[0, -20, '#C62828'], [-120, -20, '#2E7D32'], [120, -20, '#2E7D32'], [0, -150, '#1565C0']]) shape(ctx, c, () => ctx.arc(jx, jy, 18, 0, 7), 4);
  ctx.restore();
}


// scene helpers
const push = (z0, z1, ox0 = 0, ox1 = 0, oy0 = 0, oy1 = 0) => (p) => [lerp(z0, z1, ease(p)), lerp(ox0, ox1, ease(p)), lerp(oy0, oy1, ease(p)), 0];
const shake = (lt, a, b, amp) => (lt > a && lt < b) ? [Math.sin(lt * 63) * amp * (1 - (lt - a) / (b - a)), Math.cos(lt * 51) * amp * (1 - (lt - a) / (b - a))] : [0, 0];
module.exports = { W, H, ch, push, shake, rng, clamp, ease, lerp, ramp, sky, radialBg, stars, moon, tree, hills, earth, crow, crows, clouds, embers, petals, godRays, glow, diya, flame, ashPile, kailash, shivling, pillar, speedLines, vignette, flash, bigHand, crown, shiva, bhasmasur, vishnu, mohini, shape, ell, limb, handGlow };
