# Embeds

Every piece that animates on the Counsel site is a code embed built in
Kinetic's Card Studio and delivered here, one file per place on a page. Each
file is self-contained: its own scoped styles, its markup, and its motion
(GSAP 3.15, loaded from the CDN only if the page has none). Paste the file's
contents into the Webflow embed named in the table. Fonts come from the
page.

| File | Page | Where it goes | Status |
| --- | --- | --- | --- |
| `health-plans/*.html` | Health plans | the bento tiles' graphic embeds (`.v2-value-art`, `.v5-escalation-art`), one per tile in the order in `content/audience-pages.md` | in progress |
| `health-systems/*.html` | Health systems | same | in progress |
| `consumer-health/*.html` | Consumer health | same | in progress |
| `employers/*.html` | Employers | same | in progress |
| `walkthrough/*.html` | all four audience pages | the walkthrough phone (`.ci-sky`), five screens | to come |
| `homepage/phone.html` | Homepage | the walkthrough phone, four screens | to come |

Tiles whose graphic rises from the tile's bottom edge need their copy
ordered first, as `.v5-value-escalation .v2-value-copy{order:-1}` does for
the escalation tile: White label, Shift care upstream, Strengthen the user
experience and Amplify utilization of your benefits ecosystem.
