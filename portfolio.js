// Portfolio: clicking a bar opens its analysis panel; clicking it again (or "Cerrar") closes it.
(() => {
  const items = [...document.querySelectorAll(".clk__item")];
  const dets = [...document.querySelectorAll(".clk__det")];
  if (!items.length) return;
  let cur = -1;
  const set = (i) => {
    cur = i;
    items.forEach((b, j) => { b.classList.toggle("on", j === i); b.setAttribute("aria-expanded", j === i); });
    dets.forEach((d, j) => d.classList.toggle("on", j === i));
  };
  items.forEach((b, i) => (b.onclick = () => set(cur === i ? -1 : i)));
  dets.forEach((d) => (d.querySelector(".clk__x").onclick = () => set(-1)));
})();

// Analysis charts: grow in when they scroll into view.
(() => {
  const vz = document.getElementById("vz");
  if (!vz) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { vz.classList.add("in"); return; }
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { vz.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 }).observe(vz);
})();
