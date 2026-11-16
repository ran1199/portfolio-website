const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const S = process.argv[2];
const FILE = 'file:///home/user/portfolio-website/prototypes/toymatch/concept-1/index.html';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await p.goto(FILE);
  await p.addStyleTag({ content: 'html,body,.stage{background:transparent!important} :root{--font-display:"Inter Display",Inter,sans-serif;--font-body:Inter,sans-serif}' });
  await p.locator('.device').screenshot({ path: S + '/build/phone-home.png', omitBackground: true });
  for (const kind of ['title', 'close']) {
    const c = await b.newPage({ viewport: { width: 1920, height: 900 } });
    await c.goto('file://' + S + '/card.html?kind=' + kind + '&img=' + encodeURIComponent('file://' + S + '/build/phone-home.png'));
    await c.waitForTimeout(300);
    await c.screenshot({ path: S + '/build/card-' + kind + '.png' });
  }
  await b.close();
})();
