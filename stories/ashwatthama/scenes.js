// Ashwatthama katha — scene list. Times from tools/align.py (cuts at mid-silence). No end card (owner request).
const F = require('../../engine/fx');
const { W, H, ch, push, shake, rng, clamp, ease, lerp, ramp, sky, radialBg, stars, moon, tree, hills, earth, crows, clouds, embers, petals, godRays, glow, diya, vignette, flash, speedLines, flame } = F;
const M = require('../../engine/chars_mb');
const { chariotWheel } = M;
const A = require('../../engine/chars_mb2');
const { ashwatthama, arjuna, drona, krishna, uttara, parikshit, mani, chakra, fireAura } = A;
const X = require('../../engine/fx_mb');
const { palace, arrow, sparks, dust, flag, sunDisk, astra, qpt, lightning, smoke, fog, stuckArrow, fireRing, tent, sleeper } = X;
const SERIES = '';
const GOLDT = '#F5C542';
const TOTAL = 75.3; // VO 74.68 s + short breath, no end card

const S = [];
const add = (s, e, txt, cam, draw, extra = {}) => S.push(Object.assign({ s, e, txt, cam, draw }, extra));
const counter = (lt, a, b) => `${Math.round(3000 * ease(ramp(lt, a, b)))} साल`;
// battlefield backdrop: dusk sky, hills, ground, broken wheels, torn flags, arrows, smoke
function battlefield(c, lt, top = '#2A1530', bot = '#7A3A4A', sunY = 0) {
  sky(c, top, bot);
  if (sunY) { sunDisk(c, 560, sunY, 170, '#FF8A50', '255,90,40'); }
  clouds(c, lt, 520, 'rgba(90,40,60,0.45)', 4, 3, 16);
  hills(c, 1300, '#3A1A2A', 70, 4); hills(c, 1420, '#2A1220', 50, 9);
  earth(c, 1560, '#3B2418', '#1e0f08', 5);
  smoke(c, lt, 1500, 7, 6, '40,25,35', 0.3);
  chariotWheel(c, 150, 1640, 150, lt, 0.4); chariotWheel(c, 960, 1700, 110, lt, -0.7);
  flag(c, 260, 1520, 330, lt, '#8E2A2A'); flag(c, 870, 1560, 280, lt, '#C6A02A');
  for (const [x, y, a] of [[380, 1720, -0.3], [700, 1660, 0.25], [820, 1780, -0.15], [80, 1820, 0.35], [560, 1830, -0.4]]) stuckArrow(c, x, y, a, 150);
}

// 1 HOOK 0–1.89 — lone warrior silhouette, gem glowing
add(0, 1.89, 'महाभारत का योद्धा', (p, lt) => { const k = shake(lt, 0, 0.45, 18); return [lerp(1.22, 1.02, ease(ramp(lt, 0, 1.6))), k[0], k[1], 0]; }, (c, lt) => {
  radialBg(c, '#B23A1E', '#2A0508', 540, 1250); godRays(c, 540, 1250, lt, 0.12, '255,150,80');
  smoke(c, lt, 900, 6, 2, '60,10,15', 0.35);
  hills(c, 1450, '#24060B', 60, 3);
  chariotWheel(c, 170, 1620, 170, lt, 0.5); flag(c, 900, 1500, 360, lt, '#5A0A10');
  c.fillStyle = '#16040A'; c.fillRect(-400, 1660, W + 800, 800);
  ch.setSil('#12040A'); const a = ashwatthama(c, 540, 1760, 1.0, { t: lt, pose: 'swordDown', sword: true, stance: 20 }); ch.setSil(null);
  mani(c, a.forehead[0], a.forehead[1], 15, lt, 1.0);
  embers(c, lt + 2, 50, 3, '255,170,70');
  flash(c, 0.8 * (1 - ramp(lt, 0, 0.25)), '255,230,200');
  vignette(c, 0.6);
}, { txtAt: 0.05 });

// 2 CURSE OF 3000 YEARS 1.89–6.75 — Krishna's curse, warrior walks into fog, counter
add(1.89, 6.75, 'भटकने का श्राप', (p) => [lerp(1.12, 1.0, ease(p)), lerp(-30, 30, ease(p)), 0, 0], (c, lt) => {
  sky(c, '#070B22', '#1E2A5C'); stars(c, lt, 90, 4, 1100); moon(c, 820, 560, 90);
  hills(c, 1350, '#0E1433', 50, 2);
  c.fillStyle = '#0A0E26'; c.fillRect(-400, 1600, W + 800, 800);
  fog(c, lt, 1500, 0.35);
  // Krishna big at left, pointing (divine judge)
  const k = krishna(c, 270, 1980, 1.02, { t: lt, pose: 'point', stern: true, halo: 0.7 });
  glow(c, k.R[0], k.R[1], 160, '255,210,90', 0.6 + 0.3 * Math.sin(lt * 5));
  // small cursed walker going away into fog (right)
  ch.setSil('#05060F'); ashwatthama(c, lerp(760, 900, lt / 4.86), 1640, 0.42, { t: lt, pose: 'hunch', cursed: true, walk: true, bowHead: true }); ch.setSil(null);
  fog(c, lt + 3, 1660, 0.45);
  sparks(c, k.R[0], k.R[1], ramp(lt, 1.3, 2.4), 4, '255,220,120');
  vignette(c, 0.55);
}, { bigFn: (lt) => counter(lt, 1.35, 2.5), bigAt: 1.35, bigY: 480, bigSize: 170 });

// 3 NAME 6.75–9.16 — close-up, gem flares on the name
add(6.75, 9.16, null, push(1.0, 1.1, 0, 0, 0, 20), (c, lt) => {
  radialBg(c, '#7A1E2A', '#1A0307', 540, 1000); godRays(c, 540, 1000, lt, 0.08 + 0.15 * ramp(lt, 1.1, 1.4), '140,230,255');
  embers(c, lt, 30, 8, '255,190,110', 0, W, H + 50, 70);
  ashwatthama(c, 540, 2950, 2.25, { t: lt, pose: 'rest', maniGlow: 0.6 + 0.6 * ramp(lt, 1.1, 1.4), look: lt < 1.0 ? -0.6 : 0 });
  flash(c, 0.55 * (1 - Math.abs(lt - 1.2) / 0.22), '200,245,255');
  vignette(c, 0.6);
}, { bigName: 'अश्वत्थामा', bigAt: 1.15, bigSize: 170, bigY: 400 });

// 4 SON OF DRONA 9.16–13.10 — ashram, guru's hand on his shoulder, then sword raised
add(9.16, 13.1, null, (p) => [lerp(1.04, 1.1, ease(p)), lerp(30, -30, ease(p)), 0, 0], (c, lt) => {
  sky(c, '#F2B25C', '#C8742E'); sunDisk(c, 840, 900, 140, '#FFE08A', '255,180,80'); godRays(c, 840, 900, lt, 0.08, '255,220,150');
  clouds(c, lt, 640, 'rgba(255,230,190,0.4)', 3, 11, 18);
  hills(c, 1350, '#9A5A2A', 60, 6);
  c.fillStyle = '#7A4A26'; c.fillRect(-400, 1560, W + 800, 900);
  // archery target on a post (practice ground)
  F.shape(c, '#6B4226', () => c.rect(60, 1080, 26, 500), 6);
  for (const [r, col] of [[90, '#F4EEDF'], [64, '#C62828'], [38, '#F4EEDF'], [16, '#C62828']]) F.shape(c, col, () => c.arc(73, 1120, r, 0, 7), 5);
  stuckArrow(c, 66, 1124, -1.35, 110); stuckArrow(c, 86, 1110, -1.45, 110);
  const raise = lt > 2.15;
  drona(c, 330, 1900, 0.95, { t: lt, pose: 'bless', handTo: [330, -700], look: 1, eyes: raise ? 'closed' : 'open' });
  ashwatthama(c, 760, 1900, 0.95, { t: lt, pose: raise ? 'sword' : 'rest', sword: true, look: raise ? 0 : -0.8, mouth: raise ? 'smile' : 'firm', maniGlow: 0.6 });
  if (raise) sparks(c, 900, 900, ramp(lt, 2.15, 3.0), 7, '255,230,150');
  petals(c, lt, 10, 3);
}, { txtFn: (lt) => lt < 2.15 ? 'गुरु द्रोण का पुत्र' : 'महान योद्धा' });

// 5 DIVINE GEM 13.10–16.43 — extreme close-up of the forehead gem
add(13.1, 16.43, 'दिव्य मणि', (p) => [lerp(1.0, 1.18, ease(p)), 0, 0, 0], (c, lt) => {
  sky(c, '#0B1030', '#1E2A5C'); stars(c, lt, 60, 11, 1900);
  ashwatthama(c, 540, 4900, 4.5, { t: lt, pose: 'rest', eyes: lt < 1.2 ? 'closed' : 'open', maniGlow: 0.9 });
  godRays(c, 540, 895, lt, 0.12 + 0.1 * Math.sin(lt * 3), '150,235,255', 18);
  sparks(c, 540, 895, (lt * 0.7) % 1, 3, '170,240,255');
  sparks(c, 540, 895, ((lt + 0.5) * 0.7) % 1, 9, '255,255,255');
  vignette(c, 0.5);
});

// 6 PROTECTION 16.43–18.84 — arrows bounce off the gem's cyan shield
const HITS = [0.25, 0.7, 1.15, 1.6];
add(16.43, 18.84, 'खतरों से रक्षा', (p, lt) => { let sx = 0, sy = 0; for (const h of HITS) { const k = shake(lt, h + 0.15, h + 0.45, 10); sx += k[0]; sy += k[1]; } return [lerp(1.0, 1.08, ease(p)), sx, sy, 0]; }, (c, lt) => {
  sky(c, '#241228', '#5B3459'); clouds(c, lt, 400, 'rgba(120,80,120,0.35)', 4, 3);
  hills(c, 1400, '#2E1A30', 70, 4); earth(c, 1620, '#3B2418');
  crows(c, lt + 2, 5, 330, 240, 6);
  const a = ashwatthama(c, 540, 1880, 0.95, { t: lt, pose: 'swordDown', sword: true, maniGlow: 1, eyes: 'narrow' });
  // shield bubble
  const pulse = HITS.reduce((m, h) => Math.max(m, 1 - Math.abs(lt - h - 0.15) / 0.25), 0);
  c.save(); c.strokeStyle = `rgba(140,235,255,${0.45 + 0.5 * clamp(pulse)})`; c.lineWidth = 10 + 10 * clamp(pulse); c.beginPath(); c.ellipse(540, 1350, 430, 600, 0, 0, 7); c.stroke();
  c.fillStyle = `rgba(120,220,255,${0.08 + 0.12 * clamp(pulse)})`; c.fill(); c.restore();
  HITS.forEach((h, i) => {
    const side = i % 2 ? 1 : -1, ty = 1050 + i * 110, tx = 540 + side * 410;
    const u = ramp(lt, h - 0.18, h + 0.15);
    if (u > 0 && u < 1) arrow(c, lerp(side < 0 ? -200 : W + 200, tx, u), lerp(ty - 160, ty, u), side < 0 ? Math.atan2(160, 600) : Math.PI - Math.atan2(160, 600));
    sparks(c, tx, ty, ramp(lt, h + 0.15, h + 0.8), 20 + i, '160,240,255');
    const f = ramp(lt, h + 0.15, h + 1.2);
    if (f > 0 && f < 1) { c.save(); c.translate(tx + side * 120 * f, ty + f * f * 600); c.rotate(f * 7 * side); c.fillStyle = '#D7C49E'; c.strokeStyle = '#140c0c'; c.lineWidth = 4; c.fillRect(-60, -4, 120, 8); c.strokeRect(-60, -4, 120, 8); c.restore(); }
  });
  vignette(c, 0.55);
});

// 7 FATHER'S DEATH 18.84–22.75 — Drona on the battlefield, then he fades into light
add(18.84, 22.75, null, (p, lt) => [lerp(1.0, 1.08, ease(p)), 0, lerp(0, 90, ease(ramp(lt, 2.3, 3.9))), 0], (c, lt) => {
  battlefield(c, lt);
  crows(c, lt + 1, 7, 360, 200, 9);
  const gone = ramp(lt, 2.25, 2.6);
  if (gone < 1) { c.save(); c.globalAlpha = 1 - gone; drona(c, 540, 1800, 0.9, { t: lt, pose: 'bow', eyes: lt > 1.6 ? 'closed' : 'open', mouth: 'sad' }); c.restore(); }
  if (lt > 2.25) {
    // fallen bow on the ground + spirit rising
    c.save(); c.translate(560, 1770); c.rotate(-1.45); M.bow(c, 0, 0, 0.75, false); c.restore();
    const u = ease(ramp(lt, 2.3, 3.9));
    c.save(); c.globalAlpha = 0.55 * (1 - u * 0.6); ch.setSil('rgba(255,236,190,0.9)'); drona(c, 540, 1800 - 600 * u, 0.9 - 0.2 * u, { t: lt, pose: 'rest' }); ch.setSil(null); c.restore();
    glow(c, 540, 1300 - 600 * u, 420, '255,230,170', 0.4 * (1 - u * 0.5));
  }
  flash(c, 0.7 * (1 - Math.abs(lt - 2.25) / 0.2), '255,245,225');
  vignette(c, 0.6);
}, { txtFn: (lt) => lt < 2.25 ? 'महाभारत का युद्ध' : 'पिता की मृत्यु' });

// 8 RAGE 22.75–26.12 — eyes glow white, fire aura
add(22.75, 26.12, null, (p, lt) => { const k = shake(lt, 1.1, 1.8, 14); const z = lt < 1.1 ? lerp(1.0, 1.04, lt / 1.1) : lerp(1.16, 1.24, ease(ramp(lt, 1.1, 3.4))); return [z, k[0], k[1], 0]; }, (c, lt) => {
  radialBg(c, '#6A0E18', '#14020A', 540, 1100);
  const r = ramp(lt, 0.9, 1.4);
  fireAura(c, 540, 2000, 1.3, lt, r);
  embers(c, lt, 30 + Math.round(50 * r), 5, '255,140,40', 0, W, H + 50, 160);
  ashwatthama(c, 540, 2000, 1.25, { t: lt, pose: 'fists', eyes: lt > 1.0 ? 'glow' : 'narrow', angry: true, mouth: lt > 1.0 ? 'grit' : 'sad', maniGlow: 0.5 });
  flash(c, 0.6 * (1 - Math.abs(lt - 1.1) / 0.18), '255,120,60');
  vignette(c, 0.65);
}, { bigName: 'बदले की आग', bigAt: 1.1, bigSize: 160, bigY: 400 });

// 9 WAR ENDS 26.12–28.21 — silent battlefield at sunset
add(26.12, 28.21, 'युद्ध समाप्त', (p) => [1.06, lerp(50, -50, ease(p)), 0, 0], (c, lt) => {
  battlefield(c, lt, '#3A1830', '#C0603A', 1330);
  dust(c, lt, 1700, '200,140,90', 10, 3);
  crows(c, lt + 4, 6, 420, 140, 12, 0.9);
  vignette(c, 0.55);
});

// 10 NIGHT IN THE CAMP 28.21–34.13 — sleepers, the sword's shadow grows, diyas go out
const COLS = ['#6B4E8A', '#3E6B8A', '#8A5A3E', '#4E7A4E', '#8A3E5A'];
add(28.21, 34.13, null, (p) => [lerp(1.0, 1.1, ease(p)), 0, lerp(0, -60, ease(p)), 0], (c, lt) => {
  const outs = [2.9, 3.4, 3.9, 4.4, 4.9];
  const lit = outs.filter((o) => lt < o).length;
  tent(c, lt, 0.45 + 0.55 * lit / 5);
  // the shadow on the tent wall
  const g = ease(ramp(lt, 0.4, 3.0));
  c.save(); c.globalAlpha = 0.85; ch.setSil('#06040C'); ashwatthama(c, 560, 1560, lerp(0.6, 0.98, g), { t: lt, pose: 'sword', sword: true }); ch.setSil(null); c.restore();
  // sleepers on the floor
  [[170, 1640], [400, 1690], [640, 1650], [880, 1700], [1060, 1640]].forEach(([x, y], i) => sleeper(c, x, y, 0.8, COLS[i]));
  // diyas between them, going out one by one
  [[290, 1600], [520, 1590], [760, 1600], [975, 1590], [50, 1590]].forEach(([x, y], i) => {
    if (lt < outs[i]) diya(c, x, y, 0.32, lt + i);
    else { F.shape(c, '#B4532A', () => { c.moveTo(x - 29, y - 10); c.quadraticCurveTo(x, y + 19, x + 29, y - 10); c.closePath(); }, 4); const u = ramp(lt, outs[i], outs[i] + 1.2); if (u < 1) { c.fillStyle = `rgba(160,160,170,${0.5 * (1 - u)})`; c.beginPath(); c.arc(x + Math.sin(u * 6) * 10, y - 40 - u * 160, 12 + u * 30, 0, 7); c.fill(); } }
  });
  vignette(c, 0.7);
}, { txtFn: (lt) => lt < 2.6 ? 'एक रात… पांडव शिविर' : 'द्रौपदी के पाँच पुत्र' });

// 11 ARJUNA GIVES CHASE 34.13–36.86
add(34.13, 36.86, 'अर्जुन', (p) => [1.05, lerp(-40, 40, ease(p)), 0, 0], (c, lt) => {
  sky(c, '#3A2B5C', '#F79D5C'); sunDisk(c, 540, 1250, 200, '#FFD27A', '255,170,60');
  hills(c, 1380, '#5A2E40', 60, 7); earth(c, 1600, '#5A3420', '#2a160c', 8);
  speedLines(c, lt, 0.35, -1);
  ashwatthama(c, lerp(330, 150, ease(ramp(lt, 0, 2.7))), 1800, 0.6, { t: lt * 1.6, pose: 'swordDown', sword: true, walk: true, look: 1, eyes: 'wide', maniGlow: 0.8 });
  arjuna(c, lerp(1300, 720, ease(ramp(lt, 0, 1.0))), 1900, 0.95, { t: lt * 1.6, pose: 'bowDown', flip: true, walk: lt < 1.0, angry: true, mouth: 'firm' });
  dust(c, lt, 1880, '220,160,110', 12, 5);
}, { txtCol: GOLDT });

// 12 BRAHMASHIRASTRA 36.86–39.85 — astra launched, sky cracks red
add(36.86, 39.85, null, (p, lt) => { const k = shake(lt, 1.05, 2.0, 22); return [lerp(1.0, 1.1, ease(p)), k[0], k[1], 0]; }, (c, lt) => {
  sky(c, '#14020A', '#5A0A14');
  const L = ramp(lt, 1.05, 1.3);
  if (L > 0) { lightning(c, 200, -50, 900, 3 + Math.floor(lt * 6), L); lightning(c, 880, -50, 1000, 9 + Math.floor(lt * 5), L); lightning(c, 540, -80, 700, 21 + Math.floor(lt * 4), L * 0.7); }
  hills(c, 1500, '#1E0408', 60, 4); c.fillStyle = '#12020A'; c.fillRect(-400, 1700, W + 800, 800);
  fireAura(c, 540, 1950, 1.0, lt, 0.4 + 0.4 * L);
  const a = ashwatthama(c, 500, 1950, 1.0, { t: lt, pose: 'throw', angry: true, eyes: 'glow', mouth: 'grit', maniGlow: 0.8 });
  if (lt < 1.05) { glow(c, a.R[0], a.R[1], 120 + 60 * lt, '255,90,40', 0.5 + 0.4 * lt); c.strokeStyle = '#7CB342'; c.lineWidth = 8; c.beginPath(); c.moveTo(a.R[0] - 10, a.R[1] + 20); c.quadraticCurveTo(a.R[0] + 20, a.R[1] - 40, a.R[0] + 10, a.R[1] - 90); c.stroke(); }
  else { const u = ease(ramp(lt, 1.05, 1.9)); const hx = lerp(a.R[0], 1250, u), hy = lerp(a.R[1], 120, u); astra(c, lerp(a.R[0], hx, 0.4), lerp(a.R[1], hy, 0.4), hx, hy, lt, '255,70,30'); }
  embers(c, lt, 50, 7, '255,120,50', 0, W, H + 50, 220);
  flash(c, 0.85 * (1 - Math.abs(lt - 1.08) / 0.2), '255,200,180');
  vignette(c, 0.6);
}, { bigName: 'ब्रह्मशिरास्त्र', bigAt: 1.08, bigSize: 130, bigY: 360 });

// 13 ARJUNA'S ASTRA 39.85–42.58 — two lights race toward each other
add(39.85, 42.58, 'अर्जुन का दिव्य अस्त्र', (p, lt) => { const k = shake(lt, 2.2, 2.7, 16); return [lerp(1.0, 1.08, ease(p)), k[0], k[1], 0]; }, (c, lt) => {
  // split sky: blue left, red right
  const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#0E2A6B'); g.addColorStop(0.5, '#2A0A30'); g.addColorStop(1, '#6A0A14'); c.fillStyle = g; c.fillRect(-400, -400, W + 800, H + 800);
  stars(c, lt, 50, 3, 1000);
  hills(c, 1550, '#120818', 50, 2); c.fillStyle = '#0C0610'; c.fillRect(-400, 1720, W + 800, 800);
  const ar = arjuna(c, 250, 1950, 0.95, { t: lt, pose: 'bow', flip: true, released: lt > 0.6, mouth: 'firm', angry: true });
  const meet = [560, 780];
  if (lt > 0.6) { const u = ease(ramp(lt, 0.6, 2.2)); const st = [ar.L[0] + 60, ar.L[1]]; const hx = lerp(st[0], meet[0], u), hy = lerp(st[1], meet[1], u); if (u < 1) astra(c, lerp(st[0], hx, 0.35), lerp(st[1], hy, 0.35), hx, hy, lt, '90,170,255', '#E8F4FF'); }
  { const u = ease(ramp(lt, 0.0, 2.2)); const st = [1250, 200]; const hx = lerp(st[0], meet[0], u), hy = lerp(st[1], meet[1], u); if (u < 1) astra(c, lerp(st[0], hx, 0.35), lerp(st[1], hy, 0.35), hx, hy, lt, '255,70,30'); }
  const clash = ramp(lt, 2.2, 2.4);
  if (clash > 0) { glow(c, meet[0], meet[1], 700 * clash, '255,240,220', 0.9); sparks(c, meet[0], meet[1], ramp(lt, 2.2, 2.7), 5, '255,230,200'); }
  flash(c, 0.7 * (1 - Math.abs(lt - 2.25) / 0.2), '255,255,255');
  vignette(c, 0.55);
});

// 14 TURNED TOWARD UTTARA'S WOMB 42.58–48.47 — the red astra bends down toward Uttara
add(42.58, 48.47, null, (p, lt) => [lerp(1.0, 1.1, ease(p)), 0, lerp(250, -40, ease(ramp(lt, 0, 3.0))), 0], (c, lt) => {
  palace(c, lt, '#5A1E2A', '#2A0A12', '#3A1A16');
  c.fillStyle = 'rgba(20,4,10,0.45)'; c.fillRect(-400, -400, W + 800, H + 800);
  // night sky window in the big arch
  c.save(); c.beginPath(); c.moveTo(280, 1700); c.lineTo(280, 900); c.quadraticCurveTo(280, 600, 540, 560); c.quadraticCurveTo(800, 600, 800, 900); c.lineTo(800, 1700); c.closePath(); c.clip(); sky(c, '#14020A', '#4A0E1E'); stars(c, lt, 30, 8, 1700); c.restore();
  const u = ease(ramp(lt, 0.0, 5.6));
  const P0 = [-100, -150], P1 = [1300, 300], P2 = [560, 860];
  const head = qpt(P0, P1, P2, u), tail = qpt(P0, P1, P2, Math.max(0, u - 0.18));
  diya(c, 160, 1760, 0.45, lt); diya(c, 920, 1760, 0.45, lt + 1);
  uttara(c, 540, 1900, 0.92, { t: lt, wombGlow: 0.6 + 0.4 * ramp(lt, 2.5, 4), eyes: lt > 2.6 ? 'wide' : 'open', lookY: -1, mouth: lt > 3 ? 'o' : 'calm' });
  astra(c, tail[0], tail[1], head[0], head[1], lt, '255,70,30');
  glow(c, head[0], head[1], 500, '255,60,20', 0.25 * u);
  vignette(c, 0.6);
}, { txtFn: (lt) => lt < 2.6 ? 'अस्त्र मुड़ गया!' : 'उत्तरा का गर्भ' });

// 15 PARIKSHIT 48.47–50.72 — the baby curled inside a gold glow
add(48.47, 50.72, null, push(1.0, 1.1), (c, lt) => {
  radialBg(c, '#E9B44C', '#5A2410', 540, 1050);
  glow(c, 540, 1050, 620, '255,240,190', 0.7);
  F.shape(c, 'rgba(255,220,140,0.35)', () => c.arc(540, 1050, 430, 0, 7), 6);
  c.save(); c.strokeStyle = 'rgba(255,245,210,0.6)'; c.lineWidth = 6; c.beginPath(); c.arc(540, 1050, 470 + 10 * Math.sin(lt * 3), 0, 7); c.stroke(); c.restore();
  parikshit(c, 600, 1080 + Math.sin(lt * 2) * 12, 1.7, lt, { rot: -0.25 + Math.sin(lt) * 0.04, glow: 0.4 });
  petals(c, lt, 14, 5, ['#FFF59D', '#FFFFFF', '#FFB74D']);
}, { bigName: 'परीक्षित', bigAt: 1.15, bigSize: 170, bigY: 400 });

// 16 KRISHNA PROTECTS 50.72–53.16 — flash, chakra shield, astra shatters
add(50.72, 53.16, 'कृष्ण की रक्षा', (p, lt) => { const k = shake(lt, 1.0, 1.5, 18); return [lerp(1.1, 1.0, ease(ramp(lt, 0, 1.0))), k[0], k[1] + lerp(-60, 0, ease(ramp(lt, 0, 1.2))), 0]; }, (c, lt) => {
  radialBg(c, '#FFD27A', '#7A3A1C', 380, 1000); godRays(c, 380, 950, lt, 0.25, '255,240,180');
  clouds(c, lt, 1500, 'rgba(255,240,210,0.5)', 4, 21, 25, 1.2);
  const k = krishna(c, 360, 1880, 0.92, { t: lt, pose: 'chakra', halo: 1 });
  // shield over Uttara
  const sh = ease(ramp(lt, 0.2, 0.8));
  uttara(c, 830, 1890, 0.55, { t: lt, wombGlow: 0.9, eyes: lt > 1.4 ? 'closed' : 'wide', mouth: 'calm' });
  c.save(); c.strokeStyle = `rgba(255,214,90,${0.9 * sh})`; c.lineWidth = 16; c.beginPath(); c.arc(830, 1650, 330 * sh, Math.PI, 0); c.stroke(); c.fillStyle = `rgba(255,220,120,${0.18 * sh})`; c.fill(); c.restore();
  if (sh > 0.2) chakra(c, 830, 1650 - 330 * sh, 46, lt, sh);
  // incoming red astra, shatters on the shield at 1.0
  if (lt < 1.0) { const u = ease(ramp(lt, 0, 1.0)); const hx = lerp(1250, 900, u), hy = lerp(200, 1300, u); astra(c, lerp(1250, hx, 0.4), lerp(200, hy, 0.4), hx, hy, lt, '255,70,30'); }
  sparks(c, 900, 1320, ramp(lt, 1.0, 1.8), 12, '255,120,60'); sparks(c, 900, 1320, ramp(lt, 1.0, 2.0), 13, '255,230,140');
  flash(c, 1 - ramp(lt, 0, 0.3)); flash(c, 0.6 * (1 - Math.abs(lt - 1.0) / 0.18), '255,240,200');
});

// 17 THE CURSE 53.16–58.49 — Krishna points, Ashwatthama kneels, counter again
add(53.16, 58.49, 'भटकने का श्राप', (p, lt) => { const k = shake(lt, 1.5, 2.0, 10); return [lerp(1.0, 1.1, ease(p)), k[0], k[1], 0]; }, (c, lt) => {
  radialBg(c, '#5A0E1E', '#14020A', 540, 1200);
  embers(c, lt, 25, 17, '255,140,60', 0, W, H + 50, 60);
  hills(c, 1600, '#24060E', 40, 5); c.fillStyle = '#1A040A'; c.fillRect(-400, 1760, W + 800, 800);
  const k = krishna(c, 290, 1930, 0.98, { t: lt, pose: 'point', stern: true, halo: 0.8 });
  const a = ashwatthama(c, 800, 1930, 0.92, { t: lt, kneel: true, pose: 'kneelLow', bowHead: true, eyes: lt > 1.6 ? 'closed' : 'wide', mouth: 'sad', maniGlow: 0.5 });
  const b = ease(ramp(lt, 1.45, 1.75));
  if (b > 0) { c.save(); c.lineCap = 'round'; for (const [lw, col] of [[40, 'rgba(255,200,80,0.3)'], [14, 'rgba(255,230,140,0.9)'], [5, '#FFFFFF']]) { c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); c.moveTo(k.R[0], k.R[1]); c.lineTo(lerp(k.R[0], a.head[0], b), lerp(k.R[1], a.head[1], b)); c.stroke(); } c.restore(); glow(c, a.head[0], a.head[1], 260, '255,200,80', 0.6 * b); }
  vignette(c, 0.6);
}, { bigFn: (lt) => counter(lt, 1.6, 2.8), bigAt: 1.6, bigY: 480, bigSize: 170 });

// 18 THE GEM IS TAKEN 58.49–61.64 — gem rips out and flies away, light dies
add(58.49, 61.64, 'मणि छीन ली गई', (p, lt) => { const k = shake(lt, 1.05, 1.6, 12); return [lerp(1.0, 1.12, ease(p)), k[0], k[1], 0]; }, (c, lt) => {
  const off = ramp(lt, 1.05, 1.5);
  radialBg(c, off > 0 ? '#1E2650' : '#24406A', '#05061A', 540, 1000);
  ashwatthama(c, 540, 2950, 2.25, { t: lt, pose: 'rest', mani: lt > 1.05 ? 0 : 1, maniGlow: 1, eyes: lt > 1.05 ? 'closed' : 'wide', mouth: lt > 1.05 ? 'sad' : 'o', brow: lt > 1.05 ? -14 : 10 });
  if (lt > 1.05) { const u = ease(ramp(lt, 1.05, 2.4)); const gx = lerp(540, 900, u), gy = lerp(950, 80, u); mani(c, gx, gy, 26 - 8 * u, lt, 1); sparks(c, 540, 950, ramp(lt, 1.05, 1.7), 31, '150,235,255'); }
  else glow(c, 540, 950, 200 + 120 * lt, '120,230,255', 0.3 + 0.3 * lt);
  flash(c, 0.6 * (1 - Math.abs(lt - 1.07) / 0.18), '200,240,255');
  vignette(c, 0.65);
});

// 19 WANDERING, NO RELEASE 61.64–68.49 — ragged and alone through fog, moons cycle
add(61.64, 68.49, null, (p) => [lerp(1.0, 1.06, ease(p)), lerp(60, -60, p), 0, 0], (c, lt) => {
  const day = 0.5 + 0.5 * Math.sin(lt * 1.4);
  sky(c, day > 0.5 ? '#1A1A38' : '#0A0C22', day > 0.5 ? '#4A4060' : '#1E2448');
  stars(c, lt, 70, 5, 1100);
  // moon arcs across the sky again and again (ages passing)
  const mp = (lt * 0.45) % 1; moon(c, lerp(-100, 1180, mp), 760 - Math.sin(mp * Math.PI) * 300, 70, '#E8E2CC');
  hills(c, 1300, '#1A1A30', 60, 3); hills(c, 1450, '#121226', 40, 7);
  for (let i = 0; i < 6; i++) { const x = ((i * 300 - lt * 70) % 1800 + 1800) % 1800 - 300; tree(c, x, 1680, 0.9 + (i % 3) * 0.2, '#07060c', 3 + i); }
  c.fillStyle = '#0C0B18'; c.fillRect(-400, 1680, W + 800, 800);
  fog(c, lt, 1450, 0.3);
  ashwatthama(c, 540, 1880, 0.9, { t: lt, cursed: true, pose: 'hunch', walk: true, bowHead: true, mouth: 'sad', eyes: 'open', lookY: 1 });
  fog(c, lt + 5, 1800, 0.4);
  vignette(c, 0.6);
}, { txtFn: (lt) => lt < 4.45 ? 'अपनी ही गलतियों की सज़ा' : 'मुक्ति नहीं मिली' });

// 20 MORAL 68.49–75.30 — silhouette inside a closing ring of fire, embers rise
add(68.49, TOTAL, null, (p) => [lerp(1.12, 0.98, ease(p)), 0, 0, 0], (c, lt) => {
  c.fillStyle = '#070205'; c.fillRect(-400, -400, W + 800, H + 800);
  const k = ramp(lt, 0.2, 1.5) * (1 - 0.6 * ramp(lt, 5.4, 6.6));
  fireRing(c, 540, 1760, lerp(520, 330, ease(ramp(lt, 0.3, 5))), 110, lt, k, 14, 'back');
  ch.setSil('#050104'); ashwatthama(c, 540, 1780, 0.85, { t: lt, cursed: true, pose: 'head', bowHead: true }); ch.setSil(null);
  fireRing(c, 540, 1760, lerp(520, 330, ease(ramp(lt, 0.3, 5))), 110, lt, k, 14, 'front');
  embers(c, lt, 70, 9, '255,150,50', 0, W, 1900, 140);
  vignette(c, 0.7);
}, { txtFn: (lt) => lt < 4.0 ? 'बदले की आग…' : 'खुद इंसान को जला देती है', txtCol: GOLDT });

module.exports = { S, SERIES, TOTAL };
