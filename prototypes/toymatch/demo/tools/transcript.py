# Writes the narration transcript (.docx) from the aligned timeline, so it matches the video.
# Usage: transcript.py <timeline.json> <out.docx> <video file name>
import json, sys
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
tl = json.load(open(sys.argv[1])); out, video = sys.argv[2], sys.argv[3]
L = tl["lines"]
mmss = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
doc = Document()
st = doc.styles["Normal"]; st.font.name = "Calibri"; st.font.size = Pt(11)
h = doc.add_heading("ToyMatch Product Demonstration: Narration Transcript", level=1)
meta = doc.add_paragraph()
for k, v in [("Name", "Ran Guo"), ("Course", "17-629 Product Management Essentials II"), ("Assignment", "Product Assignment 4: Product Demonstration Video"),
             ("Audience", "ToyMatch Go To Market team"), ("Video file", video), ("Video length", mmss(tl["duration"])),
             ("Narration", "Ran Guo (own voice). Captions are shown at the bottom of the video.")]:
    r = meta.add_run(k + ": "); r.bold = True; meta.add_run(v + "\n")
doc.add_paragraph("Timestamps show when each line starts in the video.").runs[0].italic = True
sec = None
for l in L:
    if l["section"] != sec:
        sec = l["section"]; doc.add_heading(sec, level=2)
    p = doc.add_paragraph()
    t = p.add_run(f"[{mmss(l['start'])}]  "); t.font.color.rgb = RGBColor(0x5D, 0x59, 0x53); t.font.size = Pt(10)
    s = p.add_run("Presenter: "); s.bold = True
    p.add_run(l["text"])
    p.paragraph_format.space_after = Pt(4)
doc.save(out)
print("wrote", out, sum(len(l["text"].split()) for l in L), "words")
