# Aligns the script's lines to a narration recording using the pauses between sentences.
# Usage: align.py <audio> <script.txt> <timeline.json>
import json, re, subprocess, sys
audio, src, out = sys.argv[1:4]
lines, sec = [], None
for l in open(src).read().splitlines():
    if l.startswith('## '): sec = l[3:]; continue
    if l.strip(): lines.append({"section": sec, "text": l, "w": len(l.split())})
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audio], capture_output=True, text=True).stdout)

def speech(noise, mind):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", audio, "-af", f"highpass=f=80,silencedetect=noise={noise}dB:d={mind}", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r)]
    sil = list(zip(st, en + [dur] * (len(st) - len(en))))
    segs, t = [], 0.0
    for a, b in sil:
        if a - t > 0.12: segs.append([t, a])
        t = b
    if dur - t > 0.12: segs.append([t, dur])
    return [s for s in segs if s[1] - s[0] > 0.15]

def align(segs):
    n, m = len(lines), len(segs)
    if m < n: return None
    W = sum(l["w"] for l in lines); talk = sum(b - a for a, b in segs); rate = talk / W
    INF = float("inf")
    # cost[i][j]: best cost placing lines[:i] onto segs[:j]; a line takes a run of consecutive segments
    cost = [[INF] * (m + 1) for _ in range(n + 1)]; back = [[0] * (m + 1) for _ in range(n + 1)]
    cost[0][0] = 0
    for i in range(1, n + 1):
        exp = lines[i - 1]["w"] * rate
        for j in range(i, m - (n - i) + 1):
            for k in range(max(i - 1, j - 8), j):       # line i covers segs[k:j]
                if cost[i - 1][k] == INF: continue
                d = segs[j - 1][1] - segs[k][0]
                inner = sum(segs[q + 1][0] - segs[q][1] for q in range(k, j - 1))
                c = cost[i - 1][k] + ((d - inner) - exp) ** 2 / max(exp, 1) + 0.6 * inner
                if c < cost[i][j]: cost[i][j] = c; back[i][j] = k
    if cost[n][m] == INF: return None
    res, j = [], m
    for i in range(n, 0, -1):
        k = back[i][j]; res.append((segs[k][0], segs[j - 1][1])); j = k
    return res[::-1], cost[n][m] / n

best = None
for noise in (-40, -36, -32, -45, -28):
    for mind in (0.35, 0.28, 0.45, 0.22):
        segs = speech(noise, mind)
        r = align(segs)
        if r and (best is None or r[1] < best[1]): best = (r[0], r[1], noise, mind, len(segs))
if not best: sys.exit("Could not find enough pauses to align the script.")
spans, score, noise, mind, nseg = best
for l, (a, b) in zip(lines, spans): l["start"], l["end"] = round(max(0, a - 0.08), 2), round(b + 0.05, 2)
for k, l in enumerate(lines):
    l["i"] = k + 1; l["wps"] = round(l["w"] / max(0.1, l["end"] - l["start"]), 2); del l["w"]
json.dump({"lines": lines, "duration": round(dur + 0.8, 2), "fit": {"score": round(score, 3), "noise": noise, "min_pause": mind, "segments": nseg}}, open(out, "w"), indent=1)
odd = [l["i"] for l in lines if not 1.3 <= l["wps"] <= 4.2]
print(f"aligned {len(lines)} lines to {nseg} speech segments, audio {dur:.1f}s, fit {score:.3f}; unusual pace on lines: {odd or 'none'}")
