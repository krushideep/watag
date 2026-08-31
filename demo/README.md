# Demo recording

`record.mjs` drives the real extension against `mock-whatsapp.html` (a small
local stand-in for WhatsApp Web's chat list, with realistic mock chats —
some normal, some promotional, some Sponsored channels) using Playwright,
and records the interaction as video.

The real `manifest.json` only matches `https://web.whatsapp.com/*`, so the
script makes a throwaway copy of the extension in `.ext-copy/` with its
match pattern widened to a local test server, and loads *that* copy —
the repo's actual source files are never modified.

## Reproduce it

```
cd demo
npm install
npm run record
```

This launches a visible Chromium window, plays out the demo (flag → archive
a promotional chat, unfollow a sponsored channel, dismiss a false positive
as "Not an ad", then add a keyword live from the popup), and writes
`demo.mp4` to this folder — from which `demo.gif` was generated with:

```
ffmpeg -i demo.mp4 -vf "fps=14,scale=760:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer" demo.gif
```
