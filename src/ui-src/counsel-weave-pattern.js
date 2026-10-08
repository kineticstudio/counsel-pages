/* V13 showcase construction: long runs joined by short stitches, never overlaid.
   Geometry only. GSAP owns the animation clock and reduced-motion behavior. */
const NS='http://www.w3.org/2000/svg';
export function createWeavePattern(svg,path,group,{varied=false,focus=null}={}){
  const runs=[
    ['var(--blue-9)',1.2],['var(--green-6)',.42],['var(--bright-blue)',.42],
    ['var(--pink)',.42],['var(--yellow)',.42],['var(--blue-2)',1.8],
  ];
  const stitches=['var(--blue-2)','var(--blue-9)','var(--gray-2)','var(--green-7)','var(--blue-9)'];
  // Seeded variation keeps the composition organic without jumping on resize.
  let seed=137;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const phases=runs.map(()=>varied?random()*Math.PI*2:0);
  if(varied)runs.forEach(run=>{run[1]*=.5+random()*1.1;});
  const pieces=[];
  runs.forEach(([color,weight],i)=>{
    if(i)pieces.push({color:focus&&i===2?'var(--condition-accent)':stitches[i-1],stitch:true,origin:!!focus&&i===2});
    pieces.push({color,weight,phase:i*1.37});
  });
  pieces.forEach(piece=>{
    const el=document.createElementNS(NS,'use');
    el.setAttribute('href','#'+path.id);el.setAttribute('stroke',piece.color);
    el.setAttribute('stroke-linecap','butt');el.setAttribute('vector-effect','non-scaling-stroke');
    el.setAttribute(piece.stitch?'data-weave-stitch':'data-weave-run','');
    if(piece.origin)el.setAttribute('data-weave-origin','');
    group.append(el);piece.el=el;
  });
  return (elapsed=0,moving=true)=>{
    if(!path.getAttribute('d'))return;
    const length=Math.max(1,path.getTotalLength()),matrix=path.getScreenCTM();
    const stroke=parseFloat(getComputedStyle(pieces[0].el).strokeWidth)||8;
    const flow=moving?(elapsed*.001*18/length*1000)%1000:0;
    const phase=elapsed*.001*.45*1.6;
    const weights=runs.map(([,weight],i)=>weight*(1+(moving?.14*.45*Math.sin(phase+(varied?phases[i]:i*1.37)):0)));
    const total=weights.reduce((a,b)=>a+b,0);
    const square=(at)=>{
      const s=(at%1000)/1000*length;
      const a=path.getPointAtLength(Math.max(0,s-.5)),b=path.getPointAtLength(Math.min(length,s+.5));
      const dx=b.x-a.x,dy=b.y-a.y;
      // Condition focus geometry is already in layout pixels. A camera zoom
      // must not resize its stitch independently from the card it becomes.
      const scale=!focus&&matrix?Math.hypot(matrix.a*dx+matrix.c*dy,matrix.b*dx+matrix.d*dy)/Math.max(.001,Math.hypot(dx,dy)):1;
      return stroke/Math.max(.01,scale)/length*1000;
    };
    let sizes=stitches.map(()=>square(flow));
    // Refine physical stitch widths at each join under nonuniform SVG scaling.
    for(let pass=0;pass<2;pass++){
      let at=flow,run=0,tick=0,room=1000-sizes.reduce((a,b)=>a+b,0);
      pieces.forEach(piece=>{if(piece.stitch){sizes[tick]=square(at)*(piece.origin?Math.max(stroke,focus.width)/stroke:1);at+=sizes[tick++];}else at+=room*weights[run++]/total;});
    }
    const room=1000-sizes.reduce((a,b)=>a+b,0);
    let start=flow;
    if(focus){
      let cursor=0,runIndex=0,tickIndex=0;
      for(const piece of pieces){
        const size=piece.stitch?sizes[tickIndex++]:room*weights[runIndex++]/total;
        if(piece.origin){start=focus.at*1000+focus.offset/length*1000-cursor-size/2;break;}
        cursor+=size;
      }
      start=((start%1000)+1000)%1000;
    }
    let at=start,run=0,tick=0;
    pieces.forEach(piece=>{
      const size=piece.stitch?sizes[tick++]:room*weights[run++]/total;
      const pos=at%1000;
      // Explicit tail/head wrap like V13, so no gap or doubled segment at the seam.
      const dash=pos+size<=1000?`0 ${pos} ${size} 1000`:`${pos+size-1000} ${1000-size} ${1000-pos} 1000`;
      piece.el.setAttribute('stroke-dasharray',dash);piece.el.setAttribute('stroke-dashoffset','0');
      at+=size;
    });
  };
}
