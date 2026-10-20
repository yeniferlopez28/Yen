// Mini brand manual: swatches that copy their code, allowed / not allowed logo combos, a two-tone title tester, grid lines.
(() => {
  const sec = document.getElementById("manual");
  if (!sec) return;
  const SW = [
    ["Negro", "#0B0A09", "C0 M0 Y0 K100", "base"], ["Hueso", "#F5EBD7", "C0 M9 Y20 K0", "base"], ["Lima", "#C9F23A", "C34 M0 Y85 K0", "base"],
    ["Rosa", "#FF89B8", "C68 M4 Y0 K0*", "base"], ["Azul profundo", "#3A5CFF", "C85 M73 Y0 K0", "base"], ["Frutos rojos", "#D6161D", "C16 M98 Y92 K0", "sabor"],
    ["Brownie", "#4E2275", "C85 M98 Y25 K0", "sabor"], ["Chocolate", "#E2DD2A", "C14 M14 Y91 K0", "sabor"], ["Cookies", "#C9B37A", "C21 M30 Y52 K0", "sabor"],
  ];
  const dark = (h) => { const n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (r * .299 + g * .587 + b * .114) < 140; };
  const sw = document.getElementById("mmSw");
  sw.innerHTML = SW.map(([n, h, c, k], i) => `<button type="button" class="mm__s${i === 0 ? " big" : ""}" style="--c:${h};--t:${dark(h) ? "#F5EBD7" : "#0B0A09"}" data-hex="${h}"><span class="k">${k === "sabor" ? "Color de sabor" : "Base"}</span><b>${n}</b><span class="hx">${h}</span><span class="cm">${c}</span><em>Copiado</em></button>`).join("");
  sw.querySelectorAll(".mm__s").forEach((b) => b.addEventListener("click", () => {
    const done = () => { b.classList.add("ok"); setTimeout(() => b.classList.remove("ok"), 1200); };
    try { navigator.clipboard.writeText(b.dataset.hex).then(done, done); } catch (e) { done(); }
  }));
  const OK = [["#3A5CFF", "#FF89B8"], ["#4E2275", "#C9F23A"], ["#D6161D", "#FF89B8"], ["#C9F23A", "#0B0A09"], ["#C9B37A", "#3A5CFF"], ["#0B0A09", "#C9F23A"], ["#F5EBD7", "#D6161D"]];
  document.getElementById("mmOk").innerHTML = OK.map(([b, f]) => `<span class="mm__w" style="--b:${b};--f:${f}">FIBO</span>`).join("");
  const NO = [["#C9F23A", "#E2DD2A", "FIBO", "Poco contraste"], ["#D6161D", "#3A5CFF", "BAR", "Colores que vibran"], ["#0B0A09", "#4E2275", "PROTE", "Se pierde en oscuro"], ["#F5EBD7", "#FF89B8", "FIBO", "Logo deformado"]];
  document.getElementById("mmNo").innerHTML = NO.map(([b, f, w, why], i) => `<figure><span class="mm__w no${i === 3 ? " skew" : ""}" style="--b:${b};--f:${f}">${w}</span><figcaption>✕ ${why}</figcaption></figure>`).join("");
  // two-tone title tester: last word in the accent
  const inp = document.getElementById("mmTry"), out = document.getElementById("mmOut");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const two = () => { const w = inp.value.trim().split(/\s+/).filter(Boolean); if (!w.length) { out.innerHTML = ""; return; } const last = w.pop(); out.innerHTML = `${esc(w.join(" "))} <span>${esc(last)}</span>`; };
  inp.addEventListener("input", two); two();
  // construction grid lines
  const gl = sec.querySelector("#mmGrid .gl"), NS = "http://www.w3.org/2000/svg", X0 = 34, X1 = 584, Y0 = 52, Y1 = 250;
  const add = (x1, y1, x2, y2, d) => { const l = document.createElementNS(NS, "line"); Object.entries({ x1, y1, x2, y2 }).forEach(([k, v]) => l.setAttribute(k, v)); l.style.setProperty("--d", d + "s"); gl.appendChild(l); };
  for (let i = 0; i <= 11; i++) add(X0 + (X1 - X0) * i / 11, Y0 - 14, X0 + (X1 - X0) * i / 11, Y1 + 14, i * 0.04);
  for (let i = 0; i <= 5; i++) add(X0 - 14, Y0 + (Y1 - Y0) * i / 5, X1 + 14, Y0 + (Y1 - Y0) * i / 5, 0.5 + i * 0.05);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
  sec.querySelectorAll(".mm__p").forEach((p) => io.observe(p));
})();
