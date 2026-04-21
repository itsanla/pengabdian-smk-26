#!/usr/bin/env bash
# Push images to Docker Hub (itsanla/tefa-26 and itsanla/api-tefa-26).
# Usage: ./command/push-dockerhub.sh [--tag <tag>] [--also-latest]
#   --tag          Source/destination tag (default: latest)
#   --also-latest  Also tag and push as :latest when pushing a versioned tag
set -euo pipefail

TAG="latest"
ALSO_LATEST=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --tag)         TAG="$2";       shift 2 ;;
    --also-latest) ALSO_LATEST=true; shift ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

push_image() {
  local image="$1"
  echo "  → docker push $image:$TAG"
  docker push "$image:$TAG"

  if $ALSO_LATEST && [[ "$TAG" != "latest" ]]; then
    docker tag "$image:$TAG" "$image:latest"
    echo "  → docker push $image:latest"
    docker push "$image:latest"
  fi
}

echo "==> Logging in to Docker Hub"
docker login

echo ""
echo "==> Pushing API → itsanla/api-tefa-26:$TAG"
push_image "itsanla/api-tefa-26"

echo ""
echo "==> Pushing Web → itsanla/tefa-26:$TAG"
push_image "itsanla/tefa-26"

echo ""
echo "✓ Push to Docker Hub complete."
