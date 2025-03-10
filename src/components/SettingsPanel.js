import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const SettingsPanel = () => {
  const {
    isSettingsPanelOpen,
    setIsSettingsPanelOpen,
    sidebarPosition,
    setSidebarPosition,
    apiKeys,
    updateSettings,
  } = useAppContext();

  const [localSidebarPosition, setLocalSidebarPosition] =
    useState(sidebarPosition);
  const [localApiKeys, setLocalApiKeys] = useState({ ...apiKeys });

  // Initialize local state from context
  useEffect(() => {
    setLocalSidebarPosition(sidebarPosition);
    setLocalApiKeys({ ...apiKeys });
  }, [sidebarPosition, apiKeys]);

  // Close the settings panel
  const closePanel = () => {
    setIsSettingsPanelOpen(false);
  };

  // Save settings
  const saveSettings = async () => {
    await updateSettings({
      sidebarPosition: localSidebarPosition,
      apiKeys: localApiKeys,
    });

    closePanel();
  };

  // Handle API key changes
  const handleApiKeyChange = (provider, value) => {
    setLocalApiKeys((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  return (
    <Dialog open={isSettingsPanelOpen} onOpenChange={setIsSettingsPanelOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
          <DialogDescription>
            Configure your LaserDog application preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Interface</h3>

            <div className="flex items-center justify-between">
              <span className="text-sm">Sidebar Position</span>
              <div className="flex items-center space-x-2">
                <label
                  className={cn(
                    "flex items-center cursor-pointer space-x-1 px-3 py-1 rounded-md",
                    localSidebarPosition === "left"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <input
                    type="radio"
                    name="sidebarPosition"
                    value="left"
                    checked={localSidebarPosition === "left"}
                    onChange={() => setLocalSidebarPosition("left")}
                    className="sr-only"
                  />
                  <span>Left</span>
                </label>

                <label
                  className={cn(
                    "flex items-center cursor-pointer space-x-1 px-3 py-1 rounded-md",
                    localSidebarPosition === "right"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <input
                    type="radio"
                    name="sidebarPosition"
                    value="right"
                    checked={localSidebarPosition === "right"}
                    onChange={() => setLocalSidebarPosition("right")}
                    className="sr-only"
                  />
                  <span>Right</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">AI Integration</h3>

            <div className="space-y-1">
              <label htmlFor="openai-key" className="text-sm">
                OpenAI API Key
              </label>
              <input
                id="openai-key"
                type="password"
                value={localApiKeys.openai || ""}
                onChange={(e) => handleApiKeyChange("openai", e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Required for AI-powered todo breakdown functionality.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closePanel}>
            Cancel
          </Button>
          <Button onClick={saveSettings}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
