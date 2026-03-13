#!/usr/bin/env bash
# simple shell demo script to poll the API and show telemetry
# usage: ./demo.sh

set -uo pipefail

API_BASE="${API_BASE:-http://localhost:8000}"

while true; do
  echo "---- $(date) ----"
  vehicles_json=$(curl -fsS "$API_BASE/vehicles" 2>/dev/null)
  if [[ -z "$vehicles_json" ]]; then
    echo "API not reachable at $API_BASE, retrying..."
    sleep 2
    continue
  fi

  echo "$vehicles_json" | jq
  VID=$(echo "$vehicles_json" | jq -r '.vehicles[0] // empty')
  if [[ -n "$VID" ]]; then
    curl -fsS "$API_BASE/telemetry/$VID" | jq '.data | {vehicle_id, speed, fuel_level, engine_temperature, timestamp}'
  fi
  sleep 2
done
