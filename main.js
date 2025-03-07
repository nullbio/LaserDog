const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const Store = require("electron-store");

// Initialize the settings store
const store = new Store({
  name: "settings",
  defaults: {
    windowBounds: { width: 1200, height: 800 },
    sidebarPosition: "left",
    apiKeys: {},
    projects: [],
  },
});

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

function createWindow() {
  const { width, height } = store.get("windowBounds");

  // Create the browser window
  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets", "icon.png"),
    show: false, // Don't show until ready-to-show
    backgroundColor: "#f5f5f5",
  });

  // Check if build directory exists
  const indexPath = path.join(__dirname, "build", "index.html");
  const devIndexPath = path.join(__dirname, "public", "index.html");

  // Try to load the index.html file from build or fallback to public
  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
  } else if (fs.existsSync(devIndexPath)) {
    mainWindow.loadFile(devIndexPath);
  } else {
    // If neither exists, show an error
    mainWindow.loadURL(`data:text/html,
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Build Error</h1>
          <p>Could not find index.html file. Please run webpack to build the application.</p>
        </body>
      </html>
    `);
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Save window size when resized
  mainWindow.on("resize", () => {
    const { width, height } = mainWindow.getBounds();
    store.set("windowBounds", { width, height });
  });

  // Emitted when the window is closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Open DevTools in development mode
  if (process.argv.includes("--dev")) {
    mainWindow.webContents.openDevTools();
  }
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers for file operations
ipcMain.handle("get-projects", async () => {
  return store.get("projects");
});

ipcMain.handle("create-project", async (event, projectName) => {
  const projects = store.get("projects");
  const newProject = {
    id: Date.now().toString(),
    name: projectName,
    files: [
      {
        id: "todo-default",
        name: "Todo.md",
        type: "todo",
        content: "# Todo List\n\n- Your first task",
      },
    ],
  };

  projects.push(newProject);
  store.set("projects", projects);
  return newProject;
});

ipcMain.handle("get-project-files", async (event, projectId) => {
  const projects = store.get("projects");
  const project = projects.find((p) => p.id === projectId);
  return project ? project.files : [];
});

ipcMain.handle(
  "save-file-content",
  async (event, { projectId, fileId, content }) => {
    const projects = store.get("projects");
    const projectIndex = projects.findIndex((p) => p.id === projectId);

    if (projectIndex !== -1) {
      const fileIndex = projects[projectIndex].files.findIndex(
        (f) => f.id === fileId
      );
      if (fileIndex !== -1) {
        projects[projectIndex].files[fileIndex].content = content;
        store.set("projects", projects);
        return true;
      }
    }
    return false;
  }
);

ipcMain.handle(
  "create-file",
  async (event, { projectId, fileName, fileType }) => {
    const projects = store.get("projects");
    const projectIndex = projects.findIndex((p) => p.id === projectId);

    if (projectIndex !== -1) {
      const newFile = {
        id: Date.now().toString(),
        name: fileName,
        type: fileType || "note",
        content: `# ${fileName}\n\n`,
      };

      projects[projectIndex].files.push(newFile);
      store.set("projects", projects);
      return newFile;
    }
    return null;
  }
);

ipcMain.handle("delete-file", async (event, { projectId, fileId }) => {
  const projects = store.get("projects");
  const projectIndex = projects.findIndex((p) => p.id === projectId);

  if (projectIndex !== -1) {
    const fileIndex = projects[projectIndex].files.findIndex(
      (f) => f.id === fileId
    );
    if (fileIndex !== -1) {
      projects[projectIndex].files.splice(fileIndex, 1);
      store.set("projects", projects);
      return true;
    }
  }
  return false;
});

ipcMain.handle("update-settings", async (event, settings) => {
  for (const [key, value] of Object.entries(settings)) {
    store.set(key, value);
  }
  return true;
});

ipcMain.handle("get-settings", async () => {
  return {
    sidebarPosition: store.get("sidebarPosition"),
    apiKeys: store.get("apiKeys"),
  };
});
