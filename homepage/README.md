# Homepage: Sam's October 12 changes

The Studio's Home V13 now carries all of Sam's homepage changes:
https://counsel.kineticstudio.com/designs/counsel/01-home/home-hero-weave-v13

Build them once Counsel gives the thumbs-up in #counsel-health. Until then the
design may still move.

## Text in Webflow

The How it works step copy and the whole pricing section are plain Webflow
text. Every old and new line is in `../content/homepage-updates.md`.

## The phone (code)

The walkthrough phone is code. It is built from
`counsel-care-journey-v13.js`. Nothing about how it works has changed: same
four cards, same scroll behaviour, same classes. Only what the cards say and
one condensed row are different:

- **Screen 1:** Nora's question and Counsel's three-paragraph answer. The
  source chips stay.
- **Screen 2:** no change.
- **Screen 3:** when the doctor card condenses, it now becomes the doctor's
  message ("I’m ordering some labs to help figure out what’s going on.") with
  a round photo, instead of the "Your doctor joined, $29" row. The green card
  is now a lab order on the same map: label "Lab order", title "Lab ordered",
  "Quest Diagnostics · 0.6 mi".
- **Screen 4:** its condensed row reads "Lab ordered at Quest". Then the
  doctor's vitamin D message and Nora's reply. The chat ends on the doctor
  typing (three dots in a blue bubble, with the doctor's photo), which shows
  the conversation carrying on.

Files here:

- `oct-13-homepage.patch`: exactly what changed, against the version the
  Webflow phone was built from. Apply the `counsel-care-journey-v13.js` part
  to the phone code; the `counsel-home-v13.js` part is the same copy as the
  Webflow text above, for reference.
- `counsel-care-journey-v13.js` and `counsel-home-v13.js`: the current files
  in full, if replacing is easier than patching.

New CSS is the seven lines after `.cj-stitch-active .is-current .cj-typing-dots i`
in the patch: `.cj-compact-avatar`, `.cj-doctor .cj-compact span` and
`.cj-doctor-typing`.
