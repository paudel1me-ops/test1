# 🚗 Vehicle Telemetry Dashboard - START HERE

## ⚡ Quick Start (2 Minutes)

### Using Docker (Easiest)
```bash
cd /workspaces/test1
docker-compose up -d
```

Then open your browser to: **http://localhost:3000**

That's it! You'll see:
- ✅ 5 simulated vehicles
- ✅ Real-time telemetry data
- ✅ Interactive map
- ✅ Live metrics updating every 2 seconds
- ✅ Kafka data streaming in background

### Without Docker (Local Development)
```bash
# Terminal 1: Backend
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm install && npm start
```

---

## 📊 What You Get

A complete end-to-end system with:

| Component | Technology | Status |
|-----------|-----------|--------|
| Data Generation | Python Telemetry Generator | ✅ Ready |
| Message Streaming | Apache Kafka | ✅ Ready |
| Backend API | FastAPI + WebSocket | ✅ Ready |
| Frontend Dashboard | React + Redux | ✅ Ready |
| Container Support | Docker + Compose | ✅ Ready |

---

## 🎯 Dashboard Features

### Real-time Metrics
- Speed, Acceleration, RPM
- Fuel Level, Engine Temperature
- Tire Pressure (all 4 wheels)
- Battery Voltage, Brake Pressure
- Current Location & Altitude
- Last Update Timestamp

### Interactive Controls
- 🟢 **Live/Pause Toggle** - Control data flow
- 📍 **Vehicle Map** - Click to select vehicles
- 📊 **Metric Cards** - Color-coded status (red=danger, orange=warning)
- 📈 **Statistics** - Active vehicles, connections, Kafka status

### Visual Indicators
- Connection status (green circle = connected)
- Color-coded alerts for metrics
- Real-time position tracking
- Smooth animations

---

## 📁 Project Contents

### Quick Reference Files
- **START_HERE.md** (this file) - Quick start
- **GETTING_STARTED.md** - Detailed setup guide
- **QUICK_REFERENCE.md** - Command reference
- **README.md** - Full documentation

### Source Code (1500+ lines)
- **Backend** - 6 Python modules, FastAPI app, Kafka integration
- **Frontend** - 4 React components, Redux store, CSS styling
- **Docker** - Compose file with Kafka, Zookeeper, services
- **Config** - Environment templates, startup scripts

---

## 🔌 API Endpoints

Test these in your browser or terminal:

```bash
# Health check
curl http://localhost:8000/health

# List vehicles  
curl http://localhost:8000/vehicles

# Get telemetry for a vehicle
curl http://localhost:8000/telemetry/VEHICLE_000

# System statistics
curl http://localhost:8000/stats

# WebSocket (automatic in dashboard)
ws://localhost:8000/ws/telemetry
```

---

## 🛠️ Useful Commands

```bash
# Docker
docker-compose up -d           # Start all
docker-compose down            # Stop all
docker-compose logs -f         # View logs
docker-compose ps              # Show status

# Make (handy shortcuts)
make up                        # Start
make down                      # Stop
make logs                      # Logs
make health                    # Health check
make test                      # Test API
make help                      # Show all

# Backend
cd backend && uvicorn app.main:app --reload

# Frontend
cd frontend && npm start

# Kafka
docker-compose exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic vehicle-telemetry \
  --max-messages 5
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│   Telemetry Generator (5 vehicles)      │
│   Every 2 seconds:                      │
│   - Generate location                   │
│   - Update speed/RPM                    │
│   - Update metrics                      │
└────────────┬────────────────────────────┘
             │
             ├──────────────────────────┐
             ▼                          ▼
        ┌─────────┐             ┌──────────────┐
        │  Kafka  │             │  WebSocket   │
        │ (Store) │             │  (Live Data) │
        └─────────┘             └──────┬───────┘
                                       │
                              ┌────────▼────────┐
                              │  React Dashboard│
                              │  - Redux Store  │
                              │  - Components   │
                              │  - Real-time UI │
                              └─────────────────┘
```

---

## ✨ Features Included

### Backend
- ✅ Telemetry data generation (realistic vehicle movement)
- ✅ Kafka producer (publishes all data)
- ✅ WebSocket server (real-time streaming)
- ✅ REST API (health, stats, telemetry endpoints)
- ✅ Error handling & logging
- ✅ Docker containerization

### Frontend
- ✅ Redux state management
- ✅ WebSocket client connection
- ✅ Live metric display cards
- ✅ Interactive vehicle map
- ✅ Real-time updates (2-second intervals)
- ✅ Color-coded alerts
- ✅ Responsive design (mobile & desktop)
- ✅ Connection status indicator
- ✅ Live/Pause toggle

### Data
- ✅ 15+ telemetry fields per vehicle
- ✅ 5 simulated vehicles
- ✅ Realistic movement patterns
- ✅ Independent tire pressure readings
- ✅ Complete vehicle status

---

## 🚀 Next Steps

1. **Start the project** ← Do this now!
   ```bash
   docker-compose up -d
   ```

2. **Open dashboard**
   ```
   http://localhost:3000
   ```

3. **Watch it work**
   - See vehicles appear on the map
   - Watch metrics update in real-time
   - Toggle Live/Pause mode
   - Click vehicles to see details

4. **Test the API**
   ```bash
   curl http://localhost:8000/vehicles
   ```

5. **Monitor Kafka** (optional)
   ```bash
   docker-compose exec kafka kafka-console-consumer \
     --bootstrap-server kafka:9092 \
     --topic vehicle-telemetry \
     --max-messages 5
   ```

6. **Explore the code**
   - Check backend/app/main.py for FastAPI setup
   - Check frontend/src/App.jsx for React setup
   - Read README.md for all details

---

## 🎯 What Makes This Special

| Feature | Benefit |
|---------|---------|
| **Kubernetes-Ready** | Docker images for easy deployment |
| **Production Scale** | Kafka for high-volume data |
| **Real-time** | WebSocket for instant updates |
| **Modern UI** | React + Redux professional dashboard |
| **Well-Documented** | Comprehensive guides & comments |
| **Easy Setup** | One command to start everything |
| **Extensible** | Easy to add more features |
| **Educational** | Great for learning the stack |

---

## 📞 Help & Troubleshooting

### Problem | Solution
---|---
Services won't start | Run: `docker-compose down -v && docker-compose up -d`
WebSocket not connecting | Check: `curl http://localhost:8000/health`
Port already in use | Check: `docker-compose ps` and `docker-compose down`
Can't see vehicles | Wait 10 seconds for data to generate
Frontend shows errors | Check browser console (F12)

For more help, see:
- **GETTING_STARTED.md** - Detailed setup
- **QUICK_REFERENCE.md** - Commands & troubleshooting
- **README.md** - Complete documentation

---

## 🎉 You're All Set!

Everything is ready to use. This is a complete, production-grade vehicle telemetry system with:

- 1500+ lines of code
- 5 services (Zookeeper, Kafka, Backend, Frontend, Network)
- Professional dashboard
- Real-time data streaming
- Full documentation
- Docker deployment

### Get Started Now:
```bash
cd /workspaces/test1
docker-compose up -d
# Open http://localhost:3000
```

---

**Welcome to your Vehicle Telemetry System! 🚗📊**

*For detailed information, see the documentation files.*
