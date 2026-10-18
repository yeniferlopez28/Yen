// Market size: radial tick dial for IEPS (8% → 20% proposal) and scroll reveals.
(() => {
  const sec = document.getElementById("mercado");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ticks = document.getElementById("mkTicks"), N = 40;
  for (let i = 0; i < N; i++) { const t = document.createElement("i"); t.style.setProperty("--a", (i / N) * 360 + "deg"); ticks.appendChild(t); }
  const lines = [...ticks.querySelectorAll("i")], val = document.getElementById("mkIeps");
  // 40 ticks = 0–50%: lime ticks show the current tax, white ones what the proposal would add
  const paint = (now, prop) => lines.forEach((t, i) => { const p = (i / N) * 50; t.className = p < now ? "l" : p < prop ? "w" : ""; });
  let on20 = false;
  const flip = () => { on20 = !on20; val.textContent = on20 ? "20%" : "8%"; paint(on20 ? 20 : 8, 20); };
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.3 });
  sec.querySelectorAll(".mk__years, .mk__venn, .mk__cards, .mk__ticks, .mk__path").forEach((n) => io.observe(n));
  paint(8, 20);
  if (!reduced) setInterval(flip, 2400);
  ticks.addEventListener("click", flip);
})();
