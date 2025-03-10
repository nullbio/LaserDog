import React, { useEffect, useState } from "react";
import { useAppContext } from "./contexts/AppContext";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import FloatingToolbar from "./components/FloatingToolbar";
import SettingsPanel from "./components/SettingsPanel";
import { cn } from "./lib/utils";

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
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <div
        className={cn(
          "flex h-full w-full",
          sidebarPosition === "right" ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Sidebar />
        <MainContent />
      </div>

      <FloatingToolbar />
      <SettingsPanel />
    </div>
  );
}

export default App;
