# Chrome Web Store listing — copy & checklist

## Item name
WATag — one-click archive for WhatsApp Web

## Summary (132 char max)
Flags promotional chats on WhatsApp Web by keyword and archives them in one click. Free & open source, runs fully local.

## Description
WhatsApp Web's chat list gets buried in "50% off!" promo spam from banks, delivery apps, and mailing lists. WATag flags those chats automatically and gives you a one-click Archive button — no need to open each one.

**Features**
- Smart detection — flags chats matching keywords from any of your categories
- Custom categories — group keywords into your own categories, each with its own name and badge color
- One-click Archive — archive promotional chats without opening them
- False positive handling — mark a chat "Not an ad" and it's never flagged again
- Archive counter — track how many chats you've cleaned up
- Phone sync — archives sync automatically to your mobile WhatsApp, since it's the same account

**How it works**
WATag runs entirely in your browser. It reads the visible chat list on web.whatsapp.com, matches chat names/previews against keywords you configure, and adds a small badge with Archive / Not-an-ad buttons. All settings are stored locally — there's no backend server and nothing is ever sent off your device.

**Limitations, honestly**
WhatsApp doesn't run ads in normal chats — this flags things that *look* promotional based on keyword matches, so tune your categories to your own inbox. WhatsApp Web's page structure isn't public and can change; if a redesign breaks the one-click action, WATag opens the right menu and asks you to finish with one manual click until it's updated.

Free and open source: https://github.com/krushideep/watag

## Category
Productivity

## Language
English

## Permission justifications (for the Chrome Web Store dashboard)
- **storage** — save your categories, keywords, badge colors, whitelist, and settings locally in your browser.
- **host_permissions: https://web.whatsapp.com/\*** — required so the content script can read the chat list and interact with WhatsApp Web's own Archive menu on your behalf. WATag does not request or use access to any other site.

## Single purpose description
Flags likely-promotional chats in the WhatsApp Web chat list by keyword and provides a one-click way to archive them.

## Privacy policy URL
https://github.com/krushideep/watag/blob/main/PRIVACY.md

## Assets
- Store icon: `icons/icon128.png` (128×128) — already meets requirements.
- Screenshots (1280×800, no alpha) and small promo tile (440×280): run `make store-assets` to (re)generate `store/screenshot-1-flagging.png`, `store/screenshot-2-categories.png`, and `store/promo-tile-440x280.png` from `demo/demo.gif` + `icons/icon128.png`. These PNGs are build artifacts (gitignored) — regenerate whenever `demo.gif` changes.
- Package to upload: `dist/watag.zip` (run `make build` to regenerate)

## Pre-submit checklist
- [ ] Chrome Web Store developer account registered ($5 one-time fee, if not already paid)
- [ ] Privacy policy published at a stable URL and pasted into the dashboard
- [ ] Screenshots and promo tile uploaded
- [ ] Permission justifications filled in (data-handling / privacy practices tab)
- [ ] Version bumped in `manifest.json` before each future re-upload
