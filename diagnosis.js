// Historical diagnosis: soft spheres on dotted orbits with counting labels, and a 10×10 concentration grid.
(() => {
  const sec = document.getElementById("diagnostico");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const once = (node, cb) => new IntersectionObserver(([e], io) => { if (e.isIntersecting) { cb(); io.disconnect(); } }, { threshold: 0.35 }).observe(node);
  const count = (b) => {
    const to = +b.dataset.n, d = +b.dataset.d, t0 = performance.now();
    const tick = (t) => {
      const k = reduced ? 1 : Math.min(1, (t - t0) / 1600), v = to * (1 - Math.pow(1 - k, 3));
      b.textContent = v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  sec.querySelectorAll(".dg__sheet, .dg__ind").forEach((s) => once(s, () => { s.classList.add("in"); s.querySelectorAll("[data-n]").forEach(count); }));

  // cost vs price: each sphere grows by its own increase
  sec.querySelectorAll("[data-grow]").forEach((b) => b.style.setProperty("--g", b.dataset.grow));

  const cells = document.getElementById("dgCells");
  for (let i = 0; i < 100; i++) {
    const c = document.createElement("i");
    // reading order bottom-up so the two clients stack like the reference blocks
    const v = 99 - i;
    c.className = v < 59 ? "l" : "g";
    c.style.transitionDelay = (v * 12) + "ms";
    cells.appendChild(c);
  }
})();
