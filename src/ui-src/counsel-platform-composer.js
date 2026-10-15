/* Hunter's September 22 platform screenshots are the visual authority here.
   This is an illustrative composer, never an input, upload or live availability check. */
(() => {
  const attachment = `<svg class="cp-attachment" viewBox="0 0 24 26" fill="none" aria-hidden="true"><path d="M21.7 14.3 11.2 24a6.6 6.6 0 0 1-9.3-9.3L14.3 2.3a4.4 4.4 0 0 1 6.2 6.2L8.2 20.8a2.2 2.2 0 0 1-3.1-3.1L16.4 6.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const arrow = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20V4M4 12l8-8 8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const chevron = `<svg class="cp-chevron" viewBox="0 0 12 20" fill="none" aria-hidden="true"><path d="m2 2 8 8-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  function normalize({state='available',days='xx'}={}) {
    return {state:['available','after-hours','visit'].includes(state)?state:'available',days:Number.isInteger(days)&&days>=0&&days<=99?String(days):'xx'};
  }
  function forStep(step) {
    // The authored opening says 11pm; the next beat offers a doctor.
    // These are narrative states, not a clock-based availability promise.
    if(step===0)return {state:'after-hours'};
    return step>=2?{state:'visit',days:step>=3?4:7}:{state:'available'};
  }
  function markup(options) {
    const {state,days}=normalize(options), afterHours=state==='after-hours';
    const label=afterHours?'A doctor can join after 8am':'Add a doctor';
    const accessible=state==='visit'?`Ask anything. This visit will remain open for ${days} days.`:`${label}. 2 min wait. Ask anything.`;
    return `<div class="cp-composer" data-state="${state}" role="img" aria-label="Illustrative message field. ${accessible}"><div class="cp-banner" aria-hidden="true"><span class="cp-portraits"></span><span class="cp-banner-label">${label}</span><span class="cp-wait">2 min wait</span>${chevron}</div><div class="cp-field" aria-hidden="true"><span class="cp-placeholder">Ask anything...</span>${attachment}<span class="cp-send">${arrow}</span></div><div class="cp-visit" aria-hidden="true">This visit will remain open for <span class="cp-days">${days}</span> days</div></div>`;
  }
  function sync(element,options) {
    const {state,days}=normalize(options);
    if(element.dataset.state===state&&element.querySelector('.cp-days').textContent===days)return;
    const label=state==='after-hours'?'A doctor can join after 8am':'Add a doctor';
    element.dataset.state=state;
    element.querySelector('.cp-banner-label').textContent=label;
    element.querySelector('.cp-days').textContent=days;
    element.setAttribute('aria-label','Illustrative message field. '+(state==='visit'?`Ask anything. This visit will remain open for ${days} days.`:`${label}. 2 min wait. Ask anything.`));
  }
  window.CounselPlatformComposer=Object.freeze({markup,sync,forStep});
})();
