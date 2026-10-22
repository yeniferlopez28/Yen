// Estrategia de contenido: tabs (audiences, scenarios), mix phase toggle, series feed, reveals.
(() => {
  const root = document.getElementById("contenido-redes");
  if (!root) return;
  root.querySelectorAll(".sc__tabs").forEach((tb) => {
    const bs = [...tb.querySelectorAll(".sc__tb button")], ps = [...tb.querySelectorAll(".sc__pane")];
    bs.forEach((b) => b.addEventListener("click", () => {
      bs.forEach((x) => x.classList.toggle("on", x === b));
      ps.forEach((p) => p.classList.toggle("on", p.dataset.t === b.dataset.t));
    }));
  });
  const mix = document.getElementById("scMix");
  if (mix) {
    const bs = [...mix.querySelectorAll("[data-ph]")], segs = [...mix.querySelectorAll(".sc__bar i")];
    bs.forEach((b) => b.addEventListener("click", () => {
      bs.forEach((x) => x.classList.toggle("on", x === b));
      segs.forEach((s) => { const v = b.dataset.ph === "0" ? s.dataset.a : s.dataset.b; s.style.setProperty("--v", v + "%"); s.querySelector("b").textContent = v + "%"; });
    }));
  }
  const tiles = [...root.querySelectorAll(".sc__tile")], cards = [...root.querySelectorAll("#scDet article")];
  tiles.forEach((t) => t.addEventListener("click", () => {
    const i = +t.dataset.i;
    tiles.forEach((x) => x.classList.toggle("on", x === t));
    cards.forEach((c, k) => c.classList.toggle("on", k === i));
  }));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("sc--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  root.querySelectorAll(".sc__bd, .sc__hero, .sc__qa, .sc__res, .sc__plat, .sc__bm, .sc__mix, .sc__feed, .sc__anat, .sc__row, .sc__vs, .sc__jr, .sc__pils, .sc__kwt, .sc__ev, .sc__cal2, .sc__ninety, .sc__cx, .sc__rules").forEach((el) => io.observe(el));
})();
