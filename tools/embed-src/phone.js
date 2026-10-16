/* Counsel Studio, the phone section (V20), as one Webflow embed.
   The partner's app, Counsel rising over it as a sheet and building card by
   card as the phone scrolls up the screen, each card's label drawing after
   it; the brand switcher changes the app's look by itself until the cards
   start, then only on click, with a crossfade. Phones show numbered badges
   and a key under the phone instead of the labels. Uses the page's GSAP
   3.15 and ScrollTrigger, or loads them once from jsDelivr. */
(function(){
const host=document.currentScript.parentElement;
const root=host.querySelector('.cs-studio-phone');
if(!root||root.dataset.mounted)return;root.dataset.mounted='1';
const $=(s,r=root)=>r.querySelector(s),$$=(s,r=root)=>[...r.querySelectorAll(s)];
const phone=$('.r14-phone'),picker=$('.r14-picker'),pick=$('.r14-pick'),sheet=$('.r14-sheet'),scrim=$('.r14-scrim'),rig=$('.r14-rig');
const calls=$$('.r12-call'),buttons=$$('.r14-pick button');
const BRANDS=__BRANDS__;
/* The brand switcher. */
let crossfade=null;
const thumb=()=>{const t=$('.r14-thumb'),on=$('[aria-checked="true"]',pick);if(!t||!on)return;t.style.width=on.offsetWidth+'px';t.style.transform='translateX('+on.offsetLeft+'px)';};
function look(value,focus){
  const apply=()=>{for(const [k,v] of Object.entries(BRANDS[value]))phone.style.setProperty(k,v);phone.dataset.brand=value;};
  buttons.forEach(b=>{const on=b.dataset.value===value;b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1;if(on&&focus)b.focus();});
  thumb();
  if(crossfade&&phone.dataset.brand&&phone.dataset.brand!==value)crossfade(apply);else apply();
  phone.dispatchEvent(new CustomEvent('cs:look'));
}
buttons.forEach((b,i)=>{
  b.addEventListener('click',()=>look(b.dataset.value));
  b.addEventListener('keydown',e=>{const step={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(!step)return;e.preventDefault();look(buttons[(i+step+buttons.length)%buttons.length].dataset.value,true);});
});
thumb();document.fonts&&document.fonts.ready.then(thumb);addEventListener('resize',thumb);
requestAnimationFrame(()=>picker.classList.add('is-ready'));
/* GSAP: the page's, or one copy from the CDN. */
const loaded=()=>new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true}));
const lib=(key,file)=>window[key]||new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/'+file+'.min.js';s.onload=res;s.onerror=rej;document.head.append(s);});
loaded().then(()=>lib('gsap','gsap')).then(()=>lib('ScrollTrigger','ScrollTrigger')).then(()=>{gsap.registerPlugin(ScrollTrigger);motion();}).catch(()=>{});
function motion(){
  const mm=gsap.matchMedia();
  mm.add({desktop:'(min-width:901px)',reduce:'(prefers-reduced-motion:reduce)'},ctx=>{
    const {desktop,reduce}=ctx.conditions,undo=[];
    const partOf=id=>$('[data-card="'+id+'"]',phone),callFor=id=>calls.find(c=>c.dataset.call===id);
    /* Labels sit level with their card where it settles, not where it waits. */
    const shift=(el,axis)=>(Number(gsap.getProperty(el,axis+'Percent'))||0)*(axis==='x'?el.offsetWidth:el.offsetHeight)/100+(Number(gsap.getProperty(el,axis))||0);
    const place=()=>{
      if(!desktop)return;
      const s=rig.getBoundingClientRect(),p=phone.getBoundingClientRect();
      const room=Math.min(380,p.left-s.left),label=Math.max(150,Math.min(260,room-110));
      calls.forEach(call=>{
        const part=partOf(call.dataset.call);if(!part)return;
        const r=part.getBoundingClientRect(),dx=shift(part,'x'),dy=sheet.contains(part)?shift(sheet,'y'):0;
        call.style.top=(r.top-dy+r.height/2-s.top)+'px';call.style.setProperty('--label',label+'px');
        if(call.classList.contains('is-left')){const x0=p.left-s.left-room;call.style.left=x0+'px';call.style.width=(r.left-dx-s.left+3.5-x0)+'px';}
        else{const x0=r.right-dx-s.left-3.5;call.style.left=x0+'px';call.style.width=(p.right-s.left+room-x0)+'px';}
      });
    };
    place();
    const ro=new ResizeObserver(place);ro.observe(rig);
    const follow=()=>{place();gsap.to({},{duration:.45,onUpdate:place});};
    phone.addEventListener('cs:look',follow);
    undo.push(()=>{ro.disconnect();phone.removeEventListener('cs:look',follow);calls.forEach(c=>{c.style.top=c.style.left=c.style.width='';});});
    if(reduce){gsap.set(scrim,{opacity:1});return()=>undo.forEach(f=>f());}
    /* The build: each step plays when the phone's top reaches its line on
       the screen (percent from the top), and undoes when you scroll back. */
    const draw=(tl,id,at)=>{
      const call=callFor(id);if(!call||!desktop)return;
      const left=call.classList.contains('is-left');
      tl.fromTo($('.r12-dot',call),{scale:0},{scale:1,duration:.18,ease:'back.out(3)'},at)
        .fromTo($('.r12-wire',call),{scaleX:0},{scaleX:1,duration:.5,ease:'power3.out'},at+.08)
        .fromTo($('.r12-label',call),{clipPath:left?'inset(-32px 0% -8px 100%)':'inset(-32px 100% -8px 0%)'},{clipPath:'inset(-32px 0% -8px 0%)',duration:.5,ease:'power2.out'},at+.36);
    };
    const slide=(tl,id)=>{const card=partOf(id),side=card.dataset.from==='right'?1:-1;tl.fromTo(card,{xPercent:side*118},{xPercent:0,duration:.8,ease:'expo.out'},0);};
    const LINES=[68,58,48,40,32,24,16];
    const STEPS=[
      tl=>draw(tl,'brand',0),
      tl=>{tl.fromTo(sheet,{yPercent:101},{yPercent:0,duration:.9,ease:'expo.out'},0).fromTo(scrim,{opacity:0},{opacity:1,duration:.5,ease:'power1.out'},0);draw(tl,'app',.55);},
      tl=>{slide(tl,'data');draw(tl,'data',.42);},
      tl=>slide(tl,'ask'),
      tl=>{slide(tl,'ai');draw(tl,'ai',.42);},
      tl=>{slide(tl,'actions');draw(tl,'actions',.42);},
      tl=>draw(tl,'doctors',0),
    ];
    STEPS.forEach((step,k)=>{
      const tl=gsap.timeline({paused:true});step(tl);
      ScrollTrigger.create({trigger:phone,start:'top '+LINES[k]+'%',end:'max',onEnter:()=>tl.timeScale(1).play(),onLeaveBack:()=>tl.timeScale(1.6).reverse()});
    });
    if(!desktop)$$('.r14-key li').forEach(li=>gsap.fromTo(li,{y:18},{y:0,ease:'none',scrollTrigger:{trigger:li,start:'top bottom',end:'top 62%',scrub:true}}));
    /* A change of brand crossfades: a still copy of the old look over the
       phone while the new look goes on underneath. */
    let ghost=null;
    crossfade=apply=>{
      if(ghost){gsap.killTweensOf(ghost);ghost.remove();}
      const g=ghost=phone.cloneNode(true);g.removeAttribute('role');g.removeAttribute('aria-label');g.setAttribute('aria-hidden','true');g.inert=true;
      Object.assign(g.style,{position:'absolute',left:phone.offsetLeft+'px',top:phone.offsetTop+'px',width:phone.offsetWidth+'px',height:phone.offsetHeight+'px',margin:'0',zIndex:'2',pointerEvents:'none'});
      phone.parentElement.append(g);apply();
      gsap.to(g,{opacity:0,duration:.9,ease:'power1.inOut',onComplete:()=>{g.remove();if(ghost===g)ghost=null;}});
    };
    undo.push(()=>{crossfade=null;if(ghost)ghost.remove();});
    /* The switcher's timer: the highlight fills over STEP seconds, then the
       next brand; it drains as it moves on. It runs only until the cards
       start (and again above that), pauses while pointed at or focused. */
    const STEP=4.8,DRAIN=.4,th=$('.r14-thumb');
    let t=0,shown=0,draining=false,held=false,built=false,last=0;
    const paint=()=>{th.style.setProperty('--progress',String(shown));th.style.setProperty('--origin',draining?'right':'left');};
    ScrollTrigger.create({trigger:phone,start:'top 68%',end:'max',onToggle:s=>{built=s.isActive;if(built){if(shown>.02)draining=true;t=0;}}});
    const state={t:0};
    const tick=()=>{
      const dt=Math.max(0,state.t-last);last=state.t;
      if(draining){shown=Math.max(0,shown-dt/DRAIN);if(!shown)draining=false;paint();}
      if(held||built)return;
      t+=dt;
      if(!draining){shown=Math.min(1,Math.max(0,t/STEP));paint();}
      if(t>=STEP){const on=buttons.findIndex(b=>b.getAttribute('aria-checked')==='true');look(buttons[(on+1)%buttons.length].dataset.value);}
    };
    const restart=()=>{draining=shown>.02;t=draining?-DRAIN:0;if(!draining)shown=0;paint();};
    phone.addEventListener('cs:look',restart);
    const enter=()=>{held=true;},leave=()=>{held=false;},blur=e=>{if(!picker.contains(e.relatedTarget))held=false;};
    picker.addEventListener('pointerenter',enter);picker.addEventListener('pointerleave',leave);picker.addEventListener('focusin',enter);picker.addEventListener('focusout',blur);
    const loop=gsap.to(state,{t:'+=100000',duration:100000,ease:'none',repeat:-1,paused:true,onUpdate:tick});
    const seen=ScrollTrigger.create({trigger:phone,start:'top bottom',end:'bottom top',onToggle:s=>loop.paused(!s.isActive||document.hidden)});
    const vis=()=>loop.paused(!seen.isActive||document.hidden);document.addEventListener('visibilitychange',vis);vis();
    paint();
    undo.push(()=>{loop.kill();phone.removeEventListener('cs:look',restart);document.removeEventListener('visibilitychange',vis);picker.removeEventListener('pointerenter',enter);picker.removeEventListener('pointerleave',leave);picker.removeEventListener('focusin',enter);picker.removeEventListener('focusout',blur);th.style.removeProperty('--progress');});
    return()=>undo.forEach(f=>f());
  });
}
})();
