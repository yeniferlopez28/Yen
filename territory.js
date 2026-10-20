// Creative territory: web-magazine layout with a pixel title, gooey "encounter" bubbles, a competitive 2x2, the four readings and a campaign mixer.
(() => {
  const sec = document.getElementById("concepto");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;

  /* pixel title with scattered squares drifting around it */
  const tv = $("tcTitle"), tx = tv.getContext("2d");
  const toff = document.createElement("canvas"), to = toff.getContext("2d");
  let sq = [], tw = 0, th = 0, cell = 6;
  const tSize = () => {
    tw = tv.clientWidth; if (!tw) return;
    cell = tw < 500 ? 4 : 6;
    const lines = ["Con FIBO", "te", "encuentras"], w = Math.floor(tw / cell), fs = Math.floor(w / 6.2);
    th = Math.ceil(lines.length * fs * 0.98 + fs * 0.25) * cell;
    toff.width = w; toff.height = Math.ceil(th / cell);
    to.clearRect(0, 0, w, toff.height); to.font = `700 ${fs}px "Archivo", sans-serif`; to.textBaseline = "top";
    lines.forEach((l, i) => { let x = 0; l.split(/(FIBO)/).forEach((p) => { to.fillStyle = p === "FIBO" ? "#D6161D" : "#0C0B0A"; to.fillText(p, x, i * fs * 0.98 + 2); x += to.measureText(p).width; }); });
    const d = Math.min(2, devicePixelRatio || 1); tv.width = tw * d; tv.height = th * d; tv.style.height = th + "px";
    let s = 11; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const C = ["#0C0B0A", "#0C0B0A", "#0C0B0A", "#C9F23A", "#3A5CFF", "#FF89B8"];
    sq = Array.from({ length: 34 }, () => ({ x: r() * tw, y: r() * th, z: (1 + Math.floor(r() * 3)) * cell, c: C[Math.floor(r() * C.length)], p: r() * 6.28, v: 0.4 + r() }));
  };
  const tDraw = (t) => {
    if (!tw) return;
    const d = Math.min(2, devicePixelRatio || 1);
    tx.setTransform(d, 0, 0, d, 0, 0); tx.clearRect(0, 0, tw, th); tx.imageSmoothingEnabled = false;
    tx.drawImage(toff, 0, 0, toff.width * cell, toff.height * cell);
    sq.forEach((q) => { const y = q.y + Math.sin(t * q.v + q.p) * 10, x = q.x + Math.cos(t * q.v * 0.7 + q.p) * 6; tx.fillStyle = q.c; tx.fillRect(Math.round(x / cell) * cell, Math.round(y / cell) * cell, q.z, q.z); });
  };

  /* gooey bubbles: black blobs merged by a filter, white cores on top → outlined cells joined by webbing */
  const NS = "http://www.w3.org/2000/svg", gB = $("tcGooB"), gW = $("tcGooW"), gT = $("tcGooT"), goo = $("tcGoo");
  const LB = ["sabor", "alguien", "contigo", "FIBO", "", "", "", "", "", ""];
  const bubs = LB.map((l, i) => { const r = i < 4 ? 46 : 22 + (i % 3) * 8; return { l, r, x: 60 + ((i * 97) % 290), y: 50 + ((i * 61) % 200), vx: Math.cos(i * 2.1) * 0.5, vy: Math.sin(i * 1.7) * 0.5 }; });
  bubs.forEach((b) => {
    b.o = document.createElementNS(NS, "circle"); b.o.setAttribute("r", b.r + 6); b.o.setAttribute("fill", "#0C0B0A"); gB.appendChild(b.o);
    b.w = document.createElementNS(NS, "circle"); b.w.setAttribute("r", b.r); b.w.setAttribute("fill", b.l === "FIBO" ? "#C9F23A" : "#F2EFE8"); gW.appendChild(b.w);
    if (b.l) { b.t = document.createElementNS(NS, "text"); b.t.textContent = b.l; b.t.setAttribute("class", "mono"); gT.appendChild(b.t); }
  });
  let mx = -1, my = -1;
  goo.addEventListener("pointermove", (e) => { const r = goo.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width * 400; my = (e.clientY - r.top) / r.height * 300; });
  goo.addEventListener("pointerleave", () => { mx = my = -1; });
  const gStep = () => {
    bubs.forEach((b) => {
      if (mx >= 0) { const dx = mx - b.x, dy = my - b.y, d = Math.hypot(dx, dy) || 1; b.vx += dx / d * 0.08; b.vy += dy / d * 0.08; }
      b.vx *= 0.985; b.vy *= 0.985; const sp = Math.hypot(b.vx, b.vy); if (sp < 0.25) { b.vx *= 1.04; b.vy *= 1.04; } if (sp > 2.4) { b.vx *= 0.9; b.vy *= 0.9; }
      b.x += b.vx; b.y += b.vy;
      if (b.x < b.r || b.x > 400 - b.r) { b.vx *= -1; b.x = Math.max(b.r, Math.min(400 - b.r, b.x)); }
      if (b.y < b.r || b.y > 300 - b.r) { b.vy *= -1; b.y = Math.max(b.r, Math.min(300 - b.r, b.y)); }
      [b.o, b.w].forEach((c) => { c.setAttribute("cx", b.x.toFixed(1)); c.setAttribute("cy", b.y.toFixed(1)); });
      if (b.t) { b.t.setAttribute("x", b.x.toFixed(1)); b.t.setAttribute("y", (b.y + 4).toFixed(1)); }
    });
  };

  let run = false, t0 = performance.now();
  const loop = (now) => { if (!run) return; const t = (now - t0) / 1000; tDraw(t); gStep(); requestAnimationFrame(loop); };
  const start = () => { (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { tSize(); tDraw(0); gStep(); }); };
  start(); addEventListener("resize", () => { tSize(); tDraw(0); });
  new IntersectionObserver(([e]) => { run = e.isIntersecting && !reduced; if (run) requestAnimationFrame(loop); }).observe(sec.querySelector(".tc__front"));

  /* pixel quotes */
  const pix = (c) => {
    const Wc = c.clientWidth; if (!Wc) return;
    const cl = Wc < 700 ? 3 : 4, w = Math.floor(Wc / cl), fs = Math.min(20, w / 14);
    const o = document.createElement("canvas"), g = o.getContext("2d"), font = `700 ${fs}px "Archivo", sans-serif`; g.font = font;
    const lines = []; c.dataset.px.split(" ").forEach((wd) => { const l = lines[lines.length - 1]; if (l && g.measureText(l + " " + wd).width < w - 2) lines[lines.length - 1] = l + " " + wd; else lines.push(wd); });
    const h = Math.ceil(lines.length * fs * 1.06 + fs * 0.1); o.width = w; o.height = h; g.font = font; g.fillStyle = c.dataset.c || "#0C0B0A"; g.textBaseline = "top";
    lines.forEach((l, i) => g.fillText(l, 0, i * fs * 1.06 + 1));
    const d = Math.min(2, devicePixelRatio || 1); c.width = w * cl * d; c.height = h * cl * d; c.style.height = h * cl + "px";
    const k = c.getContext("2d"); k.imageSmoothingEnabled = false; k.drawImage(o, 0, 0, c.width, c.height);
  };
  const pxs = [...sec.querySelectorAll("canvas[data-px]")];
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => pxs.forEach(pix)); addEventListener("resize", () => pxs.forEach(pix));

  /* 02 needs */
  const I = {
    tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01", star: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7z",
    cart: "M3 4h2l2.5 11h11L21 7H7M10 20h.01M17 20h.01", loop: "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
    cup: "M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2", pin: "M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5",
    ppl: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M2 20c0-3.3 2.7-5 6-5s6 1.7 6 5M14 15.3c.6-.2 1.3-.3 2-.3 3.3 0 6 1.7 6 5", me: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-4 3.6-6 8-6s8 2 8 6",
    box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  };
  $("tcNeeds").innerHTML = [["Darle significado al producto", "22 g, 10 g, 65 g y 4 sabores: razones concretas, contadas de forma atractiva, no como lista.", I.tag, "#3A5CFF"],
    ["Construir diferenciación", "Ir más allá de «otra barra de proteína»: producto + curiosidad + vida diaria, con constancia.", I.star, "#FF89B8"],
    ["Facilitar la prueba y la compra", "La curiosidad necesita una salida: probar un sabor o encontrar dónde comprarla.", I.cart, "#D6161D"],
    ["Crear continuidad", "Campañas distintas sin empezar de cero: lanzamientos, contenido, sampling y ventas bajo una idea.", I.loop, "#C9F23A"]]
    .map(([t, d, i, c], k) => `<div class="tc__nd" style="--c:${c};--d:${k * 0.1}s"><span class="ic">${ic(i)}</span><b class="mono">0${k + 1}</b><h5>${t}</h5><p>${d}</p></div>`).join("");

  /* 03 competitive 2x2 */
  const Q = [["Funcional + deportivo", "Entrenamiento, metas, disciplina y composición.", "Comunicar lo funcional sin depender solo de este universo.", 0, 0],
    ["Antojo + deportivo", "Sabor, recompensa y consumo ligado al entrenamiento.", "Que el disfrute no aparezca solo como parte de una rutina deportiva.", 1, 0],
    ["Funcional + cotidiano", "Practicidad, nutrición y consumo durante el día.", "Mostrar que la categoría cabe en distintas rutinas.", 0, 1],
    ["Antojo + cotidiano", "Descubrir sabores, espontaneidad y experiencias.", "Aquí se desarrolla el territorio de FIBO, y hay que comprobar que sí diferencia.", 1, 1]];
  const map = $("tcMap"), qd = $("tcQd");
  map.insertAdjacentHTML("afterbegin", Q.map(([n], i) => `<button type="button" class="tc__q q${i}${i === 3 ? " on" : ""}" data-i="${i}"><span class="mono">${n}</span></button>`).join(""));
  const qb = [...map.querySelectorAll(".tc__q")];
  const showQ = (i) => { qb.forEach((b, k) => b.classList.toggle("on", k === i)); const [n, c, m] = Q[i]; qd.innerHTML = `<p class="mono">${n}</p><p><b>Códigos por investigar:</b> ${c}</p><p class="im"><b>Para FIBO:</b> ${m}</p>`; };
  qb.forEach((b, i) => { b.addEventListener("click", () => showQ(i)); b.addEventListener("pointerenter", () => showQ(i)); }); showQ(3);
  $("tcChk").innerHTML = ["Posicionamiento y promesa", "Papel de la proteína", "Cómo hablan del sabor", "Situaciones y personas que muestran", "Conceptos de campaña y recursos visuales", "Redes, empaque, publicidad y punto de venta"].map((t) => `<li>${t}</li>`).join("");

  /* 04 insight steps */
  $("tcSteps").innerHTML = [["Observación", "La gente no vive solo para cumplir pendientes: también le importan los gustos, las coincidencias y lo que aparece en el día."],
    ["Tensión", "La rutina organiza el día, pero no todo lo que lo hace interesante está planeado."],
    ["Giro", "Descubrir no siempre requiere buscar: a veces empieza al probar algo, seguir una recomendación o toparte con algo inesperado."]]
    .map(([t, d], i) => `<div class="tc__sp" style="--d:${i * 0.15}s"><span class="mono">0${i + 1} · ${t}</span><p>${d}</p></div>`).join("") + `<div class="tc__sp ins" style="--d:.45s"><span class="mono">04 · Insight</span><p>Ver abajo ↓</p></div>`;

  /* 06 four readings */
  const L = [["Te encuentras un sabor", "Conectar el antojo con la prueba del producto.", ["No sabías que te gustaba Frutos Rojos. Hasta hoy.", "Cuatro sabores. ¿Con cuál te encuentras?", "Hoy puede tocarte descubrir tu nuevo favorito."], "Posts de producto, degustaciones, lanzamientos, punto de venta.", I.cup, "#D6161D", "cr-mesa"],
    ["Te encuentras con alguien", "Crear experiencias para compartir, sin forzar historias.", ["Hay conversaciones que empiezan con un «¿ya lo probaste?».", "Un sabor nuevo también puede ser una recomendación.", "¿A quién le compartirías tu próximo descubrimiento?"], "Activaciones, comunidad y contenido de usuarios.", I.ppl, "#3A5CFF", "cr-office"],
    ["Te encuentras contigo", "Darle significado a los gustos propios, sin volverse marca de transformación.", ["A veces descubres algo nuevo cuando te das un momento.", "Entre una cosa y otra, también hay espacio para descubrir.", "Un día cualquiera. Un gusto nuevo."], "Campañas de marca y contenido cotidiano.", I.me, "#FF89B8", "cr-calma"],
    ["Te encuentras a FIBO", "Convertir el concepto en compra: encontrar la barra donde sí está.", ["¿Dónde te encuentras con FIBO?", "Tu próximo sabor por descubrir está más cerca de lo que crees.", "Encuentra FIBO en los puntos de venta participantes."], "Solo con datos de distribución confirmados.", I.pin, "#C9F23A", "cr-tienda"]];
  $("tcLecs").innerHTML = L.map(([t, f, ex, ap, i, c, img], k) => `<article class="tc__lc" style="--c:${c};--d:${k * 0.1}s"><figure><img src="assets/${img}.webp" alt=""><span class="ic">${ic(i)}</span><b class="mono">6.${k + 1}</b></figure><h5>${t}</h5><p class="fn">${f}</p><p class="ex" data-k="${k}">«${ex[0]}»</p><p class="ap mono">${ap}</p></article>`).join("");
  const exEls = [...sec.querySelectorAll(".tc__lc .ex")]; let exi = 0;
  if (!reduced) setInterval(() => { exi = (exi + 1) % 3; exEls.forEach((e) => { e.classList.add("sw"); setTimeout(() => { e.textContent = `«${L[+e.dataset.k][2][exi]}»`; e.classList.remove("sw"); }, 300); }); }, 4200);
  // priority by objective (qualitative, from the text)
  const P = [[3, 1, 1, 2], [1, 3, 3, 1], [2, 1, 1, 3]], PN = ["Baja", "Media", "Alta"];
  const pbars = $("tcPbars"), ptabs = [...$("tcPtabs").children];
  const showP = (o) => { ptabs.forEach((b, k) => b.classList.toggle("on", k === o)); pbars.innerHTML = L.map(([t, , , , , c], k) => `<div class="tc__pb" style="--c:${c};--v:${P[o][k] / 3}"><span>${t.replace("Te encuentras ", "")}</span><i><em></em></i><b class="mono">${PN[P[o][k] - 1]}</b></div>`).join(""); };
  ptabs.forEach((b, k) => b.addEventListener("click", () => showP(k))); showP(0);

  /* 07 product spec */
  $("tcSpec").innerHTML = [["65 g", "Formato", "Una barra"], ["22 g", "Proteína", "+ 10 g de fibra, según etiqueta"], ["4", "Sabores", "Para descubrir y crear dinámicas"], ["📍", "Accesible", "Donde de verdad esté disponible"]]
    .map(([n, t, d], i) => `<div style="--d:${i * 0.1}s"><b>${n}</b><span class="mono">${t}</span><p>${d}</p></div>`).join("");

  /* 08 personality → creative translation */
  $("tcPers").innerHTML = [["Explorador", "Invita a descubrir algo nuevo."], ["Amigo", "Lo cuenta de cerca, sin imponer cómo vivir."], ["Curiosa", "Las piezas generan preguntas y ganas de probar."],
    ["Inesperada", "Aparece en contextos cotidianos relevantes, sin sorpresa gratuita."], ["Sensorial", "Los sabores y la experiencia real van al centro."], ["Tapatía", "Guadalajara con referencias auténticas, sin limitar la expansión."]]
    .map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("");

  /* 09 campaign mixer */
  const MX = [["Sabor", ["Chocolate", "Frutos Rojos", "Cookies & Cream", "Brownie"]], ["Descubrimiento", ["un sabor nuevo", "un lugar", "una coincidencia", "un gusto propio"]],
    ["Contexto", ["entre clases", "en la oficina", "un domingo en la Vía RecreActiva", "en un concierto", "en el camino"]], ["Canal", ["redes", "sampling", "punto de venta", "video", "creadores"]], ["Objetivo", ["prueba", "recuerdo de marca", "compra", "recompra"]]];
  const mix = $("tcMix");
  const roll = () => { mix.innerHTML = MX.map(([n, o]) => `<div><span class="mono">${n}</span><b>${o[Math.floor(Math.random() * o.length)]}</b></div>`).join(""); mix.classList.remove("pop"); void mix.offsetWidth; mix.classList.add("pop"); };
  $("tcMixB").addEventListener("click", roll); roll();

  /* 10 applications */
  const AP = [["A", "Marca", "«Entre una cosa y otra»", "Dar a conocer el universo de FIBO con historias de descubrimientos reales. Guadalajara como punto de partida, eligiendo lugares por público y viabilidad, no por fama.", "#3A5CFF"],
    ["B", "Prueba", "«¿Con cuál te encuentras?»", "Degustaciones, comparativas de sabor y dinámicas de elección. Se mide la prueba real, no solo la participación.", "#D6161D"],
    ["C", "Experiencia", "«Encuentros FIBO»", "Activaciones con una razón para participar. Cada evento se elige por público, contexto, operación y reglas.", "#FF89B8"],
    ["D", "Disponibilidad", "«Encuentra FIBO»", "Evaluar un localizador de tiendas con presencia confirmada. Si faltan datos, empezar con una lista de puntos verificados.", "#C9F23A"],
    ["E", "Comunidad", "«¿Qué descubriste hoy?»", "Sabores, lugares, recomendaciones y momentos. No solo fotos con la barra. Requiere reglas, consentimiento y revisión.", "#0C0B0A"],
    ["F", "Conversión", "Del descubrimiento a la compra", "Qué producto es, por qué elegirlo y dónde conseguirlo. El concepto acompaña, pero no sustituye precio ni disponibilidad.", "#3A5CFF"]];
  $("tcApps").innerHTML = AP.map(([l, t, n, d, c], i) => `<article class="tc__ap" style="--c:${c};--d:${i * 0.08}s"><span class="lt mono">${l}</span><p class="tg mono">${t}</p><h5>${n}</h5><p>${d}</p></article>`).join("");

  /* 11 journey */
  $("tcJr").innerHTML = [["Descubrimiento", "Despertar curiosidad", "Campañas, redes, video", "Conocimiento y recuerdo"], ["Consideración", "Dar razones", "Sabores, formato y datos verificables", "Interés e intención"],
    ["Prueba", "Facilitar el contacto", "Sampling y activaciones", "Pruebas efectivas"], ["Compra", "Conectar con disponibilidad", "Punto de venta, marketplaces, anuncios", "Conversión medible"], ["Recompra", "Mantener el interés", "Recordatorios y novedades", "Relación continua"]]
    .map(([e, r, a, o], i) => `<div class="tc__js" style="--d:${i * 0.1}s;--w:${100 - i * 11}%"><i></i><b class="mono">0${i + 1}</b><h5>${e}</h5><p><span>Papel</span>${r}</p><p><span>Dónde</span>${a}</p><p class="o"><span>Resultado</span>${o}</p></div>`).join("");

  /* 12 not / 13 dims */
  $("tcNot").innerHTML = `<p class="tc__k mono">Qué NO es «Con FIBO te encuentras»</p>` + ["Encontrar un cuerpo ideal o corregir algo de ti.", "Frases sobre pausas, camiones o lugares de Guadalajara sin conexión con el producto.", "Subirse a todas las tendencias o poner una pregunta en cada post.", "Que todas las piezas muestren un encuentro social.", "Un sustituto de producto claro, disponibilidad y experiencia consistente.", "Una excusa para afirmaciones de nutrición, salud o desempeño sin respaldo."].map((t) => `<p class="x"><i>✕</i>${t}</p>`).join("") + `<p class="tc__note">Lo bastante amplia para evolucionar. Lo bastante específica para que se reconozca qué es FIBO.</p>`;
  $("tcDims").innerHTML = [["Comprensión", "¿La entienden? ¿La explican con sus palabras? ¿Qué lecturas no deseadas salen?", "#3A5CFF"], ["Diferenciación", "Asociación espontánea y asistida, recuerdo de la firma, códigos reconocidos.", "#FF89B8"],
    ["Comportamiento", "Prueba, visitas, consultas de disponibilidad, participación.", "#C9F23A"], ["Comercial", "Ventas y rotación en tiendas participantes, comparables y recompra.", "#D6161D"]]
    .map(([n, d, c], i) => `<div style="--c:${c}"><b class="mono">0${i + 1}</b><h5>${n}</h5><p>${d}</p></div>`).join("");

  /* 14 pending */
  const PD = [["Insight", "Contrastar la hipótesis con la investigación.", "Insight validado o reformulado"], ["Competencia", "Revisar campañas, mensajes y códigos.", "Mapa competitivo sustentado"],
    ["Concepto", "Evaluar comprensión, relevancia y diferencia.", "Evidencia para confirmar o ajustar"], ["Consistencia", "Unificar «Con FIBO te encuentras».", "Plataforma verbal única"],
    ["Propiedad intelectual", "Búsqueda de antecedentes en el IMPI y riesgos de registro.", "Revisión preliminar"], ["Aprobación", "Validación formal de Alejandro y responsables.", "Decisión documentada"],
    ["Regulación", "Revisar mensajes, materiales, promos y ubicaciones con Calidad y Legal.", "Criterios autorizados"], ["Distribución", "Confirmar tiendas, cobertura y actualización.", "Información comercial utilizable"],
    ["Viabilidad", "Definir recursos, presupuesto, producción y responsables.", "Plan de implementación"], ["Medición", "Línea base, indicadores y periodicidad.", "Sistema de evaluación"]];
  const pl = $("tcPendL"), pc = $("tcPc");
  pl.innerHTML = PD.map(([f, d, e], i) => `<button type="button" class="tc__pr" aria-pressed="false"><i></i><b class="mono">${String(i + 1).padStart(2, "0")}</b><strong>${f}</strong><span>${d}</span><em class="mono">→ ${e}</em></button>`).join("");
  const prs = [...pl.children];
  const cnt = () => { const n = prs.filter((b) => b.classList.contains("on")).length; pc.textContent = n ? `${n} de 10 cerrados` : "10 frentes · toca para marcar"; };
  prs.forEach((b) => b.addEventListener("click", () => { b.classList.toggle("on"); b.setAttribute("aria-pressed", b.classList.contains("on")); cnt(); })); cnt();

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  sec.querySelectorAll(".tc__front, .tc__row, .tc__rule").forEach((n) => io.observe(n));
})();
