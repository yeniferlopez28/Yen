// Value proposition: a collaborative whiteboard with draggable sticky notes, live-looking cursors, message pillars and touchpoints.
(() => {
  const sec = document.getElementById("propuesta-valor");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // cursors wandering around the board
  const C = [["Marca", "#D6161D"], ["Ventas", "#3A5CFF"], ["Calidad", "#4C8A1E"], ["Diseño", "#B03CE0"], ["Digital", "#F2B705"], ["Planta", "#0C0B0A"]];
  const curs = document.getElementById("vbCurs");
  curs.innerHTML = C.map(([n, c]) => `<span class="vb__cur" style="--c:${c}"><svg viewBox="0 0 20 20"><path d="M2 2l14 6-6 2-2 6z"/></svg><b>${n}</b></span>`).join("");
  const ce = [...curs.children];
  const pos = ce.map(() => ({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 }));
  const move = () => ce.forEach((c, i) => {
    const p = pos[i]; p.x = Math.max(4, Math.min(92, p.x + (Math.random() - 0.5) * 30)); p.y = Math.max(4, Math.min(90, p.y + (Math.random() - 0.5) * 30));
    c.style.left = p.x + "%"; c.style.top = p.y + "%";
  });
  move(); if (!reduced) setInterval(move, 2200);

  // drag sticky notes (desktop)
  let z = 10;
  sec.querySelectorAll(".vb__board .vb__n, .vb__board .vb__ph").forEach((n) => {
    let sx, sy, ox = 0, oy = 0, on = false;
    n.addEventListener("pointerdown", (e) => { if (!matchMedia("(min-width: 901px)").matches) return; on = true; n.setPointerCapture(e.pointerId); n.classList.add("drag"); n.style.zIndex = ++z; sx = e.clientX - ox; sy = e.clientY - oy; });
    n.addEventListener("pointermove", (e) => { if (!on) return; ox = e.clientX - sx; oy = e.clientY - sy; n.style.setProperty("--dx", ox + "px"); n.style.setProperty("--dy", oy + "px"); });
    const up = () => { on = false; n.classList.remove("drag"); };
    n.addEventListener("pointerup", up); n.addEventListener("pointercancel", up);
  });

  // message pillars as frames of sticky notes
  const PIL = [
    { n: "Una barra que sí te llena", s: "La promesa principal", c: "y", m: [["Una barra que sí te llena.", "Frase principal: anaquel, redes, empaque, todo"], ["Para el hambre de las cinco.", "Redes, oficinas, media tarde"], ["Entre clase y clase, sin pan dulce.", "Universidades, redes"], ["Cuando la comida todavía no llega.", "Oficinas, traslados"], ["Que el hambre espere.", "Redes, talker secundario"], ["Pendientes sí. Hambre no.", "Serie en redes y TikTok"]] },
    { n: "Rinde más", s: "El valor y el precio", c: "g", m: [["22 g de proteína. Más del doble que una de 10.", "Talker de 7-Eleven, exhibidor"], ["Más barra. Más proteína. El mismo antojo.", "Redes, empaque secundario"], ["Más proteína por tu dinero.", "Amazon, fibo.mx, packs"], ["Paga por proteína, no por empaque.", "Amazon, Mercado Libre"]] },
    { n: "Con FIBO te encuentras", s: "La marca y la ciudad", c: "b", m: [["Con FIBO te encuentras: en el camión, entre juntas, después del gym.", "Campaña, redes, video"], ["Hecha en Jalisco para los días que no paran.", "Empaque, presentación, prensa"], ["De Zapopan a tu mochila.", "Redes, universidades"], ["Tu día no para. Tu barra tampoco.", "Vía RecreActiva, carreras"]] },
    { n: "Antojo", s: "El sabor y la primera mordida", c: "p", m: [["Sabe a postre. Y sí te llena.", "Talker por sabor, redes"], ["Cookies & Cream, pero con 22 g de proteína.", "Talker del sabor, TikTok"], ["Se te antoja. Y te llena.", "Sampling, contenido de usuarios"]] },
  ];
  document.getElementById("vbPil").innerHTML = `<div class="vb__fh"><p class="mono vb__k">Pilares de mensaje · 4 frames</p></div><div class="vb__pg">` + PIL.map((p, i) => `
    <div class="vb__frame f${p.c}"><p class="ttl"><b class="mono">${i + 1}</b>${p.n}<span class="mono">${p.s}</span></p>
      <div class="vb__ms">${p.m.map(([t, w], k) => `<article class="vb__n ${p.c} ms" style="--r:${((k * 37) % 7) - 3}deg"><b>${t}</b><span class="mono">${w}</span></article>`).join("")}</div></div>`).join("") + `</div>`;

  // touchpoints
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const TP = [
    ["Talker en 7-Eleven", "M3 9l2-5h14l2 5M4 9h16v11H4zM9 14h6", "Una barra que sí te llena.", "22 g de proteína · Más del doble que una de 10"],
    ["Tira de anaquel", "M3 10h18v4H3zM5 14v6M19 14v6", "FIBO · Una barra que sí te llena", "Los 4 sabores"],
    ["Sampling con QR", "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z", "¿Sí te llenó?", "Está a una cuadra."],
    ["Gimnasio", "M2 12h3M19 12h3M5 8v8M19 8v8M8 6v12M16 6v12M8 12h8", "22 g después de entrenar.", "Una barra que sí te llena."],
    ["Universidades", "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5", "Entre clase y clase,", "una barra que sí te llena."],
    ["Amazon y fibo.mx", "M3 4h2l2.4 11h10.2L20 7H6", "Una barra que sí te llena", "22 g de proteína y 10 g de fibra · Más proteína por tu dinero · Hecha en Jalisco"],
    ["Redes", "M4 4h16v16H4zM9 9a3 3 0 1 0 6 0", "Pendientes sí. Hambre no.", "Firma: Con FIBO te encuentras"],
    ["Campaña", "M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6", "Una barra que sí te llena.", "Con FIBO te encuentras."],
  ];
  document.getElementById("vbTp").innerHTML = `<div class="vb__fh"><p class="mono vb__k">Cómo se ve en los puntos clave</p></div><div class="vb__tg">` + TP.map(([n, i, a, b], k) => `<article class="vb__card" style="--i:${k}"><header>${ic(i)}<span class="mono">${n}</span></header><b>${a}</b><span>${b}</span></article>`).join("") + `</div>`;

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  sec.querySelectorAll(".vb__head, #vbApp, .vb__why, .vb__duo, .vb__frame, .vb__tg, .vb__end").forEach((n) => io.observe(n));
})();
