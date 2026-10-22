// Creator strategy: shop grid of collaboration models, profile dropdown, weight switcher, break-even calculator, pixel thumbs and reveals.
(() => {
  const root = document.getElementById("estrategia-creadores");
  if (!root) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // shop: clicking a cover shows that model in the lime featured cell
  const M = JSON.parse(document.getElementById("czModels").textContent), feat = root.querySelector(".cz__feat");
  const cells = [...root.querySelectorAll(".cz__cell")];
  const show = (k) => {
    const m = M[k]; if (!m || !feat) return;
    const [name, , obj, ent, apo, der, ocu, met, rie, uso, ph] = m;
    const rows = [["El creador entrega", ent], ["FIBO aporta", apo], ["Riesgo", rie]];
    feat.innerHTML = `<h4>${esc(name)}:</h4><p class="cz__fo">${esc(obj)}</p><dl>${rows.map(([a, b]) => `<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl><footer><b>${esc(ph)}</b><span>${esc(uso)}</span></footer>`;
    feat.classList.remove("cz--flash"); void feat.offsetWidth; feat.classList.add("cz--flash");
    cells.forEach((c) => c.classList.toggle("on", c.dataset.m === k));
  };
  cells.forEach((c) => c.addEventListener("click", () => show(c.dataset.m)));
  const micro = cells.find((c) => c.dataset.m === "micro"); if (micro) micro.classList.add("on");

  // profile dropdown
  const dd = root.querySelector(".cz__dd");
  if (dd) {
    const b = dd.querySelector(".cz__ddb"), menu = dd.querySelector(".cz__ddm");
    const open = (v) => { menu.hidden = !v; b.setAttribute("aria-expanded", v); };
    b.addEventListener("click", () => open(menu.hidden));
    menu.querySelectorAll("button").forEach((o) => o.addEventListener("click", () => {
      root.querySelectorAll(".cz__pf").forEach((p) => (p.hidden = p.dataset.p !== o.dataset.p));
      b.querySelector("b").textContent = o.textContent; open(false); b.focus();
    }));
    document.addEventListener("click", (e) => { if (!dd.contains(e.target)) open(false); });
    dd.addEventListener("keydown", (e) => { if (e.key === "Escape") open(false); });
  }

  // selection weights: micro / UGC / embajador
  const seg = root.querySelectorAll(".cz__seg:not(.cz__seg--m) button"), rows = root.querySelectorAll(".cz__wt li");
  seg.forEach((s) => s.addEventListener("click", () => {
    seg.forEach((t) => t.classList.toggle("on", t === s));
    rows.forEach((r) => { const v = r.dataset.w.split(",")[+s.dataset.w]; r.querySelector("i").style.setProperty("--v", v); r.querySelector("b").textContent = v; r.classList.toggle("z", v === "0"); });
  }));

  // break-even calculator
  const cost = document.getElementById("czCost"), out = document.getElementById("czCostO"), bars = document.getElementById("czBars"), fill = document.getElementById("czBarFill");
  const mg = root.querySelectorAll(".cz__seg--m button");
  let margin = 7.5;
  const fmt = (n) => n.toLocaleString("es-MX");
  const calc = () => { const c = +cost.value, n = Math.round(c / margin); out.textContent = "$" + fmt(c); bars.textContent = fmt(n); fill.style.width = Math.min(100, (n / 5000) * 100) + "%"; };
  if (cost) { cost.addEventListener("input", calc); mg.forEach((b) => b.addEventListener("click", () => { mg.forEach((t) => t.classList.toggle("on", t === b)); margin = +b.dataset.mg; calc(); })); calc(); }

  // 12×12 pixel thumbs for the UGC steps
  const PX = {
    cam: ["............", "...####.....", "############", "#..........#", "#...####...#", "#..#....#..#", "#..#.##.#..#", "#..#....#..#", "#...####...#", "#..........#", "############", "............"],
    play: ["............", "..##........", "..####......", "..######....", "..########..", "..#########.", "..#########.", "..########..", "..######....", "..####......", "..##........", "............"],
    chart: ["............", "..........##", ".........###", "..##.....###", "..##..##.###", "..##..##.###", "..##..##.###", "#.##..##.###", "#.##..##.###", "############", "............", "............"],
    up: [".....##.....", "....####....", "...######...", "..########..", ".##########.", "....####....", "....####....", "....####....", "....####....", "....####....", "....####....", "............"],
    copy: ["........", "#######.....", "#.....#.....", "#..########.", "#..#......#.", "#..#......#.", "####......#.", "...#......#.", "...#......#.", "...########.", "............", "............"].map((r) => r.padEnd(12, ".")),
    loop: ["............", "...######...", "..#......#..", ".#........#.", ".#.......###", ".#........#.", ".#..........", ".#........#.", "###.......#.", ".#........#.", "..#......#..", "...######..."],
  };
  root.querySelectorAll("svg[data-pxz]").forEach((s) => { const r = PX[s.dataset.pxz]; if (!r) return; s.setAttribute("viewBox", "0 0 12 12"); s.setAttribute("shape-rendering", "crispEdges"); s.innerHTML = r.map((row, y) => [...row].map((c, x) => (c === "#" ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : "")).join("")).join(""); });


  // hook bar: type the next hook
  const hooks = JSON.parse((document.getElementById("czHooks") || {}).textContent || "[]"), hk = document.getElementById("czHook"), hb = document.getElementById("czHookBtn");
  let hi = 0, ht = 0;
  const type = (t) => { clearInterval(ht); if (reduced) { hk.textContent = t; return; } let n = 0; hk.textContent = ""; ht = setInterval(() => { hk.textContent = t.slice(0, ++n); if (n >= t.length) clearInterval(ht); }, 28); };
  if (hk && hb && hooks.length) hb.addEventListener("click", () => { hi = (hi + 1) % hooks.length; type(hooks[hi]); });

  // copy outreach messages
  root.querySelectorAll(".cz__copy").forEach((b) => b.addEventListener("click", async () => {
    const t = b.previousElementSibling.textContent.trim();
    try { await navigator.clipboard.writeText(t); b.textContent = "¡copiado!"; } catch (e) { b.textContent = "selecciona y copia"; }
    setTimeout(() => (b.textContent = "copiar mensaje"), 1800);
  }));

  // Notion base tabs
  const dbt = root.querySelectorAll(".cz__seg--db button");
  dbt.forEach((b) => b.addEventListener("click", () => { dbt.forEach((t) => t.classList.toggle("on", t === b)); root.querySelectorAll(".cz__db").forEach((d) => (d.hidden = d.dataset.db !== b.dataset.db)); }));

  // pilot budget scenarios
  const BD = JSON.parse((document.getElementById("czBud") || {}).textContent || "{}"), bdt = root.querySelectorAll(".cz__seg--bd button");
  bdt.forEach((b) => b.addEventListener("click", () => { bdt.forEach((t) => t.classList.toggle("on", t === b)); root.querySelectorAll("[data-bl]").forEach((x) => { x.textContent = BD[b.dataset.bd][+x.dataset.bl]; x.classList.remove("cz--flash"); void x.offsetWidth; x.classList.add("cz--flash"); }); }));

  // internal data checklist (kept in this browser only)
  const KEY = "fibo-cz-need", boxes = [...root.querySelectorAll(".cz__need input")], nn = document.getElementById("czNeedN");
  let saved = []; try { saved = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) {}
  const count = () => { if (nn) nn.textContent = `${boxes.filter((b) => b.checked).length}/${boxes.length}`; };
  boxes.forEach((b) => { b.checked = saved.includes(+b.dataset.n); b.addEventListener("change", () => { try { localStorage.setItem(KEY, JSON.stringify(boxes.filter((x) => x.checked).map((x) => +x.dataset.n))); } catch (e) {} count(); }); });
  count();

  // reveal on scroll
  const els = root.querySelectorAll(".cz__man, .cz__shop, .cz__win, .cz__lab, .cz__desk, .cz__truus, .cz__src");
  if (reduced || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  root.classList.add("cz--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
  els.forEach((e) => io.observe(e));
})();
