// Counsel's shared, low-contrast button sweep. Leave other clients' motion alone.
const mix=(from,to,amount)=>'#'+[1,3,5].map(i=>{
  const a=parseInt(from.slice(i,i+2),16),b=parseInt(to.slice(i,i+2),16);
  return Math.round(a+(b-a)*amount).toString(16).padStart(2,'0');
}).join('');

export function counselButtonSweep({light=false,base}={}){
  const C=window.CounselColors;
  const rest=base||(light?C.gray1:C.blue9);
  return {
    pass:[light?mix(rest,C.blue2,.32):C.blue8],
    settle:rest,
    duration:750,
    stagger:220,
    arrow:false,
    radius:false,
  };
}
