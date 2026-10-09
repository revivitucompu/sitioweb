#!/usr/bin/env python3
"""Valida el sitio de Reviví Tu Compu antes de publicarlo.

Uso:
    python3 scripts/validar.py [carpeta]        # por defecto, la carpeta actual

Sale con código 1 si encuentra algo que rompe el sitio.
"""
import json
import os
import re
import sys
import xml.dom.minidom
from html.parser import HTMLParser

PRINCIPAL = 'https://revivitucompu.com.ar'

# Páginas que se sirven desde su propio subdominio y su URL pública.
SUBDOMINIOS = {
    'empresas.html':     'https://empresas.revivitucompu.com.ar/',
    'remoto.html':       'https://remoto.revivitucompu.com.ar/',
    'apps.html':         'https://apps.revivitucompu.com.ar/',
    'relevamiento.html': 'https://apps.revivitucompu.com.ar/relevamiento',
    'suscripcion.html':  'https://apps.revivitucompu.com.ar/suscripcion',
}

# Archivos que no se referencian desde el HTML pero tienen que estar igual.
SIEMPRE = {'img/icon-192.png', 'img/icon-512.png', 'img/apple-touch-icon.png',
           'img/logo.png', 'img/logo-horizontal.png', 'img/logo-app.png'}

VACIAS = {'img', 'br', 'meta', 'link', 'hr', 'input', 'path', 'source', 'use',
          'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'stop', 'col'}


class Balance(HTMLParser):
    def __init__(self):
        super().__init__()
        self.pila, self.err = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in VACIAS:
            self.pila.append(tag)

    def handle_endtag(self, tag):
        if tag in VACIAS:
            return
        if self.pila and self.pila[-1] == tag:
            self.pila.pop()
        elif tag in self.pila:
            self.err.append('cierre fuera de orden: </%s> (esperaba </%s>)'
                            % (tag, self.pila[-1]))
            while self.pila and self.pila.pop() != tag:
                pass
        else:
            self.err.append('cierre sin apertura: </%s>' % tag)


def url_esperada(archivo):
    if archivo in SUBDOMINIOS:
        return SUBDOMINIOS[archivo]
    if archivo == 'index.html':
        return PRINCIPAL + '/'
    return '%s/%s' % (PRINCIPAL, archivo[:-5])


def validar(raiz):
    problemas, avisos = [], []
    htmls = sorted(f for f in os.listdir(raiz) if f.endswith('.html'))
    if not htmls:
        return ['no hay archivos .html en %s' % raiz], []

    usadas = set()
    for f in htmls:
        h = open(os.path.join(raiz, f), encoding='utf-8').read()

        b = Balance()
        b.feed(h)
        for e in b.err:
            problemas.append('%s: %s' % (f, e))
        if b.pila:
            problemas.append('%s: etiquetas sin cerrar: %s'
                             % (f, ', '.join(b.pila[:5])))

        for n, bloque in enumerate(re.findall(
                r'<script type="application/ld\+json">(.*?)</script>', h, re.S)):
            try:
                json.loads(bloque)
            except json.JSONDecodeError as e:
                problemas.append('%s: JSON-LD #%d inválido (%s)' % (f, n + 1, e))

        refs = (set(re.findall(r'src="(img/[^"]+)"', h))
                | set(re.findall(r"url\('(img/[^']+)'\)", h)))
        usadas |= refs
        for r in sorted(refs):
            if not os.path.exists(os.path.join(raiz, r)):
                problemas.append('%s: falta la imagen %s' % (f, r))

        # Enlaces con .html: Cloudflare los redirige y Google reporta error.
        for m in set(re.findall(r'href="([^"]*\.html[^"]*)"', h)):
            if not m.startswith('http') or 'revivitucompu.com.ar' in m:
                problemas.append('%s: enlace con .html → %s' % (f, m))

        for etiqueta, patron in (
                ('canonical', r'rel="canonical" href="([^"]+)"'),
                ('og:url', r'property="og:url" content="([^"]+)"')):
            for m in re.findall(patron, h):
                if m.endswith('.html'):
                    problemas.append('%s: %s con .html → %s' % (f, etiqueta, m))
                elif etiqueta == 'canonical' and m.rstrip('/') != url_esperada(f).rstrip('/'):
                    avisos.append('%s: canónica %s (esperaba %s)'
                                  % (f, m, url_esperada(f)))

        # Una página de subdominio con enlaces relativos a la raíz deja al
        # visitante navegando el sitio entero bajo el subdominio equivocado.
        if f in SUBDOMINIOS:
            raiz_rel = [m for m in set(re.findall(r'href="(/[^/"][^"]*)"', h))]
            if raiz_rel:
                problemas.append('%s: se sirve desde un subdominio y tiene enlaces '
                                 'relativos a la raíz (%s…). Tienen que ser absolutos.'
                                 % (f, ', '.join(sorted(raiz_rel)[:3])))

        if '"aggregateRating"' in h:
            problemas.append('%s: tiene aggregateRating en el JSON-LD '
                             '(se sacó a propósito, da error en Search Console)' % f)

        if h.count('data:image/') > 1:
            avisos.append('%s: tiene %d imágenes en base64; el sitio que se publica '
                          'las lleva sueltas en img/' % (f, h.count('data:image/')))

    carpeta_img = os.path.join(raiz, 'img')
    if os.path.isdir(carpeta_img):
        for nombre in sorted(os.listdir(carpeta_img)):
            rel = 'img/' + nombre
            if rel not in usadas and rel not in SIEMPRE:
                avisos.append('imagen sin usar: %s' % rel)

    sm = os.path.join(raiz, 'sitemap.xml')
    if os.path.exists(sm):
        texto = open(sm, encoding='utf-8').read()
        try:
            xml.dom.minidom.parseString(texto)
        except Exception as e:
            problemas.append('sitemap.xml: XML inválido (%s)' % e)
        for loc in re.findall(r'<loc>([^<]+)</loc>', texto):
            if loc.endswith('.html'):
                problemas.append('sitemap.xml: URL con .html → %s' % loc)
    else:
        avisos.append('no hay sitemap.xml')

    return problemas, avisos


def main():
    raiz = sys.argv[1] if len(sys.argv) > 1 else '.'
    problemas, avisos = validar(raiz)
    for a in avisos:
        print('aviso   ', a)
    for p in problemas:
        print('PROBLEMA', p)
    if problemas:
        print('\n%d problema(s). No publicar así.' % len(problemas))
        sys.exit(1)
    print('\nSitio validado: sin problemas.')


if __name__ == '__main__':
    main()
