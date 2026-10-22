// Calendario de contenido: weekly planner (posting slots + production lane), 12-week overview, filters, detail popover.
(() => {
  const root = document.getElementById("calendario-contenido");
  if (!root) return;
  const D = JSON.parse(document.getElementById("ccData").textContent);
  const board = document.getElementById("ccBoard"), all = document.getElementById("ccAll"), pop = document.getElementById("ccPop");
  const MES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const DIA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const START = new Date(2026, 9, 26); // week 0 (prep) starts Mon 26 oct 2026
  const day = (wk, d) => { const x = new Date(START); x.setDate(x.getDate() + wk * 7 + d); return x; };
  const fmt = (x) => `${x.getDate()} ${MES[x.getMonth()].slice(0, 3)}`;
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  // series metadata: [class, pilar, objetivo, pide, se mide con, formato, estructura]
  const SER = [
    ["Te encontraste", "te", "Momentos reales", "Descubrimiento", "«Mándaselo a…»", "% visto completo y envíos", "POV / sketch · 10–20 s", "«Te encontraste…» + situación en 3 tomas + giro + la barra al final"],
    ["¿Dónde te encontraste", "do", "Encuentros", "Reconocimiento", "Seguir la serie", "Visitas al perfil por 1,000", "Calle · 20–40 s", "Pregunta fija a cámara + respuesta + sticker del lugar + barra de regalo"],
    ["Ruta FIBO", "ru", "Encuentros", "Reconocimiento", "«Guárdalo»", "Guardados y envíos", "Ruta · 20–40 s", "3 paradas + costo aproximado + FIBO en la mochila"],
    ["Prueba a ciegas", "pr", "Sabor y producto", "Prueba", "«¿Cuál pruebas primero?»", "Comentarios de intención", "Prueba de sabor · 20–45 s", "Venda + bocado + calificación + revelación"],
    ["Te respondo", "re", "Sabor y producto", "Consideración", "«Pregúntanos lo que quieras»", "Guardados y búsquedas", "Respuesta a comentario · 15–30 s", "Sticker del comentario + respuesta en menos de 30 s"],
    ["Hecho en Zapopan", "he", "Comunidad y casa", "Confianza", "Seguir", "Visitas al perfil", "Detrás de cámaras · 15–40 s", "Persona del equipo + una cosa que hace + dato curioso"],
    ["Encuentros FIBO", "en", "Encuentros", "Descubrimiento / prueba", "«Comenta tu sabor»", "Comentarios de intención", "Repost de creador · el original", "Video del nanocreador + repost con permiso escrito + Story"],
    ["Tendencia", "tr", "Según la tendencia", "Descubrimiento", "—", "% alcance a no seguidores", "Tendencia adaptada · 7–15 s", "Pasa el filtro de 5 preguntas o se cambia por un «Te encontraste…» extra. Audio con licencia."],
  ];
  const carObj = (t) => /Dónde encontrar/.test(t) ? ["Compra", "«Búscala en tu 7-Eleven»", "Guardados y DMs «¿dónde?»"]
    : /Qué es|4 sabores|Qué trae/.test(t) ? ["Consideración", "«Guárdalo»", "Guardados por 1,000"]
    : /Resultados|encontramos|aprendimos/.test(t) ? ["Comunidad", "«Comenta»", "Comentarios útiles"]
    : ["Reconocimiento", "«Guárdalo y mándaselo a…»", "Guardados y envíos"];
  const meta = (t) => SER.find((s) => t.startsWith(s[0])) || SER[7];

  // posting slots: [day index, time, duration(h), platform, field index, label]
  // research-based slots: Tue/Wed/Thu are strongest on both platforms; Fri 6 pm for TikTok; weekends weakest on Instagram
  const SLOT = [[1, 18, 1.6, "tt ig", 1, "TikTok + Reel"], [2, 12, 1.6, "ig", 4, "Carrusel IG"], [3, 14, 1.6, "tt ig", 2, "TikTok + Reel"], [4, 18, 1.6, "tt ig", 5, "TikTok + Reel"]];
  const STD = [0, 1, 2, 3, 4], STT = 8;
  const PROD = [[0, 9, 2, "Métricas + tendencias", "Revisar la semana anterior en el tablero, Creative Center, búsquedas y comentarios; elegir ideas del banco."],
                [1, 9, 2.5, "Guiones + claims", "Escribir guiones y copys de la semana siguiente y mandarlos a revisión de Legal/Calidad."],
                [2, 14, 3, "Rodaje en lote", ""], [3, 9, 3, "Edición y diseño", "Editar, armar carrusel y portadas, sacar versión TikTok y versión Instagram sin marca de agua."],
                [4, 9, 1, "Aprobación", "Alejandro aprueba y se programa todo."]];
  const PREP = [[0, 9, 3, "Cuentas profesionales", "Pasar Instagram a perfil de empresa y TikTok a Business; cuentas indexables; nombre «FIBO · Barra de proteína»; bio «Hecha en Zapopan · En 7-Eleven»."],
                [1, 9, 2, "Lista de tiendas", "Con Comercial: lista de 7-Eleven con FIBO confirmada e inventario de fibo.mx. Sin esto se posponen las piezas con *."],
                [2, 9, 4, "Rodaje semana 1", ""], [3, 9, 2, "Texto legal", "Qué se puede decir de proteína, fibra y sellos; formato de cesión de imagen revisado por Legal."],
                [3, 12, 2, "Plantillas", "Plantillas visuales: azul en diagonal, Anton + Archivo, sticker de serie, tarjeta de cierre."],
                [4, 9, 2, "Destacadas + UTM", "Destacadas «Sabores», «Dónde», «Comunidad»; enlace con UTM a fibo.mx por plataforma; tablero listo."]];
  const KEY = { "2026-11-28": "Arranca la FIL", "2026-12-06": "Cierra la FIL", "2026-12-24": "Nochebuena", "2026-12-25": "Navidad", "2026-12-31": "Fin de año", "2027-01-01": "Año Nuevo", "2027-01-06": "Reyes" };
  const PH = (wk) => wk === 0 ? ["Fase 0 · Base", "Preparar cuentas, tiendas, texto legal y plantillas"] : wk <= 4 ? ["Fase 1 · Línea base", wk === 4 ? "Cierre: calcular la mediana por formato" : "Publicar y medir todo, sin juzgar"]
    : wk <= 8 ? ["Fase 2 · Ajuste", wk === 6 ? "Revisión de mitad: rebalancear pilares" : "Reglas de decisión y experimentos de gancho y duración"] : ["Fase 3 · Escala", wk === 12 ? "Decidir escenario del siguiente trimestre" : "Más de lo que funcionó; 2–3 piezas candidatas a pauta"];
  const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  const hh = (t) => `${String(Math.floor(t)).padStart(2, "0")}:${t % 1 ? "30" : "00"}`;

  let wk = 1, view = "week"; const F = { tt: true, ig: true, st: true, pr: false };
  const H0 = 8, H1 = 21;

  const events = (k) => {
    const ev = [];
    if (k > 0) {
      const W = D.weeks[k - 1];
      SLOT.forEach(([d, t, h, pl, i, lab]) => {
        const title = W[i], car = i === 4, m = meta(title);
        const [obj, cta, met] = car ? carObj(title) : [m[3], m[4], m[5]];
        ev.push({ d, t, h, kind: "post", pl, cls: car ? "ca" : m[1], title: title.replace("*", ""), cond: title.endsWith("*"), lab,
          pil: car ? "Carrusel IG" : m[2], obj, cta, met, fmt: car ? "Carrusel · 5–8 láminas" : m[6], how: car ? "Portada con pregunta → respuesta → cierre «guárdalo». Texto alternativo y palabra clave en las primeras 125 letras." : m[7] });
      });
      STD.forEach((d, n) => ev.push({ d, t: STT, h: .75, kind: "st", pl: "st", cls: "st", title: W[6] + (W[3].startsWith("Te respondo") && n === 2 ? " + " + W[3].replace("*", "") : ""), lab: `Stories ${n + 1}/5`, pil: "Comunidad", obj: "Comunidad", cta: "Votar o responder", met: "Respuestas y toques en enlace", fmt: "Secuencia de 3–6 historias", how: "Encuesta → resultado → enlace. Se guarda en destacadas." }));
    }
    (k === 0 ? PREP : PROD).forEach(([d, t, h, title, how]) => {
      if (!how) { const nx = D.weeks[k]; how = nx ? `Tarde por locación. Graba los 3 videos de la semana ${k + 1}: ${[nx[1], nx[2], nx[5]].map((s) => s.replace("*", "")).join(" · ")}. El carrusel «${nx[4].replace("*", "")}» se diseña el jueves.` : "Sin rodaje: cierre del trimestre."; }
      ev.push({ d, t, h, kind: "pr", pl: "pr", cls: "pd", title, lab: "Producción", how, obj: "Producción", fmt: `${hh(t)} – ${hh(t + h)}` });
    });
    return ev;
  };
  const shown = (e) => e.kind === "pr" ? F.pr || wk === 0 : e.kind === "st" ? F.st : e.pl.split(" ").some((p) => F[p]);

  const renderWeek = () => {
    const mon = day(wk, 0), sun = day(wk, 6);
    document.getElementById("ccMonth").textContent = cap(MES[mon.getMonth()]) + (mon.getMonth() !== sun.getMonth() ? "–" + MES[sun.getMonth()] : "");
    const [ph, phd] = PH(wk), W = wk ? D.weeks[wk - 1] : null;
    const seas = [4, 6, 7, 8, 9, 10, 11].includes(wk);
    document.getElementById("ccInfo").innerHTML = `<b>${wk ? "Semana " + wk : "Semana 0"}</b><span>${fmt(mon)} – ${fmt(sun)} ${sun.getFullYear()}</span><em>${ph}</em><span class="cc__phd">${phd}</span>${seas ? '<em class="t">De temporada</em>' : ""}${wk ? `<span class="cc__cnt">${F.tt || F.ig ? "3 videos (TikTok + Reel) + 1 carrusel" : ""}${F.st ? " · 1 secuencia de Stories" : ""}</span>` : '<span class="cc__cnt">Sin publicaciones · preparación</span>'}`;
    const ev = events(wk).filter(shown);
    const rows = [];
    for (let h = H0; h <= H1; h++) rows.push(`<span style="--r:${h - H0}">${hh(h)}</span>`);
    const today = (x) => iso(x) === iso(new Date());
    board.innerHTML = `<div class="cc__head"><i></i>${DIA.map((n, d) => { const x = day(wk, d), k = KEY[iso(x)]; return `<p class="${d === 0 ? "first" : ""}"><span>${n}</span><b class="${today(x) ? "now" : ""}">${x.getDate()}</b>${k ? `<em>${k}</em>` : ""}</p>`; }).join("")}</div>
      <div class="cc__grid" style="--rows:${H1 - H0 + 1}"><div class="cc__hrs">${rows.join("")}</div>${DIA.map((_, d) => `<div class="cc__col" data-d="${d}"></div>`).join("")}
      ${ev.map((e, i) => `<button class="cc__ev s-${e.cls}${e.cond ? " cond" : ""}${e.kind === "st" ? " stv" : ""}" data-i="${i}" style="--d:${e.d};--t:${e.t - H0};--h:${e.h};--n:${i}"><b>${e.kind === "st" ? e.lab : e.title}</b><span>${e.kind === "st" ? hh(e.t) : e.kind === "pr" ? e.fmt : hh(e.t) + " · " + e.lab}</span></button>`).join("")}</div>
      <div class="cc__agenda">${DIA.map((n, d) => { const x = day(wk, d), de = ev.map((e, i) => [e, i]).filter(([e]) => e.d === d).sort((a, b) => a[0].t - b[0].t); return `<div class="cc__ad"><p><b>${n} ${x.getDate()}</b>${KEY[iso(x)] ? `<em>${KEY[iso(x)]}</em>` : ""}</p>${de.length ? de.map(([e, i]) => `<button class="cc__ev s-${e.cls}${e.cond ? " cond" : ""}" data-i="${i}"><b>${e.kind === "st" ? e.lab + " · " + e.title : e.title}</b><span>${e.kind === "pr" ? e.fmt : hh(e.t) + " · " + e.lab}</span></button>`).join("") : '<span class="cc__empty">—</span>'}</div>`; }).join("")}</div>`;
    board._ev = ev; hidePop();
    if (root.classList.contains("cc--anim")) { board.classList.remove("go"); void board.offsetWidth; board.classList.add("go"); }
  };

  const renderAll = () => {
    document.getElementById("ccMonth").textContent = "Nov – Ene";
    document.getElementById("ccInfo").innerHTML = `<b>12 semanas</b><span>2 nov 2026 – 24 ene 2027</span><em>Toca una semana para abrirla</em>`;
    all.innerHTML = `<div class="cc__ah"><span></span>${DIA.map((n) => `<span>${n}</span>`).join("")}</div>` + D.weeks.map((W, k) => {
      const n = k + 1, ph = PH(n)[0].split(" · ")[1];
      const cell = (d) => { const s = SLOT.find((x) => x[0] === d), x = day(n, d), key = KEY[iso(x)];
        const p = s ? (() => { const t = W[s[4]], m = s[4] === 4 ? "ca" : meta(t)[1]; return `<i class="s-${m}${t.endsWith("*") ? " cond" : ""}">${t.replace("*", "")}</i>`; })() : "";
        return `<p><small>${x.getDate()} ${MES[x.getMonth()].slice(0, 3)}${key ? " · " + key : ""}</small>${p}${STD.includes(d) && F.st ? '<i class="s-st dot" title="Stories"></i>' : ""}</p>`; };
      return `<button class="cc__ar${[4, 6, 7, 8, 9, 10, 11].includes(n) ? " t" : ""}" data-w="${n}" style="--n:${k}"><span class="cc__aw"><b>S${n}</b>${ph}</span>${DIA.map((_, d) => cell(d)).join("")}</button>`;
    }).join("");
  };

  const render = () => { const wv = view === "week"; board.hidden = !wv; all.hidden = wv; root.querySelector(".cc__nav").classList.toggle("off", !wv); wv ? renderWeek() : renderAll(); };

  const hidePop = () => { pop.hidden = true; board.querySelectorAll(".cc__ev.sel").forEach((x) => x.classList.remove("sel")); };
  board.addEventListener("click", (ev) => {
    const b = ev.target.closest(".cc__ev"); if (!b) return;
    const e = board._ev[+b.dataset.i], x = day(wk, e.d);
    board.querySelectorAll(".cc__ev.sel").forEach((y) => y.classList.remove("sel")); b.classList.add("sel");
    const pls = e.kind === "pr" ? ["Equipo"] : e.pl.split(" ").map((p) => ({ tt: "TikTok", ig: e.cls === "ca" ? "Instagram · carrusel" : "Instagram · Reel", st: "Instagram · Stories" })[p]);
    pop.innerHTML = `<button class="cc__x" aria-label="Cerrar">×</button><p class="cc__pk s-${e.cls}">${e.kind === "pr" ? "Producción" : e.pil}</p><h4>${e.kind === "st" ? "Stories · " + e.title : e.title}</h4>
      <p class="cc__chips"><span>${fmt(x)}</span><span>${DIA[e.d]}</span><span>${e.kind === "pr" ? e.fmt : hh(e.t)}</span>${pls.map((p) => `<span class="pl">${p}</span>`).join("")}</p>
      ${e.kind === "pr" ? `<p class="cc__how">${e.how}</p>` : `<dl><div><dt>Objetivo</dt><dd>${e.obj}</dd></div><div><dt>Formato</dt><dd>${e.fmt}</dd></div><div><dt>Pide</dt><dd>${e.cta}</dd></div><div><dt>Se mide con</dt><dd>${e.met}</dd></div></dl>
      <p class="cc__how"><b>Estructura:</b> ${e.how}</p>${e.cond ? '<p class="cc__warn">Condicionada: requiere lista de tiendas confirmada o visto bueno de Legal. Si no está a tiempo, se cambia por una idea del banco.</p>' : ""}
      <p class="cc__rule">Antes de publicar: sin claims de salud · música con licencia · permisos firmados · cierre «Con FIBO te encuentras»</p>`}
      <a class="cc__btn" href="#sc-${e.kind === "pr" ? "11" : e.cls === "ca" ? "09" : "08"}">${e.kind === "pr" ? "Ver flujo de producción" : "Ver la serie en la estrategia"}</a>`;
    pop.hidden = false;
    const pr = root.querySelector(".cc__panel").getBoundingClientRect(), br = b.getBoundingClientRect();
    if (innerWidth > 860) {
      let l = br.right - pr.left + 10; if (l + 340 > pr.width) l = br.left - pr.left - 350;
      pop.style.left = Math.max(10, l) + "px"; pop.style.top = Math.max(10, Math.min(br.top - pr.top - 20, pr.height - pop.offsetHeight - 10)) + "px";
    } else { pop.style.left = ""; pop.style.top = ""; }
  });
  pop.addEventListener("click", (e) => { if (e.target.closest(".cc__x")) hidePop(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hidePop(); });
  document.addEventListener("click", (e) => { if (!pop.hidden && !e.target.closest(".cc__pop, .cc__ev")) hidePop(); });
  all.addEventListener("click", (e) => { const r = e.target.closest(".cc__ar"); if (!r) return; wk = +r.dataset.w; view = "week"; setView(); render(); });

  const vb = [...root.querySelectorAll(".cc__view button")];
  const setView = () => vb.forEach((b) => b.classList.toggle("on", b.dataset.v === view));
  vb.forEach((b) => b.addEventListener("click", () => { view = b.dataset.v; setView(); render(); }));
  document.getElementById("ccPrev").addEventListener("click", () => { wk = Math.max(0, wk - 1); render(); });
  document.getElementById("ccNext").addEventListener("click", () => { wk = Math.min(12, wk + 1); render(); });
  root.querySelectorAll(".cc__flt button").forEach((b) => b.addEventListener("click", () => { F[b.dataset.f] = !F[b.dataset.f]; b.classList.toggle("on", F[b.dataset.f]); render(); }));

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.add("cc--anim");
  render();
})();
