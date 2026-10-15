/* Card Studio V3 motion. Both initializers are exported verbatim with a card
   (Function.toString), so each must stay self-contained: window globals
   only, no imports, no helpers outside the function body. Bento graphics
   play once when they come into view (.9s settles, card-settle) and then
   rest on their final frame, which is also what reduced motion shows; V2's
   marquee and results drift are the only loops, and they pause offscreen,
   on hidden tabs and on hover. The tool itself has no smooth scrolling. */

/** Phone cards: Card Studio V1's motion, plus its on-screen-at-load fix. */
export function initCardMotion(root, { enabled = true, scroller } = {}) {
  const { gsap, ScrollTrigger, CustomEase } = window;
  if (!gsap || !ScrollTrigger || !CustomEase || !root) return () => {};
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('card-settle', '.2,.7,.2,1');
  const media = gsap.matchMedia();
  media.add({ reduce: '(prefers-reduced-motion: reduce)', standard: '(prefers-reduced-motion: no-preference)' }, context => {
    if (context.conditions.reduce || !enabled) return;
    const find = selector => [...root.querySelectorAll(selector)];
    const card = root.querySelector('.cs-art');
    if (!card) return;
    const entrance = gsap.timeline({ paused: true, defaults: { duration: .9, ease: 'card-settle' } });
    entrance.fromTo(card, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0);
    if (find('.cs-content').length) entrance.fromTo(find('.cs-content'), { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, .18);
    if (find('.cs-actions,.cs-action-row').length) entrance.fromTo(find('.cs-actions,.cs-action-row'), { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, .36);
    if (find('.cs-chart i').length) entrance.fromTo(find('.cs-chart i'), { scaleY: .15 }, { scaleY: 1, duration: .85, stagger: .08 }, .35);
    const dots = find('.cs-grid i');
    const pulse = dots.length ? gsap.fromTo(dots, { opacity: .35 }, { opacity: 1, duration: 1.4, stagger: .1, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true }) : null;
    let trigger;
    // A card already on screen at load gets no toggle, so refreshes and a
    // direct viewport check start it too (found in Card Studio V2's embed test).
    const sync = () => {
      const active = !document.hidden && (!!trigger?.isActive || (!scroller && ScrollTrigger.isInViewport(root)));
      entrance.paused(!active);
      pulse?.paused(!active);
    };
    trigger = ScrollTrigger.create({ trigger: root, ...(scroller ? { scroller } : {}), start: 'top bottom', end: 'bottom top', onToggle: sync, onRefresh: sync });
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { document.removeEventListener('visibilitychange', sync); trigger.kill(); entrance.kill(); pulse?.kill(); };
  }, root);
  return () => media.revert();
}

/** Bento graphics: each tells its story once as it comes into view, then rests on the static frame. */
export function initBentoMotion(root, { enabled = true, scroller } = {}) {
  // White label (Javi, Oct 13: "I can't click into these"): the brands are
  // buttons. Picking one rebrands the app at once, with or without motion,
  // and the intro's own swaps stop for good.
  const brandButtons = root ? [...root.querySelectorAll('.cb-brands button')] : [];
  brandButtons.forEach((button, i) => button.addEventListener('click', () => {
    const card = root.querySelector('.cb'), name = card.querySelector('.cb-phone-name'), mark = card.querySelector('.cb-phone-brand .cb-mark');
    card.dataset.picked = 'true';
    if (name) { name.textContent = button.querySelector('span').textContent; name.style.opacity = ''; name.style.transform = ''; }
    if (mark) { mark.innerHTML = button.querySelector('.cb-mark').innerHTML; mark.style.opacity = ''; mark.style.transform = ''; }
    brandButtons.forEach((other, k) => { other.classList.toggle('is-on', k === i); other.setAttribute('aria-pressed', String(k === i)); });
  }));
  const { gsap, ScrollTrigger, CustomEase } = window;
  if (!gsap || !ScrollTrigger || !CustomEase || !root) return () => {};
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('card-settle', '.2,.7,.2,1');
  const media = gsap.matchMedia();
  media.add({ reduce: '(prefers-reduced-motion: reduce)', standard: '(prefers-reduced-motion: no-preference)' }, context => {
    if (context.conditions.reduce || !enabled) return;
    const art = root.querySelector('.cb');
    if (!art) return;
    const find = selector => [...art.querySelectorAll(selector)];
    const one = selector => art.querySelector(selector);
    const tl = gsap.timeline({ paused: true, defaults: { duration: .9, ease: 'card-settle' } });
    const loops = [], cleanups = [];
    let held = false;
    // Where each element rests (some are dimmed in CSS), so every entrance ends on the static frame.
    const natural = new Map(find('*').map(el => [el, getComputedStyle(el).opacity]));
    const rest = (i, el) => natural.get(el) ?? 1;
    const some = targets => targets && (!Array.isArray(targets) || targets.length);
    const rise = (targets, at, y = 16, stagger = 0) => { if (some(targets)) tl.fromTo(targets, { opacity: 0, y }, { opacity: rest, y: 0, stagger }, at); };
    const fade = (targets, at, duration = .4) => { if (some(targets)) tl.fromTo(targets, { opacity: 0 }, { opacity: rest, duration }, at); };
    // A message lands the way the product's do: up and into place from its corner.
    const land = (bubble, at) => { if (bubble) tl.fromTo(bubble, { opacity: 0, y: 10, scale: .96, transformOrigin: 'right bottom' }, { opacity: 1, y: 0, scale: 1, duration: .6 }, at); };
    // Thinking squares pulse and finish lit.
    const think = (dots, at, pulses = 1) => { if (dots.length) tl.fromTo(dots, { opacity: .2 }, { opacity: 1, duration: .22, stagger: .045, repeat: pulses * 2, yoyo: true, ease: 'sine.inOut' }, at); };
    // Counsel AI answering: its label, a moment of thinking, then the words, one after another.
    const stream = (selector, at) => {
      const box = one(selector);
      if (!box) return;
      fade(box.querySelector('.cb-ai'), at, .3);
      think([...box.querySelectorAll('.cb-grid i')], at + .1);
      const words = [...box.querySelectorAll('.cb-words i')];
      if (words.length) tl.fromTo(words, { opacity: 0, y: 3 }, { opacity: 1, y: 0, duration: .3, stagger: .04, ease: 'power1.out' }, at + .8);
      else rise(box.querySelector('p'), at + .8, 6);
    };
    // A square riding a lane from one end to the other, then gone.
    const ride = (rect, path, at, duration = .8, back = false) => {
      if (!rect || !path) return;
      const length = path.getTotalLength(), state = { t: 0 };
      const place = () => { const p = path.getPointAtLength((back ? 1 - state.t : state.t) * length); rect.setAttribute('x', p.x - 3); rect.setAttribute('y', p.y - 3); };
      tl.fromTo(state, { t: 0 }, { t: 1, duration, ease: 'power1.inOut', onStart: place, onUpdate: place }, at)
        .fromTo(rect, { opacity: 1 }, { opacity: 1, duration: duration - .2 }, at)
        .to(rect, { opacity: 0, duration: .2 }, at + duration - .2);
    };
    const graphics = {
      triage() {
        // The question lands and drops into Counsel AI, which thinks, then routes it:
        // the pathways arrive, Counsel's own fills in the tile's ink and branches.
        const drop = one('.cb-drop'), lead = one('.cb-triage-head .cb-link'), chosen = one('.cb-triage-paths>.is-chosen');
        land(one('.cb-bubble'), 0);
        if (drop) tl.fromTo(drop, { scaleY: 0, transformOrigin: 'center top' }, { scaleY: 1, duration: .4, ease: 'power2.out' }, .5);
        fade(one('.cb-triage-ai'), .75);
        think(find('.cb-triage-ai .cb-grid i'), .85, 2);
        if (lead) tl.fromTo(lead, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: .45, ease: 'power2.out' }, 1.8);
        tl.fromTo(find('.cb-triage-paths>li'), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: .6, stagger: .1 }, 2.05);
        if (chosen) {
          const path = chosen.querySelector('.cb-path'), fill = chosen.querySelector('.cb-fill'), link = chosen.querySelector(':scope>.cb-link'), branches = [...chosen.querySelectorAll('.cb-triage-sub>li')];
          const ink = getComputedStyle(art).color, bg = getComputedStyle(path).color;
          tl.fromTo(fill, { opacity: 0 }, { opacity: 1, duration: .45, ease: 'power2.out' }, 2.75)
            .fromTo(path, { color: ink }, { color: bg, duration: .45, ease: 'power2.out' }, 2.75);
          if (link) tl.fromTo(link, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: .35, ease: 'power2.out' }, 3.1);
          if (branches.length) tl.fromTo(branches, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: .5, stagger: .1 }, 3.3);
        }
      },
      whitelabel() {
        const brands = find('.cb-brand'), name = one('.cb-phone-name'), markEl = one('.cb-phone-brand .cb-mark');
        rise(brands, 0, 8, .1);
        rise(one('.cb-phone'), .2, 28);
        fade(one('.cb-phone-day'), .55);
        land(one('.cb-phone .cb-bubble'), .7);
        stream('.cb-reply', 1.25);
        fade(one('.cb-powered'), 2.6);
        if (brands.length < 2 || !name || !markEl) return;
        // Then the brand swaps: each takes the header in turn while the conversation stays; it ends on the last, the static frame.
        const last = brands.length - 1, labels = brands.map(b => b.querySelector('span').textContent), marks = brands.map(b => b.querySelector('.cb-mark').innerHTML);
        const show = i => { if (art.dataset.picked) return; name.textContent = labels[i]; markEl.innerHTML = marks[i]; brands.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', String(k === i)); }); };
        tl.call(show, [0], 0);
        for (let i = 1; i <= last; i++) {
          const at = 2.9 + (i - 1) * 1.4;
          tl.to([name, markEl], { opacity: 0, y: -4, duration: .22, ease: 'power2.in' }, at)
            .call(show, [i], at + .22)
            .fromTo([name, markEl], { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .4 }, at + .24);
        }
        cleanups.push(() => show(last));
      },
      chat() {
        rise(one('.cb-phone'), 0, 28);
        fade(one('.cb-phone-day'), .4);
        land(one('.cb-phone .cb-bubble'), .55);
        stream('.cb-reply', 1.1);
      },
      brandchat() {
        rise(one('.cb-phone'), 0, 28);
        fade(one('.cb-phone-day'), .4);
        land(one('.cb-phone .cb-bubble'), .55);
        stream('.cb-reply', 1.1);
        fade(one('.cb-powered'), 2.5);
      },
      benefit() {
        rise(one('.cb-phone'), 0, 28);
        fade(one('.cb-phone-day'), .4);
        land(one('.cb-phone .cb-bubble'), .55);
        stream('.cb-reply', 1.1);
        // The partner's offer comes out of the reply, past the phone's edge.
        tl.fromTo(one('.cb-benefit-card'), { opacity: 0, x: -18, y: 8 }, { opacity: 1, x: 0, y: 0, duration: .8 }, 2.55);
      },
      map() {
        const dots = find('.cb-map-dot'), rings = find('.cb-map-ring');
        fade(one('.cb-map-base'), 0, 1);
        // Members switch on west to east, each with a ring; afterwards one lights up now and then.
        if (dots.length) tl.fromTo(dots, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .45, stagger: .03, ease: 'power2.out' }, .4);
        if (rings.length) tl.fromTo(rings, { opacity: .7, scale: 1, transformOrigin: '50% 50%' }, { opacity: 0, scale: 3, duration: 1, stagger: .03, ease: 'power2.out', immediateRender: false }, .45);
        rise(one('.cb-map-label'), 1.3, 8);
        if (rings.length) {
          const later = gsap.timeline({ paused: true, repeat: -1 });
          for (let k = 0; k < 16; k++) later.fromTo(rings[(k * 7 + 3) % rings.length], { opacity: .8, scale: 1, transformOrigin: '50% 50%' }, { opacity: 0, scale: 3.2, duration: 1.4, ease: 'power2.out', immediateRender: false }, k * 1.7);
          loops.push({ after: true, motion: later });
        }
      },
      ehr() {
        const rows = find('.cb-ehr-row:not(.is-new)'), fresh = one('.cb-ehr-row.is-new'), lanes = find('.cb-lane'), riders = find('.cb-rider');
        rise(one('.cb-ehr-record'), 0);
        rise(rows, .25, 6, .1);
        fade(find('.cb-lane,.cb-lane-tip'), .5, .6);
        rise(one('.cb-ehr-thread'), .35);
        land(one('.cb-ehr-thread .cb-bubble'), .7);
        // History out of the record: the medication row lights, and a train of squares carries it across.
        if (rows[0]) tl.fromTo(rows[0], { opacity: 1 }, { opacity: .45, duration: .25, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 1.15);
        riders.slice(0, 3).forEach((r, i) => ride(r, lanes[0], 1.3 + i * .14, .8));
        stream('.cb-ehr-thread .cb-reply', 2.2);
        rise(one('.cb-ehr-sync'), 3.6, 6);
        // The visit rides back, and the record gains today's row.
        riders.slice(3, 6).forEach((r, i) => ride(r, lanes[1], 3.8 + i * .14, .8));
        if (fresh) tl.fromTo(fresh, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: .5 }, 4.55);
      },
      place() {
        // Six kinds of care gather from outside into one frame; then the frame draws around them.
        const items = find('.cb-place-grid li'), columns = getComputedStyle(one('.cb-place-grid')).gridTemplateColumns.split(' ').length, rows = Math.ceil(items.length / columns);
        items.forEach((item, i) => { const col = i % columns, row = Math.floor(i / columns); tl.fromTo(item, { opacity: 0, x: (col - (columns - 1) / 2) * 110, y: (row - (rows - 1) / 2) * 90 }, { opacity: 1, x: 0, y: 0, duration: 1.1 }, .05 + i * .08); });
        fade(one('.cb-place-line'), 1.1, .6);
      },
      insight() {
        const value = one('.cb-app-reading strong'), final = value ? value.textContent : '', columns = find('.cb-app-col');
        rise(find('.cb-app-bar,.cb-app-metric,.cb-app-reading'), 0, 8, .1);
        // The week fills in, square by square, today last and highest, and the reading climbs to today's.
        columns.forEach((column, i) => tl.fromTo(column.querySelectorAll('i'), { opacity: 0 }, { opacity: 1, duration: .25, stagger: .035, ease: 'power1.out' }, .5 + i * .15));
        if (/^\d+$/.test(final.trim())) {
          const state = { v: Number(final) - 8 };
          tl.to(state, { v: Number(final), duration: 1.2, ease: 'power1.inOut', onUpdate: () => { value.textContent = String(Math.round(state.v)); }, onComplete: () => { value.textContent = final; } }, .55);
          cleanups.push(() => { value.textContent = final; });
        }
        rise(one('.cb-app-note'), 1.8, 6);
        // Then Counsel's one row.
        rise(one('.cb-app-action'), 2.2, 16);
        tl.fromTo(one('.cb-app-action>svg'), { x: 0 }, { x: 4, duration: .3, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 3.2);
      },
      data() {
        const lanes = find('.cb-lane'), riders = find('.cb-rider');
        land(one('.cb-data>.cb-bubble'), 0);
        rise(find('.cb-sources li'), .5, 10, .12);
        fade(find('.cb-lane'), .85, .5);
        fade(one('.cb-flow-grid'), .9, .4);
        // Each source sends a square down its lane into the grid, which thinks, then answers.
        riders.forEach((rider, i) => ride(rider, lanes[i], 1.25 + i * .15, .9));
        think(find('.cb-flow-grid .cb-grid i'), 2.3);
        stream('.cb-data .cb-reply', 2.85);
      },
      program() {
        const photo = one('.cb-prog-photo img');
        rise(one('.cb-prog'), 0, 20);
        if (photo) tl.fromTo(photo, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'power2.out' }, .25);
        rise(find('.cb-prog-body>small,.cb-prog-body>b,.cb-prog-body>p'), .5, 8, .1);
        rise(find('.cb-prog-body li'), .95, 6, .1);
        tl.fromTo(one('.cb-prog-tag'), { opacity: 0, scale: .8, transformOrigin: 'left bottom' }, { opacity: 1, scale: 1, duration: .5 }, 1.2);
        rise(one('.cb-prog-btn'), 1.45, 8);
      },
      calendar() {
        const days = find('.cb-cal-days span'), ready = find('.cb-cal-days .is-ready'), launch = one('.cb-cal-days .is-launch');
        const plain = days.find(day => !day.className);
        rise(one('.cb-cal'), 0);
        tl.fromTo(days.filter(day => day !== launch), { opacity: 0 }, { opacity: 1, duration: .3, stagger: .012, ease: 'power1.out' }, .3);
        if (plain && ready.length) tl.fromTo(ready, { backgroundColor: getComputedStyle(plain).backgroundColor }, { backgroundColor: getComputedStyle(ready[0]).backgroundColor, duration: .35, stagger: .05, ease: 'power1.out' }, .75);
        if (launch) tl.fromTo(launch, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .6 }, .85 + ready.length * .05);
        const caption = one('.cb-cal-caption');
        if (caption) tl.fromTo(caption, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .5 }, '>-.2');
      },
      marquee() {
        const rows = one('.cb-marquee-rows');
        rise(find('.cb-marquee-row'), 0, 12);
        find('.cb-marquee-track').forEach((track, i) => loops.push({ motion: gsap.fromTo(track, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: i ? 36 : 42, repeat: -1, ease: 'none', paused: true }) }));
        const hold = value => () => { held = value; sync(); };
        const enter = hold(true), leave = hold(false), out = event => { if (!rows.contains(event.relatedTarget)) leave(); };
        rows.addEventListener('pointerenter', enter); rows.addEventListener('pointerleave', leave);
        rows.addEventListener('focusin', enter); rows.addEventListener('focusout', out);
        cleanups.push(() => { rows.removeEventListener('pointerenter', enter); rows.removeEventListener('pointerleave', leave); rows.removeEventListener('focusin', enter); rows.removeEventListener('focusout', out); });
      },
    };
    let trigger;
    function sync() {
      const active = !document.hidden && (!!trigger?.isActive || (!scroller && ScrollTrigger.isInViewport(root)));
      tl.paused(!active);
      loops.forEach(({ motion, after }) => motion.paused(!active || held || (after && tl.progress() < 1)));
    }
    graphics[art.dataset.graphic]?.();
    tl.eventCallback('onComplete', sync);
    trigger = ScrollTrigger.create({ trigger: root, ...(scroller ? { scroller } : {}), start: 'top bottom', end: 'bottom top', onToggle: sync, onRefresh: sync });
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      document.removeEventListener('visibilitychange', sync);
      cleanups.forEach(fn => fn());
      trigger.kill(); tl.kill(); loops.forEach(({ motion }) => motion.kill());
    };
  }, root);
  return () => media.revert();
}
