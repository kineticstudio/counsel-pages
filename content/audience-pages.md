# Audience pages: copy and structure

Source: Counsel's "Updated Audience Page Copy for Kinetic" (Javi, October 12),
a Google Doc shared in #counsel-health. This is that doc set out for the
build. Four pages, all on the Health Plans template as built on
counsel-inc.webflow.io/health-plans:

| Page | Slug | Tiles in the bento |
| --- | --- | --- |
| Health plans | /health-plans (exists; copy changes) | 6 |
| Health systems | /health-systems | 6 |
| Consumer health | /consumer-health | 5 |
| Employers | /employers | 5 |

Everything that animates (the walkthrough phone, the bento graphics) comes
from Kinetic as code embeds; see `embeds/README.md`. Everything else is
Webflow text and structure.

## Javi's review, October 13

Javi left comments on the designs on October 13. They are all in the designs
and in the copy below:

- **Every page:** the walkthrough heading breaks after "care," ("How
  [members] get care, / step by step"). Step 4 is "Bring in a physician",
  with "clinician" in its body; its phone card reads "A board-certified
  physician will join the chat in minutes." Buttons hold a visible hover
  colour (navy to Blue 7, light to Blue 2), after the sweep. Closing
  headings sit on two lines, so their container is wider.
- **Health plans:** the hero heading breaks "AI-native primary care / that
  modernizes your / front door", and the hero body is wide enough for three
  lines. A fifth stat: 2 min Average response time. Stat paragraphs line up
  at the top. White label tile: "A white-labeled, custom experience", with
  "white-labeled" kept on one line.
- **Triage graphic (Health plans and Health systems):** the routes the live
  site shows. Counsel AI routes to Counsel Physicians (in the tile's ink,
  branching into Advice & triage, Medications & labs, Referrals), Your
  benefits ecosystem & programs, and In-network providers. It is a new embed.
- **White label graphic:** the brand chips are buttons; clicking one
  rebrands the app. New embed.
- **Health systems:** "physician capacity" in the hero body. The logos are
  the live site's institutions: Stanford Medicine, Google, UCSF, NVIDIA and
  Massachusetts General Hospital (`brand/partners/institutions/` in this
  repo, the same SVGs as the live site). The EHR graphic has clearer
  arrows and a roomier record (new embed).
- **Consumer health:** no logo row. The Oura section is a dark banner like
  the live site's: a "Partner spotlight" tag in the green highlighter pill,
  the Oura logo in white, the quote at body size, a light "Learn more"
  button, and the live site's photo of the Oura app beside it (a solid panel
  and a crisp edge, no gradient; the photo is
  `brand/photography/oura-spotlight-app.webp`). The Care in one place graphic runs two
  columns in its narrow tile, so each kind of care keeps its own box (new
  embed).

## What changes on the template

These apply to all four pages, including Health plans.

1. **Walkthrough: five steps, not four.** The steps are now Start with a
   question, Share symptoms, Receive initial guidance, Bring in a physician,
   Receive proactive follow-up (copy below). The phone shows five screens,
   one per step; that embed comes from Kinetic and replaces the current
   four-screen one. Step copy is Webflow text.
2. **Bento: new tile order and sizes per page** (tables below). White label
   moves into row one, after Triage. Consumer health and Employers have five
   tiles: a 7-column and a 5-column tile, then three 4-column tiles. Tiles
   marked "copy first" show their copy above the graphic, the way the
   escalation tile does today (`.v2-value-copy{order:-1}`), because their
   graphic rises from the tile's bottom edge.
3. **Scope of care: no CTA.** Javi's comment on the doc: remove the button
   under the Scope of care intro.
4. **Stats: per page** (three or four, listed below).
5. **Logos:** Health plans and Employers keep "Trusted by leading
   organizations" (a16z, Insitro, Notable, Nowsta, Photon). Health systems
   uses "Built by senior physicians and AI scientists from leading
   institutions" with the logos currently on the site. Consumer health has no
   logo row; its Oura partner section follows the hero (copy below).
6. **Closing:** a heading per page, the same body, and the "Request a custom
   demo" button.

## Shared sections

The same on every page, with the audience noun swapped: members (Health
plans), patients (Health systems), users (Consumer health), employees
(Employers). "Your member app" / "patient app" / "user app" follows the same
rule; Employers' third feature is different and is given under that page.

### Features: Healthcare designed for the modern era

Intro: "[Members] already turn to AI for health information, but consumer
LLMs can't tell them what is safe, what to do next, or where to go. Counsel's
AI-native care model fixes that."

- **Responsible by design, built by experts.** Board-certified physicians
  safeguard every interaction, ensuring safe, compliant care with built-in
  guardrails and continuous evaluations.
- **Continuous and context-aware.** Every instance of care is informed by a
  [member]'s medical history and wearable data, strengthening continuity
  along their health journey.
- **Embedded into your [member] app.** Bring AI-native care directly to your
  front door, white-labeled to your brand and aligned with your clinical
  protocols, provider networks, and benefits ecosystem.

### Walkthrough: How [members] get care, / step by step

Intro: "Counsel's messaging-based interface aligns with how [members] seek
care today, giving them the ability to navigate their health at their pace."
(Consumer health and Employers say "how consumers seek care".)

1. **Start with a question.** [Members] type what's on their mind into a
   familiar chat interface, right inside your app.
2. **Share symptoms.** Counsel AI asks follow-up questions to understand
   symptoms just like an expert physician would.
3. **Receive initial guidance.** Counsel AI retrieves relevant context and
   guidelines from trusted sources to provide initial, personalized guidance.
4. **Bring in a physician.** [Members] can add a clinician to a chat any time.
   Depending on the medical concern, Counsel AI will also escalate directly
   to a provider.
5. **Receive proactive follow-up.** After providing a treatment plan,
   Counsel follows-up to ensure improvement of symptoms. [Members] can also
   return to the chat anytime to review their plan, check prescription
   information, and more.

Button under the steps: "See Counsel in action".

Phone screens (Kinetic's embed), from Javi's guidance: step 1 ends the
member's message with a question mark; step 3 shows "Based on what you've
described this pattern is consistent with cellulitis. Treatment often
requires a prescription antibiotic, so you should connect with a Counsel
doctor for a definitive diagnosis and treatment." with cited sources and
saved memories; step 4 separates the member's message from the "add a
doctor" module by colour; step 5 shows the medication on screen but
highlights the follow-up: "Hi Nora, just checking in after our recent
conversation. How is your arm doing?"

### Scope of care

Intro: "From new symptoms to chronic condition management, Counsel delivers
longitudinal care that supports [members] across every stage of life." No
button.

- **Medical advice:** Cancer screenings, Nutrition, Preventive care, Lab
  results review, Wearable data review, Wound care, And more
- **Urgent care:** Allergic reactions, Back pain, Cough and sore throat,
  Heartburn, STI, Pink eye, And more
- **Primary care:** Medication refills, Second opinions, Specialist
  referrals, Care plan creation, Lab testing, Records review, And more
- **Chronic care:** Fertility, Acne, Herpes, Diabetes, Hypertension,
  Hyperlipidemia, And more

### Closing

Body: "Discover how AI-native primary care can deliver measurable impact for
your organization from day one." (Consumer health: "Discover how Counsel can
deliver measurable impact for your organization from day one.") Button:
"Request a custom demo". Headings are per page, below.

## Health plans

- **Hero:** eyebrow "Health plans". Heading "AI-native primary care / that
  modernizes your / front door". Body "Bring clinical actionability to your
  member app, improving network performance, reducing unnecessary ED
  utilization, and expanding access at scale." Button "Request a custom
  demo".
- **Logos:** "Trusted by leading organizations".
- **Bento heading:** "The clinical layer unlocking value for payer
  organizations".

| # | Tile | Columns | Copy first | Graphic (embed) |
| --- | --- | --- | --- | --- |
| 1 | Intelligently triage member needs | 8 | yes | Triage |
| 2 | A white-labeled, custom experience | 4 | yes | White label |
| 3 | Shift care upstream | 5 | yes | Chat in a phone |
| 4 | Expand access at scale | 7 | | US access map |
| 5 | Offer comprehensive care in one place | 5 | | Care in one place |
| 6 | Go live in weeks | 7 | | Launch calendar (as today) |

Tile copy:

1. **Intelligently triage member needs.** Counsel AI triages member
   concerns, routing them to the appropriate care pathway. As members
   interact with Counsel, health memories are built, creating a continuous
   relationship.
2. **A white-labeled, custom experience.** Embed Counsel into your existing app,
   customized to your trusted brand to promote member engagement and
   retention.
3. **Shift care upstream.** Improve your network's efficiency by providing
   access to Counsel at the point of need, reducing unnecessary escalation to
   costly care settings.
4. **Expand access at scale.** Bring on-demand care to your members that
   doesn't rely on appointments. Counsel gives members immediate answers from
   our medical AI and the ability to connect with a physician in minutes.
5. **Offer comprehensive care in one place.** From care to medical advice,
   labs, specialist referrals, prescriptions, and health insights, members
   are supported through every medical need in one unified experience.
6. **Go live in weeks.** Deploy production-ready AI-native care without the
   complexity of building it. Counsel enables you to launch faster while
   maintaining the highest standards for safety and compliance.

- **Stats heading:** "One connected clinical front door. Plan-wide impact."
  Button "Connect with our team". Stats: $381 Annual savings ("Per engaged
  member, based on avoided care and utilization."); 96% Resolution rate
  ("Nearly all member concerns are resolved without escalation or claim
  submission."); 24% Reduction in ER visits ("Compared with consumer-facing
  AI tools."); 80 NPS ("High member satisfaction ensures long-term
  engagement."); 2 min Average response time ("Physicians respond quickly
  upon joining a conversation. Answers from our medical AI are
  instantaneous.").
- **Closing heading:** "Expand access to care at scale".

## Health systems

- **Hero:** eyebrow "Health systems". Heading "AI-native primary care that
  powers your entire network". Body "Bring clinical actionability to your
  app, expanding physician capacity, improving care continuity, and retaining patients
  within your system." Button "Request a custom demo".
- **Logos:** "Built by senior physicians and AI scientists from leading
  institutions": Stanford Medicine, Google, UCSF, NVIDIA, Massachusetts
  General Hospital, as on the live site.
- **Bento heading:** "Strengthen every layer of your network".

| # | Tile | Columns | Copy first | Graphic (embed) |
| --- | --- | --- | --- | --- |
| 1 | Intelligently triage member needs | 8 | yes | Triage |
| 2 | A white-labeled, custom experience | 4 | yes | White label |
| 3 | Shift care upstream | 5 | yes | Chat in a phone |
| 4 | Improve care continuity | 7 | | EHR two-way (see note) |
| 5 | Offer comprehensive care in one place | 5 | | Care in one place |
| 6 | Go live in weeks | 7 | | Launch calendar (as today) |

Tile copy:

1. **Intelligently triage member needs.** Counsel AI triages member
   concerns, routing them to the appropriate care pathway and retaining them
   within your system. As members interact with Counsel, health memories are
   built, creating a continuous relationship.
2. **A white-labeled, custom experience.** As Health plans.
3. **Shift care upstream.** Expand your system's capacity without adding
   headcount by enabling Counsel to address most medical concerns, enabling
   your providers to focus on more complex cases.
4. **Improve care continuity.** Counsel seamlessly connects to your EHR to
   inform every care interaction with a patient's medical history.
   Interactions with Counsel are written back to the EHR, establishing a
   bidirectional connection that gives your providers a complete picture of
   each patient.
5. **Offer comprehensive care in one place.** As Health plans.
6. **Go live in weeks.** As Health plans.

Note: the doc's guidance for tile 4 says "US map", but the copy is about the
EHR, so Kinetic's graphic shows the EHR connection. Confirming with Javi.

- **Stats heading:** "One connected clinical front door. System-wide
  impact." Button "Connect with our team". Stats: 80 NPS ("High patient
  satisfaction ensures long-term engagement."); 57% Referral rate
  ("Percentage of threads that result in referrals to downstream
  services."); 2 min Average response time ("When physician assistance is
  required. AI chat is instantaneous.").
- **Closing heading:** "Turn your front door into a care setting patients
  trust".

## Consumer health

- **Hero:** eyebrow "Consumer health". Heading "Turn health insights into
  clinical action". Body "Extend your platform capabilities by integrating
  AI-native care that transforms a user's data into diagnosis, treatment,
  and ongoing support." Button "Request a custom demo".
- **Logos:** none on this page.
- **Oura section (new, after the hero):** "Partner spotlight" tag, Oura logo. "By partnering with
  Counsel, Oura members can now access on-demand clinical care directly
  within the Oura experience, bridging the gap between health insights and
  real physician actionability." Button "Learn more". With an image.
- **Bento heading:** "The clinical layer unlocking value for consumer
  health".

| # | Tile | Columns | Copy first | Graphic (embed) |
| --- | --- | --- | --- | --- |
| 1 | Bring clinical actionability into your platform | 7 | | Insight to action |
| 2 | Inform care with your first-party data | 5 | | Data to answer |
| 3 | Strengthen the user experience | 4 | yes | Chat in your app |
| 4 | Offer comprehensive care in one place | 4 | | Care in one place |
| 5 | Launch AI-native care without building it | 4 | | Launch calendar (as today) |

Tile copy:

1. **Bring clinical actionability into your platform.** Today, users have to
   leave your platform to take action on their insights. With Counsel, care
   can be accessed directly through your product, enabling a connected
   clinical experience.
2. **Inform care with your first-party data.** Counsel seamlessly ingests
   your custom data, including labs, biometrics, and lifestyle insights, to
   deliver personalized care for each user.
3. **Strengthen the user experience.** Messaging-based care drives increased
   engagement and retention. By embedding medical care into the user journey,
   Counsel makes your platform a core part of how users prefer to manage their
   health.
4. **Offer comprehensive care in one place.** From care to medical advice,
   labs, specialist referrals, prescriptions, and health insights, users are
   supported through every medical need in one unified experience.
5. **Launch AI-native care without building it.** Deploy production-ready,
   AI-native care without the complexity of building it. Counsel enables you
   to launch faster while maintaining the highest standards for safety and
   compliance.

- **Stats heading:** "Clinical action meets platform impact". Button
  "Connect with our team". Stats: 80 NPS ("High member satisfaction ensures
  long-term engagement."); 96% Resolution rate ("Nearly all member concerns
  resolved without escalation."); 2 min Average response time ("When
  physician assistance is required. AI chat is instantaneous.").
- **Closing heading:** "Build the future of wearable-informed, AI-native
  care".

## Employers

- **Hero:** eyebrow "Employers". Heading "AI-native primary care that
  modernizes your health benefits". Body "Give your employees access to care
  that doesn't rely on appointments or waiting rooms, personalized and
  aligned to your benefits ecosystem." Button "Request a demo".
- **Logos:** "Trusted by leading organizations".
- **Features:** the third feature is different here: **Aligned with your
  benefits ecosystem.** "Counsel ingests your benefit design and benefits
  ecosystem to personalize care, surface available point solutions,
  increasing member engagement."
- **Bento heading:** "The clinical layer unlocking value for employers".

| # | Tile | Columns | Copy first | Graphic (embed) |
| --- | --- | --- | --- | --- |
| 1 | Expand access at scale | 7 | | US access map |
| 2 | Offer comprehensive care in one place | 5 | | Care in one place |
| 3 | Amplify utilization of your benefits ecosystem | 4 | yes | Benefit card |
| 4 | Go live in weeks | 4 | | Launch calendar (as today) |
| 5 | Chronic condition management | 4 | | Program card |

Tile copy:

1. **Expand access at scale.** As Health plans.
2. **Offer comprehensive care in one place.** As Health plans ("members").
3. **Amplify utilization of your benefits ecosystem.** The doc repeats the
   Health systems EHR paragraph here, which looks like a paste error. Copy
   to come from Javi; leave the placeholder until then.
4. **Go live in weeks.** Deploy AI-native care without the complexity of
   building it. Counsel enables you to launch faster while maintaining the
   highest standards for safety and compliance.
5. **Chronic condition management.** With Counsel, employers can offer
   longitudinal care by covering chronic conditions such as obesity,
   hypertension, high cholesterol, and more. Employees get to seamlessly
   manage their conditions and other medical needs within the same app.

- **Stats heading:** "Measurable outcomes across your benefits strategy".
  Button "Connect with our team". Stats: 96% Resolution rate ("Nearly all
  member concerns are resolved without escalation or claim submission.");
  2 min Average response time ("When physician assistance is required. AI
  chat is instantaneous."); 80 NPS ("High member satisfaction ensures
  long-term engagement.").
- **Closing heading:** "Healthcare for the modern era of benefits".

## Open with Counsel

- Health systems tile 4: map or EHR (Kinetic is building the EHR).
- Employers tile 3: real body copy.
- The Health systems chat line in the doc reads "for the past few, should I
  go to the ER?"; Kinetic's graphic uses "for the past few days".
- Employers tile 5 should show Counsel's real program directory card; Kinetic
  has drawn one after the app and will swap it when Counsel shares the card.
