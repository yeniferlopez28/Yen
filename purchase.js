// Purchase journey: a little person walks the 7-stage line and lights each icon; each stage scene animates as it scrolls in.
(() => {
  const sec = document.getElementById("compra");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const btns = [...sec.querySelectorAll(".pc__track button")], labels = [...sec.querySelectorAll(".pc__labels li")];
  const walker = sec.querySelector(".pc__walker"), track = sec.querySelector(".pc__track");
  let cur = 0, auto = true;
  function go(i) {
    cur = i;
    btns.forEach((b, k) => { b.classList.toggle("on", k === i); b.classList.toggle("done", k < i); });
    labels.forEach((l, k) => l.classList.toggle("on", k === i));
    const b = btns[i], r = track.getBoundingClientRect(), br = b.getBoundingClientRect();
    walker.style.transform = `translateX(${br.left - r.left + br.width / 2 - 14}px)`;
  }
  btns.forEach((b, i) => (b.onclick = () => { auto = false; go(i); document.getElementById("pc" + (i + 1)).scrollIntoView({ behavior: "smooth", block: "center" }); }));
  let vis = false;
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0.4 }).observe(track);
  go(0);
  if (!reduced) setInterval(() => { if (auto && vis) go((cur + 1) % btns.length); }, 1600);
  addEventListener("resize", () => go(cur));

  const mail = document.getElementById("pcMail");
  for (let i = 0; i < 105; i++) { const d = document.createElement("i"); if (i < 87) d.className = "off"; d.style.transitionDelay = i * 8 + "ms"; mail.appendChild(d); }

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.3 });
  sec.querySelectorAll(".pc__pipe, .pc__st, .pc__leak").forEach((n) => io.observe(n));
})();
