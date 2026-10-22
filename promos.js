// Promotion receipts: per-bar margin, volume lift needed to break even and bars to pay fixed material, recalculated live.
(() => {
  const root = document.getElementById("estrategia-promociones");
  if (!root) return;
  const C = 14.42, N = 23.82, IVA = 1.16, M0 = N - C, D0 = 43 / IVA - C;
  const $ = (v) => (v < 0 ? "−$" : "$") + Math.abs(v).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = (v) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(Math.round(v * 100)) + "%";
  const int = (v) => Math.ceil(v).toLocaleString("es-MX");
  const row = (a, b, cls = "") => `<div class="${cls}"><dt>${a}</dt><dd>${b}</dd></div>`;

  const calc = (c, s) => {
    let rows = "", m, base, fixLabel = c.fixl || "";
    if (c.kind === "b2b") {
      const d = c.p - c.pp, direct = Math.abs(c.p - N) < 0.01, share = direct ? 1 : s / 100;
      rows += direct ? row("Precio a cliente empresarial", $(c.p)) + row("Precio con descuento", $(c.pp)) : row("Precio al público", $(c.p)) + row("Precio de la promoción", $(c.pp));
      rows += row("Descuento por barra", $(-(d)));
      if (!direct) rows += row(`FIBO paga (${Math.round(share * 100)}%)`, $(-(share * d)));
      rows += (direct ? "" : row("Precio de FIBO a la tienda", $(N))) + row("Costo de producción", $(-(C)));
      base = M0; m = M0 - share * d;
    } else if (c.kind === "b2bfree") {
      const give = C / c.every;
      rows += row("Precio de FIBO a la tienda", $(N)) + row("Costo de producción", $(-(C))) + row(`Barra regalada cada ${c.every}`, $(-(give)));
      base = M0; m = M0 - give; fixLabel = "tarjetas y material de mostrador";
    } else {
      const net = c.pp / IVA;
      rows += row("Precio por barra al público", $(c.p));
      if (Math.abs(c.p - c.pp) > 0.01) rows += row("Precio con la promoción", $(c.pp));
      rows += row("Sin IVA", $(net)) + row("Costo de producción", $(-(C)));
      if (c.extra) rows += row(c.extral || "Otros costos", $(-(c.extra)));
      base = D0; m = net - C - (c.extra || 0);
    }
    rows += row(`Margen sin promoción`, $(base), "pm__mut");
    return { rows, m, base, fix: c.fix || 0, fixLabel };
  };

  const cmp = document.getElementById("pmCmp"), cmpRows = [];
  root.querySelectorAll(".pm__tk").forEach((tk, i) => {
    const data = JSON.parse(tk.dataset.calc), dl = tk.querySelector(".pm__rows"), sl = tk.querySelector(".pm__sl"), inp = sl.querySelector("input"), outp = sl.querySelector("output");
    const om = tk.querySelector(".pm__m"), ol = tk.querySelector(".pm__l"), of = tk.querySelector(".pm__f"), fl = tk.querySelector(".pm__fixl");
    let mode = "main";
    const name = tk.querySelector("h3").textContent, ch = tk.querySelector(".pm__th span:last-child").textContent, ver = tk.querySelector(".pm__ft b").textContent;
    const tr = document.createElement("tr"); if (cmp) cmp.appendChild(tr); cmpRows.push(tr);
    const draw = () => {
      const c = data[mode], showSl = c.kind === "b2b" && Math.abs(c.p - N) > 0.01;
      sl.hidden = !showSl; outp.textContent = inp.value + "%";
      const r = calc(c, +inp.value);
      dl.innerHTML = r.rows;
      om.textContent = $(r.m); om.classList.toggle("neg", r.m <= 0);
      if (r.m <= 0) { ol.textContent = "pierde"; of.textContent = "—"; }
      else { const lift = r.base / r.m - 1; ol.textContent = lift <= 0.005 ? "no hace falta" : pct(lift); of.textContent = r.fix ? int(r.fix / r.m) : "—"; }
      fl.textContent = r.fix ? `Material fijo: ${$(r.fix)} (${r.fixLabel}).` : "Sin material fijo relevante.";
      tk.classList.remove("pm--pulse"); void tk.offsetWidth; tk.classList.add("pm--pulse");
      if (mode === "main") tr.innerHTML = `<th>${name}</th><td>${ch}</td><td class="${r.m <= 0 ? "neg" : ""}">${$(r.m)}</td><td>${ol.textContent}</td><td>${ver}</td>`;
    };
    inp.addEventListener("input", draw);
    tk.querySelectorAll(".pm__mode button").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; tk.querySelectorAll(".pm__mode button").forEach((x) => x.classList.toggle("on", x === b)); draw(); }));
    draw();
  });

  // receipts print in when they reach the screen
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("pm--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
  root.querySelectorAll(".pm__tk, .pm__head, .pm__sum, .pm__mat").forEach((el) => io.observe(el));
})();
