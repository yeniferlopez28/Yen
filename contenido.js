// Contenido en redes: series feed (tap a tile to see its card), reveals.
(() => {
  const root = document.getElementById("contenido-redes");
  if (!root) return;
  const tiles = [...root.querySelectorAll(".sc__tile")], cards = [...root.querySelectorAll("#scDet article")];
  tiles.forEach((t) => t.addEventListener("click", () => {
    const i = +t.dataset.i;
    tiles.forEach((x) => x.classList.toggle("on", x === t));
    cards.forEach((c, k) => c.classList.toggle("on", k === i));
  }));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("sc--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
  root.querySelectorAll(".sc__hero, .sc__res, .sc__mix, .sc__feed, .sc__anat, .sc__row, .sc__cal, .sc__ninety").forEach((el) => io.observe(el));
})();
