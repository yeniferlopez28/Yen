// Sampling page: start the gentle motion and fill the cost bars when they reach the screen.
(() => {
  const root = document.getElementById("sampling");
  if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("sg--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
  root.querySelectorAll(".sg__money").forEach((el) => io.observe(el));
})();
