#!/usr/bin/env bash
# Push images to GitHub Container Registry (ghcr.io/itsanla/*).
# Usage: ./command/push-ghcr.sh [--tag <tag>] [--also-latest] [--token <pat>]
#   --tag          Source tag to push (default: latest)
#   --also-latest  Also push :latest when tagging a version
#   --token        GitHub PAT with write:packages scope (or set GITHUB_TOKEN env)
set -euo pipefail

TAG="latest"
ALSO_LATEST=false
GH_TOKEN="${GITHUB_TOKEN:-}"

while [[ $# -gt 0 ]]; do
  case $1 in
    --tag)         TAG="$2";       shift 2 ;;
    --also-latest) ALSO_LATEST=true; shift ;;
    --token)       GH_TOKEN="$2";  shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

REGISTRY="ghcr.io"
NAMESPACE="itsanla"

retag_and_push() {
  local src_image="$1"   # e.g. itsanla/tefa-26
  local dest_image="$REGISTRY/$NAMESPACE/${src_image##*/}"  # ghcr.io/itsanla/tefa-26

  docker tag "$src_image:$TAG" "$dest_image:$TAG"
  echo "  → docker push $dest_image:$TAG"
  docker push "$dest_image:$TAG"

  if $ALSO_LATEST && [[ "$TAG" != "latest" ]]; then
    docker tag "$src_image:$TAG" "$dest_image:latest"
    echo "  → docker push $dest_image:latest"
    docker push "$dest_image:latest"
  fi
}

echo "==> Logging in to ghcr.io"
if [[ -n "$GH_TOKEN" ]]; then
  echo "$GH_TOKEN" | docker login ghcr.io -u itsanla --password-stdin
else
  docker login ghcr.io
fi

echo ""
echo "==> Pushing API → $REGISTRY/$NAMESPACE/api-tefa-26:$TAG"
retag_and_push "itsanla/api-tefa-26"

echo ""
echo "==> Pushing Web → $REGISTRY/$NAMESPACE/tefa-26:$TAG"
retag_and_push "itsanla/tefa-26"

echo ""
echo "✓ Push to GHCR complete."
