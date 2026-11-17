# Writes the narration script as a Word document to read from while recording.
# Usage: script_docx.py <script.txt> <out.docx>
import sys
from docx import Document
from docx.shared import Pt, RGBColor, Cm
src, out = sys.argv[1:3]
CUES = {
 "Title": "Title card: ToyMatch, product demonstration for the Go To Market team.",
 "Introduction": "ToyMatch welcome screen.",
 "Gift details": "Tap Find a gift. Choose age 8, type $50, tap In 2 weeks, choose Science & nature and Building, then Building sets under toys they already have. Point to Not sure.",
 "Shortlist": "Tap Show gift ideas. Point to a card's price, rating and reasons. Tick Compare on the terrarium kit, then tap the refresh icon.",
 "Compare": "Tick a second toy and tap Compare. Scroll through the rows.",
 "Details": "Open the Glow Garden Terrarium Kit: Why it may fit, Before you buy (batteries), What buyers say.",
 "Where to buy": "Tap Choose this toy. Point to Amazon (Fastest delivery) and Target (Lowest price). Tap Target, then Buy at Target. Simulated handoff screen.",
 "Customer concern": "Go back to the details: the From your answers / Uncertain / Check this labels, then Limitations.",
 "Closing": "Back to the gift ideas list, then the closing card.",
}
lines, sec = [], None
body = open(src).read().splitlines()
words = sum(len(l.split()) for l in body if l.strip() and not l.startswith("## "))
doc = Document()
for s in doc.sections: s.left_margin = s.right_margin = Cm(2.2)
st = doc.styles["Normal"]; st.font.name = "Calibri"; st.font.size = Pt(13)
doc.add_heading("ToyMatch Product Demonstration: Script", level=1)
p = doc.add_paragraph()
p.add_run("Ran Guo · 17-629 Product Management Essentials II · Product Assignment 4\n").bold = True
p.add_run(f"Audience: ToyMatch Go To Market team · {words} words · about 3 minutes")
tips = doc.add_paragraph()
tips.add_run("Recording tips: ").bold = True
tips.add_run("Read only the numbered lines, word for word. Pause about 1 second after each line and 2 seconds before each new section. "
             "Grey text in italics shows what is on screen; don't read it aloud.")
n = 0
for l in body:
    if l.startswith("## "):
        sec = l[3:]
        doc.add_heading(sec, level=2)
        if sec in CUES:
            c = doc.add_paragraph(); r = c.add_run("On screen: " + CUES[sec]); r.italic = True
            r.font.size = Pt(10.5); r.font.color.rgb = RGBColor(0x76, 0x71, 0x6A)
    elif l.strip():
        n += 1
        q = doc.add_paragraph()
        q.paragraph_format.left_indent = Cm(0.9); q.paragraph_format.first_line_indent = Cm(-0.9)
        q.paragraph_format.space_after = Pt(8)
        a = q.add_run(f"{n}.\t"); a.bold = True; a.font.color.rgb = RGBColor(0x1D, 0x69, 0x62)
        q.add_run(l)
doc.save(out)
print("wrote", out, n, "lines", words, "words")
