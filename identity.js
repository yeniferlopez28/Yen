// COPIA identity layer: each section takes a FIBO color and the page blends from one to the next while scrolling; lime Anton tickers between blocks.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ids = [...document.querySelectorAll("main section[id], body > section[id], section[id]")].map((s) => s.id);
  const from = ids.indexOf("contexto"), to = ids.indexOf("mensajes");
  if (from < 0 || to < 0) return;
  const secs = ids.slice(from, to + 1).map((id) => document.getElementById(id));
  const LIGHT = ["#FF89B8", "#F5EBD7", "#C9F23A"], DARK = ["#3A5CFF", "#D6161D", "#0B0A09"];
  const rgb = (c) => { const m = c.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; };
  const lum = ([r, g, b]) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  let li = 0, di = 0, prev = "";
  const col = secs.map((s) => {
    const cs = getComputedStyle(s), img = cs.backgroundImage !== "none", bg = rgb(cs.backgroundColor), a = (cs.backgroundColor.match(/[\d.]+/g) || [])[3];
    const dark = img ? true : (a === "0" ? false : lum(bg) < 0.45);
    const seq = dark ? DARK : LIGHT; let c = seq[(dark ? di++ : li++) % seq.length];
    if (c === prev) c = seq[(dark ? di++ : li++) % seq.length];
    prev = c; s.classList.add("idc", dark ? "idc--d" : "idc--l", "idc--" + ({ "#FF89B8": "pink", "#F5EBD7": "bone", "#C9F23A": "lime", "#3A5CFF": "blue", "#D6161D": "red", "#0B0A09": "ink" })[c]); s.style.setProperty("--idc", c); return c;
  });
  // blend: a section entering takes the previous color and fades into its own
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
  const C = col.map(hex);
  const paint = () => {
    const vh = innerHeight;
    secs.forEach((s, i) => {
      const r = s.getBoundingClientRect(); if (r.bottom < -50 || r.top > vh + 50) return;
      const k = reduced || i === 0 ? 1 : Math.max(0, Math.min(1, (vh * 0.95 - r.top) / (vh * 0.55)));
      s.style.backgroundColor = mix(C[Math.max(0, i - 1)], C[i], k);
    });
  };
  let raf = 0; addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; paint(); }); }, { passive: true });
  addEventListener("resize", paint); paint();

  // lime tickers between big blocks
  const W = ["22 g de proteína", "Hecha en Jalisco", "Con FIBO te encuentras", "Una barra que sí te llena", "10 g de fibra", "4 sabores", "Sabe a postre", "De Zapopan a tu mochila"];
  ["objetivos", "ocasiones", "competencia", "problema", "propuesta-valor", "concepto"].forEach((id, n) => {
    const s = document.getElementById(id); if (!s) return;
    const t = document.createElement("div"); t.className = "idt" + (n % 2 ? " rv" : ""); t.setAttribute("aria-hidden", "true");
    const one = W.map((w) => `<span>${w}</span><i>✦</i>`).join(""); t.innerHTML = `<div>${one}${one}</div>`;
    s.after(t);
  });
})();

// Type hierarchy: section titles big, block titles medium, card titles in Archivo; titles fit their column and rise in on enter.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const secs = [...document.querySelectorAll("section.idc")];
  const h2s = [], h3s = [];
  secs.forEach((s) => {
    s.querySelectorAll("h2").forEach((h) => { h.classList.add("idh1"); h2s.push(h); });
    s.querySelectorAll("h3").forEach((h) => {
      const fs = parseFloat(getComputedStyle(h).fontSize);
      const big = fs >= 26 && h.getBoundingClientRect().width > 560; h.classList.add(big ? "idh2" : fs >= 26 ? "idh2s" : "idh3"); if (big) h3s.push(h);
    });
    // lead paragraph right after a section title
    s.querySelectorAll("h2 + p").forEach((p) => { const cs = getComputedStyle(p); if (!p.closest("button") && p.textContent.length > 40 && cs.position !== "absolute") p.classList.add("idlead"); });
  });
  // shrink any title whose longest word would overflow its column
  const fit = () => [...h2s, ...h3s].forEach((h) => {
    h.style.fontSize = ""; const min = h.classList.contains("idh1") ? 40 : 26;
    let fs = parseFloat(getComputedStyle(h).fontSize), n = 0;
    while (h.scrollWidth > h.clientWidth + 1 && fs > min && n++ < 30) { fs *= 0.94; h.style.fontSize = fs + "px"; }
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit); addEventListener("resize", fit);
  if (reduced) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("idin"); io.unobserve(e.target); } }), { threshold: 0.2 });
  [...h2s, ...h3s].forEach((h) => { h.classList.add("idrise"); io.observe(h); });
})();

// Alignment pass: centered titles/leads get centered as blocks; left ones stay flush with their column.
(() => {
  const run = () => document.querySelectorAll("section.idc .idh1, section.idc .idh2, section.idc .idlead").forEach((el) => {
    const c = getComputedStyle(el).textAlign === "center";
    el.classList.toggle("idctr", c);
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(run); addEventListener("resize", run);
})();
