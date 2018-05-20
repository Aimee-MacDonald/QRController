const electron = require("electron");
const ipc = electron.ipcRenderer;

function back(){
  ipc.send("testing", "back");
}
