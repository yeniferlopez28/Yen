// E-commerce store mock: typing search, result sorting, listing before/after, pack waterfall calculator, reveals.
(() => {
  const root = document.getElementById("ecommerce");
  if (!root) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (v) => "$" + Math.round(v).toLocaleString("es-MX");

  // typing search
  const q = document.getElementById("mpQ"), Q = ["barra de proteína", "barras de proteína caja", "barra de proteína brownie", "fibo 22 g"];
  if (!reduced && q) { let i = 0, n = Q[0].length, del = true;
    setInterval(() => { const s = Q[i]; if (del) { n--; if (n <= 0) { del = false; i = (i + 1) % Q.length; } } else { n++; if (n >= Q[i].length + 14) del = true; } q.textContent = Q[i].slice(0, Math.max(0, Math.min(n, Q[i].length))); }, 70); }

  // sort results
  const list = document.getElementById("mpList"), sb = [...root.querySelectorAll(".mp__sort button")];
  const sort = (k) => [...list.children].sort((a, b) => +a.dataset[k] - +b.dataset[k]).forEach((li) => list.appendChild(li));
  sb.forEach((b) => b.addEventListener("click", () => { sb.forEach((x) => x.classList.toggle("on", x === b)); sort(b.dataset.s); }));
  sort("g");

  // listing toggle
  const card = root.querySelector(".mp__card"), tg = [...root.querySelectorAll(".mp__tg button")];
  tg.forEach((b) => b.addEventListener("click", () => { tg.forEach((x) => x.classList.toggle("on", x === b)); card.dataset.v = b.dataset.v; }));

  // pack waterfall
  const D = JSON.parse(document.getElementById("mpD").textContent), wf = document.getElementById("mpWf");
  const oc = document.getElementById("mpC"), ob = document.getElementById("mpB"), oa = document.getElementById("mpA"), fl = document.getElementById("mpFlag");
  const pls = [...root.querySelectorAll("[data-pl]")], pks = [...root.querySelectorAll("[data-pk]")];
  let pl = "amz", pk = "12";
  const draw = () => {
    const P = D[pl].p; if (!P[pk]) pk = Object.keys(P).includes("12") ? "12" : Object.keys(P)[0];
    pks.forEach((b) => { b.disabled = !P[b.dataset.pk]; b.classList.toggle("on", b.dataset.pk === pk); });
    pls.forEach((b) => b.classList.toggle("on", b.dataset.pl === pl));
    const [p, prod, com, log, acos] = P[pk], c = p - prod - com - log;
    const rows = [["Precio", p, 0, "p"], ["Producto", prod, p - prod, "m"], ["Comisión y cargos", com, p - prod - com, "m"], ["Envío y preparación", log, c, "m"], ["Te queda", c, 0, "c"]];
    wf.innerHTML = rows.map(([n, v, off, t]) => `<div class="mp__wr mp__wr--${t}"><span>${n}</span><i style="--l:${(off / p * 100).toFixed(1)}%;--w:${(v / p * 100).toFixed(1)}%"></i><b>${t === "m" ? "−" : ""}${$(v)}</b></div>`).join("");
    oc.textContent = $(c) + ` · ${Math.round((c / p) * 100)}%`; ob.textContent = "$" + (c / +pk).toFixed(2);
    oa.textContent = acos ? `${acos}%` : "no pautar";
    fl.textContent = pl === "amz" && pk === "24" ? "Arriba de $499, Amazon cobra 15% y $67+ de envío: aquí no conviene la de 24." : pl === "web" ? "El envío nacional se come el margen: fibo.mx para mayoreo, oficinas y envío en GDL." : pl === "ml" && pk === "6" ? "Sin anuncios: el cargo fijo de $37 deja poco margen." : pl === "amz" && pk === "12" ? "La estrella: queda justo debajo del salto de $499." : "";
    wf.classList.remove("go"); void wf.offsetWidth; wf.classList.add("go");
  };
  pls.forEach((b) => b.addEventListener("click", () => { pl = b.dataset.pl; draw(); }));
  pks.forEach((b) => b.addEventListener("click", () => { pk = b.dataset.pk; draw(); }));
  draw();

  if (reduced || !("IntersectionObserver" in window)) return;
  root.classList.add("mp--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  root.querySelectorAll(".mp__res, .mp__pdp, .mp__pack, .mp__gal, .mp__ads, .mp__track, .mp__end").forEach((el) => io.observe(el));
})();
