/**
 * Counsel Studio V14 (Hunter, 2026-10-14), from V13.
 *
 * - Hero: the headline is just "Counsel Studio", a little bigger, and the
 *   subhead tells the whole story. On the hero's dot grid, one kind of data
 *   at a time lights up as a real icon (the brand's Lucide set on Lucide's
 *   own 24 grid): labs, sleep, steps, brand colors, nutrition, lifestyle,
 *   prior diagnoses, medications, heart rate. Then its pixels fly to a new
 *   spot and become the next one.
 * - The phone sits in the hero, all on the dark ground (Hunter: not split
 *   between light and dark): Counsel's own phone furniture (the island
 *   centred, signal, Wi-Fi and battery) in a frosted border. It shows the
 *   partner's own app first, with their logo; as you scroll, Counsel opens
 *   over it as a sheet (Hunter: "the Counsel experience is a sheet"), with
 *   Counsel's composer and its Add a doctor banner, and the partner's logo
 *   stays on the screen behind. Then each card slides in from the sheet's
 *   edge on its callout's side and stacks, its callout drawing after
 *   (V12's). Nothing pins. A small picker
 *   above it tries a partner's look on the app: two typefaces, three brands
 *   (a light green one, a dark blue one after Oura, a warm orange one after
 *   Function), each with a made-up logo. The border is frosted glass.
 * - Below the hero it is the rest of the site (Hunter, Oct 14: aligned, not
 *   centred, no new design system): the audience pages' own components,
 *   left-aligned, getting lighter. The Oura partner spotlight (Consumer
 *   health's, Javi's Oct 13 version); the deployment points in the Scope of
 *   care layout; the outcomes as Card Studio V3's bento tiles (map, data,
 *   place, calendar) with the live Counsel Studio copy; the stat cards; the
 *   closing card. White labeling is answered by the phone, so it has no
 *   section of its own.
 * Markup only; motion is animations.js mountStudioV14.
 */
import {lucide,LUCIDE} from '../ui-src/counsel-icons.js';
import {mountStudioV14,mountStudioV15,mountStudioV16,mountStudioV17,mountStudioV18,mountStudioV19} from '../channel-v5-src/animations.js';
import {COPY,DEMO,esc,mountChrome} from './content.js';
import {actions} from './centered.js';
import {COLORS,GRAPHICS,bentoMarkup} from '/prototypes/card-studio-v3-src/bento.js';
import {initBentoMotion} from '/prototypes/card-studio-v3-src/animations.js';
import {closingMarkup} from '../channel-v5-src/closing-card.js';
import AUDIENCE from '../audience-src/pages.js';

// The data Counsel takes in (Javi's list, Oct 13), each with its Lucide icon.
export const SOURCES=[
  {name:'Labs',icon:'flask-conical'},
  {name:'Sleep score',icon:'moon'},
  {name:'Steps',icon:'footprints'},
  {name:'Brand colors',icon:'palette'},
  {name:'Nutrition trends',icon:'apple'},
  {name:'Lifestyle trends',icon:'bike'},
  {name:'Prior diagnoses',icon:'clipboard-list'},
  {name:'Medications',icon:'pill'},
  {name:'Heart rate',icon:'heart-pulse'},
];
export const ICONS=SOURCES.map(source=>({name:source.name,svg:LUCIDE[source.icon]}));

// Hunter, Oct 14: the H1 is the name; the subhead carries the old headline and lede together.
// Javi, Oct 14 (share comment): the subhead.
const HERO={title:'Counsel Studio',lede:'Bring clinical action to your trusted digital experience with AI-native primary care embedded within your app.'};

const doctors=[1,2,3].map(i=>`<img src="/brand/photography/doctors/counsel-doctor-0${i}.webp" alt="">`).join('');
const grid=`<span class="r13-grid" aria-hidden="true">${'<i></i>'.repeat(9)}</span>`;

// The callouts: what stays the partner's and what Counsel brings. Numbered in
// the order the cards arrive (phones show the numbers and a key).
const PARTS=[
  {id:'brand',side:'left',tag:'Your brand',text:'Your app, logo, colors and type'},
  {id:'app',side:'left',tag:'Your app',text:'Counsel opens as a sheet, by iFrame, WebView or APIs'},
  {id:'data',side:'left',tag:'Your data',text:'Your members’ health data'},
  {id:'ai',side:'right',tag:'Counsel',text:'Medical AI'},
  {id:'actions',side:'right',tag:'Counsel',text:'Labs, prescriptions and referrals'},
  {id:'doctors',side:'right',tag:'Counsel',text:'Licensed physicians, in minutes'},
];
const badge=id=>`<b class="r12-badge" aria-hidden="true">${PARTS.findIndex(part=>part.id===id)+1}</b>`;
const WEEK=[3,4,3,5,6,8,10];
// Counsel's own phone furniture (ui-src/counsel-phone-ui.js): time, the island
// centred, signal, Wi-Fi and battery; and Counsel's platform composer
// (ui-src/counsel-platform-composer.js, as on Home) with its Add a doctor
// banner, which is always there (Hunter, Oct 14).
const status=window.CounselPhoneUI.status();
const composer=window.CounselPlatformComposer.markup({state:'available'})
  .replace('<div class="cp-banner"','<div data-card="doctors" class="cp-banner"')
  .replace('<span class="cp-portraits"></span>',`<span class="cp-portraits">${[1,2,3].map(i=>`<img src="/brand/photography/doctors/counsel-doctor-0${i}.webp" alt="">`).join('')}</span>`)
  .replace(/<\/div>$/,`<b class="r12-badge" data-for="doctors" aria-hidden="true">${PARTS.findIndex(part=>part.id==='doctors')+1}</b></div>`);

// Made-up partner logos (Hunter, Oct 14: not Counsel's); the picker's brand shows its own.
const LOGOS={ // Vela, fern and Clay are made up
  sky:`<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13.2 2.6a7.6 7.6 0 1 0 4.4 11.6 6.1 6.1 0 0 1-4.4-11.6Z" fill="var(--t-logo,var(--t-accent))"/></svg><b>VELA</b>`,
  fern:`<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 17C3 8.7 8.7 3 17 3c0 8.3-5.7 14-14 14Z" fill="var(--t-logo,var(--t-accent))"/><path d="M5.5 14.5 12.5 7.5" stroke="var(--t-bg)" stroke-width="1.4" stroke-linecap="round"/></svg><b>fern</b>`,
  clay:`<svg viewBox="0 0 20 20" aria-label="Clay"><circle cx="10" cy="10" r="9" fill="var(--t-logo,var(--t-accent))"/></svg>`,
}

// The partner's own app, behind: their logo, a greeting, the day's numbers,
// the way into care and their tab bar. Drafted UI lines (not Counsel copy).
const TILES=[['Sleep','7h 12m'],['Steps','6,240'],['Resting heart rate','70 bpm',true],['Active minutes','34']];
const TABS=[['layout-grid','Today',true],['activity','Trends'],['stethoscope','Care'],['contact-round','Profile']];
const app=`<div class="r14-app">
  <div class="r14-app-head"><span class="r14-logos" data-card="brand">${badge('brand')}${Object.entries(LOGOS).map(([id,logo])=>`<span class="r14-logo" data-brand="${id}">${logo}</span>`).join('')}</span><span class="r14-avatar">NR</span></div>
  <p class="r14-app-hello">Good morning, Nora</p>
  <p class="r14-app-date">Tuesday, October 14</p>
  <div class="r14-app-tiles">${TILES.map(([name,value,up])=>`<div><small>${name}</small><b>${value}${up?lucide('arrow-up'):''}</b></div>`).join('')}</div>
  <div class="r14-app-care">${lucide('stethoscope')}<span><b>Get care</b><small>Medical chat and doctors</small></span>${lucide('chevron-right')}</div>
  <div class="r14-app-tabs">${TABS.map(([icon,name,on])=>`<span${on?' class="is-on"':''}>${lucide(icon)}${name}</span>`).join('')}</div>
</div>`;

// Counsel, as a sheet over it: the chat, card by card, and Counsel's
// composer. Each card slides in from the side its callout is on (data-from).
const screen=`${app}<i class="r14-scrim" aria-hidden="true"></i><div class="r14-sheet">
  <div class="r14-sheet-head" data-card="app">${badge('app')}<i class="r14-grabber"></i><span class="r13-title">Medical chat</span><span class="r13-close">${lucide('x')}</span></div>
  <div class="r14-chat">
    <div class="r14-data r14-card" data-card="data" data-from="left">${badge('data')}<div class="r14-data-head"><b>Resting heart rate</b><small>Last 7 days</small></div><div class="r14-data-row"><strong>70</strong><span>bpm</span><span class="r14-bars" aria-hidden="true">${WEEK.map((n,i)=>`<i style="--n:${n}"${i===WEEK.length-1?' class="is-today"':''}></i>`).join('')}</span></div><small class="r14-data-note">Up 6 bpm from your usual.</small></div>
    <p class="r13-member r14-card" data-card="ask" data-from="right">Should I be worried?</p>
    <div class="r13-ai r14-card" data-card="ai" data-from="right">${badge('ai')}<span class="r13-ai-head">${grid}<b>Medical AI</b><small>from Counsel</small></span><p>A week-long rise often comes from a cold, short sleep or stress. A doctor can take a look today.</p></div>
    <div class="r14-action r14-card" data-card="actions" data-from="right">${badge('actions')}<span class="r14-action-icon">${lucide('flask-conical')}</span><span class="r14-action-text"><b>Lab order</b><small>Quest Diagnostics · 0.8 mi</small></span>${lucide('chevron-right')}</div>
  </div>
  ${composer}
</div>${status}`;

// The picker: a partner's look, tried on the app (Hunter, Oct 14): two
// typefaces (the ones this page already has) and three made-up brands, each
// with its own colours, light or dark, and logo (Hunter, Oct 14): light
// blue, in Counsel's blues; green in dark mode on a photo, after Oura; orange, warm and
// quiet, after Function.
export const LOOKS={
  font:{name:'Typeface',options:[
    {id:'serif',name:'Serif headings',vars:{'--t-title':'"Cooper Light",Cooper,Georgia,serif','--t-title-weight':'300'}},
    {id:'sans',name:'Sans throughout',vars:{'--t-title':'"GT America",sans-serif','--t-title-weight':'500'}},
  ]},
  brand:{name:'Brand',options:[
    {id:'sky',name:'Light blue',swatch:'#9ABDDB',vars:{'--t-app':'#DFEFF8','--t-app-card':'#F3F9FC','--t-bg':'#F7FBFD','--t-card':'#E6F2F9','--t-ink':'#132045','--t-muted':'rgb(19 32 69 / .6)','--t-line':'rgb(19 32 69 / .12)','--t-accent':'#9ABDDB','--t-logo':'#132045','--t-bubble':'#132045','--t-bubble-ink':'#F3F9FC','--t-compose':'#E6F2F9','--t-field':'#FFFFFF','--t-send-ink':'#132045'}},
    {id:'fern',name:'Green, dark mode',swatch:'#1E5A3C',vars:{'--t-app':'#0E2A1C','--t-app-card':'rgb(6 26 16 / .5)','--t-bg':'#10291D','--t-card':'#1A3A2A','--t-ink':'#E4EFE2','--t-muted':'rgb(228 239 226 / .62)','--t-line':'rgb(255 255 255 / .1)','--t-accent':'#A6D9A9','--t-logo':'#A6D9A9','--t-bubble':'#24503A','--t-bubble-ink':'#E4EFE2','--t-compose':'#1A3A2A','--t-field':'#0B2116','--t-send-ink':'#0E2A1C'}},
    {id:'clay',name:'Orange, warm',swatch:'#E2622B',vars:{'--t-app':'#F1E9DC','--t-app-card':'#FBF7EE','--t-bg':'#FBF7EE','--t-card':'#F3ECDF','--t-ink':'#2F2D2B','--t-muted':'rgb(47 45 43 / .58)','--t-line':'rgb(47 45 43 / .12)','--t-accent':'#E2622B','--t-logo':'#E2622B','--t-bubble':'#45423F','--t-bubble-ink':'#FFFFFF','--t-compose':'#F3ECDF','--t-field':'#FFFDF8','--t-send-ink':'#FFFFFF'}},
  ]},
};
const START={font:'serif',brand:'sky'};
// V15 (Denny, Oct 14) is this page with V3's ambient hero and a switcher that
// holds still once the annotations start (body.studio-v15); V16 (Hunter,
// Ariela) is V15 with the field ending on a wave above the phone, one toggle
// (brand only) and plain labels for callouts (body.studio-v16).
// V17 and V18 (Oct 14, after the Slack thread): Counsel's data callouts in
// green in the hero, one toggle. V17 is V15 with the wave on the hero's bottom
// edge (body.studio-v17); V18 is V16 with the callouts growing out of the
// dot field (body.studio-v18).
const VERSION=[20,19,18,17,16,15].find(v=>document.body.classList.contains(`studio-v${v}`))||14;
// V20 (Oct 15): V19 with a straight cut under the hero, no wave (Javi and
// Hunter: the site has no wave edges anywhere else).
// V19 (Oct 14): V17 with Denny's and Javi's notes on it (body.studio-v19,
// with studio-v17's styles): callouts out at the edges, a smoother wave,
// a crossfade between brands, Javi's stats and audience changes.
const V19=VERSION>=19;
// Javi's later page comments (Oct 14, after V14 to V16 were shared) go into
// V17 on only, so the versions Counsel has already seen stay as they were.
const NEXT=VERSION>=17;
const SETS=Object.entries(LOOKS).filter(([set])=>VERSION<16||set!=='font');
// V16 (Hunter, Oct 14): the one toggle changes the typeface too; each brand
// has its own headline type.
const BRAND_TYPE={
  sky:{'--t-title':'"Cooper Light",Cooper,Georgia,serif','--t-title-weight':'300'},
  fern:{'--t-title':'"GT America",sans-serif','--t-title-weight':'500'},
  clay:{'--t-title':'"GT America",sans-serif','--t-title-weight':'300'},
};
const swatch=(set,option)=>set==='font'?`<span style="font-family:${option.vars['--t-title'].replace(/"/g,'&quot;')};font-weight:${option.vars['--t-title-weight']}">Aa</span>`:`<i style="background:${option.swatch}"></i>`;
const picker=`<div class="r14-picker" role="group" aria-label="Try a partner's look on the app">${SETS.map(([set,look])=>`<div class="r14-pick" role="radiogroup" aria-label="${esc(look.name)}"><i class="r14-thumb" aria-hidden="true"></i>${look.options.map(option=>`<button type="button" role="radio" class="r14-pick-${set}" data-set="${set}" data-value="${option.id}" aria-checked="${option.id===START[set]}" tabindex="${option.id===START[set]?0:-1}" aria-label="${esc(option.name)}" title="${esc(option.name)}">${swatch(set,option)}</button>`).join('')}</div>`).join('')}</div>`;

// The hero: the field, the copy, then the picker, the phone and its
// callouts, all on the dark ground.
document.querySelector('#studio-hero-content').innerHTML=`
  <canvas class="r14-field" aria-hidden="true"></canvas>
  <div class="r14-signals" aria-hidden="true">${SOURCES.map(source=>`<span class="r14-signal" data-icon="${source.icon}">${esc(source.name)}</span>`).join('')}</div>
  <div class="channel-wrap r3-copy r14-copy">
    <h1 class="r2-title r14-title">${esc(HERO.title)}</h1>
    <p class="r2-lede r14-lede">${esc(HERO.lede)}</p>
    ${actions()}
  </div>
  <div class="channel-wrap r14-build">
    ${picker}
    <div class="r14-stage">
      <div class="r14-rig">
        <div class="r14-frame"><div class="r14-phone cui-device" data-counsel-theme="light" role="img" aria-label="Illustrative app screens: a partner's own app in its brand, then Counsel opening over it as a sheet, built card by card with the member's health data, Counsel's medical AI, a lab order and Counsel's composer with a licensed physician. Labels mark what stays the partner's and what Counsel brings.">${screen}</div></div>
        ${PARTS.map(part=>`<div class="r12-call is-${part.side}" data-call="${part.id}" aria-hidden="true"><i class="r12-dot"></i><i class="r12-wire"></i><p class="r12-label"><span>${esc(part.tag)}</span>${esc(part.text)}</p></div>`).join('')}
      </div>
    </div>
    <div class="r12-key r14-key">${['left','right'].map(side=>`<div><p>${side==='left'?'Yours':'Counsel'}</p><ul>${PARTS.map((part,i)=>part.side===side?`<li><b>${i+1}</b>${esc(part.text)}</li>`:'').join('')}</ul></div>`).join('')}</div>
  </div>`;

// V17: Counsel's data callouts (after the widgets Javi shared: an activity
// ring and an LDL reading), drawn in the hero's greens, and the hero's
// bottom edge as a wave. Drafted UI values.
if(VERSION>=17){
  const ring=`<svg class="r17-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" class="r17-track"/><circle cx="32" cy="32" r="26" class="r17-arc" pathLength="100" style="--to:70"/></svg>`;
  const CALLOUTS=[
    {id:'activity',head:'Daily activity',when:'Today',body:`<div class="r17-ring-row">${ring}<span class="r17-ring-value"><b data-count="70">70</b>%</span><span class="r17-note">of your goal, 3 days in a row</span></div>`},
    {id:'ldl',head:'LDL cholesterol',when:'Sep 2026',body:`<div class="r17-value"><b data-count="101">101</b><small>mg/dL</small></div><div class="r17-range" style="--at:.81"><i></i><i></i><i class="is-on"></i><span class="r17-marker"></span></div><div class="r17-ticks"><span>0</span><span>40</span><span>90</span><span>115</span></div>`},
    {id:'heart',head:'Resting heart rate',when:'Last 7 days',body:`<div class="r17-value"><b data-count="70">70</b><small>bpm</small><span class="r17-bars">${WEEK.map((n,i)=>`<i style="--n:${n}"${i===WEEK.length-1?' class="is-on"':''}></i>`).join('')}</span></div>`},
    {id:'steps',head:'Steps',when:'Today',body:`<div class="r17-value"><b data-count="6240">6,240</b><small>of 8,000</small></div><div class="r17-progress" style="--to:.78"><i></i></div>`},
  ];
  const content=document.querySelector('#studio-hero-content');
  content.insertAdjacentHTML('beforeend',`<div class="r17-callouts" aria-hidden="true">${CALLOUTS.map(c=>`<div class="r17-card" data-callout="${c.id}"><div class="r17-head"><b>${esc(c.head)}</b><small>${esc(c.when)}</small></div>${c.body}</div>`).join('')}</div>${VERSION===17||VERSION===19?'<svg class="r17-edge" aria-hidden="true"><path/></svg>':''}`);
}

// Below the hero: the audience pages' components (audience-src/audience.js),
// inside their own scope (.channel-v2 .channel-v5 .ap), left-aligned.
const button=(label,href,light=false)=>`<a class="channel-btn${light?' light':''}" href="${esc(href)}">${esc(label)}</a>`;

// The Oura partner spotlight: Consumer health's module, as Javi asked (Oct 14
// share comment), with its photo showing the whole phone.
const spot=AUDIENCE['consumer-health'].partner;
const spotlight=`<section class="v2-section ap-partner r14-partner" aria-labelledby="partner-title"><div class="channel-wrap"><div class="ap-spotlight"><div class="ap-spotlight-copy"><span class="channel-chip green">${esc(spot.eyebrow)}</span><img class="ap-partner-logo" src="${esc(spot.logo)}" alt="${esc(spot.name)}" width="198" height="62"><h2 id="partner-title" class="ap-partner-quote">${esc(spot.quote)}</h2>${button(spot.cta,spot.href,true)}</div><div class="ap-spotlight-photo"><img src="${esc(spot.app)}" alt="${esc(spot.appAlt)}" width="1320" height="325" loading="lazy"></div></div></div></section>`;

// Deployment, in the Scope of care layout: heading left, intro right, a
// column per point with its icon chip. The short titles are drafted; the
// sentences are the live page's.
// Javi, Oct 14 (share comments): "app" in the heading; the first title.
const DEPLOY_TITLE=NEXT?'Modernizing your digital app':COPY.deploy.title;
const DEPLOY_TITLES=[NEXT?'Deployment, made easy':'Deploy anywhere','Your care pathways','Your ecosystem'];
const deploy=`<section class="v2-section v2-scope r14-deploy" aria-labelledby="deploy-title"><div class="channel-wrap"><div class="v2-scope-head"><h2 id="deploy-title">${esc(DEPLOY_TITLE)}</h2><div><p>${esc(COPY.demo.body)}</p></div></div><div class="v2-scope-grid">${COPY.deploy.items.map((item,i)=>`<article><span class="v2-scope-marker v2-marker-${i}" aria-hidden="true">${lucide(item.icon)}</span><h3>${esc(DEPLOY_TITLES[i])}</h3><p>${esc(item.text)}</p></article>`).join('')}</div></div></section>`;

// The outcomes as Card Studio V3's bento tiles, with the live Counsel Studio
// copy; Javi, Oct 14: "product" in the heading, for "strategy".
const OUTCOMES_TITLE='Strengthen every layer of your product';
const OUTCOME_TILES=[
  {key:'access',span:7,color:'mint',graphic:'map'},
  {key:'data',span:5,color:'wine',graphic:'data'},
  {key:'services',span:5,color:'sky',graphic:'place'},
  {key:'launch',span:7,color:'green',graphic:'calendar'},
].map(tile=>{const outcome=COPY.outcomes.find(item=>item.id===tile.key);return{...tile,title:outcome.title.join(''),body:outcome.body};});
const tile=item=>{
  const graphic=GRAPHICS[item.graphic],color=COLORS[item.color],copyFirst=!!graphic.bleed;
  return `<article class="v2-value-card ap-tile${copyFirst?' is-copy-first':''}${item.span>=7?' is-wide':''}" style="--span:${item.span};--bento-bg:${color.bg};--bento-ink:${color.ink}"><div class="v2-value-art"${graphic.interactive?'':' aria-hidden="true"'}>${bentoMarkup({graphic:item.graphic,color:item.color,...graphic.defaults})}</div><div class="v2-value-copy"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></div></article>`;
};
const bento=`<section class="v2-section v2-value r14-value" aria-labelledby="value-title"><div class="channel-wrap"><div class="v2-heading"><h2 id="value-title">${esc(OUTCOMES_TITLE)}</h2></div><div class="v2-value-grid">${OUTCOME_TILES.map(tile).join('')}</div></div></section>`;

// Results: the stat cards. Two from Counsel's Counsel Studio launch post, one
// Counsel figure from the Oct 12 audience copy. Heading drafted (V1's).
// V19: Javi's stats (Oct 14 share comments).
const STATS=[
  V19?{value:'40%+',label:'Decrease in urgent care utilization',description:'Reduction in unnecessary acute care utilization across a series of Counsel deployments.'}
    :{value:'40%+',label:'Less unnecessary acute care',description:'Reduction in unnecessary acute care utilization, in one Counsel Studio deployment.'},
  V19?{value:'4.9/5',label:'Member satisfaction',description:'High member satisfaction drives stronger engagement and supports improved long-term health outcomes.'}
    :{value:'Top 10%',label:'Patient satisfaction',description:'Top decile satisfaction for wearable-informed care, in another deployment.'},
  {value:'2 min',label:'Average response time',description:'When physician assistance is required. AI chat is instantaneous.'},
];
const stats=`<section class="v2-section v2-impact" data-counsel-theme="green" aria-labelledby="impact-title"><div class="channel-wrap v2-impact-layout"><div class="v2-impact-intro"><h2 id="impact-title">${esc(COPY.proof.title)}</h2><p class="r14-impact-body">${esc(COPY.proof.body)}</p><div class="ap-stats-cta">${button('Connect with our team',DEMO)}</div></div><div class="v2-impact-results"><div class="v2-metrics ap-stats-3">${STATS.map((stat,i)=>`<article class="v2-metric v2-metric-${i}"><div class="v5-metric-summary"><span class="v5-stat-value"><span class="v5-stat-final">${esc(stat.value)}</span><span data-stat-number aria-hidden="true">${esc(stat.value)}</span></span><h3>${esc(stat.label)}</h3></div><p>${esc(stat.description)}</p></article>`).join('')}</div></div></div></section>`;

// Where to go next (Javi, Oct 14: people may land here first, so point
// them to the page for who they are). The live page's heading; each card
// carries that audience page's own headline, in the bento's colours.
const AUDIENCE_LINKS=[
  {id:'health-plans',color:'blue',href:'https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Health-Plans-V6.html'},
  {id:'health-systems',color:'mint',href:'https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Health-Systems-V1.html'},
  {id:'consumer-health',color:'sky',href:'https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Consumer-Health-V1.html'},
  {id:'employers',color:'wine',href:'https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Employers-V1.html'},
];
// V19: Employers don't use Counsel Studio (Javi).
const AUDIENCE_SHOWN=AUDIENCE_LINKS.filter(link=>!V19||link.id!=='employers');
const audiences=`<section class="v2-section r14-audiences" aria-labelledby="audiences-title"><div class="channel-wrap"><div class="v2-heading"><h2 id="audiences-title">${esc(COPY.audiencesTitle)}</h2></div><ul class="r14-audience-grid" style="--n:${AUDIENCE_SHOWN.length}">${AUDIENCE_SHOWN.map(link=>{const page=AUDIENCE[link.id],color=COLORS[link.color];return `<li><a class="r14-audience" href="${link.href}" style="--bento-bg:${color.bg};--bento-ink:${color.ink}"><span class="r14-audience-name">${esc(page.name)}</span><span class="r14-audience-line">${esc(page.hero.lines.join(' '))}</span><span class="r14-audience-go">Learn more ${lucide('arrow-right')}</span></a></li>`;}).join('')}</ul></div></section>`;

const closing=closingMarkup(null,light=>button('Request a demo',DEMO,light),{heading:['See Counsel Studio','in action'],body:'Discover how Counsel Studio can bring AI-enabled care into your app, from day one.'});

// Javi, Oct 14: deployment right after the bento; then the stats, where to go
// next, and the close (on the light page).
// V14 to V16 keep the order they were shared with.
document.querySelector('#main').innerHTML=`<div class="channel-v2 channel-v5 ap r14-site${NEXT?' is-next':''}" data-counsel-theme="light">${NEXT?spotlight+bento+deploy+stats+audiences+closing:spotlight+bento+stats+deploy+closing}</div>`;
// Each tile plays its story once as it scrolls in (Card Studio V3's motion).
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.r14-site .ap-tile .v2-value-art').forEach(art=>initBentoMotion(art,{scroller:document.getElementById('stage'),enabled:!still}));

// The picker sets the app's look and logo; animations.js re-places the callouts.
const phone=document.querySelector('.r14-phone');
function look(set,value,{focus=false}={}){
  const option=LOOKS[set].options.find(item=>item.id===value);
  const vars={...option.vars,...(VERSION>=16&&set==='brand'?BRAND_TYPE[value]:{})};
  const apply=()=>{Object.entries(vars).forEach(([name,val])=>phone.style.setProperty(name,val));phone.dataset[set]=value;};
  const buttons=[...document.querySelectorAll(`.r14-picker [data-set="${set}"]`)];
  buttons.forEach(button=>{const on=button.dataset.value===value;button.setAttribute('aria-checked',String(on));button.tabIndex=on?0:-1;if(on&&focus)button.focus();});
  if(buttons.length)slideThumb(buttons[0].closest('.r14-pick'));
  // A new brand sweeps across in its colour (animations.js sets phone.r14Wipe);
  // the look changes under the sweep, so it is clearly on purpose.
  if(set==='brand'&&phone.r14Wipe&&phone.dataset.brand&&phone.dataset.brand!==value)phone.r14Wipe(option.swatch,apply);else apply();
  phone.dispatchEvent(new CustomEvent('studio:look',{bubbles:true,detail:{set,value}}));
}
// One highlight per pill slides to the chosen option (no flicker between two).
function slideThumb(group){
  const thumb=group.querySelector('.r14-thumb'),on=group.querySelector('[aria-checked="true"]');
  thumb.style.width=`${on.offsetWidth}px`;thumb.style.transform=`translateX(${on.offsetLeft}px)`;
}
Object.entries(START).forEach(([set,value])=>look(set,value));
const settle=()=>document.querySelectorAll('.r14-pick').forEach(slideThumb);
document.fonts?.ready.then(settle);window.addEventListener('resize',settle);
requestAnimationFrame(()=>document.querySelector('.r14-picker').classList.add('is-ready'));
document.querySelectorAll('.r14-picker [role="radiogroup"]').forEach(group=>{
  const buttons=[...group.querySelectorAll('button')];
  buttons.forEach((button,i)=>{
    button.addEventListener('click',()=>look(button.dataset.set,button.dataset.value));
    button.addEventListener('keydown',event=>{const step={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];if(!step)return;event.preventDefault();const next=buttons[(i+step+buttons.length)%buttons.length];look(next.dataset.set,next.dataset.value,{focus:true});});
  });
});

mountChrome(`/src/05-counsel-studio/Counsel-Studio-V${VERSION}.html`);
// The counsel-pages repo (Toqir's Webflow reference) captures this page's
// markup with ?render-only: write it, then stop, before any motion.
const RENDER_ONLY=new URLSearchParams(location.search).has('render-only');
// V20 mounts as V19 (with no wave in the markup, the edge motion does nothing).
if(!RENDER_ONLY)({14:mountStudioV14,15:mountStudioV15,16:mountStudioV16,17:mountStudioV17,18:mountStudioV18,19:mountStudioV19,20:mountStudioV19})[VERSION]();
