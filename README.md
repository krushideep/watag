# WATag

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](#)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](#)

A browser extension for **web.whatsapp.com** (Chrome, Edge, or Brave) that flags promotional content and gives you a one-click **Archive** button.

> **Stop spam chats in their tracks.** Automatically detect promotional messages, archive them instantly, and keep your WhatsApp inbox clean.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Install](#install-takes-1-minute)
- [Usage](#using-it)
- [Limitations](#please-read-honest-limitations)
- [License](#license)

## Features

✨ **Smart Detection** — Flags chats containing promotional keywords (configurable)

⚡ **One-Click Archive** — Archive promotional chats without opening them

🎯 **False Positive Handling** — Mark chats as "Not an ad" and they'll never be flagged again

⚙️ **Customizable Keywords** — Add or remove keywords from the extension popup

📊 **Archive Counter** — Track how many chats you've archived

🔄 **Phone Sync** — Archives sync automatically to your mobile WhatsApp

## Demo

![Demo: flagging and archiving promotional chats, and dismissing a false positive](demo/demo.gif)

Recorded against a local mock chat list with realistic sample data (see [`demo/`](demo)) — the extension itself is unmodified and driving the interactions for real, not staged.

## Install (takes ~1 minute)

1. Get this repo onto your machine somewhere permanent — `git clone` it, or download and unzip the ZIP from GitHub (don't delete or move it after installing — the browser loads the extension from this folder each time).
2. Open `chrome://extensions` (or `edge://extensions`, or `brave://extensions`).
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select this project's folder.
5. Open web.whatsapp.com and log in as usual.

You'll see small badges appear under flagged chats with icon buttons for **Archive** and **Not an ad**.

## Using it

- **Click the extension icon** in your toolbar to:
  - Turn detection on/off
  - Add or remove keywords
  - See how many chats you've archived
  - Manage your "never flag" list (built automatically when you tap "Not an ad" on a chat)
- **Click Archive** directly on a flagged chat to act on it immediately — no need to open the chat first.

## Please read: honest limitations

- **WhatsApp doesn't run ads in normal chats.** This tool flags things that *look* promotional (keyword matches in previews) — it's a heuristic, not an official WhatsApp feature. You'll want to tune the keyword list to your own inbox.
- **WhatsApp Web's page structure isn't public and changes over time.** This extension avoids relying on their internal class names and instead looks for stable signals (button labels, menu text). If WhatsApp ships a redesign, one-click actions may only get partway (it'll open the right menu for you and ask you to finish with one manual click) until the extension is updated.
- **This only runs while web.whatsapp.com is open in your browser** — it can't scan or act on chats in the background.
- This is for personal use, unpacked/side-loaded — it isn't published to the Chrome Web Store, so there's no auto-update. Pull the latest files and reload the extension to update.

## Troubleshooting

**Extension not working after WhatsApp update?**
- Reload the extension (on the Extensions page, click the reload icon)
- Check if WhatsApp Web's DOM structure changed (open DevTools and inspect a chat)

**Keywords not matching?**
- Keywords are case-insensitive but must be exact word matches (not partial matches within words)
- Check the popup to verify your keyword list

**Archive button not appearing?**
- Make sure you're on `web.whatsapp.com` (not WhatsApp Web Mirror or a clone)
- Verify the extension is enabled in the Extensions popup

## Contributing

Found a bug or have a feature idea? 
- Check existing [issues](../../issues)
- Open a new issue with details about your WhatsApp Web version and browser

## License

[MIT](LICENSE) — use and modify freely for personal use.

---

**Questions?** Open a [GitHub Issue](../../issues) or start a [Discussion](../../discussions).
