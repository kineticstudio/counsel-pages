/* Hunter, 2026-09-22: SVG, animation and params defaults read the same CSS
   primitives as the page. Load after counsel-colors.css, before page scripts. */
(() => {
  const style = getComputedStyle(document.documentElement);
  const groups = {
    gray: ['0','05','1','15','2','3','4','5','6','65','7','8','9','10'],
    blue: ['1','2','3','4','5','6','7','75','8','9','10'],
    green: ['1','2','3','4','5','6','7','8','9','10'],
  };
  const names = Object.entries(groups).flatMap(([group, steps]) => steps.map(step => [group+step, group+'-'+step]));
  names.push(['brightBlue','bright-blue'],['yellow','yellow'],['yellow1','yellow-1'],['chartreuse','chartreuse'],['pink','pink'],['pink1','pink-1'],['maroon','maroon']);
  window.CounselColors = Object.freeze(Object.fromEntries(names.map(([name, token]) => {
    const value = style.getPropertyValue('--'+token).trim();
    if (!/^#[\da-f]{6}$/i.test(value)) throw new Error('Missing Counsel color: '+token);
    return [name,value];
  })));
})();
