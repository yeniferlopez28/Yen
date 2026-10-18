// Value proposition as a shop UI: "Propuesta" shows the detail view; filters and search show the matching cards.
(() => {
  const sec = document.getElementById("propuesta");
  if (!sec) return;
  const detail = document.getElementById("pvDetail"), panel = document.getElementById("pvPanel");
  const cards = [...sec.querySelectorAll(".pv__card")], count = document.getElementById("pvCount");
  const tabs = [...sec.querySelectorAll("[data-tab]")], q = document.getElementById("pvQ"), search = q.closest(".pv__search");
  const LABEL = { todo: "Todo", pilares: "Los cuatro pilares de su valor", evolucion: "Evolución de la propuesta", consumidor: "¿Qué necesitamos descubrir del consumidor?", retos: "Retos" };
  function show(tab, term) {
    tabs.forEach((t) => t.classList.toggle("on", t.dataset.tab === tab));
    const isDetail = tab === "detalle";
    detail.hidden = !isDetail; panel.hidden = isDetail;
    if (isDetail) return;
    let n = 0;
    cards.forEach((c) => {
      const ok = term ? c.dataset.q.includes(term) : (tab === "todo" || c.dataset.cat === tab);
      c.hidden = !ok; if (ok) { n++; c.style.animationDelay = n * 50 + "ms"; }
    });
    count.textContent = term ? `${n} resultados para «${term}»` : `${LABEL[tab]} · ${n}`;
  }
  tabs.forEach((t) => (t.onclick = () => { q.value = ""; show(t.dataset.tab); }));
  document.getElementById("pvSearchBtn").onclick = () => { search.classList.toggle("open"); if (search.classList.contains("open")) q.focus(); };
  q.oninput = () => { const v = q.value.trim().toLowerCase(); v ? show("search", v) : show("todo"); };
  const more = document.getElementById("pvMore"), read = document.getElementById("pvRead");
  read.onclick = () => { more.hidden = !more.hidden; read.textContent = more.hidden ? "Leer más" : "Leer menos"; };
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { sec.classList.add("seen"); io.disconnect(); } }, { threshold: 0.3 }).observe(sec);
  show("detalle");
})();
