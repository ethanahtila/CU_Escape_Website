'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CU_CAMPUS_WORLD=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 // Coordinates trace the illustrated university map; 1 unit ~0.5 m near ENS.
 // Areas below are published gross floor areas, NOT measured footprints.
 const bounds={width:2200,height:1090},spawn={x:705,y:354,a:2.06},speed=14,sprintSpeed=24;
 const lakes=[[[490,443],[530,406],[575,365],[610,347],[639,351],[670,371],[700,410],[728,449],[756,500],[793,555],[806,578],[794,590],[758,595],[727,585],[704,560],[675,522],[648,495],[615,479],[579,469],[530,464],[502,462]],[[810,598],[831,582],[863,586],[888,604],[883,621],[864,627],[833,620]],[[1040,772],[1080,770],[1112,785],[1112,822],[1080,850],[1017,883],[997,878],[1000,849],[1021,811]]];
 const buildings=[];
 function add(id,name,x,y,w,d,floors=2,style='brick',extra={}){const b={id,name,x,y,w,d,floors,style,height:floors*7.4,parts:[],...extra};b.entry={x:x+w*.5,y:y+d+4};buildings.push(b);return b;}
 add('ens','Engineering and Science Center',337,383,120,80,3,'ens',{map:'ens',areaSqFt:95000,parts:[[386,376,73,42],[337,427,74,39]],label:'ENS'});
 add('berg','Scharnberg Business and Communication Center',747,370,100,63,2,'glass',{map:'berg',areaSqFt:65000,label:'SBCC',parts:[[760,362,47,16]]});
 add('ssc','Stevens Student Center',614,278,192,68,3,'student',{areaSqFt:150000,label:'SSC'});
 add('dmc','Dixon Ministry Center',808,466,134,99,2,'chapel',{areaSqFt:120000,label:'DMC',parts:[[862,448,55,27]]});
 add('lb','Centennial Library',519,490,102,62,2,'library',{areaSqFt:66000,label:'Library'});
 add('bts','Center for Biblical and Theological Studies',621,558,109,58,2,'library',{label:'BTS'});
 add('hsc','Health Sciences Center',413,235,135,66,3,'library',{label:'HSC'});
 add('clc','Chemistry Laboratory Center',197,323,80,35,1,'lab',{label:'CLC'});
 add('cec','Civil Engineering Center',251,393,35,57,2,'lab',{label:'CEC'});
 add('epl','Engineering Projects Laboratory',291,377,53,25,1,'lab',{label:'EPL',areaSqFt:8800});
 add('cfa','Chick-fil-A',501,464,77,25,1,'brick',{label:'Chick-fil-A'});
 add('mil','Milner Hall',391,509,82,40,2,'brick',{label:'Milner'});
 add('tyl','Tyler Digital Communication Center',222,521,98,58,2,'library',{label:'Tyler'});
 add('app','Apple Technology Resource Center',534,624,83,42,2,'brick',{label:'Apple',areaSqFt:24000});
 add('gts','Graduate and Teaching Services',213,606,38,20,1,'historic',{label:'GTS'});
 add('fh','Founders Hall',271,630,43,25,2,'historic',{label:'Founders'});
 add('hgc','History and Government Center',334,617,35,30,2,'historic',{label:'HGC'});
 add('al','Alford Auditorium and Annex',94,750,47,65,2,'historic',{label:'Alford'});
 add('am','Ambassador Hall',80,695,20,32,2,'historic',{label:'Ambassador'});
 add('hrt','Hartman Hall',29,752,26,28,2,'historic',{label:'Hartman'});
 add('cng','Carnegie Center for the Visual Arts',340,773,45,24,2,'historic',{label:'Carnegie'});
 add('kyle','Kyle Medical Center',903,750,36,31,1,'brick',{label:'Kyle'});
 add('ums','University Medical Services',1038,322,26,34,1,'brick',{label:'UMS'});
 add('dfh','Doden Field House',1064,319,163,75,2,'athletic',{label:'Doden'});
 add('ftr','Fitness Recreation Center',1053,365,55,37,2,'glass',{label:'Fitness'});
 add('cal','Callan Athletic Center',987,403,150,83,2,'athletic',{label:'Callan'});
 add('ops','Operations Center',913,12,35,28,1,'lab',{label:'Operations'});
 add('security','Campus Security House',2016,567,24,26,1,'historic',{label:'Campus Safety'});
 add('bolthouse','Bolthouse Academic Center',376,610,153,111,3,'construction',{label:'Bolthouse · construction'});
 // Residence halls and life centers, in their map clusters.
 const halls=[['palmer','Palmer Hall',41,402,24,52],['carr','Carr Hall',89,396,25,44],['mar','Marshall Hall',94,438,25,28],['rogers','Rogers Hall',99,468,26,26],['faith','Faith Hall',173,753,73,34],['shrub','Shrubsole House',500,89,20,23],['diehl','Diehl Johnson Hall',772,67,27,57],['murdoch','Murdoch Hall',865,65,31,58],['west','West Hall',1001,122,86,22],['murphy','Murphy Hall',1010,146,25,82],['rickard','Rickard Hall',1070,147,25,81],['walker','Walker Hall',1125,143,26,56],['jenkins','Jenkins Hall',1180,145,27,54],['rooke','Rooke Hall',1236,146,27,54],['town','Townhouse',1294,153,20,76],['parker','Parker Hall',1189,256,125,29],['printy','Printy Hall',1031,543,94,23],['morton','Morton Hall',1183,477,84,25],['mckinney','McKinney Hall',1184,502,27,70],['mcchesney','McChesney Hall',1254,502,26,70],['wood','Wood Hall',1341,451,88,22],['johnson','Johnson Hall',1340,480,26,77],['stclair','St. Clair Hall',1418,480,26,78],['brock','Brock Hall',1433,598,29,57],['lawlor','Lawlor Hall',996,678,109,27],['willetts','Willetts Hall',1134,678,140,28],['maddox','Maddox Hall',735,638,80,22],['bates','Bates Hall',1186,650,26,29]];
 for(const [id,name,x,y,w,d]of halls)add(id,name,x,y,w,d,2,'residence',{label:name.replace(' Hall','')});
 const centers=[['phipps','Phipps Center',802,74,61,22],['younger','Younger Center',1040,211,40,22],['miter','Miter Center',1261,233,29,24],['dunn','Dunn Center',1218,550,23,22],['green','Green Center',1380,526,28,24]];
 for(const [id,name,x,y,w,d]of centers)add(id,name,x,y,w,d,1,'residence',{label:name.replace(' Center','')});
 add('collegeview','College View Apartments',1103,865,263,48,3,'residence',{label:'College View'});
 const paths=[{width:10,points:[[474,455],[493,471],[515,479],[550,476],[600,487],[639,507],[674,536],[701,574],[731,610],[780,620],[813,591],[789,549],[758,492],[730,433],[705,394],[671,351],[637,332],[601,329],[561,354],[521,393],[474,443],[474,455]]},{width:18,points:[[588,313],[620,353],[673,363],[711,361],[753,348],[823,355],[851,403],[862,439],[953,449],[994,461]]},{width:10,points:[[462,423],[478,423],[517,390]]},{width:10,points:[[797,437],[816,449],[852,440]]},{width:10,points:[[485,482],[485,560],[612,568],[615,621],[845,638],[953,640],[1080,622],[1297,623],[1438,575],[1610,522],[1860,522],[2020,569]]},{width:8,points:[[323,278],[482,338],[601,329],[610,262],[852,264],[974,281],[1189,301],[1365,292],[1534,269],[1720,288],[1910,330],[2133,340]]},{width:9,points:[[953,100],[954,274],[954,442],[953,640],[947,723]]},{width:8,points:[[120,380],[145,500],[350,494],[485,482]]},{width:8,points:[[720,712],[845,708],[947,723],[1345,722]]},{width:10,points:[[1000,738],[1148,784],[1369,767],[1450,1000]]}];
 const roads=[{width:17,points:[[15,388],[307,260],[388,222],[944,222],[976,294],[1370,302],[1460,258],[1580,296],[1675,336],[1760,466],[1930,530],[2010,695],[2190,700]]},{width:18,points:[[10,739],[2200,706]]},{width:14,points:[[953,280],[951,420],[978,561],[951,640],[947,723],[1008,764],[977,890],[848,1000],[920,1060]]},{width:13,points:[[1320,304],[1325,500],[1358,618],[1388,731],[1465,1060]]},{width:11,points:[[150,380],[171,500],[190,735],[243,800]]}];
 const parking=[[418,160,380,51],[777,0,135,60],[978,10,220,45],[999,65,350,55],[854,283,86,77],[1334,320,101,108],[1147,444,174,28],[1232,321,89,107],[605,641,116,76],[1461,524,46,140],[1390,752,140,260]];
 const fields=[{name:'Yellow Jacket Track and Field Complex',x:1590,y:177,w:280,d:86,kind:'track'},{name:'Yellow Jacket Soccer Complex',x:1860,y:65,w:170,d:79},{name:'Yellow Jacket Soccer Complex',x:1890,y:246,w:196,d:60},{name:'Ultimate Frisbee / Flag Football',x:1467,y:293,w:130,d:65},{name:'Yellow Jacket Baseball Field',x:1830,y:366,w:185,d:126,kind:'baseball'},{name:'Lady Jacket Softball Field',x:2073,y:400,w:120,d:82,kind:'baseball'},{name:'Johnson-Murdoch Tennis Complex',x:1510,y:442,w:152,d:61},{name:'Basketball Courts',x:1453,y:380,w:49,d:41},{name:'Pickleball Courts',x:1507,y:382,w:29,d:43},{name:'Sand Volleyball Courts',x:1542,y:381,w:80,d:44},{name:'Disc Golf Course',x:1550,y:550,w:200,d:112},{name:'Intramural Fields',x:1100,y:1020,w:200,d:48}];
 const tables=Array.from({length:24},(_,i)=>({id:i,x:680+(i%6)*9,y:353+Math.floor(i/6)*5}));
 function pointIn(poly,x,y){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
 function footprint(b){return [[b.x,b.y,b.w,b.d],...b.parts];}
 function onPatio(x,y){return ((x-703)/35)**2+((y-364)/20)**2<1;}
 function validPosition(x,y,r=.8){return Number.isFinite(x)&&Number.isFinite(y)&&x>=r+5&&y>=r+5&&x<=bounds.width-r-5&&y<=bounds.height-r-5&&!lakes.some(poly=>[[x,y],[x-r,y],[x+r,y],[x,y-r],[x,y+r]].some(p=>pointIn(poly,...p)&&!onPatio(...p)))&&!buildings.some(b=>footprint(b).some(([bx,by,w,d])=>x>bx-r&&x<bx+w+r&&y>by-r&&y<by+d+r));}
 for(const b of buildings){b.doorSide='south';if(!validPosition(b.entry.x,b.entry.y)){const candidates=[{x:b.x-4,y:b.y+b.d/2,side:'west'},{x:b.x+b.w+4,y:b.y+b.d/2,side:'east'},{x:b.x+b.w/2,y:b.y-4,side:'north'},...[.25,.75].map(t=>({x:b.x+b.w*t,y:b.y+b.d+4,side:'south'}))];const entry=candidates.find(p=>validPosition(p.x,p.y));if(entry){b.entry={x:entry.x,y:entry.y};b.doorSide=entry.side;}}}
 function canMove(ax,ay,bx,by){const n=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)/1.5));for(let i=1;i<=n;i++)if(!validPosition(ax+(bx-ax)*i/n,ay+(by-ay)*i/n))return false;return true;}
 function nearestDoor(x,y,range=15){return buildings.filter(b=>Math.hypot(x-b.entry.x,y-b.entry.y)<range).sort((a,b)=>Math.hypot(x-a.entry.x,y-a.entry.y)-Math.hypot(x-b.entry.x,y-b.entry.y))[0]||null;}
 function portal(id){return buildings.find(b=>b.id===id&&b.map)||null;}
 return {bounds,spawn,speed,sprintSpeed,lakes,buildings,paths,roads,parking,fields,tables,pointIn,onPatio,footprint,validPosition,canMove,nearestDoor,portal};
});
