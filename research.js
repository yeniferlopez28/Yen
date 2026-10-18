// Primary research: Nothing-style playground hero, review-volume squares, a pile of opinion notes you can shuffle, and timeline/rule reveals.
(() => {
  const sec = document.getElementById("investigacion");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // dot-matrix "F" glyph that ripples, like the Glyph toys
  const cv = document.getElementById("ipDot"), ctx = cv.getContext("2d");
  const F = ["1111111", "1000000", "1000000", "1111100", "1000000", "1000000", "1000000"];
  let t = 0;
  const draw = () => {
    ctx.clearRect(0, 0, 120, 120); ctx.fillStyle = "#0C0B0A"; ctx.beginPath(); ctx.arc(60, 60, 58, 0, Math.PI * 2); ctx.fill();
    for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) {
      const gx = x - 2, gy = y - 2, on = gy >= 0 && gy < 7 && gx >= 0 && gx < 7 && F[gy][gx] === "1";
      const d = Math.hypot(x - 5, y - 5); if (d > 5.4) continue;
      const pulse = 0.5 + 0.5 * Math.sin(t / 300 - d);
      ctx.fillStyle = on ? "#C9F23A" : `rgba(242,239,232,${0.12 + pulse * 0.25})`;
      ctx.fillRect(10 + x * 9.2, 10 + y * 9.2, 6.4, 6.4);
    }
    t += 16; if (!reduced) requestAnimationFrame(draw);
  };
  draw();

  // review volume squares (1 = 100 opinions)
  sec.querySelectorAll("#ipScale i").forEach((el) => {
    const n = Math.round(+el.dataset.n / 100);
    for (let k = 0; k < n; k++) { const s = document.createElement("u"); s.style.transitionDelay = Math.min(k * 8, 1200) + "ms"; el.appendChild(s); }
  });

  // pile of notes: tap to send the top one to the back
  const pile = document.getElementById("ipPile");
  let notes = [...pile.children];
  const order = () => notes.forEach((n, i) => { n.style.zIndex = i + 1; n.classList.toggle("top", i === notes.length - 1); });
  order();
  const next = () => { const top = notes.pop(); top.classList.add("out"); setTimeout(() => { top.classList.remove("out"); notes.unshift(top); order(); }, 380); };
  pile.addEventListener("click", next);
  let timer, vis = false;
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0.4 }).observe(pile);
  if (!reduced) timer = setInterval(() => vis && next(), 3600);
  pile.addEventListener("pointerenter", () => clearInterval(timer), { once: true });

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.25 });
  sec.querySelectorAll(".ip__hero, .ip__scale, .ip__apps, .ip__tools, .ip__rules, .ip__plan").forEach((n) => io.observe(n));
})();
