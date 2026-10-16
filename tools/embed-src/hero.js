/* Counsel Studio, the hero background (V20), as one Webflow embed. It fills
   the hero section behind its content: a grid of small squares that builds
   on load, single squares lighting up at random, and four data cards taking
   turns at the left and right edges, clear of the hero's own text, buttons
   and the phone section. Desktop only for the cards (1100px and up).
   Uses the page's GSAP 3.15, or loads it once from jsDelivr. */
(function(){
const host=document.currentScript.parentElement;
const root=host.querySelector('.cs-studio-hero');
if(!root||root.dataset.mounted)return;root.dataset.mounted='1';
const hero=root.closest('section')||root.parentElement.parentElement;
const $$=(s,r=root)=>[...r.querySelectorAll(s)];
const canvas=root.querySelector('.cs-sparks'),cards=$$('.r17-card');
const P=14,S=5,COLOR='#AED9B0',GRID=.07,SPARK=.45;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const atTop=scrollY<40;
const fit=c=>{const r=Math.min(2,devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;c.width=Math.max(1,Math.round(w*r));c.height=Math.max(1,Math.round(h*r));const x=c.getContext('2d');x.setTransform(r,0,0,r,0,0);return{x,r,w,h};};
const sq=(v,px,py,a)=>{if(a<=.01)return;v.x.globalAlpha=Math.min(1,a);const s=Math.max(1,Math.round(S*v.r))/v.r;v.x.fillRect(Math.round(px*v.r)/v.r,Math.round(py*v.r)/v.r,s,s);};
const clamp01=k=>Math.min(1,Math.max(0,k));
const loaded=()=>new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true}));
const lib=()=>window.gsap||new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js';s.onload=res;s.onerror=rej;document.head.append(s);});
/* The grid builds on load: squares switch on one by one, roughly top-down
   but each at its own moment, then the CSS grid takes over. */
const INTRO=1.3;
if(atTop&&!reduce){
  const intro=document.createElement('canvas');intro.className='cs-intro';root.prepend(intro);
  const H=Math.min(hero.offsetHeight,Math.ceil(innerHeight*1.15));intro.style.height=H+'px';root.style.setProperty('--dots-top',H+'px');
  const v=fit(intro),cols=Math.ceil(v.w/P),rows=Math.ceil(v.h/P),B=96,buckets=Array.from({length:B},()=>[]);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)buckets[Math.min(B-1,Math.floor(((r/rows)*.6+Math.random()*.4)*B))].push(r*cols+c);
  v.x.fillStyle=COLOR;let drawn=0;const t0=performance.now();
  const step=now=>{const k=clamp01((now-t0)/1000/INTRO),p=k*k,upto=Math.min(B,Math.ceil(p*B));for(;drawn<upto;drawn++)for(const i of buckets[drawn])sq(v,(i%cols)*P,((i/cols)|0)*P,GRID);if(k<1)requestAnimationFrame(step);else{root.style.removeProperty('--dots-top');intro.remove();}};
  requestAnimationFrame(step);
}
/* Single squares light up and fade, about 1.6s each. */
let sparks=[],view=fit(canvas);
const seed=(()=>{let s=7;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();
const drawSparks=time=>{
  const v=view,cols=Math.ceil(v.w/P)+1,rows=Math.ceil(v.h/P)+1;v.x.clearRect(0,0,v.w,v.h);v.x.fillStyle=COLOR;
  if(sparks.length<Math.round(cols*rows*.004)&&seed()<.35)sparks.push({c:Math.floor(seed()*cols),r:Math.floor(seed()*rows),t:time});
  sparks=sparks.filter(s=>time-s.t<1.6&&time>=s.t);
  sparks.forEach(s=>sq(v,s.c*P,s.r*P,Math.sin(Math.PI*(time-s.t)/1.6)*SPARK));
  v.x.globalAlpha=1;
};
/* The data cards: one every 2.7s at a random clear spot near an edge, on
   the grid, away from the hero's text and the last card; at most two. Each
   frame is drawn from the clock, so a card is never left half shown. */
const STEP=2.7,OUT_AT=4.6,OUT=.5,LIFE=OUT_AT+OUT;
const parts=cards.map(card=>({counts:$$('[data-count]',card).map(el=>[el,Number(el.dataset.count)]),arc:card.querySelector('.r17-arc'),marker:card.querySelector('.r17-marker'),bars:$$('.r17-bars i',card),bar:card.querySelector('.r17-progress i')}));
const fill=(i,k)=>{const p=parts[i];p.counts.forEach(([el,to])=>{el.textContent=Math.round(to*k).toLocaleString('en-US');});if(p.arc)p.arc.style.strokeDashoffset=String(100-70*k);if(p.marker)p.marker.style.left=81*k+'%';p.bars.forEach((b,n)=>{b.style.transform='scaleY('+clamp01(k*1.4-n*.06)+')';});if(p.bar)p.bar.style.transform='scaleX('+(.78*k)+')';};
const hide=a=>{const c=cards[a.i];c.style.visibility='hidden';c.style.clipPath=c.style.transform='';};
let active=[],turn=0,last=null,next=atTop&&!reduce?INTRO+.6:.4;
const avoid=()=>[...hero.querySelectorAll('h1,h2,h3,h4,p,a,button,img,[data-cs-avoid]')].filter(el=>!root.contains(el)&&!el.closest('.cs-studio-phone')&&el.offsetWidth);
const pick=i=>{
  const box=root.getBoundingClientRect(),card=cards[i],w=card.offsetWidth,h=card.offsetHeight;
  const zones=avoid().map(el=>{const r=el.getBoundingClientRect();return{x:r.left-box.left-80,y:r.top-box.top-20,r:r.right-box.left+80,b:r.bottom-box.top+20};});
  active.forEach(o=>zones.push({x:o.x-40,y:o.y-40,r:o.x+o.w+40,b:o.y+o.h+40}));
  const top=Number(root.dataset.top||110),ph=hero.querySelector('.cs-studio-phone'),floor=(ph?ph.getBoundingClientRect().top-box.top:box.height)-24;
  const spots=[];
  for(let y=Math.ceil(top/P)*P;y+h<=floor;y+=P)for(let x=Math.ceil(40/P)*P;x+w<=box.width-40;x+=P){
    if(zones.some(z=>x<z.r&&x+w>z.x&&y<z.b&&y+h>z.y))continue;
    if(x>40+P*4&&x+w<box.width-40-P*4)continue;
    spots.push({x,y,w,h});
  }
  if(!spots.length)return null;
  const far=last?spots.filter(s=>Math.hypot(s.x-last.x,s.y-last.y)>320):spots,pool=far.length?far:spots;
  return pool[Math.floor(Math.random()*pool.length)];
};
const ease3=k=>1-Math.pow(1-k,3),ease2=k=>1-Math.pow(1-k,2);
const draw=(a,age)=>{const c=cards[a.i],inK=ease3(clamp01(age/.7)),outK=clamp01((age-OUT_AT)/OUT)**2;
  if(outK>0){c.style.transform='translate('+a.x+'px,'+(a.y-10*outK)+'px)';c.style.clipPath='inset(0% 0% '+outK*100+'% 0% round 12px)';}
  else{c.style.transform='translate('+a.x+'px,'+(a.y+16*(1-inK))+'px)';c.style.clipPath='inset('+(1-inK)*100+'% 0% 0% 0% round 12px)';}
  fill(a.i,ease2(clamp01((age-.15)/1.1)));};
const wide=()=>innerWidth>=1100;
const tickCards=t=>{
  if(!wide()){active.forEach(hide);active=[];return;}
  if(t>=next&&active.length<2){
    const free=cards.map((_,i)=>i).filter(i=>!active.some(o=>o.i===i));
    const i=free.find(n=>n>=turn%cards.length)??free[0],spot=i==null?null:pick(i);
    if(spot){active.push({i,...spot,start:t});last=spot;turn=i+1;cards[i].style.visibility='visible';fill(i,0);}
    next=t+STEP;
  }
  active=active.filter(o=>{const age=t-o.start;if(age>=LIFE){hide(o);return false;}draw(o,age);return true;});
};
addEventListener('resize',()=>{view=fit(canvas);});
if(reduce){
  const still=()=>{active.forEach(hide);active=[];if(!wide())return;[0,1].forEach(i=>{const s=pick(i);if(!s)return;active.push({i,...s});last=s;const c=cards[i];c.style.visibility='visible';c.style.transform='translate('+s.x+'px,'+s.y+'px)';fill(i,1);});};
  loaded().then(still);addEventListener('resize',still);return;
}
/* One clock for both, paused while the hero is off screen. */
loaded().then(lib).then(()=>{
  const state={t:atTop?-INTRO:0};let on=true;
  const loop=gsap.to(state,{t:'+=100000',duration:100000,ease:'none',repeat:-1,onUpdate:()=>{drawSparks(Math.max(0,state.t));tickCards(state.t);}});
  const io=new IntersectionObserver(([e])=>{on=e.isIntersecting;loop.paused(!on||document.hidden);});io.observe(hero);
  document.addEventListener('visibilitychange',()=>loop.paused(!on||document.hidden));
}).catch(()=>{});
})();
