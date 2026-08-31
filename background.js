const DEFAULTS = {
  enabled: true,
  keywords: [
    "% off", "sale", "discount", "offer", "buy now", "shop now",
    "limited time", "flash sale", "deal", "promo code", "free shipping",
    "order now", "click here", "cashback", "coupon", "clearance"
  ],
  whitelist: [],
  stats: { archived: 0, unfollowed: 0 }
};

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(Object.keys(DEFAULTS));
  const toSet = {};
  for (const key of Object.keys(DEFAULTS)) {
    if (existing[key] === undefined) toSet[key] = DEFAULTS[key];
  }
  if (Object.keys(toSet).length) {
    await chrome.storage.local.set(toSet);
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "BUMP_STAT") {
    chrome.storage.local.get("stats").then(({ stats }) => {
      const next = { ...(stats || DEFAULTS.stats) };
      next[msg.stat] = (next[msg.stat] || 0) + 1;
      chrome.storage.local.set({ stats: next }).then(() => sendResponse(next));
    });
    return true; // async response
  }
});
