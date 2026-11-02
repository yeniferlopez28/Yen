// Exporta las láminas a PNG 1080x1350.
// Uso: node export.js [archivo.html] [prefijo]   (por defecto: spotify-v2.html → export/spotify-v2-0X.png)
const {chromium}=require('playwright');const path=require('path');
const file=process.argv[2]||'spotify-v2.html',pre=process.argv[3]||'spotify-v2';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:1400}});
await p.goto('file://'+path.join(__dirname,file));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
const n=await p.$$eval('section.slide',e=>e.length);
for(let i=1;i<=n;i++){await (await p.$('#s'+i)).screenshot({path:path.join(__dirname,'export',`${pre}-${String(i).padStart(2,'0')}.png`)})}
await b.close();console.log('ok',n)})();
