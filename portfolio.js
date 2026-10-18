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
