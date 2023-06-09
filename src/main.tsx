import "./index.css";

import App from "./App";
import { DATA } from "./constants/constants";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App defaultTreeNodes={DATA} />
  </React.StrictMode>
);
