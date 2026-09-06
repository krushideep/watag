const enabledToggle = document.getElementById("enabledToggle");
const categoriesList = document.getElementById("categoriesList");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const whitelistTags = document.getElementById("whitelistTags");
const whitelistEmpty = document.getElementById("whitelistEmpty");
const statArchived = document.getElementById("statArchived");

const COLOR_PALETTE = ["#2f8f7a", "#c0564f", "#4f7fc0", "#c0964f", "#8a5fc0", "#5fa8c0"];

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

function updateCategory(id, patch) {
  chrome.storage.local.get("categories", (data) => {
    const categories = data.categories || [];
    const next = categories.map((c) => (c.id === id ? { ...c, ...patch } : c));
    chrome.storage.local.set({ categories: next }, refresh);
  });
}

function removeCategory(id) {
  chrome.storage.local.get("categories", (data) => {
    const categories = (data.categories || []).filter((c) => c.id !== id);
    chrome.storage.local.set({ categories }, refresh);
  });
}

function addCategory() {
  chrome.storage.local.get("categories", (data) => {
    const categories = data.categories || [];
    const id = (crypto.randomUUID && crypto.randomUUID()) || `cat-${Date.now()}`;
    const color = COLOR_PALETTE[categories.length % COLOR_PALETTE.length];
    categories.push({ id, name: "New category", color, keywords: [] });
    chrome.storage.local.set({ categories }, refresh);
  });
}

function renderCategories(categories) {
  categoriesList.innerHTML = "";
  categories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "category-card";

    const header = document.createElement("div");
    header.className = "category-header";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.className = "category-color";
    colorInput.value = cat.color || "#2f8f7a";
    colorInput.title = "Badge color";
    colorInput.addEventListener("input", () => updateCategory(cat.id, { color: colorInput.value }));
    header.appendChild(colorInput);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "category-name";
    nameInput.value = cat.name;
    nameInput.addEventListener("change", () => {
      updateCategory(cat.id, { name: nameInput.value.trim() || "Untitled" });
    });
    header.appendChild(nameInput);

    const removeCatBtn = document.createElement("button");
    removeCatBtn.className = "category-remove";
    removeCatBtn.textContent = "✕";
    removeCatBtn.title = "Delete category";
    removeCatBtn.addEventListener("click", () => removeCategory(cat.id));
    header.appendChild(removeCatBtn);

    card.appendChild(header);

    const tags = document.createElement("div");
    tags.className = "tags";
    renderTags(tags, cat.keywords || [], (kw) => {
      updateCategory(cat.id, { keywords: (cat.keywords || []).filter((k) => k !== kw) });
    });
    card.appendChild(tags);

    const addRow = document.createElement("div");
    addRow.className = "add-row";
    const kwInput = document.createElement("input");
    kwInput.type = "text";
    kwInput.placeholder = "add a word or phrase";
    const kwAddBtn = document.createElement("button");
    kwAddBtn.textContent = "Add";

    function addKeywordToCategory() {
      const value = kwInput.value.trim().toLowerCase();
      if (!value) return;
      const keywords = cat.keywords || [];
      if (!keywords.includes(value)) {
        updateCategory(cat.id, { keywords: [...keywords, value] });
      } else {
        kwInput.value = "";
      }
    }

    kwAddBtn.addEventListener("click", addKeywordToCategory);
    kwInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addKeywordToCategory();
    });

    addRow.appendChild(kwInput);
    addRow.appendChild(kwAddBtn);
    card.appendChild(addRow);

    categoriesList.appendChild(card);
  });
}

function refresh() {
  chrome.storage.local.get(["enabled", "categories", "whitelist", "stats"], (data) => {
    enabledToggle.checked = data.enabled !== false;

    renderCategories(data.categories || []);

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

addCategoryBtn.addEventListener("click", addCategory);

chrome.storage.onChanged.addListener(refresh);
refresh();
