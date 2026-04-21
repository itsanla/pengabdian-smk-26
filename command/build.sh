#!/usr/bin/env bash
# Build Docker images for web and API.
# Usage: ./command/build.sh [--tag <tag>] [--platform <platform>]
#   --tag       Image tag (default: latest)
#   --platform  Build platform, e.g. linux/amd64,linux/arm64 (default: local)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

TAG="latest"
PLATFORM=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --tag)      TAG="$2";      shift 2 ;;
    --platform) PLATFORM="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

PLATFORM_ARGS=()
[[ -n "$PLATFORM" ]] && PLATFORM_ARGS=(--platform "$PLATFORM")

# Load .env if present
[[ -f "$ROOT/.env" ]] && set -a && source "$ROOT/.env" && set +a

echo "==> Building API image  itsanla/api-tefa-26:$TAG"
docker build "${PLATFORM_ARGS[@]}" \
  -t "itsanla/api-tefa-26:$TAG" \
  "$ROOT/apps/api"

echo ""
echo "==> Building Web image  itsanla/tefa-26:$TAG"
docker build "${PLATFORM_ARGS[@]}" \
  --build-arg "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8787/api}" \
  --build-arg "NEXT_PUBLIC_JWT_SECRET=${NEXT_PUBLIC_JWT_SECRET:-changeme}" \
  -t "itsanla/tefa-26:$TAG" \
  "$ROOT/apps/web"

echo ""
echo "✓ Build complete — itsanla/api-tefa-26:$TAG  itsanla/tefa-26:$TAG"
