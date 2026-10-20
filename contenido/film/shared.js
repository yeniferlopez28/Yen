window.PRN = {
  // paper ribbon in the photo, top (slot) to bottom (tip): [left x, y, right x, y] in stage px
  SEC: [[475,795,780,905],[410,890,700,985],[365,985,650,1060],[342,1085,615,1150],[330,1185,595,1245],[318,1275,575,1340],[285,1360,545,1420],[225,1420,515,1480],[165,1465,438,1595],[100,1500,330,1690]],
  build(kit, extra) {
    kit.stage.append(kit.h('<div class="ground"><div class="p-cam" style="position:absolute;inset:0;transform-origin:540px 1100px">' +
      '<img class="p-photo" src="' + kit.assets.url('copier-photo.webp') + '">' +
      '<canvas class="p-ink" width="1080" height="1920"></canvas></div>' + (extra || '') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    // densify the sections with Catmull-Rom so the ribbon bends smoothly
    const S = this.SEC, cr = (a, b, c, d, u) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    const rows = [];
    for (let i = 0; i < S.length - 1; i++) for (let k = 0; k < 14; k++) {
      const u = k / 14, A = S[Math.max(0, i - 1)], B = S[i], C = S[i + 1], D = S[Math.min(S.length - 1, i + 2)];
      rows.push([0, 1, 2, 3].map((j) => cr(A[j], B[j], C[j], D[j], u)));
    }
    rows.push(S[S.length - 1]);
    let s = 0; const arc = [0];
    for (let i = 1; i < rows.length; i++) { const m0 = [(rows[i - 1][0] + rows[i - 1][2]) / 2, (rows[i - 1][1] + rows[i - 1][3]) / 2], m1 = [(rows[i][0] + rows[i][2]) / 2, (rows[i][1] + rows[i][3]) / 2]; s += Math.hypot(m1[0] - m0[0], m1[1] - m0[1]); arc.push(s); }
    // ink strip: the three bars laid along the paper, as printed
    const W = 300, L = Math.ceil(s), tex = document.createElement('canvas'); tex.width = W; tex.height = L;
    return { cam: q('.p-cam').style, ink: q('.p-ink').getContext('2d'), rows, arc, L, W, tex, ready: false };
  },
  async load(kit, p) {
    const g = p.tex.getContext('2d'), names = ['cookies', 'frutos', 'chocolate'];
    const imgs = await Promise.all(names.map((n) => kit.assets.image(n + '.webp')));
    const gap = (p.L - 160) / 3;
    imgs.forEach((im, i) => {
      const long = gap * 0.97, short = long * im.naturalHeight / im.naturalWidth;
      g.save(); g.translate(p.W / 2, p.L - 160 - (gap * i + gap / 2)); g.rotate(Math.PI / 2); g.drawImage(im, -long / 2, -short / 2, long, short); g.restore();
    });
    p.ready = true;
  },
  // feed: how many px of ink have come out of the slot (0..L)
  draw(p, feed) {
    const c = p.ink; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1080, 1920);
    if (!p.ready || feed <= 0) return;
    const R = p.rows, A = p.arc, L = p.L;
    for (let i = 0; i < R.length - 1; i++) {
      const a = R[i], b = R[i + 1], h = A[i + 1] - A[i];
      // texture is stored tip-first: row y = L - (feed - distance from slot)
      let sy = L - feed + A[i], sh = h + 0.8, dy = 0;
      if (sy >= L) break;
      if (sy < 0) { dy = -sy; sh += sy; sy = 0; if (sh <= 0) continue; }
      sh = Math.min(sh, L - sy);
      c.setTransform((a[2] - a[0]) / p.W, (a[3] - a[1]) / p.W, (b[0] - a[0]) / h, (b[1] - a[1]) / h, a[0], a[1]);
      c.drawImage(p.tex, 0, sy, p.W, sh, 0, dy, p.W, sh);
    }
  },
  hold(p, filmT) { p.cam.transform = 'translate(' + (Math.sin(filmT * 0.7) * 4) + 'px,' + (Math.cos(filmT * 0.5) * 3) + 'px) scale(' + (1.02 + filmT * 0.003) + ')'; },
};
