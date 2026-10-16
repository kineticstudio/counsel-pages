# News banner

Javi, October 16: the live site has a news banner above the nav and the new
site lost it. This is the new site's version. It goes on every page.

Design: any current page on the review site, for example
[Home](https://counsel.kineticstudio.com/designs/counsel/01-home) or
[Counsel Studio V20](https://counsel.kineticstudio.com/designs/counsel/05-counsel-studio/counsel-studio-v20).
Code: `.cn-news` and `NEWS` in `src/nav-src/counsel-nav.js`.

## What it is

A slim sky band above the nav: one line of news and a "Learn more" link. It
is built from the new site's parts, not the live site's banner (no
uppercase mono, no soft black, no chip).

- **Place:** first thing on the page, above the nav, full width.
- **Scroll:** it scrolls away with the page. It is not sticky. The fixed
  nav that comes back on scroll up sits at the very top, without the banner.
- **Nav:** the nav and hero start right below it. Nothing overlaps.

## Copy

- Text: Counsel joins ACCESS, bringing AI-native chronic care to Medicare
  beneficiaries
- Link: Learn more, opening in a new tab:
  https://www.businesswire.com/news/home/20260917750816/en/Counsel-Health-Joins-ACCESS-Model-to-Bring-AI-Native-Chronic-Care-to-Medicare-Beneficiaries

Make the text and the link editable (component properties or a CMS item),
with a switch to hide the banner, so Counsel can change the news without a
rebuild.

## Style

| | Desktop | Phones (600px and below) |
| --- | --- | --- |
| Background | `--blue-1` #DFEFF8 | same |
| Text colour | `--blue-9` #132045 | same |
| Height | at least 40px, content centred | grows to two lines |
| Padding | 8px 20px | 10px 16px |
| Font | GT America, 14px, regular, line height 1.4 | 13px, `text-wrap: balance` |
| Link | 10px after the text, weight 500, 1px underline 3px below the text, underline #132045 at 40% | 6px after the text |
| Link hover and focus | underline goes to full #132045 | same |

The text and link are one centred line. On phones they wrap together; the
link never breaks across lines.
