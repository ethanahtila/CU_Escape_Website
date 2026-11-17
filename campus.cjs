'use strict';
const crypto=require('node:crypto'),{CATALOG,BY_ID}=require('./shop-rules.cjs');
const world=require('./public/campus-world.js');const TABLES=world.tables;
function createCampus({store,send,chat,canTrade=()=>true,now=Date.now,maxClients=256,publicLobbies=null}){
 const peers=new Map(),tables=new Map(TABLES.map(t=>[t.id,{...t,seats:[null,null],offers:[[],[]],accepted:[false,false],revision:0,locked:false}]));let counter=0;
 const power=items=>items.reduce((n,id)=>n+2**CATALOG.rarities.findIndex(r=>r.id===BY_ID.get(id)?.rarity),0);
 const state=t=>({type:'campus_trade',table:t.id,revision:t.revision,seats:t.seats.map(id=>{const p=peers.get(id);return p?{id,name:p.name}:null}),offers:t.offers,values:t.offers.map(power),accepted:t.accepted,locked:t.locked});
 function tell(t){for(const id of t.seats){const p=peers.get(id);if(p)send(p.ws,state(t));}}
 function reset(t){t.offers=[[],[]];t.accepted=[false,false];t.revision++;tell(t);}
 function leaveSeat(p){if(p.table==null)return;const t=tables.get(p.table);if(t.locked)return;t.seats=t.seats.map(id=>id===p.id?null:id);p.table=null;reset(t);}
 const validPosition=world.validPosition;
 function join(ws,profile,name,startBuilding){if(peers.size>=maxClients){ws.close(1013,'Campus lobby full');return;}const entry=world.portal(startBuilding)?.entry;const p={id:++counter,ws,profile,name:profile?.name||name||'Student',x:entry?.x??world.spawn.x+(counter%5)*1.8,y:entry?entry.y+7:world.spawn.y, a:world.spawn.a,table:null,at:now(),rateAt:now(),messages:0};peers.set(p.id,p);ws.alive=true;ws.on('pong',()=>{ws.alive=true});send(ws,{type:'campus_welcome',id:p.id,x:p.x,y:p.y,a:p.a,tables:TABLES});
  chat?.join(peers,ws,'Public');
  ws.on('message',async bytes=>{try{if(now()-p.rateAt>=1000){p.rateAt=now();p.messages=0;}if(++p.messages>35||bytes.length>4096)return;const m=JSON.parse(bytes.toString());if(chat?.receive(peers,ws,p.name,m,[...peers.values()].map(p=>p.ws),'Public'))return;if(m.type==='move'&&p.table==null){const elapsed=Math.min(.5,Math.max(.025,(now()-p.at)/1000)),distance=Math.hypot(m.x-p.x,m.y-p.y);p.at=now();if(validPosition(m.x,m.y)&&world.canMove(p.x,p.y,m.x,m.y)&&distance<=elapsed*(world.sprintSpeed+1)+3){p.x=m.x;p.y=m.y;if(Number.isFinite(m.a))p.a=m.a;}else send(ws,{type:'campus_correction',x:p.x,y:p.y,a:p.a});return;}
   if(['public_browse','public_create','public_join'].includes(m.type)){if(!publicLobbies)throw Error('Public building lobbies are unavailable.');send(ws,publicLobbies.request(p,m));return;}
   if(m.type==='refresh'){p.profile=await store.profile(ws.authToken);return;}if(m.type==='stand'){leaveSeat(p);return;}
   if(m.type==='sit'){if(!p.profile?.username)throw Error('Log in to trade cosmetics.');if(!canTrade(p.profile.id))throw Error('Finish or leave your current match before trading.');const t=tables.get(m.table);if(!t||t.locked||Math.hypot(p.x-t.x,p.y-t.y)>10)return;if([...peers.values()].some(q=>q!==p&&q.table!=null&&q.profile?.id===p.profile.id))throw Error('This account is already seated.');const seat=t.seats.indexOf(null);if(seat<0)return;leaveSeat(p);t.seats[seat]=p.id;p.table=t.id;p.x=t.x+(seat?2.8:-2.8);p.y=t.y;reset(t);return;}
   const t=tables.get(p.table),index=t?.seats.indexOf(p.id);if(!t||t.locked||index<0)return;
   if(m.type==='offer'){const saved=p.profile;if(p.table!==t.id||t.locked||!peers.has(p.id))return;if(!Array.isArray(m.items)||m.items.length>4||new Set(m.items).size!==m.items.length||m.items.some(id=>!BY_ID.has(id)||BY_ID.get(id).starter||!saved?.cosmetics.owned.includes(id)))throw Error('Choose up to four cosmetics you own.');t.offers[index]=m.items;resetAccept(t);return;}
   if(m.type==='accept'){if(m.revision!==t.revision)throw Error('The offer changed. Review both sides again.');if(t.seats.some(id=>id==null)||t.offers.some(o=>!o.length)||power(t.offers[0])!==power(t.offers[1]))throw Error('Both offers must have equal rarity value.');if(t.seats.some(id=>!canTrade(peers.get(id)?.profile?.id)))throw Error('A seated student is now in a match.');t.accepted[index]=true;tell(t);if(t.accepted.every(Boolean)){t.locked=true;tell(t);const people=t.seats.map(id=>peers.get(id)),offers=t.offers.map(o=>[...o]);try{await store.exclusive(()=>store.tradeCosmetics(people[0].ws.authToken,people[1].ws.authToken,offers,crypto.randomUUID()));for(const q of people)send(q.ws,{type:'campus_trade_done',message:'Trade complete. Cosmetics saved to both accounts.'});}finally{t.locked=false;reset(t);for(let i=0;i<2;i++)if(!peers.has(t.seats[i]))t.seats[i]=null;}}}
  }catch(e){send(ws,{type:'campus_error',message:e.message||'Unable to trade.'});const t=tables.get(p.table);if(t&&!t.locked)resetAccept(t);}});
  ws.on('close',()=>{leaveSeat(p);peers.delete(p.id);});ws.on('error',()=>{});
 }
 function resetAccept(t){t.accepted=[false,false];t.revision++;tell(t);}
 const timer=setInterval(()=>{const all=[...peers.values()];for(const p of all){if(p.ws.bufferedAmount>65536)continue;const nearby=[p,...all.filter(q=>q!==p&&Math.hypot(q.x-p.x,q.y-p.y)<280).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(0,63)].map(q=>({id:q.id,name:q.name,x:q.x,y:q.y,a:q.a,table:q.table,look:q.profile?.cosmetics?.equipped||{skin:'default',head:'none'}}));send(p.ws,{type:'campus_state',players:nearby,total:peers.size,tables:[...tables.values()].map(t=>[t.id,t.seats.filter(x=>x!=null).length])});}},150);timer.unref();
 return {join,peers,tables,validPosition,close(){clearInterval(timer);for(const p of peers.values())p.ws.close();peers.clear();}};
}
module.exports={createCampus,TABLES};
