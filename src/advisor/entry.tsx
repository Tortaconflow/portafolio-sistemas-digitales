import React from "react";
import { createRoot } from "react-dom/client";
import "../site-styles";
import "./advisor.css";
import { AdvisorExperience } from "./AdvisorExperience";
import { SiteErrorBoundary } from "../SiteErrorBoundary";

const root = document.getElementById("advisor-root");
if (root) createRoot(root).render(
  <React.StrictMode><SiteErrorBoundary><AdvisorExperience /></SiteErrorBoundary></React.StrictMode>,
);
