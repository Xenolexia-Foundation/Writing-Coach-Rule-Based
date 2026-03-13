const { app, BrowserWindow } = require("electron");
const path = require("path");

const useDevServer = !!process.env.ELECTRON_RENDERER_URL;
const rendererUrl = process.env.ELECTRON_RENDERER_URL || "http://localhost:5173";

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 500,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "Writing Coach",
    show: false,
  });

  win.once("ready-to-show", () => win.show());

  if (useDevServer) {
    win.loadURL(rendererUrl);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
