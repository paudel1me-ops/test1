#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

FAST_MODE=false
OPEN_BROWSER=true

for arg in "$@"; do
  case "$arg" in
    --fast)
      FAST_MODE=true
      ;;
    --no-open)
      OPEN_BROWSER=false
      ;;
    -h|--help)
      echo "Usage: ./resume-demo.sh [--fast] [--no-open]"
      echo "  --fast    Start without rebuilding images"
      echo "  --no-open Do not auto-open dashboard URL"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Run ./resume-demo.sh --help"
      exit 1
      ;;
  esac
done

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not found on PATH."
  exit 1
fi

if command -v docker-compose >/dev/null 2>&1; then
  DC=(docker-compose)
else
  DC=(docker compose)
fi

echo "Starting demo stack from $ROOT_DIR"
if [ "$FAST_MODE" = true ]; then
  "${DC[@]}" up -d
else
  "${DC[@]}" up -d --build
fi

echo "Waiting for backend health..."
backend_ready=false
for _ in $(seq 1 45); do
  health_json="$(curl -fsS http://localhost:8000/health 2>/dev/null || true)"
  if echo "$health_json" | grep -q '"status"[[:space:]]*:[[:space:]]*"healthy"'; then
    backend_ready=true
    break
  fi
  sleep 2
done

if [ "$backend_ready" != true ]; then
  echo "Backend did not become healthy in time."
  "${DC[@]}" logs --tail=80 backend
  exit 1
fi

echo "Waiting for frontend readiness..."
frontend_ready=false
for _ in $(seq 1 45); do
  http_code="$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 || true)"
  if [ "$http_code" = "200" ]; then
    frontend_ready=true
    break
  fi
  sleep 2
done

if [ "$frontend_ready" != true ]; then
  echo "Frontend did not become ready in time."
  "${DC[@]}" logs --tail=120 frontend
  exit 1
fi

vehicles_json="$(curl -fsS http://localhost:8000/vehicles)"
stats_json="$(curl -fsS http://localhost:8000/stats)"

if command -v jq >/dev/null 2>&1; then
  vehicle_count="$(echo "$vehicles_json" | jq -r '.count')"
  kafka_status="$(echo "$stats_json" | jq -r '.kafka_producer_status')"
else
  vehicle_count="unknown"
  kafka_status="unknown"
fi

echo
echo "Demo stack is ready"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "Swagger:  http://localhost:8000/docs"
echo "Vehicles: $vehicle_count"
echo "Kafka:    $kafka_status"
echo
echo "Optional live stream command: ./demo.sh"

if [ "$OPEN_BROWSER" = true ] && [ -n "${BROWSER:-}" ]; then
  "$BROWSER" http://localhost:3000 >/dev/null 2>&1 || true
fi
