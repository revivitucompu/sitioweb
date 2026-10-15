#!/usr/bin/env bash
# Valida un sitio y lo publica en Cloudflare Pages.
# Uso:
#   ./scripts/publicar.sh               # Reviví Tu Compu (carpeta public/)
#   ./scripts/publicar.sh organizapp    # OrganizApp (carpeta organizapp/)
set -euo pipefail

cd "$(dirname "$0")/.."

SITIO="${1:-revivitucompu}"

case "$SITIO" in
  revivitucompu)
    echo "→ Validando Reviví Tu Compu…"
    python3 scripts/validar.py public

    echo
    echo "→ Publicando en Cloudflare Pages…"
    npx wrangler pages deploy public --project-name=revivitucompu

    echo
    echo "Listo. Revisá https://revivitucompu.com.ar"
    echo "Si cambiaron páginas de subdominio, mirá también:"
    echo "  https://empresas.revivitucompu.com.ar"
    echo "  https://remoto.revivitucompu.com.ar"
    ;;

  organizapp)
    echo "→ Validando OrganizApp…"
    python3 scripts/validar.py organizapp

    # La primera vez el proyecto no existe: se crea con main como rama de
    # producción. Sin eso, wrangler preguntaría y el script se quedaría esperando.
    if ! npx wrangler pages project list 2>/dev/null | grep -qw organizapp; then
      echo
      echo "→ Creando el proyecto organizapp en Cloudflare Pages (solo la primera vez)…"
      npx wrangler pages project create organizapp --production-branch=main
    fi

    echo
    echo "→ Publicando en Cloudflare Pages…"
    # --branch=main: así sale siempre a producción, aunque estés en otra rama.
    npx wrangler pages deploy organizapp --project-name=organizapp --branch=main

    echo
    echo "Listo. Revisá https://www.organizapp.com.ar"
    ;;

  *)
    echo "No conozco el sitio \"$SITIO\". Usá: revivitucompu u organizapp" >&2
    exit 1
    ;;
esac
