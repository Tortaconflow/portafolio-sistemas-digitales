import React from "react";
import { createRoot } from "react-dom/client";
import "./fonts.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./styles.css";
import "./premium.css";
import "./case-study.css";
import "./visual-system.css";
import "./paraiso-evidence.css";
import "./navigation.css";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
