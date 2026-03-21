import React, { useEffect, useRef, useState, useCallback } from 'react'
import s from '../styles/Slot.module.css'

// Draw helpers
function rr(c,x,y,w,h,r,f,st){c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();if(f)c.fill();if(st)c.stroke()}
function sp(c,x,y,r,col){c.fillStyle=col;c.globalAlpha=.85;for(let i=0;i<6;i++){const a=Math.PI*2*i/6;c.beginPath();c.arc(x+Math.cos(a)*r*.45,y+Math.sin(a)*r*.45,r*.22,0,Math.PI*2);c.fill()}c.beginPath();c.arc(x,y,r*.38,0,Math.PI*2);c.fill();c.globalAlpha=1}
function ey(c,x,y,r,ic,pc,lx=0,ly=0){c.fillStyle='#f0ede0';c.strokeStyle='#222';c.lineWidth=1.5;c.beginPath();c.ellipse(x,y,r,r*.75,0,0,Math.PI*2);c.fill();c.stroke();const ig=c.createRadialGradient(x+lx,y+ly,0,x+lx,y+ly,r*.5);ig.addColorStop(0,ic);ig.addColorStop(1,'#111');c.fillStyle=ig;c.beginPath();c.arc(x+lx,y+ly,r*.55,0,Math.PI*2);c.fill();c.fillStyle=pc;c.beginPath();c.arc(x+lx,y+ly,r*.28,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.arc(x+lx-r*.15,y+ly-r*.15,r*.13,0,Math.PI*2);c.fill()}
function sk(c,x,y,t,bg,fg){c.save();c.translate(x,y);c.fillStyle=bg;c.strokeStyle='#111';c.lineWidth=1;rr(c,-20,-9,40,18,3,true,true);c.font='bold 9px Arial';c.textAlign='center';c.textBaseline='middle';c.fillStyle=fg;c.fillText(t,0,0);c.restore()}
function wr(c,x1,y1,x2,y2,col,w=1.8){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);const mx=x1+(x2-x1)*.35+(y2>y1?.4:-.4)*10;c.quadraticCurveTo(mx,y1+(y2-y1)*.4,x2,y2);c.stroke()}
function bt(c,t,x,y,sz,fill,strk){c.font=`900 ${sz}px Arial`;c.textAlign='center';c.textBaseline='middle';c.strokeStyle=strk||'#111';c.lineWidth=sz*.15;c.lineJoin='round';c.strokeText(t,x,y);c.fillStyle=fill;c.fillText(t,x,y)}

const NFTS=[
{id:'SDX-001',name:'DIAMOND HANS',rarity:'Mythic',rc:'#00d4ff',weight:1,draw(c){c.fillStyle='#f5c500';c.fillRect(0,0,300,300);sp(c,258,40,16,'#00c8ff');const hg=c.createLinearGradient(80,55,220,210);hg.addColorStop(0,'#b0b8c8');hg.addColorStop(1,'#606878');c.fillStyle=hg;c.strokeStyle='#1a1a1a';c.lineWidth=3;rr(c,75,60,150,182,16,true,true);sp(c,130,82,20,'#cc44aa');sp(c,182,92,12,'#aa33cc');c.fillStyle='#333';c.strokeStyle='#888';c.lineWidth=3;c.beginPath();c.arc(112,128,28,0,Math.PI*2);c.fill();c.stroke();ey(c,112,128,17,'#00ee88','#003322',2,-1);const rg=c.createRadialGradient(174,118,0,174,118,9);rg.addColorStop(0,'#ff4444');rg.addColorStop(1,'#880000');c.fillStyle=rg;c.beginPath();c.arc(174,118,9,0,Math.PI*2);c.fill();c.fillStyle='#707880';c.strokeStyle='#444';c.lineWidth=2;rr(c,155,100,75,86,5,true,true);c.fillStyle='#1a1a1a';c.strokeStyle='#111';c.lineWidth=2;rr(c,98,182,104,22,5,true,true);c.fillStyle='#e8e0c8';[0,1,2,3,4,5].forEach(i=>rr(c,106+i*15,184,11,12,1,true,false));sk(c,220,200,'💎HODL','#00c8ff','#111');wr(c,132,242,252,268,'#ff4444',1.8);c.strokeStyle='#555';c.lineWidth=2;c.beginPath();c.moveTo(90,62);c.lineTo(62,22);c.stroke();c.fillStyle='#ff4444';c.beginPath();c.arc(60,20,5,0,Math.PI*2);c.fill()}},
{id:'SDX-002',name:'PAPER PETE',rarity:'Common',rc:'#aaaaaa',weight:18,draw(c){c.fillStyle='#dde8ff';c.fillRect(0,0,300,300);sp(c,48,48,13,'#ff4488');sp(c,248,255,15,'#ffaa00');const hg=c.createLinearGradient(78,62,222,210);hg.addColorStop(0,'#c8d0e0');hg.addColorStop(1,'#9aa0b0');c.fillStyle=hg;c.strokeStyle='#222';c.lineWidth=3;rr(c,78,62,144,178,14,true,true);sp(c,150,90,24,'#ff3333');bt(c,'L',150,93,22,'#fff','#800');c.fillStyle='#ccc';c.strokeStyle='#333';c.lineWidth=2;c.beginPath();c.ellipse(118,132,21,16,0,0,Math.PI*2);c.fill();c.stroke();ey(c,118,132,13,'#4488ff','#001133',-2,2);c.fillStyle='rgba(100,150,255,.65)';c.beginPath();c.moveTo(108,147);c.quadraticCurveTo(105,158,108,164);c.quadraticCurveTo(111,158,108,147);c.fill();c.fillStyle='#ccc';c.strokeStyle='#333';c.lineWidth=2;c.beginPath();c.ellipse(182,132,21,16,0,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#ff3333';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(170,122);c.lineTo(193,143);c.stroke();c.beginPath();c.moveTo(193,122);c.lineTo(170,143);c.stroke();c.fillStyle='#888';c.strokeStyle='#333';c.lineWidth=2;rr(c,118,170,64,20,7,true,true);c.strokeStyle='#555';c.lineWidth=2;c.beginPath();c.moveTo(128,185);c.quadraticCurveTo(150,177,172,185);c.stroke();sk(c,105,202,'NGMI','#ff3333','#fff');sk(c,198,178,'SOLD','#ff8800','#111')}},
{id:'SDX-003',name:'LIQ LUIGI',rarity:'Rare',rc:'#22c55e',weight:8,draw(c){c.fillStyle='#0a1a0a';c.fillRect(0,0,300,300);[0,1,2].forEach(i=>{c.fillStyle=`rgba(0,${90+i*28},${50+i*18},.12)`;c.beginPath();c.ellipse(150,255+i*14,125-i*14,28,0,0,Math.PI*2);c.fill()});sp(c,38,38,13,'#00ff88');sp(c,262,52,11,'#00aaff');c.fillStyle='#1a3025';c.strokeStyle='#00ff88';c.lineWidth=3;rr(c,90,218,120,85,10,true,true);const hg=c.createLinearGradient(80,55,220,208);hg.addColorStop(0,'#1a3028');hg.addColorStop(1,'#071510');c.fillStyle=hg;c.strokeStyle='#00ff88';c.lineWidth=3;rr(c,80,55,140,172,15,true,true);sp(c,100,82,15,'#0066ff');sp(c,192,88,13,'#cc00ff');sp(c,168,168,16,'#ffcc00');c.fillStyle='#001a0a';c.strokeStyle='#00cc66';c.lineWidth=2;c.beginPath();c.ellipse(118,130,23,19,0,0,Math.PI*2);c.fill();c.stroke();[[113,140,4,'#ff4444'],[120,134,8,'#44ff88'],[127,137,6,'#44ff88']].forEach(([x,y,h,cl])=>{c.fillStyle=cl;c.fillRect(x,y-h,3,h)});c.fillStyle='#001a0a';c.strokeStyle='#00cc66';c.lineWidth=2;c.beginPath();c.ellipse(182,130,23,19,0,0,Math.PI*2);c.fill();c.stroke();ey(c,182,130,15,'#00ff88','#002208',1,-1);c.fillStyle='#002a10';c.strokeStyle='#00cc66';c.lineWidth=2;rr(c,110,172,80,22,7,true,true);c.strokeStyle='#00cc66';c.lineWidth=2;c.beginPath();c.moveTo(118,183);c.quadraticCurveTo(150,193,180,183);c.stroke();sk(c,108,200,'LIQ PRO','#00ff88','#000');wr(c,140,228,78,270,'#00ff88',1.8);wr(c,158,228,218,264,'#0088ff',1.8)}},
{id:'SDX-004',name:'WHALE',rarity:'Epic',rc:'#0088ff',weight:4,draw(c){c.fillStyle='#001428';c.fillRect(0,0,300,300);c.fillStyle='rgba(0,80,160,.1)';c.fillRect(0,200,300,100);sp(c,48,44,14,'#0088ff');sp(c,252,258,16,'#00ccff');c.fillStyle='#0a1f30';c.strokeStyle='#0088ff';c.lineWidth=3;rr(c,85,228,130,75,10,true,true);wr(c,118,238,68,278,'#0088ff',2.2);wr(c,170,238,228,272,'#00ccff',1.8);const hg=c.createLinearGradient(72,52,228,215);hg.addColorStop(0,'#0d2035');hg.addColorStop(1,'#041020');c.fillStyle=hg;c.strokeStyle='#0088ff';c.lineWidth=3.5;rr(c,72,52,156,186,18,true,true);sp(c,150,86,18,'#0066cc');bt(c,'🐋',150,92,16,'#00ccff','#003366');c.fillStyle='#001020';c.strokeStyle='#0088ff';c.lineWidth=3;c.beginPath();c.arc(118,132,24,0,Math.PI*2);c.fill();c.stroke();ey(c,118,132,17,'#0088ff','#000428',-2,1);c.strokeStyle='rgba(0,136,255,.3)';c.lineWidth=3;c.beginPath();c.arc(118,132,28,0,Math.PI*2);c.stroke();c.fillStyle='#001020';c.strokeStyle='#0088ff';c.lineWidth=3;c.beginPath();c.arc(182,132,24,0,Math.PI*2);c.fill();c.stroke();ey(c,182,132,17,'#00aaff','#001428',2,-1);c.strokeStyle='rgba(0,170,255,.3)';c.lineWidth=3;c.beginPath();c.arc(182,132,28,0,Math.PI*2);c.stroke();c.fillStyle='#0a2030';c.strokeStyle='#0066aa';c.lineWidth=2;rr(c,138,157,24,13,5,true,true);c.fillStyle='#001828';c.strokeStyle='#0066aa';c.lineWidth=2;rr(c,108,180,80,20,5,true,true);sk(c,104,206,'WHALE','#0088ff','#fff')}},
{id:'SDX-005',name:'GAS GARY',rarity:'Uncommon',rc:'#ff6600',weight:12,draw(c){c.fillStyle='#1a0a00';c.fillRect(0,0,300,300);sp(c,53,46,14,'#ff6600');sp(c,246,255,16,'#ff3300');c.fillStyle='#2a1200';c.strokeStyle='#ff6600';c.lineWidth=3;rr(c,95,228,110,72,8,true,true);wr(c,128,234,78,276,'#ff4400',2.2);wr(c,155,234,215,270,'#ff8800',1.8);['#ff4400','#ff6600','#ff9900','#ffcc00'].forEach((cl,i)=>{c.fillStyle=cl;c.globalAlpha=.7;c.beginPath();c.moveTo(120+i*16,62);c.quadraticCurveTo(116+i*16,44,120+i*16,30);c.quadraticCurveTo(124+i*16,42,120+i*16,62);c.fill()});c.globalAlpha=1;const hg=c.createLinearGradient(78,55,222,215);hg.addColorStop(0,'#2a1500');hg.addColorStop(1,'#0d0600');c.fillStyle=hg;c.strokeStyle='#ff6600';c.lineWidth=3;rr(c,78,55,144,183,15,true,true);c.fillStyle='#2a1800';c.strokeStyle='#ff6600';c.lineWidth=1.5;rr(c,110,66,80,23,4,true,true);c.fillStyle='#ff3300';rr(c,113,69,58,16,2,true,false);bt(c,'9999G',150,77,7,'#ffcc00','transparent');c.fillStyle='#200d00';c.strokeStyle='#ff4400';c.lineWidth=2;c.beginPath();c.ellipse(118,136,21,17,0,0,Math.PI*2);c.fill();c.stroke();ey(c,118,136,13,'#ff6600','#1a0500',3,-2);c.fillStyle='#200d00';c.strokeStyle='#ff4400';c.lineWidth=2;c.beginPath();c.ellipse(182,136,21,17,0,0,Math.PI*2);c.fill();c.stroke();ey(c,182,136,13,'#ff8800','#1a0500',-3,-2);c.fillStyle='#1a0800';c.strokeStyle='#cc4400';c.lineWidth=2;c.beginPath();c.ellipse(150,182,26,19,0,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#d0c8a0';[136,144,150,158,166].forEach(x=>rr(c,x,174,6,9,1,true,false));sk(c,104,206,'BROKE','#ff3300','#fff')}},
{id:'SDX-006',name:'ALPHA',rarity:'Rare',rc:'#aa00ff',weight:8,draw(c){c.fillStyle='#08001a';c.fillRect(0,0,300,300);sp(c,44,48,13,'#aa00ff');sp(c,255,50,12,'#ff00aa');c.fillStyle='#120025';c.strokeStyle='#aa00ff';c.lineWidth=3;rr(c,88,228,124,72,10,true,true);wr(c,126,234,68,276,'#aa00ff',2.2);wr(c,156,234,226,269,'#ff00aa',1.8);const hg=c.createLinearGradient(78,52,222,218);hg.addColorStop(0,'#180030');hg.addColorStop(1,'#070010');c.fillStyle=hg;c.strokeStyle='#aa00ff';c.lineWidth=3;rr(c,78,52,144,188,15,true,true);sp(c,104,76,16,'#ff00aa');sp(c,186,80,13,'#00aaff');c.fillStyle='#2a0055';c.strokeStyle='#aa00ff';c.lineWidth=2;c.beginPath();c.arc(150,58,20,Math.PI,Math.PI*2);c.fill();c.stroke();c.beginPath();c.moveTo(150,58);c.lineTo(150,45);c.stroke();c.fillStyle='#aa00ff';c.beginPath();c.arc(150,43,4,0,Math.PI*2);c.fill();c.fillStyle='#100020';c.strokeStyle='#aa00ff';c.lineWidth=2.5;c.beginPath();c.arc(150,120,21,0,Math.PI*2);c.fill();c.stroke();ey(c,150,120,14,'#cc00ff','#200030',0,0);[112,188].forEach(ex=>{c.beginPath();c.arc(ex,118,12,0,Math.PI*2);c.fill();c.stroke();ey(c,ex,118,8,ex<150?'#ff00aa':'#00aaff','#200015',ex<150?-1:1,0)});c.fillStyle='#150028';c.strokeStyle='#8800cc';c.lineWidth=1.5;rr(c,142,148,16,11,4,true,true);c.fillStyle='#120025';c.strokeStyle='#8800cc';c.lineWidth=2;rr(c,115,170,70,18,7,true,true);c.strokeStyle='#aa00ff';c.lineWidth=1.5;c.beginPath();c.moveTo(125,182);c.quadraticCurveTo(148,177,162,181);c.quadraticCurveTo(173,185,178,179);c.stroke();sk(c,108,198,'ALPHA','#aa00ff','#fff')}},
{id:'SDX-007',name:'STAKING CHAD',rarity:'Epic',rc:'#44ff88',weight:4,draw(c){c.fillStyle='#001a00';c.fillRect(0,0,300,300);sp(c,46,46,14,'#00ff44');sp(c,250,252,18,'#88ff00');c.strokeStyle='rgba(0,255,68,.07)';c.lineWidth=4;[58,78,98].forEach(r=>{c.beginPath();c.arc(150,140,r,0,Math.PI*2);c.stroke()});c.fillStyle='#001800';c.strokeStyle='#00ff44';c.lineWidth=3;rr(c,88,228,124,73,10,true,true);[100,124,144,164,184,202].forEach((x,i)=>{c.fillStyle='#ffcc00';c.strokeStyle='#aa8800';c.lineWidth=1.5;c.beginPath();c.ellipse(x,230+i%2*7,5,2.5,0,0,Math.PI*2);c.fill();c.stroke()});wr(c,126,237,73,281,'#00ff44',2.2);wr(c,160,237,223,276,'#88ff00',1.8);const hg=c.createLinearGradient(80,55,220,213);hg.addColorStop(0,'#002800');hg.addColorStop(1,'#000d00');c.fillStyle=hg;c.strokeStyle='#00ff44';c.lineWidth=3;rr(c,80,55,140,183,15,true,true);sp(c,108,78,14,'#88ff00');sp(c,183,86,11,'#00ffcc');c.strokeStyle='#ffcc00';c.lineWidth=2.5;for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;c.save();c.translate(105+i*15,65);c.rotate(a);c.beginPath();c.ellipse(0,0,3.5,7,0,0,Math.PI*2);c.stroke();c.restore()};c.fillStyle='#ffaa00';c.strokeStyle='#aa6600';c.lineWidth=1;rr(c,98,58,104,11,4,true,true);c.fillStyle='#001200';c.strokeStyle='#00cc33';c.lineWidth=2;c.beginPath();c.ellipse(118,130,21,17,-.1,0,Math.PI*2);c.fill();c.stroke();ey(c,118,130,13,'#00ff44','#001500',1,-1);c.fillStyle='#001200';c.strokeStyle='#00cc33';c.lineWidth=2;c.beginPath();c.ellipse(182,130,21,17,.1,0,Math.PI*2);c.fill();c.stroke();ey(c,182,130,13,'#88ff00','#001500',-1,-1);c.strokeStyle='#006622';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(106,115);c.lineTo(130,110);c.stroke();c.beginPath();c.moveTo(170,110);c.lineTo(194,115);c.stroke();c.fillStyle='#001a00';c.strokeStyle='#008822';c.lineWidth=1.5;rr(c,141,152,18,13,5,true,true);c.fillStyle='#001800';c.strokeStyle='#00aa33';c.lineWidth=2;rr(c,115,172,70,19,7,true,true);c.strokeStyle='#00ff44';c.lineWidth=2;c.beginPath();c.moveTo(125,180);c.quadraticCurveTo(150,190,175,180);c.stroke();c.fillStyle='#d0ffe0';[130,142,154,166].forEach(x=>rr(c,x,174,10,11,1,true,false));sk(c,108,202,'STAKED','#00ff44','#000');sk(c,200,160,'CHAD','#ffcc00','#111')}},
{id:'SDX-008',name:'REKT RANGER',rarity:'Common',rc:'#888888',weight:18,draw(c){c.fillStyle='#1a1a00';c.fillRect(0,0,300,300);sp(c,50,50,12,'#aaaa00');sp(c,248,255,16,'#ff4400');c.fillStyle='#2a2a00';c.strokeStyle='#aaaa00';c.lineWidth=3;rr(c,95,228,110,73,8,true,true);wr(c,128,234,76,276,'#ff4400',1.8);wr(c,156,234,218,270,'#aaaa00',1.8);c.fillStyle='#e8dfc0';c.save();c.translate(88,132);c.rotate(.07);c.fillRect(0,0,122,17);c.restore();c.strokeStyle='#cc8800';c.lineWidth=.8;c.setLineDash([4,2]);c.save();c.translate(88,132);c.rotate(.07);for(let i=4;i<122;i+=8){c.beginPath();c.moveTo(i,0);c.lineTo(i,17);c.stroke()}c.restore();c.setLineDash([]);c.fillStyle='#cc4400';c.beginPath();c.arc(148,141,4,0,Math.PI*2);c.fill();const hg=c.createLinearGradient(78,55,222,215);hg.addColorStop(0,'#2a2a00');hg.addColorStop(1,'#0d0d00');c.fillStyle=hg;c.strokeStyle='#888800';c.lineWidth=3;rr(c,78,55,144,183,15,true,true);c.fillStyle='#111100';c.strokeStyle='#666600';c.lineWidth=2;c.beginPath();c.arc(208,131,21,Math.PI*.5,Math.PI*1.5);c.fill();c.stroke();sp(c,107,86,13,'#ff4400');bt(c,'↓↓↓',150,94,17,'#ff4400','#111');c.fillStyle='#1a1800';c.strokeStyle='#888800';c.lineWidth=2;c.beginPath();c.ellipse(115,133,19,15,0,0,Math.PI*2);c.fill();c.stroke();ey(c,115,133,11,'#aaaa00','#111100',0,3);c.fillStyle='#1a1800';c.strokeStyle='#888800';c.lineWidth=2;c.beginPath();c.ellipse(182,133,19,15,0,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#ff4400';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(170,123);c.lineTo(193,144);c.stroke();c.beginPath();c.moveTo(193,123);c.lineTo(170,144);c.stroke();c.fillStyle='#1a1800';c.strokeStyle='#777700';c.lineWidth=2;rr(c,112,173,76,19,7,true,true);c.strokeStyle='#888800';c.lineWidth=2;c.beginPath();c.moveTo(122,186);c.quadraticCurveTo(150,178,178,186);c.stroke();sk(c,108,201,'REKT','#ff4400','#fff')}},
{id:'SDX-009',name:'AIRDROP HUNTER',rarity:'Legendary',rc:'#00ffff',weight:2,draw(c){c.fillStyle='#001818';c.fillRect(0,0,300,300);sp(c,46,46,14,'#00ffff');sp(c,252,252,16,'#00aaff');c.fillStyle='#001e1e';c.strokeStyle='#00ffff';c.lineWidth=3;rr(c,88,228,124,73,10,true,true);['0x4a9f','0xf23b','0x8e12'].forEach((a,i)=>{c.fillStyle='rgba(0,200,200,.4)';c.font='5px monospace';c.textAlign='left';c.fillText(a,95,244+i*11)});wr(c,126,237,73,279,'#00ffff',2);wr(c,160,237,226,270,'#00aaff',1.8);const hg=c.createLinearGradient(78,50,222,218);hg.addColorStop(0,'#002a2a');hg.addColorStop(1,'#000d0d');c.fillStyle=hg;c.strokeStyle='#00ffff';c.lineWidth=3;rr(c,78,50,144,190,15,true,true);sp(c,106,76,14,'#00aaff');sp(c,183,83,12,'#00ffaa');c.fillStyle='#002020';c.strokeStyle='#00aaaa';c.lineWidth=2;c.beginPath();c.arc(150,58,17,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='rgba(0,255,200,.5)';c.lineWidth=1.5;c.beginPath();c.moveTo(150,58);c.lineTo(164,45);c.stroke();[10,5].forEach(r=>{c.beginPath();c.arc(150,58,r,0,Math.PI*2);c.stroke()});c.fillStyle='#00ff88';c.beginPath();c.arc(159,50,2,0,Math.PI*2);c.fill();c.fillStyle='#001818';c.strokeStyle='#00aaaa';c.lineWidth=2;c.beginPath();c.ellipse(118,126,21,15,-.12,0,Math.PI*2);c.fill();c.stroke();ey(c,118,126,12,'#00ffff','#001818',-2,-2);c.strokeStyle='#006666';c.lineWidth=1.5;c.beginPath();c.moveTo(98,117);c.lineTo(138,113);c.stroke();c.fillStyle='#001818';c.strokeStyle='#00aaaa';c.lineWidth=2;c.beginPath();c.ellipse(182,126,21,15,.12,0,Math.PI*2);c.fill();c.stroke();ey(c,182,126,12,'#00ccff','#001018',2,-2);c.strokeStyle='#006666';c.lineWidth=1.5;c.beginPath();c.moveTo(162,113);c.lineTo(202,117);c.stroke();c.fillStyle='#001a1a';c.strokeStyle='#009999';c.lineWidth=1.5;rr(c,142,148,16,11,4,true,true);c.fillStyle='#001818';c.strokeStyle='#009999';c.lineWidth=2;rr(c,115,170,70,19,7,true,true);c.strokeStyle='#00ffff';c.lineWidth=2;c.beginPath();c.moveTo(125,180);c.lineTo(148,187);c.quadraticCurveTo(163,190,178,182);c.stroke();sk(c,105,200,'FARMING','#00ffff','#000')}},
{id:'SDX-010',name:'THE DEPLOYER',rarity:'Mythic',rc:'#ffffff',weight:1,draw(c){c.fillStyle='#050505';c.fillRect(0,0,300,300);c.save();c.translate(150,140);for(let i=0;i<12;i++){const a=i*Math.PI/6;const g=c.createLinearGradient(0,0,Math.cos(a)*175,Math.sin(a)*175);g.addColorStop(0,'rgba(255,255,200,.06)');g.addColorStop(1,'rgba(255,255,200,0)');c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a-.1)*175,Math.sin(a-.1)*175);c.lineTo(Math.cos(a+.1)*175,Math.sin(a+.1)*175);c.fill()}c.restore();sp(c,48,48,14,'#ffffff');sp(c,250,253,16,'#aaaaaa');c.fillStyle='#080808';c.strokeStyle='#ffffff';c.lineWidth=3;rr(c,88,228,124,73,10,true,true);['fn deploy()','{ SDX() }'].forEach((l,i)=>{c.fillStyle='rgba(200,200,150,.28)';c.font='6px monospace';c.textAlign='left';c.fillText(l,95,244+i*14)});wr(c,128,237,73,281,'#ffffff',2);wr(c,158,237,226,273,'#aaaaaa',1.8);const hg=c.createLinearGradient(78,50,222,218);hg.addColorStop(0,'#181818');hg.addColorStop(1,'#050505');c.fillStyle=hg;c.strokeStyle='#ffffff';c.lineWidth=3.5;rr(c,78,50,144,190,15,true,true);['0xf2a','8bc3','91de'].forEach((h,i)=>{c.fillStyle='rgba(255,255,150,.45)';c.font='5px monospace';c.textAlign='center';c.fillText(h,120+i*22,57)});c.fillStyle='#0a0a0a';c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();c.arc(118,122,23,0,Math.PI*2);c.fill();c.stroke();const we1=c.createRadialGradient(118,122,0,118,122,17);we1.addColorStop(0,'#fff');we1.addColorStop(.4,'#ccc');we1.addColorStop(1,'#444');c.fillStyle=we1;c.beginPath();c.arc(118,122,17,0,Math.PI*2);c.fill();c.fillStyle='#000';c.beginPath();c.arc(118,122,8,0,Math.PI*2);c.fill();c.fillStyle='white';c.beginPath();c.arc(113,117,3.5,0,Math.PI*2);c.fill();c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=2;[27,33].forEach(r=>{c.beginPath();c.arc(118,122,r,0,Math.PI*2);c.stroke()});c.fillStyle='#0a0a0a';c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();c.arc(182,122,23,0,Math.PI*2);c.fill();c.stroke();const we2=c.createRadialGradient(182,122,0,182,122,17);we2.addColorStop(0,'#fff');we2.addColorStop(.4,'#ccc');we2.addColorStop(1,'#444');c.fillStyle=we2;c.beginPath();c.arc(182,122,17,0,Math.PI*2);c.fill();c.fillStyle='#000';c.beginPath();c.arc(182,122,8,0,Math.PI*2);c.fill();c.fillStyle='white';c.beginPath();c.arc(177,117,3.5,0,Math.PI*2);c.fill();c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=2;[27,33].forEach(r=>{c.beginPath();c.arc(182,122,r,0,Math.PI*2);c.stroke()});c.fillStyle='#111';c.strokeStyle='#555';c.lineWidth=1.5;rr(c,141,148,18,12,5,true,true);c.fillStyle='#0a0a0a';c.strokeStyle='#888';c.lineWidth=2;rr(c,115,172,70,18,7,true,true);c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.moveTo(125,182);c.quadraticCurveTo(150,189,175,182);c.stroke();sk(c,107,200,'GOD MODE','#fff','#000');sk(c,200,162,'DEPLOYED','#ffff00','#111');[118,182].forEach(x=>{c.fillStyle='rgba(255,255,200,.05)';c.beginPath();c.moveTo(x,122);c.lineTo(x-28,300);c.lineTo(x+28,300);c.closePath();c.fill()})}}
]

const LETTERS=[
  {id:'A', label:'A', color:'#ff4444', bgC:'#2a0808', borderC:'#ff444444'},
  {id:'K', label:'K', color:'#ff8800', bgC:'#2a1400', borderC:'#ff880044'},
  {id:'Q', label:'Q', color:'#cc44ff', bgC:'#1a0828', borderC:'#cc44ff44'},
  {id:'J', label:'J', color:'#4488ff', bgC:'#081428', borderC:'#4488ff44'},
  {id:'10',label:'10',color:'#22cc66', bgC:'#081a0e', borderC:'#22cc6644'},
]
const PAYLINES=[[1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],[1,0,1,0,1],[1,2,1,2,1],[0,0,0,1,2],[2,2,2,1,0],[0,1,2,2,2],[2,1,0,0,0],[0,1,1,2,2],[2,1,1,0,0],[1,1,0,1,1]]
const PLC=['#22c55e','#00d4ff','#f59e0b','#ff4488','#aa66ff','#ff8800','#44aaff','#ff4444','#88ff44','#ffcc00','#00ffcc','#ff44aa','#4488ff','#ff6600','#00aaff','#cc44ff','#ffaa00','#44ffaa','#ff6644','#88aaff']
const WEEK_MS=7*24*60*60*1000, MAX_SPINS=50, COLS=5, ROWS=3

const NFT_IMGS={}
function getNFTImg(n){if(NFT_IMGS[n.id])return NFT_IMGS[n.id];const cv=document.createElement('canvas');cv.width=cv.height=300;try{n.draw(cv.getContext('2d'))}catch(e){};NFT_IMGS[n.id]=cv.toDataURL();return NFT_IMGS[n.id]}

const REEL_POOL=[]; LETTERS.forEach(l=>{for(let i=0;i<18;i++)REEL_POOL.push(l)}); NFTS.forEach(n=>{for(let i=0;i<n.weight;i++)REEL_POOL.push(n)})
const NFT_POOL=[]; NFTS.forEach(n=>{for(let i=0;i<n.weight;i++)NFT_POOL.push(n)})
function randSym(){return REEL_POOL[Math.floor(Math.random()*REEL_POOL.length)]}
function genToken(n){return `IOU-${n.id}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`}

function loadSt(acc){try{const d=JSON.parse(localStorage.getItem(`sdx_slot_v5_${acc||'x'}`)||'null');if(!d)return null;return Date.now()-d.weekStart>=WEEK_MS?{weekStart:Date.now(),spinsUsed:0,wins:d.wins||[]}:d}catch{return null}}
function saveSt(acc,d){localStorage.setItem(`sdx_slot_v5_${acc||'x'}`,JSON.stringify(d))}

function CircSym({sym,size=78,hl=false,wc=''}){
  const [src,setSrc]=useState('')
  useEffect(()=>{if(sym?.draw)setSrc(getNFTImg(sym))},[sym?.id])
  const style=hl?{borderColor:wc,boxShadow:`0 0 14px ${wc},0 0 28px ${wc}44`,animation:'winPop .4s ease infinite alternate'}:{}
  if(!sym)return <div className={s.circSym} style={{width:size,height:size}}/>
  if(sym.draw)return <div className={s.circSym} style={{width:size,height:size,...style}}>{src&&<img src={src} alt={sym.name||''} style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover',display:'block'}}/>}</div>
  return <div className={s.circSymLetter} style={{width:size,height:size,background:sym.bgC,color:sym.color,borderColor:sym.borderC,fontSize:size*.32,...style}}>{sym.label}</div>
}

export default function SlotMachine({account}){
  const [grid,setGrid]=useState(()=>Array.from({length:COLS},()=>Array.from({length:ROWS},randSym)))
  const [spinning,setSpinning]=useState(false)
  const [spinningCols,setSpinningCols]=useState([])
  const [spinsUsed,setSpinsUsed]=useState(0)
  const [weekStart,setWeekStart]=useState(Date.now())
  const [wins,setWins]=useState([])
  const [winInfo,setWinInfo]=useState(null)
  const [showWin,setShowWin]=useState(false)
  const [winCells,setWinCells]=useState([])
  const [winColor,setWinColor]=useState('')
  const [activePL,setActivePL]=useState([])
  const [timeStr,setTimeStr]=useState('')
  const [copied,setCopied]=useState({})

  useEffect(()=>{
    const d=loadSt(account)
    if(d){setSpinsUsed(d.spinsUsed||0);setWeekStart(d.weekStart);setWins(d.wins||[])}
    NFTS.forEach(n=>getNFTImg(n))
  },[account])

  useEffect(()=>{
    const tick=()=>{
      const rem=Math.max(0,weekStart+WEEK_MS-Date.now())
      const d=Math.floor(rem/86400000),h=Math.floor((rem%86400000)/3600000),m=Math.floor((rem%3600000)/60000)
      setTimeStr(d>0?`${d}d ${h}h`:`${h}h ${m}m`)
      if(rem<=0){setWeekStart(Date.now());setSpinsUsed(0)}
    }
    tick();const t=setInterval(tick,10000);return()=>clearInterval(t)
  },[weekStart])

  const spinsLeft=Math.max(0,MAX_SPINS-spinsUsed)

  const doSpin=useCallback(async()=>{
    if(spinning||spinsLeft<=0)return
    setSpinning(true);setShowWin(false);setWinCells([]);setActivePL([]);setWinColor('')
    const isWin=Math.random()<0.005
    let winNFT=null,winPLIdx=-1
    if(isWin){winNFT=NFT_POOL[Math.floor(Math.random()*NFT_POOL.length)];winPLIdx=Math.floor(Math.random()*PAYLINES.length)}
    const finalGrid=Array.from({length:COLS},()=>Array.from({length:ROWS},randSym))
    if(isWin)PAYLINES[winPLIdx].forEach((row,col)=>{finalGrid[col][row]=winNFT})
    for(let col=0;col<COLS;col++){
      const delay=col*200,dur=650+col*130
      await new Promise(res=>setTimeout(res,delay))
      setSpinningCols(p=>[...p,col])
      const start=Date.now()
      await new Promise(res=>{
        const iv=setInterval(()=>{
          setGrid(g=>{const ng=g.map(c=>[...c]);ng[col]=Array.from({length:ROWS},randSym);return ng})
          if(Date.now()-start>=dur){
            clearInterval(iv)
            setSpinningCols(p=>p.filter(c=>c!==col))
            setGrid(g=>{const ng=g.map(c=>[...c]);ng[col]=finalGrid[col];return ng})
            res()
          }
        },55)
      })
    }
    const newUsed=spinsUsed+1;setSpinsUsed(newUsed)
    if(isWin&&winNFT){
      const cells=PAYLINES[winPLIdx].map((row,col)=>({col,row}))
      setWinCells(cells);setWinColor(winNFT.rc);setActivePL([winPLIdx])
      const token=genToken(winNFT)
      const win={id:Date.now(),nft:winNFT,token,payline:winPLIdx+1,ts:new Date().toLocaleString()}
      setWinInfo(win);setShowWin(true)
      const nw=[win,...wins];setWins(nw)
      saveSt(account,{weekStart,spinsUsed:newUsed,wins:nw})
    } else {
      let best=-1,bestC=0
      PAYLINES.forEach((pl,li)=>{const syms=pl.map((r,c)=>finalGrid[c][r]);const m=syms.find(s=>s.draw);if(!m)return;const cnt=syms.filter(s=>s.id===m.id).length;if(cnt>bestC){bestC=cnt;best=li}})
      if(bestC>=2&&best>=0)setActivePL([best])
      saveSt(account,{weekStart,spinsUsed:newUsed,wins})
    }
    setSpinning(false)
  },[spinning,spinsLeft,spinsUsed,weekStart,wins,account])

  const isWC=(c,r)=>winCells.some(w=>w.col===c&&w.row===r)
  const cpDc=(w,i)=>{const msg=`🎰 I won **${w.nft.name}** (${w.nft.rarity}) on SOLODEX Degen Slots!\n🎫 Token: \`${w.token}\`\n📅 ${w.ts}\n\nRedeem at mainnet launch!`;navigator.clipboard.writeText(msg).then(()=>{setCopied(p=>({...p,[i]:true}));setTimeout(()=>setCopied(p=>({...p,[i]:false})),2000)}).catch(()=>{})}

  return (
    <div className={s.slotWrap}>
      <div className={s.slotHeader}>
        <div><h2 className={s.slotTitle}>DEGEN SLOTS</h2><p className={s.slotSub}>SOLODEX Genesis · NFT Jackpot · 20 Paylines</p></div>
        <div className={s.slotStats}>
          <div className={s.statBox}><span className={s.statNum}>{spinsLeft}</span><span className={s.statLbl}>Spins</span></div>
          <div className={s.statBox}><span className={s.statNum} style={{color:'var(--amber)'}}>{timeStr}</span><span className={s.statLbl}>Reset</span></div>
          <div className={s.statBox}><span className={s.statNum} style={{color:'var(--gold)'}}>{wins.length}</span><span className={s.statLbl}>Wins</span></div>
        </div>
      </div>

      <div className={s.slotBody}>
        {/* Machine */}
        <div>
          <div className={s.machineWrap}>
            <div className={s.plCol}>{PAYLINES.slice(0,10).map((_,i)=><div key={i} className={`${s.plNum} ${activePL.includes(i)?s.plActive:''}`} style={{background:PLC[i]+'22',color:PLC[i],borderColor:activePL.includes(i)?PLC[i]:PLC[i]+'44'}}>{i+1}</div>)}</div>
            <div className={s.reelsFrame}>
              {showWin&&winInfo&&(
                <div className={s.winOverlay}>
                  <div className={s.winEmoji}>🎰</div>
                  <div className={s.winJackpot}>JACKPOT!</div>
                  <div className={s.winNftName}>{winInfo.nft.name}</div>
                  <div className={s.winRarity} style={{color:winInfo.nft.rc}}>{winInfo.nft.rarity}</div>
                  <div className={s.winToken}>{winInfo.token}</div>
                  <button className={s.winCloseBtn} onClick={()=>setShowWin(false)}>CLAIM &amp; CONTINUE ▶</button>
                </div>
              )}
              <div className={s.reels}>
                {grid.map((col,ci)=>(
                  <div key={ci} className={`${s.reel} ${spinningCols.includes(ci)?s.reelSpinning:''}`}>
                    <div className={s.reelBlurTop}/>
                    {col.map((sym,ri)=><div key={ri} className={s.reelCell}><CircSym sym={sym} size={78} hl={isWC(ci,ri)} wc={winColor}/></div>)}
                    <div className={s.reelBlurBot}/>
                  </div>
                ))}
              </div>
              {activePL.length>0&&<div className={s.plHighlightBar} style={{top:activePL[0]===0?'33%':activePL[0]===2?'66%':'50%',background:`linear-gradient(90deg,transparent,${PLC[activePL[0]]}55,transparent)`,borderTopColor:PLC[activePL[0]]+'88',borderBottomColor:PLC[activePL[0]]+'88'}}/>}
            </div>
            <div className={s.plCol}>{PAYLINES.slice(10,20).map((_,i)=><div key={i+10} className={`${s.plNum} ${activePL.includes(i+10)?s.plActive:''}`} style={{background:PLC[i+10]+'22',color:PLC[i+10],borderColor:activePL.includes(i+10)?PLC[i+10]:PLC[i+10]+'44'}}>{i+11}</div>)}</div>
          </div>

          <div className={s.spinArea}>
            <div className={s.spinRow}>
              <div className={s.infoChip}><span>WIN CHANCE</span><strong>0.5%</strong></div>
              <button className={`${s.spinBtn} ${spinning?s.spinBtnGoing:''} ${spinsLeft===0?s.spinBtnEmpty:''}`} onClick={doSpin} disabled={spinning||spinsLeft===0}>
                {spinning?'◈  SPINNING...':spinsLeft===0?`RESETS ${timeStr}`:'SPIN'}
              </button>
              <div className={s.infoChip}><span>JACKPOT</span><strong style={{color:'var(--gold)'}}>NFT 🎯</strong></div>
            </div>
            <p className={s.spinNote}>Letters are filler — match 3+ NFT circles on a payline to win · {MAX_SPINS} free spins/week</p>
          </div>

          <div className={s.paytable}>
            <div className={s.ptTitle}>Paytable</div>
            <div className={s.ptGrid}>
              {LETTERS.map(l=><div key={l.id} className={s.ptItem}><div className={s.ptCircLetter} style={{background:l.bgC,color:l.color,borderColor:l.borderC}}>{l.label}</div><span className={s.ptLbl} style={{color:'#446644'}}>filler</span></div>)}
              {NFTS.map(n=><div key={n.id} className={s.ptItem}><div className={s.ptCircNFT} style={{borderColor:n.rc+'66'}}><img src={getNFTImg(n)} alt={n.name} style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}}/></div><span className={s.ptLbl} style={{color:n.rc}}>{n.rarity.slice(0,4)}</span></div>)}
            </div>
          </div>
        </div>

        {/* Win panel */}
        <div className={s.winPanel}>
          <h3 className={s.winPanelTitle}>Win History</h3>
          <p className={s.winPanelSub}>Click token to copy · Share on Discord to claim mainnet NFT</p>
          {wins.length===0&&<div className={s.winEmpty}>No wins yet 🎰<br/><span>0.5% per spin · 50 spins/week</span></div>}
          {wins.map((w,i)=>(
            <div key={w.id} className={`${s.winCard} ${i===0?s.winCardFresh:''}`}>
              <div className={s.winCardTop}><span className={s.winCardName}>{w.nft.name}</span><span className={s.winCardRarity} style={{color:w.nft.rc,borderColor:w.nft.rc+'44'}}>{w.nft.rarity}</span></div>
              <div className={s.winCardToken} onClick={()=>navigator.clipboard.writeText(w.token).catch(()=>{})}>{w.token}</div>
              <div className={s.winCardBot}>
                <span className={s.winCardDate}>📅 {w.ts} · L{w.payline}</span>
                <button className={`${s.copyDiscordBtn} ${copied[i]?s.copyDiscordOk:''}`} onClick={()=>cpDc(w,i)}>{copied[i]?'✓ Copied!':'Copy for Discord'}</button>
              </div>
            </div>
          ))}
          {wins.length>0&&<button className={s.clearBtn} onClick={()=>{if(window.confirm('Clear all win history?')){setWins([]);saveSt(account,{weekStart,spinsUsed,wins:[]})}}}>Clear History</button>}
        </div>
      </div>
    </div>
  )
}
