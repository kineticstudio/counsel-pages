// Live copy: https://www.counselhealth.com/conditions/anti-aging (2026-10-06).
// Successor to Skin Care V1/V2, which was the wireframe's "Anti-aging skincare".
// Structure: Weight Management V3 (Hunter, Oct 6). New copy is marked "drafted".
import {LIVE,STEPS_HEADING,STEPS_INTRO,startSteps,heroPoints,FROM_29,ONGOING_HEADING,checkIn,PHYSICIANS,counselPricing,RX_PRICE_NOTE,CLOSING_BODY,PEOPLE,SKIN_STORIES,rxImage} from './shared.js';

const START='https://app.counselhealth.com/chat?view=catalog&condition=anti-aging';

export default {
  slug:'anti-aging',name:'Anti-aging',theme:'pink',source:LIVE+'anti-aging',
  hero:{
    heading:['Your prescription','for firmer,','smoother skin'],
    // Condensed from the live hero bullets.
    body:'Get real results from prescription retinoids, with treatment guided by your health history and unlimited support through ongoing check-ins.',
    points:heroPoints(FROM_29),
    pointsLayout:'row',
    ctas:[{label:'Get started',href:START}],
    // Hunter's Skin Care V2 portrait; she already faces the H1.
    figure:{kind:'cutout',src:'/brand/photography/skin-care-hero-cutout-v1.png',alt:'A smiling woman with short gray hair and a mustard sweater'},
  },
  steps:{
    heading:STEPS_HEADING,intro:STEPS_INTRO,
    items:startSteps(),
    screens:[
      {kind:'ai',question:'I’d like a prescription for fine lines and sun spots.',reply:'What would you most like to improve, and are you using a retinoid now?'},
      {kind:'doctor',question:'I’d like a prescription for fine lines and sun spots.',title:'Your plan, physician-led.',body:'Medical history reviewed. Treatment tailored to your skin.'},
      {kind:'rx',name:'Tretinoin 0.025% cream',detail:'Apply once a day'},
    ],
  },
  ongoing:{
    heading:ONGOING_HEADING,
    // Drafted from the live FAQ: results build over months; redness, dryness and sun sensitivity are common.
    body:'Retinoid results build over months. Questions come up. Skin adjusts. Routines change. Counsel proactively checks in, so staying on track doesn’t depend on you remembering to follow up.',
    cta:{label:'Get started',href:START},
    chat:checkIn({
      title:'Skin check-in',
      question:'Quick check-in: how is your skin handling tretinoin so far?',
      reply:'My cheeks are red and a little flaky after the first week.',
      doctor:'Thanks for letting me know. Redness and dryness are common while your skin adjusts. Are you wearing sunscreen every morning? Let’s also look at how often you’re applying it, and adjust if it doesn’t settle.',
    }),
  },
  pricing:counselPricing({name:'anti-aging',cta:{label:'Get started',href:START}}),
  treatments:{
    heading:'One prescription. Powerful results.',
    // Live typo "geneeric" corrected.
    body:'To ensure you get the best possible results, Counsel prescribes Tretinoin, a trusted and cost-effective anti-aging treatment. You’re always able to select alternative brand-name or generic medications if you prefer.',
    layout:'single',
    items:[{name:'Tretinoin',image:rxImage('tretinoin-anti-aging'),body:'Tretinoin is a topical retinoid that stimulates collagen production and accelerates cellular turnover. This smooths fine lines, fades sun spots, and improves skin texture, giving skin a firmer, more youthful appearance.',details:[['Treatment','Tretinoin 0.025% cream, apply once a day'],['Results','Clinically proven to reduce wrinkles, dark spots, and dullness']],
      // Short cost lines (Sam, Oct 7) from the live one-row table.
      cost:{insured:'$10-25 with most plans',cash:'$20-45 for 90 days*'}}],
    cta:{label:'Get started',href:START},
    footnote:RX_PRICE_NOTE,
  },
  physicians:PHYSICIANS,
  stories:{heading:'Hear it straight from our members',items:SKIN_STORIES},
  faq:{
    heading:'Your questions, answered',
    items:[
      {question:'How do prescription retinoids counteract cellular aging?',answer:'While over-the-counter creams hydrate the epidermal layer, prescription retinoids (like Tretinoin) act on a genomic level. They bind directly to retinoic acid receptors in the skin, upregulating the genes responsible for collagen type I and III production. Much like how genetics dictate hair follicle miniaturization, UV exposure degrades dermal collagen; retinoids actively reverse this by preventing collagen breakdown and stimulating new structural growth.'},
      {question:'What is the “Tretinoin shed” or “purge”?',answer:'Introducing Tretinoin can cause a temporary flare-up of acne before things get better. This “purge” happens because the medication accelerates your skin’s cell turnover rate, pushing deep-seated oil and dead skin cells to the surface all at once. It typically lasts a few weeks and is actually a sign that the medication is working to clear out micro-comedones (early stage pimples) that were already forming under the surface.'},
      {question:'How long does it usually take to see results?',answer:'Rebuilding the dermal matrix is a slow, biological process. While you may notice increased radiance and smoother texture within a month due to surface exfoliation, significant improvements in fine lines, deep wrinkles, and dermal thickness generally take four to six months of continuous use. Consistency is vital, as pausing the medication will eventually halt the upregulated collagen production.'},
      {question:'What are the most common side effects?',answer:'The most common side effects are erythema (redness), excessive dryness, and increased photosensitivity. Because the skin barrier is temporarily thinned, the skin is highly susceptible to UV damage if a broad-spectrum sunscreen is not applied daily. Environmental factors like cold weather or low humidity can further exacerbate these side effects.'},
    ],
  },
  closing:{heading:['Feel your best.','Comprehensive support, all in one place.'],body:CLOSING_BODY,cta:{label:'Get started',href:START},photo:PEOPLE.blouseWoman},
};
