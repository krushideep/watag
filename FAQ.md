# Frequently Asked Questions (FAQ)

## Installation & Setup

### Q: Do I need to code to install this?
**A:** No! WATag is a browser extension that loads like any other unpacked extension. Just follow the 5 steps in the [README](README.md#install-takes-1-minute) — takes about 1 minute.

### Q: Does WATag work on mobile?
**A:** Not directly. WATag only works on **WhatsApp Web** (desktop). However, any chats you archive here will sync to your iPhone or Android automatically since it's the same account.

### Q: Is it on the Chrome Web Store?
**A:** It's being submitted for listing. Until it's live, you can still install it unpacked/side-loaded (see below) — that also means the update model differs: a Web Store install auto-updates, while a side-loaded one requires pulling the latest code and reloading the extension yourself.

### Q: I tried to load it but got an error. Help?
**A:**
1. Make sure you're in **Developer mode** (toggle in the top-right of Extensions page)
2. Verify you selected the **root folder** of this repository (not a subfolder)
3. Check that your browser is Chrome, Edge, or Brave (newest versions work best)
4. Refresh web.whatsapp.com and log in again

If still stuck, [open an issue](../../issues/new) with your browser version and error message.

### Q: Does it work on the WhatsApp Web mirror sites?
**A:** No. WATag only works on the official **web.whatsapp.com**. Mirror/clone sites have different page structures and we can't support them.

---

## Using WATag

### Q: What keywords are included by default?
**A:** A single "Ads" category with words like "sale", "% off", "discount", "buy now", "offer", "limited time", "free shipping" — but you can edit, remove, or add as many categories and keywords as you want in the popup.

### Q: Can I add my own keywords?
**A:** Yes! Click the WATag icon in your toolbar → add or remove keywords from any category. Changes take effect immediately.

### Q: What are categories, and how are they different from keywords?
**A:** A category is a named group of keywords with its own badge color (e.g. "Ads", "Spam", "Work"). When a chat matches a keyword, it's flagged with that keyword's category — the badge shows the category name in its color. Click **+ Add category** in the popup to create more, and use the color swatch on each category to pick its badge color.

### Q: How do I archive a chat?
**A:** Click the **Archive** button that appears under any flagged chat. It'll disappear from your chat list on web.whatsapp.com AND automatically sync to your phone.

### Q: I accidentally archived a chat. Can I unarchive it?
**A:** Yes! Use the same archive/unarchive feature in WhatsApp Web or your phone — WATag doesn't interfere with this.

### Q: What does "Not an ad" do?
**A:** Click **"Not an ad"** on a flagged chat to tell WATag this is a false positive. That chat will never be flagged again (it's added to your "never flag" list).

### Q: Does the "never flag" list sync to my phone?
**A:** No, the "never flag" list is stored only in this browser. On your phone, those chats will be treated normally.

### Q: How many chats can I archive?
**A:** Unlimited! WATag just counts how many you've archived and displays it in the popup. The actual archive is managed by WhatsApp.

---

## Troubleshooting

### Q: The extension stops working after a WhatsApp update
**A:** WhatsApp changes their page structure regularly. Try:
1. **Reload the extension**: Go to Extensions page, click the reload icon ↻
2. **Refresh web.whatsapp.com** and log in again
3. Check [GitHub Issues](../../issues) to see if others reported this
4. [Open a new issue](../../issues/new) with your browser version

### Q: I see no badges on my chats
**A:** Check:
1. Is the extension **enabled**? (Eye icon should be visible on Extensions page)
2. Is detection **turned on**? (Click WATag icon → toggle "Detection on/off")
3. Do your chats contain keywords from any of your categories? (Even "sale" in a name counts)
4. Refresh the page (F5)

### Q: The Archive button doesn't work
**A:** 
- If the Archive button shows but doesn't work: WhatsApp's structure changed. Reload the extension.
- If the button doesn't appear: Try refreshing the page or checking that keywords match your chat preview.

### Q: Extension icon disappeared from toolbar
**A:** The extension might be hidden:
1. Click the **puzzle icon** (Extensions menu) in your browser toolbar
2. Find "WATag" and click the **pin icon** to show it

### Q: Can I see error messages if something breaks?
**A:** Yes! 
1. Right-click the WATag icon → "Manage extension"
2. Click "Errors" (if available) to see recent issues
3. Or open DevTools on web.whatsapp.com (F12) and check the Console

---

## Privacy & Security

### Q: Does WATag send my data anywhere?
**A:** No. Everything runs 100% locally in your browser. WATag never connects to any server except web.whatsapp.com (which you're already using).

### Q: Does WATag see my messages?
**A:** No. WATag only reads the **preview text** (first few words) shown in the chat list. It doesn't open chats or access full message content.

### Q: Is my keyword list safe?
**A:** Your keywords and archive count are stored in your browser's **local storage** — only accessible when you visit web.whatsapp.com. They never leave your computer.

### Q: What if I sync my browser data to the cloud?
**A:** Local storage might sync depending on your browser settings. We recommend:
- Use a privacy-conscious browser or disable cloud sync for extensions
- Your keyword list doesn't contain sensitive data, but it's your choice

---

## Features & Limitations

### Q: Will you add [feature]?
**A:** Maybe! [Check existing feature requests](../../issues?q=label%3Aenhancement) or [suggest a new one](../../issues/new?labels=enhancement). Popular requests get prioritized.

### Q: Can WATag archive chats automatically?
**A:** Not in the current version. You can only archive by clicking the button or using WhatsApp's built-in archive feature. We could explore this in future versions — [let us know if you're interested](../../issues/new)!

### Q: Can WATag detect ads in WhatsApp Business chats?
**A:** WhatsApp Business chats work the same way as regular chats, so yes — if a business message matches your keywords, it'll be flagged.

### Q: Does this work with WhatsApp groups?
**A:** Yes! Group chats are treated the same as personal chats. If the group preview contains keywords, it'll be flagged.

---

## Contributing & Support

### Q: I found a bug. What do I do?
**A:** 
1. Check [existing issues](../../issues) to see if it's already reported
2. [Open a new issue](../../issues/new?labels=bug) with:
   - Your browser and version
   - Steps to reproduce
   - Screenshots (if helpful)

### Q: Can I contribute code?
**A:** Absolutely! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Q: How do I stay updated?
**A:** 
- **Watch the repo** (click the bell icon on the repo page)
- Check back regularly for updates
- Since it's side-loaded, you'll need to manually pull updates and reload

### Q: I have more questions
**A:** 
- [Start a Discussion](../../discussions) for general questions
- [Open an Issue](../../issues/new) for bugs or feature requests
- Email krushi.deep@gmail.com for private matters

---

**Didn't find your answer?** [Start a Discussion](../../discussions) and we'll help!
