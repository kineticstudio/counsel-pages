#!/usr/bin/env node
/**
 * Rebuilds this repo from Kinetic Creative Studio's Counsel folder: the eight
 * condition pages (conditions/) and Counsel Studio (studio/). Kinetic
 * runs it after every design change, then commits, so each change to the
 * pages arrives here as a readable diff. Nothing in it is needed for the
 * Webflow build.
 *
 *   STUDIO=/path/to/kinetic-creative-studio npm run sync
 *
 * 1. Serves the Studio's Counsel files at the URLs the pages are written
 *    against: /designs/counsel/, /brand/counsel/, /fonts/counsel/, /shared/.
 * 2. Opens each page in headless Chromium twice. Once in full, scrolled top to
 *    bottom, to record every file it loads. Once with ?render-only and the nav
 *    script held back, to capture the markup before any script adds to it.
 * 3. Copies only those files here, with the Studio's URLs rewritten to this
 *    repo's (/src/, /brand/, /fonts/, /shared/), and writes each page with its
 *    markup in place, so the page script only mounts behaviour on top.
 * 4. Serves the result and loads every page at desktop and phone widths. A
 *    missing file, a script error or a doubled section fails the sync.
 */
import {promises as fs} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import * as prettier from 'prettier';
import {serve} from './server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STUDIO = path.resolve(process.env.STUDIO || path.join(os.homedir(), 'Documents/Codex/2026-09-21/cou/kinetic-creative-studio'));
const CLIENT = path.join(STUDIO, 'clients/counsel');
const SHARE = 'https://counsel.kineticstudio.com';
const SHOTS = process.env.SHOTS || path.join(os.tmpdir(), 'counsel-pages-check');

// Studio URL prefix, where the Studio keeps those files, their folder here.
const MOUNTS = [
  ['/designs/counsel/', path.join(CLIENT, 'designs'), 'src'],
  ['/brand/counsel/', path.join(CLIENT, 'brand'), 'brand'],
  ['/fonts/counsel/', path.join(CLIENT, 'brand/fonts'), 'fonts'],
  ['/shared/', path.join(STUDIO, 'shared'), 'shared'],
  ['/prototypes/counsel/', path.join(CLIENT, 'prototypes'), 'prototypes'],
];
// Studio page, slug here, name.
const PAGES = [
  ['Weight-Management-V3.html', 'weight-management', 'Weight management'],
  ['Birth-Control-V3.html', 'birth-control', 'Birth control'],
  ['Hair-Loss-V3.html', 'hair-loss', 'Hair loss'],
  ['Acne-V3.html', 'acne', 'Acne'],
  ['Anti-Aging-V3.html', 'anti-aging', 'Anti-aging'],
  ['Herpes-V3.html', 'herpes', 'Herpes'],
  ['Cold-Sores-V3.html', 'cold-sores', 'Cold sores'],
  ['Genital-Herpes-V3.html', 'genital-herpes', 'Genital herpes'],
];
const studioPage = file => `/designs/counsel/03-conditions/${file}`;
// Other pages, written to studio/: Studio path, slug here, name, the element
// that shows the page has rendered.
const OTHER = [
  ['/designs/counsel/05-counsel-studio/Counsel-Studio-V20.html', 'counsel-studio', 'Counsel Studio', '#main .r14-site'],
];
const TEXT = /\.(html|js|mjs|css)$/i;
// Literal asset paths inside copied code, for files only some states load.
const ASSET = /(?<![\w.])\/(?:(?:designs|brand|fonts)\/counsel|shared)\/[\w\-/.%@]+?\.(?:css|js|mjs|json|svg|png|jpe?g|webp|avif|gif|woff2?|otf|ttf|mp4|webm)(?![\w])/g;

// Studio URLs to this repo's. Condition pages point at their copies here,
// other Studio pages at the review share, everything else at its folder here.
function rewrite(text) {
  for (const [file, slug] of PAGES) text = text.split(studioPage(file)).join(`/conditions/${slug}.html`);
  for (const [file, slug] of OTHER) text = text.split(file).join(`/studio/${slug}.html`);
  text = text.replace(/(['"`])\/\?project=counsel/g, `$1${SHARE}/?project=counsel`);
  text = text.replace(/(?<![\w.])\/designs\/counsel\/([\w\-/%]+\.html)/g, `${SHARE}/designs/counsel/$1`);
  for (const [prefix, , out] of MOUNTS) text = text.replace(new RegExp(`(?<![\\w.])${prefix.replaceAll('/', '\\/')}`, 'g'), `/${out}/`);
  return text;
}
function locate(url) {
  const mount = MOUNTS.find(([prefix]) => url.startsWith(prefix));
  if (!mount) return null;
  const [prefix, dir, out] = mount, rest = url.slice(prefix.length);
  return {source: path.join(dir, rest), target: path.join(ROOT, out, rest)};
}
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const stage = document.querySelector('#stage') || document.scrollingElement;
    for (let y = 0; y < stage.scrollHeight; y += 480) { stage.scrollTop = y; await new Promise(r => setTimeout(r, 70)); }
    stage.scrollTop = 0;
  });
  await page.waitForLoadState('networkidle');
}

async function capture(browser, base) {
  const files = new Set(), markup = new Map();
  const record = request => { const u = new URL(request.url()); if (u.origin === base) files.add(decodeURIComponent(u.pathname)); };
  for (const [file, slug] of PAGES) {
    const url = base + studioPage(file);
    const full = await browser.newPage({viewport: {width: 1440, height: 900}});
    full.on('requestfinished', record);
    await full.goto(url, {waitUntil: 'networkidle'});
    await scrollThrough(full);
    await full.close();
    const bare = await browser.newPage({viewport: {width: 1440, height: 900}});
    await bare.route('**/nav-src/counsel-nav.js', route => route.abort());
    bare.on('requestfinished', record);
    await bare.goto(`${url}?render-only`, {waitUntil: 'networkidle'});
    await bare.waitForSelector('#main > section');
    // Lazy images below the fold may never load during capture; take them from the markup.
    for (const src of await bare.evaluate(() => [...document.querySelectorAll('img[src]')].map(img => new URL(img.getAttribute('src'), location.href).href))) record({url: () => src});
    markup.set(slug, await bare.content());
    await bare.close();
  }
  for (const [file, slug, , ready] of OTHER) {
    const full = await browser.newPage({viewport: {width: 1440, height: 900}});
    full.on('requestfinished', record);
    await full.goto(base + file, {waitUntil: 'networkidle'});
    await scrollThrough(full);
    await full.close();
    const bare = await browser.newPage({viewport: {width: 1440, height: 900}});
    await bare.route('**/nav-src/counsel-nav.js', route => route.abort());
    bare.on('requestfinished', record);
    await bare.goto(`${base}${file}?render-only`, {waitUntil: 'networkidle'});
    await bare.waitForSelector(ready);
    for (const src of await bare.evaluate(() => [...document.querySelectorAll('img[src]')].map(img => new URL(img.getAttribute('src'), location.href).href))) record({url: () => src});
    markup.set(`studio/${slug}`, await bare.content());
    await bare.close();
  }
  return {files, markup};
}

// Add files that code names literally but this load never fetched.
async function scan(files) {
  const missing = [];
  for (let queue = [...files]; queue.length;) {
    const url = queue.pop(), where = locate(url);
    if (!where || !TEXT.test(url) || url.endsWith('.html')) continue;
    let text;
    try { text = await fs.readFile(where.source, 'utf8'); } catch { continue; }
    for (const found of text.match(ASSET) || []) {
      if (files.has(found)) continue;
      try { await fs.access(locate(found).source); files.add(found); queue.push(found); } catch { missing.push(`${found} (named in ${url})`); }
    }
  }
  return missing;
}

async function write(files, markup) {
  for (const [, , out] of MOUNTS) await fs.rm(path.join(ROOT, out), {recursive: true, force: true});
  await fs.rm(path.join(ROOT, 'conditions'), {recursive: true, force: true});
  await fs.rm(path.join(ROOT, 'studio'), {recursive: true, force: true});
  const copied = [];
  for (const url of [...files].sort()) {
    const where = locate(url);
    if (!where || url.endsWith('.html')) continue;
    try { await fs.access(where.source); } catch { continue; }
    await fs.mkdir(path.dirname(where.target), {recursive: true});
    if (TEXT.test(url)) await fs.writeFile(where.target, rewrite(await fs.readFile(where.source, 'utf8')));
    else await fs.copyFile(where.source, where.target);
    copied.push(url);
  }
  await fs.mkdir(path.join(ROOT, 'conditions'), {recursive: true});
  for (const [file, slug] of PAGES) {
    const note = `<!-- Generated by tools/sync-from-studio.mjs from the Studio's 03-conditions/${file}. The markup is written in (data-prerendered); src/conditions-v3-src/condition-v3.js only mounts behaviour on it. -->`;
    const html = rewrite(markup.get(slug)).replace(/^<!DOCTYPE html>/i, `<!doctype html>\n${note}`).replace('<body ', '<body data-prerendered ');
    await fs.writeFile(path.join(ROOT, 'conditions', `${slug}.html`), await prettier.format(html, {parser: 'html', printWidth: 120}));
  }
  await fs.mkdir(path.join(ROOT, 'studio'), {recursive: true});
  for (const [file, slug] of OTHER) {
    const note = `<!-- Generated by tools/sync-from-studio.mjs from the Studio's ${file.replace('/designs/counsel/', '')}. The markup is written in for reading; src/studio-src/studio-v14.js writes the same markup again and mounts the motion. -->`;
    const html = rewrite(markup.get(`studio/${slug}`)).replace(/^<!DOCTYPE html>/i, `<!doctype html>\n${note}`);
    await fs.writeFile(path.join(ROOT, 'studio', `${slug}.html`), await prettier.format(html, {parser: 'html', printWidth: 120}));
  }
  const list = [...PAGES.map(([, slug, name]) => `      <li><a href="/conditions/${slug}.html">${name}</a></li>`), ...OTHER.map(([, slug, name]) => `      <li><a href="/studio/${slug}.html">${name}</a></li>`)].join('\n');
  await fs.writeFile(path.join(ROOT, 'index.html'), `<!doctype html>
<!-- Generated by tools/sync-from-studio.mjs. -->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Counsel pages</title>
    <link rel="stylesheet" href="/fonts/fonts.css" />
    <style>
      body { margin: 0; padding: 64px 24px; background: #f8f8f6; color: #132045; font: 17px/1.5 "GT America", system-ui, sans-serif; }
      main { max-width: 640px; margin: 0 auto; }
      h1 { margin: 0 0 8px; font: 300 44px/1.1 "Cooper Light", Georgia, serif; letter-spacing: -0.02em; }
      p { margin: 0 0 32px; color: #4b5577; }
      ul { margin: 0; padding: 0; list-style: none; border-top: 1px solid #dcdcd8; }
      li a { display: block; padding: 14px 0; border-bottom: 1px solid #dcdcd8; color: inherit; text-decoration: none; }
      li a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <main>
      <h1>Counsel pages</h1>
      <p>Coded reference for the Webflow build. See README.md for how the pages are put together.</p>
      <ul>
${list}
      </ul>
    </main>
  </body>
</html>
`);
  return copied;
}

async function verify(browser) {
  const {server, url: base} = await serve([['/', ROOT]]);
  const problems = [];
  await fs.mkdir(SHOTS, {recursive: true});
  for (const [, slug] of PAGES) {
    for (const [label, viewport] of [['desktop', {width: 1440, height: 900}], ['phone', {width: 390, height: 844}]]) {
      const page = await browser.newPage({viewport});
      const say = text => problems.push(`${slug} (${label}): ${text}`);
      page.on('response', response => { const u = new URL(response.url()); if (u.origin === base && response.status() >= 400 && u.pathname !== '/favicon.ico') say(`${response.status()} ${u.pathname}`); });
      page.on('pageerror', error => say(error.message));
      page.on('console', message => { if (message.type() === 'error' && !/favicon|Failed to load resource/.test(message.text())) say(message.text()); });
      await page.goto(`${base}/conditions/${slug}.html`, {waitUntil: 'networkidle'});
      await page.waitForTimeout(2600); // the hero's intro: person, camera pull, line draw
      await page.screenshot({path: path.join(SHOTS, `${slug}-${label}-1-hero.png`)});
      await scrollThrough(page);
      const state = await page.evaluate(() => ({
        pricing: document.querySelectorAll('#main .cv3-pricing').length,
        nav: !!document.querySelector('.cn-mobile'),
        wide: [...document.querySelectorAll('.condition-hero-copy *, .cv3-pricing *, .cv3-treatments *')].filter(el => { const r = el.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); }).length,
      }));
      if (state.pricing !== 1) say(`expected one pricing section, found ${state.pricing}`);
      if (!state.nav) say('the navigation did not mount');
      if (state.wide) say(`${state.wide} elements overflow the viewport`);
      for (const [n, selector] of [[2, '.cv3-pricing'], [3, '.cv3-treatments']]) {
        await page.evaluate(selector => { const stage = document.querySelector('#stage'); stage.scrollTop += document.querySelector(selector).getBoundingClientRect().top - 24; }, selector);
        await page.waitForTimeout(1600);
        await page.screenshot({path: path.join(SHOTS, `${slug}-${label}-${n}-${selector.slice(5)}.png`)});
      }
      await page.close();
    }
  }
  for (const [, slug] of OTHER) {
    for (const [label, viewport] of [['desktop', {width: 1440, height: 900}], ['phone', {width: 390, height: 844}]]) {
      const page = await browser.newPage({viewport});
      const say = text => problems.push(`studio/${slug} (${label}): ${text}`);
      page.on('response', response => { const u = new URL(response.url()); if (u.origin === base && response.status() >= 400 && u.pathname !== '/favicon.ico') say(`${response.status()} ${u.pathname}`); });
      page.on('pageerror', error => say(error.message));
      page.on('console', message => { if (message.type() === 'error' && !/favicon|Failed to load resource/.test(message.text())) say(message.text()); });
      await page.goto(`${base}/studio/${slug}.html`, {waitUntil: 'networkidle'});
      await page.waitForTimeout(3000); // the dots build, then the phone rises
      await page.screenshot({path: path.join(SHOTS, `${slug}-${label}-1-hero.png`)});
      await scrollThrough(page);
      const state = await page.evaluate(() => ({
        sites: document.querySelectorAll('#main .r14-site').length,
        nav: !!document.querySelector('.cn-mobile'),
        wide: document.querySelector('#stage').scrollWidth > innerWidth + 1,
      }));
      if (state.sites !== 1) say(`expected one page body, found ${state.sites}`);
      if (!state.nav) say('the navigation did not mount');
      if (state.wide) say('the page scrolls sideways');
      await page.close();
    }
  }
  server.close();
  return problems;
}

const studio = await serve(MOUNTS.map(([prefix, dir]) => [prefix, dir]));
const browser = await chromium.launch();
try {
  const {files, markup} = await capture(browser, studio.url);
  const missing = await scan(files);
  const copied = await write(files, markup);
  console.log(`Wrote ${PAGES.length + OTHER.length} pages and ${copied.length} files from ${CLIENT}`);
  if (missing.length) console.log(`Named in code but not in the Studio (not copied):\n  ${missing.join('\n  ')}`);
  const problems = await verify(browser);
  console.log(problems.length ? `Problems:\n  ${problems.join('\n  ')}` : `Checked every page at 1440 and 390: no missing files or errors. Screenshots: ${SHOTS}`);
  if (problems.length) process.exitCode = 1;
} finally {
  await browser.close();
  studio.server.close();
}
