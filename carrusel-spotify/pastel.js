// Gráficos pastel (estilo loaffa + scrapbook) para el carrusel Spotify Wrapped v2
const CH='#4A2E2B',CR='#F8F2E3',BU='#FCEFB4',BL='#C4DDEB',PK='#F6D3DB',PD='#EDA8BE',SG='#D8D9AE',OL='#8E9A58',BE='#A93A62',SP='#7DC88B',W='#FFFDF7';
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function starPts(n,cx,cy,R,r){let s=[];for(let i=0;i<n*2;i++){const a=Math.PI*i/n-Math.PI/2,rr=i%2?r:R;s.push((cx+rr*Math.cos(a)).toFixed(1)+','+(cy+rr*Math.sin(a)).toFixed(1))}return s.join(' ')}
const all=(sel,fn)=>document.querySelectorAll(sel).forEach(fn);

// lunares sueltos (como el panel azul de loaffa)
all('.scatter',el=>{const r=rng(+el.dataset.seed||3),n=+el.dataset.n||10,c=el.dataset.c||'#fff',R=+el.dataset.r||26;let h='';
  for(let i=0;i<n;i++){const x=4+r()*88,y=3+r()*92;h+=`<i style="position:absolute;left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${R*2}px;height:${R*2}px;border-radius:50%;background:${c}"></i>`}
  el.innerHTML=h});

const D={
 star4:s=>`<path d="M50 0C54 38 62 46 100 50C62 54 54 62 50 100C46 62 38 54 0 50C38 46 46 38 50 0Z" fill="${s.dataset.c||OL}"/>`,
 star8:s=>`<polygon points="${starPts(8,50,50,50,18)}" fill="${s.dataset.c||PD}"/>`,
 flower:s=>{const c=s.dataset.c||CH;return `<circle cx="50" cy="22" r="17" fill="${c}"/><circle cx="78" cy="50" r="17" fill="${c}"/><circle cx="50" cy="78" r="17" fill="${c}"/><circle cx="22" cy="50" r="17" fill="${c}"/><circle cx="50" cy="50" r="9" fill="${s.dataset.m||BU}"/>`},
 spotify:()=>`<g transform="rotate(-8 100 100)"><circle cx="100" cy="100" r="92" fill="${CH}"/><circle cx="100" cy="100" r="85" fill="${CR}"/><circle cx="100" cy="100" r="74" fill="${SP}"/><path d="M52 82Q100 60 150 88" fill="none" stroke="${CH}" stroke-width="15" stroke-linecap="round"/><path d="M58 108Q100 89 143 112" fill="none" stroke="${CH}" stroke-width="12" stroke-linecap="round"/><path d="M65 133Q100 117 133 135" fill="none" stroke="${CH}" stroke-width="10" stroke-linecap="round"/></g><path d="M166 20c2 12 5 15 17 17-12 2-15 5-17 17-2-12-5-15-17-17 12-2 15-5 17-17z" fill="${PD}"/>`,
 applemusic:()=>`<g transform="rotate(6 100 100)"><rect x="10" y="10" width="180" height="180" rx="48" fill="${CH}"/><rect x="18" y="18" width="164" height="164" rx="41" fill="${PD}" stroke="${CR}" stroke-width="7"/><path d="M84 68L140 56V122" fill="none" stroke="${CR}" stroke-width="10" stroke-linejoin="round"/><path d="M84 68V134" stroke="${CR}" stroke-width="10"/><path d="M84 68L140 56V74L84 86Z" fill="${CR}"/><ellipse cx="70" cy="136" rx="17" ry="13" transform="rotate(-20 70 136)" fill="${CR}"/><ellipse cx="126" cy="124" rx="17" ry="13" transform="rotate(-20 126 124)" fill="${CR}"/></g>`,
 heart:s=>`<path d="M50 88C16 62 6 44 9 29 12 12 33 4 50 24 67 4 88 12 91 29 94 44 84 62 50 88z" fill="${s.dataset.c||PD}" stroke="${CH}" stroke-width="5" stroke-linejoin="round"/>`,
 notes:s=>{const c=s.dataset.c||BE;return `<g fill="${c}"><path d="M30 20L78 8V58" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/><path d="M30 20V70" stroke="${c}" stroke-width="7"/><path d="M30 20L78 8V22L30 34Z"/><ellipse cx="20" cy="72" rx="13" ry="10" transform="rotate(-20 20 72)"/><ellipse cx="68" cy="60" rx="13" ry="10" transform="rotate(-20 68 60)"/></g>`},
 arrow:s=>`<ellipse cx="98" cy="50" rx="92" ry="22" fill="${s.dataset.h||BU}" transform="rotate(-3 98 50)"/><path d="M14 46C60 41 110 43 168 45" fill="none" stroke="${s.dataset.c||CH}" stroke-width="7" stroke-linecap="round"/><path d="M140 20L172 45L141 70" fill="none" stroke="${s.dataset.c||CH}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
 clock:()=>{let n='',t='';for(let i=1;i<=12;i++){const a=i*Math.PI/6-Math.PI/2;n+=`<text x="${(150+104*Math.cos(a)).toFixed(1)}" y="${(150+104*Math.sin(a)+11).toFixed(1)}" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="31" fill="${CH}">${i}</text>`}
   for(let i=0;i<60;i++){if(i%5==0)continue;const a=i*Math.PI/30;t+=`<circle cx="${(150+128*Math.cos(a)).toFixed(1)}" cy="${(150+128*Math.sin(a)).toFixed(1)}" r="2.4" fill="${CH}"/>`}
   return `<circle cx="150" cy="150" r="142" fill="${W}" stroke="${CH}" stroke-width="6"/>${t}${n}<path d="M150 150L150 66" stroke="${CH}" stroke-width="10" stroke-linecap="round"/><path d="M150 150L150 44" stroke="${BE}" stroke-width="6" stroke-linecap="round"/><circle cx="150" cy="150" r="11" fill="${BE}" stroke="${CH}" stroke-width="3"/>`},
 pin:s=>`<circle cx="20" cy="20" r="17" fill="${s.dataset.c||BE}" stroke="${CH}" stroke-width="3"/><circle cx="14" cy="14" r="5" fill="#fff" opacity=".7"/>`,
 squiggle:s=>`<path d="M4 20C20 4 30 36 46 20S72 4 88 20 114 36 130 20 156 4 172 20" fill="none" stroke="${s.dataset.c||BE}" stroke-width="6" stroke-linecap="round"/>`,
};
const N={star4:[100,100],star8:[100,100],flower:[100,100],spotify:[200,200],applemusic:[200,200],heart:[100,92],notes:[90,86],arrow:[200,90],clock:[300,300],pin:[40,40],squiggle:[176,40]};
Object.keys(D).forEach(k=>all('svg.'+k,s=>{s.setAttribute('viewBox',`0 0 ${N[k][0]} ${N[k][1]}`);s.innerHTML=D[k](s)}));
