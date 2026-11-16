const { createCanvas } = require('canvas');
const fs = require('fs');
// usage: node engine/render.js <storyDir> stills 2,10,20,35 <outDir>
//        node engine/render.js <storyDir> video <f0> <f1>   (raw BGRA frames to stdout)
const path = require('path');
const { W, H, ease, ramp, clamp } = require('./fx');
const storyDir = path.resolve(process.argv[2]);
const { S, SERIES, TOTAL, SHOW_SERIES } = require(path.join(storyDir, 'scenes.js'));
// Owner preference: the series name is NOT shown in the video unless a story sets SHOW_SERIES = true.
const SHOW = SHOW_SERIES === true;
const FPS = 30;
const cv = createCanvas(W, H), ctx = cv.getContext('2d');
ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

function text(t, x, y, size, fill, a = 1, sc = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = `${size}px "Rozha One"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(10,4,6,0.95)'; ctx.lineWidth = size * 0.16; ctx.strokeText(t, 0, 0);
  ctx.fillStyle = fill; ctx.fillText(t, 0, 0); ctx.restore();
}
const pop = (lt, at) => { const k = ramp(lt, at, at + 0.3); return [k, 0.8 + 0.2 * ease(k) + 0.06 * Math.sin(k * Math.PI)]; };

function frame(T) {
  let sc = S.find((s) => T >= s.s && T < s.e) || S[S.length - 1];
  const d = sc.e - sc.s, lt = T - sc.s, p = clamp(lt / d);
  ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const [z, ox, oy, rot] = sc.cam(p, lt);
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); if (rot) ctx.rotate(rot * Math.PI / 180); ctx.translate(-W / 2 + ox, -H / 2 + oy);
  sc.draw(ctx, lt, p, d);
  ctx.restore();
  // overlays
  const GOLD = '#F5C542';
  if (sc.title && SHOW) { const [a, s] = pop(lt, 0); text(SERIES, W / 2, 210, 96, GOLD, a, s); }
  const txt = sc.txtFn ? sc.txtFn(lt) : sc.txt;
  if (txt) { const at = sc.txtFn ? 0 : (sc.txtAt ?? 0.12); const [a, s] = pop(lt, at); text(txt, W / 2, sc.title && SHOW ? 350 : 300, 92, '#FFFFFF', a, s); }
  if (sc.bigName) { const [a, s] = pop(lt, 0.25); text(sc.bigName, W / 2, sc.bigSize ? 330 : 420, sc.bigSize || 180, GOLD, a, s); }
  if (sc.endCard && SHOW) { const [a, s] = pop(lt, 0.2); text(SERIES, W / 2, 1420, 128, GOLD, a, s); }
  // fade in from black for first 4 frames of each scene (except scene 1)
  if (sc.s > 0 && lt < 0.13) { ctx.fillStyle = `rgba(0,0,0,${0.6 * (1 - lt / 0.13)})`; ctx.fillRect(0, 0, W, H); }
  if (T > TOTAL - 0.4) { ctx.fillStyle = `rgba(0,0,0,${(T - (TOTAL - 0.4)) / 0.4})`; ctx.fillRect(0, 0, W, H); }
}

const mode = process.argv[3];
if (mode === 'stills') {
  const out = process.argv[5]; fs.mkdirSync(out, { recursive: true });
  for (const t of process.argv[4].split(',').map(Number)) { frame(t); fs.writeFileSync(`${out}/still_${String(t).replace('.', '_')}.png`, cv.toBuffer('image/png')); }
} else if (mode === 'video') {
  const f0 = +process.argv[4], f1 = +process.argv[5];
  (async () => {
    for (let f = f0; f < f1; f++) {
      frame(f / FPS);
      if (!process.stdout.write(Buffer.from(cv.toBuffer('raw')))) await new Promise((r) => process.stdout.once('drain', r));
      if (f % 300 === 0) process.stderr.write(`frame ${f}\n`);
    }
  })();
}
module.exports = { frame };
