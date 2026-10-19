// SWOT (FODA): a classic 2×2 board whose quadrants expand on click with live widgets, plus the four cross-strategies with an animated arrow.
(() => {
  const sec = document.getElementById("foda");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const I = {
    bar: "M3 9h18v6H3zM7 9v6M17 9v6", coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M9 10c0-1 1.3-2 3-2s3 .8 3 2-1.3 1.5-3 2-3 1-3 2 1.3 2 3 2 3-1 3-2M12 6v2M12 16v2",
    factory: "M3 21V10l6 4V10l6 4V6l6-3v18zM7 17h2M12 17h2M17 17h2", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2", store: "M3 9l2-5h14l2 5M4 9h16v11H4zM9 14h6",
    pin: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4", mute: "M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6",
    flask: "M9 3h6M10 3v6l-6 10a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V3", scale: "M12 3v18M5 7h14M5 7l-3 7h6zM19 7l-3 7h6z", lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
    trend: "M3 17l6-6 4 4 8-8M15 7h6v6", star: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z", grow: "M12 21V11M12 11c0-4 3-7 8-7 0 5-3 7-8 7zM12 14c0-3-2-5-6-5 0 3 2 5 6 5",
    cal: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4", swords: "M4 4l10 10M14 10l6-6M4 20l4-4M20 20l-4-4M10 14l-6 6", law: "M12 3v18M7 21h10M4 8h16M4 8l-2 6h6zM20 8l-2 6h6z", cart: "M3 4h2l2.4 11h10.2L20 7H6",
  };

  const Q = [
    { k: "F", n: "Fortalezas", s: "Interno · a favor", c: "#C9F23A", t: "#0C0B0A", lead: "El producto y quien lo fabrica.",
      items: [
        { i: I.bar, h: "Un producto único", b: "65 g con 22 g de proteína y 10 g de fibra: ninguna barra comparada lo reúne. Los consumidores la describen como «llenadora».", n: "22 g" },
        { i: I.coin, h: "Más valor por gramo", b: "Menos pesos por gramo de proteína que las importadas y más del doble de proteína que las masivas de su anaquel.", n: "×2" },
        { i: I.factory, h: "El Molino detrás", b: "Planta propia en Zapopan, certificación de inocuidad FSSC 22000 y capacidad para hasta 7 millones de barras al año.", n: "7 M" },
        { i: I.chart, h: "Base comercial real", b: "34 millones de pesos facturados desde 2019.", n: "$34 M" },
        { i: I.store, h: "Canales que ya funcionan", b: "7-Eleven triplicó sus compras en el último año. Además Nutrisa, ≈150 gimnasios y 90 puntos de Más Natural Más Sano.", n: "×3" },
        { i: I.pin, h: "Hecha en Jalisco", b: "Algo que ningún competidor puede decir." },
      ],
      w: `<div class="fd__w"><p class="mono">Capacidad de El Molino</p><b data-cnt="7000000">0</b><span>barras al año</span><div class="fd__bars"><i style="--h:30%"></i><i style="--h:46%"></i><i style="--h:58%"></i><i style="--h:72%"></i><i style="--h:100%"></i></div><small class="mono">$34 M facturados desde 2019</small></div>` },
    { k: "D", n: "Debilidades", s: "Interno · en contra", c: "#D6161D", t: "#fff", lead: "Una marca apagada y un negocio sin control.",
      items: [
        { i: I.mute, h: "La marca está apagada", b: "11 meses sin publicar, ≈3,000 seguidores menos, 2 logos, 4 nombres, 3 líneas visuales y menos de $60 mil en publicidad en 8 años.", n: "<$60 mil" },
        { i: I.flask, h: "Pendientes del producto", b: "Textura que algunos perciben seca, 2 sellos, claims que no se sostienen («whey», «sin azúcar añadida»), proteína sin validar en laboratorio en los 4 sabores y el mismo código de barras en 3 sabores." },
        { i: I.scale, h: "Un negocio frágil", b: "≈60% del volumen en dos clientes, cinco precios distintos y sin control de la exhibición ni datos de venta por tienda.", n: "60%" },
        { i: I.lock, h: "Sin control total", b: "Algunos activos digitales están a nombre de un tercero. No se puede calcular la venta neta ni hay un costo validado." },
      ],
      w: `<div class="fd__w"><p class="mono">Margen</p><div class="fd__mg2"><span><b>42.5%</b><i style="--h:100%"></i><small class="mono">antes</small></span><span class="dn"><b>37.2%</b><i style="--h:87%"></i><small class="mono">hoy</small></span></div><small class="mono">−5.3 puntos</small></div>` },
    { k: "O", n: "Oportunidades", s: "Externo · a favor", c: "#3A5CFF", t: "#fff", lead: "El mercado juega a favor.",
      items: [
        { i: I.trend, h: "La tendencia", b: "La proteína ya es consumo diario, se come cada vez más entre comidas y fuera de casa, y la conveniencia es el centro de ese hábito." },
        { i: I.star, h: "Espacios que nadie ocupa", b: "La barra que llena en el día a día, una marca tapatía y «más proteína por tu dinero»." },
        { i: I.grow, h: "Crecer sin canales nuevos", b: "137 tiendas de Más Natural Más Sano sin FIBO, 100+ Nutrisa por reponer, los 10 7-Eleven visitados sin barra y 5 clientes inactivos que compraron más de $200 mil en 2025.", n: "+$200 mil" },
        { i: I.store, h: "Mediano plazo", b: "OXXO, Farmacias Guadalajara, Upper y Costco." },
        { i: I.cal, h: "Vitrinas en Guadalajara", b: "Vía RecreActiva cada domingo, Maratón del 8 de noviembre, Medio Maratón de febrero, pádel, universidades y los propósitos de año nuevo." },
      ],
      w: `<div class="fd__w"><p class="mono">Próximas vitrinas</p><ul class="fd__cd" id="fdCd"></ul></div>` },
    { k: "A", n: "Amenazas", s: "Externo · en contra", c: "#0C0B0A", t: "#fff", lead: "Más competencia, más regulación.",
      items: [
        { i: I.swords, h: "La competencia se intensifica", b: "Evolution, casi idéntica y más barata; 7-Select a la mitad del precio en el mismo anaquel; Wild Protein con capital, material y «sin sellos»; Bimbo con distribución nacional; y sustitutos como el yogur alto en proteína." },
        { i: I.law, h: "Regulación", b: "Restricciones a productos con sellos en escuelas y universidades, una posible alza del IEPS de 8% a 20% y más vigilancia de Profeco.", n: "IEPS 20%" },
        { i: I.cart, h: "El canal", b: "Revendedores como Fitstore controlan Amazon y Mercado Libre, y la dependencia de 7-Eleven expone a FIBO a cualquier cambio en sus compras." },
      ],
      w: `<div class="fd__w"><p class="mono">IEPS posible</p><svg class="fd__gauge" viewBox="0 0 120 70"><path class="tr" d="M10 60a50 50 0 0 1 100 0"/><path class="v" pathLength="100" d="M10 60a50 50 0 0 1 100 0"/><line class="nd" x1="60" y1="60" x2="60" y2="18"/></svg><div class="fd__ieps"><span>8%</span><b>→ 20%</b></div></div>` },
  ];

  const grid = document.getElementById("fdGrid"), tip = document.getElementById("fdTip");
  grid.innerHTML = Q.map((q, i) => `
    <article class="fd__q q${q.k}" data-i="${i}" style="--c:${q.c};--t:${q.t}" tabindex="0" role="button" aria-expanded="false">
      <header><b class="lt">${q.k}</b><div><h3>${q.n}</h3><span class="mono">${q.s} · ${q.items.length}</span></div><i class="x" aria-hidden="true"></i></header>
      <p class="ld">${q.lead}</p>
      <ul class="chips">${q.items.map((it) => `<li>${ic(it.i)}<span>${it.h}</span>${it.n ? `<em class="mono">${it.n}</em>` : ""}</li>`).join("")}</ul>
      <div class="det"><ul>${q.items.map((it, k) => `<li style="--k:${k}">${ic(it.i)}<div><b>${it.h}</b><p>${it.b}</p></div>${it.n ? `<em>${it.n}</em>` : ""}</li>`).join("")}</ul>${q.w}</div>
    </article>`).join("");
  const qs = [...grid.children];
  const open = (i) => {
    const cur = +grid.dataset.open;
    const n = cur === i ? -1 : i;
    grid.dataset.open = n;
    qs.forEach((q, k) => { q.classList.toggle("open", k === n); q.classList.toggle("mini", n > -1 && k !== n); q.setAttribute("aria-expanded", k === n); });
    tip.textContent = n < 0 ? "Toca un cuadrante para abrirlo" : "Toca otra vez para cerrar";
    if (n > -1) widgets(qs[n]);
  };
  qs.forEach((q, i) => {
    q.addEventListener("click", () => open(i));
    q.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } });
  });
  document.getElementById("fdCore").addEventListener("click", () => { if (+grid.dataset.open > -1) open(+grid.dataset.open); });

  // live countdown to Guadalajara's showcases
  const cd = document.getElementById("fdCd");
  const now = new Date();
  const days = (d) => Math.ceil((d - now) / 864e5);
  const nextSun = new Date(now); nextSun.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  const yr = now.getFullYear();
  const mar = new Date(yr, 10, 8) > now ? new Date(yr, 10, 8) : new Date(yr + 1, 10, 8);
  const ny = new Date(yr + 1, 0, 1);
  const EV = [["Vía RecreActiva", "cada domingo", days(nextSun)], ["Maratón de Guadalajara", "8 de noviembre", days(mar)], ["Año nuevo · propósitos", "1 de enero", days(ny)], ["Medio Maratón", "febrero · aprox.", days(new Date(mar.getMonth() > 1 ? yr + 1 : yr, 1, 1))]];
  cd.innerHTML = EV.map(([n, d, k]) => `<li><b>${k}</b><small class="mono">días</small><span>${n}<i class="mono">${d}</i></span></li>`).join("");

  function widgets(q) {
    const c = q.querySelector("[data-cnt]");
    if (c && !c.dataset.done) {
      c.dataset.done = 1;
      const N = +c.dataset.cnt, t0 = performance.now();
      const f = (t) => { const k = Math.min(1, (t - t0) / 1400); c.textContent = Math.round(N * (1 - Math.pow(1 - k, 3))).toLocaleString("es-MX"); if (k < 1) requestAnimationFrame(f); };
      reduced ? (c.textContent = N.toLocaleString("es-MX")) : requestAnimationFrame(f);
    }
  }

  /* cross strategies */
  const X = [
    { k: "FO", a: "F", b: "O", n: "Aprovechar", h: "Usar las fortalezas para aprovechar las oportunidades.", p: "Su producto que llena y su valor por gramo encajan con la proteína cotidiana y con el espacio de la barra para el día a día en Guadalajara.", l: ["Producto que llena → proteína cotidiana", "Valor por gramo → «más proteína por tu dinero»", "Hecha en Jalisco → marca tapatía"], d: "M50 50 L50 150" },
    { k: "DO", a: "D", b: "O", n: "Corregir", h: "Corregir las debilidades para no desperdiciar las oportunidades.", p: "Ordenar el precio, la exhibición y la identidad antes de invertir en notoriedad.", l: ["Cinco precios → un precio por canal", "Sin material → exhibición propia", "Dos logos, cuatro nombres → una identidad"], d: "M150 50 L50 150" },
    { k: "FA", a: "F", b: "A", n: "Defender", h: "Usar las fortalezas para defenderse de las amenazas.", p: "Frente a Evolution y 7-Select, diferenciarse por marca, cultura local y experiencia, no por precio.", l: ["Marca, no precio", "Cultura local que nadie puede copiar", "Experiencia: sampling y vitrinas"], d: "M50 50 L150 150" },
    { k: "DA", a: "D", b: "A", n: "Cerrar flancos", h: "Cerrar los flancos más vulnerables.", p: "Lo que hoy deja a FIBO expuesta ante la competencia y la regulación.", l: ["Validar la proteína y los claims", "Mejorar la textura", "Reducir la dependencia de dos clientes"], d: "M150 50 L150 150" },
  ];
  const tabs = document.getElementById("fdTabs"), xt = document.getElementById("fdXt"), arr = document.getElementById("fdArr");
  const cells = [...sec.querySelectorAll(".fd__mg i")];
  tabs.innerHTML = X.map((x, i) => `<button type="button" role="tab" data-i="${i}"><b class="mono">${x.k}</b>${x.n}</button>`).join("");
  const tb = [...tabs.children];
  let xi = 0, xt0 = 0;
  function cross(i, user) {
    xi = i; const x = X[i];
    tb.forEach((b, k) => { b.classList.toggle("on", k === i); b.setAttribute("aria-selected", k === i); });
    cells.forEach((c) => c.classList.toggle("on", c.dataset.q === x.a || c.dataset.q === x.b));
    arr.setAttribute("d", x.d);
    xt.querySelector("span").textContent = `${x.k} · ${x.n}`;
    xt.querySelector("h3").textContent = x.h; xt.querySelector("p").textContent = x.p;
    xt.querySelector("ul").innerHTML = x.l.map((t) => `<li>${t}</li>`).join("");
    xt.classList.remove("swap"); void xt.offsetWidth; xt.classList.add("swap");
    // highlight the two quadrants on the board too
    qs.forEach((q) => q.classList.toggle("lit", q.classList.contains("q" + x.a) || q.classList.contains("q" + x.b)));
    if (user) clearInterval(xt0);
  }
  tb.forEach((b, i) => b.addEventListener("click", () => cross(i, true)));
  cross(0);

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.id === "fdCross" && !reduced) xt0 = setInterval(() => cross((xi + 1) % X.length), 5000);
    io.unobserve(e.target);
  }), { threshold: 0.2 });
  sec.querySelectorAll(".fd__head, #fdBoard, #fdCross").forEach((n) => io.observe(n));
})();
