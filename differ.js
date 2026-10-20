// Differentiation: five illustrated "sets" (benefit, origin, occasion, value, honesty), competitor rows and where not to compete.
(() => {
  const sec = document.getElementById("diferenciacion");
  if (!sec) return;
  const K = 'stroke="#0C0B0A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const ILL = [
    // 1 · hand holding a bar that "fills"
    `<svg viewBox="0 0 200 180"><g class="fl"><path ${K} fill="#F6C343" d="M58 150 C40 120 44 96 60 86 L72 80 L76 52 a9 9 0 0 1 18 0 l2 30 18-2 a8 8 0 0 1 8 8 v4 a8 8 0 0 1 8 10 a8 8 0 0 1 4 12 c-4 30-20 46-40 50 z"/><g transform="rotate(-24 110 60)"><rect ${K} x="70" y="44" width="80" height="26" rx="5" fill="#D6161D"/><rect x="72" y="52" width="76" height="8" fill="#C9F23A"/><text x="110" y="62" text-anchor="middle" font-family="Anton" font-size="13" fill="#fff">FIBO</text></g></g><g class="sp" fill="none" ${K.replace('#0C0B0A', '#D6161D')}><path d="M150 30l8-10M162 46l12-4M142 18l2-12"/></g></svg>`,
    // 2 · factory in Zapopan with a pin
    `<svg viewBox="0 0 200 180"><path ${K} fill="#F2EFE8" d="M30 150 V100 l30 -18 v18 l30 -18 v18 l30 -18 V150 Z"/><rect ${K} fill="#3A5CFF" x="124" y="60" width="18" height="90"/><g class="sm"><circle cx="133" cy="48" r="8" fill="#DAD7D0"/><circle cx="142" cy="34" r="10" fill="#E5E2DA"/><circle cx="154" cy="20" r="12" fill="#EFEDE7"/></g><rect ${K} fill="#C9F23A" x="46" y="120" width="16" height="16"/><rect ${K} fill="#C9F23A" x="78" y="120" width="16" height="16"/><path ${K} d="M10 150 H190"/><g class="pin"><path ${K} fill="#D6161D" d="M170 50 c-12 0 -20 8 -20 20 c0 16 20 34 20 34 s20 -18 20 -34 c0 -12 -8 -20 -20 -20z"/><circle cx="170" cy="70" r="6" fill="#fff"/></g><text x="100" y="172" text-anchor="middle" font-family="Archivo" font-size="10" fill="#0C0B0A">ZAPOPAN, JALISCO</text></svg>`,
    // 3 · person on the bus with phone & bar
    `<svg viewBox="0 0 200 180"><g class="bus"><rect ${K} fill="#D6161D" x="14" y="40" width="172" height="90" rx="12"/><rect ${K} fill="#BFE3F5" x="28" y="54" width="40" height="34" rx="4"/><rect ${K} fill="#BFE3F5" x="132" y="54" width="40" height="34" rx="4"/><circle ${K} fill="#0C0B0A" cx="50" cy="132" r="12"/><circle ${K} fill="#0C0B0A" cx="150" cy="132" r="12"/></g><g class="who"><circle ${K} fill="#E8A77C" cx="100" cy="66" r="15"/><path ${K} fill="#2A1B12" d="M86 62 a15 15 0 0 1 28 -2 q-12 -10 -28 2z"/><path ${K} fill="#C9F23A" d="M80 128 v-26 a20 20 0 0 1 40 0 v26"/><g class="arm"><path ${K} fill="none" d="M114 104 l14 -14"/><rect ${K} fill="#D6161D" x="122" y="72" width="10" height="24" rx="2" transform="rotate(20 127 84)"/></g></g><g class="tags"><rect ${K} fill="#fff" x="2" y="6" width="56" height="20" rx="10"/><text x="30" y="20" text-anchor="middle" font-family="Archivo" font-size="9">camión</text><rect ${K} fill="#fff" x="70" y="2" width="56" height="20" rx="10"/><text x="98" y="16" text-anchor="middle" font-family="Archivo" font-size="9">clase</text><rect ${K} fill="#fff" x="138" y="8" width="58" height="20" rx="10"/><text x="167" y="22" text-anchor="middle" font-family="Archivo" font-size="9">junta</text></g></svg>`,
    // 4 · balance: 22 g outweighs 10 g
    `<svg viewBox="0 0 200 180"><path ${K} d="M100 40 V160 M70 160 H130"/><g class="bal"><path ${K} d="M30 60 H170"/><path ${K} fill="none" d="M30 60 l-18 40 h36 z M170 60 l-18 40 h36 z"/><g transform="translate(30 92)"><rect ${K} fill="#D6161D" x="-22" y="-22" width="44" height="22" rx="4"/><text y="-7" text-anchor="middle" font-family="Anton" font-size="13" fill="#fff">22 G</text></g><g transform="translate(170 92)"><rect ${K} fill="#E5E2DA" x="-14" y="-14" width="28" height="14" rx="3"/><text y="-3" text-anchor="middle" font-family="Anton" font-size="9">10 G</text></g></g><circle ${K} fill="#C9F23A" cx="100" cy="40" r="7"/></svg>`,
    // 5 · magnifier over label with check
    `<svg viewBox="0 0 200 180"><rect ${K} fill="#fff" x="40" y="24" width="96" height="130" rx="4"/><path ${K} d="M52 44 H124" stroke-width="6"/>${[64, 82, 100, 118].map((y) => `<path ${K} d="M52 ${y} H124" stroke-width="2"/>`).join("")}<g class="mag"><circle ${K} fill="rgba(58,92,255,.18)" cx="120" cy="96" r="30"/><path ${K} stroke-width="8" d="M142 118 l26 26"/><path ${K} fill="none" stroke="#4C8A1E" stroke-width="5" d="M106 96 l10 10 l18 -20"/></g></svg>`,
  ];
  const D = [
    { n: "Beneficio", tag: "01", t: "Una barra que sí te llena", d: "Otras hablan de proteína, sabor o etiqueta limpia. Ninguna promete saciedad para el día a día, y FIBO tiene con qué: 22 g de proteína, 10 g de fibra y una barra más grande." },
    { n: "Origen", tag: "02", t: "Hecha en Jalisco", d: "Por El Molino, en su planta de Zapopan. Wild es chilena, Barebells sueca, Quest estadounidense; Bimbo, Barrinolas y Evolution son nacionales. Ninguna es tapatía." },
    { n: "Ocasión", tag: "03", t: "Los momentos reales de la ciudad", d: "La categoría muestra el producto o el gimnasio. FIBO habla del camión, la clase, la junta o la Vía RecreActiva: «Con FIBO te encuentras»." },
    { n: "Valor", tag: "04", t: "Más barra y más proteína", d: "Más del doble que una barra de 10 g y a menor costo por gramo que las importadas." },
    { n: "Honestidad", tag: "05", t: "Solo lo que puede comprobar", d: "Donde Profeco ha encontrado productos que no cumplen lo que dicen, FIBO comunica solo lo que puede comprobar." },
  ];
  const sets = document.getElementById("dfSets");
  sets.innerHTML = D.map((x, i) => `<article class="df__set${i === 0 ? " on" : ""}" tabindex="0" style="--i:${i}"><div class="ill">${ILL[i]}</div><h4>${x.n} <b class="mono">${x.tag}</b></h4><p class="t">${x.t}</p><p class="d">${x.d}</p><span class="ar" aria-hidden="true">→</span></article>`).join("");
  const ss = [...sets.children];
  ss.forEach((s) => { const on = () => ss.forEach((o) => o.classList.toggle("on", o === s)); s.addEventListener("pointerenter", on); s.addEventListener("focus", on); s.addEventListener("click", on); });
  document.getElementById("dfFormula").innerHTML = D.map((x) => `<span>${x.n}</span>`).join("<i>+</i>") + `<i>=</i><b>FIBO</b>`;

  const V = [
    [["bm-evolution"], "Evolution", "Mismo producto", "Marca, ocasión y origen local", "no por cifras"],
    [["bm-wild", "bm-7select"], "Wild Protein · 7-Select", "Dominan el anaquel de conveniencia", "Más proteína y una barra más grande", ""],
    [["bm-quest", "bm-barebells"], "Quest · Barebells", "Premium importadas", "Valor más accesible y una marca cercana", ""],
    [["po-zebra"], "Zebra", "Gana en etiqueta limpia", "Más proteína y saciedad", ""],
    [["bm-bimbo", "bm-barrinolas"], "Bimbo · Barrinolas", "Precio y distribución", "El doble de proteína y una identidad más auténtica", ""],
  ];
  document.getElementById("dfRows").innerHTML = V.map(([im, n, them, us, note], i) => `
    <article class="df__row" style="--i:${i}">
      <div class="them"><div class="ims">${im.map((s) => `<img src="assets/${s}.webp" alt="">`).join("")}</div><div><b>${n}</b><span class="mono">${them}</span></div></div>
      <span class="vs mono">vs</span>
      <div class="us"><img src="assets/fibo-cookies.webp" alt=""><div><span class="mono">FIBO se diferencia por</span><b>${us}</b>${note ? `<em>${note}</em>` : ""}</div></div>
    </article>`).join("");

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  sec.querySelectorAll(".df__win, #dfVs, .df__not, #dfOwn").forEach((n) => io.observe(n));
})();
