// Brand diagnosis: a notes-app canvas with draggable cards and filters, animated counters, and identity "chaos" that snaps into one direction.
(() => {
  const sec = document.getElementById("diagnostico-marca");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = () => matchMedia("(min-width: 901px)").matches;

  /* filters */
  const canvas = document.getElementById("ntCanvas"), cards = [...canvas.querySelectorAll(".nt__c")];
  const tools = [...sec.querySelectorAll(".nt__tools button")], lbl = document.getElementById("ntLbl");
  const names = { all: "Todo", gana: "Donde gana", pierde: "Donde pierde" };
  tools.forEach((b) => b.addEventListener("click", () => {
    const f = b.dataset.f;
    tools.forEach((x) => x.classList.toggle("on", x === b));
    lbl.textContent = names[f];
    cards.forEach((c) => c.classList.toggle("dim", f !== "all" && c.dataset.t !== f && c.dataset.t !== "all"));
  }));

  /* drag notes around the canvas (desktop) */
  let top = 10;
  cards.forEach((c) => {
    let sx, sy, ox, oy, on = false;
    c.addEventListener("pointerdown", (e) => {
      if (!wide() || e.button !== 0) return;
      on = true; c.setPointerCapture(e.pointerId); c.classList.add("drag"); c.style.zIndex = ++top;
      sx = e.clientX; sy = e.clientY; ox = parseFloat(c.dataset.dx || 0); oy = parseFloat(c.dataset.dy || 0);
    });
    c.addEventListener("pointermove", (e) => {
      if (!on) return;
      c.dataset.dx = ox + e.clientX - sx; c.dataset.dy = oy + e.clientY - sy;
      c.style.setProperty("--dx", c.dataset.dx + "px"); c.style.setProperty("--dy", c.dataset.dy + "px");
    });
    const up = () => { on = false; c.classList.remove("drag"); };
    c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
  });

  /* 11 empty months */
  const cal = document.getElementById("ntCal");
  const M = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  cal.innerHTML = M.map((m, i) => `<i style="--d:${i * 0.12}s" class="${i ? "x" : "p"}"><span>${m}</span></i>`).join("");

  /* counters */
  const fol = document.getElementById("ntFol");
  const countDown = () => {
    const t0 = performance.now(), N = 3000;
    const f = (t) => { const k = Math.min(1, (t - t0) / 1600), v = Math.round(N * (1 - Math.pow(1 - k, 3))); fol.textContent = "−" + v.toLocaleString("es-MX"); if (k < 1) requestAnimationFrame(f); };
    reduced ? (fol.textContent = "−3,000") : requestAnimationFrame(f);
  };

  /* chaos → one direction */
  const chaos = document.getElementById("ntChaos");
  const LANES = [
    { n: "Producto", f: "Que cumpla lo que promete", c: "#C9F23A" },
    { n: "Precio", f: "Un precio claro por canal", c: "#3A5CFF" },
    { n: "Punto de venta", f: "Material propio en el anaquel", c: "#D6161D" },
    { n: "Comunicación", f: "Un logo, un nombre, una voz", c: "#0C0B0A" },
  ];
  const BITS = [
    ["Textura seca", 0], ["2 sellos", 0], ["Claims sin respaldo", 0],
    ["Precio 1", 1], ["Precio 2", 1], ["Precio 3", 1], ["Precio 4", 1], ["Precio 5", 1],
    ["Sin material", 2], ["Sin foto propia", 2],
    ["Logo 1", 3], ["Logo 2", 3], ["Nombre 1", 3], ["Nombre 2", 3], ["Nombre 3", 3], ["Nombre 4", 3], ["Línea visual A", 3], ["Línea visual B", 3], ["Línea visual C", 3],
  ];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  chaos.innerHTML = `<div class="nt__arrow"><b>Con FIBO te encuentras</b></div>` +
    LANES.map((l, i) => `<div class="nt__lane" style="--c:${l.c};--i:${i}"><span class="mono">${l.n}</span><b>${l.f}</b></div>`).join("") +
    BITS.map(([t, l], i) => `<span class="nt__bit" style="--x:${(4 + rnd() * 80).toFixed(1)}%;--y:${(6 + rnd() * 70).toFixed(1)}%;--r:${(rnd() * 40 - 20).toFixed(0)}deg;--lx:${l * 25 + 3}%;--c:${LANES[l].c};--d:${(i * 0.04).toFixed(2)}s">${t}</span>`).join("");

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.id === "ntNums") countDown();
    if (e.target.id === "ntDir") setTimeout(() => chaos.classList.add("ord"), reduced ? 0 : 1600);
    io.unobserve(e.target);
  }), { threshold: 0.3 });
  sec.querySelectorAll(".nt__head, #ntWin, #ntNums, #ntDir, #ntRoute, .nt__next").forEach((n) => io.observe(n));
})();
