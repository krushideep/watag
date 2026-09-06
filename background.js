const DEFAULT_CATEGORIES = [
  {
    id: "ads",
    name: "Ads",
    color: "#2f8f7a",
    keywords: [
      "% off", "sale", "discount", "offer", "buy now", "shop now",
      "limited time", "flash sale", "deal", "promo code", "free shipping",
      "order now", "click here", "cashback", "coupon", "clearance"
    ]
  }
];

const DEFAULTS = {
  enabled: true,
  categories: DEFAULT_CATEGORIES,
  whitelist: [],
  stats: { archived: 0 }
};

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(["enabled", "categories", "keywords", "whitelist", "stats"]);
  const toSet = {};

  if (existing.enabled === undefined) toSet.enabled = DEFAULTS.enabled;
  if (existing.whitelist === undefined) toSet.whitelist = DEFAULTS.whitelist;
  if (existing.stats === undefined) toSet.stats = DEFAULTS.stats;

  if (existing.categories === undefined) {
    if (Array.isArray(existing.keywords) && existing.keywords.length) {
      // Pre-categories installs stored a flat "keywords" list — fold it
      // into a single "Ads" category instead of losing it.
      toSet.categories = [{ id: "ads", name: "Ads", color: "#2f8f7a", keywords: existing.keywords }];
    } else {
      toSet.categories = DEFAULT_CATEGORIES;
    }
  }

  if (Object.keys(toSet).length) {
    await chrome.storage.local.set(toSet);
  }
  if (existing.keywords !== undefined) {
    await chrome.storage.local.remove("keywords");
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
