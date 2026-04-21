#!/usr/bin/env bash
# Start the full stack in development mode.
# Usage: ./command/dev.sh [docker|local]
#   docker  — spin up via docker compose (builds if needed)
#   local   — run pnpm dev directly (requires Node + pnpm)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-local}"

case "$MODE" in
  docker)
    echo "==> Starting via Docker Compose"
    [[ ! -f "$ROOT/.env" ]] && cp "$ROOT/.env.example" "$ROOT/.env" && \
      echo "  ⚠  .env created from .env.example — fill in your values before running again."
    docker compose -f "$ROOT/docker-compose.yml" up --build
    ;;
  local)
    echo "==> Starting in local development mode"
    cd "$ROOT"
    command -v pnpm >/dev/null 2>&1 || { echo "pnpm not found. Install: corepack enable && corepack prepare pnpm@latest --activate" >&2; exit 1; }
    pnpm install
    pnpm dev
    ;;
  *)
    echo "Usage: $0 [docker|local]" >&2
    exit 1
    ;;
esac
