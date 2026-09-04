# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in WATag, please **do not** open a public GitHub issue. Instead, please email us privately at [krushi.deep@gmail.com](mailto:krushi.deep@gmail.com) with:

1. **Description** of the vulnerability
2. **Steps to reproduce** it
3. **Potential impact** of the vulnerability
4. **Your suggested fix** (if any)

Please allow us reasonable time to fix the issue before any public disclosure.

## Security Considerations

### What WATag Does
- Reads WhatsApp Web's DOM to identify chats
- Stores user settings (keywords, archive count) in browser's local storage
- Communicates only with web.whatsapp.com (no external API calls)

### What WATag Does NOT Do
- Does not access your messages or personal data
- Does not connect to external servers
- Does not track your activity
- Does not modify message content
- Does not intercept network traffic

### Data Privacy
- All user settings are stored locally in your browser
- Your keyword list and archive count never leave your computer
- The extension only operates on web.whatsapp.com

### Known Limitations
- WhatsApp Web's page structure changes over time, which may affect functionality
- The extension cannot operate in the background
- Side-loaded extensions don't receive automatic security updates (manual reload required)

## Updates and Patches

Since this is a side-loaded extension:
- Pull the latest version from GitHub
- Reload the extension in your browser
- Follow the README's [Install section](README.md#install-takes-1-minute)

## Questions?

If you have security-related questions, please email [krushi.deep@gmail.com](mailto:krushi.deep@gmail.com).
