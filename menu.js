// Menú desplegable de tratamientos: se abre al pasar el mouse (computadora) o al tocar (celular).
(function(){
  var btn = document.querySelector('.mega-btn'), panel = document.getElementById('mega');
  if (!btn || !panel) return;
  var wrap = btn.parentNode, timer;
  function set(open){
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.classList.toggle('mega-open', open);
  }
  btn.addEventListener('click', function(e){ e.stopPropagation(); set(panel.hidden); });
  document.addEventListener('click', function(e){ if (!panel.hidden && !panel.contains(e.target)) set(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    wrap.addEventListener('mouseenter', function(){ clearTimeout(timer); set(true); });
    wrap.addEventListener('mouseleave', function(){ timer = setTimeout(function(){ set(false); }, 200); });
  }
  panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ set(false); }); });
  window.addEventListener('scroll', function(){ if (!panel.hidden && !wrap.matches(':hover')) set(false); }, {passive: true});
})();
