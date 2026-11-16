(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CUPassRules=factory();})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const XP_PER_LEVEL=1000,THEMES=['Lanterns of Cedar Lake','Midnight Observatory','Verdant Signal','Copper Afterhours','Frostbound Archive','Solar Circuit','Violet Monsoon','Ember Expedition'];
 const RARITIES=['common','uncommon','rare','epic','legendary','exotic','mythic'];
 const PALETTES=[['#164b58','#78efdf'],['#302653','#d4b0ff'],['#234a31','#b3ef8a'],['#56392a','#ffbe79'],['#23475f','#c8f4ff'],['#553a19','#ffe291'],['#402757','#edacff'],['#58302e','#ffa78b']];
 const SHAPES=['lantern','mug','book','crystal','compass','radio','torch','orb','pennant','relic'];
 function midnight(year,month){const date=new Date(Date.UTC(year,month,15)),day=date.toISOString().slice(0,10);for(const hour of [4,5]){const t=Date.parse(day+'T'+String(hour).padStart(2,'0')+':00:00Z');if(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',hourCycle:'h23'}).format(t)==='00')return t;}throw Error('Invalid season boundary');}
 function season(track,now=Date.now()){
  if(!['standard','ranked'].includes(track))throw Error('Unknown pass');const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date(now)).map(p=>[p.type,p.value]));
  const span=track==='ranked'?3:2,month=(Number(p.year)-2026)*12+Number(p.month)-11-(Number(p.day)<15?1:0),index=Math.floor(month/span),start=2026*12+10+index*span,year=Math.floor(start/12),m=start%12,id=year+'-'+String(m+1).padStart(2,'0'),maxLevel=track==='ranked'?250:100;
  return {track,id,index,name:THEMES[((index%THEMES.length)+THEMES.length)%THEMES.length]+(track==='ranked'?' · Rivalry':' · Exploration'),startsAt:midnight(year,m),endsAt:midnight(year,m+span),maxLevel,spacing:track==='ranked'?2:4,xpPerLevel:XP_PER_LEVEL};
 }
 function fromId(track,id){if(!/^20\d\d-\d\d$/.test(id))return null;const t=Date.parse(id+'-17T12:00:00Z');if(!Number.isFinite(t))return null;const s=season(track,t);return s.id===id?s:null;}
 function reward(s,level){
  if(!Number.isInteger(level)||level<1||level>s.maxLevel||level%s.spacing)return null;
  const n=level/s.spacing,id='pass:'+s.track+':'+s.id+':'+level,idx=((s.index%8)+8)%8,prefix=THEMES[idx];
  // Mix in the actual season/track, so future seasons keep their own appearance even
  // when a theme family returns. IDs keep past rewards reproducible forever.
  let hash=2166136261;for(const c of s.track+':'+s.id)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
  const tint=(hex,light)=>'#'+[1,3,5].map((offset,i)=>Math.max(0,Math.min(255,parseInt(hex.slice(offset,offset+2),16)+((hash>>>(i*8))&31)-16+(light?8:0))).toString(16).padStart(2,'0')).join(''),color=[tint(PALETTES[idx][0],false),tint(PALETTES[idx][1],true)];
  if(s.track==='ranked'&&level%10===0)return {level,kind:'title',id,name:(level===250?'Cedar Sovereign':level%50===0?'Lake Champion':'Circuit Contender')+' · '+s.id+' · '+level};
  if(n%4===1&&level!==s.maxLevel)return {level,kind:'currency',amount:(s.track==='ranked'?40:60)+Math.floor(level/20)*10,name:'Flex Dollars'};
  const type=level===s.maxLevel?'skin':n%4===2?'hand':n%4===3?'head':'skin',rarity=RARITIES[Math.min(6,Math.floor(level/s.maxLevel*6))];
  return {level,kind:'cosmetic',item:{id,name:prefix+' '+(type==='hand'?SHAPES[n%10]:type==='head'?'Crest':'Attire')+' '+level+' · '+s.id,type,rarity,color:color[0],accent:color[1],pattern:n%6,variant:1+n%4,shape:type==='hand'?SHAPES[n%10]:['cap','beanie','visor','headphones','crown','halo'][n%6],price:0,source:'pass',tradeable:true}};
 }
 const itemCache=new Map();
 function resolveItem(id){const m=/^pass:(standard|ranked):(20\d\d-\d\d):(\d+)$/.exec(id||'');if(!m)return null;const s=fromId(m[1],m[2]);return s?reward(s,Number(m[3]))?.item||null:null;}
 function itemById(id){if(itemCache.has(id))return itemCache.get(id);const value=resolveItem(id);if(value)itemCache.set(id,value);return value;}
 function titleName(id){const m=/^pass:(ranked):(20\d\d-\d\d):(\d+)$/.exec(id||'');if(!m)return '';const s=fromId(m[1],m[2]),r=s&&reward(s,Number(m[3]));return r?.kind==='title'?r.name:'';}
 function rewards(s){const list=[];for(let l=s.spacing;l<=s.maxLevel;l+=s.spacing)list.push(reward(s,l));return list;}
 function standardXP(info){const ms=Number(info.ms);if(!Number.isFinite(ms)||ms<30000)return 0;return Math.floor(Math.min(ms,1200000)/60000)*30+(info.won===false?0:({easy:150,normal:225,hard:300,extreme:400}[info.difficulty]||0));}
 function rankedXP(place,forfeit){return forfeit===true?0:200+({1:400,2:300,3:200,4:100}[place]||0);}
 return {XP_PER_LEVEL,season,reward,rewards,itemById,titleName,standardXP,rankedXP};
});
