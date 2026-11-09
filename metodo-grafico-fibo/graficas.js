// Genera las gráficas (Paso 4) de los ejercicios de método gráfico con FIBO.
const { chromium } = require('playwright');
const fs = require('fs');

const AZUL = '#29abe2', ROJO = '#e8272b', AMARILLO = '#f2e600';

const problemas = [
  { archivo: 'ejercicio-1', max: 450, lineas: [
    { n: 'R1', x1: 300, x2: 360, c: AZUL },
    { n: 'R2', x1: 420, x2: 280, c: ROJO } ] },
  { archivo: 'ejercicio-2', max: 540, lineas: [
    { n: 'R1', x1: 250, x2: 500, c: AZUL },
    { n: 'R2', x1: 420, x2: 210, c: ROJO },
    { n: 'R3', x1: 330, x2: 330, c: AMARILLO } ] },
  { archivo: 'ejercicio-3', max: 90, lineas: [
    { n: 'R1', x1: 60, x2: 60, c: AZUL },
    { n: 'R2', x1: 80, x2: 40, c: ROJO } ] },
];

function svg(p) {
  const W = 900, H = 720, ox = 150, oy = 620, s = 680 / p.max, sy = 540 / p.max;
  const X = v => ox + v * s, Y = v => oy - v * sy;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Century Gothic, Futura, Arial, sans-serif">
  <rect width="100%" height="100%" fill="#fff"/>
  <line x1="${ox - 60}" y1="${oy}" x2="${W - 40}" y2="${oy}" stroke="${AZUL}" stroke-width="2"/>
  <line x1="${ox}" y1="${oy + 60}" x2="${ox}" y2="40" stroke="${AZUL}" stroke-width="2"/>
  <text x="${W - 50}" y="${oy + 40}" font-size="26">x1</text>
  <text x="${ox - 50}" y="45" font-size="26">x2</text>`;
  for (const l of p.lineas) {
    out += `<line x1="${X(0)}" y1="${Y(l.x2)}" x2="${X(l.x1)}" y2="${Y(0)}" stroke="${l.c}" stroke-width="9"/>`;
  }
  const orden = [...p.lineas].sort((a, b) => a.x1 - b.x1);
  orden.forEach((l, i) => { l.dy = i > 0 && (l.x1 - orden[i - 1].x1) * s < 110 && !orden[i - 1].dy ? 30 : 0; });
  for (const l of p.lineas) {
    const borde = l.c === AMARILLO ? '#555' : '#fff';
    out += `<circle cx="${X(0)}" cy="${Y(l.x2)}" r="12" fill="${l.c}" stroke="${borde}" stroke-width="2"/>
      <circle cx="${X(l.x1)}" cy="${Y(0)}" r="12" fill="${l.c}" stroke="${borde}" stroke-width="2"/>
      <text x="${X(0) - 22}" y="${Y(l.x2) + 8}" font-size="22" text-anchor="end">x2 = ${l.x2}</text>
      <text x="${X(l.x1) - 45}" y="${oy + 42 + l.dy}" font-size="22">x1 = ${l.x1}</text>
      <text x="${X(l.x1 * 0.5) + 14}" y="${Y(l.x2 * 0.5) - 14}" font-size="22" font-weight="bold" fill="${l.c === AMARILLO ? '#b5a800' : l.c}">${l.n}</text>`;
  }
  return out + '</svg>';
}

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 900, height: 720 }, deviceScaleFactor: 2 });
  for (const p of problemas) {
    await pg.setContent(`<body style="margin:0">${svg(p)}</body>`);
    await pg.screenshot({ path: `${p.archivo}.png` });
  }
  await b.close();
})();
