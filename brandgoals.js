// Brand objectives: a pink "course-page" board with callouts wired to a tablet that lists the six objectives as filterable cards.
(() => {
  const sec = document.getElementById("objetivos-marca");
  if (!sec) return;

  const O = [
    { k: "Conocer", v: "p", t: "Que la gente conozca a FIBO", tag: "Encuesta", now: "≈430 calificaciones; en algunas tiendas ni el personal la reconoce.", goal: "Que el joven de Guadalajara recuerde a FIBO cuando piense en una barra de proteína.", m: "Reconocimiento en la encuesta (línea base) y crecimiento de la comunidad en redes.", c: "Reconocimiento + comunidad en redes", side: "l",
      vis: `<div class="om__v v1"><b class="q">?</b><b class="a">FIBO</b><span class="mono">Piensa en una barra de proteína…</span></div>` },
    { k: "Identidad", v: "s", t: "Que FIBO se vea y suene igual en todas partes", tag: "Brand Book", now: "2 logos, 4 nombres, 3 líneas visuales y 5 precios.", goal: "Un logo, un nombre, una paleta y un tono en empaque, anaquel, redes, Amazon y material de venta.", m: "Auditoría de marca: cuántos puntos de contacto cumplen con el Brand Book.", c: "Auditoría: puntos que cumplen el Brand Book", side: "l",
      vis: `<div class="om__v v2"><i>Logo 1</i><i>Logo 2</i><i>Nombre 1</i><i>Nombre 2</i><i>Nombre 3</i><i>Nombre 4</i><b>1 sola identidad</b></div>` },
    { k: "Día a día", v: "p", t: "Que se asocie con el día a día, no solo con el gimnasio", tag: "Concepto", now: "Hoy se asocia al gimnasio y al suplemento.", goal: "La barra que llena entre clases, en la oficina o en el camino.", m: "En qué momentos imaginan comer FIBO y respuesta a «Con FIBO te encuentras».", c: "Momentos imaginados + «Con FIBO te encuentras»", side: "r",
      vis: `<div class="om__v v3"><div class="clk"><i></i><i class="m"></i></div><ul class="mono"><li>7:00 camino</li><li>11:00 clase</li><li>14:00 oficina</li><li>17:00 entre comidas</li><li class="x">gimnasio</li></ul></div>` },
    { k: "Confianza", v: "s", t: "Que la gente confíe en lo que dice FIBO", tag: "Calidad", now: "Claims que no se sostienen, en una categoría donde Profeco encontró productos que no cumplen.", goal: "Cada mensaje respaldado: proteína validada en laboratorio, claims correctos y tablas completas de los 4 sabores.", m: "Revisión de claims por Calidad y credibilidad del mensaje en la encuesta.", c: "Claims revisados por Calidad + credibilidad", side: "l",
      vis: `<div class="om__v v4"><div class="lbl"><b>Información nutrimental</b><span><em>Proteína</em><i>✓</i></span><span><em>Claims</em><i>✓</i></span><span><em>Tablas · 4 sabores</em><i>✓</i></span></div></div>` },
    { k: "Recompra", v: "h", t: "Que quien la pruebe quiera volver a comprarla", tag: "Prueba a ciegas", now: "La queja más repetida: está seca. Amazon ≈4.1 ★.", goal: "Sabor y textura a la altura de la competencia.", m: "Prueba de sabor a ciegas, calificación en Amazon e intención de recompra.", c: "Prueba a ciegas · Amazon ≈4.1 ★ · recompra", side: "r",
      vis: `<div class="om__v v5"><img src="assets/fibo-chocolate.webp" alt=""><div class="rt"><b>4.1</b><span>★★★★<em>★</em></span></div><span class="lp mono">↻ volver a comprar</span></div>` },
    { k: "Punto de venta", v: "h", t: "Que FIBO se vea en el punto de venta", tag: "Piloto", now: "Ningún punto visitado tiene material propio.", goal: "Un espacio reconocible en sus principales tiendas, con los 4 sabores juntos.", m: "Porcentaje de tiendas con material y rotación por tienda.", c: "% de tiendas con material + rotación", side: "r",
      vis: `<div class="om__v v6"><img src="assets/fibo-cookies.webp" alt=""><img src="assets/fibo-chocolate.webp" alt=""><img src="assets/fibo-frutos.webp" alt=""><img src="assets/fibo-brownie.webp" alt=""><b class="mono">4 sabores juntos</b></div>` },
  ];
  const VN = { p: "Pensar", s: "Sentir", h: "Hacer" };

  const cards = document.getElementById("omCards");
  cards.innerHTML = O.map((o, i) => `
    <article class="om__card" data-i="${i}" tabindex="0">
      <div class="om__vis">${o.vis}<span class="tags"><b>${VN[o.v]}</b><i>${o.tag}</i></span></div>
      <h4>${o.t}</h4>
      <p class="d"><span>Hoy</span>${o.now}</p>
      <p class="d g"><span>Meta</span>${o.goal}</p>
      <p class="mono ms">Se mide · ${o.m}</p>
    </article>`).join("");
  const mkCall = (o, i) => `<div class="om__call" data-i="${i}"><p class="mono">{{ objetivo 0${i + 1} · ${o.k} }}</p><b>${o.c}</b></div>`;
  document.getElementById("omCallsL").innerHTML = O.map((o, i) => (o.side === "l" ? mkCall(o, i) : "")).join("");
  document.getElementById("omCallsR").innerHTML = O.map((o, i) => (o.side === "r" ? mkCall(o, i) : "")).join("");
  const cs = [...cards.children], calls = [...sec.querySelectorAll(".om__call")];

  const pick = (i) => {
    cs.forEach((c, k) => c.classList.toggle("on", k === i));
    calls.forEach((c) => c.classList.toggle("on", +c.dataset.i === i));
    draw();
  };
  cs.forEach((c, i) => { c.addEventListener("click", () => pick(i)); c.addEventListener("pointerenter", () => pick(i)); });
  calls.forEach((c) => c.addEventListener("pointerenter", () => pick(+c.dataset.i)));

  // filter chips
  const chips = [...sec.querySelectorAll("#omChips button")];
  chips.forEach((b) => b.addEventListener("click", () => {
    const v = b.dataset.v;
    chips.forEach((x) => x.classList.toggle("on", x === b));
    cs.forEach((c, i) => c.classList.toggle("dim", v !== "all" && O[i].v !== v));
    calls.forEach((c) => c.classList.toggle("dim", v !== "all" && O[+c.dataset.i].v !== v));
    draw();
  }));

  // elbow lines from each callout to its card's edge of the tablet
  const stage = document.getElementById("omStage"), svg = document.getElementById("omLines"), tab = document.getElementById("omTab");
  function draw() {
    if (!matchMedia("(min-width: 1101px)").matches) { svg.innerHTML = ""; return; }
    const s = stage.getBoundingClientRect(), t = tab.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${s.width} ${s.height}`);
    svg.innerHTML = calls.map((c) => {
      const i = +c.dataset.i, r = c.getBoundingClientRect(), k = cs[i].getBoundingClientRect(), left = O[i].side === "l";
      const x1 = (left ? r.right : r.left) - s.left, y1 = r.top + r.height / 2 - s.top;
      const xe = (left ? t.left + 6 : t.right - 6) - s.left, ye = k.top + 50 - s.top;
      const xm = left ? x1 + (xe - x1) * 0.45 : x1 - (x1 - xe) * 0.45;
      const cls = (c.classList.contains("on") ? "on" : "") + (c.classList.contains("dim") ? " dim" : "");
      return `<path class="${cls}" d="M${x1} ${y1} H${xm} V${ye} H${xe}"/><circle class="${cls}" cx="${xe}" cy="${ye}" r="4"/>`;
    }).join("");
  }
  addEventListener("resize", draw);

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.id === "omStage") setTimeout(draw, 700);
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  sec.querySelectorAll(".om__top, #omStage, .om__bottom").forEach((n) => io.observe(n));
  pick(0);
})();
