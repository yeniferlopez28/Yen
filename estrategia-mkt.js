// Estrategia de marketing (resumen para dirección): numbers count up when they appear.
(() => {
  const root = document.getElementById("estrategia-marketing");
  if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  root.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
})();