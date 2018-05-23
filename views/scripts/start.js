const electron = require("electron");
const ipc = electron.ipcRenderer;

function configuration(){
  ipc.send("start", "configuration");
}

function testing(){
  ipc.send("start", "testing");
}

function start(){
  ipc.send("start", "start");
}
