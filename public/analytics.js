'use strict';
(()=>{
 if(window.CUAnalytics)return;
 const VERSION='1.5.1',sections=new Set(['menu','login','signup','profile','achievements','titles','leaderboards','rank','store','skins','rarities','campus','waiting_lobby','trading','ranked_queue','public_lobbies','gameplay','results']),seen=new Set();let lastSection='';
 const device=()=>location.pathname==='/mobile'?'mobile':location.pathname==='/desktop'?'desktop':'entry';
 function push(event,params={}){try{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,game_version:VERSION,device_type:device(),game_section:undefined,play_type:undefined,game_map:undefined,game_mode:undefined,game_difficulty:undefined,player_count:undefined,result:undefined,duration_seconds:undefined,placement:undefined,...params});return true;}catch{return false;}}
 function once(key){if(seen.has(key))return false;seen.add(key);if(seen.size>512)seen.delete(seen.values().next().value);return true;}
 function section(name){if(!sections.has(name)||lastSection===name)return;lastSection=name;push('cu_game_section',{game_section:name});}
 function modal(title){const name={'My Rank':'rank','Your saved account':'profile','Your profile':'profile','Global leaderboards':'leaderboards','Your Night Market':'store','Skins & Headgear':'skins','Cosmetic rarities':'rarities','Create your account':'signup','Log in to CU Escape':'login','Escape saved automatically':'results'}[title];if(name)section(name);}
 function details(s,online){if(!s||!['ens','berg'].includes(s.mapId)||!['key','puzzle'].includes(s.gameModeId)||!['easy','normal','hard','extreme'].includes(s.difficultyId))return null;return {play_type:s.ranked?'ranked':online?'multiplayer':'solo',game_map:s.mapId,game_mode:s.gameModeId,game_difficulty:s.difficultyId,player_count:Math.max(1,Math.min(16,Object.values(s.players||{}).filter(p=>!p.spectator).length))};}
 function start(s,online=false){if(!s||s.phase!=='running'||!s.round||seen.has('start:'+s.round))return;const context=details(s,online);if(!context||!once('start:'+s.round))return;section('gameplay');push('cu_game_start',context);}
 function end(s,online=false,result=null,placement=null){if(!s?.round||seen.has('end:'+s.round))return;const context=details(s,online),outcome=result||(['won','lost'].includes(s?.phase)?s.phase:null);if(!context||!s.round||!['won','lost','left','escaped','eliminated'].includes(outcome)||!once('end:'+s.round))return;const duration=Number(s.t),params={...context,result:outcome};if(Number.isFinite(duration)&&duration>=0)params.duration_seconds=Math.round(Math.min(86400,duration));if(Number.isInteger(placement)&&placement>=1&&placement<=4)params.placement=placement;push('cu_game_end',params);if(outcome!=='left')section('results');}
 function rankedResult(r,s){if(!s?.ranked||!r)return;end(s,true,r.forfeit?'eliminated':'escaped',r.place);}
 function leave(s,online=false){if(s?.phase==='running')end(s,online,'left');section('menu');}
 function campus(kind){section({trade:'trading',ranked:'ranked_queue',casual:'waiting_lobby',explore:'campus'}[kind]||'campus');}
 window.CUAnalytics={section,modal,start,end,rankedResult,leave,campus};
 const initial=()=>{section(document.getElementById('accountDialog')?'login':'menu');};if(location.pathname!=='/'&&location.pathname!=='/index.html'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initial,{once:true});else initial();}
})();
