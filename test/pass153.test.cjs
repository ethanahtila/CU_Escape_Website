'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const Rules=require('../public/pass-rules.js'),{createProgression}=require('../progression.cjs'),{createRemoteProgression}=require('../progression-remote.cjs'),{tursoFixture}=require('./turso-fixture.cjs');
const now=()=>Date.parse('2026-11-16T12:00:00Z');
for(const remote of [false,true])test((remote?'Turso':'SQLite')+' keeps legacy XP and owned IDs, grants new 500-XP milestones atomically and never pays twice',async()=>{
 const mock=remote?tursoFixture():null,s=remote?createRemoteProgression({url:'libsql://mock.turso.io',token:'test-only-token',fetch:mock.fetch,now}):createProgression({filename:':memory:',now});await s.ready;
 try{const a=await s.account(null,'LegacyPass'),id=a.profile.id,standard=Rules.season('standard',now()),ranked=Rules.season('ranked',now());assert.equal(standard.xpPerLevel,500);assert.equal(ranked.xpPerLevel,500);
  await s.db.prepare('INSERT INTO pass_progress VALUES(?,?,?,?)').run(id,'standard',standard.id,8500);await s.db.prepare('INSERT INTO pass_progress VALUES(?,?,?,?)').run(id,'ranked',ranked.id,9500);
  for(const [track,levels]of [['standard',[4,8]],['ranked',[2,4,6,8]]])for(const l of levels)await s.db.prepare('INSERT INTO pass_rewards VALUES(?,?,?,?)').run(id,track,Rules.season(track,now()).id,l);
  const oldItem=Rules.reward(standard,8).item;await s.db.prepare('INSERT INTO owned_cosmetics VALUES(?,?,?)').run(id,oldItem.id,now());await s.db.prepare('INSERT INTO wallets VALUES(?,?,?,?)').run(id,1000,1000,0);
  await (mock?.db||s.db).exec("CREATE TRIGGER migration_failure BEFORE INSERT ON pass_rewards WHEN NEW.level=12 BEGIN SELECT RAISE(ABORT,'migration failure'); END");await assert.rejects(async()=>s.profile(a.token));assert.equal((await s.db.prepare('SELECT balance FROM wallets WHERE profile=?').get(id)).balance,1000);assert.equal((await s.db.prepare('SELECT count(*) AS n FROM pass_rewards WHERE profile=?').get(id)).n,6);await (mock?.db||s.db).exec('DROP TRIGGER migration_failure');
  const p=await s.profile(a.token);assert.equal(p.passes[0].level,17);assert.equal(p.passes[1].level,19);assert.equal(p.passes[0].xp,8500);assert.equal(p.passes[1].xp,9500);assert(p.cosmetics.owned.includes(oldItem.id));assert(p.cosmetics.owned.includes(Rules.reward(standard,16).item.id));assert(p.titleOptions.some(t=>t.id===Rules.reward(ranked,10).id));assert.equal(p.wallet.balance,1040);
  for(let n=0;n<3;n++)assert.equal((await s.profile(a.token)).wallet.balance,1040);assert.equal((await s.db.prepare('SELECT count(*) AS n FROM pass_xp_awards WHERE profile=?').get(id)).n,0);
  // Legacy totals above the new cap stay stored rather than being reduced on the next result.
  await s.db.prepare('UPDATE pass_progress SET xp=75000 WHERE profile=? AND track=?').run(id,'standard');await s.profile(a.token);await s.awardRun(id,{round:'after-cap',ms:60000,won:false});assert.equal((await s.db.prepare('SELECT xp FROM pass_progress WHERE profile=? AND track=?').get(id,'standard')).xp,75000);assert.equal((await s.profile(a.token)).passes[0].level,100);
 }finally{await s.close();mock?.close();}
});
test('pass rewards have distinct geometry within each track, disjoint models between tracks and enlarged item previews',()=>{
 const sb={};sb.window=sb;vm.createContext(sb);for(const file of ['cosmetics-catalog.js','pass-rules.js','pass-art.js','hand-items.js','cosmetics.js'])vm.runInContext(fs.readFileSync(require.resolve('../public/'+file),'utf8'),sb);
 const shapes={standard:new Set(),ranked:new Set()};for(const track of ['standard','ranked'])for(const type of ['skin','head','hand']){const items=Rules.rewards(Rules.season(track,now())).filter(r=>r.item?.type===type).map(r=>r.item),fingerprints=new Set(),names=new Set();
  for(const item of items){const calls=[],ctx=new Proxy({},{get:(o,k)=>o[k]||((...a)=>{calls.push([k,...a]);})}),canvas={width:180,height:180,getContext:()=>ctx};sb.Cosmetics.previewItem(canvas,item,1);fingerprints.add(crypto.createHash('sha256').update(JSON.stringify(calls)).digest('hex'));names.add(item.name);assert(item.passDesign);shapes[track].add(item.shape);}
  // Geometry calls ignore fill/stroke colors: recolors alone cannot pass this check.
  assert.equal(fingerprints.size,items.length,track+' '+type+' rewards need different shapes');assert.equal(names.size,items.length);
 }
 assert(![...shapes.standard].some(s=>shapes.ranked.has(s)));assert.notEqual(Rules.season('standard',now()).name,Rules.season('ranked',now()).name);
});
