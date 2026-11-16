// Karna katha — scene list. Times from tools/align.py (cuts at mid-silence).
const F = require('../../engine/fx');
const { W, H, ch, push, shake, rng, clamp, ease, lerp, ramp, sky, radialBg, stars, moon, tree, hills, earth, crows, clouds, embers, petals, godRays, glow, diya, vignette, flash, speedLines } = F;
const M = require('../../engine/chars_mb');
const { karna, baby, kunti, radha, durvasa, surya, adhiratha, basket, horse, chariotWheel, sunHalo } = M;
const X = require('../../engine/fx_mb');
const { river, lotusPad, reeds, palace, hut, crowd, arrow, sparks, goldThread, om, haloRing, dust, flag, sunDisk, windowArch } = X;
const SERIES = '';
const GOLDT = '#F5C542';

const S = [];
const add = (s, e, txt, cam, draw, extra = {}) => S.push(Object.assign({ s, e, txt, cam, draw }, extra));
const sunset = (c, lt, sy = 1150, r = 260) => { radialBg(c, '#F6B04A', '#5A1424', 540, sy); sunDisk(c, 540, sy, r, '#FFE08A'); };
const nightSky = (c, lt, seed = 9) => { sky(c, '#0A0F2A', '#1C2552'); stars(c, lt, 110, seed, 1300); };
const thread = (c, lt, kx, kn, k) => goldThread(c, kx, kn, lt, k);

// 1 hook — Karna at sunset
add(0, 4.12, null, push(1.0, 1.12, 0, 0, 0, -30), (c, lt) => {
  sunset(c, lt, 1180, 300); godRays(c, 540, 1180, lt, 0.12, '255,220,140');
  clouds(c, lt, 500, 'rgba(120,40,50,0.35)', 4, 3, 20);
  hills(c, 1500, '#3A0E1A', 70, 4); c.fillStyle = '#2A0812'; c.fillRect(-400, 1720, W + 800, 800);
  karna(c, 540, 1880, 1.12, { t: lt, pose: 'bowDown', kundalGlow: 0.8, glow: 0.25 * ramp(lt, 3.2, 3.6) });
  embers(c, lt + 3, 40, 2, '255,200,90');
  flash(c, 0.7 * (1 - Math.abs(lt - 3.4) / 0.25), '255,240,200');
  vignette(c, 0.55);
}, { txtFn: (lt) => lt < 3.3 ? 'महाभारत का महान योद्धा' : null, bigName: 'कर्ण', bigAt: 3.4 });
// 2 kavach-kundal close-up
add(4.12, 8.09, 'दिव्य कवच-कुंडल', push(1.0, 1.1, 0, 0, 0, 40), (c, lt) => {
  radialBg(c, '#7A1E2A', '#1E0309', 540, 1100); godRays(c, 540, 1450, lt, 0.1, '255,210,120');
  karna(c, 540, 2950, 2.4, { t: lt, pose: 'rest', kundalGlow: 0.6 + 0.4 * ramp(lt, 1.5, 2.5), glow: 0.3 + 0.4 * ramp(lt, 0.3, 1.5) });
  embers(c, lt, 40, 7, '255,220,120', 0, W, H + 50, 80);
  vignette(c, 0.6);
});
// 3 nearly invincible — arrows shatter
const HITS = [0.35, 0.95, 1.55];
add(8.09, 10.56, 'लगभग अजेय', (p, lt) => { let sx = 0, sy = 0; for (const h of HITS) { const k = shake(lt, h + 0.18, h + 0.5, 10); sx += k[0]; sy += k[1]; } return [lerp(1.02, 1.1, ease(p)), sx, sy, 0]; }, (c, lt) => {
  radialBg(c, '#5E1426', '#1A0207', 540, 1200); embers(c, lt, 30, 9);
  hills(c, 1560, '#2A0812', 50, 5); c.fillStyle = '#22050D'; c.fillRect(-400, 1760, W + 800, 600);
  const k = karna(c, 540, 1900, 1.05, { t: lt, pose: 'fists', mouth: 'firm', eyes: 'narrow', glow: 0.4, kundalGlow: 0.8 });
  HITS.forEach((h, i) => {
    const side = i % 2 ? 1 : -1, ty = k.chest[1] - 60 + i * 60, tx = k.chest[0] + side * 60;
    const u = ramp(lt, h, h + 0.2);
    if (u < 1 && lt > h - 0.01) arrow(c, lerp(side * -300 + (side < 0 ? 0 : W), tx, u), lerp(ty - 200, ty, u), side < 0 ? Math.atan2(200, 600) : Math.PI - Math.atan2(200, 600));
    sparks(c, tx, ty, ramp(lt, h + 0.2, h + 0.9), 10 + i);
    // broken pieces falling
    const f = ramp(lt, h + 0.2, h + 1.4);
    if (f > 0 && f < 1) { c.save(); c.translate(tx + side * 60 * f, ty + f * f * 500); c.rotate(f * 6); c.fillStyle = '#D7C49E'; c.strokeStyle = '#140c0c'; c.lineWidth = 4; c.fillRect(-50, -4, 100, 8); c.strokeRect(-50, -4, 100, 8); c.restore(); }
  });
  vignette(c, 0.6);
});
// 4 do you know?
add(10.56, 12.37, 'क्या तुम जानते हो?', push(1.0, 1.1), (c, lt) => {
  sky(c, '#2A1530', '#5B3459'); clouds(c, lt, 250, 'rgba(120,80,120,0.35)', 4, 3);
  hills(c, 1350, '#2E1A30', 90, 4); earth(c, 1600, '#3B2418');
  crows(c, lt + 2, 7, 300, 260, 6);
  ch.setSil('#0c070d'); karna(c, 540, 1820, 1.05, { t: lt, pose: 'bowDown' }); ch.setSil(null);
  vignette(c, 0.55);
});
// 5 sootputra — crowd points
add(12.37, 15.94, 'सूतपुत्र?', (p) => [1.06, lerp(40, -40, ease(p)), 0, 0], (c, lt) => {
  sky(c, '#241228', '#4A2B4A'); clouds(c, lt, 400, 'rgba(100,60,100,0.3)', 3, 5);
  hills(c, 1400, '#2B1730', 60, 6); earth(c, 1600, '#33201A');
  karna(c, 540, 1720, 0.72, { t: lt, pose: 'rest', eyes: 'closed', mouth: 'sad', bowHead: true, kundalGlow: 0.3 });
  crowd(c, lt, 3, 1960, 0.85, -1, { seed: 3 }); crowd(c, lt, 3, 1960, 0.85, 1, { seed: 8 });
  vignette(c, 0.7);
});
// 6 Kunti's eldest son
const pairScene = (bgA, bgB) => (c, lt) => {
  radialBg(c, bgA, bgB, 540, 1100); godRays(c, 540, 1100, lt, 0.14, '255,220,140');
  petals(c, lt, 12, 4, ['#FFF59D', '#FFFFFF', '#FFB74D']);
  const kn = kunti(c, 290, 1900, 0.92, { t: lt, pose: 'heart', look: 1 });
  const kr = karna(c, 800, 1900, 0.92, { t: lt, pose: 'rest', look: -1, kundalGlow: 0.6 });
  thread(c, lt, [290, 1900 - 640 * 0.92], [800 - 30, kr.chest[1]], ease(ramp(lt, 0.4, 1.8)));
  flash(c, 0.7 * (1 - ramp(lt, 0, 0.4)), '255,240,200');
};
add(15.94, 19.26, 'कुंती का सबसे बड़ा बेटा!', push(1.0, 1.08), pairScene('#E2B252', '#7A3A1C'), { txtCol: GOLDT });
// 7 why float him away? — night river
add(19.26, 24.89, 'नदी में क्यों बहा दिया?', (p) => [1.06, lerp(50, -50, ease(p)), 0, 0], (c, lt, p) => {
  nightSky(c, lt); moon(c, 800, 460, 110);
  hills(c, 1250, '#0F1430', 40, 2);
  river(c, 1250, lt, '#1B2A5C', '#0B1230', 'rgba(190,210,255,0.3)', [800, 'rgba(243,236,210,0.6)']);
  lotusPad(c, 200, 1700, 1.2, true); lotusPad(c, 900, 1800, 1.0, false);
  basket(c, lerp(260, 820, ease(p)), 1520 + Math.sin(lt * 2) * 8, 0.8, lt, { glow: 0.45 });
  ch.setSil('#070a1c'); kunti(c, 110, 1340, 0.42, { t: lt, pose: 'reach' }); ch.setSil(null);
  reeds(c, 60, 1400, 1.2, lt, '#0a1020'); reeds(c, 1000, 1420, 1.0, lt, '#0a1020');
  vignette(c, 0.55);
});
// 8 the mystery begins — palace
add(24.89, 27.12, 'रहस्य की शुरुआत', push(1.04, 1.04, 0, 0, 220, 0), (c, lt) => {
  palace(c, lt);
  diya(c, 200, 1760, 0.5, lt); diya(c, 880, 1760, 0.5, lt + 1);
  kunti(c, 540, 1900, 1.0, { t: lt, pose: 'namaste', eyes: 'open' });
  petals(c, lt, 14, 6);
});
// 9 Durvasa gives the mantra
add(27.12, 32.13, 'ऋषि दुर्वासा का मंत्र', push(1.02, 1.1), (c, lt) => {
  palace(c, lt, '#C08848', '#7A3A1E');
  glow(c, 330, 1100, 500, '255,220,150', 0.35);
  const d = durvasa(c, 320, 1900, 0.95, { t: lt, pose: 'bless', look: 1, halo: 0.5 });
  const k = kunti(c, 790, 1910, 0.9, { t: lt, pose: 'namaste', look: -1, eyes: lt > 3 ? 'closed' : 'open' });
  const u = ease(ramp(lt, 0.8, 3.0));
  om(c, lerp(d.R[0] + 40, 790, u), lerp(d.R[1] - 60, 1910 - 650 * 0.9, u) - Math.sin(u * Math.PI) * 180, 130 - 40 * u, 1 - ramp(lt, 3.0, 3.5), lt);
  if (lt > 3.0) glow(c, 790, 1310, 380, '255,210,100', 0.5 * (1 - ramp(lt, 3.2, 5)));
  for (let i = 0; i < 18; i++) { const a = i * 0.7 + lt * 2, rr = 60 + (i % 6) * 22; c.fillStyle = `rgba(255,220,120,${0.7 * u * (1 - ramp(lt, 3, 3.6))})`; c.beginPath(); c.arc(lerp(d.R[0], 790, u) + Math.cos(a) * rr, lerp(d.R[1], 1300, u) + Math.sin(a) * rr, 5, 0, 7); c.fill(); }
  petals(c, lt, 10, 9, ['#FFF59D', '#FFFFFF']);
});
// 10 can call any god
add(32.13, 35.61, 'किसी भी देवता का आह्वान', push(1.12, 1.0, 0, 0, -40, 0), (c, lt) => {
  nightSky(c, lt, 12); hills(c, 1600, '#0F1430', 40, 3);
  haloRing(c, 540, 1050, 420, lt, ease(ramp(lt, 0.3, 1.8)) * 0.85);
  const k = kunti(c, 540, 1900, 0.95, { t: lt, pose: 'palms', eyes: 'wide', lookY: -1 });
  for (const h of [k.L, k.R]) M.kundal && F.handGlow(c, h[0], h[1] - 20, 140 * (0.85 + 0.15 * Math.sin(lt * 6)), 0.8, '255,200,60');
  embers(c, lt, 20, 13, '255,220,140', 300, 780, 1300, 60);
});
// 11 out of curiosity — calls Surya at dawn
add(35.61, 41.24, 'सूर्य देव का आह्वान', push(1.02, 1.12, 0, 0, 0, 30), (c, lt) => {
  const r = ramp(lt, 0, 5.6);
  sky(c, '#3A2B5C', '#F79D5C');
  const sy = lerp(1380, 1080, ease(r));
  sunDisk(c, 330, sy, 150 + 40 * r, '#FFD27A', '255,170,60'); godRays(c, 330, sy, lt, 0.08 + 0.2 * r, '255,210,120');
  clouds(c, lt, 700, 'rgba(255,190,150,0.35)', 3, 15);
  hills(c, 1400, '#5A2E40', 50, 7);
  // terrace
  F.shape(c, '#B5763A', () => c.rect(-400, 1560, W + 800, 900), 6);
  for (let i = 0; i < 12; i++) F.shape(c, '#D9A94A', () => c.rect(-20 + i * 100, 1470, 34, 100), 5);
  F.shape(c, '#D9A94A', () => c.rect(-400, 1440, W + 800, 36), 6);
  kunti(c, 760, 1900, 0.92, { t: lt, pose: 'namaste', eyes: lt < 1.8 ? 'open' : 'closed', look: -1 });
  embers(c, lt, 16, 19, '255,230,170', 0, 600, 1500, 40);
});
// 12 Surya appears
add(41.24, 45.03, 'सूर्य देव प्रकट हुए', (p, lt) => [lerp(1.12, 1.02, ease(ramp(lt, 0.3, 3))), 0, lerp(-110, 40, ease(ramp(lt, 0.3, 3.5))), 0], (c, lt) => {
  const ap = ramp(lt, 0.25, 0.6);
  radialBg(c, '#FFD27A', '#C0602A', 540, 900); godRays(c, 540, 900, lt, 0.3 * ap + 0.05, '255,240,180');
  clouds(c, lt, 1450, 'rgba(255,240,210,0.6)', 5, 21, 25, 1.3);
  if (ap > 0) { c.save(); c.globalAlpha = ap; surya(c, 540, 1800 + Math.sin(lt * 1.5) * 12, 0.98, { t: lt, pose: 'bless' }); c.restore(); }
  clouds(c, lt + 7, 1650, 'rgba(255,245,225,0.85)', 4, 22, 30, 1.4);
  petals(c, lt, ap > 0 ? 18 : 0, 8, ['#FFF59D', '#FFFFFF', '#FFB74D']);
  flash(c, 1 - Math.abs(lt - 0.3) / 0.3);
}, { txtAt: 0.6 });
// 13 Kunti frightened
add(45.03, 46.61, 'कुंती घबरा गईं', (p, lt) => [lt < 0.2 ? lerp(1.0, 1.14, lt / 0.2) : 1.14 + 0.02 * (lt - 0.2), 0, 30, 0], (c, lt) => {
  radialBg(c, '#FFD27A', '#7A3A1C', 120, 700); godRays(c, 120, 700, lt, 0.2, '255,240,180');
  kunti(c, 560, 2950, 2.4, { t: lt, pose: 'plead', eyes: 'wide', mouth: 'o', look: -1, brow: 10 });
  vignette(c, 0.55);
});
// 14 just testing the mantra
add(46.61, 52.44, 'बस मंत्र की परख', push(1.0, 1.08), (c, lt) => {
  radialBg(c, '#F2C46A', '#8A4A1C', 330, 900); godRays(c, 330, 900, lt, 0.14);
  clouds(c, lt, 1500, 'rgba(255,240,210,0.5)', 4, 23, 20, 1.2);
  surya(c, 320, 1880, 0.84, { t: lt, pose: 'rest', look: 1, rays: 0.8 });
  kunti(c, 790, 1900, 0.9, { t: lt, pose: lt % 2.4 < 1.2 ? 'plead' : 'palms', mouth: Math.sin(lt * 9) > 0 ? 'o' : 'calm', look: -1, brow: 8 });
  c.fillStyle = '#9A5A26'; c.fillRect(-400, 1880, W + 800, 400);
});
// 15 Surya's boon
add(52.44, 56.35, 'सूर्य देव का वरदान', push(1.02, 1.1), (c, lt) => {
  radialBg(c, '#F6D27A', '#9A4A1C', 540, 1000); godRays(c, 330, 900, lt, 0.16);
  clouds(c, lt, 1500, 'rgba(255,240,210,0.5)', 4, 24, 20, 1.2);
  c.fillStyle = '#9A5A26'; c.fillRect(-400, 1880, W + 800, 400);
  const s = surya(c, 320, 1880, 0.84, { t: lt, pose: 'give', look: 1, rays: 0.9 });
  const k = kunti(c, 790, 1900, 0.9, { t: lt, pose: 'palms', look: -1, eyes: lt > 2.2 ? 'closed' : 'open' });
  const u = ease(ramp(lt, 0.4, 2.2)), tx = (k.L[0] + k.R[0]) / 2, ty = k.L[1] - 40;
  const ox = lerp(s.R[0], tx, u), oy = lerp(s.R[1], ty, u) - Math.sin(u * Math.PI) * 160;
  if (lt < 3.2) { F.handGlow(c, ox, oy, 120, 0.95 * (1 - ramp(lt, 2.4, 3.2)), '255,190,50'); sunHalo(c, ox, oy, 26, lt, 1 - ramp(lt, 2.4, 3.2)); }
  if (lt > 2.2) F.handGlow(c, 790, 1340, 300, 0.55 * ramp(lt, 2.2, 2.8), '255,210,100');
  flash(c, 0.4 * (1 - Math.abs(lt - 2.3) / 0.25), '255,240,200');
});
// 16 a son is born
add(56.35, 60.31, 'पुत्र का जन्म', push(1.02, 1.1), (c, lt) => {
  c.fillStyle = '#1A1640'; c.fillRect(-400, -400, W + 800, H + 800);
  windowArch(c, 770, 700, 300, 520, () => { nightSky(c, lt, 4); moon(c, 790, 640, 70); });
  F.shape(c, '#3A2A50', () => c.rect(-400, 1720, W + 800, 900), 6);
  glow(c, 540, 1300, 560, '255,190,90', 0.25);
  kunti(c, 520, 1900, 1.0, { t: lt, pose: 'hold', baby: true, eyes: 'open', lookY: 1, mouth: 'smile' });
  diya(c, 180, 1780, 0.6, lt); diya(c, 900, 1790, 0.5, lt + 2);
});
// 17 golden kavach & kundal — baby close up
add(60.31, 66.13, 'सोने का कवच, दिव्य कुंडल', push(1.0, 1.12, 0, 0, 0, 20), (c, lt) => {
  radialBg(c, '#3A2E66', '#0E0A24', 600, 1150); godRays(c, 600, 1150, lt, 0.1, '255,220,140');
  F.shape(c, '#E6DCC4', () => c.ellipse(560, 1260, 620, 180, 0, 0, 7), 6);
  baby(c, 650, 1140, 2.6, lt, { glow: 0.7 + 0.2 * Math.sin(lt * 2), kundalGlow: 0.6 + 0.4 * ramp(lt, 2.5, 3.5) });
  embers(c, lt, 26, 27, '255,225,140', 100, 1000, 1500, 40);
});
// 18 no ordinary child
add(66.13, 68.59, 'साधारण बालक नहीं', push(1.02, 1.12), (c, lt) => {
  radialBg(c, '#4A3A7A', '#0E0A24', 560, 1100);
  sunHalo(c, 560, 1090, lerp(120, 300, ease(ramp(lt, 0, 1.6))), lt, 0.9);
  godRays(c, 560, 1090, lt, 0.2, '255,220,140');
  baby(c, 650, 1150, 2.0, lt, { glow: 0.9 });
});
// 19 son of Surya
add(68.59, 70.83, null, push(1.0, 1.06, 0, 0, -40, 40), (c, lt) => {
  radialBg(c, '#F6C25A', '#7A2E1C', 540, 900);
  const sy = lerp(1300, 860, ease(ramp(lt, 0, 1.5)));
  sunHalo(c, 540, sy, 200, lt, 1); godRays(c, 540, sy, lt, 0.25, '255,240,180');
  clouds(c, lt, 1450, 'rgba(255,240,210,0.7)', 4, 31, 20, 1.3);
  baby(c, 620, 1560, 1.6, lt, { glow: 0.8 });
}, { bigName: 'सूर्य पुत्र', bigSize: 150, bigAt: 0.4 });
// 20 the biggest crisis
add(70.83, 75.09, 'सबसे बड़ा संकट', push(1.14, 1.0), (c, lt) => {
  palace(c, lt, '#4A2B4A', '#2A1530', '#2E1A30');
  c.fillStyle = 'rgba(10,4,14,0.55)'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-400 + i * 420, 1720); c.lineTo(-200 + i * 420, 1720); c.lineTo(400 + i * 420, 2400); c.lineTo(0 + i * 420, 2400); c.closePath(); c.fill(); }
  kunti(c, 540, 1900, 1.0, { t: lt, pose: 'hold', baby: true, mouth: 'sad', look: Math.sin(lt * 1.2), brow: -12 });
  vignette(c, 0.75);
});
// 21 she was unmarried
add(75.09, 76.88, 'वह अविवाहित थीं', push(1.0, 1.08), (c, lt) => {
  c.fillStyle = '#121638'; c.fillRect(-400, -400, W + 800, H + 800);
  windowArch(c, 540, 620, 420, 640, () => { nightSky(c, lt, 6); moon(c, 600, 520, 90); });
  F.shape(c, '#22264A', () => c.rect(-400, 1720, W + 800, 900), 6);
  kunti(c, 540, 1900, 1.0, { t: lt, pose: 'hold', baby: true, eyes: 'closed', mouth: 'sad', bowHead: true });
  vignette(c, 0.6);
});
// 22 fear of disgrace — whispering silhouettes
add(76.88, 83.51, 'समाज में बदनामी', (p, lt) => [lerp(1.0, 1.1, ease(p)), 0, 0, Math.sin(lt * 0.5) * 1.5], (c, lt) => {
  radialBg(c, '#5E1426', '#14020A', 540, 1200); embers(c, lt, 20, 33, '255,90,60');
  ch.setSil('#0b0408');
  for (let i = 0; i < 7; i++) {
    const a = lt * 0.12 + i * Math.PI * 2 / 7, x = 540 + Math.cos(a) * 400, y = 1650 + Math.sin(a) * 50, sc = 0.55 + 0.06 * Math.sin(a);
    (i % 2 ? M.radha : M.adhiratha)(c, x, y, sc, { t: lt, pose: i % 2 ? 'heart' : 'whisper', eyes: 'glow', flip: x > 540 });
  }
  ch.setSil(null);
  glow(c, 540, 1350, 380, '255,200,150', 0.25);
  kunti(c, 540, 1860, 0.78, { t: lt, pose: 'hold', baby: true, eyes: 'wide', mouth: 'sad', look: Math.sin(lt * 2), brow: -12 });
  crowd(c, lt, 1, 2060, 0.95, -1, { seed: 21, whisper: true }); crowd(c, lt, 1, 2060, 0.95, 1, { seed: 22, whisper: true });
  vignette(c, 0.75);
});
// 23 lifelong pain
add(83.51, 90.18, 'ज़िंदगी भर का दर्द', push(1.0, 1.08, 0, 0, 0, 30), (c, lt) => {
  nightSky(c, lt, 14); moon(c, 820, 520, 120);
  clouds(c, lt, 700, 'rgba(60,70,120,0.4)', 3, 2, 25);
  kunti(c, 540, 2200, 1.5, { t: lt, pose: 'hold', baby: true, eyes: 'closed', mouth: 'sad', tear: 1, babyOpt: { glow: 0.35 } });
  vignette(c, 0.6);
});
// 24 placed in a basket, set afloat
add(90.18, 95.10, 'नदी में बहा दिया', (p) => [1.06, lerp(60, -70, ease(p)), 0, 0], (c, lt) => {
  nightSky(c, lt, 15); moon(c, 760, 430, 100); hills(c, 1150, '#0F1430', 40, 2);
  river(c, 1150, lt, '#1B2A5C', '#0B1230', 'rgba(190,210,255,0.3)', [760, 'rgba(243,236,210,0.5)']);
  F.shape(c, '#151C2E', () => { c.moveTo(-400, 1560); c.quadraticCurveTo(250, 1540, 440, 1700); c.quadraticCurveTo(520, 1820, 500, 2400); c.lineTo(-400, 2400); c.closePath(); }, 6);
  reeds(c, 40, 1600, 1.3, lt, '#0a1020');
  const u = ease(ramp(lt, 1.2, 4.9));
  const bx = lerp(560, 1000, u), by = lerp(1640, 1320, u);
  basket(c, bx, by + Math.sin(lt * 2) * 8, lerp(0.75, 0.45, u), lt, { glow: 0.4 });
  kunti(c, 250, 1820, 0.72, { t: lt, pose: lt < 1.4 ? 'reachDown' : 'reach', mouth: 'sad', tear: 1, look: 1 });
  lotusPad(c, 760, 1800, 1.1, true);
  vignette(c, 0.55);
});
// 25 fate kept him alive — dawn river
add(95.10, 98.54, 'किस्मत ने बचाया', push(1.02, 1.1, 30, -30), (c, lt) => {
  sky(c, '#F2A65A', '#FFE0A0'); sunDisk(c, 540, 1050, 150, '#FFF1B8', '255,200,100'); godRays(c, 540, 1050, lt, 0.2, '255,230,160');
  clouds(c, lt, 450, 'rgba(255,240,220,0.6)', 4, 41);
  hills(c, 1180, '#7A5A3A', 30, 9);
  river(c, 1180, lt, '#4A7AB0', '#1E3A6A', 'rgba(255,255,255,0.45)', [540, 'rgba(255,240,180,0.7)']);
  lotusPad(c, 200, 1500, 1.0, true); lotusPad(c, 880, 1680, 1.2, true);
  basket(c, 540, 1500 + Math.sin(lt * 2) * 10, 0.9, lt, { glow: 0.6 });
  // fish jumping
  const fk = (lt % 2.4) / 1.0; if (fk < 1) { const fx = 820 - fk * 160, fy = 1400 - Math.sin(fk * Math.PI) * 160; c.save(); c.translate(fx, fy); c.rotate(-1 + fk * 2); F.shape(c, '#FF8A3D', () => { c.ellipse(0, 0, 36, 16, 0, 0, 7); }, 4); F.shape(c, '#FF8A3D', () => { c.moveTo(30, 0); c.lineTo(56, -16); c.lineTo(56, 16); c.closePath(); }, 4); c.restore(); }
});
// 26 found by charioteer Adhiratha
add(98.54, 101.74, 'सारथी अधिरथ', push(1.02, 1.1), (c, lt) => {
  sky(c, '#E9A84E', '#F7D99A'); clouds(c, lt, 400, 'rgba(255,245,225,0.6)', 4, 43);
  hills(c, 1350, '#9A7040', 50, 10);
  F.shape(c, '#7A5A2A', () => c.rect(-400, 1500, W + 800, 900), 0);
  river(c, 1780, lt, '#4A7AB0', '#1E3A6A', 'rgba(255,255,255,0.45)');
  horse(c, 120, 1560, 0.6, lt); chariotWheel(c, 300, 1460, 110, lt);
  const a = adhiratha(c, 640, 1820, 0.95, { t: lt, pose: 'lift', eyes: lt > 0.6 ? 'wide' : 'open', mouth: lt > 0.6 ? 'o' : 'smile', lookY: 1 });
  const by = lerp(1820, (a.L[1] + a.R[1]) / 2 + 30, ease(ramp(lt, 0, 0.9)));
  basket(c, 640, by, 0.72, lt, { glow: 0.5 });
  petals(c, lt, 8, 45, ['#FFF59D', '#FFFFFF']);
});
// 27 Radha & Adhiratha adopt — Vasushen
add(101.74, 109.27, null, push(1.02, 1.12, 0, 0, 0, 20), (c, lt) => {
  hut(c, lt);
  glow(c, 540, 1300, 600, '255,190,90', 0.3);
  radha(c, 380, 1900, 0.92, { t: lt, pose: 'hold', baby: true, mouth: 'smile', lookY: 1, babyOpt: { eyes: lt > 3 ? 'open' : 'closed' } });
  adhiratha(c, 760, 1900, 0.92, { t: lt, pose: 'rest', look: -1, lookY: 0.6, mouth: 'smile' });
  diya(c, 560, 1830, 0.55, lt);
  petals(c, lt, lt > 6.4 ? 24 : 6, 47, ['#FFF59D', '#FFB74D', '#FFFFFF']);
  flash(c, 0.4 * (1 - Math.abs(lt - 6.47) / 0.25), '255,240,200');
}, { txtFn: (lt) => lt < 6.3 ? 'अधिरथ और राधा' : null, bigName: 'वसुषेण', bigAt: 6.47 });
// 28 grew up to be Karna
add(109.27, 112.38, null, push(1.0, 1.08), (c, lt) => {
  radialBg(c, '#F6C25A', '#6A1E1C', 540, 1100); godRays(c, 540, 1100, lt, 0.25, '255,230,160');
  if (lt < 1.0) baby(c, 620, 1250, 1.6, lt, { glow: 0.7 + lt });
  else karna(c, 540, 1900, 1.05, { t: lt, pose: 'raise', halo: 0.6, glow: 0.4, kundalGlow: 0.8 });
  embers(c, lt, 30, 51, '255,220,140');
  flash(c, 1 - Math.abs(lt - 1.0) / 0.3, '255,245,220');
}, { bigName: 'कर्ण', bigAt: 1.05 });
// 29 great archer
add(112.38, 115.02, 'महान धनुर्धर', (p, lt) => { const sk = shake(lt, 1.6, 2.1, 12); return [lerp(1.0, 1.1, ease(p)), sk[0], sk[1], 0]; }, (c, lt) => {
  sunset(c, lt, 1100, 220); hills(c, 1450, '#3A0E1A', 60, 12); c.fillStyle = '#2A0812'; c.fillRect(-400, 1720, W + 800, 800);
  const rel = lt > 1.6;
  karna(c, 720, 1900, 1.05, { t: lt, pose: 'bow', released: rel, eyes: 'narrow', mouth: 'firm', kundalGlow: 0.8 });
  if (rel) { const u = ramp(lt, 1.6, 2.0); arrow(c, lerp(260, -400, u), 1095, Math.PI, 260); speedLines(c, lt, 0.3 * (1 - ramp(lt, 1.8, 2.4)), -1); }
  vignette(c, 0.5);
});
// 30 the greatest misfortune
add(115.02, 117.79, 'सबसे बड़ा दुर्भाग्य', push(1.0, 1.1), (c, lt) => {
  sky(c, '#2A1530', '#4A2B4A'); clouds(c, lt, 300, 'rgba(100,60,100,0.35)', 4, 13);
  crows(c, lt, 6, 250, 150, 3, 0.9); hills(c, 1450, '#2B1730', 70, 6); earth(c, 1640, '#3B2418');
  karna(c, 540, 1860, 0.86, { t: lt, pose: 'bowDown', mouth: 'sad', lookY: 1, kundalGlow: 0.3 });
  vignette(c, 0.7);
});
// 31 never knew his mother
add(117.79, 122.18, 'माँ से अनजान', push(1.0, 1.06, 0, 0, -60, 60), (c, lt) => {
  nightSky(c, lt, 17); moon(c, 220, 620, 80);
  const a = 0.35 * Math.sin(Math.PI * ramp(lt, 0.6, 4.2));
  if (a > 0) { c.save(); c.globalAlpha = a; ch.setSil('#9FB3E8'); kunti(c, 790, 1260, 0.62, { t: lt, pose: 'heart' }); ch.setSil(null); c.restore(); glow(c, 790, 900, 300, '160,180,240', a * 0.6); }
  hills(c, 1600, '#0F1430', 40, 3);
  karna(c, 400, 1960, 0.95, { t: lt, pose: 'rest', lookY: -1, look: 1, mouth: 'sad', kundalGlow: 0.4 });
  vignette(c, 0.5);
});
// 32 Kunti was his real mother
add(122.18, 124.99, 'कुंती ही असली माँ', push(1.0, 1.08), pairScene('#5A4A9A', '#141B3D'), { txtCol: GOLDT });
// 33 never had the courage to accept him
add(124.99, 128.42, 'अपनाने की हिम्मत नहीं', push(1.0, 1.08), (c, lt) => {
  nightSky(c, lt, 19); moon(c, 860, 520, 90);
  hills(c, 1500, '#0F1430', 40, 5);
  ch.setSil('#070a1c'); karna(c, 880, 1560, 0.38, { t: lt, pose: 'bowDown' }); ch.setSil(null);
  kunti(c, 420, 2150, 1.3, { t: lt, pose: 'heart', eyes: 'closed', mouth: 'sad', tear: 1, flip: true });
  vignette(c, 0.6);
});
// 34 war against her other sons
const SH = [0.6, 1.4, 2.3, 3.2, 4.1];
add(128.42, 133.90, 'अपने ही भाइयों से युद्ध', (p, lt) => { let sx = 0, sy = 0; for (const h of SH) { const k = shake(lt, h, h + 0.3, 8); sx += k[0]; sy += k[1]; } return [lerp(1.0, 1.1, ease(p)), sx, sy, 0]; }, (c, lt) => {
  radialBg(c, '#B4502A', '#3A0A14', 540, 900); sunDisk(c, 540, 820, 140, '#FFB060', '255,120,40');
  dust(c, lt, 1200, '180,110,70', 10, 3);
  hills(c, 1400, '#4A1A1A', 40, 13); c.fillStyle = '#3A1A12'; c.fillRect(-400, 1600, W + 800, 900);
  flag(c, 60, 1700, 420, lt, '#F2C230'); flag(c, 900, 1720, 400, lt, '#C62828');
  ch.setSil('#160608'); for (let i = 0; i < 5; i++) karna(c, 70 + i * 85, 1840 - (i % 2) * 40, 0.42, { t: lt, pose: 'bow', flip: true }); ch.setSil(null);
  karna(c, 760, 1920, 0.88, { t: lt, pose: 'bow', eyes: 'narrow', mouth: 'firm', kundalGlow: 0.7 });
  for (let i = 0; i < 8; i++) { const ph = (lt * 0.9 + i * 0.37) % 1, dir = i % 2 ? 1 : -1; const x = dir > 0 ? lerp(300, 1300, ph) : lerp(800, -300, ph); arrow(c, x, 700 + i * 70 + Math.sin(ph * 3) * 40, dir > 0 ? 0.08 : Math.PI - 0.08, 180); }
  dust(c, lt + 4, 1650, '150,90,60', 8, 7);
  vignette(c, 0.6);
});
// 35 the greatest sorrow — kneels at sunset
add(133.90, 138.34, 'सबसे बड़ा दुख', push(1.12, 1.0), (c, lt) => {
  radialBg(c, '#E08A3A', '#4A0E1E', 540, 1250); sunDisk(c, 540, 1250, 260, '#FFC870', '255,150,60');
  hills(c, 1500, '#3A0E1A', 50, 14); c.fillStyle = '#2A0812'; c.fillRect(-400, 1700, W + 800, 800);
  c.save(); c.translate(900, 1760); c.scale(1, 0.4); chariotWheel(c, 0, 0, 150, lt, 0.3); c.restore();
  karna(c, 520, 1900, 1.0, { kneel: true, t: lt, pose: 'bowDown', eyes: 'closed', mouth: 'sad', kundalGlow: 0.5 });
  embers(c, lt, 20, 61, '255,170,90');
  vignette(c, 0.55);
});
// 36 fought all his life for his identity
add(138.34, 143.68, 'पहचान की लड़ाई', push(1.0, 1.1, 0, 0, 0, 30), (c, lt) => {
  sky(c, '#241228', '#4A2B4A'); clouds(c, lt, 400, 'rgba(100,60,100,0.3)', 3, 25);
  godRays(c, 540, 1150, lt, 0.1, '255,210,120');
  hills(c, 1400, '#2B1730', 60, 6); earth(c, 1600, '#33201A');
  karna(c, 540, 1800, 0.95, { t: lt, pose: 'bowDown', eyes: 'narrow', mouth: 'firm', glow: 0.25 + 0.25 * ramp(lt, 1, 4), kundalGlow: 0.8 });
  crowd(c, lt, 3, 1980, 0.85, -1, { seed: 13 }); crowd(c, lt, 3, 1980, 0.85, 1, { seed: 14 });
  vignette(c, 0.65);
});
// 37 his identity hidden with his mother
add(143.68, 147.72, 'पहचान… माँ के पास छिपी', push(1.1, 1.0, 0, 0, 40, 0), (c, lt) => {
  nightSky(c, lt, 23); moon(c, 760, 470, 100); hills(c, 1250, '#0F1430', 40, 2);
  river(c, 1250, lt, '#1B2A5C', '#0B1230', 'rgba(190,210,255,0.3)', [760, 'rgba(243,236,210,0.5)']);
  ch.setSil('#070a1c'); karna(c, 880, 1265, 0.3, { t: lt, pose: 'bowDown' }); ch.setSil(null);
  F.shape(c, '#151C2E', () => { c.moveTo(-400, 1600); c.quadraticCurveTo(300, 1580, 620, 1760); c.quadraticCurveTo(700, 1850, 700, 2400); c.lineTo(-400, 2400); c.closePath(); }, 6);
  const k = kunti(c, 360, 1920, 0.95, { t: lt, pose: 'heart', eyes: 'closed', mouth: 'sad', tear: 0.8 });
  F.handGlow(c, k.R[0], k.R[1], 170 * (0.85 + 0.15 * Math.sin(lt * 3)), 0.9, '255,200,60');
  reeds(c, 60, 1640, 1.2, lt, '#0a1020');
  vignette(c, 0.55);
});
// 38 end card
add(147.72, 149.72, null, push(1.0, 1.04), (c, lt) => {
  c.fillStyle = '#060408'; c.fillRect(-400, -400, W + 800, H + 800);
  embers(c, lt + 5, 30, 91, '255,190,90', 300, 780, 1200, 60);
  diya(c, 540, 1050, 1.9, lt);
}, { endCard: true });

module.exports = { S, SERIES, TOTAL: 149.72 };
