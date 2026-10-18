// Current channels: expandable channel index, AMG map with a lens (Morphocode-style), national map and e-commerce waffle.
(() => {
  const sec = document.getElementById("canales");
  if (!sec || !window.FIBO_MAP) return;
  const { amg, nat } = window.FIBO_MAP;
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };
  const once = (node, cb, threshold = 0.3) => new IntersectionObserver(([e], io) => { if (e.isIntersecting) { cb(); io.disconnect(); } }, { threshold }).observe(node);
  const fmt = (n) => n.toLocaleString("es-MX");

  /* ---------- channel index ---------- */
  const rows = [...sec.querySelectorAll(".cn__row")];
  rows.forEach((r) => {
    r.style.setProperty("--p", Math.max(+r.dataset.pct, 0.6) + "%");
    r.querySelector(".cn__sum").onclick = () => rows.forEach((o) => o.classList.toggle("open", o === r && !r.classList.contains("open")));
  });
  once(document.getElementById("cnList"), () => document.getElementById("cnList").classList.add("in"));

  /* ---------- AMG map ---------- */
  const map = document.getElementById("cnMap"), tip = document.getElementById("cnTip");
  map.setAttribute("viewBox", `0 0 ${amg.w} ${amg.h}`);
  const gM = el("g", { class: "cn__mus" }, map);
  amg.m.forEach((m) => {
    el("path", { d: m.d, class: "cn__mu" }, gM);
  });
  const gL = el("g", { class: "cn__mul" }, map);
  amg.m.forEach((m) => { const t = el("text", { x: m.c[0], y: m.c[1], class: "cn__ml" }, gL); t.textContent = m.n.toUpperCase(); });

  const ST = { a: "Activo", d: "Dejó de comprar", p: "Prospecto" };
  const gP = el("g", { class: "cn__pts" }, map);
  const pts = amg.pts.map((p) => {
    const c = el("circle", { cx: p.x, cy: p.y, r: p.s === "p" ? 2.2 : 3.2, class: "cn__pt cn__pt--" + p.s }, gP);
    c.addEventListener("pointerenter", (e) => showTip(e, `<b>${p.n}</b>${[p.g, p.c].filter(Boolean).join(" · ")}<em>Más Natural Más Sano · ${ST[p.s]}</em>`));
    c.addEventListener("pointerleave", hideTip);
    return { ...p, node: c };
  });

  // chains have no coordinates: one bubble per account and municipality
  const CH = { "7-Eleven": ["k7", -1], "Nutrisa": ["knu", 1], "Farmacias del Ahorro": ["kfa", 0] };
  const gC = el("g", { class: "cn__chs" }, map);
  const centers = Object.fromEntries(amg.m.map((m) => [m.n, m.c]));
  const bubbles = [];
  for (const acc in amg.ch) {
    for (const mun in amg.ch[acc]) {
      const [si, no] = amg.ch[acc][mun], tot = si + no, [cls, side] = CH[acc], c = centers[mun];
      const r = 6 + Math.sqrt(tot) * 4.2;
      const x = c[0] + side * 26, y = c[1] + (side === 0 ? 30 : 18);
      const g = el("g", { class: "cn__ch " + cls, "data-acc": acc }, gC);
      el("circle", { cx: x, cy: y, r }, g);
      const t = el("text", { x, y: y + 4 }, g); t.textContent = tot;
      g.addEventListener("pointerenter", (e) => showTip(e, `<b>${acc} · ${mun}</b>${tot} ${tot === 1 ? "tienda registrada" : "tiendas registradas"}<em>${si} con FIBO · ${no} sin FIBO el día de la visita</em>`));
      g.addEventListener("pointerleave", hideTip);
      bubbles.push(g);
    }
  }

  // frame the urban core where the points are; a small inset keeps the whole AMG in view
  const xs = [...pts.map((p) => p.x), ...amg.m.filter((m) => amg.m && Object.values(amg.ch).some((a) => a[m.n])).map((m) => m.c[0])];
  const ys = [...pts.map((p) => p.y), ...amg.m.filter((m) => Object.values(amg.ch).some((a) => a[m.n])).map((m) => m.c[1] + 60)];
  let vx = Math.min(...xs) - 70, vy = Math.min(...ys) - 70, vw = Math.max(...xs) - vx + 70, vh = Math.max(...ys) - vy + 70;
  if (vw / vh < 1.3) { const nw = vh * 1.3; vx -= (nw - vw) / 2; vw = nw; }
  map.setAttribute("viewBox", `${vx} ${vy} ${vw} ${vh}`);
  const inset = el("svg", { class: "cn__inset", viewBox: `0 0 ${amg.w} ${amg.h}` });
  amg.m.forEach((m) => el("path", { d: m.d }, inset));
  el("rect", { x: vx, y: vy, width: vw, height: vh }, inset);
  map.parentElement.appendChild(inset);

  const wrap = map.parentElement;
  function showTip(e, html) {
    tip.innerHTML = html; tip.hidden = false;
    const r = wrap.getBoundingClientRect();
    tip.style.left = Math.min(e.clientX - r.left + 14, r.width - 230) + "px"; tip.style.top = (e.clientY - r.top + 14) + "px";
  }
  function hideTip() { tip.hidden = true; }

  // lens
  const lens = el("g", { class: "cn__lens" }, map);
  const ring = el("circle", { r: 70, class: "cn__ring" }, lens);
  el("circle", { r: 9, class: "cn__ctr" }, lens);
  el("path", { d: "M-5 0H5M0 -5V5", class: "cn__ctr" }, lens);
  const R = document.getElementById("cnR"), Rv = document.getElementById("cnRv");
  const kmPerUnit = 0.0829; // ~83 m per map unit at this projection width
  let L = { x: 0, y: 0 };
  const waf = document.getElementById("cnWaf"), leg = document.getElementById("cnLeg"), gir = document.getElementById("cnGir");
  for (let i = 0; i < 100; i++) waf.appendChild(document.createElement("i"));
  function updateLens() {
    const r = +R.value;
    ring.setAttribute("r", r); lens.setAttribute("transform", `translate(${L.x} ${L.y})`);
    Rv.textContent = (r * kmPerUnit).toFixed(1) + " km";
    const inside = pts.filter((p) => (p.x - L.x) ** 2 + (p.y - L.y) ** 2 <= r * r);
    pts.forEach((p) => p.node.classList.toggle("lit", inside.includes(p)));
    const c = { a: 0, d: 0, p: 0 }; inside.forEach((p) => c[p.s]++);
    document.getElementById("cnN").textContent = inside.length;
    document.getElementById("cnA").textContent = c.a;
    const n = inside.length || 1;
    let a = Math.round((c.a / n) * 100), d = Math.round((c.d / n) * 100);
    [...waf.children].forEach((dot, i) => (dot.className = !inside.length ? "" : i < a ? "a" : i < a + d ? "d" : "p"));
    leg.innerHTML = ["a", "d", "p"].map((s) => `<li><i class="k k--${s}"></i>${ST[s]}<span>${inside.length ? Math.round((c[s] / n) * 1000) / 10 : 0}%</span></li>`).join("");
    const g = {}; inside.forEach((p) => { const k = p.g || "Sin giro"; g[k] = (g[k] || 0) + 1; });
    const top = Object.entries(g).sort((x, y) => y[1] - x[1]).slice(0, 5), mx = top[0] ? top[0][1] : 1;
    gir.innerHTML = top.length ? top.map(([k, v]) => `<li><span>${k}</span><b>${v}</b><i style="--w:${(v / mx) * 100}%"></i></li>`).join("") : "<li class='cn__none'>Sin puntos en la lupa</li>";
  }
  const toMap = (e) => { const pt = map.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(map.getScreenCTM().inverse()); };
  let dragging = false;
  map.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || dragging) { const p = toMap(e); L = { x: p.x, y: p.y }; updateLens(); } });
  map.addEventListener("pointerdown", (e) => { dragging = true; const p = toMap(e); L = { x: p.x, y: p.y }; updateLens(); });
  addEventListener("pointerup", () => (dragging = false));
  R.oninput = updateLens;
  { const pv = pts.filter((p) => /providencia/i.test(p.c)); L = pv.length ? { x: pv.reduce((a, p) => a + p.x, 0) / pv.length, y: pv.reduce((a, p) => a + p.y, 0) / pv.length } : { x: vx + vw / 2, y: vy + vh / 2 }; }
  updateLens();

  // account filter
  document.querySelectorAll("#cnFilters input").forEach((inp) => (inp.onchange = () => {
    const v = inp.value;
    gP.style.display = v === "all" || v === "mnms" ? "" : "none";
    lens.style.display = gP.style.display;
    bubbles.forEach((b) => (b.style.display = v === "all" || v === b.dataset.acc ? "" : "none"));
  }));

  // priority zones
  const zbtn = [...document.querySelectorAll("#cnZones button")];
  zbtn.forEach((b) => (b.onclick = () => {
    const on = !b.classList.contains("on");
    zbtn.forEach((o) => o.classList.toggle("on", o === b && on));
    map.classList.toggle("zoned", on);
    pts.forEach((p) => p.node.classList.toggle("zone", on && p.c.toLowerCase().includes(b.dataset.z)));
    if (on) {
      const hit = pts.filter((p) => p.node.classList.contains("zone"));
      if (hit.length) { L = { x: hit.reduce((s, p) => s + p.x, 0) / hit.length, y: hit.reduce((s, p) => s + p.y, 0) / hit.length }; updateLens(); }
      document.getElementById("cnAmg").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }));
  once(document.getElementById("cnAmg"), () => map.classList.add("in"), 0.2);

  /* ---------- national map ---------- */
  const mx = document.getElementById("cnMx"), tip2 = document.getElementById("cnTip2");
  mx.setAttribute("viewBox", `0 0 ${nat.w} ${nat.h}`);
  const tot = (s) => Object.values(s.v).reduce((a, b) => a + b, 0);
  const max = Math.max(...nat.s.map(tot));
  const gS = el("g", {}, mx), gB = el("g", {}, mx);
  const states = nat.s.map((s) => {
    const t = tot(s);
    const p = el("path", { d: s.d, class: "cn__st" + (t ? " has" : "") + (s.n === "Jalisco" ? " jal" : "") }, gS);
    if (s.n === "Jalisco") s.n = "Jalisco (fuera del AMG)";
    p.style.setProperty("--o", t ? 0.25 + 0.75 * Math.sqrt(t / max) : 0);
    let b = null;
    if (t) {
      b = el("circle", { cx: s.c[0], cy: s.c[1], r: 5 + Math.sqrt(t) * 3.6, class: "cn__sb" }, gB);
    }
    const show = (e) => {
      const r = mx.parentElement.getBoundingClientRect();
      tip2.innerHTML = `<b>${s.n}</b>${t ? Object.entries(s.v).map(([k, v]) => `${k}: ${v}`).join("<br>") : "Sin puntos registrados"}`;
      tip2.hidden = false; tip2.style.left = Math.min(e.clientX - r.left + 14, r.width - 230) + "px"; tip2.style.top = (e.clientY - r.top + 14) + "px";
      p.classList.add("hov");
    };
    const hide = () => { tip2.hidden = true; p.classList.remove("hov"); };
    [p, b].filter(Boolean).forEach((n) => { n.addEventListener("pointerenter", show); n.addEventListener("pointerleave", hide); });
    return { s, t, p };
  });
  const list = states.filter((x) => x.t).sort((a, b) => b.t - a.t);
  document.getElementById("cnNatT").textContent = `${list.length} estados · ${fmt(list.reduce((a, b) => a + b.t, 0))} puntos`;
  document.getElementById("cnSt").innerHTML = list.slice(0, 10).map((x) => `<li><span>${x.s.n}</span><b>${x.t}</b><i style="--w:${(x.t / list[0].t) * 100}%"></i></li>`).join("");
  once(document.getElementById("cnNat"), () => mx.classList.add("in"), 0.2);

  /* ---------- e-commerce displays ---------- */
  const disp = document.getElementById("cnDisp");
  for (let i = 0; i < 72; i++) { const d = document.createElement("i"); if (i < 5) d.className = "ch"; else if (i < 7) d.className = "br"; d.style.transitionDelay = i * 14 + "ms"; disp.appendChild(d); }
  once(disp, () => disp.classList.add("in"));
  sec.querySelectorAll(".cn__huge[data-to]").forEach((n) => once(n, () => {
    const to = +n.dataset.to, t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / 1400); n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
})();
