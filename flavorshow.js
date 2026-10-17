// Flavour show: a poster per flavour over a giant pixel word; pixel blocks wipe in the next brand colour,
// the bar flips and the protein counter runs 00 → 22.
(() => {
  const sec = document.getElementById("presenta");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const R = "#D6161D", K = "#0C0B0A", C = "#F2EFE8", B = "#3A5CFF", L = "#C9F23A";
  const F = [
    { word: "COOKIES", name: "Cookies & Cream", img: "assets/fibo-cookies.webp", bg: R, fg: C, pc: K, pt: C },
    { word: "CHOCO", name: "Chocolate", img: "assets/fibo-chocolate.webp", bg: B, fg: C, pc: L, pt: K },
    { word: "FRUTOS", name: "Frutos rojos", img: "assets/fibo-frutos.webp", bg: C, fg: R, pc: K, pt: C },
    { word: "BROWNIE", name: "Brownie", img: "assets/fibo-brownie.webp", bg: L, fg: K, pc: C, pt: K },
  ];
  F.forEach((f) => { const im = new Image(); im.src = f.img; });

  const $ = (id) => document.getElementById(id);
  const pix = $("showPix"), wordC = $("showWord"), img = $("showImg"), name = $("showName"),
        num = $("showN"), ed = $("showEd"), count = $("showCount"), tabs = [...$("showTabs").children];
  const wctx = wordC.getContext("2d");
  let cur = 0, busy = false, spin = 0, timer = 0, visible = false;

  // Giant word drawn at low resolution and scaled up without smoothing → hard pixel letters.
  function drawWord(f, coarse) {
    const W = sec.clientWidth, H = sec.clientHeight;
    const cols = Math.round((W < 700 ? 60 : 110) / coarse), rows = Math.round(cols * H / W);
    wordC.width = cols; wordC.height = rows;
    wctx.clearRect(0, 0, cols, rows);
    let fs = rows * 0.55;
    wctx.font = `400 ${fs}px Anton`;
    fs = Math.min(fs, fs * cols * 0.94 / wctx.measureText(f.word).width);
    wctx.font = `400 ${fs}px Anton`;
    wctx.fillStyle = f.fg; wctx.globalAlpha = 0.6;
    wctx.textAlign = "center"; wctx.textBaseline = "middle";
    wctx.fillText(f.word, cols / 2, rows * 0.5);
  }
  function resolveWord(f) {
    if (reduced) return drawWord(f, 1);
    [6, 3, 2, 1].forEach((k, i) => setTimeout(() => drawWord(f, k), i * 90));
  }
  function countUp() {
    if (reduced) { count.textContent = "22"; return; }
    const t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / 900); count.textContent = String(Math.round(22 * k)).padStart(2, "0"); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  function buildPix() {
    const w = sec.clientWidth, cols = w < 600 ? 7 : w < 1000 ? 10 : 14, cell = w / cols, rows = Math.ceil(sec.clientHeight / cell);
    pix.style.setProperty("--cols", cols); pix.style.setProperty("--cell", cell + "px");
    pix.innerHTML = "";
    for (let i = 0; i < cols * rows; i++) {
      const c = document.createElement("i");
      c.style.setProperty("--d", Math.round(Math.random() * 280) + "ms");
      pix.appendChild(c);
    }
  }
  function paint(f, i) {
    for (const k of ["bg", "fg", "pc", "pt"]) sec.style.setProperty("--" + k, f[k]);
    name.textContent = f.name; num.textContent = i + 1; ed.textContent = "Sabor 0" + (i + 1);
    tabs.forEach((t, j) => t.classList.toggle("on", j === i));
    resolveWord(f); countUp();
  }
  function go(i) {
    i = (i + F.length) % F.length;
    if (busy || i === cur) return;
    busy = true;
    const f = F[i], dir = i > cur || (cur === 3 && i === 0) ? 1 : -1;
    cur = i;
    spin += 360 * dir;
    img.style.setProperty("--ry", spin + "deg");
    setTimeout(() => { img.src = f.img; img.alt = "Barra FIBO sabor " + f.name; }, reduced ? 0 : 230);
    pix.style.setProperty("--next", f.bg);
    const cells = [...pix.children];
    if (!reduced) cells.forEach((c) => c.classList.add("on"));
    setTimeout(() => {
      paint(f, i);
      cells.forEach((c) => c.classList.remove("on"));
      setTimeout(() => { busy = false; }, 450);
    }, reduced ? 0 : 580);
  }

  const auto = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => visible && go(cur + 1), 3800); };
  $("showNext").onclick = () => { go(cur + 1); auto(); };
  $("showPrev").onclick = () => { go(cur - 1); auto(); };
  tabs.forEach((t) => (t.onclick = () => { go(+t.dataset.i); auto(); }));
  let sx = 0;
  sec.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  sec.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { go(cur + (dx < 0 ? 1 : -1)); auto(); } }, { passive: true });
  let first = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && first) { first = false; resolveWord(F[cur]); countUp(); } }, { threshold: 0.4 }).observe(sec);

  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { buildPix(); drawWord(F[cur], 1); }, 200); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { buildPix(); paint(F[0], 0); auto(); });
})();
