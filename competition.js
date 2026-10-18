// Competitive landscape: a dock of groups that fan out their products, and a dotted protein-vs-price map with photo pins.
(() => {
  const sec = document.getElementById("competencia");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const G = [
    { t: "Barras premium", m: "Quest · Barebells · Pure Protein · casi todas importadas", d: "20 g de proteína o más, entre $55 y más de $80. Marcas reconocidas y miles de reseñas.", v: "FIBO gana en precio por gramo · pierde en reputación" },
    { t: "Opciones accesibles", m: "7-Select · Bimbo Proteína+ · Barrinolas · Wild Protein", d: "Dominan el anaquel de conveniencia. Cuestan entre $15 y $37, pero tienen entre 10 y 15 g de proteína.", v: "FIBO tiene más proteína · cuesta más" },
    { t: "Marcas deportivas", m: "Suplementos en polvo · bebidas de proteína", d: "Compiten sobre todo en el gimnasio.", v: "La barra le gana al batido en practicidad" },
    { t: "Snacks funcionales", m: "Zebra REALBAR · Nature Valley", d: "Compiten por la etiqueta: ingredientes naturales y, en algunos casos, sin sellos.", v: "Un terreno donde FIBO no puede competir" },
    { t: "Productos sustitutos", m: "Yogur alto en proteína · bebidas · pan dulce · galletas · botanas", d: "Oikos Pro: 18 g en 300 ml. Bimbo lanzó tortillas con proteína y el yogur alto en proteína de Danone creció 236% en un año.", v: "La proteína ya no es exclusiva de las barras" },
  ];
  const dock = [...sec.querySelectorAll(".cp__icons button")], card = document.getElementById("cpCard");
  const showG = (i) => {
    dock.forEach((b, k) => b.classList.toggle("on", k === i));
    const g = G[i];
    card.querySelector("h3").textContent = g.t; card.querySelector(".cp__meta").textContent = g.m;
    card.querySelector(".cp__desc").textContent = g.d; card.querySelector(".cp__vs").textContent = g.v;
    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
  };
  dock.forEach((b, i) => { b.addEventListener("click", () => showG(i)); b.addEventListener("pointerenter", () => showG(i)); });
  showG(0);

  // map: x = price 10–95 MXN, y = protein 0–25 g
  const P = [
    { n: "FIBO", img: "fibo-cookies", x: 50, y: 22, me: 1, d: "22 g de proteína a precio medio: un espacio que nadie más ocupa en el anaquel de conveniencia.", s: "≈$50 · 22 g" },
    { n: "Evolution", txt: "EV", x: 43, y: 22, warn: 1, d: "Barra mexicana con 65 g y 22 g de proteína, como FIBO, pero más barata. Ocupa exactamente el mismo lugar.", s: "más barata · 22 g" },
    { n: "Quest", img: "cat-quest", x: 82, y: 21, d: "Premium importada, con más de 13 mil reseñas en una sola barra en Amazon.", s: "$55–80+ · 20 g+" },
    { n: "Barebells", img: "cat-barebells", x: 72, y: 20, d: "Premium importada que construyó su éxito sobre el sabor.", s: "$55–80+ · 20 g+" },
    { n: "Pure Protein", txt: "PP", x: 62, y: 20.5, d: "Premium importada.", s: "$55–80+ · 20 g+" },
    { n: "Wild Protein", img: "cat-wild-box", x: 35, y: 15, d: "La más visible en conveniencia, con material propio y «sin sellos».", s: "≈$35 · 15 g" },
    { n: "7-Select", txt: "7", x: 25, y: 10, d: "La marca propia de 7-Eleven, a la mitad del precio de FIBO.", s: "≈$25 · 10 g" },
    { n: "Bimbo Proteína+", img: "cat-bimbo", x: 30, y: 10.6, d: "Lanzada en abril de 2026, con distribución nacional.", s: "accesible · ≈10 g" },
    { n: "Barrinolas", img: "cat-barrinolas", x: 15, y: 3.3, d: "Presente en OXXO. Su barra de avena tiene 3.3 g de proteína.", s: "accesible · 3.3 g" },
  ];
  const pins = document.getElementById("cpPins"), info = document.getElementById("cpInfo");
  const pos = (p) => ({ left: ((p.x - 10) / 85) * 100, top: 100 - (p.y / 25) * 100 });
  const els = P.map((p, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "cp__pin" + (p.me ? " me" : "") + (p.warn ? " warn" : "");
    const q = pos(p); b.style.left = q.left + "%"; b.style.top = q.top + "%"; b.style.transitionDelay = i * 90 + "ms";
    b.innerHTML = (p.img ? `<img src="assets/${p.img}.webp" alt="">` : `<b>${p.txt}</b>`) + `<em class="mono">${p.n}</em>`;
    b.setAttribute("aria-label", p.n);
    b.addEventListener("click", () => sel(i)); b.addEventListener("pointerenter", () => sel(i));
    pins.appendChild(b); return b;
  });
  function sel(i) {
    const p = P[i]; els.forEach((e, k) => e.classList.toggle("on", k === i));
    info.querySelector("h3").textContent = p.n; info.querySelector("p").textContent = p.d; info.querySelector("span").textContent = p.s;
  }
  sel(0);
  // after 1 s, show the Amazon risk: FIBO drifts toward premium price
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.25 });
  sec.querySelectorAll(".cp__dock, .cp__map, .cp__levels, .cp__threats, .cp__end").forEach((n) => io.observe(n));

  // dotted background
  const dots = sec.querySelector(".cp__dots");
  if (!reduced) dots.style.animation = "cpDrift 30s linear infinite";
})();
