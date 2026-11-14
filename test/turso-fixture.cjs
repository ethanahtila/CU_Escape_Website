'use strict';
const {DatabaseSync}=require('node:sqlite');
function tursoFixture(){const db=new DatabaseSync(':memory:');let calls=0,offline=false,baton=null;
 const decode=a=>a.type==='null'?null:a.type==='integer'||a.type==='float'?Number(a.value):a.value;
 const encode=v=>v==null?{type:'null'}:typeof v==='number'?{type:Number.isInteger(v)?'integer':'float',value:String(v)}:{type:'text',value:String(v)};
 async function fetcher(url,options){calls++;await new Promise(r=>setImmediate(r));if(offline)return {ok:false,status:503};if(url!=='https://mock.turso.io/v2/pipeline'||options.headers.Authorization!=='Bearer test-only-token')return {ok:false,status:401};const body=JSON.parse(options.body),results=[];for(const op of body.requests){if(op.type==='close'){baton=null;results.push({type:'ok',response:{type:'close'}});continue;}try{const sql=op.stmt.sql,args=(op.stmt.args||[]).map(decode),statement=db.prepare(sql),columns=statement.columns();let result;if(columns.length){const rows=statement.all(...args);result={cols:columns.map(c=>({name:c.name})),rows:rows.map(row=>columns.map(c=>encode(row[c.name]))),affected_row_count:0};}else{const r=statement.run(...args);result={cols:[],rows:[],affected_row_count:r.changes,last_insert_rowid:String(r.lastInsertRowid)};}if(/^BEGIN/i.test(sql))baton='test-baton';results.push({type:'ok',response:{type:'execute',result}});}catch(e){results.push({type:'error',error:{code:e.code||'SQL_ERROR'}});}}
 return {ok:true,status:200,json:async()=>({baton,base_url:null,results})};}
 return {db,fetch:fetcher,get calls(){return calls},set offline(value){offline=value},close:()=>db.close()};}
module.exports={tursoFixture};
