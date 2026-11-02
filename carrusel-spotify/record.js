// Graba el carrusel Spotify Wrapped v3 como video: node record.js
// Salida: video/spotify-wrapped-4x5.mp4 (feed) y video/spotify-wrapped-9x16.mp4 (reels/historias)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {spawn,execFileSync}=require('child_process');
const FPS=30,XF=0.5,TR=['slideleft','smoothup','slideleft','circleopen','smoothleft'];
const dir=__dirname,out=path.join(dir,'video'),tmp=path.join(out,'tmp');fs.mkdirSync(tmp,{recursive:true});
// página del video = carrusel v3 + animaciones
const html=fs.readFileSync(path.join(dir,'spotify-v3.html'),'utf8').replace('<script src="wrapped-soft.js"></script>','<script src="wrapped-soft.js"></script>\n<script src="anim.js"></script>');
fs.writeFileSync(path.join(dir,'video.html'),html);
const only=process.argv[2]?[+process.argv[2]]:[1,2,3,4,5,6];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});const durs=[];
for(const s of only){
  await p.goto('file://'+path.join(dir,'video.html')+'?s='+s);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
  const dur=await p.evaluate(()=>window.__dur);durs[s]=dur;const n=Math.round(dur*FPS);
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','17','-preset','medium',path.join(tmp,`s${s}.mp4`)]);
  const done=new Promise(r=>ff.on('close',r));
  for(let f=0;f<n;f++){await p.evaluate(t=>window.__setTime(t),f/FPS);const buf=await p.screenshot({type:'jpeg',quality:93});
    if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
  ff.stdin.end();await done;console.log('lámina',s,dur+'s',n,'cuadros');
}
await b.close();
if(only.length<6)return;
// unir con transiciones
const inputs=[];for(let s=1;s<=6;s++)inputs.push('-i',path.join(tmp,`s${s}.mp4`));
let fc='',prev='[0:v]',acc=0;
for(let k=1;k<6;k++){acc+=durs[k];const off=(acc-k*XF).toFixed(3);const lab=k<5?`[v${k}]`:'[vout]';fc+=`${prev}[${k}:v]xfade=transition=${TR[k-1]}:duration=${XF}:offset=${off}${lab};`;prev=`[v${k}]`}
const f45=path.join(out,'spotify-wrapped-4x5.mp4');
execFileSync('ffmpeg',['-y','-loglevel','error',...inputs,'-filter_complex',fc.slice(0,-1),'-map','[vout]','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium','-r',String(FPS),'-movflags','+faststart',f45]);
// versión 9:16 con fondo desenfocado
execFileSync('ffmpeg',['-y','-loglevel','error','-i',f45,'-filter_complex','[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:2,eq=brightness=-0.04[bg];[bg][b]overlay=0:(H-h)/2[v]','-map','[v]','-c:v','libx264','-pix_fmt','yuv420p','-crf','19','-preset','medium','-movflags','+faststart',path.join(out,'spotify-wrapped-9x16.mp4')]);
console.log('listo');
})();
