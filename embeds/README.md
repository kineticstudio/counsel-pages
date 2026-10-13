# Embeds

Every piece that animates on the Counsel site is a code embed made in
Kinetic's Card Studio and delivered here, one file per place on a page. Each
file is self-contained: its own scoped styles, its markup, and its motion
(GSAP 3.15, loaded from the CDN only if the page has none). Paste the file's
contents into the Webflow embed named in the table. Fonts come from the page.

| File | Page | Where it goes | Status |
| --- | --- | --- | --- |
| `health-plans/*.html` | Health plans | the bento tiles' graphic embeds (`.v2-value-art`, `.v5-escalation-art` for the triage tile); the number in each file name is the tile's place, as in `content/audience-pages.md` | ready; build after Counsel's thumbs-up |
| `health-systems/*.html` | Health systems | same | same |
| `consumer-health/*.html` | Consumer health | same | same |
| `employers/*.html` | Employers | same | same |
| `walkthrough/*.html` | all four audience pages | the walkthrough phone (`.ci-sky`), five screens | to come |
| `../homepage/` | Homepage | the walkthrough phone: code changes, not a Card Studio embed | ready; build after Counsel's thumbs-up |

Tiles whose graphic rises from the tile's bottom edge need their copy
ordered first, as `.v5-value-escalation .v2-value-copy{order:-1}` does for
the escalation tile: White label, Shift care upstream, Strengthen the user
experience and Amplify utilization of your benefits ecosystem.

The triage tile's graphic (Health plans and Health systems, tile 1) now sits
in a hairline frame that fills the tile's art area, from Counsel's note that
it felt floaty. Its embed's wrapper stretches to fill the art area, so that
area must stay a flex column, as it is in the Health Plans template. No other
tile has a frame.

## Card Studio

Every embed here comes out of Card Studio. This is its permanent link (it
replaces the old `card-studio-v3` link):

https://counsel.kineticstudio.com/prototypes/counsel/card-studio

It stays on Kinetic's review site while we tune things after launch. Once it
settles, Kinetic hands over the code so Counsel can host it on
councilhealth.design and change the tool themselves.

Counsel wants to change these without a developer, so the tool is built for
copy and paste.

### Where things are

- **Top bar:** **Phone cards** or **Bento**, the two kinds of thing it makes.
- **Left:** **New** starts a card. **Page** picks Health plans, Health
  systems, Consumer health or Employers; the list below it is that page's
  tiles, in page order. A page opens directly with `?page=health-plans`
  (or `health-systems`, `consumer-health`, `employers`).
- **Middle:** the preview. **Tile** shows the selected tile at its real
  width. **Whole page** shows the page's whole bento at desktop width.
  **Replay** plays the motion again.
- **Right:** the selected card's fields (messages, labels, the brands in the
  white-label phone, the record in the EHR graphic and so on), its colour and
  graphic. Then **Reset** (back to Kinetic's version), **Duplicate**,
  **Delete**, **Copy code** and **Download PNG**.

### A bento tile into Webflow

1. Choose **Bento**, the page, then the tile.
2. Change its fields if needed. The preview updates as you type.
3. Choose **Copy code**.
4. In the Webflow Designer, open that tile's Code Embed (inside
   `.v2-value-art`; for the triage tile, `.v5-escalation-art`), replace
   everything in it with what you copied, and save.
5. Publish to staging and check it in the Bug Tracker tab.

The tile's title and body are ordinary Webflow text, not part of the embed.
Text inside the graphic (a chat message, a label) is changed in Card Studio
and pasted again.

### A phone card into the walkthrough

1. Choose **Phone cards**, then **New**, and pick the kind of card: a
   question, an AI reply, a care plan, a prescription, progress or a
   follow-up.
2. Edit it and place it on the phone preview (drag it, or use the arrow
   keys).
3. Choose **Copy code** and paste it into that walkthrough step's Code Embed
   over the phone (`.ci-sky`), one card per step.

### What each embed does

- Its styles are scoped to that one embed, so two never clash.
- The tile's colours are baked in.
- It loads GSAP 3.15 from jsDelivr only if the page has none.
- It plays once as it scrolls into view, and shows its final frame to anyone
  with reduced motion on.
- It stays under Webflow's 50,000-character embed limit.
- Fonts come from the page.

Drafts save in the browser of whoever is editing, not to a server, so the
pasted embed in Webflow is the record. On another computer, or after
clearing the browser, **Reset** brings back Kinetic's version of each tile.

### Set up once in Webflow (Toqir)

1. Every bento tile's art area and every walkthrough step holds a Code
   Embed, so Counsel can paste into it in the Designer.
2. The four tiles whose graphic is a phone rising from the bottom edge have
   their copy first, as above.
3. Each tile's art area is a flex column, as in the Health Plans template, so
   the triage frame can fill it.
4. Nothing to set for scrolling: the page scrolls inside the window, as it
   does in Webflow.
