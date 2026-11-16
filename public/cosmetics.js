(()=>{
 const C=window.CU_COSMETICS,byId=new Map(C.items.map(i=>[i.id,i]));
 function draw(ctx,look={},w=90,h=110,time=0,reaction={}){
  const find=id=>byId.get(id)||window.CUPassRules?.itemById(id);const skin=(find(look.skin)?.type==='skin'?find(look.skin):C.items[0]),hat=(find(look.head)?.type==='head'?find(look.head):C.items[1]),tier=Math.max(C.rarities.findIndex(r=>r.id===skin.rarity),hat.id==='none'?0:C.rarities.findIndex(r=>r.id===hat.rarity)),ultimate=skin.id==='afterlight',pulse=(Math.sin(time*3)+1)/2,energy=reaction.chasing?1.5:reaction.moving?1.15:1;
  ctx.save();ctx.scale(w,h);const fill=(color,x,y,ww,hh,r=.02)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,ww,hh,r);ctx.fill();},line=(color,points,width=.018)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
  if(tier>=4){ctx.save();ctx.globalAlpha=(.12+pulse*.1)*energy;ctx.strokeStyle=skin.accent;ctx.lineWidth=.025;ctx.beginPath();ctx.ellipse(0,.05,.48+pulse*.05,.52,Math.sin(time)*.15,0,Math.PI*2);ctx.stroke();ctx.restore();for(let i=0;i<Math.min(12,tier+2);i++){const a=time*(.55+i*.02)+i*2.4;ctx.globalAlpha=.35+pulse*.25;fill(i%2?skin.color:hat.id==='none'?skin.accent:hat.accent,Math.cos(a)*.46,-.12+Math.sin(a)*.45,.025,.025,.01);}ctx.globalAlpha=1;}
  if(tier>=5){ctx.save();for(let i=0;i<7;i++){const phase=time*(.4+i*.03)+i;ctx.globalAlpha=((tier>=7?.085:tier>=6?.065:.04)+pulse*.035)*energy;ctx.fillStyle=i%2?skin.accent:skin.color;ctx.beginPath();ctx.ellipse(Math.sin(phase)*.19,.35-Math.abs(Math.cos(phase))*.55,.3,.18,phase,0,Math.PI*2);ctx.fill();}ctx.restore();}
  if(ultimate){ctx.save();ctx.globalAlpha=.26;const g=ctx.createLinearGradient(-.5,-.7,.5,.6);g.addColorStop(0,'#79fff0');g.addColorStop(.35,'#ad90ff');g.addColorStop(.7,'#ffb5dd');g.addColorStop(1,'#fff1a0');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-.2,-.16);ctx.lineTo(-.48,.48);ctx.lineTo(0,.36);ctx.lineTo(.48,.48);ctx.lineTo(.2,-.16);ctx.fill();ctx.globalAlpha=.55;for(const side of [-1,1])for(let shard=0;shard<3;shard++){const y=-.2+shard*.16;ctx.beginPath();ctx.moveTo(side*.25,y);ctx.lineTo(side*(.52+Math.sin(time+shard)*.04),y-.12);ctx.lineTo(side*.42,y+.16);ctx.lineTo(side*.3,y+.08);ctx.fill();}ctx.globalAlpha=.9;ctx.strokeStyle=g;ctx.lineWidth=.024;for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(0,-.62,.32+i*.07,.06,(i?1:-1)*Math.sin(time)*.3,0,Math.PI*2);ctx.stroke();}ctx.restore();}
  fill('#182331',-.25,.27,.19,.3);fill('#182331',.06,.27,.19,.3);fill(skin.accent,-.27,.51,.23,.09);fill(skin.accent,.04,.51,.23,.09);
  fill(skin.color,-.37,-.17,.14,.46,.055);fill(skin.color,.23,-.17,.14,.46,.055);fill('#cfa98a',-.37,.23,.14,.09);fill('#cfa98a',.23,.23,.14,.09);
  const body=ultimate?ctx.createLinearGradient(-.27,-.2,.27,.36):skin.color;if(ultimate){body.addColorStop(0,'#3a286c');body.addColorStop(.4,'#71ddd6');body.addColorStop(.7,'#55538f');body.addColorStop(1,'#dd91e2');}if(ultimate){ctx.shadowColor='#9afff0';ctx.shadowBlur=12;}fill(body,-.27,-.22,.54,.57,.06);ctx.shadowBlur=0;
  if(skin.variant){for(let stripe=0;stripe<skin.variant;stripe++)line(skin.accent,[[-.2,-.14+stripe*.045],[.2,-.14+stripe*.045]],.009);}
  const accent=tier>=3&&pulse>.4?skin.accent:'#acbcc7';line(accent,[[-.24,-.18],[-.24,.31],[.24,.31],[.24,-.18]],tier>=3?.025:.012);
  if(skin.source==='pass'){line(skin.accent,[[-.22,.13],[-.11,.06],[0,.13],[.11,.06],[.22,.13]],.025);ctx.fillStyle=skin.accent;ctx.beginPath();ctx.moveTo(0,-.18);ctx.lineTo(.07,-.09);ctx.lineTo(0,0);ctx.lineTo(-.07,-.09);ctx.closePath();ctx.fill();}
  if(skin.pattern===0){fill(skin.accent,-.25,-.17,.5,.065);fill('#152431',-.1,.06,.2,.09);}
  if(skin.pattern===1){for(let i=0;i<4;i++)line(skin.accent,[[-.19+i*.12,-.17],[-.19+i*.12,-.04],[-.14+i*.12,.01],[-.14+i*.12,.22]],.012);}
  if(skin.pattern===2){fill('#25313c',-.22,.05,.16,.16);fill('#25313c',.06,.05,.16,.16);line(skin.accent,[[0,-.22],[0,.33]],.035);}
  if(skin.pattern===3){fill('#15202c',-.11,-.2,.22,.48);line(skin.accent,[[-.2,-.14],[0,.03],[.2,-.14]],.028);}
  if(skin.pattern===4||ultimate){for(let i=0;i<10;i++)fill(i%2?skin.accent:'#e5ecff',Math.sin(i*8.3)*.2,-.15+(i%5)*.09,.015+(ultimate?.008:0),.015,.004);}
  if(skin.pattern===5||ultimate){ctx.fillStyle=skin.accent;ctx.beginPath();ctx.moveTo(0,-.14);ctx.lineTo(.13,-.02);ctx.lineTo(0,.18);ctx.lineTo(-.13,-.02);ctx.fill();fill('#253044',-.035,-.025,.07,.08);}
  fill('#cfa98a',-.22,-.58,.44,.36,.08);fill('#342f38',-.23,-.61,.46,.09,.04);fill('#24323c',-.13,-.43,.045,.035,.007);fill('#24323c',.085,-.43,.045,.035,.007);line('#8f6355',[[-.055,-.3],[.055,-.3]],.012);
  if(hat.id!=='none'){const c=hat.color,a=hat.accent;
   if(hat.shape==='beanie'){fill(c,-.24,-.7,.48,.15,.09);fill(a,-.25,-.59,.5,.055);}
   if(hat.shape==='cap'){fill(c,-.24,-.67,.48,.13,.08);fill(a,-.29,-.57,.63,.04);}
   if(hat.shape==='top_hat'){fill(c,-.18,-.78,.36,.23);fill(a,-.3,-.57,.6,.045);fill(a,-.18,-.63,.36,.04);}
   if(hat.shape==='crown'){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-.25,-.55);ctx.lineTo(-.26,-.76);ctx.lineTo(-.1,-.65);ctx.lineTo(0,-.8);ctx.lineTo(.1,-.65);ctx.lineTo(.26,-.76);ctx.lineTo(.25,-.55);ctx.fill();fill(a,-.035,-.64,.07,.07);}
   if(hat.shape==='horns'||hat.shape==='antlers'){for(const sign of [-1,1]){line(c,[[sign*.16,-.55],[sign*.29,-.68],[sign*.25,-.79]],.06);if(hat.shape==='antlers')line(a,[[sign*.27,-.7],[sign*.4,-.75],[sign*.39,-.81]],.025);}}
   if(hat.shape==='halo'){ctx.strokeStyle=a;ctx.lineWidth=.045;ctx.beginPath();ctx.ellipse(0,-.73,.29,.065,Math.sin(time)*.1,0,Math.PI*2);ctx.stroke();}
   if(hat.shape==='visor'){fill(c,-.245,-.48,.49,.1,.025);fill(a,-.18,-.46,.32,.025);}
   if(hat.shape==='headphones'){line(c,[[-.26,-.38],[-.26,-.65],[.26,-.65],[.26,-.38]],.045);fill(a,-.3,-.47,.1,.16);fill(a,.2,-.47,.1,.16);}
   if(hat.shape==='wizard_hat'){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-.26,-.57);ctx.lineTo(.04,-.82);ctx.lineTo(.24,-.57);ctx.fill();fill(a,-.3,-.58,.6,.04);}
  }
  window.HandItems?.draw(ctx,look.hand,.36,.22,.44,time);
  ctx.restore();
 }
 function preview(canvas,look,time=0){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(canvas.width/2,canvas.height*.6);draw(ctx,look,canvas.width*.4,canvas.height*.53,time,{moving:true});ctx.restore();}
 window.Cosmetics={draw,preview,catalog:C};
})();
