// Business model: the value of one bar fills a square in steps, and a dial walks through the three risks.
(() => {
  const sec = document.getElementById("modelo");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // tween a number inside el from its current value to `to`, keeping prefix/suffix/decimals
  const tween = (el, to, { pre = "", suf = "", dec = 0, ms = 900 } = {}) => {
    const from = el._v ?? 0, t0 = performance.now();
    el._v = to;
    const tick = (t) => {
      const k = reduced ? 1 : Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (from + (to - from) * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- value of a bar ---------- */
  const box = document.getElementById("mnBox");
  const [canal, costo, molino] = box.querySelectorAll(".mn__seg");
  const STEPS = [
    { cap: "Precio al público", val: 50, h: [0, 0, 100], lime: "Precio al público", pct: 100 },
    { cap: "Ingreso de El Molino", val: 23.82, h: [52.4, 0, 47.6], lime: "Ingreso de El Molino", pct: 47.6 },
    { cap: "Margen bruto", val: 9.43, h: [52.4, 28.8, 18.9], lime: "Margen bruto · $9.43", pct: 18.9 },
  ];
  const stepBtns = [...document.querySelectorAll("#mnSteps button")];
  let step = 0, auto = true;
  function setStep(i) {
    step = i;
    const s = STEPS[i];
    stepBtns.forEach((b, j) => b.classList.toggle("on", j === i));
    [canal, costo, molino].forEach((el, j) => { el.style.setProperty("--h", s.h[j] + "%"); el.classList.toggle("off", !s.h[j]); });
    document.getElementById("mnCap").textContent = s.cap;
    document.getElementById("mnLime").textContent = s.lime;
    tween(document.getElementById("mnVal"), s.val, { pre: "$", dec: 2 });
    tween(document.getElementById("mnPct"), s.pct, { suf: "%", dec: s.pct % 1 ? 1 : 0 });
  }
  stepBtns.forEach((b, j) => (b.onclick = () => { auto = false; setStep(j); }));

  /* ---------- risk dial ---------- */
  const arc = document.getElementById("mnArc"), years = document.getElementById("mnYears");
  const gCap = document.getElementById("mnGCap"), gVal = document.getElementById("mnGVal");
  const RISKS = [
    [{ tag: "Top 2 clientes", cap: "Del volumen", pct: 60 }, { tag: "Edgar García", cap: "Del volumen · $20.14 por barra", pct: 29.1 }],
    [{ tag: "Antes", cap: "Margen bruto", pct: 42.5 }, { tag: "Ahora", cap: "Margen bruto", pct: 37.2 }],
    [{ tag: "Sin correo", cap: "87 de 105 clientes", pct: 82.9 }, { tag: "Con correo", cap: "18 de 105 clientes", pct: 17.1 }],
  ];
  const riskBtns = [...document.querySelectorAll("#mnRisks .mn__r")];
  let risk = 0, sub = 0, subTimer;
  function setSub(j) {
    sub = j;
    const d = RISKS[risk][j];
    [...years.children].forEach((b, k) => b.classList.toggle("on", k === j));
    arc.style.strokeDashoffset = 100 - d.pct;
    gCap.textContent = d.cap;
    tween(gVal, d.pct, { suf: "%", dec: 1 });
  }
  function setRisk(i) {
    risk = i;
    riskBtns.forEach((b, k) => b.classList.toggle("on", k === i));
    years.innerHTML = RISKS[i].map((d) => `<button type="button">${d.tag}</button>`).join("");
    [...years.children].forEach((b, k) => (b.onclick = () => { auto = false; clearTimeout(subTimer); setSub(k); }));
    setSub(0);
    // like the reference: the dial moves on to the second reading by itself
    clearTimeout(subTimer);
    if (!reduced) subTimer = setTimeout(() => setSub(1), 1800);
  }
  riskBtns.forEach((b, k) => (b.onclick = () => { auto = false; setRisk(k); }));

  /* ---------- reveal + autoplay while in view ---------- */
  let loop, visible = false;
  const play = () => {
    clearInterval(loop);
    if (reduced) return;
    loop = setInterval(() => {
      if (!auto || !visible) return;
      setStep((step + 1) % STEPS.length);
      if (step === 0) setRisk((risk + 1) % RISKS.length);
    }, 2600);
  };
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.25 })
    .observe(sec.querySelector(".mn__flow"));
  [box, sec.querySelector(".mn__gauge"), sec.querySelector(".mn__prio")].forEach((el) =>
    new IntersectionObserver(([e], io) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.3 }).observe(el));
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 }).observe(sec);

  setStep(0);
  setRisk(0);
  play();
})();
