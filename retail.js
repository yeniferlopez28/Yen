// Retail: flavor picker (image, swatch, EAN, 7-Eleven presence), shelf before/after, execution score gauge, reveals.
(() => {
  const root = document.getElementById("retail");
  if (!root) return;
  const FL = JSON.parse(document.getElementById("rtFl").textContent);
  const img = document.getElementById("rtImg"), cap = document.getElementById("rtIn"), name = document.getElementById("rtName"), sel = document.getElementById("rtSel"), crumb = document.getElementById("rtCrumb"), ean = document.getElementById("rtEan");
  const ths = [...root.querySelectorAll(".rt__th")], sws = [...root.querySelectorAll(".rt__sw")];
  const pick = (i) => {
    const f = FL[i];
    ths.forEach((t, k) => t.classList.toggle("on", k === i)); sws.forEach((t, k) => t.classList.toggle("on", k === i));
    img.classList.add("sw");
    setTimeout(() => { img.src = `assets/fibo-${f.k}.webp`; img.alt = "FIBO " + f.n; img.classList.remove("sw"); }, 180);
    name.textContent = f.n; sel.textContent = `${f.n} · 65 g · 22 g`; crumb.textContent = f.n;
    ean.src = `assets/ean/${f.k}-${f.e}.png`; ean.alt = "Código de barras de FIBO " + f.n;
    cap.innerHTML = f.s ? "<b>En 7-Eleven</b> ✓ sí está" : "<b>En 7-Eleven</b> ✕ casi nunca"; cap.classList.toggle("no", !f.s);
  };
  [...ths, ...sws].forEach((b) => b.addEventListener("click", () => pick(+b.dataset.i)));

  const shelf = root.querySelector(".rt__shelf"), seg = [...root.querySelectorAll(".rt__seg button")];
  seg.forEach((b) => b.addEventListener("click", () => { seg.forEach((x) => x.classList.toggle("on", x === b)); shelf.dataset.v = b.dataset.v; }));

  const sc = root.querySelector(".rt__score"), arc = document.getElementById("rtArc"), out = document.getElementById("rtScore"), cls = document.getElementById("rtClass");
  const score = () => {
    let s = +sc.querySelector('input[name="rtD"]:checked').value;
    sc.querySelectorAll("input[type=checkbox]:checked").forEach((c) => (s += +c.dataset.p));
    out.textContent = s; arc.style.strokeDashoffset = 100 - s;
    const [t, c] = s >= 80 ? ["Excelente", "#C9F23A"] : s >= 60 ? ["Adecuado", "#3A5CFF"] : s >= 40 ? ["Mejorable", "#FF89B8"] : ["Crítico", "#D6161D"];
    cls.textContent = t; arc.style.stroke = c;
  };
  sc.addEventListener("change", score); score();

  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("rt--anim");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  root.querySelectorAll(".rt__panel, .rt__board, .rt__block, .rt__score").forEach((el) => io.observe(el));
})();
