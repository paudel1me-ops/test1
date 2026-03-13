# Quick Reference Guide

## System Architecture

```
Telemetry Generator (5 vehicles)
         ↓
    Kafka Topic
    ↙        ↘
Backend     (Stored Data)
(WebSocket)
    ↓
React Dashboard
```

## Common Commands

### Docker Compose
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build
```

### Backend (Local)
```bash
# Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run
uvicorn app.main:app --reload

# Test API
curl http://localhost:8000/health
curl http://localhost:8000/vehicles
curl http://localhost:8000/telemetry/VEHICLE_000
```

### Frontend (Local)
```bash
# Setup
cd frontend
npm install

# Development
npm start

# Build for production
npm run build

# Test production build locally
npm run build && serve -s build -l 3000
```

### Kafka
```bash
# View messages in topic
docker-compose exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic vehicle-telemetry \
  --from-beginning \
  --max-messages 10

# List topics
docker-compose exec kafka kafka-topics \
  --bootstrap-server kafka:9092 \
  --list

# Describe topic
docker-compose exec kafka kafka-topics \
  --bootstrap-server kafka:9092 \
  --describe \
  --topic vehicle-telemetry
```

## API Endpoints

### Health & Stats
- `GET http://localhost:8000/` - Root
- `GET http://localhost:8000/health` - Health check
- `GET http://localhost:8000/stats` - Statistics

### Vehicles
- `GET http://localhost:8000/vehicles` - List all vehicles
- `GET http://localhost:8000/telemetry/{vehicle_id}` - Get telemetry for vehicle

### WebSocket
- `WS http://localhost:8000/ws/telemetry` - Real-time stream

## Environment Variables

### Backend
| Variable | Default | Description |
|----------|---------|-------------|
| KAFKA_BOOTSTRAP_SERVERS | kafka:9092 | Kafka address |
| KAFKA_TOPIC | vehicle-telemetry | Kafka topic name |
| LOG_LEVEL | INFO | Logging level |

### Frontend
| Variable | Default | Description |
|----------|---------|-------------|
| REACT_APP_API_URL | http://localhost:8000 | Backend API URL |
| REACT_APP_WS_URL | ws://localhost:8000 | WebSocket URL |

## Telemetry Data Fields

```json
{
  "vehicle_id": "string",           // Unique vehicle identifier
  "timestamp": "ISO8601 datetime",  // Data timestamp
  "location": {
    "latitude": "float",            // GPS latitude
    "longitude": "float",           // GPS longitude
    "altitude": "float"             // Altitude in meters
  },
  "speed": "float (km/h)",          // Current speed
  "acceleration": "float (m/s²)",   // Current acceleration
  "fuel_level": "float (%)",        // Fuel percentage
  "engine_temperature": "float (°C)",
  "rpm": "int",                     // Engine RPM
  "odometer": "float (km)",         // Total distance traveled
  "battery_voltage": "float (V)",   // Battery voltage
  "tire_pressure_*": "float (psi)", // Tire pressures (FL, FR, BL, BR)
  "brake_pressure": "float (bar)",  // Brake pressure
  "steering_angle": "float (°)",    // Steering angle
  "ambient_temperature": "float (°C)",
  "status": "string"                // Vehicle status
}
```

## Common Issues & Solutions

### WebSocket Connection Failed
1. Check backend is running: `curl http://localhost:8000/health`
2. Check frontend proxy in `frontend/package.json`
3. Verify ports: 3000 (frontend), 8000 (backend)
4. Check browser console for errors

### Kafka Not Found
1. Verify Kafka container: `docker-compose ps`
2. Check Kafka logs: `docker-compose logs kafka`
3. Wait for Kafka to start (health check takes ~30 seconds)
4. Verify port: `docker-compose ps` shows 9092

### Frontend Not Loading Data
1. Check console: Open browser DevTools (F12)
2. Check WebSocket connection: Network tab
3. Verify backend `/health` responds
4. Check CORS settings in backend

### Port Already in Use
```bash
# Find process using port
lsof -i :3000    # Frontend
lsof -i :8000    # Backend
lsof -i :9092    # Kafka

# Kill process (if needed)
kill -9 <PID>
```

## Performance Tips

- **Update Frequency**: Backend generates data every 2 seconds
- **Dashboard**: Updates match telemetry frequency
- **History**: Dashboard keeps last 50 entries per vehicle
- **Kafka**: Messages persist indefinitely (configurable)

## File Structure Quick Reference

```
project/
├── backend/           # Python FastAPI
│   ├── app/          
│   │   ├── main.py   # FastAPI app
│   │   ├── models.py # Data models
│   │   ├── telemetry_generator.py
│   │   ├── kafka_producer.py
│   │   └── websocket_manager.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/          # React + Redux
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── store/      # Redux files
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml # Docker orchestration
├── startup.sh         # Linux/Mac startup
├── startup.bat        # Windows startup
└── README.md
```

## Development Workflow

1. **Make Backend Changes**
   ```bash
   # Changes auto-reload with --reload flag
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Make Frontend Changes**
   ```bash
   # React hot reload works automatically
   cd frontend
   npm start
   ```

3. **Test Changes**
   - Navigate to http://localhost:3000
   - Open browser DevTools (F12)
   - Check Network, Console, and Redux DevTools tabs

4. **Verify Data Flow**
   - Check health endpoint
   - Verify WebSocket in Network tab
   - Check Kafka messages

## Docker Debugging

```bash
# SSH into container
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec kafka bash

# View container logs with timestamps
docker-compose logs --timestamps backend

# Follow logs for specific service
docker-compose logs -f --tail=50 backend

# View resource usage
docker stats

# Restart all services
docker-compose restart
```

## Production Checklist

- [ ] Update REACT_APP_API_URL for production
- [ ] Configure Kafka for persistence
- [ ] Set LOG_LEVEL=WARNING
- [ ] Enable HTTPS/WSS
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Enable authentication
- [ ] Configure auto-scaling
- [ ] Set up alerting
- [ ] Plan backup strategy

---

For more information, see the main [README.md](README.md)
