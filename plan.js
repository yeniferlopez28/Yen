// Plan section: tilted colour bars float loosely; opening one (or "Abrir todo") snaps them into a grid of cards.
(() => {
  const sec = document.getElementById("plan");
  if (!sec) return;
  const board = document.getElementById("planBoard"), toggle = document.getElementById("planToggle");
  const cards = [...board.querySelectorAll(".plan__card")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seeds = cards.map(() => ({ x: Math.random(), r: (Math.random() - .5) * 7 }));
  let open = false, auto = true;

  function layout() {
    const W = board.clientWidth, BAR = 56;
    if (!open) {
      const w = Math.min(W * 0.9, Math.max(280, W * 0.42)), gap = 34;
      cards.forEach((c, i) => {
        const left = (W - w) * (0.15 + seeds[i].x * 0.7);
        Object.assign(c.style, { left: left + "px", top: i * (BAR + gap) + "px", width: w + "px", height: BAR + "px", transform: `rotate(${seeds[i].r}deg)` });
      });
      board.style.height = cards.length * (BAR + gap) + "px";
      return;
    }
    const cols = W < 700 ? 1 : W < 1100 ? 2 : 4, gap = 6, cw = (W - gap * (cols - 1)) / cols;
    let y = 0, rowH = 0, col = 0;
    cards.forEach((c) => {
      const wide = c.classList.contains("plan__card--wide");
      if (wide && col) { y += rowH + gap; col = 0; rowH = 0; }
      const w = wide ? W : cw;
      c.style.width = w + "px";
      const body = c.querySelector(".plan__body");
      body.style.width = w + "px"; // measure at the final width, not the mid-transition one
      const h = BAR + body.scrollHeight;
      Object.assign(c.style, { left: (wide ? 0 : col * (cw + gap)) + "px", top: y + "px", height: h + "px", transform: "none" });
      rowH = Math.max(rowH, h);
      col = wide ? cols : col + 1;
      if (col >= cols) { y += rowH + gap; col = 0; rowH = 0; }
    });
    board.style.height = y + rowH + "px";
  }
  function set(v) {
    open = v; sec.classList.toggle("open", v);
    cards.forEach((c) => { c.classList.toggle("on", v); c.querySelector(".plan__bar").setAttribute("aria-expanded", v); });
    toggle.textContent = v ? "Cerrar" : "Abrir todo";
    layout();
  }
  cards.forEach((c) => (c.querySelector(".plan__bar").onclick = () => { auto = false; set(!open); }));
  toggle.onclick = () => { auto = false; set(!open); };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && auto) { auto = false; setTimeout(() => set(true), reduced ? 0 : 2200); }
  }, { threshold: 0.45 }).observe(board);
  addEventListener("resize", layout);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(layout);
})();
