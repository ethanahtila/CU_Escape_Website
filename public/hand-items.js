(()=>{
 'use strict';
 const catalog=new Map((window.CU_COSMETICS?.items||[]).map(i=>[i.id,i]));
 function item(id){return catalog.get(id)||window.CUPassRules?.itemById(id);}
 function draw(ctx,id,x,y,size,time=0){const o=item(id);if(!o||o.type!=='hand'||o.id==='emptyhand')return;ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.lineWidth=.045;ctx.lineJoin='round';const box=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);},line=(p,c=o.accent,w=.04)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();},circle=(x,y,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();},poly=(p,c)=>{ctx.fillStyle=c;ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();};
  const tier=window.CU_COSMETICS.rarities.findIndex(r=>r.id===o.rarity);if(tier>=4){ctx.shadowColor=o.accent;ctx.shadowBlur=5+tier;}
  if(o.shape==='lantern'){line([[-.19,-.42],[-.19,-.58],[.19,-.58],[.19,-.42]]);box(-.25,-.4,.5,.65,o.color);box(-.17,-.3,.34,.43,o.accent);box(-.3,-.44,.6,.09,o.color);box(-.29,.21,.58,.09,o.color);line([[0,-.32],[0,.18]],o.color);}
  if(o.shape==='mug'){box(-.24,-.32,.45,.61,o.color);line([[.2,-.22],[.4,-.22],[.4,.14],[.2,.14]],o.accent,.07);line([[-.17,-.28],[.15,-.28]],o.accent,.07);box(-.11,-.09,.2,.18,o.accent);}
  if(o.shape==='book'){box(-.3,-.44,.58,.79,o.color);box(-.23,-.37,.52,.65,'#e3dcc5');box(-.28,-.4,.51,.68,o.color);line([[-.2,-.35],[-.2,.24]],o.accent);line([[-.1,-.16],[.13,-.16],[-.1,-.06],[.13,-.06]]);}
  if(o.shape==='crystal'||o.shape==='relic'){poly([[0,-.62],[.28,-.18],[.19,.31],[-.19,.31],[-.28,-.18]],o.color);poly([[0,-.62],[.12,-.18],[0,.31],[-.11,-.18]],o.accent);line([[-.28,-.18],[.28,-.18]]);if(o.shape==='relic'){circle(0,-.1,.1,'#f5efd3');line([[-.32,.25],[.32,.25]],o.accent,.08);}}
  if(o.shape==='compass'){circle(0,-.06,.35,o.color);circle(0,-.06,.27,o.accent);poly([[0,-.29],[.08,.05],[0,0],[-.08,.05]],'#a63945');poly([[0,.18],[.08,-.08],[0,-.03],[-.08,-.08]],'#243246');circle(0,-.06,.035,'#faf0d4');}
  if(o.shape==='radio'){box(-.23,-.38,.46,.72,o.color);line([[.12,-.38],[.16,-.75]],o.accent);box(-.15,-.27,.3,.15,o.accent);for(let i=0;i<4;i++)line([[-.12,-.02+i*.065],[.12,-.02+i*.065]],o.accent,.025);circle(-.1,.25,.045,o.accent);}
  if(o.shape==='torch'){box(-.09,-.25,.18,.68,o.color);poly([[-.19,-.44],[.19,-.44],[.09,-.18],[-.09,-.18]],o.accent);circle(0,-.49,.13,o.accent);circle(0,-.51,.07,'#fff4c7');}
  if(o.shape==='orb'){box(-.09,.1,.18,.32,o.color);circle(0,-.15,.28,o.color);circle(-.06,-.22,.17,o.accent);line([[-.32,.1],[.32,.1]],o.accent,.07);}
  if(o.shape==='pennant'){line([[-.15,-.68],[-.15,.45]],o.color,.06);poly([[-.13,-.62],[.44,-.4],[-.13,-.15]],o.accent);line([[-.07,-.5],[.18,-.4],[-.07,-.3]],o.color,.025);}
  if(tier>=4){for(let n=0;n<Math.min(5,tier);n++){const a=time+n*2.4;circle(Math.cos(a)*.38,-.15+Math.sin(a)*.43,.018,o.accent);}}
  if(o.variant){for(let n=0;n<o.variant;n++)circle(-.1+n*.05,.06,.013,o.accent);}
  ctx.restore();
 }
 function held(ctx,look,w,h,time=0,moving=false){if(!item(look?.hand)||look.hand==='emptyhand')return;ctx.save();ctx.translate(w*.82,h*.9+(moving?Math.sin(time*8)*h*.009:0));ctx.rotate(.12);const size=Math.min(w*.15,h*.25);ctx.fillStyle='#cfa98a';ctx.beginPath();ctx.roundRect(-size*.14,0,size*.28,size*.6,size*.1);ctx.fill();draw(ctx,look.hand,0,-size*.18,size,time);ctx.restore();}
 window.HandItems={draw,held,item};
})();
