/**
 * Counsel Studio round three, V10 to V12 (Hunter, 2026-10-13): "a few
 * versions of Counsel Studio that have centered type and are a little bit
 * more scroll-driven." Every heading and paragraph sits on the page's centre
 * line, and motion rides along with the scroll: it is tied to how far you
 * have scrolled, but nothing pins, snaps or holds the page (Hunter's rule
 * since Oct 7). This module holds the centred sections the three share; each
 * version owns its one idea. Motion is in animations.js (mountStudioV10 to V12).
 */
import {lucide} from '../ui-src/counsel-icons.js';
import {DEMO,COPY,esc} from './content.js';

export const actions=(label='Request a demo')=>`<div class="studio-actions"><a class="channel-btn light" href="${DEMO}">${esc(label)}</a></div>`;

export const heroCopy=()=>`<div class="channel-wrap r3-copy">
  <h1 class="r2-title">${esc(COPY.hero.title)}</h1>
  <p class="r2-lede">${esc(COPY.hero.lede)}</p>
  ${actions()}
</div>`;

// A centred section head. data-r3-rise: the block rises a little as it
// scrolls in (heading and body together, so they never overlap).
export const head=({id,title,body=''})=>`<div class="r3-head" data-r3-rise>
  <h2 id="${id}" class="r2-heading">${esc(title)}</h2>
  ${body?`<p class="r2-body">${esc(body)}</p>`:''}
</div>`;

// The Oura spotlight on the centre line: label, logo, quote.
export const partner=({quote=esc(COPY.partner.quote),className=''}={})=>`<section class="studio-partner r3-partner${className?' '+className:''}" aria-label="Partner spotlight">
  <div class="channel-wrap r3-partner-inner">
    <p class="r3-eyebrow">${esc(COPY.partner.label)}<span>${esc(COPY.partner.note)}</span></p>
    <img class="studio-partner-logo" src="/brand/partners/oura.svg" alt="Oura" width="198" height="62">
    <p class="r3-quote">${quote}</p>
  </div>
</section>`;

// The live deployment points, centred, with their Lucide icons.
export const deploy=()=>`<div class="r3-deploy">
  <h3>${esc(COPY.deploy.title)}</h3>
  <ul data-r3-rise>${COPY.deploy.items.map(item=>`<li>${lucide(item.icon)}<p>${esc(item.text)}</p></li>`).join('')}</ul>
</div>`;

// The four live outcomes as a ruled two by two. The cross between them is
// drawn outward from its centre square as the grid scrolls in; on phones each
// outcome gets its own rule instead.
const rules=i=>[
  i<3?`<i class="r3-line is-b${i===2?' is-last-row':''}" aria-hidden="true"></i>`:'',
  i%2===0?`<i class="r3-line is-r" aria-hidden="true"></i>`:'',
  i===0?`<i class="r3-knot" aria-hidden="true"></i>`:'',
].join('');
export const outcomes=({id='r3-outcomes-title'}={})=>`<section class="studio-section r3-outcomes" aria-labelledby="${id}">
  <div class="channel-wrap">
    ${head({id,title:COPY.outcomesTitle})}
    <div class="r3-grid">${COPY.outcomes.map((item,i)=>`<article class="r3-outcome">${rules(i)}<div class="r3-outcome-text" data-r3-rise><h3>${esc(item.title[0])}<em>${esc(item.title[1])}</em></h3><p>${esc(item.body)}</p></div></article>`).join('')}</div>
  </div>
</section>`;

export const cta=({id})=>`<section class="studio-section r2-cta" aria-labelledby="${id}">
  <div class="channel-wrap r2-cta-inner" data-r3-rise><h2 id="${id}">${esc(COPY.cta)}</h2>${actions()}</div>
</section>`;
