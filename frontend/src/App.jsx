import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import WebSocketManager from "./components/WebSocketManager";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <WebSocketManager />
    </Provider>
  );
}

export default App;
