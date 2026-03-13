// Redux Reducers for Vehicle Telemetry

import {
  TOGGLE_REALTIME,
  ADD_TELEMETRY_DATA,
  SET_WEBSOCKET_STATUS,
  CLEAR_TELEMETRY,
  SET_VEHICLES,
} from "./actions";

const initialState = {
  realtimeEnabled: true,
  websocketStatus: "disconnected", // disconnected, connecting, connected
  vehicles: {},
  telemetryHistory: {},
  maxHistoryPerVehicle: 50,
};

export const telemetryReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_REALTIME:
      return {
        ...state,
        realtimeEnabled: !state.realtimeEnabled,
      };

    case ADD_TELEMETRY_DATA: {
      const telemetry = action.payload;
      const vehicleId = telemetry.vehicle_id;
      
      const vehicleHistory = state.telemetryHistory[vehicleId] || [];
      const updatedHistory = [telemetry, ...vehicleHistory].slice(
        0,
        state.maxHistoryPerVehicle
      );

      return {
        ...state,
        vehicles: {
          ...state.vehicles,
          [vehicleId]: telemetry,
        },
        telemetryHistory: {
          ...state.telemetryHistory,
          [vehicleId]: updatedHistory,
        },
      };
    }

    case SET_WEBSOCKET_STATUS:
      return {
        ...state,
        websocketStatus: action.payload,
      };

    case CLEAR_TELEMETRY:
      return {
        ...state,
        vehicles: {},
        telemetryHistory: {},
      };

    case SET_VEHICLES:
      return {
        ...state,
        vehicles: action.payload.reduce((acc, vehicleId) => {
          acc[vehicleId] = acc[vehicleId] || null;
          return acc;
        }, state.vehicles),
      };

    default:
      return state;
  }
};
