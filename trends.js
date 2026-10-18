// Trends read like an essay: the index on the left follows the trend in view; the highlight sweeps in as each one arrives.
(() => {
  const sec = document.getElementById("tendencias");
  if (!sec) return;
  const links = [...sec.querySelectorAll(".tr__idx a")];
  const items = links.map((a) => document.getElementById(a.hash.slice(1)));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    links.forEach((a, i) => a.classList.toggle("on", items[i] === e.target));
    // on phones the index is a horizontal strip: keep the active topic visible
    const on = sec.querySelector(".tr__idx a.on"), idx = on && on.closest("ol");
    if (on && idx.scrollWidth > idx.clientWidth) idx.scrollTo({ left: on.parentElement.offsetLeft - 16, behavior: "smooth" });
  }), { rootMargin: "-40% 0px -50% 0px" });
  items.forEach((it) => io.observe(it));
  links.forEach((a, i) => a.addEventListener("click", (ev) => { ev.preventDefault(); items[i].scrollIntoView({ behavior: "smooth", block: "center" }); }));
})();
