// Records a demo of WATag running against demo/mock-whatsapp.html.
//
// The real manifest.json only matches https://web.whatsapp.com/*, so it
// won't run on a local test page. Rather than touch the source manifest,
// this script makes a throwaway copy of the extension in a scratch dir,
// widens *that copy's* content-script match to the local demo server, and
// loads the copy into a real Chromium instance via Playwright. The source
// files in the repo are never modified.
import { chromium } from "playwright";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const scratchExtDir = path.resolve(__dirname, ".ext-copy");
const userDataDir = path.resolve(__dirname, ".pw-profile");
const outDir = path.resolve(__dirname, "recording");
// Matches the mock's fixed 420px sidebar exactly, so the frame is just the
// chat list — none of the empty "select a chat" pane to its right.
const size = { width: 420, height: 800 };
const PORT = 8743;
const demoOrigin = `http://127.0.0.1:${PORT}`;

// --- 1. Build a patched copy of the extension for local testing only ---
fs.rmSync(scratchExtDir, { recursive: true, force: true });
fs.mkdirSync(scratchExtDir, { recursive: true });
for (const entry of fs.readdirSync(repoRoot)) {
  if (["demo", ".git", "graphify-out", "node_modules", ".gitignore"].includes(entry)) continue;
  fs.cpSync(path.join(repoRoot, entry), path.join(scratchExtDir, entry), { recursive: true });
}
const manifestPath = path.join(scratchExtDir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.host_permissions.push(`${demoOrigin}/*`);
manifest.content_scripts[0].matches.push(`${demoOrigin}/*`);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// --- 2. Serve demo/mock-whatsapp.* over plain HTTP on 127.0.0.1 ---
const mimeTypes = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const server = http.createServer((req, res) => {
  const reqPath = req.url === "/" ? "/mock-whatsapp.html" : req.url;
  const filePath = path.join(__dirname, path.normalize(reqPath));
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

// --- 3. Launch Chromium with the patched extension loaded ---
fs.rmSync(userDataDir, { recursive: true, force: true });
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

function pause(page, ms) {
  return page.waitForTimeout(ms);
}

// Playwright's synthetic mouse events don't draw an OS cursor, so a
// hover/click shows up in the recording as an instant state change with
// no visible pointer. This injects a fake cursor dot that tracks real
// 'mousemove' events, and drives page.mouse in small interpolated steps
// (with a real delay between them) so its motion is visible on video.
async function attachCursor(page) {
  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.id = "__demoCursor";
    Object.assign(cursor.style, {
      position: "fixed",
      left: "0px",
      top: "0px",
      width: "18px",
      height: "18px",
      marginLeft: "-9px",
      marginTop: "-9px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.9)",
      border: "2px solid rgba(0,0,0,0.65)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
      zIndex: 999999,
      pointerEvents: "none",
      transition: "transform 0.08s ease",
    });
    document.body.appendChild(cursor);
    window.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }, true);
    window.addEventListener("mousedown", () => { cursor.style.transform = "scale(0.7)"; }, true);
    window.addEventListener("mouseup", () => { cursor.style.transform = "scale(1)"; }, true);
  });

  let pos = { x: 20, y: 20 };
  return {
    async moveTo(x, y, { duration = 450, steps = 24 } = {}) {
      const { x: startX, y: startY } = pos;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        await page.mouse.move(startX + (x - startX) * t, startY + (y - startY) * t);
        await page.waitForTimeout(duration / steps);
      }
      pos = { x, y };
    },
    async click(x, y) {
      await this.moveTo(x, y);
      await page.mouse.down();
      await page.waitForTimeout(90);
      await page.mouse.up();
    },
  };
}

async function centerOf(locator) {
  const box = await locator.boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

function hoverRow(page, cursor, name) {
  return (async () => {
    const row = page.locator(`.chat-row:has(span[title="${name}"])`);
    await row.scrollIntoViewIfNeeded();
    const { x, y } = await centerOf(row);
    await cursor.moveTo(x, y);
    return row;
  })();
}

async function clickButton(cursor, row, selector) {
  const btn = row.locator(selector);
  const { x, y } = await centerOf(btn);
  await cursor.click(x, y);
}

const context = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  viewport: size,
  recordVideo: { dir: path.join(outDir, "main"), size },
  args: [
    `--disable-extensions-except=${scratchExtDir}`,
    `--load-extension=${scratchExtDir}`,
  ],
});

let sw = context.serviceWorkers()[0];
if (!sw) sw = await context.waitForEvent("serviceworker", { timeout: 15000 });
const extensionId = new URL(sw.url()).host;

const page = await context.newPage();
await page.goto(`${demoOrigin}/mock-whatsapp.html`);
const cursor = await attachCursor(page);
await pause(page, 1500); // let the content script's initial scan + badge injection settle

let badgeCount = await page.locator(".watag-badge").count();
console.log("Flagged rows:", badgeCount);
if (badgeCount === 0) throw new Error("No rows were flagged — extension did not activate on the mock page.");

await pause(page, 700);

// 1. Hover a flagged promotional chat, then Archive it.
let row = await hoverRow(page, cursor, "SBI Alerts");
await pause(page, 900);
await clickButton(cursor, row, ".watag-btn--archive");
await pause(page, 2000); // toast + row fade-out

// 2. Hover another flagged promotional chat, then Archive it too.
row = await hoverRow(page, cursor, "Zomato Offers");
await pause(page, 800);
await clickButton(cursor, row, ".watag-btn--archive");
await pause(page, 2000);

// 3. Hover another flagged chat and dismiss it as "Not an ad" (whitelist flow).
row = await hoverRow(page, cursor, "MyntraDeals");
await pause(page, 800);
await clickButton(cursor, row, ".watag-btn--dismiss");
await pause(page, 1200);

await pause(page, 800);
await page.close();

// 4. Separate short clip: open the popup UI directly and create a category live.
const popupPage = await context.newPage();
await popupPage.setViewportSize({ width: 340, height: 560 });
await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);
const popupCursor = await attachCursor(popupPage);
await pause(popupPage, 1000);

const addCategoryBtn = popupPage.locator("#addCategoryBtn");
const addCategoryPos = await centerOf(addCategoryBtn);
await popupCursor.moveTo(addCategoryPos.x, addCategoryPos.y);
await popupCursor.click(addCategoryPos.x, addCategoryPos.y);
await pause(popupPage, 500);

const newCard = popupPage.locator(".category-card").last();
const nameInput = newCard.locator(".category-name");
const namePos = await centerOf(nameInput);
await popupCursor.moveTo(namePos.x, namePos.y);
await nameInput.click();
await nameInput.fill("Spam");
await nameInput.dispatchEvent("change");
await pause(popupPage, 400);

const kwInput = newCard.locator(".add-row input");
const kwPos = await centerOf(kwInput);
await popupCursor.moveTo(kwPos.x, kwPos.y);
await kwInput.click();
await kwInput.fill("subscribe now");
await pause(popupPage, 300);

const kwAddBtn = newCard.locator(".add-row button");
const kwAddPos = await centerOf(kwAddBtn);
await popupCursor.click(kwAddPos.x, kwAddPos.y);
await pause(popupPage, 1400);
await popupPage.close();

// 5. Third clip: reopen the chat list — "Weekly Digest" (which matches the
// new "Spam" category's keyword) now carries that category's own badge
// color alongside the default "Ads" badges on the other flagged chats.
const revealPage = await context.newPage();
await revealPage.goto(`${demoOrigin}/mock-whatsapp.html`);
const revealCursor = await attachCursor(revealPage);
await pause(revealPage, 1500); // initial scan + badge injection settle

await hoverRow(revealPage, revealCursor, "Weekly Digest");
await pause(revealPage, 1600);
await revealPage.close();

await context.close();
server.close();
fs.rmSync(scratchExtDir, { recursive: true, force: true });
fs.rmSync(userDataDir, { recursive: true, force: true });

console.log("Recorded videos in", outDir);
for (const sub of fs.readdirSync(outDir)) {
  const files = fs.readdirSync(path.join(outDir, sub));
  console.log(sub, "->", files);
}
