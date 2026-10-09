#!/usr/bin/env bash
# Valida el sitio y lo publica en Cloudflare Pages.
# Uso: ./scripts/publicar.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ Validando…"
python3 scripts/validar.py public

echo
echo "→ Publicando en Cloudflare Pages…"
npx wrangler pages deploy public --project-name=revivitucompu

echo
echo "Listo. Revisá https://revivitucompu.com.ar"
echo "Si cambiaron páginas de subdominio, mirá también:"
echo "  https://empresas.revivitucompu.com.ar"
echo "  https://remoto.revivitucompu.com.ar"
echo "  https://apps.revivitucompu.com.ar"
