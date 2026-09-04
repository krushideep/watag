# Contributing to WATag

Thanks for your interest in contributing to WATag! We welcome bug reports, feature requests, and code contributions.

## Getting Started

### Prerequisites
- A modern browser (Chrome, Edge, or Brave)
- Basic knowledge of JavaScript
- Git installed on your machine

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/krushideep/watag.git
   cd watag
   ```

2. **Load the extension**
   - Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`)
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked** and select the `watag` folder
   - Open web.whatsapp.com and test

3. **Make your changes**
   - Edit files in the repository
   - Reload the extension in the Extensions page (click the reload icon)
   - Test your changes on web.whatsapp.com

## How to Contribute

### Reporting Bugs

Before submitting a bug report:
1. Check existing [Issues](../../issues) to avoid duplicates
2. Test on the latest version of WATag
3. Include:
   - Browser and version (e.g., Chrome 120)
   - WhatsApp Web status (e.g., recently updated?)
   - Reproduction steps
   - Screenshots/GIFs if possible

**Submit your bug report** → [New Issue](../../issues/new)

### Suggesting Features

Have an idea? Great! Please:
1. Check existing [Issues](../../issues) to see if it's already suggested
2. Describe the feature clearly with use cases
3. Explain why it would be useful
4. **Submit as [New Issue](../../issues/new) with `[Feature Request]` prefix**

### Contributing Code

#### Style Guidelines
- **Format**: Use consistent indentation (2 spaces)
- **Naming**: Use camelCase for variables and functions
- **Comments**: Add comments for complex logic
- **Testing**: Test on web.whatsapp.com before submitting

#### Pull Request Process

1. **Fork** the repository
2. **Create a branch**: `git checkout -b fix/your-fix-name`
3. **Make changes** and test thoroughly
4. **Commit** with clear messages:
   ```bash
   git commit -m "Fix: describe what you fixed"
   ```
5. **Push** to your fork: `git push origin fix/your-fix-name`
6. **Create a Pull Request** with:
   - Clear description of changes
   - Reference to any related issues (e.g., "Fixes #42")
   - Steps to test your changes

#### Common Issues to Contribute

- **DOM selector updates** — When WhatsApp Web changes, selectors break
- **Keyword list improvements** — Better default keywords
- **UI enhancements** — Popup improvements, better styling
- **Performance** — Optimize extension performance

### Testing Your Changes

Before submitting a PR:
1. Reload the extension from the Extensions page
2. Test both regular chats and groups
3. Test archiving, unarchiving, and "Not an ad" functionality
4. Check the popup settings and keyword management
5. Verify no console errors (open DevTools on web.whatsapp.com)

## Development Tips

### Debugging

```javascript
// Add console logs to manifest.js or content.js
console.log('Debug info:', variable);

// Open DevTools on web.whatsapp.com (F12)
// View extension console:
// - Right-click extension icon → "Manage extension"
// - Or go to chrome://extensions and click extension name
```

### WhatsApp Web Structure

The extension targets:
- Chat list items (main view)
- Message previews
- Archive/unarchive buttons
- Extension popup interface

See comments in the source files for current selectors and logic.

## Limitations & Known Issues

Please review [LIMITATIONS.md](LIMITATIONS.md) before contributing feature requests.

## Need Help?

- **Questions?** Open a [Discussion](../../discussions)
- **Bug help?** Check [existing Issues](../../issues)
- **Can't load extension?** See README's [Install section](README.md#install-takes-1-minute)

## Recognition

Contributors will be recognized in:
- The [Contributors section](#) of this README
- Release notes for included changes
- The repository's contributor graph

---

**Thank you for contributing to WATag!** 🎉
