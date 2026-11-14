#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
  fi
fi

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

echo "==> Building and deploying CustFM containers on port ${PORT:-8080}..."
docker compose up -d --build

echo "==> Checking container status..."
sleep 5
docker compose ps

echo ""
echo "=========================================================="
echo " CustFM successfully deployed!"
echo " Public URL:  http://13.140.146.12:${PORT:-8080}/"
echo " Backend API: http://13.140.146.12:${PORT:-8080}/api"
echo "=========================================================="
echo ""
echo "View logs:  docker compose logs -f"
echo "Stop:       docker compose down"
