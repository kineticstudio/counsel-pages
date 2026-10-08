import {careChevron} from '../channel-v2-src/care-accordion.js';
import {carePhoneMarkup,mountCarePhone} from '../ui-src/counsel-care-phone.js';
export {embeddedGraphic} from '../channel-v2-src/embedded-app.js';
export {contextGraphic} from '../channel-v2-src/context-history.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=paths=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
export const scopeIcon=index=>svg([
  '<path d="M5 3v5a5 5 0 0 0 10 0V5M3 3h4m6 0h4M10 13v5a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="3"/>',
  '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  '<path d="M9 3h6M10 3v7L4 19a1.3 1.3 0 0 0 1 2h14a1.3 1.3 0 0 0 1-2l-6-9V5M7 16h10"/><circle cx="12" cy="13" r=".5"/>',
  '<path d="M3 6c3-4 6 4 9 0s6 4 9 0M3 12c3-4 6 4 9 0s6 4 9 0M3 18c3-4 6 4 9 0s6 4 9 0"/>',
][index]);
export const titleCase=value=>value.replace(/\b[a-z][a-z-]*/gi,word=>word.toLowerCase()==='covid-'?'COVID-':word.toUpperCase()==='STD'?'STD':word.charAt(0).toUpperCase()+word.slice(1).toLowerCase());
export const planLogo=()=>`<span class="v2-plan-brand">${svg('<path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7Z" fill="currentColor" stroke="none"/>')}Your logo</span>`;
// Same question / top weave / closeable answer structure as the Home V13 FAQ.
const careRow=(title,copy,i)=>`<div class="ci-item"><button type="button" class="ci-tab" id="care-tab-${i}" aria-expanded="false" aria-controls="care-answer-${i} care-panel-${i}"><span class="ci-tab-heading"><span class="ci-tab-label">${title}</span><span class="ci-chevron">${careChevron}</span></span></button><div class="ci-rule" aria-hidden="true"><span class="ci-weave"></span></div><div class="ci-answer" id="care-answer-${i}" aria-hidden="true" inert><div><p class="ci-tab-copy">${copy}</p></div></div></div>`;
export function integrationMarkup(content,portraits){
  const titles=['Start with a question','Talk it through','Bring in a doctor','Pick up where you left off'];
  const descriptions=[
    'Members type what’s on their mind into a familiar chat interface, right inside your app.',
    'Counsel AI asks follow-up questions to understand symptoms and provide guidance.',
    'Members can tap “Ask a doctor” to connect with a board-certified physician.',
    'Members can return to their treatment plan, check prescriptions, and follow up with their care team.',
  ].map(esc);
  const question='<p class="ci-message">I have a rash on my arm and wondering what I should do</p>';
  const team=`<span class="ci-static-team" aria-hidden="true">${portraits.map(src=>`<img src="${src}" alt="" loading="lazy">`).join('')}</span>`;
  const reply='Is it more itchy, or painful and tender to touch? And do you notice any warmth in the area or have you had any fever or chills?';
  const thinking=`<span class="ci-thinking" aria-hidden="true">${'<i></i>'.repeat(9)}</span>`;
  const panels=[
    `<div class="ci-static-screen ci-static-question"><span class="ci-static-date">Today</span><div class="ci-floating-card"><p>I have a rash on my arm and wondering what I should do</p></div></div>`,
    `<div class="ci-static-screen ci-static-guidance"><span class="ci-static-date">Today</span>${question}<div class="ci-floating-card"><div class="ci-ai-heading">${thinking}<span class="ci-static-eyebrow">Counsel AI</span></div><p>${reply}</p></div></div>`,
    `<div class="ci-static-screen ci-static-doctor"><span class="ci-static-date">Your care team</span>${question}<div class="ci-floating-card">${team}<h3>Ask a doctor</h3><p>Connect with a board-certified physician</p></div></div>`,
    `<div class="ci-static-screen ci-static-history"><span class="ci-static-date">Your care plan</span><p class="ci-static-greeting">Your next step.</p><div class="ci-floating-card"><div class="ci-prescription-meta"><span class="ci-prescription-label"><span class="ci-rx-mark" aria-hidden="true">℞</span> Prescription</span><span class="ci-prescription-status">Sent to pharmacy</span></div><div class="ci-prescription-medication"><h3>Topical cream</h3><p>Prescribed by your care team</p></div><div class="ci-prescription-pharmacy">${svg('<path d="M4 21V7l8-4 8 4v14M2 21h20M9 21v-6h6v6M9 9h6m-3-3v6"/>')}<div><strong>Your preferred pharmacy</strong><p>We’ll notify you when it’s ready for pickup.</p></div></div><span class="ci-prescription-action">${svg('<path d="M14 2H5v20h14V7zM14 2v5h5M8 12h8m-8 4h6"/>')}View prescription</span></div></div>`,
  ];
  return `<section class="v2-section v2-integration" aria-labelledby="integration-title"><div class="channel-wrap ci-experience"><div class="ci-copy"><div class="v2-heading"><h2 id="integration-title">${esc(content.integration.heading)}</h2><p class="ci-intro">${esc(content.how[0].body)}</p></div><div class="ci-tabs" role="group" aria-label="Explore the member experience">${titles.map((title,i)=>careRow(esc(title),descriptions[i],i)).join('')}</div></div><div class="ci-sky">${carePhoneMarkup(panels,{staticScreens:true})}</div></div></section>`;
}

export function mountCareExperience(root=document){
  mountCarePhone(root);
  const tabs=[...root.querySelectorAll('.ci-tab')], panels=[...root.querySelectorAll('.ci-panel')];
  const device=root.querySelector('.ci-phone');
  let openIndex=null;
  const select=index=>{
    const previousIndex=openIndex;
    openIndex=index;
    tabs.forEach((tab,i)=>{
      const active=i===index;
      tab.setAttribute('aria-expanded',String(active));
      const row=tab.closest('.ci-item'),answer=row.querySelector('.ci-answer');
      row.classList.toggle('is-open',active);
      answer.setAttribute('aria-hidden',String(!active));answer.inert=!active;answer.tabIndex=active?0:-1;
      // Keep only the outgoing and incoming compositions mounted for a crossfade.
      panels[i].hidden=!active&&!(window.gsap&&index!==null&&i===previousIndex);
      panels[i].inert=!active;panels[i].setAttribute('aria-hidden',String(!active));
    });
    if(device) device.dataset.at=index===null?'idle':String(index);
    root.dispatchEvent(new CustomEvent('counsel:care-select',{detail:{index,previousIndex}}));
  };
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>select(openIndex===i?null:i));
    const answer=tab.closest('.ci-item').querySelector('.ci-answer');
    answer.setAttribute('role','button');
    answer.setAttribute('aria-description','Activate to close this answer.');
    answer.tabIndex=-1;
    const close=()=>{select(null);tab.focus({preventScroll:true});};
    answer.addEventListener('click',event=>{
      if(event.target.closest('a,button')||window.getSelection()?.toString())return;
      close();
    });
    answer.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();close();}
    });
    tab.addEventListener('keydown',event=>{
      let next;
      if(['ArrowDown','ArrowRight'].includes(event.key)) next=(i+1)%tabs.length;
      if(['ArrowUp','ArrowLeft'].includes(event.key)) next=(i+tabs.length-1)%tabs.length;
      if(event.key==='Home') next=0;
      if(event.key==='End') next=tabs.length-1;
      if(next!==undefined){event.preventDefault();tabs[next].focus();}
    });
  });
  select(0);
  const closing=root.querySelector('.v2-closing-card'),stage=document.getElementById('stage');
  if(closing&&stage){
    const bleed=()=>closing.style.setProperty('--closing-bleed',Math.max(0,stage.getBoundingClientRect().right-closing.getBoundingClientRect().right)+'px');
    bleed();const resize=new ResizeObserver(bleed);resize.observe(stage);resize.observe(closing);
  }
}
