import React from "react";
import { createRoot } from "react-dom/client";
import "./site-styles";
import { App } from "./App";
import { SiteErrorBoundary } from "./SiteErrorBoundary";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SiteErrorBoundary>
      <App />
    </SiteErrorBoundary>
  </React.StrictMode>,
);
