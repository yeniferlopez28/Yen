// Animación del carrusel Spotify Wrapped (v3) en "modo video".
// video.html?s=N muestra solo la lámina N; window.__setTime(seg) coloca cada animación en ese instante (cuadro a cuadro).
(function(){
const S=+new URLSearchParams(location.search).get('s')||1;
const DUR=[0,5.5,7,7,6.5,6.5,7.5][S];
const css=document.createElement('style');
css.textContent=`body{padding:0!important;margin:0!important;display:block!important;background:#000!important}
section.slide{display:none} section.slide.on{display:block}
.prog{position:absolute;left:28px;right:28px;top:18px;display:flex;gap:8px;z-index:60}
.prog i{flex:1;height:6px;border-radius:3px;background:rgba(31,27,28,.16);overflow:hidden;position:relative}
.prog i b{position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(31,27,28,.72);border-radius:3px}
.dark .prog i{background:rgba(245,240,230,.25)} .dark .prog i b{background:rgba(245,240,230,.92)}
.num{font-variant-numeric:tabular-nums}`;
document.head.appendChild(css);
const slide=document.getElementById('s'+S); slide.classList.add('on');
const prog=document.createElement('div');prog.className='prog';
for(let i=1;i<=6;i++)prog.innerHTML+=`<i><b style="width:${i<S?100:0}%"></b></i>`;
slide.appendChild(prog);const bar=prog.children[S-1].firstChild;

const A=[],U=[];
const $=q=>slide.querySelector(q),$$=q=>[...slide.querySelectorAll(q)];
const byText=(q,t)=>$$(q).find(e=>e.textContent.trim()===t);
function add(el,kf,t,d,o={}){if(!el)return;const a=el.animate(kf,{duration:d*1000,delay:t*1000,fill:o.fill||'both',easing:o.ease||'cubic-bezier(.2,.8,.2,1)',iterations:o.it||1,direction:o.dir||'normal'});A.push(a);return a}
const fade=(el,t,d=.5)=>add(el,[{opacity:0},{opacity:1}],t,d);
const inX=(el,t,dx=-90,d=.6)=>add(el,[{translate:`${dx}px 0`,opacity:0},{translate:'0 0',opacity:1}],t,d);
const inY=(el,t,dy=40,d=.6)=>add(el,[{translate:`0 ${dy}px`,opacity:0},{translate:'0 0',opacity:1}],t,d);
const pop=(el,t,d=.55)=>add(el,[{scale:'.3',opacity:0},{scale:'1.08',opacity:1,offset:.7},{scale:'1',opacity:1}],t,d,{ease:'ease-out'});
const write=(el,t,d=.9)=>add(el,[{clipPath:'inset(-260px calc(100% + 60px) -260px -60px)'},{clipPath:'inset(-260px -60px -260px -60px)'}],t,d,{ease:'cubic-bezier(.45,.05,.4,1)'});
const shape=(el,t,d=.55)=>add(el,[{clipPath:'polygon(0 4%,0% 0,0% 100%,0% 96%)'},{clipPath:'polygon(0 4%,100% 0,99.4% 100%,.6% 96%)'}],t,d,{ease:'cubic-bezier(.6,0,.2,1)'});
const float=(el,t,amp=12,p=2.6)=>add(el,[{translate:'0 0'},{translate:`0 ${-amp}px`}],t,p/2,{it:Infinity,dir:'alternate',ease:'ease-in-out',fill:'none'});
const spin=(el,t,p=14,deg=360)=>add(el,[{rotate:'0deg'},{rotate:deg+'deg'}],t,p,{it:Infinity,ease:'linear',fill:'none'});
const wob=(el,t,deg=10,p=1.6)=>add(el,[{rotate:`${-deg}deg`},{rotate:`${deg}deg`}],t,p/2,{it:Infinity,dir:'alternate',ease:'ease-in-out',fill:'none'});
const pulse=(el,t,s=1.12,p=1.1)=>add(el,[{scale:'1'},{scale:String(s)}],t,p/2,{it:Infinity,dir:'alternate',ease:'ease-in-out',fill:'none'});
const nudge=(el,t)=>add(el,[{translate:'0 0'},{translate:'14px 0'}],t,.45,{it:Infinity,dir:'alternate',ease:'ease-in-out',fill:'none'});
function count(el,t,d=1.1,from=0){if(!el)return;const m=el.textContent.trim().match(/^([^\d]*)([\d,]+)(.*)$/);if(!m)return;
  const to=+m[2].replace(/,/g,''),comma=m[2].includes(',');
  U.push(s=>{const p=Math.min(1,Math.max(0,(s-t)/d)),e=1-Math.pow(1-p,3),v=Math.round(from+(to-from)*e);
    el.textContent=m[1]+(comma?v.toLocaleString('en-US'):String(v))+m[3]})}
const tls=()=>$$('.tb > *');

if(S===1){
  fade($('.url'),0,.4);
  inX($('svg.checker'),0,-420,.9);
  const t=tls(); inX(t[0],.25); write(t[1],.55,.95); inX(t[2],1.25); pop(t[3],1.55,.6);
  inY($('.wrap p.tx'),2.15);
  const y=byText('.abs','2026'); inY(y,2.4,140,.7); count(y,2.4,.9,2000);
  pop($('svg.burst'),1.8,.6); spin($('svg.burst'),2.4,26);
  pop($('img.stk'),1.95,.65); float($('img.stk'),2.6);
  pop($('svg.spotify'),.9); wob($('svg.spotify'),1.5,8,2);
  pop($('svg.star4'),1.1); spin($('svg.star4'),1.6,6);
  fade($('svg.arrow'),3.1,.4); nudge($('svg.arrow'),3.5);
}
if(S===2){
  fade($('.url'),0,.4);
  const t=tls(); inX(t[0],.2); write(t[1],.5,.95); inX(t[2],1.25);
  inY($('.lead'),1.65);
  $$('.story').forEach((s,i)=>inY(s,2.2+i*.25,320,.7));
  count(byText('.story div','32,450'),2.45,1.3);
  $$('.story svg.burst').forEach((b,i)=>spin(b,2.6,10+i*4,i%2?-360:360));
  $$('.rank').forEach((r,i)=>inX(r,2.85+i*.13,-50,.4));
  pop($('svg.heart'),3.3); pulse($('svg.heart'),3.9);
  const q=$('.abs[style*="top:1095px"]'); inY(q,3.8,60,.6); pop(q&&q.querySelector('.tag'),4.2);
}
if(S===3){
  fade($('.url'),0,.4);
  const t=tls(); inX(t[0],.2); inX(t[1],.55,90); write($('.tb .sc'),.95,.9);
  inY($('.stack'),1.3,140,.7);
  const b=$$('.stack .back'); add(b[0],[{rotate:'6deg'},{rotate:'0deg'}],1.75,.6); add(b[1],[{rotate:'-4deg'},{rotate:'0deg'}],1.85,.6);
  inY($('.stack .lead'),2.1,30); inY($('.stack .tx'),2.5,30);
  $$('.stack .chip').forEach((c,i)=>pop(c,2.9+i*.14,.45));
  pop($('img.stk'),1.7,.65); float($('img.stk'),2.4,10,2.8);
  pop($('svg.star4'),2,.5); spin($('svg.star4'),2.5,6);
  const w=$$('.wrap')[1].children; inY(w[0],3.7); write(w[1],4.1,1.1); pop(w[2],5.2);
}
if(S===4){
  inY($('svg.waves'),0,220,1);
  fade($('.url'),0,.4);
  const t=tls(); inX(t[0],.25); inX(t[1],.55,90); write($('.tb .sc'),.9,.9);
  inY($('.wrap .lead'),1.45);
  const c=$$('.cmp'); inX(c[0],1.9,-260,.7); inX(c[1],2.2,260,.7);
  wob(c[0].querySelector('svg.spotify'),2.6,8,2);
  write(c[0].querySelector('.big'),2.55,.9);
  $$('.cmp .chip').forEach((e,i)=>pop(e,3.0+i*.13,.45));
  const vs=byText('.abs','VS'); pop(vs,2.6,.6); pulse(vs,3.3,1.1,1.2);
  const w=$$('.wrap')[1].children; inY(w[0],3.8); pop(w[1],4.3);
  fade($('svg.arrowc'),4.7,.4); nudge($('svg.arrowc'),5);
}
if(S===5){
  fade($('.url'),0,.4);
  const t=tls(); inX(t[0],.2); write(t[1],.5,.95);
  pop($('svg.spiky'),.9,.6); spin($('svg.spiky'),1.5,30);
  pop($('svg.spotify'),1.1); wob($('svg.spotify'),1.7,8,2);
  pop($('svg.star4'),1.3,.5); spin($('svg.star4'),1.8,6);
  $$('.res').forEach((r,i)=>{const tt=1.4+i*.55;shape(r,tt,.55);count(r.querySelector('.num'),tt+.1,1.1);inY(r.querySelector('.lab'),tt+.35,16,.5)});
  const p=$$('.wrap > p'); inY(p[0],3.5); fade(p[1],3.9,.6);
  fade($('svg.arrowc'),4.3,.4); nudge($('svg.arrowc'),4.6);
}
if(S===6){
  fade($('.url'),0,.4);
  inX($('svg.checker'),0,420,.9);
  const w=$('.wrap').children;
  pop(w[0],.3,.5); inY(w[1],.6,40,.7); write(w[2],1.25,1.7); inY(w[3],3.0); inY(w[4],3.5,50);
  pop($('svg.burst'),2.1,.6); spin($('svg.burst'),2.7,26);
  pop($('img.stk'),2.3,.7); float($('img.stk'),3,12,2.8);
  pop($('svg.spotify'),2.75); wob($('svg.spotify'),3.3,8,2);
}

A.forEach(a=>a.pause());
const grain=$('.grain');
window.__dur=DUR;
window.__setTime=s=>{A.forEach(a=>{a.currentTime=s*1000});U.forEach(f=>f(s));
  bar.style.width=Math.min(100,s/DUR*100)+'%';
  if(grain){const f=Math.floor(s*15);grain.style.backgroundPosition=`${(f*37)%260}px ${(f*91)%260}px`}};
window.__setTime(0);
})();
