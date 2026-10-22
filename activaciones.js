// Activaciones presenciales: expanding pilot cards (auto-advance via progress animation), budget toggle, reveals.
(() => {
  const root = document.getElementById("activaciones-zmg");
  if (!root) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const acc = document.getElementById("avAcc"), cards = [...acc.children];
  let mini = false;
  const open = (i) => cards.forEach((c, k) => {
    c.classList.toggle("on", k === i);
    c.querySelector(".av__tab").setAttribute("aria-expanded", k === i);
  });
  const next = (i) => { let n = i; do n = (n + 1) % cards.length; while (mini && cards[n].classList.contains("av--opt")); return n; };
  cards.forEach((c, i) => {
    c.querySelector(".av__tab").addEventListener("click", () => open(i));
    c.querySelector(".av__prog").addEventListener("animationend", () => open(next(i)));
  });

  // budget toggle: the reduced plan keeps P1 + P2
  const bb = [...root.querySelectorAll(".av__bud button")];
  bb.forEach((b) => b.addEventListener("click", () => {
    bb.forEach((x) => x.classList.toggle("on", x === b));
    mini = b.dataset.b === "mini"; acc.classList.toggle("av--mini", mini);
    const cur = cards.findIndex((c) => c.classList.contains("on"));
    if (mini && cards[cur].classList.contains("av--opt")) open(0);
  }));

  if (reduced || !("IntersectionObserver" in window)) return;
  root.classList.add("av--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.target === acc) { acc.classList.toggle("run", e.isIntersecting); return; }
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  io.observe(acc);
  root.querySelectorAll(".av__panel, .av__pr").forEach((el) => io.observe(el));
})();
