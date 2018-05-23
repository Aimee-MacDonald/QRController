const electron = require("electron");
const ipc = electron.ipcRenderer;

function back(){
  ipc.send("testDatabase", "back");
}

document.addEventListener("click", () => {
  document.getElementById("scanner-input").focus();
});

document.getElementById("input-form").addEventListener("submit", (e) => {
  if(e.preventDefault) e.preventDefault();

  let scannedCode = document.getElementById("scanner-input").value;
  document.getElementById("scanner-input").value = "";

  ipc.send("testDatabase", scannedCode);

  return false;
});

ipc.on("scan-validated", function(event, args){
  document.getElementById("code-validation").value = "";

  for (var key in args) {
    document.getElementById("code-validation").value += "\n" + (key + ": " + args[key]);
  }
});
