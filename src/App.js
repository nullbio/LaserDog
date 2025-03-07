import React, { useEffect, useState } from "react";
import { useAppContext } from "./contexts/AppContext";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import FloatingToolbar from "./components/FloatingToolbar";
import SettingsPanel from "./components/SettingsPanel";
import "./App.css";

function App() {
  const {
    currentProject,
    currentFile,
    sidebarPosition,
    setSidebarPosition,
    isSettingsPanelOpen,
    setIsSettingsPanelOpen,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings when app starts
    const loadSettings = async () => {
      try {
        const settings = await window.api.getSettings();
        setSidebarPosition(settings.sidebarPosition);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load settings:", error);
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [setSidebarPosition]);

  if (isLoading) {
    return <div className="loading">Loading LaserDog...</div>;
  }

  return (
    <div className="app">
      <div
        className={`app-container ${
          sidebarPosition === "right" ? "sidebar-right" : "sidebar-left"
        }`}
      >
        {sidebarPosition === "left" && <Sidebar />}
        <MainContent />
        {sidebarPosition === "right" && <Sidebar />}
      </div>

      <FloatingToolbar />

      {isSettingsPanelOpen && <SettingsPanel />}
    </div>
  );
}

export default App;
