// Fictional, consistent example data. See content/visualization-language-sept23.md.
const ldl = [
  {date:'2026-01-15', value:164},
  {date:'2026-03-15', value:148},
  {date:'2026-05-15', value:128},
  {date:'2026-07-15', value:116},
  {date:'2026-09-15', value:96},
];
const activity = [4200,6100,5800,7600,6900,5200,7600];
const latest = ldl[ldl.length-1];
const average = activity.reduce((total,value)=>total+value,0)/activity.length;
const labelNumber = value=>value.toLocaleString('en-US');

function trend(){
  const firstDate=Date.parse(ldl[0].date), duration=Date.parse(latest.date)-firstDate;
  const y=value=>108-value/200*88;
  const points=ldl.map(({date,value})=>({x:34+(Date.parse(date)-firstDate)/duration*250,y:y(value)}));
  const curve=points.reduce((path,point,index)=>{
    if(!index)return `M${point.x},${point.y}`;
    const previous=points[index-1], middle=(previous.x+point.x)/2;
    return `${path} C${middle},${previous.y} ${middle},${point.y} ${point.x},${point.y}`;
  },'');
  return `<svg class="vh-trend" viewBox="0 0 300 136" aria-hidden="true"><defs><linearGradient id="vh-history-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#E99838" stop-opacity=".65"/><stop offset="1" stop-color="var(--yellow-1)" stop-opacity="0"/></linearGradient></defs><path class="vh-trend-area" d="${curve} L284,108 L34,108 Z" fill="url(#vh-history-fill)"/><path class="vh-trend-line" pathLength="1" d="${curve}" fill="none" stroke="#E99838" stroke-width="2" stroke-opacity=".4"/>${[200,100,0].map(value=>`<text x="2" y="${y(value)+4}" class="vh-axis">${value}</text>`).join('')}${points.map((point,index)=>`<circle class="vh-trend-dot" style="--vh-index:${index}" cx="${point.x}" cy="${point.y}" r="3.5" fill="var(--blue-9)"/>`).join('')}<text x="34" y="132" class="vh-axis">Jan</text><text x="284" y="132" text-anchor="end" class="vh-axis">Sep</text></svg>`;
}

export function contextGraphic(){
  const summary=`Illustrative health history, not actual patient results. LDL cholesterol: January 164, March 148, May 128, July 116, September 96 milligrams per deciliter in 2026. The latest result is 96 on a 0 to 200 scale; general adult reference below 100. Activity September 14 to 20: ${activity.map(labelNumber).join(', ')} steps, Monday through Sunday. Daily average ${labelNumber(average)} steps.`;
  return `<div class="v2-health-history" role="img" aria-label="${summary}"><div class="vh-scene" aria-hidden="true">
    <svg class="vh-weave" viewBox="0 0 600 600" preserveAspectRatio="none" fill="none" stroke-width="7"><defs><path id="vh-context-weave-path" pathLength="1000" d="M-100 160C-10 168 2 317 151 324S321 253 411 278S551 328 700 413"/></defs><use href="#vh-context-weave-path" stroke="var(--green-3)"/><use class="vh-color-block" href="#vh-context-weave-path" stroke="var(--pink)" stroke-dasharray="340 660" style="--vh-offset:-260"/><use class="vh-color-block" href="#vh-context-weave-path" stroke="var(--yellow)" stroke-dasharray="260 740" style="--vh-offset:-600"/></svg>
    <div class="vh-card vh-history-card"><div class="vh-card-head"><span>LDL history</span><span class="vh-date">2026</span></div><div class="vh-history-unit">mg/dL</div>${trend()}</div>
    <div class="vh-card vh-result-card"><div class="vh-card-head"><span>LDL Cholesterol</span><time class="vh-date" datetime="2026-09-15">Sep 2026</time></div><div class="vh-reading"><span class="vh-value">${latest.value}</span><span class="vh-unit">mg/dL</span></div><div class="vh-range"><span class="vh-range-reference"></span><span></span><span></span><i class="vh-range-dot" style="--vh-marker:${latest.value/200*100}%"></i></div><div class="vh-range-axis"><span>0</span><span>100</span><span>200</span></div><div class="vh-reference">General reference &lt;100</div></div>
    <div class="vh-card vh-activity-card"><div class="vh-card-head"><span>Daily steps</span><span class="vh-date">Sep 14–20</span></div><div class="vh-reading"><span class="vh-value">${labelNumber(average)}</span><span class="vh-unit">avg / day</span></div><div class="vh-bars">${activity.map((value,index)=>`<div class="vh-bar-column" style="--vh-index:${index}"><div class="vh-bar-track"><i class="vh-bar ${index===6?'is-highlighted':''}" style="height:${value/8000*100}%"></i></div><span>${['M','T','W','T','F','S','S'][index]}</span></div>`).join('')}</div></div>
  </div></div>`;
}
