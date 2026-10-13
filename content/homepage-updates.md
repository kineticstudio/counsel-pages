# Homepage updates

Source: Counsel's Notion page "Consumer site animated content" (Sam,
October 12). It covers the homepage and the condition pages. Sam is making
the condition-page changes himself in the CMS; three of them need more than
text and are listed at the end. On the homepage, the step copy and the
pricing section are Webflow text; the phone is a code embed from Kinetic.

## How it works (walkthrough)

Step copy, as Webflow text:

| Step | Element | Now | Update |
| --- | --- | --- | --- |
| 1 | Body | Nora asks about her sore throat at 11pm. Counsel AI helps her understand the next step, with no cost to get started. | Nora has been unusually tired for a few weeks. She asks Counsel what could be going on. |
| 2 | H3 | Add a doctor to the chat | (no change) |
| 2 | Body | A real doctor picks up where Counsel AI left off. Nora can share the same conversation and get a seven-day visit for $29. | No appointments, or video calls. A doctor joins Nora's chat in minutes to help her decide what to do next. |
| 3 | Chip | Prescription | Action |
| 3 | H3 | From advice to action | From answer to action |
| 3 | Body | When treatment is needed, her doctor can arrange a prescription, lab order or referral. Nora's next step stays in the same conversation. | Her doctor orders labs. If she needed a prescription or referral instead, Counsel could handle that too. |
| 4 | Chip, H3 | Follow-up, Care that keeps going | (no change) |
| 4 | Body | Nora's visit stays open for seven days, so she can follow up as things change. Her next conversation starts with that context. | Results, treatment, and follow-up stay connected, so Nora never has to start over. |

Phone screens (Kinetic's embed; a new embed replaces the current one):

- **Screen 1:** Nora's bubble "I've been feeling really tired lately". AI
  reply: "Let me get a better picture of what you're experiencing. I'll ask
  about the fatigue itself, sleep and daily habits, and a few health checks
  that can commonly affect energy. If it makes sense, you can add a doctor
  to this chat, and they will have the full context of our conversation. To
  start, can you describe what 'really tired' feels like for you, and when it
  started?" Source chips stay: "1 conversation", "3 trusted sources", copy
  icon.
- **Screen 2:** no change.
- **Screen 3:** remove the "Your doctor joined, $29" card. Add a doctor
  message with their photo: "I'm ordering some labs to help figure out
  what's going on." A "Lab ordered" card replaces the prescription card,
  with a map to the nearest Quest.
- **Screen 4:** doctor message: "Hi Nora, your lab results are back, and
  your vitamin D levels were about 50% lower than the 'normal' range. This
  could explain what you're feeling, and you could start with some
  supplements right away." Nora: "Oh wow. I'm going to pick some up right
  away, do you have any recommendations?" The chat blurs out below to show
  the conversation continues.

## Pricing

Webflow text:

| Element | Now | Update |
| --- | --- | --- |
| H2 | Healthcare that's reliable and affordable | Start free. Add a doctor when you need one. |
| Subhead | No insurance necessary. | Ask Counsel anything at no cost. Pay $29 when you need a doctor, or get unlimited access for $300/year. |
| Card 1 name | Counsel | Pay per visit |
| Card 1 price | $0 | $29/visit |
| Card 1 description | Unlimited access to AI chat for free | Chat with Counsel for free. When you need a doctor, just pay for the visit |
| Card 1 bullets | 24/7 medical AI; Unified health records; Add a real doctor to any conversation, $29 a visit | Board-certified doctors join your chat in minutes; Visits stay open for 7 days; No subscription or commitment |
| Card 1 CTA | Get started for free | (no change) |
| Card 2 name | Counsel Signature | Membership |
| Card 2 badge | Members | Remove |
| Card 2 price | $199 / year | $300/year |
| Card 2 description | Everything in Counsel, and a doctor whenever you want one. | Unlimited access to doctors whenever you need care. |
| Card 2 bullets | Everything in Counsel; Unlimited doctor visits; Exclusive access to new features | Unlimited doctor visits; No per-visit fees; Built for managing conditions and regular check-ins |
| Card 2 CTA | Get Signature | Become a member |

## Condition pages: the three notes that need more than text

Sam is handling the rest in the CMS. These change the template:

1. **Weight management, step 3 screen:** replace the three-option treatment
   card with the app's treatment plan imagery: a weight graph with a goal
   weight, and one medication, Zepbound. This is the walkthrough phone
   embed, so it comes from Kinetic.
2. **Birth control, check-in chat:** the Counsel AI message now carries the
   whole answer ("Thanks for letting me know. Spotting can happen in the
   first few months on a new pill. Let me ask a few questions about what's
   going on, and we can talk through whether it makes sense to wait or chat
   with a doctor about different medications. How many days has it lasted,
   and have you missed any doses?") and the second timestamp, the doctor
   label and the doctor message are deleted. The chat card needs to hide
   those three when they are empty.
3. **Hair loss, check-in chat:** two new turns after the AI reply: a member
   reply ("I've just noticed more hair on my pillow in the morning.") and an
   AI reply ("Ok that's totally normal, even though it can feel concerning.
   I will check in again in a month, but I'm here if you need anything before
   then."). The chat card needs two more fields.
