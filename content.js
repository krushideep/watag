// WATag — content script for web.whatsapp.com
// Flags likely-promotional chats/channels in the chat list and injects
// one-click Archive / Unfollow controls.
//
// WhatsApp Web's DOM uses obfuscated, frequently-changing class names, so
// this script deliberately avoids relying on them. It matches on stable
// signals instead: aria-label text, role attributes, and visible text.
// When an automated action can't find every step (WhatsApp shipped a UI
// change), it falls back to opening the right menu and highlighting the
// right item so you finish with one extra click instead of hunting for it.

(() => {
  // Flat, filled icons sharing one design language: a solid currentColor shape
  // with a cutout accent punched out via fill-rule="evenodd" (no strokes).
  const ICONS = {
    // Archive: solid box with a rounded lid and a download-arrow cutout.
    archive:
      '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path fill-rule="evenodd" d="M3 3h18v4H3zM4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9zM11 11h2v4h3l-4 4-4-4h3z"></path></svg>',
    // "Untag": solid price-tag shape with a diagonal cutout slash.
    notAnAd:
      '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path fill-rule="evenodd" d="M21.41 11.41L12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.82 8.82a2 2 0 0 0 2.83 0l7.17-7.17a2 2 0 0 0 0-2.83zM1 21L3 23L23 3L21 1Z"></path></svg>',
  };

  const STATE = {
    enabled: true,
    keywords: [],
    whitelist: [],
    processed: new WeakSet(),
    settingsLoaded: false,
  };

  const SPONSORED_MARKERS = ["Sponsored", "sponsored"];

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function waitFor(fn, { timeout = 2000, interval = 100 } = {}) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const result = fn();
      if (result) return result;
      await sleep(interval);
    }
    return null;
  }

  function loadSettings() {
    chrome.storage.local.get(["enabled", "keywords", "whitelist"], (data) => {
      STATE.enabled = data.enabled !== false;
      STATE.keywords = (data.keywords || []).map((k) => k.toLowerCase());
      STATE.whitelist = data.whitelist || [];
      STATE.settingsLoaded = true;
      console.log("[WATag] settings loaded — enabled:", STATE.enabled, "keywords:", STATE.keywords);
      rescan();
    });
  }

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) STATE.enabled = changes.enabled.newValue !== false;
    if (changes.keywords) STATE.keywords = (changes.keywords.newValue || []).map((k) => k.toLowerCase());
    if (changes.whitelist) STATE.whitelist = changes.whitelist.newValue || [];
    // Settings changed the classification rules — re-evaluate every row.
    STATE.processed = new WeakSet();
    document.querySelectorAll(".watag-badge").forEach((b) => b.remove());
    rescan();
  });

  function bumpStat(stat) {
    chrome.runtime.sendMessage({ type: "BUMP_STAT", stat }).catch(() => {});
  }

  function getRowKey(row) {
    const titleEl = row.querySelector('span[title]');
    return titleEl ? titleEl.getAttribute("title") : row.innerText.slice(0, 60);
  }

  function isWhitelisted(key) {
    return STATE.whitelist.includes(key);
  }

  function classify(row) {
    const text = row.innerText || "";
    const isSponsoredChannel = SPONSORED_MARKERS.some((m) => text.includes(m));
    if (isSponsoredChannel) return { flagged: true, kind: "channel", reason: "Sponsored" };

    const lower = text.toLowerCase();
    const hit = STATE.keywords.find((kw) => kw && lower.includes(kw));
    if (hit) return { flagged: true, kind: "chat", reason: hit };

    return { flagged: false };
  }

  function findChatRows() {
    // Primary: WhatsApp's stable-ish test id for a chat row container.
    let rows = Array.from(document.querySelectorAll('[data-testid="cell-frame-container"]'));
    if (rows.length === 0) {
      // Fallback: generic listitem rows inside any list/grid pane.
      rows = Array.from(document.querySelectorAll('div[role="listitem"]'));
    }
    return rows;
  }

  async function revealRowMenuButton(row) {
    // The kebab / context-menu button is usually only rendered on hover.
    row.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    row.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await sleep(120);
    let btn = row.querySelector('[aria-label*="menu" i], [aria-label*="options" i], [data-testid="mi-context-menu"]');
    if (!btn) {
      // Try the row's action column, often the last child button.
      const buttons = row.querySelectorAll("button");
      btn = buttons[buttons.length - 1] || null;
    }
    return btn;
  }

  function findOpenMenu() {
    return document.querySelector('ul[role="menu"], div[role="menu"]');
  }

  function findMenuItemByText(menu, textFragments) {
    const items = Array.from(menu.querySelectorAll('li, div[role="button"], [role="menuitem"]'));
    return items.find((el) => {
      const t = (el.innerText || "").trim().toLowerCase();
      return textFragments.some((frag) => t.includes(frag));
    });
  }

  async function openContextMenu(row) {
    // Right-click is the most reliable way to reach WhatsApp's own chat
    // menu: it fires a real 'contextmenu' event that WhatsApp's React
    // handlers respond to directly, unlike CSS :hover state (which
    // synthetic mouse events don't reliably trigger).
    const rect = row.getBoundingClientRect();
    row.dispatchEvent(new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + 24,
      clientY: rect.top + rect.height / 2,
    }));
    let menu = await waitFor(findOpenMenu, { timeout: 800 });
    if (menu) return menu;

    // Fallback: hover to reveal the kebab (⋮) button, then click it.
    const menuBtn = await revealRowMenuButton(row);
    if (!menuBtn) return null;
    menuBtn.click();
    menu = await waitFor(findOpenMenu, { timeout: 1500 });
    return menu;
  }

  async function performAction(row, action) {
    const menu = await openContextMenu(row);
    if (!menu) return { ok: false, stage: "menu-open" };

    const labelMap = {
      archive: ["archive"],
      unfollow: ["unfollow"],
    };
    const target = findMenuItemByText(menu, labelMap[action]);
    if (!target) return { ok: false, stage: "menu-item", menu };
    target.click();

    return { ok: true };
  }

  function showToast(message, tone = "ok") {
    let toast = document.getElementById("watag-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "watag-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `watag-toast watag-toast--${tone}`;
    toast.style.opacity = "1";
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.style.opacity = "0";
    }, 3200);
  }

  async function handleAction(row, badge, action, statKey) {
    badge.querySelectorAll("button").forEach((b) => (b.disabled = true));
    const result = await performAction(row, action);
    console.log(`[WATag] ${action} result:`, result);
    if (result.ok) {
      bumpStat(statKey);
      showToast(`Done — ${action === "unfollow" ? "unfollowed" : action + "d"}. This will sync to your phone.`, "ok");
      badge.remove();
    } else if (result.stage === "menu-item" && result.menu) {
      // Partial automation: menu is open, highlight nothing further we can
      // find automatically — leave it open for a manual finish.
      showToast("WhatsApp's menu changed — opened it for you, pick the option manually this once.", "warn");
      badge.querySelectorAll("button").forEach((b) => (b.disabled = false));
    } else {
      showToast("Couldn't complete that automatically — please use WhatsApp's own menu for this chat.", "warn");
      badge.querySelectorAll("button").forEach((b) => (b.disabled = false));
    }
  }

  function injectBadge(row, info) {
    if (row.querySelector(".watag-badge")) return;

    const key = getRowKey(row);
    const badge = document.createElement("div");
    badge.className = "watag-badge";
    badge.title = `Flagged: ${info.reason}`;

    if (info.kind === "channel") {
      const label = document.createElement("span");
      label.className = "watag-label";
      label.textContent = "Sponsored";
      badge.appendChild(label);
    }

    const archiveBtn = document.createElement("button");
    archiveBtn.innerHTML = ICONS.archive;
    archiveBtn.title = "Archive";
    archiveBtn.setAttribute("aria-label", "Archive");
    archiveBtn.className = "watag-btn watag-btn--archive";
    archiveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      handleAction(row, badge, "archive", "archived");
    });
    badge.appendChild(archiveBtn);

    if (info.kind === "channel") {
      const unfollowBtn = document.createElement("button");
      unfollowBtn.textContent = "Unfollow";
      unfollowBtn.className = "watag-btn watag-btn--unfollow";
      unfollowBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        handleAction(row, badge, "unfollow", "unfollowed");
      });
      badge.appendChild(unfollowBtn);
    }

    const dismissBtn = document.createElement("button");
    dismissBtn.innerHTML = ICONS.notAnAd;
    dismissBtn.title = "Not an ad";
    dismissBtn.setAttribute("aria-label", "Not an ad");
    dismissBtn.className = "watag-btn watag-btn--dismiss";
    dismissBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      chrome.storage.local.get("whitelist", (data) => {
        const list = data.whitelist || [];
        if (!list.includes(key)) list.push(key);
        chrome.storage.local.set({ whitelist: list });
      });
      badge.remove();
    });
    badge.appendChild(dismissBtn);

    row.style.position = row.style.position || "relative";
    row.appendChild(badge);
  }

  function rescan() {
    if (!STATE.settingsLoaded) {
      // Settings haven't arrived from storage yet — scanning now would
      // classify rows with an empty keyword list and permanently mark
      // them "already checked" via STATE.processed, before we ever get
      // a chance to check them properly. Wait for loadSettings() instead.
      return;
    }
    if (!STATE.enabled) {
      console.log("[WATag] disabled — skipping scan");
      document.querySelectorAll(".watag-badge").forEach((b) => b.remove());
      return;
    }
    const rows = findChatRows();
    let flaggedCount = 0;
    let errorCount = 0;
    for (const row of rows) {
      if (STATE.processed.has(row)) continue;
      try {
        const key = getRowKey(row);
        if (isWhitelisted(key)) continue;
        const info = classify(row);
        if (info.flagged) {
          flaggedCount++;
          injectBadge(row, info);
        }
      } catch (err) {
        errorCount++;
        console.error("[WATag] error processing a row:", err);
      }
      STATE.processed.add(row);
    }
    console.log(`[WATag] scan complete — rows seen: ${rows.length}, newly flagged: ${flaggedCount}, errors: ${errorCount}`);
  }

  const observer = new MutationObserver(() => {
    clearTimeout(observer._debounce);
    observer._debounce = setTimeout(rescan, 300);
  });

  function start() {
    observer.observe(document.body, { childList: true, subtree: true });
    loadSettings();
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    window.addEventListener("DOMContentLoaded", start);
  }
})();
