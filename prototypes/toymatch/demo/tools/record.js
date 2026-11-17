// Records the ToyMatch prototype (CDP screencast frames) in time with the narration timeline.
// Usage: node record.js <timeline.json> <outDir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const [, , TL, OUT] = process.argv;
const FILE = 'file:///home/user/portfolio-website/prototypes/toymatch/concept-1/index.html';
const tl = JSON.parse(fs.readFileSync(TL, 'utf8'));
const L = i => tl.lines[i - 1];
const at = (i, f) => L(i).start + f * (L(i).end - L(i).start);   // audio time inside line i
const T0 = L(2).start;                                              // prototype part starts at line 2
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT + '/frames', { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(FILE);
  await page.evaluate(() => { try { sessionStorage.clear(); } catch (e) {} });
  await page.reload();
  await page.addStyleTag({ content: `
    :root{--font-display:"Inter Display",Inter,sans-serif;--font-body:Inter,sans-serif}
    .stage-note{display:none!important}
    #fakecur{position:fixed;left:1500px;top:520px;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;
      background:rgba(29,105,98,.28);border:2.5px solid rgba(29,105,98,.9);box-shadow:0 2px 8px rgba(0,0,0,.18);
      z-index:99999;pointer-events:none;transition:left .55s cubic-bezier(.3,.7,.3,1),top .55s cubic-bezier(.3,.7,.3,1),transform .15s}
    #fakecur.press{transform:scale(.72);background:rgba(29,105,98,.55)}
    #fakecur::after{content:"";position:absolute;inset:-3px;border-radius:50%;border:2px solid rgba(29,105,98,.7);opacity:0}
    #fakecur.ripple::after{animation:rip .6s ease-out}
    @keyframes rip{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(2.4)}}` });
  await page.evaluate(() => { const c = document.createElement('div'); c.id = 'fakecur'; document.body.appendChild(c); });
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await sleep(500);

  // --- screencast ---
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async f => {
    const n = frames.length;
    fs.writeFileSync(`${OUT}/frames/f${String(n).padStart(5, '0')}.jpg`, Buffer.from(f.data, 'base64'));
    frames.push({ file: `f${String(n).padStart(5, '0')}.jpg`, ts: f.metadata.timestamp });
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1920, maxHeight: 900, everyNthFrame: 1 });
  await sleep(300);
  // keep the screen "alive" so frames keep arriving while static (1px invisible ticker)
  await page.evaluate(() => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;z-index:99999'; document.body.appendChild(d); let k = 0; setInterval(() => { d.style.background = (k++ % 2) ? '#000' : '#fff'; }, 100); });
  const startWall = Date.now() / 1000;
  const waitUntil = async t => { const dt = (t - T0) - (Date.now() / 1000 - startWall); if (dt > 0) await sleep(dt * 1000); };
  const late = [];

  // --- helpers ---
  const box = async loc => { const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const moveTo = async loc => { const p = await box(loc); await page.evaluate(([x, y]) => { const c = document.getElementById('fakecur'); c.style.left = x + 'px'; c.style.top = y + 'px'; }, [p.x, p.y]); await sleep(600); };
  const press = async () => { await page.evaluate(() => { const c = document.getElementById('fakecur'); c.classList.add('press', 'ripple'); setTimeout(() => c.classList.remove('press'), 160); setTimeout(() => c.classList.remove('ripple'), 650); }); await sleep(170); };
  const reveal = async (loc, block = 'center') => {   // smooth-scroll the app view so the element is visible
    await loc.evaluate((el, block) => {
      const v = el.closest('.view'); if (!v) return;
      const r = el.getBoundingClientRect(), vr = v.getBoundingClientRect();
      const sc = vr.height / v.clientHeight;                       // device is scaled
      const pad = 110 * sc;
      if (r.top >= vr.top + pad && r.bottom <= vr.bottom - pad * 1.4) return;
      const target = block === 'start' ? v.scrollTop + (r.top - vr.top) / sc - 60 : v.scrollTop + ((r.top + r.bottom) / 2 - (vr.top + vr.bottom) / 2) / sc;
      v.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    }, block);
    await sleep(700);
  };
  const tap = async loc => { await reveal(loc); await moveTo(loc); await press(); await loc.click(); await sleep(350); };
  const point = async loc => { await reveal(loc); await moveTo(loc); };
  const scrollBy = async (dy, ms = 1200) => { await page.evaluate(([dy, ms]) => { const v = document.querySelector('.view'); const y0 = v.scrollTop, t0 = performance.now(); const step = n => { const k = Math.min(1, (n - t0) / ms); const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; v.scrollTop = y0 + dy * e; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }, [dy, ms]); await sleep(ms + 100); };
  const scrollTop = async () => { await page.evaluate(() => document.querySelector('.view').scrollTo({ top: 0, behavior: 'smooth' })); await sleep(700); };
  const q = s => page.locator(s).first();
  const card = name => page.locator('.toy-card', { hasText: name }).first();

  // --- timeline of actions (line number, fraction of the line) ---
  const steps = [
    [6, 0.3, () => point(q('[data-action="go"]'))],
    [7, 0.55, () => tap(q('[data-action="go"]'))],
    [8, 0.12, () => tap(q('.age-grid [data-value="8"]'))],
    [8, 0.38, async () => { await tap(q('#budget')); await page.keyboard.type('50', { delay: 220 }); }],
    [8, 0.78, () => tap(q('#q-deadline .chip >> nth=1'))],
    [9, 0.15, () => tap(q('#q-interests [data-value="science"]'))],
    [9, 0.42, () => tap(q('#q-interests [data-value="building"]'))],
    [9, 0.75, () => tap(q('#q-owned [data-value="building"]'))],
    [10, 0.35, () => point(q('#q-owned [data-value="__unsure"]'))],
    [11, 0.02, () => tap(q('#showIdeas'))],
    [11, 0.6, () => scrollBy(220)],
    [12, 0.05, () => point(q('.toy-card .toy-meta .price'))],
    [12, 0.4, () => point(card('Terrarium').locator('.why'))],
    [12, 0.82, () => tap(card('Terrarium').locator('.cmp-toggle'))],
    [13, 0.35, async () => { await scrollTop(); await tap(q('.nav [data-action="refresh"]')); }],
    [14, 0.05, async () => { const other = page.locator('.toy-card').filter({ hasNotText: 'Terrarium' }).first(); await tap(other.locator('.cmp-toggle')); }],
    [14, 0.7, () => tap(q('.bottom-bar [data-action="compare"]'))],
    [15, 0.1, () => scrollBy(380, 1600)],
    [15, 0.55, () => scrollBy(520, 1800)],
    [16, 0.02, async () => { const btns = page.locator('.cmp-foot .btn'); const names = await page.locator('.cmp-col-head .nm').allTextContents(); const k = names.findIndex(n => n.includes('Terrarium')); await tap(btns.nth(k < 0 ? 0 : k)); }],
    [16, 0.45, () => point(q('#h-fit'))],
    [16, 0.75, () => reveal(q('#h-rev'), 'start')],
    [17, 0.1, async () => { await reveal(q('#h-req'), 'start'); await point(q('.kv dd >> nth=1')); }],
    [18, 0.1, async () => { await reveal(q('#h-fit'), 'start'); await point(q('.reason >> nth=3')); }],
    [20, 0.1, async () => { await reveal(q('#h-rev'), 'start'); await point(q('#h-rev')); }],
    [22, 0.2, () => tap(q('[data-action="choose"]'))],
    [23, 0.05, () => point(page.locator('.offer', { hasText: 'Amazon' }).first().locator('.badge'))],
    [23, 0.55, () => point(page.locator('.offer', { hasText: 'Target' }).first().locator('.offer-price'))],
    [24, 0.08, () => tap(page.locator('.offer', { hasText: 'Target' }).first())],
    [24, 0.5, () => tap(q('[data-action="buy"]'))],
    [25, 0.55, () => tap(q('.bottom-bar [data-action="back"]'))],
    [26, 0.0, () => tap(q('.nav .back'))],
    [26, 0.3, async () => { await reveal(q('#h-fit'), 'start'); await point(q('.legend')); }],
    [26, 0.75, async () => { await reveal(q('#h-lim'), 'start'); await point(q('#h-lim')); }],
    [28, 0.2, () => tap(q('.nav .back'))],
    [28, 0.6, () => tap(q('.nav .back'))],
    [29, 0.1, () => point(q('.toy-card .why'))],
  ];
  for (const [i, f, fn] of steps) {
    const t = at(i, f);
    const now = T0 + (Date.now() / 1000 - startWall);
    if (now > t + 0.3) late.push(`line ${i}@${f}: ${(now - t).toFixed(2)}s late`);
    await waitUntil(t);
    try { await fn(); } catch (e) { late.push(`line ${i}@${f} FAILED: ${e.message.split('\n')[0]}`); }
  }
  await waitUntil(L(tl.lines.length).start + 0.2);
  await cdp.send('Page.stopScreencast');
  const endWall = Date.now() / 1000;
  // concat list: frame durations from timestamps, first frame starts at startWall
  const lines = [];
  const kept = frames.filter(f => f.ts >= startWall - 0.5);
  for (let k = 0; k < kept.length; k++) {
    const t0 = Math.max(kept[k].ts, startWall), t1 = k + 1 < kept.length ? kept[k + 1].ts : endWall;
    if (t1 <= t0) continue;
    lines.push(`file 'frames/${kept[k].file}'`, `duration ${(t1 - t0).toFixed(4)}`);
  }
  lines.push(`file 'frames/${kept[kept.length - 1].file}'`);
  fs.writeFileSync(OUT + '/frames.txt', lines.join('\n') + '\n');
  fs.writeFileSync(OUT + '/record-log.json', JSON.stringify({ T0, recorded: endWall - startWall, expected: L(tl.lines.length).start + 0.2 - T0, frames: kept.length, late }, null, 1));
  console.log(JSON.stringify({ recorded: (endWall - startWall).toFixed(1), expected: (L(tl.lines.length).start + 0.2 - T0).toFixed(1), frames: kept.length, late }, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
