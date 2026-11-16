(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CUPassRules=factory();})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const XP_PER_LEVEL=500,THEMES=['Lanterns of Cedar Lake','Midnight Observatory','Verdant Signal','Copper Afterhours','Frostbound Archive','Solar Circuit','Violet Monsoon','Ember Expedition'];
 const RANKED_THEMES=['Obsidian Arena','Crimson Protocol','Ion Championship','Solar Dominion','Neon Vanguard','Iron Eclipse','Void Circuit','Thunder Crown'];
 const RARITIES=['common','uncommon','rare','epic','legendary','exotic','mythic'];
 function midnight(year,month){const date=new Date(Date.UTC(year,month,15)),day=date.toISOString().slice(0,10);for(const hour of [4,5]){const t=Date.parse(day+'T'+String(hour).padStart(2,'0')+':00:00Z');if(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',hourCycle:'h23'}).format(t)==='00')return t;}throw Error('Invalid season boundary');}
 function season(track,now=Date.now()){
  if(!['standard','ranked'].includes(track))throw Error('Unknown pass');const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date(now)).map(p=>[p.type,p.value]));
  const span=track==='ranked'?3:2,month=(Number(p.year)-2026)*12+Number(p.month)-11-(Number(p.day)<15?1:0),index=Math.floor(month/span),start=2026*12+10+index*span,year=Math.floor(start/12),m=start%12,id=year+'-'+String(m+1).padStart(2,'0'),maxLevel=track==='ranked'?250:100;
  return {track,id,index,name:(track==='ranked'?RANKED_THEMES:THEMES)[((index%8)+8)%8]+(track==='ranked'?' · Ranked':' · Standard'),startsAt:midnight(year,m),endsAt:midnight(year,m+span),maxLevel,spacing:track==='ranked'?2:4,xpPerLevel:XP_PER_LEVEL};
 }
 function fromId(track,id){if(!/^20\d\d-\d\d$/.test(id))return null;const t=Date.parse(id+'-17T12:00:00Z');if(!Number.isFinite(t))return null;const s=season(track,t);return s.id===id?s:null;}
 const STANDARD={skin:['Lakeside Ranger','Archive Keeper','Storm Courier','Frost Surveyor','Clockwork Custodian','Aurora Warden','Beacon Voyager'],head:['Surveyor Brim','Aviator Cap','Wayfinder Hood','Miner Helmet','Botanist Beret','Night Goggles'],hand:['Field Camera','Expedition Map','Specimen Jar','Storm Umbrella','Signal Kite','Beacon Staff']};
 const RANK_FAMILIES={skin:['Iron Sentinel','Crimson Duelist','Ion Runner','Void Reaver','Solar Sovereign'],head:['Citadel Helm','Victory Diadem','Pulse Visor','Rift Horns','Orbital Halo'],hand:['Arena Blade','Champion Trophy','Scout Drone','Titan Gauntlet','Reactor Core']};
 const GRADES=['Initiate','Ascendant','Elite','Exalted','Apex'];
 const STANDARD_PALETTES=[['#456b3b','#edc86b','#a35a32'],['#73452f','#f0d5aa','#2e8494'],['#254f91','#f1c947','#e8ebef'],['#dae6eb','#55a3c7','#3a576c'],['#9c653b','#82d4b5','#303b43'],['#6d4b94','#a3e2d5','#e9c4d4'],['#eee4c6','#e7ae3a','#317e88']];
 const RANK_PALETTES=[['#253444','#65cfff','#e8ecf3'],['#692638','#ff675c','#e3c187'],['#174e65','#77f7ff','#d0e7eb'],['#43285b','#e587ff','#c0bcff'],['#e0c07b','#fff2b8','#2f3a4c']];
 function cosmeticOrdinal(s,level,type){let count=-1;for(let l=s.spacing;l<=level;l+=s.spacing){const n=l/s.spacing;if(s.track==='ranked'&&l%10===0||n%4===1&&l!==s.maxLevel)continue;const t=l===s.maxLevel?'skin':n%4===2?'hand':n%4===3?'head':'skin';if(t===type)count++;}return count;}
 function appearance(s,type,ordinal){
  const ranked=s.track==='ranked',family=ranked?ordinal%5:ordinal,grade=ranked?Math.floor(ordinal/5):0,palette=(ranked?RANK_PALETTES:STANDARD_PALETTES)[family],seasonShift=((s.index%8)+8)%8;
  const tint=hex=>'#'+[1,3,5].map((o,i)=>Math.max(0,Math.min(255,parseInt(hex.slice(o,o+2),16)+((seasonShift*(i+3)*7)%29)-14)).toString(16).padStart(2,'0')).join('');
  return {name:(ranked?GRADES[grade]+' '+RANK_FAMILIES[type][family]:STANDARD[type][ordinal])+' · '+s.id,color:tint(palette[0]),accent:tint(palette[1]),trim:tint(palette[2]),shape:ranked?'arena_'+family:'explorer_'+ordinal,passDesign:{track:s.track,family,grade,ordinal},description:ranked?['Fortress plate and segmented pauldrons','Sweeping duelist mantle','Angular circuit equipment','Jagged rift-forged silhouette','Radiant champion regalia'][family]:['Field gear with broad utility shapes','Archive tools and scholarly layers','Storm-ready travel equipment','Insulated surveying gear','Brass machinery and workshop details','Aurora-lit expedition wear','The season’s beacon equipment'][ordinal%7]};
 }
 function reward(s,level){
  if(!Number.isInteger(level)||level<1||level>s.maxLevel||level%s.spacing)return null;
  const n=level/s.spacing,id='pass:'+s.track+':'+s.id+':'+level;
  if(s.track==='ranked'&&level%10===0)return {level,kind:'title',id,name:(level===250?'Cedar Sovereign':level%50===0?'Lake Champion':'Circuit Contender')+' · '+s.id+' · '+level};
  if(n%4===1&&level!==s.maxLevel)return {level,kind:'currency',amount:(s.track==='ranked'?40:60)+Math.floor(level/20)*10,name:'Flex Dollars'};
  const type=level===s.maxLevel?'skin':n%4===2?'hand':n%4===3?'head':'skin',rarity=RARITIES[Math.min(6,Math.floor(level/s.maxLevel*6))];
  const ordinal=cosmeticOrdinal(s,level,type),design=appearance(s,type,ordinal);
  return {level,kind:'cosmetic',item:{id,...design,type,rarity,pattern:ordinal%6,variant:0,price:0,source:'pass',tradeable:true}};

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
