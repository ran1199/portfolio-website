// End-to-end test: opens the real page in a headless Chrome, uploads each
// sample label, clicks Download PDF and checks the file with check-pdf.mjs.
//
//   cd tests && npm install && npm test
//
// The CDN is answered from the local node_modules copies of the same library
// versions, so the test also works without internet access.

import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { checkSheet } from "./check-pdf.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const site = resolve(here, "..");
const fixtures = join(here, "fixtures");
const output = join(here, "output");
await mkdir(output, { recursive: true });

const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".wasm": "application/wasm",
};

// A tiny local web server for the site folder
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(site, path.endsWith("/") ? path + "index.html" : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const siteUrl = `http://127.0.0.1:${server.address().port}/`;

const CASES = [
  { file: "landscape.png", expect: { angle: 0, vector: false, pixels: { w: 1600, h: 900 } } },
  { file: "portrait.jpg", expect: { angle: 270, vector: false, pixels: { w: 1000, h: 1500 } } },
  { file: "label.pdf", expect: { angle: 0, vector: true } },
  // Extra cases: a sideways-stored phone photo, and a PDF page marked as turned
  { file: "phone-photo-exif6.jpg", expect: { angle: 180, vector: false, pixels: { w: 1200, h: 900 } } },
  { file: "rotated-page.pdf", expect: { angle: 270, vector: true } },
];

const browser = await chromium.launch();
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 860 } });
await context.route("https://cdn.jsdelivr.net/npm/**", async (route) => {
  const { pathname } = new URL(route.request().url());
  const local = pathname.replace(/^\/npm\/((?:@[^/]+\/)?[^@/]+)@[^/]+/, "$1");
  try {
    const body = await readFile(join(here, "node_modules", local));
    await route.fulfill({
      body,
      headers: { "Content-Type": TYPES[extname(local)] ?? "application/octet-stream", "Access-Control-Allow-Origin": "*" },
    });
  } catch {
    await route.fulfill({ status: 404, body: "missing " + local });
  }
});

const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (msg) => { if (process.env.DEBUG) console.log("  [console]", msg.type(), msg.text()); if (msg.type() === "error") pageErrors.push(msg.text()); });
await page.goto(siteUrl);

let failures = 0;

// Waits until the PDF is ready, or reports the page's error message.
async function finished() {
  const ready = page.locator("#downloadButton:not([disabled])");
  const error = page.locator("#message:not([hidden])");
  await ready.or(error).first().waitFor({ timeout: 20000 });
  if (await ready.isVisible()) return true;
  report(false, `upload failed: ${await error.textContent()}`);
  return false;
}
const report = (ok, text) => {
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ${text}`);
};

report(await page.locator("#printButton").isDisabled(), "buttons start disabled");
report((await page.locator(".slot").count()) === 6, "empty A4 preview shows 6 label spaces");

for (const { file, expect } of CASES) {
  console.log(`\n— ${file}`);
  await page.setInputFiles("#file", join(fixtures, file));
  if (!(await finished())) continue;
  report(await page.locator("#labelPreview").isVisible(), "label preview is shown");
  report(await page.locator("#sheetCanvas").isVisible(), "A4 preview is drawn");

  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#downloadButton")]);
  report(download.suggestedFilename() === "labels-A4.pdf", `file name is labels-A4.pdf (${download.suggestedFilename()})`);
  const saved = join(output, file.replace(/\.\w+$/, "") + "-labels-A4.pdf");
  await download.saveAs(saved);
  const result = await checkSheet(await readFile(saved), expect);
  for (const c of result.checks) if (!c.ok) report(false, c.text);
  report(result.ok, `PDF passes all ${result.checks.length} layout checks`);
  await page.screenshot({ path: join(output, file.replace(/\.\w+$/, "") + "-screen.png") });
}

// Print uses the very same PDF as Download
console.log("\n— Print");
await page.click("#printButton");
const frame = page.locator("#printFrame");
await frame.waitFor({ state: "attached" });
const same = await page.evaluate(async () => {
  const frameUrl = document.getElementById("printFrame").src;
  return frameUrl.startsWith("blob:") && (await (await fetch(frameUrl)).arrayBuffer()).byteLength > 0;
});
report(same, "Print loads the generated PDF for the print dialog");

// Drag and drop
console.log("\n— Drag and drop");
const pngBase64 = (await readFile(join(fixtures, "landscape.png"))).toString("base64");
await page.evaluate((data) => {
  const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const transfer = new DataTransfer();
  transfer.items.add(new File([bytes], "dropped.png", { type: "image/png" }));
  document.getElementById("drop").dispatchEvent(new DragEvent("drop", { dataTransfer: transfer, bubbles: true, cancelable: true }));
}, pngBase64);
await page.locator("#fileName", { hasText: "dropped.png" }).waitFor({ timeout: 20000 });
report(true, "a dropped file is accepted");

// Unsupported file
console.log("\n— Unsupported file");
await page.setInputFiles("#file", join(fixtures, "notes.txt"));
await page.locator("#message").waitFor({ state: "visible" });
const errorText = await page.locator("#message").textContent();
report(/isn't a supported file/.test(errorText), `friendly error: "${errorText}"`);
report(await page.locator("#printButton").isDisabled(), "buttons are disabled after the error");

// Phone width: panels stack and nothing scrolls sideways
console.log("\n— Phone layout");
await page.setInputFiles("#file", join(fixtures, "portrait.jpg"));
await finished();
await page.setViewportSize({ width: 375, height: 800 });
await page.waitForTimeout(400);
const layout = await page.evaluate(() => {
  const left = document.querySelector(".controls").getBoundingClientRect();
  const right = document.querySelector(".sheet-panel").getBoundingClientRect();
  return { stacked: right.top >= left.bottom - 1, sideways: document.documentElement.scrollWidth > window.innerWidth };
});
report(layout.stacked, "panels stack on a phone");
report(!layout.sideways, "no sideways scrolling on a phone");
await page.screenshot({ path: join(output, "phone.png"), fullPage: true });

report(pageErrors.length === 0, `no errors in the browser console${pageErrors.length ? ": " + pageErrors.join(" | ") : ""}`);

await browser.close();
server.close();
console.log(failures ? `\n${failures} check(s) failed.` : "\nAll tests passed.");
process.exit(failures ? 1 : 0);
