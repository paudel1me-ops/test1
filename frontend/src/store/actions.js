// Redux Actions for Vehicle Telemetry

export const TOGGLE_REALTIME = "TOGGLE_REALTIME";
export const ADD_TELEMETRY_DATA = "ADD_TELEMETRY_DATA";
export const UPDATE_VEHICLE_STATUS = "UPDATE_VEHICLE_STATUS";
export const SET_WEBSOCKET_STATUS = "SET_WEBSOCKET_STATUS";
export const CLEAR_TELEMETRY = "CLEAR_TELEMETRY";
export const SET_VEHICLES = "SET_VEHICLES";

export const toggleRealtime = () => ({
  type: TOGGLE_REALTIME,
});

export const addTelemetryData = (telemetry) => ({
  type: ADD_TELEMETRY_DATA,
  payload: telemetry,
});

export const setWebsocketStatus = (status) => ({
  type: SET_WEBSOCKET_STATUS,
  payload: status,
});

export const clearTelemetry = () => ({
  type: CLEAR_TELEMETRY,
});

export const setVehicles = (vehicles) => ({
  type: SET_VEHICLES,
  payload: vehicles,
});
