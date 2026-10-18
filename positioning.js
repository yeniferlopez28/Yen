// Positioning benchmark: notebook on a studded Guadalajara background, a stories feed of competitor profiles with a hanging ticket, FIBO's unfinished profile and the free territory.
(() => {
  const sec = document.getElementById("posicionamiento");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // studded background: a pixelated Guadalajara photo drawn as round studs
  const cv = document.getElementById("poStuds"), hero = document.getElementById("poHero");
  const photo = new Image();
  photo.src = "assets/oc-metropolitano.webp";
  const drawStuds = () => {
    if (!photo.complete || !photo.naturalWidth) return;
    const r = hero.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    const S = r.width < 700 ? 16 : 22, cols = Math.ceil(r.width / S), rows = Math.ceil(r.height / S);
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    const ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const t = document.createElement("canvas"); t.width = cols; t.height = rows;
    const tc = t.getContext("2d"), ar = photo.naturalWidth / photo.naturalHeight, tr = cols / rows;
    let sw = photo.naturalWidth, sh = photo.naturalHeight, sx = 0, sy = 0;
    if (ar > tr) { sw = sh * tr; sx = (photo.naturalWidth - sw) / 2; } else { sh = sw / tr; sy = (photo.naturalHeight - sh) / 2; }
    tc.drawImage(photo, sx, sy, sw, sh, 0, 0, cols, rows);
    const px = tc.getImageData(0, 0, cols, rows).data;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4, cr = px[i], cg = px[i + 1], cb = px[i + 2];
      const mix = (v) => Math.round(v * 0.7 + 255 * 0.3); // lighten like the reference
      const cx = x * S + S / 2, cy = y * S + S / 2;
      ctx.fillStyle = `rgb(${mix(cr) - 18},${mix(cg) - 18},${mix(cb) - 18})`; ctx.fillRect(x * S, y * S, S, S);
      const g = ctx.createRadialGradient(cx - S * 0.15, cy - S * 0.18, 1, cx, cy, S * 0.46);
      g.addColorStop(0, "rgba(255,255,255,.75)"); g.addColorStop(0.35, `rgb(${mix(cr)},${mix(cg)},${mix(cb)})`); g.addColorStop(1, `rgb(${mix(cr) - 30},${mix(cg) - 30},${mix(cb) - 30})`);
      ctx.beginPath(); ctx.arc(cx, cy, S * 0.4, 0, 7); ctx.fillStyle = g; ctx.fill();
    }
  };
  photo.onload = drawStuds;
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(drawStuds, 200); });

  const B = [
    { n: "Wild Protein", img: "bm-wild", c: "#FF6B1A", role: "Competidor directo en el anaquel de conveniencia", terr: "«Sin sellos» y disfrute", own: "Wild Protein es dueña del «sin sellos» y del disfrute.",
      aud: "Jóvenes activos que quieren comer mejor sin dejar el sabor", prom: "Comer saludable que se disfruta.", ben: ["15 g de proteína", "Sin sellos", "Sin azúcar añadida"],
      pers: "Rebelde y cercana", vis: "Colores intensos", tone: "Irreverente", dif: "El «sin sellos»", proof: "Su propia etiqueta",
      alert: "Dato a corregir: no es mexicana. Es chilena y recibió 25 millones de dólares de un fondo mexicano para crecer en el país." },
    { n: "Barebells", img: "bm-barebells", c: "#8CC8E0", dark: 1, role: "Construyó todo su éxito sobre el sabor", terr: "Sabor", own: "Barebells es dueña del sabor.",
      aud: "El antojo, antes que la proteína", prom: "El gran sabor va primero. Siempre.", ben: ["Sabor", "Nombres indulgentes", "Look de chocolate premium"],
      pers: "Indulgente", vis: "Empaques limpios, de chocolate premium", tone: "De antojo", dif: "El sabor", proof: "Su crecimiento: de las marcas de más rápido crecimiento en EE. UU. en 2025" },
    { n: "Quest", img: "bm-quest", c: "#C79A63", role: "La marca de la ciencia nutricional", terr: "Ciencia", own: "Quest es dueña de la ciencia.",
      aud: "El mundo fitness", prom: "Que lo que se te antoja trabaje a tu favor.", ben: ["Mucha proteína", "Mucha fibra", "Casi nada de azúcar"],
      pers: "Experta", vis: "Los números de la etiqueta", tone: "Experto y motivador", dif: "Los números de su etiqueta", proof: "Un gran corporativo y miles de reseñas" },
    { n: "Zebra REALBAR", img: "po-zebra", c: "#7A4A35", role: "La marca de la etiqueta limpia", terr: "Ingredientes reales", own: "Zebra es dueña de los ingredientes reales.",
      aud: "Quien busca ingredientes que reconoce", prom: "Simple, esencial, real.", ben: ["Pocos ingredientes", "Cero sellos", "Sin azúcares añadidos"],
      pers: "Natural", vis: "Natural y minimalista", tone: "Simple", dif: "Ingredientes reconocibles", proof: "Cero sellos en su etiqueta",
      alert: "Punto débil: la proteína, con 14 g." },
    { n: "Barrinolas", img: "bm-barrinolas", c: "#E0662A", role: "Compite por precio y familiaridad", terr: "Precio masivo", own: "Barrinolas comparte con Bimbo el precio masivo.",
      aud: "La familia mexicana", prom: "Familiar y accesible: 10 g por unos $16.", ben: ["10 g de proteína", "≈$16", "OXXO · Walmart · Amazon"],
      pers: "Cálida y familiar", vis: "Mexicana y familiar", tone: "Cálido", dif: "Precio y presencia", proof: "Está en todos lados",
      alert: "Su credibilidad tiene una grieta: Profeco encontró diferencias entre lo que declaran y lo que contienen algunos productos." },
    { n: "Bimbo Proteína+", img: "bm-bimbo", c: "#2DB34A", role: "Apuesta por la distribución masiva", terr: "Precio masivo", own: "Bimbo comparte con Barrinolas el precio masivo.",
      aud: "Millennials y centennials que buscan snacks prácticos", prom: "Proteína práctica, de la marca que todos conocen.", ben: ["10 g de proteína", "Snack práctico", "Marca conocida"],
      pers: "Conocida y confiable", vis: "De marca masiva", tone: "Práctico", dif: "La distribución", proof: "La confianza de Bimbo",
      alert: "Su reto, según los analistas: ganar credibilidad en una categoría donde el consumidor valora la autenticidad." },
    { n: "Evolution", img: "bm-evolution", c: "#C4122F", role: "El gemelo de FIBO", terr: "Rendimiento deportivo", own: "Evolution es dueña del rendimiento deportivo.",
      aud: "Deportistas", prom: "Barra «sin azúcar de caña».", ben: ["22 g de proteína", "Barra de 65 g", "Sin azúcar de caña"],
      pers: "Deportiva", vis: "Suplemento deportivo", tone: "Deportivo", dif: "El mismo producto que FIBO, más barato", proof: "Su línea de proteína en polvo",
      alert: "Mismo producto que FIBO, a menor precio. Por eso FIBO no tiene un diferenciador exclusivo." },
  ];

  const stories = document.getElementById("poStories"), bars = document.getElementById("poBars");
  stories.innerHTML = B.map((b, i) => `<button type="button" role="tab" style="--c:${b.c}" data-i="${i}"><span><img src="assets/${b.img}.webp" alt=""></span><small>${b.n}</small></button>`).join("");
  bars.innerHTML = B.map(() => "<i><b></b></i>").join("");
  const st = [...stories.children], br = [...bars.children];
  const tk = document.getElementById("poTicket"), pf = document.getElementById("poProf"), feed = document.getElementById("poFeed");
  const q = (r, s) => r.querySelector(s);
  const DUR = 6500;
  let cur = 0, timer = 0, playing = false;

  function show(i) {
    cur = (i + B.length) % B.length;
    const b = B[cur];
    st.forEach((s, k) => { s.classList.toggle("on", k === cur); s.classList.toggle("seen", k < cur); });
    br.forEach((x, k) => { x.className = k < cur ? "done" : k === cur ? "run" : ""; });
    feed.style.setProperty("--bc", b.c);
    feed.classList.toggle("lt", !!b.dark);
    q(tk, ".tk__brand").textContent = b.n; q(tk, ".tk__pill").textContent = "Benchmark 2026";
    q(tk, ".tk__logo").src = `assets/${b.img}.webp`; q(tk, ".tk__img").src = `assets/${b.img}.webp`;
    q(tk, ".tk__aud").textContent = b.aud; q(tk, ".tk__tone").textContent = b.tone;
    q(tk, ".tk__prom").textContent = b.prom; q(tk, ".tk__terr").textContent = b.terr;
    q(tk, ".tk__pers").textContent = b.pers; q(tk, ".tk__vis").textContent = b.vis;
    q(pf, ".pr__s").textContent = b.own; q(pf, ".pr__role").textContent = b.role;
    q(pf, ".pr__chips").innerHTML = b.ben.map((x) => `<span>${x}</span>`).join("");
    q(pf, ".pr__btn span").textContent = b.dif; q(pf, ".pr__proof span").textContent = b.proof;
    const al = q(pf, ".pr__alert"); al.hidden = !b.alert; q(al, "span").textContent = b.alert || "";
    document.getElementById("poCount").textContent = `${cur + 1} / ${B.length}`;
    [tk, pf].forEach((n) => { n.classList.remove("swap"); void n.offsetWidth; n.classList.add("swap"); });
    if (playing) { clearTimeout(timer); timer = setTimeout(() => show(cur + 1), DUR); }
  }
  st.forEach((s, i) => s.addEventListener("click", () => show(i)));
  document.getElementById("poPrev").addEventListener("click", () => show(cur - 1));
  document.getElementById("poNext").addEventListener("click", () => show(cur + 1));
  // hold to pause, like stories
  const scr = q(feed, ".po__screen");
  scr.addEventListener("pointerenter", () => { if (!playing) return; clearTimeout(timer); feed.classList.add("paused"); });
  scr.addEventListener("pointerleave", () => { if (!playing) return; feed.classList.remove("paused"); show(cur); });
  feed.style.setProperty("--dur", DUR + "ms");
  show(0);

  const clock = document.getElementById("poClock");
  const tick = () => { clock.textContent = new Date().toLocaleTimeString("es-MX", { timeZone: "America/Mexico_City", hour: "numeric", minute: "2-digit", hour12: false }); };
  tick(); setInterval(tick, 20000);

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target === feed && !reduced) { playing = true; show(cur); }
    io.unobserve(e.target);
  }), { threshold: 0.25 });
  sec.querySelectorAll(".po__hero, .po__feed, .po__me, .po__terr, .po__free").forEach((n) => io.observe(n));
})();
