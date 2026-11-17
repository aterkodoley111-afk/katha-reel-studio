// Motion test sheet: walk cycle, run cycle, pose tween, blink.  usage: node tools/motiontest.js <outDir>
const { createCanvas } = require('canvas'); const A = require('../engine/chars_mb2'); const MB = require('../engine/chars_mb'); const MO = require('../engine/motion');
const c = createCanvas(3200, 2700), x = c.getContext('2d'); x.fillStyle = '#C89B3C'; x.fillRect(0, 0, 3200, 2700);
for (let i = 0; i < 8; i++) A.ashwatthama(x, 200 + i * 400, 1280, 0.62, { t: i * 0.157, pose: 'rest', walk: true, sword: false });
for (let i = 0; i < 8; i++) A.arjuna(x, 200 + i * 400, 1900, 0.55, { t: i * 0.087, pose: 'bowDown', run: true, flip: true });
for (let i = 0; i < 8; i++) { const k = i / 7; A.ashwatthama(x, 200 + i * 400, 2650, 0.42, { t: 1, pose: 'sword', from: 'swordDown', k, sword: true }); }
require('fs').writeFileSync(process.argv[2] + '/motion.png', c.toBuffer());
// blink check: count closed frames over 10 s for one character
let closed = 0; for (let f = 0; f < 300; f++) if (MO.blinking(f / 30, 540 + 1000)) closed++; console.log('blink frames in 10s:', closed);
