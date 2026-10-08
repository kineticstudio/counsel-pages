/**
 * Counsel Studio V1 (Hunter, 2026-10-06): the brand book's dot-column weave,
 * "Your health results all in one place", drawn on canvas. Pure drawing and
 * layout. Every clock, scroll position and pointer value is passed in by
 * channel-v5-src/animations.js, which owns all choreography.
 */
export const STUDIO_COLORS={blue:'#9ABDDB',lime:'#DBE64C',green:'#80C48A',yellow:'#FADA78',sky:'#47AFFF',pink:'#FF93AD',ink:'#F8F8F6'};

// Column heights and colors read off the brand book page, left to right. On
// dark green the book's ochre runs become lime so every run stays legible.
const BOOK=[[1,'blue'],[2,'blue'],[4,'blue'],[3,'lime'],[2,'lime'],[3,'lime'],[5,'green'],[6,'green'],[7,'green'],[5,'green'],[4,'yellow'],[2,'yellow'],[1,'yellow'],[3,'green'],[2,'sky'],[1,'sky']];

const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
const easeOut=t=>1-Math.pow(1-t,3);
const easeInOut=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const hex=value=>{const n=parseInt(value.slice(1),16);return[n>>16&255,n>>8&255,n&255];};

function setup(canvas){
  const ctx=canvas.getContext('2d');
  let w=0,h=0,ratio=1;
  const size=()=>{
    ratio=Math.min(2,window.devicePixelRatio||1);
    w=canvas.clientWidth;h=canvas.clientHeight;
    canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
  };
  size();
  // Snap squares to device pixels so the weave stays crisp at any size.
  const square=(x,y,s,color,alpha)=>{
    if(alpha<=.01)return;
    const px=Math.round(x*ratio)/ratio,py=Math.round(y*ratio)/ratio,ps=Math.max(1,Math.round(s*ratio))/ratio;
    ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(px,py,ps,ps);
  };
  return{ctx,size,square,get w(){return w;},get h(){return h;}};
}

/**
 * Hero waveform: mirrored columns above and below the headline, spanning its
 * measured text width. render({reveal,time,pointer}) draws one frame:
 * reveal 0..1 grows columns outward from the centre, time drives a slow drift,
 * pointer {x,strength} lifts the columns nearest the cursor by about one dot.
 */
export function createWaveform(canvas){
  const view=setup(canvas);
  let layout=null;
  const columnsFor=width=>width<520?10:width<820?13:BOOK.length;
  const resample=count=>Array.from({length:count},(_,i)=>BOOK[Math.round(i/(count-1)*(BOOK.length-1))]);
  return{
    // left/right: the headline's text edges; top/bottom: the rows next to it.
    measure({left,right,top,bottom}){
      view.size();
      const columns=resample(columnsFor(right-left)),pitch=(right-left)/(columns.length-1);
      const dot=clamp(pitch*.17,5,11),step=dot*2.15;
      layout={left,top,bottom,columns,pitch,dot,step};
      return{dot,step,reach:7*step+dot};
    },
    render({reveal=1,time=0,pointer=null}={}){
      const {ctx}=view;ctx.clearRect(0,0,view.w,view.h);
      if(!layout)return;
      const {left,top,bottom,columns,pitch,dot,step}=layout,mid=(columns.length-1)/2;
      columns.forEach(([height,color],i)=>{
        const x=left+i*pitch-dot/2;
        const delay=Math.abs(i-mid)/mid*.45,grow=easeOut(clamp((reveal-delay)/.55));
        const lift=pointer?pointer.strength*clamp(1-Math.abs(x+dot/2-pointer.x)/(pitch*2.2))*1.2:0;
        const drift=[Math.sin(time*.55+i*.7)*.55+Math.sin(time*1.15+i*1.9)*.3,Math.sin(time*.5+i*.9+2)*.55+Math.sin(time*1.25+i*1.4+1)*.3];
        [[-1,drift[0]],[1,drift[1]]].forEach(([direction,wave])=>{
          const visible=Math.max(0,(height+wave+lift)*grow);
          for(let k=0;k<Math.ceil(visible);k++){
            const y=direction<0?top-dot-k*step:bottom+k*step;
            view.square(x,y,dot,STUDIO_COLORS[color],clamp(visible-k));
          }
        });
      });
      ctx.globalAlpha=1;
    },
  };
}

/* ---------- The outcomes field: one set of squares, four arrangements ----- */
const N=192;
const PALETTE=['blue','lime','green','yellow','sky','pink'];

function sortPoints(points){return points.sort((a,b)=>a.x-b.x||a.y-b.y);}

// Expand access at scale: the hero's waveform, widened to many more columns.
function waveLayout(w,h,s){
  const cols=18,totals=Array.from({length:cols},(_,i)=>{const u=i/(cols-1);return 3+Math.round(11*Math.pow(Math.sin(Math.PI*u),1.6)*(0.75+0.25*Math.sin(u*17)));});
  let sum=totals.reduce((a,b)=>a+b,0),i=Math.floor(cols/2);
  while(sum<N){totals[i%cols]++;sum++;i+=5;} while(sum>N){const j=totals.indexOf(Math.max(...totals));totals[j]--;sum--;}
  const pitch=w*.86/(cols-1),x0=w*.07,step=s*2.3,points=[];
  const colorAt=c=>['blue','blue','lime','lime','green','green','green','yellow','yellow','sky'][Math.floor(c/cols*10)];
  totals.forEach((total,c)=>{
    const up=Math.ceil(total/2),down=total-up;
    for(let k=0;k<up;k++)points.push({x:x0+c*pitch,y:h/2-s*2.4-k*step,color:colorAt(c),alpha:1});
    for(let k=0;k<down;k++)points.push({x:x0+c*pitch,y:h/2+s*1.4+k*step,color:colorAt(c),alpha:1});
  });
  return{points:sortPoints(points),labels:[]};
}

// Care informed by your data: six sources converge into one personal stream.
export const SOURCES=['Health records','Claims','Wearables','Lab results','Referral network','Formulary'];
function sourcesLayout(w,h,s){
  const points=[],rows=SOURCES.length,x0=w*.3,x1=w*.5,mx=w*.78,my=h/2,gap=s*2.2;
  SOURCES.forEach((_,r)=>{
    const y=h*.16+r*(h*.68/(rows-1)),color=PALETTE[r%PALETTE.length];
    for(let k=0;k<12;k++)points.push({x:x0+k*((x1-x0)/11),y,color,alpha:1});
    for(let k=1;k<=8;k++){const t=k/9,e=easeInOut(t);points.push({x:x1+(mx-w*.05-x1)*t,y:y+(my-y)*e,color,alpha:1});}
  });
  for(let k=0;k<72;k++){const col=k%3,row=Math.floor(k/3);points.push({x:mx+col*gap,y:my-11.5*gap+row*gap,color:PALETTE[(row+col)%PALETTE.length],alpha:1});}
  const labels=SOURCES.map((text,r)=>({text,x:x0-s*1.8,y:h*.16+r*(h*.68/(rows-1)),align:'right'}));
  // On narrow fields the bundle's label sits under it, never past the edge.
  labels.push(w<560?{text:'Personalized care',x:mx+gap,y:my+12.6*gap+s*1.6,align:'center'}:{text:'Personalized care',x:mx+gap*3.4,y:my,align:'left'});
  return{points:sortPoints(points),labels};
}

// Comprehensive care in one place: the homepage ring, every service on it.
export const SERVICES=['Care','Medical advice','Labs','Specialist referrals','Prescriptions','Health insights'];
function ringLayout(w,h,s){
  const points=[],cx=w/2,cy=h/2,r=Math.min(w,h)*(w<560?.27:.34),segments=SERVICES.length;
  [[120,r],[72,r*.8]].forEach(([count,radius])=>{
    for(let k=0;k<count;k++){const a=-Math.PI/2+k/count*Math.PI*2;points.push({x:cx+Math.cos(a)*radius-s/2,y:cy+Math.sin(a)*radius-s/2,color:PALETTE[Math.floor(k/count*segments)%PALETTE.length],alpha:1});}
  });
  const labels=SERVICES.map((text,i)=>{const a=-Math.PI/2+(i+.5)/segments*Math.PI*2,lr=r+s*4.4;return{text,x:cx+Math.cos(a)*lr,y:cy+Math.sin(a)*lr,align:Math.cos(a)>.2?'left':Math.cos(a)<-.2?'right':'center'};});
  return{points:sortPoints(points),labels};
}

// Go live in weeks, not years: a calendar where only the first weeks light up.
function calendarLayout(w,h,s){
  const points=[],cols=16,rows=12,gap=Math.min(w*.86/(cols-1),h*.7/(rows-1)),x0=w/2-gap*(cols-1)/2,y0=h/2-gap*(rows-1)/2,lit=5;
  for(let c=0;c<cols;c++)for(let r=0;r<rows;r++)points.push({x:x0+c*gap,y:y0+r*gap,color:c<lit?'lime':'ink',alpha:c<lit?1:.16});
  return{points:sortPoints(points),labels:[{text:'Live',x:x0+(lit-.5)*gap,y:y0-gap*1.6,align:'center'}]};
}

export const LAYOUTS={wave:waveLayout,sources:sourcesLayout,ring:ringLayout,calendar:calendarLayout};

/**
 * The outcomes field. render(from,to,t) blends two arrangements of the same
 * 192 squares with a left-to-right stagger; labels() returns the DOM labels
 * for the arrangement currently in front, with an opacity for the blend.
 */
export function createField(canvas){
  const view=setup(canvas);
  let cache={},dot=8;
  const build=()=>{
    view.size();dot=clamp(Math.min(view.w,view.h)*.016,5,10);
    cache=Object.fromEntries(Object.entries(LAYOUTS).map(([name,make])=>[name,make(view.w,view.h,dot)]));
  };
  build();
  const rgb=Object.fromEntries(Object.entries(STUDIO_COLORS).map(([name,value])=>[name,hex(value)]));
  const color=value=>typeof value==='string'?rgb[value]:value;
  let drawn=[];
  return{
    resize:build,
    layout:name=>cache[name],
    // V4 (2026-10-07): the squares as last drawn, so a new arrangement can
    // start from the middle of a move. Returns the name to render from.
    hold(){cache.held={points:drawn.map(p=>({...p})),labels:[]};return'held';},
    render(from,to=from,t=0){
      const {ctx}=view;ctx.clearRect(0,0,view.w,view.h);
      const a=cache[from]?.points,b=cache[to]?.points;if(!a||!b)return;
      for(let i=0;i<N;i++){
        const p=a[i],q=b[i],local=easeInOut(clamp(t*1.35-i/N*.35));
        const ca=color(p.color),cb=color(q.color),mix=ca.map((v,k)=>Math.round(v+(cb[k]-v)*local));
        const x=p.x+(q.x-p.x)*local,y=p.y+(q.y-p.y)*local,alpha=p.alpha+(q.alpha-p.alpha)*local;
        drawn[i]={x,y,color:mix,alpha};
        view.square(x,y,dot,`rgb(${mix.join(',')})`,alpha);
      }
      ctx.globalAlpha=1;
    },
  };
}
