/* ============================================================
   THREAD SWEEP — the studio's button hover, in one place.

   Extracted from the Counsel thread-button prototype so every surface runs
   the SAME interaction: the design files import it, StyledBtn (wireframes +
   Design system sheet) imports it, and the prototype is the dial surface
   for it. Change the interaction here and every button follows.

   The interaction, on hover:
   - the corner radius eases out to a full pill
   - color blocks sweep in from the left as ONE train, butted edge to
     edge like thread segments (the base never shows between them); the
     last block glides to a stop and settles as the button's color
   - a 24px circle with a 12px arrow slides in fully formed from beyond
     the button's left edge, widening the button; it never changes shape
     (arrow: false switches it off — the icon variant already IS an arrow)
   Leaving eases everything back to rest. Click replays the sweep.

   Usage:
     const h = attachThreadSweep(el, {
       pass: ['#BBD6EA', '#47AFFF', '#455E97'],  // ride colors, in order
       settle: '#018150',                        // where the sweep lands
       blocks: null,       // total blocks; omitted = one per ride color + settle
       duration: 600,      // one block's travel time, ms
       stagger: 220,       // ms between blocks entering
       arrow: true,        // the hover arrow; circle/ink colors below
       arrowCircle: '#F8F9F4',
       arrowInk: '#1C3A69',
       arrowMs: 600,       // arrow slide-in ms; null = the full color ride
       radiusMs: 600,      // corner radius easing ms
       radius: true,       // false keeps the host's own corners (a pill that is already a pill, a chip)
     });
     h.update({...}); h.sweep(); h.reset(); h.detach();

   The host element needs nothing special. The engine handles position,
   overflow, and stacking itself; the color train rides below the content
   on a negative z-index, so the label never needs its own stacking
   rules.
   ============================================================ */

const CSS = `
.ts-host {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition: border-radius var(--ts-radius-ms, 0.35s) ease, transform 0.15s ease, padding 0.3s ease;
}
.ts-host.ts-live {
  transition: border-radius var(--ts-radius-ms, 0.35s) ease, transform 0.15s ease, padding var(--ts-arrow-ms, 0.3s) ease;
}
/* Two parts: the SPACER makes room in the layout (width 0 -> 24, pushing
   the label), and the DISC is the circle itself — fixed 24px, never
   reshaped, only translated in from beyond the button's left edge, where
   the host's own overflow clips it out of view. */
.ts-host .ts-arrow {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  flex: none;
  width: 0;
  height: 24px;
  margin-right: 0;
  pointer-events: none;
  transition: width 0.3s ease, margin 0.3s ease;
}
.ts-host .ts-arrow-disc {
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-48px);
  transition: transform 0.3s ease;
}
.ts-host.ts-live .ts-arrow {
  width: 24px;
  margin-right: 10px;
  /* the slide-in lasts as long as the arrow dial says; the way out (the
     base rules above) stays quick */
  transition-duration: var(--ts-arrow-ms, 0.3s);
}
.ts-host.ts-live .ts-arrow-disc {
  transform: translateX(0);
  transition-duration: var(--ts-arrow-ms, 0.3s);
}
.ts-host .ts-train {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  z-index: -1;
  display: flex;
  will-change: transform;
  pointer-events: none;
}
.ts-host .ts-train > div { height: 100%; }
`;

function injectCss(doc) {
  if (doc.querySelector("style[data-thread-sweep]")) return;
  const style = doc.createElement("style");
  style.setAttribute("data-thread-sweep", "");
  style.textContent = CSS;
  doc.head.appendChild(style);
}

/* dark colors carry white text, light colors carry ink — the same rule the
   wireframe renderer uses on its bands */
export function inkFor(hex, dark = "#132045", light = "#ffffff") {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.45 ? dark : light;
}

/* Hunter's arrow (arrow1.svg): 12px, round caps, ink via currentColor. */
const ARROW_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 6L9.5 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 2.5L9.5 6L6 9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function attachThreadSweep(el, opts = {}) {
  const o = { blocks: null, duration: 600, stagger: 220, pass: [], settle: "#018150",
    arrow: true, arrowCircle: "#F8F9F4", arrowInk: "#1C3A69", arrowMs: 600, radiusMs: 600, radius: true };
  const apply = (next) => {
    for (const k of Object.keys(next)) if (next[k] !== undefined) o[k] = next[k];
  };
  apply(opts);

  const doc = el.ownerDocument;
  const win = doc.defaultView;
  injectCss(doc);
  el.classList.add("ts-host");

  // The hover arrow lives in the DOM from the start (width 0 at rest) so
  // its growth is a pure CSS transition riding the ts-live class.
  let arrowEl = null;
  function syncArrow() {
    if (o.arrow && !arrowEl) {
      arrowEl = doc.createElement("span");
      arrowEl.className = "ts-arrow";
      arrowEl.setAttribute("aria-hidden", "true");
      const disc = doc.createElement("span");
      disc.className = "ts-arrow-disc";
      disc.innerHTML = ARROW_SVG;
      arrowEl.appendChild(disc);
      // it leads the button: first child, sliding in from the left edge
      el.insertBefore(arrowEl, el.firstChild);
    }
    if (!o.arrow && arrowEl) { arrowEl.remove(); arrowEl = null; }
    if (arrowEl) {
      const disc = arrowEl.firstElementChild;
      disc.style.background = o.arrowCircle;
      disc.style.color = o.arrowInk;
      // by default the arrow rides the whole sweep, arriving with the
      // settle; arrowMs overrides. The radius easing is dialable too.
      const n = Math.max(1, Math.round(o.blocks ?? o.pass.length + 1));
      el.style.setProperty("--ts-arrow-ms", (o.arrowMs ?? (n - 1) * o.stagger + o.duration) + "ms");
    }
    el.style.setProperty("--ts-radius-ms", (o.radiusMs ?? 600) + "ms");
  }
  syncArrow();

  // What the consumer had set inline, so reset() restores it exactly. The
  // React consumer (StyledBtn) sets background/color inline; the design
  // files set them in CSS and these are just empty strings. Either works.
  const prior = { background: el.style.background, color: el.style.color };

  const still = () => win.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The resting inline padding-left, remembered per hover: while the
  // arrow is in, the button's left inset shrinks to match the circle's
  // top and bottom gap, so the circle sits optically centered in the cap.
  let restPadding = null;

  // The resting inline radius, remembered per hover so reset() can put it
  // back. The pill target is the element's real half-height — animating to
  // an arbitrary big value (999px) renders as a snap, because everything
  // past the clamp looks identical and the whole visible change squeezes
  // into the first few milliseconds of the transition.
  let restRadius = null;

  function clearSweep() {
    for (const s of el.querySelectorAll(":scope > .ts-train")) s.remove();
  }

  function settleOn(color) {
    // snap, don't transition: the settle stripe already shows this color, so
    // the base has to match instantly when the stripes are removed
    el.style.transition = "none";
    el.style.background = color;
    el.style.color = inkFor(color);
    void el.offsetWidth;
    el.style.transition = "";
    clearSweep();
  }

  function sweep() {
    clearSweep();
    if (still()) { settleOn(o.settle); return; }

    // ease out to a true pill for the whole hover; reset() eases it back
    if (!el.classList.contains("ts-live")) {
      restRadius = el.style.borderRadius;
      if (arrowEl) {
        restPadding = el.style.paddingLeft;
        el.style.paddingLeft = Math.max((el.offsetHeight - 24) / 2, 0) + "px";
      }
      el.classList.add("ts-live");
      if (o.radius !== false) el.style.borderRadius = el.offsetHeight / 2 + "px";
    }

    // one block per ride color, then the settle — the color list is the
    // single truth for how many ride. `blocks` overrides (cycling when
    // there are more blocks than colors).
    const n = Math.max(1, Math.round(o.blocks ?? o.pass.length + 1));
    const seq = [];
    // pass-through colors ride in order, cycling if there are more blocks
    // than colors, so the sweep always reads as one progression
    for (let i = 0; i < n - 1; i++) seq.push(o.pass[i % Math.max(1, o.pass.length)] ?? o.settle);
    seq.push(o.settle);

    // One continuous train, each block exactly one button wide, so the
    // colors butt against each other and the base never shows between
    // them. The first pass color rides at the train's right end (it
    // enters first); the settle block is leftmost and glides to a stop
    // exactly over the button.
    const train = doc.createElement("div");
    train.className = "ts-train";
    train.style.width = n * 100 + "%";
    for (let i = seq.length - 1; i >= 0; i--) {
      const s = doc.createElement("div");
      s.style.background = seq[i];
      s.style.width = 100 / n + "%";
      train.appendChild(s);
    }
    // duration and stagger together still set the ride's total time, the
    // same clock the staggered version kept
    const total = (n - 1) * o.stagger + o.duration;
    train.style.transform = "translateX(-100%)";
    train.style.transition = `transform ${total}ms cubic-bezier(0.22, 0.61, 0.2, 1)`;
    train.addEventListener("transitionend", () => settleOn(o.settle), { once: true });
    el.appendChild(train);
    void train.offsetWidth;
    train.style.transform = "translateX(0)";
  }

  function reset() {
    clearSweep();
    el.classList.remove("ts-live");
    if (restRadius !== null) {
      el.style.borderRadius = restRadius;
      restRadius = null;
    }
    if (restPadding !== null) {
      el.style.paddingLeft = restPadding;
      restPadding = null;
    }
    el.style.background = prior.background;
    el.style.color = prior.color;
  }

  el.addEventListener("pointerenter", sweep);
  el.addEventListener("pointerleave", reset);
  el.addEventListener("click", sweep);

  return {
    sweep,
    reset,
    update(next) { apply(next); syncArrow(); },
    detach() {
      reset();
      if (arrowEl) { arrowEl.remove(); arrowEl = null; }
      el.classList.remove("ts-host");
      el.removeEventListener("pointerenter", sweep);
      el.removeEventListener("pointerleave", reset);
      el.removeEventListener("click", sweep);
    },
  };
}
