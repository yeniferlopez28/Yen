// Findings as a hexagon radar (city-statistics style): six problems on the corners, real data on each axis, drag to reorder.
(() => {
  const sec = document.getElementById("hallazgos");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };

  const P = [
    { k: "Clientes", t: "Dependencia de muy pocos clientes", v: 58.7, l: "del valor vendido en 2026 está en dos clientes",
      p: ["Sin el cliente de 7-Eleven, el resto de la cartera cae casi <b>17%</b>.", "Cinco clientes que compraron más de <b>$200 mil</b> en 2025 dejaron de comprar."] },
    { k: "Margen", t: "Pérdida de margen", v: 11.6, l: "subió el costo por barra, contra 2.1% del precio",
      p: ["El margen bruto bajó de <b>42.5% a 37.2%</b>: vende más, pero gana menos.", "El cliente con más volumen después de 7-Eleven es el que <b>paga el precio más bajo</b>."] },
    { k: "Punto de venta", t: "Ejecución en el punto de venta", v: 32, l: "de los puntos visitados no tenía la barra",
      p: ["En <b>ninguno</b> había material de FIBO; la competencia tiene exhibidores y talkers.", "Ninguna cadena maneja los <b>cuatro sabores</b> y Nutrisa tiene más de cien tiendas en cero."] },
    { k: "Marca", t: "Una marca apagada y desordenada", v: 91.7, l: "11 de 12 meses sin publicar en redes",
      p: ["Perdió unos <b>3,000 seguidores</b>. Conviven 2 logos, 4 nombres y 3 líneas visuales.", "La misma barra se vende en <b>5 precios</b>, de $43 a casi $62, y en línea los canales están detenidos."] },
    { k: "Producto", t: "Producto y comunicación", v: 75, l: "3 de los 4 sabores comparten el mismo código de barras",
      p: ["La queja más repetida: la barra está <b>«reseca»</b>.", "Circulan claims que no se sostienen («whey», «sin azúcar añadida») y faltan tablas nutrimentales de dos sabores."] },
    { k: "Información", t: "Falta de información", v: 82.9, l: "de los clientes no tiene correo registrado (87 de 105)",
      p: ["No se puede calcular la <b>venta neta</b> y el costo por barra no está validado.", "No hay datos de venta al consumidor por tienda: sin eso no se pueden fijar metas ni precios."] },
  ];
  let order = P.map((_, i) => i), sel = 0;

  const C = [300, 262], R = 200;
  const ang = (i) => (Math.PI / 180) * (-120 + i * 60); // corners: top-left, top-right, right, bottom-right, bottom-left, left
  const pt = (i, f) => [C[0] + Math.cos(ang(i)) * R * f, C[1] + Math.sin(ang(i)) * R * f];
  const pts = (fs) => fs.map((f, i) => pt(i, f).map((n) => n.toFixed(1)).join(",")).join(" ");

  // stacked translucent hexagons like the reference
  const grid = document.getElementById("hzGrid"), axes = document.getElementById("hzAxes");
  [1, .86, .72, .58, .44, .3].forEach((f, k) => el("polygon", { points: pts(Array(6).fill(f)), class: "hz__ring", style: `--d:${k * 80}ms` }, grid));
  for (let i = 0; i < 6; i++) { const [x, y] = pt(i, 1); el("line", { x1: C[0], y1: C[1], x2: x, y2: y, class: "hz__ax" }, axes); }
  const shape = document.getElementById("hzShape"), hi = document.getElementById("hzHi"), dots = document.getElementById("hzDots");

  // corner pills + list pills
  const corners = document.getElementById("hzCorners"), list = document.getElementById("hzList");
  const cornerEls = [...Array(6)].map((_, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "hz__pill hz__corner";
    const [x, y] = pt(i, 1.16); b.style.left = (x / 600) * 100 + "%"; b.style.top = (y / 520) * 100 + "%";
    b.onclick = () => select(order[i]);
    b.addEventListener("dragover", (e) => { e.preventDefault(); b.classList.add("over"); });
    b.addEventListener("dragleave", () => b.classList.remove("over"));
    b.addEventListener("drop", (e) => { e.preventDefault(); b.classList.remove("over"); place(+e.dataTransfer.getData("text/plain"), i); });
    corners.appendChild(b); return b;
  });
  const listEls = P.map((p, j) => {
    const li = document.createElement("li"), b = document.createElement("button");
    b.type = "button"; b.className = "hz__pill"; b.draggable = true; b.innerHTML = `<span>${p.k}</span><i aria-hidden="true">✣</i>`;
    b.onclick = () => select(j);
    b.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", j); b.classList.add("drag"); });
    b.addEventListener("dragend", () => b.classList.remove("drag"));
    li.appendChild(b); list.appendChild(li); return b;
  });

  // move problem j to corner i (swap with whatever sits there)
  function place(j, i) {
    const from = order.indexOf(j); [order[from], order[i]] = [order[i], order[from]];
    draw(); select(j);
  }

  let cur = Array(6).fill(0), anim;
  function draw() {
    const target = order.map((j) => P[j].v / 100);
    cornerEls.forEach((b, i) => { b.textContent = P[order[i]].k; });
    const from = cur.slice(), t0 = performance.now(), ms = reduced ? 0 : 900;
    cancelAnimationFrame(anim);
    const tick = (t) => {
      const k = ms ? Math.min(1, (t - t0) / ms) : 1, e = 1 - Math.pow(1 - k, 3);
      cur = from.map((f, i) => f + (target[i] - f) * e);
      shape.setAttribute("points", pts(cur));
      hilite();
      if (k < 1) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  }
  function hilite() {
    const i = order.indexOf(sel);
    // outline only the wedge of the selected problem, like the highlighted city
    const f = cur.map((v, k) => (k === i ? v : (k + 1) % 6 === i || (i + 1) % 6 === k ? v * 0.5 : 0));
    hi.setAttribute("points", pts(f));
    dots.innerHTML = "";
    const [x, y] = pt(i, cur[i]);
    el("circle", { cx: x, cy: y, r: 9, class: "hz__ring2" }, dots); el("circle", { cx: x, cy: y, r: 4, class: "hz__dot" }, dots);
  }
  function select(j) {
    sel = j;
    const p = P[j];
    document.getElementById("hzN").textContent = `Problema 0${j + 1} / 06`;
    document.getElementById("hzT").textContent = p.t;
    document.getElementById("hzV").textContent = (p.v % 1 ? p.v.toFixed(1) : p.v) + "%";
    document.getElementById("hzVl").textContent = p.l;
    document.getElementById("hzP").innerHTML = p.p.map((s) => `<li>${s}</li>`).join("");
    cornerEls.forEach((b, i) => b.classList.toggle("on", order[i] === j));
    listEls.forEach((b, k) => b.classList.toggle("on", k === j));
    const det = document.getElementById("hzDet"); det.classList.remove("swap"); void det.offsetWidth; det.classList.add("swap");
    hilite();
  }

  select(0);
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { sec.classList.add("in"); draw(); io.disconnect(); } }, { threshold: 0.3 }).observe(document.getElementById("hzRadar"));
})();
