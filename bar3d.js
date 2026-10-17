// Rotating 3D protein bar rendered as glowing halftone stripes (bloom + DOF via stacked canvases).
(() => {
  const canvas = document.getElementById("bar3d");
  if (!canvas) return;
  const glow = document.getElementById("bar3dGlow");
  const ctx = canvas.getContext("2d");
  const gctx = glow.getContext("2d");
  const off = document.createElement("canvas");
  const o = off.getContext("2d", { willReadFrequently: true });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WRAPPERS = ["#a8ff1a", "#f2b867", "#ff2d5f", "#a874ff"];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ---------- geometry: wrapper "pillow" with crimped seals at both ends ---------- */
  const SEG = 20;
  // [x, half-height (y), half-depth (z)]
  const rings = [
    [-1.66, 0.50, 0.012], [-1.46, 0.49, 0.03], [-1.36, 0.46, 0.17], [-1.22, 0.46, 0.22],
    [0, 0.47, 0.235],
    [1.22, 0.46, 0.22], [1.36, 0.46, 0.17], [1.46, 0.49, 0.03], [1.66, 0.50, 0.012],
  ];
  const verts = rings.map(([x, ry, rz]) =>
    Array.from({ length: SEG }, (_, i) => {
      const a = (i / SEG) * Math.PI * 2;
      // superellipse cross-section: flat front/back, rounded edges
      const c = Math.cos(a), s = Math.sin(a);
      const p = 0.6;
      return [x, Math.sign(s) * Math.pow(Math.abs(s), p) * ry, Math.sign(c) * Math.pow(Math.abs(c), p) * rz];
    })
  );
  const quads = [];
  for (let r = 0; r < rings.length - 1; r++) {
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG;
      quads.push([verts[r][i], verts[r][j], verts[r + 1][j], verts[r + 1][i]]);
    }
  }
  // Label planes (front z+ / back z-), slightly above the surface.
  const LZ = 0.236;
  const labels = [
    { p: [[-1.05, 0.3, LZ], [1.05, 0.3, LZ], [-1.05, -0.3, LZ]], n: [0, 0, 1] },
    { p: [[1.05, 0.3, -LZ], [-1.05, 0.3, -LZ], [1.05, -0.3, -LZ]], n: [0, 0, -1] },
  ];

  /* ---------- math ---------- */
  let rotY = 0.6, rotX = -0.32, rotZ = 0.12, vel = 0.012;
  const rot = ([x, y, z]) => {
    // Z, then Y, then X
    let cz = Math.cos(rotZ), sz = Math.sin(rotZ);
    [x, y] = [x * cz - y * sz, x * sz + y * cz];
    let cy = Math.cos(rotY), sy = Math.sin(rotY);
    [x, z] = [x * cy + z * sy, -x * sy + z * cy];
    let cx = Math.cos(rotX), sx = Math.sin(rotX);
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    return [x, y, z];
  };
  const CAM = 6;
  let W = 0, H = 0, S = 1;
  const proj = ([x, y, z]) => {
    const k = CAM / (CAM - z);
    return [W / 2 + x * S * k, H / 2 - y * S * k];
  };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (v) => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const L = norm([-0.5, 0.7, 0.8]);

  function size() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    for (const c of [canvas, glow]) { c.width = W * dpr; c.height = H * dpr; }
    off.width = W; off.height = H;
    S = Math.min(W / 4.1, H / 1.9);
  }

  /* ---------- draw ---------- */
  function rasterize() {
    o.clearRect(0, 0, W, H);
    const faces = quads.map((q) => {
      const r = q.map(rot);
      const n = norm(cross(sub(r[1], r[0]), sub(r[3], r[0])));
      return { r, n, z: (r[0][2] + r[1][2] + r[2][2] + r[3][2]) / 4 };
    }).sort((a, b) => a.z - b.z);

    for (const f of faces) {
      // two-sided shading so the thin seals read from both sides
      const d = Math.abs(f.n[0] * L[0] + f.n[1] * L[1] + f.n[2] * L[2]);
      const lum = Math.round(255 * (0.18 + 0.82 * Math.pow(d, 1.4)));
      o.fillStyle = `rgb(${lum},${lum},${lum})`;
      o.strokeStyle = o.fillStyle;
      o.lineWidth = 1.5;
      o.beginPath();
      f.r.forEach((p, i) => { const [x, y] = proj(p); i ? o.lineTo(x, y) : o.moveTo(x, y); });
      o.closePath();
      o.fill();
      o.stroke();
    }

    // Logo on the visible label plane: affine-map text onto the projected plane.
    for (const lb of labels) {
      const n = rot(lb.n);
      if (n[2] < 0.15) continue;
      const [a, b, c] = lb.p.map(rot).map(proj);
      o.save();
      o.setTransform((b[0] - a[0]) / 210, (b[1] - a[1]) / 210, (c[0] - a[0]) / 60, (c[1] - a[1]) / 60, a[0], a[1]);
      o.globalAlpha = Math.min(1, (n[2] - 0.15) * 3);
      o.fillStyle = "#000";
      o.textBaseline = "middle";
      o.textAlign = "center";
      o.font = '700 68px "Space Grotesk", sans-serif';
      o.fillText("FIBO", 105, 33);
      o.restore();
    }
  }

  function stripes(t) {
    const data = o.getImageData(0, 0, W, H).data;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // each full turn shows the next flavour's wrapper colour
    const turn = Math.floor((rotY + Math.PI) / (Math.PI * 2));
    ctx.fillStyle = WRAPPERS[((turn % WRAPPERS.length) + WRAPPERS.length) % WRAPPERS.length];
    const STEP = Math.max(6, Math.round(W / 95));
    for (let x = 0; x < W; x += STEP) {
      const sx = Math.min(W - 1, x + (STEP >> 1));
      for (let y = 0; y < H; y += 2) {
        const i = (y * W + sx) * 4;
        if (data[i + 3] < 40) continue;
        const lum = data[i] / 255;
        if (lum < 0.12) continue; // logo shows as gaps
        // halftone: brighter surface => thicker line
        const w = 1 + lum * (STEP - 2);
        ctx.fillRect(x + (STEP - w) / 2, y, w, 2);
      }
    }
    // bloom layer = same image, blurred via CSS
    gctx.setTransform(1, 0, 0, 1, 0, 0);
    gctx.clearRect(0, 0, glow.width, glow.height);
    gctx.drawImage(canvas, 0, 0);
  }

  /* ---------- interaction: drag to spin ---------- */
  let dragging = false, lastX = 0, lastY = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    vel = (e.clientX - lastX) * 0.006;
    rotY += vel;
    rotX = Math.max(-1.2, Math.min(1.2, rotX + (e.clientY - lastY) * 0.004));
    lastX = e.clientX; lastY = e.clientY;
  });
  const release = () => { dragging = false; };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  function frame(t) {
    if (visible) {
      if (!dragging && !reduced) {
        vel += (0.012 - vel) * 0.03; // ease back to idle spin
        rotY += vel;
        rotX += (-0.32 + Math.sin(t / 2200) * 0.12 - rotX) * 0.02;
        rotZ = 0.12 + Math.sin(t / 1700) * 0.06;
      }
      rasterize();
      stripes(t);
    }
    requestAnimationFrame(frame);
  }

  addEventListener("resize", size);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    size();
    requestAnimationFrame(frame);
  });
})();
