// Exporta cada lámina de spotify.html a PNG 1080x1350: node export.js
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:1400}});
await p.goto('file://'+path.join(__dirname,'spotify.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
const n=await p.$$eval('section.slide',e=>e.length);
for(let i=1;i<=n;i++){await (await p.$('#s'+i)).screenshot({path:path.join(__dirname,'export',`spotify-${String(i).padStart(2,'0')}.png`)})}
await b.close();console.log('ok',n)})();
