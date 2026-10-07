// The exact A4 layout and the PDF builder.
//
// Every measurement on the sheet lives in LAYOUT below, in millimetres.
// buildLabelSheet() turns one label (PNG, JPG or PDF) into a one-page A4 PDF
// with 6 copies. It runs in the browser; the test script runs it in Node too,
// which is why the pdf-lib library is passed in instead of imported here.

export const LAYOUT = {
  pageWidthPt: 595.28, // A4 = 210 × 297 mm, the standard PDF size in points
  pageHeightPt: 841.89,
  labelWidthMm: 101.6, // 4 in
  labelHeightMm: 76.2, // 3 in
  columns: 2,
  rows: 3,
  sideMarginMm: 2.4, // left and right
  columnGapMm: 2, // between the two columns; rows touch (no gap)
  topMarginMm: 34.2, // the bottom margin is the same, so the grid is centred
  borderPt: 0.75, // 1 px
};

const PT_PER_MM = 72 / 25.4;
const mm = (value) => value * PT_PER_MM;

// The 6 label rectangles in PDF points. PDF measures from the bottom-left
// corner of the page, so y is the label's bottom edge.
// Order: left to right, top to bottom.
export function labelSlots(layout = LAYOUT) {
  const slots = [];
  const w = mm(layout.labelWidthMm);
  const h = mm(layout.labelHeightMm);
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.columns; col++) {
      const leftMm = layout.sideMarginMm + col * (layout.labelWidthMm + layout.columnGapMm);
      const topMm = layout.topMarginMm + row * layout.labelHeightMm;
      slots.push({
        x: mm(leftMm),
        y: layout.pageHeightPt - mm(topMm + layout.labelHeightMm),
        width: w,
        height: h,
      });
    }
  }
  return slots;
}

// The label outlines as single lines, so an edge shared by two touching
// labels is drawn once (one line, never a double-thick one).
// Each column gets 2 vertical lines and rows + 1 horizontal lines.
export function borderLines(layout = LAYOUT) {
  const slots = labelSlots(layout);
  const lines = [];
  for (let col = 0; col < layout.columns; col++) {
    const column = slots.filter((_, i) => i % layout.columns === col);
    const left = column[0].x;
    const right = left + column[0].width;
    const top = column[0].y + column[0].height;
    const bottom = column[column.length - 1].y;
    lines.push({ start: { x: left, y: bottom }, end: { x: left, y: top } });
    lines.push({ start: { x: right, y: bottom }, end: { x: right, y: top } });
    for (let row = 0; row <= layout.rows; row++) {
      const y = top - row * column[0].height;
      lines.push({ start: { x: left, y }, end: { x: right, y } });
    }
  }
  return lines;
}

// Where to draw a picture of natW × natH, turned `angle` degrees
// counter-clockwise (0, 90, 180 or 270), so it fits inside the slot as large
// as possible without stretching or cropping, centred. pdf-lib turns a
// drawing around its bottom-left corner, so x/y are moved to make up for it.
export function fitInSlot(natW, natH, angle, slot) {
  const turned = angle % 180 !== 0;
  const footW = turned ? natH : natW;
  const footH = turned ? natW : natH;
  const scale = Math.min(slot.width / footW, slot.height / footH);
  const width = natW * scale;
  const height = natH * scale;
  const left = slot.x + (slot.width - footW * scale) / 2;
  const bottom = slot.y + (slot.height - footH * scale) / 2;
  const corner = {
    0: { x: left, y: bottom },
    90: { x: left + height, y: bottom },
    180: { x: left + width, y: bottom + height },
    270: { x: left, y: bottom + width },
  }[angle];
  return { ...corner, width, height, angle };
}

// How far (counter-clockwise) to turn the label in the PDF:
// `uprightAngle` first stands the file the right way up (from a PDF's page
// rotation or a phone photo's orientation tag). Then, if the label is
// portrait, it is turned 90° clockwise to fit the landscape label space.
export function labelAngle(natW, natH, uprightAngle = 0) {
  const turned = uprightAngle % 180 !== 0;
  const shownW = turned ? natH : natW;
  const shownH = turned ? natW : natH;
  const portrait = shownH > shownW;
  return (uprightAngle + (portrait ? 270 : 0)) % 360;
}

// label = { kind: "png" | "jpg" | "pdf", bytes: Uint8Array,
//           uprightAngle?: 0 | 90 | 180 | 270 (images only) }
// Returns the finished PDF as a Uint8Array.
export async function buildLabelSheet(PDFLib, label, layout = LAYOUT) {
  const { PDFDocument, degrees, rgb, LineCapStyle } = PDFLib;
  const doc = await PDFDocument.create();
  doc.setTitle("Labels A4");
  doc.setCreator("Label Sheet");
  const page = doc.addPage([layout.pageWidthPt, layout.pageHeightPt]);

  // Ask PDF viewers to print at actual size instead of "fit to page".
  const prefs = doc.catalog.getOrCreateViewerPreferences();
  prefs.setPrintScaling(PDFLib.PrintScaling.None);

  let art; // the embedded label, drawn 6 times
  let natW;
  let natH;
  let uprightAngle = 0;
  let draw;

  if (label.kind === "pdf") {
    // A PDF stays vector: its first page is copied in, not turned into pixels.
    const source = await PDFDocument.load(label.bytes);
    const sourcePage = source.getPage(0);
    const box = sourcePage.getCropBox(); // the visible part of the page
    art = await doc.embedPage(sourcePage, {
      left: box.x,
      bottom: box.y,
      right: box.x + box.width,
      top: box.y + box.height,
    });
    natW = box.width;
    natH = box.height;
    // A PDF page can be marked "show turned N° clockwise".
    uprightAngle = (360 - (((sourcePage.getRotation().angle % 360) + 360) % 360)) % 360;
    draw = (options) => page.drawPage(art, options);
  } else {
    // Images keep their original pixels (no re-compression).
    art = label.kind === "png" ? await doc.embedPng(label.bytes) : await doc.embedJpg(label.bytes);
    natW = art.width;
    natH = art.height;
    uprightAngle = label.uprightAngle ?? 0;
    draw = (options) => page.drawImage(art, options);
  }

  const angle = labelAngle(natW, natH, uprightAngle);
  for (const slot of labelSlots(layout)) {
    const spot = fitInSlot(natW, natH, angle, slot);
    draw({ x: spot.x, y: spot.y, width: spot.width, height: spot.height, rotate: degrees(spot.angle) });
  }

  // Outlines go on top, centred on the label edges. Square line ends close
  // the corners neatly.
  for (const line of borderLines(layout)) {
    page.drawLine({
      ...line,
      thickness: layout.borderPt,
      color: rgb(0, 0, 0),
      lineCap: LineCapStyle.Projecting,
    });
  }

  return doc.save();
}
