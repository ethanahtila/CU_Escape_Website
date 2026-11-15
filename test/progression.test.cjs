'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createProgression,dayKey,seasonKey,rankInfo,deadlineSeconds,creditDelta}=require('../progression.cjs');
test('Cedarville midnight, daylight saving and monthly season boundaries',()=>{
 assert.equal(dayKey(Date.parse('2026-07-15T03:59:59Z')),'2026-07-14');assert.equal(dayKey(Date.parse('2026-07-15T04:00:00Z')),'2026-07-15');
 assert.equal(seasonKey(Date.parse('2026-11-15T04:59:59Z')),'2026-10-15');assert.equal(seasonKey(Date.parse('2026-11-15T05:00:00Z')),'2026-11-15');assert.equal(seasonKey(Date.parse('2027-01-01T12:00:00Z')),'2026-12-15');
});
test('all 32 boards, automatic publication, top 50 and personal placement persist across restarts',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cu-records-')),filename=path.join(dir,'game.sqlite');t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));let time=Date.parse('2026-11-14T18:00:00Z'),s=createProgression({filename,now:()=>time}),a=s.account(null,'Ethan'),b=s.account(null,'Other');
 for(const map of ['ens','berg'])for(const mode of ['key','puzzle'])for(const difficulty of ['easy','normal','hard','extreme']){const r=s.recordRun(a.profile.id,{map,mode,difficulty,ms:200000,captures:0,players:3});assert.equal(s.board({map,mode,difficulty},a.token).total,1);assert.throws(()=>s.publish(b.token,r.id));s.publish(a.token,r.id);assert.equal(s.board({map,mode,difficulty,scope:'daily'}).total,1);}
 let last;for(let i=0;i<55;i++){last=s.recordRun(b.profile.id,{map:'ens',mode:'key',difficulty:'normal',ms:210000+i});s.publish(b.token,last.id);}const board=s.board({run:last.id},b.token);assert.equal(board.top.length,50);assert.equal(board.yourRun.placement,56);assert.equal(board.personalBest.placement,2);assert(s.profile(a.token).titles.includes('speed'));assert(s.profile(a.token).titles.includes('ten'));s.setTitle(a.token,'speed');assert.throws(()=>s.setTitle(b.token,'speed'));s.close();
 s=createProgression({filename,now:()=>time});assert.equal(s.profile(a.token).title,'speed');assert.equal(s.board().total,56);time=Date.parse('2026-11-15T05:00:00Z');assert.equal(s.board({scope:'daily'}).total,0);assert.equal(s.board().total,56);s.close();
});
test('rank rewards, stages, protected rank floors, deadlines and season reset',()=>{
 let time=Date.parse('2026-11-14T12:00:00Z');const s=createProgression({filename:':memory:',now:()=>time}),a=s.account(null,'Ranked');
 for(let i=0;i<10;i++){assert.equal(rankInfo(i*750).index,i);assert.equal(rankInfo(i*750+600).stage,5);assert.equal(deadlineSeconds(i),i<5?null:(16-i)*60);for(let place=1;place<=5;place++){const lo=creditDelta(place,i,(l,h)=>l),hi=creditDelta(place,i,(l,h)=>h);assert(place<3?lo>0&&hi>=lo:lo<0&&hi<=lo);}}
 for(let n=0;n<10;n++)s.reward(a.profile.id,'win'+n,1,0,undefined,()=>75);assert.equal(s.profile(a.token).rank.name,'Bronze');const lost=s.reward(a.profile.id,'loss',4,1,undefined,()=>45);assert.equal(lost.credits,750);assert.equal(lost.delta,0);assert.equal(s.reward(a.profile.id,'loss',1,1).credits,750);assert.equal(s.rankedBoard(a.token).personalBest.placement,1);
 time=Date.parse('2026-11-15T05:00:00Z');assert.equal(s.profile(a.token).rank.credits,0);assert.equal(s.rankedBoard(a.token).total,0);assert(s.profile(a.token).titles.includes('rank:1'));s.close();
});

test('rank progress targets the next level, switches rank at level five, and caps at Pro five',()=>{
 for(let index=0;index<10;index++)for(let stage=1;stage<=5;stage++)for(const extra of [0,75,149]){const r=rankInfo(index*750+(stage-1)*150+extra);assert.equal(r.stage,stage);assert.equal(r.index,index);const max=index===9&&stage===5;assert.equal(r.maxLevel,max);assert.equal(r.levelCredits,max?150:extra);assert.equal(r.next,max?0:150-extra);assert.equal(r.nextStage,max?null:stage===5?1:stage+1);assert.equal(r.nextRank,max?null:rankInfo((index+(stage===5?1:0))*750).name);}
 assert.equal(rankInfo(750).nextStage,2);assert.equal(rankInfo(750).levelCredits,0);assert.equal(rankInfo(10000).next,0);assert.equal(rankInfo(10000).nextRank,null);
});
