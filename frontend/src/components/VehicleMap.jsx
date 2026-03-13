import React, { useState, useCallback } from "react";
import "./VehicleMap.css";

const VehicleMap = ({ vehicles }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Simple map projection (NOT production-ready, just for visualization)
  const projectCoordinates = (lat, lng, width, height) => {
    const padding = 20;
    const mapWidth = width - 2 * padding;
    const mapHeight = height - 2 * padding;

    // Normalize coordinates to map bounds
    const x = padding + ((lng + 180) / 360) * mapWidth;
    const y = padding + ((90 - lat) / 180) * mapHeight;

    return { x: Math.max(padding, Math.min(x, width - padding)), y: Math.max(padding, Math.min(y, height - padding)) };
  };

  const vehicleList = Object.entries(vehicles).filter(([_, data]) => data !== null);

  const handleVehicleClick = useCallback((vehicleId) => {
    setSelectedVehicle(selectedVehicle === vehicleId ? null : vehicleId);
  }, [selectedVehicle]);

  return (
    <div className="map-wrapper">
      <div className="map-canvas">
        {vehicleList.length > 0 ? (
          <>
            <svg className="map-svg" width="100%" height="100%">
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#eee" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Vehicle markers */}
              {vehicleList.map(([vehicleId, data]) => {
                if (!data || !data.location) return null;
                const { x, y } = projectCoordinates(
                  data.location.latitude,
                  data.location.longitude,
                  document.querySelector(".map-svg")?.clientWidth || 500,
                  document.querySelector(".map-svg")?.clientHeight || 400
                );

                return (
                  <g key={vehicleId} onClick={() => handleVehicleClick(vehicleId)} style={{ cursor: "pointer" }}>
                    <circle cx={x} cy={y} r="8" fill={selectedVehicle === vehicleId ? "#2196f3" : "#ff9800"} opacity="0.8" />
                    <circle cx={x} cy={y} r="12" fill="none" stroke={selectedVehicle === vehicleId ? "#2196f3" : "#ff9800"} strokeWidth="2" opacity="0.4" />
                    <text x={x + 15} y={y} fontSize="12" fill="#333" pointerEvents="none">
                      {vehicleId}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Vehicle list */}
            <div className="vehicle-list">
              <h4>Vehicles ({vehicleList.length})</h4>
              <ul>
                {vehicleList.map(([vehicleId, data]) => (
                  <li
                    key={vehicleId}
                    className={`vehicle-item ${selectedVehicle === vehicleId ? "selected" : ""}`}
                    onClick={() => handleVehicleClick(vehicleId)}
                  >
                    <span className="vehicle-name">{vehicleId}</span>
                    <span className="vehicle-speed">{data.speed?.toFixed(0)}km/h</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="no-vehicles">No vehicles active</div>
        )}
      </div>

      {selectedVehicle && vehicles[selectedVehicle] && (
        <div className="vehicle-detail-panel">
          <h4>{selectedVehicle}</h4>
          <div className="detail-row">
            <span>Location:</span>
            <span>
              {vehicles[selectedVehicle].location?.latitude?.toFixed(2)}°,{" "}
              {vehicles[selectedVehicle].location?.longitude?.toFixed(2)}°
            </span>
          </div>
          <div className="detail-row">
            <span>Speed:</span>
            <span>{vehicles[selectedVehicle].speed?.toFixed(1)} km/h</span>
          </div>
          <div className="detail-row">
            <span>Heading:</span>
            <span>{vehicles[selectedVehicle].steering_angle?.toFixed(1)}°</span>
          </div>
          <div className="detail-row">
            <span>Altitude:</span>
            <span>{vehicles[selectedVehicle].location?.altitude?.toFixed(0)} m</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleMap;
