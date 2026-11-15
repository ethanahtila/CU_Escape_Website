'use strict';
const crypto=require('node:crypto'),world=require('./public/campus-world.js');
function createCampusMatchmaking({rooms,maxPlayers=16,now=Date.now,maxReservations=128}){
 function prune(){for(const [id,r]of rooms)if(r.publicBuilding&&!r.players.size&&now()-r.createdAt>60000)rooms.delete(id);}
 function list(building){prune();return [...rooms.values()].filter(r=>r.publicBuilding===building&&r.phase==='lobby'&&r.players.size<maxPlayers).map(r=>({room:r.name,map:r.publicBuilding,mode:r.settings.mode,difficulty:r.settings.difficulty,players:r.players.size,capacity:maxPlayers,host:r.players.get(r.host)?.playerName||'New public lobby'})).sort((a,b)=>b.players-a.players||a.room.localeCompare(b.room)).slice(0,40);}
 function request(p,m){const b=world.portal(m.building);if(!b)throw Error('This building is coming soon.');if(Math.hypot(p.x-b.entry.x,p.y-b.entry.y)>15)throw Error('Walk to this building’s entrance first.');if(p.table!=null)throw Error('Stand up from the trade table first.');prune();if(m.type==='public_browse')return {type:'campus_rooms',building:b.id,rooms:list(b.id)};
 if(m.type==='public_create'){if(!['key','puzzle'].includes(m.mode)||!['easy','normal','hard','extreme'].includes(m.difficulty))throw Error('Choose a valid game mode and difficulty.');const owner=p.profile?.id||'campus:'+p.id;let room=[...rooms.values()].find(r=>r.publicBuilding===b.id&&r.reservedFor===owner&&!r.players.size);if(!room){if([...rooms.values()].filter(r=>r.publicBuilding&&!r.players.size).length>=maxReservations)throw Error('Public lobbies are busy. Join an existing group or try again shortly.');const name='campus-'+b.id+'-'+crypto.randomBytes(5).toString('hex');room={name,publicBuilding:b.id,settings:{map:b.map,mode:m.mode,difficulty:m.difficulty},reservedFor:owner,createdAt:now(),phase:'lobby',roles:new Set(),round:null,players:new Map(),nextId:1,host:null};rooms.set(name,room);}else room.settings={map:b.map,mode:m.mode,difficulty:m.difficulty};return {type:'campus_enter',room:room.name,settings:{...room.settings}};}
 if(m.type==='public_join'){const room=rooms.get(m.room);if(!room||room.publicBuilding!==b.id||room.phase!=='lobby')throw Error('That lobby has already started or closed. Refresh the list.');if(room.players.size>=maxPlayers)throw Error('That lobby is full. Choose another group.');return {type:'campus_enter',room:room.name,settings:{...room.settings}};}
 throw Error('Unknown campus lobby action.');
 }
 return {request,list,prune};
}
module.exports={createCampusMatchmaking};
