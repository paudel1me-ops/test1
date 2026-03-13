# Vehicle Telemetry to Kafka to React Dashboard

A comprehensive end-to-end project demonstrating real-time vehicle telemetry data generation, Kafka streaming, and a live dashboard built with React and Redux.

## 🎯 Project Overview

This project creates a complete telemetry pipeline:
1. **Telemetry Generator** - Simulates 5 vehicles generating realistic telemetry data
2. **Kafka Producer** - Publishes all telemetry data to Kafka topics
3. **WebSocket Server** - Streams real-time data to connected clients
4. **React Dashboard** - Modern UI with Redux state management and live metrics

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Vehicle Telemetry System                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐        ┌──────────────┐                   │
│  │  Telemetry       │        │   Kafka      │                   │
│  │  Generator       │───────▶│  (Storage &  │                   │
│  │  (5 Vehicles)    │        │  Streaming)  │                   │
│  └──────────────────┘        └──────────────┘                   │
│           │                         │                            │
│           │                         └─────────────┐              │
│           │                                       │              │
│           └───────────────┬──────────────────────┼───────┐      │
│                           │                      │       │      │
│                      ┌────▼──────────────────────▼──┐    │      │
│                      │   FastAPI + WebSocket        │    │      │
│                      │   - Health Check             │    │      │
│                      │   - REST API                 │    │      │
│                      │   - Real-time Streaming      │    │      │
│                      └────┬───────────────────────────┘    │      │
│                           │                                │      │
│                           │ WebSocket Connection           │      │
│                           │                                │      │
│                      ┌────▼───────────────────────────┐    │      │
│                      │   React Dashboard             │    │      │
│                      │   - Redux Store               │    │      │
│                      │   - Vehicle Metrics           │    │      │
│                      │   - Real-time Map             │    │      │
│                      │   - Live Updates              │    │      │
│                      └──────────────────────────────┘    │      │
│                                                           │      │
│                    Kafka Consumer ◀────────────────────────      │
│                    (Future feature)                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Components

### Backend (Python FastAPI)
- **Models** - Pydantic data models for telemetry and vehicle status
- **Telemetry Generator** - Simulates realistic vehicle movement and metrics
- **Kafka Producer** - Publishes telemetry data to Kafka topics
- **WebSocket Manager** - Manages multiple WebSocket connections
- **REST API** - Endpoints for health checks, vehicle list, and telemetry queries

### Frontend (React + Redux)
- **Redux Store** - Centralized state management
- **WebSocket Manager** - Handles real-time data synchronization
- **Dashboard** - Main view with live metrics and map
- **Vehicle Metrics** - Individual vehicle metric cards
- **Vehicle Map** - Visual representation of vehicle locations
- **Responsive Design** - Mobile and desktop optimized

### Infrastructure
- **Kafka** - Distributed streaming platform
- **Zookeeper** - Kafka coordination
- **Docker Compose** - Orchestrates all services

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

Access the dashboard at: `http://localhost:3000`
Backend API at: `http://localhost:8000`
Kafka at: `localhost:9092`

### Local Development (Without Docker)

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 Features

### Real-time Telemetry Data
- **Vehicle Position** - Lat/Long coordinates
- **Speed & Acceleration** - Current and derived metrics
- **Engine Metrics** - RPM, temperature, fuel level
- **Vehicle Status** - Tire pressure, battery voltage, brake pressure
- **Environmental Data** - Ambient temperature, altitude

### Dashboard Features
- **Live Metrics Cards** - Individual vehicle status with color-coded warnings
- **Interactive Map** - Visual representation of vehicle locations
- **WebSocket Connection** - Real-time data synchronization
- **Redux State Management** - Efficient state updates
- **Responsive Design** - Works on desktop and mobile
- **Connection Status** - Visual indicator of WebSocket connection state
- **Statistics Panel** - Active vehicles, clients, and system status

### Data Streaming
- **Kafka Integration** - All telemetry data is published to Kafka
- **WebSocket Broadcasting** - Real-time data to connected clients
- **2-second Intervals** - Data generation and update frequency
- **Vehicle State Persistence** - Maintains vehicle trajectories between updates

## 🔌 API Endpoints

### Health & Status
- `GET /` - Root endpoint
- `GET /health` - Health check with system status
- `GET /stats` - Application statistics

### Vehicles
- `GET /vehicles` - List all vehicles
- `GET /telemetry/{vehicle_id}` - Get current telemetry for a vehicle

### WebSocket
- `WS /ws/telemetry` - Real-time telemetry stream

## 📡 WebSocket Message Format

### Telemetry Message
```json
{
  "type": "telemetry",
  "data": {
    "vehicle_id": "VEHICLE_000",
    "timestamp": "2024-03-12T10:30:45.123456",
    "location": {
      "latitude": 45.12,
      "longitude": 120.34,
      "altitude": 500.0
    },
    "speed": 65.5,
    "acceleration": 0.5,
    "fuel_level": 75.0,
    "engine_temperature": 95.0,
    "rpm": 6500,
    "odometer": 45123.5,
    "battery_voltage": 13.2,
    "tire_pressure_fl": 32.5,
    "tire_pressure_fr": 32.5,
    "tire_pressure_bl": 32.5,
    "tire_pressure_br": 32.5,
    "brake_pressure": 0.0,
    "steering_angle": 5.0,
    "ambient_temperature": 22.5,
    "status": "active"
  }
}
```

## 🛠️ Configuration

### Environment Variables

#### Backend (.env)
```
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
KAFKA_TOPIC=vehicle-telemetry
LOG_LEVEL=INFO
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## 📈 Telemetry Data

Each vehicle generates:
- **Position Data** - Realistic movement with acceleration/deceleration
- **Engine Data** - RPM, temperature, fuel consumption simulation
- **Tire Data** - Independent pressure for each tire
- **Electrical Data** - Battery voltage, system health
- **Environmental Data** - Ambient conditions
- **Timestamps** - ISO format UTC timestamps

## 🔄 Data Flow

1. **Generation** - TelemetryGenerator creates realistic vehicle data
2. **Publishing** - Kafka producer sends data to Kafka topic
3. **Broadcasting** - WebSocket manager broadcasts to all connected clients
4. **Storage** - Kafka persists the data for replay/analysis
5. **Display** - Redux updates state, React re-renders dashboard
6. **Updates** - Browser receives updates every 2 seconds

## 🧪 Testing the System

### Check Backend Health
```bash
curl http://localhost:8000/health
```

### Get Vehicle List
```bash
curl http://localhost:8000/vehicles
```

### Get Current Telemetry
```bash
curl http://localhost:8000/telemetry/VEHICLE_000
```

### Monitor Kafka Topic
```bash
# Inside the kafka container
docker-compose exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic vehicle-telemetry \
  --from-beginning
```

## 📚 Future Enhancements

- [ ] Kafka consumer for data analytics
- [ ] Time-series database (InfluxDB) integration
- [ ] Advanced charting with historical data
- [ ] Vehicle alerts and anomaly detection
- [ ] Multi-user sessions with authentication
- [ ] Data export functionality
- [ ] Custom telemetry simulation profiles
- [ ] Machine learning for predictive maintenance

## 🐳 Docker Commands

### View Logs
```bash
docker-compose logs -f             # All services
docker-compose logs -f backend     # Backend only
docker-compose logs -f frontend    # Frontend only
```

### Stop All Services
```bash
docker-compose down
```

### Remove All Volumes
```bash
docker-compose down -v
```

### Rebuild Containers
```bash
docker-compose up -d --build
```

## 🔧 Troubleshooting

### WebSocket Connection Issues
- Ensure backend is running: `curl http://localhost:8000/health`
- Check firewall settings
- Verify proxy settings in package.json

### Kafka Connection Issues
- Verify Kafka is running: `docker-compose ps`
- Check Kafka logs: `docker-compose logs kafka`
- Ensure Zookeeper is running first

### Frontend Not Loading
- Clear browser cache
- Check Node version: `node -v` (must be 18+)
- Verify npm installed packages: `npm ls`

### 404 API Errors
- Ensure backend is running on port 8000
- Check proxy settings in frontend package.json
- Verify API endpoints are correct

## 📝 Project Structure

```
telemetry-to-Kafka-to-React/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI application
│   │   ├── models.py             # Pydantic models
│   │   ├── telemetry_generator.py # Data generation
│   │   ├── kafka_producer.py     # Kafka integration
│   │   └── websocket_manager.py  # WebSocket handling
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── VehicleMetrics.jsx # Metric cards
│   │   │   ├── VehicleMap.jsx    # Map view
│   │   │   └── *.css              # Styling
│   │   ├── store/
│   │   │   ├── actions.js        # Redux actions
│   │   │   ├── reducers.js       # Redux reducers
│   │   │   └── store.js          # Store configuration
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or issues.

## 📞 Support

For issues or questions, please check:
1. The troubleshooting section above
2. Docker logs: `docker-compose logs`
3. Browser console for frontend errors
4. Backend logs for API issues

---

**Created:** March 2024
**Version:** 1.0.0
**Tech Stack:** Python FastAPI, React, Redux, Kafka, Docker
