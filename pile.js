// Photo piles: shelf photos drop one by one onto a stack, each slightly rotated; tap for the next.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".pile").forEach((pile) => {
    const stage = pile.querySelector(".pile__stage"), cards = [...pile.querySelectorAll(".pile__card")];
    const n = pile.querySelector(".pile__n"), tag = pile.querySelector(".pile__tag"), cap = pile.querySelector(".pile__cap");
    cards.forEach((c) => {
      c.style.setProperty("--r", (Math.random() * 10 - 5).toFixed(1) + "deg");
      c.style.setProperty("--x", (Math.random() * 30 - 15).toFixed(0) + "px");
      c.style.setProperty("--y", (Math.random() * 20 - 10).toFixed(0) + "px");
    });
    let i = -1, z = 1, timer, visible = false;
    function next() {
      i = (i + 1) % cards.length;
      if (i === 0) cards.forEach((c) => c.classList.remove("on", "top"));
      const c = cards[i];
      cards.forEach((o) => o.classList.remove("top"));
      c.style.zIndex = z++;
      c.classList.remove("on"); void c.offsetWidth; c.classList.add("on", "top");
      n.textContent = String(i + 1).padStart(2, "0") + " / " + String(cards.length).padStart(2, "0");
      tag.textContent = c.dataset.tag;
      cap.textContent = c.dataset.cap;
    }
    const loop = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => visible && next(), 2600); };
    stage.addEventListener("click", () => { next(); loop(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && i < 0) next(); }, { threshold: 0.35 }).observe(stage);
    loop();
  });
})();
