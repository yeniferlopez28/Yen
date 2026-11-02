// Render every sticker-*.svg in this folder to a transparent PNG.
// Usage: node render.js
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const dir = __dirname; const b = await chromium.launch();
  for (const f of fs.readdirSync(dir).filter(f => /^sticker-.*\.svg$/.test(f))) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const [, w, h] = src.match(/viewBox="0 0 (\d+) (\d+)"/);
    const p = await b.newPage({ viewport: { width: +w, height: +h } });
    await p.goto('file://' + path.join(dir, f));
    await p.screenshot({ path: path.join(dir, f.replace('.svg', '.png')), omitBackground: true });
    await p.close(); console.log(f);
  }
  await b.close();
})();
