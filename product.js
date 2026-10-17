// Product shot in the hero: resolves from big pixels into the photo, pixelates around the cursor and tilts with it.
(() => {
  const canvas = document.getElementById("productCanvas");
  if (!canvas) return;
  const fig = document.getElementById("heroProduct");
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const img = new Image();
  const low = document.createElement("canvas");
  const lctx = low.getContext("2d");
  let W = 0, H = 0, block = reduced ? 1 : 64, t0 = 0;
  const mouse = { x: -1e4, y: -1e4, on: false };

  function size() {
    W = canvas.clientWidth;
    H = W * (img.height / img.width);
    canvas.style.height = H + "px";
    canvas.width = W * dpr; canvas.height = H * dpr;
  }

  // Draw the image at 1/b resolution, then scale it back up without smoothing.
  function mosaic(b) {
    const lw = Math.max(1, Math.round(W / b)), lh = Math.max(1, Math.round(H / b));
    low.width = lw; low.height = lh;
    lctx.clearRect(0, 0, lw, lh);
    lctx.drawImage(img, 0, 0, lw, lh);
    return low;
  }

  function frame(t) {
    if (!t0) t0 = t;
    // intro: 64px blocks -> photo, stepping through powers of two
    if (block > 1) {
      const k = Math.min(1, (t - t0) / 1400);
      block = Math.max(1, Math.pow(2, Math.round(6 * (1 - k))));
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = block === 1;
    ctx.drawImage(block > 1 ? mosaic(block) : img, 0, 0, W, H);

    if (mouse.on && block === 1) {
      // pixelated lens that follows the cursor
      ctx.save();
      ctx.beginPath();
      const s = 70;
      ctx.rect(Math.round((mouse.x - s) / 12) * 12, Math.round((mouse.y - s) / 12) * 12, s * 2, s * 2);
      ctx.clip();
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(mosaic(12), 0, 0, W, H);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }

  fig.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    if (!reduced) {
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      fig.style.setProperty("--rx", (-ny * 10).toFixed(2) + "deg");
      fig.style.setProperty("--ry", (nx * 14).toFixed(2) + "deg");
    }
  });
  fig.addEventListener("pointerleave", () => {
    mouse.on = false;
    fig.style.setProperty("--rx", "0deg");
    fig.style.setProperty("--ry", "0deg");
  });

  img.onload = () => {
    size();
    addEventListener("resize", size);
    requestAnimationFrame(frame);
  };
  img.src = canvas.dataset.src;
})();
