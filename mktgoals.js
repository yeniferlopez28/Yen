// Marketing objectives: a fanned hand of pixel-art cards; tap one to lift it and read it.
(() => {
  const sec = document.getElementById("objetivos-mkt");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = { red: "#D6161D", pink: "#FF89B8", lime: "#C9F23A", blue: "#3A5CFF", ink: "#0B0A09", bone: "#F5EBD7" };
  const G = {
    marca: ["Marca", C.red], demanda: ["Demanda", C.pink], venta: ["Venta", C.lime], canal: ["Canal", C.blue], relacion: ["Relación", C.ink],
  };
  // 9x9 pixel glyphs drawn on each card
  const P = {
    eye: ["000000000", "001111100", "011000110", "110111011", "101111101", "110111011", "011000110", "001111100", "000000000"],
    spark: ["000010000", "000010000", "001010100", "000111000", "111111111", "000111000", "001010100", "000010000", "000010000"],
    bite: ["000111100", "001111110", "011111111", "111111110", "111111100", "111111110", "011111111", "001111110", "000111100"],
    cart: ["110000000", "011111111", "001000001", "001000010", "001111100", "001000000", "001111110", "000100100", "000100100"],
    loop: ["001111100", "010000010", "100000001", "100000111", "100000010", "100000000", "010000010", "001111100", "000000000"],
    pin: ["001111100", "011111110", "111000111", "111000111", "011111110", "001111100", "000111000", "000010000", "000010000"],
    shelf: ["111111111", "100100101", "100100101", "111111111", "101001001", "101001001", "111111111", "100000001", "100000001"],
    phone: ["011111110", "010000010", "010101010", "010000010", "010111010", "010000010", "010000010", "010010010", "011111110"],
    truck: ["000000000", "111111000", "100001110", "100001011", "100001001", "111111111", "011000110", "011000110", "000000000"],
    hand: ["000000000", "011000110", "111101111", "111111111", "011111110", "001111100", "000111000", "000010000", "000000000"],
    ppl: ["011000110", "011000110", "000000000", "111101111", "111101111", "111101111", "000000000", "011111110", "111111111"],
    chart: ["000000011", "000000011", "000001111", "000001111", "000111111", "000111111", "011111111", "011111111", "111111111"],
    link: ["011100000", "100010000", "100010000", "011111110", "000010001", "000010001", "000001110", "000000000", "000000000"],
  };
  const O = [
    ["Construir reconocimiento de marca", "marca", "eye", "Aumentar el conocimiento de FIBO entre sus audiencias prioritarias y fortalecer su asociación con el concepto rector «Con FIBO te encuentras», con una identidad reconocible y diferenciada dentro de la categoría."],
    ["Generar interés y consideración", "demanda", "spark", "Despertar curiosidad por la marca y el producto, comunicar sus atributos con claridad y construir razones relevantes para que las personas consideren a FIBO entre sus opciones de compra."],
    ["Impulsar la prueba del producto", "demanda", "bite", "Generar oportunidades para que nuevos consumidores conozcan, prueben y experimenten FIBO con degustaciones, sampling, activaciones y otros puntos de contacto pertinentes."],
    ["Favorecer la conversión a compra", "venta", "cart", "Transformar el interés y la prueba en compras efectivas, facilitando el acceso al producto y conectando las acciones de marketing con los canales de venta disponibles."],
    ["Estimular la recompra y la fidelización", "venta", "loop", "Motivar a los consumidores a volver a elegir FIBO, fortalecer su relación con la marca y generar experiencias que favorezcan la preferencia y la continuidad de compra."],
    ["Fortalecer la presencia y disponibilidad comercial", "canal", "pin", "Incrementar la presencia de FIBO en los canales y puntos de venta prioritarios, para que los consumidores puedan encontrar el producto, identificarlo y elegir entre las presentaciones disponibles."],
    ["Mejorar la visibilidad en punto de venta", "canal", "shelf", "Desarrollar iniciativas que aumenten la visibilidad del producto, favorezcan su identificación frente a otras opciones y mejoren su desempeño comercial en tienda."],
    ["Desarrollar los canales digitales y e-commerce", "canal", "phone", "Consolidar los canales digitales como herramientas para dar a conocer el producto, resolver dudas, facilitar la compra y contribuir a la adquisición y recompra de consumidores."],
    ["Ampliar la distribución y el crecimiento B2B", "relacion", "truck", "Generar nuevas oportunidades comerciales, desarrollar relaciones con clientes y distribuidores, reactivar cuentas con potencial y ampliar la presencia de FIBO en canales estratégicos."],
    ["Fortalecer la relación con clientes y distribuidores", "relacion", "hand", "Impulsar la continuidad comercial con seguimiento de cuentas, desarrollo de oportunidades de crecimiento, atención de necesidades comerciales y generación de nuevos pedidos."],
    ["Construir una comunidad alrededor de la marca", "marca", "ppl", "Crear espacios de interacción y participación para conocer mejor a los consumidores, estimular la conversación alrededor de FIBO y fortalecer el vínculo con sus audiencias."],
    ["Medir, aprender y optimizar", "relacion", "chart", "Establecer un sistema de seguimiento que evalúe el desempeño de las iniciativas, identifique qué acciones dan mejores resultados y optimice la asignación de recursos según lo aprendido."],
    ["Alinear el marketing con los resultados comerciales", "relacion", "link", "Conectar comunicación, generación de demanda, prueba y conversión con los objetivos de venta, distribución y crecimiento de FIBO, con colaboración continua entre Marketing y Ventas."],
  ];
  // card color cycles through the palette like the reference's warm run
  const CARD = [C.lime, C.pink, C.red, C.blue, C.ink, C.red, C.pink, C.lime, C.blue, C.ink, C.pink, C.red, C.blue];
  const INK = (bg) => (bg === C.lime || bg === C.pink || bg === C.bone ? C.ink : C.bone);
  const fan = document.getElementById("okmFan"), det = document.getElementById("okmD"), fl = document.getElementById("okmF");
  fan.innerHTML = O.map(([t, g, ic], i) => `<button type="button" class="okm__c" data-i="${i}" data-g="${g}" style="--bg:${CARD[i]};--fg:${INK(CARD[i])};--i:${i}" aria-label="Objetivo ${i + 1}: ${t}">
    <canvas width="9" height="9" data-ic="${ic}"></canvas><span class="n">${String(i + 1).padStart(2, "0")}</span><b>${t}</b></button>`).join("");
  fan.querySelectorAll("canvas").forEach((cv, i) => {
    const g = cv.getContext("2d"), rows = P[cv.dataset.ic], bg = CARD[i], fg = INK(bg);
    rows.forEach((r, y) => [...r].forEach((v, x) => { g.globalAlpha = v === "1" ? 0.9 : ((x * 7 + y * 3) % 5 === 0 ? 0.14 : 0); g.fillStyle = fg; if (g.globalAlpha) g.fillRect(x, y, 1, 1); }));
  });
  const cards = [...fan.children];
  let cur = -1;
  const layout = () => {
    const vis = cards.filter((c) => !c.hidden), n = vis.length, wide = fan.clientWidth > 900;
    vis.forEach((c, k) => {
      const m = k - (n - 1) / 2, sel = +c.dataset.i === cur;
      if (wide) {
        const step = Math.min(84, (fan.clientWidth - 260) / Math.max(1, n - 1));
        c.style.transform = `translateX(${m * step}px) translateY(${(sel ? -70 : Math.abs(m) * Math.abs(m) * 2.2)}px) rotate(${sel ? 0 : m * 3.2}deg) scale(${sel ? 1.08 : 1})`;
        c.style.zIndex = sel ? 50 : 20 - Math.abs(Math.round(m));
      } else { c.style.transform = sel ? "translateY(-6px)" : "none"; c.style.zIndex = ""; }
    });
  };
  const open = (i) => {
    cur = cur === i ? -1 : i; cards.forEach((c) => c.classList.toggle("on", +c.dataset.i === cur)); layout();
    if (cur < 0) { det.innerHTML = `<p class="okm__hint">Toca una carta para ver el objetivo completo.</p>`; return; }
    const [t, g, , d] = O[cur], gg = G[g];
    det.innerHTML = `<article style="--bg:${CARD[cur]};--fg:${INK(CARD[cur])}"><span class="tag" style="--gc:${gg[1]}">${gg[0]}</span><p class="num">${String(cur + 1).padStart(2, "0")} / 13</p><h3>${t}</h3><p>${d}</p></article>`;
  };
  cards.forEach((c) => {
    c.addEventListener("click", () => open(+c.dataset.i));
    c.addEventListener("pointerenter", () => { if (fan.clientWidth > 900 && cur < 0) { c.style.zIndex = 40; c.style.marginTop = "-26px"; } });
    c.addEventListener("pointerleave", () => { c.style.marginTop = ""; layout(); });
  });
  fl.innerHTML = [["all", "Todos"], ...Object.entries(G).map(([k, v]) => [k, v[0]])].map(([k, n], i) => `<button type="button" data-g="${k}"${i ? "" : ' class="on"'}>${n}</button>`).join("");
  const fb = [...fl.children];
  fb.forEach((b) => b.addEventListener("click", () => { fb.forEach((x) => x.classList.toggle("on", x === b)); cards.forEach((c) => c.hidden = b.dataset.g !== "all" && c.dataset.g !== b.dataset.g); cur = -1; cards.forEach((c) => c.classList.remove("on")); layout(); open(-1); cur = -1; }));
  addEventListener("resize", layout);
  // deal the hand when the section comes in
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { sec.classList.add("in"); layout(); io.disconnect(); } }, { threshold: 0.2 });
  io.observe(fan); layout(); open(-1); cur = -1;
  if (reduced) sec.classList.add("in");
})();
