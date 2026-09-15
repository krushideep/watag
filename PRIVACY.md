# Privacy Policy

**Last updated:** 2026-09-15

WATag is a browser extension for web.whatsapp.com. This policy describes what data it accesses and what it does with it.

## What WATag accesses

- **Chat list text on web.whatsapp.com** — WATag's content script reads the visible chat names and message previews in your WhatsApp Web chat list, entirely in your browser, to check them against your configured keywords. It does not access chat content outside the chat list preview, and it does not access chats on any other site.

## What WATag stores

- Your categories, keywords, badge colors, the "never flag" whitelist, the enabled/disabled toggle, and an archived-chat counter, using Chrome's built-in `storage.local` API.
- All of this is stored **locally in your own browser profile**. WATag has no backend server, and nothing is uploaded anywhere.

## What WATag does NOT do

- It does not transmit any data off your device — there are no network requests to any server, first-party or third-party.
- It does not collect analytics, telemetry, or usage statistics.
- It does not access your WhatsApp messages, contacts, or media beyond the visible chat-list preview text needed for keyword matching.
- It does not use cookies or any cross-site tracking.

## Permissions explained

- `storage` — to save your categories, keywords, and settings locally.
- `host_permissions` for `https://web.whatsapp.com/*` — required so the extension's content script can read the chat list and act on WhatsApp Web's own Archive menu on your behalf. WATag does not run on, or request access to, any other site.

## Changes to this policy

If this policy changes, the update will be reflected in this file with a new "Last updated" date.

## Contact

Questions about this policy or the extension's data handling can be raised via [GitHub Issues](../../issues).
