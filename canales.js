// Channel strategy bento: filter pills, pixel illustrations that print in row by row, dot matrix, bars and the COFEPRIS countdown.
(() => {
  const root = document.getElementById("estrategia-canales");
  if (!root) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 16×16 pixel icons, "#" = ink
  const PX = {
    store: ["................", ".##############.", "#..............#", "################", "##..##..##..##..", "..##..##..##..##", "################", ".#............#.", ".#.####..####.#.", ".#.#..#..#..#.#.", ".#.####..#..#.#.", ".#.......#.##.#.", ".#.......#..#.#.", ".#.......#..#.#.", "################", "................"],
    stamp: ["..#########.....", "..#.......##....", "..#.#####.#.#...", "..#.......####..", "..#.#######..#..", "..#..........#..", "..#.#######..#..", "..#..........#..", "..#.####.......#", "..#.......####..", "..#......#....#.", "..#......#.##.#.", "..########....#.", ".........#.##.#.", "..........####..", "................"],
    run: [".........##.....", "........####....", "........####....", ".........##.....", "......#####.....", ".....#######....", "....##.####.#...", "...##..####..##.", ".......####.....", "......##..##....", ".....##....##...", "....##......##..", "...##.......#...", "..##........##..", ".##.............", "................"],
    qr: ["#######..#######", "#.....#..#.....#", "#.###.#.##.###.#", "#.###.#..#.###.#", "#.###.#.##.###.#", "#.....#..#.....#", "#######.##.#####", "........#.......", "##.#.##.###.#.##", ".#..#...#.#..#..", "#######.##..#.##", "#.....#..##.#...", "#.###.#.#..####.", "#.###.#..##.#..#", "#.....#.#.##.##.", "#######..#.#..##"],
    phone: ["....########....", "...#........#...", "...#.######.#...", "...#.#....#.#...", "...#.#.##.#.#...", "...#.#.##.#.#...", "...#.#....#.#...", "...#.#.##.#.#...", "...#.#....#.#...", "...#.#.##.#.#...", "...#.######.#...", "...#........#...", "...#...##...#...", "...#........#...", "....########....", "................"],
    lock: ["................", ".....######.....", "....##....##....", "....#......#....", "....#......#....", "....#......#....", "..############..", "..#..........#..", "..#....##....#..", "..#...####...#..", "..#....##....#..", "..#....##....#..", "..#..........#..", "..############..", "................", "................"],
    cart: ["................", "##..............", ".#..............", ".#.############.", ".#.#..#..#..#.#.", ".#..#.#..#..#.#.", ".#..##########..", ".#...#..#..#.#..", ".#...########...", ".#..............", ".############...", "................", "...##......##...", "..####....####..", "...##......##...", "................"],
    chat: ["................", "..###########...", ".#...........#..", "#.............#.", "#..##..##..##.#.", "#..##..##..##.#.", "#.............#.", ".#...........#..", "..#########.##..", "..........#.#...", ".........#.#....", "........##......", "................", "................", "................", "................"],
  };
  // pixel FIBO pack: crimped wrapper with the wordmark cut out
  const L = { F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"], I: ["111", "010", "010", "010", "010", "010", "111"], B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"], O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"] };
  const pack = () => {
    const W = 60, H = 24, g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => {
      const e = x < 3 ? x : x > W - 4 ? W - 1 - x : 3; // zigzag crimp at both ends
      return e >= 3 || (y + e) % 3 !== 0 ? 1 : 0;
    }));
    let cx = 13; const cy = 5;
    for (const ch of "FIBO") { const m = L[ch]; m.forEach((r, y) => [...r].forEach((v, x) => { if (v === "1") for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) g[cy + y * 2 + dy][cx + x * 2 + dx] = 0; })); cx += m[0].length * 2 + 2; }
    for (let x = 6; x < W - 6; x++) if (x % 2) g[20][x] = 0; // perforation line
    return g.map((r) => r.map((v) => (v ? "#" : ".")).join(""));
  };
  PX.pack = pack();

  root.querySelectorAll("svg[data-px]").forEach((svg) => {
    const rows = PX[svg.dataset.px]; if (!rows) return;
    const w = rows[0].length, h = rows.length;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`); svg.setAttribute("shape-rendering", "crispEdges");
    svg.innerHTML = rows.map((r, y) => `<g style="--y:${y}">${[...r].map((c, x) => (c === "#" ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : "")).join("")}</g>`).join("");
  });

  // dot matrix: 0–3 dots per cell
  root.querySelectorAll(".ec__mx td").forEach((td) => { const n = +td.dataset.d; td.innerHTML = n ? `<span>${"<i></i>".repeat(n)}</span>` : "—"; td.setAttribute("aria-label", n ? `${n} de 3` : "no aplica"); });

  // countdown to the COFEPRIS submission week
  root.querySelectorAll("[data-cd]").forEach((b) => {
    const t = new Date(b.dataset.cd + "T00:00:00"), d = Math.ceil((t - new Date()) / 864e5);
    b.textContent = d > 1 ? `Faltan ${d} días` : d === 1 ? "Falta 1 día" : d >= -6 ? "Semana de ingreso" : "En trámite";
  });

  // filters
  const cards = [...root.querySelectorAll(".ec__c")], pills = [...root.querySelectorAll(".ec__pills button")];
  pills.forEach((p) => p.addEventListener("click", () => {
    pills.forEach((q) => q.classList.toggle("on", q === p)); p.setAttribute("aria-pressed", "true");
    pills.filter((q) => q !== p).forEach((q) => q.setAttribute("aria-pressed", "false"));
    const f = p.dataset.f;
    cards.forEach((c) => { c.hidden = f !== "all" && !c.dataset.cat.split(" ").includes(f); });
  }));

  // reveal: cards rise, bars fill and pixels print in when they reach the screen
  if (reduced || !("IntersectionObserver" in window)) { cards.forEach((c) => c.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  root.classList.add("ec--anim"); cards.forEach((c) => io.observe(c));
})();
