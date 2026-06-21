const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let mainWindow;
let server;

function startServer() {
  return new Promise((resolve) => {
    delete require.cache[require.resolve("./server.js")];

    process.env.PORT = "3456";
    process.env.ELECTRON_MODE = "true";

    server = require("./server.js");
    setTimeout(resolve, 1500);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Robotics for Kids",
    icon: path.join(__dirname, "public", "favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL("http://localhost:3456");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
