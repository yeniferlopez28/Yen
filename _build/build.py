"""Genera el sitio de Dental Crown.

Uso:  python3 _build/build.py
Salida: archivos listos para subir al hosting (index.html, páginas, img/, sitemap.xml...).
Cambia DOMAIN cuando tengan el dominio definitivo y vuelve a correr el script.
"""
import json, math, os, re, html, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from content import CATS, REVIEWS, TREATMENTS, POSTS  # noqa: E402

DOMAIN = os.environ.get('DC_DOMAIN', 'https://TU-DOMINIO.com')
OUT = os.environ.get('DC_OUT', os.path.join(HERE, '..'))
ART = os.environ.get('DC_ART')  # carpeta opcional para la versión de vista previa en Claude
UPDATED = '2026-10-29'
UPDATED_TXT = '29 de octubre de 2026'
WA = 'https://wa.me/523311946819'
TX = {t['key']: t for t in TREATMENTS}

def esc(s):
    return html.escape(s, quote=True)

def wa(msg):
    from urllib.parse import quote
    return WA + '?text=' + quote(msg)

# ---------- Íconos (mismos que en el carrusel de la página principal) ----------
V, P, R, G = '#582138', '#FBF6F8', '#E9B9CC', '#CFCACB'
TOOTH = 'M38 22c-12 0-20 9-20 22 0 12 5 19 8 33 3 15 5 31 13 31 7 0 7-17 11-25 1.5-3 4-5 10-5s8.5 2 10 5c4 8 4 25 11 25 8 0 10-16 13-31 3-14 8-21 8-33 0-13-8-22-20-22-8 0-12 4-22 4s-14-4-22-4z'
CAP = 'M22 46c0-16 9-26 22-26 7 0 10 3 16 3s9-3 16-3c13 0 22 10 22 26 0 4-2 6-5 6H27c-3 0-5-2-5-6z'

def tooth(tr=''):
    return f'<path transform="{tr}" d="{TOOTH}" fill="{P}" stroke="{V}" stroke-width="4.5" stroke-linejoin="round"/>'

def spark(x, y, r, fill=R):
    q = f'Q{x} {y} '
    return (f'<path d="M{x} {y-r}{q}{x+r} {y}{q}{x} {y+r}{q}{x-r} {y}{q}{x} {y-r}Z" fill="{fill}" '
            f'stroke="{V}" stroke-width="3" stroke-linejoin="round"/>')

def dentures():
    s = (f'<path d="M16 78c0-30 19-50 44-50s44 20 44 50c0 9-7 13-14 10-9-4-19-6-30-6s-21 2-30 6c-7 3-14-1-14-10z" '
         f'fill="{R}" stroke="{V}" stroke-width="4.5" stroke-linejoin="round"/>')
    for k in range(7):
        a = math.pi * (1.08 + k * 0.14)
        x, y = 60 + math.cos(a) * 34, 74 + math.sin(a) * 36
        deg = a * 180 / math.pi + 90
        s += (f'<rect x="{x-7:.1f}" y="{y-9:.1f}" width="14" height="17" rx="6" fill="{P}" stroke="{V}" '
              f'stroke-width="3.5" transform="rotate({deg:.1f} {x:.1f} {y:.1f})"/>')
    return s

ICONS = {
    'valoracion': tooth('translate(4 2) scale(.84)') + f'<circle cx="84" cy="80" r="18" fill="#EFE1E7" stroke="{V}" stroke-width="4.5"/><path d="M78 74c2-3 5-4 8-4" stroke="{V}" stroke-width="3.5" stroke-linecap="round" fill="none"/><path d="M97 93l13 13" stroke="{V}" stroke-width="7" stroke-linecap="round"/>',
    'limpieza': tooth() + f'<path d="M36 40c2-6 7-9 12-9" stroke="{R}" stroke-width="5" stroke-linecap="round" fill="none"/>' + spark(98, 22, 11) + spark(14, 56, 7) + spark(104, 52, 6, P),
    'guardas': f'<path d="M24 30c0 46 16 72 36 72s36-26 36-72" fill="none" stroke="{V}" stroke-width="24" stroke-linecap="round"/><path d="M24 30c0 46 16 72 36 72s36-26 36-72" fill="none" stroke="{P}" stroke-width="14" stroke-linecap="round"/><path d="M33 52c2 14 6 24 12 31" stroke="{R}" stroke-width="4" stroke-linecap="round" fill="none"/>',
    'resina': tooth() + f'<path d="M60 30c-7 9-11 15-11 20a11 11 0 0 0 22 0c0-5-4-11-11-20z" fill="{R}" stroke="{V}" stroke-width="4" stroke-linejoin="round"/>' + spark(100, 24, 8),
    'endodoncia': tooth() + f'<ellipse cx="60" cy="46" rx="12" ry="8" fill="{R}" stroke="{V}" stroke-width="3.5"/><path d="M53 52c-1 16-4 32-10 48M67 52c1 16 4 32 10 48" stroke="{V}" stroke-width="3.5" stroke-linecap="round" fill="none"/>',
    'corona': tooth('translate(0 10)') + f'<path transform="translate(0 -14)" d="{CAP}" fill="{R}" stroke="{V}" stroke-width="4.5" stroke-linejoin="round"/>' + spark(104, 14, 7, P),
    'blanqueamiento': tooth() + f'<path d="M36 40c2-6 7-9 12-9" stroke="{R}" stroke-width="5" stroke-linecap="round" fill="none"/>' + spark(100, 20, 14, P) + spark(16, 30, 8, P) + spark(108, 70, 6),
    'ortodoncia': tooth('translate(4 28) scale(.55)') + tooth('translate(52 28) scale(.55)') + f'<path d="M8 58H112" stroke="{V}" stroke-width="3.5" stroke-linecap="round"/><rect x="19" y="51" width="16" height="14" rx="3.5" fill="{V}"/><rect x="67" y="51" width="16" height="14" rx="3.5" fill="{V}"/><circle cx="27" cy="58" r="2.5" fill="{R}"/><circle cx="75" cy="58" r="2.5" fill="{R}"/>',
    'ortopedia': tooth('translate(10 10) scale(.84)') + f'<circle cx="50" cy="56" r="4" fill="{V}"/><circle cx="70" cy="56" r="4" fill="{V}"/><path d="M50 68c6 7 14 7 20 0" stroke="{V}" stroke-width="4" stroke-linecap="round" fill="none"/>' + spark(104, 26, 9) + spark(16, 22, 6, P),
    'extraccion': f'<path d="M10 102h100" stroke="{R}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 11"/>' + tooth('translate(14 -6) scale(.78)') + f'<path d="M104 70V40M96 48l8-8 8 8M16 70V40M8 48l8-8 8 8" stroke="{V}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    'protesis': dentures(),
    'implante': f'<path transform="translate(0 -6)" d="{CAP}" fill="{P}" stroke="{V}" stroke-width="4.5" stroke-linejoin="round"/><rect x="50" y="48" width="20" height="10" rx="2" fill="{G}" stroke="{V}" stroke-width="3.5"/><path d="M47 60h26l-3 42c0 4-4 7-10 7s-10-3-10-7z" fill="{G}" stroke="{V}" stroke-width="4" stroke-linejoin="round"/><path d="M47 72l26-4M48 83l24-4M49 94l22-4" stroke="{V}" stroke-width="3" stroke-linecap="round"/>',
}

def icon(key, label=''):
    aria = f' role="img" aria-label="{esc(label)}"' if label else ' aria-hidden="true"'
    return f'<svg viewBox="0 0 120 120"{aria}>{ICONS[key]}</svg>'

# ---------- Piezas compartidas ----------
SVG_WA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/></svg>'
SVG_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
SVG_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>'
SVG_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>'
STARS = '<span class="stars" aria-label="5 estrellas"><i class="star"></i><i class="star"></i><i class="star"></i><i class="star"></i><i class="star"></i></span>'

PROTO = '<div class="proto">Prototipo para revisión del equipo · Lo marcado <span>así</span> está pendiente de confirmar</div>'

NAV = [('Precios', 'precios.html', 'precios'), ('La Dra.', 'dra-ana-paula-lopez.html', 'dra'),
       ('Consultorio', '#consultorio', ''), ('Reseñas', '#resenas', ''), ('Blog', 'blog.html', 'blog'), ('Ubicación', '#ubicacion', '')]

def header(home=False, active=''):
    links = []
    for label, href, key in NAV:
        h = href if (home or not href.startswith('#')) else './' + href
        cls = ' class="on" aria-current="page"' if key and key == active else ''
        links.append(f'<a href="{h}"{cls}>{label}</a>')
    groups = ''
    for ci, c in enumerate(CATS):
        items = ''.join(f'<a href="{t["slug"]}.html"><span class="ic">{icon(t["key"])}</span><span>{t["short"]}<small>{esc(t["price"][0][1])}</small></span></a>' for t in TREATMENTS if t['cat'] == ci)
        groups += f'<div class="mg"><h4>{c}</h4>{items}</div>'
    on = ' on' if active == 'tx' else ''
    mega = f'''<div class="mega-wrap">
        <button class="mega-btn{on}" type="button" aria-expanded="false" aria-controls="mega">Tratamientos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="mega" id="mega" hidden>
          <div class="wrap mega-in">{groups}
            <div class="mg-foot"><a href="tratamientos.html">Ver todos los tratamientos</a><a href="precios.html">Ver lista de precios</a></div>
          </div>
        </div>
      </div>'''
    links.insert(0, mega)
    brand_href = '#inicio' if home else './'
    agenda = '#agenda' if home else './#agenda'
    return f'''<header class="top">
  <div class="wrap">
    <a class="brand" href="{brand_href}" aria-label="Dental Crown, inicio">
      <span class="logo"><img src="img/iso-relleno-blanco.png" alt=""></span>
      <span>Dental Crown<small>Confianza en cada sonrisa</small></span>
    </a>
    <nav class="links" aria-label="Secciones">
      {chr(10).join("      " + l for l in links).strip()}
    </nav>
    <span class="hd-r"><a class="soc hd" href="https://www.instagram.com/dental.crown/" target="_blank" rel="noopener" aria-label="Instagram @dental.crown">{SVG_IG}</a><a class="soc hd" href="{WA}" target="_blank" rel="noopener" aria-label="WhatsApp 33 1194 6819">{SVG_WA.replace('2.4', '2.2')}</a>
    <a class="btn btn-vino" href="{agenda}"><span class="ar">{SVG_CAL}</span>Agendar</a></span>
  </div>
</header>'''

def footer(home=False):
    pre = '' if home else './'
    tx_links = ''.join(f'<li><a href="{t["slug"]}.html">{t["short"]}</a></li>' for t in TREATMENTS)
    return f'''<footer class="foot" data-cursor="light">
  <div class="wrap">
    <div class="foot-grid">
      <div><img class="lg" src="img/vertical-blanco.png" alt="Dental Crown"><p class="t">Confianza en cada sonrisa.</p></div>
      <div><h4>Tratamientos</h4><ul>{tx_links}<li><a href="tratamientos.html">Todos los tratamientos</a></li><li><a href="precios.html">Precios</a></li></ul></div>
      <div><h4>Consultorio</h4><ul><li><a href="dra-ana-paula-lopez.html">La Dra. Ana Paula</a></li><li><a href="{pre}#consultorio">El consultorio</a></li><li><a href="{pre}#resenas">Reseñas</a></li><li><a href="{pre}#preguntas">Preguntas frecuentes</a></li><li><a href="blog.html">Blog</a></li></ul></div>
      <div><h4>Contacto</h4><ul><li><a href="{WA}" target="_blank" rel="noopener">WhatsApp 33 1194 6819 ↗</a></li><li><a href="https://www.instagram.com/dental.crown/" target="_blank" rel="noopener">Instagram @dental.crown ↗</a></li><li><a href="https://www.facebook.com/dentistapaulalopez/" target="_blank" rel="noopener">Facebook ↗</a></li><li>Todos los días, 1:00 a 8:00 pm</li><li><span class="pend" style="color:#F3C6D8">Correo del consultorio</span></li></ul></div>
      <div><h4>Dónde estoy</h4><ul><li>Julián Medina Castillo 1808 C</li><li>Circunvalación Oblatos</li><li>44716 Guadalajara, Jalisco</li><li><a href="https://www.google.com/maps/search/?api=1&amp;query=Juli%C3%A1n+Medina+Castillo+1808+C,+Circunvalaci%C3%B3n+Oblatos,+44716+Guadalajara,+Jalisco" target="_blank" rel="noopener">Cómo llegar ↗</a></li></ul></div>
    </div>
    <div class="legal">
      <span>C.D. Ana Paula López Guzmán · Cirujana dentista · <span class="pend">Céd. prof. [número]</span> · <span class="pend">Aviso de publicidad COFEPRIS [número]</span></span>
      <span><span class="pend">Aviso de privacidad</span></span>
    </div>
  </div>
</footer>'''

FAB = f'''<a class="wa-fab" href="{wa('Hola, Dra. Ana Paula. Quiero información para agendar una cita.')}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp al 33 1194 6819">
  <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 20.5l1.4-4.2A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1.2-1.6-2-1-1 .8c-1.2-.5-2.2-1.5-2.7-2.7l.8-1-1-2z" fill="currentColor" stroke-width="1.2"/></svg></span>
  <span class="t">Escríbeme por WhatsApp<small>33 1194 6819</small></span>
</a>
<div class="cursor" id="cursor" aria-hidden="true"><span class="tw"><img class="v" src="img/iso-relleno-vino.png" alt=""><img class="r" src="img/iso-relleno-rosa.png" alt=""></span></div>
<div class="toast" id="toast" role="status"></div>'''

DENTIST = {
    "@type": "Dentist", "@id": DOMAIN + "/#consultorio", "name": "Dental Crown Dra. Ana Paula López", "url": DOMAIN + "/",
    "telephone": "+52 33 1194 6819", "image": DOMAIN + "/img/og.jpg",
    "address": {"@type": "PostalAddress", "streetAddress": "Julián Medina Castillo 1808 C", "addressLocality": "Guadalajara",
                "addressRegion": "Jalisco", "postalCode": "44716", "addressCountry": "MX"},
}

def jsonld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False) + '</script>'

def breadcrumb(items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": DOMAIN + '/' + u} for i, (n, u) in enumerate(items)]}

def faq_ld(faq):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}

def head(title, desc, path, extra_ld=(), og_type='website'):
    url = DOMAIN + '/' + path
    lds = '\n'.join(jsonld(o) for o in extra_ld)
    return f'''<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="{og_type}">
<meta property="og:locale" content="es_MX">
<meta property="og:site_name" content="Dental Crown">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{DOMAIN}/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#582138">
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Poppins:wght@300;400;500;600&display=swap">
<link rel="stylesheet" href="styles.css">
{lds}
</head>
<body>'''

def page(title, desc, path, main, active='', extra_ld=(), og_type='website'):
    return (head(title, desc, path, extra_ld, og_type) + '\n' + PROTO + '\n' + header(active=active) +
            '\n<main id="inicio">\n' + main + '\n</main>\n' + footer() + '\n' + FAB +
            '\n<script src="site.js"></script>\n<script src="menu.js"></script>\n</body>\n</html>\n')

def h1_mixed(text):
    # La última palabra en cursiva serif, como en el resto de la marca.
    if ' en ' in text:
        a, b = text.rsplit(' en ', 1)
        return f'{esc(a)} en <em>{esc(b)}</em>'
    return esc(text)

def review_block(key, title='Lo que cuentan mis pacientes'):
    n, y, q = REVIEWS[key]
    return f'''<section class="sec pg-rev">
  <div class="wrap">
    <figure class="pg-quote">
      {STARS}
      <blockquote>“{esc(q)}”</blockquote>
      <figcaption><i>{n[0]}</i><span><b>{esc(n)}</b><small>Reseña de Google · {y}</small></span></figcaption>
    </figure>
    <div class="pg-rev-side">
      <span class="chip">Reseñas</span>
      <h2>{title}</h2>
      <p>82 reseñas con 5 estrellas en Google.</p>
      <div class="ctas"><a class="btn btn-line" href="./#resenas">Ver más reseñas</a></div>
    </div>
  </div>
</section>'''

def faq_block(faq, title):
    items = ''.join(f'<details{" open" if i == 0 else ""}><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for i, (q, a) in enumerate(faq))
    return f'''<section class="sec faq">
  <div class="wrap faq-grid">
    <div class="faq-side">
      <span class="chip">Preguntas frecuentes</span>
      <h2>{title}</h2>
      <p>Si tu duda no está aquí, escríbeme por WhatsApp y te respondo.</p>
      <a class="btn btn-vino" href="{wa('Hola, Dra. Ana Paula. Tengo una pregunta.')}" target="_blank" rel="noopener"><span class="ar">{SVG_WA}</span>Hacer una pregunta</a>
    </div>
    <div class="faq-list">{items}</div>
  </div>
</section>'''

def author_box(kind='página'):
    return f'''<aside class="author">
  <img src="img/dra-1.jpg" alt="C.D. Ana Paula López Guzmán" loading="lazy" width="96" height="96">
  <div>
    <small>Escrito por</small>
    <b>C.D. Ana Paula López Guzmán</b>
    <span>Cirujana dentista · <span class="pend">Céd. prof. [número]</span></span>
    <span>Actualizado el {UPDATED_TXT} · <span class="pend">Pendiente de revisión por la Dra.</span></span>
  </div>
</aside>'''

def related_cards(keys, title='Tratamientos relacionados'):
    cards = ''.join(f'''<a class="rel" href="{TX[k]['slug']}.html"><span class="ic">{icon(TX[k]['key'])}</span><span><b>{TX[k]['short']}</b><small>{esc(TX[k]['price'][0][1])}</small></span><span class="go">{SVG_ARROW}</span></a>''' for k in keys)
    return f'''<section class="sec pg-related">
  <div class="wrap">
    <h2>{title}</h2>
    <div class="rel-grid">{cards}</div>
  </div>
</section>'''

def cta_band(msg='Hola, Dra. Ana Paula. Quiero agendar una valoración.', h='Agenda tu <em>valoración</em>', p='Consulta con radiografía $500. Sin costo si inicias tu tratamiento.'):
    return f'''<section class="pg-cta" data-cursor="light">
  <div class="wrap">
    <div><h2>{h}</h2><p>{p}</p></div>
    <div class="ctas"><a class="btn btn-rosa" href="{wa(msg)}" target="_blank" rel="noopener"><span class="ar">{SVG_WA}</span>Agendar por WhatsApp</a><a class="btn btn-line" href="./#agenda">Agenda en línea</a></div>
  </div>
</section>'''

def crumbs(items):
    parts = []
    for i, (n, u) in enumerate(items):
        if i == len(items) - 1:
            parts.append(f'<span aria-current="page">{esc(n)}</span>')
        else:
            parts.append(f'<a href="{u}">{esc(n)}</a>')
    return '<nav class="crumbs" aria-label="Ruta">' + '<span aria-hidden="true">›</span>'.join(parts) + '</nav>'

def price_num(v):
    m = re.search(r'\$([\d,]+)', v)
    return m.group(1).replace(',', '') if m else None

# ---------- Página de tratamiento ----------
def tx_strip(current=None):
    chips = ''.join(f'<a href="{x["slug"]}.html"{" class=\"on\" aria-current=\"page\"" if current == x["key"] else ""}><span class="ic">{icon(x["key"])}</span>{x["short"]}</a>' for x in TREATMENTS)
    return f'<nav class="tx-strip" aria-label="Todos los tratamientos"><div class="wrap"><span class="lbl">Tratamientos</span><div class="strip">{chips}</div></div></nav>'

def treatment_page(t):
    path = t['slug'] + '.html'
    msg = f'Hola, Dra. Ana Paula. Me gustaría agendar una cita para {t["short"].lower()}. ¿Qué días tiene disponibles?'
    prices = ''.join(f'<div><small>{esc(l)}</small><b>{esc(v)}</b></div>' for l, v in t['price'])
    what = ''.join(f'<p>{esc(p)}</p>' for p in t['what'])
    when = ''.join(f'<li>{esc(w)}</li>' for w in t['when'])
    steps = ''.join(f'<li><span class="n">{i+1}</span><h3>{esc(a)}</h3><p>{esc(b)}</p></li>' for i, (a, b) in enumerate(t['steps']))
    note = f'<p class="note">{esc(t["price_note"])}</p>' if t['price_note'] else ''
    aside_prices = ''.join(f'<li><span>{esc(l)}</span><b>{esc(v)}</b></li>' for l, v in t['price'])
    main = f'''<section class="pg-hero" data-cursor="light">
  <div class="wrap pg-hero-grid">
    <div class="pg-hero-copy">
      {crumbs([('Inicio', './'), ('Tratamientos', 'tratamientos.html'), (t['short'], '')])}
      <span class="chip"><span class="star"></span> {CATS[t['cat']]}</span>
      <h1>{h1_mixed(t['h1'])}</h1>
      <p class="lead">{esc(t['lead'])}</p>
      <div class="pg-price">{prices}</div>
      <div class="ctas"><a class="btn btn-rosa" href="{wa(msg)}" target="_blank" rel="noopener"><span class="ar">{SVG_WA}</span>Agendar por WhatsApp</a><a class="btn btn-line" href="precios.html">Ver todos los precios</a></div>
    </div>
    <div class="pg-icon">{icon(t['key'], t['short'])}</div>
  </div>
</section>
{tx_strip(t['key'])}

<section class="sec">
  <div class="wrap pg-body">
    <article class="prose">
      <h2>En qué consiste</h2>
      {what}
      <h2>Cuándo se recomienda</h2>
      <ul class="ticks">{when}</ul>
      {author_box()}
    </article>
    <aside class="pg-aside">
      <div class="pg-card">
        <span class="ic">{icon(t['key'])}</span>
        <h3>{esc(t['short'])}</h3>
        <ul>{aside_prices}</ul>
        {note}
        <a class="btn btn-vino" href="{wa(msg)}" target="_blank" rel="noopener"><span class="ar">{SVG_WA}</span>Agendar</a>
        <p class="small">Efectivo, transferencia, débito y crédito.<br>Todos los días, 1:00 a 8:00 pm.</p>
      </div>
    </aside>
  </div>
</section>

<section class="sec pg-steps-sec">
  <div class="wrap">
    <span class="chip">Paso a paso</span>
    <h2>Cómo es el <em>tratamiento</em></h2>
    <ol class="pg-steps">{steps}</ol>
  </div>
</section>

{review_block(t['review'])}

{faq_block(t['faq'], f'Preguntas sobre <em>{esc(t["short"].lower())}</em>')}

{related_cards(t['related'])}

{cta_band(msg, f'Agenda tu cita de <em>{esc(t["short"].lower())}</em>', 'Escríbeme por WhatsApp y te confirmo día y hora.')}'''
    service = {"@context": "https://schema.org", "@type": "Service", "name": t['short'], "serviceType": t['short'],
               "description": t['desc'], "url": DOMAIN + '/' + path, "areaServed": "Guadalajara, Jalisco", "provider": DENTIST}
    offers = [{"@type": "Offer", "name": l, "price": price_num(v), "priceCurrency": "MXN"} for l, v in t['price'] if price_num(v)]
    if offers:
        service["offers"] = offers
    lds = [service, faq_ld(t['faq']), breadcrumb([('Inicio', ''), ('Tratamientos', 'tratamientos.html'), (t['short'], path)])]
    return path, page(t['title'], t['desc'], path, main, 'tx', lds)

# ---------- Todos los tratamientos ----------
def all_page():
    path = 'tratamientos.html'
    groups = ''
    for ci, c in enumerate(CATS):
        cards = ''.join(f'''<a class="tx-card" href="{t['slug']}.html"><span class="ic">{icon(t['key'])}</span><span class="tx-card-body"><b>{t['short']}</b><small>{' · '.join(esc(v) for _, v in t['price'])}</small><span class="d">{esc(t['lead'])}</span></span><span class="go">Ver tratamiento {SVG_ARROW}</span></a>''' for t in TREATMENTS if t['cat'] == ci)
        groups += f'<div class="tx-group"><h2>{c}</h2><div class="tx-cards">{cards}</div></div>'
    main = f'''<section class="pg-hero slim" data-cursor="light">
  <div class="wrap">
    {crumbs([('Inicio', './'), ('Tratamientos', '')])}
    <span class="chip"><span class="star"></span> 12 tratamientos</span>
    <h1>Tratamientos dentales en <em>Guadalajara</em></h1>
    <p class="lead">Elige un tratamiento para ver en qué consiste, cómo es el proceso, su precio y las preguntas más frecuentes.</p>
  </div>
</section>
<section class="sec"><div class="wrap tx-groups">{groups}</div></section>
{cta_band()}'''
    lst = {"@context": "https://schema.org", "@type": "ItemList", "name": "Tratamientos dentales en Dental Crown",
           "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": t['short'], "url": f"{DOMAIN}/{t['slug']}.html"} for i, t in enumerate(TREATMENTS)]}
    return path, page('Tratamientos dentales en Guadalajara | Dental Crown',
                      'Todos los tratamientos de Dental Crown en Guadalajara: consulta, limpieza, resinas, endodoncia, coronas, blanqueamiento, ortodoncia, implantes y más, con precios.',
                      path, main, 'tx', [lst, breadcrumb([('Inicio', ''), ('Tratamientos', path)])])

# ---------- Precios ----------
def prices_page():
    path = 'precios.html'
    groups = ''
    for ci, c in enumerate(CATS):
        rows = ''
        for t in TREATMENTS:
            if t['cat'] != ci:
                continue
            for l, v in t['price']:
                if len(t['price']) == 1:
                    name = t['short']
                elif l.lower()[:5] == t['short'].lower()[:5]:
                    name = l
                else:
                    name = f'{t["short"]} · {l.lower()}'
                rows += f'<tr><th scope="row"><a href="{t["slug"]}.html"><span class="ic">{icon(t["key"])}</span>{esc(name)}</a></th><td>{esc(v)}</td></tr>'
        groups += f'<div class="pt-group"><h2>{c}</h2><table class="pt"><tbody>{rows}</tbody></table></div>'
    main = f'''<section class="pg-hero slim" data-cursor="light">
  <div class="wrap">
    {crumbs([('Inicio', './'), ('Precios', '')])}
    <span class="chip"><span class="star"></span> Precios vigentes · octubre 2026</span>
    <h1>Precios de tratamientos dentales en <em>Guadalajara</em></h1>
    <p class="lead">Todos los precios del consultorio en un solo lugar. El precio final se confirma en tu valoración, porque cada caso es distinto.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="pt-intro">
      <div class="pg-card feat"><small>Primera consulta</small><b>$500</b><p>Consulta con radiografía. Sin costo si inicias tu tratamiento.</p><a class="btn btn-rosa" href="consulta-dental-guadalajara.html"><span class="ar">{SVG_ARROW}</span>Qué incluye</a></div>
      <div class="pg-card"><small>Formas de pago</small><b>Efectivo, transferencia, débito y crédito</b><p>La ortodoncia se paga con un inicial y mensualidades.</p></div>
    </div>
    <div class="pt-groups">{groups}</div>
  </div>
</section>
{cta_band()}'''
    lds = [breadcrumb([('Inicio', ''), ('Precios', path)])]
    return path, page('Precios de tratamientos dentales en Guadalajara | Dental Crown',
                      'Lista de precios de Dental Crown en Guadalajara: consulta $500, limpieza $1,000, resina $1,000, endodoncia $3,500, corona $7,000, implante desde $24,000 y más.',
                      path, main, 'precios', lds)

# ---------- La Dra. ----------
def dra_page():
    path = 'dra-ana-paula-lopez.html'
    main = f'''<section class="pg-hero" data-cursor="light">
  <div class="wrap pg-hero-grid">
    <div class="pg-hero-copy">
      {crumbs([('Inicio', './'), ('La Dra. Ana Paula', '')])}
      <span class="chip"><span class="star"></span> Cirujana dentista</span>
      <h1>C.D. Ana Paula <em>López Guzmán</em></h1>
      <p class="lead">Soy la dentista de Dental Crown, en Guadalajara. Atiendo cada cita yo misma, desde la revisión hasta el seguimiento.</p>
      <img class="firma" src="img/firma-dra-blanco.png" alt="Firma C.D. Ana Paula López Guzmán" width="300" height="59">
    </div>
    <div class="pg-photo"><img src="img/dra-1.jpg" alt="La Dra. Ana Paula López Guzmán en su consultorio" width="900" height="1200"></div>
  </div>
</section>
<section class="sec">
  <div class="wrap pg-body">
    <article class="prose">
      <h2>Cómo trabajo</h2>
      <p>Muchos de mis pacientes llegan porque alguien de confianza los mandó conmigo, y eso lo cuido en cada consulta. Antes de empezar cualquier tratamiento te explico lo que encontré, tus opciones y el costo de cada una.</p>
      <ul class="ticks"><li>Radiografía en la primera consulta.</li><li>Presupuesto el mismo día.</li><li>Seguimiento después del tratamiento.</li><li>Atiendo a adultos, niñas y niños.</li></ul>
      <h2>Formación</h2>
      <ul class="cred-list">
        <li><small>Profesión</small><b>Cirujana dentista</b></li>
        <li><small>Cédula profesional</small><b class="pend">[número]</b></li>
        <li><small>Universidad</small><b class="pend">[institución y año]</b></li>
        <li><small>Cursos y especialidades</small><b class="pend">[cursos, diplomados, congresos]</b></li>
        <li><small>Años de experiencia</small><b class="pend">[años]</b></li>
      </ul>
    </article>
    <aside class="pg-aside">
      <figure class="pg-card photo"><img src="img/dra-2.jpg" alt="La Dra. Ana Paula en el consultorio" loading="lazy" width="900" height="1200"><figcaption>Consultorio Dental Crown, Guadalajara</figcaption></figure>
    </aside>
  </div>
</section>
{review_block('roberto', 'Lo que dicen de mi <em>trabajo</em>')}
{related_cards(['valoracion', 'limpieza', 'corona'], 'Por dónde empezar')}
{cta_band()}'''
    person = {"@context": "https://schema.org", "@type": "Person", "name": "Ana Paula López Guzmán", "honorificPrefix": "C.D.",
              "jobTitle": "Cirujana dentista", "image": DOMAIN + "/img/dra-1.jpg", "url": DOMAIN + '/' + path, "worksFor": DENTIST}
    return path, page('Dra. Ana Paula López Guzmán, cirujana dentista en Guadalajara | Dental Crown',
                      'Conoce a la C.D. Ana Paula López Guzmán, cirujana dentista de Dental Crown en Guadalajara. Cómo trabaja, formación y reseñas de sus pacientes.',
                      path, main, 'dra', [person, breadcrumb([('Inicio', ''), ('La Dra. Ana Paula', path)])], 'profile')

# ---------- Blog ----------
def blog_index():
    path = 'blog.html'
    cards = ''.join(f'''<a class="post-card" href="blog-{p['slug']}.html"><span class="meta">{p['minutes']} min de lectura</span><h2>{esc(p['title'])}</h2><p>{esc(p['desc'])}</p><span class="go">Leer {SVG_ARROW}</span></a>''' for p in POSTS)
    main = f'''<section class="pg-hero slim" data-cursor="light">
  <div class="wrap">
    {crumbs([('Inicio', './'), ('Blog', '')])}
    <span class="chip"><span class="star"></span> Blog</span>
    <h1>Dudas de salud dental, <em>resueltas</em></h1>
    <p class="lead">Lo que más me preguntan en consulta, explicado con palabras de todos los días.</p>
  </div>
</section>
<section class="sec"><div class="wrap"><div class="post-grid">{cards}</div></div></section>
{cta_band()}'''
    blog = {"@context": "https://schema.org", "@type": "Blog", "name": "Blog de Dental Crown", "url": DOMAIN + '/' + path,
            "blogPost": [{"@type": "BlogPosting", "headline": p['title'], "url": f"{DOMAIN}/blog-{p['slug']}.html"} for p in POSTS]}
    return path, page('Blog de salud dental | Dental Crown Guadalajara',
                      'Artículos de la Dra. Ana Paula López sobre salud dental: periodontitis, limpieza dental, placa y sarro, y más dudas frecuentes.',
                      path, main, 'blog', [blog, breadcrumb([('Inicio', ''), ('Blog', path)])])

def render_body(blocks):
    out = ''
    for kind, val in blocks:
        if kind == 'p':
            out += f'<p>{esc(val)}</p>'
        elif kind == 'h2':
            out += f'<h2>{esc(val)}</h2>'
        elif kind == 'ul':
            out += '<ul class="ticks">' + ''.join(f'<li>{esc(x)}</li>' for x in val) + '</ul>'
    return out

def post_page(p):
    path = f'blog-{p["slug"]}.html'
    main = f'''<section class="pg-hero slim" data-cursor="light">
  <div class="wrap">
    {crumbs([('Inicio', './'), ('Blog', 'blog.html'), (p['title'], '')])}
    <span class="chip"><span class="star"></span> {p['minutes']} min de lectura</span>
    <h1>{esc(p['title'])}</h1>
    <p class="lead">{esc(p['desc'])}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap pg-body">
    <article class="prose">{render_body(p['body'])}{author_box('artículo')}</article>
    <aside class="pg-aside">
      <div class="pg-card">
        <h3>¿Quieres que te revise?</h3>
        <p>Consulta con radiografía $500. Sin costo si inicias tu tratamiento.</p>
        <a class="btn btn-vino" href="{wa('Hola, Dra. Ana Paula. Leí su artículo y quiero agendar una valoración.')}" target="_blank" rel="noopener"><span class="ar">{SVG_WA}</span>Agendar</a>
      </div>
    </aside>
  </div>
</section>
{related_cards(p['related'], 'Tratamientos relacionados')}
{cta_band()}'''
    art = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": p['title'], "description": p['desc'],
           "datePublished": p['date'], "dateModified": p['date'], "inLanguage": "es-MX", "url": DOMAIN + '/' + path,
           "image": DOMAIN + "/img/og.jpg",
           "author": {"@type": "Person", "name": "Ana Paula López Guzmán", "jobTitle": "Cirujana dentista", "url": DOMAIN + "/dra-ana-paula-lopez.html"},
           "publisher": {"@type": "Organization", "name": "Dental Crown", "logo": {"@type": "ImageObject", "url": DOMAIN + "/img/apple-touch-icon.png"}}}
    return path, page(p['seo'], p['desc'], path, main, 'blog',
                      [art, breadcrumb([('Inicio', ''), ('Blog', 'blog.html'), (p['title'], path)])], 'article')

# ---------- 404 ----------
def not_found():
    body = f'''<section class="e404 page" data-cursor="light">
  <div class="in">
    <div class="num" aria-hidden="true">4<img src="img/iso-relleno-blanco.png" alt="">4</div>
    <h1>Este diente se <em>salió</em> de su lugar</h1>
    <p>La página que buscas no existe o cambió de dirección. Regresa al inicio o escríbeme y te ayudo a encontrar lo que necesitas.</p>
    <div class="ctas">
      <a class="btn btn-rosa" href="/"><span class="ar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span>Volver al inicio</a>
      <a class="btn btn-line" href="{WA}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
    </div>
  </div>
</section>'''
    h = head('Página no encontrada | Dental Crown', 'La página que buscas no existe.', '404.html')
    h = h.replace('<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" href="/styles.css">').replace('href="img/', 'href="/img/')
    h = h.replace('<title>', '<meta name="robots" content="noindex">\n<title>')
    return '404.html', h + '\n' + body.replace('src="img/', 'src="/img/') + '\n</body>\n</html>\n'

# ---------- Página principal ----------
TX_SLUGS = {t['key']: t['slug'] for t in TREATMENTS}
ICON_TO_KEY = {'valoracion': 'valoracion', 'limpieza': 'limpieza', 'guardas': 'guardas', 'resina': 'resina', 'endodoncia': 'endodoncia',
               'corona': 'corona', 'blanqueamiento': 'blanqueamiento', 'ortodoncia': 'ortodoncia', 'ortopedia': 'ortopedia',
               'extraccion': 'extraccion', 'protesis': 'protesis', 'implante': 'implante'}

def home():
    body = open(os.path.join(HERE, 'home_body.html')).read()
    hd = open(os.path.join(HERE, 'home_head.html')).read()
    # Encabezado y pie compartidos
    a = body.index('<header class="top">'); b = body.index('</header>') + len('</header>')
    body = body[:a] + header(home=True) + body[b:]
    a = body.index('<footer class="foot"'); b = body.index('</footer>') + len('</footer>')
    body = body[:a] + footer(home=True) + body[b:]
    # Enlace "Ver todo sobre..." en el carrusel
    for k, slug in TX_SLUGS.items():
        body = body.replace(f"icon:'{k}',", f"icon:'{k}', slug:'{slug}',", 1)
    body = body.replace("    document.getElementById('car-plus').href = waBook;",
                        "    document.getElementById('car-plus').href = waBook;\n    waEl.href = t.slug + '.html'; nameEl.href = t.slug + '.html';", 1)
    # Enlace a la página de la Dra.
    body = body.replace('<span class="pend">Cédula profesional [número]</span></div>',
                        '<span class="pend">Cédula profesional [número]</span></div>\n      <a class="link-more" href="dra-ana-paula-lopez.html">Conoce más de la Dra.</a>', 1)
    # Sección del blog antes de las preguntas
    cards = ''.join(f'<a class="post-card" href="blog-{p["slug"]}.html"><span class="meta">{p["minutes"]} min de lectura</span><h3>{esc(p["title"])}</h3><p>{esc(p["desc"])}</p><span class="go">Leer {SVG_ARROW}</span></a>' for p in POSTS)
    blog_sec = f'''<section class="sec" id="blog">
  <div class="wrap">
    <div class="sec-head">
      <div><span class="chip">Blog</span><h2>Dudas de salud dental, <em>resueltas</em></h2></div>
      <p>Lo que más me preguntan en consulta, explicado con palabras de todos los días. <a class="link-more" href="blog.html">Ver todos los artículos</a></p>
    </div>
    <div class="post-grid">{cards}</div>
  </div>
</section>

'''
    body = body.replace('<section class="sec faq" id="preguntas">', blog_sec + '<section class="sec faq" id="preguntas">', 1)
    body = body.replace('<span><span class="pend">Aviso de privacidad</span> · <a href="#error-404" style="color:inherit">Ver página 404</a></span>', '<span><span class="pend">Aviso de privacidad</span></span>')
    body = body.rstrip() + '\n<script src="menu.js"></script>\n'
    lds = re.findall(r'<script type="application/ld\+json">.*?</script>', hd, re.S)
    desc = re.search(r'<meta name="description" content="([^"]*)">', hd).group(1)
    return body, lds, desc

def build():
    os.makedirs(os.path.join(OUT, 'img'), exist_ok=True)
    pages = []
    body, lds, desc = home()
    # Ajuste de URL del JSON-LD principal al dominio
    lds = [l.replace('"name": "Dental Crown Dra. Ana Paula López"', '"name": "Dental Crown Dra. Ana Paula López", "@id": "' + DOMAIN + '/#consultorio", "url": "' + DOMAIN + '/", "image": "' + DOMAIN + '/img/og.jpg"', 1) for l in lds]
    hdr = head('Dentista en Guadalajara · Dental Crown · Dra. Ana Paula López', desc, '')
    hdr = hdr.replace('<link rel="stylesheet" href="styles.css">\n', '<link rel="stylesheet" href="styles.css">\n' + '\n'.join(lds))
    full = hdr + '\n' + body.replace('</script>\n', '</script>\n', 1)
    if not full.rstrip().endswith('</html>'):
        full = full.rstrip() + '\n</body>\n</html>\n'
    pages.append(('index.html', full))
    for t in TREATMENTS:
        pages.append(treatment_page(t))
    pages += [all_page(), prices_page(), dra_page(), blog_index()] + [post_page(p) for p in POSTS] + [not_found()]
    for path, content in pages:
        open(os.path.join(OUT, path), 'w').write(content)
    # robots y sitemap
    urls = [('', '1.0')] + [(t['slug'] + '.html', '0.9') for t in TREATMENTS] + [('tratamientos.html', '0.9'), ('precios.html', '0.9'), ('dra-ana-paula-lopez.html', '0.7'), ('blog.html', '0.6')] + [(f'blog-{p["slug"]}.html', '0.6') for p in POSTS]
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        f'  <url><loc>{DOMAIN}/{u}</loc><lastmod>{UPDATED}</lastmod><priority>{pr}</priority></url>\n' for u, pr in urls) + '</urlset>\n'
    open(os.path.join(OUT, 'sitemap.xml'), 'w').write(sm)
    open(os.path.join(OUT, 'robots.txt'), 'w').write(f'User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n')
    # Estilos y script compartidos
    css = open(os.path.join(HERE, 'base.css')).read() + open(os.path.join(HERE, 'pages.css')).read()
    open(os.path.join(OUT, 'styles.css'), 'w').write(css)
    shutil.copy(os.path.join(HERE, 'site.js'), os.path.join(OUT, 'site.js'))
    shutil.copy(os.path.join(HERE, 'menu.js'), os.path.join(OUT, 'menu.js'))
    for f in os.listdir(os.path.join(HERE, 'img')):
        shutil.copy(os.path.join(HERE, 'img', f), os.path.join(OUT, 'img', f))
    # Vista previa para Claude: la página principal sin <head> (Claude agrega el suyo)
    if ART:
        os.makedirs(ART, exist_ok=True)
        art_head = ('<title>Dental Crown Web</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
                    f'<meta name="description" content="{esc(desc)}">\n' + '\n'.join(lds) +
                    '\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
                    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Poppins:wght@300;400;500;600&display=swap">\n'
                    '<link rel="stylesheet" href="styles.css">\n')
        open(os.path.join(ART, 'index.html'), 'w').write(art_head + body)
    print('Páginas:', len(pages))

if __name__ == '__main__':
    build()
