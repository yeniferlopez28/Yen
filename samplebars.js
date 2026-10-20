// Sampling booth: four FIBO bars in the 360° halftone style, resting on the counter and gently rocking (no full spin).
(() => {
  const canvas = document.getElementById("acBars3d");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const o = off.getContext("2d", { willReadFrequently: true });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* same wrapper "pillow" geometry as the 360° bar */
  const SEG = 18;
  const rings = [
    [-1.66, 0.50, 0.012], [-1.46, 0.49, 0.03], [-1.36, 0.46, 0.17], [-1.22, 0.46, 0.22],
    [0, 0.47, 0.235],
    [1.22, 0.46, 0.22], [1.36, 0.46, 0.17], [1.46, 0.49, 0.03], [1.66, 0.50, 0.012],
  ];
  const verts = rings.map(([x, ry, rz]) =>
    Array.from({ length: SEG }, (_, i) => {
      const a = (i / SEG) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), p = 0.6;
      return [x, Math.sign(s) * Math.pow(Math.abs(s), p) * ry, Math.sign(c) * Math.pow(Math.abs(c), p) * rz];
    })
  );
  const quads = [];
  for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG;
    quads.push([verts[r][i], verts[r][j], verts[r + 1][j], verts[r + 1][i]]);
  }
  const LZ = 0.236;
  const label = { p: [[-1.05, 0.3, LZ], [1.05, 0.3, LZ], [-1.05, -0.3, LZ]], n: [0, 0, 1] };

  // four bars standing on the counter: x = centre in bar units, z = lean, ph = phase
  const BARS = [
    { c: "#C9F23A", x: -2.1, z: 0.1, ph: 0 },
    { c: "#D6161D", x: -0.7, z: 0.03, ph: 1.6 },
    { c: "#3A5CFF", x: 0.7, z: -0.03, ph: 3.1 },
    { c: "#0C0B0A", x: 2.1, z: -0.1, ph: 4.7 },
  ];

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (v) => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const L = norm([-0.5, 0.7, 0.8]);
  const CAM = 6;
  let W = 0, H = 0, S = 1;

  function size() {
    W = Math.round(canvas.clientWidth); H = Math.round(canvas.clientHeight);
    if (!W || !H) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    off.width = W; off.height = H;
    S = Math.min(W / 5.6, H / 3.75);
  }

  function drawBar(b, t) {
    const k = reduced ? 0 : t / 1000 + b.ph;
    const rY = 0.45 * Math.sin(k * 0.8), rX = -0.12 + 0.05 * Math.sin(k * 1.1), rZ = Math.PI / 2 + b.z + 0.04 * Math.sin(k * 1.3);
    const hop = reduced ? 0 : Math.max(0, Math.sin(k * 0.9)) ** 8 * 0.3; // a little hop now and then
    const cx = W / 2 + b.x * S, cy = H - (1.72 + hop) * S;
    const rot = ([x, y, z]) => {
      let c = Math.cos(rZ), s = Math.sin(rZ);
      [x, y] = [x * c - y * s, x * s + y * c];
      c = Math.cos(rY); s = Math.sin(rY);
      [x, z] = [x * c + z * s, -x * s + z * c];
      c = Math.cos(rX); s = Math.sin(rX);
      [y, z] = [y * c - z * s, y * s + z * c];
      return [x, y, z];
    };
    const proj = ([x, y, z]) => { const q = CAM / (CAM - z); return [cx + x * S * q, cy - y * S * q]; };

    o.clearRect(0, 0, W, H);
    quads.map((q) => {
      const r = q.map(rot);
      return { r, n: norm(cross(sub(r[1], r[0]), sub(r[3], r[0]))), z: (r[0][2] + r[1][2] + r[2][2] + r[3][2]) / 4 };
    }).sort((a, b2) => a.z - b2.z).forEach((f) => {
      const d = Math.abs(f.n[0] * L[0] + f.n[1] * L[1] + f.n[2] * L[2]);
      const lum = Math.round(255 * (0.18 + 0.82 * Math.pow(d, 1.4)));
      o.fillStyle = o.strokeStyle = `rgb(${lum},${lum},${lum})`;
      o.lineWidth = 1.2;
      o.beginPath();
      f.r.forEach((p, i) => { const [x, y] = proj(p); i ? o.lineTo(x, y) : o.moveTo(x, y); });
      o.closePath(); o.fill(); o.stroke();
    });
    const n = rot(label.n);
    if (n[2] > 0.15) {
      const [a, bb, c] = label.p.map(rot).map(proj);
      o.save();
      o.setTransform((bb[0] - a[0]) / 210, (bb[1] - a[1]) / 210, (c[0] - a[0]) / 60, (c[1] - a[1]) / 60, a[0], a[1]);
      o.fillStyle = "#000"; o.textBaseline = "middle"; o.textAlign = "center";
      o.font = '700 68px "Archivo", sans-serif';
      o.fillText("FIBO", 105, 33);
      o.restore();
    }

    // soft shadow on the counter, smaller while hopping
    ctx.fillStyle = `rgba(0,0,0,${0.22 - hop * 0.4})`;
    ctx.beginPath();
    ctx.ellipse(cx, H - 4, S * (0.55 - hop), S * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    // halftone stripes in the bar's colour
    const data = o.getImageData(0, 0, W, H).data;
    const STEP = Math.max(3, Math.round(S / 14));
    ctx.fillStyle = b.c;
    const x0 = Math.max(0, Math.floor(cx - 1.2 * S)), x1 = Math.min(W, Math.ceil(cx + 1.2 * S));
    for (let x = x0; x < x1; x += STEP) {
      const sx = Math.min(W - 1, x + (STEP >> 1));
      for (let y = 0; y < H; y += 2) {
        const i = (y * W + sx) * 4;
        if (data[i + 3] < 40) continue;
        const lum = data[i] / 255;
        if (lum < 0.12) continue;
        const w = 1 + lum * (STEP - 2);
        ctx.fillRect(x + (STEP - w) / 2, y, w, 2);
      }
    }
  }

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  function frame(t) {
    if (visible && canvas.clientWidth !== W) size();
    if (visible && W > 0 && H > 0) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      BARS.forEach((b) => drawBar(b, t));
    }
    requestAnimationFrame(frame);
  }
  addEventListener("resize", size);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { size(); requestAnimationFrame(frame); });
})();
