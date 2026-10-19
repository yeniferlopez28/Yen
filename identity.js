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
