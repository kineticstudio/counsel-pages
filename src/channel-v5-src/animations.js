/**
 * Health Plans V5 motion entry point. No layout or content is authored here.
 * Dependencies are versioned local distributions, not runtime CDN requests.
 * Each section owns one named setup function. All listeners, observers, Lenis,
 * tweens and ScrollTriggers are disposed on media changes and unmount.
 */
import Lenis from '../vendor/lenis-1.3.26/lenis.mjs';
import {careWeave} from '../channel-v2-src/care-accordion.js';
import {createWeavePattern} from '../ui-src/counsel-weave-pattern.js';
import {createWaveform,createField,STUDIO_COLORS} from '../studio-v1-src/weave-field.js';
import {createPopulation,createStory,createFlow,createRepaint} from '../studio-src/squares.js';

const {gsap,ScrollTrigger,CustomEase}=window;
const NS='http://www.w3.org/2000/svg';
const finished=new WeakSet(),finalNumbers=new WeakMap();
let unmount;
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const svgNode=(tag,attributes={})=>{
  const el=document.createElementNS(NS,tag);
  Object.entries(attributes).forEach(([key,value])=>el.setAttribute(key,value));
  return el;
};

export function mountAnimations(){
  unmount?.();
  if(!gsap||!ScrollTrigger||!CustomEase)return()=>{};
  gsap.registerPlugin(ScrollTrigger,CustomEase);
  CustomEase.create('counsel-settle','.2,.65,.2,1');
  CustomEase.create('counsel-ui','.2,.8,.2,1');
  CustomEase.create('counsel-chat','.2,.7,.2,1');
  CustomEase.create('counsel-sweep','.22,.61,.2,1');
  CustomEase.create('counsel-draw','.6,0,0,1');
  CustomEase.create('counsel-ease','.25,.1,.25,1');
  CustomEase.create('counsel-field','.3,.9,.3,1');
  CustomEase.create('counsel-placeholder','.65,0,.35,1');
  const media=gsap.matchMedia();
  media.add({desktop:'(min-width:901px)',mobile:'(max-width:900px)',reduce:'(prefers-reduced-motion:reduce)'},context=>{
    const cleanups=[],gates=[];
    const env={context,reduce:context.conditions.reduce,desktop:context.conditions.desktop,
      stage:$('#stage'),cleanups,gates,
      on(target,event,callback,options){
        const listener=e=>context.add(()=>callback(e));
        target?.addEventListener(event,listener,options);
        cleanups.push(()=>target?.removeEventListener(event,listener,options));
      },
      resize(target,callback){
        if(!target)return;
        const observer=new ResizeObserver(callback);observer.observe(target);
        cleanups.push(()=>observer.disconnect());
      },
    };
    animatePageScroll(env);
    animateNavigation(env);
    animateHero(env);
    animateModernEra(env);
    animateCareExperience(env);
    animateValueBento(env);
    animateImpactStats(env);
    animateClosing(env);
    animateFooter(env);
    animateButtons(env);
    env.on(document,'visibilitychange',()=>gates.forEach(gate=>gate()));
    const refresh=()=>{env.lenis?.resize();ScrollTrigger.refresh();};
    const scheduleRefresh=gsap.delayedCall(.12,refresh).pause();
    env.refresh=()=>scheduleRefresh.restart(true);
    env.resize($('.page'),env.refresh);
    env.resize(env.stage,env.refresh);
    let alive=true;
    document.fonts.ready.then(()=>{if(alive)env.refresh();});
    $$('img').filter(img=>!img.complete).forEach(img=>env.on(img,'load',env.refresh,{once:true}));
    refresh();
    return()=>{alive=false;cleanups.reverse().forEach(cleanup=>cleanup());};
  });
  const destroy=()=>media.revert();
  const pagehide=event=>{if(!event.persisted)destroy();};
  const pageshow=event=>{if(event.persisted)ScrollTrigger.refresh();};
  window.addEventListener('pagehide',pagehide);window.addEventListener('pageshow',pageshow);
  unmount=()=>{destroy();window.removeEventListener('pagehide',pagehide);window.removeEventListener('pageshow',pageshow);};
  return unmount;
}

/** Same intersection threshold as the old observer, pausing outside view. */
function inView(env,animation,target,ratio=0,enabled=()=>true){
  let trigger;
  const sync=()=>{if(trigger)animation.paused(!trigger.isActive||document.hidden||!enabled());};
  trigger=ScrollTrigger.create({scroller:env.stage,trigger:target,
    start:()=>`top+=${target.offsetHeight*ratio} bottom`,
    end:()=>`bottom-=${target.offsetHeight*ratio} top`,onToggle:sync,onRefresh:()=>queueMicrotask(sync)});
  env.gates.push(sync);sync();return sync;
}

function reveal(env,element){
  if(env.reduce||finished.has(element))return;
  const tl=gsap.timeline({paused:true,onComplete:()=>finished.add(element)});
  tl.fromTo(element,{opacity:.3,y:14},{opacity:1,duration:.7,ease:'counsel-ease'},0)
    .to(element,{y:0,duration:.9,ease:'counsel-settle'},0);
  inView(env,tl,element,.08);
}

/** Lenis uses native scrollTop in the existing nested scroller, no fake height. */
function animatePageScroll(env){
  if(env.reduce)return;
  const lenis=new Lenis({wrapper:env.stage,content:$('.page'),autoRaf:false,
    lerp:.1,smoothWheel:true,syncTouch:false,anchors:false,
    prevent:node=>node.matches?.('textarea,.cf-conversation,.cn-mobile,[data-lenis-prevent]')});
  env.lenis=lenis;
  const tick=time=>lenis.raf(time*1000);
  lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
  env.on(document,'click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank')return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash||url.hash==='#')return;
    let id;try{id=decodeURIComponent(url.hash.slice(1));}catch{return;}
    const target=document.getElementById(id);if(!target||!env.stage.contains(target))return;
    event.preventDefault();
    lenis.scrollTo(target,{offset:0,onComplete:()=>{
      history.pushState(null,'',url.hash);
      if(!target.hasAttribute('tabindex')){target.setAttribute('tabindex','-1');target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});}
      target.focus({preventScroll:true});
    }});
  });
  env.cleanups.push(()=>{gsap.ticker.remove(tick);lenis.off('scroll',ScrollTrigger.update);lenis.destroy();});
}

/** Navigation behavior stays in CounselNav; its visual transitions live here. */
function animateNavigation(env){
  const api=window.CounselNav;if(!api)return;
  const {nav,sheet,bodies,links,ghost}=api.state;
  const home={parent:nav.parentNode,next:nav.nextSibling};
  const height={value:sheet.offsetHeight};
  const duration=value=>env.reduce?0:value;
  gsap.set(ghost,{opacity:0});
  const setHeight=(value,opening)=>{
    sheet.style.height=height.value+'px';
    const timing=parseFloat(getComputedStyle(nav).getPropertyValue(opening?'--cn-drop':'--cn-lift'))/1000;
    gsap.to(height,{value,duration:duration(timing),ease:'counsel-ui',overwrite:true,onUpdate:()=>sheet.style.height=height.value+'px'});
  };
  const navigationMotion={
    ghost(link){
      gsap.to(ghost,{...(link?{x:link.offsetLeft,width:link.offsetWidth}:{}),opacity:link?1:0,duration:duration(.38),ease:'counsel-ui',overwrite:true});
    },
    open(index,previous,dir){
      setHeight(bodies[index].offsetHeight,true);
      gsap.to(sheet,{backgroundColor:getComputedStyle(sheet).getPropertyValue('--cn-color').trim(),duration:duration(.38),overwrite:'auto'});
      bodies.forEach((body,i)=>{
        gsap.killTweensOf([body,...$$('.cn-col li a,.cn-card',body)]);
        if(i===index){
          gsap.fromTo(body,{opacity:0,x:56*dir,y:dir?0:-14},{opacity:1,x:0,y:0,duration:duration(.36),delay:duration(.04),ease:'counsel-ui'});
          gsap.fromTo($$('.cn-col li a,.cn-card',body),{opacity:0,x:32*dir,y:dir?0:10},{opacity:1,x:0,y:0,duration:duration(.42),delay:duration(.06),stagger:duration(.032),ease:'counsel-ui'});
        }else if(i===previous){
          gsap.to(body,{opacity:0,x:-56*dir,y:0,duration:duration(.42),ease:'counsel-ui',onComplete:()=>body.classList.remove('cn-out')});
        }else gsap.set(body,{opacity:0});
      });
      links.forEach((link,i)=>gsap.to($('svg',link),{rotation:i===index?180:0,duration:duration(.3),ease:'counsel-ui',overwrite:true}));
    },
    close(){
      setHeight(0,false);
      gsap.to(bodies,{opacity:0,y:-14,duration:duration(.22),overwrite:true});
      links.forEach(link=>gsap.to($('svg',link),{rotation:0,duration:duration(.3),overwrite:true}));
    },
  };
  // The shared navigation calls these later, outside this setup callback.
  // Record those interaction-created tweens in the same revertable context.
  window.CounselNavMotion=Object.fromEntries(Object.entries(navigationMotion)
    .map(([name,callback])=>[name,(...args)=>env.context.add(()=>callback(...args))]));
  let fixed=false,last=env.stage.scrollTop;
  const restore=()=>{
    if(!fixed)return;fixed=false;nav.classList.remove('cn-fixed','cn-shown');api.close();
    home.parent.insertBefore(nav,home.next);gsap.set(nav,{clearProps:'transform'});
  };
  ScrollTrigger.create({scroller:env.stage,trigger:$('.page'),start:0,end:'max',onUpdate:self=>env.context.add(()=>{
    const now=self.scroll();
    if(now<=nav.offsetHeight+40){restore();last=now;return;}
    if(!fixed){fixed=true;document.body.append(nav);nav.classList.add('cn-fixed');gsap.set(nav,{yPercent:-100});}
    if(Math.abs(now-last)>2){
      const show=now<last;nav.classList.toggle('cn-shown',show);
      gsap.to(nav,{yPercent:show?0:-100,duration:duration(.38),ease:'counsel-ui',overwrite:true});
      if(!show)api.close();
    }
    last=now;
  })});
  const mobile=$('.cn-mobile');
  const syncMobile=()=>{
    const open=nav.classList.contains('cn-mopen');
    if(env.lenis){if(open)env.lenis.stop();else env.lenis.start();}
    if(!open)mobile.dataset.motionClosing='true';
    gsap.to(mobile,{yPercent:open?0:-100,duration:duration(.52),ease:'counsel-ui',overwrite:true,onComplete:()=>delete mobile.dataset.motionClosing});
    $$('.cn-burger i',nav).forEach((bar,i)=>gsap.to(bar,{y:open?0:(i-1)*5,rotation:open?(i===0?45:i===2?-45:0):0,opacity:open&&i===1?0:1,duration:duration(.32),ease:'counsel-ui',overwrite:true}));
  };
  gsap.set(mobile,{yPercent:nav.classList.contains('cn-mopen')?0:-100,y:0});
  $$('details',mobile).forEach(details=>env.on(details,'toggle',()=>gsap.to($('summary svg',details),{rotation:details.open?180:0,duration:duration(.3),ease:'counsel-ui',overwrite:true})));
  let wasOpen=nav.classList.contains('cn-mopen');
  const observer=new MutationObserver(()=>{
    const open=nav.classList.contains('cn-mopen');if(wasOpen===open)return;wasOpen=open;env.context.add(syncMobile);
  });observer.observe(nav,{attributes:true,attributeFilter:['class']});
  env.cleanups.push(()=>{
    observer.disconnect();delete window.CounselNavMotion;delete mobile.dataset.motionClosing;
    if(fixed){api.close();nav.classList.remove('cn-fixed','cn-shown');home.parent.insertBefore(nav,home.next);}
  });
  // The same hover offsets, timings and muted neighboring links.
  $$('.cn-col li a').forEach(link=>{
    const body=link.closest('.cn-body'),others=$$('li a,.cn-card',body).filter(el=>el!==link);
    gsap.set($('span',link),{x:0});
    gsap.set($('svg',link),{x:-8,opacity:0});
    const hover=on=>{
      gsap.to($('span',link),{x:on?4:0,duration:duration(.32),ease:'counsel-ui',overwrite:true});
      gsap.to($('svg',link),{x:on?0:-8,opacity:on?1:0,duration:duration(.3),ease:'counsel-ui',overwrite:true});
      others.forEach(el=>gsap.to(el,{opacity:on?(el.classList.contains('cn-card')?.6:.45):1,duration:duration(.26),overwrite:true}));
    };
    env.on(link,'pointerenter',()=>hover(true));env.on(link,'pointerleave',()=>hover(false));
    env.on(link,'focus',()=>hover(true));env.on(link,'blur',()=>hover(false));
  });
  $$('.cn-card').forEach(card=>{
    gsap.set($('img',card),{scale:1});
    gsap.set($('.cn-card-text',card),{y:0});
    gsap.set($('.cn-card-text svg',card),{x:-8,opacity:0});
    gsap.set(card,{'--scrim-opacity':0});
    const hover=on=>{
      gsap.to($('img',card),{scale:on?1.05:1,duration:duration(.9),ease:'counsel-ui',overwrite:true});
      gsap.to($('.cn-card-text',card),{y:on?-4:0,duration:duration(.42),ease:'counsel-ui',overwrite:true});
      gsap.to($('.cn-card-text svg',card),{x:on?0:-8,opacity:on?1:0,duration:duration(.3),overwrite:true});
      gsap.to(card,{'--scrim-opacity':on?1:0,duration:duration(.4),overwrite:true});
      gsap.to($$('li a',card.closest('.cn-body')),{opacity:on?.45:1,duration:duration(.26),overwrite:true});
    };
    env.on(card,'pointerenter',()=>hover(true));env.on(card,'pointerleave',()=>hover(false));
  });
}

/** A fixed SVG curve with flowing color bands and persistent square knots. */
function weave(env,svg,target,{draw=false,varied=false,focus=null,palette=null}={}){
  const path=$('defs path',svg),uses=$$(':scope>use',svg);
  const group=svgNode('g',{'data-motion-weave':''});uses.forEach(el=>group.append(el));svg.append(group);
  const state={elapsed:0};
  // Rebuild as adjacent V13 runs and stitches, not squares floating over bands.
  uses.forEach(el=>el.remove());
  const paintPattern=createWeavePattern(svg,path,group,{varied,focus,palette});
  const paint=()=>paintPattern(state.elapsed,!env.reduce);
  let mask;
  if(draw&&!env.reduce){
    mask=svgNode('mask',{id:path.id+'-draw',maskUnits:'userSpaceOnUse',x:'-100',y:'-100',width:'1800',height:'1200'});
    const trace=svgNode('use',{href:'#'+path.id,fill:'none',stroke:'white','stroke-width':'24','vector-effect':'non-scaling-stroke','stroke-dasharray':'1000 1000','stroke-dashoffset':'1000'});
    mask.append(trace);$('defs',svg).append(mask);group.setAttribute('mask',`url(#${mask.id})`);
    const entrance=gsap.to(trace,{attr:{'stroke-dashoffset':0},duration:1.6,ease:'counsel-draw',paused:true});
    inView(env,entrance,target,.12);
  }
  if(!env.reduce){
    const motion=gsap.to(state,{elapsed:100000000,duration:100000,ease:'none',repeat:-1,paused:true,onUpdate:paint});
    inView(env,motion,target);
  }
  env.resize(svg,paint);paint();
  env.cleanups.push(()=>{uses.forEach(el=>svg.append(el));group.remove();mask?.remove();});
  return paint;
}

function animateHero(env){
  const hero=$('.channel-hero'),photo=$('.hero-photo',hero),svg=$('.hero-thread',hero),path=$('defs path',svg);
  let paint=()=>{};
  const measure=()=>{
    const box=hero.getBoundingClientRect(),frame=photo.getBoundingClientRect();
    const x=frame.left-box.left,y=frame.top-box.top,w=frame.width,h=frame.height,width=box.width;
    svg.setAttribute('viewBox',`0 0 ${width} ${box.height}`);
    path.setAttribute('d',`M ${x-40} ${y+h*.14} C ${x+w*.12} ${y+h*.39} ${x+w*.43} ${y+h*.25} ${x+w*.64} ${y+h*.19} S ${width-w*.08} ${y+h*.124} ${width+60} ${y+h*.255}`);
    svg.style.clipPath=`inset(${y}px 0 ${Math.max(0,box.bottom-frame.bottom)}px ${x}px)`;
    hero.dataset.weaveReady='true';paint();
  };
  measure();paint=weave(env,svg,photo);
  [hero,photo,$('.hero-copy',hero)].forEach(el=>env.resize(el,measure));
  env.on($('.hero-photo-base'),'load',measure);
}

function animateModernEra(env){
  $$('.v2-feature').forEach(card=>reveal(env,card));
  if(env.reduce)return;
  const fan=$('.v2-doctors');
  const fanMotion=gsap.timeline({paused:true});
  fanMotion.fromTo(fan.firstElementChild,{x:35,y:0,rotation:0},{x:0,y:4,rotation:-6,duration:1,ease:'counsel-settle'},0)
    .fromTo(fan.lastElementChild,{x:-35,y:0,rotation:0},{x:0,y:4,rotation:6,duration:1,ease:'counsel-settle'},0);
  inView(env,fanMotion,fan.closest('.v2-feature'),.08);
  const history=$('.v2-health-history'),tl=gsap.timeline({paused:true});
  $$('.vh-card',history).forEach((card,i)=>tl.fromTo(card,{opacity:0,y:24*history.offsetWidth/600},{opacity:1,y:0,duration:.9,ease:'counsel-chat'},i*.18));
  tl.fromTo($('.vh-trend-area',history),{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:1.5,ease:'none'},.35)
    .fromTo($('.vh-trend-line',history),{strokeDashoffset:1},{strokeDashoffset:0,duration:1.5,ease:'none'},.35)
    .fromTo($$('.vh-trend-dot',history),{opacity:0},{opacity:1,duration:.3,stagger:.375,ease:'counsel-ease'},.35);
  const marker=$('.vh-range-dot',history);
  tl.fromTo(marker,{left:0,opacity:0,scale:.7},{left:marker.style.getPropertyValue('--vh-marker'),opacity:1,scale:1,duration:1.25,ease:'counsel-chat'},.55)
    .fromTo($$('.vh-bar',history),{scaleY:0},{scaleY:1,duration:.85,stagger:.08,ease:'counsel-chat'},.7);
  inView(env,tl,history,.12);
  $$('.vh-color-block',history).forEach(el=>{
    const offset=parseFloat(el.style.getPropertyValue('--vh-offset'));
    const motion=gsap.fromTo(el,{strokeDashoffset:offset},{strokeDashoffset:offset-1000,duration:30,repeat:-1,ease:'none',paused:true});
    inView(env,motion,history,.12);
  });
}

function animateCareExperience(env){
  const tabs=$('.ci-tabs'),rows=$$('.ci-item',tabs),panels=$$('.ci-panel');
  const duration=value=>env.reduce?0:value;
  // Screen contents are static. Only complete compositions transition.
  const select=({detail:{index,previousIndex}})=>{
    rows.forEach((row,i)=>{
      const active=i===index,answer=$('.ci-answer',row),copy=$('.ci-tab-copy',row);
      // Animate measured height: same 560ms accordion without the CSS grid transition.
      gsap.to(answer,{height:active?$('div',answer).scrollHeight:0,duration:duration(.56),ease:'counsel-ui',overwrite:true,onComplete:()=>{if(active)answer.style.height='auto';env.refresh?.();}});
      gsap.to(copy,{opacity:active?1:0,y:active?0:-8,duration:duration(active?.56:.42),delay:duration(active?.08:0),ease:'counsel-ui',overwrite:true});
      gsap.to($('.ci-chevron',row),{rotation:active?180:0,duration:duration(.32),ease:'counsel-ui',overwrite:true});
      gsap.to($('.ci-tab-label',row),{x:active?8:0,duration:duration(.24),ease:'counsel-ease',overwrite:true});
      gsap.to($$(':scope>.ci-tab,:scope>.ci-rule,:scope>.ci-answer',row),{opacity:index===null||active||row.classList.contains('is-thread')?1:.42,duration:duration(.24),overwrite:'auto'});
      gsap.to($('.ci-rule',row),{'--rule-opacity':!active&&row.classList.contains('is-thread')?0:1,duration:duration(.3),overwrite:'auto'});
    });
    gsap.killTweensOf(panels);
    if(index!==null){
      if(previousIndex!==null&&previousIndex!==index){
        const outgoing=panels[previousIndex];
        gsap.to(outgoing,{opacity:0,y:-8,duration:duration(.28),ease:'counsel-ease',onComplete:()=>{outgoing.hidden=true;}});
      }
      gsap.fromTo(panels[index],{opacity:env.reduce?1:0,y:env.reduce?0:12},{opacity:1,y:0,duration:duration(.45),ease:'counsel-settle'});
    }
    env.gates.forEach(sync=>sync());
    env.refresh?.();
  };
  rows.forEach((row,i)=>{
    const answer=$('.ci-answer',row),copy=$('.ci-tab-copy',row),line=$('.ci-weave',row);
    gsap.set(answer,{gridTemplateRows:'1fr',height:row.classList.contains('is-open')?'auto':0,overflow:'hidden'});
    gsap.set(copy,{opacity:row.classList.contains('is-open')?1:0,y:row.classList.contains('is-open')?0:-8});
    gsap.set($('.ci-tab-label',row),{x:row.classList.contains('is-open')?8:0});
    gsap.set($$(':scope>.ci-tab,:scope>.ci-rule,:scope>.ci-answer',row),{opacity:row.classList.contains('is-open')?1:.42});
    let clock,offset=0,active=false;
    const speed={burst:0};
    // One contiguous weave: long color runs and a square stitch embedded at
    // its leading edge. The filled length and stitch share one progress value.
    const progressHost=document.createElement('span');progressHost.className='ci-progress';
    const progressSvg=svgNode('svg',{height:3,'aria-hidden':'true'});
    const runs=['--green-3','--yellow','--blue-9'].map(token=>svgNode('rect',{y:0,height:3,fill:`var(${token})`}));
    progressSvg.append(...runs);progressHost.append(progressSvg);$('.ci-rule',row).append(progressHost);
    const progress={value:env.reduce?1:0};
    const drawProgress=()=>{
      const width=row.clientWidth,length=6+(width-6)*progress.value,join=Math.max(0,length-3)*.72;
      const parts=[[0,join],[join,Math.max(0,length-3-join)],[length-3,3]];
      parts.forEach(([x,w],j)=>{runs[j].setAttribute('x',x);runs[j].setAttribute('width',w);});
    };
    const build=()=>{line.innerHTML=careWeave(Math.max(120,row.clientWidth),101+i*13);progressSvg.setAttribute('viewBox',`0 0 ${row.clientWidth} 3`);drawProgress();};build();env.resize(row,build);
    let progressMotion,syncProgress;
    if(!env.reduce){
      progressMotion=gsap.to(progress,{value:1,duration:8,repeat:-1,repeatDelay:.8,ease:'none',paused:true,onUpdate:drawProgress});
      syncProgress=inView(env,progressMotion,row,0,()=>row.classList.contains('is-open'));
    }
    env.on(document,'counsel:care-select',({detail:{index}})=>{
      if(index===i)progressMotion?.restart();
      syncProgress?.();
    });
    if(!env.reduce){
      const time={value:0};let previous=0;
      clock=gsap.to(time,{value:100000,duration:100000,repeat:-1,ease:'none',paused:true,onUpdate:()=>{
        const dt=Math.max(0,time.value-previous);previous=time.value;
        offset=(offset+(row.clientWidth/40+speed.burst*row.clientWidth/1.4)*dt)%row.clientWidth;
        $('g',line)?.setAttribute('transform',`translate(${offset} 0)`);
      }});inView(env,clock,row,0,()=>active&&!row.classList.contains('is-open'));
    }
    const hover=on=>{
      active=on;row.classList.toggle('is-thread',on);
      if(clock){speed.burst=on?1:0;gsap.to(speed,{burst:0,duration:2.4,ease:t=>1-Math.exp(-5*t),overwrite:true});env.gates.forEach(sync=>sync());}
      gsap.to($('.ci-tab-label',row),{x:on||row.classList.contains('is-open')?8:0,duration:duration(.24),ease:'counsel-ease',overwrite:true});
      gsap.to($('.ci-rule',row),{'--rule-opacity':on&&!row.classList.contains('is-open')?0:1,duration:duration(.3),overwrite:'auto'});
      gsap.to(line,{opacity:on?1:0,clipPath:on?'inset(0 0% 0 0)':'inset(0 100% 0 0)',duration:duration(.9),ease:'counsel-draw',overwrite:true});
      const hasEmphasis=rows.some(other=>other.classList.contains('is-open')||other.classList.contains('is-thread'));
      rows.forEach(other=>gsap.to($$(':scope>.ci-tab,:scope>.ci-rule,:scope>.ci-answer',other),{opacity:!hasEmphasis||other.classList.contains('is-open')||other.classList.contains('is-thread')?1:.42,duration:duration(.24),overwrite:'auto'}));
    };
    env.on(row,'pointerenter',()=>hover(true));env.on(row,'pointerleave',()=>hover(row.contains(document.activeElement)));
    env.on(row,'focusin',()=>hover(true));env.on(row,'focusout',e=>{if(!row.contains(e.relatedTarget))hover(false);});
    env.cleanups.push(()=>{row.classList.remove('is-thread');line.replaceChildren();progressHost.remove();});
  });
  env.on(document,'counsel:care-select',select);
  const thinking=$('.ci-thinking');
  if(thinking&&!env.reduce){
    const pulse=gsap.fromTo($$('i',thinking),{opacity:.25,scale:.75},{opacity:1,scale:1,duration:.48,stagger:{each:.07,grid:[3,3],from:'start',repeat:-1,yoyo:true},ease:'sine.inOut',paused:true});
    inView(env,pulse,$('.ci-experience'),0,()=>rows[1].classList.contains('is-open'));
  }
}

function animateValueBento(env){
  $$('.v2-value-card').forEach(card=>reveal(env,card));
  if(env.reduce)return;
  const marquee=$('.v5-care-marquee');if(!marquee)return;let hovered=false,focused=false;
  const syncs=$$('.v2-chip-track',marquee).map((track,i)=>{
    const motion=gsap.fromTo(track,{xPercent:i?-50:0},{xPercent:i?0:-50,duration:i?36:42,repeat:-1,ease:'none',paused:true});
    return inView(env,motion,marquee,.12,()=>!hovered&&!focused);
  });
  const sync=()=>syncs.forEach(callback=>callback());
  env.on(marquee,'pointerenter',()=>{hovered=true;sync();});env.on(marquee,'pointerleave',()=>{hovered=false;sync();});
  env.on(marquee,'focusin',()=>{focused=true;sync();});env.on(marquee,'focusout',e=>{focused=marquee.contains(e.relatedTarget);sync();});
}

function animateImpactStats(env){
  const section=$('.v2-impact'),intro=$('.v2-impact-intro'),results=$('.v2-impact-results');
  // Replace the former top:110px sticky, with no added scroll distance.
  if(env.desktop&&!env.reduce)ScrollTrigger.create({scroller:env.stage,trigger:intro,pin:intro,
    start:'top 110px',end:()=>'+='+Math.max(1,results.offsetHeight-intro.offsetHeight),
    pinSpacing:false,invalidateOnRefresh:true});
  $$('.v2-metric',section).forEach(card=>{
    reveal(env,card);
    const el=$('[data-stat-number]',card);
    if(!finalNumbers.has(el))finalNumbers.set(el,el.textContent.trim());
    const final=finalNumbers.get(el),match=final.match(/^([^\d]*)([\d,]+)(.*)$/);
    if(!match||env.reduce||finished.has(el)){el.textContent=final;return;}
    const state={value:0},target=Number(match[2].replaceAll(',',''));
    el.textContent=match[1]+'0'+match[3];
    const motion=gsap.to(state,{value:target,duration:1.4,ease:'power2.out',paused:true,
      onUpdate:()=>el.textContent=match[1]+Math.round(state.value).toLocaleString('en-US')+match[3],
      onComplete:()=>{el.textContent=final;finished.add(el);}});
    inView(env,motion,card,.25);env.cleanups.push(()=>el.textContent=final);
  });
}

function animateClosing(env){
  weave(env,$('.v2-closing-thread'),$('.v2-closing-card'),{draw:true});
}

function animateFooter(env){
  const ask=$('.ch-foot-ask'),field=$('.ch-foot-field',ask),svg=$('.ch-foot-ring',ask),ta=$('textarea',field);
  const colors=['#C5E1ED','#FF93AD','#FADA78','#80C48A','#47AFFF'];
  let paths=[],length=1,segment=1,offset=0,previous=0;
  const state={time:0,burst:0};
  gsap.set($('.ch-foot-box',ask),{y:0});
  const paint=()=>paths.forEach((path,i)=>path.setAttribute('stroke-dashoffset',-i*segment-offset));
  const build=()=>{
    const w=field.offsetWidth,h=field.offsetHeight,pad=Math.min(18,w*.04),sw=parseFloat(getComputedStyle(svg).getPropertyValue('--counsel-weave-width'))||8;
    if(!w||!h)return;
    const cr=parseFloat(getComputedStyle(field).borderTopLeftRadius)||16,W=w+2*pad,H=h+2*pad,r=Math.min(cr+pad,H/2);
    svg.style.setProperty('--thread',sw+'px');svg.setAttribute('viewBox',`${-sw/2} ${-sw/2} ${W+sw} ${H+sw}`);
    Object.assign(svg.style,{width:W+sw+'px',height:H+sw+'px',left:field.offsetLeft-pad-sw/2+'px',top:field.offsetTop-pad-sw/2+'px'});
    const d=`M ${r} 0 H ${W-r} A ${r} ${r} 0 0 1 ${W} ${r} V ${H-r} A ${r} ${r} 0 0 1 ${W-r} ${H} H ${r} A ${r} ${r} 0 0 1 0 ${H-r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
    paths=colors.map(color=>svgNode('path',{d,stroke:color}));svg.replaceChildren(...paths);
    length=paths[0].getTotalLength();segment=length/colors.length;
    paths.forEach(path=>path.setAttribute('stroke-dasharray',`${segment} ${length-segment}`));paint();
  };
  build();env.resize(field,build);env.cleanups.push(()=>svg.replaceChildren());
  if(!env.reduce){
    const ring=gsap.to(state,{time:100000,duration:100000,repeat:-1,ease:'none',paused:true,onUpdate:()=>{
      const dt=Math.max(0,state.time-previous);previous=state.time;
      offset=(offset+(length/36+state.burst*length/1.7)*dt)%length;paint();
    }});inView(env,ring,ask);
    const ph=$('.ph-line',field);
    const intro=gsap.timeline({paused:true})
      .fromTo(ph,{top:'100%',yPercent:0},{top:'50%',yPercent:-50,duration:.6,ease:'counsel-placeholder'},0)
      .fromTo(ph,{opacity:0},{opacity:1,duration:.18,ease:'counsel-placeholder'},0);
    inView(env,intro,ask);
  }
  env.on(ta,'focus',()=>{
    gsap.to($('.ch-foot-box',ask),{y:env.reduce?0:12,duration:env.reduce?0:.65,ease:'counsel-field',overwrite:true});
    if(env.reduce)return;state.burst=1;gsap.to(state,{burst:0,duration:2.6,ease:t=>1-Math.exp(-5*t),overwrite:'auto'});
  });
  env.on(ta,'blur',()=>gsap.to($('.ch-foot-box',ask),{y:0,duration:env.reduce?0:.65,ease:'counsel-field',overwrite:true}));
  env.on(ta,'input',()=>gsap.to($('.ph',field),{opacity:ta.value?0:1,duration:env.reduce?0:.16,overwrite:true}));
  $$('.ch-foot-col a').forEach(link=>{
    gsap.set($('span',link),{x:0});
    gsap.set($('svg',link),{x:-8,opacity:0});
    gsap.set(link,{opacity:.85});
    const hover=on=>{
      gsap.to(link,{opacity:on?1:.85,duration:env.reduce?0:.22,overwrite:true});
      gsap.to($('span',link),{x:on?4:0,duration:env.reduce?0:.32,ease:'counsel-ui',overwrite:true});
      gsap.to($('svg',link),{x:on?0:-8,opacity:on?1:0,duration:env.reduce?0:.3,ease:'counsel-ui',overwrite:true});
    };
    env.on(link,'pointerenter',()=>hover(true));env.on(link,'pointerleave',()=>hover(false));
    env.on(link,'focus',()=>hover(true));env.on(link,'blur',()=>hover(false));
  });
}

function animateButtons(env){
  const C=window.CounselColors;
  animateRibbonButtons(env,'.channel-btn,.counsel-footer .ch-btn,nav .demo-btn,.cn-mdemo');
  const backgroundHover=(selector,color,duration)=>$$(selector).forEach(element=>{
    const base=getComputedStyle(element).backgroundColor;
    gsap.set(element,{backgroundColor:base});
    const hover=on=>gsap.to(element,{backgroundColor:on?color:base,duration:env.reduce?0:duration,ease:'counsel-ease',overwrite:true});
    env.on(element,'pointerenter',()=>hover(true));env.on(element,'pointerleave',()=>hover(false));
  });
  backgroundHover('.ch-foot-bottom .social a','rgba(248,248,246,.12)',.2);
  backgroundHover('.v2-hero-care-form button',C.blue8,.2);
  backgroundHover('nav .actions>a:not(.demo-btn)','rgba(197,225,237,.6)',.22);
  const form=$('.v2-hero-care-form');
  env.on(form,'focusin',()=>gsap.to(form,{outlineColor:C.blue7,duration:env.reduce?0:.2,overwrite:true}));
  env.on(form,'focusout',event=>{if(!form.contains(event.relatedTarget))gsap.to(form,{outlineColor:'transparent',duration:env.reduce?0:.2,overwrite:true});});
  $$('.ch-foot-field .go,.counsel-footer .ch-btn').forEach(button=>{
    gsap.set(button,{scale:1});
    env.on(button,'pointerdown',()=>gsap.to(button,{scale:env.reduce?1:.985,duration:env.reduce?0:.15,overwrite:true}));
    ['pointerup','pointerleave','pointercancel'].forEach(event=>env.on(button,event,()=>gsap.to(button,{scale:1,duration:env.reduce?0:.15,overwrite:true})));
  });
}

function animateConditionHeroWeave(env){
  const svg=$('.condition-thread'),hero=$('.condition-hero'),card=$('.condition-progress-card');
  if(!svg||!hero||!card)return;
  const path=$('defs path',svg),figure=card.closest('.condition-person-figure');
  const stroke=parseFloat(getComputedStyle(svg).strokeWidth)||8;
  // Home V13: cubic width growth over the first 60%, height over the last
  // 55%. The camera pull, draw and opening overlap on the same timeline.
  const growStart=.75,growDuration=1.15,openEnd=growStart+growDuration;
  const clock={time:0},easeIO=gsap.parseEase('power2.inOut');
  const drift=t=>-18*Math.pow(Math.max(0,openEnd-t),2)/(2*openEnd);
  const focus={width:stroke,at:0,offset:env.reduce?0:drift(0)};let paint=()=>{},mask,opened=false;
  const measure=()=>{
    if(opened)focus.width=card.offsetWidth;
    // Layout coordinates stay independent of the introductory camera scale.
    const offset=element=>{let x=0,y=0;for(let node=element;node&&node!==hero;node=node.offsetParent){x+=node.offsetLeft;y+=node.offsetTop;}return{x,y};};
    const svgStyle=getComputedStyle(svg),box={x:parseFloat(svgStyle.left)||0,y:parseFloat(svgStyle.top)||0},frame=offset(figure),stacked=hero.clientWidth<=900;
    const w=svg.clientWidth,h=svg.clientHeight,x=frame.x-box.x+card.offsetLeft+(stacked?0:card.offsetWidth*.5),y=frame.y-box.y+card.offsetTop+card.offsetHeight*.5;
    const approach=(x+60)*.4,departure=(w-x)*.32,slope=.26;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    // Keep the ribbon geometry fixed. Only its accent stitch opens into the card.
    // A shared non-horizontal tangent carries the ribbon through the stitch.
    // No straight bridge or animated flattening beneath the opening card.
    path.setAttribute('d',`M -60 ${y+90} C ${x*.18} ${y+88} ${x-approach} ${y+slope*approach} ${x} ${y} C ${x+departure} ${y-slope*departure} ${w*.8} ${y+72} ${stacked?w+80:w*.86} ${stacked?y-140:-80}`);
    const length=path.getTotalLength();let lo=0,hi=length;
    for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(path.getPointAtLength(mid).x<x)lo=mid;else hi=mid;}
    focus.at=(lo+hi)/2/length;
    if(mask){mask.setAttribute('width',w+200);mask.setAttribute('height',h+200);}
    paint();
  };
  measure();paint=weave(env,svg,hero,{varied:true,focus});
  [svg,hero,card].forEach(el=>env.resize(el,measure));
  if(env.reduce)return;
  const group=$('[data-motion-weave]',svg),content=[...card.children],defs=$('defs',svg);
  mask=svgNode('mask',{id:path.id+'-entrance',maskUnits:'userSpaceOnUse',x:-100,y:-100,width:svg.clientWidth+200,height:svg.clientHeight+200});
  const trace=svgNode('use',{href:'#'+path.id,fill:'none',stroke:'white','stroke-width':24,'vector-effect':'non-scaling-stroke','stroke-dasharray':'1000 1000','stroke-dashoffset':1000});
  mask.append(trace);defs.append(mask);group.setAttribute('mask',`url(#${mask.id})`);measure();
  const accent=getComputedStyle(card).getPropertyValue('--condition-accent').trim(),rest=getComputedStyle(card).backgroundColor;
  const tint=gsap.utils.interpolate(accent,rest),drawEase=gsap.parseEase('condition-draw');
  const clamp=gsap.utils.clamp(0,1);
  const renderOpening=()=>{
    const t=clock.time,grow=t-growStart;
    const uw=easeIO(clamp(grow/(growDuration*.6)));
    const uh=easeIO(clamp((grow-growDuration*.45)/(growDuration*.55)));
    focus.width=stroke+(card.offsetWidth-stroke)*uw;
    focus.offset=drift(t);
    trace.setAttribute('stroke-dashoffset',1000*(1-drawEase(clamp(t/1.05))));
    paint();
    // Follow the very same moving stitch, as Home V13's cardAnchor does.
    // The curve never changes, and there is no post-draw positioning step.
    const length=path.getTotalLength(),at=focus.at*length;
    const home=path.getPointAtLength(at),point=path.getPointAtLength(Math.max(0,at+focus.offset));
    const height=stroke+(card.offsetHeight-stroke)*uh;
    // The stitch follows the curve, but the card always has horizontal top
    // and bottom edges. A curved polygon made the partially open card skew.
    const insetY=Math.max(0,(card.offsetHeight-height)/2);
    const insetX=Math.max(0,(card.offsetWidth-focus.width)/2);
    gsap.set(card,{
      autoAlpha:uh>.01?1:0,
      translate:`${point.x-home.x}px ${point.y-home.y}px`,
      clipPath:`inset(${insetY}px ${insetX}px round ${Math.min(16,height/2)}px)`,
      backgroundColor:tint(uh),
    });
  };
  renderOpening();
  gsap.set(content,{opacity:0,y:7});card.inert=true;
  const bars=$$('.condition-progress-chart rect',card),value=$('.condition-progress-value',card);
  const count={lbs:0},finalValue=value?.textContent,heights=bars.map(bar=>Number(bar.getAttribute('height')));
  if(value){gsap.set(bars,{attr:{y:72,height:0}});value.textContent='0lbs';}
  const anchor=path.getPointAtLength(focus.at*path.getTotalLength());
  const heroCopy=$('.condition-hero-copy'),nav=$('nav',hero),person=$('.condition-hero-person');
  gsap.set(hero,{scale:hero.clientWidth<=900?1.12:1.28,transformOrigin:`${anchor.x}px ${anchor.y}px`,willChange:'transform'});
  gsap.set([heroCopy,nav],{opacity:0,y:12});
  gsap.set(person,{opacity:0,y:24});
  const entrance=gsap.timeline({scrollTrigger:{scroller:env.stage,trigger:hero,start:'top 80%',once:true},onComplete:()=>{opened=true;card.inert=false;group.removeAttribute('mask');measure();}});
  entrance.to(clock,{time:openEnd,duration:openEnd,ease:'none',onUpdate:renderOpening},0)
    .to(hero,{scale:1,duration:1.75,ease:'condition-camera',clearProps:'transform,transformOrigin,willChange'},.35)
    .to(person,{opacity:1,y:0,duration:.7,ease:'power2.out',clearProps:'opacity,transform'},1.05)
    .to([heroCopy,nav],{opacity:1,y:0,duration:.8,stagger:.12,ease:'power2.out',clearProps:'opacity,transform'},1.45)
    .set(card,{clearProps:'clipPath,backgroundColor,translate'},openEnd)
    .to(content,{opacity:1,y:0,duration:.38,stagger:.06,clearProps:'opacity,transform'},openEnd-.3);
  if(value){
    entrance.to(bars,{attr:{y:i=>72-heights[i],height:i=>heights[i]},duration:.65,stagger:.09,ease:'power2.out'},openEnd)
      .to(count,{lbs:-45,duration:1.37,ease:'power1.inOut',onUpdate:()=>{value.textContent=`${Math.round(count.lbs)}lbs`;},onComplete:()=>{value.textContent=finalValue;}},openEnd);
  }
  env.cleanups.push(()=>{card.inert=false;if(value)value.textContent=finalValue;mask.remove();group.removeAttribute('mask');});
}

/** Homepage's tonal ribbon sweep, including navigation and keyboard focus. */
function animateRibbonButtons(env,selector){
  $$(selector).forEach(button=>{
    let train,tween;
    const clear=()=>{tween?.kill();train?.remove();train=null;};
    const start=()=>{
      clear();if(env.reduce)return;
      // Read the current state: the navigation changes from light to dark when fixed.
      const computed=getComputedStyle(button).backgroundColor;
      const rgb=computed.match(/[\d.]+/g)?.slice(0,3).map(Number)||[19,32,69];
      if(computed.startsWith('color(srgb '))rgb.forEach((value,i)=>{rgb[i]=Math.round(value*255);});
      const base=`rgb(${rgb.join(',')})`;
      const light=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>145;
      const pass=light?gsap.utils.interpolate(base,window.CounselColors.blue2,.32):window.CounselColors.blue8;
      train=document.createElement('span');train.className='motion-sweep-train';train.setAttribute('aria-hidden','true');
      [base,pass].forEach(color=>{const block=document.createElement('i');block.style.background=color;train.append(block);});
      button.append(train);
      tween=gsap.fromTo(train,{xPercent:-100},{xPercent:0,duration:.97,ease:'counsel-sweep',onComplete:clear});
    };
    button.classList.add('motion-sweep-host');
    [['pointerenter',start],['pointerleave',clear],['click',start],['focus',start],['blur',clear]].forEach(([event,callback])=>{
      const listener=()=>env.context.add(callback);button.addEventListener(event,listener);
      env.cleanups.push(()=>button.removeEventListener(event,listener));
    });
    env.cleanups.push(()=>{clear();button.classList.remove('motion-sweep-host');});
  });
}

function animateConditionButtons(env){
  animateRibbonButtons(env,'.condition-page .channel-btn,.condition-page nav .demo-btn,.condition-page .cn-mdemo');
}

function animateConditionTies(env){
  if(env.reduce)return;
  $$('.condition-v2 .wm-included .condition-step-tie').forEach((grid,index)=>{
    const pulse=gsap.timeline({paused:true,repeat:-1,repeatDelay:2.8+index*.6});
    $$('i',grid).forEach((dot,i)=>{
      const at=(Math.floor(i/4)+i%4)*.1;
      pulse.to(dot,{opacity:.72,scale:.88,duration:.8,ease:'sine.inOut'},at)
        .to(dot,{opacity:1,scale:1,duration:1,ease:'sine.inOut'},at+.8);
    });
    inView(env,pulse,grid,0,()=>grid.offsetWidth>0);
  });
}

function animateConditionAssessment(env,art){
  const tl=gsap.timeline({paused:true,defaults:{ease:'counsel-chat'}});
  tl.from($('.wm-assessment',art),{opacity:0,y:24,duration:.95},0)
    .from($$('.wm-intake-field>span',art),{opacity:0,y:5,duration:.5,stagger:.16},.3)
    .from($$('.wm-intake-field b',art),{opacity:0,scale:.94,y:4,duration:.55,stagger:.12,transformOrigin:'left center'},.48)
    .fromTo($('.wm-intake-complete path',art),{strokeDasharray:24,strokeDashoffset:24},{strokeDashoffset:0,duration:.5,ease:'none'},1.05)
    .from($('.wm-reviewed',art),{clipPath:'inset(0 0 100% 0)',duration:.8,ease:'counsel-settle'},1.15)
    .from($('.wm-reviewed img',art),{opacity:0,y:10,duration:.65},1.3)
    .from($('.wm-reviewed>div',art),{opacity:0,y:6,duration:.65},1.48);
  inView(env,tl,art,.12);
}

function animateConditionPrescription(env,art){
  const tl=gsap.timeline({paused:true,defaults:{ease:'counsel-chat'}});
  tl.from($('.wm-prescription',art),{opacity:0,y:24,duration:.95},0)
    .from($('.wm-prescription-tabs',art),{opacity:0,duration:.5},.2)
    .from($$('.wm-rx-eyebrow,.wm-prescription strong,.wm-prescription p',art),{opacity:0,y:8,duration:.65,stagger:.14},.35)
    .from($('.wm-directions',art),{opacity:0,y:10,duration:.7},.95)
    .from($('.wm-directions svg',art),{x:-8,opacity:0,duration:.6},1.25);
  inView(env,tl,art,.12);
}

function animateConditionSupport(env,art){
  const tl=gsap.timeline({paused:true,defaults:{ease:'counsel-chat'}});
  tl.from($('.wm-support-question',art),{opacity:0,y:16,duration:.8},0)
    .from($('.wm-support-reply',art),{opacity:0,y:18,duration:.8},.42)
    .from($('.wm-support-header',art),{opacity:0,y:5,duration:.5},.62)
    .to($('.wm-support-thinking',art),{opacity:1,duration:.15},.75)
    .fromTo($$('.wm-support-thinking i',art),{opacity:.2},{opacity:1,duration:.22,stagger:.045,repeat:1,yoyo:true,ease:'sine.inOut'},.85)
    .to($('.wm-support-thinking',art),{opacity:0,duration:.18},1.85)
    .from($('.wm-support-reply p',art),{opacity:0,y:5,duration:.65},2)
    .from($('.wm-support-composer',art),{opacity:0,y:8,duration:.7},2.15);
  inView(env,tl,art,.12);
}

function animateConditionBenefits(env){
  if(env.reduce)return;
  const initializers=[animateConditionAssessment,animateConditionPrescription,animateConditionSupport];
  $$('.condition-v2 .wm-included .condition-step-art').forEach((art,index)=>initializers[index]?.(env,art));
}

/* Condition template V3 (Hunter, 2026-10-06): the live pages' sections.
   Same rhythm as the V2 product moments: 16px entrances, counsel-settle,
   .18s stagger. Reduced motion leaves every section settled and static. */
/** V3 lifestyle hero (Hunter, Oct 6): no UI, only the person, with the
 *  ribbon behind them. It follows Hunter's sketch: in high on the left, down
 *  behind the face, level, down again past the person, and out under the
 *  next band just before the copy. Never over the H1, never in front.
 *  The person settles, then the line draws while the camera pulls back. */
// Hunter's sketch on Birth Control V3, as fractions of the portrait square.
const CONDITION_HERO_SKETCH=[[.03,.16],[.2,.335],[.48,.37],[.7,.64],[.87,.8]];
// Catmull-Rom through the points, written as cubic curves, so the line stays
// fluid however the points move with the layout.
function smoothThread(points){
  const r=n=>Math.round(n*10)/10;
  return points.reduce((d,[x,y],i)=>{
    if(!i)return `M ${r(x)} ${r(y)}`;
    const [ax,ay]=points[i-2]||points[i-1],[bx,by]=points[i-1],[nx,ny]=points[i+1]||[x,y];
    return `${d} C ${r(bx+(x-ax)/6)} ${r(by+(y-ay)/6)} ${r(x-(nx-bx)/6)} ${r(y-(ny-by)/6)} ${r(x)} ${r(y)}`;
  },'');
}
function animateConditionLifestyleHero(env){
  const hero=$('.condition-v3 .condition-hero'),back=$('.cv3-thread-back',hero);
  if(!hero||!back)return;
  const person=$('.cv3-hero-person',hero);
  const path=$('defs path',back);
  const offset=element=>{let x=0,y=0;for(let node=element;node&&node!==hero;node=node.offsetParent){x+=node.offsetLeft;y+=node.offsetTop;}return{x,y};};
  const pageTop=element=>{let y=0;for(let node=element;node;node=node.offsetParent)y+=node.offsetTop;return y;};
  let paint=()=>{},mask=null;
  const measure=()=>{
    const w=back.clientWidth,h=back.clientHeight,stacked=hero.clientWidth<=900;
    back.setAttribute('viewBox',`0 0 ${w} ${h}`);
    const box=person||$('.cv3-hero-figure',hero),at=offset(box),size=box.offsetWidth;
    // The next band's rounded top overlaps the hero; the line leaves under it.
    const next=$('#main')?.firstElementChild,bandTop=next?Math.min(h,pageTop(next)-pageTop(hero)):h;
    let points=CONDITION_HERO_SKETCH.map(([u,v])=>[at.x+u*size,at.y+v*size]);
    if(stacked){
      // Copy sits above: drop behind the person and out the bottom.
      points=points.slice(0,4);
      points.push([w*.8,h+30]);
    }else{
      // Keep the second drop clear of the copy column at narrower widths,
      // then slip under the band just before the copy's left edge.
      const copyX=offset($('.condition-hero-copy',hero)).x,limit=copyX-70,start=points[1][0],far=points.at(-1)[0];
      if(far>limit)points=points.map((p,i)=>i<2?p:[start+(p[0]-start)*(limit-start)/(far-start),p[1]]);
      points.push([copyX-60,bandTop-22],[copyX+200,h+30]);
    }
    path.setAttribute('d',smoothThread([[-60,at.y+size*.12],...points]));
    if(mask){mask.setAttribute('width',w+200);mask.setAttribute('height',h+200);}
    paint();
  };
  measure();paint=weave(env,back,hero,{varied:true});
  const group=$('[data-motion-weave]',back);
  [hero,back,person,$('.condition-hero-copy',hero)].filter(Boolean).forEach(element=>env.resize(element,measure));
  if(person&&!person.complete)env.on(person,'load',measure);
  if(env.reduce)return;
  mask=svgNode('mask',{id:'cv3-thread-draw',maskUnits:'userSpaceOnUse',x:-100,y:-100,width:back.clientWidth+200,height:back.clientHeight+200});
  const trace=svgNode('use',{href:'#cv3-thread-path',fill:'none',stroke:'white','stroke-width':24,'vector-effect':'non-scaling-stroke','stroke-dasharray':'1000 1000','stroke-dashoffset':1000});
  mask.append(trace);$('defs',back).append(mask);group.setAttribute('mask','url(#cv3-thread-draw)');
  const copy=$('.condition-hero-copy',hero),nav=$('nav',hero);
  const origin=person?(()=>{const b=offset(person),s=person.offsetWidth;return `${b.x+s*.5}px ${b.y+s*.45}px`;})():'50% 50%';
  gsap.set(hero,{scale:hero.clientWidth<=900?1.08:1.16,transformOrigin:origin,willChange:'transform'});
  gsap.set([copy,nav],{opacity:0,y:12});
  if(person)gsap.set(person,{opacity:0,y:28});
  const intro=gsap.timeline({scrollTrigger:{scroller:env.stage,trigger:hero,start:'top 80%',once:true},onComplete:()=>group.removeAttribute('mask')});
  if(person)intro.to(person,{opacity:1,y:0,duration:.9,ease:'counsel-settle',clearProps:'opacity,transform'},0);
  intro.to(hero,{scale:1,duration:1.9,ease:'condition-camera',clearProps:'transform,transformOrigin,willChange'},.15)
    .to(trace,{attr:{'stroke-dashoffset':0},duration:1.35,ease:'condition-draw'},.45)
    .to([copy,nav],{opacity:1,y:0,duration:.8,stagger:.12,ease:'power2.out',clearProps:'opacity,transform'},1.1);
  env.cleanups.push(()=>{mask.remove();group.removeAttribute('mask');});
}

function animateConditionV3Reveals(env){
  $$('.condition-v3 :is(.condition-section-head,.cv3-split-copy)').forEach(element=>reveal(env,element));
  if(env.reduce)return;
  [['.cv3-rx-grid','.cv3-rx'],['.cv3-plans','.cv3-plan']].forEach(([group,item])=>{
    const root=$(group);if(!root)return;
    const tl=gsap.timeline({paused:true});
    tl.fromTo($$(item,root),{opacity:0,y:16},{opacity:1,y:0,duration:.9,stagger:.18,ease:'counsel-settle'});
    inView(env,tl,root,.08);
  });
}

/** The ongoing check-in: question, reply, handoff, doctor. */
function animateConditionCheckin(env){
  const chat=$('.cv3-chat');if(!chat||env.reduce)return;
  const items=[...$('.cv3-chat-body',chat).children],tl=gsap.timeline({paused:true,defaults:{ease:'counsel-chat'}});
  gsap.set(items,{opacity:0,y:10});
  let at=.2;
  items.forEach(item=>{
    if(item.classList.contains('cv3-chat-ai')){
      const dots=$('.cv3-chat-thinking',item),text=item.lastElementChild;
      tl.set(item,{opacity:1,y:0},at).set(text,{opacity:0},at).to(dots,{opacity:1,duration:.15},at)
        .fromTo($$('i',dots),{opacity:.2},{opacity:1,duration:.22,stagger:.045,repeat:1,yoyo:true,ease:'sine.inOut'},at+.05)
        .to(dots,{opacity:0,duration:.15},at+.95).to(text,{opacity:1,duration:.5},at+1);
      at+=1.45;
    }else{
      tl.to(item,{opacity:1,y:0,duration:.6},at);
      at+=item.classList.contains('cv3-chat-time')?.3:.8;
    }
  });
  tl.from($('.cv3-chat-composer',chat),{opacity:0,y:8,duration:.6},at);
  inView(env,tl,chat,.15);
}

function animateConditionPhysicians(env){
  const row=$('.cv3-doctor-row');if(!row||env.reduce)return;
  const tl=gsap.timeline({paused:true});
  tl.fromTo($$('img',row),{opacity:0,x:-20},{opacity:1,x:0,duration:.9,stagger:.12,ease:'counsel-settle'});
  inView(env,tl,row,.1);
}

/** Member stories: a slow drift that pauses for hover, focus, drag and view. */
function animateConditionStories(env){
  const marquee=$('.cv3-marquee');if(!marquee)return;
  const track=$('.cv3-marquee-track',marquee),stories=$$('.cv3-story',track);
  const period=()=>stories[stories.length/2].offsetLeft-stories[0].offsetLeft;
  let pos=0,held=false,active=false,drag=null;
  const wrap=()=>{const p=period();if(p<=0)return;if(marquee.scrollLeft>=p)marquee.scrollLeft-=p;else if(marquee.scrollLeft<=0&&drag)marquee.scrollLeft+=p;pos=marquee.scrollLeft;};
  env.on(marquee,'scroll',()=>{if(!drag&&Math.abs(marquee.scrollLeft-pos)>1.5)pos=marquee.scrollLeft;wrap();});
  env.on(marquee,'pointerenter',event=>{if(event.pointerType==='mouse')held=true;});
  env.on(marquee,'pointerleave',()=>{held=false;});
  env.on(marquee,'focusin',()=>{held=true;});
  env.on(marquee,'focusout',()=>{held=false;});
  env.on(marquee,'pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0)return;
    drag={x:event.clientX,left:marquee.scrollLeft};marquee.setPointerCapture(event.pointerId);marquee.classList.add('is-dragging');
  });
  env.on(marquee,'pointermove',event=>{if(!drag)return;marquee.scrollLeft=drag.left-(event.clientX-drag.x);wrap();});
  const release=()=>{if(!drag)return;drag=null;marquee.classList.remove('is-dragging');pos=marquee.scrollLeft;};
  env.on(marquee,'pointerup',release);env.on(marquee,'pointercancel',release);env.on(marquee,'lostpointercapture',release);
  env.cleanups.push(()=>marquee.classList.remove('is-dragging'));
  if(env.reduce)return;
  const tick=(time,deltaTime)=>{
    if(held||drag||!active||document.hidden)return;
    pos+=Math.min(deltaTime,64)*.032;
    const p=period();if(p>0&&pos>=p)pos-=p;
    marquee.scrollLeft=pos;
  };
  gsap.ticker.add(tick);env.cleanups.push(()=>gsap.ticker.remove(tick));
  inView(env,{paused:value=>{active=!value;}},marquee,0);
}

/** Reuse V5 motion with pixel-measured Conditions hero geometry. */
export function mountDecorativeWeaves(){
  if(!gsap||!ScrollTrigger||!CustomEase)return()=>{};
  gsap.registerPlugin(ScrollTrigger,CustomEase);CustomEase.create('counsel-draw','.6,0,0,1');
  CustomEase.create('condition-draw','.6,0,.2,1');CustomEase.create('condition-camera','.5,0,.15,1');CustomEase.create('counsel-sweep','.22,.61,.2,1');
  CustomEase.create('counsel-ui','.2,.8,.2,1');CustomEase.create('counsel-ease','.25,.1,.25,1');CustomEase.create('counsel-settle','.2,.65,.2,1');CustomEase.create('counsel-chat','.2,.7,.2,1');
  const media=gsap.matchMedia();
  media.add({all:'(min-width:0px)',reduce:'(prefers-reduced-motion:reduce)'},context=>{
    const cleanups=[],gates=[];
    const env={context,stage:$('#stage'),reduce:context.conditions.reduce,cleanups,gates,
      on(target,event,callback){const listener=e=>context.add(()=>callback(e));target?.addEventListener(event,listener);cleanups.push(()=>target?.removeEventListener(event,listener));},
      resize(target,callback){const observer=new ResizeObserver(callback);observer.observe(target);cleanups.push(()=>observer.disconnect());}};
    animateConditionHeroWeave(env);
    animateConditionTies(env);
    animateConditionBenefits(env);
    if($('.condition-v3')){animateConditionLifestyleHero(env);animateConditionV3Reveals(env);animateConditionCheckin(env);animateConditionPhysicians(env);animateConditionStories(env);}
    if($('.condition-v2 .ci-tabs'))animateCareExperience(env);
    animateConditionButtons(env);
    // Pages without a closing band skip its weave.
    if($('.v2-closing'))animateClosing(env);
    const sync=()=>gates.forEach(fn=>fn());document.addEventListener('visibilitychange',sync);
    const refresh=()=>ScrollTrigger.refresh();window.addEventListener('load',refresh,{once:true});
    let alive=true;document.fonts.ready.then(()=>{if(alive)refresh();});refresh();
    return()=>{alive=false;document.removeEventListener('visibilitychange',sync);window.removeEventListener('load',refresh);cleanups.reverse().forEach(fn=>fn());};
  });
  return()=>media.revert();
}


/* ===================== Counsel Studio V1 (Hunter, 2026-10-06) =====================
   One entry point for the page, named section initializers, Lenis through the
   GSAP ticker, reduced motion settled, offscreen and hidden work paused. */
export function mountStudioAnimations(){
  if(!gsap||!ScrollTrigger||!CustomEase)return()=>{};
  gsap.registerPlugin(ScrollTrigger,CustomEase);
  CustomEase.create('counsel-settle','.2,.65,.2,1');CustomEase.create('counsel-ease','.25,.1,.25,1');
  CustomEase.create('counsel-chat','.2,.7,.2,1');CustomEase.create('counsel-sweep','.22,.61,.2,1');
  const media=gsap.matchMedia();
  media.add({desktop:'(min-width:901px)',mobile:'(max-width:900px)',reduce:'(prefers-reduced-motion:reduce)'},context=>{
    const cleanups=[],gates=[];
    const env={context,reduce:context.conditions.reduce,desktop:context.conditions.desktop,stage:$('#stage'),cleanups,gates,
      on(target,event,callback,options){const listener=e=>context.add(()=>callback(e));target?.addEventListener(event,listener,options);cleanups.push(()=>target?.removeEventListener(event,listener,options));},
      resize(target,callback){if(!target)return;const observer=new ResizeObserver(callback);observer.observe(target);cleanups.push(()=>observer.disconnect());}};
    animatePageScroll(env);
    animateStudioWave(env,$('.studio-hero'),$('.studio-hero .studio-wave'),$('.studio-title span'),{intro:true,pointer:true});
    animateStudioWave(env,$('.studio-cta'),$('.studio-cta .studio-wave'),$('.studio-cta-title span'),{intro:false,pointer:false});
    animateStudioDemo(env);
    animateStudioOutcomes(env);
    animateStudioReveals(env);
    animateRibbonButtons(env,'.studio-page .channel-btn,.studio-page nav .demo-btn');
    env.on(document,'visibilitychange',()=>gates.forEach(gate=>gate()));
    const refresh=()=>{env.lenis?.resize();ScrollTrigger.refresh();};
    let alive=true;document.fonts.ready.then(()=>{if(alive)refresh();});
    $$('img').filter(img=>!img.complete).forEach(img=>env.on(img,'load',()=>ScrollTrigger.refresh(),{once:true}));
    refresh();
    return()=>{alive=false;cleanups.reverse().forEach(cleanup=>cleanup());};
  });
  return()=>media.revert();
}

/** The brand book's dot columns around a headline. Grows outward on entry,
 *  drifts slowly while visible, and lifts a little toward the cursor. */
function animateStudioWave(env,section,canvas,text,{intro,pointer}){
  if(!section||!canvas||!text)return;
  const wave=createWaveform(canvas),host=canvas.parentElement,state={reveal:env.reduce?1:0,time:0,pointer:{x:0,strength:0}};
  const draw=()=>wave.render({reveal:state.reveal,time:state.time,pointer:pointer?state.pointer:null});
  let room=0;
  const measure=()=>{
    const box=canvas.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(text);
    const rects=[...range.getClientRects()];if(!rects.length)return;
    const left=Math.min(...rects.map(r=>r.left))-box.left,right=Math.max(...rects.map(r=>r.right))-box.left;
    const top=Math.min(...rects.map(r=>r.top))-box.top,bottom=Math.max(...rects.map(r=>r.bottom))-box.top;
    const {dot,reach}=wave.measure({left:left+6,right:right-6,top:top-dot0(),bottom:bottom+dot0()});
    // Reserve exactly the weave's height above and below the headline.
    // Drift and the cursor lift can add about two rows, so leave room for them.
    const next=Math.round(reach+dot*4.5);
    if(Math.abs(next-room)>1){room=next;host.style.setProperty('--wave-room',`${room}px`);requestAnimationFrame(measure);}
    draw();
  };
  const dot0=()=>Math.max(8,Math.min(18,text.getBoundingClientRect().width*.014));
  measure();env.resize(host,measure);env.resize(text,measure);
  if(env.reduce){draw();return;}
  if(intro){gsap.to(state,{reveal:1,duration:1.8,delay:.25,ease:'none',onUpdate:draw});}
  else{gsap.timeline({scrollTrigger:{scroller:env.stage,trigger:section,start:'top 70%',once:true}}).to(state,{reveal:1,duration:1.6,ease:'none',onUpdate:draw});}
  const loop=gsap.to(state,{time:'+=100000',duration:100000,ease:'none',repeat:-1,paused:true,onUpdate:draw});
  inView(env,loop,section,0);
  if(pointer){
    const target={x:0,strength:0};
    env.on(section,'pointermove',event=>{if(event.pointerType!=='mouse')return;const box=canvas.getBoundingClientRect();target.x=event.clientX-box.left;target.strength=1;gsap.to(state.pointer,{x:target.x,strength:1,duration:.6,ease:'power2.out',overwrite:true});});
    env.on(section,'pointerleave',()=>gsap.to(state.pointer,{strength:0,duration:.8,ease:'power2.out',overwrite:true}));
  }
}

/** White-label preview: brand colors tween, screens arrive, brands cycle
 *  slowly on their own until someone picks one. */
function animateStudioDemo(env,{brandDelay=0,autoplay=true}={}){
  const phone=$('.sp-phone');if(!phone)return;
  const api=window.CounselStudio;
  const apply=(brand,instant)=>gsap.to(phone,{'--b':brand.accent,'--b-soft':brand.soft,duration:instant||env.reduce?0:.6,delay:instant||env.reduce?0:brandDelay,ease:'counsel-ease',overwrite:true});
  apply(api.BRANDS[0],true);
  let touched=false,active=false;
  env.on(phone.ownerDocument,'studio:brand',({detail})=>{if(detail.user)touched=true;apply(detail.brand,false);});
  env.on(phone.ownerDocument,'studio:path',({detail})=>{
    if(detail.user)touched=true;
    if(env.reduce)return;
    const screen=$(`.sp-screen[data-screen="${detail.index}"]`,phone),items=[...screen.children];
    gsap.fromTo(items,{opacity:0,y:10},{opacity:1,y:0,duration:.55,stagger:.12,ease:'counsel-chat',overwrite:true,clearProps:'opacity,transform'});
    const dots=$$('.sp-thinking i',screen);
    if(dots.length)gsap.fromTo(dots,{opacity:.2},{opacity:1,duration:.22,stagger:.04,repeat:1,yoyo:true,ease:'sine.inOut'});
  });
  // Round two never autoplays (Hunter, Oct 9): brands change only when picked.
  if(env.reduce||!autoplay)return;
  let index=0;
  const cycle=gsap.delayedCall(3.4,function tick(){
    if(!touched&&active&&!document.hidden){index=(index+1)%api.BRANDS.length;api.setBrand(api.BRANDS[index].id);}
    if(!touched)cycle.restart(true);
  });
  inView(env,{paused:value=>{active=!value;}},phone,.2);
  env.cleanups.push(()=>cycle.kill());
}

/** Four outcomes, one field of squares. Pinned and scrubbed on desktop; each
 *  outcome draws its own static arrangement on phones and for reduced motion. */
const placeFieldLabels=(holder,labels,opacity=1)=>{
  holder.innerHTML=labels.map(label=>`<span style="left:${label.x}px;top:${label.y}px;--tx:${label.align==='right'?'-100%':label.align==='center'?'-50%':'0'};opacity:${opacity}">${label.text}</span>`).join('');
};
function animateStudioOutcomes(env){
  const section=$('.studio-outcomes');if(!section)return;
  const items=$$('.studio-outcome',section),names=items.map(item=>item.dataset.layout);
  const placeLabels=placeFieldLabels;
  const minis=items.map(item=>{const holder=$('.studio-field.is-mini',item);return{holder,field:createField($('canvas',holder)),name:item.dataset.layout};});
  const drawMinis=()=>minis.forEach(mini=>{if(!mini.holder.offsetWidth)return;mini.field.resize();mini.field.render(mini.name);placeLabels($('.studio-field-labels',mini.holder),mini.field.layout(mini.name).labels);});
  drawMinis();minis.forEach(mini=>env.resize(mini.holder,drawMinis));
  const main=$('.studio-field.is-main',section);
  if(!env.desktop||env.reduce||!main.offsetWidth)return;
  const field=createField($('canvas',main)),labels=$('.studio-field-labels',main);
  let progress=0,shown=-1;
  const smooth=t=>t*t*(3-2*t);
  const render=()=>{
    const k=Math.min(names.length-2,Math.floor(progress)),f=Math.min(1,progress-k);
    const t=smooth(Math.min(1,Math.max(0,(f-.2)/.6)));
    field.render(names[k],names[k+1],t);
    const near=t<.5?k:k+1,fade=Math.abs(t-.5)*2;
    placeLabels(labels,field.layout(names[near]).labels,fade);
    const current=Math.round(progress);
    if(current!==shown){shown=current;items.forEach((item,i)=>item.classList.toggle('is-active',i===current));}
  };
  field.resize();render();
  const pin=$('.studio-outcomes-pin',section);
  const trigger=ScrollTrigger.create({scroller:env.stage,trigger:pin,pin:true,start:'top top',end:()=>`+=${innerHeight*(names.length-1)}`,scrub:true,invalidateOnRefresh:true,
    onUpdate:self=>{progress=self.progress*(names.length-1);render();}});
  env.resize(main,()=>{field.resize();render();});
  items.forEach((item,i)=>env.on(item,'click',()=>{
    const y=trigger.start+(trigger.end-trigger.start)*i/(names.length-1);
    env.lenis?env.lenis.scrollTo(y,{duration:1.1}):env.stage.scrollTo({top:y,behavior:'smooth'});
  }));
  env.cleanups.push(()=>items.forEach((item,i)=>item.classList.toggle('is-active',i===0)));
}

function animateStudioReveals(env){
  $$('.studio-page :is(.studio-partner-inner,.studio-demo-copy,.studio-demo-stage,.studio-deploy li,.studio-outcomes-title,.studio-proof-grid>div,.studio-audiences h2,.studio-audience)').forEach(element=>reveal(env,element));
  if(env.reduce)return;
  $$('.studio-stat').forEach(stat=>{
    const tl=gsap.timeline({paused:true});
    tl.fromTo($$('.studio-stat-chart i',stat),{opacity:0,scale:.4},{opacity:1,scale:1,duration:.3,stagger:.04,ease:'counsel-settle'});
    inView(env,tl,stat,.15);
  });
}

/* ================= Counsel Studio V2 to V4 (Hunter, 2026-10-07) =================
   Three iterations on V1 that tell the story with squares, simple to complex.
   Same contract as V1: one entry point per page, named section initializers,
   Lenis through the GSAP ticker, reduced motion settled, offscreen and hidden
   work paused. Drawing for V3 and V4 is in studio-src/squares.js. */
function mountStudioPage(sections,{ribbon=false}={}){
  if(!gsap||!ScrollTrigger||!CustomEase)return()=>{};
  gsap.registerPlugin(ScrollTrigger,CustomEase);
  CustomEase.create('counsel-settle','.2,.65,.2,1');CustomEase.create('counsel-ease','.25,.1,.25,1');
  CustomEase.create('counsel-chat','.2,.7,.2,1');CustomEase.create('counsel-sweep','.22,.61,.2,1');
  const media=gsap.matchMedia();
  media.add({desktop:'(min-width:901px)',mobile:'(max-width:900px)',reduce:'(prefers-reduced-motion:reduce)'},context=>{
    const cleanups=[],gates=[];
    const env={context,reduce:context.conditions.reduce,desktop:context.conditions.desktop,stage:$('#stage'),cleanups,gates,
      on(target,event,callback,options){const listener=e=>context.add(()=>callback(e));target?.addEventListener(event,listener,options);cleanups.push(()=>target?.removeEventListener(event,listener,options));},
      resize(target,callback){if(!target)return;const observer=new ResizeObserver(callback);observer.observe(target);cleanups.push(()=>observer.disconnect());}};
    animatePageScroll(env);
    sections(env);
    if(ribbon)animateRibbonButtons(env,'.studio-page .channel-btn,.studio-page nav .demo-btn');
    env.on(document,'visibilitychange',()=>gates.forEach(gate=>gate()));
    const refresh=()=>{env.lenis?.resize();ScrollTrigger.refresh();};
    let alive=true;document.fonts.ready.then(()=>{if(alive)refresh();});
    $$('img').filter(img=>!img.complete).forEach(img=>env.on(img,'load',()=>ScrollTrigger.refresh(),{once:true}));
    refresh();
    return()=>{alive=false;cleanups.reverse().forEach(cleanup=>cleanup());};
  });
  return()=>media.revert();
}

/* ---- V2, "One square": one square grows into the story. Monotone, so the
   brand ribbon on buttons stays off. ---- */
export function mountStudioV2(){
  return mountStudioPage(env=>{
    animateStudioV2Cursor(env);
    animateStudioV2Steps(env);
    animateStudioDemo(env);
    animateStudioV2Outcomes(env);
    animateStudioV2Proof(env);
    $$('.studio-v2 :is(.s2-hero-inner>*,.studio-partner-inner,.s2-heading,.studio-demo-copy,.studio-demo-stage,.studio-deploy li,.s2-outcome h3,.s2-outcome p,.s2-proof-copy,.s2-audience,.s2-cta-inner)').forEach(element=>reveal(env,element));
  });
}

/** The square after the last word blinks like a text cursor while in view. */
function animateStudioV2Cursor(env){
  if(env.reduce)return;
  $$('.s2-cursor').forEach(cursor=>{
    const blink=gsap.timeline({paused:true,repeat:-1});
    blink.set(cursor,{opacity:1},0).set(cursor,{opacity:0},.55).set(cursor,{opacity:1},1.1);
    inView(env,blink,cursor);
    env.cleanups.push(()=>gsap.set(cursor,{clearProps:'opacity'}));
  });
}

/** One square, then nine, then a doctor, then the app around them. */
function animateStudioV2Steps(env){
  const list=$('.s2-step-list');if(!list||env.reduce)return;
  const steps=$$('.s2-step',list),tl=gsap.timeline({paused:true,defaults:{ease:'counsel-settle'}});
  steps.forEach((step,i)=>{
    const at=i*.55,link=$('.s2-link',step),frame=$('.s2-frame',step);
    tl.fromTo($$('.s2-sq',step),{opacity:0,scale:.4,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.5,stagger:.035},at);
    if(link)tl.fromTo(link,{scaleX:0,transformOrigin:'0% 50%'},{scaleX:1,duration:.35,ease:'power2.out'},at+.3);
    if(frame)tl.fromTo(frame,{strokeDasharray:'100 100',strokeDashoffset:100},{strokeDashoffset:0,duration:.8,ease:'power2.inOut'},at+.1);
    tl.fromTo($('p',step),{opacity:0,y:8},{opacity:1,y:0,duration:.6},at+.15);
  });
  tl.fromTo($$('.s2-think',steps[1]),{opacity:1},{opacity:.3,duration:.22,stagger:.05,yoyo:true,repeat:1,ease:'sine.inOut'},1.05);
  inView(env,tl,list,.25);
}

/** Each outcome's diagram builds once, when it reaches the viewport. */
function animateStudioV2Outcomes(env){
  if(env.reduce)return;
  $$('.s2-outcome').forEach(card=>{
    const fig=$('.s2-fig',card),tl=gsap.timeline({paused:true,defaults:{ease:'counsel-ease'}}),kind=card.dataset.fig;
    if(kind==='access'){
      // From one square at the centre, outward.
      const lit=$$('.s2-sq.is-on',fig).sort((a,b)=>a.dataset.d-b.dataset.d);
      tl.fromTo(lit,{fillOpacity:.15},{fillOpacity:1,duration:.4,stagger:{each:1.1/lit.length}},.1);
    }else if(kind==='data'){
      tl.fromTo($$('.s2-label',fig),{opacity:0},{opacity:1,duration:.5,stagger:.06},0)
        .fromTo($$('.s2-row',fig),{fillOpacity:.15},{fillOpacity:1,duration:.3,stagger:(i,el)=>el.dataset.order*.09},.2)
        .fromTo($$('.s2-flow',fig),{opacity:0},{opacity:1,duration:.25,stagger:(i,el)=>el.dataset.order*.1},.7)
        .fromTo($$('.s2-bundle',fig),{opacity:0,scale:.4,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.5,stagger:.04,ease:'counsel-settle'},1.05);
    }else if(kind==='services'){
      tl.fromTo($$('.s2-service',fig),{fillOpacity:.15},{fillOpacity:1,duration:.45,stagger:.16},.1)
        .fromTo($$('.s2-label',fig),{opacity:0},{opacity:1,duration:.45,stagger:.16},.2);
    }else if(kind==='launch'){
      tl.fromTo($$('.s2-sq:not(.is-on)',fig),{opacity:0},{opacity:1,duration:.2,stagger:.004},0)
        .fromTo($$('.s2-week',fig),{fillOpacity:.15},{fillOpacity:1,duration:.3,stagger:.12},.65)
        .fromTo($$('.s2-label',fig),{opacity:0},{opacity:1,duration:.5,stagger:.25},.4);
    }
    inView(env,tl,card,.2);
  });
}

/** Ten squares each: four set aside, or the last one lit. */
function animateStudioV2Proof(env){
  if(env.reduce)return;
  $$('.s2-stat').forEach(stat=>{
    const squares=$$('.s2-sq',stat),tl=gsap.timeline({paused:true});
    tl.fromTo(squares,{opacity:0,scale:.4,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.35,stagger:.05,ease:'counsel-settle'},0);
    if(stat.dataset.stat==='0')tl.fromTo($$('.s2-avoided',stat),{fillOpacity:1},{fillOpacity:0,duration:.5,stagger:.08,ease:'power1.inOut'},.85);
    else tl.fromTo($('.s2-top',stat),{fillOpacity:.15},{fillOpacity:1,duration:.5,ease:'power1.inOut'},.85);
    inView(env,tl,stat,.2);
  });
}

/* ---- V3, "Population": every square is a member. ---- */
export function mountStudioV3(){
  return mountStudioPage(env=>{
    animateStudioV3Field(env,$('.s3-hero'),$('.s3-hero .s3-field'),{intro:true});
    animateStudioV3Field(env,$('.s3-cta'),$('.s3-cta .s3-field'),{intro:false,bright:true});
    animateStudioV3Story(env);
    animateStudioDemo(env);
    animateStudioV3Proof(env);
    $$('.studio-v3 :is(.s3-hero-inner>*,.studio-partner-inner,.s3-heading,.studio-demo-copy,.studio-demo-stage,.studio-deploy li,.s3-outcome,.s3-proof-copy,.s3-audience,.s3-cta-inner,.s3-frame)').forEach(element=>reveal(env,element));
  });
}

/** The population field: a band of light crossing it, members lighting up. */
function animateStudioV3Field(env,section,canvas,{intro,bright=false}){
  if(!section||!canvas)return;
  const field=createPopulation(canvas,bright?{base:.17,spark:1}:{});
  const state={time:0,reveal:env.reduce||!intro?1:0};
  const draw=()=>field.render(state);
  env.resize(canvas,()=>{field.resize();draw();});
  draw();
  if(env.reduce)return;
  if(intro)gsap.to(state,{reveal:1,duration:1.8,delay:.15,ease:'power1.out',onUpdate:draw});
  const loop=gsap.to(state,{time:'+=100000',duration:100000,ease:'none',repeat:-1,paused:true,onUpdate:draw});
  inView(env,loop,section,0);
}

/** The pinned story: five states of the same members, scrubbed by scroll.
 *  Phones and reduced motion get five still frames instead. */
function animateStudioV3Story(env){
  const section=$('.s3-story');if(!section)return;
  const frames=$$('.s3-frame',section).map(frame=>({frame,stage:$('.s3-frame-stage',frame),story:null}));
  const drawFrames=()=>frames.forEach(f=>{if(!f.stage.offsetWidth)return;f.story=f.story||createStory($('canvas',f.stage));f.story.resize();f.story.render(Number(f.frame.dataset.step));});
  drawFrames();frames.forEach(f=>env.resize(f.stage,drawFrames));
  if(!env.desktop||env.reduce)return;
  const pin=$('.s3-story-pin',section),stage=$('.s3-stage',pin),story=createStory($('canvas',stage));
  const captions=$$('.s3-caption',pin),dots=$$('.s3-steps li',pin),labels=$$('.s3-route-labels span',pin);
  let progress=0,shown=-1;
  const place=()=>story.columns().forEach((column,i)=>{labels[i].style.left=`${column.x}px`;labels[i].style.top=`${column.labelY}px`;});
  const render=()=>{
    story.render(progress);
    const routes=Math.min(1,Math.max(0,(progress-2.45)/.5));
    labels.forEach(label=>{label.style.opacity=routes;});
    const step=Math.round(progress);
    if(step!==shown){shown=step;captions.forEach((caption,i)=>caption.classList.toggle('is-on',i===step));dots.forEach((dot,i)=>dot.classList.toggle('is-on',i<=step));}
  };
  story.resize();place();render();
  ScrollTrigger.create({scroller:env.stage,trigger:pin,pin:true,start:'top top',end:()=>`+=${innerHeight*(captions.length-1)}`,scrub:true,invalidateOnRefresh:true,
    onUpdate:self=>{progress=self.progress*(captions.length-1);render();}});
  env.resize(stage,()=>{story.resize();place();render();});
  env.cleanups.push(()=>{captions.forEach((caption,i)=>caption.classList.toggle('is-on',i===0));dots.forEach((dot,i)=>dot.classList.toggle('is-on',i===0));labels.forEach(label=>{label.style.opacity='';});});
}

/** A hundred squares per result: forty set aside, or the top ten lit. */
function animateStudioV3Proof(env){
  if(env.reduce)return;
  $$('.s3-stat').forEach(stat=>{
    const tl=gsap.timeline({paused:true});
    tl.fromTo($$('.s3-sq',stat),{opacity:0},{opacity:1,duration:.25,stagger:{each:.007,grid:[10,10],from:'start'}},0);
    if(stat.dataset.stat==='0')tl.fromTo($$('.is-avoided',stat),{fillOpacity:1},{fillOpacity:0,duration:.6,stagger:{each:.012,from:'end'},ease:'power1.inOut'},1.05);
    else tl.fromTo($$('.is-top',stat),{fillOpacity:.14},{fillOpacity:1,duration:.5,stagger:.05,ease:'power1.inOut'},1.05);
    inView(env,tl,stat,.2);
  });
}

/* ---- V4, "Living system": squares as data, decisions and brands in motion,
   in the brand's full colour. ---- */
export function mountStudioV4(){
  return mountStudioPage(env=>{
    animateStudioV4Flow(env);
    animateStudioDemo(env,{brandDelay:.25});
    animateStudioV4Repaint(env);
    animateStudioV4Outcomes(env);
    animateStudioWave(env,$('.studio-cta'),$('.studio-cta .studio-wave'),$('.studio-cta-title span'),{intro:false,pointer:false});
    animateStudioReveals(env);
    $$('.studio-v4 :is(.s4-hero-copy>*,.s4-tabs,.s4-panel)').forEach(element=>reveal(env,element));
  },{ribbon:true});
}

/** Insights in, care out: six coloured lanes into Counsel's nine squares and
 *  white care actions out to the right. Runs while visible; one still frame
 *  for reduced motion. */
function animateStudioV4Flow(env){
  const host=$('.s4-flow');if(!host)return;
  const C=STUDIO_COLORS,flow=createFlow($('canvas',host),{colors:[C.blue,C.lime,C.green,C.yellow,C.sky,C.pink],ink:C.ink});
  const ins=$$('.s4-flow-labels .is-in',host),outs=$$('.s4-flow-labels .is-out',host),node=$('.s4-flow-labels .is-ai',host);
  const state={time:0};
  // Labels sit on the outside of each lane's bend, so squares never cross them.
  const place=()=>{
    const {ins:inY,outs:outY,cy,g}=flow.labels();
    ins.forEach((label,i)=>{label.style.top=`${inY[i]}px`;label.classList.toggle('is-below',inY[i]>cy);});
    outs.forEach((label,i)=>{label.style.top=`${outY[i]}px`;label.classList.toggle('is-below',outY[i]>cy);});
    node.style.top=`${cy+g*1.31+14}px`;
  };
  const draw=()=>flow.render({time:state.time,still:env.reduce});
  place();draw();
  env.resize(host,()=>{flow.resize();place();draw();});
  if(env.reduce)return;
  gsap.fromTo(host,{opacity:0},{opacity:1,duration:1.4,delay:.35,ease:'counsel-ease',clearProps:'opacity'});
  const loop=gsap.to(state,{time:'+=100000',duration:100000,ease:'none',repeat:-1,paused:true,onUpdate:draw});
  inView(env,loop,host,0);
}

/** A sweep of squares in the incoming brand's colour crosses the app while
 *  its theme changes underneath (animateStudioDemo delays the theme to match). */
function animateStudioV4Repaint(env){
  const canvas=$('.s4-repaint');if(!canvas||env.reduce)return;
  const paint=createRepaint(canvas),state={progress:0,color:''};
  const draw=()=>paint.render(state.progress,state.color);
  let tween;
  env.resize(canvas,()=>{paint.resize();draw();});
  env.on(document,'studio:brand',({detail})=>{
    tween?.kill();state.color=detail.brand.accent;state.progress=0;
    tween=gsap.to(state,{progress:1,duration:.95,ease:'power1.inOut',onUpdate:draw});
  });
  env.cleanups.push(()=>{tween?.kill();state.progress=0;draw();});
}

/** Four outcomes as tabs over one field of squares. Each pick re-arranges the
 *  field; it moves on by itself every six seconds, with the tab's rule filling
 *  as a timer, until someone chooses. */
function animateStudioV4Outcomes(env){
  const section=$('.s4-outcomes');if(!section)return;
  const api=window.CounselStudio,tabs=$$('[role="tab"]',section),holder=$('.s4-field',section),labels=$('.studio-field-labels',holder);
  const current=()=>tabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true');
  const field=createField($('canvas',holder)),first=tabs[Math.max(0,current())].dataset.layout;
  const state={from:first,to:first,t:1};
  let shown=null,morph,touched=false;
  const draw=()=>{
    field.render(state.from,state.to,state.t);
    const front=state.t<.5?state.from:state.to;
    if(front!==shown){shown=front;placeFieldLabels(labels,field.layout(front)?.labels||[]);}
    labels.style.opacity=front==='held'?0:Math.abs(state.t-.5)*2;
  };
  draw();
  env.resize(holder,()=>{field.resize();if(state.from==='held')state.from=state.to;shown=null;draw();});
  env.on(section,'studio:outcome',({detail})=>{
    if(detail.user)stopAuto();
    morph?.kill();
    state.from=state.t<1?field.hold():state.to;state.to=detail.layout;state.t=0;
    if(env.reduce){state.t=1;draw();return;}
    morph=gsap.to(state,{t:1,duration:1.4,ease:'none',onUpdate:draw});
  });
  const timer={value:0};
  const fill=()=>{const index=current();tabs.forEach((tab,i)=>tab.style.setProperty('--fill',i===index?timer.value:0));};
  const auto=env.reduce?null:gsap.to(timer,{value:1,duration:6,ease:'none',repeat:-1,paused:true,onUpdate:fill,onRepeat:()=>api.setOutcome((current()+1)%tabs.length)});
  function stopAuto(){if(touched)return;touched=true;auto?.kill();tabs.forEach(tab=>tab.style.removeProperty('--fill'));}
  if(auto)inView(env,auto,section,.25,()=>!touched);
  env.cleanups.push(()=>{auto?.kill();morph?.kill();tabs.forEach(tab=>tab.style.removeProperty('--fill'));labels.style.opacity='';});
}

/* ================ Counsel Studio round two (Hunter, 2026-10-09) ================
   V5 to V9: five takes on the first few sections. Each page has one quiet
   moment that plays once; nothing pins and nothing autoplays (Hunter: no
   scroll jacking, restrained motion). Everything else is V1's gentle reveal. */
function mountStudioRound(moment){
  return mountStudioPage(env=>{
    moment(env);
    $$('.studio-r2 :is(.r2-copy>*,.studio-partner-inner,.r2-light .studio-section .channel-wrap>*,.r2-cta-inner)').forEach(element=>reveal(env,element));
  },{ribbon:true});
}

/* ---- V5, "One row" ---- */
export function mountStudioV5(){return mountStudioRound(animateStudioV5Row);}

/** The week fills in, then today's top square carries the reading down into
 *  Counsel's row as the row arrives. Once; reduced motion shows it settled. */
function animateStudioV5Row(env){
  const phone=$('.r5-phone');if(!phone||env.reduce)return;
  const columns=$$('.r5-col',phone),slot=$('.r5-slot',phone),row=$('.r5-action',slot);
  const today=$('i:last-child',columns.at(-1)),target=$$('.r5-mark i',row)[4];
  const traveller=document.createElement('i');traveller.className='r5-traveller';traveller.setAttribute('aria-hidden','true');
  gsap.set(slot,{height:0,overflow:'hidden'});gsap.set(row,{opacity:0,y:8});
  const tl=gsap.timeline({paused:true,defaults:{ease:'counsel-settle'}});
  tl.fromTo(phone,{opacity:0,y:24},{opacity:1,y:0,duration:.9},0);
  columns.forEach((column,i)=>tl.fromTo($$('i',column),{opacity:0,scale:.3},{opacity:1,scale:1,duration:.3,stagger:.03},.35+i*.08));
  tl.to(slot,{height:()=>row.offsetHeight,duration:.55,ease:'power2.inOut'},'>-.05')
    .call(()=>{
      phone.append(traveller);
      const box=phone.getBoundingClientRect(),from=today.getBoundingClientRect(),to=target.getBoundingClientRect();
      gsap.set(traveller,{x:from.left-box.left,y:from.top-box.top});
      // Down out of the chart first, then across into the mark: a curve, not a diagonal over the bars.
      gsap.to(traveller,{x:to.left-box.left,duration:.75,ease:'power2.in'});
      gsap.to(traveller,{y:to.top-box.top,width:to.width,height:to.height,backgroundColor:window.CounselColors.green2,duration:.75,ease:'power2.out',onComplete:()=>traveller.remove()});
    })
    .to(row,{opacity:1,y:0,duration:.5},'+=.45')
    .set(slot,{clearProps:'height,overflow'});
  inView(env,tl,phone,.1);
  env.cleanups.push(()=>{traveller.remove();gsap.set([phone,slot,row,...$$('.r5-col i',phone)],{clearProps:'all'});});
}

/* ---- V6, "Nine apps" ---- */
export function mountStudioV6(){return mountStudioRound(env=>{animateStudioV6Apps(env);animateStudioDemo(env,{autoplay:false});});}

/** Nine apps arrive, then each gains its square of care in reading order,
 *  until the nine squares make Counsel's mark. Once. */
function animateStudioV6Apps(env){
  const grid=$('.r6-grid');if(!grid||env.reduce)return;
  const apps=$$('.r6-app',grid),care=$$('.r6-care',grid);
  gsap.set(care,{scale:0});
  const tl=gsap.timeline({paused:true});
  tl.fromTo(apps,{opacity:0,y:14},{opacity:1,y:0,duration:.7,stagger:.05,ease:'counsel-settle'},0)
    .to(care,{scale:1,duration:.42,stagger:.11,ease:'back.out(1.7)'},.75);
  inView(env,tl,grid,.1);
  env.cleanups.push(()=>gsap.set([...apps,...care],{clearProps:'all'}));
}

/* ---- V7, "In your brand" ---- */
export function mountStudioV7(){return mountStudioRound(animateStudioV7Brand);}

/** The hero takes the picked brand's colours: background, highlighted words,
 *  button and app. Only when someone picks; nothing plays on its own. */
function animateStudioV7Brand(env){
  const hero=$('.studio-v7 .studio-hero');if(!hero)return;
  env.on(document,'studio:palette',({detail})=>{
    gsap.to(hero,{'--brand':detail.palette.accent,'--brand-soft':detail.palette.soft,duration:env.reduce?0:.6,ease:'counsel-ease',overwrite:true});
  });
}

/* ---- V8, "Two layers" ---- */
export function mountStudioV8(){return mountStudioRound(animateStudioV8Layers);}

/** The brand layer lifts off Counsel's care once, then the labels arrive. */
function animateStudioV8Layers(env){
  const stage=$('.r8-stage');if(!stage||env.reduce)return;
  const stack=$('.r8-stack',stage),labels=$$('.r8-label',stage),lift=getComputedStyle(stack).getPropertyValue('--lift').trim()||'96px';
  const tl=gsap.timeline({paused:true});
  tl.fromTo(stack,{opacity:0,y:30},{opacity:1,y:0,duration:.9,ease:'counsel-settle'},0)
    .fromTo(stack,{'--lift':'0px'},{'--lift':lift,duration:1.2,ease:'counsel-settle'},.5)
    .fromTo(labels,{opacity:0,y:8},{opacity:1,y:0,duration:.6,stagger:.15,ease:'counsel-ease'},1.2);
  inView(env,tl,stage,.1);
  env.cleanups.push(()=>gsap.set([stack,...labels],{clearProps:'all'}));
}

/* ---- V9, "The thread" ---- */
// Counsel's thread in the hero's greens: long light runs and shorter mid
// ones, with knots alternating light and dark so each still reads.
const MONO_THREAD={
  runs:[['var(--green-2)',1.2],['var(--green-4)',.42],['var(--green-1)',.42],['var(--green-3)',.42],['var(--green-5)',.42],['var(--green-2)',1.8]],
  stitches:['var(--green-1)','var(--green-6)','var(--green-1)','var(--green-6)','var(--green-1)'],
};
export function mountStudioV9(){return mountStudioRound(animateStudioV9Thread);}

/** The thread draws in from the left; where it reaches the app, the app opens
 *  out of the line; then the thread carries on out the other side and flows
 *  as it does on the homepage. Once. */
function animateStudioV9Thread(env){
  const hero=$('.studio-v9 .studio-hero');if(!hero)return;
  const svg=$('.r9-thread',hero),path=$('defs path',svg),phone=$('.r9-stage .sp-phone',hero);
  const box=element=>{const a=element.getBoundingClientRect(),b=hero.getBoundingClientRect();return{x:a.left-b.left,y:a.top-b.top,w:a.width,h:a.height};};
  let paint=()=>{},mask=null,at=.5;
  const measure=()=>{
    const w=hero.clientWidth,h=hero.clientHeight,p=box(phone),cx=p.x+p.w*.5,cy=p.y+p.h*.5;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    // In low on the left, under the copy; through the app's middle; out high on the right.
    path.setAttribute('d',w<=900
      ?`M -60 ${cy-p.h*.18} C ${cx*.45} ${cy-p.h*.2} ${p.x-30} ${cy} ${cx} ${cy} S ${w*.86} ${cy+p.h*.24} ${w+60} ${cy+p.h*.2}`
      :`M -60 ${h*.88} C ${w*.24} ${h*.9} ${p.x-p.w*.7} ${cy+30} ${cx} ${cy} S ${w-60} ${h*.2} ${w+60} ${h*.16}`);
    // How far along the line the app's centre sits, for the opening.
    const length=path.getTotalLength();let lo=0,hi=length;
    for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(path.getPointAtLength(mid).x<cx)lo=mid;else hi=mid;}
    at=(lo+hi)/2/length;
    if(mask){mask.setAttribute('width',w+200);mask.setAttribute('height',h+200);}
    paint();
  };
  measure();paint=weave(env,svg,hero,{varied:true,palette:MONO_THREAD});
  [hero,phone].forEach(element=>env.resize(element,measure));
  if(env.reduce)return;
  const group=$('[data-motion-weave]',svg);
  mask=svgNode('mask',{id:'r9-thread-draw',maskUnits:'userSpaceOnUse',x:-100,y:-100,width:hero.clientWidth+200,height:hero.clientHeight+200});
  const trace=svgNode('use',{href:'#r9-thread-path',fill:'none',stroke:'white','stroke-width':24,'vector-effect':'non-scaling-stroke','stroke-dasharray':'1000 1000','stroke-dashoffset':1000});
  mask.append(trace);$('defs',svg).append(mask);group.setAttribute('mask','url(#r9-thread-draw)');
  gsap.set(phone,{clipPath:'inset(50% 0% 50% 0% round 44px)'});
  const tl=gsap.timeline({paused:true,onComplete:()=>group.removeAttribute('mask')});
  tl.to(trace,{attr:{'stroke-dashoffset':()=>1000*(1-at)},duration:1.1,ease:'power2.in'},.3)
    .to(phone,{clipPath:'inset(0% 0% 0% 0% round 44px)',duration:.9,ease:'counsel-settle',clearProps:'clipPath'},'>-.05')
    .to(trace,{attr:{'stroke-dashoffset':0},duration:1,ease:'power2.out'},'<');
  inView(env,tl,hero,0);
  env.cleanups.push(()=>{mask.remove();group.removeAttribute('mask');gsap.set(phone,{clearProps:'clipPath'});});
}


/* ================ Counsel Studio round three (Hunter, 2026-10-13) ================
   V10 to V12: centred type, and "a little bit more scroll-driven". Motion is
   tied to how far you have scrolled and rides along with the page: scrubbed,
   never pinned, never snapped, so the page always scrolls like a page and
   scrolling back up unwinds it. Geometry moves (lines draw, slots open,
   faces wipe); nothing fades. Reduced motion shows every page settled. */
function mountStudioRoundThree(moment){
  return mountStudioPage(env=>{
    moment(env);
    $$('.studio-r3 [data-r3-rise]').forEach(element=>rise(env,element));
    animateR3Outcomes(env);
  },{ribbon:true});
}

/** A block rises a little as it scrolls in, home by the time it is two fifths
 *  of the way up the screen. */
function rise(env,element,distance=36){
  if(env.reduce)return;
  gsap.fromTo(element,{y:distance},{y:0,ease:'none',scrollTrigger:{scroller:env.stage,trigger:element,start:'top bottom',end:'top 62%',scrub:true}});
}

/** The outcomes' rules grow out of their centre square as the grid scrolls in;
 *  on phones each outcome's rule draws as it passes. */
function animateR3Outcomes(env){
  const grid=$('.studio-r3 .r3-grid');if(!grid||env.reduce)return;
  const lines=$$('.r3-line',grid).filter(line=>getComputedStyle(line).display!=='none');
  const axis=line=>line.classList.contains('is-r')?'scaleY':'scaleX';
  if(env.desktop){
    const knot=$('.r3-knot',grid);
    const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{scroller:env.stage,trigger:grid,start:'top 80%',end:'center 45%',scrub:true}});
    if(knot)tl.fromTo(knot,{scale:0},{scale:1,duration:.2},0);
    lines.forEach(line=>tl.fromTo(line,{[axis(line)]:0},{[axis(line)]:1,duration:.8},.2));
  }else lines.forEach(line=>gsap.fromTo(line,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{scroller:env.stage,trigger:line,start:'top 92%',end:'top 62%',scrub:true}}));
}

/* ---- V10, "Rise" ---- */
export function mountStudioV10(){return mountStudioRoundThree(env=>{animateStudioV10Rise(env);animateStudioV10Quote(env);animateStudioV10Brands(env);});}

/** The app lags the page a little while its story plays at the pace you
 *  scroll: Counsel's row, then the answer word by word, then a doctor. */
function animateStudioV10Rise(env){
  const stage=$('.studio-v10 .r10-stage'),phone=$('.r10-phone',stage);if(!phone||env.reduce)return;
  document.body.classList.add('is-moving');
  const lag=()=>parseFloat(getComputedStyle(stage).getPropertyValue('--r10-lag'))||0;
  const slots=$$('.r10-slot',phone),pieces=slots.map(slot=>slot.firstElementChild.firstElementChild),words=$$('.r10-ai p i',phone);
  gsap.set(slots,{height:0});gsap.set(words,{visibility:'hidden'});
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{scroller:env.stage,trigger:stage,start:'clamp(top 80%)',end:'bottom 70%',scrub:true,invalidateOnRefresh:true}});
  tl.fromTo(phone,{y:0},{y:lag,duration:1},0);
  const open=(i,at,length)=>{
    tl.fromTo(slots[i],{height:0},{height:()=>slots[i].firstElementChild.offsetHeight,duration:length,ease:'power1.inOut'},at)
      .fromTo(pieces[i],{y:16,clipPath:'inset(0% 0% 100% 0%)'},{y:0,clipPath:'inset(0% 0% 0% 0%)',duration:length,ease:'power2.out'},at);
  };
  open(0,.08,.14);
  open(1,.3,.08);
  words.forEach((word,i)=>tl.set(word,{visibility:'visible'},.4+i*(.26/words.length)));
  open(2,.72,.14);
  env.cleanups.push(()=>{document.body.classList.remove('is-moving');gsap.set([phone,...slots,...pieces,...words],{clearProps:'all'});});
}

/** The Oura quote inks in word by word as you read down it. */
function animateStudioV10Quote(env){
  const quote=$('.studio-v10 .r10-partner .r3-quote');if(!quote||env.reduce)return;
  const words=$$('i',quote),ink=getComputedStyle(quote).color,faint=ink.replace('rgb(','rgba(').replace(')',', .2)');
  gsap.fromTo(words,{color:faint},{color:ink,ease:'none',duration:.3,stagger:1/words.length,
    scrollTrigger:{scroller:env.stage,trigger:quote,start:'top 80%',end:'bottom 48%',scrub:true}});
}

/** Each partner card is repainted from Counsel's greens into its brand as
 *  the row scrolls past: a crisp wipe, top to bottom, one card after another. */
function animateStudioV10Brands(env){
  const faces=$$('.studio-v10 .r10-face.is-brand');if(!faces.length||env.reduce)return;
  const shut={clipPath:'inset(0% 0% 100% 0%)'},open={clipPath:'inset(0% 0% 0% 0%)',ease:'none'};
  if(env.desktop){
    const tl=gsap.timeline({scrollTrigger:{scroller:env.stage,trigger:$('.studio-v10 .r10-cards'),start:'top 78%',end:'bottom 40%',scrub:true}});
    faces.forEach((face,i)=>tl.fromTo(face,shut,{...open,duration:1},i*.75));
  }else faces.forEach(face=>gsap.fromTo(face,shut,{...open,scrollTrigger:{scroller:env.stage,trigger:face,start:'top 75%',end:'bottom 55%',scrub:true}}));
}

/* ---- V11, "The thread" ---- */
export function mountStudioV11(){return mountStudioRoundThree(env=>{animateStudioV11Thread(env);animateStudioDemo(env,{autoplay:false});});}

/** One thread down the page's centre line, drawn to a little ahead of where
 *  you are reading. The hero's sweep draws once on arrival; after that the
 *  thread's length follows the scroll. The app opens out of the line as the
 *  thread reaches it, each knot closes as it passes, and the thread ends at
 *  the closing button. Reduced motion: drawn, open and closed. */
function animateStudioV11Thread(env){
  const page=$('.studio-v11 .page'),svg=page&&$('.r11-thread',page);if(!svg)return;
  const path=$('.r11-path',svg),ink=$('#r11-ink',svg),copy=$('.studio-hero .r3-copy',page);
  const app=$('.r11-app .sp-phone',page),knots=$$('.r11-knot',page),end=$('.r11-end .channel-btn',page);
  const light=$('.r2-light',page),cta=$('.r2-cta',page),C=window.CounselColors;
  const top=element=>element.getBoundingClientRect().top-page.getBoundingClientRect().top;
  const state={intro:env.reduce?1:0};
  let samples=[],length=0,introLength=0,knotY=[],appY=0;
  const lengthAt=y=>{
    if(!samples.length||y<=samples[0][1])return 0;
    let lo=0,hi=samples.length-1;
    if(y>=samples[hi][1])return length;
    while(hi-lo>1){const mid=(lo+hi)>>1;if(samples[mid][1]<y)lo=mid;else hi=mid;}
    const [s0,y0]=samples[lo],[s1,y1]=samples[hi];
    return s0+(s1-s0)*(y-y0)/Math.max(1e-6,y1-y0);
  };
  const draw=()=>{
    if(!length)return;
    const drawn=env.reduce?length:Math.max(introLength*state.intro,lengthAt(env.stage.scrollTop+innerHeight*.72));
    path.style.strokeDashoffset=String(length-drawn);
    const tip=drawn>=length-.5?Infinity:path.getPointAtLength(drawn).y;
    knots.forEach((knot,i)=>knot.classList.toggle('is-on',tip>=knotY[i]));
    if(app){const p=Math.min(1,Math.max(0,(tip-appY)/(app.offsetHeight*.5)));app.style.clipPath=p>=1?'':`inset(0% ${50*(1-p)}% 0% ${50*(1-p)}% round 44px)`;}
  };
  const measure=()=>{
    const w=page.clientWidth,h=page.offsetHeight,cx=Math.round(w/2);
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('preserveAspectRatio','none');
    const a=top(copy)+copy.offsetHeight+Math.min(90,innerHeight*.09),r=Math.min(220,cx*.62),stop=top(end);
    path.setAttribute('d',`M -40 ${a} C ${cx*.55} ${a} ${cx} ${a+r*.3} ${cx} ${a+r} L ${cx} ${stop}`);
    // The light green on the dark bands, a deeper green on the light one: hard switches at each band edge.
    const lt=top(light),ct=top(cta);
    ink.setAttribute('y2',h);
    ink.innerHTML=[[0,C.green3],[lt,C.green3],[lt,C.green5],[ct,C.green5],[ct,C.green3],[h,C.green3]].map(([y,colour])=>`<stop offset="${(y/h).toFixed(5)}" stop-color="${colour}"/>`).join('');
    length=path.getTotalLength();
    samples=[];for(let s=0;s<length;s+=6)samples.push([s,path.getPointAtLength(s).y]);samples.push([length,stop]);
    introLength=lengthAt(a+r);
    knotY=knots.map(knot=>top(knot)+knot.offsetHeight/2);
    if(app)appY=top(app.parentElement)+parseFloat(getComputedStyle(app.parentElement).paddingTop||0);
    path.style.strokeDasharray=`${length} ${length}`;
    draw();
  };
  measure();
  env.resize(page,measure);
  ScrollTrigger.create({scroller:env.stage,start:0,end:'max',onUpdate:draw,onRefresh:measure});
  if(!env.reduce)gsap.to(state,{intro:1,duration:1.6,delay:.35,ease:'power2.inOut',onUpdate:draw});
  env.cleanups.push(()=>{path.style.strokeDasharray='';path.style.strokeDashoffset='';knots.forEach(knot=>knot.classList.remove('is-on'));if(app)app.style.clipPath='';});
}

/* ---- V12, "Anatomy" ---- */
export function mountStudioV12(){return mountStudioRoundThree(env=>{animateStudioV12Labels(env);animateStudioV12Points(env);});}

/** Each part of the app is labelled as it scrolls past: a square on the part,
 *  a hairline out to a tick, then the words. The labels are placed from the
 *  parts' real positions; phones number the parts and key them below. */
function animateStudioV12Labels(env){
  const stage=$('.studio-v12 .r12-stage');if(!stage)return;
  const phone=$('.r12-phone',stage),calls=$$('.r12-call',stage);
  const partOf=call=>$(`[data-part="${call.dataset.call}"]`,phone);
  const place=()=>{
    if(!env.desktop)return;
    const s=stage.getBoundingClientRect(),p=phone.getBoundingClientRect();
    const room=Math.min(380,p.left-s.left),label=Math.max(150,Math.min(260,room-110));
    calls.forEach(call=>{
      const part=partOf(call).getBoundingClientRect();
      call.style.top=`${part.top+part.height/2-s.top}px`;call.style.setProperty('--label',`${label}px`);
      if(call.classList.contains('is-left')){const x0=p.left-s.left-room;call.style.left=`${x0}px`;call.style.width=`${part.left-s.left+3.5-x0}px`;}
      else{const x0=part.right-s.left-3.5;call.style.left=`${x0}px`;call.style.width=`${p.right-s.left+room-x0}px`;}
    });
  };
  place();env.resize(stage,place);
  env.cleanups.push(()=>calls.forEach(call=>{call.style.top=call.style.left=call.style.width='';}));
  if(env.reduce)return;
  if(env.desktop){
    calls.forEach(call=>{
      const left=call.classList.contains('is-left');
      const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{scroller:env.stage,trigger:partOf(call),start:'clamp(center 84%)',end:'center 56%',scrub:true}});
      tl.fromTo($('.r12-dot',call),{scale:0},{scale:1,duration:.12},0)
        .fromTo($('.r12-wire',call),{scaleX:0},{scaleX:1,duration:.5,ease:'power1.out'},.08)
        .fromTo($('.r12-label',call),{clipPath:left?'inset(0% 0% 0% 100%)':'inset(0% 100% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.42},.55);
    });
  }else{
    $$('.r12-badge',phone).forEach(badge=>gsap.fromTo(badge,{scale:0},{scale:1,ease:'none',scrollTrigger:{scroller:env.stage,trigger:badge.parentElement,start:'clamp(center 88%)',end:'center 70%',scrub:true}}));
    $$('.r12-key li',stage).forEach(item=>rise(env,item,18));
  }
}

/** The deployment figures draw their lines, then set their squares, as each
 *  one scrolls in. */
function animateStudioV12Points(env){
  if(env.reduce)return;
  $$('.studio-v12 .r12-points svg').forEach(svg=>{
    const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{scroller:env.stage,trigger:svg,start:'top 88%',end:'top 52%',scrub:true}});
    tl.fromTo($$('.r7-line',svg),{strokeDasharray:'1 1',strokeDashoffset:1},{strokeDashoffset:0,duration:.7},0)
      .fromTo($$('.r7-sq',svg),{scale:0,transformOrigin:'50% 50%'},{scale:1,duration:.12,stagger:.05},.55);
  });
}
