// Buscador del sitio: ventana de búsqueda (lupa del encabezado, tecla "/" o Ctrl+K)
// y filtros en las páginas de tratamientos, cuidados y blog.
(function(){
  var INDEX = window.DC_INDEX || [], ICONS = window.DC_ICONS || {};
  function norm(s){
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9$ ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function score(it, words, phrase){
    var t = norm(it.t), total = 0;
    if (words.length > 1 && (t.indexOf(phrase) > -1 || it.k.indexOf(phrase) > -1)) total += 9;
    for (var i = 0; i < words.length; i++) {
      var w = words[i], s = 0;
      if (t.indexOf(w) === 0 || t.indexOf(' ' + w) > -1) s = 10;
      else if (t.indexOf(w) > -1) s = 7;
      else if (it.k.indexOf(w) > -1) s = 5;
      else if (it.x.indexOf(w) > -1) s = 2;
      else if (w.length > 4 && (it.k + ' ' + it.x).indexOf(w.slice(0, -1)) > -1) s = 1; // plural/singular
      if (!s) return 0;
      total += s;
    }
    var bonus = {'Tratamiento': 4, 'Cuidados': 2, 'Página': 2, 'Blog': 1, 'Pregunta': -2}[it.c] || 0;
    return total + bonus;
  }
  var STOP = {de:1, la:1, el:1, los:1, las:1, un:1, una:1, y:1, en:1, que:0, por:1, para:1, mi:1, me:1, se:1, con:1, del:1, al:1, a:1, es:1, lo:1};
  function search(q){
    var words = norm(q).split(' ').filter(function(w){ return w && !STOP[w]; });
    if (!words.length) return [];
    var phrase = words.join(' ');
    return INDEX.map(function(it){ return {it: it, s: score(it, words, phrase)}; })
      .filter(function(r){ return r.s > 0; })
      .sort(function(a, b){ return b.s - a.s; })
      .slice(0, 12).map(function(r){ return r.it; });
  }
  function hl(text, q){
    var out = esc(text), words = norm(q).split(' ').filter(function(w){ return w.length > 2 && !STOP[w]; });
    words.forEach(function(w){
      var re = new RegExp('(' + w.split('').map(function(ch){
        var map = {a:'[aá]', e:'[eé]', i:'[ií]', o:'[oó]', u:'[uúü]', n:'[nñ]'};
        return map[ch] || ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }).join('') + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  // ----- Ventana de búsqueda -----
  var box = document.getElementById('srch'), input = document.getElementById('srch-q'), list = document.getElementById('srch-res'), sel = -1;
  if (box && input && list) {
    var opener = null;
    function open(){
      opener = document.activeElement;
      box.hidden = false; document.documentElement.classList.add('srch-open');
      setTimeout(function(){ input.focus(); input.select(); }, 20);
      render();
    }
    function close(){
      box.hidden = true; document.documentElement.classList.remove('srch-open');
      if (opener && opener.focus) opener.focus();
    }
    function render(){
      var q = input.value, res = search(q);
      sel = res.length ? 0 : -1;
      if (!norm(q)) {
        list.innerHTML = '<p class="srch-hint">Prueba con:</p><div class="srch-sug">' +
          ['Limpieza', 'Dolor de muela', 'Brackets', 'Implante', 'Qué comer después de una extracción', 'Blanqueamiento', 'Niños', 'Precios'].map(function(s){
            return '<button type="button" data-q="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>';
        return;
      }
      if (!res.length) {
        list.innerHTML = '<div class="srch-empty"><b>No encontré resultados para “' + esc(q) + '”.</b><p>Escríbeme tu duda y te respondo.</p><a class="btn btn-vino" href="https://wa.me/523311946819?text=' +
          encodeURIComponent('Hola, Dra. Ana Paula. Tengo una pregunta: ' + q) + '" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div>';
        return;
      }
      list.innerHTML = '<ul role="listbox">' + res.map(function(it, n){
        var ic = it.i && ICONS[it.i] ? '<span class="ic"><svg viewBox="0 0 120 120" aria-hidden="true">' + ICONS[it.i] + '</svg></span>' : '<span class="ic dot">' + esc(it.c.charAt(0)) + '</span>';
        var d = it.d.length > 120 ? it.d.slice(0, 118).replace(/\s\S*$/, '') + '…' : it.d;
        return '<li role="option" id="sr-' + n + '"' + (n === 0 ? ' aria-selected="true"' : '') + '><a href="' + esc(it.u) + '">' + ic +
          '<span class="tx"><small>' + esc(it.c) + (it.p ? ' · ' + esc(it.p) : '') + '</small><b>' + hl(it.t, q) + '</b><span>' + hl(d, q) + '</span></span></a></li>';
      }).join('') + '</ul>';
    }
    function move(d){
      var items = list.querySelectorAll('li');
      if (!items.length) return;
      if (sel > -1) items[sel].removeAttribute('aria-selected');
      sel = (sel + d + items.length) % items.length;
      items[sel].setAttribute('aria-selected', 'true');
      items[sel].scrollIntoView({block: 'nearest'});
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', function(e){
      if (e.key === 'ArrowDown') { move(1); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { move(-1); e.preventDefault(); }
      else if (e.key === 'Enter') { var a = list.querySelector('li[aria-selected] a'); if (a) { a.click(); e.preventDefault(); } }
    });
    list.addEventListener('click', function(e){
      var b = e.target.closest('[data-q]');
      if (b) { input.value = b.getAttribute('data-q'); render(); input.focus(); return; }
      if (e.target.closest('a')) close();
    });
    box.addEventListener('click', function(e){ if (e.target === box) close(); });
    document.querySelectorAll('[data-srch-open]').forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); open(); }); });
    document.getElementById('srch-x').addEventListener('click', close);
    document.addEventListener('keydown', function(e){
      var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
      if (e.key === 'Escape' && !box.hidden) close();
      else if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing && box.hidden)) { e.preventDefault(); open(); }
    });
  }

  // ----- Filtro dentro de una página -----
  document.querySelectorAll('[data-filter]').forEach(function(wrap){
    var inp = wrap.querySelector('input'), count = wrap.querySelector('.flt-count');
    var scope = document.querySelector(wrap.getAttribute('data-filter'));
    if (!inp || !scope) return;
    var items = scope.querySelectorAll('[data-s]'), groups = scope.querySelectorAll('[data-group]'), empty = scope.querySelector('.flt-empty');
    function run(){
      var words = norm(inp.value).split(' ').filter(function(w){ return w && !STOP[w]; }), shown = 0;
      items.forEach(function(el){
        var hay = el.getAttribute('data-s'), ok = words.every(function(w){ return hay.indexOf(w) > -1 || (w.length > 4 && hay.indexOf(w.slice(0, -1)) > -1); });
        el.hidden = !ok; if (ok) shown++;
      });
      groups.forEach(function(g){ g.hidden = !g.querySelector('[data-s]:not([hidden])'); });
      if (count) count.textContent = words.length ? (shown + (shown === 1 ? ' resultado' : ' resultados')) : '';
      if (empty) empty.hidden = shown > 0;
    }
    inp.addEventListener('input', run);
  });
})();
