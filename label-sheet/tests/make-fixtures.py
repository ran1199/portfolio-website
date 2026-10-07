"""Makes the sample labels used by the tests (in tests/fixtures/).

Run from the label-sheet folder:  python3 tests/make-fixtures.py
Needs the Pillow image library (pip install pillow).
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).parent / "fixtures"
OUT.mkdir(exist_ok=True)


def font(size):
    try:
        return ImageFont.truetype("DejaVuSans-Bold.ttf", size)
    except OSError:
        return ImageFont.load_default(size)


def sample_label(width, height, title, colour):
    """A label with a coloured frame and a "TOP" bar, so turning is easy to see."""
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    draw.rectangle([0, 0, width - 1, height - 1], outline=colour, width=max(width, height) // 60)
    draw.rectangle([0, 0, width, height // 8], fill=colour)
    draw.text((width // 2, height // 16), "TOP", fill="white", anchor="mm", font=font(height // 14))
    draw.text((width // 2, height // 2), title, fill="black", anchor="mm", font=font(min(width, height) // 9))
    draw.text((width // 2, height * 3 // 4), f"{width} × {height} px", fill="#555", anchor="mm", font=font(min(width, height) // 16))
    return image


# Landscape PNG, wider than 4:3 (white space above and below in the label)
sample_label(1600, 900, "LANDSCAPE PNG", "#2f5bd3").save(OUT / "landscape.png")

# Portrait JPG, taller than 3:4 (turned to fit, white space at the sides)
sample_label(1000, 1500, "PORTRAIT JPG", "#c2410c").save(OUT / "portrait.jpg", quality=92)

# A phone-style photo: pixels stored sideways plus a tag (orientation 6)
# saying "turn 90° clockwise to view". It looks portrait when viewed.
upright = sample_label(900, 1200, "PHONE PHOTO", "#15803d")
stored = upright.transpose(Image.Transpose.ROTATE_90)  # 90° counter-clockwise
exif = Image.Exif()
exif[0x0112] = 6
stored.save(OUT / "phone-photo-exif6.jpg", quality=92, exif=exif.tobytes())


def vector_pdf(path, width_pt, height_pt, rotate, title):
    """A tiny hand-written vector PDF: shapes and text, no pixels."""
    content = f"""
0.18 0.36 0.83 RG 4 w 4 4 {width_pt - 8} {height_pt - 8} re S
0.18 0.36 0.83 rg 0 {height_pt - 36} {width_pt} 36 re f
BT /F1 18 Tf 1 1 1 rg {width_pt / 2 - 20} {height_pt - 25} Td (TOP) Tj ET
BT /F1 20 Tf 0 0 0 rg 20 {height_pt / 2} Td ({title}) Tj ET
BT /F1 10 Tf 0.3 0.3 0.3 rg 20 {height_pt / 2 - 20} Td (Vector text - stays sharp at any zoom) Tj ET
""".strip().encode()
    rotate_entry = f" /Rotate {rotate}" if rotate else ""
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {width_pt} {height_pt}]{rotate_entry} "
        f"/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>".encode(),
        b"<< /Length %d >>\nstream\n" % len(content) + content + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    out = bytearray(b"%PDF-1.4\n")
    offsets = []
    for number, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{number} 0 obj\n".encode() + body + b"\nendobj\n"
    xref = len(out)
    out += f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode()
    for offset in offsets:
        out += f"{offset:010d} 00000 n \n".encode()
    out += f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
    path.write_bytes(bytes(out))


# A 4 × 3 in vector PDF label (288 × 216 pt)
vector_pdf(OUT / "label.pdf", 288, 216, 0, "VECTOR PDF LABEL")

# A portrait page marked "show turned 90°", so it is landscape when viewed
vector_pdf(OUT / "rotated-page.pdf", 216, 288, 90, "ROTATED PAGE")

# Not a label at all
(OUT / "notes.txt").write_text("This is not an image or a PDF.\n")

print("Sample labels written to", OUT)
