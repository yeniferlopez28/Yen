// Consumption occasions: a Macrobús drives across "GUADALAJARA", dot-matrix icons, a work-hours gauge,
// Vía RecreActiva riders, a snack waffle and a letter matrix where Guadalajara places light up.
(() => {
  const sec = document.getElementById("ocasiones");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  // 9×9 dot-matrix icons
  const ICONS = {
    bus:    ["111111111","100010001","100010001","111111111","111111111","111111111","011000110","011000110","000000000"],
    book:   ["000000000","110000011","111101111","101111101","100111001","100111001","100111001","111111111","000000000"],
    bag:    ["000111000","001000100","111111111","100000001","111111111","100010001","100000001","111111111","000000000"],
    gym:    ["000000000","110000011","110000011","111111111","111111111","110000011","110000011","000000000","000000000"],
    cookie: ["001111100","011010110","110111011","101111101","111101111","110111011","011111110","001111100","000000000"],
    mount:  ["000010000","000111000","001111100","001101100","011111110","110111011","111111111","111111111","000000000"],
  };
  sec.querySelectorAll(".oc__s").forEach((s) => {
    const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", "0 0 90 90");
    ICONS[s.dataset.ic].forEach((row, y) => [...row].forEach((v, x) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", x * 10 + 5); c.setAttribute("cy", y * 10 + 5); c.setAttribute("r", v === "1" ? 3.6 : 1.2);
      if (v === "1") c.setAttribute("class", "on"); svg.appendChild(c);
    }));
    s.querySelector(".oc__pix").appendChild(svg);
    s.addEventListener("click", (e) => { e.preventDefault(); document.querySelector(s.hash || s.getAttribute("href")).scrollIntoView({ behavior: "smooth", block: "start" }); });
  });

  const count = (b) => {
    const to = +b.dataset.n, d = +(b.dataset.d || 0), s = b.dataset.s || "", t0 = performance.now();
    const tick = (t) => { const k = reduced ? 1 : Math.min(1, (t - t0) / 1400); b.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(d) + s; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); e.target.querySelectorAll("[data-n]").forEach(count); io.unobserve(e.target);
  }), { threshold: 0.25 });
  sec.querySelectorAll(".oc__road, .oc__six, .oc__o, .oc__matrix, .oc__prio").forEach((n) => io.observe(n));

  // road speed counter
  const road = document.getElementById("ocRoad"), min = document.getElementById("ocMin");
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { const b = min; b.dataset.n = 79; count(b); o.disconnect(); } }, { threshold: 0.3 }).observe(road);

  // gauge: 0–60 h
  const ticks = document.getElementById("ocTicks");
  for (let i = 0; i <= 30; i++) {
    const a = Math.PI + (i / 30) * Math.PI, r1 = i % 5 ? 100 : 96, r2 = 108;
    const l = document.createElementNS(NS, "line");
    l.setAttribute("x1", 120 + Math.cos(a) * r1); l.setAttribute("y1", 120 + Math.sin(a) * r1);
    l.setAttribute("x2", 120 + Math.cos(a) * r2); l.setAttribute("y2", 120 + Math.sin(a) * r2);
    if (i === 20 || i === 24) l.setAttribute("class", "hi"); ticks.appendChild(l);
  }
  const needle = document.getElementById("ocNeedle"), gauge = document.getElementById("ocGauge");
  const setH = (h) => { needle.style.transform = `rotate(${(h / 60) * 180 - 90}deg)`; gauge.style.setProperty("--p", (h / 60) * 100); };
  const btns = [...sec.querySelectorAll("#ocGbtn button")];
  btns.forEach((b) => (b.onclick = () => {
    btns.forEach((o) => o.classList.toggle("on", o === b));
    document.getElementById("ocHrs").textContent = (b.dataset.h === "48" ? "+48" : b.dataset.h) + " h";
    document.getElementById("ocHrsL").textContent = b.dataset.l; setH(+b.dataset.h);
  }));
  setH(0);
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { setTimeout(() => setH(41.8), 300); o.disconnect(); } }, { threshold: 0.4 }).observe(gauge);

  // snack waffle: 77 of 100 eat between meals
  const waf = document.getElementById("ocWaf");
  for (let i = 0; i < 100; i++) { const d = document.createElement("i"); if (i < 77) d.className = "on"; d.style.transitionDelay = i * 10 + "ms"; waf.appendChild(d); }

  // place matrix: random letters with the Guadalajara places spelled in
  const PLACES = ["ANDARES", "CUCEA", "CHAPULTEPEC", "COLOMOS", "PROVIDENCIA", "ITESO", "CUCEI", "AMERICAS", "TAPALPA", "CHAPALA", "UNIVA", "ELSALTO", "MACROBUS", "LINEA3", "CUCSH", "TEQUILA", "PUERTADEHIERRO", "METROPOLITANO", "AJIJIC", "MAZAMITLA", "UAG", "TEC"];
  const mx = document.getElementById("ocMatrix"), AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rnd = (n) => Array.from({ length: n }, () => AB[(Math.random() * AB.length) | 0]).join("");
  let html = "", k = 0;
  for (let r = 0; r < 8; r++) {
    let line = "";
    for (let j = 0; j < 3 && k < PLACES.length; j++, k++) {
      const cls = ["l", "b", "r"][(r + j) % 3];
      line += `<span>${rnd(3 + ((r * 7 + j * 5) % 9))}</span><em class="${cls}">${PLACES[k]}</em>`;
    }
    html += `<p><span>${rnd(4)}</span>${line}<span>${rnd(40)}</span></p>`;
  }
  mx.innerHTML = html;
  if (!reduced) setInterval(() => {
    const spans = mx.querySelectorAll("span"); const s = spans[(Math.random() * spans.length) | 0];
    s.textContent = rnd(s.textContent.length);
  }, 120);
})();
