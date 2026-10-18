// Promotions & activations: a researched wall of competitor promotions (filterable), a brand × tactic matrix, FIBO's six planned activations and why they work.
(() => {
  const sec = document.getElementById("activaciones");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const T = window.AC_TYPES || [];
  const P = window.AC_PROMOS || [];
  const tName = (k) => (T.find((t) => t.k === k) || {}).n || k;
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // filter chips
  const chips = document.getElementById("acChips"), wall = document.getElementById("acWall");
  chips.innerHTML = `<button type="button" class="on" data-k="all">Todas <i>${P.length}</i></button>` +
    T.map((t) => `<button type="button" data-k="${t.k}"><b style="--c:${t.c}"></b>${t.n} <i>${P.filter((p) => p.t === t.k).length}</i></button>`).join("");
  wall.innerHTML = P.map((p, i) => `
    <article class="ac__post${p.img ? "" : " noimg"}" data-t="${p.t}" style="--c:${(T.find((t) => t.k === p.t) || {}).c || "#0C0B0A"};--i:${i % 6}">
      ${p.img ? `<figure><img src="assets/${p.img}" alt="${esc(p.b)}" loading="lazy"><span class="mono">${esc(tName(p.t))}</span></figure>` : `<div class="ph"><b>${esc(p.b)}</b><span class="mono">${esc(tName(p.t))}</span></div>`}
      <div class="bd">
        <header><i>${esc(p.b.slice(0, 1))}</i><span><b>${esc(p.b)}</b><small class="mono">${esc([p.pais, p.f].filter(Boolean).join(" · "))}</small></span></header>
        <h5>${esc(p.ti)}</h5>
        <p>${esc(p.d)}</p>
        ${p.dato ? `<p class="dt">${esc(p.dato)}</p>` : ""}
        ${p.u ? `<a class="mono" href="${esc(p.u)}" target="_blank" rel="noopener">Fuente · ${esc(host(p.u))} ↗</a>` : ""}
      </div>
    </article>`).join("");
  const posts = [...wall.children], cb = [...chips.children];
  cb.forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.k;
    cb.forEach((x) => x.classList.toggle("on", x === b));
    posts.forEach((p) => p.classList.toggle("hide", k !== "all" && p.dataset.t !== k));
  }));

  // brand × tactic matrix
  const mx = document.getElementById("acMatrix");
  const brands = [...new Set(P.map((p) => p.b))];
  mx.style.setProperty("--n", T.length);
  mx.innerHTML = `<span></span>` + T.map((t) => `<span class="th mono" style="--c:${t.c}">${t.n}</span>`).join("") +
    brands.map((b) => `<span class="rh">${esc(b)}</span>` + T.map((t) => {
      const n = P.filter((p) => p.b === b && p.t === t.k).length;
      return `<span class="cl">${n ? `<i style="--c:${t.c}" title="${esc(b)} · ${esc(t.n)}"></i>` : ""}</span>`;
    }).join("")).join("") +
    `<span class="rh me">FIBO · plan</span>` + T.map((t) => `<span class="cl">${t.fibo ? `<i class="me" title="FIBO · ${esc(t.n)}"></i>` : ""}</span>`).join("");

  // proof chips inside each planned activation
  sec.querySelectorAll(".ac__proof[data-proof]").forEach((el) => {
    const ks = el.dataset.proof.split(" ");
    const bs = [...new Set(P.filter((p) => ks.includes(p.t)).map((p) => p.b))].slice(0, 5);
    if (bs.length) el.innerHTML = "Ya lo hicieron: " + bs.map((b) => `<span><i>✓</i>${esc(b)}</span>`).join("");
  });

  // counters
  const num = document.getElementById("acNum"), numB = document.getElementById("acNumB"), meter = document.getElementById("acMeter");
  numB.textContent = `de ${brands.length} marcas · ${T.length} tipos de táctica`;
  meter.innerHTML = T.map((t) => `<i style="--c:${t.c}"></i>`).join("");
  const count = () => {
    const N = P.length, t0 = performance.now();
    const f = (t) => { const k = Math.min(1, (t - t0) / 1200); num.textContent = Math.round(N * k); if (k < 1) requestAnimationFrame(f); };
    reduced ? (num.textContent = N) : requestAnimationFrame(f);
    [...meter.children].forEach((m, i) => setTimeout(() => m.classList.add("on"), 300 + i * 150));
  };

  // price app: today's uneven prices → ordered
  const app = sec.querySelector(".ac__app"), cmp = app && app.querySelector(".cmp");
  let fixed = false;
  const flip = () => { fixed = !fixed; app.classList.toggle("fix", fixed); cmp.textContent = fixed ? "Meta · precio en orden en todos los canales" : "Hoy · de $19.55 a $28 según el canal"; };
  if (app) { cmp.textContent = "Hoy · de $19.55 a $28 según el canal"; }

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.id === "acWhy") count();
    if (e.target.dataset.k === "price" && app && !reduced) setInterval(flip, 2600);
    if (e.target.id === "acProof") posts.forEach((p, i) => setTimeout(() => p.classList.add("in"), Math.min(i, 12) * 60));
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  sec.querySelectorAll(".ac__act, #acWhy, #acProof, .ac__mxw").forEach((n) => io.observe(n));
})();
