// Bhasmasur katha — scene list. Times come from tools/align.py (cuts at mid-silence).
// Every scene: add(start, end, keyPhraseHindi, camera(p, lt), draw(ctx, lt, p, d), extra)
const F = require('../../engine/fx');
const { W, H, ch, push, shake, rng, clamp, ease, lerp, ramp, sky, radialBg, stars, moon, tree, hills, earth, crow, crows, clouds, embers, petals, godRays, glow, diya, flame, ashPile, kailash, shivling, pillar, speedLines, vignette, flash, bigHand, crown, shiva, bhasmasur, vishnu, mohini, shape, ell, limb, handGlow } = F;
const SERIES = 'पौराणिक कथाएं';

// each: {s,e, txt, gold?, cam(p,lt)->[zoom, ox, oy, rot], draw(ctx, lt, p, d)}
const S = [];
const add = (s, e, txt, cam, draw, extra = {}) => S.push(Object.assign({ s, e, txt, cam, draw }, extra));

// 1 hook
add(0, 1.53, 'एक ऐसा राक्षस…', push(1.0, 1.14, 0, 0, 0, -40), (c, lt) => {
  radialBg(c, '#6A1428', '#1E0309');
  embers(c, lt + 3, 60, 2);
  ch.setSil('#0d0204'); bhasmasur(c, 540, 1900, 1.55, { t: lt, pose: 'fist', mouth: 'grin' }); ch.setSil(null);
  vignette(c, 0.7);
}, { title: true });
// 2 boon of immortal-like power
add(1.53, 4.89, 'अमर जैसी शक्ति', push(1.04, 1.12), (c, lt) => {
  sky(c, '#0B1030', '#1F2A5C'); stars(c, lt); moon(c, 870, 330, 90); kailash(c, 1400, 1);
  c.fillStyle = '#121838'; c.fillRect(-400, 1400, W + 800, 900);
  godRays(c, 360, 760, lt, 0.12);
  const sh = shiva(c, 360, 1560, 0.95, { t: lt, halo: 1, pose: 'bless', trishul: true });
  const bx = 820, by = 1700;
  const b = bhasmasur(c, bx, by, 0.62, { t: lt, seated: true, pose: 'raise', eyes: 'wide', mouth: 'awe', lookY: -1, look: -1, glow: ease(ramp(lt, 0.6, 2)), glowCol: '255,200,60' });
  const k = ease(ramp(lt, 0.3, 1.2));
  c.strokeStyle = `rgba(255,215,90,${0.85 * k})`; c.lineWidth = 22; c.lineCap = 'round'; c.beginPath(); c.moveTo(sh.R[0], sh.R[1]); c.lineTo(lerp(sh.R[0], b.R[0], k), lerp(sh.R[1], b.R[1], k)); c.stroke();
  c.strokeStyle = `rgba(255,255,230,${k})`; c.lineWidth = 7; c.stroke();
  flash(c, 0.85 * (1 - ramp(lt, 0, 0.45)));
});
// 3 tries to kill Mahadev
add(4.89, 10.19, 'महादेव पर ही वार!', (p, lt) => { const sk = shake(lt, 0.4, 1.8, 18); return [lerp(1.02, 1.12, ease(p)), sk[0], sk[1], 0]; }, (c, lt, p) => {
  radialBg(c, '#5E1426', '#22040C'); embers(c, lt, 40, 8);
  speedLines(c, lt, 0.12 * (1 - ramp(lt, 2, 4)), -1);
  shiva(c, 300, 1720, 0.9, { t: lt, pose: 'alarm', eyes: 'wide', mouth: 'o', look: 1 });
  const lx = lerp(830, 720, ease(ramp(lt, 0, 1)));
  bhasmasur(c, lx, 1760, 1.0, { t: lt, pose: 'reachL', eyes: 'glow', mouth: 'grin', stance: 25, glow: 1, glowHand: 'L' });
  vignette(c, 0.65);
});
// 4 who was this demon
add(10.19, 12.32, 'कौन था ये राक्षस?', push(1.0, 1.1), (c, lt) => {
  sky(c, '#2A1530', '#5B3459'); clouds(c, lt, 250, 'rgba(120,80,120,0.35)', 4, 3);
  hills(c, 1350, '#2E1A30', 90, 4); earth(c, 1550, '#3B2418');
  crows(c, lt + 2, 7, 300, 260, 6);
  ch.setSil('#0c070d'); bhasmasur(c, 540, 1780, 1.05, { t: lt, pose: 'rest' }); ch.setSil(null);
  vignette(c, 0.55);
});
// 5 how his own boon took his life
add(12.32, 15.74, 'वरदान ही बना काल', push(1.25, 1.04, 0, 0, -60, 0), (c, lt) => {
  radialBg(c, '#3A0B14', '#0A0204', 540, 1300);
  embers(c, lt, 70, 12, '255,120,40', 250, 830, 1500, 90);
  ashPile(c, 540, 1500, 1.4, lt);
  vignette(c, 0.6);
});
// 6 name reveal
add(15.74, 18.71, null, push(1.0, 1.1, 0, 0, 0, 40), (c, lt) => {
  radialBg(c, '#C89B3C', '#4A0E1E', 540, 900);
  godRays(c, 540, 900, lt, 0.12, '255,220,140');
  bhasmasur(c, 540, 2620, 2.0, { t: lt, pose: 'fist', mouth: 'grin', eyes: 'narrow' });
}, { bigName: 'भस्मासुर' });
// 7 devotee
add(18.71, 21.62, 'शिव भक्त', push(1.06, 1.1, 30, -30), (c, lt) => {
  radialBg(c, '#D9A94A', '#7A3A1C', 540, 1100);
  pillar(c, 70); pillar(c, 1010);
  shape(c, '#9E2A22', () => { c.moveTo(0, 300); c.quadraticCurveTo(540, 60, 1080, 300); c.lineTo(1080, 360); c.quadraticCurveTo(540, 140, 0, 360); c.closePath(); }, 6);
  c.fillStyle = '#6B4226'; c.fillRect(-400, 1600, W + 800, 800);
  // marigold garlands + bells
  for (let g = 0; g < 3; g++) { const x0 = 140 + g * 280, x1 = x0 + 260; for (let i = 0; i <= 14; i++) { const u = i / 14; const px = x0 + (x1 - x0) * u, py = 440 + Math.sin(u * Math.PI) * 120 + Math.sin(lt * 1.5 + g) * 6; shape(c, i % 2 ? '#FF9800' : '#FFC107', () => c.arc(px, py, 15, 0, 7), 3); } }
  for (const bx of [270, 810]) { const sw = Math.sin(lt * 2 + bx) * 0.12; c.save(); c.translate(bx, 300); c.rotate(sw); c.strokeStyle = '#3a2410'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 260); c.stroke(); shape(c, '#E8B21E', () => { c.moveTo(-40, 340); c.quadraticCurveTo(-40, 255, 0, 255); c.quadraticCurveTo(40, 255, 40, 340); c.closePath(); }, 5); c.restore(); }
  glow(c, 380, 1400, 520, '255,230,160', 0.55);
  godRays(c, 380, 1400, lt, 0.1);
  shivling(c, 380, 1640, 1.1, lt);
  diya(c, 230, 1700, 0.55, lt); diya(c, 545, 1705, 0.5, lt + 1);
  bhasmasur(c, 800, 1760, 0.7, { t: lt, seated: true, pose: 'seatnam', eyes: 'closed', mouth: 'calm' });
  petals(c, lt, 22, 5);
});
// 8 penance
add(21.62, 25.28, 'कठोर तपस्या', push(1.03, 1.1, 0, 0, 0, 30), (c, lt) => {
  sky(c, '#0A0F2A', '#1C2552'); stars(c, lt, 120, 9, 1500); moon(c, 760, 520, 150);
  clouds(c, lt, 700, 'rgba(60,70,120,0.4)', 3, 2, 25);
  hills(c, 1560, '#0F1430', 40, 2);
  tree(c, 210, 1600, 1.15);
  shape(c, '#14112A', () => c.ellipse(560, 1700, 220, 60, 0, 0, 7), 6);
  bhasmasur(c, 560, 1680, 0.42, { t: lt, seated: true, pose: 'seatnam', eyes: 'closed', mouth: 'calm' });
  embers(c, lt, 14, 41, '255,230,170', 380, 740, 1700, 40);
});
// 9 Shiva appears
add(25.28, 33.42, 'महादेव प्रकट हुए', (p, lt) => [lerp(1.12, 1.02, ease(ramp(lt, 1.2, 4))), 0, lerp(-120, 0, ease(ramp(lt, 1.2, 4))), 0], (c, lt) => {
  const ap = ramp(lt, 1.1, 1.6);
  sky(c, '#0A0F2A', '#1C2552'); stars(c, lt, 100, 9, 1300);
  if (ap > 0) { c.globalAlpha = ap; radialBg(c, 'rgba(255,214,120,0.9)', 'rgba(28,37,82,0)', 420, 950); c.globalAlpha = 1; godRays(c, 420, 950, lt, 0.22 * ap); }
  hills(c, 1580, '#0F1430', 40, 2); tree(c, 120, 1640, 0.9);
  if (ap > 0) { c.save(); c.globalAlpha = ap; shiva(c, 420, 1470 + Math.sin(lt * 1.5) * 12, 0.95, { t: lt, halo: 1, pose: 'bless', trishul: true, look: 1, lookY: 1 }); c.restore(); }
  bhasmasur(c, 820, 1790, 0.62, { t: lt, seated: true, pose: 'seatnam', eyes: ap > 0.5 ? 'wide' : 'closed', mouth: ap > 0.5 ? 'awe' : 'calm', look: -1, lookY: -1 });
  flash(c, 1 - Math.abs(lt - 1.35) / 0.3);
  petals(c, lt, ap > 0 ? 18 : 0, 8, ['#FFF59D', '#FFFFFF', '#FFB74D']);
}, { txtAt: 1.6 });
// 10 dangerous boon
add(33.42, 39.77, 'खतरनाक वरदान', push(1.02, 1.12, 0, 0, 0, -30), (c, lt) => {
  sky(c, '#2A1530', '#4A2B4A'); clouds(c, lt, 300, 'rgba(100,60,100,0.35)', 4, 13);
  crows(c, lt, 5, 250, 150, 3, 0.9); hills(c, 1450, '#2B1730', 70, 6); earth(c, 1620, '#3B2418');
  shiva(c, 320, 1720, 0.88, { t: lt, pose: 'rest', trishul: true, halo: 0.35, look: 1 });
  bhasmasur(c, 770, 1760, 0.95, { t: lt, pose: 'raise', eyes: 'narrow', mouth: 'grin', look: -1, glow: 0.25 + 0.15 * Math.sin(lt * 3) });
  vignette(c, 0.7);
});
// 11 hand on head -> ash
add(39.77, 46.68, 'सिर पर हाथ… भस्म!', (p, lt) => { const sk = shake(lt, 4.2, 5.5, 10); return [lerp(1.0, 1.22, ease(p)), sk[0], sk[1] + lerp(0, 120, ease(p)), 0]; }, (c, lt) => {
  radialBg(c, '#5E1426', '#1A0207', 540, 1100);
  embers(c, lt, 50, 14);
  bigHand(c, 540, 1180, 1.25, lt, ease(ramp(lt, 3.9, 4.7)));
  vignette(c, 0.6);
});
// 12 Shiva grants it
add(46.68, 51.67, 'इच्छा पूरी', push(1.04, 1.12), (c, lt) => {
  radialBg(c, '#E6B95A', '#8A5A20', 300, 700); godRays(c, 300, 700, lt, 0.2);
  clouds(c, lt, 400, 'rgba(255,240,200,0.35)', 3, 17);
  c.fillStyle = '#6B4226'; c.fillRect(-400, 1650, W + 800, 800);
  const sh = shiva(c, 330, 1700, 1.0, { t: lt, halo: 1, pose: 'bless', trishul: true, look: 1 });
  const b = bhasmasur(c, 790, 1720, 0.95, { t: lt, pose: 'raise', eyes: 'wide', mouth: 'grin', look: -1, glow: ease(ramp(lt, 0.8, 2.5)), glowCol: lt > 3.5 ? '255,80,20' : '255,200,60' });
  const k = ease(ramp(lt, 0.2, 1.0)), f = 1 - ramp(lt, 3.2, 4.0);
  c.strokeStyle = `rgba(255,215,90,${0.85 * k * f})`; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(sh.R[0], sh.R[1]); c.lineTo(lerp(sh.R[0], b.R[0], k), lerp(sh.R[1], b.R[1], k)); c.stroke();
  c.strokeStyle = `rgba(255,255,235,${k * f})`; c.lineWidth = 8; c.stroke();
  flash(c, 0.6 * (1 - Math.abs(lt - 1.0) / 0.25));
});
// 13 intent changes
add(51.67, 55.58, 'नीयत बदल गई', (p, lt) => [lt < 1.0 ? lerp(1.0, 1.04, lt) : lerp(1.04, 1.2, ease(ramp(lt, 1.0, 1.25))), 0, lt < 1 ? 0 : 60, 0], (c, lt) => {
  radialBg(c, lt < 1.0 ? '#6E2A1E' : '#5E0E1E', '#14020A', 540, 900);
  embers(c, lt, 40, 17);
  bhasmasur(c, 540, 2700, 2.15, { t: lt, pose: 'fist', eyes: lt < 1.0 ? 'open' : 'glow', mouth: lt < 1.0 ? 'calm' : 'grin', look: lt < 1.0 ? -0.5 : 0 });
  vignette(c, 0.75);
});
// 14 wants to use it on Shiva
add(55.58, 59.79, 'शिव पर ही!', push(1.02, 1.12, 0, 0, 0, 40), (c, lt) => {
  radialBg(c, '#4A0E1E', '#16030A', 540, 1500);
  embers(c, lt, 30, 23);
  c.fillStyle = '#22050D'; c.fillRect(-400, 1790, W + 800, 600);
  shiva(c, 260, 1800, 0.66, { t: lt, pose: 'alarm', eyes: 'wide', mouth: 'o', look: 1 });
  bhasmasur(c, lerp(800, 660, ease(ramp(lt, 0, 4))), 1810, 0.78, { t: lt, pose: 'reachL', eyes: 'glow', mouth: 'grin', glow: 1, glowHand: 'L', stance: 20 });
  vignette(c, 0.7);
});
// 15 Shiva flees
add(59.79, 64.05, 'महादेव निकल पड़े', (p) => [1.1, lerp(70, -70, p), 0, 0], (c, lt, p) => {
  sky(c, '#3B1F45', '#7A4A6E'); clouds(c, lt, 350, 'rgba(160,110,150,0.35)', 5, 19, 60);
  hills(c, 1300, '#4A2B4A', 120, 8); hills(c, 1450, '#2E1A30', 80, 9);
  earth(c, 1600, '#3B2418');
  speedLines(c, lt, 0.35, -1);
  shiva(c, lerp(180, 860, ease(p)), 900 + Math.sin(lt * 3) * 20, 0.62, { t: lt, pose: 'fly', rot: 14, eyes: 'wide', look: 1, halo: 0.5 });
  bhasmasur(c, lerp(40, 520, ease(p)), 1760 + Math.abs(Math.sin(lt * 8)) * -15, 0.5, { t: lt, pose: 'reachL', eyes: 'glow', mouth: 'grin', glow: 0.9, glowHand: 'L', stance: 30, flip: true });
  crows(c, lt, 5, 500, 300, 7, 0.8);
});
// 16 hard to stop
add(64.05, 72.53, 'रोकना मुश्किल', (p) => [lerp(1.15, 1.03, ease(p)), 0, lerp(260, -40, ease(p)), 0], (c, lt) => {
  sky(c, '#1E0F24', '#4A2B4A'); clouds(c, lt, 250, 'rgba(90,55,95,0.4)', 5, 29, 25);
  ch.setSil('#0B060E'); bhasmasur(c, 540, 2350, 2.0, { t: lt, pose: 'raise' }); ch.setSil(null);
  const hand = [540 + 240 * 2.0, 2350 - 1010 * 2.0];
  handGlow(c, hand[0] - 20, hand[1] + 30, 360 * (0.9 + 0.1 * Math.sin(lt * 5)), 0.6 + 0.3 * ramp(lt, 4.6, 5.4));
  hills(c, 1500, '#2B1730', 80, 31); earth(c, 1700, '#2E1C14', '#120804', 3);
  crows(c, lt, 9, 400, 200, 4, 1.0);
  vignette(c, 0.6);
});
// 17 Vishnu becomes Mohini
add(72.53, 78.92, null, (p, lt) => [lerp(1.0, 1.1, ease(p)), 0, 0, Math.sin(lt * 1.2) * 1.2], (c, lt) => {
  const sw = ramp(lt, 3.6, 4.1);
  radialBg(c, sw < 0.5 ? '#E8C064' : '#F2A7B8', sw < 0.5 ? '#7A4A18' : '#7A1E46', 540, 1000);
  godRays(c, 540, 1000, lt, 0.18);
  if (sw < 0.5) vishnu(c, 540, 1780, 0.95, { t: lt, halo: 1 });
  else mohini(c, 540, 1760, 1.0, { t: lt, pose: 'grace', sway: Math.sin(lt * 2) * 15 });
  // petal swirl
  const sp = ramp(lt, 2.4, 3.6) * (1 - ramp(lt, 4.6, 5.4));
  if (sp > 0) for (let i = 0; i < 60; i++) { const a = i * 0.6 + lt * 3, r = 120 + (i % 10) * 45; c.fillStyle = ['#F48FB1', '#FFF59D', '#FFFFFF'][i % 3]; c.globalAlpha = sp; c.beginPath(); c.ellipse(540 + Math.cos(a) * r, 1150 + Math.sin(a) * r * 1.6, 16, 8, a, 0, 7); c.fill(); }
  c.globalAlpha = 1;
  petals(c, lt, sw > 0.5 ? 26 : 0, 13);
  flash(c, 1 - Math.abs(lt - 3.85) / 0.3);
}, { txtFn: (lt) => lt < 3.85 ? 'भगवान विष्णु' : 'मोहिनी रूप' });
// 18 enchanted
add(78.92, 82.74, 'मोहित', push(1.03, 1.12, -20, 20), (c, lt) => {
  sky(c, '#3A1B2E', '#B5763A'); moon(c, 800, 420, 110);
  c.fillStyle = '#6B4226'; c.fillRect(-400, 1620, W + 800, 800);
  bhasmasur(c, 800, 1650, 0.82, { t: lt, pose: 'rest', eyes: 'wide', mouth: 'awe', look: -1 });
  mohini(c, 320, 1800, 1.0, { t: lt, pose: 'grace', sway: Math.sin(lt * 2) * 15, look: 1 });
  petals(c, lt, 30, 3);
});
// 19 dance
add(82.74, 88.88, 'नृत्य', (p, lt) => [1.06, Math.sin(lt * 0.9) * 40, 0, 0], (c, lt) => {
  sky(c, '#2A1530', '#A86A2E'); moon(c, 540, 500, 160);
  c.fillStyle = '#6B4226'; c.fillRect(-400, 1600, W + 800, 800);
  shape(c, '#8A5530', () => c.ellipse(540, 1720, 560, 110, 0, 0, 7), 6);
  const step = Math.floor(lt / 0.75), stepB = Math.floor(Math.max(0, lt - 0.35) / 0.75);
  mohini(c, 310, 1780, 0.92, { t: lt, pose: 'dance', dstep: step, sway: Math.sin(lt * 4) * 30, look: 1 });
  bhasmasur(c, 780, 1790, 0.85, { t: lt, pose: 'dance', dstep: stepB, flip: true, stance: 20, mouth: 'grin', look: -1 });
  petals(c, lt, 20, 33);
});
// 20 Mohini places hand on head
add(88.88, 93.29, 'सिर पर हाथ', push(1.0, 1.1, 0, 0, 0, 40), (c, lt) => {
  radialBg(c, '#B5763A', '#2A1020', 540, 1000);
  glow(c, 540, 1100, 700, '255,220,150', 0.3);
  const k = ease(ramp(lt, 1.2, 3.0));
  const from = [ch.DANCE[0][1][0] * 0.85, -700 + (ch.DANCE[0][1][1] + 690) * 0.85];
  mohini(c, 540, 2150, 1.35, { t: lt, pose: 'rest', handR: [lerp(from[0], 50, k), lerp(from[1], -960, k)], handPrefR: 'out', sway: Math.sin(lt * 2) * 10 });
  petals(c, lt, 18, 34);
});
// 21 Bhasmasur copies without thinking
add(93.29, 100.0, 'बिना सोचे-समझे', push(1.0, 1.12, 0, 0, 0, 40), (c, lt) => {
  radialBg(c, '#5E1426', '#12020A', 540, 1000);
  ch.setSil('#2a0d18'); mohini(c, 120, 1500, 0.5, { t: lt, pose: 'head' }); ch.setSil(null);
  const k = ease(ramp(lt, 1.0, 4.0));
  bhasmasur(c, 600, 2150, 1.3, { t: lt, pose: 'rest', handR: [lerp(160, 70, k), lerp(-430, -955, k)], handPrefR: 'out', mouth: 'grin', eyes: lt > 4.2 ? 'wide' : 'open', glow: ramp(lt, 3.5, 6), glowHand: 'R' });
  vignette(c, 0.75);
});
// 22 burns to ash
add(100.0, 105.69, null, (p, lt) => { const sk = shake(lt, 0.3, 2.2, 22); return [lerp(1.08, 1.0, ease(ramp(lt, 2, 5.5))), sk[0], sk[1], 0]; }, (c, lt) => {
  const burn = ramp(lt, 1.7, 3.4);
  radialBg(c, burn > 0 && burn < 1 ? '#8E2A10' : '#4A0E1E', '#0C0105', 540, 1300);
  if (burn < 0.6) {
    c.save(); c.globalAlpha = 1 - ramp(burn, 0.2, 0.6);
    bhasmasur(c, 540, 1950, 1.05, { t: lt, pose: 'head', eyes: 'wide', mouth: 'scream', glow: 1 });
    c.restore();
  }
  if (burn > 0 && burn < 1) flame(c, 540, 1950, 3.2 * Math.sin(burn * Math.PI), lt, 9);
  if (burn > 0.6) { c.globalAlpha = ramp(burn, 0.6, 1); ashPile(c, 540, 1900, 1.4, lt); c.globalAlpha = 1; }
  embers(c, lt, 70, 51, '255,140,40', 200, 880, 1950, 160);
  flash(c, 1 - Math.abs(lt - 1.8) / 0.25, '255,240,220');
  vignette(c, 0.6);
}, { txtFn: (lt) => lt > 3.3 ? 'भस्म!' : null });
// 23 power became death
add(105.69, 112.36, 'शक्ति ही बनी मौत', push(1.14, 1.02, 0, 0, -40, 0), (c, lt) => {
  sky(c, '#0A0F2A', '#1C2552'); stars(c, lt, 100, 15, 1300); moon(c, 540, 520, 120);
  hills(c, 1450, '#0F1430', 50, 15);
  shiva(c, 300, 1450, 0.42, { t: lt, halo: 1, pose: 'rest', trishul: true });
  mohini(c, 790, 1450, 0.42, { t: lt, pose: 'grace', sway: 5 });
  c.fillStyle = '#121838'; c.fillRect(-400, 1450, W + 800, 800);
  ashPile(c, 540, 1760, 1.1, lt, 0.6);
  const r = rng(61); c.fillStyle = 'rgba(170,165,175,0.7)';
  for (let i = 0; i < 60; i++) { const ph = (lt * 0.25 + r()) % 1; c.beginPath(); c.arc(540 + ph * 700 + r() * 60, 1700 - ph * 400 + Math.sin(lt * 3 + i) * 20, 4 + r() * 5, 0, 7); c.fill(); }
});
// 24 lesson
add(112.36, 115.6, 'कथा की सीख', push(1.0, 1.1), (c, lt) => {
  c.fillStyle = '#07050A'; c.fillRect(-400, -400, W + 800, H + 800);
  diya(c, 540, 1250, 2.0, lt); embers(c, lt, 20, 71, '255,190,90', 380, 700, 1100, 50);
});
// 25 viveka greater than power
add(115.6, 118.23, null, push(1.02, 1.1, 0, 0, 0, 30), (c, lt) => {
  sky(c, '#0A0F2A', '#26306A'); stars(c, lt, 90, 25);
  godRays(c, 540, 1100, lt, 0.12);
  shiva(c, 540, 1800, 1.12, { t: lt, seated: true, pose: 'meditate', eyes: 'closed', halo: 1, thirdEye: 0.6 + 0.4 * Math.sin(lt * 3) });
}, { bigName: 'शक्ति से बड़ा विवेक', bigSize: 104 });
// 26 without viveka -> destruction
add(118.23, 123.40, 'बिना विवेक… विनाश', push(1.12, 1.0), (c, lt) => {
  const x = ramp(lt, 2.6, 3.8);
  if (x < 1) {
    radialBg(c, '#5E1426', '#12020A', 540, 1000);
    const cr = ramp(lt, 0.8, 2.8);
    c.save(); c.globalAlpha = 1 - cr; crown(c, 540, 1150 + cr * 80, 1.3); c.restore();
    const r = rng(81); c.fillStyle = '#8E8A90';
    for (let i = 0; i < 120 * cr; i++) { const px = 540 + (r() - 0.5) * 520, py = 1000 + r() * 200; c.beginPath(); c.arc(px + (r() - 0.3) * cr * 300, py + cr * cr * 600 * (0.5 + r()), 4 + r() * 6, 0, 7); c.fill(); }
    embers(c, lt, 40, 83);
  }
  if (x > 0) {
    c.save(); c.globalAlpha = x;
    sky(c, '#0A0F2A', '#1C2552'); stars(c, lt, 90, 3, 1400); moon(c, 760, 600, 130); hills(c, 1560, '#0F1430', 40, 2); tree(c, 300, 1620, 1.1);
    c.restore();
  }
});
// 27 end card
add(123.40, 125.40, null, push(1.0, 1.04), (c, lt) => {
  c.fillStyle = '#060408'; c.fillRect(-400, -400, W + 800, H + 800);
  embers(c, lt + 5, 30, 91, '255,190,90', 300, 780, 1200, 60);
  diya(c, 540, 1050, 1.9, lt);
}, { endCard: true });

module.exports = { S, SERIES, TOTAL: 125.4 };
