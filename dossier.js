// Trends as a case file: a blue binder with one tab per trend; each tab swaps the excerpt card, the clipped key-figure ticket and the verdict page.
(() => {
  const sec = document.getElementById("tendencias");
  if (!sec) return;
  const T = [
    { k: "Proteína cotidiana", c: "#F2A7B4", t: "La proteína se volvió cotidiana", v: "+236%", vl: "creció en un año el yogur alto en proteína de Danone", s: "Danone",
      a: ["Ya no es un producto exclusivo de quien entrena. Bimbo lanzó en abril de 2026 su barra Proteína+ y tortillas con proteína, y Lala también tiene productos en esta línea.", "Amplía el número de personas que buscan proteína en su día a día."],
      f: "Fuerza alta", r: "A favor", b: ["Favorece directamente a FIBO: cada vez más gente busca proteína fuera del gimnasio.", "La otra cara: llegan competidores grandes, con más presupuesto y distribución."] },
    { k: "Conveniencia", c: "#C9F23A", t: "Conveniencia y consumo entre comidas", v: "77%", vl: "de los mexicanos come algo entre comidas", s: "Kantar",
      a: ["El gasto en alimentos fuera del hogar creció 19.2% en términos reales entre 2022 y 2024 (ENIGH).", "Las tiendas de conveniencia son el centro del hábito: OXXO tiene más de 24 mil y 7-Eleven entre 1,800 y 2,000."],
      f: "La más fuerte", r: "A favor", b: ["Es la tendencia más importante para FIBO: coincide exactamente con su canal principal, 7-Eleven.", "Y con su nuevo posicionamiento de barra para el día a día."] },
    { k: "Para llevar", c: "#F7E27A", t: "Snacks para llevar", v: "7 de 10", vl: "pesos en botanas se gastan fuera del hogar", s: "Kantar, 2018",
      a: ["En Guadalajara, los jóvenes pasan cerca de 79 minutos al día en traslados.", "Se necesitan productos que se coman en la mano, sin refrigerar y sin ensuciar."],
      f: "Fuerza media", r: "A favor", b: ["Favorece al formato de barra: se come en cualquier lugar y a cualquier hora."] },
    { k: "Sabor y textura", c: "#F5A07A", t: "Sabor y textura", v: "71%", vl: "considera clave la textura; 75% en la Generación Z", s: "Puratos",
      a: ["En barras de proteína, el sabor ya no es un plus sino una condición mínima.", "Marcas como Barebells construyeron todo su éxito sobre el sabor."],
      f: "Por validar", r: "Riesgo", b: ["Es un riesgo mientras persista la queja de que la barra está «reseca».", "Su fuerza en el caso de FIBO queda por validar con una prueba de sabor."] },
    { k: "Transparencia", c: "#B9C8FF", t: "Exigencia de transparencia", v: "78%", vl: "considera los sellos al comprar; 74% aprueba la NOM-051", s: "estudios citados en la presentación",
      a: ["Profeco ha publicado análisis donde algunas barras y cereales no cumplen lo que declaran.", "Cada vez más marcas usan «sin sellos» como argumento de venta."],
      f: "Fuerza alta", r: "Exige ajustes", b: ["FIBO tiene que cuidar sus claims y comunicar solo lo que puede comprobar."] },
    { k: "Bienestar diario", c: "#9FE3C7", t: "Bienestar en la vida diaria", v: "44.5%", vl: "de los adultos en ciudades hace actividad física", s: "MOPRADEF 2025, INEGI",
      a: ["Es el segundo nivel más alto desde 2013, y Smart Fit creció 21% en México.", "Al mismo tiempo, la falta de tiempo es la principal razón para no hacer ejercicio."],
      f: "Fuerza alta", r: "A favor", b: ["Respalda la decisión de llevar a FIBO del gimnasio a la vida cotidiana."] },
    { k: "En conjunto", c: "#F2EFE8", t: "En conjunto", v: "2", vl: "condiciones para aprovechar las tendencias", s: "conclusión del análisis",
      a: ["La proteína es cada vez más cotidiana, la gente come entre comidas y compra en tiendas de conveniencia.", "Y el bienestar se vive en el día a día."],
      f: "Conclusión", r: "La dirección es correcta", b: ["<b>01.</b> La barra tiene que ser rica, con una textura que convenza en la primera mordida.", "<b>02.</b> La marca tiene que ser transparente en lo que promete."] },
  ];
  const TAB = ["#D6161D", "#3A5CFF", "#C9F23A", "#0C0B0A", "#F2A7B4", "#9FE3C7", "#F2EFE8"];
  const $ = (id) => document.getElementById(id);
  const tabs = $("fxTabs"), binder = $("fxBinder");
  const btns = T.map((d, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.role = "tab"; b.className = "fx__tab"; b.style.setProperty("--c", TAB[i]);
    b.innerHTML = `<span>${d.k}</span>`;
    b.onclick = () => show(i);
    tabs.appendChild(b); return b;
  });
  function show(i) {
    const d = T[i], n = String(i + 1).padStart(2, "0");
    btns.forEach((b, k) => { b.classList.toggle("on", k === i); b.setAttribute("aria-selected", k === i); });
    binder.classList.remove("swap"); void binder.offsetWidth; binder.classList.add("swap");
    $("fxCard").style.background = d.c;
    $("fxFile").textContent = $("fxFile2").textContent = `Tendencia ${i < 6 ? "#" + n : "· cierre"}`;
    $("fxT").textContent = d.t;
    $("fxCols").innerHTML = d.a.map((p) => `<p>${p}</p>`).join("");
    $("fxNo").textContent = n; $("fxSrc").textContent = d.s;
    $("fxV").textContent = d.v; $("fxVl").textContent = d.vl; $("fxVs").textContent = d.s;
    $("fxMargin").textContent = `${d.f}. ${d.r}.`;
    $("fxVerdict").textContent = d.r;
    $("fxVerdict").dataset.r = d.r === "Riesgo" ? "risk" : d.r === "Exige ajustes" ? "warn" : "ok";
    $("fxBody").innerHTML = d.b.map((p) => `<p>${p}</p>`).join("");
    $("fxTicket").style.setProperty("--rot", (i % 2 ? 4 : -6) + "deg");
  }
  show(0);
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { sec.classList.add("in"); io.disconnect(); } }, { threshold: 0.2 }).observe(binder);
})();
