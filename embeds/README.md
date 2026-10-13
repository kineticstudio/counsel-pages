# Embeds

Every piece that animates on the Counsel site is a code embed built in
Kinetic's Card Studio and delivered here, one file per place on a page. Each
file is self-contained: its own scoped styles, its markup, and its motion
(GSAP 3.15, loaded from the CDN only if the page has none). Paste the file's
contents into the Webflow embed named in the table. Fonts come from the
page.

| File | Page | Where it goes | Status |
| --- | --- | --- | --- |
| `health-plans/*.html` | Health plans | the bento tiles' graphic embeds (`.v2-value-art`, `.v5-escalation-art`); the number in each file name is the tile's place, as in `content/audience-pages.md` | ready, in review with Javi |
| `health-systems/*.html` | Health systems | same | ready, in review with Javi |
| `consumer-health/*.html` | Consumer health | same | ready, in review with Javi |
| `employers/*.html` | Employers | same | ready, in review with Javi |
| `walkthrough/*.html` | all four audience pages | the walkthrough phone (`.ci-sky`), five screens | to come |
| `homepage/phone.html` | Homepage | the walkthrough phone, four screens | to come |

Tiles whose graphic rises from the tile's bottom edge need their copy
ordered first, as `.v5-value-escalation .v2-value-copy{order:-1}` does for
the escalation tile: White label, Shift care upstream, Strengthen the user
experience and Amplify utilization of your benefits ecosystem.

## Card Studio: making and changing these yourselves

Every embed here comes out of Kinetic's Card Studio, a tool on the share:
https://counsel.kineticstudio.com/prototypes/counsel/card-studio-v3

Counsel wants to be able to change these without a developer, so the tool
is built for copy and paste:

- **Bento:** pick the page (Health plans, Health systems, Consumer health,
  Employers), pick a tile, edit its fields (messages, labels, the brands in
  the white-label phone, the record in the EHR graphic and so on), switch
  its colour or graphic, then **Copy code** and paste it into that tile's
  Code Embed (`.v2-value-art`, or `.v5-escalation-art` for the triage tile).
  "Whole page" shows a page's whole bento at 1440 before anything is pasted.
- **Phone cards:** the cards that float over the walkthrough phone (a
  question, an AI reply, a care plan, a prescription, progress, a
  follow-up). Edit, place it on the phone, **Copy code**, and paste into a
  Code Embed in the walkthrough.
- Each embed is self-contained: its own scoped styles (so two never clash),
  its markup with the tile's colours baked in, and its motion. It loads GSAP
  3.15 from jsDelivr only if the page has none, plays once as it scrolls into
  view, and shows its final frame for reduced motion. It stays under
  Webflow's 50,000-character embed limit. Fonts come from the page.
- Drafts save in the browser of whoever is editing, not to a server, so the
  pasted embed is the record.

What Toqir needs to set up once:

1. Every bento tile and walkthrough card slot is a Code Embed in Webflow, so
   Counsel can paste into it in the Designer.
2. Tiles whose graphic rises from the bottom edge (white label, shift care
   upstream, strengthen the user experience, benefits) have their copy
   ordered first, as the escalation tile does.
3. The page scrolls inside the window, as it does in Webflow; nothing to set.
