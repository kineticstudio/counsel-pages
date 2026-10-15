/**
 * Card Studio V3 bento graphics (Hunter, 2026-10-12, restarted the same day).
 * Javi's audience pages (Health plans, Health systems, Consumer health,
 * Employers) all use Health Plans V5's value grid. PAGES holds each page's
 * bento as his doc has it: the tiles in order, their width in the 12-column
 * grid, their colour pair, the copy and the graphic each one shows.
 *
 * Third pass (Oct 13). Every graphic is drawn in its tile's two colours
 * only, ink on ground, with one mixed tone for secondary lines: no white
 * cards, no navy, no partner colours. One type scale, sized to the tile's
 * own copy. Phone-width first: everything is built for a 300px art area
 * and grows from there. The language is the site's: Studio V4's dotted
 * lanes of squares into the 3x3 grid, Studio V5's "Your app" insight and
 * one Counsel row, V5's walkthrough bubble breaking the phone's edge, the
 * care phone's chrome. Phones are line drawings in the tile's ink, tall,
 * rising from the tile's bottom edge; the tile crops them, a hard edge.
 * Each graphic animates its story once as it comes into view.
 * A graphic is fields plus markup; its styles live in bento.css and its
 * motion in animations.js (initBentoMotion). Exports bake in the tile's
 * colours, so the embed matches its tile.
 */
import {usDots} from './us-map.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const lines=v=>String(v??'').split('\n').map(s=>s.trim()).filter(Boolean);
const rowsOf=(v,max)=>(Array.isArray(v)?v:[]).slice(0,max);
const clamp=(n,min,max)=>Math.min(max,Math.max(min,Math.round(Number(n)||0)));
const grid='<span class="cb-grid" aria-hidden="true">'+'<i></i>'.repeat(9)+'</span>';
const check='<svg class="cb-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const icon=paths=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const chevron=icon('<path d="m9 6 6 6-6 6"/>');
/* Counsel AI's label and reply, as in the product. */
const ai=`<span class="cb-ai">${grid}<span>Counsel AI</span></span>`;
const reply=text=>`<div class="cb-reply">${ai}<p>${esc(text)}</p></div>`;

/* Health Plans V5's five tile colour pairs (designs/channel-v5-src/value-bento.css). */
export const COLORS={
  blue:{name:'Blue',bg:'#455F97',ink:'#BCDCEB'},
  wine:{name:'Wine',bg:'#30151A',ink:'#EABEA8'},
  green:{name:'Green',bg:'#005434',ink:'#9ADB90'},
  mint:{name:'Mint',bg:'#BFDFB9',ink:'#005434'},
  sky:{name:'Sky',bg:'#C6E1ED',ink:'#455F97'},
};
/** A tile spanning n of 12 columns at 1440: 1280 wide with 4px gaps, so 8 is V5's 852. */
export const tileWidth=span=>span*103+(span-1)*4;

/* The pages, from Javi's "Updated Audience Page Copy for Kinetic" doc (Oct 12).
   Six-tile pages keep V5's rows (8+4, 5+7, 5+7) and colours by position; the
   five-tile pages run 7+5 over three 4s. Tiles whose graphic rises from the
   bottom edge put their copy first, like V5's escalation tile. */
const WHITE_LABEL='Embed Counsel into your existing app, customized to your trusted brand to promote member engagement and retention.';
const ACCESS='Bring on-demand care to your members that doesn’t rely on appointments. Counsel gives members immediate answers from our medical AI and the ability to connect with a physician in minutes.';
const ONE_PLACE=who=>`From care to medical advice, labs, specialist referrals, prescriptions, and health insights, ${who} are supported through every medical need in one unified experience.`;
const LAUNCH='Counsel enables you to launch faster while maintaining the highest standards for safety and compliance.';
const CHEST={message:'My chest has been hurting for the past few days, should I go to the ER?',reply:'Let’s discuss your symptoms to determine the most appropriate next step.'};
const EHR_COPY='Counsel seamlessly connects to your EHR to inform every care interaction with a patient’s medical history. Interactions with Counsel are written back to the EHR, establishing a bidirectional connection that gives your providers a complete picture of each patient.';

export const PAGES={
  'health-plans':{name:'Health plans',heading:'The clinical layer unlocking value for payer organizations',tiles:[
    {key:'triage',span:8,color:'blue',copyFirst:true,graphic:'triage',title:'Intelligently triage member needs',body:'Counsel AI triages member concerns, routing them to the appropriate care pathway. As members interact with Counsel, health memories are built, creating a continuous relationship.'},
    {key:'whitelabel',span:4,color:'wine',graphic:'whitelabel',title:'A white-\u2060labeled, custom experience',body:WHITE_LABEL},
    {key:'upstream',span:5,color:'green',graphic:'chat',data:CHEST,title:'Shift care upstream',body:'Improve your network’s efficiency by providing access to Counsel at the point of need, reducing unnecessary escalation to costly care settings.'},
    {key:'access',span:7,color:'mint',graphic:'map',title:'Expand access at scale',body:ACCESS},
    {key:'comprehensive',span:5,color:'sky',graphic:'place',title:'Offer comprehensive care in one place',body:ONE_PLACE('members')},
    {key:'golive',span:7,color:'green',graphic:'calendar',title:'Go live in weeks',body:`Deploy production-ready AI-native care without the complexity of building it. ${LAUNCH}`},
  ]},
  'health-systems':{name:'Health systems',heading:'Strengthen every layer of your network',tiles:[
    {key:'triage',span:8,color:'blue',copyFirst:true,graphic:'triage',title:'Intelligently triage member needs',body:'Counsel AI triages member concerns, routing them to the appropriate care pathway and retaining them within your system. As members interact with Counsel, health memories are built, creating a continuous relationship.'},
    {key:'whitelabel',span:4,color:'wine',graphic:'whitelabel',data:{plans:'Riverside\nSt. Clare\nNorthgate'},title:'A white-\u2060labeled, custom experience',body:WHITE_LABEL},
    {key:'upstream',span:5,color:'green',graphic:'chat',data:CHEST,title:'Shift care upstream',body:'Expand your system’s capacity without adding headcount by enabling Counsel to address most medical concerns, enabling your providers to focus on more complex cases.',note:'The doc’s chat line reads “for the past few, should I go to the ER?” This uses “for the past few days”.'},
    {key:'continuity',span:7,color:'mint',graphic:'ehr',title:'Improve care continuity',body:EHR_COPY,note:'The doc asks for the US map here, but the copy is about the EHR, so this shows the two-way EHR connection. Switch the graphic to “US access map” to compare.'},
    {key:'comprehensive',span:5,color:'sky',graphic:'place',title:'Offer comprehensive care in one place',body:ONE_PLACE('members')},
    {key:'golive',span:7,color:'green',graphic:'calendar',title:'Go live in weeks',body:`Deploy production-ready AI-native care without the complexity of building it. ${LAUNCH}`},
  ]},
  'consumer-health':{name:'Consumer health',heading:'The clinical layer unlocking value for consumer health',tiles:[
    {key:'actionability',span:7,color:'blue',graphic:'insight',title:'Bring clinical actionability into your platform',body:'Today, users have to leave your platform to take action on their insights. With Counsel, care can be accessed directly through your product, enabling a connected clinical experience.'},
    {key:'data',span:5,color:'wine',graphic:'data',title:'Inform care with your first-party data',body:'Counsel seamlessly ingests your custom data, including labs, biometrics, and lifestyle insights, to deliver personalized care for each user.'},
    {key:'experience',span:4,color:'green',graphic:'brandchat',title:'Strengthen the user experience',body:'Messaging-based care drives increased engagement and retention. By embedding medical care into the user journey, Counsel makes your platform a core part of how users prefer to manage their health.'},
    {key:'comprehensive',span:4,color:'mint',graphic:'place',title:'Offer comprehensive care in one place',body:ONE_PLACE('users')},
    {key:'launch',span:4,color:'sky',graphic:'calendar',title:'Launch AI-native care without building it',body:`Deploy production-ready, AI-native care without the complexity of building it. ${LAUNCH}`},
  ]},
  'employers':{name:'Employers',heading:'The clinical layer unlocking value for employers',tiles:[
    {key:'access',span:7,color:'green',graphic:'map',title:'Expand access at scale',body:ACCESS},
    {key:'comprehensive',span:5,color:'sky',graphic:'place',title:'Offer comprehensive care in one place',body:ONE_PLACE('members')},
    {key:'benefits',span:4,color:'wine',graphic:'benefit',title:'Amplify utilization of your benefits ecosystem',body:EHR_COPY,note:'Javi’s doc repeats the EHR paragraph as this tile’s body. The real copy is still to come.'},
    {key:'golive',span:4,color:'blue',graphic:'calendar',title:'Go live in weeks',body:`Deploy AI-native care without the complexity of building it. ${LAUNCH}`},
    {key:'chronic',span:4,color:'mint',graphic:'program',title:'Chronic condition management',body:'With Counsel, employers can offer longitudinal care by covering chronic conditions such as obesity, hypertension, high cholesterol, and more. Employees get to seamlessly manage their conditions and other medical needs within the same app.',note:'Drawn after the app’s program directory (the rows in Counsel’s own go-live video). Swap in the real card once Javi shares it.'},
  ]},
  // Counsel Studio V20's bento (Oct 15): the live page's four outcomes, in the
  // order, widths and colours of studio-src/studio-v14.js.
  'counsel-studio':{name:'Counsel Studio',heading:'Strengthen every layer of your product',tiles:[
    {key:'access',span:7,color:'mint',graphic:'map',title:'Expand access at scale',body:'By providing access to care within your existing platform, you can minimize the risk of unmanaged utilization of consumer AI tools, ensuring patients receive safe care.'},
    {key:'data',span:5,color:'wine',graphic:'data',title:'Care informed by your custom set of data sources',body:'Counsel Studio seamlessly ingests your proprietary data sources to deliver personalized care experiences for every patient, aligned with your clinical protocols, care pathways, and go-to-market strategy.'},
    {key:'services',span:5,color:'sky',graphic:'place',title:'Offer comprehensive care in one place',body:'With Counsel Studio, patients gain access to care, medical advice, labs, specialist referrals, prescriptions, and health insights, all in one unified experience.'},
    {key:'launch',span:7,color:'green',graphic:'calendar',title:'Go live in weeks, not years',body:'Deploy production-ready medical AI without the complexity of building it. Counsel Studio enables you to launch faster while maintaining the highest standards for safety and compliance.'},
  ]},
};
export const PAGE_ORDER=Object.keys(PAGES);
export const tileOf=(page,key)=>PAGES[page]?.tiles.find(t=>t.key===key);

const luminance=hex=>{const n=parseInt(hex.slice(1),16);const [r,g,b]=[n>>16&255,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b;};
/** The tile's colours as custom properties; dark and light are sorted by luminance. */
export function tileVars(color){
  const [dark,light]=luminance(color.bg)<luminance(color.ink)?[color.bg,color.ink]:[color.ink,color.bg];
  return `--cb-bg:${color.bg};--cb-ink:${color.ink};--cb-dark:${dark};--cb-light:${light}`;
}

/* A phone drawn in the tile's ink, rising from the tile's bottom edge: the
   care phone's status bar and header, then the conversation. Brands get a
   mark and their name in the header, as in Studio V5's "Your app". */
const statusIcons='<svg class="cb-phone-icons" viewBox="0 0 54 11" aria-hidden="true"><path d="M1 8h2.4v3H1zM5.2 6h2.4v5H5.2zM9.4 4h2.4v7H9.4zM13.6 2H16v9h-2.4z" fill="currentColor"/><path d="M21.6 4.4a7 7 0 0 1 9 0M23.4 6.5a4.2 4.2 0 0 1 5.4 0M25.2 8.6a1.5 1.5 0 0 1 1.8 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><rect x="34.6" y="1.4" width="16" height="8.2" rx="2.6" fill="none" stroke="currentColor" stroke-opacity=".5"/><rect x="36.2" y="3" width="11.4" height="5" rx="1.4" fill="currentColor"/><path d="M52.4 4.3v2.4" stroke="currentColor" stroke-opacity=".5" stroke-width="1.3" stroke-linecap="round"/></svg>';
const menu=icon('<path d="M4 7h16M4 12h16M4 17h10"/>');
const person=icon('<circle cx="12" cy="8.5" r="3.5"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/>');
// Brand marks as shapes (Studio V5's brandMark), so a brand reads without its colour.
const MARKS={circle:'<circle cx="12" cy="12" r="9"/>',square:'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/>',diamond:'<path d="M12 2.5 21.5 12 12 21.5 2.5 12Z"/>',ring:'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="3.2"/>'};
const mark=shape=>`<svg class="cb-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${MARKS[shape]||MARKS.circle}</svg>`;
const phone=(body,{title='Get advice',brand='',shape='circle'}={})=>`<div class="cb-phone"><div class="cb-phone-status"><b>9:41</b><i class="cb-phone-island"></i>${statusIcons}</div><div class="cb-phone-nav">${brand?`<span class="cb-phone-brand">${mark(shape)}<span class="cb-phone-name">${esc(brand)}</span></span>`:`<span class="cb-phone-btn">${menu}</span><span class="cb-phone-title">${esc(title)}</span>`}<span class="cb-phone-btn">${person}</span></div><div class="cb-phone-body"><span class="cb-phone-day">Today</span>${body}</div></div>`;
/* Words wrapped one by one, so a reply can arrive the way the product streams it. */
const words=text=>esc(text).split(/\s+/).filter(Boolean).map(w=>`<i>${w}</i>`).join(' ');
const streamed=text=>`<div class="cb-reply">${ai}<p class="cb-words">${words(text)}</p></div>`;

// Studio V5's week of resting heart rate: one square per beat above 61, today last.
const WEEK=[64,65,64,66,68,70,72];
// The six kinds of care in "one place": visits, advice, labs, referrals, prescriptions, insights.
const CARE_ICONS=[
  icon('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  icon('<path d="M21 11.5a8.4 8.4 0 0 1-12.2 7.5L3 21l2-5.6A8.5 8.5 0 1 1 21 11.5Z"/>'),
  icon('<path d="M9 3h6M10 3v6.5L4.6 18.4A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.4-2.6L14 9.5V3M7.5 15h9"/>'),
  icon('<path d="M7 17 17 7M8 7h9v9"/>'),
  icon('<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="m8.5 8.5 7 7"/>'),
  icon('<path d="M3 12h4l3-8 4 16 3-8h4"/>'),
];
const SOURCE_ICONS=[
  icon('<path d="M9 3h6M10 3v6.5L4.6 18.4A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.4-2.6L14 9.5V3"/>'),
  icon('<path d="M3 12h4l3-8 4 16 3-8h4"/>'),
  icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
];

// The live How Counsel Works video's first question (Health Plans V5, featureArt).
// Javi, Oct 13: it is a question, so it ends with one.
const RASH='I have a rash on my arm and I’m wondering what I should do?';

export const GRAPHICS={
  triage:{
    name:'Triage',
    // Hunter, Oct 13: the one graphic that floats (a small cluster in a wide tile), so it sits in the hairline bound.
    bound:true,
    fields:[
      {key:'message',label:'Member message',type:'textarea'},
      {key:'paths',label:'Care pathways',type:'lines',hint:'Up to four'},
      {key:'chosen',label:'Chosen pathway',type:'choice',from:'paths'},
      {key:'branches',label:'The chosen pathway branches into',type:'lines',hint:'Up to three'},
    ],
    // Javi, Oct 13: mirror the live site: Counsel Physicians (branching into
    // advice and triage, medications and labs, referrals), your benefits
    // ecosystem and programs, and in-network providers; Counsel's path stands out.
    defaults:{message:RASH,paths:'Counsel Physicians\nYour benefits ecosystem & programs\nIn-network providers',chosen:'Counsel Physicians',branches:'Advice & triage\nMedications & labs\nReferrals'},
    // The question drops into Counsel AI, which routes it. The chosen pathway
    // is drawn in the tile's ink and branches again; the others stay quiet.
    markup:d=>{
      const paths=lines(d.paths).slice(0,4),chosen=paths.includes(d.chosen)?d.chosen:paths[0];
      const ordered=chosen?[chosen,...paths.filter(p=>p!==chosen)]:[];
      const branches=lines(d.branches).slice(0,3);
      const row=(p,i)=>i?`<li><span class="cb-path"><span>${esc(p)}</span></span></li>`:`<li class="is-chosen"><span class="cb-path"><b class="cb-fill" aria-hidden="true"></b><span>${esc(p)}</span></span>${branches.length?`<i class="cb-link is-lit" aria-hidden="true"></i><ul class="cb-triage-sub">${branches.map(b=>`<li><i class="cb-dot" aria-hidden="true"></i><span>${esc(b)}</span></li>`).join('')}</ul>`:''}</li>`;
      return `<div class="cb-triage-body" style="--rows:${Math.max(1,branches.length)}"><div class="cb-triage-ask"><p class="cb-bubble">${esc(d.message)}</p></div><i class="cb-drop" aria-hidden="true"></i><div class="cb-triage-flow"><div class="cb-triage-head"><div class="cb-triage-ai">${grid}<span>Counsel AI</span></div><i class="cb-link is-lit" aria-hidden="true"></i></div><ul class="cb-triage-paths">${ordered.map(row).join('')}</ul></div></div>`;
    },
  },
  whitelabel:{
    name:'White label',bleed:true,interactive:true,
    fields:[
      {key:'plans',label:'Brand names',type:'lines',hint:'Three, one per line'},
      {key:'message',label:'Member message',type:'textarea'},
      {key:'reply',label:'Counsel AI reply',type:'textarea'},
    ],
    defaults:{plans:'Northwind\nEvergreen\nSummit',message:'I’d like to talk to a doctor about my allergies.',reply:'I can help with that. Are they seasonal, or do they come and go all year?'},
    // One app, three brands: the brand in the header swaps while the care beneath it stays. The row of brands above is the story at rest.
    markup:d=>{
      const plans=lines(d.plans).slice(0,3);if(!plans.length)plans.push('Your app');
      const shapes=['circle','square','diamond'],last=plans.length-1;
      // Javi, Oct 13: the brands are buttons; picking one rebrands the app (wireBrands in animations.js).
      return `<div class="cb-brands" role="group" aria-label="Try a brand">${plans.map((plan,i)=>`<button type="button" class="cb-brand${i===last?' is-on':''}" aria-pressed="${i===last}" data-shape="${shapes[i]}">${mark(shapes[i])}<span>${esc(plan)}</span></button>`).join('')}</div>${phone(`<p class="cb-bubble">${esc(d.message)}</p>${streamed(d.reply)}<span class="cb-powered">Powered by Counsel</span>`,{brand:plans[last],shape:shapes[last]})}`;
    },
  },
  chat:{
    name:'Chat in a phone',bleed:true,
    fields:[
      {key:'title',label:'Screen title',type:'text'},
      {key:'message',label:'Member message',type:'textarea'},
      {key:'reply',label:'Counsel AI reply',type:'textarea'},
    ],
    defaults:{title:'Get advice',...CHEST},
    markup:d=>phone(`<p class="cb-bubble">${esc(d.message)}</p>${streamed(d.reply)}`,{title:d.title}),
  },
  brandchat:{
    name:'Chat in your app',bleed:true,
    fields:[
      {key:'brand',label:'Brand name',type:'text'},
      {key:'message',label:'User message',type:'textarea'},
      {key:'reply',label:'Counsel AI reply',type:'textarea'},
    ],
    defaults:{brand:'Your app',message:'My sleep score dropped this week. Should I be worried?',reply:'Let’s look at what changed. How have you been sleeping, and has anything else felt off?'},
    markup:d=>phone(`<p class="cb-bubble">${esc(d.message)}</p>${streamed(d.reply)}<span class="cb-powered">Powered by Counsel</span>`,{brand:d.brand||'Your app',shape:'ring'}),
  },
  benefit:{
    name:'Benefit card',bleed:true,
    fields:[
      {key:'message',label:'Member message',type:'textarea'},
      {key:'answer',label:'Counsel AI reply',type:'textarea'},
      {key:'brand',label:'Partner',type:'text'},
      {key:'title',label:'Headline',type:'text'},
      {key:'body',label:'Body',type:'textarea'},
      {key:'button',label:'Button',type:'text'},
    ],
    // Javi's Motion Health example, with his employer line; the card follows the reply and pops past the phone's edge like V5's walkthrough cards.
    defaults:{message:'My lower back has been aching for weeks.',answer:'Good news: your employer covers physical therapy.',brand:'Motion Health',title:'Book a free physical therapy visit today',body:'Your employer covers digital physical therapy from Motion Health.',button:'Schedule now'},
    markup:d=>phone(`<p class="cb-bubble">${esc(d.message)}</p>${streamed(d.answer)}<div class="cb-benefit-card"><span class="cb-benefit-brand">${mark('circle')}${esc(d.brand)}</span><b>${esc(d.title)}</b><p>${esc(d.body)}</p><span class="cb-benefit-btn">${esc(d.button)}</span></div>`),
  },
  map:{
    name:'US access map',
    fields:[{key:'label',label:'Label',type:'text',hint:'Optional'}],
    defaults:{label:''},
    // The lower 48 in dots; lit squares are members getting care, switching on west to east, then one at a time.
    markup:d=>{
      const m=usDots(),id=`cb-map-${Math.random().toString(36).slice(2,8)}`;
      return `<svg class="cb-map-svg" viewBox="0 0 ${m.width} ${m.height}" role="img" aria-label="Members across the United States getting care"><defs><pattern id="${id}-dot" width="${m.step}" height="${m.step}" patternUnits="userSpaceOnUse"><rect x="3" y="3" width="4" height="4" fill="currentColor"/></pattern><clipPath id="${id}-land">${m.runs.map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${m.step}"/>`).join('')}</clipPath></defs><rect class="cb-map-base" width="${m.width}" height="${m.height}" fill="url(#${id}-dot)" clip-path="url(#${id}-land)"/>${m.on.map(([x,y])=>`<rect class="cb-map-ring" x="${x+1}" y="${y+1}" width="8" height="8"/>`).join('')}${m.on.map(([x,y])=>`<rect class="cb-map-dot" x="${x+2}" y="${y+2}" width="6" height="6"/>`).join('')}</svg>${d.label?`<p class="cb-map-label">${esc(d.label)}</p>`:''}`;
    },
  },
  ehr:{
    name:'EHR two-way',
    fields:[
      {key:'patient',label:'Patient',type:'text'},
      {key:'rows',label:'Record',type:'rows',columns:[{key:'label',label:'Field',type:'text',w:'100px'},{key:'value',label:'Value',type:'text',w:'minmax(0,1fr)'}],max:4},
      {key:'question',label:'Patient message',type:'textarea'},
      {key:'answer',label:'Counsel AI reply',type:'textarea'},
      {key:'note',label:'Written back',type:'text'},
    ],
    defaults:{patient:'Nora R.',rows:[{label:'Medications',value:'Lisinopril 10 mg'},{label:'Conditions',value:'Hypertension'},{label:'Allergies',value:'Penicillin'}],question:'Is it safe to take ibuprofen for my back?',answer:'Since you take lisinopril for your blood pressure, ibuprofen may not be the best fit. Let’s look at safer options.',note:'Counsel visit summary'},
    // The record, solid in the tile's ink, feeds the conversation along one lane of squares; the visit rides back along the other.
    markup:d=>`<div class="cb-ehr-record"><div class="cb-ehr-head"><b>Health record</b><small>${esc(d.patient)}</small></div><dl>${rowsOf(d.rows,4).map(r=>`<div class="cb-ehr-row"><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join('')}<div class="cb-ehr-row is-new"><dt>Today</dt><dd>${esc(d.note)}${check}</dd></div></dl></div><div class="cb-ehr-lanes"><svg viewBox="0 0 80 64" aria-hidden="true"><path class="cb-lane" d="M2 20H78"/><path class="cb-lane" d="M78 44H2"/><path class="cb-lane-tip" d="m72 15 6 5-6 5"/><path class="cb-lane-tip" d="m8 39-6 5 6 5"/>${'<rect class="cb-rider" width="6" height="6"/>'.repeat(6)}</svg></div><div class="cb-ehr-thread"><p class="cb-bubble">${esc(d.question)}</p>${streamed(d.answer)}<span class="cb-ehr-sync">${check}Written back to the EHR</span></div>`,
  },
  place:{
    name:'Care in one place',
    fields:[{key:'items',label:'Kinds of care',type:'lines',hint:'Up to six'}],
    defaults:{items:'Doctor visits\nMedical advice\nLabs\nSpecialist referrals\nPrescriptions\nHealth insights'},
    // Six kinds of care, six squares in the tile's ink, gathering into one block.
    markup:d=>`<div class="cb-place-frame"><i class="cb-place-line" aria-hidden="true"></i><ul class="cb-place-grid">${lines(d.items).slice(0,6).map((item,i)=>`<li><span class="cb-place-icon">${CARE_ICONS[i%6]}</span><span>${esc(item)}</span></li>`).join('')}</ul></div>`,
  },
  insight:{
    name:'Insight to action',
    fields:[
      {key:'app',label:'App name',type:'text'},
      {key:'metric',label:'Metric',type:'text'},
      {key:'period',label:'Period',type:'text'},
      {key:'value',label:'Reading',type:'text'},
      {key:'unit',label:'Unit',type:'text'},
      {key:'note',label:'Note',type:'text'},
      {key:'action',label:'Counsel row',type:'text'},
      {key:'sub',label:'Under it',type:'text'},
    ],
    defaults:{app:'Your app',metric:'Resting heart rate',period:'Last 7 days',value:'72',unit:'bpm',note:'Up 8 bpm from your usual.',action:'Talk to a doctor about this',sub:'Counsel care · 2 min wait'},
    // The tile is the app: a partner's reading in big type, the week in squares, and one Counsel row beneath it (Studio V5).
    markup:d=>`<div class="cb-app"><div class="cb-app-bar"><span class="cb-app-brand">${mark('circle')}${esc(d.app)}</span><small>${esc(d.period)}</small></div><div class="cb-app-metric">${esc(d.metric)}</div><div class="cb-app-reading"><strong>${esc(d.value)}</strong><span>${esc(d.unit)}</span></div><div class="cb-app-chart" aria-hidden="true">${WEEK.map((bpm,i)=>`<span class="cb-app-col${i===WEEK.length-1?' is-today':''}">${'<i></i>'.repeat(bpm-61)}</span>`).join('')}</div><p class="cb-app-note">${esc(d.note)}</p><div class="cb-app-action">${grid}<span><b>${esc(d.action)}</b><small>${esc(d.sub)}</small></span>${chevron}</div></div>`,
  },
  data:{
    name:'Data to answer',
    fields:[
      {key:'question',label:'User question',type:'textarea'},
      {key:'rows',label:'Sources',type:'rows',columns:[{key:'label',label:'Source',type:'text',w:'88px'},{key:'value',label:'Reading',type:'text',w:'minmax(0,1fr)'}],max:3},
      {key:'answer',label:'Counsel AI answer',type:'textarea'},
    ],
    defaults:{question:'Why do I feel so tired after my workouts lately?',rows:[{label:'Labs',value:'Ferritin 18 ng/mL'},{label:'Sleep',value:'5 h 40 m a night'},{label:'Activity',value:'5 workouts a week'}],answer:'Low iron and short sleep together can make recovery harder. Let’s talk through next steps.'},
    // Studio V4's lanes, small: the partner's data rides dotted lanes into Counsel's grid, and an answer comes out.
    markup:d=>{
      const rows=rowsOf(d.rows,3),n=rows.length||1,xs=rows.map((_,i)=>Math.round((2*i+1)/(2*n)*360));
      return `<p class="cb-bubble">${esc(d.question)}</p><ul class="cb-sources" style="--n:${n}">${rows.map((r,i)=>`<li><span class="cb-source-icon">${SOURCE_ICONS[i%3]}</span><small>${esc(r.label)}</small><b>${esc(r.value)}</b></li>`).join('')}</ul><svg class="cb-flow-lanes" viewBox="0 0 360 80" aria-hidden="true">${xs.map(x=>`<path class="cb-lane" d="M${x} 2C${x} 52 180 30 180 78"/>`).join('')}${xs.map(()=>'<rect class="cb-rider" width="6" height="6"/>').join('')}</svg><span class="cb-flow-grid">${grid}</span>${streamed(d.answer)}`;
    },
  },
  program:{
    name:'Program card',
    fields:[
      {key:'eyebrow',label:'Eyebrow',type:'text'},
      {key:'title',label:'Program',type:'text'},
      {key:'body',label:'Description',type:'textarea'},
      {key:'tag',label:'Tag',type:'text'},
      {key:'button',label:'Button',type:'text'},
      {key:'points',label:'Includes',type:'lines',hint:'Up to three'},
    ],
    defaults:{eyebrow:'Program',title:'Weight management',body:'Doctor-led GLP-1 care with regular check-ins and dose adjustments, all in the same chat.',tag:'Covered by your employer',button:'Start program',points:'Treatment plan\nMonthly check-ins\nRefills and dose changes'},
    // The weight management card from the program directory, in the tile's ink, with Counsel's own photograph.
    markup:d=>`<article class="cb-prog"><div class="cb-prog-photo"><img src="/brand/photography/counsel-07-woman-injection-green.webp" data-export-size="420" alt=""><span class="cb-prog-tag">${check}${esc(d.tag)}</span></div><div class="cb-prog-body"><small>${esc(d.eyebrow)}</small><b>${esc(d.title)}</b><p>${esc(d.body)}</p><ul>${lines(d.points).slice(0,3).map(pt=>`<li>${check}${esc(pt)}</li>`).join('')}</ul><span class="cb-prog-btn">${esc(d.button)}</span></div></article>`,
  },
  calendar:{
    name:'Launch calendar',
    fields:[
      {key:'launch',label:'Launch day',type:'number',min:1,max:28},
      {key:'caption',label:'Caption',type:'text'},
    ],
    defaults:{launch:14,caption:''},
    // Health Plans V5's calendar: four weeks, ready days, one launch day.
    markup:d=>{
      const launch=clamp(d.launch,1,28)-1;
      return `<div class="cb-cal"><div class="cb-cal-head"><i></i><i></i></div><div class="cb-cal-days">${Array.from({length:28},(_,i)=>`<span${i===launch?' class="is-launch"':i<launch?' class="is-ready"':''}></span>`).join('')}</div>${d.caption?`<p class="cb-cal-caption">${esc(d.caption)}</p>`:''}</div>`;
    },
  },
  marquee:{
    name:'Care marquee (V5)',
    fields:[{key:'chips',label:'Services',type:'lines'}],
    defaults:{chips:'Medical advice\nLabs\nSpecialist referrals\nPrescriptions\nHealth insights'},
    // Health Plans V5's marquee, live in Webflow today: two rows drifting in opposite directions.
    markup:d=>{
      const chips=lines(d.chips);if(!chips.length)return '';
      // Focus or hover pauses the drift (V5's own rule for moving content).
      const rows=[0,1].map(row=>{const set=[...chips.slice(row*2%chips.length),...chips.slice(0,row*2%chips.length)];return `<div class="cb-marquee-row"><div class="cb-marquee-track">${[0,1].map(copy=>`<div class="cb-marquee-group"${copy?' aria-hidden="true"':''}>${set.map(c=>`<span>${esc(c)}</span>`).join('')}</div>`).join('')}</div></div>`;}).join('');
      return `<div class="cb-marquee-rows" tabindex="0" aria-label="${esc(chips.join(', '))}. Focus to pause the animation.">${rows}</div>`;
    },
  },
};
export const GRAPHIC_GROUPS=[
  ['Audience pages',['triage','whitelabel','chat','brandchat','benefit','map','ehr','place','insight','data','program','calendar']],
  ['Alternates',['marquee']],
];

/** One graphic's markup: a wrap (which rises to the tile's bottom edge for phones), the root with the tile's colours, the art. */
export function bentoMarkup(draft){
  const graphic=GRAPHICS[draft.graphic]||GRAPHICS.triage,color=COLORS[draft.color]||COLORS.blue;
  // The root is the size container; the graphic's layout lives one level in.
  return `<div class="cb-wrap${graphic.bleed?' is-bleed':''}${graphic.bound?' is-bound':''}"><div class="cb" data-graphic="${esc(draft.graphic)}" style="${tileVars(color)}"><div class="cb-art cb-${esc(draft.graphic)}">${graphic.markup({...graphic.defaults,...draft})}</div></div></div>`;
}
