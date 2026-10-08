// The Home V13 FAQ's underline geometry, hover focus and type treatment.
// Long run / single knot alternation also holds at the repeating seam.
export const careChevron='<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 5l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export function careRow(title,copy,i){
  return `<div class="ci-item${i===0?' is-open':''}"><button type="button" class="ci-tab" id="care-tab-${i}" role="tab" aria-selected="${i===0}" aria-controls="care-panel-${i}" aria-describedby="care-copy-${i}" tabindex="${i===0?0:-1}"><span class="ci-tab-heading"><span class="ci-tab-label">${title}</span><span class="ci-chevron">${careChevron}</span></span></button><div class="ci-rule" aria-hidden="true"><span class="ci-weave"></span></div><div class="ci-answer" aria-hidden="${i!==0}"${i===0?'':' inert'}><div><p class="ci-tab-copy" id="care-copy-${i}">${copy}</p></div></div></div>`;
}
export function careWeave(width,seed){
  const palette=['blue-2','blue-7','gray-2','green-7','green-3','pink','yellow'];
  let x0=(seed*2654435761)>>>0;
  const rnd=()=>{x0=(x0*1103515245+12345)>>>0;return(x0>>>8)/16777216;};
  const H=3,count=Math.max(1,Math.floor(width/160));
  const weights=Array.from({length:count},()=>.85+rnd()*.3),total=weights.reduce((a,b)=>a+b,0),room=width-count*H;
  const parts=[];let x=0,color=seed%palette.length;
  weights.forEach(weight=>{const len=room*weight/total;parts.push([x,len,palette[color]]);x+=len;color=(color+1)%palette.length;parts.push([x,H,palette[color]]);x+=H;color=(color+1)%palette.length;});
  if(parts.at(-1)[2]===parts[0][2])parts.at(-1)[2]=palette[(seed+1)%palette.length];
  const run=dx=>parts.map(([px,len,c])=>`<rect x="${(px+dx).toFixed(1)}" y="3.5" width="${(len+.6).toFixed(1)}" height="3" fill="var(--${c})"/>`).join('');
  return `<svg width="${width}" height="10" viewBox="0 0 ${width} 10"><g>${run(-width)}${run(0)}${run(width)}</g></svg>`;
}
export function mountCareUnderlines(root){
  const rows=[...root.querySelectorAll('.ci-item')],reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,last=0,active=null;
  const motion=new Map();
  const measure=()=>rows.forEach((row,i)=>{
    const width=Math.max(120,row.clientWidth);
    row.querySelector('.ci-weave').innerHTML=careWeave(width,101+i*13);
    motion.set(row,{width,offset:0,burst:0});
  });
  function tick(now){
    frame=0;if(!active||document.hidden||reduced.matches){last=0;return;}
    const m=motion.get(active),dt=last?Math.min(now-last,80):16;last=now;
    m.offset=(m.offset+(m.width/40000+m.burst*m.width/1400)*dt)%m.width;m.burst*=Math.exp(-dt/480);
    active.querySelector('.ci-weave g')?.setAttribute('transform',`translate(${m.offset.toFixed(2)} 0)`);
    frame=requestAnimationFrame(tick);
  }
  const start=row=>{rows.forEach(r=>r.classList.toggle('is-thread',r===row));active=row;motion.get(row).burst=1;if(!frame)frame=requestAnimationFrame(tick);};
  const stop=row=>{if(active===row){active=null;row.classList.remove('is-thread');cancelAnimationFrame(frame);frame=0;last=0;}};
  measure();new ResizeObserver(measure).observe(root.querySelector('.ci-tabs'));
  rows.forEach(row=>{row.addEventListener('pointerenter',()=>start(row));row.addEventListener('pointerleave',()=>stop(row));row.addEventListener('focusin',()=>start(row));row.addEventListener('focusout',e=>{if(!row.contains(e.relatedTarget))stop(row);});});
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;if(active&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);};
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
}
