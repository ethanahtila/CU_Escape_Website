'use strict';
const Rules=require('./public/pass-rules.js');
// Async implementation also generates the synchronous SQLite adapter below.
function createAsyncPassStore(db,now){
 async function init(){await db.exec(`CREATE TABLE IF NOT EXISTS pass_progress(profile TEXT NOT NULL,track TEXT NOT NULL,season TEXT NOT NULL,xp INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(profile,track,season));CREATE TABLE IF NOT EXISTS pass_xp_awards(profile TEXT NOT NULL,track TEXT NOT NULL,event TEXT NOT NULL,season TEXT NOT NULL,xp INTEGER NOT NULL,PRIMARY KEY(profile,track,event));CREATE TABLE IF NOT EXISTS pass_rewards(profile TEXT NOT NULL,track TEXT NOT NULL,season TEXT NOT NULL,level INTEGER NOT NULL,PRIMARY KEY(profile,track,season,level));CREATE TABLE IF NOT EXISTS hand_equipment(profile TEXT PRIMARY KEY,item TEXT NOT NULL DEFAULT 'emptyhand');`);}
 async function summary(id){const rows=await db.prepare('SELECT track,season,xp FROM pass_progress WHERE profile=?').all(id);return ['standard','ranked'].map(track=>{const s=Rules.season(track,now()),xp=Math.min(s.maxLevel*1000,rows.find(r=>r.track===track&&r.season===s.id)?.xp||0),level=Math.floor(xp/1000);return {...s,xp,level,xpInLevel:xp%1000,rewards:Rules.rewards(s).map(r=>({...r,earned:r.level<=level}))};});}
 // Called inside the completed-result transaction: XP, grants and receipts commit together.
 async function award(id,track,event,xp,at=now()){
  if(!xp||!event)return;const s=Rules.season(track,at);if(await db.prepare('SELECT 1 FROM pass_xp_awards WHERE profile=? AND track=? AND event=?').get(id,track,event))return;
  await db.prepare('INSERT INTO pass_xp_awards VALUES(?,?,?,?,?)').run(id,track,event,s.id,xp);
  await db.prepare('INSERT INTO pass_progress VALUES(?,?,?,?) ON CONFLICT(profile,track,season) DO UPDATE SET xp=min(?,xp+excluded.xp)').run(id,track,s.id,xp,s.maxLevel*1000);
  const total=(await db.prepare('SELECT xp FROM pass_progress WHERE profile=? AND track=? AND season=?').get(id,track,s.id)).xp;
  const claimed=new Set((await db.prepare('SELECT level FROM pass_rewards WHERE profile=? AND track=? AND season=?').all(id,track,s.id)).map(r=>r.level));
  for(const r of Rules.rewards(s)){if(r.level>Math.floor(total/1000)||claimed.has(r.level))continue;
   await db.prepare('INSERT INTO pass_rewards VALUES(?,?,?,?)').run(id,track,s.id,r.level);
   if(r.kind==='currency'){await db.prepare('INSERT OR IGNORE INTO wallets(profile) VALUES(?)').run(id);await db.prepare('UPDATE wallets SET balance=balance+?,lifetime=lifetime+? WHERE profile=?').run(r.amount,r.amount,id);}
   else if(r.kind==='title')await db.prepare('INSERT OR IGNORE INTO unlocks VALUES(?,?)').run(id,r.id);
   else await db.prepare('INSERT OR IGNORE INTO owned_cosmetics VALUES(?,?,?)').run(id,r.item.id,now());
  }
 }
 return {init,summary,award};
}
// This is a mechanical adapter of the same SQL and rules, not a second reward implementation.
const createSyncPassStore=Function('Rules','return ('+createAsyncPassStore.toString().replace(/\basync /g,'').replace(/\bawait /g,'')+')')(Rules);
module.exports={createAsyncPassStore,createSyncPassStore};
