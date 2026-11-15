'use strict';const crypto=require('node:crypto'),{createAccounts}=require('./accounts.cjs'),{ACHIEVEMENTS}=require('./progression.cjs');
function createProgressionHttp({store,enabled,send,broadcast}){
 const db=store.db;const tickets=new Map(),limits=new Map(),authLimits=new Map(),accounts=createAccounts(store);
 const token=req=>String(req.headers.authorization||'').replace(/^Bearer /,'');
 function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
 async function body(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>8192)throw Error('Request too large');}return text?JSON.parse(text):{};}
 async function handle(req,res,url){if(!url.pathname.startsWith('/api/'))return false;
  if(url.pathname==='/api/status'){json(res,200,{persistent:enabled,timezone:'America/New_York',leaderboards:32,rankedBoards:1});return true;}
  if(!enabled){json(res,503,{error:'Permanent records and ranked require persistent server storage. See PERSISTENCE.md in the update package.'});return true;}
  const key=(req.socket.remoteAddress||'local')+':'+crypto.createHash('sha256').update(token(req)).digest('hex'),window=Math.floor(Date.now()/60000),rate=limits.get(key);if(!rate||rate.window!==window)limits.set(key,{window,n:1});else if(++rate.n>120){json(res,429,{error:'Please try again shortly.'});return true;}
  try{const auth=token(req),input=req.method==='POST'?await body(req):{};if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)throw Error('Use this game website to change your profile.');const perform=async()=>{let result;
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
   else if(url.pathname==='/api/runs/start'&&req.method==='POST'){const p=(await store.profile(auth));if(!p)throw Error('Profile required.');if(!['ens','berg'].includes(input.map)||!['key','puzzle'].includes(input.mode)||!['easy','normal','hard','extreme'].includes(input.difficulty))throw Error('Invalid run settings');for(const [id,t]of tickets)if(t.profile===p.id||Date.now()-t.at>86400000)tickets.delete(id);const ticket=crypto.randomUUID();tickets.set(ticket,{profile:p.id,at:Date.now(),map:input.map,mode:input.mode,difficulty:input.difficulty});result={ticket};}
   else if(url.pathname==='/api/runs/finish'&&req.method==='POST'){const p=(await store.profile(auth)),ticket=tickets.get(input.ticket);if(!p||!ticket||ticket.profile!==p.id)throw Error('Run session expired.');if(input.won!==true||input.tainted||!Number.isFinite(input.ms)||input.ms<1000||input.ms>Date.now()-ticket.at+2000)throw Error('This run cannot be submitted.');const receipt=(await store.recordRun(p.id,{...ticket,ms:input.ms,captures:Number(input.captures)||0,players:1,verification:'community'}));tickets.delete(input.ticket);result={receipt,profile:(await store.profile(auth))};}
   else if(url.pathname==='/api/runs/publish'&&req.method==='POST'){const run=(await store.publish(auth,input.run));result=(await store.board({map:run.map,mode:run.mode,difficulty:run.difficulty,scope:'all',run:run.id},auth));}
   else{json(res,404,{error:'Unknown endpoint'});return true;}json(res,200,result);};if(store.exclusive)await store.exclusive(perform);else await perform();
  }catch(e){json(res,400,{error:e.message});}return true;
 }
 async function observe(room,m){if(!enabled||m.ranked||!Array.isArray(m.players))return;if(!room.scoring||room.scoring.round!==m.round)room.scoring={round:m.round,at:Date.now(),done:false,tainted:false};const r=room.scoring;if(m.players.some(p=>p[30]?.spectator||p[30]?.entity!=null))r.tainted=true;if(m.phase==='running'&&r.started==null)r.started=Date.now();if(m.phase!=='won'||r.done||r.started==null)return;r.done=true;if(r.tainted)return;const ms=Number(m.t)*1000;if(!Number.isFinite(ms)||ms<1000||ms>Date.now()-r.started+2000)return;for(const [id,ws]of room.players){if(!ws.profile)continue;const actor=m.players.find(p=>p[0]===id);if(!actor||!actor[6]||actor[30]?.spectator)continue;try{const receipt=(await store.recordRun(ws.profile.id,{map:m.mapId,mode:m.gameModeId,difficulty:m.difficultyId,ms,captures:actor[11]||0,players:m.players.length,verification:'community'}));send(ws,{type:'run_receipt',receipt:{...receipt,round:m.round}});}catch{}}
 }
 return {handle,observe};
}
module.exports={createProgressionHttp};
