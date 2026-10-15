/**
 * Counsel Studio V2 to V4 (Hunter, 2026-10-07): three iterations on V1 that
 * tell the story with squares, simple to complex. This module holds what they
 * share with V1: the live copy (counselhealth.com/solutions/counsel-studio and
 * Counsel's launch post), the white-label phone and its state, and the page
 * chrome. Each version owns its own layout; motion is in animations.js.
 */
import {lucide} from '../ui-src/counsel-icons.js';

export const DEMO='https://www.counselhealth.com/contact-sales';
export const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const COPY={
  hero:{title:'Bring AI-enabled care into your application with Counsel Studio',lede:'Transform health insights into clinical action within your digital experience.'},
  partner:{label:'Trusted by leading organizations',note:'Partner spotlight',quote:'By partnering with Counsel, Oura Members can now access on-demand care that combines medical AI with licensed physicians directly within the Oura App, bridging the gap between health insights and clinical actionability.'},
  demo:{title:'AI-enabled care, white-labeled to your organization',body:'Counsel Studio enables organizations to fully customize the UI/UX, creating brand continuity and an experience that feels native to members.'},
  deploy:{title:'Modernizing your digital application',items:[
    {icon:'tablet-smartphone',text:'Flexible deployment via iFrame, WebView, and APIs, including multi-platform support.'},
    {icon:'waypoints',text:'Modular care pathways aligned to your clinical protocols.'},
    {icon:'blocks',text:'Deep integration with your ecosystem of health solutions and referral networks.'},
  ]},
  outcomesTitle:'Strengthen every layer of your strategy',
  outcomes:[
    {id:'access',title:['Expand access ','at scale'],body:'By providing access to care within your existing platform, you can minimize the risk of unmanaged utilization of consumer AI tools, ensuring patients receive safe care.'},
    {id:'data',title:['Care informed by your ','custom set of data sources'],body:'Counsel Studio seamlessly ingests your proprietary data sources to deliver personalized care experiences for every patient, aligned with your clinical protocols, care pathways, and go-to-market strategy.'},
    // Live copy uses an en dash before "all"; a comma keeps the sentence intact.
    {id:'services',title:['Offer comprehensive care ','in one place'],body:'With Counsel Studio, patients gain access to care, medical advice, labs, specialist referrals, prescriptions, and health insights, all in one unified experience.'},
    {id:'launch',title:['Go live ','in weeks, not years'],body:'Deploy production-ready medical AI without the complexity of building it. Counsel Studio enables you to launch faster while maintaining the highest standards for safety and compliance.'},
  ],
  // V1's drafted heading; the body and both results are from the launch post.
  proof:{title:'Built with you, through the last mile',body:'If you build with Counsel Studio, you’ll work with forward-deployed technical and clinical teams that stay engaged through the last mile of care delivery.',
    stats:[{value:'40%+',caption:'reduction in unnecessary acute care utilization, in one deployment'},{value:'Top decile',caption:'patient satisfaction for wearable-informed care models, in another'}],
    source:'Results from Counsel’s post “Counsel Studio: the next generation of digital healthcare infrastructure.”'},
  audiencesTitle:'Helping organizations across the continuum improve access to care',
  audiences:[
    {name:'Health plans',line:'AI-enabled care that modernizes your digital front door',href:'https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Health-Plans-V6.html'},
    {name:'Health systems',line:'The AI-enabled front door that powers your entire network',href:'https://counsel.kineticstudio.com/?project=counsel&view=page&page=health-systems'},
    {name:'Consumer health',line:'Turn health insights into clinical action',href:'https://counsel.kineticstudio.com/?project=counsel&view=page&page=consumer-health'},
  ],
  cta:'See Counsel Studio in action',
};
export const SOURCES=['Health records','Claims','Wearables','Lab results','Referral network','Formulary'];
export const SERVICES=['Care','Medical advice','Labs','Specialist referrals','Prescriptions','Health insights'];

/* The white-label phone: V1's, so animations.js animateStudioDemo drives it. */
const doctors=(n=3)=>[1,2,3].slice(0,n).map(i=>`<img src="/brand/photography/doctors/counsel-doctor-0${i}.webp" alt="">`).join('');
const thinking=`<span class="sp-thinking" aria-hidden="true">${'<i></i>'.repeat(9)}</span>`;
// Fictional partners, never real logos.
export const BRANDS=[
  {id:'counsel',label:'Counsel',accent:'#132045',soft:'#DFEFF8',mark:'counsel'},
  {id:'teal',label:'Teal partner',accent:'#0E7C66',soft:'#DFF1EC',mark:'circle'},
  {id:'orange',label:'Orange partner',accent:'#C2410C',soft:'#FBE8DC',mark:'square'},
  {id:'violet',label:'Violet partner',accent:'#5B4BDB',soft:'#ECEAFD',mark:'diamond'},
];
const PATHWAYS=['Home page','Medical advice','Urgent care','Chronic conditions'];
const markSvg=shape=>shape==='circle'?'<circle cx="12" cy="12" r="9"/>':shape==='square'?'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/>':'<path d="M12 2.5 21.5 12 12 21.5 2.5 12Z"/>';
const brandMarks=BRANDS.map(brand=>brand.mark==='counsel'?
  `<span class="sp-logo is-counsel" data-brand-mark="${brand.id}"><img src="/brand/logo.svg" alt="Counsel"></span>`:
  `<span class="sp-logo" data-brand-mark="${brand.id}" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor">${markSvg(brand.mark)}</g></svg>Your logo</span>`).join('');
const screens=[
  `<p class="sp-greeting">Good morning.</p><p class="sp-title">How can we help today?</p>
   <div class="sp-composer"><span>Ask anything…</span><b>${lucide('arrow-up')}</b></div>
   <div class="sp-chips"><span>Get medical advice</span><span>Find urgent care</span><span>Manage a condition</span></div>
   <div class="sp-card sp-team"><span class="sp-doctors">${doctors()}</span><span>Your care team</span><small>2 min wait</small></div>`,
  `<p class="sp-member">I’ve had a sore throat for three days. Should I see someone?</p>
   <div class="sp-ai">${thinking}<p>Thanks for telling me. Do you have a fever, or any trouble swallowing or breathing?</p></div>
   <div class="sp-card sp-team"><span class="sp-doctors">${doctors()}</span><span>Ask a doctor</span><small>2 min wait</small></div>`,
  `<div class="sp-ai">${thinking}<p>Based on what you’ve shared, you should be seen today.</p></div>
   <div class="sp-card sp-route"><span class="sp-eyebrow">Recommended</span><strong>Video visit now</strong><small>Board-certified doctor · 2 min wait</small></div>
   <div class="sp-card sp-route"><span class="sp-eyebrow">In network</span><strong>Urgent care nearby</strong><small>1.2 mi · Open until 9 pm</small></div>`,
  `<div class="sp-card sp-trend"><div class="sp-trend-top"><span>Blood pressure</span><small>Last 8 weeks</small></div><strong>121/78</strong><span class="sp-bars" aria-hidden="true">${[7,7,6,6,5,5,4,4].map((n,i)=>`<i style="--n:${n}" data-last="${i===7}"></i>`).join('')}</span></div>
   <div class="sp-ai">${thinking}<p>Your readings are trending down. Your next check-in is Thursday.</p></div>
   <div class="sp-card sp-team"><span class="sp-doctors">${doctors(2)}</span><span>Message your care team</span></div>`,
];
export const phoneMarkup=()=>`<div class="sp-phone" data-brand="counsel" data-path="0" role="img" aria-label="Illustrative app screen: Counsel care inside a partner's own app.">
  <div class="sp-status"><span>9:41</span><i></i></div>
  <div class="sp-bar">${brandMarks}<span class="sp-avatar">${lucide('users')}</span></div>
  <div class="sp-screens">${screens.map((screen,i)=>`<div class="sp-screen" data-screen="${i}"${i?' hidden':''}>${screen}</div>`).join('')}</div>
  <p class="sp-powered">Care powered by <img src="/brand/logo.svg" alt="Counsel"></p>
</div>`;

/* Shared sections. Classes match V1, so its styles and the demo motion apply. */
export const partnerMarkup=()=>`<section class="studio-partner" aria-label="Partner spotlight"><div class="channel-wrap studio-partner-inner">
  <p class="studio-partner-label">${esc(COPY.partner.label)}<span>${esc(COPY.partner.note)}</span></p>
  <img class="studio-partner-logo" src="/brand/partners/oura.svg" alt="Oura" width="198" height="62">
  <p class="studio-partner-quote">${esc(COPY.partner.quote)}</p></div></section>`;
export const demoMarkup=({stage=phoneMarkup(),extra=''}={})=>`<section class="studio-section studio-demo" aria-labelledby="studio-demo-title">
  <div class="channel-wrap studio-demo-grid">
    <div class="studio-demo-copy">
      <h2 id="studio-demo-title">${esc(COPY.demo.title)}</h2>
      <p>${esc(COPY.demo.body)}</p>
      <div class="studio-control"><span class="studio-control-label" id="brand-label">Try a brand</span>
        <div class="studio-swatches" role="radiogroup" aria-labelledby="brand-label">${BRANDS.map((brand,i)=>`<button type="button" role="radio" aria-checked="${i===0}" aria-label="${esc(brand.label)}" data-brand="${brand.id}" style="--swatch:${brand.accent}"></button>`).join('')}</div></div>
      <div class="studio-control"><span class="studio-control-label" id="path-label">Care pathway</span>
        <div class="studio-paths" role="tablist" aria-labelledby="path-label">${PATHWAYS.map((path,i)=>`<button type="button" role="tab" aria-selected="${i===0}" data-path="${i}">${esc(path)}</button>`).join('')}</div></div>
      <div class="studio-actions"><a class="channel-btn light" href="${DEMO}">Request a demo</a></div>
    </div>
    <div class="studio-demo-stage">${stage}</div>
  </div>
  <div class="channel-wrap studio-deploy">
    <h3>${esc(COPY.deploy.title)}</h3>
    <ul>${COPY.deploy.items.map(item=>`<li>${lucide(item.icon)}<p>${esc(item.text)}</p></li>`).join('')}</ul>
  </div>${extra}
</section>`;

/* White-label state; animations.js listens and does the transitions. */
export function wireDemo(){
  const phone=document.querySelector('.sp-phone');if(!phone)return;
  const setBrand=(id,{user=false}={})=>{
    const brand=BRANDS.find(b=>b.id===id);if(!brand)return;
    phone.dataset.brand=id;
    document.querySelectorAll('.studio-swatches button').forEach(button=>button.setAttribute('aria-checked',String(button.dataset.brand===id)));
    document.querySelectorAll('[data-brand-mark]').forEach(mark=>{mark.hidden=mark.dataset.brandMark!==id;});
    phone.dispatchEvent(new CustomEvent('studio:brand',{bubbles:true,detail:{brand,user}}));
  };
  const setPath=(index,{user=false}={})=>{
    const previous=Number(phone.dataset.path);phone.dataset.path=index;
    document.querySelectorAll('.studio-paths button').forEach(button=>button.setAttribute('aria-selected',String(Number(button.dataset.path)===index)));
    document.querySelectorAll('.sp-screen').forEach(screen=>{screen.hidden=Number(screen.dataset.screen)!==index;});
    phone.dispatchEvent(new CustomEvent('studio:path',{bubbles:true,detail:{index,previous,user}}));
  };
  document.querySelectorAll('.studio-swatches button').forEach(button=>button.addEventListener('click',()=>setBrand(button.dataset.brand,{user:true})));
  document.querySelectorAll('.studio-paths button').forEach((button,i,all)=>{
    button.addEventListener('click',()=>setPath(i,{user:true}));
    button.addEventListener('keydown',event=>{const step={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];if(!step)return;event.preventDefault();const next=(i+step+all.length)%all.length;all[next].focus();setPath(next,{user:true});});
  });
  window.CounselStudio={BRANDS,setBrand,setPath,SOURCES,SERVICES};
}

/* Footer and nav. `self` is the page's own path, so the menu's Counsel Studio
   link stays on the version being reviewed. */
export function mountChrome(self,navColors){
  document.querySelector('#studio-footer').innerHTML=window.CounselFooter.markup();
  window.CounselFooter.mount();
  document.querySelectorAll('.counsel-footer a').forEach(link=>{if(link.textContent.trim()==='Health plans')link.href='https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Health-Plans-V6.html';});
  const C=window.CounselColors;
  window.CounselNav?.set({linkSize:22,topPad:140,bottomPad:40,colors:navColors||[C.blue1,C.green1,C.yellow1,C.pink1]});
  const D='/src/03-conditions/';
  const routes={'counsel studio':self,'health plans':'https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Health-Plans-V6.html','weight management':D+'Weight-Management-V3.html','birth control':D+'Birth-Control-V3.html','hair loss':D+'Hair-Loss-V3.html','anti-aging skincare':D+'Anti-Aging-V3.html','acne':D+'Acne-V3.html','herpes':D+'Herpes-V3.html','sign in':'https://app.counselhealth.com/','request a demo':DEMO};
  document.querySelectorAll('.cn-col a,.cn-mlist a').forEach(link=>{const label=link.textContent.trim().toLowerCase();link.href=routes[label]||'https://counsel.kineticstudio.com/?project=counsel&view=page&page='+encodeURIComponent(label.replaceAll(' ','-'));});
  const start=document.querySelector('.cn-mobile .cn-mdemo');if(start){start.textContent='Request a demo';start.href=DEMO;}
}
