import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./components/chat/styles/animations.css";
import "./components/chat/styles/chat-base.css";
import "./components/chat/styles/chat-variables.css";
import "./components/chat/styles/container.css";
import "./components/chat/styles/cyber-theme.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
