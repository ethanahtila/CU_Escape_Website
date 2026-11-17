'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),world=require('../public/campus-world.js');
let renderer,mesh;function geometry(){if(mesh)return mesh;const sb={CU_CAMPUS_WORLD:world};sb.window=sb;vm.createContext(sb);vm.runInContext(fs.readFileSync(require.resolve('../public/campus-renderer.js'),'utf8'),sb);renderer=sb.CampusRenderer;return mesh=renderer.geometry();}
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
test('photo-traced building polygons have no false connections, remain separate from water and preserve open courtyards',()=>{
 for(let i=0;i<world.buildings.length;i++){const a=world.buildings[i];assert(a.outline.length>=4);assert(world.validPosition(a.entry.x,a.entry.y),a.id);assert(world.polygonDistance(a.outline,a.doorWall.x,a.doorWall.y)<1e-7);for(const p of a.outline)assert(!world.lakes.some(poly=>world.pointIn(poly,...p)),a.id+' overlaps water');
  for(const b of world.buildings.slice(i+1)){assert(!a.outline.some(p=>world.pointIn(b.outline,...p)),a.id+' joins '+b.id);assert(!b.outline.some(p=>world.pointIn(a.outline,...p)),b.id+' joins '+a.id);for(let j=0;j<a.outline.length;j++)for(let k=0;k<b.outline.length;k++){const p=a.outline[j],q=a.outline[(j+1)%a.outline.length],r=b.outline[k],s=b.outline[(k+1)%b.outline.length];assert(!(cross(p,q,r)*cross(p,q,s)<0&&cross(r,s,p)*cross(r,s,q)<0),a.id+' crosses '+b.id);}}
 }
 for(const id of ['lawlor','willetts','printy','mckinney']){const b=world.buildings.find(b=>b.id===id);assert(world.validPosition(b.x+b.w/2,b.y+b.d/2),id+' courtyard was filled by its bounding box');}
 const b=id=>world.buildings.find(b=>b.id===id);assert(b('ssc').x<b('berg').x&&b('berg').x<b('dmc').x);assert(b('bts').y<b('lb').y);assert(b('ens').y>b('lb').y);assert(world.fields.find(f=>f.id==='track').y<b('dmc').y);assert.equal(world.portal('berg').floors,2);assert.equal(world.portal('ens').floors,3);
});
test('pavement triangles remain above the matching ground plane across their full interiors',()=>{
 let paths=0,roads=0,maxError=0;const match=(d,k,hex)=>[1,3,5].every((i,j)=>Math.abs(d[k+3+j]-parseInt(hex.slice(i,i+2),16)/255)<1e-5);
 for(const chunk of geometry()){const d=chunk.data;for(let k=0;k<d.length;k+=18){const lift=match(d,k,'#c9c8b2')?.22:match(d,k,'#53565a')?.14:null;if(lift==null)continue;const x=(d[k]+d[k+6]+d[k+12])/3,y=(d[k+2]+d[k+8]+d[k+14])/3,z=(d[k+1]+d[k+7]+d[k+13])/3,error=Math.abs(z-world.terrainHeight(x,y)-lift);maxError=Math.max(maxError,error);if(lift===.22)paths++;else roads++;}}
 assert(paths>1000&&roads>1000);assert(maxError<.004,'A pavement triangle sinks or floats: '+maxError);assert(geometry().reduce((n,c)=>n+c.data.byteLength,0)<8*1024*1024);
});
test('all athletic areas are walkable destinations reachable from the SSC lobby and cannot become escape maps',()=>{
 const step=8,goalRows=world.fields.map(f=>({f,x:f.x+f.w/2,y:f.y+f.d/2})),sx=Math.round(world.spawn.x/step),sy=Math.round(world.spawn.y/step),start=sx+','+sy,queue=[[sx,sy]],parents=new Map([[start,null]]),goals=new Map(goalRows.map(g=>[g.f.id,g])),cache=new Map();
 function valid(x,y){const k=x+','+y;if(!cache.has(k))cache.set(k,world.validPosition(x*step,y*step));return cache.get(k);}
 for(let i=0;i<queue.length&&goals.size;i++){const [x,y]=queue[i],key=x+','+y;for(const [id,g]of goals)if(Math.hypot(x*step-g.x,y*step-g.y)<12&&world.canMove(x*step,y*step,g.x,g.y)){let p=key;while(parents.get(p)){const q=parents.get(p),a=p.split(',').map(Number),b=q.split(',').map(Number);assert(world.canMove(a[0]*step,a[1]*step,b[0]*step,b[1]*step),'Unwalkable approach to '+id);p=q;}goals.delete(id);}
  for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(parents.has(k)||!valid(nx,ny)||!world.validPosition((nx+x)*step/2,(ny+y)*step/2))continue;parents.set(k,key);queue.push([nx,ny]);}}
 assert.equal(goals.size,0,'Unreachable fields: '+[...goals.keys()]);for(const {f,x,y}of goalRows){assert(world.validPosition(x,y),f.id);assert.equal(world.portal(f.id),null);assert(!f.map);}assert(world.fields.some(f=>f.kind==='baseball'));assert(world.fields.some(f=>f.kind==='tennis'));assert(world.fields.some(f=>f.kind==='track'));
});
test('software fallback has a real depth buffer, reuses its image and disposes scene data',()=>{
 geometry();let uploads=0,allocations=0;const ctx={createImageData(w,h){allocations++;return {width:w,height:h,data:new Uint8ClampedArray(w*h*4)};},putImageData(image){uploads++;assert(image.data.some((v,i)=>i%4!==3&&v));}},canvas={width:160,height:90,getContext:type=>type==='2d'?ctx:null};const r=renderer.create(canvas);assert.equal(r.kind,'software');r.draw({...world.spawn,id:1},[],0);r.draw({...world.spawn,id:1},[],100);assert.equal(uploads,2);assert.equal(allocations,1);r.dispose();assert.equal(r.bytes,0);
});
