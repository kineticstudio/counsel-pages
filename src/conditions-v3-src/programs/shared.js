// Copy shared by Counsel's live condition pages, captured from
// https://www.counselhealth.com/conditions/* on 2026-10-06 (rechecked the same
// afternoon). Keep live copy verbatim. Hunter, Oct 6: every condition page uses
// Weight Management V3's structure; this file holds the pieces they share.

export const LIVE='https://www.counselhealth.com/conditions/';

// Weight management is the only live page with a heading over its steps.
// Every other program borrows it rather than inventing a new line.
export const STEPS_HEADING='No waiting rooms. No appointments.';
export const STEPS_INTRO='Start by chatting with Counsel whenever you’re ready. We’ll gather the information your doctor needs before they review your case.';

// Sam at Counsel, Oct 13: step 3's body can be set per page (birth control
// names local and mail order pharmacies); the default is unchanged.
export const startSteps=({fit='which treatment options would be best suited for your body and lifestyle',start='Start your treatment',startBody='Pick up your prescription from a local pharmacy. We’ll be here to monitor your progress and adjust your treatment through ongoing check-ins.'}={})=>[
  {title:'Confirm your eligibility in minutes',body:'Sign up for Counsel and answer a few simple questions (less than 3 minutes).'},
  {title:'Chat with a Counsel doctor',body:`Message with a board-certified doctor to discuss ${fit}.`},
  {title:start,body:startBody},
];

// Hero: weight management's three short statements; the third is per program.
export const heroPoints=third=>[{icon:'stethoscope',text:'Board-certified physicians'},{icon:'question',text:'Answers in minutes'},third];
export const FROM_29={icon:'coins',text:'Care starting at $29'};

// Ongoing care. The heading is weight management's live line; each program's
// body and check-in conversation are drafted from its own live FAQ and steps
// (new copy, illustrative UI, to confirm with Counsel's clinical team).
export const ONGOING_HEADING='Care doesn’t stop with the first prescription';
// Sam at Counsel, Oct 13: followUp adds turns after the handoff ({from,text}),
// and the doctor is optional, so a chat can end on Counsel AI.
export const checkIn=({title,question,reply,handoff='Thanks for letting me know. Let’s bring your doctor into the chat to talk through some options.',followUp=[],doctor})=>({
  title,
  messages:[
    {from:'ai',time:'Sunday - 12:40 PM',text:question},
    {from:'member',text:reply},
    {from:'ai',text:handoff},
    ...followUp,
    ...(doctor?[{from:'doctor',time:'Sunday - 12:43 PM',name:'Your Counsel doctor',text:doctor}]:[]),
  ],
  composer:'Ask a follow-up question...',
});

// Weight management's live physicians band; it is not condition specific.
export const PHYSICIANS={
  heading:'Real physicians. Real medical care.',
  body:'Counsel combines technology with real doctors to help your care team understand your situation and make informed decisions with you.',
};

// Pricing (Sam at Counsel, Oct 7): every page mirrors weight management's
// "Choose how you pay" and is only about what Counsel costs, so no page keeps
// a medication card. Medication cost moved onto the treatment cards.
// Weight management's plan copy is live; elsewhere the program name is swapped
// in and the membership note is the drafted generic below.
export const UNLIMITED_NOTE='Ongoing treatment often involves follow-ups for side effects, refills and changes to your plan. With unlimited care, you can message a physician when something comes up without thinking “Is this worth another visit?”';
export const counselPricing=({name,note=UNLIMITED_NOTE,footnote='* Cost of medication not included.',...actions})=>({
  heading:'Choose how you pay',
  body:'Pay $29 when you need a visit, or get unlimited visits with an annual membership.',
  plans:[
    {name:'Unlimited care',price:'$25',suffix:'/month',meta:'$300 billed annually',callout:'Best for ongoing support',featured:true,
      features:['Unlimited doctor visits',`Care beyond ${name}`,'One flat price for the whole year'],note},
    {name:'Pay per visit',price:'$29',suffix:'/visit',meta:'Pay only when you need care.',callout:'Best for flexibility',
      features:['Same access to Counsel doctors',`Care beyond ${name}`,'No long-term commitment'],
      note:'Start with a $29 visit today. If you need care again, come back whenever you want and pay for another visit. Switch to a membership anytime.'},
  ],
  ...actions,footnote,
});

// Treatment cards carry an optional cost estimate (Sam, Oct 7): with
// insurance, without insurance, both or neither, one short line each.
// Values are shortened from each page's live cost copy; Counsel will supply
// final lines. Cash estimates carry the section footnote's asterisk.
export const RX_PRICE_NOTE='*Prices will vary depending on your insurance coverage and the pharmacy you choose.';

// Closing card. The live "More than ..." band becomes weight management's
// "bigger picture" close; its body is that band's own "Get personalized care" line.
export const CLOSING_BODY='From testing, treatments, and lifestyle changes to second opinions and specialist referrals, Counsel covers the full spectrum of healthcare.';
const portrait=n=>`/brand/photography/${n}`;
export const PEOPLE={
  sweatshirtWoman:{src:portrait('weight-management-woman-prefooter-cutout-v1.png'),alt:'A smiling woman in a cream sweatshirt'},
  blouseWoman:{src:portrait('skin-care-prefooter-cutout-v1.png'),alt:'A smiling woman with curly hair in a cream blouse'},
  capMan:{src:portrait('condition-prefooter-cutout-v1.png'),alt:'A man in a cream cap reading his phone at an outdoor table'},
  greenShirtMan:{src:portrait('weight-management-hero-cutout-v1.png'),alt:'A man in a green shirt checking his phone'},
};

// Hunter, Oct 6: testimonials never have photos, so the live portraits that
// sat beside these quotes are not used.
// Acne, anti-aging and the three herpes pages share these five stories.
export const SKIN_STORIES=[
  {quote:'Usually doctors rush you, but Counsel was different. I actually fully understood what my options were before we decided on a treatment.',who:'Male, 30–39 years old'},
  {quote:'I loved that Counsel didn’t just give me a generic fix. They used my background to customize the prescription to my health history. It feels good to have personalized care.',who:'Female, 40–49 years old'},
  {quote:'They customized the plan to my health history, which was huge. Picked up the script locally. Easy!',who:'Male, 30–39 years old'},
  {quote:'Knowing we could adjust course if needed in the event of unwanted side effects gave me peace of mind. It made me trust the process. I’m so happy with how clear my skin is.',who:'Female, 30–39 years old'},
  {quote:'Simple and fast. I talked to a doctor and filled my prescription the same day. And my skin looks amazing!',who:'Female, 20–29 years old'},
];
export const HAIR_STORIES=[
  {quote:'Counsel made the whole process surprisingly simple. The doctor reviewed my photos and we discussed the pros/cons of different approaches. I can see real regrowth along my temples, which I didn’t think was possible.',who:'Male, 20–29 years old'},
  {quote:'I’ve tried over-the-counter stuff for years with no real change. Counsel actually gave me a treatment that matched what was going on with my hair. My hairline isn’t what it was at 20, but it’s thicker and I feel way more confident.',who:'Male, 30–39 years old'},
  {quote:'I honestly didn’t expect much, but after about three months on Counsel’s plan I started noticing less shedding in the shower. By month five, my barber even commented that my crown looked fuller. It’s been easy to stick with because everything is laid out clearly.',who:'Male, 40–49 years old'},
  {quote:'I travel a ton for work, so sticking to routines is hard for me. But the reminders and the straightforward regimen made staying consistent doable. Now my hair looks healthier and fuller, and I get none of the scalp irritation I had with other products.',who:'Male, 30–39 years old'},
  {quote:'I was starting to dread taking pictures because my receding hairline was so obvious. After starting Counsel’s treatment, the shedding slowed almost immediately, and within a few months I could see new growth coming in. It feels good to see progress instead of decline.',who:'Male, 30–39 years old'},
];

export const HERPES_FAQ=(scope,cure)=>[
  {question:`Is there a cure for ${scope}?`,answer:`No, there is currently no cure for ${cure}, but it is very manageable. The virus stays in your body, but antiviral medications like Valacyclovir are highly effective at suppressing it. These treatments can stop outbreaks from happening, speed up healing if you do have one, and significantly lower the chance of passing the virus to a partner.`},
  {question:'What is the difference between Valacyclovir and Acyclovir?',answer:'Both are antiviral medications that work against HSV. Valacyclovir is a newer prodrug of Acyclovir, meaning your body converts it into Acyclovir after absorption. The key difference is convenience: Valacyclovir is taken less frequently (once or twice daily) because it’s absorbed more efficiently, while Acyclovir typically requires dosing two to five times per day. Both are equally effective at treating and suppressing outbreaks.'},
  {question:'Can I take medication every day to prevent outbreaks?',answer:'Yes. Daily suppressive therapy is a common and effective approach, especially if you experience frequent outbreaks (six or more per year) or want to reduce the risk of transmitting the virus to a partner. Taking Valacyclovir or Acyclovir daily can reduce outbreak frequency by 70-80% and significantly lower transmission risk.'},
  {question:'Do I need to get tested before I can get a prescription?',answer:'Not necessarily. If you’ve already been diagnosed with genital herpes by a healthcare provider, our doctors can prescribe treatment based on your medical history and symptoms. If you haven’t been diagnosed, our doctors can help determine if testing is appropriate and guide you through the process.'},
];

const rx=n=>`/brand/conditions-v3/rx/${n}.webp`;
export const HERPES_TREATMENTS=(once='500 mg orally, once a day',twice='400 mg orally, twice a day')=>({
  heading:'Treatment options',
  body:'Counsel offers a range of herpes treatments. Below are some of the most common and cost-effective choices, and you’re always able to select alternative brand-name or generic medications if you prefer.',
  items:[
    {name:'Valacyclovir',image:rx('valacyclovir'),body:'Valacyclovir is an antiviral medication used to treat genital herpes and cold sores. It speeds up healing, reduces pain and discomfort, and lowers the risk of spreading the virus to partners.',details:[['Treatment',once],['Results','70-80% reduction in outbreaks']],
      cost:{insured:'$10-60 with most plans',cash:'$25/month*'}},
    {name:'Acyclovir',image:rx('acyclovir'),body:'Acyclovir is a trusted, antiviral medication used for decades to treat herpes outbreaks. It is highly effective at reducing pain and speeding up healing.',details:[['Treatment',twice],['Results','70-80% reduction in outbreaks']],
      cost:{insured:'$5-30 with most plans',cash:'$10 for 60 days*'}},
  ],
  footnote:RX_PRICE_NOTE,
});
export const rxImage=rx;
