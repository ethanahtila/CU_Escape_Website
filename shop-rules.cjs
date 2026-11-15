'use strict';
const crypto=require('node:crypto'),CATALOG=require('./cosmetics-catalog.json'),BY_ID=new Map(CATALOG.items.map(i=>[i.id,i]));
function dailyItems(seed,profile,day,excluded=[],injected){let counter=0;const random=injected||((bound)=>{const ceiling=Math.floor(4294967296/bound)*bound;let value;do{value=crypto.createHmac('sha256',seed).update(profile+':'+day+':'+counter++).digest().readUInt32BE(0);}while(value>=ceiling);return value%bound;});const blocked=new Set(excluded),selected=[];
 if(!blocked.has('afterlight')&&random(10000)===0)selected.push('afterlight');
 while(selected.length<5){const roll=random(10000);let cumulative=0,rarity=CATALOG.rarities[0].id;for(const r of CATALOG.rarities){cumulative+=Math.round(r.weight*100);if(roll<cumulative){rarity=r.id;break;}}const pool=CATALOG.items.filter(i=>!i.starter&&i.id!=='afterlight'&&i.rarity===rarity&&!blocked.has(i.id)&&!selected.includes(i.id));selected.push(pool[random(pool.length)].id);}
 for(let i=selected.length-1;i>0;i--){const j=random(i+1);[selected[i],selected[j]]=[selected[j],selected[i]];}return selected;
}
function adjacentDay(day,amount){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+amount);return d.toISOString().slice(0,10);}
function resetAt(day){const tomorrow=adjacentDay(day,1),date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'});for(const hour of [4,5]){const stamp=Date.parse(tomorrow+'T'+String(hour).padStart(2,'0')+':00:00Z'),p=Object.fromEntries(date.formatToParts(stamp).map(p=>[p.type,p.value]));if(p.hour==='00'&&`${p.year}-${p.month}-${p.day}`===tomorrow)return stamp;}throw Error('Unable to determine the daily shop reset.');}
function placementNotes(place,forfeit){return forfeit?0:[20,17,14,12,10][place-1]||0;}
module.exports={CATALOG,BY_ID,dailyItems,adjacentDay,resetAt,placementNotes};
