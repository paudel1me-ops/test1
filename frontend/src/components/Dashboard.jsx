import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleRealtime } from "../store/actions";
import VehicleMetrics from "./VehicleMetrics";
import VehicleMap from "./VehicleMap";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.vehicles);
  const websocketStatus = useSelector((state) => state.websocketStatus);
  const realtimeEnabled = useSelector((state) => state.realtimeEnabled);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch("/stats")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Error fetching stats:", err));
    };

    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const vehicleList = Object.keys(vehicles);
  const activeVehicles = vehicleList.filter((vid) => vehicles[vid] !== null);

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "#4caf50";
      case "connecting":
        return "#ff9800";
      case "disconnected":
        return "#f44336";
      default:
        return "#999";
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🚗 Vehicle Telemetry Dashboard</h1>
        <div className="header-controls">
          <button
            className={`toggle-btn ${realtimeEnabled ? "active" : ""}`}
            onClick={() => dispatch(toggleRealtime())}
          >
            {realtimeEnabled ? "🔴 Live" : "⚪ Paused"}
          </button>
          <div
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(websocketStatus) }}
            title={`WebSocket: ${websocketStatus}`}
          />
        </div>
      </header>

      <div className="stats-panel">
        {stats && (
          <div className="stat-item">
            <span className="stat-label">Total Vehicles:</span>
            <span className="stat-value">{stats.total_vehicles}</span>
          </div>
        )}
        {stats && (
          <div className="stat-item">
            <span className="stat-label">Active Clients:</span>
            <span className="stat-value">{stats.active_websocket_clients}</span>
          </div>
        )}
        {stats && (
          <div className="stat-item">
            <span className="stat-label">Kafka Status:</span>
            <span className="stat-value">{stats.kafka_producer_status}</span>
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="map-container">
          <h2>Vehicle Locations</h2>
          <VehicleMap vehicles={vehicles} />
        </div>

        <div className="metrics-container">
          <h2>Vehicle Metrics</h2>
          {activeVehicles.length > 0 ? (
            <div className="vehicles-grid">
              {activeVehicles.map((vehicleId) => (
                <VehicleMetrics
                  key={vehicleId}
                  vehicleId={vehicleId}
                  data={vehicles[vehicleId]}
                />
              ))}
            </div>
          ) : (
            <div className="no-data">Waiting for vehicle data...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
