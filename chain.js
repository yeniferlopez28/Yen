// Commercial chain told like an animated explainer: a red flow grows over a segmented bar, then a dark stage shows where visibility is lost.
(() => {
  const sec = document.getElementById("cadena");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
  const onView = (el, cb, threshold = 0.35) => new IntersectionObserver(([e]) => cb(e.isIntersecting), { threshold }).observe(el);

  // type text into el one character at a time; html marks the highlighted example
  const type = (el, html) => {
    clearInterval(el._t);
    if (reduced) { el.innerHTML = html; return; }
    const tmp = document.createElement("div"); tmp.innerHTML = html;
    const parts = [...tmp.childNodes].map((n) => ({ hi: n.nodeType === 1, text: n.textContent }));
    let i = 0; const total = parts.reduce((s, p) => s + p.text.length, 0);
    el._t = setInterval(() => {
      i += 2; let left = i;
      el.innerHTML = parts.map((p) => { const s = p.text.slice(0, Math.max(0, left)); left -= p.text.length; return p.hi ? `<em>${s}</em>` : s; }).join("");
      if (i >= total) clearInterval(el._t);
    }, 18);
  };

  /* ---------- chain ---------- */
  const STEPS = [
    { n: "01 · Origen", t: "El Molino", d: "Fabrica las barras FIBO y las vende a clientes comerciales." },
    { n: "02 · Cliente comercial", t: "Cadenas comerciales", d: "Empresas que abastecen puntos de venta de cadenas. <em>Ej. 7-Eleven y Nutrisa*</em>" },
    { n: "03 · Cliente comercial", t: "Distribuidores independientes", d: "Clientes que compran FIBO para revenderla a otros negocios o redes de venta. <em>Ej. Edgar García</em>" },
    { n: "04 · Cliente comercial", t: "Distribuidores de pequeños negocios", d: "Llevan el producto a tiendas naturistas, abarrotes, tienditas y otros comercios. <em>Ej. Más Natural Más Sano</em>" },
    { n: "05 · Cliente comercial", t: "Canales digitales", d: "Venta por tienda propia, marketplaces y revendedores en línea. <em>FIBO.mx, Amazon y Mercado Libre</em>" },
    { n: "06 · Destino", t: "Punto de venta y consumidor final", d: "La barra se exhibe, se ofrece y finalmente se compra." },
  ];
  const SHORT = ["El Molino", "Cadenas", "Distribuidores", "Pequeños negocios", "Digital", "Consumidor"];
  const SEG = [[0, 110], [114, 290], [294, 470], [474, 650], [654, 830], [834, 1000]];
  const Y0 = 200, BH = 28;
  const bar = document.getElementById("cdBar"), labels = document.getElementById("cdLabels");
  SEG.forEach(([a, b], i) => {
    bar.appendChild(svgEl("rect", { x: a, y: Y0, width: b - a, height: BH, class: i === SEG.length - 1 ? "cd__seg cd__seg--end" : "cd__seg" }));
    const l = document.createElement("button");
    l.type = "button"; l.textContent = SHORT[i]; l.style.left = (a / 10) + "%"; l.style.width = ((b - a) / 10) + "%";
    l.onclick = () => { auto = false; go(i); };
    labels.appendChild(l);
  });
  const area = document.getElementById("cdArea"), edge = document.getElementById("cdEdge"), tip = document.getElementById("cdTip");
  const top = (x) => Y0 - 26 - 120 * Math.pow(x / 1000, 1.7);
  function drawFlow(x) {
    let d = `M0 ${Y0}`, e = "";
    for (let s = 0; s <= x; s += 10) { const y = top(Math.min(s, x)); d += ` L${s} ${y}`; e += `${s ? "L" : "M"}${s} ${y} `; }
    d += ` L${x} ${top(x)} L${x} ${Y0} Z`;
    area.setAttribute("d", d); edge.setAttribute("d", e + `L${x} ${top(x)}`);
    tip.setAttribute("cx", x); tip.setAttribute("cy", top(x));
  }
  let tipX = 0, step = -1, auto = true, anim;
  function go(i) {
    step = i;
    const s = STEPS[i];
    document.getElementById("cdN").textContent = s.n;
    document.getElementById("cdT").textContent = s.t;
    type(document.getElementById("cdD"), s.d);
    [...labels.children].forEach((l, k) => { l.classList.toggle("on", k === i); l.classList.toggle("done", k < i); });
    const from = tipX, to = SEG[i][1], t0 = performance.now(), ms = reduced ? 0 : 1100;
    cancelAnimationFrame(anim);
    const tick = (t) => {
      const k = ms ? Math.min(1, (t - t0) / ms) : 1, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      tipX = from + (to - from) * e; drawFlow(tipX);
      if (k < 1) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  }
  drawFlow(0);

  /* ---------- where visibility is lost ---------- */
  const GAPS = [
    { t: "Falta de información de venta final", d: "El Molino conoce lo que factura a sus clientes, pero no cuenta con visibilidad consolidada de cuánto se vende en cada tienda." },
    { t: "Inventario y disponibilidad descoordinados", d: "Se detectaron 2,442 piezas en el centro de distribución de Nutrisa mientras 105 tiendas estaban en cero; además, FIBO estaba agotada en tres 7-Eleven visitados." },
    { t: "Poco control sobre la ejecución", d: "No se detectaron materiales de FIBO en los puntos visitados y falta establecer acuerdos de reposición, exhibición y seguimiento." },
  ];
  const stores = document.getElementById("cdStores");
  for (let i = 0; i < 105; i++) {
    const r = svgEl("rect", { x: 570 + (i % 15) * 20, y: 170 + Math.floor(i / 15) * 20, width: 13, height: 13, class: "cd__st" });
    r.style.transitionDelay = (i * 9) + "ms";
    stores.appendChild(r);
  }
  for (let i = 0; i < 3; i++) {
    const r = svgEl("rect", { x: 570 + i * 20, y: 130, width: 13, height: 13, class: "cd__st cd__st--out" });
    r.style.transitionDelay = (1000 + i * 120) + "ms";
    stores.appendChild(r);
  }
  const groups = [...sec.querySelectorAll(".cd__g")], tabs = [...document.querySelectorAll("#cdTabs button")];
  const pz = document.getElementById("cdPz");
  let g = -1, gAuto = true;
  function show(i) {
    g = i;
    groups.forEach((n, k) => n.classList.toggle("on", k === i));
    tabs.forEach((n, k) => n.classList.toggle("on", k === i));
    document.querySelectorAll("#cdLegend p").forEach((n, k) => n.classList.toggle("on", k === i));
    document.getElementById("cdGT").textContent = GAPS[i].t;
    type(document.getElementById("cdGD"), GAPS[i].d);
    if (i === 1) {
      const t0 = performance.now();
      const tick = (t) => { const k = reduced ? 1 : Math.min(1, (t - t0) / 1400); pz.textContent = Math.round(2442 * (1 - Math.pow(1 - k, 3))).toLocaleString("en-US"); if (k < 1 && g === 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }
  }
  tabs.forEach((b, k) => (b.onclick = () => { gAuto = false; show(k); }));

  /* ---------- autoplay while each stage is on screen ---------- */
  let chainVis = false, gapVis = false;
  onView(sec.querySelector(".cd__stage"), (v) => { chainVis = v; if (v && step < 0) go(0); });
  onView(sec.querySelector(".cd__scene"), (v) => { gapVis = v; if (v && g < 0) show(0); });
  if (!reduced) {
    setInterval(() => { if (auto && chainVis) go((step + 1) % STEPS.length); }, 3600);
    setInterval(() => { if (gAuto && gapVis) show((g + 1) % GAPS.length); }, 5200);
  }
})();
