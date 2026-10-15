#!/usr/bin/env python3
"""Valida un sitio antes de publicarlo.

Uso:
    python3 scripts/validar.py [carpeta]        # por defecto, public
    python3 scripts/validar.py organizapp       # el sitio de OrganizApp

public/ es Reviví Tu Compu (con sus subdominios); organizapp/ es otro sitio,
con un solo host: www.organizapp.com.ar.

Sale con código 1 si encuentra algo que rompe el sitio.
"""
import json
import os
import re
import sys
import xml.dom.minidom
from html.parser import HTMLParser

PRINCIPAL = 'https://revivitucompu.com.ar'
ORGANIZAPP = 'https://www.organizapp.com.ar'
EMPRESAS = 'https://empresas.revivitucompu.com.ar'
REMOTO = 'https://remoto.revivitucompu.com.ar'

# Desde qué host se sirve cada página.
HOST_DE = {
    'empresas.html':     EMPRESAS,
    'remoto.html':       REMOTO,
}

# URL pública de cada página, para chequear la canónica.
URL_DE = {
    'empresas.html':     EMPRESAS + '/',
    'remoto.html':       REMOTO + '/',
}

# Archivos que se sirven igual desde cualquier dominio: un enlace relativo a la
# raíz que apunte a uno de estos funciona siempre.
PREFIJOS_ESTATICOS = ('img/', 'js/', 'css/', 'taller/', 'seguimiento/')
ARCHIVOS_ESTATICOS = {'favicon.ico', 'robots.txt', 'sitemap.xml', 'site.webmanifest'}

# Imágenes que no se referencian desde el HTML pero tienen que estar igual.
SIEMPRE = {'img/icon-192.png', 'img/icon-512.png', 'img/apple-touch-icon.png',
           'img/logo.png', 'img/logo-horizontal.png', 'img/logo-app.png',
           'img/logo-animado.svg'}

# El sitio de OrganizApp: se usan desde <link> y og:image, no desde src.
SIEMPRE_ORGANIZAPP = {'img/favicon-32.png', 'img/icon-192.png', 'img/icon-512.png',
                      'img/apple-touch-icon.png', 'img/og.jpg'}

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


def host_de(archivo):
    return HOST_DE.get(archivo, PRINCIPAL)


def url_de(archivo):
    if archivo in URL_DE:
        return URL_DE[archivo]
    if archivo == 'index.html':
        return PRINCIPAL + '/'
    return '%s/%s' % (PRINCIPAL, archivo[:-5])


def destino_cruza_host(href, host_pagina):
    """¿Este enlace relativo a la raíz apunta a otro host del que se sirve la página?

    Devuelve el host correcto si cruza, o None si el enlace está bien.
    """
    ruta = href.lstrip('/').split('?')[0].split('#')[0]

    # Un ancla suelta (/#algo) o la raíz pelada apuntan a la landing.
    if ruta == '':
        destino = PRINCIPAL
    elif ruta.startswith(PREFIJOS_ESTATICOS) or ruta in ARCHIVOS_ESTATICOS:
        return None
    else:
        archivo = ruta if ruta.endswith('.html') else ruta + '.html'
        destino = host_de(archivo)

    return None if destino == host_pagina else destino


def validar(raiz):
    problemas, avisos = [], []
    htmls = sorted(f for f in os.listdir(raiz) if f.endswith('.html'))
    if not htmls:
        return ['no hay archivos .html en %s' % raiz], []

    usadas = set()
    for f in htmls:
        h = open(os.path.join(raiz, f), encoding='utf-8').read()
        host = host_de(f)

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
                | set(re.findall(r"url\('/?(img/[^']+)'\)", h)))
        usadas |= refs
        for r in sorted(refs):
            if not os.path.exists(os.path.join(raiz, r)):
                problemas.append('%s: falta la imagen %s' % (f, r))

        # Enlaces con .html: Cloudflare los redirige y Google reporta error.
        for m in sorted(set(re.findall(r'href="([^"]*\.html[^"]*)"', h))):
            if (not m.startswith('http') or 'revivitucompu.com.ar' in m
                    or 'organizapp.com.ar' in m):
                problemas.append('%s: enlace con .html → %s' % (f, m))

        # Enlaces relativos a la raíz que cruzan de host: quedan rotos.
        for m in sorted(set(re.findall(r'href="(/[^"]*)"', h))):
            otro = destino_cruza_host(m, host)
            if otro:
                problemas.append('%s: se sirve desde %s y enlaza a %s, que vive en %s. '
                                 'Tiene que ser absoluto.' % (f, host, m, otro))

        for etiqueta, patron in (
                ('canonical', r'rel="canonical" href="([^"]+)"'),
                ('og:url', r'property="og:url" content="([^"]+)"')):
            for m in re.findall(patron, h):
                if m.endswith('.html'):
                    problemas.append('%s: %s con .html → %s' % (f, etiqueta, m))
                elif etiqueta == 'canonical' and m.rstrip('/') != url_de(f).rstrip('/'):
                    avisos.append('%s: canónica %s (esperaba %s)'
                                  % (f, m, url_de(f)))

        if '"aggregateRating"' in h:
            problemas.append('%s: tiene aggregateRating en el JSON-LD '
                             '(se sacó a propósito, da error en Search Console)' % f)

        if h.count('data:image/') > 1:
            avisos.append('%s: tiene %d imágenes en base64; pesan más que un archivo '
                          'suelto en img/' % (f, h.count('data:image/')))

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
    global PRINCIPAL, HOST_DE, URL_DE, SIEMPRE
    raiz = sys.argv[1] if len(sys.argv) > 1 else 'public'
    if os.path.basename(os.path.normpath(raiz)) == 'organizapp':
        # Un solo host: todo enlace relativo a la raíz se queda en OrganizApp.
        PRINCIPAL, HOST_DE, URL_DE, SIEMPRE = ORGANIZAPP, {}, {}, SIEMPRE_ORGANIZAPP
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
