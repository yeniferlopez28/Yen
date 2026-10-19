// Central problem: phases-style arcs for the four causes, a glowing scroll-driven curve of symptoms → consequences, and the challenge curve.
(() => {
  const sec = document.getElementById("problema");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;

  /* four causes as dashed arcs */
  const C = [
    { n: "Falta de dirección", i: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M15.5 8.5l-2 5-5 2 2-5z", d: "No existía una definición clara de qué es FIBO, para quién es y qué promete. Cada canal y cada material dicen algo distinto.", m: "0 definiciones" },
    { n: "Falta de inversión y seguimiento", i: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M9 10c0-1 1.3-2 3-2s3 .8 3 2-1.3 1.5-3 2-3 1-3 2 1.3 2 3 2 3-1 3-2", d: "Menos de 60 mil pesos en publicidad en ocho años y ninguna persona dedicada a la marca.", m: "<$60 mil · 8 años" },
    { n: "Falta de información", i: "M3 3h18v18H3zM3 9h18M9 21V9M15 15l3 3M18 15l-3 3", d: "Sin venta neta, sin costo validado, sin datos de venta por tienda y sin contacto con la mayoría de los clientes: imposible saber qué funciona.", m: "4 datos que faltan" },
    { n: "Las decisiones no se implementan", i: "M4 12h10M10 6l6 6-6 6M20 4v16", d: "El cambio de gimnasio a vida cotidiana y «Con FIBO te encuentras» ya existen, pero no llegan al empaque, al anaquel ni a las redes.", m: "0 de 3 puntos" },
  ];
  const arcs = document.getElementById("pbArcs"), cl = document.getElementById("pbCl");
  arcs.innerHTML = C.map((c, i) => `
    <button type="button" class="pb__arc${i ? "" : " on"}" data-i="${i}">
      <svg class="dome" viewBox="0 0 200 104" preserveAspectRatio="none"><defs><linearGradient id="pbG${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset="1" stop-color="#0c0b0a"/></linearGradient></defs><path class="fill" d="M2 102 A98 98 0 0 1 198 102 Z" fill="url(#pbG${i})"/><path class="ln" d="M2 102 A98 98 0 0 1 198 102"/><circle cx="2" cy="102" r="3.5"/><circle cx="198" cy="102" r="3.5"/></svg>
      <span class="ico">${ic(c.i)}</span>
      <h4><b class="mono">0${i + 1}</b> ${c.n}</h4>
      <p>${c.d}</p>
      <em class="mono">${c.m}</em>
    </button>`).join("");
  const ab = [...arcs.children];
  let ai = 0, at = 0;
  const pick = (i, user) => {
    ai = i; ab.forEach((b, k) => b.classList.toggle("on", k === i));
    cl.innerHTML = `<b class="mono">0${i + 1} / 04</b>${C[i].n}`;
    if (user) clearInterval(at);
  };
  ab.forEach((b, i) => { b.addEventListener("click", () => pick(i, true)); b.addEventListener("pointerenter", () => pick(i, true)); });
  pick(0);

  /* symptoms → consequences along the glowing curve */
  const P = [
    ["s", "68% de los puntos", "sin un solo material propio"], ["s", "Redes sin publicar", "11 meses"], ["s", "2 logos · 4 nombres", "una marca sin identidad"],
    ["s", "5 precios", "para la misma barra"], ["s", "Claims", "que no se pueden sostener"], ["s", "Canales en línea", "detenidos"], ["s", "Textura", "que nadie ha revisado"],
    ["c", "Casi nadie conoce la marca", ""], ["c", "El crecimiento depende", "de un solo cliente"], ["c", "El margen está cayendo", "−5.3 puntos"],
    ["c", "5 clientes dejaron de comprar", "+$200 mil"], ["c", "La competencia ocupa", "los espacios de FIBO"],
  ];
  const path = document.getElementById("pbPath"), lit = document.getElementById("pbLit"), glow = document.getElementById("pbGlowP"), pts = document.getElementById("pbPts"), flow = document.getElementById("pbFlow");
  const L = path.getTotalLength();
  const T = P.map((_, i) => 0.05 + (i / (P.length - 1)) * 0.9);
  pts.innerHTML = `<span class="pb__sep mono" style="--t:${((T[6] + T[7]) / 2).toFixed(3)}">Consecuencias ↓</span><span class="pb__sep s mono">Síntomas ↓</span>` + P.map((p, i) => {
    const q = path.getPointAtLength(L * T[i]), right = q.x < 640;
    return `<div class="pb__pt ${p[0]}${right ? "" : " lf"}" style="left:${(q.x / 12).toFixed(2)}%;top:${(q.y / 15).toFixed(2)}%"><i></i><div><span class="mono">${p[0] === "s" ? "Síntoma" : "Consecuencia"} · ${String(i + 1).padStart(2, "0")}</span><b>${p[1]}</b>${p[2] ? `<small>${p[2]}</small>` : ""}</div></div>`;
  }).join("");
  // place the "Consecuencias" separator at its point on the curve
  const sep = pts.querySelector(".pb__sep"), sq = path.getPointAtLength(L * +sep.style.getPropertyValue("--t"));
  sep.style.left = (sq.x / 12) + "%"; sep.style.top = (sq.y / 15) + "%";
  const ptEls = [...pts.querySelectorAll(".pb__pt")];
  [lit, glow].forEach((p) => { p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  const onScroll = () => {
    const r = flow.getBoundingClientRect(), vh = innerHeight;
    const k = reduced ? 1 : Math.max(0, Math.min(1, (vh * 0.62 - r.top) / r.height));
    lit.style.strokeDashoffset = glow.style.strokeDashoffset = L * (1 - k);
    ptEls.forEach((e, i) => e.classList.toggle("on", T[i] <= k + 0.005));
    flow.classList.toggle("late", k > (T[6] + T[7]) / 2);
  };
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.id === "pbCauses" && !reduced) at = setInterval(() => pick((ai + 1) % C.length), 4500);
    io.unobserve(e.target);
  }), { threshold: 0.25 });
  sec.querySelectorAll(".pb__head, #pbHub, #pbCauses, #pbChal, #pbAns").forEach((n) => io.observe(n));
})();
