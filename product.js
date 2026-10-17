// Product photos (one per flavour): each resolves from big pixels into the photo, shows a pixel lens
// under the cursor and tilts toward it.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function photo(canvas, delay) {
    const fig = canvas.closest("figure") || canvas;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const low = document.createElement("canvas");
    const lctx = low.getContext("2d");
    let W = 0, H = 0, block = reduced ? 1 : 64, t0 = 0;
    const mouse = { x: 0, y: 0, on: false };

    const size = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
    };

    // Draw the photo at 1/b resolution, then scale it back up without smoothing.
    const mosaic = (b) => {
      low.width = Math.max(1, Math.round(W / b)); low.height = Math.max(1, Math.round(H / b));
      lctx.drawImage(img, 0, 0, low.width, low.height);
      return low;
    };

    function frame(t) {
      if (!t0) t0 = t + delay;
      if (block > 1 && t >= t0) {
        const k = Math.min(1, (t - t0) / 1200);
        block = Math.max(1, Math.pow(2, Math.round(6 * (1 - k))));
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = block === 1;
      ctx.drawImage(block > 1 ? mosaic(block) : img, 0, 0, W, H);

      if (mouse.on && block === 1) {
        const s = Math.min(56, H * 0.45), g = 10;
        ctx.save();
        ctx.beginPath();
        ctx.rect(Math.round((mouse.x - s) / g) * g, Math.round((mouse.y - s) / g) * g, s * 2, s * 2);
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(mosaic(g), 0, 0, W, H);
        ctx.restore();
      }
      if (block > 1 || mouse.on || fig._fade) requestAnimationFrame(frame);
      else running = false;
    }

    let running = false;
    const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

    fig.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
      if (!reduced) {
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        fig.style.setProperty("--rx", (-ny * 16).toFixed(2) + "deg");
        fig.style.setProperty("--ry", (nx * 14).toFixed(2) + "deg");
      }
      kick();
    });
    fig.addEventListener("pointerleave", () => {
      mouse.on = false;
      fig.style.setProperty("--rx", "0deg");
      fig.style.setProperty("--ry", "0deg");
      fig._fade = true; kick(); setTimeout(() => { fig._fade = false; }, 50);
    });

    img.onload = () => {
      canvas.style.aspectRatio = img.width + " / " + img.height;
      size();
      addEventListener("resize", () => { size(); kick(); });
      kick();
    };
    img.src = canvas.dataset.src;
  }

  document.querySelectorAll("canvas.px-photo").forEach((c, i) => photo(c, i * 220));
})();
