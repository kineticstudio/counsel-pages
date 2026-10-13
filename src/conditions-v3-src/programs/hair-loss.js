// Live copy: https://www.counselhealth.com/conditions/hair-loss (2026-10-06).
// Structure: Weight Management V3 (Hunter, Oct 6). New copy is marked "drafted".
import {LIVE,STEPS_HEADING,STEPS_INTRO,startSteps,heroPoints,ONGOING_HEADING,checkIn,PHYSICIANS,counselPricing,RX_PRICE_NOTE,CLOSING_BODY,PEOPLE,HAIR_STORIES,rxImage} from './shared.js';

const START='https://app.counselhealth.com/start?condition=male-hair-loss';

export default {
  slug:'hair-loss',name:'Hair loss',theme:'blue',source:LIVE+'hair-loss',
  hero:{
    heading:['Prescription hair loss','treatments. Affordable.','No Surprises.'],
    // Condensed from the live hero bullets; the third statement is the second bullet.
    body:'An AI-powered assessment reviewed by a doctor, included in one simple fee, with ongoing adjustments and support throughout your treatment.',
    points:heroPoints({icon:'pharmacy',text:'Options from $4/month'}),
    pointsLayout:'row',
    ctas:[{label:'Get started',href:START}],
    // Brand photo 11 (hiker), cut out with macOS Vision; he already faces the H1.
    figure:{kind:'cutout',src:'/brand/photography/hair-loss-hiker-hero-cutout-v1.webp',alt:'A man with a hiking pack checking his phone outdoors'},
  },
  steps:{
    heading:STEPS_HEADING,intro:STEPS_INTRO,
    items:startSteps({fit:'which hair loss treatment options would be best suited for your body and lifestyle',start:'Start your hair loss treatment'}),
    screens:[
      {kind:'ai',question:'I’d like to treat my thinning hair.',reply:'When did you first notice thinning, and where is it most noticeable?'},
      {kind:'doctor',question:'I’d like to treat my thinning hair.',title:'Your plan, physician-led.',body:'Photos and history reviewed. Treatment tailored to you.'},
      {kind:'rx',name:'Finasteride 1 mg',detail:'Prescribed by your care team'},
    ],
  },
  ongoing:{
    heading:ONGOING_HEADING,
    // Sam at Counsel, Oct 13.
    body:'Treatment takes time, so knowing what’s normal matters. Questions come up. Shedding happens. Plans change. Counsel proactively checks in, so staying on track doesn’t depend on you remembering to follow up.',
    cta:{label:'Get started',href:START},
    // Sam at Counsel, Oct 13: Counsel AI answers and asks a follow-up, the
    // member replies, and Counsel AI closes. No doctor in this chat.
    chat:checkIn({
      title:'Hair loss check-in',
      question:'Quick check-in: how has your hair been since you started treatment?',
      reply:'I think I’m shedding more than before. Is that normal?',
      handoff:'Good question. A short shedding phase in the first few weeks is common, as older hairs make way for new growth. Are you noticing additional thinning, or is the shedding concentrated in one place?',
      followUp:[
        {from:'member',text:'I’ve just noticed more hair on my pillow in the morning.'},
        {from:'ai',text:'Ok that’s totally normal, even though it can feel concerning. I will check in again in a month, but I’m here if you need anything before then.'},
      ],
    }),
  },
  pricing:counselPricing({name:'hair loss',cta:{label:'Get started',href:START}}),
  treatments:{
    heading:'Treatment options',
    body:'Counsel offers a range of hair loss treatments online. Below are some of the most common and cost-effective choices for men, and you’re always able to select alternative brand-name or generic medications if you prefer.',
    items:[
      {name:'Finasteride',image:rxImage('finasteride'),body:'Generic Finasteride treats male pattern hair loss, especially near the temple area of the scalp. This medication decreases DHT, which is the hormone tied to hair loss in males.',details:[['Results','65% of men notice visible regrowth and up to 90% notice slowed or halted hair loss'],['Application','1 tablet, 1 time per day']],cost:{insured:'$10-40/month with most plans',cash:'From $15/month*'}},
      // Short cost lines (Sam, Oct 7): the live line said Minoxidil is usually covered only with an underlying condition.
      {name:'Minoxidil',image:rxImage('minoxidil'),body:'Topical Minoxidil is used to treat some kinds of hereditary hair loss, including male pattern baldness. It comes as a gel or foam and works by extending the growth phase of hair follicles.',details:[['Results','70% of men notice some improvement and is particularly helpful for crown thinning'],['Application','Topical foam applied twice daily']],cost:{insured:'Generally not included',cash:'From $11/month*'}},
    ],
    cta:{label:'Get started',href:START},
    footnote:RX_PRICE_NOTE,
  },
  physicians:PHYSICIANS,
  stories:{heading:'Results that speak for themselves',items:HAIR_STORIES},
  faq:{
    heading:'Your questions, answered',
    items:[
      {question:'What causes hair loss in men?',answer:'Most hair loss in people assigned male at birth is driven by a hormone called dihydrotestosterone (DHT). Over time, DHT can cause hair follicles to shrink, which gradually leads to thinning and visible loss. Genetics play a major role as well; if a parent or grandparent experienced hair loss, there’s a higher chance you will, too. Ethnicity can influence risk as well, male pattern hair loss is more common among White and Afro-Caribbean individuals and less common among people of Asian descent. Age is another key factor. It’s normal for those AMAB to notice more shedding or scalp changes as they get older, and about half of men see some degree of hair loss by age 50. Hair can also fall out after the body goes through a major stressor. This temporary shedding, known as telogen effluvium, can follow an illness, significant life event, or other intense shock to the system. And beyond all of that, certain conditions like thyroid disorders, high stress, chemotherapy, or medications such as blood thinners may also contribute to hair thinning or loss.'},
      {question:'How effective are the prescription treatments?',answer:'Most evidence-based hair loss treatments work well when used consistently. Medications like Finasteride and Minoxidil, when used as directed, are clinically proven to slow down shedding, strengthen existing hair, and, for many men, stimulate regrowth. Effectiveness varies from person to person, but most patients see meaningful improvement over time, especially when treatment starts early. The key is staying consistent. Hair grows slowly, and the benefits build gradually.'},
      {question:'How long does it take to reverse hair loss?',answer:'Hair growth is gradual. Many men start noticing early improvements, like less shedding or thicker strands, within 3 to 6 months. More visible regrowth can take 6 to 12 months or longer, depending on the person. Because hair follicles work in cycles, it takes time for new, healthier hairs to grow in. The important part is staying consistent with your treatment plan.'},
      {question:'What are common side effects from hair loss treatment?',answer:'Most people tolerate hair loss medications well, but mild side effects can happen. Topical treatments, such as Minoxidil, may cause temporary scalp irritation or dryness. Oral medications, like Finasteride can occasionally lead to sexual side effects, though these are uncommon. Some people also experience a brief “shedding phase” in the first few weeks as older hairs make way for new growth. If side effects show up or feel concerning, a clinician can help adjust your plan so treatment stays both safe and effective.'},
      {question:'Who is eligible for these prescription hair loss treatments?',answer:'Prescription hair loss treatments from Counsel are currently available for adult men (ages 18+). During your online consultation, a Counsel doctor will review your health history, medications, and prior interactions to determine eligibility and recommend a personalized treatment designed for you.'},
      {question:'How long does it take to get an online hair loss prescription?',answer:'You can start a conversation with Counsel’s medical AI anytime. If you’re eligible for hair loss treatment, one of our in-house doctors will walk you through your personalized plan and provide a prescription online during the consultation.'},
      {question:'Do I need to stay on prescription treatment long term?',answer:'Most prescription hair loss treatments work only while you continue using them. Your online doctor can help you understand what long-term maintenance looks like for your situation and help adjust your plan over time.'},
    ],
  },
  closing:{heading:['More than hair loss care for men.','Comprehensive support, all in one place.'],body:CLOSING_BODY,cta:{label:'Get started',href:START},photo:PEOPLE.capMan},
};
