// Promotion research: mechanics filter, discount break-even slider and panel reveals.
(() => {
  const root = document.getElementById("investigacion-promociones");
  if (!root) return;
  const M = 9.4;
  const flt = root.querySelectorAll(".pi__flt button"), items = root.querySelectorAll(".pi__tags li");
  flt.forEach((b) => b.addEventListener("click", () => { flt.forEach((x) => x.classList.toggle("on", x === b)); items.forEach((li) => (li.hidden = b.dataset.f !== "all" && li.dataset.d !== b.dataset.f)); }));
  const d = document.getElementById("piD"), out = document.getElementById("piDo"), res = document.getElementById("piDl"), bar = document.getElementById("piDb");
  const calc = () => { const v = +d.value; out.textContent = "$" + v.toFixed(2); if (v >= M - 0.01) { res.textContent = "imposible"; bar.style.width = "100%"; return; } const lift = M / (M - v) - 1; res.textContent = "+" + Math.round(lift * 100) + "%"; bar.style.width = Math.min(100, lift * 25) + "%"; };
  if (d) { d.addEventListener("input", calc); calc(); }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("pi--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.06 });
  root.querySelectorAll(".pi__pn, .pi__win").forEach((el) => io.observe(el));
})();
