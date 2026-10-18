// Presentations: one product at a time rises into view under a big centred title; tabs or the timer switch it.
(() => {
  const stage = document.getElementById("essStage");
  if (!stage) return;
  const items = [...stage.children], tabs = [...document.querySelectorAll("#essTabs button")];
  let cur = -1, picked = false, timer = 0, visible = false;
  function set(i) {
    if (i === cur) return;
    items.forEach((el, j) => { el.classList.toggle("out", j === cur); el.classList.toggle("on", j === i); });
    tabs.forEach((t, j) => t.classList.toggle("on", j === i));
    const prev = items[cur]; setTimeout(() => prev && prev.classList.remove("out"), 800);
    cur = i;
  }
  tabs.forEach((t, i) => (t.onclick = () => { picked = true; set(i); }));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && cur < 0) set(0);
    if (visible && !timer && !reduced) timer = setInterval(() => { if (visible && !picked) set((cur + 1) % items.length); }, 4200);
  }, { threshold: 0.3 }).observe(stage);
})();
