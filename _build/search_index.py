"""Genera search-index.js: el índice del buscador del sitio (tratamientos, cuidados, blog, preguntas y páginas)."""
import json, re

# Palabras que la gente usa y no aparecen tal cual en los textos.
SYN = {
    'valoracion': 'consulta revision primera vez cita dentista radiografia presupuesto chequeo diagnostico dolor',
    'limpieza': 'sarro placa profilaxis encias sangrado mal aliento limpiar dientes manchas',
    'guardas': 'bruxismo rechinar apretar dientes dolor mandibula placa noche protector',
    'resina': 'caries empaste relleno amalgama diente roto despostillado curacion obturacion',
    'endodoncia': 'nervio conducto dolor de muela muela dolor fuerte matar nervio infeccion absceso',
    'corona': 'funda carilla diente roto estetica sonrisa porcelana zirconia',
    'blanqueamiento': 'blanquear dientes amarillos manchas color blanco aclarar',
    'ortodoncia': 'brackets frenos fierros dientes chuecos desalineados apiñados mordida',
    'ortopedia': 'ninos niñas hijos infantil aparato mordida cruzada chupon dedo',
    'extraccion': 'sacar muela quitar diente muela del juicio cordal',
    'protesis': 'placa dentadura postiza puente dientes faltantes removible',
    'implante': 'reponer diente perdido falta diente tornillo titanio',
}


def norm(s):
    s = s.lower()
    for a, b in zip('áéíóúüñ', 'aeiouun'):
        s = s.replace(a, b)
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9$ ]', ' ', s)).strip()


def build_index(B, care, posts):
    items = []
    TX = B.TREATMENTS
    for t in TX:
        price = ' · '.join(v for _, v in t['price'])
        body = ' '.join([t['lead']] + t['what'] + t['when'] + [q for q, _ in t['faq']])
        items.append(dict(c='Tratamiento', t=t['short'], u=t['slug'] + '.html', d=t['lead'], p=price, i=t['key'],
                          k=norm(t['short'] + ' ' + t['h1'] + ' ' + SYN.get(t['key'], '') + ' precio costo cuanto cuesta'), x=norm(body)))
        for q, a in t['faq']:
            items.append(dict(c='Pregunta', t=q, u=t['slug'] + '.html#preguntas', d=a, i=t['key'],
                              k=norm(q + ' ' + t['short'] + ' ' + SYN.get(t['key'], '')), x=norm(a)))
    for c in care:
        body = ' '.join([c['intro']] + c.get('normal', []) + c.get('do', []) + c.get('avoid', []) + [q for q, _ in c['faq']])
        if c.get('food'):
            body += ' que comer comida dieta alimentos ' + ' '.join(' '.join(r) for r in c['food']['rows'])
        syn = ' '.join(SYN.get(k, '') for k in c['tx'])
        items.append(dict(c='Cuidados', t=c['h1'], u=c['slug'] + '.html', d=c['intro'], i=c['icon'],
                          k=norm(c['h1'] + ' cuidados despues recuperacion indicaciones ' + syn), x=norm(body)))
        for q, a in c['faq']:
            items.append(dict(c='Pregunta', t=q, u=c['slug'] + '.html#preguntas', d=a, i=c['icon'],
                              k=norm(q + ' cuidados ' + c['short'] + ' ' + syn), x=norm(a)))
    for p in posts:
        txt = ' '.join(v if isinstance(v, str) else ' '.join(v) for _, v in p['body'])
        items.append(dict(c='Blog', t=p['title'], u=f"blog-{p['slug']}.html", d=p['desc'], k=norm(p['title'] + ' blog articulo'), x=norm(txt)))
    pages = [
        ('Página', 'Precios de todos los tratamientos', 'precios.html', 'Lista completa de precios del consultorio.', 'precios lista costos cuanto cuesta tarifas'),
        ('Página', 'Todos los tratamientos', 'tratamientos.html', 'Los 12 tratamientos con su precio y en qué consisten.', 'tratamientos servicios'),
        ('Página', 'Cuidados después del tratamiento', 'cuidados.html', 'Qué es normal, qué hacer y cuándo escribir al consultorio.', 'cuidados despues indicaciones recuperacion'),
        ('Página', 'La Dra. Ana Paula López Guzmán', 'dra-ana-paula-lopez.html', 'Cirujana dentista de Dental Crown.', 'doctora dentista quien atiende ana paula lopez guzman cedula'),
        ('Página', 'Blog de salud dental', 'blog.html', 'Dudas de salud dental, resueltas.', 'blog articulos'),
        ('Página', 'Ubicación y horario', './#ubicacion', 'Julián Medina Castillo 1808 C, Circunvalación Oblatos, Guadalajara. Todos los días, 1:00 a 8:00 pm.', 'ubicacion direccion donde estan como llegar mapa horario oblatos guadalajara abierto domingo'),
        ('Página', 'Agendar una cita', './#agenda', 'Agenda en línea o por WhatsApp al 33 1194 6819.', 'agendar cita reservar whatsapp telefono'),
        ('Página', 'Reseñas de pacientes', './#resenas', '82 reseñas con 5 estrellas en Google.', 'resenas opiniones comentarios google calificacion'),
        ('Página', 'Formas de pago', 'precios.html', 'Efectivo, transferencia, débito y crédito.', 'pago tarjeta credito debito efectivo transferencia meses'),
    ]
    for c, t, u, d, k in pages:
        items.append(dict(c=c, t=t, u=u, d=d, k=norm(t + ' ' + k), x=''))
    icons = {k: B.ICONS[k] for k in B.ICONS}
    return 'window.DC_INDEX=' + json.dumps(items, ensure_ascii=False, separators=(',', ':')) + ';\nwindow.DC_ICONS=' + json.dumps(icons, separators=(',', ':')) + ';\n'
