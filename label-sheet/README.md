# Label Sheet

A one-page website: upload one 4 × 3 inch label (PNG, JPG or PDF) and get
6 copies on an A4 page, ready to print or download as `labels-A4.pdf`.
Everything happens in the visitor's browser. The file is never uploaded anywhere.

## What each file does

| File | What it is |
|---|---|
| `index.html` | The page: the text, the upload box and the buttons |
| `styles.css` | The look: colours, spacing, and the two-panel layout (stacked on phones) |
| `app.js` | What happens on upload and on Print / Download PDF |
| `labels.js` | The exact A4 layout (all measurements in mm, at the top of the file) and the PDF builder |
| `tests/` | Automatic checks. Not needed to run or publish the site |

## Changing things later

- **Text on the page** (title, helper line, etc.): edit `index.html`.
- **Colours**: change the values at the top of `styles.css` (`--ink`, `--accent`, …).
- **Measurements** (margins, gap, label size, line thickness): change `LAYOUT` at the top of `labels.js`.
  Then also update the same numbers in `SPEC` at the top of `tests/check-pdf.mjs`, so the checks still match.

To edit on github.com: open the file, click the pencil icon (**Edit this file**),
make the change, click **Commit changes…**, then **Commit changes** again.
The live site updates by itself about a minute later. Refresh the page to see it.

To undo a change: open the repository's **Commits** list, open the commit you
want to undo, and click **Revert** (or edit the file back by hand).

## How the layout works

- A4 portrait page, 595.28 × 841.89 pt (210 × 297 mm).
- 2 columns × 3 rows of 101.6 × 76.2 mm labels. 2.4 mm side margins, a 2 mm
  gap between the columns, rows touching, and 34.2 mm top and bottom margins.
- Each label edge is one 0.75 pt black line, centred on the edge. Edges that
  two labels share are drawn once, so they are never double-thick.
- A portrait upload is turned 90° clockwise. The label is scaled to fit without
  stretching or cropping and centred, with white around it.
- Images keep their original pixels. A PDF label stays vector (its first page is used).
- Phone photos saved sideways (with an orientation tag) are stood upright first.
- The PDF asks viewers to print at actual size, but some print dialogs still
  default to "Fit to page", hence the helper text under the buttons.

## Libraries

Loaded from the jsDelivr CDN at fixed versions, so nothing needs installing:
[pdf-lib](https://pdf-lib.js.org/) 1.17.1 (builds the PDF) and
[pdf.js](https://mozilla.github.io/pdf.js/) 6.4.299 (draws the previews).

## Running the tests (optional, needs Node.js 22.13 or newer)

```
cd tests
npm install
npm test
```

This opens the page in a hidden Chrome, uploads the sample labels in
`tests/fixtures/` (landscape PNG, portrait JPG, vector PDF, a sideways phone
photo, a rotated PDF page and an unsupported file), downloads each PDF and
checks it: page size, exactly 6 labels, each label's position, size, rotation
and centring, and that every edge is drawn by exactly one 0.75 pt line.
To check any PDF by hand: `node check-pdf.mjs path/to/labels-A4.pdf`.
`python3 make-fixtures.py` recreates the sample labels.
