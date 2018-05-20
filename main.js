const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require('path');
const url = require('url');

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.setMenu(null);
  //mainWindow.webContents.openDevTools();

  setWindow("start");

  mainWindow.on("closed", function(){
    mainWindow = null;
  });
});

app.on("window-all-closed", function(){
  app.quit();
});

ipc.on("start", (event, args) => {
  switch(args){
    case "configuration":
      setWindow("configuration");
      break;

    case "testing":
      setWindow("testing");
      break;

    case "start":
      setWindow("scanning");
      break;

    default:
      setWindow("start");
      break;
  }
});

ipc.on("configuration", (event, args) => {
  if(args === "back"){
    setWindow("start");
  }
});

ipc.on("testing", (event, args) => {
  if(args === "back"){
    setWindow("start");
  }
});

function setWindow(windowName){
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "views/" + windowName + ".html"),
    protocol: 'file:',
    slashes: true
  }));
}
