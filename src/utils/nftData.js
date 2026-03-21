// NFT Collection data — each has id, name, rarity, traits, bg, draw(ctx)
// Draw functions produce 300x300 canvas art

function roundRect(ctx,x,y,w,h,r,doFill,doStroke){
  ctx.beginPath()
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r)
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h)
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r)
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath()
  if(doFill)ctx.fill();if(doStroke)ctx.stroke()
}
function cs(ctx,w,c){ctx.lineWidth=w;ctx.strokeStyle=c||'#111'}
function splat(ctx,x,y,r,color){
  ctx.fillStyle=color;ctx.globalAlpha=0.85
  for(let i=0;i<7;i++){const a=Math.PI*2*i/7;const d=r*.6+Math.random()*r*.3;ctx.beginPath();ctx.arc(x+Math.cos(a)*d*.6,y+Math.sin(a)*d*.6,r*.28+Math.random()*r*.12,0,Math.PI*2);ctx.fill()}
  ctx.beginPath();ctx.arc(x,y,r*.5,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1
}
function drip(ctx,x,y,len,color){ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+1,y+len*.7);ctx.stroke();ctx.beginPath();ctx.ellipse(x+1,y+len,3,5,0,0,Math.PI*2);ctx.fill()}
function scratches(ctx,x,y,w,h){ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x+Math.random()*w,y+Math.random()*h);ctx.lineTo(x+Math.random()*w,y+Math.random()*h);ctx.stroke()}}
function boldText(ctx,text,x,y,size,fill,stroke,align='center'){ctx.font=`900 ${size}px 'Arial Black',sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.strokeStyle=stroke||'#111';ctx.lineWidth=size*.18;ctx.lineJoin='round';ctx.strokeText(text,x,y);ctx.fillStyle=fill;ctx.fillText(text,x,y)}
function rivet(ctx,x,y,r=4){const g=ctx.createRadialGradient(x-r*.3,y-r*.3,0,x,y,r);g.addColorStop(0,'#d0d0d0');g.addColorStop(0.5,'#888');g.addColorStop(1,'#444');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#222';ctx.lineWidth=0.8;ctx.stroke()}
function sticker(ctx,x,y,text,bgColor,textColor,w=38,h=18){ctx.save();ctx.translate(x,y);ctx.rotate((Math.random()-.5)*.4);ctx.fillStyle=bgColor;ctx.strokeStyle='#111';ctx.lineWidth=1.5;roundRect(ctx,-w/2,-h/2,w,h,3,true,true);ctx.font=`bold ${h*.55}px 'Courier New'`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=textColor;ctx.fillText(text,0,0);ctx.restore()}
function degenEye(ctx,x,y,r,irisColor,pupilColor,lookX=0,lookY=0,bloodshot=false){ctx.fillStyle='#f0ede0';ctx.strokeStyle='#222';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r,r*.75,0,0,Math.PI*2);ctx.fill();ctx.stroke();if(bloodshot){ctx.strokeStyle='rgba(220,50,50,0.5)';ctx.lineWidth=0.7;for(let i=0;i<4;i++){const a=Math.random()*Math.PI*2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(a)*r*.4,y+Math.sin(a)*r*.4,x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.55);ctx.stroke()}}const ig=ctx.createRadialGradient(x+lookX,y+lookY,0,x+lookX,y+lookY,r*.5);ig.addColorStop(0,irisColor);ig.addColorStop(1,'#111');ctx.fillStyle=ig;ctx.beginPath();ctx.arc(x+lookX,y+lookY,r*.55,0,Math.PI*2);ctx.fill();ctx.fillStyle=pupilColor;ctx.beginPath();ctx.arc(x+lookX,y+lookY,r*.28,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.8)';ctx.beginPath();ctx.arc(x+lookX-r*.15,y+lookY-r*.15,r*.13,0,Math.PI*2);ctx.fill()}
function wire(ctx,x1,y1,x2,y2,color,w=2){ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();const dx=x2-x1,dy=y2-y1,mx=x1+dx*.3+(dy>0?.5:-.5)*15,my=y1+dy*.3+dx*.1;ctx.moveTo(x1,y1);ctx.quadraticCurveTo(mx,my,x2,y2);ctx.stroke()}
function smoke(ctx,x,y){ctx.strokeStyle='rgba(220,220,200,0.4)';ctx.lineWidth=3;ctx.lineCap='round';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+i*4,y);ctx.bezierCurveTo(x+i*4+10,y-12,x+i*4-8,y-24,x+i*4+6,y-38);ctx.bezierCurveTo(x+i*4+14,y-52,x+i*4-4,y-65,x+i*4+8,y-80);ctx.globalAlpha=0.25-i*.05;ctx.stroke()}ctx.globalAlpha=1}

function drawHead(ctx,fill,strokeColor,x=78,y=55,w=144,h=185,rx=16){const hg=ctx.createLinearGradient(x,y,x+w,y+h);hg.addColorStop(0,fill);hg.addColorStop(1,fill.replace('ff','88'));ctx.fillStyle=hg;cs(ctx,3.5,strokeColor);roundRect(ctx,x,y,w,h,rx,true,true);scratches(ctx,x,y,w,h)}
function drawNeck(ctx,fill,strokeColor){ctx.fillStyle=fill;cs(ctx,1,strokeColor);roundRect(ctx,133,128,34,14,3,true,true)}
function drawBody(ctx,fill,strokeColor){ctx.fillStyle=fill;cs(ctx,3,strokeColor);roundRect(ctx,88,228,124,75,10,true,true)}
function drawArms(ctx,fill,strokeColor){ctx.fillStyle=fill;cs(ctx,1.2,strokeColor);roundRect(ctx,57,152,36,15,5,true,true);roundRect(ctx,51,165,21,38,4,true,true);roundRect(ctx,47,200,24,15,6,true,true);roundRect(ctx,207,152,36,15,5,true,true);roundRect(ctx,228,165,21,38,4,true,true);roundRect(ctx,228,200,24,15,6,true,true)}
function drawLegs(ctx,fill,strokeColor){ctx.fillStyle=fill;cs(ctx,1.2,strokeColor);roundRect(ctx,118,222,25,40,4,true,true);roundRect(ctx,157,222,25,40,4,true,true);roundRect(ctx,112,258,30,18,6,true,true);roundRect(ctx,158,258,30,18,6,true,true)}

export const NFT_COLLECTION = [
  {
    id:'SDX-001', name:'DIAMOND HANS', rarity:'Mythic', rarityColor:'#00d4ff', bg:'#f5c500',
    description:'The eternal HODLer. One cyclopean eye that sees all markets. Has never, and will never, sell.',
    traits:['Hands: Diamond','Status: HODL Forever','Multiplier: 5×'],
    draw(ctx){
      ctx.fillStyle='#f5c500';ctx.fillRect(0,0,300,300)
      splat(ctx,260,40,18,'#00c8ff');boldText(ctx,'SDX',261,40,9,'#111','#00c8ff')
      // Body/legs/arms
      ctx.fillStyle='#6a7080';cs(ctx,3,'#222');roundRect(ctx,70,230,160,80,8,true,true);scratches(ctx,70,230,160,80)
      ctx.fillStyle='#888fa0';cs(ctx,2.5,'#222');roundRect(ctx,85,228,55,22,4,true,true);roundRect(ctx,160,228,55,22,4,true,true)
      ;[92,132,167,207].forEach(x=>rivet(ctx,x,238))
      const hg=ctx.createLinearGradient(80,50,220,200);hg.addColorStop(0,'#b0b8c8');hg.addColorStop(1,'#606878')
      ctx.fillStyle=hg;cs(ctx,3.5,'#1a1a1a');roundRect(ctx,72,55,156,185,18,true,true);scratches(ctx,72,55,156,185)
      splat(ctx,130,80,22,'#cc44aa');splat(ctx,185,95,14,'#aa33cc');splat(ctx,95,130,12,'#dd55bb')
      ctx.fillStyle='#ddd';ctx.strokeStyle='#555';ctx.lineWidth=1;roundRect(ctx,105,60,90,22,3,true,true)
      boldText(ctx,'SDX-001',150,71,8,'#333','transparent')
      // Monocle eye
      ctx.fillStyle='#333';cs(ctx,3,'#111');ctx.beginPath();ctx.arc(112,128,30,0,Math.PI*2);ctx.fill();ctx.stroke()
      cs(ctx,3,'#888');ctx.beginPath();ctx.arc(112,128,30,0,Math.PI*2);ctx.stroke()
      ;[0,1,2,3,4,5].forEach(i=>{const a=Math.PI/3*i;rivet(ctx,112+Math.cos(a)*29,128+Math.sin(a)*29,3)})
      degenEye(ctx,112,128,18,'#00ee88','#003322',2,-1,false)
      ctx.strokeStyle='rgba(0,238,136,0.3)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(112,128,22,0,Math.PI*2);ctx.stroke()
      // Right face
      ctx.fillStyle='#707880';cs(ctx,2,'#444');roundRect(ctx,155,98,78,88,6,true,true);scratches(ctx,155,98,78,88)
      const rg=ctx.createRadialGradient(176,120,0,176,120,10);rg.addColorStop(0,'#ff4444');rg.addColorStop(1,'#880000')
      ctx.fillStyle=rg;ctx.beginPath();ctx.arc(176,120,10,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.stroke()
      splat(ctx,200,135,8,'#44ff88')
      ctx.fillStyle='#858d9a';cs(ctx,2,'#333');roundRect(ctx,138,148,24,18,4,true,true);rivet(ctx,144,153);rivet(ctx,156,153)
      drip(ctx,145,165,14,'#fff');drip(ctx,155,165,10,'#fff')
      ctx.fillStyle='#1a1a1a';cs(ctx,2.5,'#111');roundRect(ctx,98,178,104,26,6,true,true)
      ctx.fillStyle='#e8e0c8';[0,1,2,3,4,5].forEach(i=>{const tx=106+i*16;roundRect(ctx,tx,180,12,14,2,true,false);cs(ctx,1,'#555');roundRect(ctx,tx,180,12,14,2,false,true)})
      sticker(ctx,220,200,'💎HODL','#00c8ff','#111',48,20);sticker(ctx,110,210,'SDX','#f5c500','#111',32,16)
      wire(ctx,130,230,255,265,'#ff4444',2.5);wire(ctx,155,230,260,275,'#4444ff',2);wire(ctx,170,230,240,278,'#44cc44',2.5)
      ctx.strokeStyle='#555';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(88,62);ctx.lineTo(60,20);ctx.stroke()
      ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(58,18,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.stroke()
      smoke(ctx,210,68)
      ctx.fillStyle='rgba(0,212,255,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#1',8,14);ctx.textAlign='right';ctx.fillText('MYTHIC',292,14)
    }
  },
  {
    id:'SDX-002', name:'PAPER HANDS PETE', rarity:'Common', rarityColor:'#888', bg:'#e8f0ff',
    description:'Sold at the absolute bottom. Both eyes tell the story. Still haunted by the charts.',
    traits:['Sold: Bottom','Status: NGMI','Regret: Eternal'],
    draw(ctx){
      ctx.fillStyle='#e8f0ff';ctx.fillRect(0,0,300,300)
      splat(ctx,50,50,15,'#ff4488');splat(ctx,250,260,20,'#ffaa00')
      ctx.fillStyle='#aab0c0';cs(ctx,3,'#333');roundRect(ctx,100,230,100,70,8,true,true)
      wire(ctx,120,235,90,280,'#ff4444',2.5);wire(ctx,160,235,210,275,'#4488ff',2.5)
      const hg=ctx.createLinearGradient(75,60,225,210);hg.addColorStop(0,'#c8d0e0');hg.addColorStop(1,'#98a0b0')
      ctx.fillStyle=hg;cs(ctx,3.5,'#222');roundRect(ctx,75,60,150,180,16,true,true);scratches(ctx,75,60,150,180)
      splat(ctx,150,88,26,'#ff3333');boldText(ctx,'L','150',22,22,'#fff','#800')
      ctx.fillStyle='#ddd';cs(ctx,1,'#666');roundRect(ctx,100,65,100,20,3,true,true);boldText(ctx,'SDX-002',150,75,8,'#555','transparent')
      ctx.fillStyle='#ccc';cs(ctx,2.5,'#333');ctx.beginPath();ctx.ellipse(118,130,22,18,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,118,130,14,'#4488ff','#001133',-2,2,true)
      ctx.fillStyle='rgba(100,150,255,0.7)';ctx.beginPath();ctx.moveTo(108,145);ctx.quadraticCurveTo(105,155,108,162);ctx.quadraticCurveTo(111,155,108,145);ctx.fill()
      ctx.fillStyle='#ccc';cs(ctx,2.5,'#333');ctx.beginPath();ctx.ellipse(182,130,22,18,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      ctx.strokeStyle='#ff3333';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(170,120);ctx.lineTo(194,142);ctx.stroke();ctx.beginPath();ctx.moveTo(194,120);ctx.lineTo(170,142);ctx.stroke()
      ctx.fillStyle='#888';cs(ctx,2.5,'#333');roundRect(ctx,118,168,64,20,8,true,true)
      ctx.strokeStyle='#555';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(128,183);ctx.quadraticCurveTo(150,175,172,183);ctx.stroke()
      sticker(ctx,100,200,'NGMI','#ff3333','#fff',38,18);sticker(ctx,200,175,'SOLD','#ff8800','#111',35,17)
      // Paper hands
      ctx.fillStyle='#f0e8d0';ctx.save();ctx.translate(80,170);ctx.rotate(-.3);roundRect(ctx,0,0,30,38,2,true,false);ctx.restore()
      ctx.save();ctx.translate(192,172);ctx.rotate(.25);ctx.fillStyle='#f0e8d0';roundRect(ctx,0,0,30,38,2,true,false);ctx.restore()
      ctx.fillStyle='rgba(68,136,255,0.4)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#2',8,14);ctx.textAlign='right';ctx.fillText('COMMON',292,14)
    }
  },
  {
    id:'SDX-003', name:'LIQUIDITY LUIGI', rarity:'Rare', rarityColor:'#22c55e', bg:'#0a1a0a',
    description:'Born in the liquidity pools. Candlestick charts for eyes. Drips other tokens.',
    traits:['Pool: Max LP','APR: Infinite','Class: Provider'],
    draw(ctx){
      ctx.fillStyle='#0a1a0a';ctx.fillRect(0,0,300,300)
      ;[0,1,2,3].forEach(i=>{ctx.fillStyle=`rgba(0,${100+i*30},${60+i*20},0.15)`;ctx.beginPath();ctx.ellipse(150,250+i*15,130-i*15,30,0,0,Math.PI*2);ctx.fill()})
      splat(ctx,40,40,14,'#00ff88');splat(ctx,265,55,12,'#00aaff')
      ctx.fillStyle='#1a3025';cs(ctx,3,'#00ff88');roundRect(ctx,90,215,120,90,10,true,true)
      ;['#00ff88','#00ccaa','#00aaff'].forEach((c,i)=>{drip(ctx,110+i*25,215,20+i*5,c)})
      const hg=ctx.createLinearGradient(80,55,220,210);hg.addColorStop(0,'#1a3028');hg.addColorStop(1,'#071510')
      ctx.fillStyle=hg;cs(ctx,3.5,'#00ff88');roundRect(ctx,80,55,140,175,16,true,true)
      ctx.fillStyle='#003a18';cs(ctx,1,'#00cc66');roundRect(ctx,105,62,90,20,3,true,true);boldText(ctx,'SDX-003',150,72,8,'#00ff88','transparent')
      splat(ctx,100,85,16,'#0066ff');splat(ctx,195,90,14,'#cc00ff');splat(ctx,170,170,18,'#ffcc00')
      // Left eye - chart
      ctx.fillStyle='#001a0a';cs(ctx,2.5,'#00cc66');ctx.beginPath();ctx.ellipse(118,128,24,20,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      ;[[113,138,4,'#ff4444'],[120,132,8,'#44ff88'],[127,135,6,'#44ff88']].forEach(([x,y,h,c])=>{ctx.fillStyle=c;ctx.fillRect(x,y-h,3,h)})
      // Right eye
      ctx.fillStyle='#001a0a';cs(ctx,2.5,'#00cc66');ctx.beginPath();ctx.ellipse(182,128,24,20,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,182,128,16,'#00ff88','#002208',1,-1,false)
      ctx.fillStyle='#002a10';cs(ctx,2.5,'#00cc66');roundRect(ctx,110,170,80,24,8,true,true)
      ctx.strokeStyle='#00cc66';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(120,182);ctx.quadraticCurveTo(150,193,180,182);ctx.stroke()
      drip(ctx,145,193,12,'#00ff88');drip(ctx,158,193,8,'#00aaff')
      sticker(ctx,108,200,'LIQ PRO','#00ff88','#000',46,19);sticker(ctx,205,145,'APR∞','#ffcc00','#111',38,18)
      wire(ctx,140,228,80,270,'#00ff88',2.5);wire(ctx,160,228,220,265,'#0088ff',2.5)
      ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#3',8,14);ctx.textAlign='right';ctx.fillText('RARE',292,14)
    }
  },
  {
    id:'SDX-004', name:'WHALE WATCHER', rarity:'Epic', rarityColor:'#0088ff', bg:'#001428',
    description:'Moves markets with a glance. Watches every wallet. Has never felt fear.',
    traits:['Bag: Enormous','Influence: Total','Rarity: Terrifying'],
    draw(ctx){
      ctx.fillStyle='#001428';ctx.fillRect(0,0,300,300)
      ctx.fillStyle='rgba(0,80,160,0.1)';ctx.fillRect(0,200,300,100)
      splat(ctx,50,45,16,'#0088ff');splat(ctx,255,260,18,'#00ccff')
      ctx.fillStyle='#0a1f30';cs(ctx,3,'#0088ff');roundRect(ctx,85,225,130,80,10,true,true)
      wire(ctx,120,235,70,280,'#0088ff',3);wire(ctx,150,235,148,285,'#00ccff',2.5);wire(ctx,175,235,225,275,'#4400ff',2.5)
      const hg=ctx.createLinearGradient(72,50,228,215);hg.addColorStop(0,'#0d2035');hg.addColorStop(1,'#041020')
      ctx.fillStyle=hg;cs(ctx,4,'#0088ff');roundRect(ctx,72,50,156,188,18,true,true);scratches(ctx,72,50,156,188)
      splat(ctx,150,85,20,'#0066cc');boldText(ctx,'🐋','150',16,16,'#00ccff','#003366')
      ctx.fillStyle='#001a2a';cs(ctx,1,'#0066aa');roundRect(ctx,105,55,90,20,3,true,true);boldText(ctx,'SDX-004',150,65,8,'#0088ff','transparent')
      ctx.fillStyle='#001020';cs(ctx,3,'#0088ff');ctx.beginPath();ctx.arc(118,130,26,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,118,130,18,'#0088ff','#000428',-2,1,false)
      ctx.strokeStyle='rgba(0,136,255,0.3)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(118,130,28,0,Math.PI*2);ctx.stroke()
      ctx.fillStyle='#001020';cs(ctx,3,'#0088ff');ctx.beginPath();ctx.arc(182,130,26,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,182,130,18,'#00aaff','#001428',2,-1,false)
      ctx.strokeStyle='rgba(0,170,255,0.3)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(182,130,28,0,Math.PI*2);ctx.stroke()
      ctx.fillStyle='#0a2030';cs(ctx,2,'#0066aa');roundRect(ctx,138,155,24,14,5,true,true)
      ctx.fillStyle='#001828';cs(ctx,2.5,'#0066aa');roundRect(ctx,110,178,80,20,6,true,true)
      ctx.strokeStyle='#0066aa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(120,188);ctx.lineTo(180,188);ctx.stroke()
      sticker(ctx,105,205,'WHALE','#0088ff','#fff',42,19);sticker(ctx,200,160,'ON-CHAIN','#00ccff','#000',52,18)
      ;[[80,70],[220,70],[75,150],[225,150],[80,220],[220,220]].forEach(([x,y])=>rivet(ctx,x,y,4))
      ctx.fillStyle='rgba(0,136,255,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#4',8,14);ctx.textAlign='right';ctx.fillText('EPIC',292,14)
    }
  },
  {
    id:'SDX-005', name:'GAS FEE GARY', rarity:'Uncommon', rarityColor:'#ff6600', bg:'#1a0a00',
    description:'Perpetually on fire from transaction fees. 9999 GWEI forever. Screaming mouth. Always.',
    traits:['Fee: Maximum','Wallet: Drained','Suffering: Legendary'],
    draw(ctx){
      ctx.fillStyle='#1a0a00';ctx.fillRect(0,0,300,300)
      splat(ctx,55,48,15,'#ff6600');splat(ctx,248,258,18,'#ff3300')
      ctx.fillStyle='#2a1200';cs(ctx,3,'#ff6600');roundRect(ctx,95,228,110,75,8,true,true)
      wire(ctx,130,235,80,278,'#ff4400',3);wire(ctx,155,235,215,272,'#ff8800',2.5)
      ;['#ff4400','#ff6600','#ff9900','#ffcc00'].forEach((c,i)=>{ctx.fillStyle=c;ctx.globalAlpha=0.7;ctx.beginPath();ctx.moveTo(120+i*18,62);ctx.quadraticCurveTo(115+i*18,42,120+i*18,28);ctx.quadraticCurveTo(125+i*18,40,120+i*18,62);ctx.fill()});ctx.globalAlpha=1
      const hg=ctx.createLinearGradient(78,55,222,215);hg.addColorStop(0,'#2a1500');hg.addColorStop(1,'#0d0600')
      ctx.fillStyle=hg;cs(ctx,3.5,'#ff6600');roundRect(ctx,78,55,144,185,16,true,true);scratches(ctx,78,55,144,185)
      ctx.fillStyle='#2a1800';cs(ctx,1.5,'#ff6600');roundRect(ctx,110,65,80,24,4,true,true)
      ctx.fillStyle='#ff3300';roundRect(ctx,113,68,60,18,2,true,false);boldText(ctx,'9999 GWEI',150,77,7,'#ffcc00','transparent')
      ctx.fillStyle='#3a1a00';cs(ctx,1,'#ff4400');roundRect(ctx,108,92,84,18,3,true,true);boldText(ctx,'SDX-005',150,101,8,'#ff6600','transparent')
      ctx.fillStyle='#200d00';cs(ctx,2.5,'#ff4400');ctx.beginPath();ctx.ellipse(118,135,22,18,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,118,135,14,'#ff6600','#1a0500',3,-2,true)
      ctx.fillStyle='#200d00';cs(ctx,2.5,'#ff4400');ctx.beginPath();ctx.ellipse(182,135,22,18,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,182,135,14,'#ff8800','#1a0500',-3,-2,true)
      ctx.fillStyle='#2a1000';cs(ctx,2,'#cc4400');roundRect(ctx,140,155,20,14,4,true,true);drip(ctx,146,168,10,'#ff6600');drip(ctx,153,168,14,'#ffaa00')
      ctx.fillStyle='#1a0800';cs(ctx,2.5,'#cc4400');ctx.beginPath();ctx.ellipse(150,182,28,20,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      ctx.fillStyle='#d0c8a0';[135,143,151,159,167].forEach(x=>{roundRect(ctx,x,174,6,10,1,true,false)})
      sticker(ctx,105,205,'BROKE','#ff3300','#fff',38,18);sticker(ctx,200,170,'GAS⛽','#ffcc00','#111',38,18)
      smoke(ctx,210,65)
      ctx.fillStyle='rgba(255,102,0,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#5',8,14);ctx.textAlign='right';ctx.fillText('UNCOMMON',292,14)
    }
  },
  {
    id:'SDX-006', name:'ALPHA SEEKER', rarity:'Rare', rarityColor:'#aa00ff', bg:'#08001a',
    description:'Three eyes see what others miss. Satellite dish harvests insider signals 24/7.',
    traits:['Eyes: Triple','Intel: Pre-mine','Network: Global'],
    draw(ctx){
      ctx.fillStyle='#08001a';ctx.fillRect(0,0,300,300)
      splat(ctx,45,50,15,'#aa00ff');splat(ctx,258,52,13,'#ff00aa')
      ctx.fillStyle='#120025';cs(ctx,3,'#aa00ff');roundRect(ctx,88,228,124,75,10,true,true)
      wire(ctx,128,235,70,278,'#aa00ff',3);wire(ctx,158,235,228,270,'#ff00aa',2.5)
      const hg=ctx.createLinearGradient(78,52,222,218);hg.addColorStop(0,'#180030');hg.addColorStop(1,'#070010')
      ctx.fillStyle=hg;cs(ctx,3.5,'#aa00ff');roundRect(ctx,78,52,144,190,16,true,true);scratches(ctx,78,52,144,190)
      splat(ctx,105,78,18,'#ff00aa');splat(ctx,188,82,14,'#00aaff')
      ctx.fillStyle='#2a0055';cs(ctx,2,'#aa00ff');ctx.beginPath();ctx.arc(150,58,22,Math.PI,Math.PI*2);ctx.fill();ctx.stroke()
      ctx.beginPath();ctx.moveTo(150,58);ctx.lineTo(150,45);ctx.stroke();ctx.fillStyle='#aa00ff';ctx.beginPath();ctx.arc(150,43,4,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='#200040';cs(ctx,1,'#8800cc');roundRect(ctx,108,62,84,18,3,true,true);boldText(ctx,'SDX-006',150,71,8,'#cc00ff','transparent')
      // 3 eyes
      ctx.fillStyle='#100020';cs(ctx,3,'#aa00ff');ctx.beginPath();ctx.arc(150,120,22,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,150,120,15,'#cc00ff','#200030',0,0,false)
      ctx.strokeStyle='rgba(170,0,255,0.3)';ctx.lineWidth=2;[26,32].forEach(r=>{ctx.beginPath();ctx.arc(150,120,r,0,Math.PI*2);ctx.stroke()})
      ctx.fillStyle='#100020';cs(ctx,2,'#aa00ff');ctx.beginPath();ctx.arc(112,118,13,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,112,118,8,'#ff00aa','#200015',-1,0,false)
      ctx.beginPath();ctx.arc(188,118,13,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,188,118,8,'#00aaff','#001520',1,0,false)
      ctx.fillStyle='#150028';cs(ctx,1.5,'#8800cc');roundRect(ctx,141,148,18,12,4,true,true)
      ctx.fillStyle='#120025';cs(ctx,2,'#8800cc');roundRect(ctx,115,170,70,18,8,true,true)
      ctx.strokeStyle='#aa00ff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(125,182);ctx.quadraticCurveTo(148,177,162,181);ctx.quadraticCurveTo(173,185,178,179);ctx.stroke()
      sticker(ctx,108,198,'ALPHA','#aa00ff','#fff',40,18);sticker(ctx,200,160,'DEGEN','#ff00aa','#fff',40,17)
      ctx.fillStyle='rgba(170,0,255,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#6',8,14);ctx.textAlign='right';ctx.fillText('RARE',292,14)
    }
  },
  {
    id:'SDX-007', name:'STAKING CHAD', rarity:'Epic', rarityColor:'#44ff88', bg:'#001a00',
    description:'The patient one. Laurel crown, solar core, 100% staked since genesis. WAGMI is his religion.',
    traits:['APR: Maximum','Patience: Infinite','Mood: Bullish'],
    draw(ctx){
      ctx.fillStyle='#001a00';ctx.fillRect(0,0,300,300)
      splat(ctx,48,48,16,'#00ff44');splat(ctx,252,255,20,'#88ff00')
      ctx.strokeStyle='rgba(0,255,68,0.08)';ctx.lineWidth=4;[60,80,100].forEach(r=>{ctx.beginPath();ctx.arc(150,140,r,0,Math.PI*2);ctx.stroke()})
      ctx.fillStyle='#001800';cs(ctx,3,'#00ff44');roundRect(ctx,88,228,124,75,10,true,true)
      ;[100,125,145,165,185,205].forEach((x,i)=>{ctx.fillStyle='#ffcc00';cs(ctx,1.5,'#aa8800');ctx.beginPath();ctx.ellipse(x,230+i%2*8,6,3,0,0,Math.PI*2);ctx.fill();ctx.stroke()})
      wire(ctx,128,238,75,282,'#00ff44',3);wire(ctx,162,238,225,278,'#88ff00',2.5)
      const hg=ctx.createLinearGradient(80,55,220,215);hg.addColorStop(0,'#002800');hg.addColorStop(1,'#000d00')
      ctx.fillStyle=hg;cs(ctx,3.5,'#00ff44');roundRect(ctx,80,55,140,185,16,true,true)
      splat(ctx,110,80,16,'#88ff00');splat(ctx,185,88,12,'#00ffcc')
      ctx.strokeStyle='#ffcc00';ctx.lineWidth=2.5;for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;ctx.save();ctx.translate(105+i*15,65);ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,0,4,8,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
      ctx.fillStyle='#ffaa00';cs(ctx,1,'#aa6600');roundRect(ctx,98,58,104,12,4,true,true)
      ctx.fillStyle='#002a00';cs(ctx,1,'#00cc33');roundRect(ctx,108,68,84,18,3,true,true);boldText(ctx,'SDX-007',150,77,8,'#00ff44','transparent')
      ctx.fillStyle='#001200';cs(ctx,2.5,'#00cc33');ctx.beginPath();ctx.ellipse(118,128,22,18,-.1,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,118,128,14,'#00ff44','#001500',1,-1,false)
      ctx.beginPath();ctx.ellipse(182,128,22,18,.1,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,182,128,14,'#88ff00','#001500',-1,-1,false)
      ctx.strokeStyle='#006622';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(105,113);ctx.lineTo(130,108);ctx.stroke();ctx.beginPath();ctx.moveTo(170,108);ctx.lineTo(195,113);ctx.stroke()
      ctx.fillStyle='#001a00';cs(ctx,1.5,'#008822');roundRect(ctx,140,152,20,14,5,true,true)
      ctx.fillStyle='#001800';cs(ctx,2.5,'#00aa33');roundRect(ctx,115,172,70,20,8,true,true)
      ctx.strokeStyle='#00ff44';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(125,180);ctx.quadraticCurveTo(150,190,175,180);ctx.stroke()
      ctx.fillStyle='#d0ffe0';[130,142,154,166].forEach(x=>{roundRect(ctx,x,174,10,12,2,true,false)})
      sticker(ctx,108,202,'STAKED','#00ff44','#000',42,18);sticker(ctx,200,160,'CHAD','#ffcc00','#111',36,18);sticker(ctx,175,208,'WAGMI','#88ff00','#111',40,17)
      ctx.fillStyle='rgba(68,255,136,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#7',8,14);ctx.textAlign='right';ctx.fillText('EPIC',292,14)
    }
  },
  {
    id:'SDX-008', name:'REKT RANGER', rarity:'Common', rarityColor:'#888', bg:'#1a1a00',
    description:'Survived 3 bear markets. Battle scarred. Big dent. Comeback arc loading...',
    traits:['PnL: -100%','Lesson: Hard','Spirit: Unbroken'],
    draw(ctx){
      ctx.fillStyle='#1a1a00';ctx.fillRect(0,0,300,300)
      splat(ctx,52,52,14,'#aaaa00');splat(ctx,250,258,18,'#ff4400')
      ctx.fillStyle='#2a2a00';cs(ctx,3,'#aaaa00');roundRect(ctx,95,228,110,75,8,true,true)
      wire(ctx,130,235,78,278,'#ff4400',2.5);wire(ctx,158,235,220,272,'#aaaa00',2)
      // Bandage
      ctx.fillStyle='#e8dfc0';ctx.save();ctx.translate(88,130);ctx.rotate(.08);ctx.fillRect(0,0,125,18);ctx.restore()
      ctx.strokeStyle='#cc8800';ctx.lineWidth=.8;ctx.setLineDash([4,2])
      ctx.save();ctx.translate(88,130);ctx.rotate(.08);for(let i=4;i<125;i+=8){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,18);ctx.stroke()}ctx.restore();ctx.setLineDash([])
      ctx.fillStyle='#cc4400';ctx.beginPath();ctx.arc(148,140,5,0,Math.PI*2);ctx.fill()
      const hg=ctx.createLinearGradient(78,55,222,215);hg.addColorStop(0,'#2a2a00');hg.addColorStop(1,'#0d0d00')
      ctx.fillStyle=hg;cs(ctx,3.5,'#888800');roundRect(ctx,78,55,144,185,16,true,true);scratches(ctx,78,55,144,185)
      ctx.fillStyle='#111100';cs(ctx,2,'#666600');ctx.beginPath();ctx.arc(210,130,22,Math.PI*.5,Math.PI*1.5);ctx.fill();ctx.stroke()
      ctx.fillStyle='#2a2800';cs(ctx,1,'#777700');roundRect(ctx,108,62,84,18,3,true,true);boldText(ctx,'SDX-008',150,71,8,'#aaaa00','transparent')
      splat(ctx,108,88,14,'#ff4400');splat(ctx,185,80,10,'#aa0000')
      boldText(ctx,'↓↓↓',150,95,18,'#ff4400','#111')
      ctx.fillStyle='#1a1800';cs(ctx,2.5,'#888800');ctx.beginPath();ctx.ellipse(115,132,20,16,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,115,132,12,'#aaaa00','#111100',0,3,true)
      ctx.fillStyle='#1a1800';cs(ctx,2.5,'#888800');ctx.beginPath();ctx.ellipse(182,132,20,16,0,0,Math.PI*2);ctx.fill();ctx.stroke()
      ctx.strokeStyle='#ff4400';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(170,122);ctx.lineTo(194,144);ctx.stroke();ctx.beginPath();ctx.moveTo(194,122);ctx.lineTo(170,144);ctx.stroke()
      ctx.fillStyle='rgba(180,180,50,0.6)';ctx.beginPath();ctx.moveTo(175,148);ctx.quadraticCurveTo(172,158,175,165);ctx.quadraticCurveTo(178,158,175,148);ctx.fill()
      ctx.fillStyle='#1a1800';cs(ctx,2.5,'#777700');roundRect(ctx,112,172,76,20,8,true,true)
      ctx.strokeStyle='#888800';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(122,185);ctx.quadraticCurveTo(150,177,178,185);ctx.stroke()
      sticker(ctx,108,200,'REKT','#ff4400','#fff',36,18);sticker(ctx,200,165,'F IN CHAT','#888800','#fff',52,17)
      ctx.fillStyle='rgba(136,136,0,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#8',8,14);ctx.textAlign='right';ctx.fillText('COMMON',292,14)
    }
  },
  {
    id:'SDX-009', name:'AIRDROP HUNTER', rarity:'Legendary', rarityColor:'#00ffff', bg:'#001818',
    description:'500 wallets. Radar dish. Squinting eyes full of strategy. Farming is an art form.',
    traits:['Wallets: 500','Radar: Active','Farming: Elite'],
    draw(ctx){
      ctx.fillStyle='#001818';ctx.fillRect(0,0,300,300)
      splat(ctx,48,48,16,'#00ffff');splat(ctx,255,255,18,'#00aaff')
      ctx.fillStyle='#001e1e';cs(ctx,3,'#00ffff');roundRect(ctx,88,228,124,75,10,true,true)
      ;['0x4a9f','0xf23b','0x8e12','0xc047'].forEach((addr,i)=>{ctx.fillStyle='rgba(0,200,200,0.4)';ctx.font='5px monospace';ctx.textAlign='left';ctx.fillText(addr,95,242+i*12)})
      wire(ctx,128,238,75,280,'#00ffff',2.5);wire(ctx,162,238,228,272,'#00aaff',2.5)
      const hg=ctx.createLinearGradient(78,50,222,218);hg.addColorStop(0,'#002a2a');hg.addColorStop(1,'#000d0d')
      ctx.fillStyle=hg;cs(ctx,3.5,'#00ffff');roundRect(ctx,78,50,144,192,16,true,true);scratches(ctx,78,50,144,192)
      splat(ctx,108,78,16,'#00aaff');splat(ctx,185,85,14,'#00ffaa')
      ctx.fillStyle='#002020';cs(ctx,2,'#00aaaa');ctx.beginPath();ctx.arc(150,58,18,0,Math.PI*2);ctx.fill();ctx.stroke()
      ctx.strokeStyle='rgba(0,255,200,0.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(150,58);ctx.lineTo(165,45);ctx.stroke();[10,5].forEach(r=>{ctx.beginPath();ctx.arc(150,58,r,0,Math.PI*2);ctx.stroke()})
      ctx.fillStyle='#00ff88';ctx.beginPath();ctx.arc(160,50,2.5,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='#002828';cs(ctx,1,'#009999');roundRect(ctx,108,65,84,18,3,true,true);boldText(ctx,'SDX-009',150,74,8,'#00ffff','transparent')
      ctx.fillStyle='#001818';cs(ctx,2.5,'#00aaaa');ctx.beginPath();ctx.ellipse(118,125,22,16,-.12,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,118,125,13,'#00ffff','#001818',-2,-2,false)
      ctx.strokeStyle='#006666';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(98,116);ctx.lineTo(138,112);ctx.stroke()
      ctx.fillStyle='#001818';cs(ctx,2.5,'#00aaaa');ctx.beginPath();ctx.ellipse(182,125,22,16,.12,0,Math.PI*2);ctx.fill();ctx.stroke()
      degenEye(ctx,182,125,13,'#00ccff','#001018',2,-2,false)
      ctx.strokeStyle='#006666';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(162,112);ctx.lineTo(202,116);ctx.stroke()
      ctx.fillStyle='#001a1a';cs(ctx,1.5,'#009999');roundRect(ctx,142,148,16,12,4,true,true)
      ctx.fillStyle='#001818';cs(ctx,2,'#009999');roundRect(ctx,115,170,70,20,8,true,true)
      ctx.strokeStyle='#00ffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(125,180);ctx.lineTo(148,188);ctx.quadraticCurveTo(163,191,178,182);ctx.stroke()
      sticker(ctx,105,200,'FARMING','#00ffff','#000',48,18);sticker(ctx,200,158,'500 WALLETS','#00aaff','#000',62,16)
      ctx.fillStyle='rgba(0,255,255,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#9',8,14);ctx.textAlign='right';ctx.fillText('LEGENDARY',292,14)
    }
  },
  {
    id:'SDX-010', name:'THE DEPLOYER', rarity:'Mythic', rarityColor:'#ffffff', bg:'#050505',
    description:'God mode. Created the protocol. White eyes see through code. The Architect of SDX.',
    traits:['Power: Creator','Contract: Genesis','Status: Divine'],
    draw(ctx){
      ctx.fillStyle='#050505';ctx.fillRect(0,0,300,300)
      ctx.save();ctx.translate(150,140);for(let i=0;i<12;i++){const a=i*Math.PI/6;const g=ctx.createLinearGradient(0,0,Math.cos(a)*180,Math.sin(a)*180);g.addColorStop(0,'rgba(255,255,200,0.06)');g.addColorStop(1,'rgba(255,255,200,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a-.1)*180,Math.sin(a-.1)*180);ctx.lineTo(Math.cos(a+.1)*180,Math.sin(a+.1)*180);ctx.fill()}ctx.restore()
      splat(ctx,50,50,16,'#ffffff');splat(ctx,252,256,18,'#aaaaaa')
      ctx.fillStyle='#080808';cs(ctx,3,'#ffffff');roundRect(ctx,88,228,124,75,10,true,true)
      ;['function deploy()','{ contract.init()','  return SDX; }'].forEach((line,i)=>{ctx.fillStyle='rgba(200,200,150,0.3)';ctx.font='5px monospace';ctx.textAlign='left';ctx.fillText(line,95,243+i*13)})
      wire(ctx,130,238,75,282,'#ffffff',2.5);wire(ctx,160,238,228,275,'#aaaaaa',2)
      const hg=ctx.createLinearGradient(78,50,222,218);hg.addColorStop(0,'#181818');hg.addColorStop(1,'#050505')
      ctx.fillStyle=hg;cs(ctx,4,'#ffffff');roundRect(ctx,78,50,144,192,16,true,true)
      ;['0xf2a','8bc3','91de','4fab'].forEach((h,i)=>{ctx.fillStyle='rgba(255,255,150,0.5)';ctx.font='5px monospace';ctx.textAlign='center';ctx.fillText(h,120+i*20,58)})
      ctx.fillStyle='#1a1a1a';cs(ctx,1,'#666666');roundRect(ctx,108,60,84,18,3,true,true);boldText(ctx,'DEPLOYER',150,69,7,'#ffffff','transparent')
      ctx.fillStyle='#0a0a0a';cs(ctx,3,'#ffffff');ctx.beginPath();ctx.arc(118,122,24,0,Math.PI*2);ctx.fill();ctx.stroke()
      const we1=ctx.createRadialGradient(118,122,0,118,122,18);we1.addColorStop(0,'#ffffff');we1.addColorStop(0.4,'#cccccc');we1.addColorStop(1,'#444444')
      ctx.fillStyle=we1;ctx.beginPath();ctx.arc(118,122,18,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='#000';ctx.beginPath();ctx.arc(118,122,8,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(112,116,4,0,Math.PI*2);ctx.fill()
      ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=2;[28,34].forEach(r=>{ctx.beginPath();ctx.arc(118,122,r,0,Math.PI*2);ctx.stroke()})
      ctx.fillStyle='#0a0a0a';cs(ctx,3,'#ffffff');ctx.beginPath();ctx.arc(182,122,24,0,Math.PI*2);ctx.fill();ctx.stroke()
      const we2=ctx.createRadialGradient(182,122,0,182,122,18);we2.addColorStop(0,'#ffffff');we2.addColorStop(0.4,'#cccccc');we2.addColorStop(1,'#444444')
      ctx.fillStyle=we2;ctx.beginPath();ctx.arc(182,122,18,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='#000';ctx.beginPath();ctx.arc(182,122,8,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(176,116,4,0,Math.PI*2);ctx.fill()
      ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=2;[28,34].forEach(r=>{ctx.beginPath();ctx.arc(182,122,r,0,Math.PI*2);ctx.stroke()})
      ctx.fillStyle='#111';cs(ctx,1.5,'#555');roundRect(ctx,141,148,18,12,5,true,true)
      ctx.fillStyle='#0a0a0a';cs(ctx,2.5,'#888');roundRect(ctx,115,172,70,18,8,true,true)
      ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(125,182);ctx.quadraticCurveTo(150,189,175,182);ctx.stroke()
      sticker(ctx,107,200,'GOD MODE','#ffffff','#000',50,18);sticker(ctx,200,162,'DEPLOYED','#ffff00','#111',52,17)
      ;[118,182].forEach(x=>{ctx.fillStyle='rgba(255,255,200,0.06)';ctx.beginPath();ctx.moveTo(x,122);ctx.lineTo(x-30,300);ctx.lineTo(x+30,300);ctx.closePath();ctx.fill()})
      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px monospace';ctx.textAlign='left';ctx.fillText('#10',8,14);ctx.textAlign='right';ctx.fillText('MYTHIC',292,14)
    }
  }
]
