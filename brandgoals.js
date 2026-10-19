// Brand objectives: orbs carousel (think / feel / do), a layer stack wired to an "editor" with an animated scene per objective, and the measurement board.
(() => {
  const sec = document.getElementById("objetivos-marca");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;

  const O = [
    { k: "Conocer", v: "p", t: "Que la gente conozca a FIBO", c: ["#C9F23A", "#D6161D"], i: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
      now: "≈430 calificaciones públicas. En algunas tiendas ni el personal la reconoce.", goal: "Que el joven de Guadalajara recuerde a FIBO cuando piense en una barra de proteína.", m: "Reconocimiento de marca en la encuesta (línea base) y crecimiento de la comunidad en redes." },
    { k: "Una identidad", v: "s", t: "Que se vea y suene igual en todas partes", c: ["#3A5CFF", "#F2EFE8"], i: "M4 4h7v7H4zM13 13h7v7h-7zM13 4h7v7h-7zM4 13h7v7H4z",
      now: "2 logos, 4 nombres, 3 líneas visuales y 5 precios.", goal: "Un logo, un nombre, una paleta y un tono en el empaque, el anaquel, las redes, Amazon y el material de venta.", m: "Auditoría de marca: cuántos puntos de contacto cumplen con el Brand Book." },
    { k: "Día a día", v: "p", t: "Que se asocie con el día a día, no solo con el gimnasio", c: ["#D6161D", "#C9F23A"], i: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2",
      now: "Se asocia al gimnasio y al suplemento.", goal: "La barra que llena entre clases, en la oficina o en el camino.", m: "Encuesta: en qué momentos imaginan comer FIBO, y la respuesta a «Con FIBO te encuentras»." },
    { k: "Confianza", v: "s", t: "Que la gente confíe en lo que dice FIBO", c: ["#3A5CFF", "#0C0B0A"], i: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
      now: "Claims que no se pueden sostener, en una categoría donde Profeco encontró productos que no cumplen.", goal: "Cada mensaje respaldado: proteína validada en laboratorio, claims correctos y tablas completas de los 4 sabores.", m: "Revisión de claims por parte de Calidad y credibilidad del mensaje en la encuesta." },
    { k: "Recompra", v: "h", t: "Que quien la pruebe quiera volver a comprarla", c: ["#D6161D", "#F2EFE8"], i: "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
      now: "La queja más repetida: está seca. Amazon ≈4.1 estrellas.", goal: "Sabor y textura a la altura de la competencia.", m: "Prueba de sabor a ciegas, calificación en Amazon e intención de recompra." },
    { k: "Punto de venta", v: "h", t: "Que FIBO se vea en el punto de venta", c: ["#0C0B0A", "#C9F23A"], i: "M3 9l2-5h14l2 5M4 9h16v11H4zM9 14h6",
      now: "Ningún punto visitado tiene material propio.", goal: "Un espacio reconocible en sus principales tiendas, con los 4 sabores juntos.", m: "Porcentaje de tiendas con material y rotación por tienda." },
  ];
  const VN = { p: "Pensar", s: "Sentir", h: "Hacer" };
  const orbBg = (c, i) => `radial-gradient(circle at ${30 + i * 7}% 28%, rgba(255,255,255,.55), transparent 32%), conic-gradient(from ${i * 50}deg at 60% 60%, ${c[0]}, ${c[1]}, ${c[0]}, #1a1a1a, ${c[1]}, ${c[0]})`;

  /* scenes */
  const SC = [
    `<div class="sc oms1"><div class="zq"><span class="mono">Piensa en una barra de proteína…</span><div class="zans"><b class="za1">?</b><b class="za2">FIBO</b></div></div><div class="zstars"><i>★</i><i>★</i><i>★</i><i>★</i><i class="zh">★</i><span class="mono">≈430 calificaciones</span></div></div>`,
    `<div class="sc oms2">${[["Logo", 2], ["Nombre", 4], ["Línea visual", 3], ["Precio", 5]].map(([n, k], r) => `<div class="zrow" style="--r:${r}"><span class="mono">${n}</span><div class="zpl">${Array.from({ length: k }, (_, j) => `<i style="--j:${j}">${n} ${j + 1}</i>`).join("")}<b>1 ${n.toLowerCase()}</b></div></div>`).join("")}</div>`,
    `<div class="sc oms3"><svg viewBox="0 -20 400 260"><path class="zarc" d="M30 200 A170 170 0 0 1 370 200"/>${[["7:00", "Camino", 30], ["11:00", "Clase", 95], ["14:00", "Oficina", 200], ["17:00", "Entre comidas", 305], ["20:00", "Gimnasio", 370]].map(([h, n, x], j) => { const a = Math.PI * (1 - (x - 30) / 340), px = 200 + 170 * Math.cos(a), py = 200 - 170 * Math.sin(a); return `<g class="zmo${j === 4 ? " zgym" : ""}" style="--j:${j}"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="9"/><text x="${px.toFixed(1)}" y="${(py - 18).toFixed(1)}">${n}</text><text class="zh" x="${px.toFixed(1)}" y="${(py + 26).toFixed(1)}">${h}</text></g>`; }).join("")}<circle class="zdot" r="12"><animateMotion dur="6s" repeatCount="indefinite" path="M30 200 A170 170 0 0 1 370 200"/></circle></svg><p class="mono">Ya no solo el gimnasio</p></div>`,
    `<div class="sc oms4"><div class="zlbl"><p><b>Información nutrimental</b><span class="mono">4 sabores</span></p><ul><li style="--j:0">Proteína<em>validada en laboratorio</em></li><li style="--j:1">Claims<em>correctos</em></li><li style="--j:2">Tablas<em>completas · 4 sabores</em></li></ul></div><div class="zsh">${ic("M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5")}</div></div>`,
    `<div class="sc oms5"><div class="zbite"><img src="assets/fibo-chocolate.webp" alt=""><i></i></div><div class="zrat"><b>4.1</b><span>★★★★<em>★</em></span><small class="mono">Amazon · hoy</small></div><div class="zloop"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/></svg><span class="mono">Probar → volver a comprar</span></div></div>`,
    `<div class="sc oms6"><div class="zshelf"><span class="zo" style="--j:0"></span><img src="assets/fibo-cookies.webp" alt="" style="--j:1"><span class="zo" style="--j:2"></span><img src="assets/fibo-chocolate.webp" alt="" style="--j:3"><span class="zo" style="--j:4"></span><img src="assets/fibo-frutos.webp" alt="" style="--j:5"><span class="zo" style="--j:6"></span><img src="assets/fibo-brownie.webp" alt="" style="--j:7"></div><div class="ztag"><img src="assets/fibo-logo.png" alt=""><span class="mono">22 g · 4 sabores juntos</span></div></div>`,
  ];

  const orbs = document.getElementById("omOrbs"), layers = document.getElementById("omLayers"), canvas = document.getElementById("omCanvas");
  orbs.innerHTML = O.map((o, i) => `<button type="button" class="om__orb" data-i="${i}" style="--bg:${orbBg(o.c, i)}" aria-label="${o.t}"><span class="ball"></span><span class="lb"><b class="mono">0${i + 1}</b>${o.k}</span></button>`).join("");
  layers.innerHTML = O.map((o, i) => `<button type="button" class="om__ly" data-i="${i}"><span class="th" style="--bg:${orbBg(o.c, i)}">${ic(o.i)}</span><span class="tx"><span class="mono">Objetivo 0${i + 1} · ${VN[o.v]}</span><b>${o.t}</b></span><i class="dot"></i></button>`).join("");
  canvas.innerHTML = SC.map((s, i) => `<div class="om__scn" data-i="${i}">${s}</div>`).join("");
  const ob = [...orbs.children], lb = [...layers.children], scn = [...canvas.children];
  const pill = document.getElementById("omPillTxt"), pillOrb = document.getElementById("omPillOrb"), chip = document.getElementById("omChip"), now = document.getElementById("omNow"), type = document.getElementById("omType");

  let cur = -1, tt = 0, auto = 0;
  function sel(i, user) {
    if (user) clearInterval(auto);
    if (i === cur) return;
    cur = i; const o = O[i];
    ob.forEach((b, k) => {
      const d = k - i, a = Math.min(4, Math.abs(d)), sp = innerWidth < 700 ? 0.55 : 1;
      b.classList.toggle("on", k === i);
      b.style.setProperty("--x", Math.sign(d) * [0, 210, 360, 470, 560][a] * sp + "px");
      b.style.setProperty("--s", [1, 0.62, 0.45, 0.34, 0.26][a]);
      b.style.zIndex = 10 - a;
    });
    lb.forEach((b, k) => b.classList.toggle("on", k === i));
    scn.forEach((s, k) => s.classList.toggle("on", k === i));
    pill.textContent = o.t; pillOrb.style.background = orbBg(o.c, i);
    chip.firstChild.textContent = o.k + " ";
    now.innerHTML = `<p><span class="mono">Hoy</span>${o.now}</p><p class="g"><span class="mono">Meta</span>${o.goal}</p>`;
    clearInterval(tt); type.textContent = "";
    if (reduced) type.textContent = o.m;
    else { let n = 0; tt = setInterval(() => { type.textContent = o.m.slice(0, ++n); if (n >= o.m.length) clearInterval(tt); }, 22); }
    wire();
  }
  ob.forEach((b, i) => b.addEventListener("click", () => sel(i, true)));
  lb.forEach((b, i) => b.addEventListener("click", () => sel(i, true)));

  // think / feel / do filter
  const seg = [...sec.querySelectorAll("#omSeg button")];
  seg.forEach((b) => b.addEventListener("click", () => {
    const v = b.dataset.v;
    seg.forEach((x) => x.classList.toggle("on", x === b));
    ob.forEach((o, i) => o.classList.toggle("dim", v !== "all" && O[i].v !== v));
    lb.forEach((o, i) => o.classList.toggle("dim", v !== "all" && O[i].v !== v));
    const first = O.findIndex((o) => v === "all" || o.v === v);
    if (v !== "all" && O[cur].v !== v) sel(first, true);
  }));

  // wire from the selected layer to the editor
  const studio = document.getElementById("omStudio"), wp = document.getElementById("omWireP"), wa = document.getElementById("omWireA"), wb = document.getElementById("omWireB"), ed = document.getElementById("omEd");
  function wire() {
    if (cur < 0) return;
    const s = studio.getBoundingClientRect(), l = lb[cur].getBoundingClientRect(), e = ed.getBoundingClientRect();
    if (e.left < l.right) { wp.setAttribute("d", ""); return; }
    const x1 = l.right - s.left, y1 = l.top + l.height / 2 - s.top, x2 = e.left - s.left, y2 = e.top + 120 - s.top, mx = (x1 + x2) / 2;
    wp.setAttribute("d", `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);
    wa.setAttribute("cx", x1); wa.setAttribute("cy", y1); wb.setAttribute("cx", x2); wb.setAttribute("cy", y2);
  }
  addEventListener("resize", wire);
  sel(0);

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.id === "omStudio") { wire(); if (!reduced) auto = setInterval(() => sel((cur + 1) % O.length), 7000); }
    io.unobserve(e.target);
  }), { threshold: 0.25 });
  sec.querySelectorAll("#omHero, #omStudio, #omBoard").forEach((n) => io.observe(n));
})();
