// Mini brand manual: palette tiles copy their HEX on tap.
(() => {
  const sec = document.getElementById("manual");
  if (!sec) return;
  sec.querySelectorAll(".mm-tile").forEach((t) => t.addEventListener("click", () => { const h = t.dataset.hex; if (!h) return; try { navigator.clipboard.writeText(h).catch(() => {}); } catch (e) {} t.style.opacity = .6; setTimeout(() => t.style.opacity = "", 300); }));
})();
