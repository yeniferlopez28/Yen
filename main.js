(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rand = (a, b) => a + Math.random() * (b - a);

  // Run cb once when el scrolls into view.
  const onView = (el, cb, threshold = 0.3) => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { cb(); io.disconnect(); }
    }, { threshold });
    io.observe(el);
  };

  const countUp = (el, to, ms = 1400) => {
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ============ CURSOR ============ */
  const cursor = document.getElementById("cursor");
  addEventListener("pointermove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    const big = e.target.closest("a, button, .row, input, select");
    cursor.style.width = cursor.style.height = big ? "34px" : "14px";
  });

  /* ============ HERO PIXEL GRID ============ */
  const hero = document.querySelector(".hero");
  const grid = document.getElementById("heroGrid");
  let cells = [], allowed = [];

  function buildHero() {
    const w = hero.clientWidth, h = hero.clientHeight;
    const cols = w < 600 ? 6 : w < 1000 ? 9 : 12;
    const cell = w / cols;
    const rows = Math.ceil(h / cell);
    grid.style.setProperty("--cols", cols);
    grid.style.setProperty("--cell", cell + "px");
    grid.innerHTML = "";
    cells = [];

    // Cells that overlap the text stay empty so copy is always legible.
    const hr = hero.getBoundingClientRect();
    const blockers = [...hero.querySelectorAll(".hero__copy, .hero__title span, .hero__cta, .label, .hero__product")]
      .map((el) => el.getBoundingClientRect())
      .map((r) => ({ l: r.left - hr.left - 8, t: r.top - hr.top - 8, r: r.right - hr.left + 8, b: r.bottom - hr.top + 8 }));

    allowed = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = document.createElement("i");
        const box = { l: x * cell, t: y * cell, r: (x + 1) * cell, b: (y + 1) * cell };
        const blocked = blockers.some((k) => box.l < k.r && box.r > k.l && box.t < k.b && box.b > k.t);
        grid.appendChild(i);
        cells.push(i);
        if (!blocked) {
          allowed.push(i);
          if (Math.random() < 0.28) i.classList.add("on");
        }
      }
    }
  }

  function heroTick() {
    if (!allowed.length) return;
    const on = allowed.filter((c) => c.classList.contains("on"));
    const off = allowed.filter((c) => !c.classList.contains("on"));
    if (on.length) on[(Math.random() * on.length) | 0].classList.remove("on");
    if (off.length) off[(Math.random() * off.length) | 0].classList.add("on");
  }

  hero.addEventListener("pointermove", (e) => {
    const el = document.elementsFromPoint(e.clientX, e.clientY).find((n) => n.parentNode === grid);
    if (!el || !allowed.includes(el) || el._hover) return;
    el._hover = true;
    el.classList.toggle("on");
    setTimeout(() => { el.classList.toggle("on"); el._hover = false; }, 700);
  });

  /* ============ DOT-MATRIX WORDMARKS ============ */
  function dotMatrix(canvas, { color = "#0a0a0a", weight = 700 } = {}) {
    const ctx = canvas.getContext("2d");
    const text = canvas.dataset.text;
    let dots = [], step = 8, start = 0, revealed = false, mouse = { x: -1e4, y: -1e4 };

    function layout() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      step = Math.max(5, Math.round(w / 150));

      const off = document.createElement("canvas");
      off.width = w; off.height = h;
      const o = off.getContext("2d");
      let size = h * 1.25;
      o.font = `${weight} ${size}px "Space Grotesk"`;
      const tw = o.measureText(text).width;
      size = Math.min(size, size * (w / tw));
      o.font = `${weight} ${size}px "Space Grotesk"`;
      o.textBaseline = "middle";
      o.letterSpacing = "-0.04em";
      o.fillText(text, (w - o.measureText(text).width) / 2, h * 0.52);

      const data = o.getImageData(0, 0, w, h).data;
      dots = [];
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          if (data[((y | 0) * w + (x | 0)) * 4 + 3] > 120) dots.push({ x, y, d: Math.random() * 900 });
        }
      }
    }

    function draw(t) {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const rect = canvas.getBoundingClientRect();
      const mx = mouse.x - rect.left, my = mouse.y - rect.top;
      const el = revealed ? t - start : 0;
      for (const p of dots) {
        if (!reduced && el < p.d) continue;
        const dist = Math.hypot(p.x - mx, p.y - my);
        const k = dist < 120 ? 0.25 + 0.75 * (dist / 120) : 1;
        const s = step * 0.8 * k;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      requestAnimationFrame(draw);
    }

    addEventListener("pointermove", (e) => { mouse = { x: e.clientX, y: e.clientY }; });
    addEventListener("resize", layout);
    layout();
    onView(canvas, () => { revealed = true; start = performance.now(); }, 0.2);
    requestAnimationFrame(draw);
  }

  /* ============ SCORE GRID ============ */
  const COLORS = ["#2c2f31", "#e85fd8", "#ffb800", "#e04b23"];
  function scoreGrid() {
    const g = document.getElementById("scoreGrid");
    const COLS = 16, ROWS = 15;
    const cellsS = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const c = document.createElement("i");
      g.appendChild(c);
      cellsS.push(c);
    }
    let phase = 0;
    const paint = () => {
      phase += 0.35;
      for (let x = 0; x < COLS; x++) {
        const n = (a, f) => Math.round(Math.sin(x * f + phase * a) * 1.1 + Math.sin(x * 0.37 - phase * 0.6));
        const b1 = 2 + n(0.9, 0.8);
        const b2 = 4 + n(0.7, 0.55);
        const b3 = 9 + n(0.5, 0.45);
        for (let y = 0; y < ROWS; y++) {
          const col = y < b1 ? 0 : y < b2 ? 1 : y < b3 ? 2 : 3;
          cellsS[y * COLS + x].style.background = COLORS[col];
        }
      }
    };
    paint();
    if (!reduced) setInterval(paint, 600);
  }

  function scoreTitle() {
    const el = document.getElementById("scoreTitle");
    el.innerHTML = el.innerHTML
      .split(/<br\s*\/?>/i)
      .map((line) => [...line].map((ch) => `<span class="ch">${ch}</span>`).join(""))
      .join("<br>");
    const chars = [...el.querySelectorAll(".ch")].sort(() => Math.random() - 0.5);
    onView(el, () => {
      chars.forEach((c, i) => setTimeout(() => c.classList.add("in"), reduced ? 0 : i * 45));
      const num = document.getElementById("scoreNum");
      countUp(num, +num.dataset.to, 1800);
    });
  }

  /* ============ GOLDEN SPIRAL (bloom bars) ============ */
  function spiral() {
    const canvas = document.getElementById("spiral");
    const ctx = canvas.getContext("2d");
    const off = document.createElement("canvas");
    const o = off.getContext("2d", { willReadFrequently: true });
    const PHI = (1 + Math.sqrt(5)) / 2;
    const B = Math.log(PHI) / (Math.PI / 2);
    let W, H, progress = 0;

    const size = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      off.width = W; off.height = H;
    };

    function frame(t) {
      progress = reduced ? 1 : Math.min(1, progress + 0.006);
      // 1. draw the spiral as a thick stroke into a mask
      o.clearRect(0, 0, W, H);
      o.fillStyle = "#000";
      const cx = W * 0.62, cy = H * 0.56;
      const a = W * 0.009;
      const tMax = 4.25 * Math.PI * progress + 0.01;
      for (let th = 0; th < tMax; th += 0.02) {
        const r = a * Math.exp(B * th);
        const x = cx + r * Math.cos(th + Math.PI);
        const y = cy + r * Math.sin(th + Math.PI);
        if (r > W) break;
        o.beginPath();
        o.arc(x, y, Math.max(1.5, r * 0.16), 0, Math.PI * 2);
        o.fill();
      }
      const data = o.getImageData(0, 0, W, H).data;

      // 2. render vertical glowing bars where the mask is filled
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#9be000";
      ctx.shadowColor = "#a6ff00";
      ctx.shadowBlur = 16;
      const step = 7, bar = 4;
      for (let x = 0; x < W; x += step) {
        let runStart = -1;
        const wob = Math.sin(t / 700 + x * 0.05) * 1.5;
        for (let y = 0; y <= H; y += 2) {
          const inside = y < H && data[(y * W + x) * 4 + 3] > 0;
          if (inside && runStart < 0) runStart = y;
          if (!inside && runStart >= 0) {
            ctx.fillRect(x, runStart + wob, bar, y - runStart);
            runStart = -1;
          }
        }
      }
      requestAnimationFrame(frame);
    }

    addEventListener("resize", size);
    size();
    onView(canvas, () => requestAnimationFrame(frame), 0.2);
  }

  /* ============ BOOT ============ */
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    buildHero();
    if (!reduced) setInterval(heroTick, 450);
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildHero, 200); });

    dotMatrix(document.getElementById("dotWord"));
    dotMatrix(document.getElementById("dotFoot"));
    scoreGrid();
    scoreTitle();
    spiral();

    const big = document.querySelector("[data-count]");
    onView(big, () => countUp(big, +big.dataset.count));
  });
})();
