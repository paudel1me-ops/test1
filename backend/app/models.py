from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class Location(BaseModel):
    latitude: float
    longitude: float
    altitude: float = 0.0


class VehicleTelemetry(BaseModel):
    vehicle_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    location: Location
    speed: float  # km/h
    acceleration: float  # m/s²
    fuel_level: float  # percentage
    engine_temperature: float  # celsius
    rpm: int
    odometer: float  # km
    battery_voltage: float  # volts
    tire_pressure_fl: float  # psi
    tire_pressure_fr: float  # psi
    tire_pressure_bl: float  # psi
    tire_pressure_br: float  # psi
    brake_pressure: float  # bar
    steering_angle: float  # degrees
    ambient_temperature: float  # celsius
    status: str = "active"  # active, idle, error, offline


class VehicleStatus(BaseModel):
    vehicle_id: str
    is_online: bool
    last_update: datetime
    current_metrics: Optional[VehicleTelemetry] = None
