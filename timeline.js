// Timeline: when it enters view, years count up from 2000 and the bars climb into each era.
(() => {
  const sec = document.getElementById("historia");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const years = [...sec.querySelectorAll("[data-year]")];
  function run() {
    sec.classList.add("in");
    if (reduced) return;
    years.forEach((el, i) => {
      const raw = el.dataset.year, [a, b] = raw.split("–"), target = +a, t0 = performance.now() + i * 260;
      const tick = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / 900));
        const v = Math.round(2000 + (target - 2000) * (1 - Math.pow(1 - k, 3)));
        el.textContent = k < 1 ? String(v) + (b ? "–" + b : "") : raw;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.25 }).observe(sec);
})();
