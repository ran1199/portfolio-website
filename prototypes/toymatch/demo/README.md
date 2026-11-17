# ToyMatch demo video (Product Assignment 4)

- `script.txt` / `Ran_Guo_Product_Assignment_4_Script.docx`: the narration script (430 words, about 3 minutes).
- `tools/`: how the video is made.
  1. `cards.js` renders the title and closing cards.
  2. `align.py` finds when each script line is spoken in Ran's recording (from the pauses).
  3. `record.js` clicks through the prototype in time with those lines and records the screen.
  4. `compose.py` joins cards + recording, pins captions at the bottom, adds the narration audio.
  5. `transcript.py` writes the matching .docx transcript.

The narration is Ran's own voice; no synthetic voice is used.
