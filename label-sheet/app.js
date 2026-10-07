// Runs the page: reads the uploaded label, shows the previews, and hooks up
// the Print and Download PDF buttons. Everything happens in the browser.

import { LAYOUT, labelSlots, buildLabelSheet } from "./labels.js";

// The two PDF libraries, loaded from a CDN (a public file server).
// Exact versions, so an update elsewhere can't change how the site behaves.
const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.esm.min.js";
const PDFJS_BASE = "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/";

const FILE_NAME = "labels-A4.pdf";

const $ = (id) => document.getElementById(id);
const fileInput = $("file");
const drop = $("drop");
const message = $("message");
const labelPreview = $("labelPreview");
const labelFrame = $("labelFrame");
const fileName = $("fileName");
const printButton = $("printButton");
const downloadButton = $("downloadButton");
const status = $("status");
const sheet = $("sheet");
const slotsBox = $("slots");
const sheetCanvas = $("sheetCanvas");

let PDFLib;
let pdfjsLib;
const librariesReady = loadLibraries();

let pdfUrl = null; // the finished PDF, ready for Print and Download
let sheetTask = null; // the finished PDF, opened by pdf.js for the preview
let sheetPdf = null;
let labelUrl = null; // the uploaded image, for its preview
let currentJob = 0; // so an older upload can't overwrite a newer one

drawEmptySlots();

async function loadLibraries() {
  try {
    [PDFLib, pdfjsLib] = await Promise.all([
      import(PDF_LIB_URL),
      import(PDFJS_BASE + "legacy/build/pdf.min.mjs"),
    ]);
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_BASE + "legacy/build/pdf.worker.min.mjs";
  } catch (error) {
    console.error(error);
    showError("The page couldn't load its PDF tools. Check your internet connection, then reload the page.");
    throw error;
  }
}

// ---------- Choosing a file ----------

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileInput.value = ""; // lets the same file be chosen again
  if (file) handleFile(file);
});

drop.addEventListener("dragover", (event) => {
  event.preventDefault();
  drop.classList.add("is-dragging");
});
drop.addEventListener("dragleave", () => drop.classList.remove("is-dragging"));
drop.addEventListener("drop", (event) => {
  event.preventDefault();
  drop.classList.remove("is-dragging");
  const file = event.dataTransfer.files[0];
  if (file) handleFile(file);
});
// A file dropped beside the box shouldn't open in the browser and leave the page.
window.addEventListener("dragover", (event) => event.preventDefault());
window.addEventListener("drop", (event) => event.preventDefault());

async function handleFile(file) {
  const job = ++currentJob;
  hideError();
  setStatus("Preparing your labels…");
  setButtons(false);

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let label = { kind: detectKind(bytes), bytes };
    if (!label.kind) {
      throw new FriendlyError(
        `"${file.name}" isn't a supported file. Please choose a PNG, JPG or PDF label.`,
      );
    }
    if (label.kind === "jpg") label = await uprightJpeg(label);

    await librariesReady;
    let pdfBytes;
    try {
      pdfBytes = await buildLabelSheet(PDFLib, label);
    } catch (error) {
      console.error(error);
      if (error?.name === "EncryptedPDFError" || /encrypt/i.test(error?.message)) {
        throw new FriendlyError("This PDF is password-protected. Please upload a version without a password.");
      }
      throw new FriendlyError(`"${file.name}" couldn't be read. The file may be damaged. Please try another one.`);
    }
    if (job !== currentJob) return;

    await showLabelPreview(file, label);
    if (job !== currentJob) return;

    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
    sheetTask?.destroy();
    sheetTask = pdfjsLib.getDocument(pdfjsOptions(pdfBytes));
    sheetPdf = await sheetTask.promise;
    await renderSheet();

    setButtons(true);
    setStatus("");
  } catch (error) {
    if (job !== currentJob) return;
    if (!(error instanceof FriendlyError)) console.error(error);
    clearResult();
    showError(error instanceof FriendlyError ? error.message : "Something went wrong. Please try again.");
    setStatus("");
  }
}

class FriendlyError extends Error {}

// Checks the start of the file itself, not just its name.
function detectKind(bytes) {
  const startsWith = (...values) => values.every((value, i) => bytes[i] === value);
  if (startsWith(0x89, 0x50, 0x4e, 0x47)) return "png";
  if (startsWith(0xff, 0xd8, 0xff)) return "jpg";
  // "%PDF" near the start
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, 1024));
  if (head.includes("%PDF")) return "pdf";
  return null;
}

// Phone photos are often saved sideways with a tag saying how to turn them.
// Turns are applied in the PDF so the original pixels are kept. The rare
// mirrored photo is redrawn upright instead.
async function uprightJpeg(label) {
  const orientation = jpegOrientation(label.bytes);
  const turns = { 3: 180, 6: 270, 8: 90 };
  if (orientation in turns) return { ...label, uprightAngle: turns[orientation] };
  if ([2, 4, 5, 7].includes(orientation)) {
    const image = await loadImage(URL.createObjectURL(new Blob([label.bytes])));
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d").drawImage(image, 0, 0);
    URL.revokeObjectURL(image.src);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    return { kind: "png", bytes: new Uint8Array(await blob.arrayBuffer()) };
  }
  return label;
}

// Reads the EXIF orientation tag (1–8) from a JPEG. 1 means "already upright".
function jpegOrientation(bytes) {
  try {
    return readOrientation(bytes);
  } catch {
    return 1; // unreadable tag: treat the photo as upright
  }
}

function readOrientation(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    const marker = view.getUint16(offset);
    const size = view.getUint16(offset + 2);
    if (marker === 0xffe1 && view.getUint32(offset + 4) === 0x45786966) {
      const tiff = offset + 10; // after "Exif\0\0"
      const little = view.getUint16(tiff) === 0x4949;
      const firstDir = tiff + view.getUint32(tiff + 4, little);
      const entries = view.getUint16(firstDir, little);
      for (let i = 0; i < entries; i++) {
        const entry = firstDir + 2 + i * 12;
        if (view.getUint16(entry, little) === 0x0112) return view.getUint16(entry + 8, little);
      }
      return 1;
    }
    if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break; // image data starts
    offset += 2 + size;
  }
  return 1;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new FriendlyError("This image couldn't be opened. Please try another file."));
    image.src = src;
  });
}

// ---------- Previews ----------

async function showLabelPreview(file, label) {
  if (labelUrl) URL.revokeObjectURL(labelUrl);
  labelUrl = null;
  let preview;
  if (label.kind === "pdf") {
    const task = pdfjsLib.getDocument(pdfjsOptions(label.bytes));
    try {
      const page = await (await task.promise).getPage(1);
      preview = document.createElement("canvas");
      await renderPage(page, preview, 600);
    } finally {
      task.destroy();
    }
  } else {
    labelUrl = URL.createObjectURL(file);
    preview = await loadImage(labelUrl);
  }
  preview.setAttribute("role", "img");
  preview.setAttribute("aria-label", "Your uploaded label");
  if (preview instanceof HTMLImageElement) preview.alt = "Your uploaded label";
  labelFrame.replaceChildren(preview);
  fileName.textContent = file.name;
  labelPreview.hidden = false;
}

// Draws the finished PDF into the A4 preview, sharp on any screen.
async function renderSheet() {
  if (!sheetPdf) return;
  const page = await sheetPdf.getPage(1);
  const pixelWidth = sheet.clientWidth * Math.min(window.devicePixelRatio || 1, 3);
  await renderPage(page, sheetCanvas, pixelWidth);
  sheetCanvas.hidden = false;
  slotsBox.hidden = true;
}

async function renderPage(page, canvas, pixelWidth) {
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: pixelWidth / base.width });
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  await page.render({ canvas, viewport }).promise;
}

function pdfjsOptions(bytes) {
  return {
    data: bytes.slice(), // a copy: pdf.js takes ownership of what it's given
    cMapUrl: PDFJS_BASE + "cmaps/",
    standardFontDataUrl: PDFJS_BASE + "standard_fonts/",
    wasmUrl: PDFJS_BASE + "wasm/",
    iccUrl: PDFJS_BASE + "iccs/",
    isEvalSupported: false,
  };
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderSheet, 200);
});

// The dashed label spaces shown before anything is uploaded, placed from the
// same measurements as the PDF.
function drawEmptySlots() {
  for (const slot of labelSlots()) {
    const box = document.createElement("div");
    box.className = "slot";
    box.style.left = `${(slot.x / LAYOUT.pageWidthPt) * 100}%`;
    box.style.width = `${(slot.width / LAYOUT.pageWidthPt) * 100}%`;
    box.style.bottom = `${(slot.y / LAYOUT.pageHeightPt) * 100}%`;
    box.style.height = `${(slot.height / LAYOUT.pageHeightPt) * 100}%`;
    slotsBox.append(box);
  }
}

// ---------- Print and Download ----------

downloadButton.addEventListener("click", () => {
  if (!pdfUrl) return;
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = FILE_NAME;
  document.body.append(link);
  link.click();
  link.remove();
});

printButton.addEventListener("click", () => {
  if (!pdfUrl) return;
  // Safari (and every browser on iPhone/iPad) can't print a PDF from a
  // hidden frame, so the PDF opens in a new tab to print from there.
  const ua = navigator.userAgent;
  const isAppleTouch = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|chromium|crios|fxios|edg|android).)*safari/i.test(ua);
  if (isSafari || isAppleTouch) {
    window.open(pdfUrl, "_blank");
    setStatus("The PDF opened in a new tab. Press ⌘P (or the Share/Print button) to print it.");
    return;
  }

  // Chrome, Edge and Firefox: load the PDF in a hidden frame and open
  // the print dialog for it.
  $("printFrame")?.remove();
  const frame = document.createElement("iframe");
  frame.id = "printFrame";
  frame.title = "PDF for printing";
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
  frame.addEventListener("load", () => {
    setTimeout(() => {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      } catch {
        window.open(pdfUrl, "_blank");
      }
    }, 250);
  });
  frame.src = pdfUrl;
  document.body.append(frame);
});

// ---------- Small helpers ----------

// Back to the empty page after a failed upload, so nothing old is printed.
function clearResult() {
  if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  pdfUrl = null;
  sheetTask?.destroy();
  sheetTask = null;
  sheetPdf = null;
  sheetCanvas.hidden = true;
  slotsBox.hidden = false;
  labelPreview.hidden = true;
  labelFrame.replaceChildren();
  setButtons(false);
}

function setButtons(enabled) {
  printButton.disabled = !enabled;
  downloadButton.disabled = !enabled;
}

function setStatus(text) {
  status.textContent = text;
}

function showError(text) {
  message.textContent = text;
  message.hidden = false;
}

function hideError() {
  message.hidden = true;
  message.textContent = "";
}
