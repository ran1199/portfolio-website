# Joins Ran's section recordings into one smooth narration:
# - finds speech and pauses (20 ms frames), matches each script line to its speech
# - shortens long pauses only (between lines <= 0.6 s, inside a line <= 0.35 s); speech is never cut
# - 15 ms crossfades at every edit, a short room-tone gap between sections
# - gentle clean-up and loudness levelling over the whole narration
# Writes narration.wav and timeline.json (each line's start/end in the final audio).
# Usage: narration.py <script.txt> <audio dir> <out dir>
import json, os, subprocess, sys, numpy as np
src, adir, out = sys.argv[1:4]
SR = 48000; FR = 0.02; HOP = int(SR * FR)
BETWEEN, INSIDE, SECTION_GAP, LEAD, TAIL, XF = 0.60, 0.35, 0.85, 0.20, 0.30, int(0.015 * SR)

sections, cur = [], None
for l in open(src).read().splitlines():
    if l.startswith("## "): cur = {"name": l[3:], "lines": []}; sections.append(cur)
    elif l.strip(): cur["lines"].append(l)

def load(f):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def speech_runs(x):
    n = len(x) // HOP
    db = 20 * np.log10(np.sqrt(np.mean(x[:n * HOP].reshape(n, HOP) ** 2, axis=1) + 1e-12))
    floor, peak = np.percentile(db, 10), np.percentile(db, 95)
    on = db > floor + 0.35 * (peak - floor)
    runs, s = [], None
    for i, v in enumerate(on):
        if v and s is None: s = i
        if not v and s is not None: runs.append([s, i]); s = None
    if s is not None: runs.append([s, n])
    merged = []
    for a, b in runs:
        if merged and a - merged[-1][1] < 6: merged[-1][1] = b
        else: merged.append([a, b])
    return [[a * FR, b * FR] for a, b in merged if b - a >= 4]

def align(segs, lines):
    n, m = len(lines), len(segs)
    w = [len(l.split()) for l in lines]
    rate = sum(b - a for a, b in segs) / sum(w)
    INF = float("inf"); cost = [[INF] * (m + 1) for _ in range(n + 1)]; back = [[0] * (m + 1) for _ in range(n + 1)]
    cost[0][0] = 0
    for i in range(1, n + 1):
        exp = w[i - 1] * rate
        for j in range(i, m - (n - i) + 1):
            for k in range(i - 1, j):
                if cost[i - 1][k] == INF: continue
                talk = sum(segs[q][1] - segs[q][0] for q in range(k, j))
                inner = sum(segs[q + 1][0] - segs[q][1] for q in range(k, j - 1))
                c = cost[i - 1][k] + (talk - exp) ** 2 / max(exp, 0.5) + 0.8 * inner
                if c < cost[i][j]: cost[i][j] = c; back[i][j] = k
    spans, j = [], m
    for i in range(n, 0, -1): k = back[i][j]; spans.append((k, j)); j = k
    return spans[::-1]

def xcat(parts):
    y = parts[0]
    for p in parts[1:]:
        if len(y) > XF and len(p) > XF:
            r = np.linspace(0, 1, XF, dtype=np.float32)
            y = np.concatenate([y[:-XF], y[-XF:] * (1 - r) + p[:XF] * r, p[XF:]])
        else: y = np.concatenate([y, p])
    return y

out_parts, timeline, t, report, missing = [], [], 0.0, [], []
room = None
for si, sec in enumerate(sections):
    f = os.path.join(adir, sec["name"].lower().replace(" ", "_") + ".m4a")
    if not os.path.exists(f): missing.append(sec["name"]); continue
    x = load(f); segs = speech_runs(x)
    if room is None: room = x[: int(min(0.8, segs[0][0] - 0.15) * SR)]
    spans = align(segs, sec["lines"])
    if os.environ.get("DEBUG"):
        bnd = [round(segs[k][0] - segs[k - 1][1], 2) for k, j in spans[1:]]
        inner = sorted(round(segs[q + 1][0] - segs[q][1], 2) for k, j in spans for q in range(k, j - 1))
        print(f"  {sec['name']}: pauses at line breaks {bnd}; largest inside lines {inner[-3:]}")
    pieces, first = [], True
    seg_line = {}
    for li, (k, j) in enumerate(spans):
        for q in range(k, j): seg_line[q] = li
    lt = {}
    sec_t = 0.0
    for q, (a, b) in enumerate(segs):
        if q == 0: s0 = max(0, a - LEAD); pieces.append(x[int(s0 * SR):int(a * SR)]); sec_t += a - s0
        li = seg_line[q]
        if li not in lt: lt[li] = [sec_t, None]
        pieces.append(x[int(a * SR):int(b * SR)]); sec_t += b - a
        lt[li][1] = sec_t
        if q + 1 < len(segs):
            gap = segs[q + 1][0] - b
            target = BETWEEN if seg_line[q + 1] != li else INSIDE
            if gap <= target: pieces.append(x[int(b * SR):int(segs[q + 1][0] * SR)]); sec_t += gap
            else:
                h = target / 2
                pieces.append(x[int(b * SR):int((b + h) * SR)]); pieces.append(x[int((segs[q + 1][0] - h) * SR):int(segs[q + 1][0] * SR)])
                sec_t += target
                report.append(f"{sec['name']}: pause {gap:.2f}s -> {target:.2f}s")
        else:
            e = min(len(x) / SR, b + TAIL); pieces.append(x[int(b * SR):int(e * SR)]); sec_t += e - b
    y = xcat([p for p in pieces if len(p)])
    if out_parts:
        gap = np.resize(room, int(SECTION_GAP * SR)) if room is not None and len(room) else np.zeros(int(SECTION_GAP * SR), np.float32)
        out_parts.append(gap); t += SECTION_GAP
    for li, line in enumerate(sec["lines"]):
        a, b = lt[li]
        timeline.append({"section": sec["name"], "text": line, "start": round(t + a - 0.05, 2), "end": round(t + b + 0.05, 2),
                         "wps": round(len(line.split()) / max(0.1, b - a), 2)})
    out_parts.append(y); t += len(y) / SR
    orig = len(x) / SR
    report.append(f"{sec['name']}: {len(segs)} speech parts -> {len(sec['lines'])} lines; {orig:.1f}s -> {len(y)/SR:.1f}s")

audio = np.concatenate(out_parts)
os.makedirs(out, exist_ok=True)
raw = os.path.join(out, "narration_raw.f32")
audio.astype(np.float32).tofile(raw)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", raw,
    "-af", "highpass=f=75,lowpass=f=15000,acompressor=threshold=-24dB:ratio=2.2:attack=8:release=180:makeup=2,loudnorm=I=-16:TP=-1.5:LRA=9",
    "-ar", str(SR), "-ac", "1", os.path.join(out, "narration.wav")], check=True)
os.remove(raw)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(out, "narration.wav")], capture_output=True, text=True).stdout)
for i, l in enumerate(timeline): l["i"] = i + 1
json.dump({"lines": timeline, "duration": round(dur + 0.8, 2), "missing": missing}, open(os.path.join(out, "timeline.json"), "w"), indent=1)
print("\n".join(r for r in report if "->" in r and "speech parts" in r))
print(f"pauses shortened: {sum('pause' in r for r in report)}")
print(f"narration {dur:.1f}s; missing sections: {missing or 'none'}")
odd = [(l['i'], l['wps']) for l in timeline if not 1.4 <= l['wps'] <= 4.0]
print("line pace (words/s):", ", ".join(f"{l['i']}:{l['wps']}" for l in timeline), "| unusual:", odd or "none")
