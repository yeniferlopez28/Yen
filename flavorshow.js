// Flavour show: one flavour per screen; a pixel-block wipe changes the colour while the bar spins 360°.
(() => {
  const sec = document.getElementById("presenta");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const F = [
    { word: "Cookies", name: "Cookies & Cream", img: "assets/fibo-cookies.webp", bg: "#D6B787", fg: "#0C0B0A", dots: ["#0C0B0A", "#F2EFE8", "#8a6a3d"] },
    { word: "Chocolate", name: "Chocolate", img: "assets/fibo-chocolate.webp", bg: "#F2D31B", fg: "#0C0B0A", dots: ["#0C0B0A", "#5a3418", "#F2EFE8"] },
    { word: "Frutos", name: "Frutos rojos", img: "assets/fibo-frutos.webp", bg: "#D6161D", fg: "#F2EFE8", dots: ["#F2EFE8", "#0C0B0A", "#ff6b8a"] },
    { word: "Brownie", name: "Brownie", img: "assets/fibo-brownie.webp", bg: "#4E2275", fg: "#F2EFE8", dots: ["#C9F23A", "#F2EFE8", "#0C0B0A"] },
  ];
  F.forEach((f) => { const im = new Image(); im.src = f.img; }); // preload

  const $ = (id) => document.getElementById(id);
  const pix = $("showPix"), float = $("showFloat"), word = $("showWord"), img = $("showImg"),
        name = $("showName"), num = $("showN"), tabs = [...$("showTabs").children];
  let cur = 0, busy = false, spin = 0, timer = 0, visible = false;

  function buildPix() {
    const w = sec.clientWidth, cols = w < 600 ? 6 : w < 1000 ? 9 : 12, cell = w / cols, rows = Math.ceil(sec.clientHeight / cell);
    pix.style.setProperty("--cols", cols); pix.style.setProperty("--cell", cell + "px");
    pix.innerHTML = "";
    for (let i = 0; i < cols * rows; i++) {
      const c = document.createElement("i");
      c.style.setProperty("--d", Math.round(Math.random() * 260) + "ms");
      pix.appendChild(c);
    }
  }
  function floaters(f) {
    float.innerHTML = Array.from({ length: 10 }, (_, i) => {
      const x = Math.random() * 94, y = 6 + Math.random() * 56, s = 14 + Math.random() * 38;
      return `<span style="left:${x}%;top:${y}%;--s:${s}px;--c:${f.dots[i % 3]};--t:${5 + Math.random() * 4}s;--dl:${-Math.random() * 5}s;--dx:${(Math.random() - .5) * 40}px;--dy:${-10 - Math.random() * 30}px;--r:${(Math.random() - .5) * 60}deg"></span>`;
    }).join("");
  }
  function paint(f, i) {
    sec.style.setProperty("--bg", f.bg); sec.style.setProperty("--fg", f.fg);
    word.textContent = f.word; name.textContent = f.name;
    num.textContent = String(i + 1).padStart(2, "0");
    tabs.forEach((t, j) => t.classList.toggle("on", j === i));
    floaters(f);
  }

  function go(i) {
    i = (i + F.length) % F.length;
    if (busy || i === cur) return;
    busy = true;
    const f = F[i], dir = i > cur || (cur === 3 && i === 0) ? 1 : -1;
    cur = i;
    // 1. spin the bar; swap the photo when it's edge-on
    spin += 360 * dir;
    img.parentElement.style.setProperty("--ry", spin + "deg");
    img.style.setProperty("--ry", spin + "deg");
    setTimeout(() => { img.src = f.img; img.alt = "Barra FIBO sabor " + f.name; }, reduced ? 0 : 230);
    // 2. pixel wipe in the new colour
    word.classList.add("out");
    pix.style.setProperty("--next", f.bg);
    const cells = [...pix.children];
    if (!reduced) cells.forEach((c) => c.classList.add("on"));
    setTimeout(() => {
      paint(f, i);
      word.classList.remove("out");
      cells.forEach((c) => c.classList.remove("on"));
      setTimeout(() => { busy = false; }, 450);
    }, reduced ? 0 : 560);
  }
  // the image transform lives on the img; mirror --ry there
  img.style.transform = "";

  const auto = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => visible && go(cur + 1), 3600); };
  $("showNext").onclick = () => { go(cur + 1); auto(); };
  $("showPrev").onclick = () => { go(cur - 1); auto(); };
  tabs.forEach((t) => (t.onclick = () => { go(+t.dataset.i); auto(); }));
  let sx = 0;
  sec.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  sec.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { go(cur + (dx < 0 ? 1 : -1)); auto(); } }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 }).observe(sec);

  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildPix, 200); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { buildPix(); paint(F[0], 0); auto(); });
})();
