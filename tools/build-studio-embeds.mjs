#!/usr/bin/env node
/**
 * Builds Counsel Studio's two code embeds for Webflow from the Studio's V20:
 *
 *   embeds/counsel-studio/hero.html    the hero's background (squares, data cards)
 *   embeds/counsel-studio/phone.html   the phone section (switcher, app, sheet, labels)
 *
 *   STUDIO=/path/to/kinetic-creative-studio node tools/build-studio-embeds.mjs
 *
 * Markup and CSS come from the Studio page itself (rendered, no motion), the
 * CSS cut to what the embed's own elements use and scoped under its root.
 * The motion is tools/embed-src/hero.js and phone.js. Images load from this
 * repo through jsDelivr, pinned to the commit in REF. Each file must stay
 * under Webflow's 50,000-character embed limit.
 */
import {promises as fs} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {serve} from './server.mjs';
import {extractStudio} from './extract-studio.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STUDIO = path.resolve(process.env.STUDIO || path.join(os.homedir(), 'Documents/Codex/2026-09-21/cou/kinetic-creative-studio'));
const CLIENT = path.join(STUDIO, 'clients/counsel');
const REF = process.env.REF || '86763b6';
const CDN = `https://cdn.jsdelivr.net/gh/kineticstudio/counsel-pages@${REF}/brand/`;
const OUT = path.join(ROOT, 'embeds/counsel-studio');
const LIMIT = 50000;

const brands = async () => {
  // The switcher's three made-up brands, from the Studio page's own source.
  const src = await fs.readFile(path.join(CLIENT, 'designs/studio-src/studio-v14.js'), 'utf8');
  const looks = new Function(`return ${src.match(/brand:\{name:'Brand',options:(\[[\s\S]*?\n {2}\]),?\}/)[1]}`)();
  const type = new Function(`return ${src.match(/const BRAND_TYPE=(\{[\s\S]*?\n\});/)[1]}`)();
  return Object.fromEntries(looks.map(o => [o.id, {...o.vars, ...type[o.id]}]));
};
const assets = text => text.replace(/\/brand\/counsel\//g, CDN);
// Declarations lose their spaces; selectors keep theirs (a space before a
// colon is a descendant combinator), only around commas and child combinators.
const minCss = css => css.replace(/\s+/g, ' ').replace(/([^{}]*)\{([^{}]*)\}/g, (all, sel, body) =>
  `${sel.trim().replace(/\s*([,>])\s*/g, '$1')}{${body.trim().replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';').replace(/;$/, '')}}`).replace(/\s*([{}])\s*/g, '$1').trim();
const minJs = js => js.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map(line => line.trim()).filter(Boolean).join('\n');
const note = text => `<!-- Counsel Studio V20, ${text} Built by tools/build-studio-embeds.mjs from Kinetic's Studio. Fonts come from the page. -->`;

// The host page's own type (Webflow styles p, headings, links and lists)
// must not reach inside an embed: its text inherits from the embed's root,
// and the embed's own rules (higher specificity) set everything else.
const RESET = scope => `${scope} :is(p,h1,h2,h3,h4,h5,h6,a,ul,ol,li,figure,blockquote){margin:0;padding:0;font-size:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;font-family:inherit;text-transform:none;text-decoration:none;max-width:none}
${scope} :is(h1,h2,h3,h4,h5,h6){font-weight:inherit}
${scope} :is(ul,ol){list-style:none}
${scope} img{max-width:none;vertical-align:baseline}`;
const HERO_CSS = `.cs-studio-hero{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.cs-studio-hero::before{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Crect width='5' height='5' fill='%23AED9B0' fill-opacity='.07'/%3E%3C/svg%3E");clip-path:inset(var(--dots-top,0px) 0 0 0)}
.cs-studio-hero .cs-intro,.cs-studio-hero .cs-sparks{position:absolute;top:0;left:0;width:100%;display:block}
.cs-studio-hero .cs-sparks{height:100%}`;

const studio = await serve([
  ['/designs/counsel/', path.join(CLIENT, 'designs')],
  ['/brand/counsel/', path.join(CLIENT, 'brand')],
  ['/fonts/counsel/', path.join(CLIENT, 'brand/fonts')],
  ['/shared/', path.join(STUDIO, 'shared')],
  ['/prototypes/counsel/', path.join(CLIENT, 'prototypes')],
]);
const browser = await chromium.launch();
try {
  const x = await extractStudio(browser, `${studio.url}/designs/counsel/05-counsel-studio/Counsel-Studio-V20.html`);
  const heroJs = minJs(await fs.readFile(path.join(ROOT, 'tools/embed-src/hero.js'), 'utf8'));
  const phoneJs = minJs((await fs.readFile(path.join(ROOT, 'tools/embed-src/phone.js'), 'utf8')).replace('__BRANDS__', JSON.stringify(await brands())));
  const hero = `${note('the hero background: paste into an Embed as the first child of the hero section.')}
<div class="cs-studio-hero" aria-hidden="true"><canvas class="cs-sparks"></canvas>${assets(x.callouts.html)}</div>
<style>${minCss(RESET('.cs-studio-hero') + '\n' + HERO_CSS + '\n' + assets(x.callouts.css))}</style>
<script>${heroJs}</script>
`;
  const phone = `${note('the phone section: paste into an Embed inside the hero, under the button.')}
<div class="cs-studio-phone">${assets(x.phone.html)}</div>
<style>${minCss(RESET('.cs-studio-phone') + '\n' + assets(x.phone.css))}</style>
<script>${phoneJs}</script>
`;
  await fs.mkdir(OUT, {recursive: true});
  await fs.writeFile(path.join(OUT, 'hero.html'), hero);
  await fs.writeFile(path.join(OUT, 'phone.html'), phone);
  await fs.writeFile(path.join(OUT, 'spec.json'), JSON.stringify(x.spec, null, 2) + '\n');
  // A stand-in for the Webflow page (window scroll, a fixed nav, the hero as
  // a section with its own text and button), with both embeds pasted as-is.
  const sp = x.spec, embed = html => `<div class="w-embed">${html}</div>`;
  await fs.writeFile(path.join(OUT, 'preview.html'), `<!doctype html>
<!-- Generated by tools/build-studio-embeds.mjs: Counsel Studio's hero as Webflow would hold it, with both embeds pasted as-is. Open with npm run serve. -->
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Counsel Studio embeds</title>
<link rel="stylesheet" href="/fonts/fonts.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>
<style>
body{margin:0;background:#f8f8f6;font-family:"Gt America",sans-serif;-webkit-font-smoothing:antialiased}
.nav{position:fixed;top:0;left:0;right:0;z-index:20;height:72px;display:flex;align-items:center;padding:0 30px;color:#dbedd8;font-size:15px}
.hero{position:relative;overflow:hidden;background:${sp.hero['background-color']};padding-top:${sp.hero['padding-top']}}
.hero-copy{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:${sp.copy['min-height']};padding:${sp.copy['padding-top']} 5% ${sp.copy['padding-bottom']};text-align:center;box-sizing:border-box}
.hero h1{margin:0 0 ${sp.title['margin-bottom']};font-family:Cooper,Georgia,serif;font-weight:${sp.title['font-weight']};font-size:clamp(60px,8.2vw,128px);line-height:.98;letter-spacing:-.035em;color:${sp.title.color}}
.hero p{max-width:31em;margin:0;font-size:clamp(18px,1.55vw,23px);line-height:1.45;color:${sp.lede.color};text-wrap:balance}
.hero a.button{margin-top:${sp.actions['margin-top']};padding:${sp.button.padding};border-radius:${sp.button['border-radius']};background:${sp.button['background-color']};color:${sp.button.color};font-size:${sp.button['font-size']};text-decoration:none}
.hero .w-embed:last-child{position:relative;z-index:1}
.after{min-height:120vh;padding:120px 5%;font:300 40px/1.1 Cooper,Georgia,serif;color:#132045}
</style></head><body>
<nav class="nav">Counsel</nav>
<section class="hero">
${embed(hero)}
<div class="hero-copy"><h1>Counsel Studio</h1><p>Bring clinical action to your trusted digital experience with AI-native primary care embedded within your app.</p><a class="button" href="#">Request a demo</a></div>
${embed(phone)}
</section>
<section class="after">The next section</section>
</body></html>
`);
  const sizes = [['hero.html', hero.length], ['phone.html', phone.length]];
  console.log(sizes.map(([f, n]) => `${f}: ${n.toLocaleString()} characters`).join('\n'));
  const over = sizes.filter(([, n]) => n > LIMIT);
  if (over.length) { console.log(`Over Webflow's ${LIMIT.toLocaleString()} limit: ${over.map(([f]) => f).join(', ')}`); process.exitCode = 1; }
} finally {
  await browser.close();
  studio.server.close();
}
