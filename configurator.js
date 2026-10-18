// Product configurator: menu modes place hotspots on the bar; flavours swap the photo and the summary.
(() => {
  const root = document.getElementById("producto");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const FL = [
    { n: "Cookies & Cream", img: "assets/fibo-cookies.webp", kcal: "Por validar*", sug: "Por validar*" },
    { n: "Chocolate", img: "assets/fibo-chocolate.webp", kcal: "230 kcal", sug: "10 g (4 g añadidos)" },
    { n: "Brownie", img: "assets/fibo-brownie.webp", kcal: "250 kcal", sug: "9 g (4 g añadidos)" },
    { n: "Frutos Rojos", img: "assets/fibo-frutos.webp", kcal: "Por validar*", sug: "Por validar*" },
  ];
  // x/y in % of the bar photo
  const M = {
    attr: { k: "Atributos", spots: [
      [18, 55, "65 g", "Peso por barra", "Una porción de 65 g: formato superior al de muchas barras de la categoría."],
      [74, 70, "22 g", "Proteína por barra", "22 g de proteína declarada, a partir de una mezcla de soya y suero de leche."],
      [46, 34, "10 g", "Fibra por barra", "10 g de fibra declarada; combinada con la proteína es su principal diferenciador."],
      [86, 42, "230–250", "Calorías por barra", "Entre 230 y 250 calorías, según el sabor."]] },
    fort: { k: "Fortalezas", spots: [
      [22, 50, "Tamaño", "Tamaño de 65 g", "Una barra de porción generosa frente a muchas opciones de la categoría."],
      [52, 46, "Proteína + fibra", "Proteína + fibra", "La combinación es el principal diferenciador identificado en la comparación realizada por el equipo."],
      [36, 74, "Saciedad", "Sensación de saciedad percibida", "Algunas personas describen la barra como un producto que llena; es una observación de consumidores, no una promesa clínica validada."],
      [80, 60, "Sabores y origen", "Cuatro sabores · Hecha en Jalisco", "Cuatro sabores para distintos gustos y producción propia en Jalisco."]] },
    reto: { k: "Retos competitivos", reto: true, spots: [
      [64, 26, "Azúcares", "Entre 9 y 12 g de azúcares", "Un punto a cuidar frente a competidores con menos azúcares."],
      [86, 42, "Calorías", "Entre 230 y 250 calorías", "Según el sabor."],
      [76, 22, "2 sellos", "Dos sellos de advertencia", "Exceso de calorías y exceso de grasas saturadas."],
      [30, 66, "Competencia", "Competidores con menos azúcares o sin sellos", "Opciones que ya compiten por etiqueta limpia."]] },
    exp: { k: "Experiencia", reto: true, spots: [
      [44, 52, "Textura", "Experiencia de consumo", "La resequedad es una de las quejas más recurrentes de los consumidores. Mejorar la textura y mantener su consistencia durante la vida de anaquel es una oportunidad para fortalecer la satisfacción y la recompra."]] },
  };
  const btns = [...root.querySelectorAll(".cfg__menu > button")];
  const flavs = [...root.querySelectorAll(".cfg__flav button")];
  const spots = $("cfgSpots"), note = $("cfgNote"), toggle = $("cfgToggle");
  let mode = "attr", flav = 0, picked = false, timer = 0, visible = false, spotIdx = 0;

  function show(i) {
    const m = M[mode], sp = m.spots[i]; spotIdx = i;
    [...spots.children].forEach((b, j) => b.classList.toggle("on", j === i));
    note.className = "cfg__note" + (m.reto ? " reto" : "");
    note.innerHTML = `<span>${m.k} · ${i + 1} / ${m.spots.length}</span><h3>${sp[3]}</h3><p>${sp[4]}</p>`;
  }
  function setMode(k) {
    mode = k;
    btns.forEach((b) => { b.classList.toggle("on", b.dataset.m === k); });
    btns.forEach((b, j) => b.classList.toggle("done", j < btns.findIndex((x) => x.dataset.m === k)));
    toggle.setAttribute("aria-pressed", String(!!M[k].reto));
    spots.innerHTML = M[k].spots.map(([x, y, l], j) =>
      `<button type="button" class="cfg__spot${M[k].reto ? " reto" : ""}${x > 60 ? " right" : ""}" style="--x:${x}%;--y:${y}%;--k:${j}" aria-label="${l}"><b>${l}</b></button>`).join("");
    [...spots.children].forEach((b, j) => { b.onclick = () => { picked = true; show(j); }; b.onmouseenter = () => show(j); });
    show(0);
  }
  function setFlav(i) {
    flav = i; const f = FL[i], img = $("cfgImg");
    img.style.opacity = 0;
    setTimeout(() => { img.src = f.img; img.alt = "Barra FIBO sabor " + f.n; img.style.opacity = 1; }, 200);
    $("cfgName").textContent = f.n; $("cfgKcal").textContent = f.kcal; $("cfgSug").textContent = f.sug;
    flavs.forEach((b, j) => b.classList.toggle("on", j === i));
  }
  btns.forEach((b) => (b.onclick = () => { picked = true; setMode(b.dataset.m); }));
  flavs.forEach((b) => (b.onclick = () => { picked = true; setFlav(+b.dataset.f); }));
  toggle.onclick = () => { picked = true; setMode(M[mode].reto ? "attr" : "reto"); };
  setMode("attr"); setFlav(0);

  // tour while nobody interacts: walk the hotspots, then move to the next mode and flavour
  const order = Object.keys(M);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !timer && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      timer = setInterval(() => {
        if (!visible || picked) return;
        if (spotIdx + 1 < M[mode].spots.length) show(spotIdx + 1);
        else { setMode(order[(order.indexOf(mode) + 1) % order.length]); setFlav((flav + 1) % FL.length); }
      }, 3200);
  }, { threshold: 0.35 }).observe(root);
})();
