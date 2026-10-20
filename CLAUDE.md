# Reviví Tu Compu — sitio web

Sitio de Juan Francisco De Paula, servicio técnico informático en Caballito Norte,
CABA. Trabaja solo. El sitio es su carta de presentación y, junto con Google Business
Profile y WhatsApp, su canal de captación.

HTML estático, sin build ni dependencias. Se publica en Cloudflare Pages.

El repo tiene **dos sitios**, cada uno en su carpeta y con su propio proyecto de Pages:

- `public/` — Reviví Tu Compu (`revivitucompu.com.ar` y sus subdominios).
- `organizapp/` — OrganizApp (`www.organizapp.com.ar`), las apps de gestión. Ver
  *OrganizApp* más abajo.

En la raíz quedan este archivo, `scripts/` y `.gitignore`, que no se publican.

---

## Antes de editar

Leé el archivo completo antes de tocarlo. Cada página tiene **dos bloques `<style>`**
y confundirlos es el error más común (ver *Estructura interna*).

Para cambios estructurales —mover bloques, renumerar pasos, agregar secciones— usá un
script de Python con reemplazos de texto exacto que **falle ruidosamente** si no
encuentra lo que busca. Un reemplazo silencioso que no matchea rompe el sitio sin
avisar:

```python
def rep(old, new, n=1):
    global h
    if h.count(old) != n:
        print('!! NO MATCH (%d):' % h.count(old), old[:100]); sys.exit(1)
    h = h.replace(old, new)
```

---

## Las páginas

| Archivo | URL pública | Qué es |
|---|---|---|
| `index.html` | `revivitucompu.com.ar/` | Landing: síntomas, servicios destacados, trabajos, reseñas, ubicación |
| `servicios.html` | `/servicios` | Los 29 servicios en tablas, con ícono y precio |
| `resenas.html` | `/resenas` | Todas las reseñas de Google |
| `quien-te-atiende.html` | `/quien-te-atiende` | Sobre Juan |
| `preguntas-frecuentes.html` | `/preguntas-frecuentes` | FAQ |
| `terminos.html` | `/terminos` | Términos y condiciones |
| `empresas.html` | `empresas.revivitucompu.com.ar` | Soporte IT para empresas |
| `remoto.html` | `remoto.revivitucompu.com.ar` | Tutorial de AnyDesk, solapas Windows/Mac |
| `404.html` | — | Página de error |
| `taller/` | `/taller` | Sistema de gestión del taller (privado, `noindex`) |
| `seguimiento/` | `/seguimiento` | Seguimiento de órdenes |

---

## URLs: dos reglas que no se negocian

**1. Nunca con `.html`.** Cloudflare Pages redirige solo `/empresas.html` → `/empresas`.
Si la canónica, el sitemap o un enlace interno apuntan a la versión con extensión,
Google entra, lee la canónica, va ahí, lo redirigen de vuelta, y reporta **"Error de
redirección"**: la página no se indexa. Ya pasó una vez y costó una tarde.

Los archivos en disco **siguen llamándose** `empresas.html`. Lo que cambia es a dónde
apuntan, no cómo se llaman.

**2. Las páginas de subdominio usan URLs absolutas.** `empresas.html` y `remoto.html`
se sirven desde su propio
subdominio, así que sus enlaces internos al sitio principal son absolutos
(`https://www.revivitucompu.com.ar/servicios`), no relativos. Si fueran relativos, el
visitante quedaría navegando todo el sitio bajo el subdominio equivocado, con el
contenido duplicado en dos dominios.

Cada una declara como canónica su propio subdominio, y eso hoy es cierto: hay un
dominio personalizado en Pages y una regla de reescritura por cada uno.

### OrganizApp

Desde octubre de 2026 las apps de gestión son una marca propia, **OrganizApp**
("powered by Reviví Tu Compu"), y un **sitio aparte** en la carpeta `organizapp/`,
publicado en su propio proyecto de Pages (`organizapp`) en `www.organizapp.com.ar`:

| Archivo | URL pública | Qué es |
|---|---|---|
| `organizapp/index.html` | `www.organizapp.com.ar/` | Landing: qué hace, rubros, planes, preguntas |
| `organizapp/relevamiento.html` | `/relevamiento` | Cuestionario (va a la planilla "Relevamientos" por Apps Script) |
| `organizapp/suscripcion.html` | `/suscripcion` | Confirmación de suscripción: vuelta de Mercado Pago, muestra el código |
| `organizapp/404.html` | — | Página de error |

Es un solo host, así que adentro de `organizapp/` los enlaces relativos a la raíz
(`/relevamiento`) están bien. Tiene su `favicon.ico`, `robots.txt`, `sitemap.xml` y
`_redirects` (`/apps` → `/`, el nombre viejo de la landing). Las imágenes van en
`organizapp/img/` sin prefijo.

Header y pie propios (logo de OrganizApp, menú con las secciones de la landing,
enlace a Reviví Tu Compu) y paleta propia, la del logo: `--brand #5D62E9` (índigo;
botones y texto de enlaces sobre blanco, 4,8:1), `--brand-dark #4A4FD6` (hover,
texto), `--green #119D71` (tildes, bordes, acentos) y `--green-dark #0B7A57`
(etiquetas con texto blanco: el verde de marca da 3,4:1 y no alcanza). No uses el
celeste ni el naranja de RTC ahí. La tabla de *Variables de color* de abajo es la de
RTC.

Desde `public/` los enlaces a OrganizApp van siempre a `https://www.organizapp.com.ar/`.
`public/_redirects` manda `/apps`, `/relevamiento` y `/suscripcion` a OrganizApp con
301, para los enlaces viejos y para `apps.revivitucompu.com.ar`.

---

## Cómo escribir

- Castellano rioplatense, **voseo**, directo y sin solemnidad. Nada de "usted".
- **Primera persona del singular.** Juan trabaja solo: nunca "nuestro equipo",
  "nuestros técnicos" ni plurales que sugieran una empresa con personal.
- Sin jerga. El que lee no sabe de computación y está preocupado por su equipo.
  Explicar en palabras de todos los días, sin condescender.
- Frases cortas. Si una oración necesita dos comas para respirar, partila.

### Decisiones ya tomadas

No las revises ni las contradigas salvo que Juan las cambie explícitamente:

- El diagnóstico es **sin cargo**, en todas las plataformas.
- Los precios de empresas son siempre **"a convenir"**, nunca un número.
- **No** se ofrece recuperación de datos ni reparación de impresoras. Si aparecen en
  algún listado es un error heredado: sacalos.
- En la landing van sólo 6 servicios destacados; el resto vive en `/servicios`.
- Sin botón flotante de WhatsApp.
- La atención es únicamente con cita previa, y eso se aclara en "Dónde estoy".
- El carrusel de reseñas es una selección curada, no todas las de Google. Si entra una
  nueva mejor que alguna de las que están, se reemplaza en lugar de sumar.

---

## Estructura interna

### Los dos bloques de `<style>`

1. **Bloque 0 — hoja compartida.** Igual en todas las páginas: variables de color,
   tipografía, header, footer, botones, tarjetas, `.hero`, `.empresas`, `.cierre`,
   `.panel`, `.tarifa`, `.sintoma`. **Si tocás algo acá, replicalo en todos los
   archivos**: no hay CSS externo.
2. **Bloque 1 — estilos propios de esa página.**

Las páginas nuevas (`apps`, `relevamiento`, `suscripcion`, `terminos`) usan clases con
prefijo `st-` (`.st-top`, `.st-links`, `.st-wa`) en lugar de las clásicas.

### Trampa conocida: colisión de clases

El bloque 0 define `.panel` como el recuadro oscuro semitransparente del banner de
asistencia remota de la landing. `remoto.html` usaba esa misma clase para los paneles
de las solapas y los pasos quedaban dentro de una caja gris sobre fondo blanco. Se
renombró a `.panel-so`. **Antes de reusar un nombre de clase corto y genérico,
buscalo en el bloque 0.**

### Variables de color

```
--cyan        #29AAE3   marca, botones, íconos
--cyan-dark   #126F9C   texto celeste (enlaces, precios), hover, banner remoto
--cyan-deep   #0E5A80   final del degradé del banner remoto y de la cabecera de remoto
--ink         #0E2230   texto principal y fondos oscuros
--slate       #5A7183   texto secundario, epígrafes
--line        #D9E6EF   bordes
--paper       #F4F8FB   fondo de cajas claras
--orange      #F15A25   advertencias y focus
```

Usá siempre las variables, nunca un hex suelto.

### Íconos

SVG inline de trazo, viewBox `0 0 24 24`, `fill:none`, `stroke:currentColor`,
`stroke-width` 1.7–1.9, extremos redondeados. Heredan el color del contenedor. Las
excepciones son los logos de marca (Windows, Apple, Instagram, Facebook), dibujados en
el mismo estilo para que no desentonen.

### Menú

Orden: los cinco enlaces internos de la landing, un separador (`<span class="sep">`),
y después Empresas y Apps, que son páginas aparte. La página actual se marca con
`aria-current="page"` y se pinta sola; en la landing, el JS marca con
`aria-current="location"` la sección por la que vas pasando.

### Datos estructurados

Cada página lleva JSON-LD. `index.html` tiene el `ComputerRepairService` con `sameAs`
a Instagram, Facebook y Google Maps. `remoto.html` tiene un `HowTo`: **si cambian los
pasos de la página, hay que cambiar el HowTo también.**

Nunca vuelvas a agregar `aggregateRating`: generó un error en Search Console y se sacó
a propósito. Las reseñas se muestran como texto, sin marcado de rating.

### Accesibilidad

`aria-label` en enlaces que son sólo ícono, `aria-hidden="true"` en SVG decorativos,
`alt` descriptivo en capturas, roles `tab`/`tabpanel` en las solapas, `:focus-visible`
con contorno naranja. No la pierdas al editar.

Texto celeste sobre blanco va con `--cyan-dark`, nunca con `--cyan`: el celeste de
marca da 2,6:1 de contraste y no se lee. Lo mismo para texto blanco sobre fondo
celeste: el fondo arranca en `--cyan-dark`. Cada página tiene además un enlace
"Saltar al contenido" (`.saltar`) que apunta al `<main id="principal">`, estrellas
con `role="img"` y `aria-label="5 de 5 estrellas"`, y respeta
`prefers-reduced-motion`. En celular el pie apila los enlaces (`.enlaces`) y los
íconos sociales tienen 44 px de zona táctil. El logo del header es
`img/logo-horizontal.webp`, no base64: así se descarga una sola vez.

---

## Imágenes

Todo a **WebP**, calidad 80–82. Ancho máximo 1200 px para capturas, 2200 para fondos a
sangre completa. Las ventanas chicas (diálogos) van a tamaño original: ampliarlas se
ve pixelado.

```html
<figure class="captura" style="max-width:420px">
  <img src="img/nombre.webp" width="746" height="560"
       loading="lazy" decoding="async" alt="Qué se ve">
  <figcaption>Qué mirar.</figcaption>
</figure>
```

`width` y `height` son las medidas **reales del archivo**, para que no salte el texto
al cargar. El `max-width` del `<figure>` controla cómo se ve.

**Antes de publicar una captura, mirala.** Los números de AnyDesk, las direcciones de
correo y los nombres de archivos personales se tapan con mosaico. El número de "Este
puesto de trabajo" y el de la ventana de solicitud entrante son la dirección del equipo
de Juan: publicarlos invita a que cualquiera le mande pedidos de conexión.

---

## Publicar

Cada sitio se publica por separado. Lo que está fuera de `public/` y `organizapp/`
—este archivo, `scripts/`, `.gitignore`— queda en el repo pero **no se publica**.

```bash
./scripts/publicar.sh               # Reviví Tu Compu → proyecto revivitucompu
./scripts/publicar.sh organizapp    # OrganizApp → proyecto organizapp
```

Cada uno valida y después publica con `wrangler`. El de OrganizApp crea el proyecto la
primera vez y publica siempre a producción (`--branch=main`).

**Por qué wrangler y no una conexión con Git:** el proyecto de Pages se creó como
"subida directa" y Cloudflare no permite convertirlo. Migrarlo significaría crear un
proyecto nuevo y mudarle los cinco dominios personalizados (apex, www, apps, empresas,
remoto) más las reglas de reescritura. `wrangler pages deploy` funciona igual contra un
proyecto de subida directa, así que no hay nada que migrar.

Para validar sin publicar:

```bash
python3 scripts/validar.py public
python3 scripts/validar.py organizapp
```

Chequea balance de etiquetas, JSON-LD parseable, imágenes que faltan o que ya no usa
nadie, enlaces con `.html`, canónicas mal puestas y el `aggregateRating`. **No publiques
nada que no pase.**

---

## Infraestructura

- **Hosting y DNS:** Cloudflare Pages, proyecto `revivitucompu` (subida directa).
- **Dominio:** registrado en NIC.ar, delegado a los nameservers de Cloudflare.
- **Subdominios:** `empresas` y `remoto` son dominios personalizados del
  proyecto, cada uno con una regla de reescritura de `/` a su página. Hubo dos reglas
  de página viejas que redirigían `remoto` y `apps` con un 301 a la URL larga; están
  **desactivadas**, no borradas.
- **OrganizApp:** proyecto de Pages aparte, `organizapp` (subida directa), con
  `www.organizapp.com.ar` como dominio personalizado y un redirect del apex a `www`.
  No necesita reescritura: su portada es `index.html`. `apps.revivitucompu.com.ar`
  sigue en el proyecto `revivitucompu` sólo para que resuelva; lo manda a OrganizApp
  `public/_redirects` (o una regla de redirección en la zona, que es más directa).
  La zona `organizapp.com.ar` la comparte con la plataforma de las apps (repo
  `plataforma-saas`): un Worker atiende `*.organizapp.com.ar/*`, uno por cliente.
  `www` sólo llega a este sitio porque tiene una **ruta de exclusión sin Worker**
  en "Rutas de Workers". No la borres: sin ella el comodín se queda con www.
- **Analítica:** Cloudflare Web Analytics (sin cookies, por eso el sitio no necesita
  banner de consentimiento). No agregues Google Analytics sin hablarlo.
- **Search Console:** propiedad verificada por TXT. Después de un cambio grande,
  reenviar el sitemap y pedir indexación de lo que cambió, siempre con la URL sin
  `.html`.

---

## Al responder

Contá qué cambiaste y por qué, en prosa, sin listas de checkboxes. Si encontrás algo
que estaba mal y lo arreglaste de paso, decilo: Juan quiere entender su propio sitio,
no sólo recibirlo funcionando.

Cuando propongas algo discutible —tapar un dato, cambiar un ícono repetido, sacar una
captura que ya no ilustra nada— hacelo y ofrecé revertirlo en una línea. Es más rápido
que preguntar primero, y él decide igual.
