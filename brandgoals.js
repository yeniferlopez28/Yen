// Brand objectives: six fanned card decks (objective · goal · how it's measured) that spread on hover and shuffle on click.
(() => {
  const sec = document.getElementById("objetivos-marca");
  if (!sec) return;
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const I = {
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6", grid: "M4 4h7v7H4zM13 13h7v7h-7zM13 4h7v7h-7zM4 13h7v7H4z",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2", shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
    loop: "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4", store: "M3 9l2-5h14l2 5M4 9h16v11H4zM9 14h6",
    flag: "M5 21V4l12 4-12 4", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  };
  const VN = { p: "Pensar", s: "Sentir", h: "Hacer" };
  const O = [
    { t: "Que la gente conozca a FIBO", v: "p", tag: "Encuesta", c: "#D6161D", i: I.eye, now: "≈430 calificaciones · en algunas tiendas ni el personal la reconoce",
      goal: "Que el joven de Guadalajara recuerde a FIBO cuando piense en una barra de proteína.", m: "Reconocimiento de marca en la encuesta (línea base) y crecimiento de la comunidad en redes.",
      vis: `<div class="om__v v1"><b class="q">?</b><b class="a">FIBO</b><span class="mono">Piensa en una barra de proteína…</span></div>` },
    { t: "Que se vea y suene igual en todas partes", v: "s", tag: "Brand Book", c: "#3A5CFF", i: I.grid, now: "2 logos · 4 nombres · 3 líneas visuales · 5 precios",
      goal: "Un logo, un nombre, una paleta y un tono en empaque, anaquel, redes, Amazon y material de venta.", m: "Auditoría de marca: cuántos puntos de contacto cumplen con el Brand Book.",
      vis: `<div class="om__v v2"><i>Logo 1</i><i>Logo 2</i><i>Nombre 1</i><i>Nombre 2</i><i>Nombre 3</i><i>Nombre 4</i><b>1 sola identidad</b></div>` },
    { t: "Que se asocie con el día a día", v: "p", tag: "Concepto", c: "#C9F23A", i: I.clock, now: "Hoy se asocia al gimnasio y al suplemento",
      goal: "La barra que llena entre clases, en la oficina o en el camino. No solo en el gimnasio.", m: "En qué momentos imaginan comer FIBO y la respuesta al concepto «Con FIBO te encuentras».",
      vis: `<div class="om__v v3"><div class="clk"><i></i><i class="m"></i></div><ul class="mono"><li>7:00 camino</li><li>11:00 clase</li><li>14:00 oficina</li><li>17:00 entre comidas</li><li class="x">gimnasio</li></ul></div>` },
    { t: "Que la gente confíe en lo que dice", v: "s", tag: "Calidad", c: "#F2EFE8", i: I.shield, now: "Claims que no se sostienen, en una categoría vigilada por Profeco",
      goal: "Cada mensaje respaldado: proteína validada en laboratorio, claims correctos y tablas completas de los 4 sabores.", m: "Revisión de claims por parte de Calidad y credibilidad del mensaje en la encuesta.",
      vis: `<div class="om__v v4"><div class="lbl"><b>Información nutrimental</b><span><em>Proteína</em><i>✓</i></span><span><em>Claims</em><i>✓</i></span><span><em>Tablas · 4 sabores</em><i>✓</i></span></div></div>` },
    { t: "Que quien la pruebe vuelva a comprarla", v: "h", tag: "Prueba a ciegas", c: "#FF6A3D", i: I.loop, now: "La queja más repetida: está seca · Amazon ≈4.1 ★",
      goal: "Sabor y textura a la altura de la competencia: la primera mordida decide la recompra.", m: "Prueba de sabor a ciegas, calificación en Amazon e intención de recompra.",
      vis: `<div class="om__v v5"><img src="assets/fibo-chocolate.webp" alt=""><div class="rt"><b>4.1</b><span>★★★★<em>★</em></span></div><span class="lp mono">↻ volver a comprar</span></div>` },
    { t: "Que FIBO se vea en el punto de venta", v: "h", tag: "Piloto", c: "#0C0B0A", i: I.store, now: "Ningún punto visitado tiene material propio",
      goal: "Un espacio reconocible en sus principales tiendas, con los 4 sabores juntos.", m: "Porcentaje de tiendas con material y rotación por tienda.",
      vis: `<div class="om__v v6"><img src="assets/fibo-cookies.webp" alt=""><img src="assets/fibo-chocolate.webp" alt=""><img src="assets/fibo-frutos.webp" alt=""><img src="assets/fibo-brownie.webp" alt=""><b class="mono">4 sabores juntos</b></div>` },
  ];

  const card = (o, i, kind) => {
    const n = String(i + 1).padStart(2, "0");
    if (kind === 0) return `<div class="om__img">${o.vis}</div><div class="om__bd"><p class="src"><i style="--c:${o.c}"></i>FIBO · Objetivo ${n}</p><h5>${o.t}</h5><p class="meta mono">Hoy · ${o.now}</p><div class="chips"><span>${VN[o.v]}</span><span>${o.tag}</span><span>Línea base · nov</span></div><p class="ft mono"><span class="av"></span>Marca · Bloque 4<b>${ic(I.flag)}</b></p></div>`;
    if (kind === 1) return `<div class="om__img big" style="--c:${o.c}">${ic(I.flag)}<b>Meta</b></div><div class="om__bd"><p class="src"><i style="--c:${o.c}"></i>Objetivo ${n} · Meta</p><h5>${o.goal}</h5><div class="chips"><span>${VN[o.v]}</span><span>6 meses</span></div></div>`;
    return `<div class="om__img big" style="--c:${o.c}">${ic(I.chart)}<b>Se mide</b></div><div class="om__bd"><p class="src"><i style="--c:${o.c}"></i>Objetivo ${n} · Medición</p><h5>${o.m}</h5><div class="chips"><span>${o.tag}</span><span>Noviembre</span></div></div>`;
  };
  const decks = document.getElementById("omDecks");
  decks.innerHTML = O.map((o, i) => `
    <article class="om__deck" data-v="${o.v}" style="--i:${i}">
      <button type="button" class="om__pile" aria-label="${o.t}: barajar">
        ${[2, 1, 0].map((k) => `<div class="om__cd${o.c === "#F2EFE8" ? " lt" : ""}" data-k="${k}" style="--n:${k}">${card(o, i, k)}</div>`).join("")}
      </button>
      <h3>${o.t}</h3>
      <div class="om__tg"><span>${VN[o.v]}</span><span>${o.tag}</span></div>
    </article>`).join("");

  // shuffle: the front card goes to the back
  decks.querySelectorAll(".om__pile").forEach((p) => p.addEventListener("click", () => {
    const cs = [...p.querySelectorAll(".om__cd")];
    cs.forEach((c) => { const n = +c.style.getPropertyValue("--n"); c.style.setProperty("--n", (n + 2) % 3); });
    cs.sort((a, b) => b.style.getPropertyValue("--n") - a.style.getPropertyValue("--n")).forEach((c) => p.appendChild(c)); // DOM order = stacking order
  }));

  // think / feel / do filter
  const pills = [...sec.querySelectorAll("#omPills button")];
  pills.forEach((b) => b.addEventListener("click", () => {
    pills.forEach((x) => x.classList.toggle("on", x === b));
    decks.querySelectorAll(".om__deck").forEach((d) => d.classList.toggle("dim", b.dataset.v !== "all" && d.dataset.v !== b.dataset.v));
  }));

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  sec.querySelectorAll(".om__head, .om__deck, .om__base").forEach((n) => io.observe(n));
})();
