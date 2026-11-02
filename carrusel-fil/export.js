// Exporta el carrusel a PNG 1080x1350: node export.js
// Lámina 01 = portada.html (#s1); láminas 02-09 = fil.html (#s2..#s9)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:1400}});
const shot=async(file,id,n)=>{await p.goto('file://'+path.join(__dirname,file));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
  await (await p.$('#'+id)).screenshot({path:path.join(__dirname,'export',`fil-${String(n).padStart(2,'0')}.png`)})};
await shot('portada.html','s1',1);
await p.goto('file://'+path.join(__dirname,'fil.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
for(let i=2;i<=9;i++){await (await p.$('#s'+i)).screenshot({path:path.join(__dirname,'export',`fil-${String(i).padStart(2,'0')}.png`)})}
await b.close();console.log('ok')})();
