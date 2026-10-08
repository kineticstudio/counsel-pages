// Shared closing composition. Conditions can supply their own portrait.
export function closingMarkup(content,cta,{heading=['Improve','access at scale'],body=content.how[0].body,sectionId='improve-access',titleId='closing-title',photo={src:'/brand/photography/counsel-mother-baby-sky-v1.png',alt:'A mother lifting her laughing baby into the air'}}={}){
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  return `<section class="v2-section v2-closing" id="${esc(sectionId)}" aria-labelledby="${esc(titleId)}">
    <div class="channel-wrap"><div class="v2-closing-card" data-counsel-theme="dark">
      <svg class="v2-closing-thread" viewBox="0 0 1280 620" preserveAspectRatio="none" aria-hidden="true">
        <defs><path id="v5-closing-path" pathLength="1000" d="M-60 540C160 455 240 510 440 525S720 565 840 310S1030 65 1210 155S1350 245 1400 200"/></defs>
        <use href="#v5-closing-path" stroke="var(--green-3)"/>
        <use class="v5-closing-band" href="#v5-closing-path" stroke="var(--pink)" stroke-dasharray="340 660" stroke-dashoffset="-260"/>
        <use class="v5-closing-band" href="#v5-closing-path" stroke="var(--yellow)" stroke-dasharray="260 740" stroke-dashoffset="-600"/>
      </svg>
      <div class="v2-closing-photo-clip"><img class="v2-closing-person" src="${esc(photo.src)}" alt="${esc(photo.alt)}" width="1024" height="1024" loading="lazy"></div>
      <div class="v2-closing-copy"><h2 id="${esc(titleId)}">${heading.map(line=>`<span>${esc(line)}</span>`).join(' ')}</h2><p>${esc(body)}</p>${cta(true)}</div>
    </div></div>
  </section>`;
}
