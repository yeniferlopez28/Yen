const { chromium } = require('playwright'); const path = require('path'); const fs=require('fs');
(async () => { const [page, fn, out, a, b, fmt] = process.argv.slice(2); fs.mkdirSync(out,{recursive:true});
 const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
 p.on('pageerror', e => console.error('PAGEERR', e.message));
 await p.goto('file://' + path.join(__dirname, page));
 await p.evaluate(async () => { await document.fonts.load('100px Paris'); await document.fonts.load('600 60px Cav'); await document.fonts.load('700 60px Cav'); await document.fonts.load('600 40px Corm'); await document.fonts.ready; if (window.ready) await window.ready; });
 const el = await p.$('#c'); const list = a.includes(',') ? a.split(',').map(Number) : null;
 const frames = list ? list.map(x=>Math.round(x*30)) : Array.from({length:+b-+a},(_,k)=>+a+k);
 for (const i of frames) { await p.evaluate(([fn,t]) => window[fn](t), [fn, i / 30]); const png = fmt==='png';
   await el.screenshot({ path: `${out}/f_${String(i).padStart(4, '0')}.${png?'png':'jpg'}`, type: png?'png':'jpeg', quality: png?undefined:94, omitBackground: png }); }
 await br.close(); })();
