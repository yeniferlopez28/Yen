# Dental Crown · sitio web

Sitio de Dental Crown (C.D. Ana Paula López Guzmán), consultorio dental en Guadalajara.

## Qué hay aquí

- `index.html`: página principal.
- 12 páginas de tratamiento (`limpieza-dental-guadalajara.html`, `implantes-dentales-guadalajara.html`…).
- `precios.html`, `dra-ana-paula-lopez.html`, `blog.html` y 3 artículos (`blog-*.html`).
- `404.html`, `robots.txt`, `sitemap.xml`, `img/`.
- `_build/`: el generador. El texto de los tratamientos y del blog está en `_build/content.py`.

## Antes de publicar

1. Cambiar el dominio y volver a generar:
   `DC_DOMAIN=https://www.su-dominio.com python3 _build/build.py`
2. Llenar lo marcado como pendiente (borde punteado rosa): cédula profesional, aviso de publicidad COFEPRIS,
   correo, horario confirmado, aviso de privacidad y fotos reales del consultorio.
3. Que la Dra. revise los textos clínicos de cada tratamiento y del blog, y quitar "Pendiente de revisión".
4. Quitar la barra "Prototipo para revisión del equipo" (`PROTO` en `_build/build.py` y al inicio de `_build/home_body.html`).

## Publicar

Netlify o Cloudflare Pages: conectar este repositorio, rama `dental-crown-web`, sin comando de build,
carpeta de publicación `/`. Luego conectar el dominio y dar de alta el sitio en Google Search Console
con `sitemap.xml`.
