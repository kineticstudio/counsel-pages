# Counsel Studio: the page

Design: https://counsel.kineticstudio.com/designs/counsel/05-counsel-studio/counsel-studio-v20

V20 is the round Counsel landed on (October 14 and 15): Javi called it "99%
there", and his last note, a straight cut under the hero instead of a wave,
is in V20. It replaces the live /counsel-studio page. Build it once Counsel
gives the thumbs-up in #counsel-health.

`studio/counsel-studio.html` runs the whole page from this repo (the markup
is written in for reading). Everything below the hero is the audience pages'
own components, so most of it is duplication in Webflow. The hero is
Webflow text and a button with two code embeds: its background, and the
phone section (see "The hero in Webflow" below).

## Sections, top to bottom

| Section | Build | Notes |
| --- | --- | --- |
| Hero | Webflow text and button, plus `embeds/counsel-studio/hero.html` | Dark green, centred. H1 "Counsel Studio". Body: "Bring clinical action to your trusted digital experience with AI-native primary care embedded within your app." Button: Request a demo. Behind it, a grid of small squares; single squares light up at random, and four data cards (activity, LDL cholesterol, resting heart rate, steps) take turns at the left and right edges. Straight cut at the bottom. |
| Phone | `embeds/counsel-studio/phone.html` | Still in the hero. A brand switcher (three colour circles) above a phone: the partner's own app, then Counsel opening over it as a sheet and building card by card as you scroll, each card with a label (Your brand, Your app, Your data on the left; Medical AI, Labs, prescriptions and referrals, Licensed physicians on the right). The brand changes on its own until the cards start, then only on click, with a crossfade. On phones the labels become numbered badges with a key under the phone. |
| Partner spotlight | Duplicate Consumer health's Oura spotlight | Same module, same quote and photo. Ariela may swap the photo. |
| Bento | Duplicate the bento; embeds in `embeds/counsel-studio/` | Heading "Strengthen every layer of your product". Four tiles: Expand access at scale (mint, 7 of 12), Care informed by your custom set of data sources (wine, 5), Offer comprehensive care in one place (sky, 5), Go live in weeks, not years (green, 7). Copy is in Card Studio's Counsel Studio page. |
| Deployment | Duplicate Scope of care (the audience pages) | Heading "Modernizing your digital app"; body "Counsel Studio enables organizations to fully customize the UI/UX, creating brand continuity and an experience that feels native to members." Three columns, each with a Lucide icon chip: **Deployment, made easy** (tablet-smartphone): "Flexible deployment via iFrame, WebView, and APIs, including multi-platform support." **Your care pathways** (waypoints): "Modular care pathways aligned to your clinical protocols." **Your ecosystem** (blocks): "Deep integration with your ecosystem of health solutions and referral networks." |
| Stats | Duplicate the stat cards (text left, stats right) | Heading "Built with you, through the last mile"; body "If you build with Counsel Studio, you'll work with forward-deployed technical and clinical teams that stay engaged through the last mile of care delivery."; button Connect with our team. **40%+** Decrease in urgent care utilization: "Reduction in unnecessary acute care utilization across a series of Counsel deployments." **4.9/5** Member satisfaction: "High member satisfaction drives stronger engagement and supports improved long-term health outcomes." **2 min** Average response time: "When physician assistance is required. AI chat is instantaneous." The numbers count up as on the audience pages. |
| Who it's for | New: three link cards | Heading "Helping organizations across the continuum improve access to care", on two lines. Rounded top corners over the green stats. Three filled cards in the bento colours, linking to the audience pages: Health plans (blue) "AI-native primary care that modernizes your front door", Health systems (mint) "AI-native primary care that powers your entire network", Consumer health (sky) "Turn health insights into clinical action". Each ends "Learn more" with an arrow. No Employers card: employers don't use Counsel Studio. |
| Closing | Duplicate the closing card | "See Counsel Studio in action"; "Discover how Counsel Studio can bring AI-enabled care into your app, from day one."; Request a demo. |

## The hero in Webflow

Replace the current placeholder (the Health plans hero with the photo) with:

1. **The section:** background `#072A1C`, `position: relative`,
   `overflow: hidden`, top padding 96px under the nav. Straight bottom edge,
   no wave.
2. **The background embed** (`embeds/counsel-studio/hero.html`): an Embed as
   the section's first child. It fills the section behind everything (it
   positions itself), so give the content after it `position: relative;
   z-index: 1`.
3. **The text, centred:**
   - Heading "Counsel Studio": Cooper, weight 300,
     `clamp(60px, 8.2vw, 128px)`, line height 0.98, letter spacing -3.5%,
     colour `#DBEDD8`, 22px below.
   - Body: "Bring clinical action to your trusted digital experience with
     AI-native primary care embedded within your app." At
     `clamp(18px, 1.55vw, 23px)`, line height 1.45, colour
     `rgba(219, 237, 216, 0.74)`, max width 31em, balanced.
   - Button "Request a demo", 36px below: the light green button
     (`#AED9B0`, text `#072A1C`).
   - The text block is centred vertically in
     `min-height: calc(100svh - 96px - clamp(230px, 32vh, 330px))`, with 16px
     above and 40px below, so the top of the phone shows in the first screen.
4. **The phone embed** (`embeds/counsel-studio/phone.html`): an Embed right
   under the text block, full width. It centres itself (max 1280px, 5% side
   padding) and carries the hero's bottom spacing.
5. **The nav** over this hero is the light-on-dark version, as in the
   design (light links, the light green "Request a demo"), and its usual
   light bar once you scroll.
6. **The placeholder's script:** the Health plans hero's Slater code (the
   `unfix`/`step` handler in 64922.js) should not run on this page once the
   placeholder is gone; with the placeholder removed it throws on load.

We tested both embeds pasted into counsel-inc.webflow.io/counsel-studio in
place of the placeholder, with the page's own GSAP and smooth scroll: they
match the design at desktop and phone widths.

The embeds use the page's GSAP and ScrollTrigger (or load them once). The
data cards keep clear of every heading, paragraph, link and button in the
section, and of the phone; add `data-cs-avoid` to anything else they should
avoid. They start 110px below the section's top (`data-top` on
`.cs-studio-hero` changes it). Images load from this repo through jsDelivr;
upload them to Webflow and swap the URLs if you prefer.
`embeds/counsel-studio/preview.html` is the hero as Webflow would hold it,
with both embeds pasted as they are (`npm run serve`).

To rebuild the embeds after a design change: `npm run embeds` (it renders
the Studio's V20 and rewrites `hero.html`, `phone.html` and the preview).

## Where the code is

- Page markup: `src/studio-src/studio-v14.js` (V14 to V20 share it; V20 is
  `body.studio-v20`). Styles: `src/studio-src/studio-v14.css`, then
  `studio-v15.css`, `studio-v17.css`, `studio-v19.css`, `studio-v20.css`.
- Motion: `mountStudioV19` in `src/channel-v5-src/animations.js` (the dots,
  the data cards, the phone build, the brand switcher and the stats).
- The squares: `src/studio-src/squares.js`. The phone's parts:
  `src/ui-src/counsel-phone-ui.*` and `counsel-platform-composer.*`.
