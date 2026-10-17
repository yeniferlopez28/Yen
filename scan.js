// 1-bit "scanner" for each flavour card: a pixel line drawing of the wrapper; a beam sweeps across it and
// reveals the x-ray (the bar inside) behind it, with a HUD frame, progress track and a protein counter.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const BG = "#1f1f1f", FG = "#ececec";
  const PX = 2; // css px per cell

  function scanner(canvas, delay) {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    let W, H, cols, rows, bar = null, visible = false;

    // Build the two 1-bit layers from the photo: outline + label edges (outside), and an x-ray of the bar (inside).
    function build() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      cols = Math.floor(W / PX); rows = Math.floor(H / PX);
      const bw = Math.floor(cols * 0.8), bh = Math.round(bw * img.height / img.width);
      const off = document.createElement("canvas");
      off.width = bw; off.height = bh;
      const o = off.getContext("2d", { willReadFrequently: true });
      o.drawImage(img, 0, 0, bw, bh);
      const d = o.getImageData(0, 0, bw, bh).data;
      const A = (x, y) => (x < 0 || y < 0 || x >= bw || y >= bh) ? 0 : d[(y * bw + x) * 4 + 3];
      const L = (x, y) => { const i = (y * bw + x) * 4; return d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11; };
      const inside = (x, y) => A(x, y) > 128;

      // distance-to-edge (in cells) lets us erode the silhouette for the x-ray body
      const dist = new Uint8Array(bw * bh);
      for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
        if (!inside(x, y)) continue;
        let k = 1;
        while (k < 12 && inside(x - k, y) && inside(x + k, y) && inside(x, y - k) && inside(x, y + k)) k++;
        dist[y * bw + x] = k;
      }

      const outer = [], inner = [];
      for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
        if (!inside(x, y)) continue;
        const k = dist[y * bw + x];
        // outside layer: silhouette + strong label edges (logo, seals, crimps)
        let edge = k === 1;
        if (!edge && x > 0 && y > 0 && x < bw - 1 && y < bh - 1) {
          const gx = L(x + 1, y) - L(x - 1, y), gy = L(x, y + 1) - L(x, y - 1);
          edge = Math.hypot(gx, gy) > 95;
        }
        if (edge) outer.push(x, y);
        // inside layer: inner body outline, a spine and rib marks, like the x-ray in the reference
        const body = k >= 5;
        if (!body) continue;
        const rim = k === 5;
        const spine = Math.abs(y - bh / 2) < 1;
        const rib = x % 7 === 0 && k > 6 && Math.abs(y - bh / 2) < bh * 0.28 && (y % 3 !== 0);
        const grain = k > 7 && ((x * 13 + y * 7) % 23 === 0);
        if (rim || spine || rib || grain) inner.push(x, y);
      }
      bar = { bw, bh, ox: Math.floor((cols - bw) / 2), oy: Math.floor((rows - bh) / 2) - 4, outer, inner };
    }

    function px(x, y, w = 1, h = 1) { ctx.fillRect(x * PX, y * PX, w * PX, h * PX); }

    function hud(t, p) {
      const { ox, oy, bw, bh } = bar;
      const top = Math.max(2, oy - 8), bottom = Math.min(rows - 14, oy + bh + 8);
      const left = 4, right = cols - 5;
      // corner rules
      px(left, top, 16, 1); px(right - 15, top, 16, 1);
      px(left, bottom, 16, 1); px(right - 15, bottom, 16, 1);
      // side ticks, some flicker
      for (let y = top + 6; y < bottom - 3; y += 7) {
        const f = ((y * 31 + Math.floor(t / 180)) % 9) === 0;
        if (!f) { px(left, y, 4, 1); px(right - 3, y, 4, 1); }
      }
      // progress track with end squares
      const ty = bottom + 5;
      ctx.globalAlpha = 0.9;
      px(left, ty, 4, 4); px(right - 3, ty, 4, 4);
      ctx.fillStyle = BG; px(left + 1, ty + 1, 2, 2); px(right - 2, ty + 1, 2, 2); ctx.fillStyle = FG;
      px(left + 5, ty + 1, right - left - 9, 1);
      px(left + 5, ty, Math.max(1, Math.round((right - left - 9) * p)), 4);
      ctx.globalAlpha = 1;
      // counter box: grams of protein scanned
      const bxw = 22, bxh = 9, bx = right - bxw + 1, by = Math.max(top + 2, oy + bh - 2);
      px(bx, by, bxw, bxh);
      ctx.fillStyle = BG;
      ctx.font = `700 ${7 * PX}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "middle"; ctx.textAlign = "center";
      ctx.fillText(String(Math.round(p * 22)).padStart(2, "0") + "G", (bx + bxw / 2) * PX, (by + bxh / 2 + 0.5) * PX);
      ctx.fillStyle = FG;
    }

    function frame(t) {
      if (visible && bar) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = FG;
        const T = 3600, ph = reduced ? 0.5 : ((t + delay) % T) / T;
        const p = ph < 0.5 ? ph * 2 : 2 - ph * 2;           // ping-pong 0..1..0
        const ease = p * p * (3 - 2 * p);
        const { ox, oy, bw, outer, inner } = bar;
        const beam = Math.round(ease * (bw - 1));
        const glitchRow = Math.random() < 0.08 ? (Math.random() * bar.bh) | 0 : -1;

        // left of the beam: x-ray; right: outside drawing
        for (let i = 0; i < outer.length; i += 2) {
          const x = outer[i], y = outer[i + 1];
          if (x < beam) continue;
          const j = y === glitchRow ? 3 : 0;
          px(ox + x + j, oy + y);
        }
        for (let i = 0; i < inner.length; i += 2) {
          const x = inner[i], y = inner[i + 1];
          if (x >= beam) continue;
          px(ox + x, oy + y);
        }
        // the x-ray side keeps a faint silhouette
        ctx.globalAlpha = 0.35;
        for (let i = 0; i < outer.length; i += 2) if (outer[i] < beam && (outer[i] + outer[i + 1]) % 3 === 0) px(ox + outer[i], oy + outer[i + 1]);
        ctx.globalAlpha = 1;

        // beam with stray scan dashes
        px(ox + beam, oy - 3, 1, bar.bh + 6);
        for (let k = 0; k < 4; k++) if (Math.random() < 0.5) px(ox + beam - 2 - ((Math.random() * 10) | 0), oy + ((Math.random() * bar.bh) | 0), 3, 1);
        // dust
        for (let k = 0; k < 3; k++) if (Math.random() < 0.3) px((Math.random() * cols) | 0, (Math.random() * rows) | 0);

        hud(t, ease);
      }
      requestAnimationFrame(frame);
    }

    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    img.onload = () => {
      build();
      let rt;
      addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); });
      requestAnimationFrame(frame);
    };
    img.src = canvas.dataset.src;
  }

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    document.querySelectorAll("canvas.scan").forEach((c, i) => scanner(c, i * 900));
  });
})();
