// Live copy: https://www.counselhealth.com/conditions/weight-management (2026-10-06).
// Hunter, Oct 6: this page defines every condition page's structure.
// The walkthrough screens are illustrative UI, as in V2.
import {LIVE,STEPS_HEADING,STEPS_INTRO,rxImage,counselPricing} from './shared.js';

const START='https://app.counselhealth.com/auth/signUp?view=intake&condition=weight-management';

export default {
  slug:'weight-management',name:'Weight management',theme:'yellow',source:LIVE+'weight-management',
  hero:{
    heading:['Weight loss care that','doesn’t stop at the','prescription'],
    body:'Starting is easy. We keep you supported through side effects, treatment changes, and everything that comes next.',
    points:[{icon:'stethoscope',text:'Board-certified physicians'},{icon:'question',text:'Answers in minutes'},{icon:'coins',text:'Care starting at $29'}],
    pointsLayout:'row',
    ctas:[{label:'Get started',href:START}],
    // Hunter, Oct 6: no UI in condition heroes, only the person, behind V2's ribbon.
    figure:{kind:'cutout',src:'/brand/photography/weight-management-runner-hero-cutout-v1.png',alt:'A smiling man in a yellow shirt and beige cap running',},
  },
  steps:{
    heading:STEPS_HEADING,intro:STEPS_INTRO,
    items:[
      {title:'Tell us what you’re looking for',body:'Share your goals, medical history and what treatments you’re interested in.'},
      {title:'A doctor builds your plan',body:'A doctor evaluates your information and follows up with any additional questions.'},
      {title:'Discuss your treatment plan',body:'Ask questions and decide with your doctor which treatment makes sense for you.'},
      {title:'Keep the conversation going',body:'Whether it’s a check-in, question, side effect, or dose adjustment, your care continues as your treatment does.'},
    ],
    screens:[
      {kind:'question',text:'I’d like help with weight management.'},
      {kind:'ai',question:'I’d like help with weight management.',reply:'What are your goals, and have you tried any treatments for weight management before?',from:'Your doctor'},
      {kind:'options',question:'Which treatment makes sense for me?',title:'Your treatment plan',body:'Compare options with your doctor before you decide.',options:['Zepbound®','Wegovy®','Foundayo™']},
      {kind:'checkin',title:'How are you feeling?',body:'Share your progress and any questions with your care team.',options:['Discuss my progress','Ask about a dose change']},
    ],
  },
  ongoing:{
    heading:'Care doesn’t stop with the first prescription',
    body:'Weight loss treatment changes over time. Questions come up. Side effects happen. Doses change. Counsel proactively checks in, so staying on track doesn’t depend on you remembering to follow up.',
    cta:{label:'Get started',href:START},
    // Counsel's own live check-in demo, rebuilt as UI rather than a screenshot.
    chat:{
      title:'Post dose check-in',
      messages:[
        {from:'ai',time:'Sunday - 12:40 PM',text:'Quick check-in: how have you been feeling since your last dose?'},
        {from:'member',text:'I’ve been pretty nauseous the last 2 days'},
        {from:'ai',text:'I’m sorry to hear that. Let’s bring Dr. Whitehead into the chat to talk through some options.'},
        {from:'doctor',time:'Sunday - 12:43 PM',name:'Dr. Whitehead',text:'Hi Andrea, sorry you’re dealing with that. Nausea can happen after a dose change. First, are you able to keep down food and water? Once I know that, we can talk through ways to make you more comfortable and whether we should adjust your dose.'},
      ],
      composer:'Ask a follow-up question...',
    },
  },
  // Sam at Counsel (Oct 7): every page now uses this section. Live copy here.
  pricing:counselPricing({name:'weight management',
    note:'Weight-loss treatment often involves follow-ups for side effects, dose changes, progress and refills. With unlimited care, you can message a physician when something comes up without thinking “Is this worth another visit?”',
    footnote:'* Cost of medication not included. Labs are billed separately: ~$18 in most states and $43 in NY and NJ',
    cta:{label:'Get started',href:START}}),
  treatments:{
    heading:'Treatment options',
    body:'Counsel offers most prescription weight loss medications. Whether you have a medication in mind or want to discuss options with your Counsel doctor, we can support your journey.',
    labels:['Treatment','Average weight loss'],
    items:[
      // Prices were baked into the live renders; they are the cards' cost lines here (see brand/conditions-v3/README.md).
      {name:'Zepbound®',generic:'tirzepatide',cost:{cash:'$299/month*'},image:rxImage('zepbound'),body:'Targets two hormones, mimicking the effects of both GLP-1 and GIP. It slows digestion and decreases appetite, which can help individuals eat less and lose weight.',details:[['Treatment','1 injection, once a week'],['Average weight loss','Up to 21% of body weight in clinical trials']]},
      {name:'Foundayo™',generic:'orforglipron',cost:{cash:'$149/month*'},image:rxImage('foundayo'),body:'A GLP-1 medication, which the body naturally produces to regulate insulin and control blood sugar. It also works in the brain to curb food noise.',details:[['Treatment','1 tablet, once a day'],['Average weight loss','Up to 12% of body weight in clinical trials']]},
      {name:'Wegovy®',generic:'semaglutide',cost:{cash:'$199/month*'},image:rxImage('wegovy-injection'),body:'Reduces hunger and cravings by targeting receptors in the gut and brain. It can help individuals eat less and lose weight.',details:[['Treatment','1 injection, once a week'],['Average weight loss','Up to 19% of body weight in clinical trials']]},
      {name:'Wegovy® pill',generic:'semaglutide',cost:{cash:'$149/month*'},image:rxImage('wegovy-pill'),body:'Reduces hunger and cravings by targeting receptors in the gut and brain. It can help individuals eat less and lose weight.',details:[['Treatment','1 tablet, once a day'],['Average weight loss','Up to 15% of body weight in clinical trials']]},
    ],
    cta:{label:'Get started',href:START},
    footnote:'* Estimated cost based on publicly available manufacturer discounts. Actual prices may vary by pharmacy and dose. Counsel only prescribes FDA-approved brand name weight-loss medications.',
  },
  physicians:{
    heading:'Real physicians. Real medical care.',
    body:'Counsel combines technology with real doctors to help your care team understand your situation and make informed decisions with you.',
  },
  stories:{
    eyebrow:'Member testimonials',heading:'Hear from our members',
    items:[
      {quote:'During a holiday, I ran out of medication unexpectedly and my usual PCP was closed. Counsel responded to my request and had my prescription written within minutes!',who:'Male, 18–29 years old'},
      {quote:'Dr. Rishi took the time to explain the reasons behind my symptoms and the possible treatments. There was so much reassurance.',who:'Female, 18–29 years old'},
      {quote:'Counsel is a lifesaver. I start a new chat every time I’m unsure of what to do, and I get instant answers with extremely helpful advice!',who:'Female, 30–39 years old'},
      {quote:'Thanks for your help! I received great support and feel like I’m headed in the right direction. Counsel also helped me book an in-person appointment without any issues.',who:'Male, 30–39 years old'},
      {quote:'Dr. Whitehead helped me feel more reassured in an hour than a primary care doctor and a cardiologist have made me feel in months. So thank you for this, you have no idea how much that means.',who:'Female, 40–49 years old'},
      {quote:'Thank you for the support and to the physicians! I’ve been trying for weeks to find an in-person provider who can help me based on my individual needs and Counsel helped me right away.',who:'Female, 40–49 years old'},
      {quote:'Counsel has been extremely helpful. I’m not able to discuss medical concerns like this with any of my in-person doctors!',who:'Male, 70–79 years old'},
    ],
  },
  faq:{
    heading:'Your questions, answered',
    items:[
      {question:'Where is Counsel available?',answer:'Counsel is available in most U.S. states. GLP-1 prescribing is not currently available in Alabama, Louisiana, or New Jersey. Counsel, and therefore our weight management program, is not yet available in Arkansas, the District of Columbia, Kansas, Mississippi, New Mexico, Rhode Island, Washington, or West Virginia. If you live in one of these areas, you’ll join our waitlist and we’ll notify you when Counsel becomes available.'},
      {question:'What if I get side effects?',answer:'That’s exactly what Counsel is built for. Side effects like nausea are common when starting a GLP-1 and can make it hard to stay on treatment. With Counsel, you get around-the-clock AI support plus access to a doctor who can respond in minutes, 7 days a week. If needed, your doctor can adjust your dose or change your treatment. You’re not left managing side effects on your own or waiting until your next appointment.'},
      {question:'What does medication cost?',answer:'Medication prices are set by the manufacturers and vary by medication and pharmacy. The cash prices shown on our site use the latest available manufacturer coupons and are generally available at most major pharmacies. If you’re prescribed medication, you’ll be able to choose your pharmacy and see live cash prices for many major pharmacies before filling your prescription.'},
      {question:'Do you help with insurance?',answer:'Counsel’s medical services are currently self-pay and are not reimbursable through insurance. We also do not currently support prior authorization workflows for medication coverage. Today, Counsel is best suited for members planning to pay cash for their medication. We plan to add more insurance support in the future.'},
      {question:'I’m already on a GLP-1 from another platform. Can I switch?',answer:'Yes. Switching to Counsel is straightforward. During onboarding, we’ll ask about your current medication, dose, and the weight you were at when you started treatment. Otherwise, you’ll go through the same intake process as any other member so your Counsel doctor can understand your health history and treatment needs.'},
      {question:'Can you treat things other than weight loss?',answer:'Yes. Counsel can help with acute, urgent, and primary care needs in addition to weight management. Counsel doctors can prescribe and refill medications, order labs and imaging, and provide referrals to specialists when appropriate. Your care doesn’t have to stop with weight loss.'},
      {question:'How much does Counsel cost?',answer:'You can choose between two ways to pay: $300/year for unlimited doctor visits, or $29 per visit with no subscription. Medication and lab costs are separate.'},
      {question:'Do you offer compounded medications?',answer:'No. Counsel only prescribes FDA-approved, brand-name weight-loss medications.'},
      {question:'Do you support the Medicare GLP-1 Bridge program?',answer:'Not yet. We’re exploring support for the Medicare GLP-1 Bridge program and hope to offer it in the future.'},
      {question:'Will I need blood testing or lab work?',answer:'Yes. All new weight-management members complete initial lab testing. Labs cost about $18 in most states and $43 in New York and New Jersey.'},
    ],
  },
  // The live "bigger picture" band, set as the shared closing card.
  closing:{
    heading:['Weight loss is connected to the rest of your health.','Your care should be too.'],
    body:'Counsel considers your broader medical history, not just the number on a scale.',
    cta:{label:'Get started',href:START},
    photo:{src:'/brand/photography/weight-management-woman-prefooter-cutout-v1.png',alt:'A smiling woman in a cream sweatshirt'},
  },
};
