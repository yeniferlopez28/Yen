// Category definition: reveal the protein ladder, folders, regulation steps and the price/protein gap on scroll.
(() => {
  const sec = document.getElementById("categoria");
  if (!sec) return;
  // clipped blocks report no intersection, so watch their parent and flag the block
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target._t.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.3 });
  sec.querySelectorAll(".ct__blk, .ct__scale, .ct__folders, .ct__steps, .ct__snacks, .ct__quad").forEach((n) => {
    const w = n.classList.contains("ct__blk") ? n.parentElement : n;
    w._t = n; io.observe(w);
  });
})();
