import json
import logging
from typing import Optional
from kafka import KafkaProducer
from kafka.errors import KafkaError
from .models import VehicleTelemetry

logger = logging.getLogger(__name__)


class TelemetryKafkaProducer:
    """Kafka producer for vehicle telemetry data"""

    def __init__(
        self,
        bootstrap_servers: str = "localhost:9092",
        topic: str = "vehicle-telemetry",
    ):
        self.bootstrap_servers = bootstrap_servers
        self.topic = topic
        self.producer: Optional[KafkaProducer] = None
        self._initialize()

    def _initialize(self):
        """Initialize Kafka producer"""
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers.split(","),
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                acks="all",
                retries=3,
                max_in_flight_requests_per_connection=1,
            )
            logger.info(f"Kafka producer initialized for topic: {self.topic}")
        except Exception as e:
            logger.error(f"Failed to initialize Kafka producer: {e}")
            raise

    def send_telemetry(self, telemetry: VehicleTelemetry, key: Optional[str] = None):
        """Send telemetry data to Kafka"""
        if not self.producer:
            logger.warning("Producer not initialized")
            return

        try:
            message_key = key or telemetry.vehicle_id
            telemetry_dict = telemetry.dict()
            # Convert datetime to string
            telemetry_dict["timestamp"] = telemetry.timestamp.isoformat()
            
            future = self.producer.send(
                self.topic,
                value=telemetry_dict,
                key=message_key.encode("utf-8"),
            )
            # Wait for the send to complete
            future.get(timeout=10)
            logger.debug(f"Sent telemetry for {message_key}")
        except KafkaError as e:
            logger.error(f"Failed to send telemetry to Kafka: {e}")
        except Exception as e:
            logger.error(f"Unexpected error sending telemetry: {e}")

    def send_batch(self, telemetries: list):
        """Send batch of telemetry data"""
        for telemetry in telemetries:
            self.send_telemetry(telemetry)

    def flush(self):
        """Flush any pending messages"""
        if self.producer:
            self.producer.flush()

    def close(self):
        """Close the producer"""
        if self.producer:
            self.producer.close()
            logger.info("Kafka producer closed")
