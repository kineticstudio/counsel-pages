// Live copy: https://www.counselhealth.com/conditions/acne (2026-10-06).
// Structure: Weight Management V3 (Hunter, Oct 6). New copy is marked "drafted".
import {LIVE,STEPS_HEADING,STEPS_INTRO,startSteps,heroPoints,FROM_29,ONGOING_HEADING,checkIn,PHYSICIANS,counselPricing,CLOSING_BODY,PEOPLE,SKIN_STORIES,rxImage} from './shared.js';

const START='https://app.counselhealth.com/chat?view=catalog&condition=acne';

export default {
  slug:'acne',name:'Acne',theme:'pink',source:LIVE+'acne',
  hero:{
    heading:['Clear skin.','No guesswork.'],
    // Condensed from the live hero bullets.
    body:'Get real results from proven medications, with treatment guided by your health history and unlimited support through ongoing check-ins.',
    points:heroPoints(FROM_29),
    pointsLayout:'row',
    ctas:[{label:'Get started',href:START}],
    // Brand photo 14 (potter), cut out with macOS Vision and flipped to face the H1.
    figure:{kind:'cutout',src:'/brand/photography/acne-potter-hero-cutout-v1.webp',alt:'A smiling young woman in glasses at a potter’s wheel',flip:true},
  },
  steps:{
    heading:STEPS_HEADING,intro:STEPS_INTRO,
    // Sam at Counsel, Oct 13: step 3 names acne.
    items:startSteps({fit:'which treatment options would be best suited for your skin and lifestyle',start:'Start your acne treatment'}),
    screens:[
      {kind:'ai',question:'I’d like help clearing up my acne.',reply:'How long have you had breakouts, and what have you tried so far?'},
      {kind:'doctor',question:'I’d like help clearing up my acne.',title:'Your plan, physician-led.',body:'Medical history reviewed. Treatment tailored to your skin.'},
      {kind:'rx',name:'Your prescription trio',detail:'Prescribed by your care team'},
    ],
  },
  ongoing:{
    heading:ONGOING_HEADING,
    // Drafted from the live FAQ: results take about 12 weeks; dryness and a purge are common.
    body:'Clearing acne takes time. Questions come up. Skin adjusts. Routines change. Counsel proactively checks in, so staying on track doesn’t depend on you remembering to follow up.',
    cta:{label:'Get started',href:START},
    chat:checkIn({
      title:'Skin check-in',
      question:'Quick check-in: how is your skin feeling two weeks into treatment?',
      reply:'It’s dry and peeling, and I had a few new breakouts.',
      doctor:'Thanks for telling me. Dryness and a short flare can happen while your skin adjusts to tretinoin. Let’s look at how often you’re applying it, and whether a moisturizer before and after would help.',
    }),
  },
  pricing:counselPricing({name:'acne',cta:{label:'Get started',href:START}}),
  treatments:{
    heading:'The prescription trio: cleanse, treat, repair',
    body:'Counsel offers a range of acne treatments. Below are some of the most common and cost-effective choices, and you’re always able to select alternative brand-name or generic medications if you prefer.',
    layout:'trio',
    // The live layout pairs each product with the heading's verbs in order.
    items:[
      {step:'Cleanse',name:'Benzoyl Peroxide',image:rxImage('benzoyl-peroxide'),body:'releases oxygen into your pores, which kills the bacteria responsible for breakouts and unclogs pores.'},
      {step:'Treat',name:'Clindamycin',image:rxImage('clindamycin'),body:'is a topical antibiotic that kills the bacteria responsible for breakouts.'},
      {step:'Repair',name:'Tretinoin',image:rxImage('tretinoin-acne'),body:'speeds up your skin’s natural cell turnover, preventing dead cells from clogging your pores.'},
    ],
    result:{label:'Results',text:'This combination often leads to a 50-60% reduction in breakouts by 10-12 weeks.'},
    cta:{label:'Get started',href:START},
    // No cost lines: the live $20 is the average for all three generics together.
    // The live copay line that sat under the old medication card stays as the note.
    footnote:'93% of generic prescriptions have copays of less than $20, with the average generic drug copay around $6.',
  },
  physicians:PHYSICIANS,
  stories:{heading:'Patient stories',items:SKIN_STORIES},
  faq:{
    heading:'Your skin care questions, answered',
    items:[
      {question:'How do prescription medications actually treat acne?',answer:'Most acne is driven by a combination of excess oil, clogged pores, and a bacterium called Cutibacterium acnes. While over-the-counter washes treat the surface, prescription retinoids (like Tretinoin) work at a cellular level to speed up turnover and prevent follicles from becoming blocked in the first place. Antibiotics, on the other hand, directly target the bacterial overgrowth that leads to red, inflamed cysts. Just as genetics play a role in hair loss, they also influence how your pores function, meaning strong topical treatment is often necessary to counteract your skin’s natural tendencies.'},
      {question:'What is the “Tretinoin shed” or “purge”?',answer:'Introducing Tretinoin can cause a temporary flare-up of acne before things get better. This “purge” happens because the medication accelerates your skin’s cell turnover rate, pushing deep-seated oil and dead skin cells to the surface all at once. It typically lasts a few weeks and is actually a sign that the medication is working to clear out micro-comedones (early stage pimples) that were already forming under the surface.'},
      {question:'How long does it usually take to see results?',answer:'Treating acne is a gradual process. Most clinical trials show that significant clearing typically occurs around the 12-week mark. You may notice some reduction in inflammation earlier, but the full cycle of clearing deep congestion takes time. Consistency is vital; skipping doses can reset the timeline and allow the follicle-clogging cycle to restart.'},
      {question:'What are the common side effects of acne treatment?',answer:'It is common to experience dryness, peeling, and increased sun sensitivity as your skin adjusts to the faster exfoliation rate. Just as certain conditions or stressors can affect hair health, environmental factors like cold weather or harsh soaps can exacerbate these side effects. Dermatologists often recommend “sandwiching” the medication between layers of moisturizer to mitigate this irritation without reducing efficacy.'},
    ],
  },
  closing:{heading:['More than skincare.','Comprehensive support, all in one place.'],body:CLOSING_BODY,cta:{label:'Get started',href:START},photo:PEOPLE.sweatshirtWoman},
};
