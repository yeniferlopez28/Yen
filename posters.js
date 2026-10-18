// Poster rows: the tilted colour squares swing into place when each row scrolls into view.
(() => {
  const rows = document.querySelectorAll(".obj__row");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { rows.forEach((r) => r.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0, rootMargin: "0px 0px -20% 0px" });
  rows.forEach((r) => io.observe(r));
})();

// Eight fronts: slanted bands slide in; the active one opens its panel (auto-tour until the viewer picks one).
(() => {
  const box = document.getElementById("frx");
  if (!box) return;
  const bandsWrap = box.querySelector(".frx__bands");
  const bands = [...box.querySelectorAll(".frx__band")].sort((a, b) => a.dataset.i - b.dataset.i);
  const panels = [...box.querySelectorAll(".frx__panel")];
  bands.forEach((b, k) => b.style.setProperty("--d", k));
  let cur = -1, picked = false, timer = 0, visible = false;
  const set = (i) => {
    cur = i; bandsWrap.classList.toggle("has-on", i >= 0);
    bands.forEach((b) => b.classList.toggle("on", +b.dataset.i === i));
    panels.forEach((p) => p.classList.toggle("on", +p.dataset.i === i));
  };
  bands.forEach((b) => {
    b.onclick = () => { picked = true; set(+b.dataset.i); };
    b.onmouseenter = () => { picked = true; set(+b.dataset.i); };
  });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) box.classList.add("in");
    if (visible && !timer && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(() => { if (!picked) set(0); }, 1200);
      timer = setInterval(() => { if (visible && !picked) set((cur + 1) % bands.length); }, 3800);
    } else if (visible && cur < 0) set(0);
  }, { threshold: 0.3 }).observe(box);
})();
