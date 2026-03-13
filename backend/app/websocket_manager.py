import logging
from typing import Set, Dict
from fastapi import WebSocket
import json

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections for real-time telemetry streaming"""

    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel: str):
        """Add a new WebSocket connection to a channel"""
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = set()
        self.active_connections[channel].add(websocket)
        logger.info(f"Client connected to channel: {channel}")

    def disconnect(self, websocket: WebSocket, channel: str):
        """Remove a WebSocket connection from a channel"""
        if channel in self.active_connections:
            self.active_connections[channel].discard(websocket)
            if not self.active_connections[channel]:
                del self.active_connections[channel]
        logger.info(f"Client disconnected from channel: {channel}")

    async def broadcast(self, channel: str, message: dict):
        """Broadcast a message to all clients in a channel"""
        if channel not in self.active_connections:
            return

        disconnected_clients = []
        for connection in self.active_connections[channel]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error sending message: {e}")
                disconnected_clients.append(connection)

        # Clean up disconnected clients
        for connection in disconnected_clients:
            self.disconnect(connection, channel)

    async def broadcast_telemetry(self, channel: str, telemetry: dict):
        """Broadcast telemetry data to all clients"""
        message = {
            "type": "telemetry",
            "data": telemetry,
        }
        await self.broadcast(channel, message)

    async def broadcast_status(self, channel: str, status: dict):
        """Broadcast status update to all clients"""
        message = {
            "type": "status",
            "data": status,
        }
        await self.broadcast(channel, message)

    def get_active_connections_count(self, channel: str) -> int:
        """Get number of active connections on a channel"""
        return len(self.active_connections.get(channel, set()))
