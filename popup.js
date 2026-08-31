const enabledToggle = document.getElementById("enabledToggle");
const keywordTags = document.getElementById("keywordTags");
const keywordInput = document.getElementById("keywordInput");
const keywordAdd = document.getElementById("keywordAdd");
const whitelistTags = document.getElementById("whitelistTags");
const whitelistEmpty = document.getElementById("whitelistEmpty");
const statArchived = document.getElementById("statArchived");

function renderTags(container, items, onRemove) {
  container.innerHTML = "";
  items.forEach((item) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    const label = document.createElement("span");
    label.textContent = item;
    tag.appendChild(label);
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => onRemove(item));
    tag.appendChild(removeBtn);
    container.appendChild(tag);
  });
}

function refresh() {
  chrome.storage.local.get(["enabled", "keywords", "whitelist", "stats"], (data) => {
    enabledToggle.checked = data.enabled !== false;

    const keywords = data.keywords || [];
    renderTags(keywordTags, keywords, (item) => {
      const next = keywords.filter((k) => k !== item);
      chrome.storage.local.set({ keywords: next }, refresh);
    });

    const whitelist = data.whitelist || [];
    whitelistEmpty.style.display = whitelist.length ? "none" : "block";
    renderTags(whitelistTags, whitelist, (item) => {
      const next = whitelist.filter((w) => w !== item);
      chrome.storage.local.set({ whitelist: next }, refresh);
    });

    const stats = data.stats || { archived: 0 };
    statArchived.textContent = stats.archived || 0;
  });
}

enabledToggle.addEventListener("change", () => {
  chrome.storage.local.set({ enabled: enabledToggle.checked });
});

function addKeyword() {
  const value = keywordInput.value.trim().toLowerCase();
  if (!value) return;
  chrome.storage.local.get("keywords", (data) => {
    const keywords = data.keywords || [];
    if (!keywords.includes(value)) keywords.push(value);
    chrome.storage.local.set({ keywords }, () => {
      keywordInput.value = "";
      refresh();
    });
  });
}

keywordAdd.addEventListener("click", addKeyword);
keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addKeyword();
});

chrome.storage.onChanged.addListener(refresh);
refresh();
