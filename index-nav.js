// Presentation index: a full-screen table of contents by chapter, plus the current section's name in the top bar.
(() => {
  const CH = [
    ["01", "Arranque", "#C9F23A", [["barra", "Portada"], ["contexto", "Punto de partida"], ["plan", "Ordenar para crecer"], ["historia", "Historia"], ["porque", "Por qué evolucionar"], ["objetivos", "Objetivos del proyecto"]]],
    ["02", "Producto y negocio", "#FF89B8", [["quees", "Qué es FIBO"], ["producto", "El producto"], ["portafolio", "Portafolio"], ["presentaciones", "Presentaciones"], ["propuesta", "Propuesta actual"], ["modelo", "Modelo comercial"], ["cadena", "Cadena comercial"], ["canales", "Canales"]]],
    ["03", "Diagnóstico", "#D6161D", [["diagnostico", "Diagnóstico comercial"], ["hallazgos", "Hallazgos"]]],
    ["04", "Mercado y consumidor", "#3A5CFF", [["categoria", "La categoría"], ["mercado", "Mercado"], ["tendencias", "Tendencias"], ["consumidor", "Consumidor"], ["necesidades", "Necesidades"], ["ocasiones", "Ocasiones"], ["compra", "Proceso de compra"], ["investigacion", "Investigación"]]],
    ["05", "Competencia", "#F5EBD7", [["competencia", "Panorama competitivo"], ["benchmark", "Productos y precios"], ["posicionamiento", "Posicionamiento"], ["activaciones", "Promociones"], ["sintesis", "Síntesis y oportunidades"]]],
    ["06", "Estrategia de marca", "#C9F23A", [["diagnostico-marca", "Diagnóstico de marca"], ["foda", "FODA"], ["problema", "Problema central"], ["objetivos-marca", "Objetivos de marca"], ["objetivos-mkt", "Objetivos de marketing"], ["publico", "Público objetivo"], ["propuesta-valor", "Propuesta de valor"], ["diferenciacion", "Diferenciación"], ["personalidad", "Personalidad"], ["concepto", "Territorio y concepto"], ["mensajes", "Sistema de mensajes"]]],
    ["07", "FIBO 2.0", "#FF89B8", [["presenta", "FIBO en 360°"], ["momentos", "Momentos"], ["sabores", "Sabores"], ["flujo", "Hecha para moverse"], ["score", "Cierre"]]],
  ].map(([n, t, c, items]) => [n, t, c, items.filter(([id]) => document.getElementById(id))]);
  const panel = document.getElementById("idxPanel"), grid = document.getElementById("idxGrid"), btn = document.getElementById("idxBtn"), here = document.getElementById("navHere");
  if (!panel || !btn) return;
  grid.innerHTML = CH.map(([n, t, c, items]) => `<section class="idx__ch" style="--c:${c}"><h3><b>${n}</b>${t}</h3><ol>${items.map(([id, name]) => `<li><a href="#${id}" data-id="${id}">${name}</a></li>`).join("")}</ol></section>`).join("");
  const links = [...grid.querySelectorAll("a")];
  const open = (v) => { panel.hidden = !v; btn.setAttribute("aria-expanded", v); document.body.style.overflow = v ? "hidden" : ""; if (v) (grid.querySelector("a.on") || links[0]).focus(); else btn.focus(); };
  btn.addEventListener("click", () => open(panel.hidden));
  document.getElementById("idxClose").addEventListener("click", () => open(false));
  panel.addEventListener("click", (e) => { if (e.target === panel) open(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) open(false); });
  links.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); open(false); const s = document.getElementById(a.dataset.id); document.documentElement.style.scrollBehavior = "auto"; s.scrollIntoView(); document.documentElement.style.scrollBehavior = ""; }));
  // which section is on screen: the one crossing the middle of the viewport
  const all = CH.flatMap(([n, t, c, items]) => items.map(([id, name]) => [document.getElementById(id), name, t]));
  let raf = 0;
  const spy = () => { raf = 0; const y = innerHeight * 0.45; let cur = null;
    for (const [el, name, ch] of all) { const r = el.getBoundingClientRect(); if (r.top <= y && r.bottom > y) { cur = [el.id, name, ch]; break; } }
    here.textContent = cur ? cur[1] : "";
    links.forEach((a) => a.classList.toggle("on", !!cur && a.dataset.id === cur[0])); };
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(spy); }, { passive: true }); spy();
})();
