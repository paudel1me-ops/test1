import logging
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from contextlib import asynccontextmanager

from .models import VehicleTelemetry
from .telemetry_generator import TelemetryGenerator
from .kafka_producer import TelemetryKafkaProducer
from .websocket_manager import ConnectionManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global instances
telemetry_generator: TelemetryGenerator = None
kafka_producer: TelemetryKafkaProducer = None
connection_manager = ConnectionManager()
telemetry_task = None


async def start_telemetry_stream():
    """Background task to continuously generate and stream telemetry data"""
    global telemetry_task
    try:
        while True:
            try:
                # Generate telemetry for all vehicles
                telemetry_list = telemetry_generator.generate_batch()

                for telemetry in telemetry_list:
                    # Send to Kafka
                    kafka_producer.send_telemetry(telemetry)

                    # Broadcast via WebSocket
                    telemetry_dict = telemetry.dict()
                    telemetry_dict["timestamp"] = telemetry.timestamp.isoformat()
                    await connection_manager.broadcast_telemetry("telemetry", telemetry_dict)

                # Wait before next batch
                await asyncio.sleep(2)

            except Exception as e:
                logger.error(f"Error in telemetry stream: {e}")
                await asyncio.sleep(5)
    except asyncio.CancelledError:
        logger.info("Telemetry stream task cancelled")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global telemetry_generator, kafka_producer, telemetry_task
    
    logger.info("Starting up application...")
    
    # Initialize telemetry generator
    telemetry_generator = TelemetryGenerator(num_vehicles=5)
    logger.info(f"Telemetry generator initialized with {len(telemetry_generator.get_vehicle_ids())} vehicles")
    
    # Initialize Kafka producer
    try:
        kafka_producer = TelemetryKafkaProducer(
            bootstrap_servers="kafka:9092",
            topic="vehicle-telemetry"
        )
        logger.info("Kafka producer initialized")
    except Exception as e:
        logger.warning(f"Kafka not available: {e}. Continuing without Kafka...")
        kafka_producer = None
    
    # Start telemetry generation task
    telemetry_task = asyncio.create_task(start_telemetry_stream())
    logger.info("Telemetry stream task started")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    if telemetry_task:
        telemetry_task.cancel()
        try:
            await telemetry_task
        except asyncio.CancelledError:
            pass
    
    if kafka_producer:
        kafka_producer.close()


app = FastAPI(
    title="Vehicle Telemetry API",
    description="Real-time vehicle telemetry streaming API",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Vehicle Telemetry API is running"}


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "generator_initialized": telemetry_generator is not None,
        "kafka_connected": kafka_producer is not None,
        "active_websocket_connections": connection_manager.get_active_connections_count("telemetry"),
    }


@app.get("/vehicles")
async def get_vehicles():
    """Get list of all vehicles"""
    if not telemetry_generator:
        raise HTTPException(status_code=503, detail="Telemetry generator not initialized")
    
    return {
        "vehicles": telemetry_generator.get_vehicle_ids(),
        "count": len(telemetry_generator.get_vehicle_ids()),
    }


@app.get("/telemetry/{vehicle_id}")
async def get_vehicle_telemetry(vehicle_id: str):
    """Get current telemetry for a specific vehicle"""
    if not telemetry_generator:
        raise HTTPException(status_code=503, detail="Telemetry generator not initialized")
    
    try:
        telemetry = telemetry_generator.generate_telemetry(vehicle_id)
        return {
            "vehicle_id": telemetry.vehicle_id,
            "data": telemetry.dict(),
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time telemetry streaming"""
    await connection_manager.connect(websocket, "telemetry")
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            logger.debug(f"Received message: {data}")
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket, "telemetry")
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        connection_manager.disconnect(websocket, "telemetry")


@app.get("/stats")
async def get_stats():
    """Get application statistics"""
    if not telemetry_generator:
        raise HTTPException(status_code=503, detail="Telemetry generator not initialized")
    
    return {
        "total_vehicles": len(telemetry_generator.get_vehicle_ids()),
        "active_websocket_clients": connection_manager.get_active_connections_count("telemetry"),
        "kafka_producer_status": "connected" if kafka_producer else "disconnected",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
