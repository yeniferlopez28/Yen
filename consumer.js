// Priority consumer: hover cards fill with a FIBO gradient that follows the cursor; buses cross Ana's day; charts reveal on scroll.
(() => {
  const sec = document.getElementById("consumidor");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  sec.querySelectorAll(".cs__c").forEach((c) => c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    c.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
  }));

  // 168 dots ≈ 1.68 M; the first 110 are the 18–29 group
  const waf = document.getElementById("csWaf");
  for (let i = 0; i < 168; i++) { const d = document.createElement("i"); if (i < 110) d.className = "on"; d.style.transitionDelay = i * 6 + "ms"; waf.appendChild(d); }

  const count = (b) => {
    const to = +b.dataset.n, s = b.dataset.s || "", t0 = performance.now();
    const tick = (t) => { const k = reduced ? 1 : Math.min(1, (t - t0) / 1400); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + s; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-n]").forEach(count);
    io.unobserve(e.target);
  }), { threshold: 0.3 });
  sec.querySelectorAll(".cs__cards, .cs__road, .cs__stats, .cs__panel, .cs__ana, .cs__val").forEach((n) => io.observe(n));
})();
