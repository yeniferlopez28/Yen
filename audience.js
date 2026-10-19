// Target audience: a "player" window of animated flat-illustration scenes (people commuting, studying, working, training…) and diary pages per segment.
(() => {
  const sec = document.getElementById("publico");
  if (!sec) return;

  /* ---------- a tiny flat character rig: origin at the feet, facing right ---------- */
  const rot = (vals, cx, cy, d, delay = 0) => {
    if (!Array.isArray(vals)) return ` transform="rotate(${vals} ${cx} ${cy})"`;
    return `><animateTransform attributeName="transform" type="rotate" values="${[vals[0], vals[1], vals[0]].map((v) => `${v} ${cx} ${cy}`).join(";")}" dur="${d}s" begin="${delay}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/`;
  };
  const g = (vals, cx, cy, d, inner, delay) => Array.isArray(vals) ? `<g${rot(vals, cx, cy, d, delay)}>${inner}</g>` : `<g${rot(vals, cx, cy)}>${inner}</g>`;
  const P = {
    run: { d: 0.62, lf: [-42, 34], kf: [8, 74], lb: [34, -42], kb: [74, 8], af: [38, -34], ef: -80, ab: [-34, 38], eb: -80, lean: 10, bob: 3 },
    walk: { d: 1.1, lf: [-22, 20], kf: [4, 26], lb: [20, -22], kb: [26, 4], af: [16, -16], ef: -20, ab: [-16, 16], eb: -20, lean: 2, bob: 1.5 },
    sit: { lf: -90, kf: 88, lb: -84, kb: 92, af: -38, ef: -70, ab: -24, eb: -60 },
    eat: { lf: -90, kf: 88, lb: -84, kb: 92, af: -30, ef: [-118, -138], ab: -14, eb: -40, d: 2.4 },
    type: { lf: -90, kf: 88, lb: -84, kb: 92, af: -62, ef: [-28, -38], ab: -56, eb: [-38, -28], d: 0.28 },
    bike: { d: 0.8, lf: [-78, -22], kf: [104, 38], lb: [-22, -78], kb: [38, 104], af: -64, ef: -18, ab: -58, eb: -22, lean: 26 },
    swing: { d: 1.3, lf: -16, kf: 10, lb: 18, kb: 6, af: [-150, 40], ef: [-40, -10], ab: [-30, 20], eb: -40, lean: 6 },
    curl: { d: 1.5, lf: -6, kf: 0, lb: 6, kb: 0, af: -6, ef: [-14, -138], ab: 6, eb: [-138, -14], lean: 0 },
    reach: { d: 2.4, lf: -4, kf: 0, lb: 6, kb: 0, af: [-80, -128], ef: [-20, -6], ab: 6, eb: -10, lean: 0 },
    stand: { d: 3, lf: -5, kf: 0, lb: 5, kb: 0, af: -8, ef: [-100, -122], ab: 6, eb: -8, lean: 0 },
  };
  const HAIR = {
    short: (c) => `<path fill="${c}" d="M-14 -126 A15 15 0 0 1 17 -133 Q 8 -141 -3 -136 Q -9 -128 -14 -121 Z"/>`,
    long: (c) => `<path fill="${c}" d="M-15 -100 L-15 -128 A15 15 0 0 1 17 -134 Q 6 -141 -3 -136 Q -6 -124 -4 -100 Z"/>`,
    pony: (c) => `<path fill="${c}" d="M-14 -126 A15 15 0 0 1 17 -133 Q 8 -141 -3 -136 Q -9 -128 -14 -121 Z"/><path fill="${c}" d="M-12 -134 q-16 4 -14 22 q6 -10 12 -14 z"><animateTransform attributeName="transform" type="rotate" values="-8 -12 -134;10 -12 -134;-8 -12 -134" dur=".7s" repeatCount="indefinite"/></path>`,
    bun: (c) => `<path fill="${c}" d="M-14 -126 A15 15 0 0 1 17 -133 Q 8 -141 -3 -136 Q -9 -128 -14 -121 Z"/><circle fill="${c}" cx="-6" cy="-147" r="7"/>`,
    cap: (c) => `<path fill="${c}" d="M-14 -127 A15 15 0 0 1 16 -132 L 26 -131 L 16 -128 Z"/>`,
  };
  function person(o) {
    const p = P[o.pose], d = p.d || 1, sk = o.skin || "#E8A77C", sh = o.shoe || "#0C0B0A", pa = o.pants || "#0C0B0A";
    const leg = (l, k, col, dl) => g(l, 0, -62, d, `<line x1="0" y1="-62" x2="0" y2="-31" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` + g(k, 0, -31, d, `<line x1="0" y1="-31" x2="0" y2="-4" stroke="${col}" stroke-width="11" stroke-linecap="round"/><path d="M-6 -6 h14 a5 5 0 0 1 0 8 h-14 z" fill="${sh}"/><path d="M-6 0 h18" stroke="#fff" stroke-width="1.5"/>`), dl);
    const hand = (it) => it === "bar" ? `<g transform="translate(0 -60) rotate(-30)"><rect x="-4" y="-12" width="8" height="24" rx="2" fill="#D6161D"/><rect x="-4" y="-3" width="8" height="5" fill="#C9F23A"/></g>`
      : it === "racket" ? `<g transform="translate(0 -60)"><line x1="0" y1="0" x2="0" y2="16" stroke="#0C0B0A" stroke-width="3"/><ellipse cx="0" cy="30" rx="11" ry="14" fill="#C9F23A" stroke="#0C0B0A" stroke-width="2"/></g>`
      : it === "dumbbell" ? `<g transform="translate(0 -60) rotate(90)"><rect x="-12" y="-2" width="24" height="4" fill="#0C0B0A"/><rect x="-14" y="-7" width="6" height="14" rx="1" fill="#3A5CFF"/><rect x="8" y="-7" width="6" height="14" rx="1" fill="#3A5CFF"/></g>` : "";
    const arm = (a, e, col, it) => g(a, 0, -106, d, `<line x1="0" y1="-106" x2="0" y2="-83" stroke="${col}" stroke-width="10" stroke-linecap="round"/>` + g(e, 0, -83, d, `<line x1="0" y1="-83" x2="0" y2="-62" stroke="${sk}" stroke-width="8" stroke-linecap="round"/><circle cy="-60" r="5" fill="${sk}"/>${hand(it)}`));
    const top = `${arm(p.ab, p.eb, o.shirt2 || o.shirt, o.itemB)}
      ${o.pack ? `<rect x="-26" y="-112" width="16" height="36" rx="6" fill="${o.pack}"/>` : ""}
      <rect x="-15" y="-116" width="30" height="58" rx="13" fill="${o.shirt}"/>${o.stripe ? `<rect x="-15" y="-96" width="30" height="6" fill="${o.stripe}"/>` : ""}
      <rect x="-3" y="-122" width="8" height="10" fill="${sk}"/>
      <circle cx="2" cy="-130" r="15" fill="${sk}"/>${(HAIR[o.hair] || HAIR.short)(o.hc || "#2A1B12")}
      <circle cx="10" cy="-131" r="1.9" fill="#0C0B0A"/><path d="M8 -123 q4 3 8 -1" stroke="#0C0B0A" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="7" cy="-125" r="2.4" fill="#F28B82" opacity=".55"/>
      ${arm(p.af, p.ef, o.shirt, o.item)}`;
    const body = `${leg(p.lb, p.kb, o.pants2 || pa, 0)}<rect x="-15" y="-70" width="30" height="14" rx="6" fill="${pa}"/><g transform="rotate(${p.lean || 0} 0 -62)">${top}</g>${leg(p.lf, p.kf, pa)}`;
    const bob = p.bob ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -${p.bob};0 0" dur="${d / 2}s" repeatCount="indefinite"/>` : "";
    return `<g transform="translate(${o.x} ${o.y}) scale(${o.s || 1})">${o.shadow ? `<ellipse cx="0" cy="2" rx="22" ry="4" fill="rgba(0,0,0,.18)"/>` : ""}<g>${bob}${body}</g></g>`;
  }
  const scroll = (w, dur, inner) => `<g><animateTransform attributeName="transform" type="translate" values="0 0;-${w} 0" dur="${dur}s" repeatCount="indefinite"/>${inner}<g transform="translate(${w} 0)">${inner}</g></g>`;
  const tree = (x, y, s = 1, c = "#3E9B6A") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-30" width="6" height="30" fill="#6B4A2B"/><ellipse cx="0" cy="-48" rx="18" ry="26" fill="${c}"/></g>`;
  const bld = (x, w, h, c) => `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" fill="${c}"/>` + Array.from({ length: Math.floor(h / 22) }, (_, r) => `<rect x="${x + 6}" y="${206 - h + r * 22}" width="${w - 12}" height="6" fill="rgba(255,255,255,.35)"/>`).join("");
  const wheel = (cx, cy, r, d = 0.6) => `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#0C0B0A"/><circle cx="${cx}" cy="${cy}" r="${r * 0.45}" fill="#BDBAB3"/><path d="M${cx - r * .4} ${cy}h${r * .8}M${cx} ${cy - r * .4}v${r * .8}" stroke="#0C0B0A" stroke-width="2"><animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${cy};360 ${cx} ${cy}" dur="${d}s" repeatCount="indefinite"/></path></g>`;

  const S = [
    { g: "n", t: "En el Macrobús", note: "79 minutos al día en traslados. Come entre comidas y en el camino.", chip: "79 min/día", bg: "#BFE3F5",
      svg: () => `<rect width="360" height="260" fill="#BFE3F5"/>${scroll(360, 9, bld(0, 46, 120, "#9DB7D6") + bld(54, 38, 160, "#7F9BC4") + bld(100, 60, 100, "#A9C3E0") + bld(170, 40, 140, "#8EA9CF") + bld(220, 56, 110, "#9DB7D6") + bld(290, 44, 170, "#7F9BC4") + tree(30, 200, .8) + tree(160, 200, .9) + tree(280, 200, .8))}
        ${person({ x: 132, y: 192, pose: "eat", shirt: "#3A5CFF", pants: "#0C0B0A", hair: "short", item: "bar", s: .78 })}
        ${person({ x: 236, y: 192, pose: "sit", shirt: "#F2B705", pants: "#3A5CFF", hair: "long", hc: "#5A3A22", skin: "#C98B5E", s: .78 })}
        <g><animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur=".5s" repeatCount="indefinite"/><path fill-rule="evenodd" fill="#D6161D" d="M18 74 h318 a12 12 0 0 1 12 12 v104 h-342 v-104 a12 12 0 0 1 12 -12z M40 92 h70 v62 h-70z M122 92 h86 v62 h-86z M220 92 h86 v62 h-86z"/><rect x="6" y="168" width="342" height="8" fill="#C9F23A"/><text x="290" y="187" font-family="JetBrains Mono" font-size="9" fill="#fff">MACROBÚS</text>${wheel(78, 198, 15, .5)}${wheel(282, 198, 15, .5)}</g>
        <rect y="214" width="360" height="46" fill="#4A4A4A"/>${scroll(360, 1.4, Array.from({ length: 6 }, (_, i) => `<rect x="${i * 60}" y="236" width="30" height="4" fill="#fff"/>`).join(""))}` },
    { g: "n", t: "Rumbo a clases", note: "Estudia, o estudia y trabaja. Entre clases busca algo que le quite el hambre.", chip: "UdeG · ITESO · Tec", bg: "#F6E7C8",
      svg: () => `<rect width="360" height="260" fill="#F6E7C8"/>${scroll(360, 10, `<rect x="40" y="70" width="200" height="130" fill="#E8C9A0"/><path d="M30 70 L140 30 L250 70 Z" fill="#D6161D"/>${[60, 100, 140, 180, 220].map((x) => `<rect x="${x}" y="90" width="12" height="110" fill="#F2EFE8"/>`).join("")}<text x="140" y="62" text-anchor="middle" font-family="Anton" font-size="14" fill="#fff">CAMPUS</text>${tree(290, 200, 1.1)}${tree(330, 200, .8, "#5BB37F")}`)}
        <rect y="200" width="360" height="60" fill="#D9C7A6"/>${scroll(360, 1.8, Array.from({ length: 9 }, (_, i) => `<rect x="${i * 40}" y="222" width="22" height="3" fill="#BFAE8E"/>`).join(""))}
        ${person({ x: 180, y: 222, pose: "walk", shirt: "#C9F23A", pants: "#3A5CFF", hair: "pony", hc: "#1E1209", pack: "#D6161D", item: "bar", shadow: 1 })}
        <g transform="translate(300 150)"><rect x="-2" y="0" width="4" height="50" fill="#0C0B0A"/><rect x="-34" y="-14" width="68" height="20" rx="3" fill="#0C0B0A"/><text x="0" y="0" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#C9F23A">CLASE 11:00</text></g>` },
    { g: "n", t: "En la oficina", note: "Jornadas largas. FIBO en el escritorio para la media mañana.", chip: "NSE C · C+", bg: "#F2EFE8",
      svg: () => `<rect width="360" height="260" fill="#F2EFE8"/><rect x="30" y="30" width="120" height="80" fill="#BFE3F5" stroke="#0C0B0A" stroke-width="3"/>${bld(36, 20, 40, "#8EA9CF").replace(/200/g, "110")}<path d="M90 30v80M30 70h120" stroke="#0C0B0A" stroke-width="2"/>
        <g transform="translate(250 60)"><circle r="22" fill="#fff" stroke="#0C0B0A" stroke-width="3"/><line y2="-14" stroke="#0C0B0A" stroke-width="3" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite"/></line><line y2="-9" stroke="#D6161D" stroke-width="3" stroke-linecap="round" transform="rotate(120)"/></g>
        <rect x="290" y="100" width="34" height="30" fill="#F2B705" transform="rotate(6 307 115)"/><rect x="186" y="96" width="30" height="28" fill="#C9F23A" transform="rotate(-5 200 110)"/>
        ${person({ x: 106, y: 228, pose: "type", shirt: "#D6161D", pants: "#0C0B0A", hair: "short", hc: "#0C0B0A", skin: "#B87A52" })}
        <rect x="40" y="166" width="300" height="12" fill="#6B4A2B"/><rect x="60" y="178" width="8" height="70" fill="#6B4A2B"/><rect x="310" y="178" width="8" height="70" fill="#6B4A2B"/>
        <g transform="translate(160 116)"><rect width="80" height="52" rx="4" fill="#0C0B0A"/><rect x="5" y="5" width="70" height="40" fill="#3A5CFF"/>${[0, 1, 2, 3].map((i) => `<rect x="10" y="${12 + i * 8}" width="${30 + (i * 13) % 30}" height="3" fill="#C9F23A"><animate attributeName="width" values="4;${30 + (i * 13) % 30};4" dur="${1.6 + i * .3}s" repeatCount="indefinite"/></rect>`).join("")}<path d="M-6 52h92l-6 6H0z" fill="#3A3A3A"/></g>
        <g transform="translate(272 150)"><path d="M0 0h20v16a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z" fill="#fff" stroke="#0C0B0A" stroke-width="2"/>${[4, 10].map((x, i) => `<path d="M${x} -4 q-4 -6 0 -12" stroke="#8A877F" stroke-width="2" fill="none"><animate attributeName="opacity" values="0;1;0" dur="2s" begin="${i}s" repeatCount="indefinite"/></path>`).join("")}</g>
        <image href="assets/fibo-cookies.webp" x="230" y="150" width="46" height="16" transform="rotate(-8 253 158)"/>` },
    { g: "s", t: "Corriendo en el parque", note: "Más intención de compra y menos sensibles al precio.", chip: "Carreras", bg: "#E9D8F2",
      svg: () => `<rect width="360" height="260" fill="#EADCF3"/><circle cx="250" cy="70" r="34" fill="#F7EEF9"/>${scroll(360, 14, bld(10, 30, 110, "#D9C3E8") + bld(60, 24, 150, "#CFB4E2") + bld(150, 36, 120, "#D9C3E8") + bld(240, 26, 160, "#CFB4E2") + bld(300, 40, 100, "#D9C3E8"))}
        ${scroll(360, 6, `<path d="M0 200 Q 60 150 140 190 T 360 180 V260 H0Z" fill="#5BB38C"/>${tree(70, 196, 1.2, "#3E9B6A")}${tree(250, 194, 1, "#46A877")}`)}
        <rect y="206" width="360" height="54" fill="#6FC59B"/><rect y="214" width="360" height="16" fill="#F2EFE8"/>
        ${scroll(360, 2.4, `<g transform="translate(270 214)"><rect x="0" y="-26" width="56" height="5" fill="#7A4A2B"/><rect x="0" y="-17" width="56" height="5" fill="#7A4A2B"/><rect x="4" y="-12" width="4" height="14" fill="#555"/><rect x="48" y="-12" width="4" height="14" fill="#555"/><ellipse cx="34" cy="-30" rx="7" ry="8" fill="#0C0B0A"/><circle cx="34" cy="-42" r="6" fill="#0C0B0A"/><path d="M30 -48l-2-6 4 3M38 -48l2-6-4 3" fill="#0C0B0A"/><circle cx="34" cy="-30" r="3" fill="#fff"/></g>`)}
        ${person({ x: 170, y: 224, pose: "run", shirt: "#7A3AD6", shirt2: "#4B1F94", pants: "#E5E2DA", pants2: "#C9C6BD", hair: "short", skin: "#7A4A2B", shoe: "#3A5CFF", shadow: 1 })}` },
    { g: "s", t: "Domingo en la Vía RecreActiva", note: "Cada domingo, miles de personas en bici. Una vitrina para alcanzarlos.", chip: "Vía RecreActiva", bg: "#FFE3D1",
      svg: () => `<rect width="360" height="260" fill="#FFE3D1"/><rect x="20" y="52" width="220" height="28" rx="4" fill="#3A5CFF"/><text x="130" y="72" text-anchor="middle" font-family="Anton" font-size="15" fill="#fff" letter-spacing="1">VÍA RECREACTIVA · DOMINGO</text>
        ${scroll(360, 5, tree(40, 196, 1.2) + tree(150, 196, .9, "#5BB37F") + tree(260, 196, 1.1) + `<rect x="200" y="150" width="4" height="46" fill="#555"/><circle cx="202" cy="146" r="8" fill="#F2B705"/>`)}
        <rect y="196" width="360" height="64" fill="#7C7C7C"/>${scroll(360, 1, Array.from({ length: 6 }, (_, i) => `<rect x="${i * 60}" y="226" width="30" height="4" fill="#F2B705"/>`).join(""))}
        <g transform="translate(0 0)">${wheel(130, 200, 22, .45)}${wheel(232, 200, 22, .45)}<path d="M130 200 L165 160 L210 160 L232 200 M165 160 L180 200 L130 200 M180 200 L210 160 M210 160 L214 146 M160 154 h16" stroke="#D6161D" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M208 146 h14" stroke="#0C0B0A" stroke-width="5" stroke-linecap="round"/></g>
        ${person({ x: 168, y: 216, pose: "bike", shirt: "#C9F23A", pants: "#0C0B0A", hair: "cap", hc: "#D6161D", skin: "#E0A27A", s: .95 })}` },
    { g: "s", t: "Partido de pádel", note: "El pádel está en auge en Guadalajara: público activo y de alta intención.", chip: "Pádel", bg: "#BCD3FF",
      svg: () => `<rect width="360" height="260" fill="#3A5CFF"/><rect x="0" y="40" width="360" height="140" fill="#5A79FF" opacity=".5"/>${[60, 140, 220, 300].map((x) => `<rect x="${x}" y="40" width="3" height="150" fill="#9FB4FF"/>`).join("")}<rect y="190" width="360" height="70" fill="#2E7DD1"/><path d="M0 214 H360" stroke="#fff" stroke-width="3"/><rect x="250" y="150" width="4" height="48" fill="#fff"/><rect x="254" y="150" width="90" height="40" fill="url(#puNet)" stroke="#fff" stroke-width="2"/>
        <defs><pattern id="puNet" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0L8 8M8 0L0 8" stroke="#fff" stroke-width=".8"/></pattern></defs>
        ${person({ x: 140, y: 226, pose: "swing", shirt: "#F2EFE8", pants: "#D6161D", hair: "pony", hc: "#2A1B12", item: "racket", shadow: 1 })}
        <circle r="6" fill="#C9F23A" stroke="#0C0B0A" stroke-width="1.5"><animateMotion dur="1.3s" repeatCount="indefinite" path="M190 120 Q 270 40 340 150 Q 270 60 190 120"/></circle>` },
    { g: "s", t: "Después de entrenar", note: "FIBO ya llega a unos 150 gimnasios. La barra para después, pero no solo para eso.", chip: "≈150 gimnasios", bg: "#2A2A2A",
      svg: () => `<rect width="360" height="260" fill="#2A2A2A"/><rect x="200" y="30" width="140" height="160" fill="#3A3A3A" stroke="#555" stroke-width="3"/><path d="M220 40 l30 140 M260 40 l20 140" stroke="#4A4A4A" stroke-width="10"/>
        <rect x="30" y="60" width="10" height="140" fill="#555"/><rect x="120" y="60" width="10" height="140" fill="#555"/>${[90, 130, 170].map((y) => `<rect x="24" y="${y}" width="112" height="6" fill="#777"/><rect x="40" y="${y - 10}" width="16" height="16" rx="3" fill="#D6161D"/><rect x="100" y="${y - 10}" width="16" height="16" rx="3" fill="#3A5CFF"/>`).join("")}
        <rect y="210" width="360" height="50" fill="#1A1A1A"/><text x="270" y="24" text-anchor="middle" font-family="Anton" font-size="16" fill="#C9F23A">GYM</text>
        ${person({ x: 240, y: 226, pose: "curl", shirt: "#0C0B0A", stripe: "#C9F23A", pants: "#3A5CFF", hair: "bun", hc: "#0C0B0A", skin: "#C98B5E", item: "dumbbell", itemB: "dumbbell", shadow: 1 })}
        <g transform="translate(150 186)"><rect x="0" y="0" width="40" height="24" rx="3" fill="#F2EFE8"/><image href="assets/fibo-chocolate.webp" x="-4" y="-16" width="48" height="17" transform="rotate(-10 20 -8)"/></g>` },
    { g: "c", t: "La colación de las 5", note: "En lugar del pan dulce o la botana. Compra en abarrotes cerca de casa o del trabajo.", chip: "17:00", bg: "#FFF1B8",
      svg: () => `<rect width="360" height="260" fill="#FFF1B8"/><rect x="40" y="40" width="280" height="22" fill="#F2EFE8"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${40 + i * 28} 62 h28 v14 a14 14 0 0 1 -28 0z" fill="${i % 2 ? "#F2EFE8" : "#D6161D"}"/>`).join("")}<text x="180" y="57" text-anchor="middle" font-family="Anton" font-size="14" fill="#D6161D" letter-spacing="1">ABARROTES</text>
        <rect x="50" y="90" width="260" height="110" fill="#E8D7A8"/>${[110, 150].map((y) => `<rect x="50" y="${y}" width="260" height="5" fill="#B8A578"/>`).join("")}
        ${Array.from({ length: 7 }, (_, i) => `<rect x="${60 + i * 34}" y="94" width="22" height="16" rx="2" fill="${["#3A5CFF", "#F2B705", "#5BB37F", "#D6161D"][i % 4]}"/>`).join("")}
        <g transform="translate(200 128)"><ellipse cx="0" cy="12" rx="16" ry="9" fill="#E7A65A"/><path d="M-14 10 q14 -12 28 0" stroke="#fff" stroke-width="2" fill="none"/><path d="M-20 -4 L20 26 M20 -4 L-20 26" stroke="#D6161D" stroke-width="3"/><text x="0" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#0C0B0A">PAN DULCE</text></g>
        <image href="assets/fibo-frutos.webp" x="236" y="128" width="58" height="20"><animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="1.6s" repeatCount="indefinite"/></image>
        <rect y="200" width="360" height="60" fill="#D9C68A"/>
        ${person({ x: 112, y: 226, pose: "reach", shirt: "#3A5CFF", pants: "#6B6862", hair: "bun", hc: "#9A978F", skin: "#E8A77C", shadow: 1 })}
        <g transform="translate(30 120)"><circle r="18" fill="#fff" stroke="#0C0B0A" stroke-width="2"/><text y="4" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#0C0B0A">17:00</text></g>` },
  ];
  const GC = { n: "#D6161D", s: "#3A5CFF", c: "#F2B705" };
  const grid = document.getElementById("puGrid");
  grid.innerHTML = S.map((s, i) => `
    <figure class="pu__sc g${s.g}" data-g="${s.g}" style="--i:${i}">
      <svg viewBox="0 0 360 260" role="img" aria-label="${s.t}">${s.svg()}</svg>
      <figcaption class="pu__note"><div class="dt"><i></i><i></i><i></i></div><p class="mono">Escena #${i + 1} · <b style="color:${GC[s.g]}">${{ n: "Núcleo", s: "Secundario", c: "Colación" }[s.g]}</b></p><b>${s.t}</b><span>${s.note}</span></figcaption>
      <span class="pu__chip mono" style="--c:${GC[s.g]}">${s.chip}</span>
    </figure>`).join("");

  // tag filter
  const tags = [...sec.querySelectorAll("#puTags button")], scs = [...grid.children];
  tags.forEach((b) => b.addEventListener("click", () => {
    tags.forEach((x) => x.classList.toggle("on", x === b));
    scs.forEach((s) => s.classList.toggle("dim", b.dataset.g !== "all" && s.dataset.g !== b.dataset.g));
  }));

  // fake "now playing" progress
  const prog = document.getElementById("puProg");
  let t0 = performance.now();
  const tick = (t) => { prog.style.width = (((t - t0) / 24000) % 1) * 100 + "%"; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);

  /* ---------- diary pages ---------- */
  const days = (k) => ["L", "M", "M", "J", "V", "S", "D"].map((d, i) => `<i class="${i === k ? "on" : ""}">${d}</i>`).join("");
  const B = [
    { id: "", c: "#D6161D", k: 1, date: "11 · nov", topic: "El núcleo · joven activo en tránsito · 20–29",
      ck: ["Trabaja, o estudia y trabaja", "≈1.1 millones de 18 a 29 años en la zona metropolitana", "≈79 minutos al día en traslados", "Come entre comidas y compra por impulso en conveniencia, donde FIBO ya está"],
      body: "No busca un suplemento: busca algo que <u>le quite el hambre</u>, que se le antoje y que pueda comer en el camino. Es el grupo que mejor encaja con el cambio de dirección.",
      foot: "Foco: jóvenes con ingreso propio · NSE C y C+",
      stk: `<img class="st ph" src="assets/oc-mimacro.webp" alt="" style="--r:4deg"><span class="st big" style="--r:-6deg">1.1 M</span><img class="st bar" src="assets/fibo-cookies.webp" alt="" style="--r:-12deg"><span class="st heart">llena</span>` },
    { id: "", c: "#3A5CFF", k: 6, date: "16 · nov", topic: "Secundario · activos y deportistas · 18–35",
      ck: ["Van al gimnasio, corren, juegan pádel o andan en bici", "Menos en número, más intención de compra", "Menos sensibles al precio", "FIBO ya les llega en ≈150 gimnasios"],
      body: "Para ellos FIBO sigue siendo la barra para después de entrenar, <u>pero sin que ese sea su único momento</u>. Vitrinas en la ciudad: la Vía RecreActiva y las carreras.",
      foot: "Vitrinas: Vía RecreActiva · Maratón · pádel",
      stk: `<img class="st ph" src="assets/oc-colomos.webp" alt="" style="--r:-4deg"><span class="st big blue" style="--r:5deg">150</span><img class="st bar" src="assets/fibo-chocolate.webp" alt="" style="--r:10deg"><span class="st heart b">22 g</span>` },
    { id: "", c: "#F2B705", k: 3, date: "13 · nov", topic: "Tercer grupo · la colación práctica",
      ck: ["Adultos que buscan algo para la media tarde", "En lugar del pan dulce o la botana", "Compran en abarrotes y tiendas cerca de casa o del trabajo"],
      body: "No es el foco de la comunicación, <u>pero sí de la distribución</u>: ya es un canal que vende.",
      foot: "Comunicación ✕ · Distribución ✓",
      stk: `<span class="st clock" style="--r:-4deg">17:00</span><span class="st pan" style="--r:8deg">pan dulce</span><img class="st bar" src="assets/fibo-frutos.webp" alt="" style="--r:-8deg">` },
    { id: "puNo", c: "#0C0B0A", k: 4, date: "14 · nov", topic: "A quién no le habla FIBO",
      no: [["Niños", "La barra lleva edulcorantes que no se recomiendan para ellos y dos sellos de advertencia."], ["Atletas y fisicoculturistas", "Ese territorio ya lo ocupan Evolution o Quest, y FIBO decidió dejarlo."], ["Todo México, por ahora", "El foco es Guadalajara: donde nació, se fabrica y tiene su distribución."]],
      foot: "Primero Guadalajara · después otras ciudades",
      stk: `<span class="st stamp" style="--r:-10deg">GDL</span>` },
  ];
  const book = document.getElementById("puBook");
  const ILL = [0, 3, 7];
  const noSvg = `<svg viewBox="0 0 360 260"><rect width="360" height="260" fill="#F2EFE8"/><circle cx="180" cy="120" r="78" fill="#C9F23A"/><path d="M180 58c-26 0-46 20-46 46 0 34 46 82 46 82s46-48 46-82c0-26-20-46-46-46z" fill="#D6161D"><animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="2s" repeatCount="indefinite"/></path><text x="180" y="114" text-anchor="middle" font-family="Anton" font-size="30" fill="#fff">GDL<animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="2s" repeatCount="indefinite"/></text><ellipse cx="180" cy="204" rx="30" ry="6" fill="rgba(0,0,0,.15)"/>${["Niños", "Atletas", "Todo México"].map((t, i) => `<g transform="translate(${60 + i * 120} 232)"><rect x="-48" y="-14" width="96" height="26" rx="13" fill="#fff" stroke="#0C0B0A" stroke-width="1.5"/><text y="4" text-anchor="middle" font-family="Space Grotesk" font-size="12" fill="#8A877F">${t}</text><path d="M-40 -1h80" stroke="#D6161D" stroke-width="2.5"/></g>`).join("")}</svg>`;
  book.innerHTML = B.map((b, i) => `
    <article class="pu__pg" ${b.id ? `id="${b.id}"` : ""} style="--c:${b.c};--i:${i}">
      <div class="ill">${i < 3 ? `<svg viewBox="0 0 360 260">${S[ILL[i]].svg()}</svg>` : noSvg}</div>
      <div class="tx">
        <p class="mono lb"><i></i>${["Núcleo", "Secundario", "Tercer grupo", "Fuera del foco"][i]}</p>
        <h3>${(i === 3 ? b.topic : b.topic.replace(/^[^·]*· /, "")).replace(/^./, (m) => m.toUpperCase())}</h3>
        ${b.ck ? `<ul class="ck">${b.ck.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
        ${b.no ? `<ul class="no">${b.no.map(([h, x]) => `<li><b>${h}</b><span>${x}</span></li>`).join("")}</ul>` : ""}
        ${b.body ? `<p class="bd">${b.body}</p>` : ""}
        <p class="ft mono">${b.foot}</p>
      </div>
    </article>`).join("");

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  sec.querySelectorAll(".pu__head, #puWin, .pu__pg, #puEnd").forEach((n) => io.observe(n));
})();
