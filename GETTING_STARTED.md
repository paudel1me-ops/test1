# Getting Started Guide

## 📋 Prerequisites

Choose one of these setups:

### Option 1: Docker (Recommended - Easiest)
- Docker Desktop or Docker Engine
- Docker Compose

**Install Docker:**
- Windows/Mac: Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Linux: `curl -fsSL https://get.docker.com | sh`

### Option 2: Local Development
- Python 3.11+
- Node.js 18+
- Kafka (optional - for testing without Docker)

---

## 🚀 Quick Start

### Option 1: Docker (Simplest)

```bash
# 1. Navigate to project directory
cd /workspaces/test1

# 2. Start all services
docker-compose up -d

# 3. Wait for services to start (30-60 seconds)
docker-compose ps

# 4. Open dashboard
# Visit http://localhost:3000 in your browser

# 5. View logs (if needed)
docker-compose logs -f backend
```

✅ **Done!** You should now see:
- Backend API running on `http://localhost:8000`
- Frontend dashboard on `http://localhost:3000`
- Kafka streaming in the background
- 5 simulated vehicles with real-time telemetry

---

### Option 2: Local Development

#### Terminal 1 - Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend (with auto-reload)
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

#### Terminal 2 - Frontend Setup
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start frontend
npm start
```

You should see:
```
Compiled successfully!

You can now view vehicle-telemetry-dashboard in the browser.
  Local:            http://localhost:3000
```

#### Terminal 3 - Kafka (Optional)
If you want to use real Kafka:
```bash
# Using Docker just for Kafka
docker run -d \
  --name kafka-test \
  -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 \
  confluentinc/cp-kafka:7.5.0

# Then update backend KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

---

## ✨ Features to Explore

### Dashboard
1. **Live Metrics** - Real-time vehicle data with color-coded alerts
2. **Vehicle Map** - Click on vehicles to see detailed info
3. **Status Indicator** - Green = connected, Orange = connecting, Red = disconnected
4. **Toggle Live/Pause** - Control data streaming

### Backend API
Test these endpoints:
```bash
# Health check
curl http://localhost:8000/health

# List vehicles
curl http://localhost:8000/vehicles

# Get vehicle telemetry
curl http://localhost:8000/telemetry/VEHICLE_000

# View statistics
curl http://localhost:8000/stats
```

### Kafka Inspection
```bash
# View Kafka messages
docker-compose exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic vehicle-telemetry \
  --from-beginning \
  --max-messages 5
```

---

## 🔧 Useful Commands

### Make Commands (Linux/Mac)
```bash
make help              # Show all available commands
make up                # Start all services
make down              # Stop all services
make logs              # View logs
make test              # Test API endpoints
make health            # Check system health
make kafka-console     # View Kafka messages
make clean             # Remove all containers
```

### Docker Compose Commands
```bash
# View all services
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart
docker-compose restart backend

# Stop and remove everything
docker-compose down

# Stop and remove with volumes
docker-compose down -v
```

---

## 📊 What's Running?

### Services
1. **Zookeeper** (Port 2181)
   - Kafka coordination service

2. **Kafka** (Port 9092)
   - Message broker, stores telemetry data
   - Topic: `vehicle-telemetry`

3. **Backend** (Port 8000)
   - FastAPI server
   - Generates simulated vehicle data
   - Publishes to Kafka
   - Streams via WebSocket
   - REST API endpoints

4. **Frontend** (Port 3000)
   - React dashboard
   - Redux state management
   - WebSocket client
   - Real-time visualization

---

## 🧪 Testing the System

### Test 1: Check Backend Health
```bash
curl http://localhost:8000/health
```
Should return:
```json
{
  "status": "healthy",
  "generator_initialized": true,
  "kafka_connected": true,
  "active_websocket_connections": 1
}
```

### Test 2: Get Vehicle Data
```bash
curl http://localhost:8000/vehicles | jq
```
Should return:
```json
{
  "vehicles": ["VEHICLE_000", "VEHICLE_001", "VEHICLE_002", "VEHICLE_003", "VEHICLE_004"],
  "count": 5
}
```

### Test 3: View Dashboard
Open browser to `http://localhost:3000`
- Should see 5 vehicle metric cards
- Should see vehicle locations on map
- Should see live updates every 2 seconds
- Green status indicator = connection OK

### Demo Scripts
Two small helper programs are included to exercise the backend from the shell. Before running them you need a couple of Python packages:

```bash
# install dependencies globally or in a virtualenv
pip install requests websocket-client
# alternatively use the supplied requirements file:
pip install -r demo_requirements.txt
```

Then run either mode:

```bash
# HTTP polling example (prints speeds & fuel levels)
python demo_client.py http

# WebSocket listener (prints a line for each incoming message)
python demo_client.py ws

# Simple shell loop (requires curl + jq)
./demo.sh
```

Each script will continuously print incoming telemetry so you can demo the API without opening a browser.

---

## 📡 Understanding the Data Flow

```
Generator → Kafka Topic → WebSocket → Redux Store → React Components
   ↓
   Updates every 2 seconds
```

1. **Telemetry Generator** creates realistic vehicle data
2. **Kafka Producer** sends it to Kafka topic
3. **WebSocket Manager** broadcasts to all clients
4. **Redux** stores the latest telemetry for each vehicle
5. **React Components** re-render with new data

---

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check Docker daemon
docker ps

# View logs
docker-compose logs

# Try rebuilding
docker-compose down -v
docker-compose up -d --build
```

### WebSocket Not Connecting
1. Check backend: `curl http://localhost:8000/health`
2. Check browser console (F12)
3. Check Network tab for WebSocket handshake
4. Verify proxy in `frontend/package.json`

### Port Already in Use
```bash
# macOS/Linux - Find process
lsof -i :3000  # Frontend
lsof -i :8000  # Backend

# Kill if needed
kill -9 <PID>

# Windows - Use Task Manager or:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Data Not Updating
1. Check browser console for errors
2. Verify WebSocket is connected (green indicator)
3. Check backend logs: `docker-compose logs backend`
4. Verify Kafka is running: `docker-compose ps`

---

## 📚 Project Structure

```
telemetry-to-Kafka-to-React/
├── backend/                    # Python FastAPI
│   ├── app/
│   │   ├── main.py            # FastAPI application
│   │   ├── models.py          # Data models
│   │   ├── telemetry_generator.py
│   │   ├── kafka_producer.py
│   │   └── websocket_manager.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   # React + Redux
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── store/             # Redux files
│   │   └── ...
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml         # Orchestration
├── Makefile                   # Commands
├── README.md                  # Full documentation
├── QUICK_REFERENCE.md         # Command reference
└── GETTING_STARTED.md         # This file
```

---

## 🔗 Useful Links

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **API ReDoc**: http://localhost:8000/redoc

---

## 📖 Next Steps

1. ✅ Get the system running (choose Docker or local)
2. ✅ Open dashboard at http://localhost:3000
3. ✅ Explore the features
4. ✅ Check the logs
5. ✅ Test the API endpoints
6. ✅ Read the full [README.md](README.md) for advanced usage
7. ✅ Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for all commands

---

## 💡 Tips

- **Data persists in Kafka** - You can replay messages later
- **WebSocket updates every 2 seconds** - Configurable in backend
- **History stored locally** - Dashboard keeps 50 updates per vehicle
- **Vehicles move realistically** - Based on speed and heading
- **Color-coded alerts** - Red=danger, Orange=warning, Green=normal

---

## 🆘 Need Help?

1. Check **QUICK_REFERENCE.md** for commands
2. Check **README.md** for detailed documentation
3. Run `docker-compose logs` for error messages
4. Check browser console (F12) for frontend errors
5. Visit http://localhost:8000/health for status

---

**You're all set! Enjoy your vehicle telemetry system! 🚗📊**

For the full documentation, see [README.md](README.md)
