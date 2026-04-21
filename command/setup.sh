#!/usr/bin/env bash
# First-time project setup: install deps, copy env files, run DB migrations.
# Usage: ./command/setup.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Checking prerequisites"
command -v node  >/dev/null 2>&1 || { echo "node not found (required ≥20)" >&2; exit 1; }
command -v pnpm  >/dev/null 2>&1 || { corepack enable && corepack prepare pnpm@latest --activate; }

echo ""
echo "==> Installing dependencies"
pnpm install

echo ""
echo "==> Setting up environment files"

if [[ ! -f "$ROOT/.env" ]]; then
  cp "$ROOT/.env.example" "$ROOT/.env"
  echo "  ✓ Root .env created — edit with your values."
fi

if [[ ! -f "$ROOT/apps/api/.env" ]]; then
  cat > "$ROOT/apps/api/.env" <<'EOF'
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_TOKEN=
EOF
  echo "  ✓ apps/api/.env created — fill in Cloudflare + Cloudinary credentials."
fi

if [[ ! -f "$ROOT/apps/web/.env" ]]; then
  cp "$ROOT/apps/web/.env.example" "$ROOT/apps/web/.env" 2>/dev/null || \
  cat > "$ROOT/apps/web/.env" <<'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8787/api
NEXT_PUBLIC_JWT_SECRET=changeme
EOF
  echo "  ✓ apps/web/.env created."
fi

echo ""
echo "==> Running database migrations (local)"
cd "$ROOT/apps/api"
pnpm wrangler d1 migrations apply sekolah --local || \
  echo "  ⚠  Migration skipped — run manually: cd apps/api && pnpm wrangler d1 migrations apply sekolah --local"

echo ""
echo "✓ Setup complete. Run ./command/dev.sh to start."
