/* Counsel navigation. One module, every prototype.

   <script src="/src/nav-src/counsel-nav.js"></script>

   It finds the page's own <nav> (the logo, the .links row, the .actions)
   and adds the menu to it: rest the cursor on a parent that carries a
   chevron and a full-bleed sheet drops from the top of the page with that
   parent's links, each parent in its own colour (Hunter, 2026-09-04, from
   Denny's D/Navigation comp). Iterate HERE and every prototype picks it up.

   The page keeps styling the row (its colours, its ground). This module
   owns the ghost pill behind the hovered parent, the chevron turn, the
   sheet and everything in it, and the row's ink while a sheet is open.

   Dials from a page: CounselNav.set({ colors, dropMs, linkSize, topPad,
   bottomPad, ghost }). The defaults below are the baked values. */
(function () {
  if (window.CounselNav) return;

  /* The information architecture, launch scope (content/ia-september-29.md).
     Headers are not pages. Title case follows Denny's comp. */
  const IA = [
    {
      label: 'Individuals',
      color: '#E1F2FA',   // Blue 1
      columns: [
        { title: 'Conditions', split: 2, links: [
          'Weight Management', 'Birth Control', 'Hair Loss', 'Anti-Aging Skincare',
          'Acne', 'Herpes', 'Hypertension', 'Hyperlipidemia',
        ] },
      ],
      // the right-hand side is a lifestyle photo with the text inside it
      // (Hunter, 2026-09-04): one line, a verb, no subcopy. The photos are
      // the brand deck's set in brand/photography (web copies).
      card: { image: '/brand/photography/web/counsel-11-hiker-with-phone.webp', chip: 'Membership', chipColor: '#BBD6EA', title: 'Find a doctor that fits your life' },
    },
    {
      label: 'Enterprise',
      color: '#D6E9D1',   // the comp's green, between Green 1 and Green 2
      columns: [
        { title: 'Who we serve', links: ['Health Plans', 'Health Systems', 'Consumer Health', 'Employers'] },
        { title: 'Solutions', links: ['Counsel Studio'] },
      ],
      card: { image: '/brand/photography/web/counsel-04-man-blood-pressure-cuff.webp', chip: 'Enterprise', chipColor: '#9ADB8F', title: 'See Counsel in action' },
    },
    {
      label: 'Resources',
      color: '#FDF0C9',   // Yellow, lifted
      columns: [
        { title: 'Resources', links: ['Blog', 'Enterprise Resources', 'Newsroom'] },
      ],
      // a sparse sheet carries two cards, not one (Hunter, 2026-09-08)
      cards: [
        { image: '/brand/photography/web/counsel-15-woman-reading-letter.webp', chip: 'Featured', chipColor: '#FADA78', title: 'Read the AI Report' },
        { image: '/brand/photography/web/counsel-12-man-sofa-phone.webp', chip: 'Blog', chipColor: '#BBD6EA', title: 'See what a Counsel visit looks like' },
      ],
    },
    {
      label: 'Company',
      color: '#FFDDE5',   // Pink, lifted
      columns: [
        { title: 'Company', links: ['About Us', 'Clinical Leadership', 'Careers'] },
        { title: 'Get in touch', links: ['Contact Us'] },
      ],
      cards: [
        { image: '/brand/photography/web/counsel-14-potter-at-wheel.webp', chip: 'About', chipColor: '#FF93AD', title: 'Why we built Counsel' },
        { image: '/brand/photography/web/counsel-09-cyclist.webp', chip: 'Careers', chipColor: '#9ADB8F', title: 'Come build the modern era of care' },
      ],
    },
  ];

  const INK = '#132045';
  const NAVY_FILTER = 'brightness(0) saturate(100%) invert(11%) sepia(29%) saturate(2934%) hue-rotate(203deg) brightness(93%) contrast(97%)';

  const CSS = `
nav { --cn-drop: 520ms; --cn-lift: 360ms; --cn-size: 26px; --cn-top: 170px; --cn-bottom: 48px; --cn-ink: ${INK}; }
nav > .logo, nav > .links, nav > .actions { position: relative; z-index: 2; }
/* the row's ink flips to navy while a sheet is open: every sheet is light */
nav.cn-open, nav.cn-open .links a, nav.cn-open .actions a { color: var(--cn-ink); transition: color 260ms ease; }
nav.cn-open .logo img { filter: ${NAVY_FILTER}; }
/* the primary button reads its ground: every sheet is light, so while one
   is open it is navy on white whatever the page had it as; the page's own
   colours come back when the sheet lifts (Hunter, 2026-09-04) */
nav .demo-btn { transition: background 260ms ease, color 260ms ease, transform 0.15s ease; }
nav.cn-open .demo-btn { background: ${INK}; color: #fff; }
/* Sign in hovers like the parents: the ghost's own colour, and the ghost's
   open colour while a sheet is open, so it never reads more muted */
nav .actions a { transition: background 220ms ease, color 260ms ease; }
nav .actions a:hover { background: var(--cn-ghost, rgba(187, 214, 234, 0.6)); }
nav.cn-open .actions a:hover { background: rgba(255, 255, 255, 0.5); }
nav .links { position: relative; }
nav .links a { position: relative; z-index: 1; }
nav .links a svg { transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1); }
nav .links a.cn-on svg { transform: rotate(180deg); }
/* one ghost for the whole row: it slides to whichever parent the cursor is
   on and resizes to fit. The first appearance snaps; every move is a tween */
nav .cn-ghost {
  position: absolute; top: 0; left: 0; height: 40px; width: 0;
  border-radius: 10px;
  background: var(--cn-ghost, rgba(187, 214, 234, 0.6));
  opacity: 0; pointer-events: none;
  transition: transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1), width 380ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 180ms ease, background 300ms ease;
}
nav.cn-open .cn-ghost { background: rgba(255, 255, 255, 0.5); }
/* the sheet: full bleed, behind the row, a curtain that drops from the top */
nav .cn-sheet {
  position: absolute; top: 0; left: 0; right: 0;
  z-index: 1;
  height: 0; overflow: hidden;
  background: var(--cn-color, #E1F2FA);
  color: var(--cn-ink);
  transition: height var(--cn-drop) cubic-bezier(0.2, 0.8, 0.2, 1), background 380ms ease;
  pointer-events: none;
}
nav.cn-open .cn-sheet { pointer-events: auto; }
nav.cn-closing .cn-sheet { transition-duration: var(--cn-lift), 380ms; transition-timing-function: cubic-bezier(0.6, 0, 0.3, 1), ease; }
nav .cn-body {
  position: absolute; top: 0; left: 0; right: 0;
  padding: var(--cn-top) 34px var(--cn-bottom);
  display: flex; align-items: flex-start; gap: 32px;
  /* where a body waits: from the top on the first open (the default), from
     the side when moving along the row (set by script, Hunter, 2026-09-04:
     the site's motif is horizontal, so the tween between parents is too) */
  --bx: 0px; --by: -14px; --lx: 0px; --ly: 10px;
  opacity: 0; transform: translate(var(--bx), var(--by));
  pointer-events: none;
  transition: opacity 200ms ease, transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
nav .cn-body.on { opacity: 1; transform: none; pointer-events: auto; transition-delay: 40ms; }
nav .cn-body.cn-out { transition: opacity 220ms ease, transform 420ms cubic-bezier(0.4, 0, 0.2, 1); }
nav .cn-body.cn-snap, nav .cn-body.cn-snap * { transition: none !important; }
nav .cn-col { flex: 0 1 calc(400px * var(--cn-split, 1) + 32px * (var(--cn-split, 1) - 1)); min-width: 220px; }
nav .cn-col h4 {
  margin: 0 0 6px; font-family: var(--body-font, 'GT America', system-ui, sans-serif);
  font-size: 14px; font-weight: 400; letter-spacing: -0.01em; color: var(--cn-ink); opacity: 0.8;
}
nav .cn-col ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(var(--cn-split, 1), 1fr); column-gap: 24px; }
nav .cn-col li a {
  display: flex; align-items: center; justify-content: flex-start; gap: 12px;
  height: auto; padding: 0; border-radius: 0; background: none;
  font-family: var(--body-font, 'GT America', system-ui, sans-serif);
  font-size: var(--cn-size); line-height: 1.65; font-weight: 400; letter-spacing: -0.03em;
  color: var(--cn-ink); text-decoration: none; white-space: nowrap;
  opacity: 0; transform: translate(var(--lx), var(--ly));
  transition: opacity 260ms ease, transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1), color 200ms ease;
}
nav .cn-body.on .cn-col li a { opacity: 1; transform: none; transition-delay: calc(60ms + var(--i, 0) * 32ms); }
/* leaving, the items stagger too, first item first */
nav .cn-body.cn-out .cn-col li a, nav .cn-body.cn-out .cn-card { transition-delay: calc(var(--i, 0) * 18ms); }
/* hover: the label steps right, the arrow arrives, and the other links in
   the list step back; no colour change, so it reads the same on every sheet */
nav .cn-col li a span { display: inline-block; transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1); }
nav .cn-col li a:hover { background: none; }
nav .cn-col li a:hover span { transform: translateX(4px); }
/* the mute covers the whole sheet: every other link, in every list, and the
   card too; hovering the card mutes the links (Hunter, 2026-09-04) */
nav .cn-body.on:has(li a:hover) li a:not(:hover) { opacity: 0.45; }
nav .cn-body.on:has(li a:hover) .cn-card { opacity: 0.6; }
nav .cn-body.on:has(.cn-card:hover) li a { opacity: 0.45; }
nav .cn-body.on:has(.cn-card:hover) .cn-card:not(:hover) { opacity: 0.6; }
/* the arrow only shows on hover, sliding in from the left (Hunter, 2026-09-04) */
nav .cn-col li a svg { flex: none; width: 22px; height: 22px; display: block; opacity: 0; transform: translateX(-8px); transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease; }
nav .cn-col li a:hover svg { opacity: 1; transform: none; }
/* the photo card: a lifestyle image with the text inside it, pushed to the
   sheet's right edge; the picture eases in a touch on hover */
nav .cn-cards { display: flex; gap: 20px; margin-left: auto; flex: 0 1 440px; min-width: 300px; }
nav .cn-cards.cn-two { flex-basis: 820px; }   /* two cards side by side on the sparse sheets (Hunter, 2026-09-08) */
nav .cn-cards.cn-two .cn-card { flex: 1 1 0; min-width: 0; }
nav .cn-cards.cn-two .cn-card-text b { font-size: calc(var(--cn-size) * 0.85); }
nav .cn-card {
  position: relative; display: block; flex: 1 1 auto; min-width: 0; max-width: 100%; aspect-ratio: 22 / 15;
  height: auto; padding: 0;   /* the page styles every nav a as a 40px pill; this is not one */
  border-radius: 16px; overflow: hidden;
  color: #fff; text-decoration: none; background: #132045;
  opacity: 0; transform: translate(var(--lx), var(--ly));
  transition: opacity 260ms ease, transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
nav .cn-body.on .cn-card { opacity: 1; transform: none; transition-delay: calc(60ms + var(--i, 0) * 32ms); }
nav .cn-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1); }
nav .cn-card:hover img { transform: scale(1.05); }
/* a neutral scrim, never a coloured one: the photo's own tones stay true */
nav .cn-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 32%, rgba(0, 0, 0, 0.62) 100%); transition: opacity 400ms ease; }
nav .cn-card::before { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 32%, rgba(0, 0, 0, 0.22) 100%); opacity: 0; transition: opacity 400ms ease; }
nav .cn-card:hover::before { opacity: 1; }
/* the chip: the same coloured chip the hero's cards wear, top left */
nav .cn-card-chip { position: absolute; top: 16px; left: 16px; z-index: 2; font-family: var(--body-font, 'GT America', system-ui, sans-serif); font-size: 12.5px; font-weight: 500; letter-spacing: 0; padding: 4px 9px; border-radius: 7px; color: #132045; background: var(--cn-chip, #BBD6EA); }
nav .cn-card-text { position: absolute; left: 24px; right: 24px; bottom: 22px; z-index: 2; display: grid; gap: 4px; font-family: var(--body-font, 'GT America', system-ui, sans-serif); letter-spacing: -0.02em; transform: translateY(0); transition: transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1); }
nav .cn-card:hover .cn-card-text { transform: translateY(-4px); }
nav .cn-card-text b { display: flex; align-items: center; gap: 10px; font-size: var(--cn-size); line-height: 1.2; font-weight: 400; letter-spacing: -0.03em; }
nav .cn-card-text b svg { flex: none; width: 22px; height: 22px; opacity: 0; transform: translateX(-8px); transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease; }
nav .cn-card:hover .cn-card-text b svg { opacity: 1; transform: none; }
@media (max-width: 1180px) { nav .cn-cards.cn-two { flex-basis: 620px; } }
@media (max-width: 900px) { nav .cn-body { flex-wrap: wrap; row-gap: 28px; } nav .cn-col { flex-basis: 100%; } nav .cn-cards { margin-left: 0; } nav { --cn-size: 22px; --cn-top: 120px; } }
/* scrolled past the hero, the row comes back on any scroll up, fixed to
   the top on a light glass ground with navy ink (the sheets are light, so
   the ink flips the way it does for them), and slips away again on the
   next scroll down; back inside the hero it returns to its place there
   (Hunter, 2026-09-08). The row moves to the body while it is fixed: inside
   the hero it would stack under the sections that follow */
nav.cn-fixed { position: fixed; top: 0; left: 0; right: 0; z-index: 80; background: rgba(248, 249, 244, 0.94); -webkit-backdrop-filter: blur(16px) saturate(1.2); backdrop-filter: blur(16px) saturate(1.2); color: var(--cn-ink); transform: translateY(-100%); transition: transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1); }
nav.cn-fixed.cn-shown { transform: none; }
nav.cn-fixed, nav.cn-fixed .links a, nav.cn-fixed .actions a, nav.cn-fixed .cn-burger { color: var(--cn-ink); }
nav.cn-fixed .logo img { filter: ${NAVY_FILTER}; }
nav.cn-fixed .demo-btn { background: ${INK}; color: #fff; }
nav.cn-fixed .cn-ghost { background: rgba(187, 214, 234, 0.6); }
/* the phone (Hunter, 2026-09-08: the nav fully responsive). The row keeps
   the wordmark and the primary button; a burger opens a sheet that drops
   from the top like the desktop one, each parent an accordion of its links,
   Sign in and the button at the foot. The row's ink flips to navy on the
   light sheet the way it does on desktop */
nav .cn-burger { display: none; }
.cn-mobile { display: none; }
@media (max-width: 900px) {
  nav { gap: 16px; }
  nav > .logo { margin-right: auto; }
  nav .cn-burger {
    display: inline-grid; place-items: center; position: relative; z-index: 2;
    width: 40px; height: 40px; padding: 0; border: 0; border-radius: 10px;
    background: transparent; color: inherit; cursor: pointer;
  }
  nav .cn-burger i { position: absolute; left: 11px; right: 11px; height: 2px; border-radius: 1px; background: currentColor; transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease; }
  nav .cn-burger i:nth-child(1) { transform: translateY(-5px); }
  nav .cn-burger i:nth-child(3) { transform: translateY(5px); }
  nav.cn-mopen .cn-burger i:nth-child(1) { transform: rotate(45deg); }
  nav.cn-mopen .cn-burger i:nth-child(2) { opacity: 0; }
  nav.cn-mopen .cn-burger i:nth-child(3) { transform: rotate(-45deg); }
  /* the sheet sits on the body, above every section (inside the hero it
     would stack under the sections that follow), so it carries its own bar */
  .cn-mobile {
    --cn-ink: ${INK};   /* on the body, outside the nav, so it carries its own ink */
    display: block; position: fixed; inset: 0; z-index: 60;
    background: #F8F9F4; color: ${INK};
    padding: 0 22px 36px; overflow: auto; -webkit-overflow-scrolling: touch;
    transform: translateY(-100%); pointer-events: none;
    transition: transform var(--cn-drop) cubic-bezier(0.2, 0.8, 0.2, 1);
    font-family: var(--body-font, 'GT America', system-ui, sans-serif);
  }
  body.cn-mopen .cn-mobile { transform: none; pointer-events: auto; }
  nav.cn-mopen, nav.cn-mopen .actions a, nav.cn-mopen .cn-burger { color: var(--cn-ink); }
  nav.cn-mopen .logo img { filter: ${NAVY_FILTER}; }
  nav.cn-mopen .demo-btn { background: ${INK}; color: #fff; }
  .cn-mobile .cn-mbar { display: flex; align-items: center; justify-content: space-between; height: 76px; margin-bottom: 8px; }
  .cn-mobile .cn-mbar img { display: block; height: 30px; width: auto; filter: ${NAVY_FILTER}; }
  .cn-mobile .cn-mclose { display: grid; place-items: center; width: 40px; height: 40px; margin-right: -8px; border: 0; border-radius: 10px; background: transparent; color: var(--cn-ink); cursor: pointer; }
  .cn-mobile .cn-mclose svg { width: 20px; height: 20px; }
  .cn-mobile details { border-top: 1px solid rgba(19, 32, 69, 0.14); }
  .cn-mobile details:last-of-type { border-bottom: 1px solid rgba(19, 32, 69, 0.14); }
  .cn-mobile summary { list-style: none; display: flex; align-items: center; justify-content: space-between; padding: 18px 2px; font-size: 24px; letter-spacing: -0.03em; cursor: pointer; }
  .cn-mobile summary::-webkit-details-marker { display: none; }
  .cn-mobile summary svg { width: 18px; height: 18px; transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1); }
  .cn-mobile details[open] summary svg { transform: rotate(180deg); }
  .cn-mobile .cn-mlist { padding: 0 2px 18px; display: grid; gap: 4px; }
  .cn-mobile .cn-mlist h4 { margin: 10px 0 4px; font-size: 13px; font-weight: 500; letter-spacing: 0; opacity: 0.55; }   /* sentence case: no caps (Hunter, 2026-09-08) */
  .cn-mobile .cn-mlist h4:first-child { margin-top: 0; }
  .cn-mobile .cn-mlist a { display: block; height: auto; padding: 6px 0; border-radius: 0; background: none; font-size: 18px; letter-spacing: -0.02em; color: var(--cn-ink); text-decoration: none; opacity: 0.85; }
  .cn-mobile .cn-mcard { display: block; position: relative; margin: 8px 0 18px; aspect-ratio: 22 / 13; border-radius: 14px; overflow: hidden; color: #fff; text-decoration: none; background: #132045; }
  .cn-mobile .cn-mcard img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; }
  .cn-mobile .cn-mcard::after { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.6)); }
  .cn-mobile .cn-mcard b { position: absolute; left: 16px; right: 16px; bottom: 14px; z-index: 2; color: #fff; font-weight: 400; font-size: 18px; letter-spacing: -0.02em; }
  .cn-mobile .cn-mfoot { display: grid; gap: 12px; padding-top: 24px; }
  .cn-mobile .cn-mfoot a, .cn-mobile .cn-mfoot button { display: flex; align-items: center; justify-content: center; height: 48px; border-radius: 12px; font: inherit; font-size: 16px; font-weight: 500; text-decoration: none; cursor: pointer; }
  .cn-mobile .cn-mfoot .cn-mdemo { background: ${INK}; color: #fff; border: 0; }
  .cn-mobile .cn-mfoot .cn-msign { color: var(--cn-ink); background: transparent; box-shadow: inset 0 0 0 1.5px currentColor; }
  /* the desktop sheet never opens on the phone */
  nav .cn-sheet, nav .cn-ghost { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  nav .cn-sheet, nav .cn-body, nav .cn-col li a, nav .cn-card, nav .cn-card img, nav .cn-ghost, nav .links a svg { transition-duration: 1ms !important; transition-delay: 0ms !important; }
}`;

  const ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const state = { nav: null, links: [], bodies: [], sheet: null, ghost: null, active: -1, ghostOn: false, timer: 0, closeTimer: 0, opts: {} };

  function build() {
    const nav = document.querySelector('nav');
    if (!nav || nav.querySelector('.cn-sheet')) return false;
    const linksEl = nav.querySelector('.links');
    if (!linksEl) return false;
    state.nav = nav;
    const style = document.createElement('style');
    style.id = 'counsel-nav-css';
    style.textContent = CSS;
    document.head.appendChild(style);

    // the parents: the page's own links, matched by label; a link without
    // a menu stays a plain link
    const anchors = [...linksEl.querySelectorAll('a')];
    state.links = IA.map((menu) => anchors.find((a) => a.textContent.trim().startsWith(menu.label)) || null);

    const ghost = document.createElement('span');
    ghost.className = 'cn-ghost';
    linksEl.prepend(ghost);
    state.ghost = ghost;

    const sheet = document.createElement('div');
    sheet.className = 'cn-sheet';
    sheet.setAttribute('aria-hidden', 'true');
    state.bodies = IA.map((menu, i) => {
      const body = document.createElement('div');
      body.className = 'cn-body';
      let n = 0;
      for (const col of menu.columns) {
        const c = document.createElement('div');
        c.className = 'cn-col';
        if (col.split) c.style.setProperty('--cn-split', String(col.split));
        const h = document.createElement('h4');
        h.textContent = col.title;
        c.appendChild(h);
        const ul = document.createElement('ul');
        for (const item of col.links) {
          const link = typeof item === 'string' ? { label: item } : item;
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.href || '#';
          a.style.setProperty('--i', String(n++));
          a.innerHTML = `<span>${link.label}</span>${ARROW}`;
          li.appendChild(a);
          ul.appendChild(li);
        }
        c.appendChild(ul);
        body.appendChild(c);
      }
      const cards = menu.cards || (menu.card ? [menu.card] : []);
      if (cards.length) {
        const wrap = document.createElement('div');
        wrap.className = 'cn-cards';
        if (cards.length > 1) wrap.classList.add('cn-two');
        for (const k of cards) {
          const a = document.createElement('a');
          a.className = 'cn-card';
          a.href = k.href || '#';
          a.style.setProperty('--i', String(n++));
          if (k.chipColor) a.style.setProperty('--cn-chip', k.chipColor);
          a.innerHTML = `<img src="${k.image}" alt=""><span class="cn-card-chip">${k.chip}</span><div class="cn-card-text"><b>${k.title}${ARROW}</b></div>`;
          wrap.appendChild(a);
        }
        body.appendChild(wrap);
      }
      sheet.appendChild(body);
      const a = state.links[i];
      if (a) { a.setAttribute('aria-haspopup', 'true'); a.setAttribute('aria-expanded', 'false'); }
      return body;
    });
    nav.insertBefore(sheet, nav.firstChild);
    state.sheet = sheet;
    buildMobile(nav);
    wire();
    watchScroll(nav);
    return true;
  }

  /* the row comes back on any scroll up once the hero has gone */
  function watchScroll(nav) {
    if(document.body.dataset.motionEngine==='gsap')return;
    const stage = document.getElementById('stage');
    const scroller = stage || window;
    const home = { parent: nav.parentNode, next: nav.nextSibling };
    let last = 0, fixed = false, ticking = false;
    const y = () => (stage ? stage.scrollTop : window.scrollY);
    const fix = () => { if (fixed) return; fixed = true; document.body.appendChild(nav); nav.classList.add('cn-fixed'); void nav.offsetWidth; };
    const unfix = () => { if (!fixed) return; fixed = false; nav.classList.remove('cn-fixed', 'cn-shown'); close(); home.parent.insertBefore(nav, home.next); };
    const step = () => {
      ticking = false;
      const now = y();
      const gone = now > nav.offsetHeight + 40;   // the row itself has scrolled out of view
      if (!gone) { unfix(); last = now; return; }
      fix();
      if (now < last - 2) nav.classList.add('cn-shown');
      else if (now > last + 2) { nav.classList.remove('cn-shown'); close(); }
      last = now;
    };
    scroller.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(step); } }, { passive: true });
  }

  const CHEV = '<svg viewBox="0 0 18 18" fill="none" aria-hidden><path d="M4 7l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function buildMobile(nav) {
    const burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'cn-burger';
    burger.setAttribute('aria-label', 'Menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<i></i><i></i><i></i>';
    nav.appendChild(burger);
    const sheet = document.createElement('div');
    sheet.className = 'cn-mobile';
    sheet.setAttribute('aria-hidden', 'true');
    const logo = nav.querySelector('.logo img');
    sheet.innerHTML = `<div class="cn-mbar">${logo ? `<img src="${logo.getAttribute('src')}" alt="Counsel">` : '<span></span>'}<button type="button" class="cn-mclose" aria-label="Close menu"><svg viewBox="0 0 20 20" fill="none" aria-hidden><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button></div>` + IA.map((menu) => {
      const cards = menu.cards || (menu.card ? [menu.card] : []);
      const first = cards[0];
      return `<details><summary>${menu.label}${CHEV}</summary><div class="cn-mlist">${menu.columns.map((c) => `<h4>${c.title}</h4>${c.links.map((l) => `<a href="${(typeof l === 'string' ? '#' : l.href) || '#'}">${typeof l === 'string' ? l : l.label}</a>`).join('')}`).join('')}${first ? `<a class="cn-mcard" href="${first.href || '#'}"><img src="${first.image}" alt=""><b>${first.title}</b></a>` : ''}</div></details>`;
    }).join('') + `<div class="cn-mfoot"><button type="button" class="cn-mdemo">Request a Demo</button><a class="cn-msign" href="#">Sign in</a></div>`;
    document.body.appendChild(sheet);
    state.mobile = sheet;
    const toggle = (on) => {
      nav.classList.toggle('cn-mopen', on);
      document.body.classList.toggle('cn-mopen', on);
      burger.setAttribute('aria-expanded', on ? 'true' : 'false');
      sheet.setAttribute('aria-hidden', on ? 'false' : 'true');
      const stage = document.getElementById('stage');
      if (stage) stage.style.overflow = on ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!nav.classList.contains('cn-mopen')));
    // one parent open at a time
    const ds = [...sheet.querySelectorAll('details')];
    ds.forEach((d) => d.addEventListener('toggle', () => { if (d.open) ds.forEach((o) => { if (o !== d) o.open = false; }); }));
    sheet.querySelector('.cn-mclose').addEventListener('click', () => toggle(false));
    sheet.querySelector('.cn-mdemo').addEventListener('click', () => { toggle(false); const b = nav.querySelector('.demo-btn'); if (b) b.click(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900 && nav.classList.contains('cn-mopen')) toggle(false); });
  }

  function ghostTo(a) {
    if(window.CounselNavMotion)return window.CounselNavMotion.ghost(a);
    const g = state.ghost;
    const x = a.offsetLeft, w = a.offsetWidth;
    if (!state.ghostOn) {
      g.style.transition = 'none';
      g.style.transform = `translateX(${x}px)`;
      g.style.width = w + 'px';
      void g.offsetWidth;
      g.style.transition = '';
      state.ghostOn = true;
    } else {
      g.style.transform = `translateX(${x}px)`;
      g.style.width = w + 'px';
    }
    g.style.opacity = '1';
  }
  function ghostOff() { if(window.CounselNavMotion)return window.CounselNavMotion.ghost(null);state.ghost.style.opacity = '0'; state.ghostOn = false; }

  function open(i) {
    const { nav, sheet, bodies, links } = state;
    if (!nav) return;
    clearTimeout(state.closeTimer);
    const prev = state.active;
    state.active = i;
    nav.classList.remove('cn-closing');
    nav.classList.add('cn-open');
    const colors = state.opts.colors || IA.map((m) => m.color);
    sheet.style.setProperty('--cn-color', colors[i] || IA[i].color);
    // moving along the row: the old body leaves the way you are going and
    // the new one comes in from the far side, items staggered; the first
    // open keeps its drop from the top
    const dir = prev >= 0 && prev !== i ? (i > prev ? 1 : -1) : 0;
    bodies.forEach((b, j) => {
      if (j === i) {
        clearTimeout(b._out);
        b.classList.remove('cn-out');
        if (dir) placeBody(b, 56 * dir, 32 * dir); else placeBody(b, null);
        b.classList.add('on');
      } else if (b.classList.contains('on')) {
        if (dir) { b.style.setProperty('--bx', -56 * dir + 'px'); b.style.setProperty('--by', '0px'); b.style.setProperty('--lx', -32 * dir + 'px'); b.style.setProperty('--ly', '0px'); }
        b.classList.remove('on');
        b.classList.add('cn-out');
        clearTimeout(b._out);
        if(!window.CounselNavMotion)b._out = setTimeout(() => { b.classList.remove('cn-out'); placeBody(b, null); }, 700);
      }
    });
    sheet.style.height = bodies[i].offsetHeight + 'px';
    sheet.setAttribute('aria-hidden', 'false');
    links.forEach((a, j) => { if (!a) return; a.classList.toggle('cn-on', j === i); a.setAttribute('aria-expanded', j === i ? 'true' : 'false'); });
    if (links[i]) ghostTo(links[i]);
    window.CounselNavMotion?.open(i,prev,dir);
  }

  // park a body off to one side (px, with its items part way) with no
  // transition, so the tween starts from there; null restores the default,
  // the drop from the top
  function placeBody(b, bx, lx) {
    b.classList.add('cn-snap');
    if (bx == null) { for (const k of ['--bx', '--by', '--lx', '--ly']) b.style.removeProperty(k); }
    else { b.style.setProperty('--bx', bx + 'px'); b.style.setProperty('--by', '0px'); b.style.setProperty('--lx', lx + 'px'); b.style.setProperty('--ly', '0px'); }
    void b.offsetWidth;
    b.classList.remove('cn-snap');
  }

  function close() {
    const { nav, sheet, bodies, links } = state;
    if (!nav || state.active < 0) return;
    state.active = -1;
    nav.classList.add('cn-closing');
    nav.classList.remove('cn-open');
    sheet.style.height = '0px';
    sheet.setAttribute('aria-hidden', 'true');
    bodies.forEach((b) => { b.classList.remove('on'); b.classList.remove('cn-out'); clearTimeout(b._out); placeBody(b, null); });
    links.forEach((a) => { if (!a) return; a.classList.remove('cn-on'); a.setAttribute('aria-expanded', 'false'); });
    ghostOff();
    window.CounselNavMotion?.close();
  }

  function wire() {
    const { nav, links, sheet } = state;
    const linksEl = nav.querySelector('.links');
    links.forEach((a, i) => {
      if (!a) return;
      a.addEventListener('pointerenter', () => {
        clearTimeout(state.timer); clearTimeout(state.closeTimer);
        ghostTo(a);
        // a beat of intent before the first open; instant along the row
        state.timer = setTimeout(() => open(i), state.active < 0 ? 110 : 0);
      });
      a.addEventListener('click', (e) => {
        if (a.getAttribute('href') === '#') e.preventDefault();
        if (state.active === i) close(); else open(i);
      });
    });
    // a plain link in the row (no menu) closes whatever is open
    [...linksEl.querySelectorAll('a')].forEach((a) => {
      if (links.includes(a)) return;
      a.addEventListener('pointerenter', () => { clearTimeout(state.timer); ghostTo(a); close(); });
    });
    linksEl.addEventListener('pointerleave', () => { clearTimeout(state.timer); if (state.active < 0) ghostOff(); });
    nav.addEventListener('pointerleave', () => {
      clearTimeout(state.timer);
      state.closeTimer = setTimeout(close, 160);
    });
    nav.addEventListener('pointerenter', () => clearTimeout(state.closeTimer));
    sheet.addEventListener('pointerenter', () => clearTimeout(state.closeTimer));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (state.active >= 0) state.sheet.style.height = state.bodies[state.active].offsetHeight + 'px'; });
  }

  /* dials from a page; anything omitted keeps the baked value */
  function set(opts) {
    Object.assign(state.opts, opts || {});
    const nav = state.nav;
    if (!nav) return;
    const o = state.opts;
    if (o.dropMs != null) nav.style.setProperty('--cn-drop', o.dropMs + 'ms');
    if (o.liftMs != null) nav.style.setProperty('--cn-lift', o.liftMs + 'ms');
    if (o.linkSize != null) nav.style.setProperty('--cn-size', o.linkSize + 'px');
    if (o.topPad != null) nav.style.setProperty('--cn-top', o.topPad + 'px');
    if (o.bottomPad != null) nav.style.setProperty('--cn-bottom', o.bottomPad + 'px');
    if (o.ghost) nav.style.setProperty('--cn-ghost', o.ghost);
    if (state.active >= 0) {
      const colors = o.colors || IA.map((m) => m.color);
      state.sheet.style.setProperty('--cn-color', colors[state.active]);
      state.sheet.style.height = state.bodies[state.active].offsetHeight + 'px';
    }
  }

  window.CounselNav = { IA, open, close, set, state };
  if (!build()) document.addEventListener('DOMContentLoaded', build);
})();
