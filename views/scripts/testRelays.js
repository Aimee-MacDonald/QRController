const electron = require("electron");
const ipc = electron.ipcRenderer;

let states = [false, false, false, false];

function back(){
  ipc.send("testRelays", "back");
}

function toggle(index){
  states[index] = !states[index];

  let package = {
    "index": index,
    "state": states[index]
  };

  if(states[index]){
    document.getElementById("label" + index).innerText = "On";
  } else {
    document.getElementById("label" + index).innerText = "Off";
  }

  ipc.send("testRelays", package);
}
