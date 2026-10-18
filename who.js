// Who section: menu items re-stack the cards and slide the drawer open with that topic's list.
(() => {
  const frame = document.getElementById("whoFrame");
  if (!frame) return;
  const btns = [...frame.querySelectorAll(".who__menu button")];
  const stacks = [...frame.querySelectorAll(".who__stack")];
  const lists = [...frame.querySelectorAll(".who__list")];
  let cur = -1, picked = false, timer = 0, visible = false;
  function set(i) {
    cur = i;
    frame.classList.add("open");
    [btns, stacks, lists].forEach((g) => g.forEach((el, j) => el.classList.toggle("on", j === i)));
  }
  btns.forEach((b, i) => (b.onclick = () => { picked = true; set(i); }));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && cur < 0) setTimeout(() => cur < 0 && set(0), reduced ? 0 : 500);
    if (visible && !timer && !reduced) timer = setInterval(() => { if (visible && !picked) set((cur + 1) % btns.length); }, 9000);
  }, { threshold: 0.35 }).observe(frame);
})();
