const builder = require("electron-builder");
const path = require("path");

// Define build configuration
const config = {
  appId: "com.laserdog.app",
  productName: "LaserDog",
  directories: {
    output: path.join(__dirname, "dist"),
    app: __dirname,
  },
  files: ["build/**/*", "main.js", "preload.js", "node_modules/**/*"],
  win: {
    target: "nsis",
    icon: path.join(__dirname, "assets", "icon.ico"),
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
  },
};

// Build for Windows
builder
  .build({
    targets: builder.Platform.WINDOWS.createTarget(),
    config: config,
  })
  .then(() => {
    console.log("Build completed successfully!");
  })
  .catch((error) => {
    console.error("Error during build:", error);
  });
