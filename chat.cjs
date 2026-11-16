'use strict';
function createChat({send,now=Date.now}){
 const channels=new WeakMap(),rates=new WeakMap(),senders=new WeakMap();let nextChannel=0,nextSender=0;
 function channel(scope,label){let c=channels.get(scope);if(!c){c={id:++nextChannel,label,history:[],next:0};channels.set(scope,c);}return c;}
 function sender(ws){if(!senders.has(ws))senders.set(ws,++nextSender);return senders.get(ws);}
 function join(scope,ws,label){const c=channel(scope,label);send(ws,{type:'chat_ready',scope:c.id,label:c.label,self:sender(ws),history:c.history});}
 function receive(scope,ws,name,message,peers,label){if(message?.type!=='chat_send')return false;const c=channel(scope,label),text=typeof message.text==='string'?message.text.replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g,' ').replace(/\s+/g,' ').trim():'';
  if(!text||Array.from(text).length>240){send(ws,{type:'chat_error',message:'Enter a message of 1–240 characters.'});return true;}
  const at=now(),prior=rates.get(ws)||{tokens:4,at},tokens=Math.min(4,prior.tokens+Math.max(0,at-prior.at)/2000);if(tokens<1){send(ws,{type:'chat_error',message:'Chat is moving too fast. Wait a moment.'});return true;}rates.set(ws,{tokens:tokens-1,at});
  const packet={type:'chat_message',scope:c.id,label:c.label,id:++c.next,sender:sender(ws),name:Array.from(String(name||'Student')).slice(0,20).join(''),text,at};c.history.push(packet);if(c.history.length>40)c.history.shift();for(const peer of peers)send(peer,packet);return true;
 }
 return {join,receive};
}
module.exports={createChat};
