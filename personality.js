// Brand personality: editorial stationery pages, a walking scan-line silhouette, pixel-type figures and an interactive consistency test.
(() => {
  const sec = document.getElementById("personalidad");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);

  /* scan-line silhouette: a neutral walker drawn small, re-rendered as horizontal lines */
  const cv = $("pzSil"), cx = cv.getContext("2d");
  const off = document.createElement("canvas"); off.width = 200; off.height = 300;
  const ox = off.getContext("2d", { willReadFrequently: true });
  const BLUE = "#3A5CFF", NAVY = "#1F36B8", RED = "#D6161D", LIME = "#C9F23A";
  const seg = (pts, w, c) => { ox.strokeStyle = c; ox.lineWidth = w; ox.lineCap = ox.lineJoin = "round"; ox.beginPath(); pts.forEach(([x, y], i) => (i ? ox.lineTo(x, y) : ox.moveTo(x, y))); ox.stroke(); };
  const limb = (x, y, a1, l1, a2, l2) => { const kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1; return [[x, y], [kx, ky], [kx + Math.sin(a2) * l2, ky + Math.cos(a2) * l2]]; };
  const pose = (t) => {
    ox.clearRect(0, 0, 200, 300);
    const b = -2.5 * Math.abs(Math.cos(t));
    ox.save(); ox.translate(0, b);
    const leg = (p) => { const th = 0.42 * Math.sin(p); return limb(0, 0, th, 54, th - 0.55 * Math.max(0, Math.cos(p + 0.6)), 54); };
    const at = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
    const bl = at(leg(t + Math.PI), 100, 166), fl = at(leg(t), 116, 166);
    const ba = limb(92, 88, 0.5 * Math.sin(t), 40, 0.5 * Math.sin(t) - 0.35, 36), fa = limb(124, 88, -0.5 * Math.sin(t), 40, -0.5 * Math.sin(t) - 0.9, 34);
    seg(ba, 15, NAVY); seg(bl, 21, NAVY); seg([bl[2], [bl[2][0] + 13, bl[2][1]]], 11, NAVY);
    ox.fillStyle = NAVY; ox.beginPath(); ox.roundRect(64, 84, 30, 72, 10); ox.fill();                          // backpack
    ox.fillStyle = BLUE; ox.beginPath(); ox.moveTo(84, 78); ox.lineTo(132, 78); ox.lineTo(140, 170); ox.lineTo(80, 170); ox.closePath(); ox.fill(); // hoodie
    seg([[84, 78], [132, 78], [140, 170], [80, 170], [84, 78]], 10, BLUE);
    seg(fl, 21, BLUE); seg([fl[2], [fl[2][0] + 13, fl[2][1]]], 11, BLUE);
    ox.fillStyle = BLUE; ox.fillRect(101, 62, 14, 16); ox.beginPath(); ox.arc(108, 46, 21, 0, 7); ox.fill();      // neck + head
    ox.fillStyle = RED; ox.beginPath(); ox.arc(108, 42, 22.5, Math.PI, 0); ox.fill(); ox.fillRect(108, 37, 30, 7); // cap
    seg(fa, 15, "#6F8BFF");
    const h = fa[2]; ox.save(); ox.translate(h[0], h[1]); ox.rotate(-0.5); ox.fillStyle = LIME; ox.fillRect(-4, -14, 30, 11); ox.restore(); // the bar
    ox.restore();
  };
  let W = 0, H = 0, dpr = 1, px = -1, py = -1;
  const size = () => { W = cv.clientWidth; H = Math.round(Math.min(W * 1.25, 620)); dpr = Math.min(2, devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + "px"; };
  const render = (t) => {
    if (!W) { size(); if (!W) return; }
    pose(t * 2.2);
    const d = ox.getImageData(0, 0, 200, 300).data, s = (H * 0.86) / 300, offx = (W - 200 * s) / 2;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
    // dotted trail drifting backwards under the feet
    const gy = 300 * s + 4; cx.fillStyle = "rgba(12,11,10,.35)";
    for (let k = 0; k < W / 16 + 2; k++) { const x = ((k * 16 - t * 46) % (W + 16) + W + 16) % (W + 16) - 8; cx.fillRect(x, gy, 6, 2); }
    for (let y = 0; y < 300; y += 2) {
      const sy = y * s, near = py < 0 ? 0 : Math.max(0, 1 - Math.abs(sy - py) / 70);
      const wave = Math.sin(y * 0.25 + t * 3) * (0.6 + near * 9) * (px < 0 ? 1 : 1);
      let x0 = -1, col = "";
      for (let x = 0; x <= 200; x++) {
        const i = (y * 200 + x) * 4, on = x < 200 && d[i + 3] > 120, c = on ? `rgb(${d[i]},${d[i + 1]},${d[i + 2]})` : "";
        if (c !== col) { if (col) { cx.fillStyle = col; cx.fillRect(offx + x0 * s + wave, sy, (x - x0) * s, s * 1.15); } col = c; x0 = x; }
      }
    }
  };
  let run = false, t0 = performance.now();
  const loop = (now) => { if (!run) return; render((now - t0) / 1000); requestAnimationFrame(loop); };
  const fig = $("pzFig");
  fig.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; });
  fig.addEventListener("pointerleave", () => { px = py = -1; });
  addEventListener("resize", () => { size(); if (!run) render(0.4); });
  new IntersectionObserver(([e]) => { run = e.isIntersecting && !reduced; if (run) requestAnimationFrame(loop); else render(0.4); }).observe(cv);

  /* pixel type: text drawn tiny and scaled up without smoothing */
  const pix = (c) => {
    const Wc = c.clientWidth; if (!Wc) return;
    const full = c.dataset.w, cell = full ? (Wc < 700 ? 3 : 5) : 6, color = c.dataset.c;
    const w = Math.floor(Wc / cell);
    let fs = full ? Math.min(22, w / 13) : 16;
    const o = document.createElement("canvas"), g = o.getContext("2d");
    g.font = `700 ${fs}px "Archivo", sans-serif`;
    if (!full) { const mw = g.measureText(c.dataset.px).width; if (mw > w - 2) fs = fs * (w - 2) / mw; }
    const font = `700 ${fs}px "Archivo", sans-serif`; g.font = font;
    const words = c.dataset.px.split(" "), lines = [];
    words.forEach((wd) => { const l = lines[lines.length - 1]; if (l && (!full || g.measureText(l + " " + wd).width < w - 2)) lines[lines.length - 1] = l + " " + wd; else lines.push(wd); });
    const h = Math.ceil(lines.length * fs * 1.08 + fs * 0.08);
    o.width = w; o.height = h; g.font = font; g.fillStyle = color; g.textBaseline = "top";
    lines.forEach((l, i) => g.fillText(l, 0, i * fs * 1.08 + 1));
    const d2 = Math.min(2, devicePixelRatio || 1);
    c.width = w * cell * d2; c.height = h * cell * d2; c.style.height = h * cell + "px";
    const k = c.getContext("2d"); k.imageSmoothingEnabled = false; k.drawImage(o, 0, 0, w * cell * d2, h * cell * d2);
  };
  const pxs = [...sec.querySelectorAll("canvas[data-px]")];
  const pxAll = () => pxs.forEach(pix);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(pxAll); addEventListener("resize", pxAll);

  /* Aaker dimensions */
  const AK = [["Emoción", 5, "Principal", "Curiosidad, espontaneidad, imaginación, actualidad", "#3A5CFF"], ["Sinceridad", 4, "Secundaria", "Cercanía, honestidad, naturalidad, alegría", "#FF89B8"],
    ["Competencia", 3, "Soporte", "Producto consistente, información clara, confiable", "#0C0B0A"], ["Sofisticación", 1, "No prioritaria", "Sin lujo, exclusividad ni superioridad", "#B9B4AA"], ["Rudeza", 1, "No prioritaria", "Sin dureza, disciplina extrema ni estética hardcore", "#B9B4AA"]];
  $("pzAkb").innerHTML = AK.map(([n, v, r, d, c], i) => `<div class="pz__ar" style="--v:${v / 5};--c:${c};--d:${i * 0.12}s"><div class="h"><b>${n}</b><span class="mono">${r}</span></div><div class="t"><i></i>${[1, 2, 3, 4, 5].map((k) => `<em class="mono${k <= v ? " on" : ""}">${k}</em>`).join("")}</div><p>${d}</p></div>`).join("");

  /* five traits */
  const TR = [["Curiosa", "Pregunta, prueba y descubre.", "Recomendar un sabor o invitar a conocer un lugar.", "Preguntar por preguntar, solo para sacar interacción.", "pe-biblioteca"],
    ["Cercana", "Habla de tú, natural y accesible.", "Frases cotidianas, lenguaje directo, referencias reconocibles.", "Corporativismo o confianza fingida y forzada.", "cr-mesa"],
    ["Inesperada", "Aparece donde no esperas una barra de proteína.", "Sampling en contexto e intervenciones creativas.", "Llamar la atención por llamar la atención.", "pe-udg"],
    ["Local y contemporánea", "Conexión genuina con Guadalajara, sin quedarse en una sola ciudad.", "Espacios, hábitos y eventos de su comunidad.", "Referencias que nadie entiende o modas oportunistas.", "pe-charro"],
    ["Sensorial y antojable", "Habla de sabor, textura y del momento en que se antoja.", "Describir de verdad Brownie, Chocolate, Frutos Rojos y Cookies & Cream.", "Prometer una experiencia que el producto no da.", "fibo-chocolate"]];
  $("pzTrg").innerHTML = TR.map(([n, d, y, x, img], i) => `<article class="pz__t" style="--d:${i * 0.1}s"><figure><img src="assets/${img}.webp" alt="${n}"><figcaption class="mono">( 0.${i + 1} )</figcaption></figure><h4>${n}</h4><p>${d}</p><p class="y"><b class="mono">SÍ</b>${y}</p><p class="n"><b class="mono">NO</b>${x}</p></article>`).join("");

  /* role ledger */
  const RL = [["Relación", "Una marca cercana que invita a descubrir.", "Una autoridad que dicta qué hacer."], ["Motivación", "Curiosidad, antojo y disfrute cotidiano.", "Culpa, presión corporal o exigencia."],
    ["Contexto", "Clases, trabajo, traslados, encuentros y pausas.", "Solo el gimnasio o el entrenamiento."], ["Producto", "Una barra de proteína que además se antoja.", "Un suplemento como solución universal."],
    ["Comunidad", "Gente con gustos y rutinas diferentes.", "Un ideal corporal o un solo estilo de vida."], ["Lo que queda", "Ganas de probar, explorar y compartir.", "Sentir que no eres suficiente."]];
  $("pzLg").innerHTML = `<div class="pz__lr hd mono"><span>Dimensión</span><span>FIBO</span><span>Lo que evitamos</span></div>` + RL.map(([a, b, c], i) => `<div class="pz__lr" style="--d:${i * 0.08}s"><span class="mono">${a}</span><span>${b}</span><span><s>${c}</s></span></div>`).join("");
  $("pzAtt").innerHTML = [["Invitar", "exigir"], ["Descubrir", "aleccionar"], ["Antojar", "prometer resultados"], ["Conectar", "perseguir atención"]].map(([a, b], i) => `<li style="--d:${i * 0.15}s"><b>${a}</b><span>en lugar de <s>${b}</s></span></li>`).join("");

  /* tone of voice by touchpoint */
  const TO = [["Redes sociales", "Juguetón, curioso y culturalmente relevante.", "Preguntas, descubrimientos y humor del contexto.", "¿Brownie o Frutos Rojos? Hoy te toca descubrir."],
    ["Campañas", "Expresivo, memorable, conectado al concepto.", "Historias de encuentros, antojos y experiencias cotidianas.", "No sabías que te gustaba. Hasta que lo probaste."],
    ["Sampling", "Espontáneo, acogedor e invitacional.", "Que la gente pruebe y conozca el producto.", "¿Te late probar uno? Es de Cookies & Cream."],
    ["Punto de venta", "Directo y útil.", "Sabor, presentación, precio y disponibilidad comprobada.", "22 g de proteína. Un sabor por descubrir."],
    ["Empaque", "Claro, apetitoso y reconocible.", "Identidad, sabor y datos precisos.", "Brownie · 22 g de proteína · 10 g de fibra."],
    ["B2B", "Profesional y orientado al negocio.", "Portafolio, suministro, márgenes, distribución y evidencia.", "Más técnico porque cambia la audiencia. Igual de honesto."],
    ["Atención a clientes", "Amable, empática y resolutiva.", "Escuchar, aclarar y solucionar.", "Gracias por avisarnos. Lo revisamos y te escribimos hoy."],
    ["Errores y crisis", "Transparente, responsable y concreta.", "Reconocer, explicar y decir qué se va a corregir.", "Nos equivocamos en esto. Así lo estamos arreglando."]];
  const tabs = $("pzTabs"), tov = $("pzTov");
  tabs.innerHTML = TO.map(([n], i) => `<button type="button" role="tab" data-i="${i}"><b class="mono">0${i + 1}</b>${n}</button>`).join("");
  const tb = [...tabs.children];
  const showTone = (i) => { tb.forEach((b, k) => b.classList.toggle("on", k === i)); const [n, a, b, q] = TO[i];
    tov.innerHTML = `<p class="mono">[TONO]</p><h4>${a}</h4><p class="mono">[SE APLICA EN]</p><p>${b}</p><div class="pz__bub"><span class="mono">FIBO · ${n}</span>«${q}»</div>`; };
  tb.forEach((b, i) => b.addEventListener("click", () => showTone(i))); showTone(0);

  /* vocabulary + says / avoids */
  $("pzOwn").innerHTML = ["descubrir", "encontrarte", "probar", "antojo", "pausa", "momento", "coincidir", "explorar", "a la mano", "entre una cosa y otra", "¿te late?"].map((w, i) => `<span style="--d:${i * 0.05}s">${w}</span>`).join("");
  $("pzBad").innerHTML = ["sin excusas", "no te rindas", "cheat meal", "pecado", "compensa lo que comiste", "quema grasa", "cuerpo ideal", "la mejor barra", "la más saludable", "resultados garantizados", "ponte fit"].map((w) => `<span><s>${w}</s></span>`).join("");
  const CH = [["No sabías que te gustaba. Hasta que lo probaste.", "Sin excusas: entrena duro."], ["Entre una clase y otra, también hay espacio para una pausa.", "Cada día más cerca de tu cuerpo ideal."],
    ["22 g de proteína. Un sabor por descubrir.", "La barra que transforma tu cuerpo."], ["¿Brownie o Frutos Rojos? Hoy te toca descubrir.", "Elige el sabor que te ayude a quemar grasa."],
    ["¿Se te antojó? Encuentra FIBO en los puntos de venta disponibles.", "La barra más saludable de México."], ["Un sabor nuevo puede aparecer en cualquier momento.", "Seguir una tendencia solo porque todas lo hacen."]];
  $("pzChat").innerHTML = `<p class="pz__k mono">FIBO diría <span>/ FIBO evitaría</span></p>` + CH.map(([a, b], i) => `<div class="pz__cr" style="--d:${i * 0.12}s"><p class="ok">${a}</p><p class="ko"><s>${b}</s></p></div>`).join("");

  /* visual translation, behaviour, limits */
  const VI = [["Color", "Cálida, expresiva y apetecible. Diferencia sabores y se lee en anaquel y pantalla.", `<i style="--c:#D6161D"></i><i style="--c:#3A5CFF"></i><i style="--c:#FF89B8"></i><i style="--c:#C9F23A"></i><i style="--c:#0C0B0A"></i><i style="--c:#F2EFE8"></i>`],
    ["Fotografía", "Momentos cotidianos con movimiento: mochila, pausa, mesa compartida, trayecto. Personas reales y diversas.", "◎"],
    ["Tipografía", "Con personalidad, legible y actual. Funciona en redes, empaque y formatos pequeños.", "Aa"],
    ["Ilustración", "Recursos de curiosidad, movimiento y encuentros. Sin depender de una mascota.", "✦"],
    ["Sonido", "Ritmos actuales, ligeros y expresivos. Nada de música épica de alto rendimiento.", "♪"]];
  $("pzVisg").innerHTML = VI.map(([n, d, v], i) => `<article style="--d:${i * 0.08}s"><div class="sw${i ? "" : " pal"}">${v}</div><h5>${n}</h5><p>${d}</p></article>`).join("");
  $("pzBeh").innerHTML = ["Facilita probar el producto con sampling y activaciones en contexto.", "Recomienda sabores según gustos reales y escucha a su comunidad.", "Participa en eventos culturales, recreativos y sociales cuando hay conexión auténtica.", "El descubrimiento empieza en redes y sigue en el punto de venta.", "Responde con claridad; no usa el humor para evadir.", "Lo que comunica, lo que ofrece y lo que la gente encuentra al comprar coinciden.", "Aprende de cada campaña, activación y tienda."].map((t) => `<li>${t}</li>`).join("");
  $("pzLim").innerHTML = ["Declaraciones nutricionales y de propiedades.", "Que la publicidad coincida con la etiqueta vigente y sus sellos.", "Reglas de personajes, promociones y comunicación a niñas y niños.", "Permisos y avisos según el medio.", "La evidencia detrás de cada afirmación."].map((t) => `<li>${t}</li>`).join("");

  /* consistency test */
  const Q = [["Concepto", "¿Conecta de verdad con descubrir, coincidir o encontrarse?"], ["Personalidad", "¿Se siente curiosa, cercana o inesperada sin forzarlo?"], ["Producto", "¿Hay una conexión real con FIBO y sus sabores?"],
    ["Diferenciación", "¿Solo FIBO podría publicarla? (si cualquier marca de suplementos podría, no pasa)", "d"], ["Audiencia", "¿Conecta con la vida diaria de su público?"], ["Tono", "¿El humor y el lenguaje van con el contexto?"],
    ["Credibilidad", "¿Los datos y afirmaciones son exactos y están respaldados?", "v"], ["Responsabilidad", "¿Respeta a las personas y las reglas que aplican?", "v"]];
  const tq = $("pzTq"), score = $("pzScore"), verd = $("pzVerd");
  tq.innerHTML = Q.map(([n, q, k], i) => `<button type="button" class="pz__q" data-k="${k || ""}" aria-pressed="false"><b class="mono">0${i + 1}</b><span><strong>${n}</strong>${q}</span><i aria-hidden="true"></i></button>`).join("");
  const qs = [...tq.children];
  const judge = () => {
    const on = qs.filter((b) => b.classList.contains("on")), n = on.length;
    score.textContent = `${n} / 8`;
    const vFail = qs.some((b) => b.dataset.k === "v" && !b.classList.contains("on")), dFail = !qs.find((b) => b.dataset.k === "d").classList.contains("on");
    let m, c;
    if (n === 8) { m = "✓ Pasa la prueba. Esta pieza sí es de FIBO."; c = "ok"; }
    else if (n === 0) { m = "Toca cada pregunta que la pieza sí cumple."; c = ""; }
    else if (vFail) { m = "✕ No se publica: falta veracidad o cumplimiento."; c = "ko"; }
    else if (dFail) { m = "↺ Replantear: cualquier marca podría publicarla."; c = "re"; }
    else { m = `Van ${n} de 8. Revisa lo que falta antes de aprobar.`; c = ""; }
    verd.textContent = m; verd.className = "pz__verd " + c;
  };
  qs.forEach((b) => b.addEventListener("click", () => { b.classList.toggle("on"); b.setAttribute("aria-pressed", b.classList.contains("on")); judge(); }));
  judge();

  /* measure */
  const MS = [["Marca", "#3A5CFF", ["Asociación espontánea con curiosidad, cercanía y descubrimiento", "Diferenciación frente a competidores relevantes", "Reconocimiento de códigos verbales y visuales", "Comprensión de «Con FIBO te encuentras»"]],
    ["Comunicación", "#FF89B8", ["Interacciones cualitativas con el contenido", "Guardados, compartidos y conversaciones", "Respuesta a campañas y activaciones", "Recuerdo del concepto y de la marca"]],
    ["Negocio", "#D6161D", ["Prueba del producto y conversión", "Ventas y rotación en tiendas activadas vs. comparables", "Recompra, cuando haya datos", "Inversión vs. distribución, disponibilidad y resultados"]]];
  $("pzMsg").innerHTML = MS.map(([n, c, l], i) => `<article style="--c:${c};--d:${i * 0.12}s"><p class="mono">( 0.${i + 1} )</p><h5>${n}</h5><ul>${l.map((x) => `<li>${x}</li>`).join("")}</ul></article>`).join("");

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  sec.querySelectorAll(".pz__sheet, .pz__cards, .pz__tr, .pz__gold").forEach((n) => io.observe(n));
})();
