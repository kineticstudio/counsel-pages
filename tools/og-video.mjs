#!/usr/bin/env node
/**
 * Renders the Open Graph video and its still for a page whose hero moves:
 *
 *   og/<name>.mp4   1200x630, H.264, a seamless loop of the hero's motion
 *   og/<name>.png   1200x630, one frame of the same loop (the og:image fallback)
 *
 *   npm run og                    every page below
 *   npm run og -- counsel-studio  one page
 *   npm run og -- --still         stills only (to check the framing)
 *
 * The page plays on a clock this script turns (requestAnimationFrame,
 * performance.now and Date.now), 60 ticks a second, so every frame is exact
 * and nothing is dropped. The hero's data cards pick their spots with
 * Math.random; after the intro the script feeds it a short repeating list, so
 * the cards come round to the same places and the clip loops without a jump.
 * Needs the fonts in fonts/ (see the README) and ffmpeg on PATH.
 */
import {spawn} from 'node:child_process';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {serve} from './server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'og');
const W = 1200, H = 630, SCALE = 2, HZ = 60, FPS = 30;

const PAGES = {
  'counsel-studio': {
    page: '/embeds/counsel-studio/preview.html',
    // The hero fills the card: no stand-in nav, the copy centred in 630px and
    // the phone just below the frame, so the data cards have both sides.
    css: '.nav{display:none!important}.hero{padding-top:0!important}.hero-copy{min-height:630px!important;padding:0 5%!important}',
    warm: 8,           // seconds of motion before the takes start
    // The data cards: a new one every 2.7s, four in a round (tools/embed-src/hero.js).
    cards: {step: 2.7, round: 4, settle: 6, random: [.13, .58, .87, .34]},
    still: 0.62,       // where in the loop the still is taken (0 to 1)
  },
};

const CLOCK = `(() => {
  let now = 0, id = 0, queue = new Map();
  const d0 = Date.now();
  window.requestAnimationFrame = cb => (queue.set(++id, cb), id);
  window.cancelAnimationFrame = n => queue.delete(n);
  performance.now = () => now;
  Date.now = () => d0 + now;
  let seed = 20261028, list = null, at = 0;
  const lcg = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  Math.random = () => list ? list[at++ % list.length] : lcg();
  window.__og = {
    tick(ms) {
      now += ms;
      const due = [...queue.values()];
      queue = new Map();
      for (const cb of due) { try { cb(now); } catch (e) { console.error(e); } }
    },
    repeat(values) { list = values; at = 0; },
    cards() {
      return [...document.querySelectorAll('.r17-card')]
        .map((c, i) => ({i, on: c.style.visibility === 'visible', at: c.style.transform.replace(/-?\\d+\\.\\d+/g, m => (+m).toFixed(1))}))
        .filter(c => c.on).map(({i, at}) => ({i, at}));
    },
  };
})();`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(browser, url, spec) {
  const page = await browser.newPage({viewport: {width: W, height: H}, deviceScaleFactor: SCALE});
  await page.addInitScript(CLOCK);
  // The framing CSS goes into the page itself, so the embeds measure the final layout as they mount.
  await page.route(url, async route => {
    const res = await route.fetch();
    route.fulfill({response: res, body: (await res.text()).replace('</head>', `<style>${spec.css || ''}</style></head>`)});
  });
  await page.goto(url, {waitUntil: 'load'});
  await page.evaluate(() => document.fonts.ready);
  await sleep(600); // GSAP from the CDN, then the embeds mount
  await page.evaluate(() => dispatchEvent(new Event('resize'))); // canvases refit after the fonts
  return page;
}

const tick = (page, n = 1) => page.evaluate(([n, ms]) => { for (let i = 0; i < n; i++) window.__og.tick(ms); }, [n, 1000 / HZ]);

function encode(file) {
  const args = ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-vf', `scale=${W}:${H}:flags=lanczos,format=yuv420p`,
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'veryslow', '-crf', '22', '-tune', 'animation',
    '-movflags', '+faststart', '-an', file];
  const ff = spawn('ffmpeg', args, {stdio: ['pipe', 'ignore', 'pipe']});
  let err = '';
  ff.stderr.on('data', d => { err += d; });
  const done = new Promise((resolve, reject) => ff.on('close', (code, signal) => code && !signal ? reject(new Error(err.slice(-2000))) : resolve()));
  return {
    write: buf => new Promise(r => ff.stdin.write(buf) ? r() : ff.stdin.once('drain', r)),
    end: () => (ff.stdin.end(), done),
    abort: () => (ff.stdin.destroy(), ff.kill('SIGKILL'), done.then(() => fs.rm(file, {force: true}))),
  };
}

const same = (a, b) => a.i === b.i && a.at === b.at && a.prev === b.prev;

async function render(browser, base, name, spec, stillOnly) {
  const page = await open(browser, base + spec.page, spec);
  await tick(page, HZ * spec.warm);
  const mp4 = path.join(OUT, `${name}.mp4`), png = path.join(OUT, `${name}.png`), part = path.join(OUT, `.${name}.part.mp4`);
  const every = HZ / FPS;
  const {round, step, settle} = spec.cards;
  const length = Math.round(step * HZ) * round; // ticks in one loop
  const stillAt = Math.round(length / every * spec.still);
  await page.evaluate(v => window.__og.repeat(v), spec.cards.random);

  // A take starts as a card appears and must run a whole round of cards, each
  // one step after the last, ending as the first card appears in the same spot
  // beside the same neighbour. Anything else and it starts over.
  let shown = [], spawns = 0, take = null, frames = 0;
  for (let t = 0; t < HZ * 300; t++) {
    await tick(page);
    const now = await page.evaluate(() => window.__og.cards());
    const fresh = now.find(c => !shown.some(s => s.i === c.i));
    if (fresh) {
      const event = {t, i: fresh.i, at: fresh.at, prev: now.filter(c => c !== fresh).map(c => c.i + c.at).join()};
      spawns++;
      if (take) {
        const gap = t - take.last;
        if (gap !== Math.round(step * HZ)) { await take.out?.abort(); take = null; }
        else if (t - take.start === length) {
          if (same(event, take.first)) break;
          await take.out?.abort(); take = null;
        } else take.last = t;
      }
      if (!take && spawns > settle) take = {start: t, last: t, first: event, out: stillOnly ? null : encode(part), still: false};
    }
    shown = now;
    if (take && (t - take.start) % every === 0) {
      const f = (t - take.start) / every;
      if (take.out || f === stillAt) {
        const shot = await page.screenshot({type: 'png'});
        if (take.out) await take.out.write(shot);
        if (f === stillAt) { await sharpStill(shot, png); take.still = true; }
      }
      if (stillOnly && take.still) break;
      frames = f + 1;
    }
  }
  if (!take) throw new Error(`${name}: no clean loop in 300s`);
  if (take.out) { await take.out.end(); await fs.rename(part, mp4); }
  await page.close();
  console.log(`${name}: ${(length / HZ).toFixed(2)}s loop, ${frames} frames${take.out ? `, ${path.relative(ROOT, mp4)}` : ''}, ${path.relative(ROOT, png)}`);
}

// The still: the 2x frame scaled down to 1200x630 with the same filter as the video.
async function sharpStill(buf, file) {
  await new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-y', '-f', 'png_pipe', '-i', '-', '-vf', `scale=${W}:${H}:flags=lanczos`, '-frames:v', '1', file], {stdio: ['pipe', 'ignore', 'pipe']});
    ff.on('close', code => code ? reject(new Error('still failed')) : resolve());
    ff.stdin.end(buf);
  });
}

const args = process.argv.slice(2);
const stillOnly = args.includes('--still');
const names = args.filter(a => !a.startsWith('--'));
await fs.mkdir(OUT, {recursive: true});
const {server, url} = await serve([['/', ROOT]], 0);
const browser = await chromium.launch();
try {
  for (const name of names.length ? names : Object.keys(PAGES)) {
    if (!PAGES[name]) throw new Error(`unknown page: ${name}`);
    await render(browser, url, name, PAGES[name], stillOnly);
  }
} finally {
  await browser.close();
  server.close();
}
