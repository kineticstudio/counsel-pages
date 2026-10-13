/**
 * Condition template V3 (Hunter, 2026-10-06): content comes from Counsel's
 * live condition pages, not the Studio wireframe. One renderer, one program
 * file per condition. Motion stays in channel-v5-src/animations.js.
 */
import weightManagement from './programs/weight-management.js';
import acne from './programs/acne.js';
import antiAging from './programs/anti-aging.js';
import birthControl from './programs/birth-control.js';
import hairLoss from './programs/hair-loss.js';
import {herpes,coldSores,genitalHerpes} from './programs/herpes.js';
import {closingMarkup} from '../channel-v5-src/closing-card.js';
import {mountDecorativeWeaves} from '../channel-v5-src/animations.js';
import {mountCareExperience} from '../channel-v5-src/care-experience.js';
import {carePhoneMarkup} from '../ui-src/counsel-care-phone.js';
import {careChevron} from '../channel-v2-src/care-accordion.js';
import {lucide} from '../ui-src/counsel-icons.js';

const PROGRAMS={'weight-management':weightManagement,acne,'anti-aging':antiAging,'birth-control':birthControl,'hair-loss':hairLoss,herpes,'cold-sores':coldSores,'genital-herpes':genitalHerpes};
// Hunter, Oct 6 (after the Counsel call): every live condition gets a page,
// and every page uses Weight Management V3's sections in its order.
const program=PROGRAMS[document.body.dataset.condition]||weightManagement;
document.body.dataset.theme=program.theme;
// The counsel-pages repo for the Webflow build (Toqir, Oct 8) ships each page
// with this markup already written in, so the page only mounts. ?render-only
// is how that repo's sync captures the markup: render, then stop.
const PRERENDERED=document.body.hasAttribute('data-prerendered');
const RENDER_ONLY=new URLSearchParams(location.search).has('render-only');

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Lucide only (Hunter, Oct 6). Keys are this page's roles, values Lucide names.
const ICONS={stethoscope:'stethoscope',question:'message-circle-question-mark',coins:'hand-coins',chat:'message-circle',sparkle:'sparkles',history:'contact-round',heart:'heart',check:'check',pharmacy:'store',shield:'shield-check',wallet:'wallet',arrow:'arrow-right',send:'arrow-up',rx:'pill',next:'chevron-right'};
const icon=name=>lucide(ICONS[name]||name);
const check=icon('check');
const thinking=`<span class="ci-thinking" aria-hidden="true">${'<i></i>'.repeat(9)}</span>`;
const ctaList=section=>section.ctas||(section.cta?[section.cta]:[]);
const buttons=(list,{light=false}={})=>list.map(cta=>cta.secondary?`<a class="cv3-btn-ghost${light?' is-light':''}" href="${esc(cta.href)}">${esc(cta.label)}</a>`:`<a class="channel-btn${light?' light':''}" href="${esc(cta.href)}">${esc(cta.label)}</a>`).join('');
const lines=heading=>(Array.isArray(heading)?heading:[heading]).map(line=>`<span>${esc(line)}</span>`).join(' ');

/* Hero (Hunter, Oct 6): live copy and a lifestyle portrait, no UI. The ribbon
   enters on the left behind the person and leaves through the bottom of the
   section; its path and motion are in animations.js. */
const hero=program.hero,portrait=hero.figure.kind==='cutout'?hero.figure:null;
const threadUses='<use href="#cv3-thread-path" stroke="var(--green-3)"/><use href="#cv3-thread-path" stroke="var(--pink)" stroke-dasharray="230 770"/><use href="#cv3-thread-path" stroke="var(--yellow)" stroke-dasharray="180 820"/>';
const heroMarkup=`
  <div class="channel-wrap condition-hero-layout">
    <div class="condition-hero-copy"><h1>${lines(hero.heading)}</h1>${hero.body?`<p>${esc(hero.body)}</p>`:''}<ul class="cv3-points cv3-points-${hero.pointsLayout}">${hero.points.map(point=>`<li>${icon(point.icon)}<span>${esc(point.text)}</span></li>`).join('')}</ul><div class="condition-actions">${buttons(hero.ctas)}</div></div>
    <figure class="cv3-hero-figure${portrait?.flip?' is-flipped':''}">${portrait?`<img class="cv3-hero-person" src="${esc(portrait.src)}" alt="${esc(portrait.alt)}" width="1254" height="1254" fetchpriority="high">`:''}</figure>
  </div>
  <svg class="condition-thread cv3-thread-back" viewBox="0 0 1440 840" preserveAspectRatio="none" aria-hidden="true"><defs><path id="cv3-thread-path" pathLength="1000" d="M-80 300C80 320 140 170 350 190S710 235 1030-80"/></defs>${threadUses}</svg>`;

/* How it works: the Health Plans V5 phone walkthrough with live steps. */
function screen(item){
  const team=`<span class="wm-team">${[1,2,3].map(n=>`<img src="/brand/photography/doctors/counsel-doctor-0${n}.webp" alt="">`).join('')}</span>`;
  const asked=item.question?`<p class="ci-message">${esc(item.question)}</p>`:'';
  if(item.kind==='question')return `<div class="ci-static-screen ci-static-question"><span class="ci-static-date">Today</span><div class="ci-floating-card"><p>${esc(item.text)}</p></div></div>`;
  if(item.kind==='ai')return `<div class="ci-static-screen ci-static-guidance"><span class="ci-static-date">Today</span>${asked}<div class="ci-floating-card"><div class="ci-ai-heading">${thinking}<span class="ci-static-eyebrow">${esc(item.from||'Counsel AI')}</span></div><p>${esc(item.reply)}</p></div></div>`;
  if(item.kind==='doctor'||item.kind==='options')return `<div class="ci-static-screen ci-static-doctor"><span class="ci-static-date">Your care team</span>${asked}<div class="ci-floating-card">${team}<h3>${esc(item.title)}</h3><p>${esc(item.body)}</p>${item.options?`<div class="wm-followup-options">${item.options.map(option=>`<span>${esc(option)}</span>`).join('')}</div>`:''}</div></div>`;
  if(item.kind==='checkin')return `<div class="ci-static-screen ci-static-history"><span class="ci-static-date">Your care plan</span><p class="ci-static-greeting">Let’s check in.</p><div class="ci-floating-card"><div class="ci-prescription-meta"><span>${esc(program.name)}</span><span class="ci-prescription-status">Follow-up</span></div><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p><div class="wm-followup-options">${item.options.map(option=>`<span>${esc(option)}</span>`).join('')}</div></div></div>`;
  if(item.kind==='plan')return planScreen(item);
  // Sam at Counsel, Oct 13: the pharmacy line is about refills, not pickup.
  return `<div class="ci-static-screen ci-static-history"><span class="ci-static-date">Your care plan</span><p class="ci-static-greeting">Your next step.</p><div class="ci-floating-card"><div class="ci-prescription-meta"><span class="ci-prescription-label">${icon('rx')} Prescription</span><span class="ci-prescription-status">Sent to pharmacy</span></div><div class="ci-prescription-medication"><h3>${esc(item.name)}</h3><p>${esc(item.detail)}</p></div><div class="ci-prescription-pharmacy">${icon('pharmacy')}<div><strong>Your preferred pharmacy</strong><p>We’ll check in when it’s time for a refill.</p></div></div></div></div>`;
}

/* Treatment plan (Sam at Counsel, Oct 13): imagery from Counsel's own plans,
   a weight line falling toward a dashed goal, then one medication. It is the
   prescription card's furniture with a chart in the middle. The chart is drawn
   in the card's own pixels: the phone is a fixed 395px frame, so the card's
   inner width is always 371px and the SVG renders 1:1 before the phone scales. */
function weightChart({weights,goal,unit}){
  const width=371,top=6,bottom=94,left=30,right=width-48,labelY=116;
  const values=[...weights.map(([,value])=>value),goal];
  const high=Math.ceil(Math.max(...values)/20)*20,low=Math.floor(Math.min(...values)/20)*20;
  const y=value=>top+(high-value)/(high-low)*(bottom-top);
  const x=i=>left+8+i*(right-left-8)/(weights.length-1);
  const ticks=[];for(let value=high;value>=low;value-=20)ticks.push(value);
  const grid=ticks.filter(value=>value!==goal).map(value=>`<line class="cv3-plan-grid" x1="${left}" x2="${width}" y1="${y(value)}" y2="${y(value)}"/>`).join('');
  const axis=ticks.map(value=>`<text x="0" y="${y(value)+3.5}">${value}</text>`).join('');
  const months=weights.map(([month],i)=>`<text x="${x(i)}" y="${labelY}" text-anchor="middle">${esc(month)}</text>`).join('');
  const line=weights.map(([,value],i)=>`${x(i)},${y(value)}`).join(' ');
  const points=weights.map(([,value],i)=>{const latest=i===weights.length-1,size=latest?8:5;return `<rect class="cv3-plan-point${latest?' is-latest':''}" x="${x(i)-size/2}" y="${y(value)-size/2}" width="${size}" height="${size}"/>`;}).join('');
  const [firstMonth,first]=weights[0],[lastMonth,last]=weights.at(-1);
  const label=`Illustrative weight: ${first} ${unit} in ${firstMonth}, ${last} ${unit} in ${lastMonth}. Goal ${goal} ${unit}.`;
  return `<svg class="cv3-plan-chart" viewBox="0 0 ${width} ${labelY+4}" role="img" aria-label="${esc(label)}">${grid}<line class="cv3-plan-goal" x1="${left}" x2="${width}" y1="${y(goal)}" y2="${y(goal)}"/><text class="is-goal" x="${width}" y="${y(goal)-7}" text-anchor="end">Goal</text>${axis}${months}<polyline class="cv3-plan-line" points="${line}"/>${points}</svg>`;
}
const planScreen=item=>`<div class="ci-static-screen ci-static-history ci-static-plan"><span class="ci-static-date">Your care plan</span><p class="ci-static-greeting">${esc(item.greeting)}</p><div class="ci-floating-card"><div class="ci-prescription-meta"><span class="ci-prescription-label">${esc(item.label)}</span><span class="ci-prescription-status">${esc(item.status)}</span></div>${weightChart(item)}<div class="ci-prescription-pharmacy">${icon('rx')}<div><strong>${esc(item.medication.name)}</strong><p>${esc(item.medication.detail)}</p></div></div></div></div>`;
const stepRows=program.steps.items.map((step,i)=>`<div class="ci-item"><button type="button" class="ci-tab" id="care-tab-${i}" aria-expanded="false" aria-controls="care-answer-${i} care-panel-${i}"><span class="ci-tab-heading"><span class="ci-tab-label"><span class="cv3-step-number">Step ${i+1}</span>${esc(step.title)}</span><span class="ci-chevron">${careChevron}</span></span></button><div class="ci-rule" aria-hidden="true"><span class="ci-weave"></span></div><div class="ci-answer" id="care-answer-${i}" aria-hidden="true" inert><div><p class="ci-tab-copy">${esc(step.body)}</p></div></div></div>`).join('');
const howMarkup=`<div class="channel-v5 wm-walkthrough cv3-how"><section class="v2-section v2-integration" aria-labelledby="program-how"><div class="channel-wrap ci-experience"><div class="ci-copy"><div class="v2-heading"><h2 id="program-how">${esc(program.steps.heading)}</h2><p class="ci-intro">${esc(program.steps.intro)}</p></div><div class="ci-tabs" role="group" aria-label="How ${esc(program.name.toLowerCase())} care works">${stepRows}</div></div><div class="ci-sky">${carePhoneMarkup(program.steps.screens.map(screen),{staticScreens:true})}</div></div></section></div>`;

/* Ongoing care: weight management's live post-dose check-in, rebuilt as UI.
   The other programs' conversations are drafted (see programs/shared.js). */
function ongoingMarkup(section){
  if(!section)return '';
  const chat=section.chat;
  // A named doctor shows an initial; "Your Counsel doctor" shows a stethoscope.
  const avatar=name=>/^Dr\.?\s/.test(name)?esc(name.replace(/^Dr\.?\s*/,'').slice(0,1)):icon('stethoscope');
  const messages=chat.messages.map(message=>{
    const time=message.time?`<span class="cv3-chat-time">${esc(message.time)}</span>`:'';
    if(message.from==='member')return `${time}<p class="cv3-chat-member">${esc(message.text)}</p>`;
    if(message.from==='doctor')return `${time}<div class="cv3-chat-doctor"><span class="cv3-chat-avatar" aria-hidden="true">${avatar(message.name)}</span><p><b>${esc(message.name)}</b>${esc(message.text)}</p></div>`;
    return `${time}<p class="cv3-chat-ai"><span class="cv3-chat-thinking" aria-hidden="true">${'<i></i>'.repeat(9)}</span><span>${esc(message.text)}</span></p>`;
  }).join('');
  // A term like "GLP-1" never breaks at its hyphen (Sam at Counsel, Oct 13: weight management's heading).
  const keep=html=>html.replace(/\b[A-Z]+-\d+s?\b/g,term=>`<span class="cv3-nowrap">${term}</span>`);
  return `<section class="condition-section cv3-ongoing" aria-labelledby="program-ongoing"><div class="channel-wrap cv3-split"><div class="cv3-split-copy"><h2 id="program-ongoing">${keep(esc(section.heading))}</h2><p>${keep(esc(section.body))}</p><div class="cv3-actions">${buttons(ctaList(section))}</div></div>
    <div class="cv3-art cv3-chat-art"><div class="cv3-chat" role="img" aria-label="Sample check-in conversation from Counsel's live site"><div class="cv3-chat-head"><span aria-hidden="true">${icon('chat')}</span><strong>${esc(chat.title)}</strong></div><div class="cv3-chat-body">${messages}</div><div class="cv3-chat-composer"><span>${esc(chat.composer)}</span><b>${icon('send')}</b></div></div></div></div></section>`;
}

/* Pricing (Sam at Counsel, Oct 7): weight management's "Choose how you pay"
   on every page, about what Counsel costs only. Medication cost is on the
   treatment cards; the plans come from programs/shared.js counselPricing. */
function planMarkup(plan){
  const price=plan.price?`<div class="cv3-price"><b>${esc(plan.price)}</b>${plan.suffix?`<small>${esc(plan.suffix)}</small>`:''}</div>`:'';
  const meta=plan.meta?`<p class="cv3-plan-meta">${esc(plan.meta)}</p>`:'';
  const features=plan.features?`<ul>${plan.features.map(feature=>`<li>${check}<span>${esc(feature)}</span></li>`).join('')}</ul>`:'';
  const note=plan.note?`<p class="cv3-plan-note">${esc(plan.note)}</p>`:'';
  return `<article class="cv3-plan${plan.featured?' is-featured':''}"><div class="cv3-plan-top"><h3>${esc(plan.name)}</h3>${plan.callout?`<span class="cv3-callout">${esc(plan.callout)}</span>`:''}</div>${price}${meta}${features}${note}</article>`;
}
const pricingMarkup=pricing=>`<section class="condition-section cv3-pricing" aria-labelledby="program-pricing"><div class="channel-wrap"><div class="condition-section-head"><h2 id="program-pricing">${esc(pricing.heading)}</h2><p>${esc(pricing.body)}</p></div><div class="cv3-plans">${pricing.plans.map(planMarkup).join('')}</div><div class="cv3-actions is-center">${buttons(ctaList(pricing))}</div>${pricing.footnote?`<p class="cv3-footnote">${esc(pricing.footnote)}</p>`:''}</div></section>`;

/* Treatment options: product cards, the acne trio, or one featured product.
   Any card can end with a cost estimate (Sam, Oct 7): a line with insurance,
   a line without, both or neither, so each medication opts in on its own. */
const COST_LINES=[['insured','With insurance'],['cash','Without insurance']];
function costMarkup(cost){
  const rows=COST_LINES.filter(([key])=>cost?.[key]);
  return rows.length?`<dl class="cv3-rx-cost">${rows.map(([key,label])=>`<div><dt>${label}</dt><dd>${esc(cost[key])}</dd></div>`).join('')}</dl>`:'';
}
function treatmentsMarkup(section){
  const layout=section.layout||(section.items.length<=2?'pair':'grid');
  const dl=(rows,cls)=>rows?`<dl class="${cls}">${rows.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`:'';
  const cards=section.items.map(item=>{
    const art=`<div class="cv3-rx-art${layout==='photo'?' is-photo':''}">${item.step?`<span class="cv3-rx-step">${esc(item.step)}</span>`:''}<img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy"></div>`;
    const copy=layout==='trio'?`<p class="cv3-rx-lead"><strong>${esc(item.name)}</strong> ${esc(item.body)}</p>${costMarkup(item.cost)}`:
      `<h3>${esc(item.name)}${item.generic?` <small>(${esc(item.generic)})</small>`:''}</h3><p>${esc(item.body)}</p>${dl(item.details,'cv3-rx-details')}${costMarkup(item.cost)}`;
    return `<article class="cv3-rx">${art}<div class="cv3-rx-copy">${copy}</div></article>`;
  }).join('');
  const result=section.result?`<div class="cv3-rx-result"><span class="cv3-rx-result-dots" aria-hidden="true">${'<i></i>'.repeat(9)}</span><div><span>${esc(section.result.label)}</span><p>${esc(section.result.text)}</p></div></div>`:'';
  return `<section class="condition-section cv3-treatments" aria-labelledby="program-treatments"><div class="channel-wrap"><div class="condition-section-head"><h2 id="program-treatments">${esc(section.heading)}</h2><p>${esc(section.body)}</p></div><div class="cv3-rx-grid is-${layout}" style="--count:${section.items.length}">${cards}</div>${result}<div class="cv3-actions is-center">${buttons(ctaList(section))}</div>${section.footnote?`<p class="cv3-footnote">${esc(section.footnote)}</p>`:''}</div></section>`;
}

const physiciansMarkup=section=>section?`<section class="condition-section cv3-physicians" data-counsel-theme="dark" aria-labelledby="program-physicians"><div class="channel-wrap cv3-split"><div class="cv3-split-copy"><h2 id="program-physicians">${esc(section.heading)}</h2><p>${esc(section.body)}</p></div><div class="cv3-doctor-row" aria-hidden="true">${[1,2,3,4].map(n=>`<img src="/brand/photography/doctors/counsel-doctor-0${n}.webp" alt="" loading="lazy">`).join('')}</div></div></section>`:'';

/* Member stories: Home V13's quote cards. Text only (Hunter, Oct 6:
   testimonials never have photos). */
function storiesMarkup(section){
  const card=(item,hidden)=>`<figure class="cv3-story"${hidden?' aria-hidden="true"':''}><div class="cv3-quote"><blockquote>${esc(item.quote)}</blockquote><figcaption><span class="vchip"><i aria-hidden="true"></i>Verified</span><small>${esc(item.who)}</small></figcaption></div></figure>`;
  return `<section class="condition-section cv3-stories" aria-labelledby="program-stories"><div class="channel-wrap"><div class="condition-section-head"><h2 id="program-stories">${esc(section.heading)}</h2></div></div><div class="cv3-marquee" tabindex="0" role="region" aria-label="Member stories. Drag or scroll sideways."><div class="cv3-marquee-track">${section.items.map(item=>card(item,false)).join('')}${section.items.map(item=>card(item,true)).join('')}</div></div></section>`;
}

const faqMarkup=`<section class="condition-section condition-faq cv3-faq" aria-labelledby="program-faq"><div class="channel-wrap condition-faq-layout"><div><h2 id="program-faq">${esc(program.faq.heading)}</h2></div><div class="ch-faq-list">${window.CounselFAQComponent.markup(program.faq.items)}</div></div></section>`;
const closing=program.closing?closingMarkup(null,()=>buttons(ctaList(program.closing),{light:true}),{heading:program.closing.heading,body:program.closing.body,sectionId:'program-start',titleId:'program-start-title',photo:program.closing.photo}):'';

// Render: Weight Management V3's order, on every program.
if(!PRERENDERED){
  document.querySelector('#condition-hero-content').innerHTML=heroMarkup;
  document.querySelector('#main').innerHTML=[
    howMarkup,ongoingMarkup(program.ongoing),pricingMarkup(program.pricing),treatmentsMarkup(program.treatments),
    physiciansMarkup(program.physicians),storiesMarkup(program.stories),faqMarkup,closing,
  ].join('');
  document.querySelector('#condition-footer').innerHTML=window.CounselFooter.markup();
  document.querySelectorAll('.counsel-footer a').forEach(link=>{if(link.textContent.trim()==='Health plans')link.href='https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Health-Plans-V6.html';});
}
if(!RENDER_ONLY)mount();

// Mount: behaviour and motion on the markup above, written or pre-rendered.
function mount(){
  window.CounselFooter.mount();
  window.CounselFAQComponent.mount(document.querySelector('.cv3-faq .ch-faq-list'));

  mountCareExperience(document);
  mountDecorativeWeaves();
  const C=window.CounselColors;
  window.CounselNav?.set({linkSize:22,topPad:140,bottomPad:40,colors:[C.blue1,C.green1,C.yellow1,C.pink1]});
  // Full paths, so the export can point each one at its own copy of the page.
  const routes={
    'weight management':'/conditions/weight-management.html','birth control':'/conditions/birth-control.html',
    'hair loss':'/conditions/hair-loss.html','anti-aging skincare':'/conditions/anti-aging.html',
    'acne':'/conditions/acne.html','herpes':'/conditions/herpes.html',
    'health plans':'https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Health-Plans-V6.html',
    'counsel studio':'https://counsel.kineticstudio.com/designs/counsel/05-counsel-studio/Counsel-Studio-V1.html',
    'sign in':'https://app.counselhealth.com/',
    'request a demo':'https://www.counselhealth.com/contact-sales',
    'about us':'https://www.counselhealth.com/about',
    'careers':'https://jobs.ashbyhq.com/counsel',
  };
  document.querySelectorAll('.cn-col a,.cn-mlist a').forEach(link=>{
    const label=link.textContent.trim().toLowerCase();
    link.href=routes[label]||'https://counsel.kineticstudio.com/?project=counsel&view=page&page='+encodeURIComponent(label.replaceAll(' ','-'));
  });
  document.querySelectorAll('.cn-card,.cn-mcard').forEach(link=>{
    const text=link.textContent.toLowerCase();
    link.href=text.includes('report')?'https://www.counselhealth.com/ai-report/llm-as-a-judge':text.includes('action')?routes['request a demo']:text.includes('build')?routes['about us']:'https://counsel.kineticstudio.com/designs/counsel/01-home/Home-Hero-Weave-V13.html';
  });
  const nav=document.querySelector('nav'),mobile=document.querySelector('.cn-mobile');
  if(mobile){
    const start=mobile.querySelector('.cn-mdemo');start.textContent='Get started for free';start.href=ctaList(hero)[0].href;
    mobile.querySelector('.cn-msign').href=routes['sign in'];
    let wasOpen=false;
    const sync=()=>{const open=nav.classList.contains('cn-mopen');mobile.inert=!open;if(open&&!wasOpen)mobile.querySelector('.cn-mclose')?.focus();if(!open&&wasOpen&&mobile.contains(document.activeElement))nav.querySelector('.cn-burger')?.focus();wasOpen=open;};
    sync();new MutationObserver(sync).observe(nav,{attributes:true,attributeFilter:['class']});
    mobile.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const targets=[...mobile.querySelectorAll('a,button,summary')].filter(el=>el.getClientRects().length);if(event.shiftKey&&document.activeElement===targets[0]){event.preventDefault();targets.at(-1)?.focus();}else if(!event.shiftKey&&document.activeElement===targets.at(-1)){event.preventDefault();targets[0]?.focus();}});
  }
}
