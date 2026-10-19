// Message system: a dashboard-style app — architecture timeline, "your day" schedule, and each occasion's message rendered as the real piece (talker, story, post, chat…).
(() => {
  const sec = document.getElementById("mensajes");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const I = {
    bus: "M5 4h14v12H5zM5 11h14M8 19v-3M16 19v-3M8 14h.01M16 14h.01", book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7",
    lap: "M4 5h16v10H4zM2 19h20", gym: "M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12", cup: "M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2",
    car: "M3 13l2-6h14l2 6v5H3zM3 13h18M7 18v2M17 18v2M7 15h.01M17 15h.01", chat: "M4 5h16v11H9l-5 4z", shelf: "M3 4h18M3 12h18M3 20h18M6 4v16M18 4v16",
    check: "M5 12l4 4 10-10", target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2",
    shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5", pin: "M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5",
    shuffle: "M3 7h4l10 10h4M17 21l4-4-4-4M3 17h4l3-3M14 10l3-3h4M17 3l4 4-4 4", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2", battery: "M3 8h15v8H3zM21 11v2M6 11h9v2H6z",
    coins: "M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zM5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5", cookie: "M12 3a9 9 0 1 0 9 9 3 3 0 0 1-3-3 3 3 0 0 1-3-3 3 3 0 0 1-3-3M8 10h.01M10 15h.01M15 14h.01",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7z", leaf: "M5 19C5 10 11 4 20 4c0 9-6 15-15 15zM5 19l8-8", ruler: "M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2",
    palette: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.7 1.5-1.5S13 18 13 17a2 2 0 0 1 2-2h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8zM7.5 11h.01M10 7.5h.01M15 7.5h.01", flame: "M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7z",
    cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9", oct: "M8 3h8l5 5v8l-5 5H8l-5-5V8zM12 8v5M12 16h.01", heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
    play: "M5 4h14v16H5zM10 9l5 3-5 3z", mega: "M3 10v4h3l6 4V6L6 10zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12", gift: "M3 9h18v4H3zM5 13h14v8H5zM12 9v12M12 9C9 9 7 4 10 4s2 5 2 5 0-5 2-5 1 5-2 5",
    cart: "M3 4h2l2.5 11h11L21 7H7M10 20h.01M17 20h.01", brief: "M3 7h18v13H3zM8 7V4h8v3M3 12h18", box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
    seed: "M12 20c-4 0-6-3-6-6s3-6 6-9c3 3 6 6 6 9s-2 6-6 6z", sprout: "M12 21v-9M12 12C12 7 8 5 4 5c0 4 3 7 8 7zM12 14c0-4 3-6 7-6 0 3-2 6-7 6z", tree: "M12 21v-6M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6", search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M21 21l-5-5", loop: "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
    layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5", ppl: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M2 20c0-3.3 2.7-5 6-5s6 1.7 6 5M14 15.3c.6-.2 1.3-.3 2-.3 3.3 0 6 1.7 6 5",
    mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3M5 11a7 7 0 0 0 14 0M12 18v3", grid: "M4 4h7v7H4zM13 13h7v7h-7zM13 4h7v7h-7zM4 13h7v7H4z", star: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7z", flag: "M5 21V4l12 4-12 4", tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",
  };
  const BAR = { br: "assets/fibo-brownie.webp", ch: "assets/fibo-chocolate.webp", ck: "assets/fibo-cookies.webp", fr: "assets/fibo-frutos.webp" };

  /* principles + architecture */
  $("mxPr").innerHTML = [["Coherencia", "Una misma idea de marca y una misma promesa."], ["Credibilidad", "Cada atributo con pruebas verificables."], ["Relevancia", "Responde a una ocasión real del consumidor de GDL."], ["Adaptabilidad", "Argumento, tono y CTA cambian por audiencia y canal."], ["Orientación al negocio", "Mover reconocimiento, prueba, compra y recompra."]]
    .map(([a, b], i) => `<li><b class="mono">0${i + 1}</b><div><strong>${a}</strong><span>${b}</span></div></li>`).join("");
  const LV = [["Propósito", "Que comer bien se disfrute, no se cumpla.", "Por qué existe FIBO · uso interno"], ["Concepto rector", "Con FIBO te encuentras.", "Idea de marca: presencia y compañía en tu día"],
    ["Promesa", "Una barra que sí te llena.", "La razón para comprarla"], ["Pilares", "Te llena · Rinde más · Hecha aquí · Antojo · Encuentra FIBO", "Los temas que sostienen la promesa"], ["Mensajes tácticos", "Frases por ocasión, audiencia, canal y etapa", "Lo que se publica"]];
  $("mxLv").innerHTML = LV.map(([n, m, f], i) => `<li style="--d:${i * 0.1}s;--p:${(i + 1) / 5}"><span class="dot">${i}</span><article><p class="t"><span class="mono">0${i} / 04</span><i>···</i></p><small>${n}</small><h5>${m}</h5><p class="mono f">${f}</p><div class="prog"><i></i></div></article></li>`).join("");

  /* occasions: data + mock renderers */
  const OC = [
    { k: "tr", t: "07:30", n: "En traslados", i: I.bus, ctx: "79 min al día en traslados; 43% de los viajes son a pie.", msg: "Hay encuentros que pasan entre una parada y otra.", ap: "Tu día no para. Tu barra tampoco.", cta: "Búscala en el 7-Eleven de tu ruta", where: "Tiendas junto a Línea 3, Mi Macro y Macrobús; video vertical", m: "story" },
    { k: "cl", t: "10:00", n: "Entre clases", i: I.book, ctx: "~340 mil estudiantes de media superior y superior en la UdeG.", msg: "Entre clase y clase, una barra que sí te llena.", ap: "¿Team brownie o cookies & cream?", cta: "Elige tu sabor", where: "Tiendas frente a campus; embajadores; cafeterías vía concesionario*", m: "post" },
    { k: "sn", t: "12:00", n: "Snack entre comidas", i: I.cup, ctx: "Solo 23% no come entre comidas.", msg: "Que el hambre espere.", ap: "Sabe a postre. Y sí te llena.", cta: "Cámbiale al pan dulce", where: "Abarrotes, carnicerías, conveniencia de colonia", m: "strip" },
    { k: "jo", t: "17:00", n: "Jornada laboral", i: I.lap, ctx: "41.8 horas a la semana en promedio.", msg: "Pendientes sí. Hambre no.", ap: "Para el hambre de las cinco · Cuando la comida todavía no llega", cta: "Llévatela a la oficina", where: "Andares, Providencia, Chapultepec, El Salto; redes", m: "notif" },
    { k: "en", t: "19:30", n: "Después de entrenar", i: I.gym, ctx: "Vía RecreActiva: 100–300 mil personas por domingo; ~150 gimnasios.", msg: "22 g después de entrenar. Sin batido, sin shaker.", ap: "Tu día no para. Tu barra tampoco.", cta: "Pruébala aquí", where: "Gimnasios, Colomos, carreras, pádel", m: "poster" },
    { k: "vi", t: "Sáb", n: "Viajes y recreación", i: I.car, ctx: "33 M de visitantes en Jalisco en 2025; escapadas a Tapalpa, Mazamitla, Chapala.", msg: "Para el camino, la que sí te llena.", ap: "De Zapopan a tu mochila.", cta: "Llévate el pack", where: "Carreteras, Pueblos Mágicos, Amazon y fibo.mx", m: "shop" },
    { k: "co", t: "Dom", n: "Compartir", i: I.chat, ctx: "Amigos, roomies, grupo de trabajo.", msg: "Cada quien encuentra su FIBO.", ap: "¿Quién de tu grupo es Team Brownie?", cta: "Comparte tu sabor", where: "Redes, dinámicas de sabores", m: "chat" },
    { k: "an", t: "Siempre", n: "Al elegir en el anaquel", i: I.shelf, ctx: "Decisión de segundos, por impulso.", msg: "Una barra que sí te llena.", ap: "22 g de proteína · Más del doble que una de 10", cta: "Llévatela", where: "Talker, tira de anaquel, junto al café", m: "talker" },
  ];
  const MOCK = {
    story: (o) => `<div class="mx__phone"><div class="scr story"><div class="bars"><i class="on"></i><i></i><i></i></div><p class="hd"><span class="av">F</span><b>fibo.mx</b><small>· Patrocinado</small></p>
      <div class="route"><svg viewBox="0 0 200 300"><path class="ln" fill="none" d="M20 280 C 60 220, 30 160, 100 130 S 170 60, 180 20"/><circle cx="20" cy="280" r="6"/><circle cx="100" cy="130" r="6"/><circle cx="180" cy="20" r="6"/><circle class="me" r="7"><animateMotion dur="5s" repeatCount="indefinite" path="M20 280 C 60 220, 30 160, 100 130 S 170 60, 180 20"/></circle></svg><span class="mxst a mono">Parada</span><span class="mxst b mono">7-Eleven</span><span class="mxst c mono">Línea 3</span></div>
      <h4>${o.msg}</h4><img class="bar" src="${BAR.ch}" alt=""><p class="ap">${o.ap}</p><span class="cta">${o.cta} ›</span></div></div>`,
    post: (o) => `<div class="mx__phone"><div class="scr post"><p class="hd"><span class="av">F</span><b>fibo.mx</b><i>···</i></p>
      <div class="img"><img class="b1" src="${BAR.br}" alt=""><img class="b2" src="${BAR.ck}" alt=""><span class="vs">VS</span><div class="poll" id="mxPoll"><b>${o.ap}</b><button type="button" data-v="0"><span>Team Brownie</span><em>58%</em><i style="--w:58%"></i></button><button type="button" data-v="1"><span>Team Cookies</span><em>42%</em><i style="--w:42%"></i></button></div></div>
      <p class="act">♡ ○ ➤<span>⌑</span></p><p class="cap"><b>fibo.mx</b> ${o.msg} ${o.cta} 👇</p><p class="mono tm">Encuesta de ejemplo · resultados ilustrativos</p></div></div>`,
    strip: (o) => `<div class="mx__shelf"><div class="row"><img src="${BAR.br}" alt=""><img src="${BAR.ch}" alt=""><img src="${BAR.fr}" alt=""><img src="${BAR.ck}" alt=""></div>
      <div class="strip"><b>${o.msg}</b><span>${o.ap}</span><em>${o.cta} →</em><i class="logo">FIBO</i></div><div class="row low"><span class="pan">🥐 pan dulce</span><span class="pan">🍪 galletas</span></div><p class="mono lb">Tira de anaquel · abarrotes y conveniencia</p></div>`,
    notif: (o) => `<div class="mx__phone"><div class="scr lock"><p class="mxclk">16:58</p><p class="dt mono">jueves · Guadalajara</p>
      <div class="nt cal"><span class="ap">▦</span><div><b>Junta de cierre</b><small>17:00 – 18:00 · Sala 2</small></div><em>ahora</em></div>
      <div class="nt fibo"><span class="ap">F</span><div><b>${o.msg}</b><small>${o.ap.split(" · ")[0]}. ${o.cta}.</small></div><em>1 min</em></div>
      <div class="nt mail"><span class="ap">✉</span><div><b>Pendientes (12)</b><small>Revisar presentación…</small></div><em>5 min</em></div></div></div>`,
    poster: (o) => `<div class="mx__poster"><span class="mono tg">GIMNASIO · CARTEL</span><h4>22 g<br><span>después de entrenar.</span></h4><p>Sin batido, sin shaker.</p><img src="${BAR.ch}" alt=""><div class="ft"><span class="qr" aria-hidden="true"></span><b>${o.cta}</b><i>FIBO</i></div></div>`,
    shop: (o) => `<div class="mx__shop"><div class="bar"><span>fibo.mx</span><i>🛒 1</i></div><div class="bd"><div class="pk"><img src="${BAR.br}" alt=""><img src="${BAR.ch}" alt=""><img src="${BAR.fr}" alt=""><img src="${BAR.ck}" alt=""></div>
      <div><small class="mono">Pack 4 sabores</small><h4>${o.msg}</h4><p>${o.ap}</p><ul><li>22 g de proteína</li><li>10 g de fibra</li><li>Hecha en Jalisco</li></ul><span class="btn">${o.cta}</span></div></div></div>`,
    chat: (o) => `<div class="mx__phone"><div class="scr chat"><p class="hd"><b>Los de la ofi 🏢</b><small>5 integrantes</small></p>
      <p class="m l"><small>Dani</small>¿alguien trae algo de comer? 🙃</p>
      <div class="m r card"><small class="mono">fibo.mx · compartido</small><b>${o.msg}</b><span>${o.ap}</span><img src="${BAR.br}" alt=""></div>
      <p class="m l"><small>Ale</small>yo team brownie siempre</p><p class="m l"><small>Caro</small>cookies & cream > todo 🍪</p>
      <p class="m r">${o.cta} 👉 encuesta en el grupo</p><p class="mono tm">Conversación ilustrativa</p></div></div>`,
    talker: (o) => `<div class="mx__store"><div class="shelf"><div class="pr"><img src="${BAR.br}" alt=""><img src="${BAR.ch}" alt=""><img src="${BAR.fr}" alt=""><img src="${BAR.ck}" alt=""></div><div class="edge"></div>
      <div class="tk"><i class="hook"></i><b>${o.msg}</b><span>${o.ap.replace(" · ", "<br>")}</span><em>${o.cta}</em><i class="lg">FIBO</i></div></div><p class="mono lb">Talker · 7-Eleven · junto al café</p></div>`,
  };
  const sbtn = $("mxSbtn"), stage = $("mxStage"), sr = $("mxSr"), askW = $("mxAskW");
  sbtn.innerHTML = OC.map((o, i) => `<button type="button" data-i="${i}">${ic(o.i)}<span>${o.n}</span></button>`).join("");
  const sb = [...sbtn.children];
  const pick = (i) => {
    const o = OC[i]; sb.forEach((b, k) => b.classList.toggle("on", k === i));
    askW.textContent = o.n.toLowerCase();
    stage.innerHTML = `<div class="mx__mock">${MOCK[o.m](o)}</div>`;
    sr.innerHTML = `<p class="mx__k mono">Ficha de la ocasión</p><div class="mx__in"><span>${ic(I.flag)}</span><div><small class="mono">Contexto en GDL</small><p>${o.ctx}</p></div></div><div class="mx__in"><span>${ic(I.chat)}</span><div><small class="mono">Mensaje principal</small><p><b>${o.msg}</b></p></div></div><div class="mx__in"><span>${ic(I.tag)}</span><div><small class="mono">De apoyo</small><p>${o.ap}</p></div></div><div class="mx__in"><span>${ic(I.check)}</span><div><small class="mono">CTA</small><p>${o.cta}</p></div></div><div class="mx__in"><span>${ic(I.shelf)}</span><div><small class="mono">Dónde</small><p>${o.where}</p></div></div>`;
    const poll = $("mxPoll"); if (poll) poll.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => poll.classList.add("voted")));
  };
  sb.forEach((b, i) => b.addEventListener("click", () => pick(i))); pick(7);

  /* "your day" schedule with a live time marker */
  const sched = $("mxSched");
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })), hh = now.getHours() + now.getMinutes() / 60;
  const hrs = OC.map((o) => (/^\d/.test(o.t) ? +o.t.slice(0, 2) + +o.t.slice(3) / 60 : 99));
  let cur = hrs.findIndex((h, i) => h <= hh && (hrs[i + 1] === undefined || hrs[i + 1] > hh || hrs[i + 1] === 99)); if (cur < 0) cur = 0;
  const pad = (n) => String(n).padStart(2, "0");
  sched.innerHTML = OC.map((o, i) => `${i === cur + 1 && hrs[cur] !== 99 ? `<div class="mx__now"><span class="mono">${pad(now.getHours())}:${pad(now.getMinutes())}</span></div>` : ""}<div class="mx__slot"><span class="mono tt">${o.t}</span><button type="button" class="mx__ev${i === cur ? " cur" : ""}" data-i="${i}"><span class="tp mono">${o.t}${o.t.includes(":") ? " · " + o.n.split(" ")[0] : ""}<i>✓</i></span><i class="more">···</i><small>${o.n}</small><b>${o.msg}</b></button></div>`).join("");
  const evs = [...sched.querySelectorAll(".mx__ev")];
  evs.forEach((b) => b.addEventListener("click", () => { pick(+b.dataset.i); $("mxSit").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }));
  let si = cur; const focus = (d) => { si = (si + d + OC.length) % OC.length; evs.forEach((e, k) => e.classList.toggle("cur", k === si)); evs[si].scrollIntoView({ block: "nearest", inline: "nearest" }); };
  $("mxPrev").addEventListener("click", () => focus(-1)); $("mxNext").addEventListener("click", () => focus(1));

  /* pillars */
  const PI = [I.battery, I.coins, I.pin, I.cookie, I.search];
  const PIL = [["A", "Te llena", "beneficio principal", "Dar la razón número uno para elegir FIBO.", "Una barra que sí te llena.", ["Para el hambre de las cinco", "Que el hambre espere", "Cuando la comida todavía no llega", "Pendientes sí. Hambre no."], "22 g de proteína y 10 g de fibra en 65 g; consumidores que la describen como «llenadora».", "Es lenguaje del consumidor, no un claim clínico. Nunca con horas ni comparaciones de saciedad.", "#D6161D"],
    ["B", "Rinde más", "valor", "Justificar por qué cuesta más que una barra de 25 pesos.", "Más barra, más proteína, por lo que pagas.", ["22 g: más del doble que una de 10", "Más proteína por tu dinero", "Paga por proteína, no por empaque"], "22 g contra 10 g de las masivas; $19.55 por cada 10 g en fibo.mx contra $33–35 de las importadas.", "«Más proteína por tu dinero» solo en línea y frente a importadas. En 7-Eleven el precio por gramo empata con Wild Protein y 7-Select.", "#3A5CFF"],
    ["C", "Hecha aquí, para tu día", "marca y ciudad", "Dar a FIBO una identidad que nadie más puede copiar.", "Hecha en Jalisco para los días que no paran.", ["Con FIBO te encuentras: en el camión, entre juntas, después del gym", "De Zapopan a tu mochila", "Tu día no para. Tu barra tampoco."], "Fabricada en la planta de El Molino en Zapopan; presente en 7-Eleven, gimnasios y tiendas de Guadalajara.", "", "#0C0B0A"],
    ["D", "Antojo", "sabor", "Que la barra se antoje y no se sienta como suplemento.", "Sabe a postre. Y sí te llena.", ["¿Con cuál FIBO te encuentras hoy?", "Cookies & Cream, pero con 22 g de proteína", "Se te antoja. Y te llena."], "Cuatro sabores de postre.", "Escalar solo cuando la prueba de sabor confirme la textura.", "#FF89B8"],
    ["E", "Encuentra FIBO", "disponibilidad", "Acortar la distancia entre el interés y la compra.", "Está más cerca de lo que crees.", ["Búscala en tu 7-Eleven", "¿Sí te llenó? Está a una cuadra", "Pídela en Amazon o fibo.mx"], "", "Activar solo donde el inventario y el sabor estén confirmados. Si FIBO no está donde dice, el concepto rector pierde credibilidad.", "#C9F23A"]];
  const pt = $("mxPtabs"), pv = $("mxPv");
  pt.innerHTML = PIL.map(([l, n], i) => `<button type="button" style="--c:${PIL[i][8]}"><b>${ic(PI[i])}</b>${n}</button>`).join("");
  const pbs = [...pt.children];
  const showPil = (i) => { pbs.forEach((b, k) => b.classList.toggle("on", k === i)); const [l, n, s, f, m, ap, pr, cu, c] = PIL[i];
    pv.innerHTML = `<div class="mx__pm" style="--c:${c}"><span class="pic">${ic(PI[i])}</span><p class="mono">${l} · ${n} <span>(${s})</span></p><h4>«${m}»</h4><p class="fn">${f}</p></div>
      <div class="mx__pa"><p class="mx__k mono">Mensajes de apoyo</p>${ap.map((a) => `<span class="mx__bub">${a}</span>`).join("")}</div>
      <div class="mx__pp">${pr ? `<div><small class="mono">✓ Prueba</small><p>${pr}</p></div>` : ""}${cu ? `<div class="cu"><small class="mono">⚠ Cuidado</small><p>${cu}</p></div>` : ""}</div>`; };
  pbs.forEach((b, i) => b.addEventListener("click", () => showPil(i))); showPil(0);
  $("mxTac").innerHTML = [["Reconocimiento", "Con FIBO te encuentras."], ["Consideración", "22 g de proteína y 10 g de fibra en una barra de 65 g."], ["Prueba", "¿Cuál de los cuatro sabores vas a probar primero?"], ["Compra", "Una barra que sí te llena. Está en tu 7-Eleven."], ["Recompra", "Ya sabes cuál te llena. Llévate el pack."]]
    .map(([a, b], i) => `<div style="--d:${i * 0.08}s"><small class="mono">${a}</small><p>${b}</p></div>`).join("");

  /* product attributes */
  const AT = [["Proteína", "22 g por barra", "Mezcla de soya y suero de leche", "Prueba principal de la promesa", "Validar en lab los 4 sabores", "w"], ["Fibra", "10 g por barra", "", "Refuerza la saciedad", "Confirmar Cookies & Cream (una fuente dice 4 g)", "w"],
    ["Tamaño", "65 g", "De las más grandes del anaquel", "Dimensiona «rinde más»", "Verificado", "ok"], ["Sabores", "4", "Cookies & Cream, Chocolate, Brownie, Frutos Rojos", "Curiosidad y elección", "Ninguna cadena tiene los 4", "w"],
    ["Calorías", "230–250 kcal", "Según sabor", "Solo con la cifra exacta de cada sabor", "Faltan tablas de FR y C&C", "x"], ["Azúcares", "9–12 g", "Unos 4 g añadidos", "No se comunica como beneficio", "Confirmar por sabor", "w"],
    ["Sellos", "Calorías y grasas sat.", "Exceso de", "No se oculta ni se contradice", "Confirmar si aplica sello de sodio", "w"], ["Origen", "Zapopan", "Hecha en Jalisco por El Molino", "Diferenciador local", "Verificado", "ok"]];
  $("mxAttrs").innerHTML = AT.map(([a, d, s, r, e, st], i) => `<article class="mx__at ${st}" style="--d:${i * 0.06}s"><p class="t"><span class="mono">${a}</span><em class="mono">${st === "ok" ? "✓ Verificado" : st === "x" ? "✕ Falta" : "◔ Por validar"}</em></p><b>${d}</b><small>${s}</small><p>${r}</p>${st !== "ok" ? `<p class="mono e">${e}</p>` : ""}</article>`).join("");
  $("mxArg").innerHTML = [["22 g de proteína + 10 g de fibra", "Una barra que sí te llena", "Etiqueta, ficha técnica y prueba de sabor"], ["22 g contra 10 g de las masivas", "Rinde más por lo que pagas", "Comparación genérica, sin nombrar marcas"], ["65 g", "Más barra en la mano", "Peso neto declarado y foto real"], ["4 sabores de postre", "Se antoja, no sabe a suplemento", "Sampling y reseñas"], ["Hecha en Jalisco", "Una marca de aquí, que conoce tu día", "Planta propia en Zapopan"]]
    .map(([a, b, c]) => `<div><span class="mono">${a}</span><i>→</i><b>${b}</b><small>${c}</small></div>`).join("");
  $("mxHier").innerHTML = [["Campaña de marca", "Concepto rector, momentos de la ciudad, antojo; la promesa como remate."], ["Publicación de producto", "Promesa + sabor + 22 g y 10 g."], ["Punto de venta", "Promesa + 22 g · más del doble que una de 10 + los 4 colores de sabor."], ["Comparación en línea", "Datos objetivos, precio por gramo y packs."], ["Comprador comercial", "Hueco en el anaquel, rotación, margen, suministro y soporte de marca."]]
    .map(([a, b], i) => `<div><b class="mono">0${i + 1}</b><strong>${a}</strong><span>${b}</span></div>`).join("");

  /* audiences */
  const AU = [["5.1", "Joven activo en tránsito", "Prioritario · 20–29", "Una barra que sí te llena.", "Quitarse el hambre, el antojo, el precio por pieza y encontrarla en su camino.", "Promesa + sabor + 22 g de respaldo + disponibilidad cerca", "Cercano, con humor, tapatío sin estereotipos", ["Búscala en tu 7-Eleven", "Elige tu sabor", "Pruébala"], "Redes, video vertical, conveniencia, sampling con QR", "cr-correr", ""],
    ["5.2", "Universitarios", "", "Entre clase y clase, una barra que sí te llena.", "", "Sabores, rapidez, valor por lo que pagas", "", ["Elige tu sabor", "Búscala frente a tu campus"], "Embajadores, tiendas alrededor del campus, cafeterías vía concesionario*, redes", "pe-udg", ""],
    ["5.3", "Personas que trabajan", "", "Pendientes sí. Hambre no.", "", "La pausa que llena sin salir de la oficina; sabor; 22 g", "", ["Llévatela a la oficina", "Pack para la semana"], "7-Eleven en zonas de oficinas, redes, packs en línea", "cr-office", ""],
    ["5.4", "Activos y deportistas", "Secundario · 18–35", "22 g después de entrenar. Sin batido, sin shaker.", "", "Proteína y fibra declaradas, peso, tabla completa, sabor y precio", "Claro y preciso, sin exagerar", ["Pruébala en tu gimnasio", "Consulta la tabla", "Compra el pack"], "~150 gimnasios de Edgar García, carreras, pádel, Vía RecreActiva, creadores con credibilidad", "cr-cerro", "No asumir que buscan músculo o bajar de peso; no prometer recuperación ni rendimiento."],
    ["5.5", "Colación práctica", "", "Que el hambre espere.", "", "Alternativa al pan dulce; rinde más", "", ["Cámbiale al pan dulce"], "Abarrotes y carnicerías de Más Natural Más Sano, conveniencia de colonia", "cr-tienda", ""]];
  $("mxAudL").innerHTML = AU.map(([n, t, tag, m, imp, ar, to, cta, ch, img, cu], i) => `<article class="mx__au" style="--d:${i * 0.08}s"><figure><img src="assets/${img}.webp" alt=""><span class="mono">${n}</span>${tag ? `<em class="mono">${tag}</em>` : ""}</figure>
    <h5>${t}</h5><p class="mx__bub big">«${m}»</p>${imp ? `<p class="r"><small class="mono">Le importa</small>${imp}</p>` : ""}<p class="r"><small class="mono">Argumentos</small>${ar}</p>${to ? `<p class="r"><small class="mono">Tono</small>${to}</p>` : ""}
    <div class="ctas">${cta.map((c) => `<span>${c}</span>`).join("")}</div><p class="r ch"><small class="mono">Canales</small>${ch}</p>${cu ? `<p class="cu">⚠ ${cu}</p>` : ""}</article>`).join("");

  /* channels */
  const CH = [["Talker en 7-Eleven", "Ganar la compra de impulso", ["Una barra que sí te llena", "22 g · más del doble que una de 10", "logo"], "Llévatela"], ["Tira de anaquel / gancho junto al café", "Que la barra se vea", ["FIBO", "Una barra que sí te llena", "los 4 colores de sabor"], "—"],
    ["Empaque", "Identificar, informar, ayudar a elegir", ["Logo FIBO", "sabor", "22 g de proteína", "info obligatoria"], "—"], ["Redes orgánicas", "Reconocimiento y personalidad", ["Hook del momento", "promesa", "firma"], "Guarda, comenta, búscala"],
    ["Video vertical", "Curiosidad y ocasión", ["Gancho", "situación de GDL", "aparece FIBO", "promesa", "firma"], "Búscala en tu 7-Eleven"], ["Pauta digital", "Alcance y acción medible", ["Un objetivo por campaña"], "Según objetivo"],
    ["Sampling y activaciones", "Bajar la barrera de prueba", ["¿Ya probaste FIBO?", "Una barra que sí te llena", "QR"], "¿Sí te llenó? Está a una cuadra"], ["Gimnasio", "Prueba con alta intención", ["22 g después de entrenar", "Sin batido, sin shaker"], "Pruébala aquí"],
    ["Carreras y Vía RecreActiva", "Visibilidad con público activo", ["Tu día no para. Tu barra tampoco", "Con FIBO te encuentras"], "Encuéntrala cerca"], ["Amazon y fibo.mx", "Evaluación y compra", ["Una barra que sí te llena", "22 g + 10 g", "Más proteína por tu dinero", "Hecha en Jalisco"], "Agregar al carrito"],
    ["Presentación B2B", "Abrir la cuenta", ["El hueco en el anaquel", "FIBO lo llena", "fabricante propio y soporte"], "Agenda una reunión"]];
  $("mxChs").innerHTML = CH.map(([n, f, h, c], i) => `<article class="mx__cc" style="--d:${i * 0.05}s"><p class="t"><span class="mono">${String(i + 1).padStart(2, "0")}/11</span><i>···</i></p><h5>${n}</h5><small>${f}</small><div class="chain">${h.map((x) => `<span>${x}</span>`).join("<i>→</i>")}</div>${c !== "—" ? `<p class="cta"><span class="mono">CTA</span>${c}</p>` : ""}</article>`).join("");
  $("mxRules").innerHTML = `<p class="mx__k mono">Reglas por canal</p>` + [["Redes", "La interacción no es la meta: cada pieza deja claro qué es FIBO y por qué elegirla."], ["Video", "El foco es la situación real (el camión, la junta, la mordida), no una actuación."], ["Pauta", "Hipótesis, audiencia, pieza, presupuesto, indicador y criterio de éxito antes de activar. Con sellos: revisar con Álvaro si requiere aviso o permiso de COFEPRIS."], ["Punto de venta", "Solo funciona con inventario, los 4 sabores y precio legible."], ["Empaque", "Lo creativo nunca desplaza la información obligatoria; Calidad y Legal revisan todo."], ["Amazon", "Antes de pautar: ficha completa con Cookies & Cream, fotos reales e inventario. Hoy un revendedor gana la venta."], ["Sampling", "El número de muestras no prueba ventas: se mide con QR y venta en tiendas cercanas."]]
    .map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("");

  /* CTA funnel */
  const FU = [["Sembrar", "Reconocimiento", "Que conozcan y recuerden FIBO", "Con FIBO te encuentras.", "Conoce FIBO", "Alcance, seguidores, recuerdo en encuesta"], ["Sembrar", "Atención", "Generar curiosidad", "¿Con cuál FIBO te encuentras hoy?", "Descubre los 4 sabores", "Reproducciones, retención, visitas al perfil"],
    ["Probar", "Consideración", "Ayudar a evaluar", "22 g de proteína y 10 g de fibra en 65 g.", "Conoce sus atributos", "Visitas a ficha, clics a compra"], ["Probar", "Prueba", "La primera mordida", "Una barra que sí te llena. Pruébala.", "¿Sí te llenó? Está a una cuadra", "Muestras, QR escaneados, venta en tiendas cercanas"],
    ["Crecer", "Compra", "Facilitar la transacción", "Una barra que sí te llena. Está en tu 7-Eleven.", "Llévatela / Agregar al carrito", "Piezas por tienda, conversión en línea"], ["Crecer", "Recompra", "Volver a comprar", "Ya sabes cuál te llena.", "Llévate el pack de 4 sabores", "Recompra, códigos de creadores, reseñas"],
    ["B2B", "Cuenta", "Abrir una cuenta", "FIBO llena el hueco de 20 g en conveniencia.", "Solicita ficha técnica o cotización", "Reuniones, cotizaciones, cuentas activadas"]];
  $("mxFun").innerHTML = FU.map(([g, s, o, m, c, k], i) => `<article class="mx__fs g${g === "Sembrar" ? 1 : g === "Probar" ? 2 : g === "Crecer" ? 3 : 4}" style="--d:${i * 0.07}s"><p class="t"><span class="mono">${g} · ${s}</span></p><small>${o}</small><h5>«${m}»</h5><span class="cta">${c} ›</span><p class="mono kp">${k}</p><div class="prog"><i style="--p:${(i + 1) / 7}"></i></div></article>`).join("");

  /* tone */
  $("mxSound").innerHTML = [["Curiosa", "sin ser confusa"], ["Cercana", "tutea y escribe corto"], ["Con humor", "sin infantilizar"], ["Tapatía", "sin estereotipos ni folclor"], ["Sensorial", "sabor y antojo antes que nutrientes"], ["Directa", "con atributos; profesional en B2B"]]
    .map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("");
  const FM = { s: ["¿Junta a las cinco?", "¿Clase de 7 a 10?", "¿Camión lleno otra vez?", "¿Domingo de Vía RecreActiva?", "¿La comida todavía no llega?"], p: ["Pendientes sí, hambre no.", "Una barra que sí te llena.", "Que el hambre espere.", "Tu día no para. Tu barra tampoco."], e: ["22 g de proteína.", "22 g de proteína y 10 g de fibra.", "Más del doble que una de 10.", "Sabe a postre."], a: ["Búscala en tu 7-Eleven.", "Elige tu sabor.", "Llévatela a la oficina.", "Pruébala aquí."] };
  const form = $("mxForm");
  const build = (first) => { const r = (a) => a[Math.floor(Math.random() * a.length)];
    const v = first ? ["¿Junta a las cinco?", "Pendientes sí, hambre no. Una barra que sí te llena:", "22 g de proteína.", "Búscala en tu 7-Eleven."] : [r(FM.s), r(FM.p), r(FM.e), r(FM.a)];
    form.innerHTML = ["Situación real", "Promesa", "Prueba", "Acción"].map((n, i) => `<div class="s${i}"><small class="mono">${n}</small><b>${v[i]}</b></div>`).join("<i>+</i>") + `<p class="mx__bub big out">«${v.join(" ")}»</p>`; };
  $("mxFormB").addEventListener("click", () => build(false)); build(true);
  $("mxClaims").innerHTML = `<div class="hd"><span>✓ Se puede decir (con dato validado)</span><span>✕ No se dice</span></div>` + [["Una barra que sí te llena", "Te llena por X horas / llena más que…"], ["22 g de proteína · 10 g de fibra", "Whey (la proteína es mayoritariamente de soya)"], ["Más del doble de proteína que una de 10", "La más barata / el mejor valor del mercado"], ["Más proteína por tu dinero (en línea, frente a importadas)", "Sin azúcar añadida (lleva jarabes)"], ["Hecha en Jalisco", "Sin grasas hidrogenadas"], ["Antes o después de entrenar", "Sustituye una comida / beneficios metabólicos / la número uno"]]
    .map(([a, b]) => `<div><span>${a}</span><span><s>${b}</s></span></div>`).join("");
  $("mxVoc").innerHTML = `<div class="y">${["llena", "rinde", "antojo", "tu día", "camino", "aguante", "pausa", "22 g de proteína", "10 g de fibra", "hecha en Jalisco", "de aquí"].map((w) => `<span>${w}</span>`).join("")}</div><div class="n">${["macros", "anabólico", "quemar", "detox", "culpa", "gains", "saludable como promesa", "fit como promesa", "la mejor", "la número uno", "milagro"].map((w) => `<span><s>${w}</s></span>`).join("")}</div>`;
  $("mxAvoid").innerHTML = ["Comunicar solo desde el gimnasio o con códigos de suplemento (ingredientes volando, poses de esfuerzo).", "Mensajes que culpen por comer o por no entrenar.", "Frases motivacionales que diría cualquier marca.", "Jerga juvenil forzada o tendencias sin relación con el producto.", "Precio o disponibilidad sin actualizar.", "Repetir literal «Con FIBO te encuentras» en cada pieza."].map((t) => `<li>${t}</li>`).join("");

  /* master matrix with audience filter */
  const MT = [["Joven en tránsito", "Traslado", "Hay encuentros que pasan entre una parada y otra.", "65 g, 22 g de proteína", "7-Eleven en rutas, video vertical", "Búscala en tu 7-Eleven", "c"], ["Joven en tránsito", "Elección en anaquel", "Una barra que sí te llena.", "22 g · más del doble que una de 10", "Talker y tira de anaquel", "Llévatela", "c"],
    ["Universitarios", "Entre clases", "Entre clase y clase, una barra que sí te llena.", "4 sabores, 22 g", "Embajadores, tiendas frente a campus", "Elige tu sabor", "c"], ["Personas que trabajan", "Jornada laboral", "Pendientes sí. Hambre no.", "22 g y 10 g de fibra", "Redes, 7-Eleven en oficinas", "Llévatela a la oficina", "c"],
    ["Activos y deportistas", "Después de entrenar", "22 g después de entrenar. Sin batido, sin shaker.", "Etiqueta y tabla nutrimental", "Gimnasios, carreras, Vía RecreActiva", "Pruébala aquí", "c"], ["Colación práctica", "Media tarde", "Que el hambre espere.", "Barra de 65 g", "Abarrotes y conveniencia de colonia", "Cámbiale al pan dulce", "c"],
    ["Consumidor nuevo", "Primera prueba", "¿Sí te llenó? Está a una cuadra.", "Muestra del producto", "Sampling con QR", "Escanea y encuéntrala", "c"], ["Comprador en línea", "Comparación", "Más proteína por tu dinero.", "$19.55 por 10 g vs $33–35 importadas", "Amazon y fibo.mx", "Agregar al carrito", "o"],
    ["Cliente actual", "Recompra", "Ya sabes cuál te llena.", "Pack de 4 sabores", "Amazon, fibo.mx, códigos de creadores", "Llévate el pack", "o"], ["Cadenas", "Evaluación comercial", "FIBO llena el hueco de 20 g en conveniencia.", "Fabricante propio, FSSC 22000, desempeño en 7-Eleven", "Presentación y catálogo", "Solicita una cotización", "b"],
    ["Distribuidores", "Reactivación", "Volvamos a crecer juntos con FIBO.", "Plan de soporte y nuevos materiales", "Visita comercial", "Agenda una reunión", "b"]];
  const mf = $("mxMf"), mt = $("mxMt");
  mf.innerHTML = [["all", "Todas"], ["c", "Consumidor"], ["o", "En línea"], ["b", "B2B"]].map(([k, n], i) => `<button type="button" data-k="${k}"${i ? "" : ' class="on"'}>${n}</button>`).join("") + `<span class="mono" id="mxMn"></span>`;
  const drawM = (k) => { const rows = MT.filter((r) => k === "all" || r[6] === k);
    mt.innerHTML = `<div class="hd mono"><span>Audiencia · ocasión</span><span>Mensaje prioritario</span><span>Prueba</span><span>Canal</span><span>CTA</span></div>` + rows.map(([a, o, m, p, c, t, g]) => `<div class="rw g${g}"><span><b>${a}</b><small>${o}</small></span><span class="m">«${m}»</span><span>${p}</span><span>${c}</span><span><em>${t}</em></span></div>`).join("");
    $("mxMn").textContent = `${rows.length} filas`; };
  const mfb = [...mf.querySelectorAll("button")];
  mfb.forEach((b) => b.addEventListener("click", () => { mfb.forEach((x) => x.classList.toggle("on", x === b)); drawM(b.dataset.k); })); drawM("all");

  /* governance */
  const Q = [["Marca", "¿Se conecta con «Con FIBO te encuentras» y con «Una barra que sí te llena»?"], ["Relevancia", "¿Responde a una ocasión o necesidad real en Guadalajara?"], ["Claridad", "¿Se entiende en un segundo, como en el anaquel?"], ["Diferenciación", "¿Lo diría cualquier barra o tiene vínculo claro con FIBO?"], ["Credibilidad", "¿Datos validados por Calidad y promesa sostenible?"],
    ["Canal", "¿El formato permite entender el mensaje?"], ["Acción", "¿Sabemos qué queremos que haga la persona?"], ["Disponibilidad", "¿Producto, sabor, precio o promo realmente están ahí?"], ["Cumplimiento", "¿Respeta NOM-051, COFEPRIS y los lineamientos para escuelas?"], ["Medición", "¿Tenemos indicador y línea base?"]];
  const qs = $("mxQs");
  qs.innerHTML = `<div class="hd"><p class="mx__k mono">Las 10 preguntas · toca las que sí cumple</p><span class="mx__pill" id="mxQsc">0 / 10 · no sale</span></div>` + Q.map(([a, b], i) => `<button type="button" class="mx__q"><i></i><b class="mono">${String(i + 1).padStart(2, "0")}</b><span><strong>${a}</strong>${b}</span></button>`).join("");
  const qb = [...qs.querySelectorAll(".mx__q")], qsc = $("mxQsc");
  qb.forEach((b) => b.addEventListener("click", () => { b.classList.toggle("on"); const n = qb.filter((x) => x.classList.contains("on")).length; qsc.textContent = n === 10 ? "10 / 10 · ✓ sale" : `${n} / 10 · no sale`; qsc.classList.toggle("ok", n === 10); }));
  $("mxStates").innerHTML = ["Propuesto", "En revisión", "Validado", "Activo", "Por actualizar", "Retirado"].map((s, i) => `<span style="--d:${i * 0.5}s">${s}</span>`).join("<i>→</i>");
  $("mxWho").innerHTML = [["YL", "Yenifer", "Marketing", "Matriz de mensajes, coherencia y objetivos", "#C9F23A"], ["R", "Rocío", "Calidad", "Datos nutrimentales, claims y sellos", "#FF89B8"], ["Á", "Álvaro", "Legal", "Marca, IMPI y revisión legal", "#3A5CFF"], ["V", "Ventas", "Comercial", "Precios, disponibilidad y condiciones", "#F2EFE8"], ["C", "Cutberto", "Producción", "Costos y margen para promociones", "#D6161D"], ["A", "Alejandro", "Dirección", "Aprobación final", "#0C0B0A"]]
    .map(([a, n, r, t, c]) => `<div style="--c:${c}"><span class="av">${a}</span><div><b>${n}</b><small class="mono">${r}</small><p>${t}</p></div></div>`).join("");

  /* measurement baselines */
  $("mxBase").innerHTML = [["Reconocimiento", "Alcance, seguidores, recuerdo espontáneo y asistido, asociación con el concepto", "11 meses sin publicar · ~430 calificaciones · por medir en encuesta"], ["Consideración", "Visitas a fichas, clics a compra, comprensión de la promesa", "Por medir"], ["Prueba", "Muestras, QR, venta en tiendas cercanas, preferencia de sabor", "Sampling del 3 de octubre sin documentar"],
    ["Compra", "Piezas por tienda por semana, ventas por canal, conversión", "68% de puntos con barra · Amazon en $0 en octubre"], ["Recompra", "Recompra, uso de códigos, calificación en Amazon", "Amazon ~4.1★"], ["B2B", "Reuniones, cotizaciones, cuentas activadas, reactivados", "5 clientes inactivos ($201,602 en 2025)"]]
    .map(([e, k, b], i) => `<article style="--d:${i * 0.06}s"><p class="t"><span class="mono">${e}</span></p><p>${k}</p><div class="b"><small class="mono">Línea base hoy</small><b>${b}</b></div></article>`).join("");
  const dRep = Math.ceil((new Date("2026-11-20T09:00:00-06:00") - Date.now()) / 864e5);
  $("mxRep").textContent = dRep > 0 ? `Monthly Report · 20 nov · faltan ${dRep} días` : "Monthly Report · 20 nov";

  /* pending */
  const TD = [["Validar en laboratorio 22 g de proteína y 10 g de fibra en los 4 sabores", "Rocío"], ["Completar tablas de Frutos Rojos y Cookies & Cream; confirmar ingredientes de Frutos Rojos", "Rocío"], ["Retirar «whey» y «sin azúcar añadida» de Amazon, Mercado Libre y materiales", "Ventas · Yenifer"], ["Buscar en el IMPI «Con FIBO te encuentras» y «Una barra que sí te llena»", "Álvaro · antes del 30 oct"], ["Elegir una sola redacción del concepto rector y aprobarla", "Alejandro"],
    ["Probar la promesa y el concepto en la encuesta y la prueba de sabor", "Yenifer · Ciara"], ["Confirmar disponibilidad por sabor y canal antes de «Encuentra FIBO»", "Ventas"], ["Revisar si la pauta digital requiere aviso o permiso de COFEPRIS", "Álvaro"], ["Validar el costo por barra antes de anunciar promociones", "Cutberto"], ["Crear el banco de mensajes aprobados con estado y versión", "Yenifer"]];
  const td = $("mxTodo"), tdc = $("mxTodoC");
  td.innerHTML = TD.map(([t, w]) => `<button type="button" class="mx__td"><i></i><span>${t}</span><em class="mono">${w}</em></button>`).join("");
  const tds = [...td.children];
  tds.forEach((b) => b.addEventListener("click", () => { b.classList.toggle("on"); tdc.textContent = `${tds.filter((x) => x.classList.contains("on")).length} / 10`; }));

  /* ——— dynamic layer: hero typing, KPIs, tickers, icons, counters, growth funnel ——— */
  const TY = ["Pendientes sí. Hambre no.", "Una barra que sí te llena.", "¿Con cuál FIBO te encuentras hoy?", "¿Sí te llenó? Está a una cuadra.", "Hay encuentros que pasan entre una parada y otra.", "Ya sabes cuál te llena. Llévate el pack."];
  const tyEl = $("mxType"); let ti = 0, tc = 0, del = false;
  const type = () => { const s = TY[ti];
    if (!del) { tc++; tyEl.textContent = s.slice(0, tc); if (tc === s.length) { del = true; return setTimeout(type, 1800); } }
    else { tc -= 2; tyEl.textContent = s.slice(0, Math.max(0, tc)); if (tc <= 0) { del = false; tc = 0; ti = (ti + 1) % TY.length; } }
    setTimeout(type, del ? 22 : 48); };
  if (reduced) tyEl.textContent = TY[0]; else type();
  $("mxQk").innerHTML = OC.map((o, i) => `<button type="button" data-i="${i}" style="--d:${i * 0.06}s">${ic(o.i)}${o.n}</button>`).join("");
  $("mxQk").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { pick(+b.dataset.i); $("mxSit").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }));
  const KP = [[5, "principios", I.target, "#C9F23A"], [5, "pilares", I.layers, "#FF89B8"], [8, "ocasiones", I.pin, "#3A5CFF"], [11, "canales", I.mega, "#D6161D"], [10, "preguntas antes de publicar", I.shield, "#0C0B0A"]];
  const kpis = $("mxKpis");
  kpis.innerHTML = KP.map(([n, l, i, c], k) => `<div style="--c:${c};--d:${k * 0.1}s"><span class="ic">${ic(i)}</span><b data-n="${n}">0</b><small>${l}</small></div>`).join("");
  const countUp = (el, n, suf = "") => { if (reduced) { el.textContent = n + suf; return; } const t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { kpis.classList.add("in"); kpis.querySelectorAll("b").forEach((b) => countUp(b, +b.dataset.n)); o.disconnect(); } }, { threshold: 0.4 }).observe(kpis);
  const TK = ["Pendientes sí. Hambre no.", "Que el hambre espere.", "Sabe a postre. Y sí te llena.", "Tu día no para. Tu barra tampoco.", "De Zapopan a tu mochila.", "¿Team Brownie o Cookies & Cream?", "Está más cerca de lo que crees.", "Más barra, más proteína, por lo que pagas.", "Hecha en Jalisco para los días que no paran.", "22 g después de entrenar."];
  const TKI = [I.lap, I.cup, I.cookie, I.bus, I.pin, I.chat, I.search, I.coins, I.star, I.gym];
  sec.querySelectorAll(".mx__tick .trk, .mx__tick.rv .trk").forEach((t, r) => { const L = r ? [...TK].reverse() : TK; const one = L.map((s, i) => `<span>${ic(TKI[(r ? L.length - 1 - i : i)])}${s}</span>`).join(""); t.innerHTML = one + one; });
  // pane header badges
  const PH = { mxPil: [I.layers, "02"], mxProd: [I.box, "03"], mxSit: [I.pin, "04"], mxAud: [I.ppl, "05"], mxCh: [I.mega, "06"], mxCta: [I.sprout, "07"], mxTone: [I.mic, "08"], mxMat: [I.grid, "09"], mxGov: [I.shield, "10"] };
  Object.entries(PH).forEach(([id, [i, n]]) => { const h = $(id) && $(id).querySelector(".mx__ph2 h3"); if (h) h.insertAdjacentHTML("afterbegin", `<span class="mx__hic">${ic(i)}<em class="mono">${n}</em></span>`); });
  // icons on principles, attributes, channels, funnel, baselines, tone
  const ins = (sel, list, cls = "mx__ico") => sec.querySelectorAll(sel).forEach((el, k) => list[k] && el.insertAdjacentHTML("afterbegin", `<span class="${cls}">${ic(list[k])}</span>`));
  ins("#mxPr li", [I.target, I.shield, I.pin, I.shuffle, I.chart]);
  ins(".mx__at .t", [I.bolt, I.leaf, I.ruler, I.palette, I.flame, I.cube, I.oct, I.pin]);
  ins(".mx__cc .t", [I.tag, I.shelf, I.box, I.heart, I.play, I.mega, I.gift, I.gym, I.flag, I.cart, I.brief]);
  ins(".mx__fs .t", [I.seed, I.eye, I.search, I.gift, I.cart, I.loop, I.brief]);
  ins(".mx__base .t", [I.eye, I.search, I.gift, I.cart, I.loop, I.brief]);
  ins(".mx__sound div", [I.search, I.heart, I.star, I.pin, I.cookie, I.target]);
  ins(".mx__hier div", [I.star, I.box, I.shelf, I.cart, I.brief], "mx__ico sm");
  // count-up product numbers when the pane shows
  new IntersectionObserver(([e], o) => { if (!e.isIntersecting) return; sec.querySelectorAll(".mx__at > b").forEach((b) => { const m = b.textContent.match(/^(\d+)(.*)$/); if (m && +m[1] < 400) countUp(b, +m[1], m[2]); }); o.disconnect(); }, { threshold: 0.2 }).observe($("mxProd"));
  // governance ring
  const qhd = qs.querySelector(".hd"); qhd.insertAdjacentHTML("afterbegin", `<svg class="mx__ring" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/><circle class="v" cx="20" cy="20" r="16" pathLength="10"/></svg>`);
  const ring = qhd.querySelector(".v"); qb.forEach((b) => b.addEventListener("click", () => { const n = qb.filter((x) => x.classList.contains("on")).length; ring.style.strokeDashoffset = 10 - n; ring.classList.toggle("ok", n === 10); }));
  const grow = sec.querySelector(".mx__grow"); new IntersectionObserver(([e], o) => { if (e.isIntersecting) { grow.classList.add("in"); o.disconnect(); } }, { threshold: 0.3 }).observe(grow);

  /* tab highlight while scrolling + reveal */
  const tabs = [...sec.querySelectorAll(".mx__tabs a")];
  const panes = tabs.map((a) => document.querySelector(a.getAttribute("href")));
  const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const i = panes.indexOf(e.target); tabs.forEach((t, k) => t.classList.toggle("on", k === i)); } }), { rootMargin: "-40% 0px -55% 0px" });
  panes.forEach((p) => p && spy.observe(p));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0, rootMargin: "0px 0px -12% 0px" });
  sec.querySelectorAll(".mx__app, .mx__home, .mx__pane").forEach((n) => io.observe(n));
})();
