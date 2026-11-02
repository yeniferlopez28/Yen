// Patrones y doodles del carrusel Spotify Wrapped
const K='#141414',C='#F4EFE4',G='#1ED760',L='#CDF564',P='#F573B8',O='#FF8A1F',U='#6B12C9',B='#4A2259',S='#E8A383',V='#7A1F3D';
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function starPts(n,cx,cy,R,r,jit,seed){const rnd=rng(seed||7);let s=[];for(let i=0;i<n*2;i++){const a=Math.PI*i/n-Math.PI/2;const rr=i%2?r:R*(jit?(1-jit+rnd()*jit):1);s.push((cx+rr*Math.cos(a)).toFixed(1)+','+(cy+rr*Math.sin(a)).toFixed(1))}return s.join(' ')}
const all=(sel,fn)=>document.querySelectorAll(sel).forEach(fn);
const dim=s=>[+s.getAttribute('width'),+s.getAttribute('height')];

// tablero ondulado (como "Wrapped is here")
all('svg.checker',s=>{const[W,H]=dim(s);s.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const cols=+s.dataset.cols||10,rows=+s.dataset.rows||3,A=+s.dataset.amp||30,f=+s.dataset.freq||1,ph=+s.dataset.ph||0,col=s.dataset.c||K;
  const map=(u,v)=>{const pinch=.5+.5*Math.sin(Math.PI*u*.9+.4);return[u*W,H/2+(v-.5)*H*pinch+A*Math.sin(2*Math.PI*u*f+ph)]};
  let g='';const seg=6;
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){if((i+j)%2)continue;const u0=i/cols,u1=(i+1)/cols,v0=j/rows,v1=(j+1)/rows;let pts=[];
    for(let k=0;k<=seg;k++)pts.push(map(u0+(u1-u0)*k/seg,v0));for(let k=seg;k>=0;k--)pts.push(map(u0+(u1-u0)*k/seg,v1));
    g+=`<polygon points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="${col}"/>`}
  s.innerHTML=`<g filter="url(#rough)">${g}</g>`});

// garabato a mano
all('svg.scribble',s=>{const[W,H]=dim(s);s.setAttribute('viewBox',`0 0 ${W} ${H}`);const r=rng(+s.dataset.seed||3);const n=+s.dataset.n||7;
  let x=r()*W,y=r()*H,d=`M${x.toFixed(0)} ${y.toFixed(0)}`;for(let i=0;i<n;i++){const x2=r()*W,y2=r()*H;d+=` C${(r()*W).toFixed(0)} ${(r()*H).toFixed(0)} ${(r()*W).toFixed(0)} ${(r()*H).toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`}
  s.innerHTML=`<path d="${d}" fill="none" stroke="${s.dataset.c||K}" stroke-width="${s.dataset.w||3.5}" stroke-linecap="round" stroke-linejoin="round"/>`});

// explosiones de picos
all('svg.burst',s=>{const[W,H]=dim(s);s.setAttribute('viewBox',`0 0 ${W} ${H}`);const n=+s.dataset.n||14,ri=+s.dataset.ri||.55;
  s.innerHTML=`<polygon points="${starPts(n,W/2,H/2,Math.min(W,H)/2,Math.min(W,H)/2*ri,+s.dataset.jit||0,+s.dataset.seed||5)}" fill="${s.dataset.c||O}" ${s.dataset.stroke?`stroke="${s.dataset.stroke}" stroke-width="4" stroke-linejoin="round"`:''}/>`});
all('svg.star4',s=>{s.setAttribute('viewBox','0 0 100 100');s.innerHTML=`<path d="M50 0C54 38 62 46 100 50C62 54 54 62 50 100C46 62 38 54 0 50C38 46 46 38 50 0Z" fill="${s.dataset.c||K}"/>`});
// flor de 4 círculos (marco tipo Wrapped)
all('svg.blob4',s=>{s.setAttribute('viewBox','0 0 200 200');const c=s.dataset.c||U;s.innerHTML=`<circle cx="62" cy="62" r="62" fill="${c}"/><circle cx="138" cy="62" r="62" fill="${c}"/><circle cx="62" cy="138" r="62" fill="${c}"/><circle cx="138" cy="138" r="62" fill="${c}"/>`});
// marco de picos cóncavos (como "My Top Artists")
all('svg.spiky',s=>{const[W,H]=dim(s);s.setAttribute('viewBox',`0 0 ${W} ${H}`);const n=+s.dataset.n||6,m=26;let pts=[];
  for(let i=0;i<n;i++)pts.push([m+(W-2*m)*i/n,m]);for(let i=0;i<n;i++)pts.push([W-m,m+(H-2*m)*i/n]);for(let i=0;i<n;i++)pts.push([W-m-(W-2*m)*i/n,H-m]);for(let i=0;i<n;i++)pts.push([m,H-m-(H-2*m)*i/n]);
  let d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<=pts.length;i++){const a=pts[i-1],b=pts[i%pts.length];const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;const cx=mx+(W/2-mx)*.16,cy=my+(H/2-my)*.16;d+=` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0]} ${b[1]}`}
  s.innerHTML=`<path d="${d}Z" fill="${s.dataset.fill||'none'}" stroke="${s.dataset.c||P}" stroke-width="${s.dataset.w||9}" stroke-linejoin="round"/>`});
// manchas orgánicas (como el anuncio de "deja vu")
all('svg.waves',s=>{const[W,H]=dim(s);s.setAttribute('viewBox',`0 0 ${W} ${H}`);
  s.innerHTML=`<path d="M0 ${H*.3}C${W*.2} ${H*.1} ${W*.38} ${H*.42} ${W*.55} ${H*.24}S${W*.85} ${H*0} ${W} ${H*.12}V${H}H0Z" fill="${B}"/><path d="M-20 ${H*.4}C${W*.18} ${H*.2} ${W*.36} ${H*.52} ${W*.56} ${H*.34}S${W*.84} ${H*.1} ${W+20} ${H*.24}" fill="none" stroke="${S}" stroke-width="30" stroke-linecap="round"/>`});

// íconos cute
const D={
 spotify:()=>`<g transform="rotate(-8 100 100)"><circle cx="100" cy="100" r="94" fill="${K}"/><circle cx="100" cy="100" r="86" fill="${C}"/><circle cx="100" cy="100" r="75" fill="${G}"/><path d="M50 82Q100 58 152 88" fill="none" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M57 109Q100 89 144 113" fill="none" stroke="${K}" stroke-width="13" stroke-linecap="round"/><path d="M64 134Q100 118 134 136" fill="none" stroke="${K}" stroke-width="11" stroke-linecap="round"/><path d="M168 18c2 12 5 15 17 17-12 2-15 5-17 17-2-12-5-15-17-17 12-2 15-5 17-17z" fill="${L}" stroke="${K}" stroke-width="2.5"/></g>`,
 applemusic:()=>`<defs><linearGradient id="am" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6A86"/><stop offset="1" stop-color="#F0294A"/></linearGradient></defs><g transform="rotate(6 100 100)"><rect x="8" y="8" width="184" height="184" rx="50" fill="${K}"/><rect x="16" y="16" width="168" height="168" rx="43" fill="url(#am)" stroke="${C}" stroke-width="7"/><path d="M84 66L142 54V122" fill="none" stroke="${C}" stroke-width="10" stroke-linejoin="round"/><path d="M84 66V134" stroke="${C}" stroke-width="10"/><path d="M84 66L142 54V72L84 84Z" fill="${C}"/><ellipse cx="70" cy="136" rx="17" ry="13" transform="rotate(-20 70 136)" fill="${C}"/><ellipse cx="128" cy="124" rx="17" ry="13" transform="rotate(-20 128 124)" fill="${C}"/></g>`,
 heart:()=>`<path d="M50 88C16 62 6 44 9 29 12 12 33 4 50 24 67 4 88 12 91 29 94 44 84 62 50 88z" fill="${G}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`,
 arrow:()=>`<ellipse cx="98" cy="50" rx="92" ry="22" fill="${L}" transform="rotate(-3 98 50)"/><path d="M14 46C60 41 110 43 168 45" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M140 20L172 45L141 70" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
 arrowc:()=>`<ellipse cx="98" cy="50" rx="92" ry="22" fill="${P}" transform="rotate(-3 98 50)"/><path d="M14 46C60 41 110 43 168 45" fill="none" stroke="${C}" stroke-width="7" stroke-linecap="round"/><path d="M140 20L172 45L141 70" fill="none" stroke="${C}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
};
const N={spotify:[200,200],applemusic:[200,200],heart:[100,92],arrow:[200,90],arrowc:[200,90]};
Object.keys(D).forEach(k=>all('svg.'+k,s=>{s.setAttribute('viewBox',`0 0 ${N[k][0]} ${N[k][1]}`);s.innerHTML=D[k](s)}));

// motitas de papel en fondos claros
all('.speck',el=>{const r=rng(+el.dataset.seed||11);let h='';const cols=['#9a6a45','#d9822b','#141414','#b7a68f'];
  for(let i=0;i<170;i++){const sz=1+r()*3.2;h+=`<i style="left:${(r()*100).toFixed(2)}%;top:${(r()*100).toFixed(2)}%;width:${sz.toFixed(1)}px;height:${sz.toFixed(1)}px;background:${cols[Math.floor(r()*cols.length)]};opacity:${(.25+r()*.5).toFixed(2)}"></i>`}
  el.innerHTML=h});
