const { chromium } = require('playwright'); const path = require('path');
(async () => { const [page, out, a, b] = process.argv.slice(2);
 const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
 await p.goto('file://' + path.join(__dirname, page));
 await p.evaluate(async () => { await document.fonts.load('100px Paris'); await document.fonts.load('600 60px Cav'); await document.fonts.load('600 40px Corm'); await document.fonts.ready; if (window.ready) await window.ready; });
 const el = await p.$('#c');
 for (let i = +a; i < +b; i++) { await p.evaluate(t => window.render(t), i / 30); await el.screenshot({ path: `${out}/a_${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 94 }); }
 await br.close(); })();
