import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import "./SettingsPanel.css";

const SettingsPanel = () => {
  const {
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
    <div className="settings-panel">
      <button className="close-button" onClick={closePanel}>
        ×
      </button>

      <h2>Settings</h2>

      <div className="settings-section">
        <h3>Interface</h3>

        <div className="setting-item">
          <label>Sidebar Position</label>
          <div className="setting-controls">
            <label className="radio-label">
              <input
                type="radio"
                name="sidebarPosition"
                value="left"
                checked={localSidebarPosition === "left"}
                onChange={() => setLocalSidebarPosition("left")}
              />
              Left
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="sidebarPosition"
                value="right"
                checked={localSidebarPosition === "right"}
                onChange={() => setLocalSidebarPosition("right")}
              />
              Right
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>AI Integration</h3>

        <div className="setting-item">
          <label>OpenAI API Key</label>
          <input
            type="password"
            value={localApiKeys.openai || ""}
            onChange={(e) => handleApiKeyChange("openai", e.target.value)}
            placeholder="sk-..."
          />
          <p className="setting-description">
            Required for AI-powered todo breakdown functionality.
          </p>
        </div>
      </div>

      <div className="settings-actions">
        <button className="cancel-button" onClick={closePanel}>
          Cancel
        </button>

        <button className="save-button" onClick={saveSettings}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
