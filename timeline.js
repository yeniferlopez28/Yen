// Timeline: first all years stand as vertical columns; then each one opens in turn into a full text panel.
(() => {
  const sec = document.getElementById("historia");
  if (!sec) return;
  const rail = document.getElementById("tlRail");
  const cols = [...rail.querySelectorAll(".tl__col")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = -1, timer = 0, auto = true, visible = false;

  function open(i) {
    cur = i;
    rail.classList.toggle("has-open", i >= 0);
    cols.forEach((c, j) => c.classList.toggle("on", j === i));
  }
  const stopAuto = () => { auto = false; clearInterval(timer); };
  cols.forEach((c, i) => {
    c.onclick = () => { stopAuto(); if (cur !== i) open(i); };
    c.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.onclick(); } };
  });
  document.getElementById("tlNext").onclick = () => { stopAuto(); open((cur + 1) % cols.length); };
  document.getElementById("tlPrev").onclick = () => { stopAuto(); open((cur - 1 + cols.length) % cols.length); };
  document.getElementById("tlAll").onclick = () => { stopAuto(); open(-1); };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && auto && !timer && !reduced) {
      // show all years first, then walk through them
      timer = setInterval(() => { if (visible && auto) open((cur + 1) % cols.length); }, 5000);
      setTimeout(() => { if (auto) open(0); }, 1600);
    }
  }, { threshold: 0.4 }).observe(rail);
})();
