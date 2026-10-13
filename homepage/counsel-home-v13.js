/* Counsel homepage, V13: the sections after the breath. Forked from V10
   by Hunter's request, 2026-09-10, for the supplied client feedback.
   V10 remains on counsel-home-v10.js. Originally forked from the
   shared sections module on 2026-09-08 for the Sept 8 review's decisions
   (Notion: Sept 8, Homepage Design Review); V8 and V9 keep the old module.

   <script src="/designs/counsel/home-src/counsel-home-v13.js"></script>

   It finds the page's breath section (#how) and appends, in order: How it
   works (one section now, four steps, one care journey, advancing on
   scroll), pricing, why members stay, hear from our members, the
   questions, the footer.

   From the review: the two how-it-works sections merged into one with no
   more than four steps and a singular use case (Nora's sore throat), told
   at the highest level (I chat, a doctor joins, I get a prescription), and
   advancing on scroll depth; the phone is the transparent frame Denny sent,
   with elements that can extend out past it; pricing sits on the app's
   off-white with the weave divider gone; the testimonials sit on off-white
   too, with the brand book's open weave (the small squares, unused until
   now) and a verified badge, and no thread behind them; the weave stays
   sparing everywhere else. */
(function () {
  if (window.CounselHome) return;   // one build per page
  const host = document.getElementById('how');
  if (!host) return;

  // Hunter, 2026-09-22: CSS, SVG and animation share the current token table.
  const C = window.CounselColors;
  const THREAD = [C.blue2, C.pink, C.yellow, C.green3, C.brightBlue];
  // Hunter, 2026-09-10: broaden only the FAQ thread, keeping accents sparing.

  const css = `
.ch { position: relative; z-index: 3; font-family: var(--body-font, "GT America", sans-serif); color: ${C.blue9}; -webkit-font-smoothing: antialiased; }
/* every band is a sheet laid over the one before, top corners rounded like
   the hero's and How it works' (Hunter, 2026-09-08): it pulls up over the
   previous band by the radius and carries that much more room at the top */
.ch { --r: var(--hero-radius, 48px); border-radius: var(--r) var(--r) 0 0; margin-top: calc(-1 * var(--r)); overflow: clip; }   /* clip, not hidden: hidden makes a scroll box and kills the sticky headline in the questions (Hunter, 2026-09-08) */
.ch * { box-sizing: border-box; }
.ch-wrap { width: min(var(--content-max, 1280px), var(--content-width, 90%)); margin: 0 auto; } /* Hunter, 2026-09-10, uzsdeufp: a little more horizontal room. */
.ch h2 { margin: 0; font-family: var(--display-font, "Cooper Light", serif); font-weight: 300; font-size: clamp(36px, 4.6vw, 60px); line-height: 1.04; letter-spacing: -0.02em; }
.ch h3 { margin: 0; font-family: var(--display-font, "Cooper Light", serif); font-weight: 300; letter-spacing: -0.015em; }
.ch p { margin: 0; }
.ch .ch-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; letter-spacing: 0; opacity: 0.7; }   /* sentence case: no caps anywhere (Hunter, 2026-09-08) */
.ch .ch-eyebrow i { display: inline-block; width: 22px; height: 4px; border-radius: 2px; background: currentColor; opacity: 0.5; }
.ch .ch-lede { font-size: clamp(17px, 1.5vw, 21px); line-height: 1.45; opacity: 0.78; max-width: 560px; }
.ch-head { display: grid; gap: 16px; justify-items: center; text-align: center; margin-bottom: clamp(36px, 5vw, 64px); }
.ch-head.left { justify-items: start; text-align: left; }

/* the weave: caps from the thread, as a small cluster beside a headline
   or standing in for an icon */
.ch-weave { display: grid; grid-template-columns: repeat(3, 10px); gap: 4px; }
.ch-weave i { width: 10px; height: 10px; border-radius: 3px; background: var(--w, ${C.blue2}); transform: scale(0); transition: transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--d, 0) * 45ms); }
.ch-in .ch-weave i, .ch-card.ch-in .ch-weave i { transform: scale(1); }

/* buttons: the design system's, to the number (theme.button in tree.json:
   40px tall, 16px sides, radius 10, 16/400 set tight), navy on light,
   off-white with navy on dark, the secondary a ghost in the ink of its
   ground. Hover is the shared one-swipe sweep, attached below; the press is
   the system's small squeeze (Hunter, 2026-09-08: the correct buttons) */
.ch-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 40px; padding: 0 16px; border-radius: 10px; border: 0; font: inherit; font-size: 16px; font-weight: 400; letter-spacing: -0.03em; line-height: 1; text-decoration: none; cursor: pointer; background: ${C.blue9}; color: #fff; transition: transform 150ms ease; }
.ch-btn:active { transform: scale(0.985); }
.ch-btn--light { background: ${C.gray1}; color: ${C.blue9}; }
.ch-btn--ghost { background: transparent; color: currentColor; box-shadow: inset 0 0 0 1.5px currentColor; transition: transform 150ms ease, box-shadow 200ms ease; }
.ch-btn--ghost:hover { box-shadow: inset 0 0 0 1.5px currentColor, inset 0 0 0 999px color-mix(in srgb, currentColor 8%, transparent); }

/* reveal on arrival: the deck's Expand, content growing from what is
   already there rather than appearing from nothing */
.ch-rise { opacity: 0; transform: translateY(18px); transition: opacity 700ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--d, 0) * 90ms); }
.ch-in .ch-rise { opacity: 1; transform: none; }

/* ---------------- 1. how it works ---------------- */
/* one section for how it works (the review, 2026-09-08): four steps at the
   highest level, one care journey (Nora's sore throat), the steps on the
   left and the phone on the right holding its place while they pass; each
   step takes the phone forward as it reaches the middle of the screen, so
   the story pulls you through without pinning the page */
.ch-walk { background: ${C.blue1}; color: ${C.blue9}; padding: calc(clamp(64px, 8vw, 110px) + var(--r)) 0 clamp(48px, 6vw, 80px); }   /* Blue 1, the phone left, the steps right (Hunter's mock, 2026-09-09) */
.ch-walk .ch-wrap { width: min(var(--content-wide, 1380px), var(--content-width, 90%)); display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 56px; align-items: start; } /* Hunter, 2026-09-10, uzsdeufp: keep aligned with the wider breath. */
.ch-walk-side { display: grid; gap: 0; }
/* no heading of its own: the breath above carries it (Hunter, 2026-09-09) */
.ch-walk-steps { list-style: none; margin: 0; padding: 0; display: grid; }
.ch-walk-steps li { min-height: 52vh; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 12px; padding-right: 6%; opacity: 0.3; transition: opacity 420ms ease; cursor: pointer; }
/* each step wears a chip from the hero's chip system, its own colour */
.ch-walk-steps li .ch-step-chip { display: inline-flex; align-items: center; font-size: 12.5px; font-weight: 500; line-height: 1; padding: 4px 9px; border-radius: 7px; background: var(--c, ${C.green3}); color: ${C.blue9}; white-space: nowrap; margin-bottom: 2px; }
.ch-walk-steps li.on { opacity: 1; }
.ch-walk-steps li h3 { font-size: clamp(26px, 2.6vw, 36px); line-height: 1.1; }
.ch-walk-steps li p { font-size: clamp(16px, 1.25vw, 18px); line-height: 1.5; opacity: 0.8; max-width: 380px; }
/* the stage holds its place while the steps pass: the phone, its feature
   chips beside it, a soft light behind for the glass to catch */
.ch-walk-frame { position: sticky; top: 12vh; height: 76vh; display: flex; align-items: center; justify-content: flex-start; gap: 22px; }
.ch-walk-tags { display: none; }
.ch-walk-frame::before { content: ''; position: absolute; inset: -6% -10%; background: radial-gradient(50% 55% at 60% 50%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0) 70%); pointer-events: none; }
/* the feature the step shows, named beside the phone, as glass chips */
.ch-walk-tags { position: relative; z-index: 3; display: grid; gap: 8px; align-content: center; justify-items: end; flex: 0 1 190px; min-width: 0; }
.ch-tag { display: inline-flex; align-items: center; gap: 8px; padding: 8px 11px; border-radius: 10px; background: rgba(255, 255, 255, 0.62); -webkit-backdrop-filter: blur(14px) saturate(1.2); backdrop-filter: blur(14px) saturate(1.2); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75), 0 10px 26px -14px rgba(19, 32, 69, 0.45); color: ${C.blue9}; font-size: 12.5px; font-weight: 500; line-height: 1.2; letter-spacing: 0.01em; animation: chTagIn 480ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both; animation-delay: calc(var(--d, 0) * 110ms); }
.ch-tag i { flex: none; width: 8px; height: 8px; border-radius: 2px; background: var(--w, ${C.brightBlue}); }
@keyframes chTagIn { from { opacity: 0; transform: translateX(-8px) scale(0.92); } to { opacity: 1; transform: none; } }
/* the phone, after the app's own device styling (Denny's frames, Hunter,
   2026-09-09): a translucent bezel over the band, a white screen inside it
   with the iOS status line and the app's header, the app's flat kit of
   parts on it, and cards that bleed off the screen when they need to */
.ch-phone { position: relative; flex: none; width: min(370px, 60%); height: min(720px, 72vh); padding: 14px; border-radius: 52px; background: rgba(255, 255, 255, 0.55); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45); opacity: 0; transform: translateY(30px); transition: transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 120ms, opacity 900ms 120ms; }
.ch-in .ch-phone { transform: none; opacity: 1; }
.ch-screen { position: relative; height: 100%; border-radius: 40px; background: #fff; color: ${C.blue9}; }
.ch-phone-status { position: absolute; left: 0; right: 0; top: 0; display: flex; align-items: center; justify-content: space-between; padding: 18px 28px 0; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.ch-phone-status .pill { position: absolute; left: 50%; top: 15px; width: 92px; height: 26px; border-radius: 13px; background: var(--gray-10); transform: translateX(-50%); }
.ch-phone-status .glyphs { display: inline-flex; align-items: center; gap: 6px; }
.ch-phone-status .glyphs svg { display: block; height: 12px; width: auto; }
.ch-phone-bar { position: absolute; left: 0; right: 0; top: 60px; z-index: 2; display: grid; grid-template-columns: 30px 1fr 30px; align-items: center; padding: 12px 22px 12px; font-size: 15px; }
.ch-phone-bar .back { width: 11px; height: 11px; border-left: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg); margin-left: 8px; }
.ch-phone-bar b { text-align: center; font-weight: 500; }
.ch-phone-bar .who { display: none; }
.ch-phone-bar .av { width: 30px; height: 30px; border-radius: 50%; background: ${C.gray1}; box-shadow: inset 0 0 0 1px rgba(19, 32, 69, 0.08); display: grid; place-items: center; }
.ch-phone-bar .av svg { width: 15px; height: 15px; }
.ch-screen .ch-chat { position: absolute; left: 7%; right: 7%; top: 112px; bottom: 26px; overflow: visible; clip-path: inset(0 -60% 0 -60%); }
.ch-screen::after { content: ''; position: absolute; left: 4px; right: 4px; top: 110px; height: 36px; z-index: 2; pointer-events: none; background: linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0)); }
.ch-chat-list { display: grid; gap: 12px; padding-bottom: 4px; transition: transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.ch-chat-list.snap { transition: none; }
.ch-bubble { border-radius: 12px; padding: 12px 14px; font-size: 13px; line-height: 1.4; max-width: 86%; letter-spacing: -0.005em; animation: chBubble 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
@keyframes chBubble { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.ch-bubble.me { justify-self: end; background: ${C.blue7}; color: #fff; border-radius: 10px; }
.ch-bubble.ai, .ch-bubble.dr { position: relative; margin-left: 16px; background: ${C.blue1}; color: ${C.blue9}; }
.ch-bubble.ai::before, .ch-bubble.dr::before { position: absolute; left: -16px; bottom: -10px; width: 28px; height: 28px; border-radius: 50%; box-shadow: 0 0 0 2px #fff; text-align: center; line-height: 28px; }
.ch-bubble.ai::before { content: 'C'; background: ${C.blue9}; color: #fff; font-family: var(--display-font, "Cooper Light", serif); font-size: 14px; }
.ch-bubble.dr::before { content: 'RS'; background: linear-gradient(135deg, ${C.blue3}, ${C.blue7}); color: #fff; font-size: 9px; font-weight: 500; letter-spacing: 0.02em; }
.ch-bubble .cta { display: block; margin-top: 10px; padding: 10px 12px; border-radius: 10px; background: ${C.blue9}; color: #fff; text-align: center; font-size: 12.5px; font-weight: 500; letter-spacing: 0; }
/* the kit of parts, flat like the app's: the doctor joining, an attachment,
   the prescription card (green, and wider than the screen), the meta line */
.ch-kit { max-width: 92%; border-radius: 14px; padding: 12px 14px; font-size: 13px; line-height: 1.4; color: ${C.blue9}; display: grid; gap: 3px; animation: chBubble 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.ch-kit small { font-size: 11px; font-weight: 500; letter-spacing: 0; opacity: 0.6; }
.ch-kit.rec { grid-template-columns: 14px 1fr; column-gap: 9px; background: ${C.gray1}; }
.ch-kit.rec::before { content: ''; grid-row: 1 / span 2; width: 10px; height: 10px; margin-top: 3px; border-radius: 3px; background: var(--w, ${C.brightBlue}); }
.ch-kit.rec > span, .ch-kit.rec > small { grid-column: 2; }
.ch-kit.join { max-width: 100%; background: ${C.blue1}; display: flex; align-items: center; gap: 10px; }
.ch-kit.join i { flex: none; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, ${C.blue3}, ${C.blue7}); color: #fff; font-size: 10px; font-weight: 500; letter-spacing: 0.04em; display: grid; place-items: center; font-style: normal; }
.ch-kit.join b { display: block; font-weight: 500; }
.ch-kit.join small { display: block; opacity: 0.65; }
.ch-kit.file { justify-self: end; max-width: 78%; padding: 0; overflow: hidden; background: ${C.blue7}; color: #fff; display: grid; grid-template-columns: 56px 1fr; align-items: center; gap: 10px; border-radius: 12px; }
.ch-kit.file i { width: 56px; height: 56px; background: linear-gradient(135deg, ${C.pink}, ${C.maroon}); display: grid; place-items: center; }
.ch-kit.file i::after { content: ''; width: 16px; height: 12px; border: 2px solid rgba(255, 255, 255, 0.9); border-radius: 3px; }
.ch-kit.file b { font-weight: 500; }
.ch-kit.file small { display: block; color: rgba(255, 255, 255, 0.7); padding-right: 12px; }
.ch-kit.rx { max-width: 100%; padding: 0; overflow: hidden; border-radius: var(--card-r, 16px); background: ${C.green1}; color: ${C.green7}; }
.ch-kit.rx .row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; padding: 16px 18px 14px; background: var(--green-2); }
.ch-kit.rx .row b { font-family: var(--display-font, "Cooper Light", serif); font-weight: 300; font-size: 26px; line-height: 1.05; letter-spacing: -0.01em; display: block; }
.ch-kit.rx .row small { display: block; margin-top: 6px; font-size: 13px; opacity: 0.75; }
.ch-kit.rx .row .tag { font-size: 12px; font-weight: 500; letter-spacing: 0.02em; opacity: 0.7; background: none; padding: 2px 0; }
.ch-kit.rx .body { padding: 14px 18px 16px; font-size: 14px; line-height: 1.5; display: grid; gap: 6px; }
.ch-kit.rx .body u { text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
/* a card that bleeds off the screen, past the bezel, when it needs the room (Denny, 2026-09-08) */
.ch-kit.wide { width: 130%; max-width: none; margin-left: -15%; box-shadow: 0 24px 50px -24px rgba(19, 32, 69, 0.35); }
.ch-kit.meta { max-width: 100%; background: none; padding: 6px 2px 0; font-size: 11px; letter-spacing: 0; opacity: 0.5; text-align: center; }

/* ---------------- 2. pricing ---------------- */
.ch-price { background: ${C.gray1}; color: ${C.blue9}; padding: calc(clamp(80px, 10vw, 140px) + var(--r)) 0 clamp(80px, 10vw, 140px); }   /* the app's off-white (the review, 2026-09-08); the free card takes the light green */
.ch-plans { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ch-plan { position: relative; border-radius: var(--card-r, 16px); padding: 36px 36px 32px; background: ${C.green1}; color: ${C.green7}; display: grid; align-content: start; gap: 18px; overflow: hidden; }
.ch-plan.dark { background: var(--bg, ${C.green7}); color: ${C.gray1}; }
.ch-plan .ch-thread-strip { position: absolute; left: 0; right: 0; top: 0; height: 6px; display: flex; }
.ch-plan .ch-thread-strip i { flex: 1; }
.ch-plan-name { font-size: 15px; font-weight: 500; letter-spacing: 0.01em; display: flex; align-items: center; gap: 10px; }
.ch-plan-name .ch-pill { font-size: 12px; font-weight: 500; letter-spacing: 0; padding: 5px 8px; border-radius: 6px; background: ${C.yellow}; color: ${C.blue9}; }
.ch-price-big { display: flex; align-items: baseline; gap: 8px; font-family: var(--display-font, "Cooper Light", serif); font-weight: 300; font-size: clamp(56px, 6vw, 80px); line-height: 1; letter-spacing: -0.03em; }
.ch-price-big small { font-family: var(--body-font, "GT America", sans-serif); font-size: 16px; letter-spacing: 0; opacity: 0.7; }
.ch-plan-sub { font-size: 15px; line-height: 1.45; opacity: 0.8; }
.ch-plan ul { list-style: none; margin: 6px 0 4px; padding: 0; display: grid; gap: 12px; }
.ch-plan li { display: flex; align-items: flex-start; gap: 12px; font-size: 16px; line-height: 1.4; }
.ch-plan li i { flex: none; width: 10px; height: 10px; border-radius: 3px; margin-top: 6px; background: var(--w, ${C.green3}); }
.ch-plan li em { font-style: normal; opacity: 0.6; }
.ch-plan .ch-btn { justify-self: start; margin-top: 10px; }
.ch-plan.dark .ch-btn--ghost { color: ${C.gray1}; }
.ch-price .ch-price-foot { margin-top: 64px; text-align: center; font-size: 13px; color: rgba(19, 32, 69, 0.5); }   /* muted, with room above it (Hunter, 2026-09-08); specific enough to beat the band's own p and the arrival's opacity */

/* ---------------- 3. why members stay ---------------- */
/* three cards on Blue 2, each with a specimen of the product up top (the
   chat kit of parts again) and the claim under it, so the card shows the
   thing rather than an icon for it (Hunter, 2026-09-08: these can be better) */
.ch-why { background: ${C.blue2}; color: ${C.blue9}; padding: calc(clamp(80px, 10vw, 140px) + var(--r)) 0 clamp(80px, 10vw, 140px); }
.ch-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.ch-card { border-radius: var(--card-r, 16px); padding: 10px 10px 30px; background: ${C.blue1}; display: grid; align-content: start; gap: 22px; transition: transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1); }
/* Hunter, 2026-09-11: benefit cards stay still on hover, with no photo zoom. */
.ch-card .ch-photo { position: relative; height: 230px; border-radius: calc(var(--card-r, 16px) - 6px); overflow: hidden; background: ${C.blue3}; }   /* lifestyle frames from the set (Hunter, 2026-09-08) */
.ch-card .ch-photo img { display: block; width: 100%; height: 100%; object-fit: cover; transform: scale(1.02); }
.ch-card .ch-spec { position: relative; height: 200px; border-radius: 16px; background: #fff; overflow: hidden; padding: 18px 16px; display: grid; align-content: end; gap: 8px; }
.ch-card .ch-spec .ch-bubble, .ch-card .ch-spec .ch-kit { opacity: 0; transform: translateY(10px); transition: opacity 500ms ease, transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--d, 0) * 140ms + 200ms); animation: none; }
.ch-in .ch-card .ch-spec .ch-bubble, .ch-in .ch-card .ch-spec .ch-kit { opacity: 1; transform: none; }
.ch-card .ch-spec .ch-bubble { font-size: 12px; }
.ch-card .ch-spec .ch-bubble .tag { display: inline-block; margin-top: 6px; font-size: 10px; font-weight: 500; letter-spacing: 0; padding: 3px 6px; border-radius: 5px; background: ${C.green3}; color: ${C.blue9}; }
.ch-card .ch-spec .ch-kit.rec { max-width: 100%; }
/* the seven-day visit: a bar of days, the ones so far in green, a check-in on day three */
.ch-card .ch-week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-top: 4px; }
.ch-card .ch-week i { height: 6px; border-radius: 3px; background: ${C.gray2}; }
.ch-card .ch-week i.on { background: ${C.green3}; }
.ch-card .ch-week i.now { background: ${C.blue9}; }
.ch-card .ch-copy { display: grid; gap: 12px; padding: 0 18px; }
/* Hunter, 2026-09-10, bd8qcff6: middle claim reverses the image and copy. */
.ch-card.ch-card-reverse { padding: 30px 10px 10px; grid-template-rows: 1fr auto; }
.ch-card.ch-card-reverse .ch-copy { order: -1; }
.ch-card h3 { font-size: clamp(24px, 2.2vw, 30px); line-height: 1.12; }
.ch-card p { font-size: 16px; line-height: 1.5; opacity: 0.78; }

/* ---------------- 4. hear from our members ---------------- */
/* a marquee after Hunter's reference (2026-09-09): a testimonial card, then
   a smaller lifestyle frame, then the next testimonial, running slowly
   across the full width and holding under the cursor. Every other join is
   tied with a 4 by 4 grid of squares whose pitch is the gap itself, so its
   columns sit on the two cards' edges and its rows on the frame's top or
   bottom edge, alternating */
.ch-members { background: ${C.gray1}; color: ${C.blue9}; padding: calc(clamp(80px, 10vw, 140px) + var(--r)) 0 clamp(80px, 10vw, 140px); --gap: 20px; --dot: 6px; --qw: 340px; --qh: 430px; --fw: 230px; --fh: 350px; --qfs: 24px; --sx: 0px; --sy: 0px; }   /* the dials (members, in the panel) set these; these are Hunter's numbers from 2026-09-09 */
.ch-marquee { position: relative; margin-top: -8px; overflow: hidden; cursor: grab; user-select: none; -webkit-user-select: none; touch-action: pan-y; }   /* no fade at the edges (Hunter, 2026-09-09: no gradients) */
.ch-marquee.dragging { cursor: grabbing; }
.ch-marquee-track { display: flex; align-items: center; gap: var(--gap); width: max-content; padding: 120px 0; will-change: transform; }
.ch-quote, .ch-frame { margin: 0; }   /* a figure carries a 40px side margin by default, which was widening every gap */
.ch-quote { position: relative; flex: none; width: calc(var(--qw) * var(--wk, 1)); height: var(--qh); border-radius: var(--card-r, 16px); padding: 30px 30px 28px; background: #fff; display: grid; align-content: space-between; gap: 22px; }
/* Hunter, 2026-09-10, dl5ocvon: alternate 430/390 at the saved defaults.
   A minimum content height protects the words when the params are changed. */
.ch-quote { height: calc(var(--qh) - var(--short, 0px)); min-height: min-content; }
.ch-quote.is-short { --short: 40px; }
.ch-quote figcaption { display: grid; justify-items: start; gap: 5px; }
.ch-quote figcaption > .vchip { margin-bottom: 3px; } /* Hunter, zk10v8ot: Verified above the name. */
/* Hunter, 2026-09-10, pdh9vnbw: demographic detail to the right of the name. */
.ch-quote .ch-member-line { display: flex; align-items: baseline; gap: 4px 10px; flex-wrap: wrap; }
.ch-quote .ch-member-line b { white-space: nowrap; }
.ch-quote .ch-member-line small { color: var(--gray-65); opacity: 1; margin: 0; }
.ch-quote blockquote { margin: 0; font-family: var(--display-font, "Cooper Light", serif); font-weight: 300; font-size: var(--qfs); line-height: 1.22; letter-spacing: -0.015em; } /* Hunter, 2026-09-10: responsive type roles refine this in counsel-type-v13.css. */
.ch-quote figcaption b { display: flex; align-items: center; gap: 8px; font-weight: 400; font-size: 15px; }
/* beside the name: a Green 3 circle with a navy check, then a Verified pill
   in the hero's chip system (Hunter, 2026-09-09) */
.ch-quote .vchip { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500; line-height: 1; padding: 4px 9px 4px 8px; border-radius: 7px; background: ${C.green3}; color: ${C.blue9}; white-space: nowrap; }
.ch-quote .vchip i { width: 8px; height: 5px; margin-top: -2px; border-left: 1.6px solid ${C.blue9}; border-bottom: 1.6px solid ${C.blue9}; transform: rotate(-45deg); }
.ch-quote figcaption small { display: block; font-size: 15px; opacity: 0.85; margin-top: 2px; }
.ch-frame { position: relative; flex: none; width: var(--fw); height: var(--fh); border-radius: var(--card-r, 16px); overflow: visible; }
.ch-frame .pic { position: absolute; inset: 0; border-radius: var(--card-r, 16px); overflow: hidden; }
/* the picture is wider than its card and slides inside it as the card
   crosses the screen, a parallax in the card's own frame (Hunter, 2026-09-09) */
.ch-frame img { display: block; width: 136%; height: 100%; margin-left: -18%; object-fit: cover; transform: translateX(var(--px, 0px)); will-change: transform; }
/* the stitch: 4 by 4, pitch = the gap, two inner columns on the cards'
   edges, one row on the frame's edge; a corner or two left out, as drawn */
.ch-stitch { position: absolute; z-index: 2; display: grid; grid-template-columns: repeat(4, var(--dot)); gap: calc(var(--gap) - var(--dot)); pointer-events: none; left: calc(-2 * var(--gap) - var(--dot) / 2); transform: translate(var(--sx), var(--sy)); }   /* the second column on the previous card's edge, the third on this one's; the dials can nudge it */
.ch-stitch.top { bottom: calc(100% - var(--dot) / 2); }
.ch-stitch.bottom { top: calc(100% - var(--dot) / 2); }
.ch-stitch i { width: var(--dot); height: var(--dot); border-radius: 1px; background: ${C.green7}; }
.ch-stitch i.off { visibility: hidden; }

/* ---------------- 5. the questions ---------------- */
/* a two-column band: the headline stays put beside the list. Each question
   wears the weave above it, five stripes of the thread's colours, and when
   it opens the stripes run along the line, the deck's Draw (Hunter,
   2026-09-08: stripes from the weave, no numerals) */
.ch-faq { background: #fff; color: ${C.blue9}; padding: calc(clamp(80px, 10vw, 140px) + var(--r)) 0 clamp(80px, 10vw, 140px); }
.ch-faq .ch-wrap { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 64px; align-items: start; }
.ch-faq-side { position: sticky; top: 96px; display: grid; gap: 18px; }
.ch-faq-side p { font-size: 16px; line-height: 1.5; opacity: 0.7; max-width: 340px; }


/* Footer styles are shared in ui-src/counsel-footer.css. */

/* Hunter, 2026-09-10: client round, V13. The phone has a fixed proportion,
   AI speaks on the canvas, and the extra feature pills are removed. */
.ch-phone { width: min(350px, 34svh, 78%); height: auto; aspect-ratio: 9 / 19.5; padding: 12px; }
.ch-phone-status { padding: 14px 18px 0; font-size: 11px; }
.ch-phone-status .pill { width: 26%; height: 16px; top: 12px; }
.ch-phone-status .glyphs { gap: 4px; }
.ch-phone-status .glyphs svg { height: 9px; }
.ch-walk-frame { justify-content: center; }
.ch-walk-tags { display: none; }
.ch-bubble.ai { margin-left: 0; padding: 6px 0; background: none; max-width: 100%; border-radius: 0; }
.ch-bubble.ai::before { content: none; }
.ch-kit.sources { padding: 0 0 10px; font-size: 10px; color: ${C.gray65}; gap: 5px; }
.ch-kit.sources a { color: ${C.blue9}; text-decoration: none; display: inline-flex; gap: 5px; align-items: center; }
.ch-kit.sources a::before { content: '↗'; }
.ch-thinking { display: flex; align-items: center; gap: 10px; min-height: 32px; font-size: 12px; color: ${C.gray65}; }
/* Same diagonal pulse as the client reference: 2000ms, 85% stagger,
   50% duty, 5% peak hold, 18% resting opacity, 80% resting scale.
   https://counselhealth.design/ai_thinking_animation.html (Hunter, 2026-09-10). */
.counsel-thinking { display: inline-grid; grid-template-columns: repeat(3, 3px); gap: 4px; flex: none; }
.counsel-thinking i { display: block; width: 3px; height: 3px; border-radius: 20%; background: var(--c); opacity: 0.18; transform: scale(0.8); animation: chThinking 2000ms cubic-bezier(0.42, 0, 0.58, 1) infinite; animation-delay: var(--delay); }
@keyframes chThinking { 0%, 50%, 100% { opacity: 0.18; transform: scale(0.8); } 23.75%, 26.25% { opacity: 1; transform: scale(1); } }
/* The weave moves to the three claims. A single cluster joins each gap. */
.ch-why .ch-cards { position: relative; }
.ch-why .ch-card { position: relative; }
.ch-claim-tie { position: absolute; left: calc((100% - 40px) / 3 + 10px); top: 0; transform: translate(-50%, -50%); z-index: 4; display: grid; grid-template-columns: repeat(4, 5px); gap: 8px; pointer-events: none; } /* Hunter, 2026-09-10, m1ydiyd1: top of the first gap. */
.ch-claim-tie.second { left: calc((100% - 40px) / 3 * 2 + 30px); top: auto; bottom: 0; transform: translate(-50%, 50%); } /* Bottom of the second gap. */
.ch-claim-tie i { width: 5px; height: 5px; background: ${C.green7}; }
.ch-claim-tie i:nth-child(4), .ch-claim-tie i:nth-child(13) { visibility: hidden; }
/* Brand portraits belong to the section, never to a named quote. */
.ch-member-portraits { display: flex; justify-content: center; gap: 10px; margin-top: 8px; }
.ch-member-portraits span { width: 58px; height: 58px; border-radius: 50%; overflow: hidden; background: ${C.blue2}; }
.ch-member-portraits img { width: 100%; height: 100%; object-fit: cover; transform: scale(2); transform-origin: var(--face); }
.ch-marquee-track { padding: 24px 0; }
/* Hover has the one coloured thread. Selected rows settle to a neutral rule. */
.ch-q.is-open .ch-q-weave { opacity: 0; clip-path: inset(0 100% 0 0); }
.ch-q.is-thread .ch-q-rule::before { opacity: 0; }
.ch-q.is-thread .ch-q-weave { opacity: 1; clip-path: inset(0 0 0 0); }
@media (prefers-reduced-motion: reduce) { .counsel-thinking i { animation: none; opacity: 0.65; transform: none; } .ch-foot-field .ph-line { animation: none !important; } } /* Hunter, 2026-09-10: the footer respects reduced motion too. */

/* ---------------- phones and small screens ---------------- */
@media (max-width: 900px) {
  .ch-wrap { width: var(--content-width, 90%); }
  .ch-plans, .ch-cards, .ch-quotes { grid-template-columns: 1fr; }
  .ch-plan { padding: 28px 24px 26px; }
  .ch-faq .ch-wrap { grid-template-columns: 1fr; gap: 36px; }
  .ch-faq-side { position: static; }
  .ch-q summary { padding: 18px 0 10px; }
  .ch-q summary::before { margin: 0; }
  .ch-q .ch-a p { padding: 8px 8px 22px 0; }
  /* a phone: the frame holds at the top while the steps pass under it */
  .ch-walk .ch-wrap { display: flex; flex-direction: column; align-items: stretch; }
  .ch-walk-side { display: contents; }
  .ch-walk-frame { order: 3; }
  .ch-walk-steps { order: 4; }
  .ch-walk-frame { position: sticky; top: 64px; z-index: 2; height: 60svh; flex-direction: column; align-items: center; gap: 10px; margin: 0 -6% 8px; padding: 10px 0; background: linear-gradient(to bottom, ${C.blue1} 92%, rgb(223 239 248 / 0)); } /* Hunter, 2026-09-10: space for the taller phone. */
  .ch-walk-frame::before { display: none; }
  .ch-walk-tags { display: none; }
  .ch-phone { width: auto; height: 56svh; aspect-ratio: 9 / 19.5; padding: 8px; border-radius: 36px; } /* Hunter, 2026-09-10. */
  .ch-screen { border-radius: 30px; }
  .ch-phone-status { padding: 12px 20px 0; font-size: 12px; }
  .ch-phone-status .pill { width: 26%; height: 16px; top: 10px; }
  .ch-phone-bar { top: 40px; padding: 8px 16px; font-size: 13px; }
  .ch-screen .ch-chat { top: 84px; }
  .ch-screen::after { top: 82px; }
  .ch-walk-steps li { min-height: 46vh; padding-right: 0; }
  .ch-walk-steps li h3 { font-size: 24px; }
  .ch-quote { min-height: 0; }




  .ch-members { --gap: 16px; --dot: 6px; }
  .ch-marquee-track { padding: 24px 0; } /* Hunter, 2026-09-10: quotes only. */
  .ch-claim-tie, .ch-claim-tie.second { left: 50%; top: var(--tie-y); bottom: auto; transform: translate(-50%, -50%); }
  .ch-why .ch-card { position: relative; }
  .ch-quote { width: min(var(--w, 320px), 78vw); height: calc(400px - var(--short, 0px)); padding: 22px 20px 20px; } /* Hunter, 2026-09-10: type lives in counsel-type-v13.css; keep alternating heights and room for Verified. */
  .ch-frame { width: 220px; height: 250px; }







}
`;

  /* ---- markup ---- */
  const oweave = `<span class="ch-oweave" aria-hidden="true">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<i style="--d:${i}"></i>`).join('')}</span>`;   // the open weave, in the card's own colour (--w)
  const weave = (color, from) => `<span class="ch-weave" style="--w:${color}">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<i style="--d:${(from || 0) + i}"></i>`).join('')}</span>`;
  const strip = () => `<span class="ch-thread-strip" aria-hidden="true">${THREAD.map((c, i) => `<i style="background:${c};--d:${i}"></i>`).join('')}</span>`;
  const arrow = '<svg viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const chev = '<svg viewBox="0 0 14 14" fill="none" aria-hidden><path d="M2 5l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const lock = '<svg viewBox="0 0 16 16" fill="none" aria-hidden><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.5a3.33 3.33 0 0 0-3.33 3.33v1.22A2.5 2.5 0 0 0 2.67 8.5v3.67a2.5 2.5 0 0 0 2.5 2.5h5.66a2.5 2.5 0 0 0 2.5-2.5V8.5a2.5 2.5 0 0 0-2-2.45V4.83A3.33 3.33 0 0 0 8 1.5Zm2.33 4.5V4.83a2.33 2.33 0 1 0-4.66 0V6h4.66ZM8 8.83c.28 0 .5.23.5.5v2a.5.5 0 0 1-1 0v-2c0-.27.22-.5.5-.5Z" fill="currentColor"/></svg>';

  /* the questions and answers are the live site's (counselhealth.com,
     read 2026-09-08), all ten, verbatim */
  const FAQ = window.CounselFAQ; // Hunter, 2026-09-15: render the shared content source.

  /* Hunter, 2026-09-10: marketing explains the story beside the chat.
     Product messages live only in counsel-care-journey-v13.js, not in a second script. */
  const WALK = [
    { title: 'Ask Counsel anything', chip: ['Chat', C.green3], copy: 'Nora has been unusually tired for a few weeks. She asks Counsel what could be going on.' }, // Sam at Counsel, Oct 13 (Notion): Nora's story is now fatigue, labs and low vitamin D.
    { title: 'Add a doctor to the chat', chip: ['Doctor', C.blue2], copy: 'No appointments, or video calls. A doctor joins Nora’s chat in minutes to help her decide what to do next.' },
    { title: 'From answer to action', chip: ['Action', C.yellow], copy: 'Her doctor orders labs. If she needed a prescription or referral instead, Counsel could handle that too.' },
    { title: 'Care that keeps going', chip: ['Follow-up', C.pink], copy: 'Results, treatment, and follow-up stay connected, so Nora never has to start over.' },
  ];

  /* a weave line: the thread's colours in a run of caps, no two the same
     (Hunter, 2026-09-08: different sizes, different colours, randomised). A
     seeded run per line, so a line keeps its weave across reloads. The run
     repeats once inside the image so it can travel seamlessly */
  function weaveOn(el, seed) {
    let x = (seed * 2654435761) >>> 0;
    const rnd = () => { x = (x * 1103515245 + 12345) >>> 0; return (x >>> 8) / 16777216; };
    const n = 4 + Math.floor(rnd() * 5);
    const widths = []; for (let i = 0; i < n; i++) widths.push(0.4 + rnd() * 1.8);
    const total = widths.reduce((a, b) => a + b, 0);
    const caps = []; let last = -1;
    for (let i = 0; i < n; i++) { let c; do { c = Math.floor(rnd() * THREAD.length); } while (c === last); last = c; caps.push([THREAD[c], widths[i] / total * 50]); }
    const stops = []; let pos = 0;
    for (let rep = 0; rep < 2; rep++) caps.forEach(([c, w]) => { stops.push(`${c} ${pos.toFixed(2)}% ${(pos + w).toFixed(2)}%`); pos += w; });
    el.style.setProperty('--weave', `linear-gradient(90deg, ${stops.join(', ')})`);
    el.style.setProperty('--wh', (2 + Math.floor(rnd() * 3)) + 'px');
  }

  /* the members' words: the live site's seven, with placeholder names
     until the real ones are cleared. Widths follow the words; the stitches
     vary card to card so the run never repeats itself */
  const QUOTES = [
    ['During a holiday, I ran out of medication unexpectedly and my usual PCP was closed. Counsel responded to my request and had my prescription written within minutes!', 'Jordan M.', 'Male, 18 to 29'],
    ['Dr. Rishi took the time to explain the reasons behind my symptoms and the possible treatments. There was so much reassurance.', 'Priya S.', 'Female, 18 to 29'],
    ["Counsel is a lifesaver. I start a new chat every time I'm unsure of what to do, and I get instant answers with extremely helpful advice!", 'Daniela R.', 'Female, 30 to 39'],
    ["Thanks for your help! I received great support and feel like I'm headed in the right direction. Counsel also helped me book an in-person appointment without any issues.", 'Marcus T.', 'Male, 30 to 39'],
    ['Dr. Whitehead helped me feel more reassured in an hour than a primary care doctor and a cardiologist have made me feel in months. So thank you for this, you have no idea how much that means.', 'Elena K.', 'Female, 40 to 49'],
    ["Thank you for the support and to the physicians! I've been trying for weeks to find an in-person provider who can help me based on my individual needs and Counsel helped me right away.", 'Sofia B.', 'Female, 40 to 49'],
    ["Counsel has been extremely helpful. I'm not able to discuss medical concerns like this with any of my in-person doctors!", 'Robert H.', 'Male, 70 to 79'],
  ];
  /* the marquee's dials: what the panel's members group drives */
  const marquee = { gap: 20, dot: 6, quoteWidth: 340, quoteHeight: 430, frameWidth: 230, frameHeight: 350, quoteSize: 24, loop: 135, stitch: 'every other', side: 'alternate', corners: true, nudgeX: 0, nudgeY: 0 };
  const quoteCard = ([text, name, who], i, rep) => {
    const wk = Math.max(0.9, Math.min(1.14, 0.6 + text.length / 380));   // longer words, a wider card
    // Hunter, 2026-09-10: all quotes share one size, no shrinking by copy length.
    return `<figure class="ch-quote${i % 2 ? ' is-short' : ''}" style="--wk:${wk.toFixed(3)}"${rep ? ' aria-hidden="true"' : ''}><blockquote>${text}</blockquote><figcaption><span class="vchip"><i aria-hidden="true"></i>Verified</span><span class="ch-member-line"><b>${name}</b><small>${who}</small></span></figcaption></figure>`;
  };
  // the lifestyle frames between the words, and the stitch on every other join
  const FRAMES = ['counsel-05-green-bottle-on-tray', 'counsel-19-hand-holding-pill', 'counsel-18-child-plaster-on-arm', 'counsel-07-woman-injection-green', 'counsel-16-woman-arm-check', 'counsel-09-cyclist', 'counsel-14-potter-at-wheel'];
  const frameCard = (i, rep) => {
    const src = `/brand/counsel/photography/web/${FRAMES[i % FRAMES.length]}.webp`;
    const tie = marquee.stitch === 'every' ? true : marquee.stitch === 'none' ? false : i % 2 === 0;
    const nth = marquee.stitch === 'every' ? i : i / 2;
    const top = marquee.side === 'top' ? true : marquee.side === 'bottom' ? false : nth % 2 === 0;
    // the corner dots left out: on a top stitch the top right and the bottom left; on a bottom stitch the bottom right
    const off = !marquee.corners ? [] : top ? [3, 12] : [15];
    const stitch = tie ? `<span class="ch-stitch ${top ? 'top' : 'bottom'}" aria-hidden="true">${Array.from({ length: 16 }, (_, k) => `<i${off.includes(k) ? ' class="off"' : ''}></i>`).join('')}</span>` : '';
    return `<figure class="ch-frame"${rep ? ' aria-hidden="true"' : ''}>${stitch}<span class="pic"><img src="${src}" alt="" draggable="false"></span></figure>`;
  };
  // Hunter, 2026-09-10: no imagery or weave attached to individual testimonials.
  // Hunter, 2026-09-10: an even-length cycle keeps tall/short alternating at the seam.
  const marqueeHtml = () => [0, 1].map((rep) => [...QUOTES, ...QUOTES].map((q, i) => quoteCard(q, i, rep || i >= QUOTES.length)).join('')).join('');
  function setMarquee(o) {
    Object.assign(marquee, o || {});
    const el = document.querySelector('.ch-members');
    if (!el) return;
    const px = (k, v) => el.style.setProperty(k, v + 'px');
    px('--gap', marquee.gap); px('--dot', marquee.dot); px('--qw', marquee.quoteWidth); px('--qh', marquee.quoteHeight); px('--fw', marquee.frameWidth); px('--fh', marquee.frameHeight); px('--qfs', marquee.quoteSize); px('--sx', marquee.nudgeX); px('--sy', marquee.nudgeY);
    el.style.setProperty('--ch-marquee', marquee.loop + 's');
    const track = el.querySelector('.ch-marquee-track');
    if (track && o && ('stitch' in o || 'side' in o || 'corners' in o)) track.innerHTML = marqueeHtml();
  }

  // Footer content comes from the shared Home V13 component.

  const html = `
<section class="ch ch-walk" data-counsel-theme="blue" id="walkthrough">
  <div class="ch-wrap">
    <div class="ch-walk-frame ch-rise" style="--d:2" aria-label="From your first question to ongoing care"></div>
    <div class="ch-walk-side">
      <ol class="ch-walk-steps">
        ${WALK.map((st, i) => `<li data-i="${i}"><span class="ch-step-chip" style="--c:${st.chip[1]}">${st.chip[0]}</span><h3>${st.title}</h3><p>${st.copy}</p></li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<section class="ch ch-price" data-counsel-theme="light" id="pricing">
  <div class="ch-wrap">
    <div class="ch-head">
      <!-- Sam at Counsel, Oct 13 (Notion): pay per visit and a $300 membership. -->
      <h2 class="ch-rise" style="--d:0">Start free. Add a doctor when you need one.</h2>
      <p class="ch-lede ch-rise" style="--d:1">Ask Counsel anything at no cost. Pay $29 when you need a doctor, or get unlimited access for $300/year.</p>
    </div>
    <div class="ch-plans">
      <article class="ch-plan ch-rise" data-counsel-theme="green" style="--d:2">
        <div class="ch-plan-name">Pay per visit</div>
        <div class="ch-price-big">$29 <small>/ visit</small></div>
        <p class="ch-plan-sub">Chat with Counsel for free. When you need a doctor, just pay for the visit.</p>
        <ul>
          <li><i style="--w:${C.green3}"></i>Board-certified doctors join your chat in minutes</li>
          <li><i style="--w:${C.brightBlue}"></i>Visits stay open for 7 days</li>
          <li><i style="--w:${C.pink}"></i>No subscription or commitment</li>
        </ul>
        <a class="ch-btn ch-btn--ghost" href="#">Get started for free</a>
      </article>
      <article class="ch-plan dark ch-rise" data-counsel-theme="dark" style="--d:3">
        <div class="ch-plan-name">Membership</div>
        <div class="ch-price-big">$300 <small>/ year</small></div>
        <p class="ch-plan-sub">Unlimited access to doctors whenever you need care.</p>
        <ul>
          <li><i style="--w:${C.yellow}"></i>Unlimited doctor visits</li>
          <li><i style="--w:${C.green3}"></i>No per-visit fees</li>
          <li><i style="--w:${C.brightBlue}"></i>Built for managing conditions and regular check-ins</li>
        </ul>
        <a class="ch-btn ch-btn--light" href="#">Become a member</a>
      </article>
    </div>
    <!-- Denny via Hunter, 2026-09-20: remove the pricing footnote. -->
  </div>
</section>

<section class="ch ch-why" data-counsel-theme="blue" id="why">
  <div class="ch-wrap">
    <div class="ch-head">
      <h2 class="ch-rise" style="--d:0">Why members stay</h2>
    </div>
    <div class="ch-cards">
      <article class="ch-card ch-rise" style="--d:1">
        <div class="ch-photo"><img src="/brand/counsel/photography/web/counsel-12-man-sofa-phone.webp" alt=""></div>
        <div class="ch-copy">
          <h3>Real advice, no hedging</h3>
          <p>Counsel tells you what you need to know so you can make a decision about what to do next, like the chat saying it's safe to wait until morning.</p>
        </div>
      </article>
      <article class="ch-card ch-rise ch-card-reverse" style="--d:2">
        <div class="ch-photo"><img src="/brand/counsel/photography/web/counsel-09-cyclist.webp" style="object-position:50% 42%" alt=""></div>
        <div class="ch-copy">
          <h3>Never repeat yourself</h3>
          <p>Counsel remembers your past interactions and connects to your health records. Every conversation has your full health context.</p>
        </div>
      </article>
      <article class="ch-card ch-rise" style="--d:3">
        <div class="ch-photo"><img src="/brand/counsel/photography/web/counsel-13-father-and-baby-asleep.webp" alt=""></div>
        <div class="ch-copy">
          <h3>The visit doesn't end when the chat does</h3>
          <p>A $29 visit stays open for 7 days, so you can follow up until your problem is actually solved.</p>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="ch ch-members" data-counsel-theme="light" id="members">
  <div class="ch-wrap">
    <div class="ch-head">
      <h2 class="ch-rise" style="--d:0">Hear from our members</h2>
      <!-- Hunter, 2026-09-10, 2tdtb1v5: remove the portrait group. -->
    </div>
  </div>
  <div class="ch-marquee" aria-label="What members say">
    <div class="ch-marquee-track">${marqueeHtml()}</div>
  </div>
</section>

<section class="ch ch-faq" data-counsel-theme="light" id="faq">
  <div class="ch-wrap">
    <div class="ch-faq-side">
      <h2 class="ch-rise" style="--d:0">Your questions, answered</h2>
      <p class="ch-rise" style="--d:1">Anything else? Ask Counsel. The first answer is free, and a doctor is one click away.</p>
    </div>
    <div class="ch-faq-list ch-rise" style="--d:1">
      ${window.CounselFAQComponent.markup(FAQ.map(([question,answerHTML])=>({question,answerHTML})))}
    </div>
  </div>
</section>

${window.CounselFooter.markup()}`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  host.insertAdjacentHTML('afterend', html);
  window.CounselFooter.mount();
  // Hunter, 2026-09-10: move the testimonial weave up to connect the three claims.
  document.querySelectorAll('.ch-why .ch-card').forEach((card, i) => {
    if (i > 1) return;
    const tie = document.createElement('span');
    tie.className = 'ch-claim-tie' + (i ? ' second' : '');
    tie.setAttribute('aria-hidden', 'true');
    tie.innerHTML = '<i></i>'.repeat(16);
    card.parentElement.appendChild(tie);
    const placeTie = () => tie.style.setProperty('--tie-y', (card.offsetTop + card.offsetHeight + 10) + 'px');
    new ResizeObserver(placeTie).observe(card);
    window.addEventListener('resize', placeTie);
    placeTie();
  });

  /* ---- arrival: each band and each card wakes as it comes into view ---- */
  const scroller = document.getElementById('stage') || null;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ch-in'); io.unobserve(e.target); } });
  }, { root: scroller, threshold: 0.12 });
  document.querySelectorAll('.ch').forEach((el) => io.observe(el));

  /* a thread draws in, the deck's Draw, when its band arrives: the members'
     thread behind the cards, and the footer's lasso round the field */
  function drawThread(svgEl, watchEl, ms) {
    if (!svgEl) return;
    const paths = [...svgEl.querySelectorAll('path')];
    const L = paths[0].getTotalLength();
    const seg = L / paths.length, gap = L - seg;
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${seg} ${gap}`;
      p.style.strokeDashoffset = String(-i * seg + L);   // parked before the start
      p.style.transition = `stroke-dashoffset ${ms}ms cubic-bezier(0.6, 0, 0, 1)`;
    });
    const draw = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { paths.forEach((p, i) => { p.style.strokeDashoffset = String(-i * seg); }); draw.disconnect(); } });
    }, { root: scroller, threshold: 0.3 });
    draw.observe(watchEl);
  }
  // the page's own engine sets its state after this module runs, so read it once the document is ready

  // v10: no thread behind the members' cards

  // Footer input and animated color bands are mounted by CounselFooter.

  // Hunter, 2026-09-10, yxzhs592: V13's connected visual journey replaces the chat player.
  const journeyScript = document.createElement('script');
  journeyScript.src = '/designs/counsel/home-src/counsel-care-journey-v13.js';
  document.body.appendChild(journeyScript);

  // Hunter, 2026-09-10: V13-only keyboard/focus guard for the shared mobile
  // menu. Closed links cannot receive focus; an open menu owns focus until closed.
  function bindPhoneMenu() {
    const sheet=document.querySelector('.cn-mobile'),nav=document.querySelector('nav'),stage=document.getElementById('stage');
    if(!sheet||!nav||sheet.dataset.v13Focus)return !!sheet;
    sheet.dataset.v13Focus='true';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-label','Counsel navigation');sheet.setAttribute('aria-modal','true');
    let wasOpen=false,wasInert=false;
    const focus=el=>{el?.focus({preventScroll:true});el?.dispatchEvent(new FocusEvent('focus'));};
    const sync=()=>{
      const open=sheet.getAttribute('aria-hidden')==='false';
      sheet.inert=!open;
      if(open&&!wasOpen){wasInert=stage.inert;stage.inert=true;focus(sheet.querySelector('.cn-mclose'));}
      if(!open&&wasOpen){stage.inert=wasInert;focus(nav.querySelector('.cn-burger'));}
      wasOpen=open;
    };
    sheet.addEventListener('keydown',e=>{
      if(e.key!=='Tab')return;
      const items=[...sheet.querySelectorAll('button,a[href],summary')].filter(el=>el.getClientRects().length&&!el.closest('details:not([open]) .cn-mlist'));
      const first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();focus(last);}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();focus(first);}
    });
    new MutationObserver(sync).observe(sheet,{attributes:true,attributeFilter:['aria-hidden']});sync();return true;
  }
  if(!bindPhoneMenu()){
    const menuReady=new MutationObserver(()=>{if(bindPhoneMenu())menuReady.disconnect();});
    menuReady.observe(document.body,{childList:true});
  }

  window.CounselFAQComponent.mount(document.querySelector('.ch-faq-list'));

  /* the marquee's motion: a slow drift (the loop dial is one pass), held
     under the cursor, and dragged by hand with a little run-on when let go
     (Hunter, 2026-09-09); the pictures ride inside their cards as they cross */
  (function () {
    const mq = document.querySelector('.ch-marquee');
    if (!mq) return;
    const track = mq.querySelector('.ch-marquee-track');
    const st = { x: 0, v: 0, half: 0, drag: false, px: 0, pt: 0, hover: false, live: false, raf: 0, last: 0 };
    const measure = () => { st.half = track.scrollWidth / 2; };
    measure();
    window.addEventListener('resize', measure);
    const speed = () => st.half / (((window.CounselHome && window.CounselHome.marquee.loop) || 135) * 1000);
    const frames = () => [...track.querySelectorAll('.ch-frame img')];
    function parallax() {
      const vw = innerWidth;
      frames().forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.right < -200 || r.left > vw + 200) return;
        const c = (r.left + r.width / 2 - vw / 2) / vw;   // -0.5 at the left edge, 0.5 at the right
        img.style.setProperty('--px', (c * r.width * 0.28).toFixed(1) + 'px');
      });
    }
    function tick(now) {
      const dt = st.last ? Math.min(now - st.last, 80) : 16;
      st.last = now;
      if (!st.drag) {
        if (!st.hover) st.x += speed() * dt;
        st.x += st.v * dt;
        st.v *= Math.exp(-dt / 700);
      }
      if (st.half > 0) st.x = ((st.x % st.half) + st.half) % st.half;
      track.style.transform = `translateX(${(-st.x).toFixed(2)}px)`;
      parallax();
      st.raf = st.live ? requestAnimationFrame(tick) : 0;
      if (!st.live) st.last = 0;
    }
    const seen = new IntersectionObserver((entries) => { entries.forEach((e) => { st.live = e.isIntersecting; if (st.live && !st.raf) { st.last = 0; measure(); st.raf = requestAnimationFrame(tick); } }); }, { root: scroller, threshold: 0 });
    seen.observe(mq);
    mq.addEventListener('pointerenter', () => { st.hover = true; });
    mq.addEventListener('pointerleave', () => { st.hover = false; });
    mq.addEventListener('pointerdown', (e) => { st.drag = true; st.px = e.clientX; st.pt = performance.now(); st.v = 0; mq.classList.add('dragging'); mq.setPointerCapture(e.pointerId); });
    mq.addEventListener('pointermove', (e) => {
      if (!st.drag) return;
      const now = performance.now(), dx = e.clientX - st.px, dt = Math.max(1, now - st.pt);
      st.x -= dx; st.v = -dx / dt; st.px = e.clientX; st.pt = now;
      if (st.half > 0) st.x = ((st.x % st.half) + st.half) % st.half;
      track.style.transform = `translateX(${(-st.x).toFixed(2)}px)`;
      parallax();
    });
    const drop = () => { if (!st.drag) return; st.drag = false; mq.classList.remove('dragging'); if (Math.abs(st.v) < 0.05) st.v = 0; };
    mq.addEventListener('pointerup', drop);
    mq.addEventListener('pointercancel', drop);
    // a rebuild from the dials re-measures
    const mo = new MutationObserver(() => setTimeout(measure, 50));
    mo.observe(track, { childList: true });
  })();

  /* the buttons hover with the shared thread sweep when the page has it */
  Promise.all([import('/shared/buttons/thread-sweep.js'),import('../ui-src/counsel-button-motion.js')]).then(([m,{counselButtonSweep}]) => {
    // The care module binds its own button when loaded, avoiding duplicate sweeps.
    document.querySelectorAll('.ch-btn:not(.ch-btn--ghost):not(.cj-add-doctor)').forEach((b) => {
      if(b.closest('.counsel-footer'))return;
      const light = b.classList.contains('ch-btn--light');
      m.attachThreadSweep(b, counselButtonSweep({light}));
    });
  }).catch(() => {});

  // the card radius: the page's dial sets --card-r on the root; the footer's ring re-coils to the field's new corner
  function setCardRadius(px) { document.documentElement.style.setProperty('--card-r', px + 'px'); window.dispatchEvent(new Event('resize')); }
  window.CounselHome = { FAQ, THREAD, setMarquee, marquee, setCardRadius };
})();
