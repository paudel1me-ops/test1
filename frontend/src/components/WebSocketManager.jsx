import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTelemetryData,
  setWebsocketStatus,
  setVehicles,
} from "../store/actions";
import Dashboard from "./Dashboard";
const fetchTelemetrySnapshot = async (dispatch) => {
  try {
    const vehiclesResponse = await fetch("/vehicles");
    const vehiclesPayload = await vehiclesResponse.json();
    const vehicleIds = Array.isArray(vehiclesPayload.vehicles)
      ? vehiclesPayload.vehicles
      : [];

    if (vehicleIds.length === 0) {
      return;
    }

    dispatch(setVehicles(vehicleIds));

    const telemetryResponses = await Promise.all(
      vehicleIds.map(async (vehicleId) => {
        const telemetryResponse = await fetch(`/telemetry/${vehicleId}`);

        if (!telemetryResponse.ok) {
          return null;
        }

        const telemetryPayload = await telemetryResponse.json();
        return telemetryPayload.data || null;
      })
    );

    telemetryResponses
      .filter((telemetry) => telemetry)
      .forEach((telemetry) => dispatch(addTelemetryData(telemetry)));
  } catch (error) {
    console.error("Error fetching telemetry snapshot:", error);
  }
};

const WebSocketManager = () => {
  const dispatch = useDispatch();
  const realtimeEnabled = useSelector((state) => state.realtimeEnabled);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!realtimeEnabled) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      dispatch(setWebsocketStatus("disconnected"));
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;

    // Ensure dashboard has data even before websocket starts streaming.
    fetchTelemetrySnapshot(dispatch);

    dispatch(setWebsocketStatus("connecting"));

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      dispatch(setWebsocketStatus("connected"));
      fetchTelemetrySnapshot(dispatch);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "telemetry") {
          dispatch(addTelemetryData(message.data));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch(setWebsocketStatus("disconnected"));
      fetchTelemetrySnapshot(dispatch);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      dispatch(setWebsocketStatus("disconnected"));
    };

    const fallbackPoll = setInterval(() => {
      if (socket.readyState !== WebSocket.OPEN) {
        fetchTelemetrySnapshot(dispatch);
      }
    }, 5000);
    wsRef.current = socket;

    return () => {
      clearInterval(fallbackPoll);
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        socket.close();
      }
      if (wsRef.current === socket) {
        wsRef.current = null;
      }
    };
  }, [realtimeEnabled, dispatch]);

  return <Dashboard />;
};

export default WebSocketManager;
