// Redux Store Configuration

import { createStore } from "redux";
import { telemetryReducer } from "./reducers";

export const store = createStore(telemetryReducer);

export default store;
