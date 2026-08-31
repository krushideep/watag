// Minimal mock of WhatsApp Web's row context menu, just enough for
// WATag's content.js to find and click a real "Archive"/"Unfollow"
// menu item via the same selectors it uses on the live site.
(function () {
  const menuLayer = document.getElementById("menuLayer");

  function closeMenu() {
    menuLayer.innerHTML = "";
  }

  function openMenuFor(row, x, y) {
    closeMenu();
    const isChannel = row.classList.contains("is-channel");
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    menu.className = "mock-menu";
    menu.style.left = Math.min(x, window.innerWidth - 220) + "px";
    menu.style.top = Math.min(y, window.innerHeight - 160) + "px";

    const items = isChannel
      ? ["Mute notifications", "Archive chat", "Unfollow channel"]
      : ["Mute notifications", "Archive chat", "Pin chat", "Mark as unread"];

    items.forEach((label) => {
      const item = document.createElement("div");
      item.setAttribute("role", "menuitem");
      item.className = "mock-menu-item";
      item.textContent = label;
      item.addEventListener("click", () => {
        closeMenu();
        if (/archive|unfollow/i.test(label)) {
          row.classList.add("mock-row-leaving");
          setTimeout(() => row.remove(), 260);
        }
      });
      menu.appendChild(item);
    });

    menuLayer.appendChild(menu);
  }

  document.querySelectorAll(".chat-row").forEach((row) => {
    row.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      openMenuFor(row, e.clientX, e.clientY);
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".mock-menu")) closeMenu();
  });
})();
