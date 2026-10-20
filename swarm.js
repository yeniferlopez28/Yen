// A river of tiny outlined FIBO bars that flows across the section, packs together and scatters from the cursor.
(() => {
  const canvas = document.getElementById("swarm");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const BW = 38, BH = 15;       // bar size (css px)
  const R = 15;                 // collision radius
  let W = 0, H = 0, bars = [];
  const mouse = { x: -1e4, y: -1e4 };
  const FLAVORS = ["#C9F23A", "#C9F23A", "#D6161D", "#0C0B0A"];
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  // River centerline: top-left to bottom-right with a gentle meander.
  const center = (x) => H * 0.05 + (x / W) * H * 0.9 + Math.sin((x / W) * Math.PI * 1.6) * H * 0.1;
  const slope = (x) => (center(x + 1) - center(x - 1)) / 2;

  function spawn(b, anywhere) {
    const straggler = Math.random() < 0.18;
    b.o = gauss() * H * (straggler ? 0.45 : 0.13);
    b.x = anywhere ? Math.random() * W : -BW - Math.random() * 120;
    b.y = center(b.x) + b.o;
    b.vx = 0; b.vy = 0;
    b.speed = 0.6 + Math.random() * 0.9;
    b.tilt = (Math.random() - 0.5) * 1.4;
    b.a = Math.atan(slope(b.x)) + b.tilt;
    // most bars are white outlines; some take the colour of a real FIBO wrapper
    b.color = Math.random() < 0.22 ? FLAVORS[(Math.random() * FLAVORS.length) | 0] : "#F2EFE8";
    return b;
  }

  function size() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const n = Math.round(Math.min(520, (W * H) / 2600));
    bars = Array.from({ length: n }, () => spawn({}, true));
  }

  function step() {
    for (const b of bars) {
      const s = slope(b.x);
      const len = Math.hypot(1, s);
      // steer toward the flow direction and the bar's lane in the river
      const dvx = (b.speed / len);
      const dvy = (b.speed * s / len) + (center(b.x) + b.o - b.y) * 0.004;
      b.vx += (dvx - b.vx) * 0.04;
      b.vy += (dvy - b.vy) * 0.04;

      // cursor pushes bars away
      const mx = b.x - mouse.x, my = b.y - mouse.y, md = Math.hypot(mx, my);
      if (md < 120 && md > 0.1) {
        const f = (1 - md / 120) * 2.2;
        b.vx += (mx / md) * f; b.vy += (my / md) * f;
        b.spin = (b.spin || 0) + (Math.random() - 0.5) * 0.08;
      }
      b.x += b.vx; b.y += b.vy;

      // orientation follows motion loosely, keeps its own tilt
      const target = Math.atan2(b.vy, b.vx) + b.tilt;
      b.spin = (b.spin || 0) * 0.92;
      b.a += (target - b.a) * 0.02 + b.spin;

      if (b.x > W + BW * 2 || b.y > H + BW * 2 || b.y < -BW * 4) spawn(b, false);
    }

    // position-based separation with a spatial grid so bars pack instead of overlapping
    const cell = R * 2, cols = Math.ceil((W + 400) / cell) + 1;
    const grid = new Map();
    bars.forEach((b, i) => {
      const k = Math.floor((b.x + 200) / cell) + Math.floor((b.y + 200) / cell) * cols;
      (grid.get(k) || grid.set(k, []).get(k)).push(i);
    });
    for (let i = 0; i < bars.length; i++) {
      const a = bars[i];
      const cx = Math.floor((a.x + 200) / cell), cy = Math.floor((a.y + 200) / cell);
      for (let gy = cy - 1; gy <= cy + 1; gy++) {
        for (let gx = cx - 1; gx <= cx + 1; gx++) {
          const list = grid.get(gx + gy * cols);
          if (!list) continue;
          for (const j of list) {
            if (j <= i) continue;
            const b = bars[j];
            const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
            if (d > 0 && d < R * 2) {
              const push = (R * 2 - d) * 0.5, nx = dx / d, ny = dy / d;
              a.x -= nx * push; a.y -= ny * push;
              b.x += nx * push; b.y += ny * push;
            }
          }
        }
      }
    }
  }

  function bar(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.a);
    const c = b.color;
    ctx.strokeStyle = c; ctx.fillStyle = c;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(-BW / 2, -BH / 2, BW, BH, 3);
    ctx.stroke();
    // wrapper seals
    ctx.beginPath();
    ctx.moveTo(-BW / 2 + 5, -BH / 2); ctx.lineTo(-BW / 2 + 5, BH / 2);
    ctx.moveTo(BW / 2 - 5, -BH / 2); ctx.lineTo(BW / 2 - 5, BH / 2);
    ctx.stroke();
    ctx.font = '700 8px "Archivo", sans-serif';
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("FIBO", 0, 0.5);
    ctx.restore();
  }

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  function frame() {
    if (visible) {
      if (!reduced) step();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      bars.forEach(bar);
    }
    requestAnimationFrame(frame);
  }

  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; });

  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(size, 200); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    size();
    if (!reduced) for (let i = 0; i < 120; i++) step(); // settle into a river before first paint
    requestAnimationFrame(frame);
  });
})();
