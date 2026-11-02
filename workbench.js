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
  let impact = null, captures = 0, hammerAngle = -1.75, capturedSamples = null;
  const strikeButton = document.querySelector('#strike-record');
  const impactPanel = document.querySelector('#impact-panel');
  const impactStatus = document.querySelector('#impact-status');
  const contactAngle = -.53;
  const mazeGrid=['111111111','100010001','101010101','101000101','101110101','100000101','111110001','111111111'];
  const mazeStart=[1,1],mazeGoal=[6,7];
  function solveMaze(){
    const queue=[mazeStart],parents=new Map([[mazeStart.join(','),null]]);
    for(let i=0;i<queue.length;i++){
      const cell=queue[i];if(cell.join(',')===mazeGoal.join(','))break;
      for(const [dr,dc] of [[1,0],[0,1],[-1,0],[0,-1]]){
        const next=[cell[0]+dr,cell[1]+dc],key=next.join(',');
        if(mazeGrid[next[0]]?.[next[1]]==='0'&&!parents.has(key)){parents.set(key,cell);queue.push(next);}
      }
    }
    const path=[];let cell=mazeGoal;while(cell){path.push(cell);cell=parents.get(cell.join(','));}return path.reverse();
  }
  const mazeRoute=solveMaze();let mazeProgress=0,mazeRunning=false;
  const mazeButton=document.querySelector('#maze-run'),mazeReset=document.querySelector('#maze-reset');
  function mazeReadout(){
    const step=Math.min(mazeRoute.length-1,Math.floor(mazeProgress));
    document.querySelector('#bench-readout').innerHTML=`DEMO STEPS / ${step} OF ${mazeRoute.length-1}<br>STATE / ${step===mazeRoute.length-1?'GOAL REACHED':mazeRunning?'NAVIGATING':step?'PAUSED':'READY'}`;
    mazeButton.dataset.step=String(step);mazeButton.dataset.total=String(mazeRoute.length-1);
  }
  const response = t => t < 0 ? 0 : Math.exp(-6*t)*(Math.cos(58*t)+.16*Math.sin(113*t));
  function updateTrace(elapsed=1.4){
    if(!capturedSamples)return;
    const shown=capturedSamples.filter(s=>s.t<=elapsed);
    document.querySelector('#impact-trace').setAttribute('d',shown.map((s,i)=>`${i?'L':'M'}${(12+(s.t+.2)/1.6*576).toFixed(2)},${(47-s.v*32).toFixed(2)}`).join(' '));
    const peak=Math.max(...shown.map(s=>Math.abs(s.v)));
    document.querySelector('#impact-peak').textContent=`Peak ${peak.toFixed(2)} a.u.`;
    impactPanel.dataset.peak=peak.toFixed(3);
  }
  function capture(){
    captures++;
    capturedSamples=Array.from({length:321},(_,i)=>{const t=(i-40)/200;return {t,v:response(t)};});
    document.querySelector('#impact-count').textContent=`${captures} ${captures===1?'capture':'captures'}`;
    impactPanel.dataset.captures=String(captures);
    impactStatus.textContent='Impact detected · recording';
    document.querySelector('#impact-signal').setAttribute('aria-label',`Simulated vibration capture ${captures}: an impact spike followed by a damped oscillation, in arbitrary units.`);
  }
  function updateImpact(time){
    if(!impact)return;
    const age=time-impact.start;
    if(age<420)hammerAngle=-1.75+(contactAngle+1.75)*(age/420)**2;
    else if(age<620)hammerAngle=contactAngle-.23*Math.sin((age-420)/200*Math.PI/2);
    else hammerAngle=contactAngle-.23+(-1.75-contactAngle+.23)*Math.min(1,(age-620)/500);
    if(age>=420&&!impact.hit){impact.hit=true;capture();}
    if(impact.hit)updateTrace(Math.min(1.4,(age-420)/1000));
    if(age>=1820){impact=null;hammerAngle=-1.75;strikeButton.disabled=false;strikeButton.textContent='↓ Strike & record';impactStatus.textContent='Capture saved · ready for another strike';}
  }
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
  function impactRig(){
    const ringing=impact?.hit?(performance.now()-impact.start-420)/1000:2;
    const vibration=ringing>=0&&ringing<1.4?.035*Math.exp(-5*ringing)*Math.sin(65*ringing):0;
    const plateY=-.35+vibration;
    box([-.35,plateY,0],[2,.09,1.05],C.light);
    [-1.12,.42].forEach(x=>[-.38,.38].forEach(z=>box([x,-.78,z],[.1,.78,.1],C.dark)));
    box([.94,-.04,-.42],[.17,2.15,.17],C.steel);
    box([.94,-1.1,-.42],[.55,.1,.65],C.dark);
    tube([.94,1.02,-.42],[.65,1.02,0],.06,C.steel);
    const pivot=[.65,1.02,0];
    const head=add(pivot,[Math.sin(hammerAngle)*1.25,-Math.cos(hammerAngle)*1.25,0]);
    tube(pivot,head,.037,C.copper,10);
    const start=faces.length;
    box(head,[.52,.26,.3],C.steel);
    faces.slice(start).forEach(f=>f.points=f.points.map(p=>{const q=sub(p,head);return add(head,[q[0]*Math.cos(hammerAngle)-q[1]*Math.sin(hammerAngle),q[0]*Math.sin(hammerAngle)+q[1]*Math.cos(hammerAngle),q[2]]);}));
    tube([.65,1.02,-.09],[.65,1.02,.09],.085,C.lime,12);
    const sensor=[-.82,plateY+.11,.2];
    box(sensor,[.18,.14,.18],C.lime);
    box([1.16,-.78,.48],[.48,.09,.38],'#2d513b');
    box([1.16,-.68,.48],[.17,.12,.16],C.dark);
    const cable=[add(sensor,[0,0,.09]),[-.82,plateY+.08,.68],[.78,-.65,.68],[1.16,-.7,.48]];
    line(cable,C.lime,1.6);
    if(impact?.hit&&ringing<1.4){
      const t=(ringing*2.5)%1,section=Math.min(2,Math.floor(t*3)),f=t*3-section;
      const p=add(cable[section],mul(sub(cable[section+1],cable[section]),f));
      box(p,[.07,.07,.07],C.lime);
      for(let k=1;k<4;k++){
        const r=.13+k*.13+ringing*.06;
        const pts=Array.from({length:33},(_,i)=>[.02+r*Math.cos(i*Math.PI/16),plateY+.055,r*Math.sin(i*Math.PI/16)]);
        line(pts,'#9fbe72',Math.max(.4,1.7-ringing));
      }
    }
    label('ACCELEROMETER',[-1.4,-.05,.2]);
    label('SENSOR → ACQUISITION',[.1,-1.13,.45]);
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
    const cellPos=cell=>[(cell[1]-4)*.34,-.95,(cell[0]-3.5)*.34];
    const current=Math.min(mazeRoute.length-1,Math.floor(mazeProgress)),fraction=mazeProgress-current;
    const a=cellPos(mazeRoute[current]),b=cellPos(mazeRoute[Math.min(current+1,mazeRoute.length-1)]);
    const p=add(a,mul(sub(b,a),fraction));
    box([0,-1.02,0],[3.2,.1,2.9],C.dark);
    mazeGrid.forEach((row,r)=>[...row].forEach((wall,c)=>{
      const point=cellPos([r,c]);
      const seen=mazeRoute.slice(0,current+1).some(q=>Math.abs(q[0]-r)+Math.abs(q[1]-c)<=2);
      if(wall==='1')box(add(point,[0,seen?.23:.06,0]),[.33,seen?.45:.1,.33],seen?'#71826b':'#344331');
      else if(seen)box(add(point,[0,.015,0]),[.31,.025,.31],'#405137');
    }));
    const traveled=mazeRoute.slice(0,current+1).map(cellPos).map(p=>add(p,[0,.065,0]));traveled.push(add(p,[0,.065,0]));
    line(traveled,C.lime,2);
    mazeRoute.slice(0,current+1).forEach(c=>{const q=cellPos(c);tube(add(q,[0,.04,0]),add(q,[0,.055,0]),.025,C.lime,8);});
    tube(add(p,[0,.05,0]),add(p,[0,.21,0]),.11,C.lime,18);
    const direction=unit(sub(b,a));
    box(add(p,add([0,.18,0],mul(direction,.11))),[.065,.055,.065],C.dark);
    const goal=cellPos(mazeGoal);tube(add(goal,[0,.03,0]),add(goal,[0,.5,0]),.012,C.light,6);
    face([add(goal,[0,.5,0]),add(goal,[.19,.43,0]),add(goal,[0,.35,0])],C.lime);
    label('START',add(cellPos(mazeStart),[-.2,.1,-.22]));label('IMAGE GOAL',add(goal,[-.2,.67,0]));
    if(current<mazeRoute.length-1){
      const angle=Math.atan2(direction[2],direction[0]);
      for(let i=-2;i<=2;i++){
        const theta=angle+i*.19;let end=p;
        for(let d=.04;d<.8;d+=.04){
          const q=add(p,[Math.cos(theta)*d,0,Math.sin(theta)*d]),r=Math.round(q[2]/.34+3.5),c=Math.round(q[0]/.34+4);
          if(mazeGrid[r]?.[c]!=='0')break;end=q;
        }
        line([add(p,[0,.14,0]),add(end,[0,.14,0])],'#9dc97b',.8);
      }
    }
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
    if(mode==='mechanical')atv();else if(mode==='embedded')impactRig();else if(mode==='simulation')tentacle();else if(mode==='ml')graph();else arm();
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
  function tick(time){frame=0;if((!rotating&&!impact&&!mazeRunning)||!visible||document.hidden)return;const dt=Math.min(50,time-(lastTime||time));lastTime=time;if(rotating)yaw+=dt*.00016;updateImpact(time);if(mazeRunning){mazeProgress=Math.min(mazeRoute.length-1,mazeProgress+dt*.0023);if(mazeProgress>=mazeRoute.length-1){mazeRunning=false;mazeButton.textContent='↻ Run again';mazeButton.setAttribute('aria-pressed','false');}mazeReadout();}draw();if(rotating||impact||mazeRunning)frame=requestAnimationFrame(tick);}
  function schedule(){if((rotating||impact||mazeRunning)&&visible&&!document.hidden&&!frame){lastTime=0;frame=requestAnimationFrame(tick);}}
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
  strikeButton.addEventListener('click',()=>{
    if(mode!=='embedded'||impact)return;
    if(reduceMotion.matches){capture();updateTrace();impactStatus.textContent='Capture saved · reduced-motion view';hammerAngle=-1.75;draw();return;}
    impact={start:performance.now(),hit:false};strikeButton.disabled=true;strikeButton.textContent='Recording…';impactStatus.textContent='Armed · hammer approaching';schedule();
  });
  mazeButton.addEventListener('click',()=>{
    if(mode!=='ml')return;
    if(reduceMotion.matches){mazeProgress=mazeRoute.length-1;mazeRunning=false;mazeButton.textContent='↻ Run again';mazeReadout();draw();return;}
    if(mazeProgress>=mazeRoute.length-1)mazeProgress=0;
    mazeRunning=!mazeRunning;mazeButton.setAttribute('aria-pressed',String(mazeRunning));mazeButton.textContent=mazeRunning?'Ⅱ Pause route':'▶ Run route';mazeReadout();draw();schedule();
  });
  mazeReset.addEventListener('click',()=>{mazeProgress=0;mazeRunning=false;mazeButton.textContent='▶ Run route';mazeButton.setAttribute('aria-pressed','false');mazeReadout();draw();});
  reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches&&rotating)document.querySelector('#rotate-toggle').click();});
  window.setWorkbenchMode=track=>{
    if(track!==mode&&impact){impact=null;hammerAngle=-1.75;strikeButton.disabled=false;strikeButton.textContent='↓ Strike & record';if(capturedSamples){updateTrace();impactStatus.textContent='Capture saved · ready for another strike';}else impactStatus.textContent='Press Strike & record';}
    if(track!=='ml')mazeRunning=false;
    mode=track;yaw=track==='embedded'?-.45:track==='ml'?-.45:-.65;pitch=track==='embedded'?.28:track==='ml'?.72:.35;zoom=1;
    impactPanel.hidden=track!=='embedded';strikeButton.hidden=track!=='embedded';document.querySelector('#system-input').closest('label').hidden=track==='embedded'||track==='ml';
    mazeButton.hidden=track!=='ml';mazeReset.hidden=track!=='ml';document.querySelector('#rotate-toggle').hidden=track==='ml';
    if(track==='ml'){mazeButton.textContent='▶ Run route';mazeButton.setAttribute('aria-pressed','false');mazeReadout();}
    canvas.setAttribute('aria-label',track==='embedded'?'Interactive 3D impact-sensing rig: hammer, plate, accelerometer and wired acquisition board. Press Strike and record to capture an illustrative vibration response.':'Interactive 3D engineering illustration. Use the rotation and view controls below.');
    draw();
    if(track==='simulation'){
      if(!geometryPromise)geometryPromise=fetch('assets/tentacle-geometry.json').then(r=>{if(!r.ok)throw Error('Geometry unavailable');return r.json();}).then(g=>{tentacleGeometry=g;return g;}).catch(()=>null);
      geometryPromise.then(g=>{if(g&&mode==='simulation'){document.querySelector('#bench-caption').textContent='Original CAD-derived meshes · Interactive articulation; not executed MuJoCo or calibrated material physics';draw();}});
    }
  };
  resize();
})();
