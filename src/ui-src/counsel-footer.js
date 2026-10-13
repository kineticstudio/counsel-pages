/* The Home V13 footer is the shared source for every full Counsel page. */
(function(){
  if(window.CounselFooter)return;
  const arrow='<svg viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const lock='<svg viewBox="0 0 16 16" fill="none" aria-hidden><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.5a3.33 3.33 0 0 0-3.33 3.33v1.22A2.5 2.5 0 0 0 2.67 8.5v3.67a2.5 2.5 0 0 0 2.5 2.5h5.66a2.5 2.5 0 0 0 2.5-2.5V8.5a2.5 2.5 0 0 0-2-2.45V4.83A3.33 3.33 0 0 0 8 1.5Zm2.33 4.5V4.83a2.33 2.33 0 1 0-4.66 0V6h4.66ZM8 8.83c.28 0 .5.23.5.5v2a.5.5 0 0 1-1 0v-2c0-.27.22-.5.5-.5Z" fill="currentColor"/></svg>';
  const cols = [
    { title: 'Who we serve', links: ['Individuals', 'Health plans', 'Health systems', 'Consumer health', 'Employers'] },
    { title: 'Enterprise solutions', links: ['Counsel Studio', 'Request a demo', 'Read the AI Report'] },
    { title: 'Get Counsel', links: ['Get started for free', 'Download the app', 'Sign in', 'Help center'] },
    { title: 'Company and resources', links: ['Blog', 'Newsroom', 'About us', 'Clinical leadership', 'Careers', 'Contact us'] },
  ];
  // Hunter, 2026-09-22: original Simple Icons 13.21.0 brand paths (CC0), replacing hand-drawn approximations.
  const SOCIAL = [
    ['LinkedIn', 'https://www.linkedin.com/company/counselhealth/', "<path d=\"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z\"/>"],
    ['Facebook', 'https://www.facebook.com/counselhealth', "<path d=\"M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z\"/>"],
    ['Instagram', 'https://www.instagram.com/counselhealth/', "<path d=\"M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077\"/>"],
    ['X', 'https://x.com/CounselHealth', "<path d=\"M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z\"/>"],
  ];


  function markup(){return `<footer class="counsel-footer ch-foot" data-counsel-theme="dark" id="footer">
  <div class="ch-wrap">
    <div class="ch-foot-hero">
      <h2 class="ch-rise" style="--d:0">Meet the doctor that's with you for life.</h2>
      <div class="ch-foot-ask ch-rise" style="--d:1">
        <div class="ch-foot-box">
          <svg class="ch-foot-ring" aria-hidden="true"></svg>
          <div class="ch-foot-field"><span class="tokens"></span><span class="ph" aria-hidden="true"><span class="ph-line in">Ask Counsel anything…</span></span><textarea rows="1" placeholder="" aria-label="Ask Counsel a question" aria-describedby="footer-question-note"></textarea><button type="button" class="go" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
        </div>
      </div>
    </div>
    <p class="ch-foot-note" id="footer-question-note" role="status" hidden>This prototype does not send questions. <a href="https://app.counselhealth.com/auth/signUp">Start a conversation on Counsel</a>.</p>
    <div class="ch-foot-cols">
      ${cols.map((c, i) => `<div class="ch-foot-col ch-rise" style="--d:${i + 1}"><h4>${c.title}</h4><ul>${c.links.map((l) => `<li><a href="#"><span>${l}</span>${arrow}</a></li>`).join('')}</ul></div>`).join('')}
    </div>
    <div class="ch-foot-news">
      <p>Sign up for the latest medical news and scientific insights from Counsel.</p>
      <form aria-describedby="footer-news-note"><input type="email" placeholder="Your email" aria-label="Your email"><button type="submit" class="ch-btn ch-btn--light">Sign up</button></form>
    </div>
    <p class="ch-foot-note" id="footer-news-note" role="status" hidden>Your email has not been submitted. <a href="https://www.counselhealth.com/health-plans#emailForm" target="_blank" rel="noopener">Continue on Counsel’s website to sign up</a>.</p>
    <div class="ch-foot-bottom">
      <a class="ch-logo" href="https://counsel.kineticstudio.com/designs/counsel/01-home/Home-Hero-Weave-V13.html" aria-label="Counsel home"><img src="/brand/logo.svg" alt="Counsel"></a>
      <span class="legal"><span>2026 © Counsel Inc.</span><a href="#">HIPAA statement</a><a href="#">Informed consent</a><a href="#">Terms</a><a href="#">Privacy policy</a><a href="#">Status</a></span>
      <span class="social">${SOCIAL.map(([name, href, glyph]) => `<a href="${href}" aria-label="${name}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden>${glyph}</svg></a>`).join('')}</span>
      <span class="secure">${lock} HIPAA compliant &amp; SOC 2 secure</span>
    </div>
  </div>
</footer>`;}
  window.CounselFooter={markup};
})();

// Shared behavior keeps Home's local app preview without sending care input.
window.CounselFooter.mount=function(root=document,{motion=true}={}){
  const footer=root.querySelector('.counsel-footer');
  if(!footer||footer.dataset.mounted)return;
  footer.dataset.mounted='true';
  const site='https://www.counselhealth.com';
  const routes={
    'Individuals':'https://counsel.kineticstudio.com/designs/counsel/01-home/Home-Hero-Weave-V13.html',
    'Health plans':'https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/Health-Plans-V6.html',
    'Health systems':site+'/health-systems','Consumer health':site+'/consumer-health','Employers':site+'/employers',
    'Counsel Studio':site+'/solutions/counsel-studio','Request a demo':site+'/contact-sales','Read the AI Report':site+'/ai-report/llm-as-a-judge',
    'Get started for free':'https://app.counselhealth.com/auth/signUp','Download the app':'https://app.counselhealth.com/download','Sign in':'https://app.counselhealth.com/',
    'Help center':site+'/hipaa-statement','Blog':site+'/blog','Newsroom':site+'/newsroom','About us':site+'/about',
    'Clinical leadership':site+'/clinical-leadership','Careers':'https://jobs.ashbyhq.com/counsel','Contact us':site+'/contact-us',
    'HIPAA statement':site+'/hipaa-statement','Informed consent':site+'/informed-consent','Terms':site+'/terms-of-service','Privacy policy':site+'/privacy-policy','Status':'https://status.counselhealth.com/',
  };
  footer.querySelectorAll('a[href="#"]').forEach(link=>{link.href=routes[link.textContent.trim()]||site;});
  const ask=footer.querySelector('.ch-foot-ask'),svg=ask.querySelector('.ch-foot-ring'),field=ask.querySelector('.ch-foot-field');
  const ta=field.querySelector('textarea'),go=field.querySelector('.go');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),scroller=document.getElementById('stage');
  const colors=['#C5E1ED','#FF93AD','#FADA78','#80C48A','#47AFFF'];
  const NS='http://www.w3.org/2000/svg';
  const ring={paths:[],length:0,segment:0,offset:0,burst:0,last:0,raf:0,visible:false};
  const paint=()=>ring.paths.forEach((path,i)=>{path.style.strokeDashoffset=String(-i*ring.segment-ring.offset);});
  const build=()=>{
    const state=window.__tool?.state,w=field.offsetWidth,h=field.offsetHeight;
    if(!w||!h)return;
    const pad=Math.min(state?.lassoPad||18,w*.04),sw=parseFloat(getComputedStyle(svg).getPropertyValue('--counsel-weave-width'))||state?.thickness||8;
    const cr=parseFloat(getComputedStyle(field).borderTopLeftRadius)||16;
    const W=w+2*pad,H=h+2*pad,r=Math.min(cr+pad,H/2);
    svg.style.setProperty('--thread',sw+'px');
    svg.setAttribute('viewBox',`${-sw/2} ${-sw/2} ${W+sw} ${H+sw}`);
    Object.assign(svg.style,{width:(W+sw)+'px',height:(H+sw)+'px',left:(field.offsetLeft-pad-sw/2)+'px',top:(field.offsetTop-pad-sw/2)+'px'});
    const d=`M ${r} 0 H ${W-r} A ${r} ${r} 0 0 1 ${W} ${r} V ${H-r} A ${r} ${r} 0 0 1 ${W-r} ${H} H ${r} A ${r} ${r} 0 0 1 0 ${H-r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
    const probe=document.createElementNS(NS,'path');probe.setAttribute('d',d);svg.replaceChildren(probe);
    ring.length=probe.getTotalLength();probe.remove();ring.segment=ring.length/colors.length;
    ring.paths=colors.map(color=>{const path=document.createElementNS(NS,'path');path.setAttribute('d',d);path.setAttribute('stroke',color);path.style.strokeDasharray=`${ring.segment} ${ring.length-ring.segment}`;svg.appendChild(path);return path;});
    paint();
  };
  const active=()=>ring.visible&&!document.hidden&&!reduced.matches;
  const tick=now=>{
    ring.raf=0;if(!active()){ring.last=0;return;}
    const dt=ring.last?Math.min(now-ring.last,80):16;ring.last=now;
    ring.offset=(ring.offset+(ring.length/36000+ring.burst*(ring.length/1700))*dt)%ring.length;
    ring.burst*=Math.exp(-dt/520);paint();ring.raf=requestAnimationFrame(tick);
  };
  const sync=()=>{
    cancelAnimationFrame(ring.raf);ring.raf=0;ring.last=0;
    if(reduced.matches)ring.burst=0;
    if(active())ring.raf=requestAnimationFrame(tick);
  };
  if(motion){
  new ResizeObserver(build).observe(field);
  new IntersectionObserver(entries=>{ring.visible=entries[0].isIntersecting;sync();},{root:scroller,threshold:0}).observe(ask);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  document.fonts.ready.then(build);window.addEventListener('resize',build);build();
  }
  const sizeQuestion=()=>{
    field.classList.toggle('has-value',!!ta.value);ta.style.height='28px';
    ta.style.height=Math.min(168,Math.max(28,ta.scrollHeight))+'px';ta.style.overflowY=ta.scrollHeight>168?'auto':'hidden';
  };
  ta.addEventListener('input',sizeQuestion);
  ta.addEventListener('focus',()=>{ask.classList.add('is-focus');if(!reduced.matches)ring.burst=1;});
  ta.addEventListener('blur',()=>ask.classList.remove('is-focus'));
  field.addEventListener('click',event=>{if(!go.contains(event.target))ta.focus();});
  go.addEventListener('mousedown',event=>event.preventDefault());
  const send=()=>{
    if(typeof window.openApp==='function')window.openApp(ta.value);
    else footer.querySelector('#footer-question-note').hidden=false;
  };
  go.addEventListener('click',send);
  ta.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send();}});
  footer.querySelector('.ch-foot-news form').addEventListener('submit',event=>{
    event.preventDefault();footer.querySelector('#footer-news-note').hidden=false;
  });
  if(motion&&!reduced.matches)Promise.all([import('/shared/buttons/thread-sweep.js'),import('./counsel-button-motion.js')]).then(([{attachThreadSweep},{counselButtonSweep}])=>{
    const motion=window.CounselColors?counselButtonSweep({light:true}):{pass:['#E8F1F3'],settle:'#F8F8F6',duration:750,stagger:220,arrow:false,radius:false};
    footer.querySelectorAll('.ch-btn').forEach(button=>attachThreadSweep(button,motion));
  }).catch(()=>{});
};
