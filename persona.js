// Brand personality: a bento board around a chibi FIBO character with a laptop full of stickers; each trait card shows a Guadalajara photo.
(() => {
  const sec = document.getElementById("personalidad");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = [
    { n: "Curiosa", e: "🔍", c: "#4C8A1E", img: "pe-biblioteca", d: "Se interesa por lo que pasa a su alrededor: lugares, música, comida, gente. No se queda en el gimnasio: explora rincones, rutas, eventos y personajes de Guadalajara.", no: "Curiosa no es dispersa: siempre regresa a acompañar tu día." },
    { n: "Cercana", e: "🤝", c: "#D6161D", img: "pe-concierto", d: "Habla como un amigo, no como un experto en nutrición ni como una marca que da órdenes. Tutea y entiende los días llenos. «Pendientes sí. Hambre no.»", no: "Cercana no es informal en exceso: humor sin perder claridad ni respeto." },
    { n: "Inesperada", e: "✨", c: "#F2B705", img: "pe-udg", d: "Aparece donde no la esperas y dice lo que otras no dicen. En vez de alguien levantando pesas, alguien comiendo la barra en el camión o entre clases.", no: "Inesperada no es provocadora: sorprende sin incomodar." },
    { n: "Cultural", e: "🎺", c: "#3A5CFF", img: "pe-charro", img2: "pe-patio", d: "Es tapatía y lo hace notar: su ciudad, su gente, su forma de moverse, sus eventos. El rasgo que más la distingue de marcas chilenas, suecas o estadounidenses.", no: "Cultural no es folclórica: la ciudad real de hoy, no estereotipos." },
    { n: "Sensorial", e: "😋", c: "#B03CE0", img: "fibo-chocolate", bar: 1, d: "Se disfruta: habla del sabor, la textura y el antojo, y su estilo hace que la barra se vea rica. No es solo proteína: es un antojo que llena.", no: "Para sostenerlo, la barra tiene que cumplir en la primera mordida." },
  ];

  /* chibi character */
  const K = 'stroke="#0C0B0A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
  document.getElementById("peChibi").innerHTML = `
    <g class="bob">
      <path ${K} fill="#3A5CFF" d="M110 400 C110 330 150 300 200 300 C250 300 290 330 290 400 Z"/>
      <rect ${K} fill="#F2D3B5" x="178" y="272" width="44" height="36" rx="10"/>
      <ellipse ${K} fill="#F2D3B5" cx="200" cy="210" rx="92" ry="80"/>
      <path ${K} fill="#2A1B12" d="M112 206 C108 150 150 120 200 120 C250 120 292 150 288 206 C270 186 250 182 230 186 C210 170 180 172 165 186 C145 180 125 186 112 206 Z"/>
      <path ${K} fill="#D6161D" d="M104 170 C104 112 150 92 200 92 C250 92 296 112 296 170 Z"/>
      <path ${K} fill="#D6161D" d="M240 168 C280 166 320 172 336 184 C316 190 280 188 240 182 Z"/>
      <rect x="168" y="110" width="64" height="30" rx="6" fill="#C9F23A" stroke="#0C0B0A" stroke-width="3"/><text x="200" y="133" text-anchor="middle" font-family="Anton" font-size="22" fill="#0C0B0A">FIBO</text>
      <path ${K} fill="none" stroke-width="10" d="M100 200 C96 130 304 130 300 200"/>
      <rect ${K} fill="#F2EFE8" x="84" y="190" width="30" height="54" rx="14"/><rect ${K} fill="#F2EFE8" x="286" y="190" width="30" height="54" rx="14"/>
      <g class="eyes"><path ${K} fill="#0C0B0A" d="M150 214 q14 -14 28 0 q-14 8 -28 0z"/><path ${K} fill="#0C0B0A" d="M222 214 q14 -14 28 0 q-14 8 -28 0z"/></g>
      <ellipse cx="146" cy="240" rx="12" ry="7" fill="#F28B82" opacity=".7"/><ellipse cx="254" cy="240" rx="12" ry="7" fill="#F28B82" opacity=".7"/>
      <path ${K} fill="none" d="M188 246 q12 10 24 0"/>
    </g>
    <path ${K} fill="#F2D3B5" d="M112 360 q-20 -10 -10 -34 l22 6z"/><path ${K} fill="#F2D3B5" d="M288 360 q20 -10 10 -34 l-22 6z"/><g class="lap"><rect ${K} fill="#2A2A2A" x="110" y="300" width="180" height="116" rx="10"/>
      <g class="stk1"><circle cx="150" cy="335" r="18" fill="#C9F23A" stroke="#0C0B0A" stroke-width="2"/><text x="150" y="341" text-anchor="middle" font-size="18">🌮</text></g>
      <g class="stk2"><rect x="186" y="318" width="70" height="26" rx="13" fill="#D6161D" stroke="#fff" stroke-width="2" transform="rotate(-8 221 331)"/><text x="221" y="336" text-anchor="middle" font-family="Anton" font-size="15" fill="#fff" transform="rotate(-8 221 331)">GDL</text></g>
      <g class="stk3"><path d="M246 370 l6 12 13 2 -9 9 2 13 -12 -6 -12 6 2 -13 -9 -9 13 -2z" fill="#F2B705" stroke="#0C0B0A" stroke-width="2"/></g>
      <g class="stk4"><rect x="130" y="366" width="84" height="30" rx="6" fill="#F2EFE8" stroke="#0C0B0A" stroke-width="2" transform="rotate(6 172 381)"/><text x="172" y="386" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="11" fill="#0C0B0A" transform="rotate(6 172 381)">sí te llena</text></g>
      <circle cx="200" cy="309" r="3" fill="#555"/>
    </g>
    <g class="spark"><path d="M330 90 l6 18 18 6 -18 6 -6 18 -6 -18 -18 -6 18 -6z" fill="#F2B705"/><path d="M60 300 l4 12 12 4 -12 4 -4 12 -4 -12 -12 -4 12 -4z" fill="#F2B705"/><path d="M350 260 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z" fill="#C9F23A"/></g>`;

  // stars sticker field
  const SC = ["#9DB4FF", "#C9F23A", "#F6C3D6", "#F2B705", "#C9B6D9", "#8FD6B8", "#F28B82", "#9A978F"];
  document.getElementById("peStars").innerHTML = Array.from({ length: 16 }, (_, i) => `<svg viewBox="0 0 24 24" style="--x:${(i * 37) % 86}%;--y:${(i * 53) % 88}%;--s:${26 + (i * 7) % 22}px;--r:${(i * 41) % 60 - 30}deg;--d:${(i % 5) * -.8}s"><path fill="${SC[i % SC.length]}" d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z"/></svg>`).join("");

  // trait cards
  const tr = document.getElementById("peTraits");
  tr.innerHTML = T.map((t, i) => `
    <article class="pe__c tr" data-i="${i}" style="--c:${t.c}" tabindex="0">
      <span class="pe__lb mono">Rasgo 0${i + 1}</span>
      <div class="ph${t.bar ? " bar" : ""}"><img src="assets/${t.img}.webp" alt="">${t.img2 ? `<img class="p2" src="assets/${t.img2}.webp" alt="">` : ""}<span class="emo">${t.e}</span></div>
      <h4>${t.n}</h4>
      <p class="d">${t.d}</p>
      <p class="no mono">${t.no}</p>
    </article>`).join("");
  const cards = [...tr.children];
  const say = document.getElementById("peSay");
  let cur = -1, timer = 0;
  const show = (i) => {
    cur = i; const t = T[i];
    cards.forEach((c, k) => c.classList.toggle("on", k === i));
    say.style.setProperty("--c", t.c);
    say.querySelector("b").textContent = `${t.e} ${t.n}`;
    say.querySelector("span").textContent = t.d.split(".")[0] + ".";
    say.classList.remove("pop"); void say.offsetWidth; say.classList.add("pop");
  };
  cards.forEach((c, i) => { c.addEventListener("pointerenter", () => { clearInterval(timer); show(i); }); c.addEventListener("click", () => { clearInterval(timer); show(i); }); });
  document.getElementById("peChibi").addEventListener("click", () => { clearInterval(timer); show((cur + 1) % T.length); });
  show(0);

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (!reduced) timer = setInterval(() => show((cur + 1) % T.length), 4000);
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  io.observe(document.getElementById("peBento"));
})();
