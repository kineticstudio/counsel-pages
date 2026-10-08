// Figma: tN1L2lmqQ51uyl1tqTMRl3 / 40000225:13200, September 23, 2026.
// Exact exported furniture on a responsive, code-built 395 × 736 phone.
const assets='/brand/product-ui/care-phone-v3/';
const asset=(file,className='')=>`<img${className?` class="${className}"`:''} src="${assets}${file}" alt="" draggable="false">`;
export function carePhoneMarkup(panels,{staticScreens=false}={}){
  const portraits=[1,2,3].map(n=>`<span class="cf-avatar cf-avatar-${n}"><span>${asset('doctor-'+n+'.png')}</span></span>`).join('');
  const bannerTag=staticScreens?'div':'button';
  return `<div class="ci-phone cf-phone${staticScreens?' cf-phone-static':''}" data-at="idle" data-counsel-theme="light" role="group" aria-label="Illustrative member experience. Availability shown is an example.">
    <div class="cf-status" role="img" aria-label="9:41. Cellular signal, Wi-Fi and battery indicators.">
      ${asset('time.svg')}<span class="cf-status-icons">${asset('status-icons.svg')}</span>
    </div>
    <div class="cf-nav"><span class="cf-menu" aria-hidden="true">${asset('menu.svg')}</span><span>Get advice</span><span class="cf-profile" aria-hidden="true">${asset('profile.svg')}</span></div>
    <div class="cf-conversation">${panels.map((panel,i)=>`<div class="ci-panel${i===1?' ci-chat-demo':''}" id="care-panel-${i}" role="region" aria-labelledby="care-tab-${i}" tabindex="0" hidden>${panel}</div>`).join('')}</div>
    <div class="cf-composer">
      <${bannerTag} class="cf-doctor-banner"${staticScreens?'':' type="button" aria-controls="care-panel-2"'} aria-describedby="cf-doctor-description">
        <span class="cf-portraits" aria-hidden="true">${portraits}</span><span class="cf-doctor-label">Ask a doctor</span><span class="cf-wait">2 min wait ${asset('chevron.svg')}</span>
      </${bannerTag}>
      <span class="cf-sr" id="cf-doctor-description">A board-certified doctor is available to join this chat in 2 minutes. Illustrative availability, not a live wait time.</span>
      <div class="cf-field" role="img" aria-label="Illustrative message field: Ask anything...">
        <span class="cf-placeholder" aria-hidden="true">Ask anything...</span><span class="cf-attachment" aria-hidden="true">${asset('attachment.svg')}</span><span class="cf-send" aria-hidden="true">${asset('send-arrow.svg')}</span>
      </div>
    </div>
  </div>`;
}

export function mountCarePhone(root=document){
  const phone=root.querySelector('.cf-phone'),host=phone?.closest('.ci-sky');
  if(!host)return;
  const resize=()=>phone.style.setProperty('--care-phone-scale',String(host.getBoundingClientRect().width/395));
  resize();
  const observer=new ResizeObserver(resize);observer.observe(host);
  return ()=>observer.disconnect();
}
