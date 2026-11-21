// usage: node render.js <mode: anim|snow|preview> <outdir> [times...]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const [mode, out, ...times] = process.argv.slice(2);
  const PAGE = process.env.PAGE || 'anim.html', DURA = +(process.env.DUR || 10);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('PAGEERR', e.message));
  p.on('console', m => console.log('console:', m.text()));
  await p.goto('file://' + path.join(__dirname, PAGE));
  await p.evaluate(async () => { await document.fonts.load('100px Paris'); await document.fonts.load('600 60px Cav'); await document.fonts.load('600 40px Corm'); await document.fonts.ready; if (window.ready) await window.ready; });
  const el = await p.$('#c');
  const shot = async (fn, t, file, png) => {
    await p.evaluate(([fn, t]) => window[fn](t), [fn, t]);
    await el.screenshot({ path: file, type: png ? 'png' : 'jpeg', quality: png ? undefined : 94, omitBackground: !!png });
  };
  if (mode === 'preview') {
    for (const t of times) await shot('render', +t, `${out}/p_${t}.jpg`);
  } else if (mode === 'anim') {
    const N = Math.round(DURA * 30);
    for (let i = 0; i < N; i++) await shot('render', i / 30, `${out}/a_${String(i).padStart(4, '0')}.jpg`);
  } else if (mode === 'snow') {
    const N = 8 * 30;
    for (let i = 0; i < N; i++) await shot('renderSnow', i / 30, `${out}/s_${String(i).padStart(4, '0')}.png`, true);
  }
  await b.close();
})();
