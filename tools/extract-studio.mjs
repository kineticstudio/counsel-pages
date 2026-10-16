/**
 * Reads Counsel Studio V20 from the Studio (rendered, no motion) and returns
 * the markup and the CSS each embed needs: the hero's data callouts and the
 * phone section. Only rules that touch the embed's own elements are kept,
 * rewritten to sit under the embed's root class, with the design tokens and
 * inherited type they rely on set on that root. Used by build-studio-embeds.mjs.
 */
export async function extractStudio(browser, url) {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}});
  await page.goto(`${url}?render-only`, {waitUntil: 'networkidle'});
  await page.waitForSelector('.r14-build');
  const result = await page.evaluate(() => {
    const splitTop = (text, sep) => {
      const parts = []; let depth = 0, cur = '';
      for (const ch of text) {
        if (ch === '(' || ch === '[') depth++;
        if (ch === ')' || ch === ']') depth--;
        if (!depth && sep(ch)) { parts.push(cur); cur = ''; continue; }
        cur += ch;
      }
      parts.push(cur);
      return parts.map(p => p.trim()).filter(Boolean);
    };
    // A selector as compounds and combinators, top level only.
    const tokens = sel => {
      const out = []; let depth = 0, cur = '';
      for (const ch of sel) {
        if (ch === '(' || ch === '[') depth++;
        if (ch === ')' || ch === ']') depth--;
        if (!depth && (ch === ' ' || ch === '>' || ch === '+' || ch === '~')) {
          if (cur) { out.push(cur); cur = ''; }
          if (ch !== ' ') out.push(ch);
          continue;
        }
        cur += ch;
      }
      if (cur) out.push(cur);
      return out;
    };
    const bare = sel => sel.replace(/::?(before|after|placeholder|marker|selection|-webkit-[\w-]+)\b/g, '').replace(/:(hover|focus|focus-visible|focus-within|active|visited)\b/g, '');
    function extract(root, scope) {
      const ancestors = []; for (let a = root.parentElement; a; a = a.parentElement) ancestors.push(a);
      const matchesInside = sel => { try { return [...document.querySelectorAll(bare(sel) || '*')].some(el => el === root || root.contains(el)); } catch { return false; } };
      const rewrite = sel => {
        const t = tokens(sel); let i = 0;
        while (i < t.length - 1) {
          const compound = t[i], next = t[i + 1];
          if (['>', '+', '~'].includes(compound)) break;
          let isAncestor = false; try { isAncestor = ancestors.some(a => a.matches(bare(compound) || '*')); } catch {}
          if (!isAncestor) break;
          i += ['>', '+', '~'].includes(next) ? 2 : 1;
        }
        return `${scope} ${t.slice(i).join(' ').replace(/ ([>+~]) /g, '$1')}`.replace(/\s+/g, ' ');
      };
      const vars = new Set(); const css = [];
      // Every state the embed can be in counts: each brand on the phone.
      const phoneEl = root.querySelector('.r14-phone'), brandNow = phoneEl?.dataset.brand;
      const states = phoneEl ? [...root.querySelectorAll('.r14-pick button[data-value]')].map(b => b.dataset.value) : [null];
      const keepOf = rule => {
        const keep = new Set();
        for (const state of states) {
          if (state) phoneEl.dataset.brand = state;
          for (const sel of splitTop(rule.selectorText, ch => ch === ',')) if (matchesInside(sel)) keep.add(sel);
        }
        if (phoneEl) phoneEl.dataset.brand = brandNow;
        return [...keep];
      };
      const walk = (rules, wrap) => {
        for (const rule of rules) {
          if (rule instanceof CSSStyleRule) {
            const keep = keepOf(rule);
            if (!keep.length) continue;
            const body = rule.style.cssText;
            for (const m of body.matchAll(/var\((--[\w-]+)/g)) vars.add(m[1]);
            css.push(wrap(`${keep.map(rewrite).join(',')}{${body}}`));
          } else if (rule instanceof CSSMediaRule) {
            walk(rule.cssRules, text => wrap(`@media ${rule.conditionText}{${text}}`));
          } else if (rule instanceof CSSSupportsRule) {
            walk(rule.cssRules, text => wrap(`@supports ${rule.conditionText}{${text}}`));
          }
        }
      };
      for (const sheet of document.styleSheets) { let rules; try { rules = sheet.cssRules; } catch { continue; } walk(rules, text => text); }
      // Tokens and inherited type the kept rules rely on, read where the embed sits.
      const cs = getComputedStyle(root);
      const tokensCss = [...vars].map(name => [name, cs.getPropertyValue(name).trim()]).filter(([, v]) => v).map(([n, v]) => `${n}:${v}`).join(';');
      const inherited = ['color', 'font-family', 'font-size', 'line-height', 'letter-spacing', '-webkit-font-smoothing'].map(p => `${p}:${cs.getPropertyValue(p)}`).join(';');
      return {css: [`${scope}{${tokensCss};${inherited}}`, ...css].join('\n')};
    }
    const phone = document.querySelector('.r14-build');
    const callouts = document.querySelector('.r17-callouts');
    const copy = document.querySelector('.r14-copy');
    const hero = document.querySelector('.studio-hero');
    const pick = (el, props) => { const cs = getComputedStyle(el); return Object.fromEntries(props.map(p => [p, cs.getPropertyValue(p)])); };
    return {
      phone: {html: phone.outerHTML, ...extract(phone, '.cs-studio-phone')},
      callouts: {html: callouts.outerHTML, ...extract(callouts, '.cs-studio-hero')},
      spec: {
        hero: pick(hero, ['background-color', 'padding-top']),
        copy: pick(copy, ['padding-top', 'padding-bottom', 'min-height', 'text-align']),
        title: pick(copy.querySelector('h1'), ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'margin-bottom']),
        lede: pick(copy.querySelector('p'), ['font-size', 'line-height', 'color', 'max-width']),
        button: pick(copy.querySelector('a'), ['background-color', 'color', 'font-size', 'padding', 'border-radius', 'margin-top']),
        actions: pick(copy.querySelector('.studio-actions'), ['margin-top']),
        build: pick(phone, ['padding-bottom', 'max-width', 'padding-left']),
      },
    };
  });
  await page.close();
  return result;
}
