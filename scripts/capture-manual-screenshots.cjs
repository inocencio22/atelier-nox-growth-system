const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "manual-assets");
fs.mkdirSync(outputDir, { recursive: true });

const routes = [
  ["dashboard", "http://127.0.0.1:3000/"],
  ["leads", "http://127.0.0.1:3000/leads"],
  ["diagnostic", "http://127.0.0.1:3000/diagnostic"],
  ["propositions", "http://127.0.0.1:3000/propositions"],
  ["messages", "http://127.0.0.1:3000/messages"],
  ["rapports", "http://127.0.0.1:3000/rapports"]
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });

  for (const [name, url] of routes) {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: true });
  }

  await browser.close();
})();
