/**
 * Counsel Studio V3 and V4 square drawing (Hunter, 2026-10-07). Pure drawing
 * and layout on canvas: every clock, scroll position and pointer value comes
 * in from channel-v5-src/animations.js, which owns all choreography.
 */
const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
const smooth=t=>t*t*(3-2*t);
const easeInOut=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const hex=value=>{const n=parseInt(value.slice(1),16);return[n>>16&255,n>>8&255,n&255];};
// A small seeded random, so a population looks the same on every load.
function seeded(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}

function setup(canvas){
  const ctx=canvas.getContext('2d');
  let w=0,h=0,ratio=1;
  const size=()=>{
    ratio=Math.min(2,window.devicePixelRatio||1);
    w=canvas.clientWidth;h=canvas.clientHeight;
    canvas.width=Math.max(1,Math.round(w*ratio));canvas.height=Math.max(1,Math.round(h*ratio));
    ctx.setTransform(ratio,0,0,ratio,0,0);
  };
  size();
  // Squares snap to device pixels so they stay crisp at any size.
  const square=(x,y,s,alpha)=>{
    if(alpha<=.01)return;
    ctx.globalAlpha=Math.min(1,alpha);
    ctx.fillRect(Math.round(x*ratio)/ratio,Math.round(y*ratio)/ratio,Math.max(1,Math.round(s*ratio))/ratio,Math.max(1,Math.round(s*ratio))/ratio);
  };
  return{ctx,size,square,get w(){return w;},get h(){return h;}};
}

/**
 * V3's population: one square per member across the whole field. A slow band
 * of light crosses it (care moving through a plan) and single members light
 * up and fade. render({time,reveal}) draws one frame; time is seconds.
 */
export function createPopulation(canvas,{color='#AED9B0',pitch=14,size=5,base=.12,spark=.95}={}){
  const view=setup(canvas);
  let cols=0,rows=0,sparks=[],random=seeded(7);
  const layout=()=>{view.size();cols=Math.ceil(view.w/pitch)+1;rows=Math.ceil(view.h/pitch)+1;};
  layout();
  return{
    resize:layout,
    render({time=0,reveal=1}={}){
      const {ctx}=view;ctx.clearRect(0,0,view.w,view.h);ctx.fillStyle=color;
      const sweep=((time*.09)%1.4-.2)*view.w,width=view.w*.22;
      // a few members light up each second, each glowing for about 1.6s
      if(sparks.length<Math.round(cols*rows*.004)&&random()<.35)sparks.push({c:Math.floor(random()*cols),r:Math.floor(random()*rows),t:time});
      sparks=sparks.filter(s=>time-s.t<1.6&&time>=s.t);
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
        const x=c*pitch,y=r*pitch,d=(x-sweep)/width;
        const wave=Math.exp(-d*d*2)*.42*(.6+.4*Math.sin(r*.35+time*.6));
        const fade=clamp(reveal*1.6-(c/cols)*.6);
        view.square(x,y,size,(base+wave)*fade);
      }
      sparks.forEach(s=>{const k=(time-s.t)/1.6,glow=Math.sin(Math.PI*k);view.square(s.c*pitch,s.r*pitch,size,glow*spark*reveal);});
      ctx.globalAlpha=1;
    },
  };
}

/**
 * V3's story: the same members through five states.
 * 0 your members, 1 questions come up, 2 answered inside your app,
 * 3 routed to the right care, 4 fewer trips to the ER.
 * render(progress) takes 0..4 and blends neighbouring states per member.
 */
export const ROUTES=['Answered by medical AI','A doctor in minutes','Virtual visit','In-person or ER'];
export function createStory(canvas,{color='#AED9B0'}={}){
  const view=setup(canvas);
  const ROUTE_COUNTS=[22,13,7,6],LIT=ROUTE_COUNTS.reduce((a,b)=>a+b,0),GHOSTS=4;
  let members=[],frame=null,columns=[],dot=8,cols=24,rows=14;
  const build=()=>{
    view.size();
    const w=view.w,h=view.h,narrow=w<620;
    cols=narrow?14:24;rows=narrow?18:14;
    const pitch=Math.min((w*.94)/(cols-1),(h*.84)/(rows-1));dot=Math.max(4,Math.min(10,pitch*.46));
    const x0=w/2-pitch*(cols-1)/2,y0=h/2-pitch*(rows-1)/2;
    const random=seeded(31),order=Array.from({length:cols*rows},(_,i)=>i).sort(()=>random()-.5),lit=new Set(order.slice(0,LIT));
    // The app: a phone-shaped frame at the centre holding the questions.
    const fw=Math.min(w*.3,pitch*10),fh=Math.min(h*.82,fw*1.9);frame={x:w/2-fw/2,y:h/2-fh/2,w:fw,h:fh,r:fw*.16};
    const fCols=6,fPitch=fw*.62/(fCols-1),fRows=Math.ceil(LIT/fCols),fx=w/2-fPitch*(fCols-1)/2,fy=h/2-fPitch*(fRows-1)/2;
    // Routes: four bars, two squares wide, along the bottom; labels under them.
    const colGap=Math.min(w*.2,170),cx0=w/2-colGap*1.5,base=h*.8,step=Math.max(dot+3,pitch*.6);
    columns=ROUTE_COUNTS.map((count,i)=>({x:cx0+i*colGap,count,label:ROUTES[i]}));
    const slot=(column,n)=>({x:column.x+(n%2?step/2:-step/2)-dot/2,y:base-Math.floor(n/2)*step});
    let litIndex=0;
    members=Array.from({length:cols*rows},(_,i)=>{
      const home={x:x0+(i%cols)*pitch,y:y0+Math.floor(i/cols)*pitch};
      const m={home,lit:lit.has(i),order:i/(cols*rows)};
      if(m.lit){
        const k=litIndex++;m.app={x:fx+(k%fCols)*fPitch,y:fy+Math.floor(k/fCols)*fPitch};
        let c=0,rest=k;while(rest>=ROUTE_COUNTS[c]){rest-=ROUTE_COUNTS[c];c++;}
        m.route=slot(columns[c],rest);m.column=c;
      }
      return m;
    });
    // The ER column's avoided visits, drawn as outlines above it in state 4.
    const er=columns[3];er.ghosts=Array.from({length:GHOSTS},(_,g)=>slot(er,ROUTE_COUNTS[3]+g));
    columns.forEach(c=>{c.labelY=base+dot+22;});
  };
  build();
  const stateOf=(m,s)=>{
    if(s===0)return{...m.home,a:.24};
    if(s===1)return{...m.home,a:m.lit?1:.24};
    if(s===2)return m.lit?{...m.app,a:1}:{...m.home,a:.09};
    return m.lit?{...m.route,a:1}:{...m.home,a:.09};
  };
  const roundRect=(x,y,w,h,r)=>{const {ctx}=view;ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();};
  return{
    resize:build,
    columns:()=>columns,
    render(progress=0){
      const {ctx}=view;ctx.clearRect(0,0,view.w,view.h);ctx.fillStyle=color;ctx.strokeStyle=color;
      const k=Math.min(3,Math.floor(progress)),f=clamp(progress-k);
      members.forEach(m=>{
        const a=stateOf(m,k),b=stateOf(m,k+1),t=easeInOut(clamp(f*1.4-m.order*.4));
        view.square(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,dot,a.a+(b.a-a.a)*t);
      });
      // the app frame belongs to state 2, the avoided ER visits to state 4
      const appWeight=progress<2?clamp(progress-1):clamp(3-progress);
      if(appWeight>.01){ctx.globalAlpha=appWeight*.55;ctx.lineWidth=1.5;roundRect(frame.x,frame.y,frame.w,frame.h,frame.r);ctx.stroke();}
      const ghost=clamp(progress-3);
      if(ghost>.01){ctx.globalAlpha=ghost*.7;ctx.lineWidth=1.25;columns[3].ghosts.forEach(g=>ctx.strokeRect(Math.round(g.x)+.5,Math.round(g.y)+.5,Math.round(dot)-1,Math.round(dot)-1));}
      ctx.globalAlpha=1;
    },
  };
}

/**
 * V4's hero: health insights in, clinical action out. Six coloured source
 * lanes run in from the left as steady trains and converge on Counsel's 3x3
 * at the centre; each square it takes in flashes its colour there and leaves
 * to the right as a white care action, round-robin across four lanes.
 * render({time}) advances the simulation by the time since the last frame.
 */
export const FLOW_SOURCES=['Health records','Claims','Wearables','Lab results','Referral network','Formulary'];
export const FLOW_ACTIONS=['Medical advice','Prescriptions','Labs','Specialist referrals'];
export function createFlow(canvas,{colors,ink='#F8F8F6'}){
  const view=setup(canvas);
  // Seconds between squares on each source lane: steady, a little different per lane.
  const INTERVAL=FLOW_SOURCES.map((_,lane)=>.62+((lane*3)%5)*.07);
  let geo=null,particles=[],flashes=[],spawn=[],sent=0,last=null,clock=0,random=seeded(11);
  const build=()=>{
    view.size();
    const w=view.w,h=view.h,narrow=w<700,top=h*.1,bottom=h*.9,cy=(top+bottom)/2,g=narrow?16:22;
    geo={w,h,cx:w/2,cy,g,dot:narrow?6:8,speed:narrow?70:110,
      ins:FLOW_SOURCES.map((_,i)=>top+(bottom-top)*i/(FLOW_SOURCES.length-1)),
      outs:FLOW_ACTIONS.map((_,i)=>top+(bottom-top)*(i+.5)/FLOW_ACTIONS.length)};
  };
  // Lanes run straight, then bend toward the centre (in) or away from it (out).
  const inPoint=(lane,t)=>{const {cx,cy,g}=geo,x=-12+(cx-g*2.2+12)*t,y=geo.ins[lane]+(cy-geo.ins[lane])*smooth(clamp((t-.38)/.62));return{x,y};};
  const outPoint=(lane,t)=>{const {cx,cy,g,w}=geo,x=cx+g*2.2+(w+12-cx-g*2.2)*t,y=cy+(geo.outs[lane]-cy)*smooth(clamp(t/.55));return{x,y};};
  const span=()=>geo.cx;
  // Start mid-flow: every lane already carrying its train.
  const prefill=()=>{
    particles=[];flashes=[];sent=0;
    const per=geo.speed/span();
    FLOW_SOURCES.forEach((_,lane)=>{const gap=INTERVAL[lane]*per;for(let t=random()*gap;t<1;t+=gap)particles.push({dir:'in',lane,t});});
    const outGap=INTERVAL.reduce((a,b)=>a+1/b,0),each=per*1.15*FLOW_ACTIONS.length/outGap;
    FLOW_ACTIONS.forEach((_,lane)=>{for(let t=random()*each;t<1;t+=each)particles.push({dir:'out',lane,t});});
    spawn=INTERVAL.map(i=>random()*i);
  };
  build();prefill();
  return{
    resize(){build();prefill();},
    labels:()=>({ins:geo.ins,outs:geo.outs,cx:geo.cx,cy:geo.cy,w:geo.w,g:geo.g}),
    render({time=0,still=false}={}){
      const dt=last===null||still?0:Math.min(.05,Math.max(0,time-last));last=time;clock+=dt;
      const {ctx}=view,{dot,speed,cx,cy,g}=geo,step=speed*dt/span();
      ctx.clearRect(0,0,view.w,view.h);
      // dotted lane guides so the system reads even between squares
      ctx.fillStyle=ink;
      FLOW_SOURCES.forEach((_,lane)=>{for(let t=0;t<=1;t+=.014){const p=inPoint(lane,t);view.square(p.x-1,p.y-1,2,.13);}});
      FLOW_ACTIONS.forEach((_,lane)=>{for(let t=0;t<=1;t+=.018){const p=outPoint(lane,t);view.square(p.x-1,p.y-1,2,.13);}});
      if(dt>0){
        spawn=spawn.map((s,lane)=>{let next=s-dt;if(next<=0){particles.push({dir:'in',lane,t:0});next+=INTERVAL[lane];}return next;});
        particles.forEach(p=>{p.t+=step*(p.dir==='in'?1:1.15);});
        particles.filter(p=>p.dir==='in'&&p.t>=1).forEach(p=>{
          flashes.push({i:Math.floor(random()*9),color:colors[p.lane%colors.length],at:clock});
          particles.push({dir:'out',lane:sent++%FLOW_ACTIONS.length,t:0});
        });
        particles=particles.filter(p=>p.t<1);
        flashes=flashes.filter(f=>clock-f.at<.6);
      }
      particles.forEach(p=>{
        const q=p.dir==='in'?inPoint(p.lane,p.t):outPoint(p.lane,p.t);
        ctx.fillStyle=p.dir==='in'?colors[p.lane%colors.length]:ink;
        const fade=p.dir==='in'?clamp(p.t*12)*clamp((1-p.t)*14):clamp(p.t*14)*clamp((1-p.t)*12);
        view.square(q.x-dot/2,q.y-dot/2,dot,fade);
      });
      // Counsel: nine squares; each insight that arrives flashes its colour in one
      const s=g*.62,gap=g*.38,at=i=>({x:cx-(s*1.5+gap)+(i%3)*(s+gap),y:cy-(s*1.5+gap)+Math.floor(i/3)*(s+gap)});
      ctx.fillStyle=ink;
      for(let i=0;i<9;i++){const p=at(i);view.square(p.x,p.y,s,.92);}
      flashes.forEach(f=>{const p=at(f.i),k=(clock-f.at)/.6;ctx.fillStyle=f.color;view.square(p.x,p.y,s,1-k*k);});
      ctx.globalAlpha=1;
    },
  };
}

/**
 * V4's brand repaint: a diagonal sweep of squares in the incoming brand's
 * colour crosses the phone while its theme changes underneath.
 * render(progress 0..1, colour).
 */
export function createRepaint(canvas){
  const view=setup(canvas);
  return{
    resize:()=>view.size(),
    render(progress,color){
      const {ctx}=view;ctx.clearRect(0,0,view.w,view.h);
      if(progress<=0||progress>=1)return;
      ctx.fillStyle=color;
      const pitch=14,front=progress*1.7-.35;
      for(let y=0;y<view.h+pitch;y+=pitch)for(let x=0;x<view.w+pitch;x+=pitch){
        const d=x/view.w*.55+y/view.h*.45,local=clamp(1-Math.abs(d-front)/.18);
        if(local<=0)continue;
        const s=(pitch-2)*local;view.square(x+(pitch-s)/2,y+(pitch-s)/2,s,.92);
      }
      ctx.globalAlpha=1;
    },
  };
}
