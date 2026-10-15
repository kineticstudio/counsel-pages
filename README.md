# Counsel pages

Coded reference for the Webflow build of Counsel Health's site, from Kinetic
Studio: the condition pages, the content and structure notes for the next
pages, and every animated piece as a code embed. Kinetic keeps this repo
current; the Studio is the source of truth.

## Where we're at

Updated October 15, 2026. Webflow staging: counsel-inc.webflow.io.
Design links open each page on its own.

The designs on the review site carry everything Sam and Javi have sent,
including Javi's October 13 and 14 reviews of the audience pages and the
Counsel Studio round Counsel landed on (V20). Counsel will give a
thumbs-up in #counsel-health. **Once they do, the designs are the source of
truth and we build them in Webflow**, text included. Until then they can
still move.

| Page | Design | Webflow | Toqir, after Counsel's thumbs-up | Kinetic, next | Counsel |
| --- | --- | --- | --- | --- | --- |
| Home | [Home](https://counsel.kineticstudio.com/designs/counsel/01-home) | Built | How it works and pricing text from `content/homepage-updates.md`; the phone code changes in `homepage/` (the October 13 patch, then October 15's) | | Sam: good to go (Oct 15) |
| Conditions (8) | [Weight management](https://counsel.kineticstudio.com/designs/counsel/03-conditions/weight-management-v3) and seven more | Built (CMS) | Sam's copy on all eight, plus the template changes under "Condition pages" in `content/homepage-updates.md`. The re-synced `conditions/` and `src/` here show every one | | Sam reviewing; Ariela updating photography |
| Health plans | [Health Plans V6](https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/health-plans-v6) | Built, needs updating | Everything in `content/audience-pages.md`, starting with "Javi's review, October 14"; bento tiles from `embeds/health-plans/` | Five-screen walkthrough phone | Javi reviewed (Oct 13); thumbs-up to come |
| Health systems | [Health Systems V1](https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/health-systems-v1) | Not started | Duplicate Health plans, then this page's copy, the institution logos (`assets/audience-pages/institutions/`) and `embeds/health-systems/` | Same as Health plans | Same as Health plans |
| Consumer health | [Consumer Health V1](https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/consumer-health-v1) | Not started | Duplicate Health plans, drop the logo row, add the Oura banner (photo in `assets/audience-pages/oura-spotlight-app.webp`), `embeds/consumer-health/` | Same as Health plans | Same as Health plans |
| Employers | [Employers V1](https://counsel.kineticstudio.com/designs/counsel/04-audience-pages/employers-v1) | Not started | Duplicate Health plans, its own third feature, `embeds/employers/` | Same as Health plans | Same as Health plans |
| Counsel Studio | [Counsel Studio V20](https://counsel.kineticstudio.com/designs/counsel/05-counsel-studio/counsel-studio-v20) | Not started (replaces the live page) | Everything in `content/counsel-studio.md`: most sections duplicate the audience pages; bento tiles from `embeds/counsel-studio/`; `studio/counsel-studio.html` runs the page | The hero background and the phone section as embeds | Javi: "99% there"; thumbs-up to come |
| Site-wide | | | Headings render in Georgia for visitors: set `--font-cooper-light: Cooper` in Global Styles. Buttons on the audience pages hold a visible hover colour (see `content/audience-pages.md`) | | Ariela uploads new photography straight into Webflow |

How work moves:

- **Designs** (the Designs tab on counsel.kineticstudio.com) are what we
  build to, once Counsel gives the thumbs-up.
- **New work** (pages, content, embeds) lands here, one commit and one
  `CHANGELOG.md` entry per change, with a note in #counsel-dev.
- **Bugs** go in the Bug Tracker tab on counsel.kineticstudio.com. It shows
  Webflow staging in a frame, pinned to the spot, grouped Home, Conditions,
  Audience pages. Counsel logs there too. It doesn't send email yet, so
  anything urgent also goes in Slack.
- **Typos and copy fixes** on built pages: Counsel makes them directly in
  Webflow. They are not bugs.
- **Photography:** Counsel (Ariela) uploads images directly in Webflow.
- **Card Studio** makes every bento tile and walkthrough card, and Counsel
  will paste its code into Webflow themselves: see `embeds/README.md`.
- **This table** is updated with every push.

## Run it

```sh
npm run serve
```

Then open http://127.0.0.1:4321. Any static server works if it serves from the
repo root (for example `python3 -m http.server`), because the pages use root
paths like `/src/` and `/brand/`.

**Fonts:** Counsel's fonts are licensed, so they are not in the repo. Put your
copies of the web fonts in `fonts/`. They are the files from
`counsel-fonts.zip`, the same ones used in Webflow:

- `gt-america-regular`, `gt-america-medium` and `gt-america-bold`
- `cooper-light`

Each comes as `.woff2` and `.woff`. Without them the pages fall back to system
fonts.

## Pages

| Page | File | Prototype |
| --- | --- | --- |
| Weight management | `conditions/weight-management.html` | [weight-management-v3](https://counsel.kineticstudio.com/designs/counsel/03-conditions/weight-management-v3) |
| Birth control | `conditions/birth-control.html` | [birth-control-v3](https://counsel.kineticstudio.com/designs/counsel/03-conditions/birth-control-v3) |
| Hair loss | `conditions/hair-loss.html` | [hair-loss-v3](https://counsel.kineticstudio.com/designs/counsel/03-conditions/hair-loss-v3) |
| Acne | `conditions/acne.html` | [acne-v3](https://counsel.kineticstudio.com/designs/counsel/03-conditions/acne-v3) |
| Anti-aging | `conditions/anti-aging.html` | [anti-aging-v3](https://counsel.kineticstudio.com/designs/counsel/03-conditions/anti-aging-v3) |
| Herpes | `conditions/herpes.html` | [herpes-v3](https://counsel.kineticstudio.com/designs/counsel/03-conditions/herpes-v3) |
| Cold sores | `conditions/cold-sores.html` | [cold-sores-v3](https://counsel.kineticstudio.com/designs/counsel/03-conditions/cold-sores-v3) |
| Genital herpes | `conditions/genital-herpes.html` | [genital-herpes-v3](https://counsel.kineticstudio.com/designs/counsel/03-conditions/genital-herpes-v3) |

The prototype links open each page on its own, outside Kinetic's Studio,
on the review site. Weight management defines the template. Every page uses its sections, in its
order, so this is one Webflow template with CMS content, not eight builds.

## How a page is put together

- **`conditions/<page>.html`:** the page, with its markup written in. Read this
  for structure, classes and copy.
- **`src/conditions-v3-src/condition-v3.js`:** mounts the behaviour on that
  markup: the FAQ, footer, walkthrough, nav links and motion. It also holds
  the templates the markup comes from.
- **`src/conditions-v3-src/programs/*.js`:** each page's content, one object
  per page. This is the content model and maps straight onto CMS fields.
  `shared.js` holds the content the pages share.
- **`src/conditions-v3-src/condition-v3.css`:** styles for the template's own
  sections. The rest comes from the shared stylesheets, listed in each page's
  `<head>`.
- **`src/channel-v5-src/animations.js`:** the motion. The entry point is
  `mountDecorativeWeaves()`, which calls the `animateCondition*` initializers:
  - the hero line
  - section reveals
  - the check-in chat
  - physicians
  - the stories marquee
  - buttons

  It uses GSAP 3.15 with ScrollTrigger and CustomEase. There is no Lenis on
  these pages, which matches your Webflow setup.

`src/` mirrors the Studio's `designs` folder, so file names match earlier
handoffs. Only files these pages load are included. A few, such as
`studio-src/squares.js`, are only here because `animations.js` imports them.

## Sections, top to bottom

1. **Hero** (`.condition-hero`).
   - Copy (`.condition-hero-copy`): H1, subhead, three icon statements
     (`.cv3-points`) and a button.
   - Figure (`.cv3-hero-figure`): a cutout portrait.
   - The ribbon (`.cv3-thread-back`) is drawn by
     `animateConditionLifestyleHero` through points stored as fractions of the
     portrait (`CONDITION_HERO_SKETCH`). So it follows the same route at every
     width: in behind the person, and out under the next section before it
     reaches the copy.
2. **How it works** (`.cv3-how`, `ci-` classes): the Health Plans walkthrough,
   with a steps accordion and a phone. Reuse that component. Step 3's body
   is per page now (birth control has its own). Weight management's step 3
   screen is a treatment plan: a weight chart with a dashed goal line and one
   medication (the `plan` screen in `condition-v3.js`, styles in
   `condition-v3.css`). Every other step 3 card ends with "We’ll check in
   when it’s time for a refill."
3. **Ongoing care** (`.cv3-ongoing`): copy beside a check-in chat
   (`.cv3-chat`). The chat's doctor message is optional (birth control ends on
   Counsel's answer) and a chat can carry extra turns (hair loss has two
   more), so the CMS needs the doctor fields optional and room for more
   messages.
4. **Pricing** (`.cv3-pricing`): "Choose how you pay", with two plan cards
   (`.cv3-plan`). It is the same section on every page; see below.
5. **Treatment options** (`.cv3-treatments`): medication cards (`.cv3-rx`).
   The grid has five layouts:
   - `is-grid`: three or four across.
   - `is-pair`: two cards.
   - `is-single`: one card.
   - `is-trio`: acne's cleanse, treat and repair.
   - `is-photo`: birth control's photos.
6. **Physicians** (`.cv3-physicians`): a dark band.
7. **Member stories** (`.cv3-stories`): a drifting marquee. Testimonials are
   text only, never photos.
8. **FAQ** (`.cv3-faq`): the shared FAQ component, as on Health Plans.
9. **Closing** (`.v2-closing`): the shared closing card.

## Pricing and medication cost

Two rules came from Sam at Counsel on Oct 7.

**1. Pricing is about Counsel only.** Every page shows Weight Management's
"Choose how you pay":

- Unlimited care: $25/month, $300 billed annually.
- Pay per visit: $29/visit.

No page has a medication card any more, so build this as one component. Only
the "Care beyond {program}" line changes per page. Weight Management also has
its own membership note and labs footnote.

**2. Medication cost lives on the treatment cards, and each medication opts
in.** A card can show a "With insurance" line, a "Without insurance" line,
both, or neither. The copy stays this short:

```html
<dl class="cv3-rx-cost">
  <div><dt>With insurance</dt><dd>$10-40/month with most plans</dd></div>
  <div><dt>Without insurance</dt><dd>From $15/month*</dd></div>
</dl>
```

Suggested CMS model: two optional plain-text fields on the medication,
"Cost with insurance" and "Cost without insurance".

- Each row shows only when its field is filled.
- The whole block shows only when either field is filled.
- The rows sit side by side when the card is wide and stack when it is narrow
  (a CSS grid with `auto-fit` and a 200px minimum).

The current pages show every case:

- Both lines: birth control, hair loss, anti-aging and the herpes pages.
- Without insurance only: Weight management.
- None: acne.

The values are placeholders shortened from the live site. Counsel will send
the final lines.

## Still to come from Counsel

- Sam said Counsel owes a tighter definition of what each section shows. The
  layout itself is approved.
- Some copy is drafted until they confirm it:
  - the subheads
  - the check-in conversations, except Weight Management's
  - the membership note on pages other than Weight Management
  - the cost lines

## Content and embeds

`content/` holds Counsel's copy and structure notes set out for the build
(`audience-pages.md`, `homepage-updates.md`). `homepage/` holds the homepage
phone's code changes. `assets/` holds new images the audience pages need
(Health systems' institution logos, the Oura banner photo); the sync never
touches it. `embeds/` holds every animated piece as a
self-contained code embed, with a table of where each one goes and the Card
Studio guide.

## Updates

Kinetic regenerates this repo from the Studio after each design change, with
one commit per change. `git log -p`, or GitHub's compare view, shows exactly
what moved, and `CHANGELOG.md` sums up each one. The Studio is the source of
truth, so if something here needs to change, tell Hunter rather than editing
it in place. (`tools/` is Kinetic's sync and preview tooling; the build
doesn't need it.)
