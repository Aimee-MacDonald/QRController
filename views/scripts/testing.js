const electron = require("electron");
const ipc = electron.ipcRenderer;

function back(){
  ipc.send("testing", "back");
}

function scan(){
  ipc.send("testing", "scan");
}

function database(){
  ipc.send("testing", "database");
}

function relays(){
  ipc.send("testing", "relays");
}
