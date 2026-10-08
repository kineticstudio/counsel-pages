// Code-built version of Hunter's cropped app-and-composer reference.
// This is an illustration, with no medical input or live availability lookup.
const attachment = '<svg class="ea-attachment" viewBox="0 0 24 26" fill="none" aria-hidden="true"><path d="M21.7 14.3 11.2 24a6.6 6.6 0 0 1-9.3-9.3L14.3 2.3a4.4 4.4 0 0 1 6.2 6.2L8.2 20.8a2.2 2.2 0 0 1-3.1-3.1L16.4 6.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const send = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20V4M4 12l8-8 8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const chevron = '<svg class="ea-chevron" viewBox="0 0 12 20" fill="none" aria-hidden="true"><path d="m2 2 8 8-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function embeddedGraphic(){
  return `<div class="v2-embedded-app" role="img" aria-label="Preview of Counsel embedded in your app, with your app branding, a Counsel doctor team, an Ask a doctor row and an Ask anything message field. The wait time is illustrative."><div class="ea-app-frame" aria-hidden="true">
    <div class="ea-app-heading"><span class="ea-app-icon"></span><span class="ea-app-name">Your app</span></div>
    <div class="ea-care-composer">
      <div class="ea-care-row"><span class="ea-doctors">${[1,2,3].map(n=>`<img src="/brand/photography/doctors/counsel-doctor-0${n}.webp" alt="" width="62" height="62" loading="lazy">`).join("")}</span><span class="ea-care-label">Ask a doctor</span><span class="ea-wait">2 min wait</span>${chevron}</div>
      <div class="ea-care-field"><span class="ea-placeholder">Ask anything...</span>${attachment}<span class="ea-send">${send}</span></div>
    </div>
  </div></div>`;
}
