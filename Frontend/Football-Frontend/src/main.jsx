import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { MatchesProvider } from "./context/MatchesContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <MatchesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MatchesProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);

