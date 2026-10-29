"""Páginas de cuidados después del tratamiento."""
from care import CARE, ALARM, URGENT, ALARM_SRC


def build_care(B):
    esc, icon, crumbs, wa, page, faq_block, author_box, jsonld = B.esc, B.icon, B.crumbs, B.wa, B.page, B.faq_block, B.author_box, B.jsonld
    TX, DOMAIN, SVG_WA, SVG_ARROW = B.TX, B.DOMAIN, B.SVG_WA, B.SVG_ARROW
    X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>'

    def ul(items, cls='ticks', ordered=False):
        tag = 'ol' if ordered else 'ul'
        return f'<{tag} class="{cls}">' + ''.join(f'<li>{esc(i)}</li>' for i in items) + f'</{tag}>'

    def card(title, items, kind='', ordered=False, anchor=''):
        aid = f' id="{anchor}"' if anchor else ''
        if kind == 'avoid':
            body = '<ul class="xs">' + ''.join(f'<li><span class="x">{X}</span>{esc(i)}</li>' for i in items) + '</ul>'
        else:
            body = ul(items, 'steps-ol' if ordered else 'ticks', ordered)
        return f'<article class="cc-card {kind}"{aid}><h2>{esc(title)}</h2>{body}</article>'

    def food_table(f):
        head = ''.join(f'<th scope="col">{esc(c)}</th>' for c in f['cols'])
        rows = ''
        for r in f['rows']:
            cells = ''.join((f'<th scope="row" data-l="{esc(f["cols"][i])}">{esc(v)}</th>' if (i == 0 and f['cols'][0] in ('Cuándo', 'Etapa'))
                             else f'<td data-l="{esc(f["cols"][i])}">{esc(v)}</td>') for i, v in enumerate(r))
            rows += f'<tr>{cells}</tr>'
        intro = f'<p class="food-intro">{esc(f["intro"])}</p>' if f.get('intro') else ''
        after = ''.join(f'<p>{esc(p)}</p>' for p in f.get('after', []))
        return f'''<section class="sec food" id="comer">
  <div class="wrap">
    <span class="chip">Alimentación</span>
    <h2>{esc(f['title'])}</h2>
    {intro}
    <div class="food-wrap"><table class="food-t"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>
    <div class="food-after">{after}</div>
  </div>
</section>'''

    def alarm_block(write=None):
        own = f'<p class="own"><b>En este tratamiento, escribe si</b> {esc(write)}</p>' if write else ''
        return f'''<section class="sec alarm" id="alarma">
  <div class="wrap alarm-grid">
    <div>
      <span class="chip">Señales de alarma</span>
      <h2>Cuándo escribir al <em>consultorio</em></h2>
      <p class="lead2">Lo normal es que la molestia vaya bajando día con día; si sube, algo no va bien.</p>
      {own}
      <h3>Escribe hoy mismo si:</h3>
      {ul(ALARM)}
      <p class="src">Fuentes: {ALARM_SRC}</p>
    </div>
    <aside class="urgent" data-cursor="light">
      <span class="ic">!</span>
      <h3>Ve a urgencias si</h3>
      <p>{esc(URGENT)}</p>
      <hr>
      <p>Para todo lo demás, escríbeme:</p>
      <a class="btn btn-rosa" href="{wa('Hola, Dra. Ana Paula. Tengo una duda sobre los cuidados después de mi tratamiento.')}" target="_blank" rel="noopener"><span class="ar">{SVG_WA}</span>WhatsApp 33 1194 6819</a>
    </aside>
  </div>
</section>'''

    pages = []
    others = lambda c: ''.join(f'<a href="{o["slug"]}.html"><span class="ic">{icon(o["icon"])}</span>{esc(o["short"])}</a>' for o in CARE if o is not c)

    for c in CARE:
        path = c['slug'] + '.html'
        tx = TX[c['tx'][0]]
        jumps = [('Qué es normal', 'normal')] if c.get('normal') else []
        jumps += [(c.get('do_title', 'Qué hacer'), 'que-hacer')] if c.get('do') else []
        jumps += [(c.get('avoid_title', 'Qué evitar'), 'evitar')] if c.get('avoid') else []
        jumps += [('Qué comer', 'comer')] if c.get('food') else []
        jumps += [('Preguntas', 'preguntas'), ('Cuándo escribir', 'alarma')]
        jumpnav = '<nav class="jump" aria-label="En esta página">' + ''.join(f'<a href="#{a}">{esc(t)}</a>' for t, a in jumps) + '</nav>'
        cards = ''
        if c.get('normal'):
            cards += card('Qué es normal', c['normal'], 'normal', anchor='normal')
        for t, items in c.get('lists', []):
            cards += card(t, items)
        if c.get('do'):
            cards += card(c.get('do_title', 'Qué hacer'), c['do'], 'do', c.get('do_ordered', False), 'que-hacer')
        if c.get('avoid'):
            cards += card(c.get('avoid_title', 'Qué evitar'), c['avoid'], 'avoid', anchor='evitar')
        for t, items in c.get('lists_after', []):
            cards += card(t, items)
        notes = ''.join(f'<div class="note-box"><b>{esc(t)}</b><p>{esc(p)}</p></div>' for t, p in c.get('notes', []))
        pend = ''
        if c.get('pend'):
            pend = '<div class="pend-box"><b>Pendiente para la Dra.</b>' + ul(c['pend'], 'plain') + '</div>'
        faq = faq_block(c['faq'], f'Dudas sobre los cuidados de <em>{esc(c["short"].lower())}</em>')
        faq = faq.replace('<section class="sec faq">', '<section class="sec faq" id="preguntas">', 1)
        food = food_table(c['food']) if c.get('food') else ''
        main = f'''<section class="pg-hero slim" data-cursor="light">
  <div class="wrap">
    {crumbs([('Inicio', './'), ('Cuidados', 'cuidados.html'), (c['short'], '')])}
    <span class="chip"><span class="star"></span> Cuidados después del tratamiento</span>
    <h1>{esc(c['h1'])}</h1>
    <p class="lead">{esc(c['intro'])}</p>
    <div class="ctas"><a class="btn btn-rosa" href="{wa('Hola, Dra. Ana Paula. Tengo una duda sobre los cuidados de ' + c['short'].lower() + '.')}" target="_blank" rel="noopener"><span class="ar">{SVG_WA}</span>Escribir al consultorio</a><a class="btn btn-line" href="{tx['slug']}.html">Ver el tratamiento</a></div>
  </div>
</section>
<div class="jump-bar"><div class="wrap">{jumpnav}</div></div>
<section class="sec">
  <div class="wrap">
    <div class="cc-grid">{cards}</div>
    {notes}
    {pend}
  </div>
</section>
{food}
{faq}
{alarm_block(c.get('write'))}
<section class="sec care-foot">
  <div class="wrap">
    <p class="src">Fuentes: {esc(c['sources'])} Páginas para pacientes de asociaciones dentales y hospitales públicos, revisadas el 28 de octubre de 2026. Los ejemplos de comida mexicana adaptan las listas de las fuentes.</p>
    {author_box()}
    <h2>Otros cuidados</h2>
    <div class="strip wrapz">{others(c)}</div>
  </div>
</section>'''
        page_ld = {"@context": "https://schema.org", "@type": "MedicalWebPage", "name": c['h1'], "description": c['desc'],
                   "url": f"{DOMAIN}/{path}", "inLanguage": "es-MX", "audience": {"@type": "Patient"},
                   "about": {"@type": "MedicalProcedure", "name": tx['short']},
                   "author": {"@type": "Person", "name": "Ana Paula López Guzmán", "jobTitle": "Cirujana dentista"}}
        lds = [page_ld, B.faq_ld(c['faq']), B.breadcrumb([('Inicio', ''), ('Cuidados', 'cuidados.html'), (c['short'], path)])]
        pages.append((path, page(c['seo'], c['desc'], path, main, 'care', lds)))

    # Página general
    cards = ''.join(f'''<a class="tx-card" href="{c['slug']}.html"><span class="ic">{icon(c['icon'])}</span><span class="tx-card-body"><b>{esc(c['short'])}</b><span class="d">{esc(c['intro'].split('. ')[0])}.</span></span><span class="go">Ver cuidados {SVG_ARROW}</span></a>''' for c in CARE)
    main = f'''<section class="pg-hero slim" data-cursor="light">
  <div class="wrap">
    {crumbs([('Inicio', './'), ('Cuidados', '')])}
    <span class="chip"><span class="star"></span> Después de tu cita</span>
    <h1>Cuidados después del <em>tratamiento</em></h1>
    <p class="lead">Qué es normal sentir, qué hacer, qué evitar, qué comer y cuándo escribir al consultorio, para cada tratamiento.</p>
  </div>
</section>
<section class="sec"><div class="wrap"><div class="tx-cards">{cards}</div></div></section>
{alarm_block()}
{B.cta_band()}'''
    lst = {"@context": "https://schema.org", "@type": "ItemList", "name": "Cuidados después del tratamiento",
           "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": c['h1'], "url": f"{DOMAIN}/{c['slug']}.html"} for i, c in enumerate(CARE)]}
    pages.insert(0, ('cuidados.html', page('Cuidados después del tratamiento dental | Dental Crown Guadalajara',
                                           'Indicaciones después de una limpieza, resina, endodoncia, extracción, implante, coronas, brackets, prótesis y más. Qué es normal y cuándo escribir al consultorio.',
                                           'cuidados.html', main, 'care', [lst, B.breadcrumb([('Inicio', ''), ('Cuidados', 'cuidados.html')])])))
    return pages


def care_for(tx_key):
    return [c for c in CARE if tx_key in c['tx']]
