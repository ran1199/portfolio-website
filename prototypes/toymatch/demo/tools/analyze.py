# Prints the speech/pause structure of a recording (20 ms RMS frames).
import subprocess, sys, numpy as np
f = sys.argv[1]
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
hop = 320; n = len(x) // hop
rms = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
db = 20 * np.log10(rms)
floor = np.percentile(db, 10); peak = np.percentile(db, 95)
thr = floor + 0.35 * (peak - floor)
speech = db > thr
# smooth: fill gaps < 0.12 s, drop blips < 0.08 s
def runs(b):
    r, s = [], None
    for i, v in enumerate(b):
        if v and s is None: s = i
        if not v and s is not None: r.append([s, i]); s = None
    if s is not None: r.append([s, len(b)])
    return r
segs = runs(speech)
m = []
for a, b in segs:
    if m and a - m[-1][1] < 6: m[-1][1] = b
    else: m.append([a, b])
m = [s for s in m if s[1] - s[0] >= 4]
print(f"{f.split('/')[-1]}: dur {len(x)/16000:.2f}s floor {floor:.1f}dB peak {peak:.1f}dB thr {thr:.1f}")
prev = 0
for a, b in m:
    print(f"  pause {(a - prev) * 0.02:5.2f}s | speech {a*0.02:6.2f}-{b*0.02:6.2f} ({(b-a)*0.02:.2f}s)")
    prev = b
print(f"  tail pause {(n - prev) * 0.02:.2f}s")
