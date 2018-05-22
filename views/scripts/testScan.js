const electron = require("electron");
const ipc = electron.ipcRenderer;

function back(){
  ipc.send("testScan", "back");
}

document.addEventListener("click", () => {
  document.getElementById("scanner-input").focus();
})

document.getElementById("input-form").addEventListener("submit", (e) => {
  if(e.preventDefault) e.preventDefault();

  let scannedCode = document.getElementById("scanner-input").value;

  ipc.send("testScan", scannedCode);

  return false;
});

ipc.on("scan-success", function(event, args){
  document.getElementById("scanned-code").innerText = args;
});
