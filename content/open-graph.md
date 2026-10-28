# Open Graph video

Hunter, October 28: a page whose hero moves shares as a video, with a still
for every app that only shows an image. On Counsel's site that is one page,
Counsel Studio. The heroes on Home, the four audience pages and the condition
pages don't move, so those pages keep the share graphics they have now.

## Counsel Studio

`/solutions/counsel-studio`

- **Video:** `og/counsel-studio.mp4`. The V20 hero in motion: the squares
  and the data cards, with the title, text and button as they are on the
  page. 1200x630, H.264, 10.8 seconds, no sound, 203 KB. It loops without a
  jump.
- **Still:** `og/counsel-studio.png`. The same scene, 1200x630.

Both load from this repo through jsDelivr, pinned to the commit, the same
way the hero's images do:

- https://cdn.jsdelivr.net/gh/kineticstudio/counsel-pages@0ab3577/og/counsel-studio.mp4
- https://cdn.jsdelivr.net/gh/kineticstudio/counsel-pages@0ab3577/og/counsel-studio.png

### In Webflow

1. **Page settings, Open Graph image:** upload `og/counsel-studio.png`, so
   the picture matches the video. It replaces "Share Graphic 3" on this
   page only. If Counsel would rather keep their graphic, leave it in place;
   the video tags work with either.
2. **Page settings, Custom code, Inside `<head>` tag:** paste

   ```html
   <meta property="og:video" content="https://cdn.jsdelivr.net/gh/kineticstudio/counsel-pages@0ab3577/og/counsel-studio.mp4">
   <meta property="og:video:secure_url" content="https://cdn.jsdelivr.net/gh/kineticstudio/counsel-pages@0ab3577/og/counsel-studio.mp4">
   <meta property="og:video:type" content="video/mp4">
   <meta property="og:video:width" content="1200">
   <meta property="og:video:height" content="630">
   ```

3. **Publish to staging only.** Kinetic checks the unfurl on
   counsel-health.webflow.io before it goes to the live site.

Keep the page's title, description and `twitter:card`
(`summary_large_image`) as they are.

### Where it plays

Apps that play `og:video`, such as Discord, show the loop. Most others,
Slack, X and LinkedIn included, show the still, which is why the image
matters as much as the video.

## Re-rendering

`npm run og` renders every page in `tools/og-video.mjs` (today, Counsel
Studio) from `embeds/counsel-studio/preview.html`. It needs the fonts in
`fonts/` and ffmpeg. After a re-render, commit, then point the tags at the
new commit.
