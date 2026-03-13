import React from "react";
import "./VehicleMetrics.css";

const VehicleMetrics = ({ vehicleId, data }) => {
  if (!data) {
    return (
      <div className="vehicle-card loading">
        <h3>{vehicleId}</h3>
        <p>Loading...</p>
      </div>
    );
  }

  const getDangerLevel = (value, min, max) => {
    if (value < min || value > max) return "danger";
    if (Math.abs(value - ((min + max) / 2)) > (max - min) / 4) return "warning";
    return "normal";
  };

  const getSpeedStatus = (speed) => {
    if (speed === 0) return "idle";
    if (speed < 50) return "slow";
    if (speed < 100) return "moderate";
    return "fast";
  };

  return (
    <div className="vehicle-card">
      <div className="vehicle-header">
        <h3>{vehicleId}</h3>
        <span className={`speed-badge ${getSpeedStatus(data.speed)}`}>
          {data.speed} km/h
        </span>
      </div>

      <div className="metrics-grid">
        <div className="metric">
          <label>Location</label>
          <div className="metric-value">
            <small>
              {data.location.latitude.toFixed(2)}°, {data.location.longitude.toFixed(2)}°
            </small>
          </div>
        </div>

        <div className="metric">
          <label>Altitude</label>
          <div className="metric-value">{data.location.altitude.toFixed(0)} m</div>
        </div>

        <div className="metric">
          <label>Acceleration</label>
          <div className="metric-value">{data.acceleration.toFixed(2)} m/s²</div>
        </div>

        <div className="metric">
          <label>Engine Temp</label>
          <div className={`metric-value ${getDangerLevel(data.engine_temperature, 70, 110)}`}>
            {data.engine_temperature.toFixed(1)}°C
          </div>
        </div>

        <div className="metric">
          <label>RPM</label>
          <div className="metric-value">{data.rpm}</div>
        </div>

        <div className="metric">
          <label>Fuel Level</label>
          <div className={`metric-value ${getDangerLevel(data.fuel_level, 10, 100)}`}>
            {data.fuel_level.toFixed(1)}%
          </div>
        </div>

        <div className="metric">
          <label>Odometer</label>
          <div className="metric-value">{data.odometer.toFixed(0)} km</div>
        </div>

        <div className="metric">
          <label>Battery</label>
          <div className={`metric-value ${getDangerLevel(data.battery_voltage, 12, 14.5)}`}>
            {data.battery_voltage.toFixed(2)} V
          </div>
        </div>

        <div className="metric">
          <label>Brake Pressure</label>
          <div className="metric-value">{data.brake_pressure.toFixed(1)} bar</div>
        </div>

        <div className="metric">
          <label>Steering Angle</label>
          <div className="metric-value">{data.steering_angle.toFixed(1)}°</div>
        </div>

        <div className="metric">
          <label>Ambient Temp</label>
          <div className="metric-value">{data.ambient_temperature.toFixed(1)}°C</div>
        </div>

        <div className="metric">
          <label>Updated</label>
          <div className="metric-value">
            <small>{new Date(data.timestamp).toLocaleTimeString()}</small>
          </div>
        </div>
      </div>

      <div className="tire-panel">
        <label>Tire Pressure (PSI)</label>
        <div className="tire-grid">
          <div className={`tire ${getDangerLevel(data.tire_pressure_fl, 30, 35)}`}>
            <span>FL</span>
            <strong>{data.tire_pressure_fl.toFixed(1)}</strong>
          </div>
          <div className={`tire ${getDangerLevel(data.tire_pressure_fr, 30, 35)}`}>
            <span>FR</span>
            <strong>{data.tire_pressure_fr.toFixed(1)}</strong>
          </div>
          <div className={`tire ${getDangerLevel(data.tire_pressure_bl, 30, 35)}`}>
            <span>BL</span>
            <strong>{data.tire_pressure_bl.toFixed(1)}</strong>
          </div>
          <div className={`tire ${getDangerLevel(data.tire_pressure_br, 30, 35)}`}>
            <span>BR</span>
            <strong>{data.tire_pressure_br.toFixed(1)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleMetrics;
