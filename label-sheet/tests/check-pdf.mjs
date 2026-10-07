// Checks a finished labels-A4.pdf against the exact layout.
//
//   node tests/check-pdf.mjs path/to/labels-A4.pdf
//
// It doesn't reuse the site's layout code: the expected numbers are written
// out again here from the spec, and the PDF's drawing instructions are read
// and replayed directly, so a mistake in the site can't hide itself.

import { readFileSync } from "node:fs";
import { PDFDocument, PDFName, PDFArray, PDFRawStream, decodePDFRawStream } from "pdf-lib";

const PT = 72 / 25.4; // points per millimetre
const TOLERANCE = 0.01; // points (1/7000 of an inch)

// The spec, in millimetres
const SPEC = {
  page: { width: 595.28, height: 841.89 },
  label: { width: 101.6, height: 76.2 },
  lefts: [2.4, 2.4 + 101.6 + 2], // column left edges
  tops: [34.2, 34.2 + 76.2, 34.2 + 2 * 76.2], // row top edges, from the page top
  border: 0.75,
};

export function expectedSlots() {
  const slots = [];
  for (const top of SPEC.tops) {
    for (const left of SPEC.lefts) {
      slots.push({
        left: left * PT,
        right: (left + SPEC.label.width) * PT,
        top: SPEC.page.height - top * PT,
        bottom: SPEC.page.height - (top + SPEC.label.height) * PT,
      });
    }
  }
  return slots;
}

const near = (a, b, tol = TOLERANCE) => Math.abs(a - b) <= tol;
const fmt = (n) => n.toFixed(3);

// Returns { ok, checks: [{ ok, text }], placements, angle }
export async function checkSheet(bytes, expect = {}) {
  const checks = [];
  const check = (ok, text) => checks.push({ ok: Boolean(ok), text });

  const doc = await PDFDocument.load(bytes);
  check(doc.getPageCount() === 1, `1 page (found ${doc.getPageCount()})`);
  const page = doc.getPage(0);
  const media = page.getMediaBox();
  check(
    media.x === 0 && media.y === 0 && near(media.width, 595.28, 0.001) && near(media.height, 841.89, 0.001),
    `page is A4, 595.28 × 841.89 pt (found ${media.width} × ${media.height} at ${media.x},${media.y})`,
  );
  const crop = page.getCropBox();
  check(
    crop.x === media.x && crop.y === media.y && crop.width === media.width && crop.height === media.height,
    "nothing trims the page (crop box = page)",
  );
  check(page.getRotation().angle % 360 === 0, "page is not rotated");

  const ops = parseOperators(contentBytes(page));
  const { draws, strokes } = replay(ops);
  const xobjects = page.node.Resources().lookup(PDFName.of("XObject"));

  // ---- The 6 labels ----
  check(draws.length === 6, `exactly 6 labels drawn (found ${draws.length})`);
  const stored = new Set(draws.map((d) => String(xobjects.get(PDFName.of(d.name)))));
  check(stored.size === 1, "all 6 show the same uploaded label, stored once in the file");

  const slots = expectedSlots();
  const used = new Set();
  const placements = [];
  for (const draw of draws) {
    const object = xobjects.lookup(PDFName.of(draw.name));
    const subtype = object.dict.get(PDFName.of("Subtype")).asString();
    // The label's own rectangle, in its own units
    let corners;
    let natural;
    if (subtype === "/Image") {
      const w = object.dict.get(PDFName.of("Width")).asNumber();
      const h = object.dict.get(PDFName.of("Height")).asNumber();
      natural = { w, h };
      corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
    } else {
      const [l, b, r, t] = object.dict.lookup(PDFName.of("BBox"), PDFArray).asArray().map((n) => n.asNumber());
      const matrixArray = object.dict.lookup(PDFName.of("Matrix"));
      const formMatrix = matrixArray ? matrixArray.asArray().map((n) => n.asNumber()) : [1, 0, 0, 1, 0, 0];
      natural = { w: r - l, h: t - b };
      corners = [[l, b], [r, b], [r, t], [l, t]].map((p) => apply(formMatrix, p));
    }
    const pts = corners.map((p) => apply(draw.ctm, p));
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const box = { left: Math.min(...xs), right: Math.max(...xs), bottom: Math.min(...ys), top: Math.max(...ys) };

    // Which way is it turned? The picture's own "right" direction on the page.
    const [a, b] = draw.ctm;
    const angle = Math.round(((Math.atan2(b, a) * 180) / Math.PI + 360) % 360);
    // Drawn size of the picture along its own sides
    const sideW = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
    const sideH = Math.hypot(pts[3][0] - pts[0][0], pts[3][1] - pts[0][1]);

    const slotIndex = slots.findIndex(
      (s) => box.left >= s.left - TOLERANCE && box.right <= s.right + TOLERANCE && box.bottom >= s.bottom - TOLERANCE && box.top <= s.top + TOLERANCE,
    );
    const where = `label at ${fmt(box.left)},${fmt(box.bottom)}`;
    check(slotIndex >= 0, `${where} sits inside one of the 6 label spaces`);
    if (slotIndex < 0) continue;
    check(!used.has(slotIndex), `label space ${slotIndex + 1} is used once`);
    used.add(slotIndex);
    const s = slots[slotIndex];

    const centredX = near((box.left + box.right) / 2, (s.left + s.right) / 2);
    const centredY = near((box.bottom + box.top) / 2, (s.bottom + s.top) / 2);
    check(centredX && centredY, `label ${slotIndex + 1}: centred in its space`);
    const fillsWidth = near(box.left, s.left) && near(box.right, s.right);
    const fillsHeight = near(box.bottom, s.bottom) && near(box.top, s.top);
    check(fillsWidth || fillsHeight, `label ${slotIndex + 1}: as large as fits (touches both sides or top and bottom)`);
    check(
      Math.abs(sideW / sideH - natural.w / natural.h) < 1e-6,
      `label ${slotIndex + 1}: not stretched (shape ${fmt(sideW / sideH)} = original ${fmt(natural.w / natural.h)})`,
    );
    check(angle % 90 === 0, `label ${slotIndex + 1}: turned a whole quarter (${angle}°)`);
    if (expect.angle !== undefined) {
      check(angle === expect.angle, `label ${slotIndex + 1}: turned ${expect.angle}° counter-clockwise (found ${angle}°)`);
    }
    if (expect.vector !== undefined) {
      const isVector = subtype === "/Form";
      check(isVector === expect.vector, `label ${slotIndex + 1}: ${expect.vector ? "kept as vector (PDF page)" : "original image pixels"}`);
    }
    if (subtype === "/Image" && expect.pixels) {
      check(
        natural.w === expect.pixels.w && natural.h === expect.pixels.h,
        `label ${slotIndex + 1}: full resolution kept (${natural.w} × ${natural.h} px)`,
      );
    }
    placements.push({ slot: slotIndex + 1, box, angle, subtype });
  }
  check(used.size === 6, `all 6 label spaces filled (${used.size})`);

  // ---- The outlines ----
  const thin = strokes.filter((st) => near(st.width, SPEC.border, 1e-6) && st.gray === 0);
  check(thin.length === strokes.length, `every outline is 0.75 pt black (${thin.length} of ${strokes.length})`);
  check(strokes.every((st) => st.cap === 2), "outline ends are square, so corners are closed");

  // Every label edge must be covered by exactly one line: no gaps, no doubles.
  const edges = [];
  for (const s of slots) {
    edges.push({ x1: s.left, y1: s.bottom, x2: s.left, y2: s.top });
    edges.push({ x1: s.right, y1: s.bottom, x2: s.right, y2: s.top });
    edges.push({ x1: s.left, y1: s.bottom, x2: s.right, y2: s.bottom });
    edges.push({ x1: s.left, y1: s.top, x2: s.right, y2: s.top });
  }
  let edgesOk = true;
  for (const e of edges) {
    const covering = strokes.filter((st) => covers(st, e));
    if (covering.length !== 1) {
      edgesOk = false;
      checks.push({ ok: false, text: `edge ${fmt(e.x1)},${fmt(e.y1)}→${fmt(e.x2)},${fmt(e.y2)} has ${covering.length} lines (needs 1)` });
    }
  }
  check(edgesOk, "each label edge is drawn by exactly one line (shared edges are not doubled)");
  // No two lines overlap anywhere
  let overlap = false;
  for (let i = 0; i < strokes.length; i++) {
    for (let j = i + 1; j < strokes.length; j++) if (overlaps(strokes[i], strokes[j])) overlap = true;
  }
  check(!overlap, `no line is drawn on top of another (${strokes.length} lines)`);
  check(
    strokes.every((st) => edges.some((e) => covers(st, e) || covers(e, st))),
    "every line is a label edge (nothing extra)",
  );

  return { ok: checks.every((c) => c.ok), checks, placements, angle: placements[0]?.angle };
}

// ---------- Reading the PDF's drawing instructions ----------

function contentBytes(page) {
  const contents = page.node.Contents();
  const streams = contents instanceof PDFArray ? contents.asArray().map((ref) => page.doc.context.lookup(ref)) : [contents];
  const parts = streams.map((st) => (st instanceof PDFRawStream ? decodePDFRawStream(st).decode() : st.getContents()));
  return Buffer.concat(parts.map((p) => Buffer.from(p)).flatMap((p) => [p, Buffer.from("\n")]));
}

// Splits a content stream into [operands, operator] pairs.
function parseOperators(buffer) {
  const text = buffer.toString("latin1");
  const tokens = text.match(/\/[^\s/\[\]()<>]+|\[|\]|\([^)]*\)|<[^>]*>|[^\s/\[\]()<>]+/g) ?? [];
  const ops = [];
  let operands = [];
  const stack = [];
  for (const token of tokens) {
    if (token === "[") stack.push(operands), (operands = []);
    else if (token === "]") {
      const array = operands;
      operands = stack.pop();
      operands.push(array);
    } else if (token.startsWith("/") || token.startsWith("(") || token.startsWith("<")) operands.push(token);
    else if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(token)) operands.push(Number(token));
    else {
      ops.push({ op: token, args: operands });
      operands = [];
    }
  }
  return ops;
}

const multiply = (m, n) => [
  m[0] * n[0] + m[1] * n[2],
  m[0] * n[1] + m[1] * n[3],
  m[2] * n[0] + m[3] * n[2],
  m[2] * n[1] + m[3] * n[3],
  m[4] * n[0] + m[5] * n[2] + n[4],
  m[4] * n[1] + m[5] * n[3] + n[5],
];
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

// Plays the instructions back, keeping track of position, line width and colour.
function replay(ops) {
  let state = { ctm: [1, 0, 0, 1, 0, 0], width: 1, gray: 0, cap: 0 };
  const saved = [];
  const draws = [];
  const strokes = [];
  let path = [];
  for (const { op, args } of ops) {
    if (op === "q") saved.push({ ...state });
    else if (op === "Q") state = saved.pop();
    else if (op === "cm") state.ctm = multiply(args, state.ctm);
    else if (op === "w") state.width = args[0];
    else if (op === "J") state.cap = args[0];
    else if (op === "RG") state.gray = args[0] === 0 && args[1] === 0 && args[2] === 0 ? 0 : 1;
    else if (op === "G") state.gray = args[0];
    else if (op === "K") state.gray = args[3] === 1 && args[0] + args[1] + args[2] === 0 ? 0 : 1;
    else if (op === "Do") draws.push({ name: args[0].slice(1), ctm: state.ctm });
    else if (op === "m") path = [apply(state.ctm, args)];
    else if (op === "l") path.push(apply(state.ctm, args));
    else if (op === "re") {
      const [x, y, w, h] = args;
      path = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]].map((p) => apply(state.ctm, p));
    } else if (op === "S" || op === "s") {
      for (let i = 1; i < path.length; i++) {
        const [x1, y1] = path[i - 1];
        const [x2, y2] = path[i];
        strokes.push({ x1, y1, x2, y2, width: state.width, gray: state.gray, cap: state.cap });
      }
      path = [];
    } else if (op === "n" || op === "f" || op === "F" || op === "B") path = [];
  }
  return { draws, strokes };
}

// Does line a lie along line b and cover all of it?
function covers(a, b) {
  const horizontal = (l) => near(l.y1, l.y2);
  const vertical = (l) => near(l.x1, l.x2);
  if (horizontal(a) && horizontal(b) && near(a.y1, b.y1)) {
    const [a1, a2] = [Math.min(a.x1, a.x2), Math.max(a.x1, a.x2)];
    return a1 <= Math.min(b.x1, b.x2) + TOLERANCE && a2 >= Math.max(b.x1, b.x2) - TOLERANCE;
  }
  if (vertical(a) && vertical(b) && near(a.x1, b.x1)) {
    const [a1, a2] = [Math.min(a.y1, a.y2), Math.max(a.y1, a.y2)];
    return a1 <= Math.min(b.y1, b.y2) + TOLERANCE && a2 >= Math.max(b.y1, b.y2) - TOLERANCE;
  }
  return false;
}

// Do two lines run along each other for any length?
function overlaps(a, b) {
  const span = (p, q) => [Math.min(p, q), Math.max(p, q)];
  if (near(a.y1, a.y2) && near(b.y1, b.y2) && near(a.y1, b.y1)) {
    const [a1, a2] = span(a.x1, a.x2);
    const [b1, b2] = span(b.x1, b.x2);
    return Math.min(a2, b2) - Math.max(a1, b1) > TOLERANCE;
  }
  if (near(a.x1, a.x2) && near(b.x1, b.x2) && near(a.x1, b.x1)) {
    const [a1, a2] = span(a.y1, a.y2);
    const [b1, b2] = span(b.y1, b.y2);
    return Math.min(a2, b2) - Math.max(a1, b1) > TOLERANCE;
  }
  return false;
}

// ---------- Command line ----------

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node tests/check-pdf.mjs labels-A4.pdf");
    process.exit(2);
  }
  const result = await checkSheet(readFileSync(file));
  for (const c of result.checks) console.log(`${c.ok ? "✓" : "✗"} ${c.text}`);
  console.log(result.ok ? "\nAll checks passed." : "\nSome checks failed.");
  process.exit(result.ok ? 0 : 1);
}
