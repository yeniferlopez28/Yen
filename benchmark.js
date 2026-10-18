// Product & price benchmark: floating numbered products on a grid, a $/10 g ruler and a moodboard of paged finding cards.
(() => {
  const sec = document.getElementById("benchmark");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // x / y in % of the stage, w in px, r rotation; tile = photo with background
  const O = [
    { n: "FIBO", img: "fibo-cookies", g: "22 g", p: "$19.55 por 10 g · fibo.mx", x: 39, y: 47, w: 300, r: -6, me: 1 },
    { n: "Evolution", img: "bm-evolution", g: "22 g", p: "$13.64 por 10 g · en paquete", x: 63, y: 34, w: 170, r: 6, warn: 1 },
    { n: "Clif Builder's", img: "bm-clif", g: "20 g", p: "Más barata por gramo que FIBO", x: 19, y: 72, w: 200, r: -4 },
    { n: "Wild Protein", img: "bm-wild", g: "15 g", p: "$36 la barra · $24 por 10 g", x: 80, y: 60, w: 150, r: 3, tile: 1 },
    { n: "7-Select", img: "bm-7select", g: "≈10 g", p: "≈$25 la barra en 7-Eleven", x: 5, y: 32, w: 120, r: -3, tile: 1 },
    { n: "Bimbo Proteína+", img: "bm-bimbo", g: "10 g", p: "Barata por pieza", x: 22, y: 36, w: 140, r: 5 },
    { n: "Barrinolas Proteína", img: "bm-barrinolas", g: "10 g", p: "La versión que sí compite", x: 89, y: 28, w: 92, r: 8 },
    { n: "Kirkland", txt: "Kirkland", g: "10 g", p: "Barata por pieza · masiva", x: 10, y: 58, r: -8 },
    { n: "Nature Valley", txt: "Nature Valley", g: "10 g", p: "Barata por pieza · masiva", x: 68, y: 84, r: 5 },
    { n: "Power Crunch", img: "bm-powercrunch-var", g: "13 g", p: "Corregido: tiene 13 g, no 10", x: 52, y: 72, w: 104, r: 7 },
    { n: "Quest", img: "bm-quest", g: "21 g", p: "Premium · $33–42 por 10 g", x: 33, y: 80, w: 160, r: -2 },
    { n: "Barebells", img: "bm-barebells", g: "20 g", p: "Premium · $33–42 por 10 g", x: 3, y: 74, w: 130, r: 4 },
    { n: "think!", img: "bm-think", g: "20 g", p: "Premium · $33–42 por 10 g", x: 66, y: 58, w: 86, r: -5, tile: 1 },
    { n: "Pure Protein", img: "bm-pure", g: "20 g", p: "Premium · $33–42 por 10 g", x: 77, y: 32, w: 100, r: -6 },
    { n: "David", img: "bm-david", g: "28 g", p: "Más de $45 por 10 g", x: 92, y: 66, w: 78, r: 10 },
    { n: "no cow", img: "bm-nocow", g: "20 g", p: "Más de $45 por 10 g", x: 29, y: 26, w: 150, r: -7 },
  ];
  const stage = document.getElementById("bmStage"), objs = document.getElementById("bmObjs"), tip = document.getElementById("bmTip"), caps = document.getElementById("bmCaps");
  const nn = (i) => String(i + 1).padStart(2, "0") + ".";
  const els = O.map((o, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "bm__obj" + (o.me ? " me" : "") + (o.warn ? " warn" : "") + (o.tile ? " tile" : "") + (o.txt ? " txt" : "");
    b.style.cssText = `--x:${o.x}%;--y:${o.y}%;--w:${o.w || 0}px;--r:${o.r}deg;--d:${(i % 5) * -1.3}s;--i:${i}`;
    b.innerHTML = (o.img ? `<img src="assets/${o.img}.webp" alt="">` : `<span class="lbl">${o.txt}</span>`) + `<span class="no mono">${nn(i)}</span>`;
    b.setAttribute("aria-label", `${o.n}, ${o.g}`);
    b.addEventListener("pointerenter", () => show(i));
    b.addEventListener("focus", () => show(i));
    b.addEventListener("click", () => show(i));
    objs.appendChild(b);
    return b;
  });
  caps.innerHTML = O.map((o, i) => `<button type="button" data-i="${i}">${nn(i)}${o.n.toUpperCase()} — ${o.g.toUpperCase()}</button>`).join("");
  const capEls = [...caps.children];
  capEls.forEach((c, i) => { c.addEventListener("pointerenter", () => show(i)); c.addEventListener("click", () => show(i)); });

  let cur = -1;
  function show(i) {
    if (i === cur) return;
    cur = i;
    const o = O[i];
    els.forEach((e, k) => e.classList.toggle("on", k === i));
    capEls.forEach((e, k) => e.classList.toggle("on", k === i));
    tip.querySelector("span").textContent = nn(i);
    tip.querySelector("b").textContent = o.n;
    tip.querySelector("em").textContent = o.g + " de proteína";
    tip.querySelector("small").textContent = o.p;
    const e = els[i], sr = stage.getBoundingClientRect(), r = e.getBoundingClientRect();
    let left = r.left - sr.left + r.width / 2, top = r.bottom - sr.top + 10;
    if (top > sr.height - 120) top = r.top - sr.top - 110;
    left = Math.max(110, Math.min(sr.width - 110, left));
    tip.style.left = left + "px"; tip.style.top = Math.max(8, top) + "px";
    tip.classList.add("on");
  }
  stage.addEventListener("pointerleave", () => { tip.classList.remove("on"); els.forEach((e) => e.classList.remove("on")); capEls.forEach((e) => e.classList.remove("on")); cur = -1; });

  // gentle parallax with the pointer
  if (!reduced) stage.addEventListener("pointermove", (ev) => {
    if (ev.pointerType !== "mouse") return;
    const r = stage.getBoundingClientRect(), dx = (ev.clientX - r.left) / r.width - 0.5, dy = (ev.clientY - r.top) / r.height - 0.5;
    stage.style.setProperty("--px", dx.toFixed(3)); stage.style.setProperty("--py", dy.toFixed(3));
  });

  // live Guadalajara time, like the reference's "local time"
  const clock = document.getElementById("bmClock");
  const tick = () => { clock.textContent = new Date().toLocaleTimeString("es-MX", { timeZone: "America/Mexico_City", hour: "2-digit", minute: "2-digit" }); };
  tick(); setInterval(tick, 20000);

  // ruler: FIBO travels through its four channels
  const C = [["fibo.mx", "$19.55", 23.9], ["Nutrisa", "$20–22", 27.5], ["7-Eleven", "$23", 32.95], ["Amazon", "$28", 45]];
  const puck = document.getElementById("bmPuck"), ch = document.getElementById("bmCh"), val = document.getElementById("bmVal"), rule = document.getElementById("bmRule");
  let ci = 0, timer = 0;
  const step = () => {
    const c = C[ci];
    puck.style.left = c[2] + "%"; ch.textContent = c[0]; val.textContent = c[1];
    rule.classList.toggle("hot", ci === 3);
    ci = (ci + 1) % C.length;
  };
  step();

  // finding cards: paged slides + "ver más"
  sec.querySelectorAll(".bm__card").forEach((card) => {
    const sl = [...card.querySelectorAll(".sl")], pg = card.querySelector(".pg");
    let k = 0;
    const go = (d) => {
      k = (k + d + sl.length) % sl.length;
      sl.forEach((s, j) => s.classList.toggle("on", j === k));
      pg.textContent = `${k + 1} / ${sl.length}`;
    };
    card.querySelector(".bk").addEventListener("click", () => go(-1));
    card.querySelector(".fw").addEventListener("click", () => go(1));
    card.querySelector(".bm__slides").addEventListener("click", () => go(1));
    const sm = card.querySelector(".sm");
    sm.addEventListener("click", () => { const o = card.classList.toggle("open"); sm.textContent = o ? "Ver menos" : "Ver más"; });
    go(0);
  });

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target === rule && !reduced && !timer) timer = setInterval(step, 2200);
    io.unobserve(e.target);
  }), { threshold: 0.2 });
  sec.querySelectorAll(".bm__stage, .bm__method, .bm__rule, .bm__card").forEach((n) => io.observe(n));
})();
