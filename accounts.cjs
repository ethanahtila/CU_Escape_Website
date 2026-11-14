'use strict';
const crypto=require('node:crypto'),{promisify}=require('node:util'),scrypt=promisify(crypto.scrypt);
const hashToken=t=>crypto.createHash('sha256').update(t).digest('hex');
function createAccounts(store){
 const db=store.db,now=store.now;let working=0;
 const normalize=username=>String(username||'').trim().toLowerCase();
 function validate(username,password){if(!/^[A-Za-z0-9_]{3,20}$/.test(username))throw Error('Use a username with 3–20 letters, numbers or underscores.');if(typeof password!=='string'||password.length<12||password.length>128)throw Error('Use a password with 12–128 characters.');}
 async function derive(password,salt){if(working>=4)throw Error('Sign-in is busy. Please try again shortly.');working++;try{return await scrypt(password,salt,64,{N:32768,r:8,p:3,maxmem:64*1024*1024});}finally{working--;}}
 function session(id){const token=crypto.randomBytes(32).toString('base64url');db.prepare('DELETE FROM sessions WHERE expires<=?').run(now());db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hashToken(token),id,now()+30*86400000);return {token,profile:store.profile(token)};}
 async function signup(username,password,previous){username=String(username||'').trim();validate(username,password);const canonical=normalize(username);if(db.prepare('SELECT 1 FROM accounts WHERE username=?').get(canonical))throw Error('That username is already in use.');const old=store.profile(previous);if(old?.username)throw Error('Log out before creating a different account.');const salt=crypto.randomBytes(16).toString('hex'),hash=(await derive(password,salt)).toString('hex');db.exec('BEGIN IMMEDIATE');try{if(db.prepare('SELECT 1 FROM accounts WHERE username=?').get(canonical))throw Error('That username is already in use.');const profile=old||store.account(null,username).profile;db.prepare('INSERT INTO accounts VALUES(?,?,?,?,?)').run(profile.id,canonical,username,salt,hash);db.prepare('UPDATE profiles SET name=? WHERE id=?').run(username,profile.id);db.exec('COMMIT');return session(profile.id);}catch(e){db.exec('ROLLBACK');throw e;}}
 async function login(username,password){if(typeof password!=='string'||password.length>128)throw Error('Invalid username or password.');const a=db.prepare('SELECT * FROM accounts WHERE username=?').get(normalize(username)),actual=await derive(password,a?.salt||'00000000000000000000000000000000'),expected=Buffer.from(a?.password_hash||'00'.repeat(64),'hex');if(!crypto.timingSafeEqual(actual,expected)||!a)throw Error('Invalid username or password.');return session(a.profile);}
 function logout(token){db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(token));}
 return {signup,login,logout};
}
module.exports={createAccounts};
