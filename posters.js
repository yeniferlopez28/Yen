// Poster rows: the tilted colour squares swing into place when each row scrolls into view.
(() => {
  const rows = document.querySelectorAll(".obj__row");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { rows.forEach((r) => r.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0, rootMargin: "0px 0px -20% 0px" });
  rows.forEach((r) => io.observe(r));
})();
