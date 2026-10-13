/* Hunter, 2026-09-15: V13 follows the supplied brand-book chat references.
   Cards appear inside the phone and condense. Prototype illustration, not a live care session.
   V13 only. No production video or appointment-booking capability implied. */
(() => {
  // Hunter, 2026-09-22: current primitives shared with the page and channel art.
  const C = window.CounselColors;
  const phoneUI = window.CounselPhoneUI;
  const platformComposer = window.CounselPlatformComposer;
  const root = document.getElementById('walkthrough');
  if (!root || root.dataset.journeyReady) return;
  root.dataset.journeyReady = 'true';
  const frame = root.querySelector('.ch-walk-frame');
  const steps = [...root.querySelectorAll('.ch-walk-steps li')];
  const scroller = document.getElementById('stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Hunter, 2026-09-10: supplied portrait 01 replaces the sourced placeholder.
  // Identity is not confirmed, so the full card and history remain unnamed.
  const doctorPortrait = '/brand/counsel/photography/doctors/counsel-doctor-01.webp';
  // Hunter, 2026-09-15: three possible doctors, as shown in the supplied chat reference.
  // Portraits are illustrative. These do not represent a confirmed match or live wait time.
  const doctorPortraits = [doctorPortrait,
    '/brand/counsel/photography/doctors/counsel-doctor-03.webp',
    '/brand/counsel/photography/doctors/counsel-doctor-02.webp'];
  const avatars = () => doctorPortraits.map(src => `<img src="${src}" alt="">`).join('');
  const style = document.createElement('style');
  style.textContent = `
/* Hunter, 2026-09-10: one chat, with large edge-entering cards that
   condense into its history. Geometry is scrubbed by scroll, never faded. */
.ch-walk .ch-walk-frame { top: 6svh; height: 88svh; } /* Hunter, 2026-09-11, o095mr0d: taller, slimmer chat. */
.ch-walk .ch-walk-frame::before { display: none; }
.ch-walk .ch-walk-steps li { min-height: 85svh; }
.cj-step-copy { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
/* Hunter, 2026-09-11, o095mr0d: slimmer/taller phone, retaining its Blue 2 surround. */
.cj-scene { position: relative; isolation: isolate; width: min(390px, 100%); height: min(740px, 84svh); min-height: 500px; background: #fff; border-radius: 24px; box-shadow: 0 0 0 12px var(--blue-2); }
.cj-chat-head { position: absolute; inset: 16px 20px auto; height: 52px; display: flex; align-items: center; gap: 10px; font: 500 var(--type-small,14px)/1.3 var(--body-font); } /* Hunter, 2026-09-11, m2pdbasw: more air above the header. */
/* Hunter, 2026-09-10: the C mark and named participants make this product UI, not a marketing panel. */
.cj-chat-logo { width: 28px; height: 32px; flex: none; background: var(--blue-9); mask: url('/brand/counsel/mark.svg') center/contain no-repeat; }
.cj-chat-identity { display: grid; gap: 2px; }
.cj-chat-identity b { font: 500 var(--type-ui,16px)/1.2 var(--body-font); }
.cj-chat-identity small { font: 400 var(--type-chip,12.5px)/1.2 var(--body-font); color: var(--blue-7); }
.cj-stack { position: absolute; inset: 80px 16px 72px; clip-path: inset(0 -100vw 0 -100vw); }
.cj-message { position: absolute; left: 0; top: 0; width: 100%; visibility: hidden; will-change: transform; }
.cj-lead { position: absolute; right: 100%; top: 28px; height: 7px; width: var(--cj-lead-width,100vw); background: var(--cj-color); transform-origin: right; pointer-events: none; }
.cj-card { position: relative; width: 100%; height: 100%; padding: 0; border-radius: var(--card-r,12px); background: var(--gray-1); color: var(--blue-9); overflow: hidden; }
.cj-detail { position: absolute; inset: 0 0 auto; height: var(--cj-card-height); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; }
/* Hunter, 2026-09-10: a compact row never stretches with the collapsing card. */
.cj-compact { position: absolute; inset: 0 0 auto; height: 48px; visibility: hidden; display: flex; align-items: center; gap: 10px; padding: 0 12px; font: 400 var(--type-small,14px)/1.3 var(--body-font); }
.cj-compact img { width: 28px; height: 28px; object-fit: cover; border-radius: 7px; flex: none; }
.cj-compact i { font-style: normal; width: 26px; text-align: center; flex: none; }
.cj-compact i svg { display: block; width: 24px; height: 24px; }
.cj-compact .cj-nora-avatar { height: 26px; border-radius: 7px; background: var(--blue-9); color: #fff; font: 500 var(--type-chip,12.5px)/26px var(--body-font); } /* Hunter, 2026-09-10: Nora's initial identifies her compact messages. */
.cj-compact span { flex: 1; min-width: 0; }
.cj-compact small { font: 400 var(--type-chip,12.5px)/1.2 var(--body-font); color: var(--blue-7); flex: none; }
/* Hunter, 2026-09-10, ok3s6bty: a Blue 1 field with the brand stitch and navy send tile. Still an illustration, not an input. */
.cj-composer { position: absolute; bottom: 12px; left: 16px; right: 16px; height: 48px; padding: 0 10px 0 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px; border-radius: 10px; background: var(--blue-1); color: var(--blue-9); font: 400 var(--type-body,17px)/1.3 var(--body-font); }
.cj-composer-label { display: flex; align-items: center; gap: 8px; min-width: 0; white-space: nowrap; }
.cj-composer-mark { width: 18px; height: 18px; flex: none; }
/* Hunter, 2026-09-11: a quiet diagonal pulse in the composer stitch only. */
.cj-composer-mark rect { transform-box: fill-box; transform-origin: center; animation: cj-stitch-pulse 2800ms ease-in-out infinite; animation-delay: var(--stitch-delay); animation-play-state: paused; }
.cj-stitch-active .cj-composer-mark rect { animation-play-state: running; }
@keyframes cj-stitch-pulse {
  0%, 25%, 85%, 100% { opacity: .65; transform: scale(.88); }
  55% { opacity: 1; transform: scale(1); }
}
.cj-composer-send { width: 28px; height: 28px; border-radius: 8px; background: var(--blue-9); color: var(--gray-1); display: grid; place-items: center; flex: none; }
.cj-label { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 12.5px; font-weight: 500; line-height: 1.2; position: relative; z-index: 2; }
/* Hunter, 2026-09-10, jvxd3xn6: labels only, no 01-04 counters. */
.cj-ui-title { font: 500 var(--type-body,17px)/1.4 var(--body-font); margin: 0; }
.cj-ui-copy { font: 400 var(--type-body,17px)/1.4 var(--body-font); margin: 0; }
html[data-counsel-type="v13"] .cj-detail .cj-ui-copy,
html[data-counsel-type="v13"] .cj-detail .cj-ui-title { font-size: var(--type-body,17px); line-height: 1.4; letter-spacing: 0; opacity: 1; max-width: none; } /* Hunter, 2026-09-10: preserve UI type when mobile cards move beneath the written steps. */
.cj-meta { font: 400 var(--type-small,14px)/1.4 var(--body-font); color: var(--blue-7); }
.cj-sender { display: flex; align-items: center; gap: 8px; font: 500 var(--type-chip,12.5px)/1.2 var(--body-font); }
.cj-sender img { width: 28px; height: 28px; border-radius: 7px; object-fit: cover; }
.cj-outgoing { display: grid; justify-items: end; gap: 6px; }
.cj-ask, .cj-follow { background: #fff; }
.cj-ask .cj-detail, .cj-follow .cj-detail { justify-content: flex-start; gap: 24px; } /* Hunter, 2026-09-10: messages follow one another, not opposite edges of a poster. */
.cj-note { font-size: 14px; line-height: 1.4; margin: 0; }
.cj-question { background: var(--blue-9); color: var(--gray-1); border-radius: 12px 12px 3px 12px; padding: 16px; align-self: flex-end; max-width: 94%; font-size: 17px; line-height: 1.4; }
.cj-answer { display: grid; gap: 12px; }
.cj-thought { display: inline-flex; align-items: center; gap: 12px; font-size: 12.5px; color: var(--blue-7); }
.cj-thought .counsel-thinking { grid-template-columns: repeat(3, 6px); gap: 5px; }
.cj-thought .counsel-thinking i { width: 6px; height: 6px; animation-play-state: paused; }
.is-current .cj-event:not([hidden]) .counsel-thinking i { animation-play-state: running; }
.cj-answer-copy { opacity: 1; justify-self: start; max-width: 94%; }
/* Hunter, 2026-09-11: AI replies use soft incoming bubbles, with thinking separate. */
.cj-answer-copy .cj-ui-copy { background: var(--blue-1); border-radius: 12px 12px 12px 3px; padding: 16px; }
.cj-transcript { height: 100%; overflow: hidden; display: block; }
.cj-transcript-track { display: grid; gap: 18px; }
.cj-event[hidden] { display: none !important; }
.cj-event { transform: translateY(var(--cj-pop,0px)); opacity: var(--cj-reveal,1); } /* Hunter, 2026-09-11, 8teqpez3: soften chat arrivals with a fade. */
/* Hunter, 2026-09-11: ease new message space with scroll, without fading text. */
.cj-event-slot { overflow: hidden; flex: none; }
.cj-event-slot[hidden] { display: none !important; }
@media (min-width: 901px) {
  .cj-transcript-track { gap: 0; }
  .ch-walk .cj-follow.cj-card .cj-detail { gap: 0; }
  .cj-follow .cj-label { margin-bottom: 12px; }
}
.cj-answer-copy .cj-sender { margin-bottom: 8px; }
.cj-nora-typing { justify-content: flex-end; }
.cj-source { display: inline-block; margin-top: 7px; font-size: 11px; color: var(--blue-7); text-decoration: none; }
.cj-doctor { background: var(--blue-2); }
/* Hunter, 2026-09-10: supplied doctor portrait, shared with the image library. */
.cj-doctor-photo { display: block; margin: 0 auto; width: min(100px, max(44px, calc(var(--cj-card-height) - 320px))); height: min(100px, max(44px, calc(var(--cj-card-height) - 320px))); flex: none; border-radius: var(--card-r, 12px); object-fit: cover; object-position: center; } /* Hunter, 2026-09-10: preserve the action and copy when a short desktop viewport limits the card height. */
.cj-add-doctor { width: 100%; flex: none; } /* Hunter, 2026-09-10, 2zkkiwo8. */
.cj-doctor-foot { display: grid; gap: 10px; }
/* Hunter, 2026-09-11, nkz4e7az: Cooper title, stronger portrait and visit detail. */
html[data-counsel-type="v13"] .cj-doctor .cj-ui-title { font: 300 var(--type-sm,28px)/1.12 var(--display-font); letter-spacing: -.02em; }
.cj-doctor .cj-detail { height: auto; justify-content: flex-start; gap: 18px; } /* Hunter, 2026-09-11, loi8fn7f: fit the card to its content. */
.cj-doctor-header { display: flex; align-items: center; gap: 16px; }
.cj-doctor-photo { width: 80px; height: 88px; margin: 0; }
.cj-doctor .cj-add-doctor { margin-top: 0; } /* Hunter, 2026-09-11, loi8fn7f: keep the button beside the visit detail, not at the far edge. */
.cj-doctor .cj-meta { color: var(--blue-9); }
.cj-visit-price { font: 500 var(--type-ui,16px)/1.4 var(--body-font); }
.cj-cost { font: 300 40px/1 var(--display-font); }
.cj-cost small { display: block; margin-top: 5px; font: 400 12.5px/1.2 var(--body-font); }
.cj-pharmacy { background: var(--green-1); color: var(--green-7); }
.cj-map { width: 100%; flex: 1; min-height: 80px; max-height: 180px; }
.cj-route { stroke-dasharray: 1; stroke-dashoffset: var(--cj-route-left,1); }
.cj-map-pin { transform: translateY(var(--cj-pin-y,-12px)) scale(var(--cj-pin-scale,.8)); transform-origin: 240px 100px; }
.cj-pharmacy .cj-meta, .cj-pharmacy .cj-compact small { color: var(--green-7); } /* Hunter, 2026-09-11, l7x6nqe8: keep prescription details green, not blue. */
.cj-delivery { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.cj-check { width: 30px; height: 30px; border-radius: 50%; background: var(--green-7); color: var(--green-1); display: grid; place-items: center; font-size: 18px; flex: none; }
.cj-follow-copy { display: grid; gap: 10px; }
.cj-follow-copy { background: var(--blue-2); border-radius: 12px 12px 12px 3px; padding: 16px; } /* Hunter, 2026-09-11, ltyk7qgc: doctor replies retain their blue. */
.cj-follow .cj-detail { gap: 12px; }
.cj-visit-remaining { display: block; text-align: center; align-self: stretch; } /* Hunter, 2026-09-11: center the remaining visit time. */
/* Hunter, 2026-09-11: compact furniture, not smaller body text, when history shares the window. */
.cj-card.is-tight .cj-detail { padding: 14px; gap: 8px; }
.cj-doctor.is-tight .cj-doctor-photo { width: 44px; height: 48px; }
.cj-doctor.is-tight .cj-doctor-header { gap: 10px; }
.cj-doctor.is-tight .cj-doctor-foot { gap: 6px; }
.cj-follow.is-tight .cj-follow-copy { padding: 12px; gap: 6px; }
.cj-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.cj-days i { height: 7px; background: var(--gray-2); border-radius: 2px; }
.cj-days i:nth-child(-n+3) { background: var(--green-3); }
.cj-days i:nth-child(3) { background: var(--green-7); }
/* Hunter, 2026-09-10, go4ies8b: remove the caption below the chat. */
@media (max-width: 900px) {
  .ch-walk { --cj-frame-h: clamp(450px,58svh,510px); } /* Hunter, 2026-09-10, ok3s6bty: preserve story-card room with the 48px field. */
  .ch-walk .ch-walk-frame { height: var(--cj-frame-h); min-height: 0; top: 16px; padding: 0; margin-bottom: 16px; } /* Hunter, 2026-09-10: reserve room for the complete step copy. */
  .ch-walk .ch-walk-frame::after { content: ''; position: absolute; top: 100%; left: 0; right: 0; height: 24px; background: var(--blue-1); z-index: -1; } /* Protect the outer frame as copy passes behind it. */
  .cj-scene { width: min(320px, 90%); height: 100%; min-height: 0; border-radius: 18px; box-shadow: 0 0 0 8px var(--blue-2); }
  .cj-chat-head { top: 16px; height: 40px; left: 14px; right: 14px; }
  .cj-chat-logo { width: 24px; height: 28px; }
  .cj-stack { inset: 72px 12px 64px; }
  .cj-composer { left: 12px; right: 12px; bottom: 8px; }
  .cj-detail { padding: 14px; gap: 8px; }
  .cj-ask .cj-detail, .cj-follow .cj-detail { gap: 12px; }
  .cj-compact { gap: 6px; padding: 0 8px; }
  .cj-question { font-size: 16px; padding: 12px; }
  .cj-answer-copy .cj-ui-copy { padding: 12px; }
  .cj-note { font-size: 13px; }
  .cj-answer { gap: 8px; }
  .cj-follow { padding: 0; }
  .cj-doctor-photo { width: 64px; height: 70px; }
  .cj-doctor .cj-detail { gap: 10px; }
  .cj-doctor-foot { gap: 8px; }
  .ch-walk .ch-walk-steps li { display: block; min-height: 90svh; padding: 0; }
  .cj-step-copy { position: sticky; top: calc(16px + var(--cj-frame-h) + 16px); }
  .ch-walk-steps li:not(.on) .cj-step-copy { visibility: hidden; } /* Hunter's chat flow, 2026-09-10: only its current caption on phones. */
  /* Hunter, 2026-09-11: all mobile widths use a connected reading story,
     with content-sized chat moments below the copy, never a sticky phone. */
  .ch-walk.cj-flow .ch-walk-frame { display: none; }
  .ch-walk.cj-flow .ch-walk-steps { position: relative; width: 100%; }
  .ch-walk.cj-flow .ch-walk-steps li { position: relative; min-height: 0; display: flex; flex-direction: column; align-items: stretch; justify-content: flex-start; gap: 24px; padding: 0 0 48px 20px; opacity: 1; cursor: default; }
  .ch-walk.cj-flow .ch-walk-steps li::before { content: ''; position: absolute; left: 0; top: 10px; bottom: -10px; width: 2px; background: var(--blue-2); }
  .ch-walk.cj-flow .ch-walk-steps li::after { content: ''; position: absolute; left: -3px; top: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--blue-7); }
  .ch-walk.cj-flow .ch-walk-steps li:last-child { padding-bottom: 0; }
  .ch-walk.cj-flow .ch-walk-steps li:last-child::before { bottom: 0; }
  .ch-walk.cj-flow .cj-step-copy { position: static; visibility: visible; }
  .ch-walk.cj-flow .cj-message { position: relative; min-width: 0; will-change: auto; }
  .ch-walk.cj-flow .cj-card { height: auto; }
  .ch-walk.cj-flow .cj-detail { position: relative; inset: auto; height: auto; padding: 16px; gap: 18px; }
  .ch-walk.cj-flow .cj-transcript { height: auto; overflow: visible; }
  .ch-walk.cj-flow .cj-map { flex: none; height: auto; aspect-ratio: 320 / 165; max-height: none; }
  .ch-walk.cj-flow .cj-lead, .ch-walk.cj-flow .cj-compact { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .cj-scene *, .cj-scene *::before, .cj-message, .cj-message *, .cj-message *::before { animation: none !important; transition: none !important; } /* Hunter, 2026-09-10: include cards moved into the short-phone reading flow. */
  .cj-lead { display: none; }
  .cj-answer-copy { opacity: 1; }
}
/* Hunter, 2026-09-11: V13 mobile split screen. One page scroll drives both
   the assembling phone above and the copy passing beneath its soft edge. */
@media (max-width: 900px) {
  /* Hunter, 2026-09-11: no scroll hold. Each page pixel moves copy one pixel. */
  .ch-walk.cj-split { height: calc(var(--cj-viewport-h) + var(--cj-copy-h) * 4); padding: 0; }
  .ch-walk.cj-split .ch-wrap { position: sticky; top: 0; width: 100%; height: var(--cj-viewport-h); display: grid; grid-template-columns: minmax(0,1fr); grid-template-rows: var(--cj-split-top) var(--cj-copy-h); gap: 0; overflow: hidden; }
  /* Hunter, 2026-09-11: more air above the mobile phone, without its header. */
  .ch-walk.cj-split .ch-walk-frame { position: relative; order: initial; top: 0; height: 100%; margin: 0; padding: 32px 0 0; display: flex; flex-direction: row; justify-content: center; align-items: flex-start; opacity: 1; transform: none; transition: none; background: var(--blue-1); mask-image: linear-gradient(to bottom,#000 0%,#000 calc(100% - 28px),transparent 100%); }
  .ch-walk.cj-split .ch-walk-frame::after { display: none; }
  .ch-walk.cj-split .cj-scene { width: min(320px,calc(100% - 48px)); height: calc(100% + 76px); min-height: 0; }
  .ch-walk.cj-split .cj-chat-head { display: none; }
  .ch-walk.cj-split .cj-stack { top: 20px; } /* Hunter, 2026-09-11: retain comfortable padding inside the header-free screen. */
  .ch-walk.cj-split .ch-walk-side { position: relative; order: initial; display: block; height: 100%; overflow: hidden; mask-image: linear-gradient(to bottom,transparent 0,#000 28px,#000 calc(100% - 24px),transparent 100%); }
  .ch-walk.cj-split .ch-walk-steps { display: block; will-change: transform; }
  .ch-walk.cj-split .ch-walk-steps li { height: var(--cj-copy-h); min-height: 0; padding: 28px 7% 32px; display: flex; justify-content: center; opacity: 1; cursor: default; }
  .ch-walk.cj-split .cj-step-copy { position: static; visibility: visible; }
  .ch-walk.cj-split .cj-transcript-track { gap: 0; }
  .ch-walk.cj-split .cj-follow .cj-detail { gap: 0; overflow: hidden; }
  .ch-walk.cj-split .cj-follow .cj-label { flex: none; margin-bottom: 12px; }
}
/* Hunter, 2026-09-15: reference-based V13 phone furniture. All message
   edges share the composer's 16px inset. Product UI uses the 14px role;
   marketing beside the phone retains the page's 17px body role. */
.cj-scene { width: var(--cj-phone-w, 340px); height: auto; min-height: 0; aspect-ratio: 390 / 844; flex: none; border-radius: var(--cui-radius); background: var(--gray-1); overflow: hidden; } /* Denny via Hunter, 2026-09-20: one phone proportion, never independently stretched in width/height. */
.cj-status { position: absolute; top: 14px; left: 30px; right: 26px; height: 24px; display: flex; justify-content: space-between; align-items: center; font: 500 14px/1 var(--body-font); color: var(--blue-9); }
.cj-island { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 92px; height: 25px; border-radius: 20px; background: var(--gray-10); }
.cj-status svg { width: 67px; height: 16px; display: block; } /* Hunter, 2026-09-22: filled iOS-style signal/Wi-Fi silhouettes and a correctly proportioned battery. */
.cj-chat-head { inset: 48px 16px auto; height: 40px; justify-content: space-between; gap: 12px; font: 500 14px/1.2 var(--body-font); }
.cj-nav-icon { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: var(--gray-15); }
.cj-nav-icon svg { width: 18px; height: 18px; }
.cj-stack { inset: 104px var(--cui-inset) calc(var(--cui-compose-height) + 24px + var(--cj-crop, 0px)); clip-path: inset(0); mask-image: linear-gradient(to bottom, transparent, #000 var(--cj-history-edge, 0px)); } /* Hunter, 2026-09-22: soften the top edge only while a history row leaves. */
.cj-lead { display: none !important; }
.cj-composer { --compose-bg: var(--gray-15); inset: auto 12px calc(16px + var(--cj-crop, 0px)); height: 108px; padding: 6px 14px 18px; display: grid; grid-template-columns: minmax(0,1fr); grid-template-rows: 36px 44px; justify-content: stretch; gap: 4px; border-radius: 32px; background: var(--compose-bg); font: 400 14px/1.3 var(--body-font); } /* Hunter, 2026-09-22: round with the phone, retain inset space, remove the home indicator. */
.cj-add-banner { display: flex; align-items: center; gap: 8px; width: 100%; font-size: 12.5px; }
.cj-banner-avatars { display: flex; padding-right: 3px; }
.cj-banner-avatars img { width: 24px; height: 24px; object-fit: cover; border: 2px solid var(--compose-bg); border-radius: 50%; margin-right: -5px; } /* Hunter, 2026-09-22: circular portraits share the compose panel's background colour at every overlap. */
.cj-add-banner small { margin-left: auto; font-size: 12.5px; color: var(--gray-65); }
.cj-composer-field { display: flex; align-items: center; gap: 10px; width: 100%; height: 44px; padding: 0 5px 0 14px; border: 1px solid var(--gray-2); border-radius: 24px; background: var(--gray-0); }
.cj-composer-label { flex: 1; color: var(--gray-65); }
.cj-attachment { width: 18px; height: 18px; color: var(--gray-65); }
.cj-composer-send { width: 32px; height: 32px; border-radius: 50%; }
.cj-scene[data-at="2"] .cj-add-banner, .cj-scene[data-at="3"] .cj-add-banner { visibility: hidden; }
.cj-ask, .cj-follow { background: transparent; }
.cj-ask .cj-detail, .cj-follow .cj-detail,
.cj-ask.is-tight .cj-detail, .cj-follow.is-tight .cj-detail { padding: 0; }
html[data-counsel-type="v13"] .cj-detail .cj-question { font-size: 14px; line-height: 1.45; padding: 12px 14px; max-width: 100%; }
.cj-answer-copy { width: 100%; max-width: 100%; }
.cj-answer-copy .cj-ui-copy { background: none; border-radius: 0; padding: 0; color: var(--gray-8); }
html[data-counsel-type="v13"] .cj-detail .cj-ui-copy,
html[data-counsel-type="v13"] .cj-detail .cj-ui-title { font: 400 14px/1.45 var(--body-font); letter-spacing: 0; }
html[data-counsel-type="v13"] .cj-doctor .cj-ui-title { font: 500 17px/1.25 var(--body-font); }
.cj-sources { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
html[data-counsel-type="v13"] .cj-source { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--gray-3); border-radius: 20px; padding: 4px 8px; margin: 0; font: 400 12.5px/1.2 var(--body-font); color: var(--gray-7); }
.cj-source svg { width: 14px; height: 14px; }
.cj-doctor { background: var(--blue-1); }
.cj-doctor .cj-detail, .cj-doctor.is-tight .cj-detail { padding: 18px; gap: 12px; height: auto; text-align: center; }
.cj-doctor.is-tight .cj-detail { padding: 14px; gap: 10px; }
.cj-doctor-fan { display: flex; align-items: flex-start; justify-content: center; gap: 0; padding: 6px 0 0; height: 126px; flex: none; }
.cj-doctor-fan figure { margin: 0; width: 88px; flex: 1 1 0; min-width: 0; max-width: 88px; padding: 4px; border-radius: 4px; background: var(--gray-0); box-shadow: 0 1px 3px #13204518; transform: translateX(calc((1 - var(--cj-fan, 1)) * 62%)) rotate(calc(-5deg * var(--cj-fan, 1))) translateY(calc(4px * var(--cj-fan, 1))); transform-origin: 50% 90%; }
.cj-doctor-fan figure:nth-child(2) { transform: none; z-index: 1; }
.cj-doctor-fan figure:nth-child(3) { transform: translateX(calc((var(--cj-fan, 1) - 1) * 62%)) rotate(calc(5deg * var(--cj-fan, 1))) translateY(calc(4px * var(--cj-fan, 1))); } /* Hunter, 2026-09-22: portraits spread gently from a stack as the doctor step enters. */
.cj-doctor-fan img { display: block; width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; border-radius: 2px; }
.cj-doctor-fan figcaption { padding-top: 4px; font: 400 12px/1.15 var(--body-font); color: var(--gray-8); }
.cj-doctor.is-tight .cj-doctor-fan { height: 112px; }
.cj-doctor .cj-add-doctor { height: 36px; min-height: 36px; border-radius: 10px; font-size: 14px; padding: 0 16px; }
.cj-doctor .cj-compact { background: var(--blue-2); }
.cj-follow .cj-detail { overflow: hidden; }
.cj-follow-copy { padding: 0; background: none; display: grid; grid-template-columns: 28px minmax(0,1fr); gap: 8px; align-items: end; }
.cj-follow-avatar { width: 28px; height: 28px; object-fit: cover; border-radius: 50%; }
.cj-follow-copy .cj-ui-copy { padding: 12px; border-radius: 12px 12px 12px 3px; background: var(--blue-2); }
.cj-follow.is-tight .cj-follow-copy { padding: 0; gap: 8px; }
/* Denny via Hunter, 2026-09-20: a right-aligned typing bubble replaces the written cue. */
.cj-nora-typing { display: flex; justify-content: flex-end; }
.cj-typing-dots { display: flex; gap: 4px; padding: 12px 14px; background: var(--blue-9); border-radius: 12px 12px 3px 12px; }
.cj-typing-dots i { width: 4px; height: 4px; border-radius: 50%; background: var(--gray-1); animation: cj-typing 1200ms ease-in-out infinite; animation-play-state: paused; }
.cj-typing-dots i:nth-child(2) { animation-delay: 140ms; }
.cj-typing-dots i:nth-child(3) { animation-delay: 280ms; }
.cj-stitch-active .is-current .cj-typing-dots i { animation-play-state: running; }
/* Sam at Counsel, Oct 13: the doctor's condensed row is their message, with a round photo
   like every doctor message; the follow-up ends on the doctor typing (no blur). */
.cj-compact .cj-compact-avatar { border-radius: 50%; }
.cj-doctor .cj-compact span { line-height: 1.25; }
.cj-doctor-typing { display: flex; align-items: flex-end; gap: 8px; }
.cj-doctor-typing .cj-typing-dots { background: var(--blue-2); border-radius: 12px 12px 12px 3px; }
.cj-doctor-typing .cj-typing-dots i { background: var(--blue-9); }
@keyframes cj-typing { 0%, 60%, 100% { opacity: .4; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }
.cj-stream-word { opacity: var(--word-reveal, 0); }
@media (max-width: 900px) {
  /* Denny via Hunter, 2026-09-20: show a crop of the tall device, not a squashed phone. */
  .ch-walk.cj-split .cj-scene { --cui-radius: 36px; width: var(--cj-phone-w); height: auto; aspect-ratio: 390 / 844; border-radius: var(--cui-radius); }
  .ch-walk.cj-split .cj-chat-head { display: flex; }
  .ch-walk.cj-split .ch-walk-steps li .cj-step-copy { visibility: visible; } /* Hunter, 2026-09-15: incoming text stays visible while each native scroll pixel moves it. */
  .ch-walk.cj-split .cj-stack { inset: 98px var(--cui-inset) calc(var(--cui-compose-height) + 24px + var(--cj-crop, 0px)); }
  .cj-status { left: 24px; right: 22px; font-size: 12.5px; }
  .cj-island { width: 78px; height: 23px; }
  .cj-doctor .cj-detail, .cj-doctor.is-tight .cj-detail { padding: 12px; gap: 8px; }
  .cj-doctor-fan, .cj-doctor.is-tight .cj-doctor-fan { height: 128px; padding: 4px 4px 12px; } /* Denny via Hunter, 2026-09-20: reserve the rotated portraits and names, so they never overlap the card title. */
  .cj-doctor-fan figure { width: 70px; flex: 0 1 70px; padding: 3px; }
  .cj-doctor-fan img { width: 100%; height: auto; aspect-ratio: 1; }
  .cj-doctor-fan figcaption { font-size: 10px; }
  .ch-walk.cj-flow .cj-ask .cj-detail, .ch-walk.cj-flow .cj-follow .cj-detail { padding: 0; }
  .ch-walk.cj-flow .cj-follow .cj-detail { overflow: visible; }
  .ch-walk.cj-flow .cj-doctor-fan { height: 126px; }
  .ch-walk.cj-flow .cj-doctor-fan figure { width: 88px; padding: 4px; }
  .ch-walk.cj-flow .cj-doctor-fan img { width: 80px; height: 80px; }
  .ch-walk.cj-flow .cj-doctor-fan figcaption { font-size: 12px; }
  /* Hunter, 2026-09-15: a 320px phone must not inherit the fan's desktop minimum width. */
  .ch-walk.cj-flow .ch-walk-steps li, .ch-walk.cj-flow .cj-step-copy { min-width: 0; }
  .ch-walk.cj-flow .cj-doctor-fan { height: auto; min-height: 126px; padding-bottom: 12px; }
  .ch-walk.cj-flow .cj-doctor-fan figure { flex: 1 1 0; min-width: 0; max-width: 88px; }
  .ch-walk.cj-flow .cj-doctor-fan img { width: 100%; height: auto; aspect-ratio: 1; }
}
`;
  document.head.appendChild(style);
  const colors = [C.green3, C.green8, C.blue3, C.blue8, C.gray6, C.yellow, C.pink];
  const thinking = Array.from({length: 9}, (_, i) => `<i style="--c:${colors[i % colors.length]};--delay:${-2000 + (Math.floor(i / 3) + i % 3) / 4 * 1700}ms"></i>`).join('');
  // Hunter, 2026-09-11: preserve the stitch's exact nine-square colour layout.
  const stitch = [C.blue9,C.blue9,C.green3,C.green3,C.pink,C.blue9,C.yellow,C.blue9,C.pink].map((color,i)=>
    `<rect x="${i%3*7}" y="${Math.floor(i/3)*7}" width="4" height="4" fill="${color}" style="--stitch-delay:${-2800+(Math.floor(i/3)+i%3)*180}ms"/>`).join('');
  // Hunter, 2026-09-10: illustrative patient-side chat. Nora sends the navy
  // messages; Counsel AI and the physician reply on the canvas. Sales copy lives beside it.
  frame.setAttribute('aria-label', 'Nora’s conversation with Counsel');
  frame.innerHTML = `<div class="cj-scene cui-device" data-counsel-theme="light" data-at="0">
    ${phoneUI.status()}${phoneUI.nav()}
    <div class="cj-stack">
      <article class="cj-card cj-ask is-current" aria-label="Ask Counsel AI">
        <div class="cj-transcript"><div class="cj-transcript-track">
          <!-- Sam at Counsel, Oct 13 (Notion): Nora's story is fatigue, then labs, then low vitamin D. -->
          <div class="cj-event cj-outgoing" data-show="0"><div class="cj-question">I’ve been feeling really tired lately</div></div>
          <div class="cj-event cj-thought" data-show=".08" data-until=".3"><span class="counsel-thinking" aria-hidden="true">${thinking}</span><span>Thinking…</span></div>
          <!-- Denny via Hunter, 2026-09-20: stream words and use the requested source-token label. Actual AI copy and citations remain illustrative, pending Counsel approval. -->
          <div class="cj-event cj-answer-copy" data-show=".3" data-stream><p class="cj-ui-copy">Let me get a better picture of what you’re experiencing. I’ll ask about the fatigue itself, sleep and daily habits, and a few health checks that can commonly affect energy.<br><br>If it makes sense, you can add a doctor to this chat, and they will have the full context of our conversation.<br><br>To start, can you describe what “really tired” feels like for you, and when it started?</p><div class="cj-sources"><span class="cj-source"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 6v4m3-7v10m3-8v6m3-9v12m3-8v4"/></svg>1 conversation</span><span class="cj-source"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="6"/><ellipse cx="8" cy="8" rx="2.5" ry="6"/><path d="M2 8h12"/></svg>3 trusted sources</span><span class="cj-source" aria-label="Copy"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M10 3H3v7"/></svg></span></div></div>
        </div></div>
      </article>
      <article class="cj-card cj-doctor" aria-label="Add a real doctor" aria-hidden="true" inert>
        <div class="cj-doctor-fan">${doctorPortraits.map((src,i)=>`<figure><img src="${src}" alt="Counsel physician"><figcaption>${['Dr. Catherine<br>Brennan','Dr. Nick<br>Raman','Dr. Laura<br>Whitfield'][i]}</figcaption></figure>`).join('')}</div>
        <p class="cj-ui-title">Get treatment in 2 minutes</p>
        <p class="cj-ui-copy">A board-certified doctor will join this chat to start your treatment.</p>
        <button class="ch-btn cj-add-doctor" type="button">Get started</button>
      </article>
      <article class="cj-card cj-pharmacy" data-counsel-theme="green" aria-label="Lab ordered at the nearest Quest" aria-hidden="true" inert>
        <div class="cj-label"><span>Lab order</span><span>Nora</span></div>
        <svg class="cj-map" viewBox="0 0 320 165" aria-hidden="true"><path d="M0 30H320M0 100H320M65 0V165M240 0V165" fill="none" stroke="#fff" stroke-width="22"/><path class="cj-route" pathLength="1" d="M25 100H65V30H240V102" fill="none" stroke="var(--green-7)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="25" cy="100" r="7" fill="var(--green-7)"/><g class="cj-map-pin"><path d="M240 123s-25-26-25-43a25 25 0 0 1 50 0c0 17-25 43-25 43Z" fill="var(--green-7)"/><circle cx="240" cy="80" r="9" fill="var(--green-1)"/></g></svg>
        <div class="cj-delivery"><div><p class="cj-ui-title">Lab ordered</p><span class="cj-meta">Quest Diagnostics · 0.6 mi</span></div><span class="cj-check" aria-hidden="true">✓</span></div>
      </article>
      <article class="cj-card cj-follow" aria-label="A seven-day visit with follow-up" aria-hidden="true" inert>
        <!-- Denny via Hunter, 2026-09-20: start directly with the doctor’s message. -->
        <div class="cj-event cj-follow-copy" data-show="0"><img class="cj-follow-avatar" src="${doctorPortrait}" alt="Your doctor"><p class="cj-ui-copy">Hi Nora, your lab results are back, and your vitamin D levels were about 50% lower than the “normal” range. This could explain what you’re feeling, and you could start with some supplements right away.</p></div>
        <div class="cj-event cj-thought cj-nora-typing" data-show=".16" data-until=".38" aria-label="Nora is typing"><span class="cj-typing-dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
        <div class="cj-event cj-outgoing" data-show=".38"><div class="cj-question">Oh wow. I’m going to pick some up right away, do you have any recommendations?</div></div>
        <!-- Sam asked for the chat to blur out below to show it carries on. Hunter's rule is no fades or blurs, so the doctor is typing instead: the conversation continues, without its content. -->
        <div class="cj-event cj-thought cj-doctor-typing" data-show=".6" aria-label="Your doctor is typing"><img class="cj-follow-avatar" src="${doctorPortrait}" alt=""><span class="cj-typing-dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
      </article>
    </div>
    ${platformComposer.markup(platformComposer.forStep(0))}
  </div>`;
  const scene = frame.querySelector('.cj-scene');
  const composer = scene.querySelector('.cp-composer');
  // Pause the decorative loop outside the page's own scrolling viewport.
  new IntersectionObserver(([entry])=>scene.classList.toggle('cj-stitch-active',entry.isIntersecting),{root:scroller}).observe(scene);
  const cards = [...frame.querySelectorAll('.cj-card')];
  // Denny via Hunter, 2026-09-20: keep the authored paragraphs, reveal each
  // word in order and leave one complete response for assistive technology.
  cards[0].querySelectorAll('[data-stream] .cj-ui-copy').forEach(copy => {
    [...copy.childNodes].forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).filter(Boolean).forEach(text => {
        if (/^\s+$/.test(text)) fragment.append(document.createTextNode(text));
        else { const word=document.createElement('span'); word.className='cj-stream-word'; word.textContent=text; fragment.append(word); }
      });
      node.replaceWith(fragment);
    });
  });
  // Hunter, 2026-09-11: a separate slot grows around the unchanged bubble,
  // so padding, avatars and type never squash as the next message arrives.
  cards.forEach(card => card.querySelectorAll('.cj-event').forEach(event => {
    const slot=document.createElement('div');slot.className='cj-event-slot';
    event.before(slot);slot.append(event);
  }));
  const stack = frame.querySelector('.cj-stack');
  const summaries = [
    '', // Hunter, 2026-09-11: conversation bubbles scroll away, never become summary rows.
    // Sam at Counsel, Oct 13: no "Your doctor joined $29" row. The doctor card
    // condenses into the doctor's own message, with their photo.
    `<img class="cj-compact-avatar" src="${doctorPortrait}" alt=""><span>I’m ordering some labs to help figure out what’s going on.</span>`,
    '<i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></i><span>Lab ordered at Quest</span>',
    ''
  ];
  // Hunter, 2026-09-11: the doctor's incoming line matches its Blue 2 card.
  const threadColors = [C.green3,C.blue2,C.green3,C.yellow];
  const messages = cards.map((card,i) => {
    const detail = document.createElement('div'); detail.className = 'cj-detail';
    detail.append(...card.childNodes); card.append(detail);
    const compact = document.createElement('div'); compact.className = 'cj-compact';
    compact.innerHTML = summaries[i]; compact.setAttribute('aria-hidden','true'); card.append(compact);
    const message = document.createElement('div'); message.className = 'cj-message';
    message.style.setProperty('--cj-color',threadColors[i]);
    const lead = document.createElement('div'); lead.className = 'cj-lead'; lead.setAttribute('aria-hidden','true');
    card.before(message); message.append(lead,card);
    return {message,card,detail,compact,lead};
  });
  steps.forEach(step => {
    const copy = document.createElement('div'); copy.className = 'cj-step-copy';
    copy.append(...step.childNodes); step.append(copy);
  });
  // The short-screen/reduced-motion flow uses the same field, not another drawing.
  steps.forEach((step,i)=>{
    const wrap=document.createElement('div');wrap.className='cp-flow-composer';
    wrap.innerHTML=platformComposer.markup(platformComposer.forStep(i));step.append(wrap);
  });
  function setStep(index) {
    scene.dataset.at=String(index);
    platformComposer.sync(composer,platformComposer.forStep(index));
  }
  // This prototype button opens the existing local handoff. It does not
  // book, charge for a visit, or send the illustrative patient's question.
  const doctorButton = frame.querySelector('.cj-add-doctor');
  doctorButton.addEventListener('click', () => window.openApp?.());
  Promise.all([import('/shared/buttons/thread-sweep.js'),import('../ui-src/counsel-button-motion.js')]).then(([{attachThreadSweep},{counselButtonSweep}]) => {
    attachThreadSweep(doctorButton, counselButtonSweep());
  }).catch(() => {});
  // Hunter, 2026-09-10: first 28% arrives, 28-68% holds the big story,
  // final 32% condenses into the chat. No timer or opacity tween owns a card.
  const ease = u => { u=Math.max(0,Math.min(1,u)); return u*u*(3-2*u); };
  let flowing = false;
  let split = false;
  function phoneGeometry(viewportHeight,frameWidth,pageWidth,narrow,split) {
    const width=Math.max(180,narrow?Math.min(320,pageWidth-48):Math.min(390,frameWidth-24,viewportHeight*.84*390/844));
    const height=width*844/390;
    return {width,height,crop:split?Math.max(0,height-(Math.round(viewportHeight*.60)-32)):0};
  }
  // Hunter, 2026-09-11: retain readable stacked cards on short screens and
  // for reduced motion. V11 itself remains unchanged for comparison.
  function configureLayout() {
    const narrow=matchMedia('(max-width: 900px)').matches;
    const height=scroller.clientHeight;
    split=narrow&&height>=800&&!reduced.matches; // Hunter, 2026-09-15: short screens use the complete, non-sticky reading flow.
    root.classList.toggle('cj-split',split);
    root.style.setProperty('--cj-viewport-h',height+'px');
    root.style.setProperty('--cj-split-top',Math.round(height*.60)+'px'); // Hunter, 2026-09-15: room for the reference status, nav and compose bars.
    root.style.setProperty('--cj-copy-h',(height-Math.round(height*.60))+'px');
    // Denny via Hunter, 2026-09-20: preserve the 390:844 screen ratio.
    // Mobile's upper window crops the same tall phone rather than compressing it.
    const phone=phoneGeometry(height,frame.clientWidth,root.clientWidth,narrow,split);
    scene.style.setProperty('--cj-phone-w',phone.width+'px');
    scene.style.setProperty('--cj-crop',phone.crop+'px');
    root.querySelector('.ch-walk-steps').style.transform='';
    if(!split)cards[3].querySelector('.cj-detail').scrollTop=0;
    const next=narrow&&!split;
    if (flowing!==next) {
      flowing=next;
      root.classList.toggle('cj-flow',flowing);
      messages.forEach(({message},k)=>{
        if(flowing)steps[k].insertBefore(message,steps[k].querySelector('.cp-flow-composer'));
        else stack.append(message);
      });
      steps.forEach(step=>{
        if(flowing){step.removeAttribute('role');step.removeAttribute('tabindex');step.removeAttribute('aria-label');}
        else {step.tabIndex=0;step.setAttribute('role','button');step.setAttribute('aria-label','Show '+step.querySelector('h3').textContent);}
      });
    }
    steps.forEach(step=>{
      if(narrow){step.removeAttribute('role');step.removeAttribute('tabindex');step.removeAttribute('aria-label');}
      else {step.tabIndex=0;step.setAttribute('role','button');step.setAttribute('aria-label','Show '+step.querySelector('h3').textContent);}
    });
    read();
  }
  function journeyPose(u, big, small, reduce) {
    const enter = reduce ? (u >= 0 ? 1 : 0) : ease(u/.28);
    const merge = reduce ? (u >= 1 ? 1 : 0) : ease((u-.68)/.32);
    return {enter,merge,height:big+(small-big)*merge};
  }
  // Hunter, 2026-09-22: the old doctor row scrolls up and softens before
  // follow-up begins. The prescription lands at the same y on both sides
  // of the step boundary. No scroll interception or timed hold.
  function historyPose(index,u,row,pitch=56) {
    const exit=index>2?1:index===2?ease((u-.68)/.32):0;
    return {y:(row-1)*pitch-exit*pitch,opacity:row===1?1-exit:1,edge:48*exit*(1-exit)};
  }
  function doctorFan(u,settle=false) {
    cards[1].style.setProperty('--cj-fan',String(settle?1:ease((u-.06)/.36)));
  }
  // Hunter, 2026-09-11, loi8fn7f: measure the full-width doctor content
  // before animating its shell, preserving its portrait and readable type.
  function storyHeight(index, available) {
    if(index!==1)return available;
    const {message,card,detail}=messages[1];
    card.classList.toggle('is-tight',available<380);
    message.style.width='100%';
    return Math.min(available,detail.offsetHeight||available);
  }
  // Denny via Hunter, 2026-09-20: short proportional screens pan the full
  // doctor card before it condenses, so its button is never clipped away.
  function storyPan(index,u,big,merge) {
    if(index!==1||reduced.matches)return 0;
    return Math.max(0,messages[1].detail.offsetHeight-big)*ease((u-.24)/.36)*(1-merge);
  }
  // Hunter, 2026-09-10: one text state at a time. The full story clears
  // before the fixed-height summary enters, entirely inside the shrinking card.
  function collapseContent(merge, big, small, height) {
    const compact = merge >= .5;
    const room = Math.max(0, height-small);
    return {
      compact,
      detailY: -big*ease(merge/.5),
      compactY: room/2 + Math.min(small,room/2)*(1-ease((merge-.5)/.5))
    };
  }
  // Hunter, 2026-09-11, b46fnk01/qia2ughw/eutewk9r/ltyk7qgc:
  // scroll reveals messages in place. A loader is exclusive to its reply.
  function eventPose(u, start, until, settle) {
    const shown=settle ? !Number.isFinite(until) : u>=start&&u<until;
    // Hunter, 2026-09-11: replies ease over 12% of their step; brief thinking
    // cues use 4% and clear their space before the corresponding reply.
    const transient=Number.isFinite(until);
    const arrival=settle?1:ease((u-start)/(transient?.04:.12));
    const departure=settle||!transient?1:1-ease((u-(until-.04))/.04);
    const progress=shown?arrival*departure:0;
    return {shown, progress, opacity:progress, pop:shown&&!settle?12*(1-arrival):0};
  }
  // Denny via Hunter, 2026-09-20: a reversible, scroll-linked stream with
  // overlapping word fades. No typing wait or scroll hold is introduced.
  function streamWordPose(u,index,count,settle) {
    return settle?1:ease(((u-.3)/.34*(count+3)-index)/3);
  }
  function streamResponse(event,u,settle) {
    const words=[...event.querySelectorAll('.cj-stream-word')];
    const bounds=event.getBoundingClientRect();
    let height=0;
    words.forEach((word,index)=>{
      const reveal=streamWordPose(u,index,words.length,settle);
      word.style.setProperty('--word-reveal',String(reveal));
      if(reveal>0){
        const bottom=word.getBoundingClientRect().bottom-bounds.top+3;
        height=Math.max(height,height+(Math.max(height,bottom)-height)*reveal);
      }
    });
    const sources=event.querySelector('.cj-sources');
    const reveal=settle?1:ease((u-.64)/.04);
    sources.style.opacity=String(reveal);
    return height+(event.offsetHeight-height)*reveal;
  }
  function conversation(card,u,settle=false) {
    card.querySelectorAll('.cj-event').forEach(event=>{
      const state=eventPose(u,Number(event.dataset.show),event.dataset.until===undefined?Infinity:Number(event.dataset.until),settle);
      event.hidden=!state.shown;event.setAttribute('aria-hidden',String(!state.shown));
      const stream=event.hasAttribute('data-stream');
      event.style.setProperty('--cj-pop',(stream?0:state.pop)+'px');
      event.style.setProperty('--cj-reveal',String(stream?1:state.opacity));
      const slot=event.parentElement;
      slot.hidden=!state.shown;
      // Natural content height preserves full-size bubbles; mobile stays fully open.
      const gap=card.classList.contains('cj-follow')?12:18;
      const eventHeight=stream?streamResponse(event,u,settle):event.offsetHeight*state.progress;
      slot.style.height=flowing?'auto':(eventHeight+gap*state.progress)+'px';
    });
    const transcript=card.querySelector('.cj-transcript')||(card.classList.contains('cj-follow')?card.querySelector('.cj-detail'):null);
    if(transcript) {
      // The growing slots advance the scroll position continuously, not a whole reply at once.
      transcript.scrollTop=settle&&flowing?0:transcript.scrollHeight-transcript.clientHeight;
    }
  }
  function pharmacyProgress(u,settle=false) {
    const progress=settle?1:ease((u-.12)/.48);
    cards[2].style.setProperty('--cj-route-left',String(1-progress));
    cards[2].style.setProperty('--cj-pin-y',(-12*(1-progress))+'px');
    cards[2].style.setProperty('--cj-pin-scale',String(.8+.2*progress));
  }
  function read() {
    if (flowing) {
      root.classList.add('ch-in');
      messages.forEach(({message,card,detail,compact})=>{
        card.classList.remove('is-tight');
        message.style.removeProperty('--cj-card-height');
        message.style.visibility='visible';message.style.transform='none';message.style.opacity='1';message.style.width='100%';message.style.height='auto';
        card.classList.add('is-current');card.setAttribute('aria-hidden','false');card.inert=false;
        detail.style.transform='none';detail.style.visibility='visible';detail.setAttribute('aria-hidden','false');detail.inert=false;
        compact.style.visibility='hidden';compact.setAttribute('aria-hidden','true');
      });
      conversation(cards[0],1,true);conversation(cards[3],1,true);pharmacyProgress(1,true);
      const bounds=scroller.getBoundingClientRect();
      doctorFan((bounds.bottom-cards[1].getBoundingClientRect().top)/Math.max(1,bounds.height*.5),reduced.matches);
      steps.forEach(step=>step.classList.add('on'));
      return;
    }
    if(split){readSplit();return;}
    const b = scroller.getBoundingClientRect(), bounds = root.getBoundingClientRect();
    if (bounds.top >= b.bottom || bounds.bottom <= b.top) return;
    root.classList.add('ch-in');
    const narrow = matchMedia('(max-width: 900px)').matches;
    const mid = narrow ? Math.min(b.bottom-40,frame.getBoundingClientRect().bottom+16) : b.top+b.height*.62;
    const boxes = steps.map(step=>step.getBoundingClientRect());
    let i=0; boxes.forEach((box,k)=>{if(box.top<=mid)i=k;});
    const u=(mid-boxes[i].top)/Math.max(1,boxes[i].height);
    setStep(i);
    const box=stack.getBoundingClientRect();
    const small=48, gap=8, pitch=small+gap;
    // Hunter, 2026-09-11, 4iequ476: reserve the immediately preceding row,
    // especially Prescription, instead of pushing it above the chat window.
    const available=Math.min(narrow?320:420,box.height-(i>1?pitch:0));
    const big=storyHeight(i,available);
    const chatStep=i===0||i===3;
    const pose=chatStep?{enter:1,merge:0,height:big}:journeyPose(u,big,small,reduced.matches);
    // Whole card starts beyond the actual page viewport, not just its column.
    const offLeft=b.left-box.left-box.width-24;
    scene.style.setProperty('--cj-card-height',big+'px');
    scene.style.setProperty('--cj-lead-width',(-offLeft)+'px');
    scene.style.setProperty('--cj-history-edge',historyPose(i,u,1).edge+'px');
    messages.forEach(({message,card,detail,compact,lead},k)=>{
      message.style.removeProperty('--cj-card-height');
      const p=k<i?{enter:1,merge:1,height:small}:pose;
      const isConversation=k===0||k===3;
      // Hunter, 2026-09-11: the original chat scrolls through the top edge.
      // The final exchange stays intact as the whole phone leaves the section.
      const chatExit=reduced.matches?(u>=1?1:0):ease((u-.68)/.32);
      const history=historyPose(i,u,k,pitch);
      const y=k===0?-(big+gap)*chatExit:history.y;
      const visible=k===0?i===0&&u>=0&&y+big>0:k<=i&&u>=0&&y+p.height>0&&y<box.height&&history.opacity>0;
      const content=isConversation?{compact:false,detailY:0,compactY:0}:collapseContent(p.merge,big,small,p.height);
      message.style.visibility=visible?'visible':'hidden';
      message.style.height=p.height+'px';
      const inPlace=true; // Hunter, 2026-09-15: every card appears inside the phone, without an incoming thread.
      message.style.transform=`translate3d(0,${y+10*(1-p.enter)}px,0)`;
      message.style.opacity=String(p.enter*(k===0?1:history.opacity));
      message.style.width='100%';
      detail.style.transform=`translateY(${content.detailY-(k===i?storyPan(k,u,big,p.merge):0)}px)`;
      compact.style.transform=`translateY(${content.compactY}px)`;
      detail.style.visibility=visible&&!content.compact?'visible':'hidden';
      compact.style.visibility=visible&&content.compact?'visible':'hidden';
      lead.style.transform=`scaleX(${1-p.merge})`;
      lead.style.display=inPlace?'none':'';
      const condensed=content.compact;
      card.classList.toggle('is-current',k===i&&!condensed);
      card.classList.toggle('is-tight',available<380);
      card.setAttribute('aria-hidden',String(!visible)); card.inert=!visible;
      detail.inert=!visible||p.merge>0||(!inPlace&&p.enter<1);
      detail.setAttribute('aria-hidden',String(!visible||condensed));
      compact.setAttribute('aria-hidden',String(!visible||!condensed));
    });
    conversation(cards[0],i===0?u:1,reduced.matches);
    conversation(cards[3],i===3?u:-1,reduced.matches);
    pharmacyProgress(i===2?u:i>2?1:0,reduced.matches);
    doctorFan(i===1?u:i>1?1:0,reduced.matches);
    steps.forEach((step,k)=>step.classList.toggle('on',k===i));
  }
  function readSplit() {
    const b=scroller.getBoundingClientRect(),bounds=root.getBoundingClientRect();
    if(bounds.top>=b.bottom||bounds.bottom<=b.top)return;
    root.classList.add('ch-in');
    const copyHeight=b.height-Math.round(b.height*.60);
    // Hunter, 2026-09-11: text follows native page distance directly, with
    // no hold, easing, snapping or final-caption freeze. Animation follows it.
    const distance=Math.max(0,Math.min(copyHeight*4,b.top-bounds.top));
    const progress=distance/Math.max(1,copyHeight);
    const i=Math.min(3,Math.floor(progress)),u=progress-i;
    root.querySelector('.ch-walk-steps').style.transform=`translateY(${-distance}px)`;
    setStep(i);
    const box=stack.getBoundingClientRect();
    // Hunter, 2026-09-11: removing the header gains 36px; extra top padding
    // uses 16px, leaving 20px more room for messages above the same fade edge.
    const history=i>1?56:0,available=Math.max(80,Math.min(320,box.height-history)); // Hunter, 2026-09-15: measure the real space between nav and composer.
    const big=storyHeight(i,available);
    const chat=i===0||i===3;
    const pose=chat?{enter:1,merge:0,height:big}:journeyPose(u,big,48,false);
    const offLeft=b.left-box.left-box.width-24;
    scene.style.setProperty('--cj-card-height',big+'px');
    scene.style.setProperty('--cj-lead-width',(-offLeft)+'px');
    scene.style.setProperty('--cj-history-edge',historyPose(i,u,1).edge+'px');
    messages.forEach(({message,card,detail,compact,lead},k)=>{
      const previous=i>1&&k===i-1,active=k===i;
      const row=historyPose(i,u,k);
      const visible=(previous||active)&&(k===0||row.opacity>0);
      const p=previous?{enter:1,merge:1,height:48}:pose;
      const content=active&&chat?{compact:false,detailY:0,compactY:0}:collapseContent(p.merge,big,48,p.height);
      message.style.removeProperty('--cj-card-height');
      message.style.visibility=visible?'visible':'hidden';message.style.height=p.height+'px';message.style.width='100%';
      const y=active&&i===0?-(big+8)*ease((u-.72)/.28):row.y;
      message.style.transform=`translate3d(0,${y+10*(1-p.enter)}px,0)`;
      message.style.opacity=String(p.enter*(k===0?1:row.opacity)); // Hunter, 2026-09-22: the old row clears before the next step, without a visibility jump.
      detail.style.transform=`translateY(${content.detailY-(active?storyPan(k,u,big,p.merge):0)}px)`;compact.style.transform=`translateY(${content.compactY}px)`;
      detail.style.visibility=visible&&!content.compact?'visible':'hidden';compact.style.visibility=visible&&content.compact?'visible':'hidden';
      detail.setAttribute('aria-hidden',String(!visible||content.compact));detail.inert=!visible||content.compact||(!chat&&p.enter<1)||p.merge>0;
      compact.setAttribute('aria-hidden',String(!visible||!content.compact));
      card.setAttribute('aria-hidden',String(!visible));card.inert=!visible;card.classList.toggle('is-current',active&&!content.compact);card.classList.add('is-tight');
      lead.style.display=chat||previous?'none':'';lead.style.transform=`scaleX(${1-p.merge})`;
    });
    conversation(cards[0],i===0?u:1);conversation(cards[3],i===3?u:-1);
    pharmacyProgress(i===2?u:i>2?1:0);
    doctorFan(i===1?u:i>1?1:0);
    steps.forEach((step,k)=>step.classList.toggle('on',k===i));
  }
  scroller.addEventListener('scroll', read, {passive: true});
  window.addEventListener('resize', configureLayout);
  reduced.addEventListener('change',configureLayout);
  new ResizeObserver(read).observe(scene);
  steps.forEach((step, i) => {
    // Keep click-to-preview, including keyboard access, without adding UI chrome.
    step.tabIndex = 0; step.setAttribute('role', 'button');
    step.setAttribute('aria-label', 'Show ' + step.querySelector('h3').textContent);
    const select = () => {
      if (flowing||split) return;
      const b = scroller.getBoundingClientRect();
      const narrow = matchMedia('(max-width: 900px)').matches;
      const mid = narrow ? Math.min(b.bottom-40,b.top+16+frame.offsetHeight+16) : b.top+b.height*.62;
      const box=step.getBoundingClientRect();
      scroller.scrollTo({top: scroller.scrollTop + box.top-mid+box.height*.48, behavior: reduced.matches ? 'instant' : 'smooth'});
      scroller.dispatchEvent(new Event('scroll'));
    };
    step.addEventListener('click', select);
    step.addEventListener('keydown', e => { if (!flowing && !split && e.target===step && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(); } });
  });
  configureLayout();
  document.fonts?.ready.then(configureLayout);
  const copyResize=new ResizeObserver(configureLayout);
  steps.forEach(step=>copyResize.observe(step.querySelector('.cj-step-copy')));
})();
