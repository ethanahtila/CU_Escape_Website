'use strict';
// Explicit performance check: node test/render-benchmark.cjs [source-directory] [frames].
// Uses a deterministic 4-student world and executes the real rendering functions.
const path=require('node:path'),{performance}=require('node:perf_hooks'),directory=process.argv[2]?path.resolve(process.argv[2]):path.join(__dirname,'..'),{createGameRuntime}=require(path.join(directory,'game-runtime.cjs')),frames=Math.max(5,Number(process.argv[3])||25),rows=[];
for(const map of ['ens','berg']){
 const g=createGameRuntime();g.sb.seed=145;g.run("Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}");g.run(`selectedMapId='${map}';online=true;me=host=1;roster=new Set([1,2,3,4]);state=spawnRound();state.phase='running';ready=true;menu=false;local=clone(state.players[1]);`);
 for(const [view,x,y,a]of [['hall',24.5,21.5,0],['stairs',map==='ens'?8.5:9.5,26.5,0],['room',map==='ens'?5.5:30.5,5.5,0],['exit',25.5,36,-Math.PI/2],...(map==='berg'?[['cafe',55.5,32.5,-Math.PI/2]]:[])]){
  g.sb.pose={x,y,a};if(view==='stairs'){const v=g.E.stairFlights()[0],q=g.E.stairLandings(v)[0];g.sb.pose={...q,a:v.dir>0?0:Math.PI};}if(view==='cafe'){const r=g.E.rooms[0].find(r=>r.kind==='cafe'),q=g.E.sampleForRoom(r).collectibles.find(q=>q.x<52)||g.E.sampleForRoom(r).collectibles[0];g.sb.pose={...q,a:0};}g.run('Object.assign(local,pose)');for(let i=0;i<5;i++)g.run('local.a+=.002;drawWorld()');const samples=[];for(let i=0;i<frames;i++){const at=performance.now();g.run('local.a+=.002;drawWorld()');samples.push(performance.now()-at);}samples.sort((a,b)=>a-b);rows.push({map,view,medianMs:+samples[Math.floor(frames/2)].toFixed(2),p95Ms:+samples[Math.min(frames-1,Math.floor(frames*.95))].toFixed(2)});
 }
 const samples=[];for(let i=0;i<100;i++){const at=performance.now();g.E.simulate(.05);samples.push(performance.now()-at);}samples.sort((a,b)=>a-b);rows.push({map,view:'simulation',medianMs:+samples[50].toFixed(2),p95Ms:+samples[95].toFixed(2)});
}
console.log(JSON.stringify({frames,rows},null,2));
