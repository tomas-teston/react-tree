import "./index.css";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App defaultTreeNodes={[
      {
        id: 1,
        name: "test-1",
        downloaded: false,
        children: []
      },
      {
        id: 1000,
        name: "test-1000",
        downloaded: false,
        children: []
      }
    ]} />
  </React.StrictMode>
);
