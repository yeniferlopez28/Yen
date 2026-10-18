// Needs, motivations and barriers: highlighter reveals, growing arcs, protein blocks, empty-shelf dots and the FAQ.
(() => {
  const sec = document.getElementById("necesidades");
  if (!sec) return;
  // protein blocks: one per gram; the 8–12 range shows its uncertain part hatched
  sec.querySelectorAll(".nd__blocks").forEach((b) => {
    const n = +b.dataset.n, from = +(b.dataset.from || n);
    for (let i = 0; i < n; i++) { const c = document.createElement("i"); if (i >= from) c.className = "maybe"; c.style.transitionDelay = i * 45 + "ms"; b.appendChild(c); }
  });
  const dots = document.getElementById("ndDots");
  for (let i = 0; i < 53; i++) { const d = document.createElement("i"); if (i < 17) d.className = "off"; d.style.transitionDelay = i * 18 + "ms"; dots.appendChild(d); }

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.3 });
  sec.querySelectorAll(".nd__intro, .nd__arcs, .nd__need, .nd__prot, .nd__motg, .nd__scale, .nd__hill, .nd__barg, .nd__end").forEach((n) => io.observe(n));

  const ans = document.getElementById("ndAns"), qs = [...sec.querySelectorAll("#ndQs button")];
  qs.forEach((q) => (q.onclick = () => {
    qs.forEach((o) => o.classList.toggle("on", o === q));
    ans.innerHTML = `<mark>${q.textContent}</mark> ${q.dataset.a}`;
  }));
})();
