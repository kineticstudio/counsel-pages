/* Shared Home V13 FAQ: same woven hover, keyboard behavior and answer timing. */
(function(){
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const chev='<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 5l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function markup(items){
    return items.map((item,i)=>`<details class="ch-q${i===0?' is-open':''}" open${item.id?` id="${esc(item.id)}"`:''}><summary><span class="ch-q-label">${esc(item.question)}</span><span class="chev">${chev}</span></summary><div class="ch-q-rule" aria-hidden="true"><span class="ch-q-weave"></span></div><div class="ch-a"><div><p>${item.answerHTML??esc(item.answer)}${item.pending?'<br><span class="condition-pending">Copy to confirm</span>':''}</p></div></div></details>`).join('');
  }
  function mount(root){
    if(!root)return;
    const C=window.CounselColors;
    const FAQ_THREAD=[C.blue2,C.blue7,C.gray2,C.green7,C.green3,C.pink,C.yellow];
    const cleanups=[],reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const on=(target,event,handler)=>{target.addEventListener(event,handler);cleanups.push(()=>target.removeEventListener(event,handler));};
  /* one question open at a time, each with its own weave; the class does
     the opening so shutting can animate too */
  const qs = [...root.querySelectorAll('.ch-q')];
  // Hunter, 2026-09-10: expose the same selected state to keyboard and screen readers.
  const syncFaq = () => qs.forEach(d => {
    const open = d.classList.contains('is-open');
    d.querySelector('summary').setAttribute('aria-expanded', String(open));
    d.querySelector('.ch-a').setAttribute('aria-hidden', String(!open));
    d.querySelector('.ch-a').inert = !open;
    d.querySelector('.ch-a').tabIndex = open ? 0 : -1;
  });
  syncFaq();
  // Hunter, 2026-09-10, pjlhctjg: tap/click or Enter/Space closes an
  // answer. Hover indicates the target but never dismisses text being read.
  qs.forEach(d => {
    const answer = d.querySelector('.ch-a'), summary = d.querySelector('summary');
    answer.setAttribute('role', 'button');
    answer.setAttribute('aria-description', 'Activate to close this answer.');
    const close = () => {
      d.classList.remove('is-open', 'is-thread'); syncFaq();
      summary.focus({preventScroll: true});
    };
    on(answer,'click', e => {
      if (e.target.closest('a, button') || window.getSelection()?.toString()) return;
      close();
    });
    on(answer,'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); }
    });
  });
  // the weave drawn per question at its real width: runs of the thread's
  // colours all at the line's own height, in lengths from a single square
  // to a long stretch, with small breaks between them, so the shortest
  // runs read as the squares the brand book shows (Hunter, 2026-09-09)
  function weaveSvg(width, seed) {
    let x0 = (seed * 2654435761) >>> 0;
    const rnd = () => { x0 = (x0 * 1103515245 + 12345) >>> 0; return (x0 >>> 8) / 16777216; };
    // Hunter, 2026-09-15: alternate one long run with one square. This
    // also guarantees a long separator across the repeating pattern seam.
    const H = 3, parts = [], count = Math.max(1, Math.floor(width / 160));
    const weights = Array.from({length:count}, () => .85 + rnd() * .3);
    const total = weights.reduce((a,b) => a+b, 0), room = width-count*H;
    let x = 0, color = seed % FAQ_THREAD.length;
    weights.forEach(weight => {
      const length = room*weight/total;
      parts.push([x, length, FAQ_THREAD[color]]); x += length;
      color = (color+1) % FAQ_THREAD.length;
      parts.push([x, H, FAQ_THREAD[color]]); x += H;
      color = (color+1) % FAQ_THREAD.length;
    });
    if (parts.at(-1)[2] === parts[0][2]) parts.at(-1)[2] = FAQ_THREAD[(seed+1) % FAQ_THREAD.length];
    // the pattern three times over, side by side, so it can travel to the right and wrap without a seam
    const run = (dx) => parts.map(([px, len, c]) => `<rect x="${(px + dx).toFixed(1)}" y="3.5" width="${(len + 0.6).toFixed(1)}" height="${H}" fill="${c}"/>`).join('');
    return `<svg width="${width}" height="10" viewBox="0 0 ${width} 10"><g class="run">${run(-width)}${run(0)}${run(width)}</g></svg>`;
  }
  // the weave moves only under the cursor, and always to the right: a quick
  // run when the cursor arrives or the question opens, easing into a slow
  // drift while the cursor stays; still otherwise (Hunter, 2026-09-09)
  const motion = { raf: 0, last: 0, items: new Map() };
  function weaveTick(now) {
    const dt = motion.last ? Math.min(now - motion.last, 80) : 16;
    motion.last = now;
    let any = false;
    motion.items.forEach((m, d) => {
      if (!m.hover) return;
      any = true;
      const W = m.w;
      m.off = (m.off + (W / 40000 + m.burst * (W / 1400)) * dt) % W;
      m.burst *= Math.exp(-dt / 480);
      const g = d.querySelector('.ch-q-weave g');
      if (g) g.setAttribute('transform', `translate(${m.off.toFixed(2)} 0)`);
    });
    motion.raf = any ? requestAnimationFrame(weaveTick) : 0;
    if (!any) motion.last = 0;
  }
  function weaveGo(d) {
    const m = motion.items.get(d);
    if (!m) return;
    m.burst = 1;
    if (!reduced.matches && !document.hidden && !motion.raf) { motion.last = 0; motion.raf = requestAnimationFrame(weaveTick); }
  }
  const weaveAll = () => qs.forEach((d, i) => { const sm = d.querySelector('summary'); const w = Math.max(120, sm.clientWidth); d.querySelector('.ch-q-weave').innerHTML = weaveSvg(w, 101 + i * 13); const m = motion.items.get(d); motion.items.set(d, { w, off: 0, burst: 0, hover: m ? m.hover : false }); });
  weaveAll();
  qs.forEach((d) => {
    const sm = d.querySelector('summary');
    const start = () => {
      qs.forEach(q => { q.classList.remove('is-thread'); const other = motion.items.get(q); if (other) other.hover = false; });
      d.classList.add('is-thread'); const m = motion.items.get(d); if (m) m.hover = true; weaveGo(d);
    };
    const stop = () => { d.classList.remove('is-thread'); const m = motion.items.get(d); if (m) m.hover = false; };
    // Hunter, 2026-09-22: keep the question active while reading its answer,
    // including an already-open row; keyboard focus gets the same treatment.
    on(d,'pointerenter', start);
    on(d,'pointerleave', stop);
    on(d,'focusin', start);
    on(d,'focusout', e => { if (!d.contains(e.relatedTarget)) stop(); });
  });
  { let t = 0; on(window,'resize', () => { clearTimeout(t); t = setTimeout(weaveAll, 150); }); }
  qs.forEach((d) => on(d.querySelector('summary'),'click', (e) => {
    e.preventDefault();
    const was = d.classList.contains('is-open');
    qs.forEach((o) => { o.classList.remove('is-open', 'is-thread'); const m = motion.items.get(o); if (m) m.hover = false; });
    if (!was) d.classList.add('is-open');
    if (matchMedia('(hover: hover)').matches && d.matches(':hover')) { d.classList.add('is-thread'); const m=motion.items.get(d); if(m)m.hover=true; weaveGo(d); }
    syncFaq();
  }));


    const pause=()=>{cancelAnimationFrame(motion.raf);motion.raf=0;motion.last=0;if(!reduced.matches&&!document.hidden&&[...motion.items.values()].some(m=>m.hover))motion.raf=requestAnimationFrame(weaveTick);};
    on(document,'visibilitychange',pause);on(reduced,'change',pause);
    return {open(id){const row=qs.find(q=>q.id===id);if(!row)return;qs.forEach(q=>q.classList.toggle('is-open',q===row));syncFaq();},destroy(){cancelAnimationFrame(motion.raf);cleanups.forEach(fn=>fn());}};
  }
  window.CounselFAQComponent={markup,mount};
})();
