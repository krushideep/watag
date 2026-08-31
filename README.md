# WA Ad Guard

A browser extension for **web.whatsapp.com** (desktop Chrome, Edge, or Brave)
that flags promotional content and gives you one-click **Archive** and
**Unfollow** buttons.

It works on:
- **Sponsored Channels** — always flagged, with an **Unfollow** button.
- **Regular chats/groups** — flagged if the message preview contains a word
  from your keyword list (edit this from the popup — defaults include
  "sale", "% off", "discount", "buy now", etc).

Any chat you archive or unfollow here syncs to your phone automatically,
since it's the same WhatsApp account — you don't need to install anything
on iPhone or Android.

## Demo

![Demo: flagging and archiving promotional chats, unfollowing a sponsored channel, and dismissing a false positive](demo/demo.gif)

Recorded against a local mock chat list with realistic sample data (see
[`demo/`](demo)) — the extension itself is unmodified and driving the
interactions for real, not staged.

## Install (takes ~1 minute)

1. Unzip this folder somewhere permanent (don't delete it after installing —
   the browser loads the extension from this folder each time).
2. Open `chrome://extensions` (or `edge://extensions`, or `brave://extensions`).
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `wa-ad-guard` folder.
5. Open web.whatsapp.com and log in as usual.

You'll see small badges appear under flagged chats with icon buttons for
**Archive**, **Unfollow** (Sponsored Channels only), and **Not an ad**.

## Using it

- Click the extension icon in your toolbar to:
  - Turn detection on/off
  - Add or remove keywords
  - See how many chats you've archived/unfollowed
  - Manage your "never flag" list (built automatically when you tap
    "Not an ad" on a chat)
- Click **Archive** or **Unfollow** directly on a flagged chat to act on
  it immediately — no need to open the chat first.

## Please read: honest limitations

- **WhatsApp doesn't run ads in normal chats.** This tool flags things that
  *look* promotional (sponsored Channels, keyword matches in previews) —
  it's a heuristic, not an official WhatsApp feature. You'll want to tune
  the keyword list to your own inbox.
- **WhatsApp Web's page structure isn't public and changes over time.**
  This extension avoids relying on their internal class names and instead
  looks for stable signals (button labels, menu text). If WhatsApp ships a
  redesign, one-click actions may only get partway (it'll open the right
  menu for you and ask you to finish with one manual click) until the
  extension is updated.
- **This only runs while web.whatsapp.com is open in your browser** — it
  can't scan or act on chats in the background.
- This is for personal use, unpacked/side-loaded — it isn't published to
  the Chrome Web Store, so there's no auto-update. Pull the latest files
  and reload the extension to update.

## License

[MIT](LICENSE)
