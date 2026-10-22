// Experiencia de cliente: coupon break-even calculator, recovery poll, reveals.
(() => {
  const root = document.getElementById("experiencia-cliente");
  if (!root) return;
  const M = 91.48; // contribution of a 6-bar fibo.mx order after shipping
  const c = document.getElementById("cxC"), r = document.getElementById("cxR");
  const calc = () => {
    const C = +c.value, r0 = +r.value / 100, s = C / M, r1 = r0 / (1 - s);
    document.getElementById("cxCv").textContent = "$" + C;
    document.getElementById("cxRv").textContent = r.value + "%";
    document.getElementById("cxOut").textContent = (r1 * 100).toFixed(1) + "%";
    document.getElementById("cxBase").style.width = (r0 / .5 * 100) + "%";
    document.getElementById("cxBar").style.width = Math.min(100, r1 / .5 * 100) + "%";
    document.getElementById("cxNote").textContent = `Cada caja deja $91.48 después de envío: ${(s * 100).toFixed(1)}% de los canjes tiene que ser venta nueva.`;
  };
  [c, r].forEach((el) => el.addEventListener("input", calc)); calc();

  const bs = [...document.querySelectorAll("#cxPoll button")], ans = document.getElementById("cxAns");
  bs.forEach((b) => b.addEventListener("click", () => {
    bs.forEach((x) => x.classList.toggle("on", x === b));
    ans.textContent = "→ " + b.dataset.a; ans.classList.remove("pop"); void ans.offsetWidth; ans.classList.add("pop");
  }));

  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("cx--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
  root.querySelectorAll(".cx__hero, .cx__vis, .cx__fr, .cx__post, .cx__rev, .cx__inc, .cx__poll, .cx__duo, .cx__plan").forEach((el) => io.observe(el));
})();
