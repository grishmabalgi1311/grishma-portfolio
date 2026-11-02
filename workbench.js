/* Lightweight 3D workbench. All rendering is local; no tracking or external engine. */
(() => {
  'use strict';
  const canvas = document.querySelector('#system-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let yaw = -.65, pitch = .35, zoom = 1, mode = 'all', value = 12;
  let rotating = false, visible = true, frame = 0, lastTime = 0, drag = null;
  let width = 600, height = 520, faces = [], lines = [], labels = [], tentacleGeometry = null, geometryPromise = null;
  const C = { lime: '#cdf568', steel: '#637666', light: '#bac6b5', dark: '#25372b', tire: '#27332b', copper: '#9dba78' };
  const add = (a,b) => a.map((x,i)=>x+b[i]);
  const sub = (a,b) => a.map((x,i)=>x-b[i]);
  const mul = (a,n) => a.map(x=>x*n);
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const unit = a => mul(a,1/(Math.hypot(...a)||1));
  function face(points,color,edge=null){faces.push({points,color,edge});}
  function line(points,color=C.lime,weight=1){lines.push({points,color,weight});}
  function box(c,s,color=C.steel){
    const [x,y,z]=c,[a,b,d]=s.map(x=>x/2);
    const v=[[-a,-b,-d],[a,-b,-d],[a,b,-d],[-a,b,-d],[-a,-b,d],[a,-b,d],[a,b,d],[-a,b,d]].map(p=>add(p,[x,y,z]));
    [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]].forEach(f=>face(f.map(i=>v[i]),color,'#a2bd8b24'));
  }
  function tube(a,b,r,color=C.light,segments=10){
    const axis=unit(sub(b,a));const u=unit(cross(axis,Math.abs(axis[1])>.9?[1,0,0]:[0,1,0]));const v=cross(axis,u);
    const ring=p=>Array.from({length:segments},(_,i)=>add(p,add(mul(u,Math.cos(i*2*Math.PI/segments)*r),mul(v,Math.sin(i*2*Math.PI/segments)*r))));
    const ra=ring(a),rb=ring(b);
    for(let i=0;i<segments;i++){const j=(i+1)%segments;face([ra[i],ra[j],rb[j],rb[i]],color);}
    face(ra,color);face([...rb].reverse(),color);
  }
  function label(text,p,color='#a9c692'){labels.push({text,p,color});}
  function arm(){
    box([0,-1.05,0],[1.1,.12,.9],C.dark);
    tube([0,-.99,0],[0,-.68,0],.25,C.steel,20);
    const a=[0,-.68,0], t=(value+40)*Math.PI/180;
    const b=[Math.cos(t)*1.05,a[1]+Math.sin(t)*1.05,0];
    const e=[b[0]+Math.cos(t-.85)*.85,b[1]+Math.sin(t-.85)*.85,0];
    tube(a,b,.12,C.light,12);tube(b,e,.085,C.lime,12);
    [a,b,e].forEach((p,i)=>tube(add(p,[0,0,-.18]),add(p,[0,0,.18]),i===2?.13:.19,C.steel,18));
    tube(e,add(e,[.18,-.15,0]),.07,C.light);
    const g=add(e,[.18,-.15,0]);
    [-1,1].forEach(s=>{line([g,add(g,[.13,-.2,s*.13]),add(g,[.25,-.32,s*.13])],C.lime,4);});
    label('01 / ACTUATION',[-1.18,-.7,0]);label('02 / JOINT',add(b,[-.5,.25,0]));label('03 / TOOL',add(e,[.05,.3,0]));
    line([[-1.1,-1,0],[-.5,-1,0]],'#637e51',1);
  }
  function atv(){
    // Explanatory reconstruction from the original team's side, top and perspective CAD views.
    // Dimensions are normalized for presentation; this is not a manufacturing CAD model.
    const z=.53, bottom=-.68, bump=value/250;
    const side=[[-1.28,bottom],[-1.4,-.2],[-.7,.28],[-.28,1.02],[.6,1.02],[1.0,.52],[1.15,-.58]];
    [-z,z].forEach(s=>{
      for(let i=0;i<side.length-1;i++)tube([...side[i],s],[...side[i+1],s],.025,C.light,6);
      tube([...side[0],s],[...side[6],s],.03,C.light,6);
      tube([-.7,.28,s],[.65,-.6,s],.022,C.steel,6);
      tube([-.28,1.02,s],[.35,-.6,s],.021,C.steel,6);
      tube([-.7,.28,s],[-.35,-.6,s],.025,C.light,6);
      face([[-1.27,-.62,s],[-1.37,-.22,s],[-.7,.23,s],[-.36,-.6,s]],C.dark,'#7a9363');
      face([[-.32,-.6,s],[.59,-.6,s],[.66,.13,s],[-.5,.13,s]],'#31432e','#7a9363');
    });
    [0,1,3,4,6].forEach(i=>tube([...side[i],-z],[...side[i],z],.026,C.light,6));
    tube([-.28,1.02,-z],[.6,1.02,z],.019,C.steel,6);
    box([.2,-.35,0],[.5,.1,.53],C.steel);box([.45,-.05,0],[.15,.55,.5],C.steel);
    box([.9,-.49,0],[.35,.22,.45],C.copper);
    [-1.04,.9].forEach((x,axle)=>[-1,1].forEach(s=>{
      const y=-.68+(axle?bump:-bump), wheel=[x,y,s*.82];
      tube([x,y,s*.65],[x,y,s*1.0],.36,C.tire,22);
      tube([x,y,s*1.005],[x,y,s*1.025],.18,C.steel,16);
      tube([x,y,s*1.03],[x,y,s*1.04],.065,C.lime,12);
      tube([x-.17,-.56,s*.4],wheel,.022,C.light,6);
      tube([x+.17,-.56,s*.4],wheel,.022,C.light,6);
      tube([x,-.1,s*.48],add(wheel,[0,.09,0]),.035,C.lime,8);
      for(let i=0;i<14;i++){const t=i*Math.PI/7;line([[x+Math.cos(t)*.365,y+Math.sin(t)*.365,s*.66],[x+Math.cos(t)*.365,y+Math.sin(t)*.365,s*.99]],'#68795b',1.4);}
    }));
    label('VJTI RACING / ELECTRIC ATV',[-1.4,1.35,0]);
  }
  function chip(){
    box([0,-.3,0],[2.4,.08,1.7],'#2d513b');
    box([-.1,-.15,0],[.65,.2,.65],C.dark);
    for(let i=0;i<8;i++){
      const x=-.37+i*.08;
      [-1,1].forEach(s=>{tube([x,-.14,s*.34],[x,-.26,s*.45],.013,C.light,5);line([[x,-.25,s*.47],[x,-.25,s*.63],[s*1.05,-.25,s*.63]],'#b3cf77',1);});
    }
    box([.79,-.14,.02],[.3,.22,.5],C.light);
    box([-.86,-.18,.4],[.18,.12,.2],C.copper);
    for(let i=0;i<5;i++)box([-.8+i*.24,-.19,-.66],[.1,.14,.1],C.light);
    const pts=Array.from({length:90},(_,i)=>{const t=i/89;return [-1.1+2.2*t,.4+Math.sin(t*9+value/20)*(.12+value/180),.25];});
    line(pts,C.lime,2.5);line([[-1.12,.4,.25],[1.15,.4,.25]],'#4c6744',1);
    label('IMU → FILTER → DTW → STATE',[-1.12,.9,0]);label('STM32 / I²C',[-.7,-.7,0]);
  }
  function tentacle(){
    if(tentacleGeometry){
      let origin=[0,0,0],angle=0;
      const turn=p=>[p[0]*Math.cos(angle)-p[1]*Math.sin(angle),p[0]*Math.sin(angle)+p[1]*Math.cos(angle),p[2]];
      const display=p=>[-p[1]*8,p[0]*8-1.05,p[2]*8];
      tentacleGeometry.parts.forEach((part,i)=>{
        origin=add(origin,turn(part.pos));
        if(i)angle+=value*Math.PI/180/17;
        const vertices=part.vertices.map(v=>display(add(origin,turn(v))));
        part.faces.forEach(f=>face(f.map(j=>vertices[j]),i%2?C.steel:C.light));
      });
      box([0,-1.12,0],[.75,.12,.75],C.dark);
      return;
    }
    const n=18, bend=value/65, pts=[];
    box([0,-1.12,0],[.75,.12,.75],C.dark);
    for(let i=0;i<=n;i++){const t=i/n;pts.push([Math.sin(t*bend*2.5)*t*.8,-1.05+t*2.1,Math.cos(t*bend*2)*t*.25]);}
    for(let i=0;i<n;i++)tube(pts[i],pts[i+1],.18*(1-i/n)+.025,i%2?C.steel:C.light,10);
    [-1,1].forEach(s=>line(pts.map((p,i)=>add(p,[s*(.18*(1-i/n)+.03),0,0])),C.lime,1.5));
    label('18 SEGMENTS / 17 PASSIVE JOINTS',[-1.25,1.5,0]);
    label('TENDON ROUTING',[-1.08,-.3,0]);
  }
  function graph(){
    const nodes=[];
    for(let r=0;r<5;r++)for(let c=0;c<6;c++)nodes.push([-1.3+c*.52,-.55,r*.4-.8]);
    nodes.forEach((p,i)=>{if((i+1)%6)line([p,nodes[i+1]],'#567048',1);if(i<24)line([p,nodes[i+6]],'#567048',1);box(p,[.065,.07,.065],C.steel);});
    const route=[24,18,12,13,14,8,9,10,4,5];
    line(route.map(i=>add(nodes[i],[0,.05,0])),C.lime,3);
    const index=Math.min(route.length-1,Math.floor((value+45)/90*route.length));const p=nodes[route[index]];
    box(add(p,[0,.17,0]),[.22,.2,.22],C.lime);
    label('LOCALIZE → PLAN → ACT',[-1.3,.75,0]);
    label('ILLUSTRATIVE TOPOLOGICAL ROUTE',[-1.3,-1.0,0]);
  }
  function project(p){
    const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw);
    const y=p[1]*Math.cos(pitch)-z*Math.sin(pitch), depth=p[1]*Math.sin(pitch)+z*Math.cos(pitch);
    const scale=Math.min(width/4.4,height/3.6)*zoom*(5/(5+depth*.3));
    return [width/2+x*scale,height*.49-y*scale,depth];
  }
  function shade(hex,n){const rgb=hex.match(/\w\w/g).map(x=>parseInt(x,16));const f=.6+Math.abs(n[1]*.5+n[2]*.7)*.4;return `rgb(${rgb.map(x=>Math.round(x*f)).join(',')})`;}
  function draw(){
    faces=[];lines=[];labels=[];ctx.clearRect(0,0,width,height);
    for(let i=-4;i<=4;i++){line([[i*.45,-1.15,-1.8],[i*.45,-1.15,1.8]],'#45603b',.4);line([[-1.8,-1.15,i*.45],[1.8,-1.15,i*.45]],'#45603b',.4);}
    if(mode==='mechanical')atv();else if(mode==='embedded')chip();else if(mode==='simulation')tentacle();else if(mode==='ml')graph();else arm();
    if(mode==='all'||mode==='robotics'){
      faces.forEach(f=>f.points=f.points.map(p=>add(p,[-.65,.3,0])));
      lines.slice(18).forEach(l=>l.points=l.points.map(p=>add(p,[-.65,.3,0])));
      labels.forEach(l=>l.p=add(l.p,[-.65,.3,0]));
    }
    const queue=faces.map(f=>({...f,screen:f.points.map(project),normal:unit(cross(sub(f.points[1],f.points[0]),sub(f.points[2],f.points[0])))}));
    queue.forEach(f=>f.depth=f.screen.reduce((a,p)=>a+p[2],0)/f.screen.length);
    queue.sort((a,b)=>b.depth-a.depth).forEach(f=>{ctx.beginPath();f.screen.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=shade(f.color,f.normal);ctx.fill();if(f.edge){ctx.strokeStyle=f.edge;ctx.lineWidth=.6;ctx.stroke();}});
    lines.forEach(l=>{ctx.beginPath();l.points.map(project).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=l.color;ctx.lineWidth=l.weight;ctx.stroke();});
    labels.forEach(l=>{const p=project(l.p);ctx.fillStyle=l.color;ctx.font='8px monospace';ctx.fillText(l.text,p[0],p[1]);});
  }
  function tick(time){frame=0;if(!rotating||!visible||document.hidden)return;const dt=Math.min(50,time-(lastTime||time));lastTime=time;yaw+=dt*.00016;draw();frame=requestAnimationFrame(tick);}
  function schedule(){if(rotating&&visible&&!document.hidden&&!frame){lastTime=0;frame=requestAnimationFrame(tick);}}
  function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.05}).observe(canvas);
  document.addEventListener('visibilitychange',schedule);
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.008;pitch=Math.max(-.4,Math.min(1.25,pitch+(e.clientY-drag.y)*.006));drag={x:e.clientX,y:e.clientY};draw();});
  canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
  canvas.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.altKey)return;e.preventDefault();zoom=Math.max(.6,Math.min(1.6,zoom-e.deltaY*.001));draw();},{passive:false});
  document.querySelector('#rotate-toggle').addEventListener('click',e=>{rotating=!rotating;e.currentTarget.setAttribute('aria-pressed',String(rotating));e.currentTarget.textContent=rotating?'Ⅱ Pause rotation':'↻ Auto-rotate';schedule();});
  document.querySelector('#reset-view').addEventListener('click',()=>{yaw=-.65;pitch=.35;zoom=1;draw();});
  document.querySelector('#system-input').addEventListener('input',e=>{value=Number(e.target.value);document.querySelector('#system-output').textContent=value+'°';draw();});
  reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches&&rotating)document.querySelector('#rotate-toggle').click();});
  window.setWorkbenchMode=track=>{
    mode=track;yaw=track==='embedded'?-.4:-.65;pitch=track==='embedded'?.62:.35;zoom=1;draw();
    if(track==='simulation'){
      if(!geometryPromise)geometryPromise=fetch('assets/tentacle-geometry.json').then(r=>{if(!r.ok)throw Error('Geometry unavailable');return r.json();}).then(g=>{tentacleGeometry=g;return g;}).catch(()=>null);
      geometryPromise.then(g=>{if(g&&mode==='simulation'){document.querySelector('#bench-caption').textContent='Original CAD-derived meshes · Interactive articulation; not executed MuJoCo or calibrated material physics';draw();}});
    }
  };
  resize();
})();
