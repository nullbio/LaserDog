const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  // Project management
  getProjects: () => ipcRenderer.invoke("get-projects"),
  createProject: (projectName) =>
    ipcRenderer.invoke("create-project", projectName),

  // File operations
  getProjectFiles: (projectId) =>
    ipcRenderer.invoke("get-project-files", projectId),
  saveFileContent: (data) => ipcRenderer.invoke("save-file-content", data),
  createFile: (data) => ipcRenderer.invoke("create-file", data),
  deleteFile: (data) => ipcRenderer.invoke("delete-file", data),

  // Settings
  updateSettings: (settings) => ipcRenderer.invoke("update-settings", settings),
  getSettings: () => ipcRenderer.invoke("get-settings"),

  // Event listeners
  on: (channel, callback) => {
    // Whitelist channels
    const validChannels = ["file-updated", "settings-updated"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  // Remove event listeners
  removeListener: (channel, callback) => {
    const validChannels = ["file-updated", "settings-updated"];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    }
  },
});
