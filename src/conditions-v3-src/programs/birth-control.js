// Live copy: https://www.counselhealth.com/conditions/birth-control (2026-10-06).
// Structure: Weight Management V3 (Hunter, Oct 6). New copy is marked "drafted".
import {LIVE,STEPS_HEADING,STEPS_INTRO,startSteps,heroPoints,ONGOING_HEADING,checkIn,PHYSICIANS,counselPricing,RX_PRICE_NOTE,CLOSING_BODY,PEOPLE,rxImage} from './shared.js';

const START='https://app.counselhealth.com/start?condition=birth-control';
// Short cost lines (Sam, Oct 7) from the live "fully covered" and "prices start around" copy.
const cost=cash=>({insured:'$0 with most plans',cash:`From ${cash}/month*`});

export default {
  slug:'birth-control',name:'Birth control',theme:'green',source:LIVE+'birth-control',
  hero:{
    heading:['Stress-free birth control','with real medical','guidance'],
    // Condensed from the live hero bullets; the third statement shortens the live pricing headline.
    body:'Clear answers and quick birth control care, with ongoing check-ins and treatment guided by your health history.',
    points:heroPoints({icon:'shield',text:'Covered by most plans'}),
    pointsLayout:'row',
    ctas:[{label:'Get started',href:START}],
    // Hunter's couple photo (cut out with macOS Vision), flipped to face the H1.
    figure:{kind:'cutout',src:'/brand/photography/birth-control-couple-hero-cutout-v1.png',alt:'A smiling young couple, one riding piggyback on the other, under a blue sky',flip:true},
  },
  steps:{
    heading:STEPS_HEADING,intro:STEPS_INTRO,
    items:startSteps({fit:'which birth control option would be best suited for your body and lifestyle'}),
    screens:[
      {kind:'ai',question:'I’d like to start birth control.',reply:'Have you used birth control before, and is there a method you’d like to talk about?'},
      {kind:'doctor',question:'I’d like to start birth control.',title:'Your options, explained.',body:'Medical history reviewed. A method chosen with you.'},
      {kind:'rx',name:'Birth control pill',detail:'Prescribed by your care team'},
    ],
  },
  ongoing:{
    heading:ONGOING_HEADING,
    // Drafted from the live FAQ on side effects and switching methods.
    body:'Finding the right birth control can take time. Questions come up. Side effects happen. Methods change. Counsel proactively checks in, so staying on track doesn’t depend on you remembering to follow up.',
    cta:{label:'Get started',href:START},
    chat:checkIn({
      title:'Birth control check-in',
      question:'Quick check-in: how have you been feeling since starting your new pill?',
      reply:'Mostly good, but I’ve had some spotting this month.',
      doctor:'Thanks for flagging that. Spotting can happen in the first few months on a new pill. How many days has it lasted, and have you missed any doses? If it doesn’t settle, we can talk about trying a different option.',
    }),
  },
  pricing:counselPricing({name:'birth control',cta:{label:'Get started',href:START}}),
  treatments:{
    heading:'Birth control options',
    body:'Counsel offers a range of birth control options. Below are some of the most common and cost-effective choices, and you’re always able to select alternative brand-name or generic medications if you prefer.',
    layout:'photo',
    items:[
      {name:'Tri-Lo-Sprintec',image:rxImage('tri-lo-sprintec'),body:'Tri-Lo-Sprintec is a daily birth control pill that uses estrogen and progestin to prevent pregnancy.',details:[['How to use','Take one pill by mouth at the same time daily. Each pack contains 21 active pills and 7 placebo pills.'],['Effectiveness','Over 99% effective with perfect use.']],cost:cost('$10')},
      {name:'Loestrin Fe 1/20',image:rxImage('loestrin'),body:'Loestrin Fe 1/20 is a daily birth control pill that uses estrogen and progestin to prevent pregnancy.',details:[['How to use','Take one pill by mouth at the same time daily. Each pack contains 21 active pills and 7 iron tablets (placebo pills).'],['Effectiveness','Over 99% effective with perfect use.']],cost:cost('$15')},
      {name:'Nuvaring',image:rxImage('nuvaring'),body:'Nuvaring is a flexible vaginal ring that releases estrogen and progestin to prevent pregnancy.',details:[['How to use','Insert the flexible ring into the vagina. It’s worn for three weeks, then removed for one week each month.'],['Effectiveness','Over 99% effective with perfect use.']],cost:cost('$30')},
      {name:'Micronor',image:rxImage('micronor'),body:'Micronor is a daily birth control pill that uses progestin to prevent pregnancy, also called a “mini-pill”.',details:[['How to use','Take one pill by mouth at the same time daily. Each pack contains 28 active pills and no placebo pills.'],['Effectiveness','Over 99% effective with perfect use.']],cost:cost('$10')},
    ],
    // The live "Birth control pills can help with:" band, kept as the section's note.
    result:{label:'Birth control pills can help with',text:'Migraines, acne, PMS, endometriosis, PCOS, period cramps and PMDD.'},
    cta:{label:'Get started',href:START},
    footnote:RX_PRICE_NOTE,
  },
  physicians:PHYSICIANS,
  stories:{
    heading:'Patient stories',
    items:[
      {quote:'Counsel made choosing birth control feel manageable instead of overwhelming. My provider clearly explained the differences between NuvaRing and oral pills.',who:'Female, 20–29 years old'},
      {quote:'So affordable!! Pricing was upfront, with no hidden fees, and getting my prescription through Counsel ended up costing less than my old in-person visits.',who:'Female, 30–39 years old'},
      {quote:'The whole process was incredibly fast. I signed up, met with a provider, and had my prescription filled the same day! Getting birth control through Counsel saved me so much time.',who:'Female, 30–39 years old'},
      {quote:'When I had mild side effects after starting my oral birth control, I easily messaged the care team and got fast and thoughtful guidance.',who:'Female, 20–29 years old'},
      {quote:'I loved how private the experience was! Everything happened online. Counsel made it easy to get NuvaRing while feeling completely heard.',who:'Female, 40–49 years old'},
    ],
  },
  faq:{
    heading:'Your questions, answered',
    items:[
      {question:'How effective is hormonal birth control?',answer:'When used perfectly—meaning no missed pills or delays—hormonal birth control is over 99% effective. With typical use, which accounts for the occasional missed pill or late refill, it’s about 91% effective. Using reminders or longer-acting options can help boost real-world effectiveness.'},
      {question:'How does hormonal birth control prevent pregnancy?',answer:'Hormonal birth control uses hormones similar to those your body already makes to stop ovulation, thicken cervical mucus so sperm can’t reach an egg, and thin the uterine lining. Together, these effects make pregnancy much less likely when used as directed.'},
      {question:'Are there benefits beyond preventing pregnancy?',answer:'Yes. Hormonal birth control is often prescribed to help manage acne, regulate cycles, reduce painful periods, and treat conditions like endometriosis or PCOS. These benefits can be just as important as birth control itself.'},
      {question:'What if I have side effects or want to switch methods?',answer:'Side effects are usually mild and often improve within the first few months. If something doesn’t feel right, you can talk to your Counsel provider about trying a different option.'},
    ],
  },
  closing:{heading:['More than birth control.','Comprehensive support, all in one place.'],body:CLOSING_BODY,cta:{label:'Get started',href:START},photo:PEOPLE.blouseWoman},
};
