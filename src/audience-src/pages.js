/**
 * The four audience pages' content, from Counsel's "Updated Audience Page
 * Copy for Kinetic" (Javi, October 12, 2026). Shared sections take the
 * audience noun; the bento comes from Card Studio V3's PAGES, so the tool
 * stays the source of truth for the graphics and the tile copy.
 */
const DEMO='https://www.counselhealth.com/contact-sales';
const shared=({plural,Plural,app,seek=plural})=>({
  features:{
    heading:'Healthcare designed for the modern era',
    body:`${Plural} already turn to AI for health information, but consumer LLMs can’t tell them what is safe, what to do next, or where to go. Counsel’s AI-native care model fixes that.`,
    items:[
      {title:['Responsible by design,','built by experts'],body:'Board-certified physicians safeguard every interaction, ensuring safe, compliant care with built-in guardrails and continuous evaluations.'},
      {title:['Continuous and','context-aware'],body:`Every instance of care is informed by a ${plural.replace(/s$/,'')}’s medical history and wearable data, strengthening continuity along their health journey.`},
      {title:['Embedded into',`your ${app}`],body:'Bring AI-native care directly to your front door, white-labeled to your brand and aligned with your clinical protocols, provider networks, and benefits ecosystem.'},
    ],
  },
  walkthrough:{
    // Javi, Oct 13: "care," goes up a line.
    heading:[`How ${plural} get care,`,'step by step'],
    intro:`Counsel's messaging-based interface aligns with how ${seek} seek care today, giving them the ability to navigate their health at their pace.`,
    steps:[
      {title:'Start with a question',body:`${Plural} type what’s on their mind into a familiar chat interface, right inside your app.`},
      {title:'Share symptoms',body:'Counsel AI asks follow-up questions to understand symptoms just like an expert physician would.'},
      {title:'Receive initial guidance',body:'Counsel AI retrieves relevant context and guidelines from trusted sources to provide initial, personalized guidance.'},
      // Javi, Oct 13: "physician" in the step, "clinician" in its body.
      {title:'Bring in a physician',body:`${Plural} can add a clinician to a chat any time. Depending on the medical concern, Counsel AI will also escalate directly to a provider.`},
      {title:'Receive proactive follow-up',body:`After providing a treatment plan, Counsel follows-up to ensure improvement of symptoms. ${Plural} can also return to the chat anytime to review their plan, check prescription information, and more.`},
    ],
    cta:'See Counsel in action',
  },
  scope:{
    heading:'Scope of care',
    body:`From new symptoms to chronic condition management, Counsel delivers longitudinal care that supports ${plural} across every stage of life.`,
    items:[
      {title:'Medical advice',items:['Cancer screenings','Nutrition','Preventive care','Lab results review','Wearable data review','Wound care','And more']},
      {title:'Urgent care',items:['Allergic reactions','Back pain','Cough and sore throat','Heartburn','STI','Pink eye','And more']},
      {title:'Primary care',items:['Medication refills','Second opinions','Specialist referrals','Care plan creation','Lab testing','Records review','And more']},
      {title:'Chronic care',items:['Fertility','Acne','Herpes','Diabetes','Hypertension','Hyperlipidemia','And more']},
    ],
  },
  closing:{body:'Discover how AI-native primary care can deliver measurable impact for your organization from day one.',cta:'Request a custom demo',href:DEMO},
});
const partners={heading:'Trusted by leading organizations'};

export default {
  'health-plans':{
    file:'Health-Plans-V6.html',name:'Health plans',
    hero:{eyebrow:'Health plans',lines:['AI-native primary care','that modernizes','your front door'],lead:'Bring clinical actionability to your member app, improving network performance, reducing unnecessary ED utilization, and expanding access at scale.',cta:'Request a custom demo',href:DEMO},
    logos:partners,
    ...shared({plural:'members',Plural:'Members',app:'member app'}),
    stats:{heading:'One connected clinical front door. Plan-wide impact.',cta:'Connect with our team',items:[
      {value:'$381',label:'Annual savings',description:'Per engaged member, based on avoided care and utilization.'},
      {value:'96%',label:'Resolution rate',description:'Nearly all member concerns are resolved without escalation or claim submission.'},
      {value:'24%',label:'Reduction in ER visits',description:'Compared with consumer-facing AI tools.'},
      {value:'80',label:'NPS',description:'High member satisfaction ensures long-term engagement.'},
      // Javi, Oct 13.
      {value:'2 min',label:'Average response time',description:'Physicians respond quickly upon joining a conversation. Answers from our medical AI are instantaneous.'},
    ]},
    closingHeading:['Expand access','to care at scale'],
  },
  'health-systems':{
    file:'Health-Systems-V1.html',name:'Health systems',
    hero:{eyebrow:'Health systems',lines:['AI-native primary care','that powers your','entire network'],lead:'Bring clinical actionability to your app, expanding capacity, improving care continuity, and retaining patients within your system.',cta:'Request a custom demo',href:DEMO},
    // Javi, Oct 13: the institutions the live site shows.
    logos:{heading:'Built by senior physicians and AI scientists from leading institutions',items:[['Stanford Medicine','stanford'],['Google','google'],['UCSF','ucsf'],['NVIDIA','nvidia'],['Massachusetts General Hospital','massachusetts']].map(([name,file])=>({name,local:`/brand/partners/institutions/${file}.svg`}))},
    ...shared({plural:'patients',Plural:'Patients',app:'patient app'}),
    stats:{heading:'One connected clinical front door. System-wide impact.',cta:'Connect with our team',items:[
      {value:'80',label:'NPS',description:'High patient satisfaction ensures long-term engagement.'},
      {value:'57%',label:'Referral rate',description:'Percentage of threads that result in referrals to downstream services.'},
      {value:'2 min',label:'Average response time',description:'When physician assistance is required. AI chat is instantaneous.'},
    ]},
    closingHeading:['Turn your front door into','a care setting patients trust'],
  },
  'consumer-health':{
    file:'Consumer-Health-V1.html',name:'Consumer health',
    hero:{eyebrow:'Consumer health',lines:['Turn health insights','into clinical action'],lead:'Extend your platform capabilities by integrating AI-native care that transforms a user’s data into diagnosis, treatment, and ongoing support.',cta:'Request a custom demo',href:DEMO},
    // Javi, Oct 13: no logo row on this page; the Oura spotlight follows the hero.
    // Javi, Oct 13: the live site's spotlight, with its "Partner spotlight" tag and the photo of the Oura app.
    partner:{name:'Oura',eyebrow:'Partner spotlight',app:'/brand/photography/oura-spotlight-app.webp',appAlt:'Counsel’s medical chat open in the Oura app on a phone',logo:'/brand/partners/oura.svg',quote:'By partnering with Counsel, Oura members can now access on-demand clinical care directly within the Oura experience, bridging the gap between health insights and real physician actionability.',cta:'Learn more',href:'https://www.counselhealth.com/newsroom',photo:'/brand/photography/counsel-11-hiker-with-phone.webp'},
    ...shared({plural:'users',Plural:'Users',app:'user app',seek:'consumers'}),
    stats:{heading:'Clinical action meets platform impact',cta:'Connect with our team',items:[
      {value:'80',label:'NPS',description:'High member satisfaction ensures long-term engagement.'},
      {value:'96%',label:'Resolution rate',description:'Nearly all member concerns resolved without escalation.'},
      {value:'2 min',label:'Average response time',description:'When physician assistance is required. AI chat is instantaneous.'},
    ]},
    closing:{body:'Discover how Counsel can deliver measurable impact for your organization from day one.',cta:'Request a custom demo',href:DEMO},
    closingHeading:['Build the future of','wearable-informed, AI-native care'],
  },
  'employers':{
    file:'Employers-V1.html',name:'Employers',
    hero:{eyebrow:'Employers',lines:['AI-native primary care','that modernizes your','health benefits'],lead:'Give your employees access to care that doesn’t rely on appointments or waiting rooms, personalized and aligned to your benefits ecosystem.',cta:'Request a demo',href:DEMO},
    logos:partners,
    ...shared({plural:'employees',Plural:'Employees',app:'employee app',seek:'consumers'}),
    featureThree:{title:['Aligned with your','benefits ecosystem'],body:'Counsel ingests your benefit design and benefits ecosystem to personalize care, surface available point solutions, increasing member engagement.'},
    stats:{heading:'Measurable outcomes across your benefits strategy',cta:'Connect with our team',items:[
      {value:'96%',label:'Resolution rate',description:'Nearly all member concerns are resolved without escalation or claim submission.'},
      {value:'2 min',label:'Average response time',description:'When physician assistance is required. AI chat is instantaneous.'},
      {value:'80',label:'NPS',description:'High member satisfaction ensures long-term engagement.'},
    ]},
    closingHeading:['Healthcare for the','modern era of benefits'],
  },
};
