# Homepage updates

Source: Counsel's Notion page "Consumer site animated content" (Sam,
October 12). It covers the homepage and the condition pages. All of it is now
in the designs on the review site. On the October 13 call we agreed Kinetic
builds it in Webflow, text included, once Counsel gives the thumbs-up.

On the homepage, the step copy and the pricing section are Webflow text; the
phone is code (`../homepage/`).

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

Phone screens: the code changes are in `../homepage/` (a patch and the full
files). In short:

- **Screen 1:** Nora's bubble "I’ve been feeling really tired lately" and
  Sam's three-paragraph answer. The source chips stay.
- **Screen 2:** no change.
- **Screen 3:** no "Your doctor joined, $29" row. The doctor card condenses
  into the doctor's message with their photo, "I’m ordering some labs to help
  figure out what’s going on.", above a "Lab ordered" card on the same map
  ("Quest Diagnostics · 0.6 mi").
- **Screen 4:** the condensed row reads "Lab ordered at Quest". Then the
  vitamin D message and Nora's reply. Sam asked for the chat to blur out
  below; the design ends on the doctor typing instead. Hunter has flagged
  that to Counsel, so this may change.

## Pricing

Webflow text:

| Element | Now | Update |
| --- | --- | --- |
| H2 | Healthcare that's reliable and affordable | Start free. Add a doctor when you need one. |
| Subhead | No insurance necessary. | Ask Counsel anything at no cost. Pay $29 when you need a doctor, or get unlimited access for $300/year. |
| Card 1 name | Counsel | Pay per visit |
| Card 1 price | $0 | $29/visit |
| Card 1 description | Unlimited access to AI chat for free | Chat with Counsel for free. When you need a doctor, just pay for the visit. |
| Card 1 bullets | 24/7 medical AI; Unified health records; Add a real doctor to any conversation, $29 a visit | Board-certified doctors join your chat in minutes; Visits stay open for 7 days; No subscription or commitment |
| Card 1 CTA | Get started for free | (no change) |
| Card 2 name | Counsel Signature | Membership |
| Card 2 badge | Members | Remove |
| Card 2 price | $199 / year | $300/year |
| Card 2 description | Everything in Counsel, and a doctor whenever you want one. | Unlimited access to doctors whenever you need care. |
| Card 2 bullets | Everything in Counsel; Unlimited doctor visits; Exclusive access to new features | Unlimited doctor visits; No per-visit fees; Built for managing conditions and regular check-ins |
| Card 2 CTA | Get Signature | Become a member |

## Condition pages

All of Sam's condition-page changes are in the designs and in this repo's
re-synced `conditions/` and `src/`. Most are copy. These change the template
or the CMS model:

1. **Weight management, step 3 screen:** a treatment plan instead of the
   three-option card: a weight chart with a dashed goal line at 180 lb and
   one medication, Zepbound (the `plan` screen in
   `src/conditions-v3-src/condition-v3.js`). It is part of the walkthrough
   phone, so build it like the other screens. The weights are illustrative.
2. **Birth control, check-in chat:** ends on Counsel's answer. The second
   timestamp, the doctor label and the doctor message are gone, so the chat
   card has to hide them when they are empty.
3. **Hair loss, check-in chat:** two more turns after Counsel's reply, a
   member line and a Counsel line. The chat card needs room for them.
4. **Step 3 card on seven pages:** "We’ll notify you when it’s ready for
   pickup." is now "We’ll check in when it’s time for a refill." It is one
   shared line.
5. **Step 3 body:** birth control has its own ("Choose your pharmacy,
   including local and mail order options. ..."), so the step 3 body is a
   per-page field now.
6. **Weight management, ongoing heading:** "Care doesn’t stop with the first
   GLP-1 prescription", on that page only. Keep "GLP-1" from breaking at its
   hyphen.
