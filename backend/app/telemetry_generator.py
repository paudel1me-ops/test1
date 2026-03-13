import random
import math
from datetime import datetime
from typing import List
from .models import VehicleTelemetry, Location


class TelemetryGenerator:
    """Generates realistic vehicle telemetry data"""

    def __init__(self, num_vehicles: int = 5):
        self.num_vehicles = num_vehicles
        self.vehicle_ids = [f"VEHICLE_{i:03d}" for i in range(num_vehicles)]
        # Initialize vehicle states
        self.vehicle_states = {
            vid: {
                "latitude": random.uniform(-180, 180),
                "longitude": random.uniform(-90, 90),
                "altitude": random.uniform(0, 1000),
                "speed": random.uniform(0, 120),
                "odometer": random.uniform(1000, 100000),
                "heading": random.uniform(0, 360),
            }
            for vid in self.vehicle_ids
        }

    def _update_position(self, vehicle_id: str):
        """Update vehicle position based on speed and heading"""
        state = self.vehicle_states[vehicle_id]
        speed = state["speed"]
        heading = state["heading"]

        # Convert speed (km/h) to degrees per update (simplified)
        distance_delta = (speed / 111.0) / 1000  # km to degrees

        # Update position
        lat_delta = distance_delta * math.cos(math.radians(heading))
        lon_delta = distance_delta * math.sin(math.radians(heading))

        state["latitude"] = (state["latitude"] + lat_delta) % 180
        state["longitude"] = (state["longitude"] + lon_delta) % 360
        state["heading"] = (state["heading"] + random.uniform(-5, 5)) % 360

    def generate_telemetry(self, vehicle_id: str) -> VehicleTelemetry:
        """Generate telemetry data for a specific vehicle"""
        if vehicle_id not in self.vehicle_states:
            raise ValueError(f"Unknown vehicle_id: {vehicle_id}")

        state = self.vehicle_states[vehicle_id]
        self._update_position(vehicle_id)

        # Simulate realistic speed changes
        speed_change = random.uniform(-2, 2)
        state["speed"] = max(0, min(120, state["speed"] + speed_change))

        # Simulate slight altitude changes
        altitude_change = random.uniform(-10, 10)
        state["altitude"] = max(0, state["altitude"] + altitude_change)

        # Update odometer
        state["odometer"] += state["speed"] / 3600  # Convert km/h to km per second

        return VehicleTelemetry(
            vehicle_id=vehicle_id,
            timestamp=datetime.utcnow(),
            location=Location(
                latitude=state["latitude"],
                longitude=state["longitude"],
                altitude=state["altitude"],
            ),
            speed=round(state["speed"], 2),
            acceleration=round(random.uniform(-3, 3), 2),
            fuel_level=round(random.uniform(10, 100), 1),
            engine_temperature=round(random.uniform(70, 120), 1),
            rpm=int(state["speed"] * 100 + random.randint(-5, 5)),
            odometer=round(state["odometer"], 2),
            battery_voltage=round(random.uniform(12, 14.5), 2),
            tire_pressure_fl=round(random.uniform(30, 35), 1),
            tire_pressure_fr=round(random.uniform(30, 35), 1),
            tire_pressure_bl=round(random.uniform(30, 35), 1),
            tire_pressure_br=round(random.uniform(30, 35), 1),
            brake_pressure=round(random.uniform(0, 5) if state["speed"] < 5 else 0, 1),
            steering_angle=round(random.uniform(-45, 45), 1),
            ambient_temperature=round(random.uniform(15, 35), 1),
            status="active",
        )

    def generate_batch(self) -> List[VehicleTelemetry]:
        """Generate telemetry data for all vehicles"""
        return [self.generate_telemetry(vid) for vid in self.vehicle_ids]

    def get_vehicle_ids(self) -> List[str]:
        """Get list of all vehicle IDs"""
        return self.vehicle_ids
