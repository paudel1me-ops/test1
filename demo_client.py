"""Simple demo client to exercise the telemetry backend.

Two modes are provided:

* HTTP polling - fetch list of vehicles and then request telemetry for each every 2 seconds.
* WebSocket listener - connect to the realtime endpoint and print messages as they arrive.

Usage:
    python demo_client.py http
    python demo_client.py ws

Install requirements first:
    pip install requests websocket-client
"""

import sys
import time
import json


def http_poll(interval: float = 2.0):
    """Poll the REST API periodically and print basic info."""
    import requests

    print("HTTP polling mode - hit /vehicles and /telemetry/<id>")
    while True:
        try:
            resp = requests.get("http://localhost:8000/vehicles", timeout=5)
            resp.raise_for_status()
            data = resp.json()
            vehicles = data.get("vehicles", [])
            print(f"found {len(vehicles)} vehicles: {vehicles}")
            for vid in vehicles:
                t = requests.get(f"http://localhost:8000/telemetry/{vid}", timeout=5).json()
                vdata = t.get("data", {})
                print(f"  {vid}: speed={vdata.get('speed'):.2f}km/h, fuel={vdata.get('fuel_level'):.1f}%")
        except Exception as e:
            print("HTTP poll error:", e)
        time.sleep(interval)


def websocket_client():
    """Connect to the websocket endpoint and dump messages."""
    try:
        from websocket import create_connection
    except ImportError:
        print("websocket-client is not installed. run 'pip install websocket-client'")
        sys.exit(1)

    url = "ws://localhost:8000/ws/telemetry"
    print(f"Connecting to {url}")
    ws = create_connection(url)
    print("connected, listening for messages (Ctrl-C to exit)")
    try:
        while True:
            msg = ws.recv()
            data = json.loads(msg)
            vid = data.get("vehicle_id")
            speed = data.get("speed")
            print(f"[{vid}] speed={speed:.2f} km/h")
    except KeyboardInterrupt:
        print("closing")
    finally:
        ws.close()


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ("http", "ws"):
        print(__doc__)
        sys.exit(1)
    mode = sys.argv[1]
    if mode == "http":
        http_poll()
    else:
        websocket_client()


if __name__ == "__main__":
    main()
