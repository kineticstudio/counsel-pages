# Changelog

## October 16, 2026: Counsel Studio's hero embeds

- **Counsel Studio:** the two embeds the hero was waiting on.
  `embeds/counsel-studio/hero.html` is the background (the squares and the
  data cards) and `phone.html` the phone section (switcher, app, sheet,
  labels). Where each goes, and the hero's text and spacing, are in
  `content/counsel-studio.md` under "The hero in Webflow".
  `embeds/counsel-studio/preview.html` shows both pasted into a page like
  Webflow's. `npm run embeds` rebuilds them from the Studio.

## October 15, 2026: Sam's last homepage edit

- **Homepage phone, screen 4:** the doctor's message and Nora's reply are now
  about iron deficiency anemia (Sam, #counsel-health). `homepage/oct-15-homepage.patch`
  has just this change; `homepage/counsel-care-journey-v13.js` is current.
  Sam: good to go after this.

## October 15, 2026: Counsel Studio V20, and Javi's October 14 review

- **Counsel Studio:** the round Counsel landed on (V20), in
  `content/counsel-studio.md` section by section, with
  `studio/counsel-studio.html` running the page (the sync now covers it) and
  its four bento tiles in `embeds/counsel-studio/`. Card Studio has a Counsel
  Studio page for them.
- **Audience pages:** Javi's October 14 changes at the top of
  `content/audience-pages.md` (Health systems drops "physician", a larger
  triage graphic, no tile frames, a wider Employers card, graphics centred in
  their tiles, the Oura photo showing the whole phone).
- **Embeds, re-exported:** every tile on all four audience pages.

## October 13, 2026, last thing: assets moved to `assets/`

- The institution logos and the Oura banner photo now live in
  `assets/audience-pages/`, where the Studio sync can't remove them (it
  rebuilds `brand/` with only what the condition pages load). Same files.

## October 13, 2026, end of day: everything current

- **Condition pages, re-synced:** their links now point at Home's new
  address. No visible change otherwise.
- **Assets:** the Health systems institution logos
  (`brand/partners/institutions/`) and the Oura banner photo
  (`brand/photography/oura-spotlight-app.webp`), both from the live site.
- **Status:** the README's table is current for every page, including Javi's
  review and Counsel Studio's direction.

## October 13, 2026: Javi's review of the audience pages

- **Content:** `content/audience-pages.md` opens with Javi's October 13
  changes (walkthrough heading and step 4, Health plans hero and fifth stat,
  "A white-labeled, custom experience", Health systems' "physician capacity"
  and institution logos, Consumer health without a logo row and with the
  live site's Oura banner), and the copy below it is updated to match.
- **Embeds, re-exported:** the triage tile shows the live site's routes
  (Counsel Physicians and its three branches, your benefits ecosystem and
  programs, in-network providers); the white label brands are clickable; the
  EHR graphic has clearer arrows and a roomier record; Care in one place
  runs two columns in narrow tiles.

## October 13, 2026: Home's new link

- The homepage design is now called Home in the Studio, at
  https://counsel.kineticstudio.com/designs/counsel/01-home (it was Home V13).
  Same page, same content.

## October 13, 2026, after the call: Sam's changes in the designs, for the build

- **Process:** the designs on the review site now carry everything Sam and
  Javi sent. Once Counsel gives the thumbs-up in #counsel-health, build them
  in Webflow, text included. The README's table says what each page needs.
- **Homepage:** `homepage/` has the phone's code changes (a patch plus the
  full files): Nora's new story (tired, labs, low vitamin D), the doctor's
  message in place of the "Your doctor joined, $29" row, a lab order card,
  and the chat ending on the doctor typing. `content/homepage-updates.md`
  has the step and pricing text.
- **Condition pages, re-synced:** Sam's copy on all eight. Template changes:
  weight management's new step 3 treatment plan screen, birth control's chat
  without a doctor message, hair loss's two extra chat turns, the refill line
  on every step 3 card, a per-page step 3 body. Listed in
  `content/homepage-updates.md`.
- **Bento embeds, re-exported:** the triage tile (Health plans and Health
  systems, tile 1) now sits in a hairline frame that fills its art area.
  Nothing else changed visibly; every file has a fresh style scope.
- **Card Studio:** new permanent link,
  https://counsel.kineticstudio.com/prototypes/counsel/card-studio, and a
  step-by-step guide to pasting tiles and phone cards into Webflow in
  `embeds/README.md`.

## October 13, 2026: Counsel's October 12 updates, for the build

- **Bento embeds:** all 22 tiles for the four audience pages are in
  `embeds/<page>/`, one file per tile, numbered in tile order. In review with
  Javi; paste once he signs off.
- **Card Studio:** `embeds/README.md` explains the tool Counsel uses to make
  and change these (bento tiles and walkthrough phone cards), and the one-time
  setup it needs in Webflow so they can paste in themselves.
- **Status:** the README opens with a "Where we're at" table: every page,
  whether it's built, what's next for Toqir, Kinetic and Counsel. It's
  updated with every push.
- **Audience pages:** `content/audience-pages.md` sets out Javi's copy for
  the four pages on the Health Plans template (Health plans with its copy
  changes, Health systems, Consumer health, Employers): hero, logos, the
  five-step walkthrough, each page's bento with tile order, widths and
  copy, stats, scope of care without its button, closings. Open points
  with Counsel are listed at the end.
- **Homepage:** `content/homepage-updates.md` sets out Sam's homepage
  changes: walkthrough step copy and the pricing section (Webflow text),
  the four phone screens (Kinetic's embed), and the three condition-page
  notes that change the template.
- **Embeds:** `embeds/README.md` lists every animated piece, where it goes
  and its status. The bento graphics are in progress; the walkthrough and
  homepage phones follow.
- **Condition pages, re-synced:** the footer's Health plans link now points at
  the new Health plans page (the old one is archived on the share), and the
  weave pattern picked up a palette option. No visible change otherwise.

## October 8, 2026: first export

- **Pages:** eight condition pages on the Weight Management template:
  - Weight management
  - Birth control
  - Hair loss
  - Acne
  - Anti-aging
  - Herpes
  - Cold sores
  - Genital herpes
- **Content:** each page's content is from its live counselhealth.com page,
  captured October 6, set into the template.
- **Pricing (Sam's note, October 7):** every page uses Weight Management's
  "Choose how you pay" section, covering Counsel's own cost only. The
  consultation and medication cards are gone.
- **Medication cost (Sam's note, October 7):** cost now sits on the treatment
  cards, as optional "With insurance" and "Without insurance" lines per
  medication.
