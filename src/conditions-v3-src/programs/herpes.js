// Live copy: https://www.counselhealth.com/conditions/herpes,
// /cold-sores and /genital-herpes (2026-10-06). Herpes is the hub with two
// calls to action; the other two are single-path variants of the same page.
// Structure: Weight Management V3 (Hunter, Oct 6). New copy is marked "drafted".
import {LIVE,STEPS_HEADING,STEPS_INTRO,startSteps,heroPoints,FROM_29,ONGOING_HEADING,checkIn,PHYSICIANS,CLOSING_BODY,PEOPLE,SKIN_STORIES,HERPES_FAQ,HERPES_TREATMENTS,counselPricing} from './shared.js';

const GENITAL='https://app.counselhealth.com/chat?view=catalog&condition=genital-herpes';
const ORAL='https://app.counselhealth.com/chat?view=catalog&condition=oral-herpes';
const cutout=n=>`/brand/photography/${n}`;

function program({slug,name,heading,ctas,figure,request,checkin,faqScope,faqCure,once,closingPhoto}){
  return {
    slug,name,theme:'lime',source:LIVE+slug,
    hero:{
      heading,
      // Condensed from the live hero bullets, which all three pages share.
      body:'Get real results from proven medications, with treatment guided by your health history and unlimited support through ongoing check-ins.',
      points:heroPoints(FROM_29),pointsLayout:'row',ctas,figure,
    },
    steps:{
      heading:STEPS_HEADING,intro:STEPS_INTRO,items:startSteps(),
      screens:[
        {kind:'ai',question:request,reply:'Have you been diagnosed before, and how often do outbreaks happen?'},
        {kind:'doctor',question:request,title:'Your plan, physician-led.',body:'Medical history reviewed. Private, judgment-free care.'},
        {kind:'rx',name:'Valacyclovir 500 mg',detail:'Prescribed by your care team'},
      ],
    },
    ongoing:{
      heading:ONGOING_HEADING,
      // Drafted from the live FAQ on outbreaks, daily suppressive therapy and partners.
      body:'Managing herpes is ongoing. Questions come up. Outbreaks happen. Plans change. Counsel proactively checks in, so staying on track doesn’t depend on you remembering to follow up.',
      ctas,chat:checkIn({title:'Outbreak check-in',...checkin}),
    },
    pricing:counselPricing({name:name.toLowerCase(),ctas}),
    treatments:{...HERPES_TREATMENTS(once),ctas},
    physicians:PHYSICIANS,
    stories:{heading:'Fewer outbreaks and peace of mind',items:SKIN_STORIES},
    faq:{heading:'Your questions, answered',items:HERPES_FAQ(faqScope,faqCure)},
    closing:{heading:['Feel your best.','Comprehensive support, all in one place.'],body:CLOSING_BODY,ctas,photo:closingPhoto},
  };
}

export const herpes=program({
  slug:'herpes',name:'Herpes',
  heading:['Your health, simplified.','Effective herpes','treatment.'],
  ctas:[{label:'Treat genital herpes',href:GENITAL},{label:'Treat cold sores',href:ORAL,secondary:true}],
  // Brand photo (man in a tan sweater), cut out with macOS Vision; he faces forward.
  figure:{kind:'cutout',src:cutout('herpes-man-hero-cutout-v1.webp'),alt:'A calm man in a tan sweater with one hand on his chest'},
  request:'I’d like help managing herpes outbreaks.',
  checkin:{
    question:'Quick check-in: how have outbreaks been since you started treatment?',
    reply:'Better. I had one last week, but it cleared up faster.',
    doctor:'That’s good to hear. Antivirals can make outbreaks shorter and milder. If they’re still coming often, we can talk about taking medication daily to help prevent them.',
  },
  faqScope:'herpes',faqCure:'either oral herpes (HSV-1) or genital herpes (HSV-2)',
  closingPhoto:PEOPLE.sweatshirtWoman,
});
export const coldSores=program({
  slug:'cold-sores',name:'Cold sores',
  heading:['Your health, simplified.','Effective treatment','for cold sores.'],
  ctas:[{label:'Get started',href:ORAL}],
  // Brand photo (cyclist), cut out with macOS Vision and flipped to face the H1.
  figure:{kind:'cutout',src:cutout('cold-sores-cyclist-hero-cutout-v1.webp'),alt:'A smiling cyclist in a helmet and sunglasses',flip:true},
  request:'I’d like treatment for cold sores.',
  checkin:{
    question:'Quick check-in: how have cold sores been since you started treatment?',
    reply:'I felt a tingle on my lip this morning.',
    doctor:'Thanks for flagging it early. Starting your medication at the first tingle can help it heal faster. If cold sores keep coming back, we can talk about a daily option to help prevent them.',
  },
  faqScope:'oral herpes',faqCure:'oral herpes (HSV-1)',once:'500 mg orally, once daily',
  closingPhoto:PEOPLE.greenShirtMan,
});
export const genitalHerpes=program({
  slug:'genital-herpes',name:'Genital herpes',
  heading:['Your health, simplified.','Effective treatment','for genital herpes.'],
  ctas:[{label:'Get started',href:GENITAL}],
  // Skin Care V2's prefooter portrait, flipped to face the H1.
  figure:{kind:'cutout',src:PEOPLE.blouseWoman.src,alt:PEOPLE.blouseWoman.alt,flip:true},
  request:'I’d like treatment for genital herpes.',
  checkin:{
    question:'Quick check-in: how have you been feeling since starting treatment?',
    reply:'Good overall, but I’m worried about passing it to my partner.',
    doctor:'That’s a really common question. Taking an antiviral every day can significantly lower the chance of passing the virus to a partner. Let’s talk through whether daily treatment makes sense for you.',
  },
  // The live page's Acyclovir line reads "400mg"; the shared "400 mg" is kept.
  faqScope:'genital herpes',faqCure:'genital herpes (HSV-2)',
  closingPhoto:PEOPLE.capMan,
});
export default herpes;
