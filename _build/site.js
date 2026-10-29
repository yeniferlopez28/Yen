// Comportamiento compartido de las páginas internas: cursor de dientito y botones de copiar.
(function(){
  var cur = document.getElementById('cursor');
  if (cur && window.matchMedia('(pointer:fine)').matches) {
    document.documentElement.classList.add('tooth-cursor');
    document.addEventListener('pointermove', function(e){
      if (e.pointerType && e.pointerType !== 'mouse') return;
      cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      cur.style.opacity = 1;
      var el = e.target;
      cur.classList.toggle('typing', !!el.closest('input,textarea,select'));
      cur.classList.toggle('big', !!el.closest('a,button,summary,label'));
      cur.classList.toggle('light', !!el.closest('[data-cursor="light"],.wa-fab,.pg-quote,.pg-card.feat,.btn-vino'));
    });
    document.addEventListener('pointerdown', function(){ cur.classList.add('down'); });
    document.addEventListener('pointerup', function(){ cur.classList.remove('down'); });
    document.documentElement.addEventListener('mouseleave', function(){ cur.style.opacity = 0; });
  }

  var toast = document.getElementById('toast'), tt;
  function say(m){ if (!toast) return; toast.textContent = m; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove('on'); }, 1800); }
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){
      var v = b.getAttribute('data-copy');
      try { navigator.clipboard.writeText(v).then(function(){ say('Copiado: ' + v); }, function(){ say('Mantén presionado el número para copiarlo'); }); }
      catch (e) { say('Mantén presionado el número para copiarlo'); }
    });
  });
})();
