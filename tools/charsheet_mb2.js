// Character sheet for the Ashwatthama-story cast.  usage: node tools/charsheet_mb2.js <outDir>
const {createCanvas}=require('canvas');const m=require('../engine/chars_mb2');const ch=require('../engine/chars');
const c=createCanvas(3000,1350);const x=c.getContext('2d');x.fillStyle='#C89B3C';x.fillRect(0,0,3000,1350);
m.ashwatthama(x,260,1300,1,{pose:'rest',t:0.3,sword:true});
m.ashwatthama(x,760,1300,1,{pose:'sword',sword:true,eyes:'glow',mouth:'grit',t:0.3});
m.drona(x,1250,1300,1,{pose:'rest',t:0});
m.arjuna(x,1750,1300,1,{pose:'bow',t:0,flip:true});
m.krishna(x,2250,1300,1,{pose:'chakra',t:0.2,halo:0.8});
m.uttara(x,2720,1300,1,{t:0,wombGlow:0.7});
require('fs').writeFileSync(process.argv[2]+'/sheet_mb2.png',c.toBuffer());
const c2=createCanvas(3000,1350);const y=c2.getContext('2d');y.fillStyle='#141B3D';y.fillRect(0,0,3000,1350);
m.ashwatthama(y,260,1300,1,{cursed:true,pose:'hunch',mouth:'sad',bowHead:true,t:0.5,walk:true});
m.ashwatthama(y,760,1300,1,{kneel:true,pose:'kneelLow',mouth:'sad',eyes:'closed',t:0});
m.ashwatthama(y,1250,1300,1,{pose:'throw',angry:true,mouth:'grit',t:0});
m.krishna(y,1750,1300,1,{pose:'point',stern:true,t:0});
m.arjuna(y,2250,1300,1,{pose:'rest',t:0});
m.parikshit(y,2700,600,1.3,0,{});
require('fs').writeFileSync(process.argv[2]+'/sheet_mb2b.png',c2.toBuffer());
