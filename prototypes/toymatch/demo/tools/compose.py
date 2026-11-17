# Builds the final MP4: title card + prototype recording + closing card, caption band with
# captions pinned at the bottom, section labels, and the narration audio.
# Usage: compose.py <timeline.json> <rec dir> <build dir> <out.mp4> [audio file]
import json, subprocess, sys
tlp, rec, build, out = sys.argv[1:5]
audio = sys.argv[5] if len(sys.argv) > 5 else None
tl = json.load(open(tlp)); L = tl["lines"]
total = tl["duration"]
d1 = L[1]["start"]                       # title card until line 2
d2 = L[-1]["start"] + 0.2 - L[1]["start"]  # prototype until the last line
d3 = total - (d1 + d2)

def ts(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"
def esc(s): return s.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}")

ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1920", "PlayResY: 1080", "WrapStyle: 0", "ScaledBorderAndShadow: yes", "",
       "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       "Style: Caption,Inter,44,&H00FFFFFF,&H00FFFFFF,&H00151514,&H00151514,0,0,0,0,100,100,0,0,1,0,0,2,180,180,40,1",
       "Style: Label,Inter SemiBold,30,&H0062691D,&H0062691D,&H00000000,&H00000000,0,0,0,0,100,100,1.5,0,1,0,0,7,150,150,120,1",
       "Style: Small,Inter,24,&H00534D5D,&H00534D5D,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,150,150,166,1",
       "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
# captions: one per narration line, held until the next line starts (no flicker in short pauses)
for k, l in enumerate(L):
    end = L[k + 1]["start"] if k + 1 < len(L) else total
    if end - l["end"] > 1.5: end = l["end"] + 1.0
    ass.append(f"Dialogue: 0,{ts(l['start'])},{ts(end)},Caption,,0,0,0,,{esc(l['text'])}")
# section labels on the prototype part (not on the title/closing cards)
secs = []
for l in L:
    if not secs or secs[-1]["name"] != l["section"]: secs.append({"name": l["section"], "start": l["start"]})
for k, s in enumerate(secs):
    if s["name"] in ("Title",): continue
    start = max(s["start"], d1) if k else s["start"]
    end = secs[k + 1]["start"] if k + 1 < len(secs) else d1 + d2
    if end <= start: continue
    if start >= d1 + d2: continue
    ass.append(f"Dialogue: 0,{ts(start)},{ts(min(end, d1 + d2))},Label,,0,0,0,,{k}  ·  {esc(s['name'].upper())}")
ass.append(f"Dialogue: 0,{ts(d1)},{ts(d1 + d2)},Small,,0,0,0,,ToyMatch prototype · iPhone 17 · sample data")
open(build + "/captions.ass", "w").write("\n".join(ass) + "\n")

cmd = ["ffmpeg", "-y", "-v", "error",
       "-loop", "1", "-framerate", "30", "-t", f"{d1:.3f}", "-i", build + "/card-title.png",
       "-f", "concat", "-safe", "0", "-i", rec + "/frames.txt",
       "-loop", "1", "-framerate", "30", "-t", f"{d3:.3f}", "-i", build + "/card-close.png"]
if audio: cmd += ["-i", audio]
else: cmd += ["-f", "lavfi", "-t", f"{total:.3f}", "-i", "anullsrc=r=48000:cl=stereo"]
fc = (f"[0:v]fps=30,scale=1920:900,setsar=1,format=yuv420p[a];"
      f"[1:v]fps=30,scale=1920:900,setsar=1,format=yuv420p,trim=duration={d2:.3f},setpts=PTS-STARTPTS[b];"
      f"[2:v]fps=30,scale=1920:900,setsar=1,format=yuv420p[c];"
      f"[a][b][c]concat=n=3:v=1:a=0,pad=1920:1080:0:0:color=0x151514,"
      f"ass={build}/captions.ass,fade=t=in:st=0:d=0.5,fade=t=out:st={total-0.6:.3f}:d=0.6[v];"
      f"[3:a]aresample=48000,{'loudnorm=I=-16:TP=-1.5:LRA=11,' if audio else ''}apad,atrim=duration={total:.3f},afade=t=out:st={total-0.6:.3f}:d=0.6[au]")
cmd += ["-filter_complex", fc, "-map", "[v]", "-map", "[au]", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-t", f"{total:.3f}", out]
subprocess.run(cmd, check=True)
print("wrote", out, f"{total:.1f}s")
