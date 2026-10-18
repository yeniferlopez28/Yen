// Context section: colour tabs open stat panels; balls fall and pile up to show each number.
(() => {
  const frame = document.getElementById("ctxFrame");
  if (!frame) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const tabs = [...frame.querySelectorAll(".ctx__tabs button")];
  const panels = [...frame.querySelectorAll(".ctx__panel")];
  const nav = frame.querySelector(".ctx__tabs");
  let cur = -1, timer = 0, visible = false, userPicked = false;

  const setTabSize = () => {
    const mobile = matchMedia("(max-width: 720px)").matches;
    frame.style.setProperty("--tabs-w", mobile ? "0px" : nav.offsetWidth + "px");
    frame.style.setProperty("--tabs-h", mobile ? nav.offsetHeight + "px" : "0px");
  };

  function countUp(el) {
    const to = parseFloat(el.dataset.to), dec = (el.dataset.to.split(".")[1] || "").length;
    if (reduced) { el.textContent = el.dataset.to; return; }
    const t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / 1200); el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /* ---- tiny ball physics ---- */
  function balls(canvas) {
    const ctx = canvas.getContext("2d");
    const n = +canvas.dataset.n, on = +canvas.dataset.on, label = canvas.dataset.label;
    let B = [], raf = 0, W = 0, H = 0, R = 20, spawned = 0, t0 = 0;
    const panel = canvas.closest(".ctx__panel");
    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      R = Math.max(12, Math.min(34, Math.sqrt(W * H * 0.32 / n / Math.PI)));
    }
    function spawn(i) {
      B.push({ x: R + Math.random() * (W - 2 * R), y: -R - Math.random() * 60, vx: (Math.random() - .5) * 2, vy: 0, a: Math.random() * 6, va: (Math.random() - .5) * .1, on: i < on });
    }
    function step() {
      for (const b of B) { b.vy += 0.5; b.x += b.vx; b.y += b.vy; b.a += b.va;
        if (b.y > H - R) { b.y = H - R; b.vy *= -0.3; b.vx *= 0.9; b.va *= 0.9; }
        if (b.x < R) { b.x = R; b.vx *= -0.5; } if (b.x > W - R) { b.x = W - R; b.vx *= -0.5; } }
      for (let k = 0; k < 3; k++) for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
        const a = B[i], b = B[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), m = 2 * R;
        if (d > 0 && d < m) { const p = (m - d) / 2, nx = dx / d, ny = dy / d;
          a.x -= nx * p; a.y -= ny * p; b.x += nx * p; b.y += ny * p;
          const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv < 0) { const imp = rv * 0.6; a.vx += imp * nx; a.vy += imp * ny; b.vx -= imp * nx; b.vy -= imp * ny; } }
      }
    }
    function draw() {
      const cs = getComputedStyle(panel), fg = cs.color;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      for (const b of B) {
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a);
        ctx.beginPath(); ctx.arc(0, 0, R - 1, 0, Math.PI * 2);
        if (b.on) { ctx.fillStyle = fg; ctx.fill(); ctx.fillStyle = cs.backgroundColor; }
        else { ctx.lineWidth = 2; ctx.strokeStyle = fg; ctx.stroke(); ctx.fillStyle = fg; }
        ctx.font = `700 ${Math.round(R * 0.62)}px "JetBrains Mono", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(label, 0, 1);
        ctx.restore();
      }
    }
    function loop(t) {
      if (!t0) t0 = t;
      while (spawned < n && (t - t0) > spawned * 45) spawn(spawned++);
      step(); draw();
      raf = requestAnimationFrame(loop);
    }
    return {
      start() { cancelAnimationFrame(raf); size(); B = []; spawned = 0; t0 = 0;
        if (reduced) { for (let i = 0; i < n; i++) spawn(i); for (let k = 0; k < 400; k++) step(); draw(); return; }
        raf = requestAnimationFrame(loop); },
      stop() { cancelAnimationFrame(raf); },
    };
  }
  const sims = panels.map((p) => { const c = p.querySelector(".ctx__balls"); return c ? balls(c) : null; });

  function open(k) {
    if (k === cur) { k = -1; }
    panels.forEach((p, i) => p.classList.toggle("on", i === k));
    tabs.forEach((t, i) => t.classList.toggle("on", i === k));
    sims.forEach((s, i) => { if (s && i !== k) s.stop(); });
    if (k >= 0) {
      setTimeout(() => sims[k] && sims[k].start(), 350);
      const num = panels[k].querySelector("[data-to]"); if (num) countUp(num);
    }
    cur = k;
  }
  tabs.forEach((t) => (t.onclick = () => { userPicked = true; clearInterval(timer); open(+t.dataset.k); }));

  // Auto-tour once in view: base text first, then each tab.
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !userPicked && !timer && !reduced) {
      setTimeout(() => { if (!userPicked) open(0); }, 2200);
      timer = setInterval(() => { if (visible && !userPicked) open((cur + 1) % panels.length); }, 5200);
    }
  }, { threshold: 0.5 }).observe(frame);

  addEventListener("resize", () => { setTabSize(); if (cur >= 0 && sims[cur]) sims[cur].start(); });
  setTabSize();
})();
