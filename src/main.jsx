import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// React'in kök (root) kurulumu: index.html'deki <div id="root"> alınır,
// içine <App /> bileşeni basılır. Tüm uygulama App'ten dallanır.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
