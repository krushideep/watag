# Demo recording

`record.mjs` drives the real extension against `mock-whatsapp.html` (a small
local stand-in for WhatsApp Web's chat list, with realistic mock chats — some
normal, some promotional) using Playwright, and records the interaction as
video.

The real `manifest.json` only matches `https://web.whatsapp.com/*`, so the
script makes a throwaway copy of the extension in `.ext-copy/` with its
match pattern widened to a local test server, and loads *that* copy —
the repo's actual source files are never modified.

Only `demo.gif` (embedded in the root README) is committed. The raw video is
a local build artifact — regenerate it if you need it.

## Reproduce it

```
cd demo
npm install
npm run record
```

This launches a visible Chromium window, plays out the demo (flag → archive
two promotional chats, dismiss a false positive as "Not an ad", create a
custom category live from the popup, then reopen the chat list to show that
category's own badge color on the chat it matches), and writes four clips to
`recording/main/`: the main chat-list interaction (~15s), the popup
interaction (~7s), a short reveal clip showing the new category's badge
(~4s), and an idle blank tab Playwright opens by default (discard that one —
it's the largest file, since it stays open for the whole recording).

The browser window (and each clip) is sized to the mock's fixed 420px
sidebar width, so the frame is just the chat list — none of the empty
"select a chat" pane to its right.

Concatenate the chat-list, popup, and reveal clips in that order and encode
to mp4:

```
ffmpeg -i recording/main/<chat-list-clip>.webm -i recording/main/<popup-clip>.webm -i recording/main/<reveal-clip>.webm \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1:a=0[outv]" -map "[outv]" \
  -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart demo.mp4
```

Then generate the gif (already native width, no scale-up needed):

```
ffmpeg -i demo.mp4 -vf "fps=14,scale=420:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer" demo.gif
```
