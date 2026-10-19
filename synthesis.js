// Market synthesis: an Atlas-style explorer (menu + animated line-art scene per topic) and a numbered accordion with the detail.
(() => {
  const sec = document.getElementById("sintesis");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const I = {
    fill: "M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM8 6c0-2 2-2 2-4M14 6c0-2 2-2 2-4",
    price: "M3 12 12 3h8v8l-9 9zM16 8h.01",
    gym: "M2 12h3M19 12h3M5 8v8M19 8v8M8 6v12M16 6v12M8 12h8M4 4l16 16",
    trust: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
    find: "M3 9l2-5h14l2 5M4 9h16v11H4zM10 20v-6h4v6",
    flag: "M5 21V4l12 4-12 4",
    pin: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
    coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M9 9.5c0-1 1.3-1.8 3-1.8s3 .8 3 1.8-1.3 1.6-3 2-3 1-3 2 1.3 1.8 3 1.8 3-.8 3-1.8M12 6v1.7M12 16.3V18",
    bus: "M4 4h16v12H4zM4 11h16M7 20v-4M17 20v-4M8 14h.01M16 14h.01",
    run: "M13 4a2 2 0 1 0 0-.01M8 21l3-6 3 3v3M6 12l3-3 4 1 3 3 3 1",
    sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
    store: "M3 9l2-5h14l2 5M4 9h16v11H4zM9 13h6",
    box: "M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8",
    users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M2 21v-1a6 6 0 0 1 12 0v1M17 11a3 3 0 1 0 0-6M22 21v-1a5 5 0 0 0-4-5",
    uni: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5",
    warn: "M12 3l10 18H2zM12 10v5M12 18h.01",
    arrow: "M5 12h14M13 6l6 6-6 6",
    crack: "M12 2l-2 6 4 3-3 5 3 6",
    q: "M9 9a3 3 0 1 1 4 2.8c-.7.3-1 1-1 1.7V15M12 19h.01",
    check: "M5 12l4 4 10-10",
    test: "M9 3h6M10 3v6l-6 10a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V3",
  };

  const A = [
    { t: "Necesidades desatendidas", tags: ["Llenar", "Precio", "Cotidiano", "Confianza", "Visibilidad"],
      cap: ["Cinco necesidades sin resolver", "En el camino de todos los días: llenar, pagar un precio razonable, no ser «de gimnasio», confiar y encontrarla.", "79 min al día en traslados"],
      body: `<ul class="sy__rows">
        <li>${ic(I.fill)}<div><b>Algo que llene entre comidas y se coma en el camino</b><span>Las barras de 10 g no llenan y las de 20 g se venden como suplemento.</span></div><em class="mono">79 min/día</em></li>
        <li>${ic(I.price)}<div><b>Proteína suficiente a un precio razonable</b><span>La mayoría tiene entre 8 y 12 g; las que tienen más son importadas y caras.</span></div><em class="mono">8–12 g</em></li>
        <li>${ic(I.gym)}<div><b>Un snack que no sea «de gimnasio»</b><span>La proteína ya se volvió cotidiana.</span></div></li>
        <li>${ic(I.trust)}<div><b>Confiar en lo que dice el empaque</b><span>Profeco ha encontrado productos que no cumplen.</span></div></li>
        <li>${ic(I.find)}<div><b>Encontrarla donde está la gente</b><span>La compra es de impulso: si no se ve, no se compra.</span></div></li></ul>` },
    { t: "Espacios de diferenciación", tags: ["Llena", "Tapatía", "+ proteína por tu dinero"],
      cap: ["Seis territorios con dueño, tres libres", "FIBO puede tomar los tres libres. Juntos coinciden con «Con FIBO te encuentras».", "65 g · 22 g de proteína · 10 g de fibra"],
      body: `<div class="sy__own"><p class="mono sy__k">Ya tienen dueño</p><div class="sy__chips2"><span>Sabor <i>Barebells</i></span><span>Sin sellos <i>Wild · Zebra</i></span><span>Ciencia <i>Quest</i></span><span>Precio masivo <i>Bimbo · Barrinolas</i></span><span>Deporte <i>Evolution</i></span></div>
        <p class="mono sy__k">Libres para FIBO</p><ul class="sy__free"><li>${ic(I.fill)}<b>La barra que llena para el día a día</b><span>65 g, 22 g de proteína y 10 g de fibra.</span></li><li>${ic(I.pin)}<b>Hecha en Guadalajara</b><span>Cultura local: algo que ninguna otra puede decir.</span></li><li>${ic(I.coin)}<b>Más proteína por tu dinero</b><span>Un mensaje que nadie usa.</span></li></ul>
        <p class="sy__eq"><span>Llena</span>+<span>Tapatía</span>+<span>Valor</span>=<b>Con FIBO te encuentras</b></p></div>` },
    { t: "Segmentos prioritarios", tags: ["20–29", "18–35", "Media tarde"],
      cap: ["Dos segmentos y una ocasión", "El principal es el joven activo en tránsito: días largos y compras de impulso en conveniencia.", "≈1.1 millones de personas"],
      body: `<div class="sy__segs">
        <article class="p1"><span class="mono">Principal</span>${ic(I.bus)}<b>Joven activo en tránsito</b><p>20 a 29 años, trabaja o estudia y trabaja. Días largos y compras de impulso en tiendas de conveniencia.</p><em>≈1.1 M<small>personas en la ZMG</small></em></article>
        <article class="p2"><span class="mono">Secundario</span>${ic(I.run)}<b>Activos y deportistas</b><p>18 a 35 años, más intención de compra y menos sensibilidad al precio.</p><em>≈150<small>gimnasios donde ya llega</small></em></article>
        <article class="p3"><span class="mono">Tercero</span>${ic(I.sun)}<b>La colación práctica</b><p>Algo para la media tarde en lugar del pan dulce.</p><em>16:00<small>la hora del antojo</small></em></article></div>` },
    { t: "Oportunidades por canal", tags: ["7-Eleven", "Más Natural Más Sano", "Nutrisa", "Gimnasios", "E-commerce"],
      cap: ["Buena parte ya la tiene FIBO", "Material en 7-Eleven, tiendas nuevas, reposición, eventos, e-commerce y clientes por recuperar.", "5 clientes perdidos · +$200 mil"],
      body: `<ul class="sy__ch">
        <li>${ic(I.store)}<b>7-Eleven</b><span>Está en el 78% de las tiendas visitadas, pero en ninguna tiene material propio.</span><em class="g">Ya está</em></li>
        <li>${ic(I.store)}<b>Más Natural Más Sano</b><span>137 tiendas de las mejores categorías que todavía no venden FIBO.</span><em class="n">Nuevo</em></li>
        <li>${ic(I.store)}<b>Nutrisa</b><span>Más de cien tiendas en cero que se pueden reponer.</span><em class="g">Reponer</em></li>
        <li>${ic(I.run)}<b>Gimnasios, carreras, pádel y Vía RecreActiva</b><span>Visibilidad con un público de alta intención.</span><em class="n">Visibilidad</em></li>
        <li>${ic(I.uni)}<b>Universidades</b><span>Público ideal, pero la venta en campus tiene riesgo regulatorio: de forma limitada y flexible.</span><em class="w">Con cuidado</em></li>
        <li>${ic(I.box)}<b>Amazon y Mercado Libre</b><span>Recuperar con fichas completas y paquetes.</span><em class="g">Recuperar</em></li>
        <li>${ic(I.users)}<b>5 clientes que dejaron de comprar</b><span>Representan más de 200 mil pesos.</span><em class="g">+$200 mil</em></li>
        <li>${ic(I.arrow)}<b>OXXO y farmacias</b><span>Mediano plazo, con datos de rotación en la mano.</span><em class="l">Después</em></li></ul>` },
    { t: "Amenazas y barreras", tags: ["Externas", "Internas"],
      cap: ["Presión por fuera, grietas por dentro", "Una gemela más barata, la marca propia del cliente más grande y marcas con capital. Por dentro: textura, claims, margen y precios.", "5 amenazas · 6 barreras"],
      body: `<div class="sy__thr"><div><p class="mono sy__k">${ic(I.warn)} Por fuera</p><ul>
          <li><b>Evolution</b>Barra mexicana casi idéntica y más barata.</li><li><b>7-Select</b>Marca propia del cliente más grande, a la mitad del precio, en el mismo anaquel.</li><li><b>Wild Protein</b>Con capital para crecer y dueña del anaquel de conveniencia.</li><li><b>Bimbo</b>Distribución en todo el país.</li><li><b>Regulación</b>Restringe la venta de productos con sellos en escuelas.</li></ul></div>
        <div class="in"><p class="mono sy__k">${ic(I.crack)} Por dentro</p><ul>
          <li><b>Textura</b>Algunos la perciben seca.</li><li><b>Claims</b>Sin respaldo.</li><li><b>Dependencia</b>De dos clientes.</li><li><b>Margen</b>En caída.</li><li><b>Precio</b>Cinco precios distintos.</li><li><b>Marca</b>Casi nadie la conoce.</li></ul></div></div>` },
    { t: "Hipótesis por validar", tags: ["Segmento", "Precio", "Mensaje", "Textura", "Anaquel", "Sampling", "Concepto", "Sabores", "Proteína"],
      cap: ["Nueve hipótesis antes de decidir", "Segmento, precio, mensaje, textura, anaquel, sampling, concepto, sabores y proteína.", "9 por comprobar"],
      body: `<ol class="sy__hyp">
        <li><span class="mono">01</span><p>El joven en tránsito es el segmento con más potencial.</p></li>
        <li><span class="mono">02</span><p>El precio aceptable por pieza en tienda está entre <b>$35 y $40</b>.</p></li>
        <li><span class="mono">03</span><p>«La barra que llena» convence más que «22 g de proteína».</p></li>
        <li><span class="mono">04</span><p>La textura se puede mejorar sin cambiar la proteína.</p></li>
        <li><span class="mono">05</span><p>El material en el anaquel sube la rotación.</p></li>
        <li><span class="mono">06</span><p>El sampling con un código que lleve a la tienda genera compras.</p></li>
        <li><span class="mono">07</span><p>«Con FIBO te encuentras» se recuerda y se asocia a la barra.</p></li>
        <li><span class="mono">08</span><p>Cookies &amp; Cream y Chocolate son los favoritos del consumidor, no solo de 7-Eleven.</p></li>
        <li><span class="mono">09</span><p>Los 22 g de proteína se cumplen en los cuatro sabores.</p></li></ol>` },
    { t: "Niveles de certeza", tags: ["Sabemos", "Creemos", "Comprobar"],
      cap: ["Separar datos de suposiciones", "Lo que sabemos con datos, lo que creemos y lo que hay que comprobar con herramientas concretas.", "3 niveles"],
      body: `<div class="sy__lv">
        <div class="k1"><p class="mono">${ic(I.check)} Lo que sabemos</p><ul><li>22 g de proteína y 10 g de fibra en 65 g</li><li>Lleva dos sellos</li><li>Algunos la perciben seca</li><li>Se vende en cinco precios</li><li>Está en el 68% de los puntos visitados, sin material</li><li>El margen bajó 5.3 puntos</li><li>Dos clientes concentran ≈60% del volumen</li><li>Existe una gemela más barata</li><li>≈1.1 M de jóvenes de 18 a 29 años, más de 1 h al día en traslados</li></ul></div>
        <div class="k2"><p class="mono">${ic(I.q)} Lo que creemos</p><ul><li>El joven en tránsito es el mejor segmento</li><li>Precio aceptable entre $35 y $40</li><li>La textura empeora en el anaquel</li><li>El material en tienda sube la rotación</li><li>«Con FIBO te encuentras» conecta</li></ul></div>
        <div class="k3"><p class="mono">${ic(I.test)} Por comprobar</p><ul><li>Encuesta de 400 personas</li><li>Medición del precio aceptable</li><li>Prueba de sabor a ciegas</li><li>Análisis de laboratorio</li><li>Piloto de exhibición en tiendas</li><li>Costo real por barra</li></ul></div></div>` },
  ];

  /* explorer */
  const menu = [...sec.querySelectorAll("#syMenu button")], scenes = [...sec.querySelectorAll(".sy__sc")], cap = document.getElementById("syCap");
  let cur = 0, auto = 0;
  function show(i, user) {
    cur = i;
    menu.forEach((b, k) => b.classList.toggle("on", k === i));
    scenes.forEach((s, k) => { s.classList.toggle("on", k === i); });
    const [b, p, s] = A[i].cap;
    cap.querySelector("b").textContent = b; cap.querySelector("p").textContent = p; cap.querySelector("span").textContent = s;
    cap.classList.remove("swap"); void cap.offsetWidth; cap.classList.add("swap");
    if (user) clearInterval(auto);
  }
  menu.forEach((b, i) => b.addEventListener("click", () => show(i, true)));
  show(0);

  // people dots for the segments target
  const ppl = document.getElementById("syPpl");
  let dots = "";
  for (let i = 0; i < 70; i++) {
    const ring = i < 26 ? 0 : i < 50 ? 1 : 2, r = [16 + Math.random() * 36, 64 + Math.random() * 34, 112 + Math.random() * 32][ring];
    const a = Math.random() * Math.PI * 2;
    dots += `<circle class="f${ring + 1}" cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="4" style="--d:${(i * 0.025).toFixed(2)}s"/>`;
  }
  ppl.innerHTML = dots;
  // nine test tubes for the hypotheses
  const tubes = document.getElementById("syTubes");
  tubes.innerHTML = Array.from({ length: 9 }, (_, i) => {
    const x = 60 + i * 60, h = 60 + ((i * 37) % 70);
    return `<g transform="translate(${x} 70)" style="--d:${i * 0.2}s"><path class="ln" d="M-12 0h24M-9 0v170a9 9 0 0 0 18 0V0"/><rect class="liq" x="-8" y="${178 - h}" width="16" height="${h}" rx="7"/><text y="-12">${String(i + 1).padStart(2, "0")}</text></g>`;
  }).join("");

  /* accordion */
  const acc = document.getElementById("syAcc");
  acc.innerHTML = A.map((a, i) => `
    <article class="sy__it${i === 0 ? " open" : ""}">
      <button type="button" class="sy__bar" aria-expanded="${i === 0}"><span class="mono">/ ${String(i + 1).padStart(3, "0")}</span><h3>${a.t}</h3><i aria-hidden="true"></i></button>
      <div class="sy__body"><div><div class="sy__in"><div class="sy__tags">${a.tags.map((t) => `<span class="mono">${t}</span>`).join("")}</div>${a.body}</div></div></div>
    </article>`).join("");
  acc.querySelectorAll(".sy__bar").forEach((b) => b.addEventListener("click", () => {
    const it = b.parentElement, o = it.classList.toggle("open");
    b.setAttribute("aria-expanded", o);
    if (o) { const i = [...acc.children].indexOf(it); show(i, true); }
  }));

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.id === "syAtlas" && !reduced) auto = setInterval(() => show((cur + 1) % A.length), 6000);
    io.unobserve(e.target);
  }), { threshold: 0.06 });
  sec.querySelectorAll(".sy__head, #syAtlas, .sy__it, #syEnd").forEach((n) => io.observe(n));
})();
