// Why-evolve folders: hovering/tapping a folder lifts its sheet out; a slow tour runs while in view.
(() => {
  const board = document.getElementById("whyBoard");
  if (!board) return;
  const folds = [...board.querySelectorAll(".fold")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = -1, timer = 0, visible = false, hover = false, touched = false;
  function set(i) {
    cur = i;
    board.classList.toggle("has-on", i >= 0);
    folds.forEach((f, j) => f.classList.toggle("on", j === i));
  }
  folds.forEach((f, i) => {
    f.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hover = true; set(i); } });
    f.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hover = false; });
    // mouse: hover already opened it, so a click keeps it open; touch: tap toggles
    let lastType = "mouse";
    f.addEventListener("pointerdown", (e) => { lastType = e.pointerType; });
    f.addEventListener("click", () => { touched = true; set(lastType !== "mouse" && cur === i ? -1 : i); });
    f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f.click(); } });
  });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !timer && !reduced) {
      setTimeout(() => { if (!hover && !touched) set(0); }, 1200);
      timer = setInterval(() => { if (visible && !hover && !touched) set((cur + 1) % folds.length); }, 5200);
    }
  }, { threshold: 0.35 }).observe(board);
})();
