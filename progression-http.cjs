'use strict';const crypto=require('node:crypto'),{createAccounts}=require('./accounts.cjs'),{ACHIEVEMENTS}=require('./progression.cjs');
function createProgressionHttp({store,enabled,send,broadcast}){
 const pendingRuns=new Map();let flushTask=null,stopping=false,recoverMore=true;
 const db=store.db;const limits=new Map(),authLimits=new Map(),accounts=createAccounts(store);
 const token=req=>String(req.headers.authorization||'').replace(/^Bearer /,'');
 function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
 async function body(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>8192)throw Error('Request too large');}return text?JSON.parse(text):{};}
 async function handle(req,res,url){if(!url.pathname.startsWith('/api/'))return false;
  if(url.pathname==='/api/status'){json(res,200,{persistent:enabled,timezone:'America/New_York',leaderboards:32,rankedBoards:1,version:'1.5.1',protocol:41});return true;}
  if(!enabled){json(res,503,{error:'Permanent records and ranked require persistent server storage. See PERSISTENCE.md in the update package.'});return true;}
  const key=(req.socket.remoteAddress||'local')+':'+crypto.createHash('sha256').update(token(req)).digest('hex'),window=Math.floor(Date.now()/60000),rate=limits.get(key);if(!rate||rate.window!==window)limits.set(key,{window,n:1});else if(++rate.n>120){json(res,429,{error:'Please try again shortly.'});return true;}
  const receivedAt=Date.now();try{const auth=token(req),input=req.method==='POST'?await body(req):{};if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)throw Error('Use this game website to change your profile.');const perform=async()=>{let result;
   if(url.pathname.startsWith('/api/auth/')){
    const authKey=key+':'+String(input.username||'').trim().toLowerCase(),at=Date.now(),limit=authLimits.get(authKey);if(authLimits.size>10000)for(const [k,v]of authLimits)if(at-v.at>900000)authLimits.delete(k);
    if(req.method==='POST'&&['/api/auth/login','/api/auth/signup'].includes(url.pathname)){if(limit&&at-limit.at<900000&&limit.n>=10){json(res,429,{error:'Too many sign-in attempts. Try again in fifteen minutes.'});return true;}authLimits.set(authKey,{at:limit&&at-limit.at<900000?limit.at:at,n:limit&&at-limit.at<900000?limit.n+1:1});}
    if(url.pathname==='/api/auth/signup'&&req.method==='POST')result=await accounts.signup(input.username,input.password,auth);
    else if(url.pathname==='/api/auth/login'&&req.method==='POST')result=await accounts.login(input.username,input.password);
    else if(url.pathname==='/api/auth/session'&&req.method==='GET'){result={profile:(await store.profile(auth))};if(!result.profile?.username){json(res,401,{error:'Sign in to your saved account.'});return true;}}
    else if(url.pathname==='/api/auth/logout'&&req.method==='POST'){await accounts.logout(auth);result={ok:true};}
    else throw Error('Unknown account endpoint');
   }
   else if(url.pathname==='/api/profile'&&req.method==='POST'){if((input.token||auth)&&!(await store.profile(input.token||auth)))throw Error('Your saved session expired. Log in again.');result=(await store.account(input.token||auth,input.name));}
   else if(url.pathname==='/api/profile'&&req.method==='GET'){result={profile:(await store.profile(auth))};if(!result.profile)throw Error('Profile not found.');}
   else if(url.pathname==='/api/store'&&req.method==='GET')result=await store.shop(auth);
   else if(url.pathname==='/api/store/buy'&&req.method==='POST')result=await store.buyCosmetic(auth,input.item,input.day);
   else if(url.pathname==='/api/cosmetics/equip'&&req.method==='POST')result={profile:await store.equipCosmetic(auth,input.slot,input.item)};
   else if(url.pathname==='/api/profile/achievements'&&req.method==='POST')result={profile:await store.saveAchievements(auth,input)};
   else if(url.pathname==='/api/profile/title'&&req.method==='POST')result={profile:(await store.setTitle(auth,String(input.title||'')))};
   else if(url.pathname==='/api/leaderboards'&&req.method==='GET')result=(await store.board(Object.fromEntries(url.searchParams),auth));
   else if(url.pathname==='/api/ranked/leaderboard'&&req.method==='GET')result=(await store.rankedBoard(auth));
   else if(url.pathname==='/api/runs/start'&&req.method==='POST'){const p=await store.profile(auth);if(!p)throw Error('Profile required.');result=await store.startRunSession(p.id,input,receivedAt);}
   else if(url.pathname==='/api/runs/finish'&&req.method==='POST'){const p=await store.profile(auth);if(!p)throw Error('Profile required.');const receipt=await store.finishRunSession(p.id,input.ticket,input,receivedAt);result={receipt,profile:await store.profile(auth)};}
   else if(url.pathname==='/api/runs/status'&&req.method==='GET'){const p=await store.profile(auth),round=url.searchParams.get('round');if(!p||!round||round.length>128)throw Error('Profile and run required.');result=await store.completedRunStatus(p.id,round);}
   else if(url.pathname==='/api/runs/publish'&&req.method==='POST'){const run=(await store.publish(auth,input.run));result=(await store.board({map:run.map,mode:run.mode,difficulty:run.difficulty,scope:'all',run:run.id},auth));}
   else{json(res,404,{error:'Unknown endpoint'});return true;}json(res,200,result);};if(store.exclusive)await store.exclusive(perform);else await perform();
  }catch(e){json(res,400,{error:e.message,code:e.code||'request_failed'});}return true;
 }
 async function hydrate(){if(!recoverMore||stopping)return;const rows=await store.exclusive(()=>store.pendingCompletedRuns());recoverMore=rows.length>=256;for(const job of rows)if(!pendingRuns.has(job.profile+':'+job.info.round))pendingRuns.set(job.profile+':'+job.info.round,{...job,ws:null,durable:true});}
 function flushRuns(){if(flushTask)return flushTask;flushTask=(async()=>{
  const undurable=[...pendingRuns.values()].filter(j=>!j.durable);if(undurable.length){try{for(let i=0;i<undurable.length;i+=256){const batch=undurable.slice(i,i+256);await store.exclusive(()=>store.queueCompletedRuns(batch.map(j=>({profile:j.profile,info:j.info}))));for(const job of batch)job.durable=true;}}catch{for(const job of undurable)send(job.ws,{type:'run_save_pending',message:'Saving your winning run. Retrying automatically.'});return;}}
  for(const [key,job]of pendingRuns){if(stopping)break;if(Date.now()<(job.retryAt||0))continue;try{const receipt=await store.exclusive(()=>store.saveCompletedRun(job.profile,job.info));pendingRuns.delete(key);send(job.ws,{type:'run_receipt',receipt:{...receipt,round:job.info.round}});}catch{job.retryAt=Date.now()+5000;send(job.ws,{type:'run_save_pending',message:'Your winning run is queued for storage. Retrying automatically.'});}}
 })().finally(()=>{flushTask=null;});return flushTask;}
 async function observe(room,m){if(!enabled||m.ranked||!Array.isArray(m.players))return;if(!room.scoring||room.scoring.round!==m.round)room.scoring={round:m.round,at:Date.now(),done:false,tainted:false};const r=room.scoring;if(m.players.some(p=>p[30]?.spectator||p[30]?.entity!=null))r.tainted=true;if(m.phase==='running'&&r.started==null)r.started=Date.now()-Math.max(0,Number(m.t)||0)*1000;if(!['won','lost'].includes(m.phase)||r.done)return;if(r.tainted){r.done=true;return;}const ms=Number(m.t)*1000;if(!Number.isFinite(ms)||ms<1000||ms>86400000)return;r.done=true;const finished=Date.now();for(const [id,ws]of room.players){if(!ws.profile)continue;const actor=m.players.find(p=>p[0]===id);if(!actor||(m.phase==='won'&&!actor[6])||actor[30]?.spectator)continue;pendingRuns.set(ws.profile.id+':'+m.round,{profile:ws.profile.id,ws,info:{map:m.mapId,mode:m.gameModeId,difficulty:m.difficultyId,won:m.phase==='won',ms,finished,captures:actor[11]||0,players:m.players.length,round:m.round,stats:actor[35]||{},allSafe:m.players.every(p=>!p[11]),verification:'community'}});}const jobs=[...pendingRuns.values()].filter(j=>j.info.round===m.round);try{await store.exclusive(()=>store.queueCompletedRuns(jobs.map(j=>({profile:j.profile,info:j.info}))));for(const job of jobs)job.durable=true;}catch{for(const job of jobs)send(job.ws,{type:'run_save_pending',message:'Your winning run is waiting for storage. Retrying automatically.'});return;}await flushRuns();
 }
 const recovery=Promise.resolve(store.ready).then(hydrate).then(()=>flushRuns()).catch(()=>{recoverMore=true;});
 const retryTimer=setInterval(()=>{if(stopping)return;hydrate().then(()=>pendingRuns.size?flushRuns():null).catch(()=>{recoverMore=true;});},5000);retryTimer.unref();
 return {handle,observe,pendingRuns,flushRuns,recovery,async close(){stopping=true;clearInterval(retryTimer);await recovery;await flushTask;}};
}
module.exports={createProgressionHttp};
