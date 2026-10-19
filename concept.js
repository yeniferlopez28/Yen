// Brand concept: magazine-style spread — pixelated contents title, literal/emotional encounter grid, numbered glossary of content territories.
(() => {
  const sec = document.getElementById("concepto");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;

  /* pixelated title: text drawn small, scaled up without smoothing; resolution sharpens on enter */
  const cv = document.getElementById("crPx"), cx = cv.getContext("2d");
  const off = document.createElement("canvas"), ox = off.getContext("2d");
  let cell = reduced ? 5 : 26, target = 5;
  const INK = "#F2EFE8", HI = "#C9F23A";
  const draw = () => {
    const W = cv.clientWidth; if (!W) return;
    const two = W < 760, dpr = Math.min(2, devicePixelRatio || 1);
    const lines = two ? ["Con FIBO", "te encuentras"] : ["Con FIBO te encuentras"];
    const H = Math.round(W * (two ? 0.42 : 0.13));
    cv.style.height = H + "px"; cv.width = W * dpr; cv.height = H * dpr;
    const c = Math.max(2, cell * (two ? 0.6 : 1)), w = Math.ceil(W / c), h = Math.ceil(H / c);
    off.width = w; off.height = h;
    ox.clearRect(0, 0, w, h); ox.textBaseline = "alphabetic";
    const fs = h / lines.length * 0.86;
    ox.font = `700 ${fs}px "Space Grotesk", sans-serif`;
    const k = Math.min(1, w * 0.99 / Math.max(...lines.map((l) => ox.measureText(l).width)));
    ox.font = `700 ${fs * k}px "Space Grotesk", sans-serif`;
    lines.forEach((l, i) => {
      let x = 0; const y = (h / lines.length) * (i + 0.78);
      l.split(/(FIBO)/).forEach((p) => { ox.fillStyle = p === "FIBO" ? HI : INK; ox.fillText(p, x, y); x += ox.measureText(p).width; });
    });
    cx.imageSmoothingEnabled = false; cx.clearRect(0, 0, cv.width, cv.height);
    cx.drawImage(off, 0, 0, w * c * dpr, h * c * dpr);
  };
  const sharpen = () => { if (cell <= target) return draw(); cell = Math.max(target, cell - 1.4); draw(); setTimeout(sharpen, 55); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(draw);
  addEventListener("resize", draw);

  /* literal / emotional encounter grid */
  const I = {
    store: "M3 9l2-5h14l2 5M4 9h16v11H4zM9 14h6", cup: "M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v2M11 3v2",
    gym: "M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12", bike: "M6 17a3 3 0 1 0 0-.1M18 17a3 3 0 1 0 0-.1M6 17l4-8h5l3 8M10 9l-1-3H7M15 9l1-3h2",
    book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7", bus: "M5 4h14v12H5zM5 11h14M8 19v-3M16 19v-3M8 14h.01M16 14h.01",
  };
  const L = [
    { k: "l", t: "7-Eleven", s: "La tienda de la esquina", i: I.store }, { k: "l", t: "Cafetería", s: "La de la universidad", i: I.cup },
    { k: "l", t: "Gimnasio", s: "Antes o después de entrenar", i: I.gym }, { k: "e", t: "Contigo", s: "Una pausa para ti", img: "cr-calma" },
    { k: "l", t: "Vía RecreActiva", s: "Domingo en bici", i: I.bike }, { k: "e", t: "Tus momentos", s: "Lo que te gusta hacer", img: "cr-yoga" },
    { k: "l", t: "Entre clases", s: "CUCEA, ITESO, UdG", i: I.book }, { k: "e", t: "Tu gente", s: "Los de siempre", img: "cr-office" },
    { k: "l", t: "En el camino", s: "Macrobús, Mi Tren", i: I.bus },
  ];
  const CAP = { l: "<b>Literal:</b> FIBO está en tu camino, en los lugares por donde ya pasas.", e: "<b>Emocional:</b> con FIBO te encuentras contigo, con tus momentos y con tu gente." };
  const lg = document.getElementById("crLg"), lcap = document.getElementById("crLcap");
  lg.innerHTML = L.map((x, n) => `<div class="cr__lc ${x.k}${x.img ? " ph" : ""}" style="--d:${n * 0.07}s"><span class="n mono">${String(n + 1).padStart(2, "0")}</span>${x.img ? `<img src="assets/${x.img}.webp" alt="">` : ic(x.i)}<b>${x.t}</b><small>${x.s}</small></div>`).join("");
  const tg = [...document.querySelectorAll("#crTg button")];
  let mode = "l", tt = 0;
  const set = (m) => { mode = m; tg.forEach((b) => b.classList.toggle("on", b.dataset.k === m)); lg.dataset.k = m; lcap.innerHTML = CAP[m]; };
  tg.forEach((b) => b.addEventListener("click", () => { clearInterval(tt); set(b.dataset.k); }));
  set("l");

  /* why it works */
  const W = [
    ["Del gimnasio a la vida diaria", "Saca a FIBO del suplemento y la lleva a la clase, la oficina y la calle."],
    ["Ocasiones de tránsito", "Responde a cuando más se come una barra: en el camino, entre una cosa y otra."],
    ["Un territorio libre", "Ninguna competidora habla de encontrarse. Es un lugar que FIBO puede ocupar sola."],
    ["Refleja la personalidad", "Curiosa, cercana y tapatía: la frase suena a como habla FIBO."],
  ];
  document.getElementById("crWhy").innerHTML = W.map((w, i) => `<div class="cr__w" style="--d:${i * 0.12}s"><b class="mono">0${i + 1}</b><h4>${w[0]}</h4><p>${w[1]}</p></div>`).join("");

  /* glossary of territories on a numbered grid */
  const T = [
    ["Moverse", "Correr en el Parque Metropolitano, el pádel, la Vía RecreActiva.", "cr-correr", 1, 1],
    ["Descubrir", "Un domingo en el Bosque La Primavera, una calle nueva en Santa Tere.", "cr-cerro", 4, 1],
    ["La música", "Conciertos en el Auditorio Telmex y el C3 Stage.", "pe-concierto", 7, 1],
    ["Comer", "La sobremesa con amigas, las tortas ahogadas, el antojo de la tarde.", "cr-mesa", 2, 3],
    ["Su gente", "La oficina, el grupo de la uni, los de siempre.", "cr-office", 5, 3],
    ["La cultura", "Charrería, mariachi y el Hospicio Cabañas.", "pe-charro", 7, 4],
    ["La ciudad", "Chapultepec, los patios del Centro, Tlaquepaque.", "pe-patio", 1, 5],
    ["De todo", "Yoga en la sala, una pausa en el pasto: lo que se te ocurra.", "cr-yoga", 4, 5],
  ];
  const gl = document.getElementById("crGl");
  let cells = "";
  for (let r = 1; r <= 6; r++) for (let c = 1; c <= 8; c++) cells += `<i style="grid-area:${r}/${c}"><span class="mono">${String((r - 1) * 8 + c).padStart(2, "0")}</span></i>`;
  gl.innerHTML = cells + T.map((t, i) => `<figure class="cr__e" style="--c:${t[3]};--r:${t[4]};--d:${i * 0.1}s"><figcaption><b>${t[0]}</b><span>${t[1]}</span></figcaption><img src="assets/${t[2]}.webp" alt="${t[0]}"></figure>`).join("");

  /* IMPI countdown */
  const days = Math.ceil((new Date("2026-10-30T23:59:00-06:00") - Date.now()) / 864e5);
  document.getElementById("crCd").textContent = days > 0 ? `Faltan ${days} días` : days === 0 ? "Hoy" : "Vencido · revisar";

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.id === "crToc") sharpen();
    if (e.target.id === "crLect" && !reduced) tt = setInterval(() => set(mode === "l" ? "e" : "l"), 4200);
    io.unobserve(e.target);
  }), { threshold: 0.2 });
  sec.querySelectorAll(".cr__toc, .cr__spread, .cr__why, .cr__pair, .cr__ter, .cr__end").forEach((n) => io.observe(n));
})();
