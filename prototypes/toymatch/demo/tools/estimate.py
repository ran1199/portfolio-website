# Estimated timeline (before the real recording arrives): ~2.45 words/sec, pauses between lines/sections.
import json, sys
src, out = sys.argv[1], sys.argv[2]
lines, sec, t = [], None, 0.6
for l in open(src).read().splitlines():
    if l.startswith('## '):
        if lines: t += 1.0
        sec = l[3:]; continue
    if not l.strip(): continue
    d = len(l.split()) / 2.45
    lines.append({"i": len(lines) + 1, "section": sec, "text": l, "start": round(t, 2), "end": round(t + d, 2)})
    t += d + 0.8
json.dump({"lines": lines, "duration": round(t + 0.5, 2)}, open(out, 'w'), indent=1)
print(len(lines), "lines, ~", round(t), "s")
